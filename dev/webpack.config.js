module.exports = function(env) {
    return env === 'production'
        ? require('./config/webpack/production')
        : require('./config/webpack/development')
}
