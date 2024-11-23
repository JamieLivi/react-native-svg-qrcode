module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    '@react-native',
  ],
  rules: {
    'no-void': 0,
    'no-bitwise': 0,
    'prettier/prettier': 1,
    'react/react-in-jsx-scope': 0,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,
    '@typescript-eslint/func-call-spacing': 0,
    '@typescript-eslint/no-unsafe-argument': 1,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-require-imports': 1,
    '@typescript-eslint/no-unsafe-call': 1,
    '@typescript-eslint/no-unsafe-enum-comparison': 1,
    '@typescript-eslint/no-unsafe-member-access': 1,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_|e',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'comma-dangle': 0,
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
