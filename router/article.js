const express = require('express')
const router = express.Router()


const handler_article = require('../router_handler/article')

//校验中间件
const expressJoi = require('@escook/express-joi')

// 解析formdata 的文件数据
const multer = require('multer')
const path = require('path')

// 文件存放目录
const uploads = multer({ dest: path.join(__dirname, '../uploads') })

//分类校验规则
const { reg_art_cate, reg_cate_id, reg_upate_cate, reg_article } = require('../schema/article')

//获取文章分类列表
router.get('/cates', handler_article.getArticleCate)

// 添加分类
router.post('/addcates', expressJoi(reg_art_cate), handler_article.addArtCates)

// 删除分类
router.get('/deletecate/:id', expressJoi(reg_cate_id), handler_article.delArtCate)

// 根据id获取分类
router.get('/cates/:id', expressJoi(reg_cate_id), handler_article.getArtCateById)

// 更新文章分类
router.post('/updatecate', expressJoi(reg_upate_cate), handler_article.updateArtCate)

// 发布新文章
router.post('/add', uploads.single('cover_img'), expressJoi(reg_article), handler_article.addArticle)

module.exports = router