<template>
	<div>
		<div>
	<div>
<!-- This example requires Tailwind CSS v2.0+ -->
<div>
  <div class="max-w-7xl mx-auto py-8 px-4 divide-y-2 divide-gray-200 sm:py-12 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-extrabold text-gray-900">
      Frequently asked questions
    </h2>
    <div class="mt-6 pt-10">
      <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12">
        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            Is this legal?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
			  Yes of course! We don't scrape or do any black-hat practices. We use the official Twitter API to collect the data.
		</dd>
        </div>

        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            Is this really effective?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
			  Behavioral advertising has been proven to be extremely effective. It's obviously much easier to sell something to someone already interested on your product.
		   </dd>
        </div>

        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            Can I cancel at any time?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            Yes, you can cancel at any time just clicking on a button in your account settings. There is no minimum subscription time, nor cancellation fees, nor any other fee.
          </dd>
        </div>


        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            What data KiteList exports?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            KiteList can export all subscribers & members of Twitter Lists. 
			For each subscriber or member it will export their handle, location, number of followers, name, description and more. 
			You can have a look at a demo export at <nuxt-link to="/demo" class="text-blue-700">KiteList.com/demo</nuxt-link>
          </dd>
        </div>


        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            What's your refund policy?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            If you are not satisfied we are more that happy to refund you your last payment (30 days refund policy)
          </dd>
        </div>

        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            How does it work exactly
          </dt>
          <dd class="mt-2 text-base text-gray-500">
			  When you open the app we have a very good video explaining everything in details. (You don't need to create an account to watch it)
          </dd>
        </div>

        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            I have another question, how can I reach out?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
			  Please email us at team@kitelist.com or use the contact form below
		   </dd>
        </div>
      </dl>
    </div>

	<div class='mt-8 pt-8'>
		<h1 class='text-3xl font-extrabold text-gray-900'>Get in touch</h1>
		<h2 class='text-gray-800'>If you have any other question, please fill the form below.</h2>
		<form action="https://api.staticforms.xyz/submit" method="post" class='my-6 max-w-lg'>
			<input type="text" name="name" placeholder="Your Name" class='my-form block w-full mb-2 shadow-sm'>
			<input type="text" name="email" placeholder="Your Email" class='my-form block w-full mb-2 shadow-sm' />
			<textarea name="message" rows="10" class='my-form block w-full mb-2 shadow-sm' placeholder="Your Message"></textarea>
			<input type="text" name="honeypot" style="display:none">
			<input type="hidden" name="accessKey" value="0668dc0c-d70a-44e1-9b31-d26f3f9233a9">
			<input type="hidden" name="subject" value="kitelist Support Email" />
			<input type="hidden" name="replyTo" value="@">
			<input type="hidden" name="redirectTo" value="https://kitelist.com/support?sent=true">
			<input type="submit" value="Submit" class='btn bg-blue-800 text-white uppercase w-full block text-center font-semibold mt-6' />
		</form>		
	</div>

  </div>
</div>

	</div>			
		</div>
  </div>
</template>

<script>

export default {
	layout:'index',
	data(){
		return {
			email:""
		}
	},
	mounted(){
		const u = window.location.href || ''
		if (u.includes("sent=true")){
			alert("Form Sent. We will get in touch soon!")
		}
	}
}
</script>

<style>
</style>
