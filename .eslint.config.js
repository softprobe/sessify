module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  rules: {
    // TypeScript 规则
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-floating-promises": "error",

    // ESLint 基础规则
    "no-console": "warn",
    eqeqeq: ["error", "always"],

    // Prettier 集成 (通过 plugin:prettier/recommended 已处理)
  },
  ignorePatterns: ["dist/**", "node_modules/**"],
};
