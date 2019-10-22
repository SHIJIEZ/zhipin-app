const express = require('express');
const router = express.Router();
const md5 = require("blueimp-md5");
const { UserModel } = require("../db/models.js");
const featchFilter = { password: 0, __v: 0 }; // 数据库查询字段过滤
const respDesc = require("../common/resp-desc");
const respBuild = respDesc.ResponseDataBuild;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册
router.post("/register", (req, res) => {
  const { username, password, type } = req.body;
  if (!username || !password || !type) {
    return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.PARAMS_ERR })
  }

  UserModel.findOne({ username }, (err, doc) => {
    if (err) {
      return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.DB_ERR })
    }
    if (doc) {
      return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.USER_ALERADY_EXIST })
    }
    new UserModel({ username, type, password: md5(password) }).save((err, doc) => {
      if (err || !doc) {
        return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.DB_ERR })
      }
      const responseData = { _id: doc._id, username, type };
      res.cookie("userid", doc._id, { maxAge: 1000 * 60 * 60 * 24 }) // 持久化cookie 一天
      res.send({ code: respDesc.SUCC_CODE, data: responseData })
    })
  })
})

// 登录
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.PARAMS_ERR })
  }

  UserModel.findOne({ username, password: md5(password) }, featchFilter, (err, doc) => {
    if (err) {
      return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.DB_ERR })
    }
    if (!doc) {
      return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.LOGIN_FAIL })
    }
    res.cookie("userid", doc._id, { maxAge: 1000 * 60 * 60 * 24 }) // 持久化cookie 一天
    res.send({ code: respDesc.SUCC_CODE, data: doc });
  })
})


// 完善用户信息
router.post("/improveuser", (req, res) => {
  // 获取cookie中的userid
  const userid = req.cookies.userid;
  if (!userid) {
    return res.send({
      code: respDesc.FAILED_CODE,
      msg: respDesc.NOT_AUTH 
    })
  }

  const newUserInfo = req.body; // 需要更新的信息
  UserModel.findByIdAndUpdate({ _id: userid }, newUserInfo, (err, oldUserInfo) => {
    if (err) {
      // return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.DB_ERR });
      return res.send(respBuild(respDesc.FAILED_CODE, respDesc.DB_ERR));
    }
    if (!oldUserInfo) { // 错误的userid
      res.clearCookie(userid); //  通知浏览器删除对应cookie
      return res.send({ code: respDesc.FAILED_CODE, msg: respDesc.NOT_AUTH });
    }
    // 成功
    const { _id, username, type } = oldUserInfo; // 取出旧数据中指定的值
    const data = Object.assign(newUserInfo, { _id, username, type }); // 构造出新的数据结构
    res.send(respBuild(respDesc.SUCC_CODE, data));
  })
})


module.exports = router;
