<template>
	<view class="confirm-order bg-active-color">
		<lines></lines>
		<!-- 地址 -->
		<view class="order-map" @tap="goPathList">
			<block v-if="path">
			<view class="map-title">
				<view class="map-name">收件人：{{path.name}}</view>
				<view>{{path.tel}}</view>
			</view>
			<view class="map-add">收货地址：{{path.province}}{{path.city}}{{path.district}}{{path.address}}</view>
			</block>
			<block v-else>
				<view class="map-title">
					<view class="map-name">请选择地址</view>
				</view>
			</block>
		</view>
		
		<!-- 商品 -->
		<view class="goods_list" v-for="(item,index) in goodsList" :key="index">
			<view class="goods-content bg-active-color">
				<image class="goods-img" :src="item.imgUrl"></image>
				<view class="goods-text">
					<view class="goods-name">
						{{item.name}}
					</view>
					<view class="goods-size f-color">
						颜色分类：{{item.color}}
					</view>
					<view class="f-active-color">7天无理由退货</view>
				</view>
				<view>
					<view>￥ {{item.pprice}}</view>
					<view class="goods-size">X {{item.num}}</view>
				</view>
			</view>
		</view>
		
		<!-- 底部：提交订单 -->
		<view class="order-foot">
			<view class="total-price">
				合计: <text class="f-active-color">￥ {{totalCount.pprice}}</text>
			</view>
			<view class="confirm" @click="goPayment">提交订单</view>
		</view>
	</view>
</template>

<script>
	import lines from "@/components/common/lines.vue"
	import {mapGetters,mapState,mapMutations} from "vuex"
	import $http from "@/common/api/request.js"
	export default {
		components: {lines},
		data() {
			return {
				path: false
			}
		},
		computed: {
			...mapGetters(["defaultPath","totalCount"]),
			...mapState({
				list: state => state.cart.list
			}),
			goodsList() {
				return this.item.map(id => {
					return this.list.find(v => v.id == id)
				})
			}
		},
		onLoad(e) {
			this.item = JSON.parse(e.detail)
			
			$http.request({
				url: "/selectAddress",
				method: "POST",
				header:{
					token: true
				}
			}).then(res => {
				if (res.success) {
					this.__initAddressList(res.data)
					if (this.defaultPath.length) {
						this.path = this.defaultPath[0]
					}
				}
				
			}).catch(() =>{
				uni.showToast({
					title:"请求失败",
					icon: "none"
				})
			})
			
			// 如果触发自定义事件，则使用on接收值
			uni.$on("selectPathItem",(res)=>{
				this.path = res
			})
		},
		onUnload() {
			uni.$off("selectPathItem",() =>{
				console.log("移除了selectPathItem")
			})
		},
		methods: {
			...mapMutations(["__initAddressList"]),
			goPathList() {
				uni.navigateTo({
					url:"/pages/my-path-list/my-path-list?type=selectedPath"
				})
			},
			goPayment() {
				uni.navigateTo({
					url:"/pages/payment/payment"
				})
			}
		}
	}
</script>

<style lang="scss">
.confirm-order {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	width:100%;
	height: 100%;
	.order-map {
		margin-bottom: 10rpx;
		padding: 20rpx;
		background-color: #fff;
		line-height: 50rpx;
		.map-title {
			display: flex;
			justify-content: space-between;
			.map-name{
				font-weight: bold;
			}
		}
	}
	.goods_list{
		background-color: #fff;
		padding: 10rpx 0;
		.goods-content{
			padding: 10rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-text{
				width: 360rpx;
				padding: 0 10rpx;
				font-size: 26rpx;
			}
			.goods-img {
				width: 160rpx;
				height: 160rpx;
			}
			.goods-size{
				font-size: 24rpx;
			}
		}
	}
	.order-foot{
		width: 100%;
		height: 80rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.confirm{
			color:#fff;
			background-color: #49bdfb;
			padding: 10rpx 30rpx;
		}
		.total-price{
			padding: 0 20rpx;
		}
	}
}
</style>
