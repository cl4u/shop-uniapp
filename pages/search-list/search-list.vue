<template>
	<view class="search-list">
		<ShopList :keyword="keyword"></ShopList>
	</view>
</template>

<script>
	import ShopList from "@/components/common/shopList.vue"
	export default {
		components: {ShopList},
		data() {
			return {
				keyword: ""
			}
		},
		onLoad(e) {
			// 获取传递过来的参数
			this.keyword = e.keyword;
			
			// app端通过webview的方式改变标题输入框的值
			// #ifdef APP-PLUS
				let webview = this.$mp.page.$getAppWebview();
				webview.setTitleNViewSearchInputText(e.keyword)
			// #endif
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.search-list {
	width: 100%;
}
</style>
