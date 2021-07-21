const isProd = process.env.NODE_ENV === "production"
const useProxy = process.env.NODE_ENV === "development" && !process.env.NETLIFY

console.log(`Building KiteList: [production: ${isProd}] - [Environment: ${process.env.NODE_ENV}]`)

export default {
	ssr: true, // Universal mode
	target: 'static',
	telemetry: false,
	components: true,
	publicRuntimeConfig: { // Available in the frontend
		KITELIST_BASE_URL:process.env.KITELIST_BASE_URL,
		KITELIST_STATIC_FORMS_KEY:process.env.KITELIST_STATIC_FORMS_KEY
	},
	privateRuntimeConfig: {},
	head: {
		title: 'Kite List | Twitter Lists Search Engine & Exporter',
		meta: [
			{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'og:title',
				name: 'og:title',
				content: 'Kite List | Twitter Lists Search Engine & Exporter'
			},
			{
				hid: 'og:description',
				name: 'og:description',
				content: 'Find Twitter lists in your niche, explore the data and download all the subscribers and members'
			},
			{
				hid: 'description',
				name: 'description',
				content: 'Find Twitter lists in your niche, explore the data and download all the subscribers and members'
			},
			{ 
				hid: 'og:image', 
				property: 'og:image', 
				content: `${process.env.KITELIST_BASE_URL}/kitelist.png`
			}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},
	googleAnalytics: { id: 'UA-153958572-1'},
	loading: {
		color: '#fff'
	},
	css: [],
	modules: ['@nuxtjs/axios', '@nuxtjs/auth', '@nuxtjs/sentry', '@nuxtjs/sitemap'],
	buildModules: ['@nuxtjs/tailwindcss', '@nuxtjs/proxy'],
	plugins:[
		{ src: '~/plugins/shared.js'},
		{ src: '~/plugins/axios.client.js', mode:'client'},
		{ src: '~/plugins/ga.client.js', mode:'client'}
	],
	router: {
		trailingSlash: false
	},
	axios: {
		retry: { retries: 0 },
		baseURL: process.env.KITELIST_BASE_URL
	},
	sitemap:{
		hostname:process.env.KITELIST_BASE_URL,
		exclude:['account']
	},
	tailwindcss: {
		configPath: '~/tailwind.config.js',
		cssPath: '~/assets/tailwind.css',
		purgeCSSInDev: false,
		exposeConfig:false
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
	generate: {
		exclude: [
		  /^\/api\// // path starts with /api/ - Otherwise they get generated and it return a 404
		]
	}

}
