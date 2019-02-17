// https://github.com/karma-runner/karma/issues/413
// karma.conf.js
module.exports = function (config) {
	config.set({
		browsers: ['chrome'],
		files   : [
			{
				pattern  : 'selenium/karma.js',
				webdriver: true
			}
		]
	})

	return config
}
