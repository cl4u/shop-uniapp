<template>
	<view class="shop">
		<view class="shop-item">
			<view class="shop-big">
				<image :src="dataList.bigUrl" class="shop-big"></image>
			</view>
			<scroll-view class="scroll-content" scroll-x="true">
				<view class="scroll-item">
					<Commodity :data-list="dataList.data" wrap="no-wrap" itemW="200rpx" bigH="200rpx" name-size="20rpx">
					</Commodity>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Commodity from "../common/commodity.vue"
	export default {
		components: {
			Commodity
		},
		props: {
			dataList: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
	.shop-big {
		width: 100%;
		height: 350rpx;

	}

	.scroll-content {
		width: 100%;
		white-space: nowrap;
		height: 350rpx;
	}

	.scroll-item {
		display: inline-block;
		width: 300rpx;
		height: 300rpx;
	}
</style>