const db = require('../db/index')


//导入加密库bcryptjs  加密使用
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//导入配置文件 其中要加密随机盐
const config = require('../config')

exports.regUser = (req, res) => {

    // 获取查询字符串
    // console.log(req.query)
    // 获取请求体数据
    console.log('reguser', req.body)
    const userInfo = req.body
    if (!userInfo.username || !userInfo.password) {
        // return res.send({
        //     status: 1,
        //     message: '注册失败'
        // })
        // 使用封装的cc 函数
        return res.cc('注册失败')
    }
    db.query('select * from ev_users where username=?', req.body.username, (err, results) => {
        if (err) return res.send({ status: 1, message: err.message })
        if (results.length) {
            // return res.send({
            //     status: 1,
            //     message: '注册失败，用户名已存在！'
            // })
            return res.cc('注册失败，用户名已存在！')
        }
    })

    //加密密码 返回值是加密之后的密码字符串 10为随机盐长度
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    const sqlStr = 'insert into ev_users set ?'
    db.query(sqlStr, req.body, (err, results) => {
            if (err) {
                console.log(err.message)
                return res.cc(err)
            } else if (results.affectedRows === 1) {
                return res.cc('注册成功！', 0)
            } else {
                return res.cc('注册失败')
            }
        })
        // db.query(sqlStr, req.body.username, (err, results) => {
        //     if (err) {
        //         console.log(err.message)
        //         return res.send(err.message)
        //     }
        //     console.log(results)
        //     if (results[0].total ===0) {
        //         db.query("insert into ev_users set ?",req.body,(err,results)=>{
        //             if()
        //         })
        //         res.send({
        //             status: 0,
        //             msg: '注册成功'

    //         })
    //     } else {

    //     }

    // })

}
exports.login = (req, res) => {
    const userInfo = req.body
    const sqlStr = 'SELECT * FROM ev_users WHERE username=?'
    db.query(sqlStr, [userInfo.username], (err, results) => {
        if (err) {
            console.log(err.message)
            return res.cc(err)
        }
        if (results.length !== 1) {
            return res.cc('登录失败,用户名或密码错误！')
        }
        //使用 bcrypt.compareSync()比较 密码
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        if (!compareResult) return res.cc('密码错误！')

        //使用jsonwebtoken 生成token 
        //生成token时要剔除敏感信息
        //algorithm
        // 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：{ algorithm: 'RS256' },
        //  加密算法默认为 HS256 因为express-jwt 必须配置加密算法 
        const user = {...results[0], password: '', user_pic: '' }
        const token = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h' // token 有效期为 10 个小时 
        })
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + token
        })

    })

}