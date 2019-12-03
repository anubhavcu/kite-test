const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 14400, checkperiod: 300 } );

let cachedFirebase = false
let cachedMemory = false


module.exports = {

	getCache: async function(){
		if (cachedMemory) { return cachedMemory }
		cachedMemory = await new NodeCache( { stdTTL: 14400, checkperiod: 300 } );
		return cachedMemory
	},

	connectToDatabase: async function() {
			if (cachedFirebase) {
				return cachedFirebase
			}
			const firebaseConfig = {
				credentials: {
					"type": process.env.FIREBASE_TYPE,
					"project_id": process.env.FIREBASE_PROJECT_ID,
					"private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
					"private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
					"client_email": process.env.FIREBASE_CLIENT_EMAIL,
					"client_id": process.env.FIREBASE_CLIENT_ID,
					"auth_uri": process.env.FIREBASE_CLIENT_AUTH_URI,
					"token_uri": process.env.FIREBASE_CLIENT_TOKEN_URI,
					"auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
					"client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
				},
				projectId: process.env.FIREBASE_PROJECT_ID
			}
			const db = await new Firestore(firebaseConfig)
			cachedFirebase = db
			return db
		},

}
