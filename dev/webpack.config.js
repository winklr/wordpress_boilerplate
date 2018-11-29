module.exports = function (env) {
    var filename;

    if (env === 'development') filename = 'development.js';
    else if (env === 'production') filename = 'production.js';

    return require('./config/webpack/' + filename)(env);
};