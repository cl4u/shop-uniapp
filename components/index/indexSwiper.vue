<template>
	<view class="swiperview">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in dataList" :key="index">
				<view class="swiper-item">
					<image class="swiper-img" :src="item.imgUrl"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name:"indexSwiper",
		props: {
			dataList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
			};
		}
	}
</script>

<style lang="scss">
swiper {
	width: 750rpx;
	height: 450rpx;
}
.swiper-img {
	width: 100%
}
</style>