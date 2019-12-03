<template>
  <div class='py-6 px-2'>
	  <p class='font-medium'>
		Target your twitter ads using Twitter lists.
	  </p>

	  <div class="mt-6 max-w-xl">
		  <div>
			  <h1 class='font-medium text-red-600 text-lg'>The old way:</h1>
			  <p class='font-light text-gray-800'>
				  You use the same targeting option as everyone else, your ads target the same people as everyone
				  else and your conversion rate is low.
			  </p>
		  </div>

		  <div class='mt-6'>
			  <h1 class='font-medium text-green-600 text-lg'>The Jump.sh way:</h1>
			  <p class='font-light text-gray-800'>
				  You use our search engine to find twitter lists where your customers are
			  </p>
		  </div>

		  <div class='mt-10'>
			<nuxt-link class='btn bg-green-500 text-white uppercase w-full block text-center font-semibold' to="/">Find new clients</nuxt-link>
		  </div>
	  </div>
  </div>
</template>

<script>

export default {
	layout:'index',
	data(){
		return {
			email:""
		}
	},
}
</script>

<style>
</style>
