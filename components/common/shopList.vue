<template>
	<view class="shop-list">
		<view class="shop-title f-color">
			<view class="shop-item" v-for="(item,index) in shopList.data" :key="index" @tap="changeTab(index)">
				<view :class="index === shopList.currentIndex ? 'f-active-color' : ''">{{item.name}}</view>
				<view class="shop-icon">
					<view class="iconfont icon-arrow-up up" :class="item.status === 1 ? 'f-active-color' : ''"></view>
					<view class="iconfont icon-xiajiantou down" :class="item.status === 2 ? 'f-active-color' : ''"></view>
				</view>
			</view>
		</view>
		<Lines></Lines>
		<CommodityList :data-list="dataList"></CommodityList>
	</view>
</template>

<script>
	import Lines from "@/components/common/lines.vue";
	import CommodityList from "./commodityList.vue"
	import $http from "@/common/api/request.js"
	export default {
		components: {Lines,CommodityList},
		props: {
			keyword: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				shopList: {
					currentIndex: 0,
					data: [
						{name: "价格",status: 1},
						{name: "折扣",status: 0},
						{name: "品牌",status: 0},
					]
				},
				dataList: [
				]
			}
		},
		computed: {
			orderBy() {
				let obj = this.shopList.data[this.shopList.currentIndex];
				let val = obj.status === 1 ? "asc" :"desc";
				return  {
					[obj.key] : val
				}
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			// 获取数据
			getData() {
				$http.request({
					url: "/goods/search",
					data: {
						name: this.keyword,
					}
				}).then(res => {
					this.dataList = res;
				}).catch(() => {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					})
				})
			},
			changeTab(idx) {
				let item = this.shopList.data[this.shopList.currentIndex];
				if (this.shopList.currentIndex === idx) {
					return item.status = item.status === 1 ? 2 : 1
				}
				
				let newItem = this.shopList.data[idx];
				item.status = 0;
				this.shopList.currentIndex = idx;
				newItem.status = 1;
			}
		}
	}
</script>

<style lang="scss">
	.shop-title {
		display: flex;
	}
	.shop-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
	}
	.shop-icon {
		position: relative;
		margin-left: 10rpx;
	}
	.iconfont {
		width: 16rpx;
		height: 8rpx;
		position: absolute;
		left: 0;
	}
	.up {
		top: -25rpx;
	}
	.down {
		top: -5rpx;
	}
</style>