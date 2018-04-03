var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
/**
* Session and OKTA support
*/
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const FLEX_OKTA_DOMAIN = "https://flex.okta.com";

/**
* Fill out the following options:
*/
const SESSION_SECRET = "SOMETHING_SECRET_AND_RANDOM";
const MY_FLEX_OKTA_CLIENT_ID = "YOUR_FLEX_OKTA_CLIENT_ID";
const MY_FLEX_OKTA_CLIENT_SECRET = "YOUR_FLEX_OKTA_CLIENT_SECRET";
const MY_REDIRECT_URI = "YOUR_REDIRECT_URI"; // eg. http://localhost:3000/login/callback

app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  issuer: FLEX_OKTA_DOMAIN,
  client_id: MY_FLEX_OKTA_CLIENT_ID,
  client_secret: MY_FLEX_OKTA_CLIENT_SECRET,
  redirect_uri: MY_REDIRECT_URI,
  scope: 'openid profile'
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
