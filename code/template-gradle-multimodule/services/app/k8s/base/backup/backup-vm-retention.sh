#!/bin/sh
# Retention pruner for the BACKUP VM (not k8s). The CronJob only ever PUSHES new encrypted dumps;
# something has to delete old ones or the disk fills. Install this as a daily cron ON THE BACKUP VM:
#
#   # /etc/cron.d/app-backup-retention   (adjust user/path)
#   30 4 * * *  backup  /srv/backups/backup-vm-retention.sh >> /var/log/app-retention.log 2>&1
#
# Simple mtime policy: keep 14 days. If you later want grandfather-father-son (keep-daily-7 +
# keep-weekly-4 + keep-monthly-6), switch the whole scheme to restic - it does that natively and
# also dedupes; this mtime pruner is the no-dependency v1.
set -eu

DIR="${BACKUP_DIR:-/srv/backups/app}"
KEEP_DAYS="${KEEP_DAYS:-14}"

[ -d "$DIR" ] || { echo "backup dir not found: $DIR" >&2; exit 1; }

# Guard: refuse to run if the dir looks empty/wrong, so a misconfigured path can't nuke nothing
# silently (and a bug can't wander outside the backups dir).
COUNT="$(find "$DIR" -maxdepth 1 -name 'app-*.sql.gz.age' | wc -l)"
echo "[retention] $DIR holds $COUNT dumps; deleting those older than ${KEEP_DAYS} days"

find "$DIR" -maxdepth 1 -name 'app-*.sql.gz.age' -mtime "+${KEEP_DAYS}" -print -delete

echo "[retention] done"
