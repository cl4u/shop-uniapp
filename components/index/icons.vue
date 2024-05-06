<template>
	<view class="icons">
		<view class="icons-item" v-for="(item,index) in dataList" :key="index">
			<image class="icons-img" :src="item.imgUrl"></image>
			<text class="icons-name f-color">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.icons{
		display: flex;
		flex-wrap: wrap;
		.icons-item {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-top: 20rpx;
			.icons-img {
				width: 110rpx;
				height: 110rpx;
			}
			.icons-name {
				margin-top:6rpx;
				font-size: 24rpx;
			}
		}
	}
</style>