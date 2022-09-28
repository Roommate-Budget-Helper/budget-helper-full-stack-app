import { resolve } from "path";

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: [
      resolve(__dirname, "./tsconfig.json"),
      resolve(__dirname, "./tsconfig.eslint.json"),
    ],
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
};
