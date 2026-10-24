# App-branded Keycloak image. Two stages per the Keycloak docs' optimized-image
# pattern: bake the theme provider in and pre-run `kc.sh build` so pods skip the
# augmentation step at startup.
ARG KC_VERSION=26.5.6

FROM quay.io/keycloak/keycloak:26.5.6 AS builder
COPY theme.jar /opt/keycloak/providers/theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.5.6
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
