const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: "./hook/hook.ts", // bundle"s entry point
    output: {
        path: path.resolve(__dirname, "dist"), // output directory
        filename: "[name].js", // name of the generated bundle
    },
    resolve: {
        extensions: [".js", ".ts", ".json", ".tsx"],
    },

    mode: "development",

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },

            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    presets: [
        "@babel/env",
        "@babel/react",
        "@babel/preset-typescript"
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties"
    ],
    plugins: [
        new HtmlWebpackPlugin({
            template: "./hook/index.html",
            inject: "body",
        }),
        new webpack.DefinePlugin({
            'process.env.CONTRACT_ADDRESS': JSON.stringify(process.env.CONTRACT_ADDRESS),
            'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
        }),
    ],

    watch: true,

    devServer: {
        historyApiFallback: true,
        contentBase: './',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    
    devtool: 'source-map'
};
