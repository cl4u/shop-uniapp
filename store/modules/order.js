export default {
	state: {
		orderNumber: ""
	},
	mutations: {
		initOrder(state,order){
			state.orderNumber = order
		}
	}
}