module.exports = {
  root: true,
  env: {
    'jest/globals': true,
  },
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  plugins: ['jest'],
  rules: {
    'prettier/prettier': 'warn',
  },
}
