var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const APIS_COLLEC = require("./common/api-def");
const urlib = require("url");
const respDesc = require("./common/resp-desc");
const respBuild = respDesc.ResponseDataBuild;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 应用接口中间件 指定接口必须携带认证状态 否则无法访问
app.use((req, res, next) => {
  const visitUri = urlib.parse(req.url, true).pathname;
  if (Object.keys(APIS_COLLEC).find(every => {
    // 访问地址是否有控制权
    return APIS_COLLEC[every].url === visitUri && APIS_COLLEC[every].control
  })) {
    const userid = req.cookies.userid;
    if (!userid) {
      // 未携带状态 拦截返回
      return res.send(respBuild(respDesc.FAILED_CODE, respDesc.NOT_AUTH))
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
