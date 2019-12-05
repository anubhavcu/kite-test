<template>
  <div class='h-page bg-gray-100 max-w-big border-l border-r border-gray-200 mx-auto'>
	<div class='h-10 flex justify-between px-4 items-center border-b border-gray-200 max-w-big'>
		<div>
			<a href="/" class='text-black font-bold'>Jump<span class='text-gray-500 font-hairline'>.sh</span></a>
		</div>
		<div class='text-blue-600 font-light'>
			<nuxt-link to="/demo" class="mr-4">Demo</nuxt-link>
			<nuxt-link to="/export" class="mr-4">Export</nuxt-link>
			<nuxt-link to="/pro" class="mr-4">Pro</nuxt-link>
			<nuxt-link to="/support">Support</nuxt-link>
		</div>
	</div>
    <nuxt />
	<div v-if="showScripts">
		<!-- start Gist JS code-->
		<script>    (function(d,h,w){var gist=w.gist=w.gist||[];gist.methods=['trackPageView','identify','track','setAppId'];gist.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);gist.push(e);return gist;}};for(var i=0;i<gist.methods.length;i++){var c=gist.methods[i];gist[c]=gist.factory(c)}s=d.createElement('script'),s.src="https://widget.getgist.com",s.async=!0,e=d.getElementsByTagName(h)[0],e.appendChild(s),s.addEventListener('load',function(e){},!1),gist.setAppId("rourth3t"),gist.trackPageView()})(document,'head',window);
		</script>
		<!-- end Gist JS code-->
	</div>
  </div>
</template>
<script>
export default {
	data(){
		return {showScripts:false}
	},
	head() {
		return {
			link: [ { rel: 'canonical', href: `https://jump.sh${this.$route.path && this.$route.path.endsWith("/") ? this.$route.path.slice(0, -1) : this.$route.path}` } ]
		}
	},
	mounted(){
		this.showScripts = true
	}
}
</script>

<style>

</style>
