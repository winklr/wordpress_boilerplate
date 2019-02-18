const webpack = require('webpack');

module.exports = function(env) {
    const opts = {
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
                        presets: ['env']
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
        mode: 'development'
    };

    return opts;
};

