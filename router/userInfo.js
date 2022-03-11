const express = require('express')
const router = express.Router()

// 校验中间件
const expressJoi = require('@escook/express-joi')
    //校验规则 使用结构语法 字段名称要和 ../schema/userInfo 文件内导出的一样 不然无法识别
const { reg_userInfo_schema, reg_updatepwd, reg_updateAvatar } = require('../schema/user')
    //导入路由处理函数文件
const userInfo_hander = require('../router_handler/userInfo')
router.get('/userinfo', userInfo_hander.getUserInfo)

// console.log("reg_userInfo_schema", reg_userInfo_schema)
router.post('/userinfo', expressJoi(reg_userInfo_schema), userInfo_hander.updateUserInfo)

// 更新密码
router.post('/updatepwd', expressJoi(reg_updatepwd), userInfo_hander.updatepwd)

//更新头像
router.post('/update/avatar', expressJoi(reg_updateAvatar), userInfo_hander.updateAvatar)

module.exports = router