<template>
	<view class="tabbar"> 
		<view class="tab" v-for="(item,index) in tabbarList" :key="index" @tap="navigatorTo(item.pagePath)">
			<image v-if="item.pagePath == currentPage" class="tab-img" :src="item.selectedIconPath"></image>
			<image v-else class="tab-img" :src="item.iconPath"></image>
			<view class="text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			currentPage: {
				type: String,
				default: "index"
			}
		},
		data() {
			return {
				tabbarList: [
					{
						pagePath: "index",
						iconPath: "/static/img/index.png",
						selectedIconPath: "/static/img/indexSelected.png",
						text: "首页"
					},
					{
						pagePath: "list",
						iconPath: "/static/img/list.png",
						selectedIconPath: "/static/img/listSelected.png",
						text: "分类"
					},
					{
						pagePath: "shopcart",
						iconPath: "/static/img/shop.png",
						selectedIconPath: "/static/img/shopSelected.png",
						text: "购物车"
					},
					{
						pagePath: "my",
						iconPath: "/static/img/my.png",
						selectedIconPath: "/static/img/mySelected.png",
						text: "我的"
					},
				]
			}
		},
		methods: {
			navigatorTo(e) {
				let url = `/pages/${e}/${e}`;
				if (e === "shopcart" || e === "my") {
					uni.switchTab({
						url: url,
						animationType: "fade-in",
						animationDuration:0
					})
				} else {
					uni.reLaunch({
						url: url
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	.tabbar {
		border-top: 2rpx solid #636263;
		background-color: #fff;
		z-index: 999;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.tab{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.tab-img{
				width: 40rpx;
				height: 40rpx;
			}
			.text{
				font-size: 24rpx;
			}
		}
	}
</style>