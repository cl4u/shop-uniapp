<template>
	<view class="my-order bg-active-color">
		<lines></lines>
		<view class="order-header">
			<view class="header-item" :class="tabIndex === index ? 'active' : ''" v-for="(item,index) in tabList"
				:key="index" @tap="changeTab(index)">{{item.name}}</view>
		</view>
		<block v-for="(tabItem,idx) in tabList" :key="idx">
			<view v-show="idx === tabIndex">
				<view v-if="tabItem.list.length > 0" class="order-main" :style="'height:'+clientHeight+'px'">
					<!-- 商品 -->
					<view class="order-goods" v-for="(k,i) in tabItem.list" :key="i">
						<view class="goods-status f-active-color">{{k.status}}</view>
						<view class="goods-item" v-for="(item,index) in k.goods_item" :key="index">
							<order-list :item="item" :index="index"></order-list>
						</view>
					</view>
					<!-- 总价 -->
					<lines></lines>
					<view class="total-price">
						订单金额： <text class="f-active-color">￥{{total}}</text>（包含运费￥1.00）
					</view>

					<!-- 支付 -->
					<view class="payment">
						<view class="payment-text f-active-color">支付</view>
					</view>
				</view>
				<!-- 无订单数据页面 -->
				<view class="no-order" v-else :style="'height:'+clientHeight+'px'">
					<view class="no-order-text">您还没有相关订单</view>
					<view class="no-order-home">去首页逛逛</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import lines from "@/components/common/lines.vue"
	import OrderList from "@/components/order/order-list.vue"
	export default {
		components: {
			lines,OrderList
		},
		data() {
			return {
				tabIndex: 0,
				clientHeight: 0,
				tabList: [{
						name: "全部",
						list: [
							{
								status: "待付款",
								totalPrice: "3555",
								goods_item: [
									{
										imgUrl: "../../static/img/1.jpg",
										name: "好看的妹子谁要的，免费送啦",
										attrs: "黑色",
										pprice: "299",
										num:1
									},
									{
										imgUrl: "../../static/img/2.jpg",
										name: "好看的妹子谁要的，免费送啦",
										attrs: "黑色",
										pprice: "299",
										num: 3
									}
								]
							}
						]
					},
					{
						name: "待付款",list: []
					},
					{
						name: "代发货",list: []
					},
					{
						name: "待收货",list: []
					},
					{
						name: "待评价",list: []
					}
				]
			}
		},
		// 初步渲染完成后执行
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					this.clientHeight = res.windowHeight - uni.upx2px(80) - this.getClientHeight()
				}
			})
		},
		computed: {
			total() {
				return this.tabList[this.tabIndex].list?.[0]?.goods_item.reduce((prev,curr) => {
					return prev + curr.pprice * curr.num
				},0)
			}
		},
		methods: {
			changeTab(idx) {
				this.tabIndex = idx;
			},
			// 获取可视区域的高度
			getClientHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === "iso") {
					return 44 + res.statusBarHeight
				} else if (system === "android") {
					return 48 + res.statusBarHeight
				} else {
					return 0
				}
			}
		}
	}
</script>

<style lang="scss">
	.order-header {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		border-bottom: 2rpx solid #f7f7f7;

		.header-item {
			text-align: center;
			flex: 1;
			line-height: 120rpx;
		}
	}

	.active {
		border-bottom: 5rpx solid #49bdfb;
	}

	.goods-status {
		display: flex;
		justify-content: flex-end;
		background-color: #fff;
		padding: 20rpx;
	}

	
	.total-price,
	.payment {
		display: flex;
		justify-content: flex-end;
		background-color: #fff;
		padding: 20rpx;
	}

	.payment-text {
		border: 2rpx solid #49bdfb;
		line-height: 40rpx;
		padding: 6rpx 40rpx;
		border-radius: 30rpx;
	}

	.no-order {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.no-order-home {
		padding: 6rpx 60rpx;
		border: 2rpx solid #49bdfb;
		color: #49bdfb;
		border-radius: 40rpx;
	}
	.no-order-text{
		padding: 50rpx;
	}
</style>