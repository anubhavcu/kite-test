"use strict";
const utils = require('./_utils.js');

module.exports = async (req, res) => {
	if (req.method == "GET") {
		const myCache = await utils.getCache()
		await myCache.flushAll()
		return res.status(200).json({flushed:true})
	}
}
