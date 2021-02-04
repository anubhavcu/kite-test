<template>
	<div>
		<div class="items-center justify-center">
			<div>
				<div class='pb-3 m-4' v-show="!loading">
					<div class='inline-flex items-stretch w-full rounded overflow-hidden'>
						<input class='my-form border-gray-400 border-r-0 rounded-r-none w-full placeholder-gray-700' placeholder="Digital Marketing" v-model="searchTerm" @keyup.enter="findLists" />
						<button class="btn rounded-l-none tw-bg sm:px-20" @click="findLists">Search</button>
					</div>
				</div>
				<div v-show="loading" class='my-5'>
					<h2 class='text-4xl font-bold text-pink-600'>Loading lists...</h2>
				</div>
				<div v-if="noData">
					<h2 class='text-4xl font-bold text-red-600'>No Lists Found!</h2>
				</div>
			</div>
		</div>

		<div class='px-4 py-6 h-page max-w-big mx-auto border-t border-gray-200' v-if="lists.length">
			<div class='grid grid-cols-1 sm:grid-cols-3 gap-10'>
				<div class='col-span-1 sm:col-span-2'>
					<div class='flex justify-between items-center'>
						<p class='text-sm text-gray-800'>{{lists.length}} {{lists.length==1 ? 'list': 'lists'}} found</p>
						<button class='rounded-2xl py-1 px-3 bg-green-500 text-white text-xs font-semibold shadow' @click="openAll">Open All</button>
					</div>
					<div>
						<div v-for="(l, index) in sortedLists" :key='index'>
						<div class="md:flex p-4 rounded border my-3 items-center" :class="[selectedLists.includes(l.link)?'bg-green-200 border-green-400 shadow':'bg-white border-gray-200', !selectedLists.includes(l.link)?'cursor-default bg-gray-200':'cursor-pointer']" @click="addRemoveList(l.link)">
							<img class="border border-gray-400 h-10 w-10 md:h-16 md:w-16 rounded-full mx-auto md:mx-0 md:mr-6 shadow-inner" :alt="l.title" :src="l.image ? l.image : '/tw.png'">
							<div class="text-center md:text-left">
							  <h2 class="text-lg">{{l.title}}</h2>
							  <a class="tw-color text-xs" :href="l.link" target="_blank">{{l.link}}</a>
							  <div class="text-gray-600 text-xs">{{l.snippet}}</div>
							</div>
						  </div>
						</div>					
					</div>
					<!-- <a class='rounded py-2 px-3 block text-center w-auto my-6 text-lg text-white bg-indigo-500 border border-indigo-600' target="_blank" :href="`https://google.com/search?q=site:https://twitter.com/i/lists/ OR site:twitter.com/*/lists ${searchTerm}`">Find more on Google</a> -->
				</div>

				<div v-show="selectedLists.length">
					<div class="p-4 bg-gray-100 rounded shadow-md border border-gray-300 h-auto">
						Export these lists:
						<ul>
							<li v-for="list in selectedLists" :key="list" class='text-xs'>{{list}}</li>
						</ul>
						<button @click="exportLists" class='rounded bg-green-500 text-white font-semibold px-3 py-2 w-full shadow-lg mt-5 mb-3'>Export</button>
					</div>
				</div>
				<div v-show="!selectedLists.length">
					<div class='border-4 border-dashed border-gray-500 p-6 rounded-lg sm:mt-10 text-gray-500 text-xl text-center'>
						Select lists by clicking on them!
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
export default {
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
		openAll(){
			const links = this.lists.map(l => l.link)
			for (const link of links){
				window.open(link, '_blank');
			}
		},

		exportLists(){
			this.$store.commit("UPDATE_STORE", {lists:this.selectedLists, tabIndex:2})
		},

		async findLists() {
			this.lists = []
			this.noData = false
			if (!this.searchTerm){
				return;
			}
			this.loading = true
			const l = await this.$axios.$get(`/api/lists/${this.searchTerm.toLowerCase()}`).finally(x => this.loading = false)
			if (l && !l.length){
				this.noData = true
			}
			this.lists = l || []
		},

		addRemoveList(link){
			const index = this.selectedLists.indexOf(link)
			if (index == -1){
				this.selectedLists.push(link)
			} else {
				this.selectedLists.splice(index, 1);
			}
		}
	},
	computed:{

		sortedLists() {
			return this.lists
			// const sortBy = this.sortBy
			// if (sortBy){
			// 	return this.lists.sort((a,b) => b[sortBy] - a[sortBy])
			// }
			// return this.lists.sort((a,b) => (b.subscribers + b.members) - (a.subscribers + a.members))
		}

	}
}

</script>
<style>
</style>
