"use strict";
const { Firestore } = require('@google-cloud/firestore');
const {Storage} = require('@google-cloud/storage');
const jwt = require('jsonwebtoken')
const axios = require("axios")


const firebaseCredentials = {
	"type": "service_account",
	"project_id": process.env.KITELIST_FIREBASE_PROJECT_ID,
	"private_key_id": process.env.KITELIST_FIREBASE_PRIVATE_KEY_ID,
	"private_key": process.env.KITELIST_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	"client_email": process.env.KITELIST_FIREBASE_CLIENT_EMAIL,
	"client_id": process.env.KITELIST_FIREBASE_CLIENT_ID,
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": process.env.KITELIST_FIREBASE_CLIENT_X509_CERT_URL
}

const fireCache = {db:null, bucket:null}

const fn = module.exports = {
	async set_user_or_null(request){
		try {
			await fn.set_user(request)
		} catch(e){
			return null
		}
	},
	async set_user(request){
		let token = request.headers.authorization
		if (!token) {
			throw new Error("400::Please login to do this!")
		}
		if (token.startsWith("Bearer ")) { token = token.substr(7) }
		return jwt.verify(token, process.env.KITELIST_JWT_PRIVATE, (error, result) => {
			if (error){
				throw new Error(`401::${error.name}: ${error.message}`)
			}
			request.user = result.data
		})
	},
	
	micro_hash(string){
		const n = (string || '').split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
		return `micro_${n.toString()}_hash`
	},

	validate_email(given_email){
		const email = given_email || ""
		const lower_email = email.trim().toLowerCase()
		if (!/^\S+@\S+\.\S+$/.test(lower_email)){
			throw new Error("400::The given email address is not valid")
		}
		return lower_email
	},

	async sendEmail(to_email, template_alias, template_config, plain_html) {
		const headers = {"X-Postmark-Server-Token":process.env.KITELIST_POSTMARK_API_KEY}
		let postMarkEndpoint = "https://api.postmarkapp.com/email"
		
		const data = {
			From: "team@kitelist.com",
			To: fn.validate_email(to_email)
		}

		if (template_alias){ // it uses a template
			postMarkEndpoint += "/withTemplate"
			data.TemplateAlias = template_alias,
			data.TemplateModel = template_config
		} 
		
		else {
			// It's a plain HTML email
			data.HtmlBody = plain_html
			data.Subject = "KiteList Login link"
		}

		return await axios.post(postMarkEndpoint, data, {headers:headers})
						.then(r => true).catch(e => false)
	},	
	
	get_firebase(v) {
			if (fireCache[v]) {
				return fireCache[v]
			}

			if (v == 'bucket'){
				const storage = new Storage({projectId: process.env.KITELIST_FIREBASE_PROJECT_ID, credentials:firebaseCredentials})
				fireCache[v] = storage.bucket("jumpsh.appspot.com")
				return fireCache[v]
			}

			else if (v == 'db') {
				fireCache[v] = new Firestore({projectId: process.env.KITELIST_FIREBASE_PROJECT_ID, credentials:firebaseCredentials})
				console.log("FIREBASE")
				return fireCache[v]
			}
		},

	connectToDatabase(){
		return fn.get_firebase('db')
	},

	connectToBucket(){
		return fn.get_firebase('bucket')
	},

	timestamp_sc(){
		// Return Timestamp in seconds as integer
		return parseInt(Math.floor(Date.now() / 1000))
	},

	random_id(){
		return `${new Date().getUTCMilliseconds().toString()}${Math.round((Math.random() * 36 ** 12)).toString(36)}`
	},

	// DB FUNCTIONS

	async add_one(collection_name, data) {
		// Returns the ID of the new object.
		const db = fn.connectToDatabase()
		return await db.collection(collection_name).add(data).then(r => r.id)
	},

	async create_or_replace(collection_name, id, data) {
		// myCache.del( `${collection_name}-${id}` )
		const db = fn.connectToDatabase()
		return await db.collection(collection_name).doc(id).set(data)
	},

	async create_or_update(collection_name, id, data){
		// myCache.del( `${collection_name}-${id}` )
		const db = fn.connectToDatabase()
		return await db.collection(collection_name).doc(id).set(data, {merge:true})	
	},

	async update_one(collection_name, id, data) {
		// Returns null
		// myCache.del( `${collection_name}-${id}` )
		const db = fn.connectToDatabase()
		return await db.collection(collection_name).doc(id).update(data)
	},

	async add_to_array(collection_name, id, array_name, new_value){
		// Return Null
		// myCache.del( `${collection_name}-${id}` )
		const db = fn.connectToDatabase()
		await db.collection(collection_name).doc(id).update({ [array_name]: Firestore.FieldValue.arrayUnion(new_value) })
	},

	async remove_from_array(collection_name, id, array_name, new_value){
		// Return Null
		// myCache.del( `${collection_name}-${id}` )
		const db = fn.connectToDatabase()
		await db.collection(collection_name).doc(id).update({ [array_name]: Firestore.FieldValue.arrayRemove(new_value) })
	},

	async get_id(collection_name, id) {
		// Returns the object without ID if it can't find it returns null
		// const cache_id = `${collection_name}-${id}`
		// const cached = false// myCache.get( cache_id )
		// if (cached){
		// 	console.log("mem cache")
		// 	return cached
		// }
		// console.log("FROM db...", `${collection_name}-${id}`)
		const db = fn.connectToDatabase()
		const item = await db.collection(collection_name).doc(id).get()
			.then(v =>  v.data() || null)
		if (item){
			// myCache.set( `${collection_name}-${id}`, item)
		}
		return item
	},

	async get_one(collection_name, filter) {
		// Returns the object or null
		const db = fn.connectToDatabase()
		const all = await db.collection(collection_name).where(...filter).limit(1).get()
				.then(snp => snp.docs.map(v => ({...v.data(), id:v.id })))
		return all.length ? all[0] : null
	},

	async get_many(collection_name, filters) {
		// Returns an array of objects
		const db = fn.connectToDatabase()
		const collection = db.collection(collection_name)
		if (filters){
			return await collection.where(...filters).get().then(snp => snp.docs.map(v => ({...v.data(), id:v.id, })))
		}
		return await collection.get().then(snp => snp.docs.map(v => ({...v.data(), id:v.id, })))
	},

	async delete_one(collection_name, id) {
		// Returns null
		// myCache.del( `${collection_name}-${id}` )
		const db = fn.connectToDatabase()
		await db.collection(collection_name).doc(id).delete()
	},

	async delete_many(collection_name, filter) {
		// Returns null
		// myCache.flushAll()
		const db = fn.connectToDatabase()
		await db.collection(collection_name).where(...filter).get()
		.then(snp => {
				const batch = db.batch();
				snp.forEach(doc => {batch.delete(doc.ref)})
	  			return batch.commit()
		})
		.then(() => null)
	},

	async delete_field(collection_name, filed_name, id){
		// myCache.flushAll()
		const db = fn.connectToDatabase()
		const item = await db.collection(collection_name).doc(id)
		await item.update({
			[filed_name]:Firestore.FieldValue.delete()
		})
	}
}
