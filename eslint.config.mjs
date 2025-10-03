import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extends Next.js + TypeScript + Prettier
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:prettier/recommended"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],

    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      "unused-imports": require("eslint-plugin-unused-imports"),
      "prettier": require("eslint-plugin-prettier"),
    },

    rules: {
      // Prettier
      "prettier/prettier": ["error", { singleQuote: true, semi: true, printWidth: 100 }],

      // TypeScript
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // React
      "react/react-in-jsx-scope": "off", // Next.js 15 não precisa importar React
      "react/prop-types": "off",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Imports não usados
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
      ],
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;
