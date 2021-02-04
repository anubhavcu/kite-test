"use strict";
const awsLambdaFastify = require('aws-lambda-fastify')
const fastify = require('fastify')
const axios = require("axios")
const isProd = process.env.NODE_ENV === "production"
const fn = require("./_fn.js")
const Papa = require('papaparse')
const jwt = require('jsonwebtoken');
const { set_user_or_null } = require('./_fn.js');

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
app.register(require('fastify-formbody'))

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
	url:"/api/test",
	method:["GET"],
	handler: async (re, rep) => {
		return 'done'
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
			return request.user
		}

		else if (request.raw.method === "POST") {
			let user = {}
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
				const existing_team = await fn.get_one("teams", ['admin_emails', 'array-contains', tokenEmail])

				if (existing_team) {
					user = { team_id: existing_team.id, email: tokenEmail }
				}
				
				else {
					throw new Error("400::You don't have an active account. Please signup at KiteList.com/pro")
					const new_team_id = await fn.add_one("teams", {admin_emails: [tokenEmail], created_at:fn.timestamp_sc()})
					user = {team_id:new_team_id, email:tokenEmail}
				}

				if (!user.team_id || !user.email) {
					throw new Error("400::There was an error logging you in. Please try again later")
				}
				const longLivedToken = jwt.sign({ data: user }, jwt_secret, { expiresIn: '90 days' })
				return { token: longLivedToken }
			} 
			
			else { // Send short lived token
				const email = fn.validate_email(body.email)

				const team = await fn.get_one("teams", ['admin_emails', 'array-contains', email])
				if (!team){
					throw new Error("400::You don't have an active account. Please signup at KiteList.com/pro")
				}

				const shortLifeToken = jwt.sign({ data: { email: email } }, jwt_secret, { expiresIn: '1h' })
				const tokenUrl = `${body.url || process.env.KITELIST_BASE_URL}/auth?token=${shortLifeToken}`

				if (!isProd) {
					console.log('\x1b[36m', `In production we would email: ${email} the link:`, '\x1b[32m', `${tokenUrl}`, '\x1b[0m');
					return { status: "Ok" }
				} else {
					const email_config = { action_url: tokenUrl }
					const html = " <p><h1>Hey there!</h1><br><br>Use this link to login: <br><br> <a href='login_link'>login_link</a></p>".replace(/login_link/g, tokenUrl)
					const email_sent = await fn.sendEmail(email, null, null, html)
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
		const search_term = request.params.search_term.toLowerCase()
		const query = `site:https://twitter.com/i/lists/ OR site:twitter.com/*/lists ${search_term}`
		const params = {cx:process.env.KITELIST_CUSTOM_SEARCH_CX,q:query, key:process.env.KITELIST_CUSTOM_SEARCH_API_KEY, imgSize:"small", num:10}
	
		const cache = await fn.get_id("cached_searches", search_term)
		if (cache){
			console.log("returning cached ")
			return JSON.parse(cache.lists)
		}
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
		await fn.create_or_replace("cached_searches", search_term, {lists:JSON.stringify(lists), created_at:fn.timestamp_sc()})
		return lists
	}
})


app.route({
	url:"/api/host",
	method: ["GET"],
	handler: async (request, reply) => {
		return request.headers.host || "No host"
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
		const codes = require("./_appsumo_kitelist_codes.json")
		const code_exists = codes.includes(code)
		if (!code_exists){
			throw new Error("400::This code is wrong. Make sure that you paste the correct code")
		} else {
			const code_is_used = await fn.get_one("teams", ["billing.codes", "array-contains", code])
			if (code_is_used){
				throw new Error("400::Sorry this code has already been used")
			}
		}

		let existing_team = await fn.get_one("teams", ['admin_emails', 'array-contains', email])
		let team_id = existing_team ? existing_team.id : null
		if (!team_id){
			team_id = await fn.add_one("teams", {admin_emails: [email], created_at:fn.timestamp_sc()})
		}
		let billing = {plan:"AppSumo", codes:[code], created_at:now, edited_at:now} // One Year from now
		if (existing_team && existing_team.billing && existing_team.billing.codes){
			// Codes array already exists. SO we simply push the new code there (for multiple codes)
			billing = existing_team.billing
			billing.codes.push(code)
			billing.edited_at = now
		}
		await fn.update_one("teams", team_id, {billing:billing})
		return "Promotion Saved Correctly"	
	}
})



app.route({
	url: "/api/leads",
	method: ["POST"],
	preHandler:[set_user_or_null],
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
		const urls = links.map(link => link.toLowerCase() )
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
		const bucket = await fn.connectToBucket()
		const file = await bucket.file(`export_${now}.csv`)
		const write = await file.save(csvContent)
		const tsIn48Hours = now + (48 * 3600000); // 48h
		const url = await file.getSignedUrl({ action: 'read', expires: tsIn48Hours}).then(signedUrls => signedUrls[0])
		// Send CSV via email
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
exports.handler = awsLambdaFastify(app)
}