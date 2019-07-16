// 系统模块
const path = require('path')
// 第三方模块
const express = require('express')
const artTemplate = require('art-template')
const bodyParser = require('body-parser')
const multer = require('multer')
// 自定义模块
const router = require('./routor/router')

const app = express()
app.use('/public', express.static(path.join(__dirname + '/public')))
app.use('/view', express.static(path.join(__dirname + '/view')))
app.use(bodyParser.urlencoded({ extended: false }))
var temporarypath = __dirname + '/public/TemporaryImage/'
app.use(multer({ dest: temporarypath }).array('image'))
app.engine('html', require('express-art-template'))
// 路由
app.use(router)

// 404 错误处理
app.use(function (req, res) {
  res.render('error.html', {
    title: '您访问的页面不存在'
  })
})



const server = app.listen(80, function () {
  const port = server.address().port
  console.log("访问地址为 http://localhost:%s", port)
})