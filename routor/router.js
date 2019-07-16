const express = require('express')
const MongoDBs = require('./mongoDB')
const router = express.Router()
const fs = require("fs")
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// 请求首页
router.get('/', (req, res) => {
  if (req.query.page && req.query.limit) {
    MongoDBs.PaginationFinds(parseInt(req.query.page), parseInt(req.query.limit), (data) => {
      MongoDBs.QuantityFinds((error, count) => {
        if (error) {
          console.log('请求所有商品' + error)
        } else {
          let x = count / 9
          let y = parseInt(x)
          let num = 0
          let sum = x > y ? num = y + 1 : num = y
          res.render('index.html', {
            title: '售卖商品',
            Commodity: data,
            sum: sum,
            page: req.query.page
          })
        }
      })
    })
  } else {
    MongoDBs.PaginationFinds(0, 9, (data) => {
      MongoDBs.QuantityFinds((error, count) => {
        if (error) {
          console.log('请求所有商品2' + error)
        } else {
          let x = count / 9
          let y = parseInt(x)
          let num = 0
          let sum = x > y ? num = y + 1 : num = y
          res.render('index.html', {
            title: '售卖商品',
            Commodity: data,
            sum: sum,
            page: 0
          })
        }
      })
    })
  }
})

// 请求购买页
router.get('/buy', (req, res) => {
  if (req.query.id) {
    MongoDBs.FindById(req.query.id, (data) => {
      let title = '购买 - ' + data.Name
      res.render('buy.html', {
        title: title,
        data: data,
      })
    })
  } else {
    error(res, '请求错误!')
  }
})
// 提交购买数量
router.post('/buy', urlencodedParser, (req, res) => {
  if (req.body.surplus) {
    MongoDBs.FindById(req.body.id, (data) => {
      if (parseInt(data.Stock) >= parseInt(req.body.surplus)) {
        // 购买数量
        let surplu = parseInt(req.body.surplus)
        // 创建日期
        let dates = new Date()
        let date = dates.getMonth() + 1 + '月' + dates.getDate() + '日'
        // 商品价格
        let Price = data.Price
        // 商品库存
        let Stocks = data.Stock
        // 销售量
        let SalesVolume = data.SalesVolume
        MongoDBs.FindOneDate({ date: date }, (data) => {
          if (data) {
            let datas = {
              income: data.income + (Price * surplu),
              sell: data.sell + surplu
            }
            MongoDBs.FindDateUpdte({ date: date }, datas, (data) => {
              if (Stocks - req.body.surplus <= 0) {
                error(res, '你购买的数量太多了，请减少数量后重试。')
              } else {
                MongoDBs.UpdateOneById({ ID: req.body.id }, { Stock: Stocks - req.body.surplus, SalesVolume: parseInt(SalesVolume) + parseInt(req.body.surplus) }, (data) => {
                  res.send(data)
                })
              }
            })
          } else {
            // 没有数据需要创建数据
            let datas = {
              date: date,
              income: Price * surplu,
              sell: surplu
            }
            MongoDBs.AddToDataAnalysis(datas, (data) => {
              let datas = data
              MongoDBs.UpdateOneById({ ID: req.body.id }, { Stock: Stocks - req.body.surplus, SalesVolume: req.body.surplus }, (data) => {
                datas ? res.send({ status: 0 }) : res.send({ status: 1 })
              })
            })
          }
        })
      } else {
        error(res, '你购买的数量太多了，请减少数量后重试。')
      }
    })
  } else {
    error(res, '请求错误!')
  }
})
// 请求后台
router.get('/admin', (req, res) => {
  MongoDBs.FindDate((data) => {
    res.render('admin.html', {
      title: '商品管理系统 - 后台',
      data: data,
    })
  })

})
// 请求所有商品
router.get('/admin/AllGoods', (req, res) => {
  if (req.query.page && req.query.limit) {
    MongoDBs.PaginationFinds(parseInt(req.query.page), parseInt(req.query.limit), (data) => {
      MongoDBs.QuantityFinds((error, count) => {
        if (error) {
          console.log('请求所有商品' + error)
        } else {
          let x = count / 10
          let y = parseInt(x)
          let num = 0
          let sum = x > y ? num = y + 1 : num = y
          res.render('AllGoods.html', {
            title: '商品管理系统 - 所有商品',
            data: data,
            sum: sum,
            page: req.query.page
          })
        }
      })
    })
  } else {
    MongoDBs.PaginationFinds(0, 10, (data) => {
      MongoDBs.QuantityFinds((error, count) => {
        if (error) {
          console.log('请求所有商品2' + error)
        } else {
          let x = count / 10
          let y = parseInt(x)
          let num = 0
          let sum = x > y ? num = y + 1 : num = y
          res.render('AllGoods.html', {
            title: '商品管理系统 - 所有商品',
            data: data,
            sum: sum,
            page: 0
          })
        }
      })
    })
  }
})
// 请求子数据
router.get('/child', (req, res) => {
  if (req.query.id) {
    MongoDBs.FindById(parseInt(req.query.id), (data) => {
      if (data) {
        let json = {
          id: data.ID,
          title: data.Name
        }
        if (data.Image) {
          json.image = data.Image
          res.send(json)
        } else {
          json.image = '/public/image/null.png'
          res.send(json)
        }
      } else {
        res.send()
      }
    })
  } else {
    error(res, '请求错误!')
  }
})
// 请求编辑页
router.get('/admin/edit', (req, res) => {
  if (req.query.id) {
    MongoDBs.FindById(parseInt(req.query.id), (data) => {
      let title = '编辑 - ' + data.Name
      res.render('edit.html', {
        title: title,
        data: data
      })
    })
  } else {
    error(res, '请求错误!')
  }
})
// 提交编辑后的数据
router.post('/admin/edit', urlencodedParser, (req, res) => {
  let Childs = []
  if (req.body.Child) {
    let Child = req.body.Child.split(',')
    Child.forEach(element => {
      Childs.push(parseInt(element))
    })
  }

  if (req.body.Image) {
    req.body.Image = req.body.Image.split(',')
  } else {
    req.body.Image = null
  }
  let datas = {
    Name: req.body.Name,
    Introduce: req.body.Introduce,
    Price: req.body.Price,
    Stock: req.body.Stock,
    Child: Childs,
    Image: req.body.Image
  }
  let id = {
    ID: req.body.ID
  }
  MongoDBs.UpdateOneById(id, datas, (data) => {
    res.send({
      ok: 1
    })
  })
})
// 删除商品数据
router.get('/admin/delete', (req, res) => {
  if (req.query.id) {
    MongoDBs.FindOneByIdDelete({ 'ID': req.query.id }, (data) => {
      res.render('delete.html')
    })
  } else {
    error(res, '请求错误!')
  }
})
// 请求添加数据
router.get('/admin/AddTo', (req, res) => {
  res.render('AddTO.html', { title: '添加数据 - 商品管理系统' })
})
// 添加数据
router.post('/admin/AddTo', urlencodedParser, (req, res) => {
  if (req.body.Name) {
    fs.readFile('./data.txt', (err, data) => {
      if (err) {
        console.log('添加数据' + err)
      } else {
        if (req.body.Child) {
          let childs = []
          req.body.Child.split(',').forEach((i) => {
            childs.push(i)
          })
          req.body.Child = childs
        } else {
          req.body.Child = null
        }
        let id = parseInt(data.toString()) + 1
        let datas = {
          ID: id,
          Name: req.body.Name,
          Introduce: req.body.Introduction,
          Price: parseFloat(req.body.Price),
          SalesVolume: 0,
          Stock: parseInt(req.body.Stock),
          Image: null,
          Child: req.body.Child
        }
        MongoDBs.AddToCommoditys(datas, (data, Data) => {
          res.send(req.body)
        })
      }
    })
  } else {
    error(res, '请求错误！')
  }

})
// 文件上传
router.post('/image_upload', (req, res) => {
  var des_file = "./public/upload_image/" + req.files[0].filename + '.' + req.files[0].mimetype.split('/')[1]
  fs.readFile(req.files[0].path, (err, data) => {
    fs.writeFile(des_file, data, (err) => {
      if (err) {
        console.log('文件上传' + err)
      } else {
        res.send("/public/upload_image/" + req.files[0].filename + '.' + req.files[0].mimetype.split('/')[1])
      }
    })
  })
})

function error(res, title) {
  res.render('error.html', {
    title: title
  })
}

module.exports = router