const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function(env) {
    const tsconfigPath = path.join('', 'src/tsconfig.json');

    return {
        entry: {
            main: './src/assets/js/main.ts'
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
                    test: /\.tsx?$/,
                    //include: path.join(__dirname, 'src'),
                    loaders: [
                        'cache-loader',
                        {
                            loader: 'thread-loader',
                            options: {
                                workers: 2
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                plugins: ['@babel/plugin-transform-runtime'],
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            useBuiltIns: 'entry',
                                            corejs: 3
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: tsconfigPath,
                                happyPackMode: true,
                                transpileOnly: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jquery: "jquery"
            }),
            new ForkTsCheckerWebpackPlugin({
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                tsconfig: tsconfigPath
            }),
        ],
        resolve: {
            extensions: ['.js', '.ts', '.tsx', '.json'],
            plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
            alias: {
                // add script aliases if needed
            }
        },
        mode: 'development'
    };
};
