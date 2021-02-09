<template>
  <div class='h-auto bg-gray-100 mx-auto min-h-screen'>
	<navBar></navBar>
	<main>
		<nuxt />
	</main>
	<!-- <div class='fixed bottom-0 left-0 h-10 bg-green-900 w-screen px-5 flex items-center justify-between z-20'>
		<p class='text-yellow-400'>
			<span class='rounded bg-yellow-400 px-2 py-0.5 text-green-900'>Lifetime Deal!</span> Get unlimited leads for life! One-time $39 purchase
		</p>
		<button class='bg-yellow-400 text-red-600 h-8 rounded font-semibold px-6'>Get it</button>
	</div> -->
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
