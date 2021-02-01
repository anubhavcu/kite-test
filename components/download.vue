<template>
<div v-if="links.length">
	<div class='my-4'>
		If you think you will use the tool a lot you can <nuxt-link class='text-blue-500 cursor-pointer' to="/pro">buy a subscription and download unlimted lists each month</nuxt-link>.
	</div>
	<div>
		<p> Lists to download: </p>
		<ul class='list-inside list-none'>
			<li v-for="(l,i) in links" :key="i" class='text-xs text-gray-600'>{{l}}</li>
		</ul>
	</div>
	<div class='my-4'>
		<div class=" mb-6 font-light">
		  <label class='block'>
			<input class="mr-2 leading-tight" type="radio" value="0" v-model.number="product">
			<span class="text-sm"> Download {{total.subscribers || "all"}} subscribers for 19$ </span>
		  </label>
		  <label class='block'>
			<input class="mr-2 leading-tight" type="radio" value="1" v-model.number="product">
			<span class="text-sm"> Download {{total.members || "all"}} members for 19$ </span>
		  </label>
		  <label class='block'>
			<input class="mr-2 leading-tight" type="radio" value="2" v-model.number="product">
			<span class="text-sm"> Download all {{total.all || ''}} (members & subscribers) leads for 29$ </span>
		  </label>
		</div>
	</div>
	<div>
		<div v-if="!downloading" class='btn bg-green-600 text-white uppercase text-lg font-semibold text-center' @click="pay">
			Download
		</div>
		<div v-else class='btn bg-transparent cursor-default text-lg font-semibold text-center text-green-600'>
			Downloading... Please wait...
		</div>
		<p class='text-sm text-center text-red-600 font-medium mt-1'>
			Not happy with the results? We refund you immediately<span @click="downloadLeads">!</span>
		</p>
	</div>
</div>
</template>
<script>
import Papa from 'papaparse'
import saveAs from 'file-saver'
export default {
	props:['links', 'total'],
	data(){
		return {
			product:0,
			downloading:false,
		}
	},
	methods:{
		pay() {
			const vm = this
			if (this.$ga){
				this.$ga.event('purchase', 'open-checkout', this.product, 0)
			}
			Paddle.Setup({ vendor: 27713, debug: false })
			const prod = this.product==2 ? 577738 : 577737
			Paddle.Checkout.open({
				product: prod,
				allowQuantity: false,
				title: 'KiteList Export',
				message: 'Your CSV will be immediately downloaded! This is a one time fee.',
				disableLogout: true,
				successCallback: function(paddleData) { vm.downloadLeads(paddleData) }
			})
    	},
		async downloadLeads(){
			this.downloading = true
			const r = await this.$axios.$post("/api/leads", {download:this.product, links:this.links})
			this.downloading = false
			if ("url" in r) {
				window.location.href = r.url
			}
		},
	}

}
</script>
