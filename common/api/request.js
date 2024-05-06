import store from "@/store/index.js"
export default {
	common: {
		baseUrl: "http://127.0.0.1:3000/api",
		data: {},
		header: {
			"Content-Type": "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "GET",
		dataType: "json"
	},
	request(options = {}) {
		uni.showLoading({
			title: "加载中..."
		})
		options.url = this.common.baseUrl + options.url;
		options.data = options.data || this.common.data;
		options.header = options.header || this.common.header;
		options.method = options.method || this.common.method;
		options.dataType = options.dataType || this.common.dataType;

		// 判断是否传入 header头的token, 进行用户是否登录验证
		if (options.header.token) {
			options.header.token = store.state.user.token;
			if (!options.header.token) {
				uni.showToast({
					title: "请先登录",
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}, 1000)
				return;
			}
		}

		return new Promise((resolve, reject) => {
			uni.request({
				...options,
				success: (res) => {
					if (res.statusCode !== 200) {
						return reject()
					}
					setTimeout(() => {
						uni.hideLoading()
					}, 1000)
					let data = res.data.data;
					resolve(data)
				}
			})
		})
	}
}