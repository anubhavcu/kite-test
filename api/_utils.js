"use strict";
// const { Firestore } = require('@google-cloud/firestore');
const {Storage} = require('@google-cloud/storage');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 14400, checkperiod: 300 } );


let cachedFirebase = {}
let cachedMemory = false

const firebaseCredentials = {
	"type": process.env.JUMP_FIREBASE_TYPE,
	"project_id": process.env.JUMP_FIREBASE_PROJECT_ID,
	"private_key_id": process.env.JUMP_FIREBASE_PRIVATE_KEY_ID,
	"private_key": process.env.JUMP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	"client_email": process.env.JUMP_FIREBASE_CLIENT_EMAIL,
	"client_id": process.env.JUMP_FIREBASE_CLIENT_ID,
	"auth_uri": process.env.JUMP_FIREBASE_CLIENT_AUTH_URI,
	"token_uri": process.env.JUMP_FIREBASE_CLIENT_TOKEN_URI,
	"auth_provider_x509_cert_url": process.env.JUMP_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
	"client_x509_cert_url": process.env.JUMP_FIREBASE_CLIENT_X509_CERT_URL
}

module.exports = {

	connectToFirebase: async function(v){
			if (cachedFirebase[v]) {
				return cachedFirebase[v]
			}

			if (v == 'bucket'){
				const storage = await new Storage({credentials:{...firebaseCredentials}})
				cachedFirebase[v] = await storage.bucket("jumpsh.appspot.com")
				return cachedFirebase[v]
			}

			else if (v == 'db') {
				cachedFirebase[v] = await new Firestore({credentials:{...firebaseCredentials}})
				return cachedFirebase[v]
			}
	},

	getCache: async function(){
		if (cachedMemory) { return cachedMemory }
		cachedMemory = await new NodeCache( { stdTTL: 14400, checkperiod: 300 } );
		return cachedMemory
	},

}
