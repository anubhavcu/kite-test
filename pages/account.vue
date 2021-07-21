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

		<div v-if="infos.plan === 'subscription'" class='my-6'>
			<p class='font-bold'>Update your subscription</p>
			<p>You can update or cancel your subscription at any time by clicking the button below</p>
			<button class='btn mt-2' @click="loadPortal">Update Subscription</button>
		</div>

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
	mounted(){
		this.$auth.fetchUser()
	},
	computed: {
		infos(){
			const user = this.$auth.user
			const billing = user.billing || {}
			const download_counter = user.download_counter || {}
			const restricted = user.billing.plan === "AppSumo" && billing.codes.length === 1
			const today = new Date();
			const date = `${today.getFullYear()}_${today.getMonth()}`
			return {
				email:user.email,
				plan:billing.plan,
				"Searches Per Month": "Unlimited",
				// "Exports":restricted ,
				"cancel at":billing.cancel_at ? new Date(billing.cancel_at) : '-',
				exports: `${download_counter[date] || 0} / ${restricted ? 15 : 'Unlimited'}`
			}
		}
	},

	methods:{
		async loadPortal(){
			const portal = await this.$axios.$put("/api/billing")
			window.location.href = portal
		}
	}
}
</script>