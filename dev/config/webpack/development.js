const commonConfig = require('./base.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = function (env) {
    return webpackMerge(commonConfig(env), {
        mode: 'development',

        devtool: 'source-map',

        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            })
        ]
    });
};