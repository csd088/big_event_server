const express = require('express')
const app = express()

//配置跨域
const cors = require('cors')
app.use(cors())

//托管静态文件 使用express.static
app.use(express.static('./uploads'))



// 表单验证插件
// @hapi/joi 已被弃用 要用joi 
const joi = require('joi')

//配置解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//导入配置信息
const config = require('./config')
    //导入token中间件 express-jwt
const expressJWT = require('express-jwt')


// const db = require('./db')

// 封装业务错误统一处理中间件函数
app.use(function(req, res, next) {
    res.cc = function(err, status = 1) {
            // 判断err 是否是错误对象
            const message = err instanceof Error ? err.message : err
            res.send({ status: status, message: message })
        }
        //一定不要忘记调用 next()， 不然事件无法往下转发
    next()
})

//配置解析token中间件 algorithms 配置解密算法  需要与生成token加密算法一致
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))
    // 导入并使用user路由
const userRouter = require('./router/user')
app.use('/api', userRouter)

const userInfoRouter = require('./router/userInfo')
app.use('/my', userInfoRouter)

const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

//监听错误级别中间件
app.use((err, req, res, next) => {
    // 表单验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
        //token验证失败
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
        // 未知错误
    res.cc(err)
})


app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})