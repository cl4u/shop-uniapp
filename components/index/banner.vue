<template>
	<view class="banner">
		<image class="banner-img" :src="dataList" alt=""></image>
	</view>
</template>

<script>
	export default{
		props: {
			dataList: {
				type: String,
				default: ""
			}
		}
	}
</script>

<style lang="scss">
	.banner {
		width: 100%;
		height: 300rpx;
		.banner-img{
			width: 100%;
			height: 300rpx;
		}
	}
</style>