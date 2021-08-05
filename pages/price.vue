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
          Get our annual deal now!
        </p>
        <p class="text-xl text-gray-900">
			Use code annual20 for 20% off the annual plan and get access to unlimited exports for a year!
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
                $15
                <span class="ml-1 text-2xl font-medium text-gray-500">
                  /mo
                </span>
              </div>
              <p class="mt-5 text-lg text-gray-700">
                Best for <b>freelancers</b> and companies requiring few exports each month
              </p>
            </div>
            <div class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
              <ul class="space-y-4">
                <li class="flex items-start" v-for="x in ['Unlimited exports', 'Unlimited Searches', 'Export all members', 'Export all subscribers']" :key="x">
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
                <a :href="plans.monthly" class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900" aria-describedby="tier-standard">
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
                $150
                <span class="ml-1 text-2xl font-medium text-gray-500">
                  /Annual
                </span>
              </div>
              <p class="mt-5 text-lg text-gray-700">
                Ideal for <b>Agencies</b> and companies who plan to do many exports
              </p>
            </div>
            <div class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
              <ul class="space-y-4">
                <li class="flex items-start" v-for="x in ['Unlimited Exports per month', 'Unlimited Searches', 'Export all members', 'Export all subscribers', 'Yearly Access']" :key="x">
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
                <a :href="plans.annual" class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900" aria-describedby="tier-standard">
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
		<p class='text-sm text-center mt-10 text-gray-700'>30 days refund guarantee on all plans</p>
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
			plans:{
				monthly: "https://buy.stripe.com/6oEcQefAq1tX0yA9AA",
				annual: "https://buy.stripe.com/6oE4jI87Y0pT812cMN"
			}
		}
	}
}
</script>