import App from './App'
import "@/common/common.css"
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
import store from "store/index.js"
Vue.prototype.$store = store

// 权限跳转，未登录的跳转到登录
Vue.prototype.navigateTo = (options) => {
	if (!store.state.user.loginStatus) {
		uni.showToast({
			title:"请先登录",
			icon: "none"
		})
		uni.navigateTo({
			url:"/pages/login/login"
		})
		return
	}
	uni.navigateTo(options)
}

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif