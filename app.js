var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cfg = require('./common/config')
const db = require('./common/database')
const passport = require('passport');
const session = require('express-session');
const flash = require('flash')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
db.connect();
require('./common/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "f5021625-037b-47a7-b8f3-ffe721bb3a0b",
    resave: true,
    saveUninitialized: true,
    maxAge: 100000
  })
);

app.use(flash())
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);

// async function test(){
//   let row = await db.query(
//     `SELECT * FROM user where user.username="admin"`
//   )
//   console.log(row)
// }

// db.query(`SELECT * FROM user where user.username="admin"`).then((row)=>{
//   console.log(row)
// })


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
