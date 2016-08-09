var Logger = require('bunyan');
log = new Logger.createLogger({
    name: 'Realbuy-api',
    serializers: {
        req: Logger.stdSerializers.req
    }
});

module.exports = log;