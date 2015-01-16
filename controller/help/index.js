var AUTOHELPDIR = global.avalon.dir.autohelp,
    HELPDIR = global.avalon.dir.help,
    LIBRARYHELPDIR = global.avalon.dir.library_help;

var fs = require("fs");
var avalon = require("../avalon.js");

var hints = require("./hints");
var synonym = require("./synonym");
var Section = require("./section");
var Page = require("./page");

function Controller() {
  var self = this;

  this.index = function(req, res) {
    res.render('help/index', {
      title: "Help",
      sections: self.sections,
      avalon: avalon
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
  
  this.sections = parseSections();
}


function readPage(title, callback) {
  title = title.toLowerCase();
  var isSynonym = synonym(title);
  if (isSynonym) title = isSynonym;
  console.log("HELP " + title);
  fs.readFile(LIBRARYHELPDIR + "/" + title, "utf8", function(libErr, librarycontent) {
    console.log(" - library");
    fs.readFile(AUTOHELPDIR + "/" + title + "0", "utf8", function(autoErr, autocontent) {
      console.log(" - loaded", libErr, autoErr);
      if (libErr && autoErr) // no file in library and autohelp
        return callback(autoErr);
      console.log(" - either library or autohelp");
      if (!libErr && autoErr) {
        // there is a library but no autohelp file
        var page = new Page(title, librarycontent, null, true);
        return callback(null, page);
      }
      console.log(" - no library");
      if (libErr && !autoErr) {
        // there is no library but there is an autohelp file
        return fs.readFile(HELPDIR + "/" + title, "utf8", function(err, helpcontent) {
          console.log(" - help");
          if (err) {return callback(err)} // autohelp, but no help
          var page = new Page(title, helpcontent, autocontent);

          return callback(null, page);
        });
      }
      console.log(" - all ok")
      // there is a library and autohelp
      var page = new Page(title, librarycontent, autocontent, true);
      return callback(null, page);
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


module.exports = new Controller();