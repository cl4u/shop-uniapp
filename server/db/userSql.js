let user = {
	// 查询用户名或手机号
	queryUserName(param) {
		return "select * from user where userName = '" + param.userName + "' or phone ='" + param.userName +
		"'";
		// if (param.userName) {
		// 	return "select * from user where userName = '" + param.userName + "' or phone ='" + param.userName +
		// 	"'";
		// } else {
		// 	// 第三方登录
		// 	return "select * from user where provider = '" + param.provider + "' or openid ='" + param.openid + "'";
		// }
	},
	// 查询用户名和密码
	queryUserPwd(param) {
		return "select * from user where (userName = '" + param.userName + "' or phone ='" + param.userName +
			"') and userPwd ='" + param.userPwd + "'";
	},
	// 增加一条用户数据
	insertData(param) {
		let userName = param.userName || param.openid.slice(0, 11);
		const jwt = require('jsonwebtoken'); // 生成token秘钥
		let payload = {
			name: userName
		}; //用户名
		let secret = '123456'; //自定义口令
		let token = jwt.sign(payload, secret);
		let nickName = param.nickName || "默认昵称";
		let avatarUrl = param.avatarUrl || "../../static/logo.png";
		return "insert into user (userName,userPwd,phone,imgUrl,nickName,token,provider,openid) values ('','123456','" +
			param.userName + "','" + avatarUrl + "','" + nickName + "','" + token + "','" + param.provider + "','" +
			param.openid + "')";
	}
}

exports = module.exports = user;