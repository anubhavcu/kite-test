<template>
<div class="flex justify-center bg-grey-lighter">
	<client-only>
		<div class='py-10 px-4 sm:px-32 mt-16 max-w-6xl xl:mx-auto'>
			<h1 class="font-bold text-6xl text-red-600">{{error.statusCode}}</h1>
			<h2 class="font-semibold text-xl text-red-500">
				<span v-if="error.statusCode === 404">Page not found</span>
				<span v-else>An error occurred</span>
			</h2>

			<h3 class="my-3">{{error.message}}</h3>

			<a class='btn btn-blue block mb-2' href="/">Back to the homepage</a>
		</div>
	</client-only>
</div>
</template>
<script>
export default {
	props: ['error'],
	methods: {
	}
}
</script>
