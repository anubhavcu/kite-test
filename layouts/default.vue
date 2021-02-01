<template>
  <div class='h-auto bg-gray-100 max-w-big border-l border-r border-gray-200 mx-auto'>
	<div class='h-auto py-3 justify-between px-4 items-center border-b border-gray-200 max-w-big flex flex-wrap gap-x-4'>
		<div>
			<a href="/" class='text-black font-bold'>KiteList<span class='text-gray-700 font-hairline'>.com</span></a>
		</div>
		<div class='text-blue-600 font-light'>
			<nuxt-link to="/demo" class="mr-4">Demo</nuxt-link>
			<nuxt-link to="/export" class="mr-4">Export</nuxt-link>
			<nuxt-link to="/pro" class="mr-4">Pro</nuxt-link>
			<nuxt-link to="/support">Support</nuxt-link>
		</div>
	</div>
	<main>
		<nuxt />
	</main>
  </div>
</template>
<script>
export default {
	data(){
		return {showScripts:false}
	},
	head() {
		return {
			link: [ { rel: 'canonical', href: `https://jump.sh${this.$route.path && this.$route.path.endsWith("/") ? this.$route.path.slice(0, -1) : this.$route.path}` } ]
		}
	},
	mounted(){
		this.showScripts = true
	}
}
</script>

<style>

</style>
