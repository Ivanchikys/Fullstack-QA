import globals from "globals";
import playwright from "eslint-plugin-playwright";
import importPlugin from "eslint-plugin-import";
import pluginJs from "@eslint/js";
import pluginJson from "@eslint/json";
import stylistic from "@stylistic/eslint-plugin";

export default [
    // 1. Global Ignores
    {
        ignores: [
            "/node_modules/",
            "/test-results/",
            "/playwright-report/",
            "/dist/",
            "/build/",
            "/coverage/",
            "/*.min.js",
        ],
    },

    // 2. Base JavaScript Logic
    {
        files: ["/*.js", "/*.jsx"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: { ecmaVersion: "latest", sourceType: "module" },
        },
        plugins: {
            "@stylistic": stylistic,
            "import": importPlugin,
        },
        rules: {
            ...pluginJs.configs.recommended.rules,
            ...importPlugin.flatConfigs.recommended.rules,
            ...stylistic.configs.recommended.rules,

            "camelcase": ["error", { "properties": "never", "ignoreDestructuring": true }],
            "no-param-reassign": ["error", { "props": false }],
            "no-return-assign": "off",
            "no-underscore-dangle": 0,
            "no-restricted-syntax": 0,
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
            "import/no-extraneous-dependencies": ["error", { "devDependencies": ["/*.config.js", "tests/", "/*.spec.js"] }],
            "no-shadow": "error",
            "import/prefer-default-export": "off",
            "no-console": ["warn", { allow: ["warn", "error"] }],

            "@stylistic/indent": ["error", 4, {
                "SwitchCase": 1,
                "VariableDeclarator": 1,
                "outerIIFEBody": 1,
                "FunctionDeclaration": { "parameters": 1, "body": 1 },
                "FunctionExpression": { "parameters": 1, "body": 1 }
            }],
            "@stylistic/comma-dangle": ["error", {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "ignore"
            }],
            "@stylistic/arrow-parens": ["error", "as-needed"],
            "@stylistic/max-len": ["error", 120, 2, {
                "ignoreUrls": true,
                "ignoreComments": false,
                "ignoreRegExpLiterals": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }],
            "@stylistic/quotes": ["error", "single", { "avoidEscape": true }],
            "@stylistic/semi": ["error", "always"],
            "arrow-body-style": ["off", "as-needed", { "requireReturnForObjectLiteral": false }],
        },
    },

    // 3. Playwright Specific - Improved merging
    {
        files: ["tests/", "/*.spec.js", "/*.test.js"],
        ...playwright.configs["flat/recommended"], // Spread base first
        rules: {
            ...playwright.configs["flat/recommended"].rules,
            "playwright/no-wait-for-timeout": "error",
            "playwright/prefer-web-first-assertions": "error",
            "playwright/no-force-option": "warn",
            "playwright/no-skipped-test": "warn",
            "playwright/expect-expect": "error", // Ensure every test actually tests something
            "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        },
    },

    // 4. JSON Handling
    {
        files: ["/*.json"],
        plugins: {
            json: pluginJson,
        },
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
        },
    },
    // 5. Config File Exceptions
    {
        files: ["*.config.js", "eslint.config.mjs"],
        rules: {
            "no-console": "off",
            "import/no-extraneous-dependencies": "off",
        },
    }
];
