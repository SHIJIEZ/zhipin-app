const express = require('express');
const router = express.Router();
const md5 = require("blueimp-md5");
const { UserModel, ChatModel } = require("../db/models.js");
const featchFilter = { password: 0, __v: 0 }; // 数据库查询字段过滤
const respDesc = require("../common/resp-desc");
const respBuild = respDesc.ResponseDataBuild;
const APIS_COLLEC = require("../common/api-def");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册
router.post(APIS_COLLEC.register.url, (req, res) => {
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
router.post(APIS_COLLEC.login.url, (req, res) => {
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
router.post(APIS_COLLEC.improve.url, (req, res) => {
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

// 获取用户信息
router.get(APIS_COLLEC.getuser.url, (req, res) => {
  const userid = req.cookies.userid;
  if (!userid) {
    return res.send(respBuild(respDesc.FAILED_CODE, respDesc.NOT_AUTH))
  }
  UserModel.findOne({ _id: userid }, featchFilter, (err, userInfo) => {
    if (err) {
      return res.send(respBuild(respDesc.FAILED_CODE, respDesc.DB_ERR));
    }

    if (!userInfo) { // 错误的userid
      res.clearCookie(userid); //  通知浏览器删除对应cookie
      return res.send(respBuild(respDesc.FAILED_CODE, respDesc.NOT_AUTH));
    }
    return res.send(respBuild(respDesc.SUCC_CODE, userInfo));
  })

})

// 用户列表展示
router.get(APIS_COLLEC.userlist.url, (req, res) => {
  const { type } = req.query;
  if (type !== "jobseeker" && type !== "recruiter") {
    return res.send(respBuild(respDesc.FAILED_CODE, respDesc.PARAMS_ERR))
  }
  UserModel.find({ type }, featchFilter, (err, userList) => {
    if (err) {
      return res.send(respBuild(respDesc.FAILED_CODE, respDesc.DB_ERR));
    }
    console.log(userList)
    return res.send(respBuild(respDesc.SUCC_CODE, userList));
  })
})


router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid;
  // 查询得到所有user文档数组
  UserModel.find((err, userDocs) => {
    if (err) {
      return res.send(respBuild(respDesc.FAILED_CODE, respDesc.DB_ERR));
    }
    console.log(userDocs)

    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
    const users = userDocs.reduce((users, user) => {
      users[user._id] = { username: user.username, header: user.header }
      return users
    }, {})
    /*
    查询userid相关的所有聊天信息
     参数1: 查询条件
     参数2: 过滤条件
     参数3: 回调函数
    */
    ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, featchFilter, (err, chatMsgs) => {
      if (err) {
        return res.send(respBuild(respDesc.FAILED_CODE, respDesc.DB_ERR));
      }
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({ code: 0, data: { users, chatMsgs } })
    })
  })
})



module.exports = router;
