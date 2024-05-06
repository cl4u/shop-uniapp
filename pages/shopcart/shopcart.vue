<template>
	<view class="cart">
		<template v-if="list.length">
			<!-- 自定义导航栏 -->
			<uniNavBar title="购物车" fixed="true" statusBar="true" :rightText="isNavBar ? '完成' : '编辑'"
				@clickRight="isNavBar = !isNavBar"></uniNavBar>

			<!-- 商品内容 -->
			<view style="margin-top:80rpx">
				<view class="shop-item" v-for="(item,index) in list" :key="index">
					<label for="" class="radio" @tap="selectedItem(index)">
						<radio value="" color="#ff3333" :checked="item.checked"></radio><text></text>
					</label>
					<image class="shop-img" :src="item.imgUrl"></image>
					<view class="shop-text">
						<view class="shop-name">{{item.name}}</view>
						<view class="shop-color f-color">{{item.color}}</view>
						<view class="shop-price">
							<view>${{item.pprice}}</view>
							<template v-if="!isNavBar">
								<view>x {{item.num}}</view>
							</template>
							<template v-else>
								<uniNumberBox :min="1" :value="item.num" @change="changeNumber($event,index,item)">
								</uniNumberBox>
							</template>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="shop-foot">
				<label for="" class="radio foot-radio" @tap="checkedAllFn">
					<radio color="#ff3333" value="" :checked="checkedAll"></radio><text>全选</text>
				</label>
				<template v-if="!isNavBar">
					<view class="foot-total">
						<view class="foot-count">
							合计: <text class="f-active-color">${{totalCount.pprice}}</text>
						</view>
						<view class="foot-num" @tap="goConfirmOrder">结算({{totalCount.num}})</view>
					</view>
				</template>
				<template v-else>
					<view class="foot-total">
						<view class="foot-num" style="background-color: black;">
							移入收藏夹
						</view>
						<view class="foot-num" @tap="delGoodsFn">删除</view>
					</view>
				</template>
			</view>
		</template>
		<template v-else>
			<uniNavBar title="购物车" fixed="true" statusBar="true"></uniNavBar>
			<view class="shop-else-list">
				<text>囧~ 购物车还是空的~</text>
			</view>
		</template>
		<tabbar current-page="list"></tabbar>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni/uni-nav-bar/uni-nav-bar.vue"
	import uniNumberBox from "@/components/uni/uni-number-box/uni-number-box.vue"
	import tabbar from "@/components/index/tabbar.vue"
	import $http from "@/common/api/request.js"
	// store
	import {
		mapState,
		mapActions,
		mapGetters,
		mapMutations
	} from "vuex"
	export default {
		components: {
			uniNavBar,
			uniNumberBox,
			tabbar
		},
		data() {
			return {
				isNavBar: false,
			}
		},
		computed: {
			// 状态机数据处理
			...mapState({
				list: state => state.cart.list,
				selectedList: state => state.cart.selectedList
			}),
			...mapGetters(['checkedAll', "totalCount"])
		},
		onShow() {
			this.getData();
		},
		methods: {
			...mapActions(['checkedAllFn', "delGoodsFn"]),
			...mapMutations(["selectedItem", "initGetData","initOrder"]),
			getData() {
				$http.request({
					url: "/selectCart",
					method: "POST",
					header: {
						token: true
					},
				}).then(res => {
					this.initGetData(res)
				}).catch(() => {
					uni.showToast({
						title: '请求失败',
						icon: "none"
					})
				})
			},
			changeNumber(value, index, item) {
				if (value == item.num) {
					return;
				}
				$http.request({
					url: "/updateCart",
					method: "POST",
					header: {
						token: true
					},
					data: {
						goodsId: item.goods_id,
						num: value
					}
				}).then(res => {
					this.list[index].num = value;
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})

			},
			goConfirmOrder() {
				if (this.selectedList.length === 0) {
					return uni.showToast({
						title: "至少选择一件商品",
						icon: "none"
					})
				}
				let newList = [];
				this.list.forEach(v => {
					this.selectedList.filter(k => {
						if (v.id === k) {
							newList.push(v)
						}
					})
				})
				$http.request({
					url:"/addOrder",
					method: 'POST',
					header:{
						token:true
					},
					data: {
						arr: newList
					}
				}).then(res => {
					if (res.success) {
						this.initOrder(res.data[0].order_id)
						uni.navigateTo({
							url: `/pages/confirm-order/confirm-order?detail=${JSON.stringify(this.selectedList)}`
						})
					}
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})

			}
		}
	}
</script>

<style lang="scss">
	.shop-item {
		display: flex;
		padding: 20rpx;
		align-items: center;
		background-color: #f7f7f7;
		margin-bottom: 10rpx;

		.shop-img {
			width: 200rpx;
			height: 200rpx;
		}

		.shop-text {
			flex: 1;
			padding-left: 20rpx;

			.shop-color {
				font-size: 24rpx;
			}

			.shop-price {
				display: flex;
				justify-content: space-between;
			}
		}
	}

	.shop-foot {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		border-top: 2rpx solid #f7f7f7;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 100rpx;

		.foor-radio {
			padding-left: 20rpx;
		}

		.foot-total {
			display: flex;
		}

		.foot-count {
			line-height: 100rpx;
			padding: 0 20rpx;
			font-size: 32rpx;
		}

		.foot-num {
			background-color: #49bdfb;
			color: #fff;
			padding: 0 60rpx;
			line-height: 100rpx;
		}
	}

	.shop-else-list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>