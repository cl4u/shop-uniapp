<template>
	<view>
		<lines></lines>
		<view class="login-tel">
			<view class="tel-main">
				<view class="login-form">
					<view class="login-user">
						<text class="user-text">验证码</text>
						<input type="text" focus="true" v-model="userCode" placeholder="请输入验证码" />
						<button plain="true" size="mini" :disabled="disabled" @tap="sendCode">{{codeMsg}}</button>
					</view>
				</view>
				<view class="tel" @click="getNextIndex">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import lines from "@/components/common/lines.vue";
	import $http from "@/common/api/request.js";
	import {mapMutations} from "vuex"
	export default {
		components: {
			lines
		},
		data() {
			return {
				userCode: "",
				codeMsg: "",
				codeNum: 60, // 倒计时
				disabled: false, // 是否禁用
				// 手机号
				phone: '',
				getCode: ""
			}
		},
		onReady() {
			this.codeMsg = `重新发送(${this.codeNum})`
			this.sendCode()
		},
		onLoad(e) {
			this.phone = e.phone
		},
		methods: {
			...mapMutations(["login"]),
			sendCode() {
				$http.request({
					url: "/code",
					method: "POST",
					data: {
						userName: this.phone
					}
				}).then(res => {
					this.getCode = res.code;
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})
				this.disabled = true;
				let timer = setInterval(() => {
					--this.codeNum;
					this.codeMsg = `重新发送(${this.codeNum})`
				}, 1000)
				setTimeout(() => {
					clearInterval(timer)
					this.codeNum = 60;
					this.disabled = false;
					this.codeMsg = "重新发送"
				}, 60000)
			},
			getNextIndex() {
				if (this.getCode == this.userCode) {
					$http.request({
						url: "/addUser",
						method: "POST",
						data: {
							userName: this.phone,
							code: this.userCode
						},
					}).then(res => {
						if (res.success) {
							uni.showToast({
								title:res.msg,
								icon: "none"
							})
							// 获取数据，注册成功后直接登录
							this.login(res.data)
							setTimeout(() => {
								uni.switchTab({
									url:"../index/index"
								})
							},2000)
							
						}
					}).catch(() => {
						uni.showToast({
							title:"请求失败",
							icon: "none"
						})
					})
				} else {
					uni.showToast({
						title:"验证码错误",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-tel {
		width: 100vw;
		height: 100vh;
	}

	.tel-main {
		padding: 0 20rpx;
	}

	.login-from {
		padding: 30rpx 0;
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

	.login-user {
		font-size: 40rpx;
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #f7f7f7;
	}

	.user-text {
		padding-right: 10rpx;
	}
</style>