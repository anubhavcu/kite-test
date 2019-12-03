export default {
	mode: 'universal',
	head: {
		title: 'Jump.sh | Twitter Lists Search Engine',
		meta: [{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: 'Find Twitter lists in your niche, explore the data and download all the subscribers and members'
			}
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.ico'
		}]
	},

	loading: {
		color: '#fff'
	},
	css: ['~/assets/tailwind.css'],
	buildModules: ['@nuxtjs/tailwindcss'],
	modules: ['@nuxtjs/axios'],
	axios: {
		retry: { retries: 3 },
		baseURL:"http://localhost:3000"
	},
	tailwindcss: {
		configPath: '~/tailwind.config.js',
		cssPath: '~/assets/tailwind.css'
	},
	generate: {
		fallback: true,
		subFolders: false, // to remove ending / on Netlify
	},
	build: {
		postcss: {
			plugins: {
				tailwindcss: './tailwind.config.js'
			}
		},
		extend(config, ctx) {}
	}

}
