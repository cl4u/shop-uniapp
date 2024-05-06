<template>
	<view class="recommend bg-color">
		<view class="recommend-item" v-for="(item,index) in dataList" :key="index">
			<image class="item-bg" :src="item.bigUrl"></image>
			<view class="item-small">
				<image class="item-img" v-for="(k,i) in item.data" :key="i" :src="k.imgUrl"></image>
			</view>
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
	.recommend {
		padding: 20rpx;
	}
	.recommend-item {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		border:2rpx solid #ccc;
		overflow: hidden;
		margin: 20rpx 0;
	}
	.item-bg {
		width: 100%;
		height: 300rpx;
	}
	.item-small {
		width: 100%;
		height: 240rpx;
	}
	.item-img {
		width: 33.33333%;
		height: 240rpx;
	}
</style>