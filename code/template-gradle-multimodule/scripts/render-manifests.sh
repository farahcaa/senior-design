#!/usr/bin/env bash
# Render every service's manifests for one environment into rendered/<env>/.
# CI publishes that directory as an OCI artifact (flux push artifact) with the
# same tag as the images, so the cluster repo keeps pinning a single release tag.
#
# Usage: scripts/render-manifests.sh <dev|staging|prod> <image-tag> [registry]
set -euo pipefail

ENV="${1:?usage: render-manifests.sh <env> <image-tag> [registry]}"
TAG="${2:?usage: render-manifests.sh <env> <image-tag> [registry]}"
REGISTRY="${3:-ghcr.io/company}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/rendered/$ENV"
TRAEFIK_CHART_VERSION="39.0.6"

rm -rf "$OUT" && mkdir -p "$OUT"

for svc in app keycloak; do
  overlay="$ROOT/services/$svc/k8s/overlays/$ENV"
  [ -d "$overlay" ] || continue
  # Retag images inside a scratch copy so the checked-in overlays are never dirtied.
  tmp="$(mktemp -d)"
  cp -r "$ROOT/services/$svc/k8s" "$tmp/k8s"
  (
    cd "$tmp/k8s/overlays/$ENV"
    kustomize edit set image \
      "localhost/company/$svc=$REGISTRY/$svc:$TAG" \
      "ghcr.io/company/$svc=$REGISTRY/$svc:$TAG" 2>/dev/null || true
    kustomize build . > "$OUT/$svc.yaml"
  )
  rm -rf "$tmp"
done

# Gateway: plain helm template over base+overlay values.
if [ -d "$ROOT/services/gateway/k8s/overlays/$ENV" ]; then
  helm template gateway traefik \
    --repo https://traefik.github.io/charts \
    --version "$TRAEFIK_CHART_VERSION" \
    -f "$ROOT/services/gateway/k8s/base/values.yaml" \
    -f "$ROOT/services/gateway/k8s/overlays/$ENV/values.yaml" \
    > "$OUT/gateway.yaml"
fi

# Cluster-scoped bits (external-secrets store).
kustomize build "$ROOT/k8s" > "$OUT/cluster.yaml"

echo "rendered manifests for $ENV -> $OUT"
