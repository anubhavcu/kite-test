<template>
  <div class='flex h-page items-center justify-center -mt-20'>
	  <div class='m-4 p-10 bg-white rounded shadow md:w-3/6'>
		  <h1 class='font-semibold text-2xl'>Pro Plan $ 49/Month</h1>
		  <ul class='list-inside list-none my-4 font-light'>
			<li class="mb-2"> Unlimited Searches </li>
			<li class="mb-2"> Unlimited Downloads </li>
			<li class="mb-2"> Unlimited Subscribers </li>
			<li> Unlimited Members </li>
		  </ul>
		  <div class="mt-6 max-w-xl">
			  <div class=''>
				<a class='btn bg-teal-600 text-white uppercase w-full block text-center font-semibold' @click="pay">Subscribe</a>
			  </div>
		  </div>
	  </div>
  </div>
</template>

<script>

export default {
	layout:'index',
	data(){
		return {
		}
	},
	methods:{
		pay(){
			const vm = this
			if (this.$ga){
				this.$ga.event('purchase', 'open-checkout', 'agency', 1)
			}
			Paddle.Setup({ vendor: 27713, debug: false })
			Paddle.Checkout.open({
				product:577736,
				allowQuantity: false,
				disableLogout: true,
				successCallback: function(paddleData) {
					vm.saveUser(paddleData)
				}
			})
		},

		saveUser(){
			this.$router.push("/welcome")
		}
	}
}
</script>

<style>
</style>
