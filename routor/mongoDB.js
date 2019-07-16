const mongoose = require('mongoose')
const fs = require("fs")
mongoose.connect('mongodb://localhost/Commodity', {
  useNewUrlParser: true
})
mongoose.Promise = global.Promise
const Schema = mongoose.Schema


const DataAnalysisSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  sell: {
    type: Number,
    required: true
  }
})

const DataAnalysis = mongoose.model('DataAnalysis', DataAnalysisSchema)

// 增加
/**
 * 创建统计
 * @param data 数据
 * @param callback 回调数据
 */
exports.AddToDataAnalysis = function (data, callback) {
  const AddToDataAnalysis = new DataAnalysis(data)
  AddToDataAnalysis.save()
    .then(function (data) { callback(data) })
}
// 查询
/**
 * 查询单个数据
 * @param date 时间
 * @param callback 回调数据
 */
exports.FindOneDate = function (date, callback) {
  DataAnalysis.findOne(date)
    .then((data) => { callback(data) })
}
/**
 * 查询所有统计数据
 * @param callback 回调数据
 */
exports.FindDate = function (callback) {
  DataAnalysis.find()
    .skip(0)
    .limit(31)
    .then((data) => { callback(data) })
}
// 修改
/**
 * 修改数据
 * @param date 时间
 * @param data 数据
 * @param callback 回调数据
 */
exports.FindDateUpdte = function (date, data, callback) {
  DataAnalysis.updateOne(date, data)
    .then((data) => { callback(data) })

}


const CommoditySchema = new Schema({
  ID: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Introduce: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  SalesVolume: {
    type: Number,
    required: true
  },
  Stock: {
    type: Number,
    required: true
  },
  Image: {
    type: Array
  },
  Child: {
    type: Array
  }
})

const Commodity = mongoose.model('Commodity', CommoditySchema)
// 增加
/**
 * 根据data.txt文件中的数据创建ID
 * @param id 商品ID
 * @param callback 回调数据
 */
exports.AddToCommoditys = function (id, callback) {
  const AddToCommodity = new Commodity(id)
  AddToCommodity.save()
    .then(function (data) {
      fs.writeFile('./data.txt', AddToCommodity.ID, (Data) => { callback(data, Data) })
    })
}

// 删除
/**
 * 按照传入的ID查找数据然后删除数据
 * @param id 需要删除商品ID
 * @param callback 回调数据
 */
exports.FindOneByIdDelete = function (id, callback) {
  Commodity.findOneAndDelete(id)
    .then((data) => { callback(0) })
}
// 修改
/**
 * 按照传入的ID查找数据后修改
 * @param id 需要修改的商品ID
 * @param datas 需要修改的数据
 * @param callback 回调数据
 */
exports.UpdateOneById = function (id, datas, callback) {
  Commodity.updateOne(id, datas)
    .then((data) => { callback(data) })
}
// 查询

/**
 * 查询全部数据
 * @param callback 回调数据
 */
exports.AllFinds = function (callback) {
  Commodity.find()
    .then((data) => { callback(data) })
}
/**
 * 按照page和limits返回商品数据
 * @param page 页数
 * @param limits 条数
 * @param callback 回调数据
 */
exports.PaginationFinds = function (page, limits, callback) {
  Commodity.find()
    .skip(page)
    .limit(limits)
    .then((data) => { callback(data) })
}
/**
 * 按照ID返回数据
 * @param ID 商品ID
 * @param callback 回调数据
 */
exports.FindById = function (ID, callback) {
  Commodity.findOne({ 'ID': ID }, (error, data) => {
    if (error) {
      console.log('按照ID返回：' + error)
    } else {
      callback(data)
    }
  })
}


/**
 * 返回总条数
 * @param callback
 */
exports.QuantityFinds = function (callback) {
  Commodity.find()
    .countDocuments((error, count) => { callback(error, count) })
}


/**
 * 删除全部
 */
// 删除统计数据
// DataAnalysis.remove({date:'7月16日'})
// .then((data)=>{console.log(date)})
// 删除商品数据
// Commodity.remove({ Price: 1.49 })
//   .then((data) => {
//     console.log(data)
//   })