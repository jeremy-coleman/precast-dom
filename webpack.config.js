const { resolve } = require('path');
const webpack = require('webpack');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsPathPlugin = require('tsconfig-paths-webpack-plugin')
const outputPath = resolve(__dirname, 'dist', 'app');
const remarkHighlight = require('remark-highlight.js')


//const Prism = require('./vendor/prism')


const ENTRY_FILE = './src/index.tsx'
const HTML_TEMPLATE = "./src/index.html"


module.exports = {
  watch: true,
  mode: 'development',
  //stats:"minimal",
  target: "web",
  //devtool: 'inline-source-map',

	node: {
		process: 'mock',
		Buffer: false,
		setImmediate: false
  },
  
  entry: [ENTRY_FILE, 'webpack-plugin-serve/client'],
  output: {
    path: outputPath,
    publicPath: '/',
    filename: 'client.js'
  },
	resolve: {
    extensions: ['.jsx', '.js', '.json', '.mjs', '.ts', '.tsx'],
    alias: {
    //'react': 'preact/compat',
    // //'mobx-react': 'mobx-preact',
    //'react-dom': 'preact/compat',
    //'react-feather': 'preact-feather'
    // //path.join(__dirname, "node_modules/preact/compat/dist/compat.umd.js")
     },

    plugins:[
      new TsPathPlugin()
    ]
	},
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use:[{
        loader: 'ts-loader', 
        options: {
          transpileOnly: true,
          onlyCompileBundledFiles: true,
          allowTsInNodeModules: false,
          experimentalFileCaching: false
        }
      }],
      exclude: /node_modules/},
      //{test: /\.[tj]sx?$/,use:[{loader: 'babel-loader'}]},
      //{test: /\.mjs?$/,use:[]},
      //{test: /\.s?css$/,use: ['style-loader','css-loader','sass-loader']},
      {test: /\.css$/,use: ['style-loader','css-loader']},
      {test: /\.woff(\?.*)?$/,use: {loader: 'file-loader',options: {name: 'fonts/[name].[ext]',mimetype: 'application/font-woff'}}},
      {test: /\.woff2(\?.*)?$/,use: {loader: 'file-loader', options: {name: 'fonts/[name].[ext]',mimetype: 'application/font-woff2'}}},
      {test: /\.(otf|eot)(\?.*)?$/,use: {loader: 'file-loader',options: {name: 'fonts/[name].[ext]'}}},
      {test: /\.ttf(\?.*)?$/,use: { loader: 'file-loader',options: {name: 'fonts/[name].[ext]',mimetype: 'application/octet-stream'}}},
      {test: /\.svg(\?.*)?$/,use: {loader: 'file-loader',options: {name: 'images/[name].[ext]',mimetype: 'image/svg+xml'}}},
      {test: /\.(png|jpg)(\?.*)?$/,use: {loader: 'file-loader',options: {name: 'images/[name].[ext]'}}},
      {test: /\.less(\?.*)?$/, use: [
        {loader:'style-loader'},
        {loader:'css-loader'},
        {loader: 'less-loader',options: {javascriptEnabled: true}}
      ]},
      // {
      //   test: /\.md$/,
      //   use: [
      //     {
      //         loader: "html-loader"
      //     },
      //     {
      //       loader: "markdown-loader",
      //       options: {
      //         highlight(code, lang) {
      //           if (!lang) {
      //             lang = 'jsx'
      //           }
      //           return Prism.highlight(code, Prism.languages[lang], lang);
      //         },
      //         smartypants: true,
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.mdx$/,
        // include: babelLoader.include,
        use: [
          // {
          //   loader: babelLoader.loader,
          //   options: babelLoader.options
          // },
          {
            loader: '@mdx-js/loader',
            options: {
              mdPlugins: [remarkHighlight]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //new WebpackModules(),
    //new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({template: HTML_TEMPLATE}),
    new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify("production")}}),
    new Serve({
      hmr: true,
      host: "localhost",
      progress: false,
      historyFallback: true,
      static: [outputPath]
    })
  ]
};
