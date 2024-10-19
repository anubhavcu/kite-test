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
					<lazyWelcomeTab></lazyWelcomeTab>
				</div>
				<div v-show="tabIndex===1">
					<lazySearchLists></lazySearchLists>
				</div>	

				<div v-show="tabIndex===2">
					<lazyExportLists></lazyExportLists>
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