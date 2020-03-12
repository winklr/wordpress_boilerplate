const TerserPlugin = require('terser-webpack-plugin')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')

const commonConfig = require('./base.js')

module.exports = webpackMerge(commonConfig, {
    mode: 'production',

    performance: {
        hints: false
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: 6
            }
        })
    ]
})
