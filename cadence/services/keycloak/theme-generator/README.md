# Cadence Keycloak theme

Keycloakify login + email theme for Cadence (dark purple-grey, violet accent). It is built into
the Keycloak image by `../Dockerfile`; nothing here is deployed by hand.

```bash
bun install
bun run storybook   # preview login pages at http://localhost:6006
```

Brand tokens live in `src/login/index.css`; copy lives in `src/login/i18n.ts`; the desktop side
panel is `src/login/components/Template/LoginSidepanel.tsx`. The realm must use login/email theme
`cadence` (set in `../k8s/overlays/*/realm.json` and re-applied on boot by `start-keycloak.sh`).
