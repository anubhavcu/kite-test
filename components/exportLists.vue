<template>
<div>
	<div>
		
		<div>
			<textarea class='my-form w-full' v-model="listString" rows="10" placeholder="https://twitter.com/"></textarea>
			<div class='bg-red-100 text-red-600 border border-red-600 rounded my-4 p-3 text-sm' v-show="errorLists.length">
				Some of yours lists are not valid. Lists to be valid need to start with: https://twitter.com.
				Invalid lists are:<br>
				<ul class='list-inside list-disc'>
					<li v-for="(l, lin) in errorLists" :key="lin">{{l}}</li>
				</ul>
			</div>
		</div>

		<div>
			<div class='my-4'>
				<p class='text-lg mb-2 font-medium'>For each list, download:</p>
				<div class=" mb-6">
					<label class='block'>
						<input class="mr-2" type="radio" value="0" v-model.number="product">
						<span> All subscribers</span>
					</label>
					<label class='block'>
						<input class="mr-2" type="radio" value="1" v-model.number="product">
						<span> All members</span>
					</label>
					<label class='block'>
						<input class="mr-2" type="radio" value="2" v-model.number="product">
						<span> All members and all subscribers</span>
					</label>
				</div>
			</div>
		
			<div>
				<button class='rounded shadow border border-teal-600 text-lg font-bold uppercase bg-green-600 text-white text-center w-full py-3 px-3' @click=download>Download</button>				
			</div>
		</div>
	</div>
	<div>
		<div v-if="downloading" class='btn bg-transparent cursor-default text-lg font-semibold text-center text-green-600'>
			Downloading... Please wait...
		</div>
	</div>
</div>
</template>
<script>
export default {
	data(){
		return {
			product:0,
			downloading:false,
		}
	},
	computed:{
		storeLists(){
			return [...this.$store.state.selected_lists]
		},
		errorLists(){
			return this.storeLists.filter(list => !list.startsWith("https://twitter.com"))
		},
		listString:{
			get(){
				return this.storeLists.join("\n")
			},
			set(v){
				this.$store.commit("UPDATE_STORE", { selected_lists: v.split("\n") })
			}
		}
	},
	methods:{
		download(){
			if (this.$auth.loggedIn){
				this.downloadLeads()
			} else {
				alert("You need to login to export these lists!")
				this.$router.push("/price")
				// this.pay()
			}
		},

		async downloadLeads(){
			const links = this.storeLists.filter(list => list.startsWith("https://twitter.com"))
			if (!links.length){
				alert("You need to pass at least one valid link!")
				return;
			}
			this.downloading = true
			const r = await this.$axios.$post("/api/leads", {download:this.product, links:links})
			.catch(e => this.downloading = false)
			this.downloading = false
			if ("url" in r) {
				window.location.href = r.url
			}
		},
	}

}
</script>
