
//     ______                              
//    / ____/  ______  ________  __________
//   / __/ | |/_/ __ \/ ___/ _ \/ ___/ ___/
//  / /____>  </ /_/ / /  /  __(__  |__  ) 
// /_____/_/|_/ .___/_/   \___/____/____/  
//           /_/                           

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

global.avalon = {
    dir: {
        help: "/help/help",
        world: "/library/world/",
        rollcall: "/help/rollcall",
        autohelp: "/help/autohelp",
        bb: "/help/bb",
        library: "/library",
        library_help: "/library/help"
    },
    files: {
        synonyms: "/library/synonyms.js",
        pages: "/library/pages.js"
    }
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (app.get('env') === 'development')
    app.use(logger('dev'));
else
    app.use(logger("combined"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use("/help/downloads", express.static(path.join(__dirname, 'downloads')));



//     ____              __           
//    / __ \____  __  __/ /____  _____
//   / /_/ / __ \/ / / / __/ _ \/ ___/
//  / _, _/ /_/ / /_/ / /_/  __(__  ) 
// /_/ |_|\____/\__,_/\__/\___/____/  


app.use('/', require('./routes/index'));
app.use('/intro', require('./routes/intro'));
app.use('/api', require('./routes/api'));
app.use('/bb', require('./routes/bb'));
app.use('/help', require('./routes/help'));
app.use('/play', require('./routes/play'));
app.use('/news', require('./routes/news'));
app.use('/rollcall', require('./routes/rollcall'));
app.use('/history', require('./routes/history'));
app.use('/lumiere', require('./routes/lumiere'));

app.use('/', require('./routes/world'));
app.use('/', require('./routes/dynamic'));


//     ______                         
//    / ____/_____________  __________
//   / __/ / ___/ ___/ __ \/ ___/ ___/
//  / /___/ /  / /  / /_/ / /  (__  ) 
// /_____/_/  /_/   \____/_/  /____/  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
