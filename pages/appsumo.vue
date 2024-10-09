<template>
	<div class='p-6'>
		<div>
		<div>
			<h1 class='text-4xl font-bold'>KiteList ❤️ AppSumo</h1>
			<p class='mt-3'>
				Get ready to enjoy a lifetime of fresh leads!	
			</p>
			<p class='rounded p-4 border-4 border-dashed border-red-400 bg-transparent text-gray-600 max-w-lg my-3'>
				<span>Do you have multiple codes?</span> <br> Just submit this form multiple times with the <b>same</b> email address!
			</p>
		</div>
		<form class="max-w-lg" @submit.prevent="sendCode">
			<label class='block mt-4 font-bold text-lg tracking-wide' for='email'>Email:</label>
			<input id="email" name="email" class='my-form w-full bg-white shadow mt-1' placeholder="hello@company.com" type="email" autocomplete="on" v-model="email" @input='error=null'>
			
			<label class='sr-only' for="miele">Don't fill this</label>
			<input aria-label="miele" id="miele" class='hidden' style="display:none !important " label="Miele" tabindex="-1"
								autocomplete="off" v-model="miele" type="text" name="miele" placeholder="miele" />
			
			<label class='block mt-4 font-bold text-lg tracking-wide' for="code"> Your AppSumo Code: </label>
			<input name="code" id="code" class='my-form w-full bg-white shadow mt-1' autocomplete="off" placeholder="secret-code" v-model='code' @input='error=null'>
		

			<label class="inline-flex items-center mt-4 label">
                <input type="checkbox" class="mr-2 h-5 w-5 text-gray-600" v-model="tos">
				<p>I've read and I accept the <nuxt-link class='text-blue-700' to="/tos">terms of service and the privacy policy</nuxt-link>  </p>
            </label>
			
			<p class='small-error my-5' v-show="error">{{error}}</p>
			<button class='btn bg-red-600 mt-6 w-full' type="submit" :class="{'loading':loadSend, 'disabled':!tos}">Get your lifetime access</button>
		</form>			
		</div>
	</div>
</template>
<script>
export default {
	layout:'main',
	head() {
      return {
		title: "KiteList Lifetime Deal"
	  }
	},
	data(){
		return {
			sent_values:'',
			miele:'',
			email:'',
			code:'',
			error:null,
			loadSend:false,
			tos:false
		}
	},
	mounted(){
		this.email = this.$route.query.email || ""
		this.code = this.$route.query.code || ""
	},
	methods:{
		async sendCode(){
			if (!this.tos){
				this.error = "You need to accept the terms of service";
				return;
			}
			let email;
			if (this.$auth.loggedIn){
				email = this.$auth.user.email
			} else {
				email = this.email.toLowerCase().trim()
			}
			const sent_values = `${email}_${this.code}`
			if (sent_values === this.sent_values){
				return; // Avoids filling the form twice
			}
			if (this.miele.length){
				this.error = "Sorry your bot verification failed. Please get in touch!"
				return;
			}
			if (this.code.length <10){
				this.error = `The code your entered (${this.code}) seems too short. Make sure that you add a valid code`
				return;
			}
			const valid = /\S+@\S+\.\S+/.test(email)
			if (!valid){
				this.error = `${email} is not a valid email address`
				return;
			}
			this.sent_values = sent_values
			try {
				this.loadSend = true
				await this.$axios.$post("/api/appsumo", {code:this.code, email:email})
				this.loadSend = false
			} catch(e){
				this.error = this.errorMsg(e)
				this.loadSend = false
				return;
			}
			alert("The promo code has been applied to your account. Thank you!")
			if (this.$auth.loggedIn){
				this.$router.push({path: "/app", query: {} })
			} else {
				this.$router.push({path: "/auth", query: {email:email} })
			}

		}
	}
}
</script>
<style>
</style>