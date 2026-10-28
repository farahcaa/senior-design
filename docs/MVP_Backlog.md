# MVP Backlog: Calorie and Macro Meal Finder

**Product goal:** a short calorie-based search with optional protein priority and clear macro information, followed by optional advanced preferences.

**Milestones:** M1 proves the calorie-only flow; M2 adds macro data/display and protein-focused ranking; M3 adds advanced and saved preferences. Existing tasks below remain the baseline backlog, not completed-work evidence. Grocery timing, guest search, and public deployment will be agreed in the advisor meeting. See `Product_Scope_Update.md`.

**M1 demo path:** S-01–S-03, F-01–F-04 establish the existing authenticated restaurant-search flow. S-04 supports development. F-05–F-08 and S-05 retain their existing scope but their milestone dates need agreement. The earlier suggested order below describes the baseline dependencies; M2 adds F-09 and F-10 once restaurant search works.

The backlog has two kinds of issues:
- **Setup (S-xx):** the groundwork every feature needs. Do these first. They are small and mostly independent, so all three of us can take one at once.
- **Features (F-xx):** user-facing slices written as user stories. Whoever takes one builds it end to end: database, API, and UI.

Sizes: **S** ≈ one sitting, **M** ≈ a few days, **L** ≈ a week. Story and design references (US-xx, AC-xx, I#, C#) point to `User_Stories.md` and `Design_Diagrams/D0_High_Level_Design.md`.

## Suggested Order

| Phase | Issues | Can run in parallel? |
|---|---|---|
| 1. Foundation | S-01 → then S-02, S-03, S-04 | S-02, S-03, S-04 in parallel once S-01 is merged |
| 2. Core features | F-01, F-02, F-03 | Yes, once phase 1 is done |
| 3. Complete MVP | F-04, F-05, F-06, F-07, S-05 | Yes |
| Post-MVP | F-08 | — |

---

## Setup

### S-01: Project skeleton and local Docker Compose
**Size:** M · **Labels:** `setup` · **Depends on:** —

Set up the repo structure and a `docker-compose.yml` that starts every container locally with one command.

- [ ] Folders: `frontend/` (Next.js + TypeScript), `backend/` (Spring Boot, Java 21), `infra/` (Compose and config files)
- [ ] `docker compose up` starts Postgres, Keycloak, the backend, and the frontend
- [ ] Backend `GET /api/v1/health` returns `200 {"status":"UP"}`, and the frontend shows a placeholder home page that calls it
- [ ] `.env.example` lists every required variable; real secrets are git-ignored
- [ ] README section: how to run locally

### S-02: Database schema v1
**Size:** M · **Labels:** `setup`, `database` · **Depends on:** S-01

Define the first version of the schema as versioned migrations that run automatically on backend startup.

- [ ] Tables: `restaurant`, `food_item` (name, calories int ≥ 0, serving_size, type `FAST_FOOD`\|`GROCERY`, source, restaurant_id nullable), `meal`, `meal_item` (meal ↔ food_item), `user_profile` (keycloak_user_id uuid, default_target_calories), `import_log`
- [ ] `meal.total_calories` is stored, and the migration documents that it must equal the sum of its items
- [ ] Constraints: calories ≥ 0, foreign keys, unique (restaurant_id, food name)
- [ ] An index that supports "meals with total_calories ≤ X ordered by total_calories desc"
- [ ] An ER diagram (image or Mermaid) committed to `docs/`

### S-03: Keycloak realm and token validation
**Size:** M · **Labels:** `setup`, `auth` · **Depends on:** S-01

- [ ] Realm `meal-finder` is exported to `infra/keycloak/` and imported automatically on startup
- [ ] Clients for the frontend and the backend; realm roles `user` and `maintainer`
- [ ] Backend rejects requests without a valid JWT with `401` (I8); `/api/v1/health` stays public
- [ ] Two test users (one per role) are documented in `.env.example`

### S-04: CI pipeline
**Size:** S · **Labels:** `setup`, `ci` · **Depends on:** S-01

- [ ] A GitHub Actions workflow runs on every pull request: backend build and tests, frontend lint, type check, and build
- [ ] Branch protection on `main`: the CI check must pass and one review is required before merging

### S-05: Deploy to the Debian VM through Cloudflare Tunnel
**Size:** M · **Labels:** `setup`, `deploy` · **Depends on:** S-01, S-03

- [ ] A production Compose file runs on the VM, with a `cloudflared` container and no inbound ports open
- [ ] Tunnel ingress: the app hostname → frontend, `/auth/*` → Keycloak (I2, I3)
- [ ] The site loads over HTTPS at the public hostname, and login works end to end
- [ ] Deployment steps are documented in `docs/deploy.md`

---

## Features (MVP)

### F-01: Sign in and sign out
**Size:** M · **Labels:** `feature` · **Depends on:** S-03 · **Refs:** I3, I4

> As a calorie-conscious user, I want to sign in with my own account, so that my calorie target is saved to me and nobody else can see it.

- [ ] A new user can register and sign in through Keycloak, and lands back on the app signed in
- [ ] Tokens are held server-side by Next.js, never in `localStorage`
- [ ] Sign-out ends the session; protected pages then redirect to sign-in
- [ ] The backend creates an empty `user_profile` row on the user's first authenticated request

### F-02: Load restaurant meals from a CSV (seed data)
**Size:** M · **Labels:** `feature`, `data` · **Depends on:** S-02 · **Refs:** US-03 (basic version), I7, I12

> As the nutrition data maintainer, I want to load a restaurant's menu and meals from a CSV file, so that customers have real meals to search.

- [ ] A documented CSV format for items and meals is committed, with one sample file for at least 2 restaurants (≥ 10 meals each), transcribed from their published nutrition facts
- [ ] A maintainer-only endpoint (or command-line runner) loads the file in one transaction and computes `meal.total_calories`
- [ ] If any row has a missing or negative calorie value, the whole file is rejected, the response lists those line numbers, and nothing is saved (AC-03.3)

### F-03: Find fast-food meals under my calorie target
**Size:** L · **Labels:** `feature` · **Depends on:** S-02, S-03, F-02 · **Refs:** US-01, UC-01, AC-01.1, AC-01.3, AC-01.4, I5, I10

> As a college student buying fast food with a 700-calorie lunch target, I want to see complete meals at or below my target, so that I can order without adding up calories myself.

- [ ] `GET /api/v1/search?type=MEAL&targetCalories=…` returns up to 20 meals at or below the target, closest first
- [ ] The search page takes a target and shows the results, each with its name, restaurant, total calories, and serving size
- [ ] A target outside 100–5000, or not a whole number, shows the accepted range and runs no search (AC-01.4)
- [ ] With no matches, the page says so and shows the closest meal above the target (AC-01.3)
- [ ] Results appear within 2 s with the seed data (AC-01.1)

### F-04: See what's in a meal
**Size:** S · **Labels:** `feature` · **Depends on:** F-03 · **Refs:** AC-01.2

> As a fast-food customer, I want to see each item in a meal with its calories and serving size, so that I know exactly what I'm ordering and how the total is reached.

- [ ] Selecting a result shows every item with its calories and serving size, plus the meal total
- [ ] The total shown equals the sum of the item calories
- [ ] The meal is labeled "calorie match", never "healthy"

### F-05: Save my default calorie target
**Size:** S · **Labels:** `feature` · **Depends on:** F-01, F-03 · **Refs:** UC-01 A1, AC-01.5, I6, I11

> As a returning user, I want my usual calorie target remembered, so that I don't have to re-enter it every time.

- [ ] `GET/PUT /api/v1/profile/target` reads and saves the target (100–5000)
- [ ] After a save, signing out, and signing back in, the search page is pre-filled with the saved target

### F-06: Find grocery items under my calorie target
**Size:** L · **Labels:** `feature`, `data` · **Depends on:** F-03 · **Refs:** US-02, I13

> As a home cook planning meals to a calorie goal, I want to compare grocery items by calories per serving, so that I can choose and portion ingredients.

- [ ] A maintainer-run import pulls a starter set of ≥ 100 grocery items from the USDA FoodData Central API (energy = nutrient 1008, kcal) and stores them as `GROCERY` items
- [ ] Items without an energy value or a serving size are skipped and reported
- [ ] `type=GROCERY` search returns items at or below the target, each showing calories and its serving size
- [ ] Every result is clearly labeled as a grocery item or a complete meal

### F-07: Delete my account
**Size:** M · **Labels:** `feature`, `privacy` · **Depends on:** F-01, F-05 · **Refs:** US-05, I6, I9

> As an account holder who no longer uses the app, I want to permanently delete my account and saved target, so that my data isn't kept after I leave.

- [ ] `DELETE /api/v1/profile` removes the `user_profile` row and the Keycloak user (I9) — both or neither
- [ ] Afterward, the user is signed out and the old credentials no longer sign in
- [ ] If Keycloak deletion fails, the profile row is kept and the user sees a retry message

---

## Post-MVP

### F-08: Update a restaurant's data with a change preview
**Size:** L · **Labels:** `feature`, `data` · **Depends on:** F-02 · **Refs:** US-03, UC-02, AC-03.1, AC-03.2

> As the nutrition data maintainer, I want to see which items changed before an update is saved, so that menu changes don't silently break results.

- [ ] Uploading a newer CSV shows the items added, removed, and changed, with old and new calories, before anything is saved
- [ ] On confirm, changes are saved and every affected meal total is recalculated (AC-03.1)

**Cross-cutting (applies to every feature, from US-04):** each UI issue is not done until its page passes a screen-reader check. Names, result type, calories, and serving size must be announced, with no unlabeled controls.


## Macro extension tasks

### F-09: Import and display macros — M2
**Depends on:** S-02, F-02, F-04. **Refs:** US-06, US-07.
- [ ] Extend schema and import contracts with nullable nonnegative protein, carbohydrate, and fat grams per stated serving.
- [ ] Preserve source and serving basis; validate supplied values and define missing values explicitly.
- [ ] Recalculate affected meal nutrients consistently with serving quantities.
- [ ] Show macros or “unavailable” on results and meal details; include screen-reader labels.

### F-10: Optional protein ranking — M2
**Depends on:** F-03, F-09. **Refs:** US-06, UC-03.
- [ ] Confirm ranking rule with team; proposed total protein within the calorie limit is recorded in Product_Scope_Update.md.
- [ ] Add an optional protein control without requiring additional onboarding questions.
- [ ] Specify API ranking mode, deterministic ties, explanations, and missing-data behavior.
- [ ] Verify AC-06.1–AC-06.4 and the search latency budget on a documented catalog size.

### F-11: Optional advanced and saved preferences — M3
**Depends on:** F-05, F-10. **Refs:** US-08.
- [ ] Define minimum/maximum/desired macro target semantics, tolerances, conflict handling, and preference tags.
- [ ] Add optional refinement controls and matching rules with concrete acceptance examples.
- [ ] Extend saved profiles and deletion coverage for the new fields.

Model-based matching and automatic calculation of personal nutritional needs are outside these initial tasks.
