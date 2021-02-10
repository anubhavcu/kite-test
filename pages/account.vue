<template>
	<div class='p-8'>
		
		<div>
			<div class="space-y-1">
				<h3 class="text-lg leading-6 font-medium text-gray-900"> Account </h3>
				<p class="max-w-2xl text-sm text-gray-500">
					If you need any help with your account settings feel free to get in touch at any time.
				</p>
			</div>
		</div>

		<div class='max-w-2xl mt-8'>
			<ul>
				<li v-for="(value, key) of infos" :key="key" class='px-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 hover:bg-gray-200 py-4 border-b border-gray-200'>
					<p class='max-w-2xl text-sm text-gray-500 capitalize'>{{key}}</p>
					<p class='text-sm text-gray-900'>{{value}}</p>
				</li>
			</ul>
		</div>

		<a href="https://appsumo.com/marketplace-kitelist-targeted-twitter-ads/" target="_blank" class='block bg-yellow-400 text-green-800 border-4 text-lg max-w-2xl p-3 rounded shadow mt-10 mb-6 border-green-800' v-if="showBuyMore">
			Buy one more AppSumo code and get upgraded to the PRO plan, which includes unlimited exports per month!
		</a>

	</div>
</template>
<script>
export default {
	middleware:['auth'],
	data(){
		return {
			// account:null,
		}
	},
	computed: {
		showBuyMore(){
			return this.infos['Exports Per Month'] === 15
		},
		infos(){
			const user = this.$auth.user
			const billing = user.billing || {}
			
			if (user.billing.plan !== "AppSumo"){
				return {
					email:user.email,
					plan:"KiteList Monthly Subscription",
					"Searches Per Month":"Unlimited",
				}
			}

			return {
				email:user.email,
				plan:billing.plan,
				"Searches Per Month":"Unlimited",
				"Exports Per Month":(billing.codes || []).length > 1 ? "Unlimited" : 15,
				"Next Renewal":"Never",
			}
		}
	}
}
</script>