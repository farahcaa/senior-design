#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────────────────────────
# dev-forward.sh - one command to bring up the whole local dev loop:
#
#   1. kubectl port-forwards (each in a self-restarting loop, because port-forwards silently die
#      whenever the target pod restarts):
#        app API            localhost:8079  -> svc/app-service 8080
#        gateway            localhost:80    -> svc/gateway 8080
#        postgres           localhost:5432  -> svc/app-postgres-service 5432
#   2. the frontend dev server (bun run dev in frontend/web/company-frontend)
#   3. stripe listen in the FOREGROUND, forwarding webhooks to the local API - foreground so the
#      whsec_... signing secret it prints stays visible, and so Ctrl-C lands here and tears
#      everything down via the trap below.
#
# Usage:   ./scripts/dev-forward.sh
# Stop:    Ctrl-C (kills every forward + the frontend)
# Logs:    background tasks log to /tmp/app-dev/<name>.log (tail -f them for debugging)
#
# NOTE on port 80: binding a port below 1024 needs root on Linux. If the gateway forward loops
# with "permission denied" in its log, either run this script with sudo -E, or grant kubectl the
# capability once:  sudo setcap 'cap_net_bind_service=+ep' "$(readlink -f "$(command -v kubectl)")"
# ─────────────────────────────────────────────────────────────────────────────────────────────────
set -u

LOG_DIR=/tmp/app-dev
mkdir -p "$LOG_DIR"

PIDS=()

cleanup() {
    echo ""
    echo "[dev-forward] shutting down..."
    # Kill the whole process tree of each background task (the loops spawn kubectl/bun children).
    for pid in "${PIDS[@]}"; do
        kill -- -"$pid" 2>/dev/null || kill "$pid" 2>/dev/null
    done
    wait 2>/dev/null
    echo "[dev-forward] done."
}
trap cleanup EXIT INT TERM

# Run a command in a self-restarting loop, in its own process group so cleanup can kill the tree.
# Port-forwards exit whenever their pod restarts or the connection hiccups; 2s backoff, forever.
forward_loop() {
    local name="$1"; shift
    setsid bash -c '
        while true; do
            echo "[$(date +%H:%M:%S)] starting: '"$*"'"
            '"$*"'
            echo "[$(date +%H:%M:%S)] exited (rc=$?), restarting in 2s..."
            sleep 2
        done
    ' >> "$LOG_DIR/$name.log" 2>&1 &
    PIDS+=("$!")
    echo "[dev-forward] $name -> $LOG_DIR/$name.log"
}

# ── 1. Port-forwards ─────────────────────────────────────────────────────────────────────────────
forward_loop app "kubectl port-forward svc/app-service 8079:8080 --address 0.0.0.0"
forward_loop gateway      "kubectl port-forward svc/gateway 8080:80 --address 0.0.0.0"
forward_loop postgres     "kubectl port-forward svc/app-postgres-service 5432:5432 --address 0.0.0.0"

# ── 2. Frontend dev server ───────────────────────────────────────────────────────────────────────
# No restart loop: if the dev server crashes it is usually a code error you want to SEE, not paper
# over with a silent restart. Check its log.
setsid bash -c 'cd "$1" && bun run dev' _ "$(dirname "$0")/../frontend/web/company-frontend" >> "$LOG_DIR/frontend.log" 2>&1 &
PIDS+=("$!")
echo "[dev-forward] frontend (bun run dev) -> $LOG_DIR/frontend.log"

# Give the forwards a beat so stripe's first webhook doesn't race the API forward coming up.
sleep 2

# ── 3. Stripe webhooks (foreground - shows the whsec_ signing secret; Ctrl-C here stops it all) ──
echo "[dev-forward] starting stripe listen (Ctrl-C stops everything)"
stripe listen --forward-to localhost:8079/api/stripe/webhook
