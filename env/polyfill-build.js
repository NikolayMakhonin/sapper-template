/* eslint-disable no-shadow,global-require */
const path = require('path')
const rollup = require('rollup')
// const globals = require('rollup-plugin-node-globals')
// const builtins = require('rollup-plugin-node-builtins')
const babel = require('rollup-plugin-babel')
const {terser} = require('rollup-plugin-terser')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const fileInput = require.resolve('./polyfill-custom.js')
const fileOutput = path.resolve('./static/polyfill-custom.js')

async function doRollup(file) {
	const bundle = await rollup.rollup({
		input  : file,
		plugins: [
			// globals(),
			// builtins(),
			// babel({
			// 	runtimeHelpers: true
			// }),
			nodeResolve(),
			// nodeResolve({
			// 	jsnext: true,
			// 	main: true,
			// 	browser: true,
			// 	preferBuiltins: true,
			// }),
			commonjs(),
			babel({
				runtimeHelpers: true
			}),
			// terser()
		]
	})

	const result = await bundle.generate({
		format   : 'iife',
		sourcemap: false,
		exports  : 'named'
	})

	console.log(result.output[0].code)

	return result.output[0].code
}

async function transform(fileInput, fileOutput) {
	const content = await doRollup(fileInput)

	if (!content) {
		throw new Error('transformed content is empty')
	}

	const fs = require('fs')

	fs.writeFile(fileOutput, content, function (err) {
		if (err) {
			console.log(err)
			throw err
		}
	})
}

transform(fileInput, fileOutput)
	.then(() => {
		console.log('Polyfill build completed')
	})
