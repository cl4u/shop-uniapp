<template>
	<view class="card">
		<view class="">-</view>
		<slot>
			<view class="card-name">{{cardTitle}}</view>
		</slot>
		<view class="">-</view>
	</view>
</template>

<script>
	export default {
		props: {
			cardTitle: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
	.card {
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		.card-name {
			padding: 0 20rpx;
			font-size: 32rpx;
		}
	}
</style>