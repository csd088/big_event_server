const db = require('../db/index')

const bcrypt = require('bcryptjs')
const { result } = require('@hapi/joi/lib/base')
    // 获取用户基本信息 
exports.getUserInfo = (req, res) => {
        const sql = 'select username,nickname,user_pic,email from ev_users where id=?'
        console.log(req.user.id)
            // req.user 是express-jwt 中间件解析token给我们加的对象 可以拿到token里面的信息
        db.query(sql, req.user.id, (err, results) => {

            if (err) return res.cc(err)
            console.log(results)
            if (results.length !== 1) return res.cc('获取用户信息失败')
            res.send({ status: 0, message: "获取用户基本信息成功！", data: results[0] })
        })

    }
    // 更新用户信息
exports.updateUserInfo = (req, res) => {
    const userInfo = req.body
        // const { nickname, email } = {...req.body }
        // console.log(nickname, email)
        // update ev_users set ? where id=?
        // console.log(userInfo)
    const sql = 'UPDATE ev_users SET ? WHERE id=?'
    db.query(sql, [userInfo, userInfo.id], (err, results) => {
        if (err) {
            return res.cc(err)
        }
        if (results.affectedRows !== 1) return res.cc('更新失败！')
        res.cc('更新成功！', 0)
    })
}

//重置密码

exports.updatepwd = (req, res) => {
    // console.log('updatepwd', req.body)
    const sql = 'SELECT * FROM ev_users WHERE id=?'
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.send(err)
        if (results.length !== 1) return res.cc('更新失败,用户不存在!')
        const cpmOld = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!cpmOld) return res.cc('更新密码失败！，旧密码错误！')
        const pwd = bcrypt.hashSync(req.body.newPwd, 10)
            // console.log('new pwd', pwd)
        db.query('update ev_users set password=? where id=?', [pwd, req.user.id], (err, results) => {
            if (err) return res.cc('更新密码失败！')
                // console.log(results)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('更新成功', 0)
        })
    })
}

// 更新头像处理方法
exports.updateAvatar = (req, res) => {

    const sql = 'UPDATE ev_users SET user_pic=? WHERE id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败')
        res.cc('更新头像成功', 0)
    })

}