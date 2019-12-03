<template>
  <div class='h-page bg-gray-100 max-w-big border-l border-r border-gray-200 mx-auto'>
	<div class='h-10 flex justify-between px-2 items-center border-b border-gray-200 max-w-big'>
		<div>
			<nuxt-link to="/" class='text-black font-bold'>Jump<span class='text-gray-500 font-hairline'>.sh</span></nuxt-link>
		</div>
		<div class='text-gray-700'>
			<nuxt-link to="/start" class="font-hairline mr-4">Subscribe</nuxt-link>
			<nuxt-link to="/support" class="font-hairline">Support</nuxt-link>
		</div>
	</div>
    <nuxt />
  </div>
</template>
<script>
export default {
	head() {
		return {
			link: [ { rel: 'canonical', href: `https://jump.sh${this.$route.path && this.$route.path.endsWith("/") ? this.$route.path.slice(0, -1) : this.$route.path}` } ]
		}
	}
}
</script>

<style>

</style>
