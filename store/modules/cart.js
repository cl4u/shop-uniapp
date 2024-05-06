import $http from "@/common/api/request.js"
export default {
	state: {
		list: [],
		selectedList: [],
	},
	getters: {
		// 判断是否 全选
		checkedAll(state) {
			return state.list.length === state.selectedList.length;
		},
		totalCount(state) {
			let total = {
				pprice: 0,
				num: 0
			}
			state.list.forEach(v => {
				if (state.selectedList.indexOf(v.id) > -1) {
					total.pprice += v.pprice * v.num;
					total.num = state.selectedList.length
				}
			})
			return total
		}
	},
	mutations: {
		initGetData(state, list) {
			state.list = list
		},
		// 全选
		checkAll(state) {
			state.selectedList = state.list.map(v => {
				v.checked = true;
				return v.id;
			})
		},
		// 全不选
		unCheckAll(state) {
			state.list.forEach(v => {
				v.checked = false;
			})
			state.selectedList = [];
		},
		// 单选
		selectedItem(state, index) {
			let id = state.list[index].id;
			let i = state.selectedList.indexOf(id);
			// 如果selectList已经存在就代表他之前的选中状态,checked=false,并且在selectedList删除
			if (i > -1) {
				state.list[index].checked = false;
				return state.selectedList.splice(i, 1)
			}
			// 如果之前没有选中,checked=true,把当前的id添加到selectedList
			state.list[index].checked = true;
			state.selectedList.push(id)
		},
		// 删除商品
		delGoods(state) {
			state.list = state.list.filter(v => {
				return state.selectedList.indexOf(v.id) === -1
			})
		},
		// 加入购物车
		addShopCart(state, goods) {
			state.list.push(goods)
		}
	},
	actions: {
		checkedAllFn({
			commit,
			getters
		}) {
			getters.checkedAll ? commit("unCheckAll") : commit("checkAll")
		},
		delGoodsFn({
			commit,state
		}) {
			uni.showModal({
				content:"确认删除吗？",
				success: () => {
					$http.request({
						url: "/deleteCart",
						method: "POST",
						header: {
							token: true
						},
						data: {
							goods_id: state.selectedList
						}
					}).then(res => {
						commit("delGoods");
						commit("unCheckAll")
						uni.showToast({
							title: "删除成功",
							icon: "none"
						})
					}).catch(() => {
						uni.showToast({
							title:"请求失败",
							icon: "none"
						})
					})
				}
			})
			
		}
	}
}