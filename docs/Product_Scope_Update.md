# Calorie and Macro Meal Finder — Scope and Design Update

**Status:** Working proposal for team/advisor discussion, October 27, 2026. Implementation and team approval are not implied.

## Goal
Help people find fast-food meals and grocery items that fit a personal calorie target and optional macro priorities, with clear nutrition values and serving sizes.

## Confirmed product direction
Keep the initial interaction short: calorie target, an optional protein priority, then results. Advanced inputs are optional. Calories alone remain the first milestone. Show available macros even when users do not set macro targets. Goals are supplied by the user; automatic nutritional-needs calculation is not required.

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
D0 markdown, PDF, and figure sources remain the original architecture baseline. This update records the proposed extension without overwriting those deliverables. D1 should detail the nutrition schema and search/ranking algorithm, including exact field types, units, constraints, missing-data behavior, complexity, and revised API contracts. D2 should finish remaining components, error paths, traceability, rationale, and actual peer-review feedback.

US-01–US-05 and their existing criteria remain baseline requirements. US-06–US-08 add the macro direction. M1 implements a subset of the existing scope; moving work to a later milestone does not silently remove course requirements. Agree on any deferrals with the advisor and update traceability.

## Decisions still needed
1. Confirm total protein within the calorie limit versus protein per calorie for the first protein mode.
2. Choose the initial catalog and verify macro coverage from its sources.
3. Decide whether search requires login; saving goals requires an account under the current design.
4. Decide whether grocery search is required in the first demo or follows restaurant meals.
5. Agree on deployment expectations and milestone dates.
6. Define optional macro target semantics and food preference tags only when M3 enters scope.
