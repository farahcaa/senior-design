# User Stories and Use Cases: Calorie-Based Meal Finder

**Team members:** Eric Braverman, Brayden Molinyawe, Christopher Farah

**Project:** An app or web app that lets users log in, enter a calorie target, and find fast-food meals and grocery options that fit it, with clear calorie counts and serving sizes.

---

## Stakeholder Map

| Category | Stakeholder | Why they matter | Stories |
|---|---|---|---|
| **Primary** | Calorie-conscious fast-food customer (e.g., a college student buying lunch between classes) | Opens the app to find a restaurant meal that fits a calorie target | US-01 |
| **Primary** | Home grocery shopper planning meals | Opens the app to compare grocery items by calories per serving | US-02 |
| **Secondary** | Nutrition data maintainer (team member who loads and updates restaurant and grocery calorie data from public sources) | Does not search for meals, but keeps results accurate; the economic constraint (free, public data) makes this a manual, recurring job | US-03 |
| **Hidden** | Users who rely on a screen reader (accessibility) | Only discovered after shipping if not considered: calorie and serving data shown visually may be unreadable to them | US-04 |
| **Hidden** | Former users and privacy/compliance reviewers | Only discovered after shipping: people who stop using the app expect their account and calorie goals to be removed | US-05 |
| **Hidden** | Public nutrition data sources (upstream data provider) | A downstream dependency: their format or availability changes affect every search result | Covered by UC-02 exception flow |

---

## User Stories

**US-01 (Primary — fast-food customer)**
As a college student buying fast food between classes with a 700-calorie lunch target,
I want to find complete fast-food meals whose total calories are at or below my target,
so that I can order a meal that fits my goal without adding up individual item calories myself.

**US-02 (Primary — grocery shopper)**
As a home cook planning a week of meals to a daily calorie goal,
I want to compare grocery items by calories per stated serving size,
so that I can choose and portion ingredients that keep each meal within my goal.

**US-03 (Secondary — nutrition data maintainer)**
As the team member responsible for nutrition data,
I want to update a restaurant's calorie data from a public source and see which items changed,
so that search results stay accurate when restaurants change their menus.

**US-04 (Hidden — accessibility)**
As a calorie-conscious user who navigates with a screen reader,
I want each search result's name, result type (complete meal or grocery item), calorie count, and serving size to be announced,
so that I can compare options independently, without sighted help.

**US-05 (Hidden — privacy/compliance)**
As an account holder who no longer uses the app,
I want to permanently delete my account and saved calorie goals,
so that my personal information is not kept after I leave.

---

## INVEST Self-Check

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable | Notes |
|---|---|---|---|---|---|---|---|
| US-01 | ✔ Does not depend on grocery search or accounts beyond login | ✔ Meal definition and sort order are open to discussion | ✔ Removes manual calorie math | ✔ One search over pre-built meal data | ✔ One search flow | ✔ AC-01.1 – AC-01.4 | Original draft said "a dropdown to pick a restaurant"; rewritten to state the need |
| US-02 | ✔ Separate data set and search | ✔ Units and sorting negotiable | ✔ Supports portioning | ✔ | ✔ | ✔ Calories and serving size are observable in each result | — |
| US-03 | ✔ Can be built against seed data | ✔ Import method (file vs. API) negotiable | ✔ Keeps results correct | ✔ | ✔ One restaurant per update | ✔ AC-03.1 – AC-03.3 | Split from a larger "manage all food data" story |
| US-04 | ✔ Applies to existing result output | ✔ Wording of announcements negotiable | ✔ Makes the app usable for screen-reader users | ✔ | ✔ | ✔ Verifiable with VoiceOver/NVDA | Hidden stakeholder |
| US-05 | ✔ Independent of search features | ✔ Grace period negotiable | ✔ Meets the security constraint of keeping only needed data | ✔ | ✔ | ✔ Deleted account cannot log in; no stored goal remains | Hidden stakeholder |

Stories cut during review: "As a user, I want a nice-looking results page" (no specific role, no measurable benefit) and "Add a calorie slider" (names a UI element; the underlying need is captured in US-01).

---

## Use Cases

### UC-01: Find Fast-Food Meals Within a Calorie Target
**Expands:** US-01

**Primary actor:** Fast-food customer (logged-in user)
**Secondary actors:** Nutrition database (meal and calorie data loaded per US-03)

**Preconditions**
1. The user has an account and is logged in.
2. The nutrition database contains at least one restaurant with at least one complete meal (entree plus side plus drink, or a restaurant-defined combo) that has a calorie value and serving size.

**Main Success Flow**
1. User enters a calorie target (for example, 700).
2. System validates that the target is a whole number from 100 to 5,000.
3. User optionally limits the search to one or more restaurants.
4. System returns complete meals whose total calories are at or below the target, sorted from closest to the target to farthest.
5. User selects one meal from the results.
6. System shows the meal's items, each item's calories and serving size, the meal's total calories, and the meal labeled as a "calorie match" (not as "healthy").

**Alternate Flow**
- **A1 – User saves the target (after step 2):** User chooses to save the target as their default. System stores the target on the user's account and pre-fills it on their next search. Flow continues at step 3.

**Exception Flows**
- **E1 – No meals fit the target (step 4):** System returns no matching meals, displays a message that no meals were found at or below the entered target, and shows the lowest-calorie meal available with its calorie count so the user can decide whether to adjust the target. Use case ends or restarts at step 1.
- **E2 – Invalid target (step 2):** User enters a value that is not a whole number from 100 to 5,000 (e.g., "-50" or "abc"). System rejects it, runs no search, and states the accepted range. Flow returns to step 1.

**Postcondition**
The user has viewed at least one complete meal whose total calories are at or below their target, with each item's calories and serving size shown; if A1 occurred, the target is stored on their account.

### Acceptance Criteria (UC-01)

**AC-01.1 (Main flow)**
Given a logged-in user and a database containing 3 meals of 450, 680, and 900 calories,
When the user searches with a target of 700,
Then exactly 2 meals are returned, ordered 680 then 450, and results appear within 2 seconds.

**AC-01.2 (Main flow)**
Given a search result list,
When the user selects a meal,
Then every item in that meal shows its calories and serving size, the shown total equals the sum of the item calories, and the meal is labeled "calorie match" with no "healthy" label.

**AC-01.3 (Exception E1)**
Given a logged-in user and a database where the lowest-calorie meal is 450 calories,
When the user searches with a target of 300,
Then 0 meals are returned, a "no meals found at or below 300 calories" message is displayed, and the 450-calorie meal is shown as the closest option.

**AC-01.4 (Exception E2)**
Given a logged-in user,
When the user enters a target of "-50" or "abc",
Then no search is run and a message states that the target must be a whole number from 100 to 5,000.

**AC-01.5 (Alternate A1)**
Given a logged-in user who saved a target of 700,
When the user logs out, logs back in, and starts a new search,
Then the target field is pre-filled with 700.

---

### UC-02: Update a Restaurant's Calorie Data
**Expands:** US-03

**Primary actor:** Nutrition data maintainer
**Secondary actors:** Public nutrition data source (upstream provider), nutrition database

**Preconditions**
1. The maintainer is logged in with a maintainer role.
2. The restaurant already exists in the database.
3. An updated calorie data file for that restaurant is available from a public source.

**Main Success Flow**
1. Maintainer selects the restaurant and provides the updated data file.
2. System validates that every row has an item name, a non-negative whole-number calorie value, and a serving size.
3. System shows a summary of items added, removed, and changed, with old and new calorie values.
4. Maintainer confirms the update.
5. System saves the new data, recalculates totals for every meal that uses a changed item, and records the update date and source.

**Alternate Flow**
- **A1 – No changes (step 3):** The file matches the current data. System reports "0 items changed" and makes no changes. Use case ends.

**Exception Flow**
- **E1 – Invalid rows (step 2):** One or more rows are missing a calorie value or serving size, or have a negative calorie value. System rejects the entire file, lists each invalid row by line number, and leaves the existing data unchanged. Flow returns to step 1.

**Postcondition**
The restaurant's items match the source file, every affected meal total is recalculated, and the update date and source are recorded.

### Acceptance Criteria (UC-02)

**AC-03.1 (Main flow)**
Given a restaurant with an item recorded at 500 calories that appears in 2 meals,
When the maintainer confirms a file listing that item at 550 calories,
Then the item shows 550 calories, both meal totals increase by exactly 50, and the update date and source are recorded.

**AC-03.2 (Main flow)**
Given a file that adds 1 item, removes 1 item, and changes 2 items,
When the maintainer provides it,
Then the summary lists exactly 1 added, 1 removed, and 2 changed items before anything is saved.

**AC-03.3 (Exception E1)**
Given a file in which line 7 has no serving size and line 12 has a calorie value of -20,
When the maintainer provides it,
Then the file is rejected, lines 7 and 12 are listed as invalid, and no item or meal total in the database changes.
