<template>
	<view class="login-other">
	        <view class="other-text">
	            <view class="">用以下方式登录</view>
	        </view>
	        <view class="other">
	           <view class="other-item" @tap="loginOther('weixin')">
	               <image src="../../static/img/wx.png" mode=""></image>
	               <view class="">
	                   微信登录
	               </view>
	           </view>
	           <view class="other-item" @tap="loginOther('sinaweibo')">
	                <image src="../../static/img/wb.png" mode=""></image>
	                <view class="">
	                    微博登录
	                </view>
	            </view>
	            <view class="other-item" @tap="loginOther('qq')">
	                <image src="../../static/img/qq.png" mode=""></image>
	                <view class="">
	                    QQ登录
	                </view>
	            </view>
	        </view>
	    </view>
</template>

<script>
	import $http from "@/common/api/request.js";
	import {mapMutations} from "vuex"
	export default {
		methods: {
			...mapMutations(["login"]),
			loginOther(mode) {
				uni.login({
					provider:mode,
					success: (res)=>{
						uni.getUserInfo({
							provider:mode,
							success: re=> {
								let provider = mode;
								// openid用户身份
								let openid = res.userInfo.openid || res.userInfo.openId;
								let nickName = res.userInfo.nickName;
								let avatarUrl = res.userInfo.avatarUrl;
								$http.request({
									url: "/loginOther",
									method: "POST",
									data: {
										provider,
										openid,
										nickName,
										avatarUrl
									}
								}).then(res => {
									this.login(res)
									setTimeout(() => {
										uni.navigateBack()
									},1000)
								}).catch(() => {
									uni.showToast({
										title:"请求失败",
										icon: "none"
									})
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
// 其他登录方式

.login-other{
    padding: 100rpx 0;
}
.other-text{
    display: flex;
    padding: 50rpx 0;
}
.other-text:before{
    flex:1;
    content: "";
    height: 2rpx;
    background-color: #ccc;
}
.other-text::after{
    flex:1;
    content: "";
    height: 2rpx;
    background-color: #ccc;
}
.other{
    display: flex;
    justify-content: space-around;
}
.other-item{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.other-item image{
    width: 80rpx;
    height: 80rpx;
}
// 其他登录方式end
</style>