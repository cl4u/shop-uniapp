<template>
	<view class="payment-success">
		<view class="f-active-color">
			恭喜您支付成功
		</view>
		<view class="return-index" @tap="goIndex">返回首页再买点</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goIndex() {
				uni.switchTab({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
.payment-success{
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.return-index{
		margin: 20rpx;
		color: #49bdfb;
		padding: 10rpx 60rpx;
		border: 2rpx solid #49bdfb;
		border-radius: 40rpx;
	}
	.f-active-color{
		font-size: 52rpx;
	}
}
</style>
