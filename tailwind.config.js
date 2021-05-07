const colors = require('tailwindcss/colors')

module.exports = {
	mode: 'jit',
	theme: {
		extend: {
			colors: {
				tw: "#1da1f2",
				lblue: colors.lightBlue
			}
		}
	},
	variants: {},
	plugins: [],
	purge: {
		enabled: process.env.NODE_ENV === "production",
		options: {
			safelist: ['loading']
		},
		content:[
			"~/components/**/*.{vue,js}",
			"~/layouts/**/*.vue",
			"~/pages/**/*.vue",
			"~/plugins/**/*.{js,ts}",
			"~~/nuxt.config.{js,ts}"
		]
	}
}
