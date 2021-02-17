<template>
	<div class='p-10'>Redirecting..</div>
</template>
<script>
export default {
	mounted(){
		// CUSTOM REDIRECT BECAUSE LINKS ARE WRONG ON THE APPSUMO OFFER PAGE
		let query = null;
		try {
			const urlParams = new URLSearchParams(window.location.search);
			let term = urlParams.get('q')
			if (term){
				term = term.replace('watchesac', 'watches')
				query = {search:term}
			}
		}
		catch(e){
			// Most likely URLSearchParams is not supported
		}
		this.$router.push({name:'app', query:query})
	}
}
</script>