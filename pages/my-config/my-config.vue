<template>
	<view class="my-config">
		<view class="config-item" @tap="gpPathList">
			<view>地址管理</view>
			<view> > </view>
		</view>
		<view class="my-exit" @tap="loginOut">退出</view>
	</view>
</template>

<script>
	import {mapMutations} from "vuex"
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations(['loginOut']),
			gpPathList() {
				uni.navigateTo({
					url:"../my-path-list/my-path-list"
				})
			},
			loginOut() {
				uni.showToast({
					title:"退出成功",
					icon: "none"
				})
				this.loginOut()
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
.config-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:20rpx;
	border-bottom: 2px solid #ccc;
}
.my-exit {
	position: fixed;
	bottom: 0;
	left:0;
	background-color: #49bdfb;
	width:100%;
	height: 80rpx;
	line-height: 80rpx;
	color:#fff;
	text-align: center;
}
</style>
