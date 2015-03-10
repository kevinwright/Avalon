var HELPDIR = global.avalon.dir.help;
var WORLDDIR = global.avalon.dir.world;

var util = require("../../helper/util");
var fs = require("fs");
var parser = require("../help/parser");


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

module.exports = function (cityName, callback) {
  this.name = cityName.toLowerCase();
  this.title = util.cap(this.name);

  this.baseLocation = WORLDDIR + this.title + "/";

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

  callback(null, this);
}