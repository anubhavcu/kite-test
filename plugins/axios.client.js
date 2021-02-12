export default function ({ $axios, redirect }) {
	$axios.onError(e => {
		let errorMessage = e.message
		switch (typeof e.response) {
			case "object":
				if (e.response.data){
					errorMessage = e.response.data.message || JSON.stringify(e.response.data)
				} else {
					errorMessage =  JSON.stringify(e.response)
				}
				break;
			case "undefined":
				break; // e.message
			default: // integer, number, string etc
				errorMessage = JSON.stringify(e.response)
				break;
		}

		// MAYBE CATCH WITH SENTRY HERE? 
		
		if (errorMessage !== "Request aborted"){
			alert(errorMessage)
		}
		return;
	})
  }