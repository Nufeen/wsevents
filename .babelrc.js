const presets = ["@babel/preset-env", "@babel/react"]

const plugins = [
  "@babel/syntax-dynamic-import",
  "@babel/plugin-proposal-optional-chaining",
]

// enable if async/await needed
// const plugins = [
//   "@babel/syntax-dynamic-import",
//   "syntax-async-functions",
//   "@babel/transform-runtime"
// ]

module.exports = {
  presets,
  plugins
}
