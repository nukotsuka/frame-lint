import eslint from "@eslint/js";
import chakraUi from "eslint-plugin-chakra-ui";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/.tsup", "**/dist"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
        },
      ],
      eqeqeq: ["error", "smart"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "sibling",
            "index",
            "object",
          ],
          alphabetize: {
            order: "asc",
          },
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin", "internal", "object"],
          distinctGroup: false,
        },
      ],
      "no-console": [
        "error",
        {
          allow: ["error", "info", "warn"],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          name: "test",
          message: "Please use `vitest` instead.",
        },
        {
          name: "node:test",
          message: "Please use `vitest` instead.",
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
  },
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "chakra-ui": chakraUi,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      "react/jsx-key": "error",
      "react/self-closing-comp": "error",
      "chakra-ui/props-order": [
        "error",
        {
          applyToAllComponents: true,
        },
      ],
      "chakra-ui/props-shorthand": [
        "error",
        {
          noShorthand: true,
          applyToAllComponents: true,
        },
      ],
    },
  },
];
