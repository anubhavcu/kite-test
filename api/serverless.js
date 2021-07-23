"use strict";
const serverless = require('serverless-http')
const fastify = require('fastify')
const axios = require("axios")
const isProd = process.env.NODE_ENV === "production"
const fn = require("./_fn.js")
const jwt = require('jsonwebtoken');
const Sentry = require("@sentry/node");

const crypto = require('crypto');
const hash = (string) => crypto.createHash('sha256').update(string, 'utf8').digest('hex');

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
	max: 15,
	ban:3,
	timeWindow: 30000 // '30 seconds'
})

// Form body (for Paddle webhooks)
// app.register(require('fastify-formbody'))

// Decorate request (https://github.com/fastify/fastify/issues/1555)
app.decorateRequest('user', null)


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
	let error_code = 500;
	let error_message = "Sorry there has been a server error.."

	if (error.validation){
		reply.status(406)
		const uniques_validation_errors = [... new Set(error.validation.map(val => `${val.dataPath} ${val.message} (${JSON.stringify(val.params)})`))]
		error_message = uniques_validation_errors.join(" && ")
		error_code = 400
	}
	else {
		const code_and_message = error.message.split("::")
		error_code = code_and_message.length > 1 ? code_and_message[0] : 500
		error_message = code_and_message.length > 1 ? code_and_message[1] : error_message
	}
	
	if (isProd) {
		Sentry.init({ dsn: process.env.KITELIST_SENTRY_FASTIFY })
		Sentry.captureException(error);
		await Sentry.flush(2000);
	}
	else {
		console.log("\x1b[31m", error, "\x1b[0m")
	}
	
	reply.status(error_code)
	throw new Error(error_message)
})

// Routes


app.route({
	url:"/api/test",
	method:["GET"],
	handler: async (request, reply) => {
		const lists = await fn.get_many("cached_searches")
		const lengths = lists.map(l => JSON.parse(l.lists).length)
		return lengths.reduce((a, b) => a + b, 0)
	}
})

app.route({
	url:"/api/billing",
	method:["POST", "PUT"],
	handler: async (request, reply) => {
		if (request.method === "POST") { // Stripe
			const {body} = request
			const stripe = body.data.object

			if (!['customer.subscription.deleted', 'checkout.session.completed'].includes(body.type)){
				return "endpoint not in use"
			}

			if (body.type === "customer.subscription.deleted"){
				const user = await fn.get_one("users", ["billing.stripe_customer", "==", stripe.customer])
				if (!user){
					throw new Error("400::We can't update this customer because we didn't find it in the database")
				}
				await fn.update_one("users", user.id, {...user.billing, cancel_at:stripe.cancel_at, plan:"deleted"})
			}

			else { // most likely create a new customer
				const stripe_email = stripe.customer_details.email
				const email = fn.validate_email(stripe_email)
				const new_billing = {
					stripe_customer:stripe.customer,
					stripe_mode:stripe.mode,
					plan:stripe.mode==='subscription' ? 'subscription' : 'lifetime',
					stripe_subscription: body.type==="customer.subscription.updated" ? stripe.id : stripe.subscription,
					cancel_at:stripe.cancel_at || null
				}
				
				const user = await fn.get_one("users", ["email", "==", email])
				if (user){ // Update him
					await fn.update_one("users", user.id, {...user.billing, ...new_billing})
					
				} else { // Create him
					await fn.add_one("users", {email: email, created_at:fn.timestamp_sc(), billing:new_billing})
				}
			}
			return "Customer updated or created. Thanks"
		}
		else if (request.method === "PUT"){ // Show billing portal
			await fn.set_user(request)
			const user = await fn.get_id("users", request.user.id)
			const data = `customer=${user.billing.stripe_customer}&return_url=${process.env.KITELIST_BASE_URL + "/account"}`
			const headers = {
				"Authorization":`Bearer ${process.env.KITELIST_STRIPE_PRIVATE_KEY}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			const portal = await axios.post("https://api.stripe.com/v1/billing_portal/sessions", data, {headers}).then(r => r.data)
			return portal.url
		}
	}
})

app.route({
	url:"/api/get-profile/:screen_name/:type",
	method:["GET"],
	schema:{
		summary:"Download members & followers from profiles instead of lists",
		description: "THIS FUNCTION IS NOT ACTUALLY USED - But it could be useful sometimes",
		tags: [],
		params:{
			required:['screen_name', 'type'],
			properties: {
				screen_name:{ type:"string", minLength:1 },
				type:{ type:"string", enum:['followers', 'friends'] },
			}
		}
	},
	handler: async (request, reply) => {
		if (isProd){
			return "Sorry. This endpoint is not available in production"
		}
		const {screen_name, type} = request.params
		const token = process.env.KITELIST_TWITTER_API_KEY

		let users = []
		const url = `https://api.twitter.com/1.1/${type}/list.json?screen_name=${screen_name}`
		const payload = {count: "200", include_entities:false, skip_status:true}
		let cursor = -1
		while (cursor !== 0) {
			const {data} = await axios.get(url, { headers : {"Authorization": `Bearer ${token}`}, params:{...payload, cursor:cursor}})
			users = [...users, ...data.users]
			cursor = data.next_cursor
		}
		const csv_url = await fn.json2CsvUrl(users, `${screen_name}_${type}`)
		reply.redirect(csv_url)
		return csv_url
	}
})


app.route({
	url: "/api/auth",
	method: ["POST", "GET"],
	preHandler:[fn.set_user_or_null],
	schema:{
		summary:"Converts or sends JWT",
		description: 'Convert JWT to a long lived one or Send a short lived JWT via email',
		tags: ['auth'],
	},
	handler: async (request, reply) => {
		if (request.raw.method === "GET"){
			return request?.user?.id ? await fn.get_id("users", request.user.id) : null
		}

		else if (request.raw.method === "POST") {
			const jwt_secret = process.env.KITELIST_JWT_PRIVATE
			const body = request.body
			if (body.token) { // Convert short-lived token to long-lived one
				const token = jwt.verify(body.token, jwt_secret, (error, result) => {
					if (error) {
						throw new Error(`401::${error.name}: ${error.message}`)
					}
					return result.data
				})

				const tokenEmail = fn.validate_email(token.email)
				const existing_user = await fn.get_one("users", ["email", "==", tokenEmail])
				if (!existing_user) {
					// This should be impossible because a short lived token was already generated
					throw new Error("400::You don't have an active account. Please signup at KiteList.com/price")
				}
				const longLivedToken = jwt.sign({ data: {id:existing_user.id} }, jwt_secret, { expiresIn: '90 days' })
				return { token: longLivedToken }
			} 
			
			else { // Send short lived token
				const email = fn.validate_email(body.email)
				const user = await fn.get_one("users", ["email", "==", email])
				if (!user){
					throw new Error("400::You don't have an active account. Please signup at KiteList.com/price")
				}
				const shortLifeToken = jwt.sign({ data: { email: email } }, jwt_secret, { expiresIn: '1h' })
				const tokenUrl = `${body.url || process.env.KITELIST_BASE_URL}/auth?token=${shortLifeToken}`

				if (!isProd) {
					console.log('\x1b[36m', `In production we would email: ${email} the link:`, '\x1b[32m', `${tokenUrl}`, '\x1b[0m');
					return { status: "Ok" }
				} else {
					const email_sent = await fn.sendLoginEmail(email, tokenUrl)
					console.log({email_sent})
					if (!email_sent) {
						throw new Error(`400::There was an error sending the login email to ${email}`)
					}
					return {email_sent: email_sent}
				}
			}
		}
	}
})

app.route({
	url: "/api/lists/:search_term",
	method: ["GET"],
	schema:{
		params:{
			required:['search_term'],
			properties:{
				search_term:{
					type:"string",
					minLength:1,
					maxLength:50,
				}
			}
		}
	},
	handler: async (request, reply) => {
		const search_term = decodeURIComponent(request.params.search_term).toLowerCase()
		const cache_id = hash(search_term)
		const query = `site:https://twitter.com/i/lists/ OR site:twitter.com/*/lists ${search_term}`
		const params = {cx:process.env.KITELIST_CUSTOM_SEARCH_CX, q:query, key:process.env.KITELIST_CUSTOM_SEARCH_API_KEY, imgSize:"small", num:10}
		const cache = await fn.get_id("cached_searches", cache_id)
		if (cache){
			console.log("CACHED")
			return JSON.parse(cache.lists)
		}
		// Throw an error if more than 1K daily searches 
		// (Safety measure to prevent massive bills in case of DDoS attack - Since no login is required for this endpoint)
		const now = fn.timestamp_sc()
		const last24h = now - 86400
		const all_searches = await fn.get_many("cached_searches", ['created_at', ">", last24h]) || []
		if (all_searches.length > 1000){
			throw new Error("400::The system is over it's capacity. Please try again in 24 hours")
		}
		// Find lists on top 5 pages
		let lists = []
		const pages = [1,11,21,31,41]	
		for (let page of pages) {
			params['start'] = page
			const pageLists = await axios.get("https://www.googleapis.com/customsearch/v1/siterestrict", {params:params})
			.then(r => {return r.data.items || false})
			.catch(e => {console.log(e); return false} )
			
			if (pageLists){
				const cleanLists = pageLists.map(e => ({title:e.title, link:e.link, snippet:e.snippet, members:null, subscribers:null, image:(e.pagemap && e.pagemap.cse_image) ? e.pagemap.cse_image[0].src : null, }))
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
		await fn.create_or_replace("cached_searches", cache_id, {search_term:search_term, lists:JSON.stringify(lists), created_at:fn.timestamp_sc()})
		return lists
	}
})

app.route({
	url: "/api/appsumo",
	method: ["POST"],
	schema:{
		summary:"Saves promo codes to the user",
		description: 'Saves Promos',
		tags: ['settings']
	},
	handler: async (request) => {
		const now = fn.timestamp_sc()
		let {email, code} = request.body
		email = fn.validate_email(email)
		let billing = {plan:"AppSumo", codes:[code], created_at:now, edited_at:now}
		if (code === 'free-user-261'){
			// Simple function to add a free user
			billing.plan = "Free"
		}
		else {
			billing.plan = "AppSumo"
			const codes = require("./_appsumo_kitelist_codes.json")
			const code_exists = codes.includes(code)
			if (!code_exists){
				throw new Error("400::This code is wrong. Make sure that you paste the correct code")
			} else {
				const code_is_used = await fn.get_one("users", ["billing.codes", "array-contains", code])
				if (code_is_used){
					throw new Error("400::Sorry this code has already been used")
				}
			}
		}

		let existing_user = await fn.get_one("users", ['email', '==', email])
		let user_id = existing_user ? existing_user.id : null
		if (!user_id){
			user_id = await fn.add_one("users", {email: email, created_at:fn.timestamp_sc()})
		}
		
		if (existing_user && existing_user.billing && existing_user.billing.codes){
			// Codes array already exists. 
			// SO we simply push the new code there (for multiple codes)
			billing = existing_user.billing
			billing.codes.push(code)
			billing.edited_at = now
		}
		await fn.update_one("users", user_id, {billing:billing})
		return "Promotion Saved Correctly"	
	}
})



app.route({
	url: "/api/leads",
	method: ["POST"],
	preHandler:[fn.set_user],
	schema:{
		body:{
			required:['download', 'links'],
			properties:{
				download:{
					type:"number",
					enum:[0,1,2]
				},
				links:{
					type:"array",
					minItems:1,
					items:{
						type:"string",
						pattern: "^https://twitter.com/"
					}
				}
			}
		}
	},
	handler: async (request, reply) => {
		const {download, links} = request.body
		const {user} = request

		const today = new Date()
		const date = `${today.getFullYear()}_${today.getMonth()}`

		// Check if goes above the limit
		const db_user = await fn.get_id("users", request.user.id)
		if (!db_user){
			throw new Error("400::This user was not found in the database")
		}
		const plan = db_user?.billing?.plan
		if (plan === "deleted"){
			throw new Error("400::This account has been deleted. Please email us if you think it's a mistake!")
		}

		let download_counter = db_user.download_counter || {}
		const current_downloads = download_counter[date] || 0

		const codes = db_user?.billing?.codes || []
		if (plan === "AppSumo" && codes.length === 1){ // Light AppSumo plans are restricted to 15 downloads a month
			const max_downloads = 15
			if (max_downloads && (current_downloads > max_downloads)){
				throw new Error("400::You have reached your monthly download limit. The limit will reset at the beginning of next month")
			}
		}

		const urls = links.map(link => link.toLowerCase() )
		let apiData = []
		let endpoints = [
			{type:"subscriber", url:"https://api.twitter.com/1.1/lists/subscribers.json"}, 
			{type:"member", url:"https://api.twitter.com/1.1/lists/members.json"}
		]
		if (download !== 2) { endpoints = [endpoints[download]] }
		for (const endpoint of endpoints) {
			const type = endpoint.type
			const headers = {"Authorization": `Bearer ${process.env.KITELIST_TWITTER_API_KEY}` }
			const apiCalls = []

			for (let url of urls) {

				const payload = {count: "5000", include_entities:false, skip_status:true}
				let list_ok = false;
				if (url.includes("https://twitter.com/i/lists/")){
					const list_id = url.replace('https://twitter.com/i/lists/','').split(/[/, ?, #]+/)
					if (list_id && list_id.length){
						list_ok = true
						payload.list_id = list_id[0]
					}
				}
				else {
					const values = url.replace('https://twitter.com/','').split('/lists/')
					const [owner_screen_name, slug] = values
					if (!owner_screen_name || !slug){
						console.error(`The url: ${url} is malformed`)
					} else {
						payload.owner_screen_name = owner_screen_name
						payload.slug = slug.split(/[/, ?, #]+/)[0]
						list_ok = payload.slug.length && payload.owner_screen_name.length
					}
				}
				if (list_ok){                       
					apiCalls.push(axios.get(endpoint.url, {params:payload, headers:headers})
					.then(r => r.data)
					.catch(e => {
						if (e.response && e.response.data && e.response.data.errors) {
							console.error(`Twitter list errors: ${JSON.stringify(e.response.data.errors)}`)
						}
						return null
					}))
				}
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
		// Storage
		const url = await fn.json2CsvUrl(apiData, 'list')
		// Update user limits
		download_counter[date] = current_downloads + 1
		await fn.update_one("users", user.id, {download_counter:download_counter})
		return {url:url}
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
exports.handler = serverless(app)
}