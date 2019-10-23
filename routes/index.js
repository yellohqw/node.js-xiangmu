var express = require('express');
var router = express.Router();
var articleModel = require('../db/articlesModel')
var moment = require('moment')
/* 首页路由 */
router.get('/', function(req, res, next) {
  console.log(req.query)

  //数据类型要求int
  let page =parseInt(req.query.page || 1)
  let size =parseInt(req.query.size || 2)
  let username = req.session.username;

  console.log(page,size)
  //查询文章总数
  articleModel.find().count().then((total)=>{
    var pages = Math.ceil(total / size)


    //分页查询
    articleModel.find().sort({"createTime":-1}).limit(size).skip((page-1)*size).then((docs)=>{
      //对数据时间进行处理
      // docs.map((ele,idx)=> {
        var arr = docs.slice()
        for(let i=0;i<arr.length;i++){
          //原有的字段不能修改，新建createTimeZH字段；
        arr[i].createTimeZH = moment(arr[i].createTime).format("YYYY-MM-DD HH:mm:ss")
      }
      res.render('index', {data:{ list:arr ,total:pages,username:username }});
    }).catch((err)=>{
      res.redirect('/')
    })
  }).catch((err)=>{
    res.redirect('/')
  })

  
  
});


// 注册页路由
router.get('/regist', function(req, res, next) {
  res.render('regist', {});
});

// 登录页路由
router.get('/login', function(req, res, next) {
  res.render('login', {});
});

// 写文章路由
router.get('/write', function(req, res, next) {
  var id = req.query.id
  // let username = req.session.username
  if(id){
    //判断是否存在该id；；；进行编辑功能
     id = new Object(id)
     //用id查询
     articleModel.findById(id).then((doc)=>{
      // res.send(doc)
      // doc.createTimeZH = moment(doc.createTime).format("YYYY-MM-DD HH:mm:ss")
      res.render('write',{doc:doc})
    }).catch(err=>{
      // console.log("文章详情查询失败")
      // res.send(err)
      res.redirect('/')
    })
  }else{
    var doc = {
      _id:'',
      username:req.session.username,
      title:'',
      content:''
      
    }
    //新增页面
    res.render('write', {doc:doc});
  }
});

// 详情页路由
router.get('/detail', function(req, res, next) {
  // var time = parseInt(req.query.time)
  var id = new Object(req.query.id)
  console.log(id)
  console.log(req.query)
  
  //查询文章
  articleModel.findById(id).then((doc)=>{
    // res.send(doc)
    doc.createTimeZH = moment(doc.createTime).format("YYYY-MM-DD HH:mm:ss")
    res.render('detail',{doc:doc})
  }).catch(err=>{
    // console.log("文章详情查询失败")
    res.send(err)
  })

  // res.render('detail', {});
});
module.exports = router;
 