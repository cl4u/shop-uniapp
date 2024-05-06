<template>
	<view>
		<lines></lines>
		<view class="list">
			<!-- 左侧滑动 -->
			<scroll-view scroll-y="true" class="list-left" :style="'height:'+clentHeight+'px'">
				<view v-for="(item,index) in leftData" :key="index" class="left-item" @tap="changeLeftTab(index,item.id)">
					<view class="left-name" :class="activeIndex === index ? 'left-name-active':''">{{item.name}}</view>
				</view>
			</scroll-view>
			<!-- 右侧滑动 -->
			<scroll-view scroll-y="true" class="list-right" :style="'height:'+clentHeight+'px'">
				<view class="right-list" v-for="(item,index) in rightData" :key="index">
					<block v-for="(k,i) in item" :key="i">
					<view class="list-title">{{k.name}}</view>
					<view class="right-content">
						<view class="right-item" v-for="(list,idx) in k.list" :key="idx">
							<image class="right-img" :src="list.imgUrl"></image>
							<view class="right-name">{{list.name}}</view>
						</view>
					</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<tabbar current-page="list"></tabbar>
	</view>
</template>

<script>
	import lines from "@/components/common/lines.vue"
	import tabbar from "@/components/index/tabbar.vue"
	import $http from "@/common/api/request.js"
	export default {
		components: {lines,tabbar},
		data() {
			return {
				clentHeight: 0,
				activeIndex: 0,
				leftData: [],
				rightData: []
			}
		},
		onLoad() {
			this.getData();
		},
		onReady() {
			// 获取可视高度
			uni.getSystemInfo({
				success:(res) => {
					// 可视区域高度减去头部高度
					this.clentHeight = res.windowHeight - this.getClientHeight();
				}
			})
		},
		// 初步渲染完成后执行
		methods: {
			getData(id) {
				if (id === this.activeIndex+1) {
					return;
				}
				$http.request({
					url: "/goods/list",
					
				}).then(res => {
					let leftData = [];
					let rightData = [];
					res.forEach(v => {
						leftData.push({
							id: v.id,
							name: v.name
						})
						if(v.id === this.activeIndex+1) {
							rightData.push(v.data)
						}
					})
					this.leftData = leftData;
					this.rightData = rightData;
				}).catch(() => {
					uni.showToast({
						title:"请求失败"
					})
				})
			},
			// 获取可视区域高度(兼容)
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
			},
			// 切换左边部分
			changeLeftTab(index,id) {
				this.getData(id)
				this.activeIndex = index;
			}
		},
		// input输入框点击事件
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: "/pages/search/search"
			})
		}
	}
</script>

<style lang="scss">
	.list {
		display: flex;
	}
	.list-left {
		width: 200rpx;
		.left-item {
			border-bottom: 2rpx solid #fff;
			font-size: 28rpx;
			font-weight: bold;
			background-color: #f7f7f7;
			.left-name {
				padding: 30rpx 6rpx;
				text-align: center;
			}
			.left-name-active {
				border-left: 8rpx solid #49bdfb;
				background-color: #fff;
			}
		}
	}
	.list-right {
		flex: 1;
		.list-title {
			font-weight: bold;
			padding: 30rpx 0;
		}
		.right-content{
			display: flex;
			flex-wrap: wrap;
			.right-item {
				width:150rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 10rpx;
				.right-name {
					padding: 16rpx 0;
				}
				.right-img {
					width:150rpx;
					height: 150rpx;
				}
			}
		}
	}

</style>
