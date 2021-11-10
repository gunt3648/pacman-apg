module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'plugin:nuxt/recommended'
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		indent: [2, 'tab'],
		'vue/html-indent': ['error', 'tab'],
		'no-tabs': 0
	}
}
