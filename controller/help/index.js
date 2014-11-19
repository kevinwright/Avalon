var AUTOHELPDIR = "/help/autohelp";
var HELPDIR = "/help/help";
var LIBRARYDIR = "/help/library";

var fs = require("fs");

var hints = require("./hints");
var Section = require("./section");
var Page = require("./page");

function HelpController() {
  var self = this;

  this.index = function(req, res) {
    res.render('help/index', {
      title: "Help",
      sections: self.sections
    });
  }

  // :section
  this.section = function(req, res) {
    var section = req.params["section"] || req.query["section"];
    res.render("help/section", {
      title: section,
      section: self.sections[section],
      sections: self.sections
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
          return res.render('error', {
              message: "No such page: " + page,
              error: {}
          });
        } else {
          return res.render('error', {
              message: err.message,
              error: {}
          });
        }
      } else {
        res.render("help/page", {
          title: page,
          page: data,
          section: self.sections[data.section]
        })
      }
    })
  }

  this.search = function(req, res) {
    res.redirect("/help/pages/" + req.query["page"].toLowerCase());
  };
  
  this.sections = parseSections();
}


function readPage(title, callback) {
  fs.readFile(AUTOHELPDIR + "/" + title + "0", "utf8", function(err, autocontent) {
    if (err) return callback(err);
    fs.readFile(LIBRARYDIR + "/" + title, "utf8", function(err, librarycontent) {
      if (err) {
        // no library file
        fs.readFile(HELPDIR + "/" + title, "utf8", function(err, helpcontent) {
          if (err) {return callback(err)}
          var page = new Page(page, helpcontent, autocontent);

          callback(null, page);
        });
      } else {
        var page = new Page(page, librarycontent, autocontent, true);

        callback(null, page);
      }
    });
  });
}

// Parses the /help/autohelp/0 file and returns the sections.
function parseSections(callback) {
  var data = fs.readFileSync(AUTOHELPDIR + "/0", "utf8");

  var sectionContents = data.split(/Section #\d+ - .*/g); // get the content in between the headers
  var sectionHeaders = data.match(/Section #\d+ - (.*)/g); // get the headers
  var sectionHints = hints; // get the hints file

  var sections = {};
  // make a Section object for each section.
  for (var i = 1; i<sectionContents.length; i++) {
    sections[i] = new Section(sectionHeaders[i-1], sectionHints[i], sectionContents[i]);
  }

  return sections;
}


module.exports = new HelpController();