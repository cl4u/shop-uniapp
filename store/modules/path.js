export default {
	state: {
		list: [
		]
	},
	getters: {
		defaultPath(state) {
			return state.list.filter(v => {
				return v.isDefault == 1
			})
		}
	},
	mutations: {
		// 拿到初始化请求当前用户收货地址数据
		__initAddressList(state, list) {
			state.list = list;
		},
		createPath(state, obj) {
			state.list.unshift(obj)
		},
		// 把之前选中默认的改完未选中
		removePath(state, ) {
			state.list.forEach(v => {
				if (v.isDefault) {
					v.isDefault = false
				}
			})
		},
		updatePath(state, {
			index,
			item
		}) {
			for (let key in item) {
				state.list[index][key] = item[key]
			}
		},
	},
	actions: {
		createPathFn({
			commit
		}, obj) {
			if (obj.isDefault) {
				commit("removePath")
			}
			commit("createPath", obj)
		},
		updatePathFn({
			commit
		}, obj) {
			if (obj.item.isDefault) {
				commit("removePath")
			}
			commit("updatePath", obj)
		}
	},
}