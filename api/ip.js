"use strict";
module.exports = async (req, res) => {
	if (req.method == "GET") {
		const forwarded = req.headers['x-forwarded-for']
		const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
		const host = req.headers['host']
		return res.status(200).json({ip:ip, host:host})
	}
}
