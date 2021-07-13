<template>
	<div>
		<div class='grid sm:grid-cols-3 gap-6'>
			<div class='sm:col-span-2'>
					<p class='text-4xl font-black mb-4'> Welcome to KiteList! </p>
					<p>
						KiteList is a simple tool which allows you to create <b>hyper-relevant</b> twitter ads. <br>
						It will allow you to target ads based on Twitter Lists. <br> There are lists for almost any niche and 
						each list contains thousands subscribers and followers. <br>
						This is how it works:
					</p>
			</div>
			<div>
				<video height="340" controls controlsList="nodownload" class='border-4 border-gray-900 shadow-lg rounded-lg overflow-hidden ring-0 focus:ring-0 focus:outline-none'>
					<source src="/kitelist.mp4" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
		<div>
					<ul class="list-decimal list-inside mt-6">
						<li>
							<b>Find relevant lists:</b><br>
							<p class='ml-5'>Use our <span class='text-blue-800 underline cursor-pointer' @click="$store.commit('UPDATE_STORE', {tabIndex:1})">Search Engine</span> or search directly on Google for lists in your niche</p>
						</li>
						<li class='mt-4'>
							<b>Export Subscribers & Members:</b><br>
							<p class='ml-5'>Use our <span class='text-blue-800 underline cursor-pointer' @click="$store.commit('UPDATE_STORE', {tabIndex:2})">Export Tool</span> to export all members and subscribers of your lists </p>
						</li>
						<li class='mt-4'>
							<b>Upload the CSV to Twitter Ads:</b><br>
							<p class='ml-5'>Follow <a class='text-blue-800 underline cursor-pointer' href="https://business.twitter.com/en/help/campaign-setup/campaign-targeting/custom-audiences/lists.html" target="_blank">the official guide</a> and import all the subscribers & members as a custom audience on Twitter</p>
						</li>
						<li class='mt-4'>
							<b>Profit 🤑:</b><br>
							<p class='ml-5'>Your ads will show only to relevant users inside your niche and not to people not interested on your product</p>
						</li>
					</ul>			
		</div>
	</div>
</template>