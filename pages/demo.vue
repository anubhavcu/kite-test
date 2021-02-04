<template>
  <div class='h-page flex px-4'>
	  <div class='mx-auto my-8 p-10 bg-white rounded shadow md:w-4/6 border-gray-200'>
		  <h1 class='font-semibold text-2xl'>The table below is a demo of how our exports look like</h1>
		  <h2>All our exports contain all the data you see in the table below</h2>
		  <div class="mt-6">
			  <div id="table-wrapper" class='w-full overflow-auto bg-gray-100'>
				  <table class="table-auto border border-gray-200 rounded-lg">
					    <thead>
					      <tr class='bg-gray-200'>
					        <th class="px-4 py-2 border-b border-gray-200 text-left" v-for="header in Object.keys(rows[0])" :key="header">{{header}}</th>
					      </tr>
					    </thead>
					    <tbody>
					      <tr v-for="(row, inx) in rows" :key="inx" class="border-b border-gray-200">
					        <td class="px-4 py-2 text-xs" v-for="val in Object.values(row)" :key="val">{{val}}</td>
					      </tr>
					  	</tbody>
				  </table>
			    </div>
				<p class='text-center text-sm italic text-gray-700'> ... Usually exports have thousands rows!</p>
		  </div>
		
			<div class='mt-6'>
				You can upload our exports directly to Twitter following the official guide: <br>
				<a class='mt-2 block text-indigo-400' target="_blank" href="https://business.twitter.com/en/help/campaign-setup/campaign-targeting/custom-audiences/lists.html">
					https://business.twitter.com/en/help/campaign-setup/campaign-targeting/custom-audiences/lists.html
				</a>
			</div>
	  </div>
  </div>
</template>
<script>
const d = require("~/assets/demo.json")
export default {
	layout:'index',
	computed:{
		rows(){
			return d
		}
	}
}
</script>

<style>
</style>
