var helpParser = require("../help/parser");
var HELPDIR = global.avalon.dir.help;
var util = require("../../helper/util");
var _ = require("lodash");

var schedule = function(callback) {
  util.readFile(HELPDIR + "/schedule", function(err, data) {
    if (err) return callback(err);

    var events = {}, current = "";
    _(data.match(/^\*.*$/gm))
      .filter(function(line) {
        return !/^\*$/.test(line);
      })
      .forEach(function(line, key) {
        if (/^\*\*/.test(line)) {
          current = line.replace(/\*\*/, "");
          events[current] = [];
        } else {
          events[current].push(line.replace(/\*/, ""));
        }
      })
      .value();

    data = data.replace(/^\*.*/gmi, "");
    var help = helpParser(data);

    callback(null, events, help);
  });
};

module.exports = schedule;