<template>
<div v-if="links.length">
	<div class='my-4'>
		If you think you will use the tool a lot you can <nuxt-link class='text-blue-500 cursor-pointer' to="/pro">buy a subscription and download unlimted lists each month</nuxt-link>.
	</div>
	<div>
		<p> Lists to download: </p>
		<ul class='list-inside list-none'>
			<li v-for="l in links" class='text-xs text-gray-600'>{{l}}</li>
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
		<div class='btn bg-green-600 text-white uppercase text-lg font-semibold text-center' @click="downloadLeads">
			Download
		</div>
		<p class='text-sm text-center text-red-600 font-medium mt-1'>
			Not happy with the results? We refund you immediately!
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
		}
	},
	methods:{
		async downloadLeads(){
			const download = this.download
			const r = await this.$axios.$post("/api/leads", {download:this.product, links:this.links})
			const csvBom = '\uFEFF' // Fix for Äö etc characters
			const csvContent = csvBom + Papa.unparse(r)
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
			await saveAs(blob, `Jump.sh_export.csv`)
		},
	}

}
</script>
