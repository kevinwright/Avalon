var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");
var moment = require('moment-timezone');


var elections = function(callback) {
  util.readFile(LIBDIR + "/elections", function(err, data) {
    if (err) return callback(err);

    var elections = [];

    moment.locale('en-my-settings', {
      calendar : {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'llll'
      }
    });

    var regex = /^(\S+) @ (\S+) ###position=(\S+) ###started=(.*)\/(.*) ###ends=(.*)\/(.*) ###incumbent=(.*) ###votes=(\d+) ###electorate=(\d+)$/;
    var lines = data.split("\n");
    lines.forEach(function(line) {
      var match = regex.exec(line);
      if(match) {
        var type = match[1];
        var icon = "yellow " + (type === "CITY") ? "university" : "paw";
        var now = moment().tz("Europe/London");
        var started = moment.tz(match[4], "Europe/London");
        var ends = moment.tz(match[6], "Europe/London");
        var countdown = moment.duration( ends.diff(now) );
        elections.push({
          type:       type,
          venue:      match[2],
          position:   match[3],
          started:    started,
          avstarted:  match[5],
          ends:       ends,
          avends:     match[7],
          countdown:  countdown,
          incumbent:  match[8],
          votes:      match[9],
          electorate: match[10],
          icon:       icon
        });
      }
    });

    callback(null, elections);
  });
};

module.exports = elections;