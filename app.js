var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
flash = require('connect-flash')
var app = express();
var indexRouter = require('./routes/index');
var beersRouter = require('./routes/beers');
var usersRouter = require('./routes/users');
var session = require('express-session');
const {unless} = require("./middleware/auth");
const {check} = require("./middleware/auth");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'sw admin',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000}
}));
app.use(flash());

app.use(unless(['/login','/signUp'],check))
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/beers', beersRouter);



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

console.log("app running at http://localhost:3000");

module.exports = app;


