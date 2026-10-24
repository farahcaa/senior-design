#!/usr/bin/env bash
# Local dev loop: build images straight into minikube's docker daemon, then apply
# the dev overlays. No registry involved.
#
# Usage: scripts/dev.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

command -v minikube >/dev/null || { echo "minikube is required"; exit 1; }
minikube status >/dev/null 2>&1 || minikube start

# Build inside minikube's docker so no image loading step is needed.
eval "$(minikube docker-env)"

./gradlew :services:app:jibDockerBuild \
  -Djib.to.image=localhost/company/app:latest \
  -Djib.from.platforms=linux/$(docker version --format '{{.Server.Arch}}')

docker build -t localhost/company/keycloak:latest services/keycloak/theme-image

# Gateway first: the Traefik chart brings the IngressRoute/Middleware CRDs the
# service overlays depend on. Same chart pin as scripts/render-manifests.sh.
command -v helm >/dev/null || { echo "helm is required"; exit 1; }
helm upgrade --install gateway traefik \
  --repo https://traefik.github.io/charts \
  --version 39.0.6 \
  -f services/gateway/k8s/base/values.yaml \
  -f services/gateway/k8s/overlays/dev/values.yaml \
  --wait

# Root k8s/ (Vault ClusterSecretStore) is staging/prod-only and needs the
# external-secrets operator; dev uses the plain secret manifests in the overlays.
kubectl apply -k services/keycloak/k8s/overlays/dev
kubectl apply -k services/app/k8s/overlays/dev

echo "dev stack applied — 'kubectl get pods' to watch it come up"
