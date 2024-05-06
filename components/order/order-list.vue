<template>
	<view class="goods-content bg-active-color">
		<image class="goods-img" :src="item.imgUrl"></image>
		<view class="goods-text">
			<view class="goods-name">
				{{item.name}}
			</view>
			<view class="goods-size f-color">
				颜色分类：{{item.attrs}}
			</view>
			<view class="f-active-color">
				7天无理由退货
			</view>
		</view>
		<view>
			<view>￥{{item.pprice}}</view>
			<view class="goods-size">X {{item.number}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => ({})
			},
			index: {
				type: Number,
				default: 0
			}
		}
	}
</script>

<style lang="scss">
	.goods-content {
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	
		.goods-text {
			width: 360rpx;
			padding: 0 10rpx;
			font-size: 26rpx;
		}
	
		.goods-img {
			width: 160rpx;
			height: 160rpx;
		}
	
		.goods-size {
			font-size: 24rpx;
		}
	}
	
</style>