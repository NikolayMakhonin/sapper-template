/* eslint-disable object-shorthand */
const {registerSuite} = intern.getPlugin('interface.object')

registerSuite('product page', {
	'login works'() {
		console.log(this)
		return this.remote
			.get('https://xmika.com/')
			.then(text => {
			// assert.equal(text, 'Welcome!');
			})
	}
})
