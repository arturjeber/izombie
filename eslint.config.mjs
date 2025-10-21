import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// 🔹 Permite usar __dirname / __filename em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔹 Instancia o compat do ESLint (necessário antes de usar)
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 🔹 Importa plugins via ESM
const tsEslint = (await import('@typescript-eslint/eslint-plugin')).default;
const reactHooks = (await import('eslint-plugin-react-hooks')).default;
const unusedImports = (await import('eslint-plugin-unused-imports')).default;
const prettier = (await import('eslint-plugin-prettier')).default;

// 🔹 Define a configuração
export default [
  // Herdar regras principais do Next e TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),

  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],

    plugins: {
      '@typescript-eslint': tsEslint,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
      prettier: prettier,
    },

    rules: {
      // Prettier
      'prettier/prettier': ['error', { singleQuote: true, semi: true, printWidth: 100 }],

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // React
      'react/react-in-jsx-scope': 'off', // Next 15 já importa React implicitamente
      'react/prop-types': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Imports não usados
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },

    settings: {
      react: { version: 'detect' },
    },
  },
];
