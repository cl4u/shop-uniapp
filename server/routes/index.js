var express = require('express');
var router = express.Router();
var connection = require("../db/sql.js")
var user = require("../db/userSql.js")
let code = ""; // 验证码
const jwt = require('jsonwebtoken'); // 生成token秘钥

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

// 用户登录
router.post("/api/login", function(req, res, next) {
	let params = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}
	// 查询用户名或者手机号是否存在
	connection.query(user.queryUserName(params), function(error, results, fields) {
		if (results.length > 0) {
			connection.query(user.quertUserPwd(params), function(error, result) {
				if (result.length > 0) {
					res.send({
						data: {
							success: true,
							msg: "登录成功",
							data: result[0]
						}
					})
				} else {
					res.send({
						data: {
							success: false,
							msg: "密码不正确"
						}
					})
				}
			})
		} else {
			res.send({
				data: {
					success: false,
					msg: "用户名或手机号不存在"
				}
			})
		}
	})
})

// 验证手机号是否已存在
router.post("/api/registered", function(req, res, next) {
	let params = {
		userName: req.body.phone
	}
	// 查询手机号是否存在
	connection.query(user.queryUserName(params), function(error, results, fields) {
		if (results.length > 0) {
			res.send({
				data: {
					success: false,
					msg: "手机号已经存在"
				}
			})
		} else {
			res.send({
				data: {
					success: true
				}
			})
		}
	})
})

// 发送验证码
router.post("/api/code", function(req, res, next) {
	let params = {
		userName: req.body.userName
	}
	var codeArr = [Math.floor(Math.random() * (9999 - 1000) + 1000)]
	code = codeArr[0]
	res.send({
		data: {
			success: true,
			code: codeArr[0]
		}
	})
})
// 注册-新增一条数据
router.post("/api/addUser", function(req, res, next) {
	let params = {
		userName: req.body.userName,
		userCode: req.body.code
	}
	if (params.userCode == code) {
		connection.query(user.insertData(params), function(error, results, fields) {
			// 再去查询手机号是否存在，用于注册成功后直接登录
			connection.query(user.queryUserName(params), function(er, result) {
				if (result.length > 0) {
					res.send({
						data: {
							success: true,
							msg: "注册成功",
							data: result[0]
						}
					})
				}
			})
		})
	}
})

// 第三方登录
router.post("/api/loginOther", function(req, res, next) {
	let params = {
		provider: req.body.provider,
		openid: req.body.openid,
		nickName: req.body.nickName,
		avataUrl: req.body.avataUrl
	}
	connection.query(user.queryUserName(params), function(error, results, field) {
		if (results.length > 0) {
			// 数据库中存在，则直接读取
			connection.query(user.queryUserName(params), function(err2, res2) {
				res.send({
					data: res2[0]
				})
			})
		} else {
			// 数据库不存在，则存储读取
			connection.query(user.insertData(params), function(err1, res1) {
				connection.query(user.queryUserName(params), function(err2, res2) {
					res.send({
						data: res2[0]
					})
				})
			})
		}
	})

})

// 搜索接口
router.get("/api/goods/search", function(req, res, next) {
	// desc 降序 asc 升序
	// 获取对象的key
	console.log({
		req
	})
	let [goodsName, orderName] = Object.keys(req.query);
	let name = req.query.name;
	let order = req.query[orderName];

	let sql = "select * from goods_search";
	if (!(name == undefined || orderName == undefined || order == undefined)) {
		sql = "select * from goods_search where name like '%" + name + "%' order by " + orderName + " " + order
	}
	connection.query(sql, function(error, results, fields) {
		res.send({
			code: "0",
			data: results
		})
	})
})

// 获取商品分类
router.get("/api/goods/list", function(req, res, next) {
	res.send({
		code: 0,
		name: "家居家纺",
		data: [{
				id: 1,
				name: "家纺",
				data: [{
						name: "家纺",
						list: [{
								id: 1,
								name: "毛巾",
								imgUrl: "/static/img/4.jpg"
							},
							{
								id: 2,
								name: "枕头",
								imgUrl: "/static/img/5.jpg"
							},
						]
					},
					{
						name: "生活用品",
						list: [{
								id: 1,
								name: "浴室用品",
								imgUrl: "/static/img/5.jpg"
							},
							{
								id: 2,
								name: "牙刷",
								imgUrl: "/static/img/6.jpg"
							},
						]
					}
				]
			},
			{
				id: 2,
				name: "女装",
				data: [{
						name: "裙装",
						list: [{
								id: 1,
								name: "连衣裙",
								imgUrl: "/static/img/7.jpg"
							},
							{
								id: 2,
								name: "半身裙",
								imgUrl: "/static/img/8.jpg"
							},
						]
					},
					{
						name: "上衣",
						list: [{
								id: 1,
								name: "T恤",
								imgUrl: "/static/img/9.jpg"
							},
							{
								id: 2,
								name: "衬衫",
								imgUrl: "/static/img/10.jpg"
							},
						]
					}
				]
			}
		]
	})
})

// 根据id获取详情
router.get("/api/goods/id", function(req, res, next) {
	let id = req.query.id;
	connection.query("select * from goods_search where id='" + id + "'", function(error, result, fields) {
		if (error) throw error;
		res.send({
			code: "0",
			data: result
		})
	})
})
// 查询收获地址
router.post('/api/selectAddress', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	connection.query(`select * from user where phone = ${phone.name}`, function(error, results, fields) {
		let id = results[0].id;
		connection.query(`select * from address where userid = ${id}`, function(error2, results2,
			fields2) {
			res.send({
				data: {
					success: true,
					data: results2,
				}
			})
		});
	});
});
// 当前用户新增收货地址
router.post("/api/addAddress", function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	let name = req.body.name;
	let tel = req.body.tel;
	let province = req.body.province;
	let city = req.body.city;
	let district = req.body.district;
	let address = req.body.address;
	let isDefault = req.body.isDefault;
	connection.query(`select * from user where phone = ${phone.name}`, function(error, result, fields) {
		let id = result[0].id;
		let sqlInsert =
			"insert into address (name,tel,province,city,district,address,isDefault,userId) values ('" +
			name + "','" + tel + "','" + province + "','" + city + "','" + district + "','" + address +
			"','" + isDefault + "','" + id + "')";
		connection.query(sqlInsert, function(error1, result1, fields1) {
			res.send({
				data: {
					success: "新增成功"
				}
			})
		})
	})
})
// 当前用户修改收货地址
router.post("/api/updateAddress", function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	let name = req.body.name;
	let tel = req.body.tel;
	let province = req.body.province;
	let city = req.body.city;
	let district = req.body.district;
	let address = req.body.address;
	let isDefault = req.body.isDefault;
	let id = req.body.id;
	connection.query(`select * from user where phone = ${phone.name}`, function(error, results, fields) {
		let userId = results[0].id;
		// 默认地址处理,当前用户只能有一个默认地址
		connection.query(`select * from address where userid=${userId} and isDefault = ${isDefault}`,
			function(err2, res2, fields2) {
				let childId = results[0].id;
				connection.query(
					`update address set isDefault = replace(isDefault,"1","0") where userid=${childId}`,
					function(err3, res3) {
						// console.log(err3,res3);
						// 
						let sqlupdate =
							"update address set name=?,tel=?,province=?,city=?,district=?,address=?,isDefault=?,userid=? where id = '" +
							id + "'";
						connection.query(sqlupdate, [name, tel, province, city, district,
							address, isDefault, userId
						], function(err1, res1, field1) {
							res.send({
								data: {
									success: "成功"
								}
							})
						});
					});
			});

	});
})
// 获取购物车列表
router.post("/api/selectCart", function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	connection.query(`select * from user where phone=${phone.name}`, function(error, result, fields) {
		let userId = result[0].id;
		connection.query(`select * from goods_cart where uid = ${userId}`, function(error1, results1,
			fields1) {
			res.json({
				data: results1
			})
		})
	})
})
// 添加购物车
router.post("/api/addCart", function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	let goodsId = req.body.goodsId; //商品id
	let num = req.body.num; //前端传过来用户输入的产品数量
	connection.query(`select * from user where phone = ${phone.name}`, function(error, results, fields) {
		let userId = results[0].id;
		connection.query(`select * from goods_search where id=${goodsId}`, function(error1, results1,
			fields1) {
			let name = results1[0].name;
			let imgUrl = results1[0].imgUrl;
			let pprice = results1[0].pprice;
			// 查询当前用户之前是否添加过该商品
			connection.query(
				`select * from goods_cart where uid=${userId} and goods_id=${goodsId}`,
				function(error2, results2, fields2) {
					if (results2.length) {
						// 如果当前用户之前添加过，则直接增加数量
						connection.query(
							`update goods_cart ser num=replace(num,${results2[0].num},${parseInt(num)+parseInt(results2[0].num)}) where id = ${results2[0].id}`,
							function(error3, results3, fields3) {
								res.json({
									data: {
										success: "添加成功"
									}
								})
							})
					} else {
						// 如果之前没有添加过，则将该商品加入购物车
						connection.query(
							`insert into goods_cart (uid,goods_id,name,imgUrl,pprice,num) values("${userId}","${goodsId}","${name}","${imgUrl}","${pprice}","${num}")`,
							function(error4, results4, fields4) {
								res.json({
									data: {
										success: "新增成功"
									}
								})
							})
					}
				})
		})
	})
})

// 修改当前用户购物车商品数量
router.post("/api/updateCart", function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	let goodsId = req.body.goodsId; //商品id
	let num = req.body.num; //前端传过来用户输入的产品数量
	connection.query(`select * from user where phone = ${phone.name}`, function(error, results, fields) {
		let userId = results[0].id;
		connection.query(`select * from goods_cart where uid = ${userId} and goods_id = ${goodsId}`,
			function(error1, results1, fields1) {
				let goods_num = results1[0].num; //数据库中当前的数量
				let id = results1[0].id; //当前id号
				// 修改替换
				connection.query(
					`update goods_cart set num = replace(num,${goods_num},${num}) where id = ${id}`,
					function(error2, results2) {
						res.json({
							data: {
								success: true
							}
						})
					})
			});
	});
})
// 删除购物车商品
router.post("/api/deleteCart", function(req, res, next) {
	let goodsId = req.body.goods_id;
	connection.query(`delete from goods_cart where id in (${goodsId.join(',')})`, function(error, result,
		fields) {
		res.json({
			data: {
				success: true
			}
		})
	})
})
// 生成订单
router.post("/api/addOrder", function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	let goodsArr = req.body.arr;
	// 生成订单号
	function setTimeDateFmt(s) {
		return s < 10 ? "0" + s : s;
	}

	function orderNumber() {
		const now = new Date();
		let fullYear = now.getFullYear();
		let month = setTimeDateFmt(now.getMonth() + 1);
		let day = setTimeDateFmt(now.getDate());
		let hour = setTimeDateFmt(now.getHours());
		let minutes = setTimeDateFmt(now.getMinutes());
		let seconds = setTimeDateFmt(now.getSeconds())
		let orderCode = fullYear + month + day + hour + minutes + seconds + (Math.round(Math.random() *
			1000000))
		return orderCode
	}
	// 商品名称
	let goodsName = [];
	// 订单总价
	let goodsPrice = 0;
	// 订单商品总数量
	let goodsNum = 0;
	// 订单号
	let orderId = orderNumber()

	goodsArr.forEach(v => {
		goodsName.push(v.name);
		goodsNum += parseInt(v.num);
		goodsPrice += v.num * v.pprice
	})
	let goodsName1 = goodsName.join(",")
	// 查询用户
	connection.query(`select * from user where phone = ${phone.name}`, function(error, results, fileds) {
		let userId = results[0].id;
		// 订单写入数据库
		connection.query(
			`insert into store_order (uid,order_id,goods_name,goods_price,goods_num,order_status) values ('${userId}','${orderId}','${goodsName1}','${goodsPrice}','${goodsNum}','1')`,
			function(error1, results1, fields1) {
				// 查询刚生成的订单详情
				connection.query(
					`select * from store_order where uid = ${userId} and order_id = ${orderId}`,
					function(error2, results2, fields2) {
						res.json({
							data: {
								success: true,
								data: results2
							}
						})
					});

			});
	})
})
// 修改订单
router.post("/api/submitOrder",function(req,res,next) {
	let token = req.headers.token;
	let phone = jwt.decode(token);
	let orderId = req.body.orderId;
	let shopArr = req.body.shopArr;
	connection.query(`select * from user where phone = ${phone.name}`,function(error,results,fields) {
		let userId = results[0].id;
		connection.query(`select * from store_order where uid = ${userId} and order_id = ${orderId}`,function(error1,results1,fields1){
			let id = results1[0].id;
			connection.query(`update store_order set order_status = replace(order_status,"1","2") where id = ${id}`,function(error2,results2,fields2){
				// 清除购物车
				connection.query(`delete from goods_cart where id in (${shopArr.join(",")})`,function(error3,results3,fields3) {
					res.json({
						data: {
							success: true
						}
					})
				})
			})
		})
	})
})
// 获取首页数据
router.get("/api/index_list/data", function(req, res, next) {
	res.send({
		"code": 0,
		"data": {
			topBar: [{
					id: 1,
					name: "推荐"
				},
				{
					id: 2,
					name: "运动户外"
				},
				{
					id: 3,
					name: "服饰内衣"
				},
				{
					id: 4,
					name: "鞋靴箱包"
				},
				{
					id: 5,
					name: "美妆个护"
				},
				{
					id: 6,
					name: "家居数码"
				},
				{
					id: 7,
					name: "食品母婴"
				}
			],
			data: [{
					type: "swiperList",
					data: [{
							imgUrl: "/static/img/1.jpg"
						},
						{
							imgUrl: "/static/img/9.jpg"
						},
						{
							imgUrl: "/static/img/11.jpg"
						},
					]
				},
				{
					type: "recommendList",
					data: [{
							bigUrl: "../../static/img/9.jpg",
							data: [{
									imgUrl: "../../static/img/2.jpg"
								},
								{
									imgUrl: "../../static/img/3.jpg"
								},
								{
									imgUrl: "../../static/img/4.jpg"
								},
							]
						},
						{
							bigUrl: "../../static/img/11.jpg",
							data: [{
									imgUrl: "../../static/img/5.jpg"
								},
								{
									imgUrl: "../../static/img/6.jpg"
								},
								{
									imgUrl: "../../static/img/7.jpg"
								},
							]
						}
					]
				},
				{
					type: "commodityList",
					data: [{
							id: 1,
							imgUrl: "../../static/img/8.jpg",
							name: "迪奥绒毛大衣,今年必抢,错过瞬时不爽了,爆款疯狂销售",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 2,
							imgUrl: "../../static/img/10.jpg",
							name: "迪奥绒毛大衣,今年必抢,错过瞬时不爽了,爆款疯狂销售",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/12.jpg",
							name: "迪奥绒毛大衣,今年必抢,错过瞬时不爽了,爆款疯狂销售",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			]
		}
	})
})
// 获取首页第一次触底数据
router.get("/api/index_list/1/data/2", function(req, res, next) {
	res.send({
		"code": 0,
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/8.jpg",
					name: "迪奥绒毛大衣,今年必抢,错过瞬时不爽了,爆款疯狂销售",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/10.jpg",
					name: "迪奥绒毛大衣,今年必抢,错过瞬时不爽了,爆款疯狂销售",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/12.jpg",
					name: "迪奥绒毛大衣,今年必抢,错过瞬时不爽了,爆款疯狂销售",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})

// 运动户外
router.get("/api/index_list/2/data/1", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
				type: "swiperList",
				data: [{
						imgUrl: "/static/img/sports/1.jpg"
					},
					{
						imgUrl: "/static/img/sports/2.jpg"
					},
					{
						imgUrl: "/static/img/sports/5.jpg"
					},
				]
			},
			{
				type: "recommendList",
				data: [{
						bigUrl: "../../static/img/sports/2.jpg",
						data: [{
								imgUrl: "../../static/img/sports/3.jpg"
							},
							{
								imgUrl: "../../static/img/sports/4.jpg"
							},
							{
								imgUrl: "../../static/img/sports/6.jpg"
							},
						]
					},
					{
						bigUrl: "../../static/img/sports/5.jpg",
						data: [{
								imgUrl: "../../static/img/sports/7.jpg"
							},
							{
								imgUrl: "../../static/img/sports/8.jpg"
							},
							{
								imgUrl: "../../static/img/sports/9.jpg"
							},
						]
					}
				]
			},
			{
				type: "bannerList",
				imgUrl: "../../static/img/sports/1.jpg"
			},
			{
				type: "iconsList",
				data: [{
						imgUrl: "../../static/img/sports/sp1.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp2.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp3.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp4.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp5.png",
						name: "户外"
					},
				]
			},
			{
				type: "hotList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/sports/3.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/sports/6.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/sports/7.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			},
			{
				type: "shopList",
				data: {
					bigUrl: "../../static/img/sports/2.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/sports/9.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 2,
							imgUrl: "../../static/img/sports/10.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/sports/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/sports/12.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/sports/13.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/sports/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			},
			{
				type: "commodityList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/sports/12.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/sports/13.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/sports/9.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			}
		]
	})
})
// 运动户外第一次触底数据
router.get("/api/index_list/2/data/2", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/sports/12.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/sports/13.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/sports/9.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})

// 服饰内衣
router.get("/api/index_list/3/data/1", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
				type: "swiperList",
				data: [{
						imgUrl: "/static/img/clothes/1.jpg"
					},
					{
						imgUrl: "/static/img/clothes/2.jpg"
					},
					{
						imgUrl: "/static/img/clothes/3.jpg"
					},
				]
			},
			{
				type: "recommendList",
				data: [{
						bigUrl: "../../static/img/clothes/2.jpg",
						data: [{
								imgUrl: "../../static/img/clothes/4.jpg"
							},
							{
								imgUrl: "../../static/img/clothes/5.jpg"
							},
							{
								imgUrl: "../../static/img/clothes/6.jpg"
							},
						]
					},
					{
						bigUrl: "../../static/img/clothes/3.jpg",
						data: [{
								imgUrl: "../../static/img/clothes/7.jpg"
							},
							{
								imgUrl: "../../static/img/clothes/8.jpg"
							},
							{
								imgUrl: "../../static/img/clothes/9.jpg"
							},
						]
					}
				]
			},
			{
				type: "bannerList",
				imgUrl: "../../static/img/clothes/1.jpg"
			},
			{
				type: "iconsList",
				data: [{
						imgUrl: "../../static/img/sports/sp1.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp2.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp3.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp4.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp5.png",
						name: "户外"
					},
				]
			},
			{
				type: "hotList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/clothes/4.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/clothes/5.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/clothes/6.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			},
			{
				type: "shopList",
				data: {
					bigUrl: "../../static/img/clothes/2.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/clothes/7.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 2,
							imgUrl: "../../static/img/clothes/8.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/clothes/9.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/clothes/10.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/clothes/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/clothes/12.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			},
			{
				type: "commodityList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/clothes/13.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/clothes/14.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/clothes/15.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 4,
						imgUrl: "../../static/img/clothes/16.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 5,
						imgUrl: "../../static/img/clothes/17.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 6,
						imgUrl: "../../static/img/clothes/18.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 7,
						imgUrl: "../../static/img/clothes/19.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 8,
						imgUrl: "../../static/img/clothes/20.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			}
		]
	})
})
// 服饰内衣第一次触底数据
router.get("/api/index_list/3/data/2", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/clothes/13.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/clothes/14.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/clothes/15.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 4,
					imgUrl: "../../static/img/clothes/16.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 5,
					imgUrl: "../../static/img/clothes/17.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 6,
					imgUrl: "../../static/img/clothes/18.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 7,
					imgUrl: "../../static/img/clothes/19.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 8,
					imgUrl: "../../static/img/clothes/20.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})

// 鞋箱礼包
router.get("/api/index_list/4/data/1", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
				type: "swiperList",
				data: [{
						imgUrl: "/static/img/box/1.jpg"
					},
					{
						imgUrl: "/static/img/box/2.jpg"
					},
					{
						imgUrl: "/static/img/box/3.jpg"
					},
				]
			},
			{
				type: "recommendList",
				data: [{
						bigUrl: "../../static/img/box/2.jpg",
						data: [{
								imgUrl: "../../static/img/box/4.jpg"
							},
							{
								imgUrl: "../../static/img/box/5.jpg"
							},
							{
								imgUrl: "../../static/img/box/6.jpg"
							},
						]
					},
					{
						bigUrl: "../../static/img/box/3.jpg",
						data: [{
								imgUrl: "../../static/img/box/7.jpg"
							},
							{
								imgUrl: "../../static/img/box/8.jpg"
							},
							{
								imgUrl: "../../static/img/box/9.jpg"
							},
						]
					}
				]
			},
			{
				type: "bannerList",
				imgUrl: "../../static/img/box/1.jpg"
			},
			{
				type: "iconsList",
				data: [{
						imgUrl: "../../static/img/sports/sp1.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp2.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp3.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp4.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp5.png",
						name: "户外"
					},
				]
			},
			{
				type: "hotList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/box/4.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/box/5.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/box/6.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			},
			{
				type: "shopList",
				data: {
					bigUrl: "../../static/img/box/2.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/box/7.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 2,
							imgUrl: "../../static/img/box/8.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/box/9.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/box/10.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/box/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/box/12.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			},
			{
				type: "commodityList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/box/13.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/box/14.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/box/15.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 4,
						imgUrl: "../../static/img/box/16.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 5,
						imgUrl: "../../static/img/box/17.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 6,
						imgUrl: "../../static/img/box/18.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 7,
						imgUrl: "../../static/img/box/19.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 8,
						imgUrl: "../../static/img/box/20.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			}
		]
	})
})
// 鞋箱礼包第一次触底数据
router.get("/api/index_list/4/data/2", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/box/13.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/box/14.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/box/15.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 4,
					imgUrl: "../../static/img/box/16.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 5,
					imgUrl: "../../static/img/box/17.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 6,
					imgUrl: "../../static/img/box/18.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 7,
					imgUrl: "../../static/img/box/19.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 8,
					imgUrl: "../../static/img/box/20.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})

// 美妆个护
router.get("/api/index_list/5/data/1", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
				type: "swiperList",
				data: [{
						imgUrl: "/static/img/beautiful/1.jpg"
					},
					{
						imgUrl: "/static/img/beautiful/2.jpg"
					},
				]
			},
			{
				type: "recommendList",
				data: [{
						bigUrl: "../../static/img/beautiful/2.jpg",
						data: [{
								imgUrl: "../../static/img/beautiful/4.jpg"
							},
							{
								imgUrl: "../../static/img/beautiful/5.jpg"
							},
							{
								imgUrl: "../../static/img/beautiful/6.jpg"
							},
						]
					},
					{
						bigUrl: "../../static/img/beautiful/1.jpg",
						data: [{
								imgUrl: "../../static/img/beautiful/7.jpg"
							},
							{
								imgUrl: "../../static/img/beautiful/8.jpg"
							},
							{
								imgUrl: "../../static/img/beautiful/9.jpg"
							},
						]
					}
				]
			},
			{
				type: "bannerList",
				imgUrl: "../../static/img/beautiful/1.jpg"
			},
			{
				type: "iconsList",
				data: [{
						imgUrl: "../../static/img/sports/sp1.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp2.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp3.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp4.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp5.png",
						name: "户外"
					},
				]
			},
			{
				type: "hotList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/beautiful/4.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/beautiful/5.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/beautiful/6.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			},
			{
				type: "shopList",
				data: {
					bigUrl: "../../static/img/beautiful/2.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/beautiful/7.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 2,
							imgUrl: "../../static/img/beautiful/8.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/beautiful/9.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/beautiful/10.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/beautiful/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/beautiful/12.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			},
			{
				type: "commodityList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/beautiful/13.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/beautiful/14.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/beautiful/15.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			}
		]
	})
})
// 美妆个护第一次触底数据
router.get("/api/index_list/5/data/2", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/beautiful/13.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/beautiful/14.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/beautiful/15.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})

// 家居数码
router.get("/api/index_list/6/data/1", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
				type: "swiperList",
				data: [{
						imgUrl: "/static/img/numerals/1.jpg"
					},
					{
						imgUrl: "/static/img/numerals/2.jpg"
					},
				]
			},
			{
				type: "recommendList",
				data: [{
						bigUrl: "../../static/img/numerals/2.jpg",
						data: [{
								imgUrl: "../../static/img/numerals/4.jpg"
							},
							{
								imgUrl: "../../static/img/numerals/5.jpg"
							},
							{
								imgUrl: "../../static/img/numerals/6.jpg"
							},
						]
					},
					{
						bigUrl: "../../static/img/numerals/1.jpg",
						data: [{
								imgUrl: "../../static/img/numerals/7.jpg"
							},
							{
								imgUrl: "../../static/img/numerals/8.jpg"
							},
							{
								imgUrl: "../../static/img/numerals/9.jpg"
							},
						]
					}
				]
			},
			{
				type: "bannerList",
				imgUrl: "../../static/img/numerals/1.jpg"
			},
			{
				type: "iconsList",
				data: [{
						imgUrl: "../../static/img/sports/sp1.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp2.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp3.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp4.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp5.png",
						name: "户外"
					},
				]
			},
			{
				type: "hotList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/numerals/4.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/numerals/5.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/numerals/6.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			},
			{
				type: "shopList",
				data: {
					bigUrl: "../../static/img/numerals/2.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/numerals/7.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/numerals/9.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/numerals/10.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/numerals/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/numerals/13.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			},
			{
				type: "commodityList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/numerals/13.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/numerals/14.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/numerals/15.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			}
		]
	})
})
// 家居数码第一次触底数据
router.get("/api/index_list/6/data/2", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/numerals/13.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/numerals/14.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/numerals/15.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})

// 食品母婴
router.get("/api/index_list/7/data/1", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
				type: "swiperList",
				data: [{
						imgUrl: "/static/img/food/1.jpg"
					},
					{
						imgUrl: "/static/img/food/2.jpg"
					},
				]
			},
			{
				type: "recommendList",
				data: [{
						bigUrl: "../../static/img/food/2.jpg",
						data: [{
								imgUrl: "../../static/img/food/4.jpg"
							},
							{
								imgUrl: "../../static/img/food/5.jpg"
							},
							{
								imgUrl: "../../static/img/food/6.jpg"
							},
						]
					},
					{
						bigUrl: "../../static/img/food/1.jpg",
						data: [{
								imgUrl: "../../static/img/food/7.jpg"
							},
							{
								imgUrl: "../../static/img/food/8.jpg"
							},
							{
								imgUrl: "../../static/img/food/9.jpg"
							},
						]
					}
				]
			},
			{
				type: "bannerList",
				imgUrl: "../../static/img/food/1.jpg"
			},
			{
				type: "iconsList",
				data: [{
						imgUrl: "../../static/img/sports/sp1.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp2.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp3.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp4.png",
						name: "户外"
					},
					{
						imgUrl: "../../static/img/sports/sp5.png",
						name: "户外"
					},
				]
			},
			{
				type: "hotList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/food/4.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/food/5.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/food/6.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			},
			{
				type: "shopList",
				data: {
					bigUrl: "../../static/img/food/2.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/food/7.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 2,
							imgUrl: "../../static/img/food/8.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/food/9.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/food/10.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/food/11.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
						{
							id: 3,
							imgUrl: "../../static/img/food/12.jpg",
							name: "户外空气清晰，心旷神怡",
							pprice: "299",
							oprice: "659",
							discount: "5.2"
						},
					]
				}
			},
			{
				type: "commodityList",
				data: [{
						id: 1,
						imgUrl: "../../static/img/food/13.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 2,
						imgUrl: "../../static/img/food/14.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
					{
						id: 3,
						imgUrl: "../../static/img/food/15.jpg",
						name: "户外空气清晰，心旷神怡",
						pprice: "299",
						oprice: "659",
						discount: "5.2"
					},
				]
			}
		]
	})
})
// 食品母婴第一次触底数据
router.get("/api/index_list/7/data/2", function(req, res, next) {
	res.send({
		code: "0",
		data: [{
			type: "commodityList",
			data: [{
					id: 1,
					imgUrl: "../../static/img/food/13.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 2,
					imgUrl: "../../static/img/food/14.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
				{
					id: 3,
					imgUrl: "../../static/img/food/15.jpg",
					name: "户外空气清晰，心旷神怡",
					pprice: "299",
					oprice: "659",
					discount: "5.2"
				},
			]
		}]
	})
})
module.exports = router;