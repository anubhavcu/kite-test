<template>
	<div class='p-10'>Redirecting..</div>
</template>
<script>
export default {
	mounted(){
		// CUSTOM REDIRECT BECAUSE LINKS ARE WRONG ON THE APPSUMO OFFER PAGE
		let url = "/app"
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const term = urlParams.get('q')
			url = url += (term ? `?search=${term}` : '')
		}
		catch(e){
			// Most likely URLSearchParams is not supported
		}
		url = url.replace('watchesac', 'watches')
		this.$router.push(url)
	}
}
</script>