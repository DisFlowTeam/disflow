// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended
    ],
    rules: {
        "@typescript-eslint/no-unsafe-call": "warn",
        "semi": "warn"
    },
    languageOptions: {
        parserOptions: {
            project: ["./packages/*/tsconfig.json"],
            tsconfigRootDir: import.meta.dirname
        }
    }
});