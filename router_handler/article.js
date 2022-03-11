// 文章相关 处理接口函数




const db = require('../db/index')

const path = require('path')


//获取文章分类列表
exports.getArticleCate = (req, res) => {
    const sql = 'SELECT * FROM ev_article_cate'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            statue: 0,
            message: '成功',
            data: results
        })
    })

}

//添加文章分类
exports.addArtCates = (req, res) => {
    const sql = 'SELECT * FROM ev_article_cate WHERE NAME=? OR alias=? '
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) res.cc(err)
        if (results.length) {
            if (results.length === 2) return res.cc('添加分类失败，分类与别名都被占用！')
            if (results[0].name === req.body.name && results[0].alias == req.body.alias) return res.cc('添加分类失败，分类与别名都被占用！')
            if (results[0].name == req.body.names) return res.cc('添加分类失败，分类名被占用！')
            if (results[0].alias == req.body.alias) return res.cc('添加分类失败，分类别名被占用！')
        }
        const sql1 = 'INSERT INTO ev_article_cate  set ?'
        db.query(sql1, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('插入失败')
            return res.cc('添加文章分类成功', 0)
        })
    })
}

// 删除分类
exports.delArtCate = (req, res) => {
    console.log(req.params)
    const sql = 'SELECT * FROM ev_article_cate WHERE Id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('分类不存在，删除删除！')
        if (results[0].is_delete === 1) return res.cc('分类不存在，删除删除！')
        results[0].is_delete = 1
        const sql1 = 'UPDATE ev_article_cate set ? where Id=?'
        db.query(sql1, [results[0], req.params.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
            res.cc('删除文章分类成功', 0)
        })
    })
}

//根据id获取文章分类
exports.getArtCateById = (req, res) => {
    console.log(req.params)
    const sql = 'SELECT * FROM ev_article_cate where Id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 0) return res.cc('分类不存在，获取文章分类失败！')
        if (results.length === 1) {
            if (results[0].is_delete === 1) return res.cc('获取文章分类失败！')
            return res.send({ status: 0, message: '获取分类成功!', data: results[0] })
        }
        res.cc('获取文章分类失败！')


    })
}

// 更新分类
exports.updateArtCate = (req, res) => {
    const sql1 = 'SELECT * FROM ev_article_cate where Id=?'
    db.query(sql1, req.body.Id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
            return res.cc('更新失败！')
        }
        if (results[0].is_delete === 1) return res.cc('更新失败！')

        db.query('select * from ev_article_cate where Id!=? and (name=? or alias=?)', [req.body.Id, req.body.name, req.body.alias], (err, results) => {
            if (err) return res.cc(err)
            if (results.length) return res.cc('更新失败，名称或者别名已被占用！')
                // res.send('ok')
            const sql = 'UPDATE ev_article_cate SET ? WHERE Id=? AND is_delete !=1'
            db.query(sql, [req.body, req.body.Id], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('更新失败！')
                res.cc('更新文章目录成功', 0)
            })
        })


    })
}



// 发布新文章
exports.addArticle = (req, res) => {
    console.log(req.body)
    console.log(req.file)

    //手动校验file文件数据  因为文件数据没法使用expressJoi 校验
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面参数是必填项！')
    const artInfo = {
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename),
        pub_date: new Date(),
        author_id: req.user.id
    }

    const sql = 'insert into ev_articles set ?'
    db.query(sql, artInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')
        res.cc('发布文章成功！', 1)
    })


}