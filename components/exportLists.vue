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
						<span> All subscribers <span v-show="!$auth.loggedIn">for 19$</span></span>
					</label>
					<label class='block'>
						<input class="mr-2" type="radio" value="1" v-model.number="product">
						<span> All members <span v-show="!$auth.loggedIn">for 19$</span> </span>
					</label>
					<label class='block'>
						<input class="mr-2" type="radio" value="2" v-model.number="product">
						<span> All members and all subscribers <span v-show="!$auth.loggedIn">for 29$</span> </span>
					</label>
				</div>
			</div>
		
			<div>
				<button class='rounded shadow border border-teal-600 text-lg font-bold uppercase bg-green-600 text-white text-center w-full py-3 px-3' @click=download>Download</button>
				<p class='text-sm text-center text-gray-800 mt-2' v-show="!$auth.loggedIn">
					Not happy with the results? We refund you immediately<span @click="downloadLeads">!</span>
				</p>				
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
import Papa from 'papaparse'
import saveAs from 'file-saver'
export default {
	data(){
		return {
			product:0,
			downloading:false,
		}
	},
	computed:{
		storeLists(){
			return [...this.$store.state.lists]
		},
		errorLists(){
			return this.storeLists.filter(list => !list.startsWith("https://twitter.com"))
		},
		listString:{
			get(){
				return this.storeLists.join("\n")
			},
			set(v){
				this.$store.commit("UPDATE_STORE", { lists: v.split("\n") })
			}
		}
	},
	methods:{
		download(){
			if (this.$auth.loggedIn){
				this.downloadLeads()
			} else {
				this.pay()
			}
		},
		pay() {
			const vm = this
			if (this.$ga){
				this.$ga.event('purchase', 'open-checkout', this.product, 0)
			}
			Paddle.Setup({ vendor: 27713, debug: false })
			const prod = this.product==2 ? 577738 : 577737
			Paddle.Checkout.open({
				product: prod,
				allowQuantity: false,
				title: 'KiteList Export',
				message: 'Your CSV will be immediately downloaded! This is a one time fee.',
				disableLogout: true,
				successCallback:(paddleData) => { vm.downloadLeads(paddleData) }
			})
    	},
		async downloadLeads(){
			this.downloading = true
			const links = this.storeLists.filter(list => list.startsWith("https://twitter.com"))
			if (!links.length){
				alert("You need to pass at least one valid link!")
				return;
			}
			const r = await this.$axios.$post("/api/leads", {download:this.product, links:links})
			this.downloading = false
			if ("url" in r) {
				window.location.href = r.url
			}
		},
	}

}
</script>
