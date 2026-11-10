#!/usr/bin/env bash
# Wipe the default namespace of THIS project's minikube profile only (see scripts/env.sh).
set -euo pipefail
source "$(cd "$(dirname "$0")/.." && pwd)/env.sh"

kc delete all --all
