
var createServer = require('./polka');
var static_middleware = require('./sirv')

module.exports = {
    createServer,
    static_middleware
}
