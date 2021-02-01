"use strict";
const awsLambdaFastify = require('aws-lambda-fastify')
const fastify = require('fastify')
const axios = require("axios")
// const { parse } = require('node-html-parser')
const isProd = process.env.NODE_ENV === "production"
const db = require("./_utils/db.js")
const Papa = require('papaparse')

const app = fastify({
	ajv: {
		customOptions: {
			removeAdditional: 'all',
			useDefaults: true,
			coerceTypes: true,
			allErrors: false,
			nullable: true
		}
	}
})

// HELMET SECURITY HEADER
app.register(require('fastify-helmet'), {
	frameguard:false
})

// Rate limiting 
app.register(require('fastify-rate-limit'), {
	max: 200,
	ban:3,
	timeWindow: 60000 // '1 minute'
})

// Form body (for Paddle webhooks)
app.register(require('fastify-formbody'))


// Set Caching Headers for ALL non-auth requests (Used by Vercel)
app.addHook('onSend', async (request, reply, payload) => {
	if (!request.headers.authorization) {
		reply.headers({
			'Cache-Control': 's-maxage=6000, stale-while-revalidate'
		})
	}
	return payload
})

// Error Handler
app.setErrorHandler(async (error, req, reply) => {
	if (error.validation){
		reply.status(406)
		const uniques_validation_errors = [... new Set(error.validation.map(val => `${val.dataPath} ${val.message} (${JSON.stringify(val.params)})`))]
		const validation_errors = uniques_validation_errors.join(" && ")
		console.log("\x1b[33m", validation_errors, "\x1b[0m")
		throw new Error (validation_errors)
	}
	const code_and_message = error.message.split("::")
	const statusCode = code_and_message.length > 1 ? code_and_message[0] : 500
	reply.status(statusCode)
	if (statusCode === 500) {
		if (isProd) {
			const Sentry = require("@sentry/node");
			Sentry.init({ dsn: process.env.KITELIST_SENTRY_FASTIFY })
			Sentry.captureException(error);
			await Sentry.flush(2000);
		}
		else {
			console.log("\x1b[31m", error, "\x1b[0m")
		}
		throw new Error("Sorry there has been a server error..")
	} 
	else {
		throw new Error(code_and_message.length ? code_and_message[1] : code_and_message)
	}
})



app.route({
	url: "/api/hello",
	method: ["GET"],
	handler: async (request, reply) => {
		const x = "https://twitter.com/i/lists/1266232269099773953"
		
		const headers = {"Authorization": "Bearer "+process.env.KITELIST_TWITTER_API_KEY }
		const d = {list_id:"1266232269099773953"}
		try{
			const {data} = await axios.get("https://api.twitter.com/1.1/lists/members.json", {headers:headers, params:d})
			console.log(data)
		}
		catch(e){
			console.log(e.response.data)
		}
		return "done"
	}
})

 /// SERVER ///

 if (require.main === module) {
	// called directly i.e. "node app"
	app.listen(3030, (err) => {
	  if (err) console.error(err)
	  console.log('server listening on 3030')
	})
  } else {
	// required as a module => executed on aws lambda
	exports.handler = awsLambdaFastify(app)
}



app.route({
	url: "/api/lists/:search_term",
	method: ["GET"],
	handler: async (request, reply) => {
		const {search_term} = request.params
		const q = search_term.toLowerCase()
	
		const params = {cx:"013322004514320345947:mnxnibvixbl",q:q, key:process.env.KITELIST_CUSTOM_SEARCH_API_KEY, imgSize:"small", num:10}
	
		// Find lists on top 5 pages
		let lists = []
		const pages = [1,11,21,31,41]
		for (let page of pages) {
			params['start'] = page
			console.log(`Getting pages starting from index ${page}`)
			const pageLists = await axios.get("https://www.googleapis.com/customsearch/v1/siterestrict", {params:params})
			.then(r => {return r.data.items || false})
			.catch(e => {console.log(e); return false} )
			
			if (pageLists){
				const cleanLists = pageLists.map(e => ({title:e.title, link:e.link, snippet:e.snippet, members:null, subscribers:null, image:'cse_image' in e.pagemap ? e.pagemap.cse_image[0].src : null, }))
				lists = [...lists, ...cleanLists]
			} 
			
			else {
				console.error(`Error getting the custom search page ${page}`)
				break;
			}
			if (pageLists && pageLists.length < 10) {
				console.log("All done, exiting...")
				break;
			}
		}
	
		// Find Subs & Members of each lists
		// const apiCalls = lists.map(u => axios.get(u.link).then(r => r.data || null).catch(() => null))
		// await axios.all(apiCalls).then(args => {
		// 	args.forEach((html, i )=> {
		// 		// let st = [0,0]
		// 		if (html) { // 404 or other errors
		// 			const root = parse(html)
		// 			console.log(html)
		// 			let selector = root.querySelector('.stats')
		// 			if (selector){
		// 				const st = selector.structuredText.split("\n")
		// 				if (st.length == 2){
		// 					lists[i].members = parseInt(st[0].replace(/\D/g,''))
		// 					lists[i].subscribers = parseInt(st[1].replace(/\D/g,''))
		// 				} else {
		// 					console.error(`error with selectors length: Selectors are: ${selector}`)
		// 				}
		// 			} else {
		// 				console.error(`Selectors not found in the url ${lists[i].link}`)
		// 			}
		// 		} else {
		// 			console.error(`Error while scraping the url: ${lists[i].link}`)
		// 		}
		// 	})
		// })
		// myCache.set(q, lists)
		return lists
	}
})


app.route({
	url: "/api/leads",
	method: ["POST"],
	handler: async (request, reply) => {
		const {download, links} = request.body
		if (!links.length){
			throw new Error("400::Please select at least one link")
		}

		const urls = links.map(link => {
			if (link.startsWith('https://')){
				return link.toLowerCase()
			}
			else if (link.startsWith("http://")){
				link.replace("http://", "https://")
			}
			else {
				link = `https://${link}`
			}
			return link.toLowerCase()
		})

		let apiData = []
		let endpoints = ["https://api.twitter.com/1.1/lists/subscribers.json", "https://api.twitter.com/1.1/lists/members.json"]
		if (download !== 2) { endpoints = [endpoints[download]] }
		for (const [index, endpoint] of endpoints.entries()) {
			const type = ['subscriber', 'member'][index]
			const headers = {"Authorization": "Bearer "+process.env.KITELIST_TWITTER_API_KEY }
			const apiCalls = []

			for (let url of urls) {

				const payload = {count: "5000", include_entities:false, skip_status:true}

				if (url.includes("https://twitter.com/i/lists/")){
					url = url.replace("https://twitter.com/i/lists/", "")
					url = url.split("?")
					console.log(url)
					payload.list_id = url[0]
				}
				else {
					const path = url.replace("https://twitter.com/", "")
					const values = path.split("/lists/")
					if (values.length < 2) {
						console.error(`The path: ${path} is malformed`)
					} else {
						const [owner_screen_name, slug] = values
						payload.owner_screen_name = owner_screen_name
						payload.slug = slug
					}
				}
				console.log(payload)
				apiCalls.push(axios.get(endpoint, {params:payload, headers:headers}).then(r => r.data)
				.catch(e => {
					if (e.response && e.response.data && e.response.data.errors) {
						console.error(`Twitter list errors: ${JSON.stringify(e.response.data.errors)}`)
					}
					return null
				}))
			}

			await axios.all(apiCalls).then(lists => {
				lists.forEach((usersData, i ) => {
					if (usersData && usersData['users']) {
						const users = usersData['users'].map(u => ({list:links[i], type:type, handle:u.screen_name, name:u.name, location:u.location, description:u.description, url:u.url, followers:u.followers_count, following:u.friends_count, statuses:u.statuses_count}))
						apiData = [...apiData, ...users]
					} else {
						console.error(`Problem with list: ${links[i]}`)
					}
				})
			})
		}

		const csvBom = '\uFEFF' // Fix for Äö etc characters
		const csvContent = csvBom + Papa.unparse(apiData)

		// Storage
		const now = Math.round(new Date().getTime());
		const bucket = await db.connectToBucket()
		const file = await bucket.file(`export_${now}.csv`)
		const write = await file.save(csvContent)
		const tsIn48Hours = now + (48 * 3600000); // 48h
		const url = await file.getSignedUrl({ action: 'read', expires: tsIn48Hours}).then(signedUrls => signedUrls[0])
		// Send CSV via email
		return {url:url}
	}
})