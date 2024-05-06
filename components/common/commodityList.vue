<template>
	<view class="commodity-list">
		<!-- 商品列表组件 -->
		<Commodity :data-list="dataList"></Commodity>
	</view>
</template>

<script>
	import Commodity from "./commodity.vue"
	export default {
		components: {Commodity},
		props: {
			dataList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style>
</style>