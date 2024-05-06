var mysql = require("mysql");
var connection = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "123456789",
	database: "aolai_test",
	multipleStatements: true, // 允许执行多条语句
})

module.exports = connection;