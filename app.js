var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./models');
const cors = require('cors');
const webUrl = require('./config/webUrl');
const timeout = require('connect-timeout');
const ErrorResponse = require('./utils/ErrorResponse');


//call routes
var indexRoute = require('./routes/indexRoute');

var app = express();

app.set('view engine', 'ejs');


//set cors
var corsOptions = {
  origin: function (origin, callback) {
    if (webUrl.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



//set time out
app.use(timeout(process.env.TIMEOUT));
app.use((req, _, next) => {
  if (!req.timedout) next();
});
app.use(function (req, res, next) {
  setTimeout(next, 200);
});

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);
// app.use(error);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return next(new ErrorResponse('page not found', 401));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return next(new ErrorResponse(err.message, err.status || 500));

});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database running");
}).catch(err => {
  console.log(err.message);
})

module.exports = app;
