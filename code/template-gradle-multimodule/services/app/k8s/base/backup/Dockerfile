# Tiny image for the nightly Postgres backup CronJob.
#
# Base MUST match your Postgres server MAJOR version - a pg_dump older than the server produces a
# silently-unusable dump. Bump this tag whenever you bump the postgres deployment image.
FROM postgres:18-alpine

# age  = streaming encryption (dumps carry user PII; German users -> encrypt at rest).
# openssh-client = ssh/scp the encrypted stream to the backup VM over Tailscale/LAN.
# curl = ping the healthchecks.io dead-man switch on success.
# (gzip is already provided by busybox in the base image.) If "age" is not found, your Alpine base
# needs the community repo enabled - it is on by default in recent postgres:*-alpine tags.
RUN apk add --no-cache age openssh-client curl

# The script itself is mounted from a ConfigMap at /scripts/backup.sh (so it can be edited without
# rebuilding this image); the CronJob's command runs it.
