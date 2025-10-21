const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:prettier/recommended"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],

    // 👇 Correção: usar import() em vez de require()
    plugins: {
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
      "react-hooks": (await import("eslint-plugin-react-hooks")).default,
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
      "prettier": (await import("eslint-plugin-prettier")).default,
    },

    rules: {
      "prettier/prettier": ["error", { singleQuote: true, semi: true, printWidth: 100 }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
      ],
    },

    settings: {
      react: { version: "detect" },
    },
  },
];

export default eslintConfig;
