<template>
	<view class="details">
		<!-- 商品图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item >
				<view class="swiper-item">
					<image class="swiper-img" :src="goodsContent.imgUrl"></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 价格和名称 -->
		<view class="details-goods">
			<view class="goods-pprice">￥{{goodsContent.pprice}}</view>
			<view class="goods-oprice">￥{{goodsContent.oprice}}</view>
			<view class="goods-name">{{goodsContent.name}}</view>
		</view>
		<!-- 商品详情图 -->
		<view>
			<image class="details-img" src="../../static/img/6.jpg"></image>
			<image class="details-img" src="../../static/img/7.jpg"></image>
			<image class="details-img" src="../../static/img/8.jpg"></image>
			<image class="details-img" src="../../static/img/4.jpg"></image>
			<image class="details-img" src="../../static/img/5.jpg"></image>
		</view>
		<!-- 商品列表 -->
		<Card cardTitle="看了又看"></Card>
		<CommodityList :data-list="dataList"></CommodityList>
		<!-- 底部 -->
		<view class="details-foot">
			<view class="iconfont icon-iconfontzhizuobiaozhun023110"></view>
			<view class="iconfont icon-gouwuche" @tap="goShopCart"></view>
			<view class="add-shopcart" @tap="showPop">加入购物车</view>
			<view class="purchase" @tap="showPop">立即购买</view>
		</view>
		<!-- 底部弹出层 -->
		<view class="pop" v-show="isShow" @touchmove.stop.prevent="">
			<!-- 蒙层 -->
			<view class="pop-mask" @tap="hidePop"></view>
			<!-- 内容区域 -->
			<view class="pop-box" :animation="animationData">
				<view>
					<image class="pop-img" :src="goodsContent.imgUrl"></image>
				</view>
				<view class="pop-num">
					<view>购买数量</view>
					<UniNumberBox :min="1" :value="num" @change="changeNumber"></UniNumberBox>
				</view>
				<view class="pop-sub" @tap="addCart">确定 </view>
			</view>
		</view>
	</view>
</template>

<script>
	import Card from "@/components/common/card.vue";
	import CommodityList from "@/components/common/commodity.vue"
	import UniNumberBox from "@/components/uni/uni-number-box/uni-number-box.vue"
	import $http from "@/common/api/request.js"
	import {mapMutations} from "vuex"
	export default {
		components: {Card,CommodityList,UniNumberBox},
		data() {
			return {
				dataList: [
					{
						id: 1,
						imgUrl: "../../static/img/10.jpg",
						name: "毛衣降价处理，速速抢购",
						pprice: "699",
						oprice: "599",
						discount: "6"
					},
					{
						id: 2,
						imgUrl: "../../static/img/11.jpg",
						name: "毛衣降价处理，速速抢购",
						pprice: "699",
						oprice: "599",
						discount: "6"
					},
					{
						id: 3,
						imgUrl: "../../static/img/12.jpg",
						name: "毛衣降价处理，速速抢购",
						pprice: "699",
						oprice: "599",
						discount: "6"
					},
				],
				isShow: false,
				animationData: {},
				goodsContent: {},
				num: 1
			}
		},
		onLoad(e) {
			console.log(e.id)
			if (!e.id) {
				e.id = 1
			}
			this.getData(e.id);
		},
		// 修改默认返回事件
		onBackPress() {
			if (this.isShow) {
				this.hidePop();
				return true
			}
		},
		// 点击分享
		onNavigationBarButtonTap(e) {
			if (e.type === "share") {
				uni.share({
					provider:"weixin",
					type: 0,
					scene:"WXSceneSession",
					title: this.goodsContent.name,
					href:"http://127.0.0.1:8080/#/pages/details/details?id="+this.goodsContent.id,
					imageUrl:this.goodsContent.imageUrl,
					success:function(res){
						uni.showTabBar({
							title: "分享成功"
						})
					},
					fail: (err) => {
						console.log("fail:" +JSON.stringify(err))
					}
					
				})
			}
		},
		methods: {
			...mapMutations(['addShopCart']),
			// 获取数据
			getData(id) {
				$http.request({
					url: "/goods/id",
					data: {
						id: +id
					}
				}).then(res => {
					this.goodsContent = res[0]
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})
			},
			// 改变数量
			changeNumber(value) {
				this.num = value;
			},
			showPop() {
				// 初始化一个动画
				var animation = uni.createAnimation({duration:200})
				// 定义动画内容
				animation.translateY(600).step();
				// 导出动画数据传递给data层
				this.animationData = animation.export();
				setTimeout(() => {
					this.isShow = true;
					animation.translateY(0).step();
					this.animationData = animation.export()
				},200)
			},
			hidePop() {
				let animation = uni.createAnimation({duration:200});
				animation.translateY(600).step();
				this.animationData = animation.export();
				this.isShow = true;
				setTimeout(() => {
					animation.translateY(0).step();
					this.animationData = animation.export();
					this.isShow = false
				},200)
			},
			goShopCart() {
				uni.switchTab({
					url:"../shopcart/shopcart"
				})
			},
			// 加入购物车
			addCart() {
				let goods = this.goodsContent;
				$http.request({
					url: "/addCart",
					method: "POST",
					header: {
						token: true
					},
					data: {
						goodsId: goods.id,
						num: this.num
					}
				}).then(res => {
					// 隐藏弹出框
					this.hidePop();
					uni.showToast({
						title:"成功加入购物车",
						icon: "none"
					})
				}).catch(() => {
					uni.showToast({
						title:"请求失败",
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.details{
		swiper {
			width: 100%;
			height: 400rpx;
			.swiper-img {
				width: 100%;
				height: 400rpx;
			}
		}
		.details-goods{
			text-align: center;
			font-weight: bold;
			font-size: 36rpx;
			padding: 10rpx 0
		}
		.details-img {
			width:100%;
			height: 800rpx;
		}
		.details-foot {
			position: fixed;
			bottom:0;
			left:0;
			width:100%;
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			.iconfont {
				width:60rpx;
				height: 60rpx;
				border-radius: 100%;
				background-color: #000;
				color:#fff;
				text-align: center;
				line-height: 60rpx;
				margin:0 10rpx;
			}
			.add-shopcart {
				margin:0 40rpx;
				padding: 6rpx 30rpx;
				background-color: #000;
				color:#fff;
				border-radius: 40rpx;
			}
			.purchase{
				magin:0 40rpx;
				padding: 6rpx 30rpx;
				background-color: #49bdfb;
				color:#fff;
				border-radius: 40rpx;
			}
		}
		.pop {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 999;
			.pop-mask {
				position: absolute;
				left:0;
				top:0;
				width:100%;
				height: 100%;
				background-color: rgba(0,0,0,0.3);
			}
			.pop-box {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				background: #fff;
				.pop-img {
					width: 260rpx;
					height: 260rpx;
					top: -130rpx;
					border-radius: 20rpx 20rpx 0 0;
					margin: 30rpx;
				}
				.pop-sub {
					line-height: 80rpx;
					background-color: #49bdfb;
					color:#fff;
					text-align: center;
				}
				.pop-num {
					padding: 20rpx;
					display: flex;
					justify-content: space-between
				}
			}
		}
	}

</style>
