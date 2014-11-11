var AUTOHELPDIR = "/help/autohelp";
var HELPDIR = "/help/help";

var fs = require("fs");

var hints = require("./hints");
var Section = require("./section");

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
      section: self.sections[section]
    })
  }

  // :page
  this.page = function(req, res) {
    var page = req.params["page"] || req.query["page"];
    res.render("help/page", {
      title: page,
      page: page
    })
  }
  
  this.sections = parseSections();
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