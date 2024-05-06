import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

// 购物车
import cart from "./modules/cart.js"
// 地址管理
import path from "./modules/path.js"
// 用户信息
import user from "./modules/user.js"
// 订单信息
import order from "./modules/order.js"

export default new Vuex.Store({
	modules: {
		cart,
		path,
		user,
		order
	}
})