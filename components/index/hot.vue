<template>
	<view class="hot">
		<Commodity :data-list="dataList" itemW="250rpx" bigH="250rpx"></Commodity>
	</view>
</template>

<script>
	import Commodity from "../common/commodity.vue"
	export default {
		components: {
			Commodity
		},
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