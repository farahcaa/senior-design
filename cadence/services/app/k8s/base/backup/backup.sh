#!/bin/sh
# Nightly Postgres backup, run as an ephemeral CronJob pod IN-CLUSTER.
#
# Why in-cluster: Postgres is a ClusterIP service, unreachable from outside the cluster, so the
# backup VM cannot "pull" it. Instead this pod dumps the DB from inside and STREAMS the result
# straight out to the backup VM - nothing is ever written to the pod's disk (which vanishes when
# the Job finishes anyway).
#
# Pipeline: pg_dump -> gzip -> age-encrypt -> ssh to the backup VM -> ping healthchecks.io.
# set -euo pipefail is load-bearing: without pipefail a failed pg_dump could still let the later
# stages "succeed" and write a truncated file AND ping the healthcheck, hiding a broken backup.
set -euo pipefail

TS="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="app-${BACKUP_ENV}-${TS}.sql.gz.age"

echo "[backup] ${BACKUP_ENV}: ${PGHOST}/${PGDATABASE} -> ${BACKUP_SSH_USER}@${BACKUP_SSH_HOST}:${BACKUP_DEST}/${FILE}"

# Creds come from env: PGHOST/PGPORT/PGDATABASE are plain values (in-cluster service, same in every
# env); DB_USERNAME/DB_PASSWORD are injected from the app's db-secret (Vault via ESO). We encrypt to
# the age RECIPIENT (public key) - the matching PRIVATE key exists ONLY in your password manager, so
# even a compromised backup VM cannot read the dumps. The ssh key is mounted read-only at /keys.
PGPASSWORD="${DB_PASSWORD}" pg_dump \
    -h "${PGHOST}" -p "${PGPORT}" -U "${DB_USERNAME}" -d "${PGDATABASE}" \
    --no-owner --no-privileges \
  | gzip -9 \
  | age -r "${AGE_RECIPIENT}" \
  | ssh -i /keys/ssh-key \
        -o StrictHostKeyChecking=accept-new \
        -o BatchMode=yes \
        "${BACKUP_SSH_USER}@${BACKUP_SSH_HOST}" \
        "cat > '${BACKUP_DEST}/${FILE}'"

echo "[backup] transfer complete, pinging dead-man switch"
# Reached ONLY if every stage above succeeded (set -e). A failed run never pings, so healthchecks.io
# raises the alarm within its grace window. A failed ping alone (network blip) must NOT fail the job
# - the backup itself already landed - so this is tolerant.
curl -fsS --retry 3 --max-time 30 "${HEALTHCHECK_URL}" \
  || echo "[backup] WARNING: healthcheck ping failed, but the backup itself succeeded"

echo "[backup] done"
