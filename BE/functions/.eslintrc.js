module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*",
    ".eslintrc.js", // Ignore generated files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "require-jsdoc": "off",
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    indent: ["error", 2],
    quotes: "off",
    "max-len": "off",
    "operator-linebreak": "off",
    "new-cap": "off",
    "object-curly-spacing": ["error", "always"], // Có khoảng trắng
  },
};
