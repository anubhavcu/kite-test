const axios = require('axios')
import { parse } from 'node-html-parser';
const utils = require('./_utils.js');

module.exports = async (req, res) => {
	if (req.method == "GET") {
		const q = req.query.searchTerm ? req.query.searchTerm.toLowerCase() : null
		if (!q){
			return res.status(400).json({error:"Missing query parameter"})
		}
		const myCache = await utils.getCache()
		const cachedValue = myCache.get(q)
		if (cachedValue){ return res.status(200).json(cachedValue)}

		const params = {cx:"013322004514320345947:mnxnibvixbl",q:q, key:process.env.JUMP_CUSTOM_SEARCH_API_KEY, imgSize:"small", num:10}

		// Find lists on top 5 pages
		let lists = []
		const pages = [1,11,21,31,41]
		for (let p = 0, len = pages.length; p < len; p++) {
			params['start'] = pages[p]
			console.log(`Getting pages starting from index ${pages[p]}`)
			const pageLists = await axios.get("https://www.googleapis.com/customsearch/v1/siterestrict", {params:params})
			.then(r => {return r.data.items || false})
			.catch(e => {console.log(e); return false} )
			if (pageLists){
				const cleanLists = pageLists.map(e => ({title:e.title, link:e.link, snippet:e.snippet, members:null, subscribers:null, image:'cse_image' in e.pagemap ? e.pagemap.cse_image[0].src : null, }))
				lists = [...lists, ...cleanLists]
			} else {
				console.error(`Error getting the custom search page ${p+1}`)
				break;
			}
			if (pageLists && pageLists.length < 10) {
				console.log("All done, exiting...")
				break;
			}
		}

		// Find Subs & Members of each lists
		const apiCalls = lists.map(u => axios.get(u.link).then(r => r.data || null).catch(() => null))
		await axios.all(apiCalls).then(args => {
			args.forEach((html, i )=> {
				// let st = [0,0]
				if (html) { // 404 or other errors
					const root = parse(html)
					let selector = root.querySelector('.stats')
					if (selector){
						const st = selector.structuredText.split("\n")
						if (st.length == 2){
							lists[i].members = parseInt(st[0].replace(/\D/g,''))
							lists[i].subscribers = parseInt(st[1].replace(/\D/g,''))
						} else {
							console.error(`error with selectors length: Selectors are: ${selector}`)
						}
					} else {
						console.error(`Selectors not found in the url ${lists[i].link}`)
					}
				} else {
					console.error(`Error while scraping the url: ${lists[i].link}`)
				}
			})
		})
		myCache.set(q, lists)
		return res.status(200).json(lists)
	}
}
