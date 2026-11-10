#!/bin/bash
set -e

# Import realm — idempotent, --override false skips if realm already exists in DB.
# The database is the source of truth, no PVC marker file needed.
#
# NOTE: --override false means edits to realm.json are NOT applied to a realm
# that already exists. A handful of mutable settings (remember-me session
# timeouts, disabling the account/account-console clients) are therefore
# reconciled idempotently via kcadm after Keycloak comes up, see below.
echo "Running realm import (will be a no-op if realm already exists)..."
/opt/keycloak/bin/kc.sh import --file /opt/keycloak/realms/realm.json --override false || \
    echo "Realm import returned non-zero (likely already present); continuing."

# Reconcile a few mutable realm/client settings after Keycloak is ready.
# Runs in the background so it doesn't block startup, and every step tolerates
# failure so a kcadm hiccup never crashes the pod.
reconcile_realm() {
    echo "Waiting for Keycloak to become ready before reconciling realm settings..."
    local kcadm=/opt/keycloak/bin/kcadm.sh
    # The Keycloak image ships no curl, so "ready" = the admin login succeeds. Up to ~5 min.
    local ready=0
    for i in $(seq 1 60); do
        if "$kcadm" config credentials --server http://localhost:8080 \
            --realm master \
            --user "$KC_BOOTSTRAP_ADMIN_USERNAME" \
            --password "$KC_BOOTSTRAP_ADMIN_PASSWORD" >/dev/null 2>&1; then
            ready=1
            echo "Keycloak ready; reconciling realm settings via kcadm."
            break
        fi
        sleep 5
    done
    [ "$ready" = 1 ] || { echo "WARNING: kcadm credential login failed; skipping realm reconcile."; return; }

    "$kcadm" update realms/app \
        -s ssoSessionIdleTimeoutRememberMe=2592000 \
        -s ssoSessionMaxLifespanRememberMe=5184000 \
        -s rememberMe=true \
        || echo "WARNING: failed to update realm remember-me settings."

    # No email verification: the app doesn't implement it. Keep it off on the live realm too
    # (realm.json only applies on first import), including the assignable VERIFY_EMAIL action.
    "$kcadm" update realms/app -s verifyEmail=false \
        || echo "WARNING: failed to disable verifyEmail."
    "$kcadm" update authentication/required-actions/VERIFY_EMAIL -r app \
        -s enabled=false -s defaultAction=false \
        || echo "WARNING: failed to disable the VERIFY_EMAIL required action."

    # Themes are also mutable-after-import (see --override false note above): keep the live
    # realm on the branded login + email theme even though realm.json edits don't re-apply.
    "$kcadm" update realms/app \
        -s loginTheme=cadence \
        -s emailTheme=cadence \
        -s displayName=Cadence \
        || echo "WARNING: failed to update realm themes."

    for client in account account-console; do
        uuid=$("$kcadm" get clients -r app -q clientId="$client" --fields id --format csv --noquotes 2>/dev/null | head -n1)
        if [ -n "$uuid" ]; then
            "$kcadm" update "clients/$uuid" -r app -s enabled=false \
                || echo "WARNING: failed to disable client $client."
        else
            echo "WARNING: could not resolve UUID for client $client; skipping."
        fi
    done

    # The app backend edits user identity (name/email) via the Admin REST API,
    # authenticating as app-backend with client_credentials. That needs the client's service
    # account enabled AND granted realm-management manage-users. Mutable-after-import settings,
    # reconciled here like the rest (all steps tolerate failure and re-running).
    backend_uuid=$("$kcadm" get clients -r app -q clientId=app-backend --fields id --format csv --noquotes 2>/dev/null | head -n1)
    if [ -n "$backend_uuid" ]; then
        "$kcadm" update "clients/$backend_uuid" -r app -s serviceAccountsEnabled=true \
            || echo "WARNING: failed to enable service account on app-backend."
        "$kcadm" add-roles -r app \
            --uusername service-account-app-backend \
            --cclientid realm-management --rolename manage-users \
            || echo "WARNING: failed to grant manage-users to app-backend service account."
    else
        echo "WARNING: could not resolve UUID for client app-backend; skipping admin-API grant."
    fi

    echo "Realm reconcile complete."
}

# Start Keycloak (Production Mode)
/opt/keycloak/bin/kc.sh start "$@" &
KC_PID=$!

# Forward SIGTERM/SIGINT to Keycloak so the pod shuts down cleanly.
trap 'kill -TERM "$KC_PID" 2>/dev/null' TERM INT

reconcile_realm &

# Keep the container alive on the Keycloak process.
wait "$KC_PID"
