var helpParser = require("../help/parser");
var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");

var schedule = function(callback) {
  util.readFile(LIBDIR + "/webevents", function(err, data) {
    if (err) return callback(err);

    var events = {}, current = "", state = false, helpFile = "";

    for (var i = 0; i < data.split("\n").length; i++) {
      var line = data.split("\n")[i];
      if (_.startsWith(line, "*")) {
        current = line.replace(/\*/gmi, "").trim();
        state = true;
      } else {
        if (state) {
          events[current] = line;
          state = false;
        } else {
          helpFile += line + "\n";
        }
      }
    }

    console.log(events);

    var help = helpParser(helpFile);
    help = help.replace("GEMHOLDERS", "<a href='/help/pages/gemholders'>GEMHOLDERS</a>");
    help = help.replace("CONTENDERS", "<a href='/help/pages/contenders'>CONTENDERS</a>");

    callback(null, events, null);
  });
};

module.exports = schedule;