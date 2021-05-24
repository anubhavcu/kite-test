<template>
	<div>
<div class="relative bg-white overflow-hidden h-page">
  <div class="hidden lg:block lg:absolute lg:inset-0" aria-hidden="true">
    <svg class="absolute top-0 left-1/2 transform translate-x-64 -translate-y-8" width="640" height="784" fill="none" viewBox="0 0 640 784">
      <defs>
        <pattern id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047" x="118" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
        </pattern>
      </defs>
      <rect y="72" width="640" height="640" class="text-gray-50" fill="currentColor" />
      <rect x="118" width="404" height="784" fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)" />
    </svg>
  </div>
  <div class="relative pt-6 pb-16 sm:pb-16 lg:pb-20">

    <main class="mt-12 mx-auto max-w-7xl px-4 sm:mt-16 sm:px-6 lg:mt-20">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1>
            <span class="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">Increase your ROI by 10X</span>
            <span class="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
              <span class="block text-gray-900">Make Super Targeted</span>
              <span class="block text-blue-800">Twitter Ads</span>
            </span>
          </h1>
          <div class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
			  <p>Kitelist allows you target Twitter Ads to any subscriber of public Twitter lists.</p>
			  <p class="mt-4">We have a database of over <span class='text-pink-600 font-black'>10.000</span> Twitter lists in any niche or market. <b class="font-bold text-pink-600">You can target them all!</b></p>
		  </div>
          <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
            <p class="text-base font-medium text-gray-900"> Start by searching your niche: </p>
			<form class="grid sm:grid-cols-3 gap-3 mt-1 mb-4" @submit.prevent="search">
				<input class='my-form sm:col-span-2 shadow-md' placeholder="Search for your niche" v-model='search_term'>
				<button type="submit" class="btn shadow-md bg-blue-900 text-white inline-flex items-center justify-center">
					<svg class='h-5 w-5 mr-2 fill-current' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
					</svg>
					Search
				</button>
			</form>
            <div class="mt-3 text-sm flex flex-wrap">
              <p class='text-gray-500 mr-2'>For Example:</p>
              <nuxt-link class='mr-2 underline text-blue-800' :to="`/app?search=${ex}`" v-for="ex in ['Marketing', 'Forex', 'Wedding', 'Real Estate', 'Bitcoin']" :key="ex">{{ex}}</nuxt-link>
            </div>
          </div>
        </div>
        <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
          <svg class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 scale-75 origin-top sm:scale-100 lg:hidden" width="640" height="784" fill="none" viewBox="0 0 640 784" aria-hidden="true">
            <defs>
              <pattern id="4f4f415c-a0e9-44c2-9601-6ded5a34a13e" x="118" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect y="72" width="640" height="640" class="text-gray-50" fill="currentColor" />
            <rect x="118" width="404" height="784" fill="url(#4f4f415c-a0e9-44c2-9601-6ded5a34a13e)" />
          </svg>
				<video height="340" controls controlsList="nodownload" class='relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md ring-0 focus:ring-0 focus:outline-none bg-blue-600 p-0.5 bg-opacity-90 overflow-hidden'>
					<source src="/kitelist.mp4" type="video/mp4">
					Your browser does not support the video tag.
				</video>
        </div>
      </div>
    </main>
  </div>
</div>

	</div>
</template>
<script>
export default {
	data(){
		return {
			search_term:""
		}
	},
	methods:{
		search(){
			const query = this.search_term.length ? {search:this.search_term} : {}
			this.$router.push({name:'app', query:query})
		}
	}
}
</script>