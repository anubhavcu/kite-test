<template>
  <div class='h-auto bg-gray-100 mx-auto min-h-screen'>
	<navBar></navBar>
	<main>
		<nuxt />
	</main>
  </div>
</template>
<script>
export default {
	head() {
		return {
			link: [ { rel: 'canonical', href: `https://kitelist.com${this.$route.path && this.$route.path.endsWith("/") ? this.$route.path.slice(0, -1) : this.$route.path}` } ]
		}
	}
}
</script>

<style>

</style>
