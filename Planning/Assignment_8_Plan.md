# Assignment 8 — Implementation Plan

**Calorie and Macro Meal Finder**  
Task Lists (#5) and Milestones, Timeline, and Effort Matrix (#6)  
Planning baseline · November 12, 2026  
Eric Braverman, Brayden Molinyawe, Christopher Farah

The first release follows the authenticated calorie-only D1/D2 baseline. Macro sorting and guest search require a separate scope decision. Cadence is a starter implementation; D0 names are retained below. Confirm the frontend stack before porting work.

## 1. Task list

Proposed assignments follow D0 component leads: five tasks per person. They are invitations to own future work, not claims about past effort.

| Task | Statement | Proposed owner |
| --- | --- | --- |
| T01 | Validate the Database (PostgreSQL) and backend startup from a clean Cadence checkout. | Christopher Farah |
| T02 | Obtain a sourced restaurant fixture for the Nutrition Data Importer with calories and serving sizes. | Eric Braverman |
| T03 | Develop the Web Frontend (Next.js design) search form against a mocked I5 response. | Brayden Molinyawe |
| T04 | Develop Database (PostgreSQL) migrations for restaurant, food item, meal and meal composition. | Christopher Farah |
| T05 | Develop the Nutrition Data Importer seed path with row validation and atomic writes. | Eric Braverman |
| T06 | Develop the Web Frontend result list and meal details with keyboard and screen-reader support. | Brayden Molinyawe |
| T07 | Develop the Food Search API calorie filter, deterministic ranking and closest-option response. | Eric Braverman |
| T08 | Develop the User Profile API saved-target read and update flow with Keycloak subject checks. | Christopher Farah |
| T09 | Test the Web Frontend against the Food Search API using the 700-calorie acceptance example. | Brayden Molinyawe |
| T10 | Develop the Nutrition Data Importer preview, confirmation and stale-preview rejection. | Eric Braverman |
| T11 | Develop the User Profile API deletion job, identity cleanup and retry recovery. | Christopher Farah |
| T12 | Develop the Web Frontend save-target, deletion-confirmation and recovery messages. | Brayden Molinyawe |
| T13 | Validate the Nutrition Data Importer USDA grocery mapping against known serving units and missing data. | Eric Braverman |
| T14 | Validate Database (PostgreSQL) backup restoration and deletion replay on an isolated deployment. | Christopher Farah |
| T15 | Validate the Web Frontend end-to-end demonstration, accessible status messages and two-second search budget. | Brayden Molinyawe |

## 2. Milestones

### Completed work and commit history

Dates below are Git author dates. “Recorded” means the named artifact was committed; it does not certify course submission, passing tests, or equal authorship. Verify with git show and the indicated commit.

| ID | Recorded | Artifact / outcome | Verification reference |
| --- | --- | --- | --- |
| H1 | 2026-09-12 | Project description and Christopher bio | 9eeff72 |
| H2 | 2026-09-14 | Brayden bio | 698d0c0 |
| H3 | 2026-09-24 | Constraints essay and description update | 702c713 |
| H4 | 2026-10-04 | User stories/use cases and first D0 design | ae0487f / 0688146 |
| H5 | 2026-10-21 | D0 revision, team contract and MVP backlog | 123ab13 |
| H6 | 2026-10-24 | Reusable application template added | 7afe150 |
| H7 | 2026-10-28 | Macro scope update and revised backlog | dc6c0b7 |
| H8 | 2026-11-09 | D1/D2 sources and PDFs; peer review still pending | 9ef8df1 / 3ee4bf8 / 9624d53 |
| H9 | 2026-11-10 | Cadence starter adaptation on feature/inital-build | 6e65ce7 |
| H10 | 2026-11-12 | Ethics statement and attribution review draft (local) | b135bc6 / 091a9ec |

Christopher: I worked on the early project description, constraints, user stories, D0 and backlog. I stood up the codebase using the starter template (Oct 24) and started adapting it as Cadence (Nov 10). The branch includes landing-page and project changes; a working meal search is not established by that commit.

Eric Braverman — add your own completed contributions, dates and evidence: ____________________.

Brayden Molinyawe — add your own completed contributions, dates and evidence: ____________________.

Course checkpoints: Assignment 8 was due Oct 28; the ethics statement was due Nov 11. Submission status is unverified for both. D2 peer feedback still requires a real review record. No Week 1 course calendar was located; add its other graded dates and replace the Week 14 target with the official date before submission.

### Planned demonstrations

These dates are scheduling proposals, not past commitments. Verifiers listed are proposed reviewers. The winter/exam blackout separates fall planning from implementation semester checkpoints.

| ID / target | Outcome | How verified | Verifier |
| --- | --- | --- | --- |
| M1 / 2026-11-23 | Foundation handoff | T01–03: replay setup, inspect fixture and exercise mock search. | Whole team |
| M2 / 2026-12-09 | Fall / Week 14 review packet (target) | Review schema, seed-import progress, UI and plan tables; reconcile official report date. | Team + advisor invited |
| M3 / 2027-01-22 | Ranked search and profile contract | Run known search inputs and save/read one target with an authenticated user. | Eric + Christopher |
| M4 / 2027-02-05 | Calorie-search proof of concept | Search 700 kcal; return 680 then 450, exclude 900; inspect meal details. | Brayden + Eric |
| M5 / 2027-02-19 | Catalog and deletion recovery | Reject stale preview; interrupt a deletion, resume it and verify both stores. | Eric + Christopher |
| M6 / 2027-03-05 | Account journey | Save target, sign in again, delete account and observe accessible confirmation. | Brayden + Christopher |
| M7 / 2027-03-19 | Grocery data acceptance | Validate unit conversion and rejection cases against sourced fixtures. | Eric + peer reviewer |
| M8 / 2027-04-02 | Recovery rehearsal | Restore isolated backup and demonstrate that deleted profiles stay deleted. | Christopher + peer reviewer |
| M9 / 2027-04-16 | Integrated release candidate | Run accessibility, latency and failure checks; record results and limitations. | Whole team |
| M10 / 2027-04-30 | Implementation semester handoff (target) | Repeat accepted demo from documented checkout; review evidence and open issues. | Team + advisor invited |

## 3. Table 1 — Timeline

### Tasks

Each task has five scheduled working days plus one task-buffer day (20% of working duration). The last date is that buffer day, not extra estimated labor. Dates exclude weekends and the draft blackouts. Dependencies are finish-to-start. C / E / B = Christopher / Eric / Brayden.

| ID | Task statement | Lead | Start | Finish incl. buffer | Depends on |
| --- | --- | --- | --- | --- | --- |
| T01 | Validate the Database (PostgreSQL) and backend startup from a clean Cadence checkout. | C | 2026-11-12 | 2026-11-19 | — |
| T02 | Obtain a sourced restaurant fixture for the Nutrition Data Importer with calories and serving sizes. | E | 2026-11-12 | 2026-11-19 | — |
| T03 | Develop the Web Frontend (Next.js design) search form against a mocked I5 response. | B | 2026-11-12 | 2026-11-19 | — |
| T04 | Develop Database (PostgreSQL) migrations for restaurant, food item, meal and meal composition. | C | 2026-11-20 | 2026-12-02 | T01, T02 |
| T05 | Develop the Nutrition Data Importer seed path with row validation and atomic writes. | E | 2026-12-03 | 2026-12-10 | T04 |
| T06 | Develop the Web Frontend result list and meal details with keyboard and screen-reader support. | B | 2026-11-20 | 2026-12-02 | T03 |
| T07 | Develop the Food Search API calorie filter, deterministic ranking and closest-option response. | E | 2027-01-11 | 2027-01-18 | T04 |
| T08 | Develop the User Profile API saved-target read and update flow with Keycloak subject checks. | C | 2027-01-11 | 2027-01-18 | T01, T04 |
| T09 | Test the Web Frontend against the Food Search API using the 700-calorie acceptance example. | B | 2027-01-25 | 2027-02-01 | T05, T06, T07 |
| T10 | Develop the Nutrition Data Importer preview, confirmation and stale-preview rejection. | E | 2027-02-01 | 2027-02-08 | T05 |
| T11 | Develop the User Profile API deletion job, identity cleanup and retry recovery. | C | 2027-02-08 | 2027-02-15 | T08 |
| T12 | Develop the Web Frontend save-target, deletion-confirmation and recovery messages. | B | 2027-02-22 | 2027-03-01 | T08, T11 |
| T13 | Validate the Nutrition Data Importer USDA grocery mapping against known serving units and missing data. | E | 2027-03-01 | 2027-03-15 | T10 |
| T14 | Validate Database (PostgreSQL) backup restoration and deletion replay on an isolated deployment. | C | 2027-03-22 | 2027-03-29 | T11 |
| T15 | Validate the Web Frontend end-to-end demonstration, accessible status messages and two-second search budget. | B | 2027-04-05 | 2027-04-12 | T09, T12, T13, T14 |

Calendar driver into the final demonstration: T01/T02 → T04 → T08 → T11 → T14 → T15 → M9. T13 also gates T15; holiday and owner availability can consume the gaps. Confirm this chain after owners supply estimates.

### Milestone dates and protected review time

| ID | Milestone | Recorded / planned date | Protected review block |
| --- | --- | --- | --- |
| H1 | Project description and Christopher bio | 2026-09-12 | Historical record |
| H2 | Brayden bio | 2026-09-14 | Historical record |
| H3 | Constraints essay and description update | 2026-09-24 | Historical record |
| H4 | User stories/use cases and first D0 design | 2026-10-04 | Historical record |
| H5 | D0 revision, team contract and MVP backlog | 2026-10-21 | Historical record |
| H6 | Reusable application template added | 2026-10-24 | Historical record |
| H7 | Macro scope update and revised backlog | 2026-10-28 | Historical record |
| H8 | D1/D2 sources and PDFs; peer review still pending | 2026-11-09 | Historical record |
| H9 | Cadence starter adaptation on feature/inital-build | 2026-11-10 | Historical record |
| H10 | Ethics statement and attribution review draft (local) | 2026-11-12 | Historical record |
| M1 | Foundation handoff | 2026-11-23 | Nov 20 |
| M2 | Fall / Week 14 review packet (target) | 2026-12-09 | Dec 8 |
| M3 | Ranked search and profile contract | 2027-01-22 | Jan 20–21 |
| M4 | Calorie-search proof of concept | 2027-02-05 | Feb 3–4 |
| M5 | Catalog and deletion recovery | 2027-02-19 | Feb 17–18 |
| M6 | Account journey | 2027-03-05 | Mar 3–4 |
| M7 | Grocery data acceptance | 2027-03-19 | Mar 17–18 |
| M8 | Recovery rehearsal | 2027-04-02 | Mar 31–Apr 1 |
| M9 | Integrated release candidate | 2027-04-16 | Apr 14–15 |
| M10 | Implementation semester handoff (target) | 2027-04-30 | Apr 28–29 |

Protected dates are reserved for milestone verification or recovery, not new feature commitments. Proposed blackouts: Nov 25–29; Dec 12–Jan 10 for exams/winter break; Mar 8–14 pending spring availability. Confirm co-op/exam schedules at kickoff; keep semester-end exam time outside the Apr 30 handoff.

## 4. Table 2 — Effort matrix

Proposed allocation of each task’s effort (%), not hours worked or owner estimates. Bold marks the primary owner for each task. Equal-sized tasks give a balanced initial allocation; use weighted hours once estimates arrive.

| ID | Task statement | Chris % | Eric % | Brayden % | Total % |
| --- | --- | --- | --- | --- | --- |
| T01 | Validate the Database (PostgreSQL) and backend startup from a clean Cadence checkout. | **60** | 20 | 20 | 100 |
| T02 | Obtain a sourced restaurant fixture for the Nutrition Data Importer with calories and serving sizes. | 20 | **60** | 20 | 100 |
| T03 | Develop the Web Frontend (Next.js design) search form against a mocked I5 response. | 20 | 20 | **60** | 100 |
| T04 | Develop Database (PostgreSQL) migrations for restaurant, food item, meal and meal composition. | **60** | 20 | 20 | 100 |
| T05 | Develop the Nutrition Data Importer seed path with row validation and atomic writes. | 20 | **60** | 20 | 100 |
| T06 | Develop the Web Frontend result list and meal details with keyboard and screen-reader support. | 20 | 20 | **60** | 100 |
| T07 | Develop the Food Search API calorie filter, deterministic ranking and closest-option response. | 20 | **60** | 20 | 100 |
| T08 | Develop the User Profile API saved-target read and update flow with Keycloak subject checks. | **60** | 20 | 20 | 100 |
| T09 | Test the Web Frontend against the Food Search API using the 700-calorie acceptance example. | 20 | 20 | **60** | 100 |
| T10 | Develop the Nutrition Data Importer preview, confirmation and stale-preview rejection. | 20 | **60** | 20 | 100 |
| T11 | Develop the User Profile API deletion job, identity cleanup and retry recovery. | **60** | 20 | 20 | 100 |
| T12 | Develop the Web Frontend save-target, deletion-confirmation and recovery messages. | 20 | 20 | **60** | 100 |
| T13 | Validate the Nutrition Data Importer USDA grocery mapping against known serving units and missing data. | 20 | **60** | 20 | 100 |
| T14 | Validate Database (PostgreSQL) backup restoration and deletion replay on an isolated deployment. | **60** | 20 | 20 | 100 |
| T15 | Validate the Web Frontend end-to-end demonstration, accessible status messages and two-second search budget. | 20 | 20 | **60** | 100 |
| Total | Sum across 15 tasks | 500 | 500 | 500 | 1500 |

Each column totals 500 percentage points (one third of equal-weight capacity). Each owner should supply optimistic, most likely and pessimistic hours. Compute expected task hours = (O + 4M + P) / 6 and multiply by each share. If actual weekly demand exceeds declared capacity, move review/testing hours to the available teammate or resequence before consuming protected time.

## 5. Work breakdown structure

### Foundation

- **T01** · Validate the Database (PostgreSQL) and backend startup from a clean Cadence checkout. Christopher Farah.
- **T02** · Obtain a sourced restaurant fixture for the Nutrition Data Importer with calories and serving sizes. Eric Braverman.

- **T03** · Develop the Web Frontend (Next.js design) search form against a mocked I5 response. Brayden Molinyawe.

### First search

- **T04** · Develop Database (PostgreSQL) migrations for restaurant, food item, meal and meal composition. Christopher Farah.
- **T05** · Develop the Nutrition Data Importer seed path with row validation and atomic writes. Eric Braverman.

- **T06** · Develop the Web Frontend result list and meal details with keyboard and screen-reader support. Brayden Molinyawe.
- **T07** · Develop the Food Search API calorie filter, deterministic ranking and closest-option response. Eric Braverman.

- **T09** · Test the Web Frontend against the Food Search API using the 700-calorie acceptance example. Brayden Molinyawe.

### Accounts

- **T08** · Develop the User Profile API saved-target read and update flow with Keycloak subject checks. Christopher Farah.
- **T11** · Develop the User Profile API deletion job, identity cleanup and retry recovery. Christopher Farah.

- **T12** · Develop the Web Frontend save-target, deletion-confirmation and recovery messages. Brayden Molinyawe.

### Catalog integrity

- **T10** · Develop the Nutrition Data Importer preview, confirmation and stale-preview rejection. Eric Braverman.
- **T13** · Validate the Nutrition Data Importer USDA grocery mapping against known serving units and missing data. Eric Braverman.

### Release

- **T14** · Validate Database (PostgreSQL) backup restoration and deletion replay on an isolated deployment. Christopher Farah.
- **T15** · Validate the Web Frontend end-to-end demonstration, accessible status messages and two-second search budget. Brayden Molinyawe.

## 6. Risk register

Discussion draft: these triggers and responses are grounded in D1/D2 and the schedule. Owners must assess likelihood/impact and adopt or revise each response; the entries do not attest to a team risk vote.

| Risk / category | Likelihood / impact¹ | Trigger | Proposed strategy and mitigation | Lead / checkpoint |
| --- | --- | --- | --- | --- |
| Startup drift · technical | Open / high | Clean checkout fails or auth/stack differs from D2. | Reduce: document exact branch, versions and failing step; agree the auth boundary before integration. | Chris · T01/M1 |
| Nutrition coverage · external | Open / high | Source lacks serving basis or permission. | Reduce: switch to verified fixture; defer unverified rows and keep their provenance. | Eric · T02/M1; T13/M7 |
| Stale changes · technical | Open / high | Second preview overwrites a newer import. | Reduce: test version conflict and unchanged live rows before accepting importer. | Eric · T10/M5 |
| Recovery failure · technical | Open / high | Restoration recreates a deleted profile. | Avoid release until replay and isolated restore pass. Use M8 buffer for a repeat run. | Chris · T14/M8 |
| Availability · team | Open / high | Exam, co-op rotation or break removes an owner during a task. | Reduce: collect blackout dates at kickoff; name a backup reviewer and move dependent work before protected blocks. | Brayden · M1/M2/M7 |
| Slow or inaccessible results · technical | Open / high | Search exceeds two seconds or result labels fail screen-reader check. | Reduce: measure fixture end to end at M4; reserve M9 block for regression. | Brayden · T09/T15 |

¹ High is a proposed schedule consequence, not an owner assessment of probability. Record the team’s likelihood and impact ratings before submission.

### Week of November 12

- **Thu Nov 12** — Chris records Cadence setup and a health check; Eric identifies a source and fixture; Brayden sketches the accessible target/results flow.
- **Fri Nov 13** — agree I5 request/response and exchange artifacts.
- **By Sun Nov 15** — each member posts progress, blockers, task estimates, availability and ownership changes for the weekly check-in.
- **Next week** — use the artifacts to verify M1.
