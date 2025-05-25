import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default await tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  files: ['**/*.ts', '**/*.js'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  },
});
