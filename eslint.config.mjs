import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import sortImportsEs6Autofix from "eslint-plugin-sort-imports-es6-autofix";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/node_modules",
    "**/.next",
    "**/.git",
    "**/next.config.js",
    "**/config.ts",
    "**/*.js",
  ]),
  {
    extends: [
      ...compat.extends("eslint:recommended"),
      ...compat.extends("plugin:react/recommended"),
      ...compat.extends("plugin:@typescript-eslint/recommended"),
      ...compat.extends("prettier"),
      ...compat.extends("plugin:prettier/recommended"),
      ...compat.extends("plugin:@next/next/recommended"),
    ],

    plugins: {
      react,
      "@typescript-eslint": typescriptEslint,
      "sort-imports-es6-autofix": sortImportsEs6Autofix,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"],
      "react/display-name": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/prop-types": "off",

      "sort-imports-es6-autofix/sort-imports-es6": [
        2,
        {
          ignoreCase: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
    },
  },
]);
