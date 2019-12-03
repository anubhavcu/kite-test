<template>
  <div class='flex h-page items-center justify-center'>
	  <div class='m-4 p-10 bg-white rounded shadow md:w-3/6'>
		  <h1 class='font-semibold text-2xl'>Support</h1>
		  <h2 class='font-light'>If you have any question, please fill the form below.</h2>
			<form action="https://api.staticforms.xyz/submit" method="post" class='my-3'>
				<input type="text" name="name" placeholder="Your Name" class='my-form block w-full mb-2'>
				<input type="text" name="email" placeholder="Your Email" class='my-form block w-full mb-2' />
				<textarea name="message" class='my-form block w-full mb-2' placeholder="Your Message"></textarea>
				<input type="text" name="honeypot" style="display:none">
				<input type="hidden" name="accessKey" value="0668dc0c-d70a-44e1-9b31-d26f3f9233a9">
				<input type="hidden" name="subject" value="Jump.sh Support Email" />
				<input type="hidden" name="replyTo" value="@">
				<input type="hidden" name="redirectTo" value="https://jump.sh/support?sent=true">
				<input type="submit" value="Submit" class='btn bg-blue-600 text-white uppercase w-full block text-center font-semibold' />
			</form>
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
	}
}
</script>

<style>
</style>
