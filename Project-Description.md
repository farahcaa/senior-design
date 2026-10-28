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
The frontend, search API, profile API, nutrition importer, PostgreSQL database, and authentication/deployment architecture remain applicable. Macro fields and matching rules extend those components. See `docs/Product_Scope_Update.md` for the design changes and `docs/Advisor_Meeting_Agenda.md` for discussion points. Existing D0 figures and PDF describe the calorie-only baseline; they are not regenerated macro-design deliverables.
