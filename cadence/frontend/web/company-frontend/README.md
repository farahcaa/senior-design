# react-ts-template

This template provides a setup to get React working in Vite with HMR, some ESLint rules, and more:

- Tailwind v4
- Bun
- Shadcn
- React Router

## Install

```bash
bun install
```

## Included Scripts

```json
  "scripts": {
    "dev": "bunx --bun vite",
    "build": "bunx --bun vite build",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "preview": "bunx --bun vite preview"
  },
```

- `dev` - Starts the development server
- `build` - Bundles the app into static files for production
- `lint` - Runs ESLint
- `lint:fix` - Runs ESLint and fixes issues
- `preview` - Preview the production build

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
# company-frontend
