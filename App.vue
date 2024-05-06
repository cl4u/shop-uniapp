<script>
	export default {
		onLaunch: function() {
			this.$store.commit("initUser")
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "@/common/common.css";
	@import '@/static/font/iconfont.css';
</style>
