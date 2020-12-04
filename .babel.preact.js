module.exports = {
  plugins: [
    [
      "@babel/plugin-transform-typescript",
      {
        allowDeclareFields: true,
        isTSX: true,
        jsxPragma: "h",
        allExtensions: true
      }
    ],
    ["@babel/plugin-proposal-class-properties"],
    ["@prefresh/babel-plugin"],

    [
      "@babel/plugin-transform-react-jsx",
      {
        useBuiltIns: true,
        runtime: "automatic",
        useSpread: true,
        importSource: "preact"
      }
    ],

    [
      "babel-plugin-module-resolver",
      {
        root: ["./src"],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"]
      }
    ]
  ]
}
