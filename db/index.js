// 配置数据库
const mysql = require('mysql')
const db = mysql.createPool({
        user: 'root',
        password: '123456',
        host: '127.0.0.1',
        database: 'my_db_01'
    })
    //测试数据库是否可用
db.query('select 1', (err, results) => {
    if (err) return console.log(err.message)
    console.log(results)
})

module.exports = db