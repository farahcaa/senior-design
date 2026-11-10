#!/usr/bin/env bash
# Manual deploy of the frontend to the company-frontend-staging Cloudflare Pages project.
#
# Auth — pick ONE:
#   a) interactive:   wrangler login        (opens a browser, one-time)
#   b) non-interactive: export CLOUDFLARE_API_TOKEN=...  and  CLOUDFLARE_ACCOUNT_ID=...
#      (token needs Account · Cloudflare Pages · Edit)
#
# Run from anywhere:  ./frontend/web/company-frontend/deploy-staging.sh
set -euo pipefail
cd "$(dirname "$0")"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "ℹ️  CLOUDFLARE_API_TOKEN not set — relying on 'wrangler login' session."
  echo "    (or: export CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=...)"
fi

echo "📦 Building staging bundle (vite --mode staging)..."
bun install --frozen-lockfile
bun run build:staging

echo "🚀 Deploying to Cloudflare Pages: company-frontend-staging (branch: staging)..."
bunx wrangler pages deploy --project-name=company-frontend-staging --branch=staging

echo "✅ Done."
