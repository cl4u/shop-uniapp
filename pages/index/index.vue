<template>
	<view class="content">
		<view class="index">
			<scroll-view scroll-x="true" :scroll-into-view="scrollIntoIndex" class="scroll-content">
				<view class="scroll-item" v-for="(item,index) in topBar" :key="index" :id="'top'+index"
					@tap="changeTab(index)">
					<text :class="topBarIndex === index ? 'f-active-color' :'f-color'">{{item.name}}</text>
				</view>
			</scroll-view>

			<swiper @change="onChangeTab" :current="topBarIndex" :style="'height:'+clientHeight+'px'">
				<swiper-item v-for="(item,index) in newTopBar" :key="index">
					<scroll-view @scrolltolower="loadMore(index)" scroll-y="true" :style="'height:'+clientHeight+'px'">
						<block v-if="item.data.length">
							<block v-for="(k,i) in item.data" :key="i">
								<!-- 推荐 -->
								<IndexSwiper v-if="k.type === 'swiperList'" :data-list="k.data"></IndexSwiper>
								<template v-if="k.type === 'recommendList'">
									<Recommend :data-list="k.data"></Recommend>
									<Card card-title="猜你喜欢"></Card>
								</template>

								<!-- 运动户外 -->
								<Banner v-if="k.type === 'bannerList'" :data-list="k.imgUrl"></Banner>

								<template v-if="k.type === 'iconsList'">
									<Icons :data-list="k.data"></Icons>
									<Card card-title="热销爆品"></Card>
								</template>

								<template v-if="k.type === 'hotList'">
									<Hot :data-list="k.data"></Hot>
									<Card card-title="店铺推荐"></Card>
								</template>

								<template v-if="k.type === 'shopList'">
									<Shop :data-list="k.data"></Shop>
									<Card card-title="为您推荐"></Card>
								</template>
								<CommodityList v-if="k.type === 'commodityList'" :data-list="k.data"></CommodityList>
							</block>
						</block>
						<view v-else>
							暂无数据...
						</view>
						<view class="load-text f-color">{{item.loadText}}</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<tabbar current-page="index"></tabbar>
	</view>
</template>

<script>
	// components
	import IndexSwiper from '@/components/index/indexSwiper.vue';
	import Recommend from "@/components/index/recommend.vue";
	import Card from "@/components/common/card.vue";
	import CommodityList from "@/components/common/commodityList.vue";
	import Banner from "@/components/index/banner.vue";
	import Icons from "@/components/index/icons.vue";
	import Hot from "@/components/index/hot.vue";
	import Shop from "@/components/index/shop.vue";
	import tabbar from "@/components/index/tabbar.vue"
	// api
	import $http from "@/common/api/request.js"
	export default {
		components: {
			IndexSwiper,
			Recommend,
			Card,
			CommodityList,
			Banner,
			Icons,
			Hot,
			Shop,
			tabbar
		},
		data() {
			return {
				topBarIndex: 0, // 选中的索引
				scrollIntoIndex: "top0", // 顶栏跟随的索引id值
				topBar: [], // 顶栏数据
				clientHeight: 0,
				newTopBar: [], // 承载数据
			}
		},
		onLoad() {
			// 请求接口数据
			this.initData()
		},
		// 标题栏按钮点击
		onNavigationBarButtonTap(e) {
			if (e.float === "left") {
				uni.navigateTo({
					url:"/pages/search/search"
				})
			}
		},
		// onReady 是在初步完成渲染后才会执行,只有渲染完成后才能获取组件高度,通过获取生成的内容高度,自动设置swiper高度
		onReady() {
			uni.getSystemInfo({
				success: (res) => {
					// 可视区域高度减去头部高度
					this.clientHeight = res.windowHeight - uni.upx2px(80) - this.getClientHeight()
				}
			})
		},
		methods: {
			initData() {
				$http.request({
					url: "/index_list/data"
				}).then(res => {
					this.topBar = res.topBar;
					this.newTopBar = this.formatData(res)
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})
			},
			formatData(res) {
				let arr = [];
				for (var i = 0; i < this.topBar.length; i++) {
					let obj = {
						data: [],
						load: 'first',
						loadText: "上拉加载更多..."
					}
					// 获取首次数据
					if (i == 0) {
						obj.data = res.data
					}
					arr.push(obj)
				}
				return arr;
			},
			changeTab(index) {
				if (this.topBarIndex === index) {
					return
				}
				this.topBarIndex = index;
				this.scrollIntoIndex = "top" + index;
				if (this.newTopBar[this.topBarIndex].load === "first") {
					this.addData()
				}

			},
			onChangeTab(e) {
				this.changeTab(e.detail.current)
			},
			// 获取可视区域高度[兼容]
			getClientHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return 44 + res.statusBarHeight
				} else if (system === 'android') {
					return 48 + res.statusBarHeight
				} else {
					return 0
				}
			},
			// 对应显示不同的数据
			addData(callback) {
				let index = this.topBarIndex;
				let id = this.topBar[index].id;
				let page = Math.ceil(this.newTopBar[index].data.length / 5) + 1;
				$http.request({
					url: `/index_list/${id}/data/${page}`,
				}).then(res => {
					this.newTopBar[index].data = [...this.newTopBar[index].data, ...res]
				}).catch(() => {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				})
				// 请求结束后重新赋值
				this.newTopBar[index].load = "last";
				if (typeof callback === "function") {
					callback()
				}
			},
			// 上拉加载更多
			loadMore(index) {
				this.newTopBar[index].loadText = "加载中...";
				// 请求完数据，文字提示信息又换成[上拉加载更多...]
				this.addData(() => {
					this.newTopBar[index].loadText = "上拉加载更多..."
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.index {
			width: 100%
		}
	}

	.scroll-content {
		width: 100%;
		height: 80rpx;
		white-space: nowrap;
	}

	.scroll-item {
		display: inline-block;
		padding: 10rpx 30rpx;
		font-size: 32rpx;
	}

	.f-active-color {
		padding: 10rpx 0;
		border-bottom: 6rpx solid #49BDFB;
	}
	.load-text{
	    border-top: 2rpx solid #636263;
	    line-height: 60rpx;
	    text-align: center;
	}
</style>