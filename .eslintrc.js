module.exports = {
  extends: ['react-app', 'react-app/jest', 'prettier'],
  plugins: ['import', 'react', 'prettier'],
  rules: {
    curly: 1,
    'eol-last': 1,
    eqeqeq: 1,
    'import/order': [
      1,
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'index', 'sibling', 'parent', 'internal'],
      },
    ],
    indent: [1, 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
    'no-console': 1,
    'no-dupe-keys': 0,
    'no-else-return': 1,
    'no-empty-function': 1,
    'no-extra-semi': 2,
    'no-unreachable': 1,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'prettier/prettier': [
      2,
      {
        endOfLine: 'auto',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
