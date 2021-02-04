<template>
	<div class='max-w-2xl py-32'>
			<div class="p-2 md:p-12">
				<div v-show="loginStep==1">
					<div>
						<h1
							class="text-2xl leading-8 font-extrabold text-gray-800 sm:text-3xl sm:leading-9">
							Login to KiteList
						</h1>
						<p class="mt-3 text-lg leading-6 text-gray-600">
							Type your email to get a login link. <br> No passwords required!
						</p>
					</div>

					<form @submit.prevent="sendMagicLink" class="mt-8 grid gap-6 grid-cols-1">
						<div class="">
							<label class='sr-only' for="miele">Don't fill this</label>
							<input aria-label="miele" id="miele" class='hidden' style="display:none !important " label="Miele" tabindex="-1"
								autocomplete="off" v-model="miele" type="text" name="miele" placeholder="miele" />
							<label class='sr-only' for="email-address">Email Address</label>
							<input id="email-address" name="email" autocomplete="on" v-model="email"
								aria-label="Email address" required
								type="email"
								class="appearance-none w-full px-5 py-3 border border-gray-300 focus:border-orange-400 text-base leading-6 rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out shadow-lg"
								placeholder="Type your email here" />
						</div>
						<button
							type="submit"
							class="shadow-lg w-full flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:bg-emerald-400 transition duration-150 ease-in-out">
							Send Magic Link
						</button>
					</form>

				</div>

				<div v-show="loginStep==2">
					<div class='text-gray-600'>
						<svg class='w-24 h-24 fill-current' viewBox="0 0 24 24">
							<path d="M13 17H17V14L22 18.5L17 23V20H13V17M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H11V18H4V8L12 13L20 8V14H22V6A2 2 0 0 0 20 4M12 11L4 6H20Z" />
						</svg>
						<h2 class="text-4xl font-bold text-gray-600"> Email sent! </h2>
						<h3 class="text-xl mt-3 text-gray-500"> Click on the link in your <span class='text-emerald-500 font-semibold tracking-wide'>{{email}}</span> inbox to login.</h3>
					</div>
				</div>

				<div v-show="loginStep==3" class='text-gray-600'>
					<h2 class="text-4xl font-bold"> Logging you in... </h2>
					<h3 class="text-xl mt-3 text-gray-500"> One second... </h3>
				</div>
				<div class="small-error mt-10 text-base py-1 px-3" v-if="error">{{error}}</div>
			</div>
	</div>
</template>

<script>

export default {
	head() {
      return {
		title: "Kite List Login"
	  }
	},
		data() {
			return {
				sent_email:'',
				email: '',
				miele: '',
				error: null,
				verifyingEmail: false,
				loginStep: 1, // Can be 1, 2 or 3
			}
		},
		created() {
			const p = this.$route.query
			if (p.email) {
				this.email = p.email
				this.sendMagicLink()
			}
			if (p.logout) {
				this.logout()
			}
			if (p.error) {
				this.error = p.error
			}
			if (p.token) {
				this.convertToken(p.token)
			}
			if (this.$auth.loggedIn){
				this.go_to_app()
			}
		},
		methods: {
			sendMagicLink() {
				this.error = null
				if (this.miele.length) {
					this.error = "Bots not allowed!";
					return;
				}
				if (this.email === this.sent_email){ 
					// Avoids submitting twice when user clicks fast
					return;
				}
				const valid = /\S+@\S+\.\S+/.test(this.email)
				if (!valid){
					this.error = `${this.email} is not a valid email address`
					return;
				}
				this.sent_email = this.email
				this.$axios.post('/api/auth', {
						email: this.email,
						url: window.location.origin
					})
					.then(r => {
						this.loginStep = 2
					})
					.catch(e => {
						this.error = this.errorMsg(e)
						this.loginStep = 1
					})
			},
			go_to_app(){
				this.$router.push({path: "/app", query: {} })
			},
			async convertToken(shortLifeToken) {
				this.error = null
				this.loginStep = 3
				await this.$auth.loginWith('local', {
						data: { token: shortLifeToken }
					})
					.then(r => 
						this.go_to_app()
					)
					.catch(e => {
						this.loginStep = 1
						this.error = this.errorMsg(e)
					})
			},

			async logout() {
				await this.$axios.setToken(false)
				await this.$auth.logout()
				if (this.$sentry){
					this.$sentry.configureScope(scope => scope.setUser(null));
				}
				// window.location.href = this.$route.query.next || "/"
			}
		}
	}
</script>

<style>

</style>
