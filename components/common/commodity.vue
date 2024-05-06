<template>
	<view class="commodity" :style="'flex-wrap:'+wrap">
		<!-- 单个商品组件 -->
		<view class="commodity-item" v-for="(item,index) in dataList" :key="index" :style="'width:'+itemW" @tap="goDetails(item.id)">
			<image class="commodity-img" :src="item.imgUrl" :style="'height:'+bigH"></image>
			<view class="commodity-content">
				<text class="commodity-name" :style="'font-size:'+nameSize">{{item.name}}</text>
				<view class="commodity-price">
					<view class="commodity-price-box">
						<text class="pprice">${{item.pprice}}</text>
						<text class="discount">{{item.discount}}折</text>	
					</view>
					<text class="oprice">${{item.oprice}}</text>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default: () => []
			},
			itemW: {
				type: String,
				default: "375rpx"
			},
			bigH: {
				type: String,
				default: "375rpx"
			},
			wrap: {
				type: String,
				default: "wrap"
			},
			nameSize: {
				type: String,
				default: "26rpx"
			}
		},
		methods: {
			goDetails(id) {
				uni.navigateTo({
					url: "/pages/details/details?id="+id
				})
			}
		},
	}
</script>

<style lang="scss">
	.commodity {
		display: flex;
		.commodity-item {
			padding-bottom: 20rpx;
			.commodity-img {
				width: 100%;
			}
			.commodity-content {
				text-align: center;
				.commodity-name {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					color: #333;
					word-break: break-all;
					padding: 6rpx 20rpx;
				}
				.commodity-price {
					display: flex;
					justify-content: space-around;
					align-items: center;
					.commodity-price-box{
						display: flex;
						justify-content: flex-start;
						.discount {
							margin-left: 10rpx;
							border-radius: 4rpx;
							border: 1px solid #ff3333;
							padding: 6rpx 10rpx 0;
							font-size: 20rpx;
							color: #ff3333;
						}
					}
					.oprice {
						text-decoration: line-through;
						font-size: 24rpx;
						color: #999;
					}
					
				}
				
			}
		}
		
	}
</style>