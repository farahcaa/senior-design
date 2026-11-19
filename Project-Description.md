# Project Title: Calorie and Macro Meal Finder

**Team members:** Eric Braverman, Brayden Molinyawe, Christopher Farah

## Description
A web app that helps people with fitness and nutrition goals find fast-food meals and grocery options that fit their calorie budget and optional macro priorities. Users enter a calorie target, optionally select “Prioritize protein,” and immediately see matching options with serving sizes, calories, and available protein, carbohydrate, and fat values. Additional preferences are optional so the initial search stays short.

## Product flow
1. Enter a calorie target. Optionally select “Prioritize protein.”
2. See ranked meals or grocery items with nutrition per stated serving and a brief explanation of the match.
3. Optionally refine by protein, carbohydrate, and fat targets, restaurants, or food preferences.
4. Optionally save goals for future searches.

Existing D0 authentication remains the baseline; whether the first search should work without login is an open meeting decision. A long onboarding questionnaire is not required.

## Delivery milestones
- **M1 — Calorie proof of concept:** working calorie search over a small, sourced catalog, showing servings and meal contents. Preserve the existing calorie-only behavior as a testable baseline.
- **M2 — Core macro matching:** import and display macros, offer optional protein-focused ranking, and explain results. Proposed initial rule: most total protein among meals within the calorie limit; confirm this with the team.
- **M3 — Optional expansion:** specific macro targets, food preferences, and saved preferences. Define target tolerances and ranking before implementation.

The app matches foods to user-selected goals. Calculating personal nutritional needs, learned recommendations, and model-based interpretation are outside the initial scope. Public deployment is a separate delivery decision; a local demonstration can establish the proof of concept.

## Design continuity
The frontend, search API, profile API, nutrition importer, PostgreSQL database, and authentication/deployment architecture remain applicable. Macro fields and matching rules extend those components. See the macro extension notes below and `Presentation/Slide_Assignments.md` for presentation preparation. Existing D0 figures and PDF describe the calorie-only baseline; they are not regenerated macro-design deliverables.


## Macro extension notes

Proposed expansion; D1/D2 retain the authenticated calorie-only release.

## Matching behavior proposed for M2
- Preserve the calorie-only mode: filter at or below the calorie limit and rank closest to it first.
- Proposed protein mode: apply the same calorie limit, then rank by total protein grams descending. For ties, use calories ascending, then stable meal/item ID ascending. This is a proposal to confirm, not a claim of an optimal dietary ratio.
- Display protein, carbohydrate, and fat in grams for the same serving as the calorie value. Unknown nutrients remain unknown, never zero.
- In protein mode, rank only candidates with known protein. Report when eligible options lack protein data and offer calorie-only results as an explicit alternative.
- An over-budget alternative must be labeled as outside the calorie limit. Do not count it as a match.
- M3 macro targets require an agreed meaning (minimum, maximum, or desired value), tolerances, weights, and handling of conflicting goals before implementation.

## Component and interface impact
| Existing element | Required extension |
|---|---|
| C1 frontend | Optional protein control; macro display; explanations; later optional preference controls |
| C2 food search | Explicit calorie/protein ranking modes; missing-data behavior; deterministic ties |
| C3 profile | Later optional saved macro goals/preferences; account deletion includes those values |
| C4 importer | Parse and validate macro grams, serving basis, source, and missing values; preview macro changes |
| C5 database | Nullable nonnegative macro values; consistent item-to-meal aggregation; later goals/preferences |
| I5 / I10 search and query | Add ranking mode and macro response fields; keep calorie-only behavior available |
| I6 / I11 profile | Extend only when saving macro goals/preferences is implemented |
| I7 / I12 / I13 imports | Carry macros through ingestion, validation, change summaries, and recalculation |
| E1 / E3 authentication and hosting | Existing architecture remains suitable; guest search and public deployment remain open decisions |

For a meal assembled from items, sum nutrient grams using the same serving quantities as the calorie total. If any contributing item lacks a nutrient, mark that meal nutrient unknown. Preserve sourced calorie values; do not silently replace them with a calculation from macros.

## Documentation and assignment continuity
D0 markdown, PDF, and figure sources remain the original architecture baseline. This update records the proposed extension without overwriting those deliverables. D1 and D2 now document the calorie-only release; the macro extension below remains proposed.

US-01–US-05 and their existing criteria remain baseline requirements. US-06–US-08 add the macro direction. M1 implements a subset of the existing scope; moving work to a later milestone does not silently remove course requirements. Agree on any deferrals with the advisor and update traceability.

## Decisions still needed
1. Confirm total protein within the calorie limit versus protein per calorie for the first protein mode.
2. Choose the initial catalog and verify macro coverage from its sources.
3. Decide whether search requires login; saving goals requires an account under the current design.
4. Decide whether grocery search is required in the first demo or follows restaurant meals.
5. Agree on deployment expectations and milestone dates.
6. Define optional macro target semantics and food preference tags only when M3 enters scope.
