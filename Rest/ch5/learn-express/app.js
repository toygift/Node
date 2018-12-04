var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req,res,next) {
  console.log(req.url,'저도 미들웨어입니다');
  next();
});
//개발시에 short,dev 배포시 common,combined사용함
app.use(logger('dev'));
// 요청에 동봉된 쿠키를 해석
// 해석된 쿠키들은 req.cookies객체에 들어감
// name=abc 쿠키를 보냈다면 req.cookies는 { name: 'abc' }
// app.use(cookieParser('secret code')); 
// 위처럼 첫번째 인자로 문자열제공시 제공한 문자열로 서명된 쿠키가 됨
app.use(cookieParser('secret code'));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret code',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
// static 미들웨어는 요청에 부합하는 정적 파일을 발견한 경우 응답으로 해당파일을 전송
// 이경우 응답을 보냈으므로 다음에 나오는 라우터가 실행되지 않고, 파일을 찾지 못했다면 요청을 라우터로 넘김
// 최대한 위쪽에 배치 -> 서버가 쓸데없이 미들웨어작업을 하는 것을 방지
app.use(express.static(path.join(__dirname, 'public')));
// body-parser 내장됨
// Raw,Text를 적용할때는 body-parser설치
// app.use(bodyParser.raw());
// app.use(bodyParser.text());
app.use(express.json());
// extended false이면 노드의 querystring모듈을 사용하여 쿼리스트링 해석
// true이면 qs모듈을 사용하여 쿼리스트링을 해석(qs모듈은 npm패키지)
app.use(express.urlencoded({ extended: false }));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
