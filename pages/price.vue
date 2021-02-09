<template>
	<div>
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="bg-gray-100">
  <div class="pt-8 sm:pt-12 lg:pt-18">
    <div class="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto space-y-2 lg:max-w-none">
        <h2 class="text-lg leading-6 font-semibold text-gray-900 uppercase tracking-wider">
          Pricing
        </h2>
        <p class="text-3xl font-extrabold text-black sm:text-4xl lg:text-5xl">
          Pay per export or buy a subscription
        </p>
        <p class="text-xl text-gray-900">
          Don't want to subscribe? Just pay once directly in the <nuxt-link class='text-pink-600 font-semibold' to='/app'>export tab</nuxt-link>
        </p>
      </div>
    </div>
  </div>
  <div class="mt-8 pb-12 bg-gray-50 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
    <div class="relative">
      <div class="absolute inset-0 h-3/4 bg-gray-100"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
          <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div class="px-6 py-8 bg-white sm:p-10 sm:pb-6">
              <div>
                <h3 class="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600" id="tier-standard">
                  Lite Subscription
                </h3>
              </div>
              <div class="mt-4 flex items-baseline text-6xl font-extrabold">
                $29
                <span class="ml-1 text-2xl font-medium text-gray-500">
                  /mo
                </span>
              </div>
              <p class="mt-5 text-lg text-gray-700">
                Best for <b>freelancers</b> and companies requiring few exports each month
              </p>
            </div>
            <div class="flex-1 bg-gray-50 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
              <ul class="space-y-4">
                <li class="flex items-start" v-for="x in ['15 Exports per month', 'Unlimited Searches', 'Export all members', 'Export all subscribers']" :key="x">
                  <div class="flex-shrink-0">
                    <!-- Heroicon name: outline/check -->
                    <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="ml-3 text-base text-gray-700">{{x}}</p>
                </li>
              </ul>
              <div class="rounded-md shadow">
                <a @click="pay(644898)" class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900" aria-describedby="tier-standard">
                  Get started
                </a>
              </div>
            </div>
          </div>

          <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div class="px-6 py-8 bg-white sm:p-10 sm:pb-6">
              <div>
                <h3 class="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600" id="tier-standard">
                  Pro
                </h3>
              </div>
              <div class="mt-4 flex items-baseline text-6xl font-extrabold">
                $49
                <span class="ml-1 text-2xl font-medium text-gray-500">
                  /mo
                </span>
              </div>
              <p class="mt-5 text-lg text-gray-700">
                Ideal for <b>Agencies</b> and companies who plan to do many exports
              </p>
            </div>
            <div class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
              <ul class="space-y-4">
                <li class="flex items-start" v-for="x in ['Unlimited Exports per month', 'Unlimited Searches', 'Export all members', 'Export all subscribers']" :key="x">
                  <div class="flex-shrink-0">
                    <!-- Heroicon name: outline/check -->
                    <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="ml-3 text-base text-gray-700">{{x}}</p>
                </li>
              </ul>
              <div class="rounded-md shadow">
                <a @click="pay(577736)" class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900" aria-describedby="tier-standard">
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-5">
      <div class="max-w-md mx-auto lg:max-w-5xl">
        <div class="rounded-lg px-6 py-8 sm:p-10 lg:flex lg:items-center bg-gray-900 shadow-xl">
          <div class="flex-1">
            <div>
              <h3 class="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-white text-gray-800">
                One Time
              </h3>
            </div>
            <div class="mt-4 text-lg text-gray-300">If you just want to test out an export or you just need a few specific lists you can just pay for them without a subscription. <span class="font-semibold text-gray-400">$19/ Per export</span>.</div>
          </div>
          <div class="mt-6 rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0">
            <nuxt-link to="/app" class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-50">
              Pay when exporting
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>
<script>
export default {
	methods:{
		pay(plan_id){
			const plans = {
				577736:{
					name:"KiteList Pro Subscription",
					price:"49",
				},
				644898:{
					name:"Kitelist Light Subscription"
				}
			}
			const vm = this
			if (this.$ga){
				this.$ga.event('purchase', 'open-checkout', 'agency', 1)
			}
			Paddle.Setup({ vendor: 27713, debug: false })
			Paddle.Checkout.open({
				product:plan_id,
				allowQuantity: false,
				disableLogout: true,
				title: 'KiteList Subscription',
				message: 'Get access to unlimited leads',
				successCallback:(paddleData) => {
					// vm.saveUser(paddleData)
					vm.$router.push("/welcome")
				}
			})
		},
	}
}
</script>