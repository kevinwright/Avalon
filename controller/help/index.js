var AUTOHELPDIR = global.avalon.dir.autohelp,
    HELPDIR = global.avalon.dir.help,
    LIBRARYHELPDIR = global.avalon.dir.library_help,
    HELPSUMMARYFILE = global.avalon.files.help_summary;

var util = require("../../helper/util.js");
var avalon = require("../avalon.js");
var _ = require("lodash");

var hints = require("./hints");
var synonym = require("./synonym");
var Section = require("./section");
var Page = require("./page");
var fs = require("fs");
var helpParser = require("./parser");



function readPage(title, callback) {
  title = title.toLowerCase();
  var isSynonym = synonym(title);
  if (isSynonym) title = isSynonym;

  util.readdir(LIBRARYHELPDIR, function(err, libs) {
    if (err) return callback(err);
    var inLibrary = false;
    
    if (_.includes(libs, title)) {
      inLibrary = true;
    }

    if (inLibrary) {
      util.renderFile(LIBRARYHELPDIR + "/" + title, function(libErr, librarycontent) {
        util.readFile(AUTOHELPDIR + "/" + title + "0", function(autoErr, autocontent) {
          if (libErr && autoErr) // no file in library and autohelp
            return callback(autoErr);
          if (!libErr && autoErr) {
            // there is a library but no autohelp file
            return Page({
              title: title,
              content: { library: librarycontent}
            }, callback);
          }
          if (libErr && !autoErr) {
            // there is no library but there is an autohelp file
            return util.readFile(HELPDIR + "/" + title, function(err, helpcontent) {
              if (err) {return callback(err);} // autohelp, but no help
              return Page({
                title: title,
                content: {
                  help: helpcontent,
                  auto: autocontent
                }
              }, callback);
            });
          }
          // there is a library and autohelp
          return Page({
            title: title,
            content: {
              library: librarycontent,
              auto: autocontent
            }
          }, callback);
        });
      });
    } else {
      util.readFile(AUTOHELPDIR + "/" + title + "0", function(autoErr, autocontent) {
        if (autoErr) // no autohelp
          return callback(autoErr);
        
        util.readFile(HELPDIR + "/" + title, function(err, helpcontent) {
          if (err) {return callback(err);} // autohelp, but no help
          return Page({
            title: title,
            content: {
              help: helpcontent,
              auto: autocontent
            }
          }, callback);
        });
      });
    }
  });



}

function parseSummaries(callback) {
  util.readFile(HELPSUMMARYFILE, function(err, data) {
    if (err) return callback(err);
    var lines = data.split(/[\r\n]+/g);
    var regex = /^(\d+) "(.*)" @ (.*)$/;
    var summaries = [];
    lines.forEach(function(line){
      var match = regex.exec(line);
      var id = match[1];
      var group = match[2];
      var summary = match[3];
      summaries[id] = summary;
    });

    callback(summaries);
  });
}

// Parses the /help/autohelp/0 file and returns the sections.
function parseSections(callback) {
  util.readFile(AUTOHELPDIR + "/0", function(err, data) {
    if (err) return callback(err);

    parseSummaries(function(summaries) {
      var sectionContents = data.split(/Section #\d+ - .*/g); // get the content in between the headers
      var sectionHeaders = data.match(/Section #\d+ - (.*)/g); // get the headers
      //var sectionHints = hints; // get the hints file

      var sections = {};
      // make a Section object for each section.
      for (var i = 1; i<sectionContents.length; i++) {
        sections[i] = new Section(sectionHeaders[i-1], summaries[i], sectionContents[i]);
      }

      callback(null, sections);
    });

  });
}

function Controller() {
  var self = this;

  this.index = function(req, res, next) {
    avalon.info("help.md", function(err, meta) {
      if (err) return next(err);
      res.render('help/index', {
        title: "Help",
        meta: meta.meta,
        sections: self.sections
      });
    });
  };

  // :section
  this.section = function(req, res) {
    var section = req.params.section || req.query.section;
    if (!self.sections[section]) return res.redirect("/help/");

    var prevSection = self.sections[parseInt(section) - 1];
    var nextSection = self.sections[parseInt(section) + 1];

    res.render("help/section", {
      title: section,
      section: self.sections[section],
      sections: self.sections,
      prevSection: prevSection,
      nextSection: nextSection,
      keywords: _.pluck(self.sections[section].pages, "title").join(", ").toLowerCase()
    });
  };

  this.full = function(req, res, next) {
    avalon.info("help.md", function(err, meta) {
      if (err) return next(err);
      var pages = _(self.sections)
        .pluck("pages")
        .flatten()
        .map(function(page) {
          try {
            page.html = fs.readFileSync(HELPDIR + "/" + page.title.toLowerCase()).toString();
            page.html = helpParser(page.html, "#");
            return page;
          } catch(err) {
            return page;
          }
        })
        .filter(function(page) {
          return page.html;
        })
        .value();
      res.render('help/full', {
        title: "Help",
        meta: meta.meta,
        pages: pages,
        sections: self.sections
      });
    });
  };

  // :page
  this.page = function(req, res, next) {
    var page = req.params.page || req.query.page;
    if (!page) return res.redirect("/help/");

    readPage(page, function(err, data) {
      if (err) {
        return next({
          err: err,
          type: "help",
          page: page
        });
      } 

      var section = self.sections[data.section];

      res.render("help/page", {
        title: page,
        page: data,
        section: section
      });
    });
  };

  this.search = function(req, res) {
    res.redirect("/help/pages/" + req.query.page.toLowerCase());
  };
  

  parseSections(function(err, sections) {
    if (err) {
      self.sections = {};
      return;
    }
    self.sections = sections;
  });
}

module.exports = new Controller();