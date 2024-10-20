import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import { requireEslintTool, getRulesByConfigName } from './dist/index.js';
import eslintConfigBaseESLint from 'eslint-config-eslint/base';
import eslintConfigESLintFormatting from 'eslint-config-eslint/formatting';

const js = getRulesByConfigName('eslint-config-eslint/js', eslintConfigBaseESLint);

/**
 * @type {import('eslint').Linter.Config}
 */
export default [
    {
        name: 'ignores',
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '.eslint-config-inspector/**',
        ],
    },
    {
        name: 'js/setup',
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals['shared-node-browser'],
                ...globals.serviceworker,
                ...globals.builtin,
                ...globals.es2025,
            },
        },
    },
    ...tseslint.configs.recommended,
    {
        name: 'js/rules',
        rules: {
            ...pluginJs.configs.recommended.rules,
            ...js,
            ...eslintConfigESLintFormatting.rules,
            'no-undef': 'off',
            'no-restricted-globals': ['error'].concat(requireEslintTool('confusing-browser-globals')),
            'func-style': [
                'error',
                'expression',
            ],
            quotes: [
                'error',
                'single',
            ],
        },
    },
];
