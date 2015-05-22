var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");
var moment = require('moment-timezone');


var elections = function(callback) {
  util.readStdFile(LIBDIR + "/elections", function(err, elections) {
    if (err) return callback(err);

    elections.forEach(function(election) {
      var started = util.parseCompoundDate(election.started);
      var ends = util.parseCompoundDate(election.ends);

      delete election.started;
      delete election.ends;

      election.icon = "yellow " + (election.type === "CITY") ? "university" : "paw";
      election.gmtStarted = started.gmtDateTime;
      election.avStarted = started.avDate;
      election.gmtEnds = ends.gmtDateTime;
      election.avEnds = ends.avDate;
    });

    callback(null, elections);
  });
};

module.exports = elections;