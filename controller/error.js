var util = require("../helper/util.js");
var avalon = require("./avalon.js");
var fs = require("fs");
var _ = require("lodash");

var AUTOHELPDIR = global.avalon.dir.autohelp,
    HELPDIR = global.avalon.dir.help,
    LIBRARYHELPDIR = global.avalon.dir.library_help;

function fuzzy(search, text) {
    search = search.toUpperCase();
    text = text.toUpperCase();

    var j = -1; // remembers position of last found character

    // consider each search character one at a time
    for (var i = 0; i < search.length; i++) {
        var l = search[i];
        if (l == ' ') continue;     // ignore spaces

        j = text.indexOf(l, j+1);     // search for character & update position
        if (j == -1) return false;  // if it's not found, exclude this item
    }
    return true;
}

var ErrorHandler = function() {
	this.help = function(error, req, res, next) {
		fs.readdir(AUTOHELPDIR, function(err, files) {
			if (err) return next(err);
			fs.readdir(HELPDIR, function(err, helps) {
				if (err) return next(err);

				var matches = _.intersection(_.map(_.filter(files, function(file) {
					return fuzzy(error.page, file);
				}), function(file) {
					return file.substr(0, file.length - 1);
				}), helps);

				res.render('error/help', {
				    avalon: avalon,
				    matches: matches,
				    message: error.message,
				    error: error,
				    page: error.page
				});
			});
		})
	}
}


module.exports = new ErrorHandler();