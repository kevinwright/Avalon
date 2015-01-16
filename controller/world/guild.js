var HELPDIR = global.avalon.dir.help;
var WORLDDIR = global.avalon.dir.world;

var fs = require("fs");
var parser = require("../help/parser");

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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


module.exports = function (guildName) {
  this.name = guildName;
  this.title = cap(this.name);

  this.baseLocation = WORLDDIR + this.title + "/";

  try {
    this.infoContent = fs.readFileSync(this.baseLocation + "basicinfo", "utf8");
  } catch(err) {
    this.error = true;
    return null;
  }
  this.info = parseInfo(this.infoContent);

  this.get = function(item, isSingleString) {
    if (item == "skills") return parseSkill(this.baseLocation + item);
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