const commonConfig = require('./base.js')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')

module.exports = webpackMerge(commonConfig, {
    mode: 'development',

    devtool: 'source-map',

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
})
