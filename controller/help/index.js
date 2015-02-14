var AUTOHELPDIR = global.avalon.dir.autohelp,
    HELPDIR = global.avalon.dir.help,
    LIBRARYHELPDIR = global.avalon.dir.library_help;

var util = require("../../helper/util.js");
var path = require("path");
var avalon = require("../avalon.js");

var hints = require("./hints");
var synonym = require("./synonym");
var Section = require("./section");
var Page = require("./page");

function Controller() {
  var self = this;

  this.index = function(req, res) {
    avalon.info("help.md", function(err, meta, extra) {
      if (err) return console.log(err);
      res.render('help/index', {
        title: "Help",
        meta: meta.meta,
        sections: self.sections,
        avalon: avalon
      });
    });
  }

  // :section
  this.section = function(req, res) {
    var section = req.params["section"] || req.query["section"];
    res.render("help/section", {
      title: section,
      section: self.sections[section],
      sections: self.sections,
      avalon: avalon
    })
  }

  // :page
  this.page = function(req, res) {
    var page = req.params["page"] || req.query["page"];

    readPage(page, function(err, data) {
      if (err) {
        res.status(err.status || 500);
        console.error(err);
        if (err.errno == 34) {
          res.status(404);
          return res.render('error', {
              message: "No such page: " + page,
              error: {},
              avalon: avalon
          });
        } else {
          res.status(404);
          return res.render('error', {
              message: err.message,
              error: {},
              avalon: avalon
          });
        }
      } else {
        res.render("help/page", {
          title: page,
          page: data,
          section: self.sections[data.section],
          avalon: avalon
        })
      }
    })
  }

  this.search = function(req, res) {
    res.redirect("/help/pages/" + req.query["page"].toLowerCase());
  };
  

  parseSections(function(err, sections) {
    if (err) return self.sections = {};
    self.sections = sections;
  });
}


function readPage(title, callback) {
  title = title.toLowerCase();
  var isSynonym = synonym(title);
  if (isSynonym) title = isSynonym;

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
          if (err) {return callback(err)} // autohelp, but no help
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
}

// Parses the /help/autohelp/0 file and returns the sections.
function parseSections(callback) {
  util.readFile(AUTOHELPDIR + "/0", function(err, data) {
    if (err) return callback(err);

    var sectionContents = data.split(/Section #\d+ - .*/g); // get the content in between the headers
    var sectionHeaders = data.match(/Section #\d+ - (.*)/g); // get the headers
    var sectionHints = hints; // get the hints file

    var sections = {};
    // make a Section object for each section.
    for (var i = 1; i<sectionContents.length; i++) {
      sections[i] = new Section(sectionHeaders[i-1], sectionHints[i], sectionContents[i]);
    }

    callback(null, sections)
  });
}


module.exports = new Controller();