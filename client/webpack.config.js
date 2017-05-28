const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const getClientEnvironment = require('react-scripts/config/env');

const paths = {
    appSrc: path.resolve(process.cwd(), 'src'),
    appPublic: path.resolve(process.cwd(), 'public'),
    appHtml: path.resolve(process.cwd(), 'public/index.html'),
};
const env = getClientEnvironment('');


module.exports = {
    entry: [
        'react-hot-loader/patch',
        './src',
    ],
    output: {
        filename: 'static/js/bundle.js',
    },
    devtool: 'eval',
    module: {
        rules: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                ],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.(js|jsx)$/,
                include: paths.appSrc,
                loader: require.resolve('babel-loader'),
                query: {
                    plugins: [
                        'react-hot-loader/babel'
                    ]
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        new InterpolateHtmlPlugin(env.raw),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
        contentBase: paths.appPublic,
        hot: true,
        hotOnly: true,
        port: 8080,
        historyApiFallback: true,
    }
}
