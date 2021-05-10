module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
      },
    ],
    'space-before-function-paren': [
      'error', {
        anonymous: 'ignore',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-infix-ops': [
      'error',
    ],
    'no-trailing-spaces': [
      'error', {
        skipBlankLines: false,
        ignoreComments: true,
      },
    ],
    'arrow-parens': [
      'error',
      'as-needed',
    ],
    indent: [
      'error',
      2,
      { SwitchCase: 1 },
    ],
    'object-curly-newline': 0,
    'import/no-cycle': 0,
    'linebreak-style': 0,
  },
};
