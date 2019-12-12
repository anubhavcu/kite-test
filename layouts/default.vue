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

		<script>
		window['_fs_debug'] = false;
		window['_fs_host'] = 'fullstory.com';
		window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
		window['_fs_org'] = 'QK7Z7';
		window['_fs_namespace'] = 'FS';
		(function(m,n,e,t,l,o,g,y){
		    if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
		    g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
		    o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
		    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
		    g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
		    g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
		    g.log = function(a,b) { g("log", [a,b]) };
		    g.consent=function(a){g("consent",!arguments.length||a)};
		    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
		    g.clearUserCookie=function(){};
		})(window,document,window['_fs_namespace'],'script','user');
		</script>
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
