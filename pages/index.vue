<template>
	<div>
		<div v-if="!lists.length" class="flex h-page items-center justify-center px-4">
			<div class='md:w-1/2 md:-mt-32'>
				<h1 class='text-2xl font-semibold'>Twitter List Search Engine</h1>
				<h2 class='text-base'>Find Twitter lists relevant to you</h2>
				<div class='my-8' v-show="!loading">
					<div class='inline-flex items-stretch w-full'>
						<input class='my-form bg-white rounded-r-none w-full' placeholder="Digital Marketing" v-model="searchTerm" @keyup.enter="findLists" />
						<button class="btn rounded-l-none tw-bg" @click="findLists">Search</button>
					</div>
				</div>
				<div v-show="loading" class='my-5'>
					<h2 class='text-4xl font-hairline text-gray-600'>Loading lists...</h2>
				</div>
				<div v-if="noData">
					<h2 class='text-4xl font-hairline text-red-600'>No Lists Found!</h2>
				</div>
			</div>
		</div>

		<div class='px-4 pb-6 h-page max-w-big mx-auto' v-if="lists.length">
			<div class='flex flex-wrap-reverse'>
				<div class='w-full md:w-7/12 md:pr-20'>
					<div v-for="l, index in lists" :key='index'>
						<div class="md:flex bg-white rounded-lg p-4 rounded border border-gray-200 my-3 items-center">
							<img class="border border-gray-400 h-10 w-10 md:h-16 md:w-16 rounded-full mx-auto md:mx-0 md:mr-6 shadow-inner" :alt="l.title" :src="l.image ? l.image : '/tw.png'">
							<div class="text-center md:text-left">
							  <h2 class="text-lg">{{l.title}}</h2>
							  <div class="flex text-xs justify-center md:justify-start mt-2">
								  <p class='inline-flex'>
									<span class='px-2 rounded-l bg-gray-300'>Members</span>
									<span class='px-1 rounded-r bg-white'>{{l.followers || "-"}}</span>
								  </p>
								  <p class='inline-flex ml-3 border border-gray-300 rounded'>
									<span class='px-1 rounded-l bg-gray-300'>Subscribers</span>
									<span class='px-1 rounded-r bg-white'>{{l.friends || "-"}}</span>
								  </p>
							  </div>
							  <a class="tw-color text-xs" :href="l.link" target="_blank">{{l.link}}</a>
							  <div class="text-gray-600 text-xs">{{l.snippet}}</div>
							</div>
						  </div>
					</div>
				</div>
				<div class='w-full md:w-5/12 p-0 md:pr-6 my-6 md:my-0'>
					<div class='sticky' style="top:52px;">
					<div class='inline-flex items-stretch w-full mb-5'>
						<input class='my-form border-gray-200 bg-white rounded-r-none w-full' placeholder="Digital Marketing" v-model="searchTerm" @keyup.enter="findLists" />
						<button class="btn rounded-l-none tw-bg" @click="findLists">Search</button>
					</div>
					<div class='bg-green-100 rounded shadow-2xl p-6 border border-green-400' v-if="lists.length">
						<h1 class='text-2xl font-bold'>Download these leads</h1>
						<h2>You can download a CSV file containing {{total.all}} potential leads. This file can be uploaded to twitter ads as a custom audience to create super targeted ads!</h2>
						<div class='my-4'>
							If you think you will use the tool a lot you can <nuxt-link class='text-blue-500 cursor-pointer' to="/pro">buy a subscription and download unlimted lists each month</nuxt-link>.
						</div>
						<div class='my-4'>
							<div class=" mb-6 font-light">
							  <label class='block'>
								<input class="mr-2 leading-tight" type="radio" value="0" v-model.number="download">
								<span class="text-sm"> Download {{total.subscribers}} subscribers for 19$ </span>
							  </label>
							  <label class='block'>
								<input class="mr-2 leading-tight" type="radio" value="1" v-model.number="download">
								<span class="text-sm"> Download {{total.members}} members for 19$ </span>
							  </label>
							  <label class='block'>
								<input class="mr-2 leading-tight" type="radio" value="2" v-model.number="download">
								<span class="text-sm"> Download all {{total.all}} (members & subscribers) leads for 29$ </span>
							  </label>
							</div>
						</div>
						<div>
							<div class='btn bg-green-600 text-white uppercase text-lg font-semibold text-center' @click="downloadLeads">
								Download
							</div>
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
import Papa from 'papaparse'
import saveAs from 'file-saver'

export default {
	layout:'index',
	data(){
		return {
			searchTerm:'',
			lists:[],
			loading:false,
			noData:false,
			download:1,
		}
	},
	methods:{
		async findLists() {
			this.lists = []
			this.noData = false
			if (!this.searchTerm){
				return;
			}
			this.loading = true
			const l = await this.$axios.$get("/api/lists", {params:{searchTerm:this.searchTerm}})
							.finally(x => this.loading = false)
			if (l && !l.length){
				this.noData = true
			}
			this.lists = l || []
		},

		async downloadLeads(){
			const download = this.download
			const links = this.lists.map(l => l.link)
			const r = await this.$axios.$post("/api/leads", {download:this.download, links:links})

			const csvBom = '\uFEFF' // Fix for Äö etc characters
			const csvContent = csvBom + Papa.unparse(r)
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
			await saveAs(blob, this.searchTerm)
		}
	},
	computed:{
		total(){
			const t = {
				members: this.lists.reduce((a, b) => a + (b['followers'] || 0), 0),
				subscribers: this.lists.reduce((a, b) => a + (b["friends"] || 0), 0)
			}
			t.all = t.members + t.subscribers
			return t
		}
	}
}

</script>
<style>
</style>
