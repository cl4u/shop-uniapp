<template>
	<view class="my">
		<!-- 头部 -->
		<view class="my-header">
			<view class="header-main">
				<view class="header-config" @tap="goConfig">
					<image class="config-img" src="../../static/img/2.jpg"></image>
				</view>
				<view class="header-logo">
					<image class="logo-img" :src="loginStatus? userInfo.imgUrl:'../../static/logo.png'"></image>
					<view class="logo-name" @tap="goLogin">{{loginStatus?userInfo.nickName : '用户昵称'}}</view>
				</view>
			</view>
		</view>
		<!-- 我的订单 -->
		<view class="order">
			<view class="order-title" @tap="gotoPage">
				<view>我的订单</view>
				<view>全部订单</view>
			</view>
			<view class="order-list">
				<view class="order-item">
					<image class="order-img" src="../../static/img/sports/sp1.png"></image>
					<view @tap="qianzi">待付款</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/sports/sp2.png"></image>
					<view>代发货</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/sports/sp3.png"></image>
					<view>已发货</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/sports/sp4.png"></image>
					<view>已付款</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/sports/sp5.png"></image>
					<view>待评价</view>
				</view>
			</view>
		</view>
		<!-- 内容列表 -->
		<view class="my-content">
			<view class="my-content-item" v-for="(item,index) in 6" :key="index">
				<view>我的收藏</view>
				<view>></view>
			</view>
		</view>
		<tabbar current-page="my"></tabbar>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import tabbar from "@/components/index/tabbar.vue"
	export default {
		components: {tabbar},
		data() {
			return {

			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
				userInfo: state => state.user.userInfo
			})
		},
		methods: {
			gotoPage() {
				uni.navigateTo({
					url: "/pages/my-order/my-order"
				})
			},
			goConfig() {
				uni.navigateTo({
					url: "/pages/my-config/my-config"
				})
			},
			qianzi() {
				uni.navigateTo({
					url: '../qianzi/qianzi'
				})
			},
			goLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-header {
		background: url("../../static/img/1.jpg") no-repeat;
		width: 100%;
		height: 400rpx;
	}

	.header-main {
		position: relative;
		top: 120rpx;

		.header-config {
			position: absolute;
			left: 20rpx;

			.config-img {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.header-logo {
			position: absolute;
			left: 50%;
			margin-left: -60rpx;
			width: 120rpx;

			.logo-img {
				width: 120rpx;
				height: 120rpx;
				border: 2px solid #ccc;
				border-radius: 50%;
				background-color: #fff;
			}

			.logo-name {
				color: #fff;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
	}

	.order-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
	}

	.order-list {
		display: flex;
		padding: 20rpx;

		.order-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.order-img {
				width: 80rpx;
				height: 80rpx;
			}
		}
	}

	.my-content {
		margin: 20rpx 0;
		padding: 0 20rpx;

		.my-content-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 2px solid #ccc;
		}
	}
</style>