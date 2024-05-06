<template>
	<view class="login">
		<swiper vertical="true" style="height: 100vh;">
			<swiper-item>
				<view class="login-tel">
					<view class="tel-main">
						<view class="close" @tap="goBack">
							<image class="close-img" src="../../static/img/close.png"></image>
						</view>
						<view class="logo">
							<image class="logo-img" src="../../static/logo.png"></image>
						</view>
						<view class="tel" @tap="goPage">手机号注册</view>
						<login-other></login-other>
						<view class="login-go">
							<view>已有账号，去登录</view>
							<image src="../../static/img/down.png"></image>
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view>
					<view class="login-tel">
						<view class="tel-main">
							<view class="close close-center">
								<view @tap="goBack">
									<image class="close-img" src="../../static/img/close.png"></image>
								</view>
								<view class="login-go">
									<image class="close-img" src="../../static/img/up.png"></image>
									<view class="" >没账号，去注册</view>
								</view>
							</view>
							<view class="login-form">
								<view class="login-user">
									<text class="user-text">账号</text>
									<input type="text" v-model="userName" value="" placeholder="请输入手机号/昵称" />
								</view>
								<view class="login-user">
									<text class="user-text">密码</text>
									<input type="safe-password" v-model="userPwd" value="" placeholder="6-16位字符" />
								</view>
							</view>
							<view class="login-quick">
								<view>忘记密码</view>
								<view>免密登录</view>
							</view>
							<view class="tel" @tap="submit">登录</view>
							<view class="remainder">温馨提示，您可以选择免密登录，更加方便</view>
							<login-other></login-other>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import LoginOther from "@/components/login/login-other.vue"
	import $http from "@/common/api/request.js"
	import {mapMutations} from "vuex"
	export default {
		components: {
			LoginOther
		},
		data() {
			return {
				userName: "",
				userPwd: "",
				rules: {
					userName: {
						rule: /\S/,
						msg: "账号不能为空"
					},
					userPwd: {
						rule: /^\w{6,16}$/,
						msg: "密码应该为6-16位字符"
					}
				}
			}
		},
		methods: {
			...mapMutations(["login"]),
			goBack() {
				uni.navigateBack()
			},
			submit() {
				if (!this.validate("userName")) {return false}
				if (!this.validate("userPwd")) {return false}
				uni.showLoading({
					title:"登录中..."
				})
				$http.request({
					url: "/login",
					method: "POST",
					data: {
						userName: this.userName,
						userPwd: this.userPwd
					}
				}).then(res=> {
					if (res.success) {
						this.login(res.data)
						uni.showToast({
							title:res.msg,
							icon: "none"
						})
						uni.hideLoading()
						setTimeout(() => {
							uni.navigateBack()
						})
					} else {
						uni.showToast({
							title:res.msg,
							icon: "none"
						})
					}
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})
			},
			validate(key) {
				let bool = true;
				if (!this.rules[key].rule.test(this[key])) {
					uni.showToast({
						title: this.rules[key].msg,
						icon: "none"
					})
					bool = false;
					return false;
				}
				return bool
			},
			goPage() {
				uni.navigateTo({
					url:"/pages/login-tel/login-tel"
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-tel {
		width: 100vw;
		height: 100vh;

		.tel-main {
			padding: 0 20rpx;
		}

		.close {
			padding: 120rpx 0;

			.close-img {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.logo {
			padding: 0 100rpx;
			padding-bottom: 100rpx;
			display: flex;
			justify-content: center;

			.logo-img {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.tel {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			background-color: #40bde8;
			border-radius: 40rpx;
		}

		.login-go {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}

	.close-center {
		display: flex;

		>view {
			flex: 1;
		}
	}

	.login-form {
		padding-top: 100rpx;

		.login-user {
			font-size: 40rpx;
			padding: 10rpx 0;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #f7f7f7;

			.user-text {
				padding-right: 10rpx;
			}
		}

	}

	.login-quick {
		display: flex;
		padding: 20rpx 0;
		justify-content: space-between;
	}

	.remainder {
		color: #ccc;
		font-size: 32rpx;
		padding: 20rpx 0;
		text-align: center;
	}
</style>