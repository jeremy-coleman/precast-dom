const path = require("path")
const webpack = require("webpack")
const PreactRefreshPlugin = require("@prefresh/webpack")
const {TsconfigPathsPlugin} = require("tsconfig-paths-webpack-plugin")
const HtmlWebpackPlugin = require("./tools/html-webpack5-plugin")

const outputPath = path.resolve(__dirname, "public")
const Prism = require("./tools/prism.js")
const ENTRY_FILE = "./src/index.tsx"
const HTML_TEMPLATE = "./src/index.html"

module.exports = {
  mode: "development",
  stats: "minimal",
  target: "web",
  devtool: "source-map",
  entry: [ENTRY_FILE, "webpack-hot-middleware/client"],
  output: {
    path: outputPath,
    publicPath: "/",
    filename: "app.js"
  },
  resolve: {
    extensions: [".jsx", ".js", ".json", ".mjs", ".ts", ".tsx"],
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat"
    },

    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {test: /\.css$/, use: ["style-loader", "css-loader"]},
      {
        test: /\.woff(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {name: "fonts/[name].[ext]", mimetype: "application/font-woff"}
        }
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {name: "fonts/[name].[ext]", mimetype: "application/font-woff2"}
        }
      },
      {
        test: /\.(otf|eot)(\?.*)?$/,
        use: {loader: "file-loader", options: {name: "fonts/[name].[ext]"}}
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {name: "fonts/[name].[ext]", mimetype: "application/octet-stream"}
        }
      },
      {
        test: /\.svg(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {name: "images/[name].[ext]", mimetype: "image/svg+xml"}
        }
      },
      {
        test: /\.(png|jpg)(\?.*)?$/,
        use: {loader: "file-loader", options: {name: "images/[name].[ext]"}}
      },

      /*       {
        test: /\.[tj]sx?$/,
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
      }, */

      {
        test: /\.[tj]sx?$/,
        //exclude: /node_modules/,
        include: [path.resolve(__dirname, "src")],
        use: [
          {loader: "babel-loader"},
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              onlyCompileBundledFiles: true,
              experimentalFileCaching: false
            }
          }
        ]
      },

      {
        test: /\.md$/,
        use: [
          {loader: "html-loader"},
          {
            loader: "markdown-loader",
            options: {
              highlight(code, lang) {
                if (!lang) {
                  lang = "jsx"
                }
                return Prism.highlight(code, Prism.languages[lang], lang)
              },
              smartypants: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new PreactRefreshPlugin(),
    new webpack.DefinePlugin({
      "process.env": {NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")}
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: HTML_TEMPLATE}),
  ]
}
