<template>
  <div class='h-auto bg-gray-200 max-w-big border-l border-r border-gray-200 mx-auto min-h-screen'>
	<navBar></navBar>
	<main>
		<nuxt />
	</main>
  </div>
</template>
<script>
import navBar from "~/components/navBar.vue"
export default {
	components:{navBar},
	data(){
		return {showScripts:false}
	},
	head() {
		return {
			link: [ { rel: 'canonical', href: `https://kitelist.com${this.$route.path && this.$route.path.endsWith("/") ? this.$route.path.slice(0, -1) : this.$route.path}` } ]
		}
	},
	mounted(){
		this.showScripts = true
	}
}
</script>

<style>

</style>
