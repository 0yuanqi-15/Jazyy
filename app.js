var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

/* connect to the database and register the schema
   put this line after the var routes = require('./routes/index'); will cause
   error: `Schema hasn't been registered for model "cafes".
 */
require('./models/db.js');

var app = express();

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
app.use('/', routes);

var usersRoutes = require('./routes/user/user');
var signupRoutes = require('./routes/user/sign-up');
var loginRoutes = require('./routes/user/login');
var updateDeletesRoutes = require('./routes/user/user-UD');
app.use('/user', usersRoutes);
app.use('/user/sign-up', signupRoutes);
app.use('/user/login', loginRoutes);
app.use('/user/user-UD', updateDeletesRoutes);

var folioRoutes = require('./routes/folio/myfolio');
var editfolioRoutes = require('./routes/folio/edit-folio');
app.use('/myfolio', folioRoutes);
app.use('/edit-myfolio', editfolioRoutes);

var discussionRoutes = require('./routes/discussion-board/discussion-board');
var newenquiryRoutes = require('./routes/discussion-board/new-enquiry');
app.use('/discussion-board', discussionRoutes);
app.use('/discussion-board/new-enquiry', newenquiryRoutes);

var contactRoutes = require('./routes/contact-us');
app.use('/contact-us', contactRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
