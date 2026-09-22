// @ts-check
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  },

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  // Standard-style formatting: no semicolons, single quotes, 2-space indent.
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    commaDangle: 'never',
    braceStyle: '1tbs',
    arrowParens: false,
    jsx: false
  }),

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@stylistic/space-before-function-paren': ['error', 'always']
    }
  },

  // Overload implementation signatures and the callable-Proxy cast need escape hatches.
  {
    files: ['src/formatted-response.ts', 'src/index.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off'
    }
  },

  // Smoke tests import compiled output (dist/), which is excluded from the
  // tsconfig program (see tsconfig.json) so `tsc --noEmit` doesn't require a
  // build to exist first. That also takes them out of typescript-eslint's
  // project service, so they get syntax-only linting — the runtime
  // assertions in these tests are the point, not their static types.
  {
    files: ['test/dist/**'],
    extends: [tseslint.configs.disableTypeChecked]
  },

  // Plain-JS config files get no type-aware rules.
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    extends: [tseslint.configs.disableTypeChecked]
  }
)
