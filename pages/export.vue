<template>
  <div class='h-page flex px-4'>
	  <div class='mx-auto my-8 p-10 bg-white rounded shadow md:w-4/6 border-gray-200'>
		  <h1 class='font-semibold text-2xl'>Export all subscribers and members from twitter lists</h1>
		  <h2>Add up to 5 lists in the box below and we will export all subscribers and members for each list</h2>
		  <div class="mt-6">
			<textarea v-model="submittedLinks" class='my-form w-full bg-gray-100' rows="5" placeholder="https://twitter.com/handle/lists/list-name"></textarea>
			<p class='text-red-600' v-if="allLinks.length>5">
				You can have maximum 5 links per export
			</p>
		  </div>
		  <div>
			<download :links="links" :total="{}"></download>
		  </div>
	  </div>
  </div>
</template>

<script>
// import download from "~/components/download.vue"
export default {
	layout:'index',
	data(){
		return {
			submittedLinks:''
		}
	},
	// components: {download},
	computed:{
		allLinks(){
			const rows = this.submittedLinks.split("\n") || []
			const nonDuplicates = [ ...new Set(rows.filter(l => l.startsWith("https://twitter.com")))]
			return nonDuplicates
		},
		links(){
			const first5 = this.allLinks.slice(0, 5)
			return first5
		}
	}
}
</script>

<style>
</style>
