# Constraints Essay: Calorie and Macro Meal Finder
**Team members:** Eric Braverman, Brayden Molinyawe, Christopher Farah

## Economic
Our project is an app or web app that allows users to log in and find fast-food meals and grocery options that fit their calorie goals and optional macro priorities.
The economic constraint is the cost of obtaining and maintaining the food, calorie, and macronutrient data needed for both types of searches.
To control costs, our initial design should prioritize free development tools and publicly available nutrition information.
Using free data instead of a paid nutrition service could reduce expenses, but it could also limit food coverage and require more manual updates.

## Security
Security factors into our project because users will log in and may associate personal calorie and macro goals with their accounts.
The design should collect only the information necessary for account access and meal matching, avoiding unnecessary details such as medical history.
Account information and any saved goals should be protected through secure authentication and access controls that prevent users from viewing another person’s information.
Using an established authentication service could simplify account protection, but its potential cost creates a trade-off between security support and affordability.

## Social
Our intended users are people who want to identify fast-food meals and grocery options that fit a calorie target and optional macro priorities.
Supporting both food sources means the design should make clear whether a result represents a complete meal or an individual grocery item and identify the serving size used for its calorie count.
Because matching a calorie target does not establish a meal’s overall nutritional quality, the app should present results as matches to the user’s selected goals without labeling them automatically healthy.

## Data completeness
Protein, carbohydrate, and fat values must use the same serving basis as the displayed calories. Public sources may omit nutrients; missing values must remain explicitly unavailable rather than being treated as zero. Protein-focused ranking therefore needs a defined missing-data policy and a catalog with sufficient macro coverage.
