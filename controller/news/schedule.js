var helpParser = require("../help/parser");
var HELPDIR = global.avalon.dir.help;
var util = require("../../helper/util");

var schedule = function(callback) {
  util.readFile(HELPDIR + "/schedule", function(err, data) {
    if (err) return callback(err);

    var html = helpParser(data);
    callback(null, html);
  });
};

module.exports = schedule;