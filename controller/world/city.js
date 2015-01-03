var HELPDIR = "/help/help";
var fs = require("fs");
var parser = require("../help/parser");

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseTemple(loc) {
  var content = fs.readFileSync(loc, "utf8");
  var lines = content.split("\n");
  var temples = [];
  for (var i = 0; i < lines.length; i++) {
    temples[i] = {
      deity: lines[i].split(" ", 2)[0],
      content: lines[i].substr(lines[i].split(" ", 2)[0].length)
    }
  };
  return temples;
}

module.exports = function (cityName) {
  this.name = cityName;
  this.title = cap(this.name);

  this.baseLocation = "/help/library/world/" + this.title + "/";

  this.get = function(item, isSingleString) {
    if (item == "temples") return parseTemple(this.baseLocation + item);
    if (isSingleString) {
      return fs.readFileSync(this.baseLocation + item, "utf8");
    } else {
      return parser(fs.readFileSync(this.baseLocation + item, "utf8"));
    }
  }

  this.help = function(title) {
    return parser(fs.readFileSync(HELPDIR + "/" + title, "utf8"));
  }
}