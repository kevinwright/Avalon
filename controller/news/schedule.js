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
        return !/^\*$/.test(line) && !/\*\+$/.test(line);
      })
      .forEach(function(line) {
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
    help = help.replace("GEMHOLDERS", "<a href='/help/pages/gemholders'>GEMHOLDERS</a>");
    help = help.replace("CONTENDERS", "<a href='/help/pages/contenders'>CONTENDERS</a>");

    callback(null, events, help);
  });
};

module.exports = schedule;