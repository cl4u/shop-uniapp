<template>
	<view class="my-add-path">
		<view class="path-item">
			<view>收件人</view>
			<input type="text" value="" placeholder="请输入收件人" v-model="pathObj.name">
		</view>
		<view class="path-item">
			<view>电话</view>
			<input type="text" value="" placeholder="请输入手机号"  v-model="pathObj.tel">
		</view>
		<view class="path-item">
			<view>所在地址</view>
			<view @tap="showCityPicker">{{pathCity}}</view>
			<uni-region-sheet :showSheetView="showSheetView" :defaultIndexs="[0,0,0]"
				@onSelected="onSelected"></uni-region-sheet>
		</view>
		<view class="path-item">
			<view>详细地址</view>
			<input type="text" value="" placeholder="请输入详细地址" v-model="pathObj.address">
		</view>
		<view class="path-item">
			<view>设为默认地址</view>
			<radio-group @change="radioChange">
				<label class="radio">
					<radio value="" :checked="pathObj.isDefault == 1 ? true : false" color="#ff3333"></radio><text></text>
				</label>
			</radio-group>
			
		</view>
	</view>
</template>

<script>
	import uniRegionSheet from '@/components/zxp-uniRegionSheet/zxp-uniRegionSheet.vue'
	import {mapActions} from "vuex"
	import $http from "@/common/api/request.js"
	export default {
		components: {
			uniRegionSheet
		},
		data() {
			return {
				showSheetView: false,
				pathObj: {
					name:"",
					tel: "",
					city: "请选择 >",
					details:"",
					isDefault: false
				},
				i: -1,
				isStatus: false, // 是否修改的状态
			}
		},
		computed: {
			pathCity() {
				if (this.pathObj.province) {
					return `${this.pathObj.province}-${this.pathObj.city}-${this.pathObj.district}`
				} else {
					return "请选择"
				}
			}
		},
		onLoad(e) {
			if (e.data) {
				uni.setNavigationBarTitle({
					title: "修改地址"
				})
				let result = JSON.parse(e.data);
				this.pathObj = result.item;
				this.i = result.index;
				this.isStatus = true;
			}
		},
		onNavigationBarButtonTap() {
			if (!this.isStatus) {
				$http.request({
					url: "/addAddress",
					method: "POST",
					header: {
						token: true
					},
					data: {
						...this.pathObj
					}
				}).then(res => {
					this.createPathFn(this.pathObj)
					uni.navigateBack({delta:1})
				}).catch(() => {
					uni.showToast({
						title:"请求失败",
						icon: "none"
					})
				})
				
			} else {
				$http.request({
					url: "/updateAddress",
					method: "POST",
					header: {
						token: true
					},
					data: {
						...this.pathObj
					}
				}).then(res => {
					this.pathObj.isDefault = this.pathObj.isDefault == true ? 1 : 0;
					this.updatePathFn({
						index: this.i,
						item: this.pathObj
					})
					uni.showToast({
						title:"修改成功",
						icon: "none"
					})
					uni.navigateBack({delta:1})
				}).catch(() => {
					uni.showToast({
						title:"请求失败",
						icon: "none"
					})
				})
			}
			
		},
		methods: {
			...mapActions(["createPathFn","updatePathFn"]),
			onSelected(row) {
				/*这里必须将值置为false，否则无法唤起下一次的弹框显示*/
				this.showSheetView = false
				if (!row.cancel) {
					this.pathObj.province = row?.data?.province;
					this.pathObj.city = row?.data?.city;
					this.pathObj.district = row?.data?.area;
				}
			},
			showCityPicker() {
				this.showSheetView = true
			},
			radioChange() {
				this.pathObj.isDefault = !this.pathObj.isDefault;
			}
		}
	}
</script>

<style lang="scss">
	.my-add-path {
		padding-left: 20rpx;

		.path-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16rpx 0;
			width: 100%;
			border-bottom: 2rpx solid #ccc;

			input {
				flex: 1;
				text-align: left;
				padding: 0 10rpx;
			}
		}
	}
</style>