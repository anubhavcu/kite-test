<template>
	<div>
		<div class="items-center justify-center">
			<div>
				<div class='pb-3 my-4' v-show="!lists_loading">
					<div class='grid grid-cols-1 sm:grid-cols-3 items-stretch sm:items-center w-full rounded overflow-hidden gap-y-3'>
						<input class='h-12 text-sm sm:text-base sm:col-span-2 my-form bg-gray-50 border-gray-200 sm:border-r-0 sm:rounded-r-none w-full placeholder-gray-400' placeholder="Digital Marketing" v-model="searchTerm" @keyup.enter="findLists" @input="resetLists" />
						<button class="h-12 btn sm:rounded-l-none tw-bg sm:px-20" @click="findLists">Search</button>
					</div>
				</div>
				<div v-show="lists_loading" class='my-5'>
					<h2 class='text-4xl font-bold text-pink-600'>Loading lists...</h2>
				</div>
				<div v-show="lists && !lists.length && !lists_loading">
					<h2 class='text-4xl font-bold text-red-600'>No Lists Found!</h2>
				</div>
			</div>
		</div>

		<div class='py-6 h-page max-w-big mx-auto border-t border-gray-200' v-if="!lists_loading && lists && lists.length">
			<div class='grid grid-cols-1 sm:grid-cols-3 gap-10'>
				<div class='col-span-1 sm:col-span-2'>
					<div class='flex justify-between items-center'>
						<p class='text-sm text-gray-800 mb-2'>{{lists.length}} {{lists.length==1 ? 'list': 'lists'}} found</p>
					</div>
					<div>
						<div v-for="(l, index) in lists" :key='index' class='mb-5 rounded overflow-hidden' :class="[selected_lists.includes(l.link)?'bg-green-200 border-green-400 shadow':'bg-white border-gray-200', !selected_lists.includes(l.link)?'cursor-default bg-gray-200':'cursor-pointer']" @click="addRemoveList(l.link)">
							<div class="grid sm:grid-cols-10 p-4 gap-4 items-center">
								<div class='sm:col-span-2 h-16 w-16 mx-auto md:mx-0 md:mr-6 shadow-inner border border-gray-400 rounded-full overflow-hidden'>
									<img class="object-cover h-full w-full" :alt="l.title" :src="l.image ? l.image : '/tw.png'">
								</div>
								<div class="sm:col-span-8 text-center md:text-left">
									<h2 class="sm:text-lg break-all">{{l.title}}</h2>
									<a class="tw-color text-xs break-all" :href="l.link" target="_blank">{{l.link}}</a>
									<div class="text-gray-600 text-xs break-all">{{l.snippet}}</div>
								</div>
							</div>
							</div>					
					</div>
					<!-- <a class='rounded py-2 px-3 block text-center w-auto my-6 text-lg text-white bg-indigo-500 border border-indigo-600' target="_blank" :href="`https://google.com/search?q=site:https://twitter.com/i/lists/ OR site:twitter.com/*/lists ${searchTerm}`">Find more on Google</a> -->
				</div>

				<div v-show="selected_lists.length">
					<div class="p-4 bg-gray-100 rounded shadow-md border border-gray-300 h-auto">
						Export these lists:
						<ul>
							<li v-for="list in selected_lists" :key="list" class='text-xs'>{{list}}</li>
						</ul>
						<button @click="exportLists" class='rounded bg-green-500 text-white font-semibold px-3 py-2 w-full shadow-lg mt-5 mb-3'>Export</button>
					</div>
				</div>
				<div v-show="!selected_lists.length">
					<div class='border-4 border-dashed border-gray-300 p-6 rounded-lg sm:mt-10 text-gray-300 text-xl text-center'>
						Select lists by clicking on them!
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
import {mapState} from "vuex"
export default {
	data(){
		return {
			// lists:[]
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
			this.$store.commit("UPDATE_STORE", {tabIndex:2})
		},

		async findLists() {
			await this.$store.dispatch("search_lists")
		},

		addRemoveList(link){
			const selected_clone = [...this.selected_lists]
			const index = selected_clone.indexOf(link)
			if (index == -1){
				selected_clone.push(link)
			} else {
				selected_clone.splice(index, 1);
			}
			this.$store.commit("UPDATE_STORE", {selected_lists:selected_clone})
		},
		resetLists(){
			this.$store.commit("UPDATE_STORE", {lists:null})
		}
	},
	computed:{
		...mapState(['lists_loading', 'lists', 'search_term', 'selected_lists']),
		searchTerm:{
			get(){
				return this.search_term
			},
			set(v){
				this.$store.commit("UPDATE_STORE", {search_term:v})
			}
		}
	}
}

</script>
<style>
</style>
