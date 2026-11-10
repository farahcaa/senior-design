#!/usr/bin/env bash
# Local dev loop: build images straight into minikube's docker daemon, then apply
# the dev overlays. No registry involved.
#
# Everything runs against the dedicated minikube profile from scripts/env.sh
# (default: "cadence"), never whatever kube-context happens to be active.
#
# Usage: scripts/dev.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/env.sh"

command -v minikube >/dev/null || { echo "minikube is required"; exit 1; }
# --keep-context: don't hijack ~/.kube/config's current-context from other projects.
mk status >/dev/null 2>&1 || mk start --keep-context --cpus=4 --memory=8g
echo "using minikube profile '$MINIKUBE_PROFILE' (kube-context '$KUBE_CONTEXT')"

# Build inside this profile's docker so no image loading step is needed.
eval "$(mk docker-env)"

./gradlew :services:app:jibDockerBuild \
  -Djib.to.image=localhost/company/app:latest \
  -Djib.from.platforms=linux/$(docker version --format '{{.Server.Arch}}')

# Keycloak image: the Dockerfile builds the Keycloakify login theme in services/keycloak/theme-generator
# into a provider JAR and bakes it in, so the image always carries the current theme.
docker build -t localhost/company/keycloak:latest services/keycloak

# Gateway first: the Traefik chart brings the IngressRoute/Middleware CRDs the
# service overlays depend on. Same chart pin as scripts/render-manifests.sh.
command -v helm >/dev/null || { echo "helm is required"; exit 1; }
hm upgrade --install gateway traefik \
  --repo https://traefik.github.io/charts \
  --version 39.0.6 \
  -f services/gateway/k8s/base/values.yaml \
  -f services/gateway/k8s/overlays/dev/values.yaml \
  --wait

# Root k8s/ (Vault ClusterSecretStore) is staging/prod-only and needs the
# external-secrets operator; dev uses the plain secret manifests in the overlays.
kc apply -k services/keycloak/k8s/overlays/dev
kc apply -k services/app/k8s/overlays/dev

echo "dev stack applied — 'kubectl --context $KUBE_CONTEXT get pods' to watch it come up"
