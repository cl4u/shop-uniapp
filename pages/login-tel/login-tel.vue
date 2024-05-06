<template>
	<view>
		<lines></lines>
		<view class="login-tel">
			<view class="tel-main">
				<view class="login-form">
					<view class="login-user">
						<text class="user-text">手机号</text>
						<input type="number" focus="true" v-model="userTel" placeholder="请输入11位手机号" />
					</view>
				</view>
				<view class="tel" @click="goNextCode">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import lines from "@/components/common/lines.vue";
	import $http from "@/common/api/request.js"
	export default {
		components: {lines},
		data() {
			return {
				userTel: "",
				rules: {
					userTel: {
						rule: /^1[2345679]\d{9}$/,
						msg: "请输入11位手机号"
					}
				}
			}
		},
		methods: {
			goNextCode() {
				if(!this.validate("userTel")) {return}
				$http.request({
					url: "/registered",
					method: "POST",
					data: {
						phone: this.userTel
					}
				}).then(res => {
					if (!res.success) {
						uni.showToast({
							title:res.msg,
							icon: "none"
						})
						return
					} else {
						uni.navigateTo({
							url:"/pages/login-code/login-code?phone="+this.userTel
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
						title:this.rules[key].msg,
						icon: "none"
					})
					bool = false;
					return false
				}
				return bool
			}
		}
	}
</script>

<style lang="scss">
.login-tel {
	width: 100vw;
	height: 100vh;
	.tel-main{
		padding: 0 20rpx;
		.login-form{
			padding: 30rpx 0;
			.login-user{
				font-size: 40rpx;
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #f7f7f7;
				.user-text{
					padding-right: 10rpx;
				}
			}
		}
		.tel{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color:#fff;
			background-color: #40bde8;
			border-radius: 40rpx;
		}
	}
}
</style>
