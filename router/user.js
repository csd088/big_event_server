const express = require('express')

const router = express.Router()



const userHandler = require('../router_handler/user')

//1、导入表单验证中间件
const expressJoi = require('@escook/express-joi')
    // 2、导入表单验证规则对象  {}结构赋值
const { reg_login_schema } = require('../schema/user')


router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

router.post('/login', expressJoi(reg_login_schema), userHandler.login)
module.exports = router