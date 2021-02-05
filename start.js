var { sucrasify, hmr } = require("./tools");

var BrowserifyMiddleware = require("./tools/browserify-middleware");
const { createServer, static_middleware } = require("./tools/http-server");

var app = createServer();

BrowserifyMiddleware.settings({
  cache: {},
  packageCache: {},
  debug: true,
  sourceMaps: false,
  extensions: [".ts", ".tsx", ".js", ".jsx"],
  plugin: [[hmr]],
  transform: [[sucrasify.configure({ hot: true })]],
});

app.use(static_middleware("src"));
app.get("/main.js", BrowserifyMiddleware.middleware(__dirname + "/src/index.tsx"));

app.listen(8001, "localhost", function () {
  console.log("Listening on http://localhost:8001/");
});


// [
//   aliasify.configure({
//     aliases: {
//       react: "preact/compat",
//       "react-dom": "preact/compat",
//     },
//     appliesTo: { includeExtensions: [".js", ".jsx", ".tsx", ".ts"] },
//   }),
//   { global: true },
// ],
