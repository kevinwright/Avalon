var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var intro = require('./routes/intro');
var api = require('./routes/api');
var bb = require('./routes/bb');
var help = require('./routes/help');
var play = require('./routes/play');
var news = require('./routes/news');
var rollcall = require('./routes/rollcall');
var history = require('./routes/history');
var lumiere = require('./routes/lumiere');
var dynamic = require('./routes/dynamic');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/help/downloads", express.static(path.join(__dirname, 'downloads')));

app.use('/', routes);
app.use('/intro', intro);
app.use('/api', api);
app.use('/bb', bb);
app.use('/help', help);
app.use('/play', play);
app.use('/news', news);
app.use('/rollcall', rollcall);
app.use('/history', history);
app.use('/lumiere', lumiere);

app.use('/', dynamic);

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
