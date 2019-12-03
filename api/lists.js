const axios = require('axios')
const custom_search_api_key = "AIzaSyC9BlF6PUUiyQ397Mn_hFOhb81VL-A0-58"
import { parse } from 'node-html-parser';

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 14400, checkperiod: 300 } );

module.exports = async (req, res) => {
	if (req.method == "GET") {
		// myCache.flushAll();
		const q = req.query.searchTerm ? req.query.searchTerm.toLowerCase() : null
		if (!q){
			return res.status(400).json({error:"Missing query parameter"})
		}
		const cachedValue = myCache.get(q)
		if (cachedValue){ return res.status(200).json(cachedValue)}
		const url = "https://www.googleapis.com/customsearch/v1/siterestrict"
		const params = {cx:"013322004514320345947:mnxnibvixbl",q:q, key:custom_search_api_key, imgSize:"small", num:10}
		const r = await axios.get(url, {params:params}).then(r => r.data.items) || []
		const final = r.map(e => ({title:e.title, link:e.link, snippet:e.snippet, followers:null, friends:null, image:'cse_image' in e.pagemap ? e.pagemap.cse_image[0].src : null, }))
		const apiCalls = r.map(u => axios.get(u.link).then(r => r.data || null).catch(() => null))
		await axios.all(apiCalls).then(args => {
			args.forEach((html, i )=> {
				let st = [0,0]
				if (html) { // 404 or other errors
					const root = parse(html)
					let selector = root.querySelector('.stats')
					if (selector){
						st = selector.structuredText.split("\n")
					}
				}
				if (final[i]){
					final[i].followers = parseInt(st[0].replace(/\D/g,''))
					final[i].friends = parseInt(st[1].replace(/\D/g,''))
				}
			})
		})
		.catch(errors => {

		})
		myCache.set(q, final)
		return res.status(200).json(final)
	}
}
