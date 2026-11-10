#!/usr/bin/env bash
# Shared, sourced by the other dev scripts. Pins every minikube / kubectl / helm call to this
# project's own minikube profile so we never touch another project's cluster, and never change
# the machine's global "current-context" in ~/.kube/config.
#
# Override with:  MINIKUBE_PROFILE=something scripts/dev.sh

MINIKUBE_PROFILE="${MINIKUBE_PROFILE:-cadence}"
# minikube names the kube-context after the profile.
KUBE_CONTEXT="$MINIKUBE_PROFILE"

mk()   { minikube -p "$MINIKUBE_PROFILE" "$@"; }
kc()   { kubectl --context "$KUBE_CONTEXT" "$@"; }
hm()   { helm --kube-context "$KUBE_CONTEXT" "$@"; }
