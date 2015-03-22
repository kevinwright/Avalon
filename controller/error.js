var fs = require("fs");
var _ = require("lodash");
var synonyms = require(global.avalon.files.synonyms);
var express = require('express');
var app = express();

var TOCFILE = global.avalon.files.toc;
var toc = require(TOCFILE);

var AUTOHELPDIR = global.avalon.dir.autohelp,
    HELPDIR = global.avalon.dir.help;

function fuzzy(search, text) {
    search = search.toUpperCase();
    text = text.toUpperCase();

    var j = -1; // remembers position of last found character

    // consider each search character one at a time
    for (var i = 0; i < search.length; i++) {
        var l = search[i];
        if (l === ' ') continue;     // ignore spaces

        j = text.indexOf(l, j+1);     // search for character & update position
        if (j === -1) return false;  // if it's not found, exclude this item
    }
    return true;
}

var ErrorHandler = function() {
	this.help = function(error, req, res, next) {
		fs.readdir(AUTOHELPDIR, function(err, files) {
			if (err) return next(err);

			files = _.map(files, function(file) {
				return _.trimRight(file, '0');
			});

			fs.readdir(HELPDIR, function(err, helps) {
				if (err) return next(err);


				var syns = _.keys(synonyms);
				var validPages = _.assign(_.intersection(files, helps), syns);

				var page = error.page;
				if (_.endsWith(page, 's')) {
					if (_.includes(validPages, _.trimRight(page, "s"))) {
						return res.redirect("/help/pages/" + _.trimRight(page, "s"));
					}
				} else {
					if (_.includes(validPages, page + "s")) {
						return res.redirect("/help/pages/" + page+"s");
					}
				}

				var matches = _.filter(validPages, function(file) {
					return fuzzy(error.page, file);
				});

				res.status(404);
				res.render('error/help', {
				    matches: matches,
				    message: error.message,
				    error: error,
				    page: error.page
				});
			});
		});
	};

  this.intro = function(err, req, res) {
    var category = err.query.category;
    var page = err.query.page;

    console.log(category, page);

    var linkList = _.filter(_.flatten(_.pluck(toc, 'items')), function(item) {
      return _.includes(item.url, page);
    });

    if (linkList.length === 1) {
      return res.redirect("/intro" + linkList[0].url);
    }

    res.status(404);
    res.render('error/intro', {
        matches: linkList,
        message: err.message,
        error: err,
        page: page
    });
  };

  this.print = function(err, req, res) {
    res.status(err.status || 500);
    var message = err.message;
    var stack = err;
    if (app.get('env') === 'production') {
      stack = {};
    }
    res.render('error/error', {
      message: message,
      error: stack
    });
  };
};


module.exports = new ErrorHandler();