<template>
	<view class="bar-content">
		<!-- TODO 需完成 -->
		<view class="bar-box">
			<view class="left"></view>
			<view class="center">{{title}}</view>
			<view class="right" @click="change">{{rightText}}</view>
		</view>
		<lines></lines>
	</view>
</template>

<script>
	import lines from "@/components/common/lines.vue"
	export default {
		components: {lines},
		props: {
			title: {
				type: String,
				default:""
			},
			fixed: {
				type: String,
				default: "false"
			},
			rightText: {
				type: String,
				default: ""
			}
		},
		methods: {
			change() {
				this.$emit("clickRight")
			}
		},
	}
</script>

<style lang="scss">
	.bar-content{
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		height: 80rpx;
		line-height: 80rpx;
	}
	.bar-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		
	}
</style>