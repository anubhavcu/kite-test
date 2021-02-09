<template>
	<div>
		<div class='bg-blue-800 w-screen h-20 shadow-inner'></div>
			<div class='p-5 max-w-6xl mx-auto'>
		<div class='rounded shadow-xl overflow-hidden -mt-16'>
			<ul class="inline-flex items-center justify-start bg-gray-100 w-full rounded-t">
				<li 
					v-for="(tab, index) in tabs" :key="tab"
					@click="tabIndex=index"
					:class="tabIndex===index ? 'border-blue-800 text-blue-800' : 'text-gray-700 border-transparent cursor-pointer' "
					class='border-b-4 mx-3 py-2 font-medium text-xs sm:text-base'> 
					{{tab}}
				</li>
			</ul>

			<div class='bg-white p-5 border-t border-gray-50 min-h-70vh'>
				<div v-show="!tabIndex" class='leading-8'>
					<p class='text-4xl font-black mb-4'> Welcome to KiteList! </p>
					<p>
						KiteList is a simple tool which allows you to create <b>hyper-relevant</b> twitter ads. <br>
						It will allow you to target ads based on Twitter Lists. <br> There are lists for almost any niche and 
						each list contains thousands subscribers and followers. <br>
						This is how it works:
					</p>
					<ul class="list-decimal list-inside mt-6">
						<li>
							<b>Find relevant lists:</b><br>
							<p class='ml-5'>Use our <span class='text-blue-800 underline cursor-pointer' @click="tabIndex=1">Search Engine</span> or search directly on Google for lists in your niche</p>
						</li>
						<li class='mt-4'>
							<b>Export Subscribers & Members:</b><br>
							<p class='ml-5'>Use our <span class='text-blue-800 underline cursor-pointer' @click="tabIndex=2">Export Tool</span> to export all members and subscribers of your lists</p>
						</li>
						<li class='mt-4'>
							<b>Upload the CSV to Twitter Ads:</b><br>
							<p class='ml-5'>Follow <a class='text-blue-800 underline cursor-pointer' href="https://business.twitter.com/en/help/campaign-setup/campaign-targeting/custom-audiences/lists.html" target="_blank">the official guide</a> and import all the subscribers & members as a custom audience on Twitter</p>
						</li>
						<li class='mt-4'>
							<b>Profit 🤑:</b><br>
							<p class='ml-5'>Your ads will show only to relevant users inside your niche and not to people not interested on your product</p>
						</li>
					</ul>
				</div>
				<div v-show="tabIndex===1">
					<searchLists></searchLists>
				</div>	

				<div v-show="tabIndex===2">
					<exportLists></exportLists>
				</div>				
			</div>
		</div>
	</div>
	</div>
</template>
<script>
import searchLists from "~/components/searchLists.vue"
import exportLists from "~/components/exportLists.vue"
export default {
	components:{searchLists, exportLists},
	data(){
		return {
			tabs:["Welcome", "Search Lists", "Export Lists"]
		}
	},
	async mounted(){
		const {search} = this.$route.query
		if (search){
			this.$store.commit("UPDATE_STORE", {search_term:search, tabIndex:1})
			await this.$store.dispatch("search_lists")
		}
	},
	computed:{
		tabIndex:{
			get(){
				return this.$store.state.tabIndex
			},
			set(v){
				this.$store.commit("UPDATE_STORE", {tabIndex:v})
			}
		}
	}
}
</script>