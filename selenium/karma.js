// webdriver_test.js
var assert = require('assert');

// This gives you the browser that is currently run
// Initialization and connection is all done by Karma
var browser = karma.getBrowser();

browser.on('status', function(info) {
	console.log(info);
});

browser.on('command', function(meth, path, data) {
	console.log(' > ' + meth, path, data || '');
});

browser.on('ready', function() {
	browser.get("http://admc.io/wd/test-pages/guinea-pig.html", function() {
		browser.title(function(err, title) {
			assert.ok(~title.indexOf('I am a page title - Sauce Labs'), 'Wrong title!');
			browser.elementById('i am a link', function(err, el) {
				browser.clickElement(el, function() {
					browser.eval("window.location.href", function(err, href) {
						assert.ok(~href.indexOf('guinea-pig2'));
						browser.quit();
					});
				});
			});
		});
	});
});