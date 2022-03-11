const joi = require('joi')

const artCate = joi.string().required()
const artCateAlias = joi.string().alphanum().required()

const id = joi.number().integer().min(1).required()

const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
    //allow 允许为空字符串
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()


// 分类校验规则
exports.reg_art_cate = {
    // 校验body数据
    body: {
        name: artCate,
        alias: artCateAlias
    }
}

exports.reg_cate_id = {
    // 校验params数据
    params: {
        id,
    }
}

exports.reg_upate_cate = {
    body: {
        Id: id,
        name: artCate,
        alias: artCateAlias
    }
}

exports.reg_article = {
    body: {
        title,
        cate_id,
        state,
        content
    }
}