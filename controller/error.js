var util = require("../helper/util.js");
var avalon = require("./avalon.js");
var fs = require("fs");
var _ = require("lodash");
var synonyms = require(global.avalon.files.synonyms);

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

			files = _.map(files, function(file) {
				return _.trimRight(file, '0');
			})

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
						return res.redirect("/help/pages/" + pages+"s");
					}
				}

				var matches = _.filter(validPages, function(file) {
					return fuzzy(error.page, file);
				});

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