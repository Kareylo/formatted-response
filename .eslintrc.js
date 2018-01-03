// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow unused vars
    'no-unused-vars': 2,
    // Force to use let and const instead of var
    'no-var': 2,
    'prefer-const': 2
  }
}
