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
					<div class='flex justify-between items-center mt-3'>
						<p class='text-sm text-gray-800'>{{lists.length}} {{lists.length==1 ? 'list': 'lists'}} found</p>
						<!-- <div class='inline-flex'>
							<button class='px-2 border border-gray-300 border-r-0 text-gray-700 rounded rounded-r-none bg-gray-200 cursor-default' disabled>Sort By</button>
							<select class='my-form cursor-pointer bg-gray-100 py-1 rounded-l-none' v-model="sortBy">
								<option value="subscribers">Subscribers</option>
								<option value="members">Members</option>
								<option :value="null">Subscribers + Members</option>
							</select>
						</div> -->
					</div>
					<div v-for="(l, index) in sortedLists" :key='index'>
						<div class="md:flex p-4 rounded border my-3 items-center" :class="[selectedLists.includes(l.link)?'bg-green-200 border-green-400 shadow':'bg-white border-gray-200', selectedLists.length>=5 && !selectedLists.includes(l.link)?'cursor-default bg-gray-200':'cursor-pointer']" @click="addRemoveList(l.link)">
							<img class="border border-gray-400 h-10 w-10 md:h-16 md:w-16 rounded-full mx-auto md:mx-0 md:mr-6 shadow-inner" :alt="l.title" :src="l.image ? l.image : '/tw.png'">
							<div class="text-center md:text-left">
							  <h2 class="text-lg">{{l.title}}</h2>
							  <!-- <div class="flex text-xs justify-center md:justify-start mt-2">
								  <p class='inline-flex border border-gray-300 rounded'>
									<span class='px-2 bg-gray-300'>Members</span>
									<span class='px-1 rounded bg-white'>{{l.members || "-"}}</span>
								  </p>
								  <p class='inline-flex ml-3 border border-gray-300 rounded'>
									<span class='px-2 bg-gray-300'>Subscribers</span>
									<span class='px-1 rounded bg-white'>{{l.subscribers || "-"}}</span>
								  </p>
							  </div> -->
							  <a class="tw-color text-xs" :href="l.link" target="_blank">{{l.link}}</a>
							  <div class="text-gray-600 text-xs">{{l.snippet}}</div>
							</div>
						  </div>
					</div>

					<a class='rounded py-2 px-3 block text-center w-auto my-6 text-lg text-white bg-indigo-500 border border-indigo-600' target="_blank" :href="`https://google.com/search?q=site:https://twitter.com/i/lists/ OR site:twitter.com/*/lists ${searchTerm}`">Find more on Google</a>

				</div>
				<div class='w-full md:w-5/12 p-0 md:pr-6 my-6 md:my-0'>
					<div class='sticky' style="top:52px;">
					<div class='inline-flex items-stretch w-full mb-5 mt-5'>
						<input class='my-form border-gray-200 bg-white rounded-r-none w-full' placeholder="Digital Marketing" v-model="searchTerm" @keyup.enter="findLists" />
						<button class="btn rounded-l-none tw-bg" @click="findLists">Search</button>
					</div>
					<div class='bg-green-100 rounded shadow-2xl p-6 border border-green-400' v-if="lists.length">
						<h1 class='text-2xl font-bold'>Download these leads</h1>
						<h2>You can download a CSV file containing {{total.all}} potential leads. This file can be uploaded to twitter ads as a custom audience to create super targeted ads!</h2>
						<div v-if="!selectedLists.length" class='mt-5 p-2 rounded bg-yellow-400 border border-yellow-500'>
							You can select up to 5 lists to download.
							<br />Click on the list to select it or un-select it.
						</div>
						<div v-else>
							<download :links="selectedLists" :total="total"></download>
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
import download from "~/components/download.vue"
export default {
	layout:'index',
	components:{download},
	data(){
		return {
			searchTerm:'',
			sortBy: null,
			lists:[],
			selectedLists:[],
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
			const l = await this.$axios.$get(`/api/lists/${this.searchTerm}`).finally(x => this.loading = false)
			if (l && !l.length){
				this.noData = true
			}
			this.lists = l || []
		},

		addRemoveList(link){
			const index = this.selectedLists.indexOf(link)
			if (index == -1){
				if (this.selectedLists.length >= 5){return;}
				this.selectedLists.push(link)
			} else {
				this.selectedLists.splice(index, 1);
			}
		}
	},
	computed:{
		total(){
			const selected = this.lists.filter(l => this.selectedLists.includes(l.link))
			const t = {
				members: selected.reduce((a, b) => a + (b['members'] || 0), 0),
				subscribers: selected.reduce((a, b) => a + (b["subscribers"] || 0), 0)
			}
			t.all = t.members + t.subscribers
			return t
		},

		sortedLists() {
			const sortBy = this.sortBy
			if (sortBy){
				return this.lists.sort((a,b) => b[sortBy] - a[sortBy])
			}
			return this.lists.sort((a,b) => (b.subscribers + b.members) - (a.subscribers + a.members))
		}

	}
}

</script>
<style>
</style>
