export default [
  {
    files: ["js/playwright-test-game.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly",
        document: "readonly",
        window: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  },
  {
    files: ["**/*.js"],
    ignores: ["js/playwright-test-game.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        performance: "readonly",
        localStorage: "readonly",
        Audio: "readonly",
        Map: "readonly",
        Math: "readonly",
        Date: "readonly",
        JSON: "readonly",
        requestAnimationFrame: "readonly",
        HTMLElement: "readonly",
        Node: "readonly",
        Text: "readonly",
        Event: "readonly",
        Error: "readonly",
        alert: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
