# Cadence

Macro tracking for life on the go: find meals nearby that fit what's left of your calories, protein, carbs and fat, and plan meals for trips. Spring Boot backend, Postgres, Keycloak, and a React frontend.

Local dev runs on its own minikube profile (`cadence`):

```bash
./scripts/dev.sh          # start the cluster, build images, deploy
./scripts/dev-forward.sh  # port-forwards + frontend at http://localhost:5173
```
