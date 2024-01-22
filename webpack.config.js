const path = require('node:path');
const html = require('html-webpack-plugin');
const css = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: 'none',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		clean: true,
		publicPath: '/'
	},
	optimization: {
		minimize: isProduction
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'src')
		},
		hot: true,
		server: 'http',
		historyApiFallback: true
	},
	devtool: isProduction ? false : 'source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(sass|scss|css)$/i,
				use: [
					{
						loader: css.loader
					},
					'css-loader',
					'sass-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name][ext]'
				}
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new html({
			icon192: isProduction ? '/favicon/favicon.ico' : '/assets/favicon/favicon.ico',
			icon512: isProduction ? '/favicon/favicon.ico' : '/assets/favicon/favicon.ico',
			manifest: isProduction ? '/app.webmanifest' : '/assets/app.webmanifest',
			template: path.resolve(__dirname, 'src/index.html'),
			minify: {
				collapseWhitespace: true,
				keepClosingSlash: false,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new css({
			filename: isProduction ? '[name].[fullhash].css' : '[name].css'
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets'),
					to: 'assets'
				}
			]
		}),
		new FileManagerPlugin({
			events: {
				onEnd: [
					{
						copy: [
							{
								source: path.resolve(__dirname, 'src/assets/favicon/**'),
								destination: 'dist/favicon'
							}
						]
					},
					{
						copy: [
							{
								source: path.resolve(__dirname, 'src/assets/app.webmanifest'),
								destination: 'dist/'
							}
						]
					}
				]
			}
		})
	]
};
