]const Papa = require('papaparse');
const axios = require('axios')
const custom_search = process.env.CUSTOM_SEARCH_API_KEY
const token = process.env.TWITTER_API_KEY

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 14400, checkperiod: 300 } );

module.exports = async (req, res) => {
	if (req.method == "POST") {
		const links = req.body.links || []
		const download = req.body.download // 0, 1 or 2
		if (!links.length){
			return res.status(400).json({error:"You need to select at least one list"})
		}
		const cacheName = links.join("-")
		const cachedValue = myCache.get(cacheName)
		if (cachedValue){ return res.status(200).json(cachedValue) }
		let apiData = []
		let endpoints = ["https://api.twitter.com/1.1/lists/subscribers.json", "https://api.twitter.com/1.1/lists/members.json"]
		if (download !== 2) { endpoints = [endpoints[download]] }
		for (let ix = 0, len = endpoints.length; ix < len; ix++) {
			const endpoint = endpoints[ix]
			const type = ['subscriber', 'member'][ix]
			const headers = {"Authorization": "Bearer "+token }
			const apiCalls = []
			links.forEach(url => {
				const path = url ? url.toLowerCase().replace("https://twitter.com/", "").replace("http://twitter.com/", "") : ''
				const values = path.split("/lists/")
				if (values.length !== 2) {
					console.error(`The path: ${path} is malformed`)
				} else {
					const payload = { owner_screen_name: values[0], slug: values[1], count: "5000", include_entities:false, skip_status:true}
					apiCalls.push(axios.get(endpoint, {params:payload, headers:headers}).then(r => r.data).catch(e => {console.log(e); return null}))
				}
			})

			await axios.all(apiCalls).then(lists => {
				lists.forEach((usersData, i ) => {
					console.log(usersData)
					if (usersData && usersData['users']) {
						const users = usersData['users'].map(u => ({list:links[i], type:type, name:u.name, handle:u.handle, location:u.location, description:u.description, url:u.url, followers:u.followers_count, friends:u.friends_count, statuses:u.statuses_count}))
						apiData = [...apiData, ...users]
					} else {
						console.error(`Problem with list: ${links[i]}`)
					}
				})
			})
		}

		myCache.set(cacheName, apiData)
		return res.status(200).json(apiData)
	}
}
