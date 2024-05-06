<template>
	<view class="search">
		<Lines></Lines>
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">最近搜索</view>
				<view class="iconfont icon-shanchu" @tap="clearHistory"></view>
			</view>
			<view class="f-color" v-if="searchData.length">
				<view class="search-name" v-for="(item,index) in searchData" :key="index" @tap="toSearchList(item)">{{item}}</view>
			</view>
			<view v-else class="search-end f-color">暂无搜索记录</view>
		</view>
		
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">热门搜索</view>
			</view>
			<view class="f-color">
				<view class="search-name">足球</view>
				<view class="search-name">手机</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Lines from "@/components/common/lines.vue"
	export default {
		components: {Lines},
		data() {
			return {
				keyword: "",
				searchData: []
			}
		},
		onLoad() {
			uni.getStorage({
				key: "searchData",
				success: (res) => {
					// 从缓存中获取历史数据
					this.searchData = JSON.parse(res.data)
				}
			})
		},
		// 监控input输入框内容
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text
		},
		// 点击顶部搜索按钮
		onNavigationBarButtonTap(e) {
			this.search();
		},
		// 监听软键盘上的搜索按钮
		onNavigationBarSearchInputConfirmed() {
			this.search();
		},
		methods: {
			search() {
				if (!this.keyword) {
					uni.showToast({
						title: "关键字不能为空",
						icon: "none"
					})
					return ;
				} else {
					this.toSearchList(this.keyword)
					// uni.navigateTo({
					// 	url: "/pages/search-list/search-list?keyword="+this.keyword
					// })
				}
				// 隐藏软键盘
				uni.hideKeyboard();
				this.addSearch()
			},
			// 记录最新搜索词
			addSearch() {
				// 先判断是否存在
				let idx = this.searchData.indexOf(this.keyword);
				if (idx < 0) {
					this.searchData.unshift(this.keyword)
				} else {
					// 先删除再去添加
					this.searchData.unshift(this.searchData.splice(idx,1)[0])
				}
				// 存入本地缓存
				uni.setStorage({
					key: "searchData",
					data: JSON.stringify(this.searchData)
				})
			},
			// 清除记录
			clearHistory() {
				uni.showModal({
					title: "重要提示",
					content: "是否要清除搜索记录",
					cancelText: "取消",
					confirmText: "确定",
					success: (res) => {
						if (res.confirm) {
							uni.removeStorage({
								key: "searchData"
							})
							this.searchData = [];
						}
					}
				})
			},
			// 点击搜索记录进入页面
			toSearchList(item) {
				uni.navigateTo({
					url: "../search-list/search-list?keyword="+item
				})
			}
		}
	}
</script>

<style lang="scss">
.search-item {
	padding: 20rpx;
}
.search-title {
	display: flex;
	justify-content: space-between;
}
.search-name {
	padding: 4rpx 20rpx;
	background-color: #e1e1e1;
	display: inline-block;
	border-radius: 26rpx;
	margin: 10rpx;
}
</style>
