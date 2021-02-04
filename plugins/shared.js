import Vue from 'vue'
Vue.mixin({
	methods: {
	    errorMsg (e) {
			let error = "There was an error. Please try again or reach out via chat"
			if (!e || !e.response){
				return error
			}
			if (((typeof e.response.data) == "object") && ("message" in e.response.data)){
				error = e.response.data.message
			} else {
				error = JSON.stringify(e.response.data)
			}
			return error
		}
	}
})