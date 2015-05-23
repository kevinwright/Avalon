var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");
var moment = require('moment-timezone');


var elections = function(callback) {
  util.renderYAML(LIBDIR + "/elections", function(err, content) {
    if (err) return callback(err);

    content.elections.forEach(function(election) {
      util.postProcessYamlDate(election.start);
      util.postProcessYamlDate(election.end);

      election.icon = "yellow " + (election.type === "CITY") ? "university" : "paw";
    });

    callback(null, content.elections);
  });
};

module.exports = elections;