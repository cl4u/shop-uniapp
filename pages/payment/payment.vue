<template>
	<view>
		<view>
			<!-- 自定义导航栏 -->
			<uniNavBar title="确认支付" fixed="true" left-text="关闭" @click="goBack"></uniNavBar>
		</view>
		<view class="pay-main">
			<label for="">
				<view class="pay-item">
					<image class="pay-img" src="../../static/img/zfb.png"></image>
					<view>
						<view>支付宝支付</view>
						<view class="pay-text">推荐支付宝用户使用</view>
					</view>
					<label for="radio">
						<radio value="" color="#ff3333"></radio><text></text>
					</label>
				</view>
			</label>
			<label for="">
				<view class="pay-item">
					<image class="pay-img" src="../../static/img/wx.png"></image>
					<view>
						<view>微信支付</view>
						<view class="pay-text">推荐微信用户使用</view>
					</view>
					<label for="radio">
						<radio value="" color="#ff3333"></radio><text></text>
					</label>
				</view>
			</label>
		</view>
		<view class="pay-foot">
			<view class="total">
				<text class="f-color">合计：</text>
				<text class="total-price">￥ {{totalCount.pprice}}</text>
			</view>
			<view class="go-pay" @tap="goPay">去支付</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni/uni-nav-bar/uni-nav-bar.vue"
	import {mapGetters} from "vuex"
	export default {
		components: {uniNavBar},
		data() {
			return {
				details: {
					price: 0
				}
			}
		},
		computed: {
			...mapGetters(["totalCount"]),
			
		},
		onLoad(e) {
			// this.details = JSON.parse(e.details)
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			goPay() {
				uni.navigateTo({
					url:"/pages/payment-success/payment-success"
				})
			}
		}
	}
</script>

<style lang="scss">
	.pay-main{
		margin-top: 80rpx;
	}
.pay-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 2rpx solid #ccc;
	.pay-img{
		width: 100rpx;
		height: 100rpx;
	}
	.pay-text{
		color:#bbb;
	}
}
.pay-foot{
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 0;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.total{
		padding-left: 100rpx;
		flex: 1;
		background-color: #000;
		line-height: 100rpx;
		.total-price{
			color: #fff
		}
		.f-color{
			color:#ccc
		}
	}
	.go-pay{
		color: #fff;
		background-color: #49bdfb;
		line-height: 100rpx;
		text-align: center;
		width: 220rpx
	}
}
</style>
