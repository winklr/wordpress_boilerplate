const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonConfig = require('./base.js');

module.exports = function (env) {
    return webpackMerge(commonConfig(env), {
        mode: 'production',

        optimization: {
            runtimeChunk: 'single', // enable 'runtime' chunk

            // splitChunks: {
            //     cacheGroups: {
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             name: 'vendors',
            //             enforce: true,
            //             chunks: 'all'
            //         }
            //     }
            // },

            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    uglifyOptions: {
                        beautify: false,
                        mangle: {
                            ie8: false,
                            keep_fnames: true
                        },
                        compress: {
                            warnings: false,
                            ie8: false
                        },
                        comments: false
                    }
                })
            ]
        },

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
            })
        ]
    });
};
