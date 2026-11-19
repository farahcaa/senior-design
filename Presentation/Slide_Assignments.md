# Fall presentation — slide assignments and evidence

Prepared November 18, 2026. Team: Christopher Farah, Eric Braverman, Brayden Molinyawe. Proposed author/speaker assignments for coordination; members confirm their own claims. This is an outline, not a finished deck or rehearsal record.

## Slide outline

| Slide | Title / content cues                                                                                                               | Visual                                                     | Owner / speaker   | Seconds | Start | Sources                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------- | ------: | ----- | -------------------------------------------------------------- |
| 1     | Calorie and Macro Meal Finder: purpose is quick meal comparison; first goal is meals within a calorie budget with clear servings   | Simple target → meals sketch                               | Christopher Farah |      45 | 0:00  | Project-Description.md; D0 §1                                  |
| 2     | Team and advisor: all names, actual contact details and advisor; responsibilities are provisional                                  | Three names/roles, advisor line                            | Brayden Molinyawe |      40 | 0:45  | Team/Team_Contract.md; confirm contacts/advisor                |
| 3     | Project abstract: problem, user, calorie baseline, staged macro expansion, validation                                              | Approximately 100-word abstract with highlighted key terms | Eric Braverman    |      45 | 1:25  | Project-Description.md; D1 §1                                  |
| 4     | Stories and system design: enter 700 → 680 and 450; frontend → search/profile/import → database; identity and data sources         | Redrawn, labeled D0 with short US-01/AC-01.1 callout       | Eric Braverman    |      85 | 2:10  | Requirements/User_Stories.md; D0; D1 §2–5; D2 §2               |
| 5     | Constraints and trade-offs: free data coverage; serving accuracy; private goals; accessibility                                     | Constraint → design response table                         | Eric Braverman    |      50 | 3:35  | Ethics/Constraints_Essay.md; US-04/05; D1/D2                   |
| 6     | Progress: dated documents, template, Cadence branch; explicitly label designed versus implemented                                  | Evidence timeline with commit IDs                          | Christopher Farah |      85 | 4:25  | Git history; D1/D2; Planning/Assignment_8_Plan.md              |
| 7     | Expected term-end results: agreed design, repeatable setup and tested calorie-search slice as a proposed target                    | Completed / next / later milestones                        | Brayden Molinyawe |      65 | 5:50  | Planning/Assignment_8_Plan.md; confirm official term deadlines |
| 8     | Division of work: Chris database/profile/setup, Eric search/import, Brayden UI; cross-review                                       | Three workstreams with immediate handoffs                  | Christopher Farah |      50 | 6:55  | D0 owner table; Tasklist.md; Planning effort matrix            |
| 9     | Expected Expo demo: search, inspect meal, save target, demonstrate an error; optional macro extension if implemented and validated | Numbered demo storyboard plus fallback                     | Brayden Molinyawe |      75 | 7:45  | US-01/03/05; D1/D2; product milestone plan                     |

Total: 540 seconds = 9 minutes. Chris 180 seconds, Eric 180 seconds, Brayden 180 seconds. The nominal 10-minute slot has 60 seconds of reserve; confirm the instructor's limit. Durations are targets, not rehearsal observations.

## What each person delivers

### Christopher — slides 1, 6, 8

- Slide 1: state purpose and goal separately; keep macro expansion visible as future scope.
- Slide 6: use Sept 12/24 early documents, Oct 4 stories/D0, Oct 21 revision, Oct 24 template, Oct 28 scope update, Nov 9 D1/D2, Nov 10 Cadence branch. Existing plan/audit commits from Nov 12 are local unless pushed. Name what each artifact proves; a template commit does not prove an end-to-end meal search. Leave space for teammates to describe their work without erasing their documented contributions.
- Slide 8: show component leads and proposed immediate tasks. The 60/20/20 matrix is a planning proposal, not recorded hours or agreed contributions. Confirm with owners before presenting it as agreed.

### Eric — slides 3, 4, 5

- Slide 3: write approximately 100 words covering problem, users, flow, design, scope and verification; highlight a few key terms. Treat it as a required compact abstract, not nine paragraphs to read aloud.
- Slide 4: simplify D0 for a room; explain predefined meals, serving quantities and calorie ranking. Include one requirement ID. D1/D2's detailed figures belong in backups; referenced SVG sources are missing from the local design folder, so obtain originals from their author or use verified PDF figures for the backups.
- Slide 5: choose three or four actual constraints and explain a response/trade-off for each. Example: public nutrition data reduces acquisition cost but requires validation and manual updates. Do not call a calorie match automatically healthy or claim deployment/security checks passed without evidence.

### Brayden — slides 2, 7, 9

- Slide 2: obtain actual team emails and advisor identity; don't invent them.
- Slide 7: distinguish the end of the current fall term from the implementation semester. The planning document's dated milestones are proposals. Agree the smallest credible fall checkpoint and show macro work as later until scheduled and designed.
- Slide 9: write the exact proposed live-demo sequence and the matching fallback recording/screenshots. Call this an expected Expo demo, not completed functionality. Confirm who operates it. A fallback must exist and be tested before claiming it is ready.

## Shared technical story to review together

1. The user wants a quick food choice within a calorie budget; optional macro controls are the product direction.
2. The designed first release requires login, accepts a 100–5000 whole-number calorie limit, optionally filters restaurants, and returns at most 20 stored meals/items.
3. Meal search filters at/below the limit and ranks closest first, with deterministic ties. A 700 target returns 680 before 450; an above-budget alternative is clearly separate.
4. A meal has food components and positive serving quantities. Nutrition must use the stated serving basis; USDA normalization requires enough unit/mass information. We are not claiming generated recipes or an AI recommendation model.
5. A maintainer imports data, reviews a preview, then confirms. D1 defines validation, atomic updates, stale-preview protection and a 24-hour preview lifetime.
6. D2 covers frontend states, saved targets, recovery from deletion failures, identity verification, private interfaces, logs and backups. These are documented decisions; implementation still needs validation.
7. The macro roadmap adds grams of protein/carbs/fat and optional ranking. D1/D2 explicitly defer US-06–08 and guest search. Agree the next ranking objective before extending the contract.

## Conflicts to resolve before calling the deck final

| Issue                                                          | Evidence                                                  | Presentation treatment                                                                          |
| -------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Macro title versus calorie-only design                         | Product description vs D1/D2 scope                        | Vision plus explicitly labeled first release; do not imply macros are already implemented       |
| Next.js/server-side sessions versus Vite/browser-token starter | D0–D2 vs template implementation                          | State intended architecture and adaptation remaining; agree actual frontend/auth choice         |
| Compose deployment design versus Kubernetes starter manifests  | D0–D2 vs template                                         | Present hosting as planned, not deployed; confirm chosen route                                  |
| Task dates and ownership are proposals                         | Planning package                                          | Confirm dates/capacity and label remaining estimates; never claim proposed hours as actual work |
| Peer/advisor review evidence incomplete                        | D2 pending peer comments; no presentation advisor log yet | Obtain actual comments and record decisions; don't manufacture a meeting                        |

## Supporting deliverables outside the nine slides

Proposed coordinators to confirm: Chris assembles files and links; Eric consolidates actual advisor comments and source figures; Brayden assembles the run sheet and coordinates timing. All members supply slide notes, rehearse and review the complete deck.

- Keep editable PPTX and PDF under Presentation/. Use the final name TeamName_Presentation_Final once the team name is confirmed.
- Add backup slides for full D1/D2, detailed questions and AI-use disclosure. Add the recording plan to a backup: presenters, software, 5–10 minute target, hosting location, spreadsheet-link owner, demo/fallback. Confirm choices together.
- Advisor_Feedback.md needs actual date/duration/attendees/version, comment-by-comment responses/owners/status, change summary and dated open items; export a PDF.
- Run_Sheet.md needs actual handoff lines, slide start times, speaking roles, timekeeper, 8–12 likely questions (including two open issues), and real timed rehearsal results.
- Test the recording audio, sharing permissions, and backup deck on another machine.
- Each member independently writes three specific peer reviews ending with their email, posts them in the spreadsheet and submits the reviewed names/comments.
- Each student submits the complete required group materials; draft submission comment includes repository link and reviewed commit hash.

Layout reminder: one idea per slide, consistent accent/footer, readable text and labeled figures. Use at least 14 pt to resolve the prompt's contradictory small-caption guidance; cut text instead of shrinking. A nine-slide outline does not establish a completed presentation or review session.
