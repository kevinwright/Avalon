var helpParser = require("../help/parser");
var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");

var events = function(callback) {
  util.readFile(LIBDIR + "/webevents2", function(err, data) {
    if (err) return callback(err);

    var events = {};
    var regex = /^(\S+) @ (\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d) \/ (".*") participants=(\d+) potential=(\d+) title="(.*)" description="(.*)"$/;
    var lines = data.split("\n");
    lines.forEach(function(line) {
      var match = regex.exec(line);
      if(match) {
        events.push({
          type: match[1],
          date: match[2],
          avdate: match[3],
          participants: match[4],
          potentials: match[5],
          title: match[6],
          description: match[7]
        });
      }
    });

    callback(null, events, null);
  });
};

module.exports = events;