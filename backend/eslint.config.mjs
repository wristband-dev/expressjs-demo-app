import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      'arrow-body-style': ['error', 'always'],
      'consistent-return': 'warn',
      'func-names': 'off',
      'no-console': 'off',
      'no-empty-function': 'off',
      'no-fallthrough': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'object-curly-newline': 'off',
      'object-shorthand': 'off',
      'prefer-destructuring': 'off',
      'prettier/prettier': 'error',
    },
  },
  // Replaces manual prettier plugin setup + eslint-config-prettier spreads
  prettierRecommended,
];
