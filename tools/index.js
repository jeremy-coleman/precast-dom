//require('sucrase/register')

const sucrasify = require("./sucrasify")
//const aliasify = require("./aliasify")
//const browserify = require("./browserify")
//const watchify = require("./watchify")
const hmr = require("./hmr-plugin")
const BrowserifyMiddleware = require("./browserify-middleware")
//const tsxify = require('./tsify')
const {browserify , watchify} = require("./browserify")
//const {createServer, static_middleware } = require('./http-server')

module.exports = {
    //tsxify,
    //aliasify,
    sucrasify,
    watchify,
    browserify,
    hmr,
    BrowserifyMiddleware
}