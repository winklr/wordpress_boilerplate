const webpack = require('webpack');

module.exports = function(env) {
    const opts = {
        entry: {
            main: './src/assets/js/main.js'
        },
        output: {
            filename: '[name].[contenthash:8].js'
        },
        optimization: {
            runtimeChunk: false, // enable 'runtime' chunk
            splitChunks: {
                cacheGroups: {
                    default: false,
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        minChunks: 1
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: ['babel-loader']
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jquery: "jquery"
            })
        ],
        resolve: {
            alias: {
                // add script aliases if needed
            }
        },
        mode: 'development'
    };

    return opts;
};

