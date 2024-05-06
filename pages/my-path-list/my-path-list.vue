<template>
	<view class="my-path-list">
		<view class="path-list">
			<view v-for="(item,index) in list" :key="index" @tap="toAddPath(index)">
				<view class="path-item"  @tap="goConfirmOrder(item)">
					<view class="item-main">
						<view class="item-name">{{item.name}}</view>
						<view>{{item.tel}}</view>
					</view>
					<view class="item-main">
						<view class="active" v-show="item.isDefault == 1">默认</view>
						<view>{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add-path">
			<view class="add-path-btn" @tap="goAddPath">新增地址</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapMutations
	} from "vuex";
	import $http from "@/common/api/request.js"
	export default {
		data() {
			return {
				isSelectedPath: false
			}
		},
		computed: {
			...mapState({
				list: state => state.path.list
			})
		},
		onLoad(e) {
				if (e.type === "selectedPath") {
					this.isSelectedPath = true
				}
				// 初始化获取地址
				this.getAddress()
		},
		methods: {
			...mapMutations(["__initAddressList"]),
			getAddress() {
				$http.request({
					url: "/selectAddress",
					method: "POST",
					header: {
						token: true
					}
				}).then(res => {
					if (res.success) {
						this.__initAddressList(res.data)
					} else {
						uni.showToast({
							title:res.msg,
							icon: "none"
						})
					}
				}).catch(() =>{
					uni.showToast({
						title:"请求失败",
						icon:"none"
					})
				})
			},
			addressList() {},
			// 新增
			goAddPath() {
				uni.navigateTo({
					url: "/pages/my-add-path/my-add-path"
				})
			},
			// 修改
			toAddPath(index) {
				let pathObj = JSON.stringify({
					index: index,
					item: this.list[index]
				})
				uni.navigateTo({
					url: "/pages/my-add-path/my-add-path?data=" + pathObj
				})
			},
			// 返回确认订单
			goConfirmOrder(item) {
				// 如果是从确认订单过来的执行
				if (this.isSelectedPath) {
					uni.$emit("selectPathItem",item)
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">
	.path-list {
		padding: 0 20rpx;

		.path-item {
			padding: 10rpx;
			border-bottom: 2px solid #ccc;

			.item-main {
				padding: 8rpx 0;
				display: flex;
				align-items: center;

				.item-name {
					padding-right: 10rpx;
				}

				.active {
					padding: 6rpx;
					background-color: #49bdfb;
					color: #fff;
					border-radius: 20rpx;
					font-size: 24rpx;
					text-align: center;
					margin-right: 20rpx;
				}
			}
		}
	}

	.add-path {
		padding: 20rpx 0;
		width: 100%;
		display: flex;
		justify-content: center;

		.add-path-btn {
			border: 2px solid #49bdfb;
			color: #49bdfb;
			border-radius: 30rpx;
			padding: 6rpx 60rpx;
		}
	}
</style>