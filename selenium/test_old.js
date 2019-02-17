const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

// Docs:
// https://www.npmjs.com/package/selenium-webdriver
// https://seleniumhq.github.io/selenium/docs/api/javascript/index.html
// https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/

const chromeOptions = new chrome.Options()
chromeOptions.setBinary('l:/Program Files (x86)/Chromium/33.0.1750.170/')
const driver = new webdriver.Builder()
	.forBrowser('chrome')
	.setChromeOptions(chromeOptions)
	.build()

driver
	.get('http://www.google.com/ncr')