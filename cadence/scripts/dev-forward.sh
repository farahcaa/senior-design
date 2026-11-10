#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────────────────────────
# dev-forward.sh - one command to bring up the whole local dev loop:
#
#   1. kubectl port-forwards (each in a self-restarting loop, because port-forwards silently die
#      whenever the target pod restarts). All HTTP goes through the gateway and is routed by
#      hostname (*.localhost resolves to 127.0.0.1 in browsers):
#        gateway            localhost:8080  -> svc/gateway 80
#                             http://api.localhost:8080       -> app
#                             http://keycloak.localhost:8080  -> keycloak
#        postgres           localhost:5432  -> svc/app-postgres-service 5432
#   2. the frontend dev server (bun run dev in frontend/web/company-frontend)
#
# Everything runs in the background; this script waits in the foreground so Ctrl-C tears it all
# down via the trap below.
#
# Usage:   ./scripts/dev-forward.sh
# Stop:    Ctrl-C (kills every forward + the frontend)
# Logs:    background tasks log to /tmp/app-dev/<name>.log (tail -f them for debugging)
# ─────────────────────────────────────────────────────────────────────────────────────────────────
set -u

# Pin every port-forward to this project's minikube profile (scripts/env.sh), never the active context.
source "$(cd "$(dirname "$0")" && pwd)/env.sh"

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
forward_loop gateway      "kubectl --context $KUBE_CONTEXT port-forward svc/gateway 8080:80 --address 0.0.0.0"
forward_loop postgres     "kubectl --context $KUBE_CONTEXT port-forward svc/app-postgres-service 5432:5432 --address 0.0.0.0"

# ── 2. Frontend dev server ───────────────────────────────────────────────────────────────────────
# No restart loop: if the dev server crashes it is usually a code error you want to SEE, not paper
# over with a silent restart. Check its log.
setsid bash -c 'cd "$1" && bun run dev' _ "$(dirname "$0")/../frontend/web/company-frontend" >> "$LOG_DIR/frontend.log" 2>&1 &
PIDS+=("$!")
echo "[dev-forward] frontend (bun run dev) -> $LOG_DIR/frontend.log"

echo "[dev-forward] up: frontend http://localhost:5173  api http://api.localhost:8080  keycloak http://keycloak.localhost:8080  postgres :5432 (Ctrl-C stops everything)"
wait
