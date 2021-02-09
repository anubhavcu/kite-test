const isProd = process.env.NODE_ENV === "production"
const useProxy = process.env.NODE_ENV === "development" && !process.env.NETLIFY
export default {
	ssr: true, // Universal mode
	target: 'static',
	telemetry: false,
	components: false,
	publicRuntimeConfig: {}, // Available in the frontend
	privateRuntimeConfig: {
		KITELIST_BASE_URL: process.env.KITELIST_BASE_URL, //process.env.VERCEL_URL || process.env.KITELIST_BASE_URL,
		KITELIST_SENTRY_NUXT: process.env.KITELIST_SENTRY_NUXT,
		NODE_ENV: process.env.NODE_ENV
	},
	head: {
		title: 'Kite List | Twitter Lists Search Engine',
		meta: [
			{
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
			},
			{ 
				hid: 'og:image', 
				property: 'og:image', 
				content: "/banner.png"
			}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		],
		script: [ { src: 'https://cdn.paddle.com/paddle/paddle.js' } ]
	},
	googleAnalytics: { id: 'UA-153958572-1'},
	loading: {
		color: '#fff'
	},
	css: ['~/assets/tailwind.css'],
	modules: ['@nuxtjs/axios', '@nuxtjs/auth'],
	buildModules: ['@nuxtjs/tailwindcss', '@nuxtjs/proxy', '@nuxtjs/google-analytics'],
	plugins:[{ src: '~/plugins/shared.js'}],
	axios: {
		retry: { retries: 3 },
		baseURL: process.env.KITELIST_BASE_URL
	},
	tailwindcss: {
		configPath: '~/tailwind.config.js',
		cssPath: '~/assets/tailwind.css'
	},
	proxy: useProxy ? ['http://localhost:3030/api'] : false,
	sentry: {
		dsn: isProd ? process.env.KITELIST_SENTRY_NUXT : null
	},
	auth: {
		cookie: false,
		strategies: {
			local: {
				endpoints: {
					login: { url: '/api/auth', method: 'post', propertyName: 'token', withCredentials: false },
					user: { url: '/api/auth', method: 'get', propertyName: false, withCredentials: true },
					logout: false
				}
			}
		},
		redirect: {login: "/auth", logout: false, callback: false, home: false }
	},
	content: {
		markdown: {
		  prism: {
			theme: 'prismjs/themes/prism-tomorrow.css'
		  }
		},
		liveEdit: false
	},
	build: {
		terser: {
			terserOptions: {
			  compress: {
				drop_console: isProd
			  }
			}
		},
		extend(config, ctx) {			
		}
	},

}
