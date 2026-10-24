#!/bin/sh
# Restore (or verify) a backup produced by backup.sh. Run this on a machine that has BOTH the age
# PRIVATE key (from your password manager) and psql - typically the backup VM or your laptop.
#
# The nightly job encrypts with the age PUBLIC key; only the matching PRIVATE key can decrypt, so
# this is the one place that key is needed. It never lives in the cluster.
#
# SAFETY: defaults to a DRY RUN that only decrypts and prints a preview. Loading into a database
# OVERWRITES that database's contents, so it requires an explicit --apply plus a target you name.
#
# Usage:
#   ./restore.sh <file.sql.gz.age> <age-identity-file>                      # dry run: preview only
#   ./restore.sh <file.sql.gz.age> <age-identity-file> --apply <psql-conn>  # actually load
#
#   <psql-conn> is anything psql accepts, e.g.
#     "postgresql://user:pass@localhost:5432/restore_scratch"
#   ALWAYS restore into a SCRATCH database first to prove the backup, never straight over prod.
set -eu

FILE="${1:?path to the .sql.gz.age file}"
IDENTITY="${2:?path to the age identity (private key) file}"
MODE="${3:-}"
TARGET="${4:-}"

if [ ! -f "$FILE" ]; then echo "no such file: $FILE" >&2; exit 1; fi
if [ ! -f "$IDENTITY" ]; then echo "no such identity: $IDENTITY" >&2; exit 1; fi

decrypt() { age -d -i "$IDENTITY" "$FILE" | gunzip; }

if [ "$MODE" = "--apply" ]; then
  [ -n "$TARGET" ] || { echo "--apply needs a psql connection string" >&2; exit 1; }
  echo "[restore] APPLYING $FILE -> $TARGET"
  echo "[restore] this OVERWRITES that database. Ctrl-C now if that is not a scratch DB."
  sleep 5
  decrypt | psql "$TARGET"
  echo "[restore] done. Sanity-check row counts, e.g.:"
  echo "  psql \"$TARGET\" -c \"select count(*) from <your_table>;\""
else
  echo "[restore] DRY RUN (no database touched). Decrypting and previewing $FILE ..."
  decrypt | head -c 4000
  echo ""
  echo "[restore] preview ok. To actually load into a SCRATCH db:"
  echo "  $0 \"$FILE\" \"$IDENTITY\" --apply \"postgresql://user:pass@host:5432/restore_scratch\""
fi
