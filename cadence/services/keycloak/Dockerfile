# Cadence Keycloak image, with the login/email theme built from source on every image build.
#
# Build context is services/keycloak/:
#   docker build -t localhost/company/keycloak:latest services/keycloak
#
# Stage 1 (theme) builds the Keycloakify theme in theme-generator/ into a provider JAR.
# Stage 2 (builder) drops that JAR into Keycloak and pre-runs `kc.sh build`, per the Keycloak docs'
# optimized-image pattern, so pods skip the augmentation step at startup.
# Stage 3 is the runtime image.
#
# The theme is part of the image, not configuration: there is no checked-in theme.jar to rebuild
# by hand. Whatever is in theme-generator/ at build time is what ships.
ARG KC_VERSION=26.5.6

# ── 1. Theme JAR ──────────────────────────────────────────────────────────────────────────────
# Needs Node (Keycloakify shells out to `npx vite`), Bun (the project's package manager, matching
# bun.lock) and a JDK + Maven (Keycloakify packages the theme JAR with Maven).
# Docker Hub via Google's mirror to avoid CI pull rate limits.
FROM mirror.gcr.io/library/node:22-bookworm-slim AS theme
RUN apt-get update \
 && apt-get install -y --no-install-recommends default-jdk-headless maven \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g bun@1.3.14
WORKDIR /theme
# Dependencies first so they cache across source-only changes. --ignore-scripts skips the
# postinstall `keycloakify sync-extensions`, which needs src/ present; it runs after the COPY.
COPY theme-generator/package.json theme-generator/bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY theme-generator/ ./
RUN npx keycloakify sync-extensions \
 && bun run build \
 && npx keycloakify build

# ── 2. Keycloak build ─────────────────────────────────────────────────────────────────────────
FROM quay.io/keycloak/keycloak:${KC_VERSION} AS builder
# Keycloak 26 uses the "all-other-versions" JAR (the other one targets Keycloak 22-25).
COPY --from=theme /theme/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/cadence-theme.jar
RUN /opt/keycloak/bin/kc.sh build

# ── 3. Runtime ────────────────────────────────────────────────────────────────────────────────
FROM quay.io/keycloak/keycloak:${KC_VERSION}
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
