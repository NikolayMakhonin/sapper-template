/* eslint-disable no-process-env */
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
import postcss from 'rollup-plugin-postcss'
import path from 'path'
import postcssImport from 'postcss-import'
import cssnano from 'cssnano'
import preprocess from 'svelte-preprocess'
import themesPreprocess from 'svelte-themes-preprocess'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = true // dev || !!process.env.SAPPER_LEGACY_BUILD
console.log('legacy: ', legacy)

const postcssOptions = {
	// see: https://github.com/postcss/postcss
	plugins: [
		postcssImport(),
		// cssnano({
		// 	preset: [
		// 		'default', {
		// 			discardComments: {
		// 				removeAll: true,
		// 			},
		// 		}
		// 	],
		// })
	]
}

const sveltePreprocess = preprocess({
	scss   : true,
	pug    : true,
	postcss: Object.assign(postcssOptions, {

	})
})

const svelteOptions = {
	dev,
	// see: https://github.com/Rich-Harris/svelte-preprocessor-demo
	preprocess: themesPreprocess(
		path.resolve('./src/styles/themes.scss'),
		sveltePreprocess,
		{
			lang: 'scss'
		}
	)
}

export default {
	client: {
		input  : config.client.input(),
		output : config.client.output(),
		plugins: [
			replace({
				'process.browser'     : true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte(Object.assign(svelteOptions, {
				hydratable: true,
				emitCss   : true
			})),
			resolve(),
			commonjs(),

			legacy && babel({
				extensions    : ['.js', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude       : ['node_modules/@babel/**'],
				...require('./.babelrc')
			}),

			terser({
				module: true,
				ecma  : 5
			})
		],
	},

	server: {
		input  : config.server.input(),
		output : config.server.output(),
		plugins: [
			replace({
				'process.browser'     : false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			postcss(Object.assign(postcssOptions, {
				sourceMap: 'static/slyles.css.map',
				extract  : 'static/slyles.css',
			})),
			svelte(Object.assign(svelteOptions, {
				generate: 'ssr'
			})),
			resolve(),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules || Object.keys(process.binding('natives'))),
	},

	serviceworker: {
		input  : config.serviceworker.input(),
		output : config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser'     : true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		]
	}
}
