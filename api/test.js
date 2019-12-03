// import Papa from 'papaparse'
const axios = require('axios')
const custom_search_api_key = "AIzaSyC9BlF6PUUiyQ397Mn_hFOhb81VL-A0-58"
const parse5 = require('parse5');
const cheerio = require('cheerio');
const custom_search = "AIzaSyC9BlF6PUUiyQ397Mn_hFOhb81VL-A0-58"
const token = "AAAAAAAAAAAAAAAAAAAAAB5B2gAAAAAAnrzUv%2B8%2BJAe0TeXXeIaWIYMJhdQ%3DibOF0WEvXpp901BBG3ITU1ZHzkk3B8eiJkdYXqCztSrc4eRiZC"
const bearer = "Bearer " + token

import { parse } from 'node-html-parser';

// const root = parse('<ul id="list"><li>Hello World</li></ul>');

module.exports = async (req, res) => {
	if (req.method == "GET") {
		const l = "https://twitter.com/zaraflora/lists/weddings-events"
		const headers = {"Authorization": "Bearer "+token}
		const payload = { owner_screen_name: "codecondoltd", slug: "marketing-agencies", count: "5000", include_entities:false, skip_status:true}
		// const l = await axios.get("https://api.twitter.com/1.1/lists/members.json", {params:payload, headers:headers}).then(r => r.data)

		// const tw = await axios.get('https://api.twitter.com/1.1/lists/show.json?slug=books&owner_screen_name=pauldhunt', {params:payload, headers:headers}).then(r => r.data)
		// return res.status(200).json(tw)
		const x = await axios.get(l).then(r => r.data)
		// console.log(x)
		const root = parse(x)
		let stats = root.querySelector('.stats')
		stats = stats.structuredText.split("\n")
		// return res.status(200).json(stats)
		console.log(stats)
		const s = stats.map(x => parseInt(x.replace(/\D/g,'')))
		return res.status(200).json(s)
	}
}
