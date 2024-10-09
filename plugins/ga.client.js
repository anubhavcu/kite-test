import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ isDev, app }) => {
	if (!isDev){
		Vue.use(VueGtag, {
			config: { id: 'G-611ED761PR' }
		},
		app.router);
	} else {
		console.log("Skipping GA in development")
	}
}