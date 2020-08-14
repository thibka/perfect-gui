/* eslint-disable */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let config = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './build'),
		filename: './bundle.js'
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|mp3|woff|woff2|eot|ttf|otf|obj)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(svg)$/i,
				use: [
				  'file-loader',
				  {
					loader: 'image-webpack-loader',
					options: {
					  bypassOnDebug: true,
					},
				  },
				],
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				type: 'javascript/auto',
				test: /\.json$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
		]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
		watchContentBase: true,
		port: 8000
    },
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			minify: false,
			filename: './index.html',
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		})
	],
	
};

module.exports = config;