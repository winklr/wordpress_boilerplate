const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        main: './src/assets/js/main.js'
    },
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }

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
    devtool: 'source-map',
    mode: 'production'
};

