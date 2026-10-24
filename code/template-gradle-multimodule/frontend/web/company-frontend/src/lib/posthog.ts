import posthog from "posthog-js";

/**
 * PostHog product analytics (funnels + session replay). Set up manually (not via the wizard, which
 * is npm-based and interactive) so it fits this bun/Vite/OIDC stack.
 *
 * Design decisions:
 *  - KEY-DRIVEN NO-OP: without VITE_POSTHOG_KEY (local dev, or before you create a project) every
 *    function here silently does nothing, so analytics never breaks a build or dev session.
 *  - US region by default. Override VITE_POSTHOG_HOST for EU / self-host.
 *  - IDENTIFY BY OIDC SUBJECT, never email: identifyUser takes the stable opaque `sub`, so PostHog
 *    never stores a user's email as their id.
 *  - Session replay MASKS INPUTS: what users type (email in the account form, etc.) is never
 *    recorded; the surrounding UI stays visible so replays are actually watchable.
 */

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com";

let enabled = false;

export function initPostHog() {
  if (!KEY) {
    return; // no key -> silent no-op (dev / not configured)
  }
  posthog.init(KEY, {
    api_host: HOST,
    // Autocapture clicks/pageviews so most funnels work without hand-instrumenting every element.
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    // Only build person profiles for identified (logged-in) users - less noise, lower cost.
    person_profiles: "identified_only",
    session_recording: {
      // Mask everything typed (answers, emails). UI text/labels stay visible so replays are useful.
      maskAllInputs: true,
    },
  });
  enabled = true;
}

/** Tie subsequent events to the logged-in learner by their OIDC subject (opaque id, never email). */
export function identifyUser(sub: string | undefined | null) {
  if (!enabled || !sub) return;
  posthog.identify(sub);
}

/** Clear identity on sign-out so a shared browser never attributes the next person's events. */
export function resetPostHog() {
  if (!enabled) return;
  posthog.reset();
}

/**
 * Named product event (funnel step or demand signal). Autocapture already covers generic clicks and
 * pageviews; use this only for the SEMANTIC moments worth naming (e.g. a signup, a checkout start,
 * first session). No-op without a key.
 */
export function track(event: string, props?: Record<string, unknown>) {
  if (!enabled) return;
  posthog.capture(event, props);
}
