<template>
	<div class='pb-12'>
		<div class='bg-black opacity-70 block md:hidden h-screen w-screen z-10 fixed' @click="openSidebar=false" v-show="openSidebar"></div>
			<div>
				<div class="fixed top-0 left-0 w-full z-20 border-b-2 border-blue-900 shadow-lg" id='nav-wrapper' >		
					<div id='nav-bar' 
						class="contain-width flex flex-wrap md:flex-nowrap justify-between items-center bg-gray-100 border-b border-warm-gray-300 text-gray-600 shadow-sm"
						:class="openSidebar ? 'h-auto md:h-14 pb-6 md:pb-0' : 'h-12'"	
						>
						<div class='inline-flex items-center w-auto h-12' id="nav-start">
							<button
								type="button"
								@click="openSidebar=!openSidebar"
								class="px-4 border-r border-gray-300 text-gray-800 h-full md:hidden"
								aria-label="Open sidebar">
								<svg class="h-6 w-6 fill-current" stroke="currentColor" fill="none" viewBox="0 0 24 24" v-show='!openSidebar'>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
								</svg>
								<svg class="h-6 w-6 fill-current" stroke="currentColor" viewBox="0 0 24 24" v-show='openSidebar'>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
								</svg>
							</button>
							<div>
								<nuxt-link to="/" @click="openSidebar=false" class="ml-4 cursor-pointer font-bold text-2xl text-black">Kite List</nuxt-link>
							</div>			
						</div>

						<div id="nav-end" @click="openSidebar=false" class='py-2 md:py-0 px-4 w-full md:w-auto border-t border-gray-200 md:border-none flex items-center' :class="openSidebar ? '' : 'hidden md:block'">
							<div class="block md:flex items-center justify-center font-medium">
									<!-- ALWAYS VISIBLE -->
									<nuxt-link to="/app" class='font-medium mb-4 sm:mr-4 md:mb-0 block md:inline-flex'>App</nuxt-link>
									<nuxt-link to="/support" class='font-medium mb-4 md:mb-0 block md:inline-flex'>Support</nuxt-link>
									<!-- NOT LOGGED IN -->
									<nuxt-link v-show="!$auth.loggedIn" to="/price" class='font-medium mb-4 md:mb-0 md:ml-5 block md:inline-flex'>Price</nuxt-link>
									<nuxt-link v-show="!$auth.loggedIn" to="/auth" class='btn py-2 bg-green-500 md:ml-5 text-white'>Login</nuxt-link>
									<!-- LOGIN REQUIRED -->
									<nuxt-link v-show="$auth.loggedIn" to="/account" class='font-medium mb-4 md:mb-0 md:ml-5 block md:inline-flex'>Account</nuxt-link>
									<nuxt-link v-show="$auth.loggedIn" to="/auth?logout=true" class="btn py-2 bg-red-700 mb-4 md:mb-0 md:ml-5 w-auto block md:inline-flex">
										<span>Logout</span>
									</nuxt-link>

							</div>
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
			openSidebar:false
		}
	}
}
</script>