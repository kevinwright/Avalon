var HELPDIR = global.avalon.dir.help;
var WORLDDIR = global.avalon.dir.world;

var util = require("../../helper/util");
var fs = require("fs");
var parser = require("../help/parser");

function parseInfo(content) {
  var result = {};
  var lines = content.split("\n");
  for (var i = 0; i<lines.length;i++) {
    var firstWord = lines[i].split(" ")[0];
    result[firstWord] = lines[i].slice(firstWord.length + 1);
  }
  return result;
} 

function parseSkill(loc) {
  var content = fs.readFileSync(loc, "utf8");
  var lines = content.split("\n");
  var skills = [];
  for (var i = 0; i < lines.length; i++) {
    skills[i] = {
      title: lines[i].split(" ", 2)[0],
      description: lines[i].substr(lines[i].split(" ", 2)[0].length)
    }
  };
  return skills;
}


module.exports = function (guildName, callback) {
  this.name = guildName;
  this.title = util.cap(this.name);

  this.baseLocation = WORLDDIR + this.title + "/";

  try {
    this.infoContent = fs.readFileSync(this.baseLocation + "basicinfo", "utf8");
  } catch(err) {
    this.error = true;
    return callback(err);
  }
  this.info = parseInfo(this.infoContent);

  this.get = function(item, isSingleString) {
    if (item == "skills") return parseSkill(this.baseLocation + item);
    try {
      if (isSingleString) {
        return fs.readFileSync(this.baseLocation + item, "utf8");
      } else {
        return parser(fs.readFileSync(this.baseLocation + item, "utf8"));
      }
    } catch(err) {
      console.error(err);
      return callback(err);
    }
  }

  this.help = function(title) {
    try {
      return parser(fs.readFileSync(HELPDIR + "/" + title, "utf8"));
    } catch(err) {
      console.error(err);
      return callback(err);
    }
  }

  callback(null, this);
}