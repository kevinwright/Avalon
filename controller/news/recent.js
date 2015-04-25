var HELPDIR = global.avalon.dir.help;
var util = require("../../helper/util");

var recent = function(callback) {
  util.readFile(HELPDIR + "/site-recent", function(err, data) {
    if (err) return callback(err);

    var m = data.trim().split(/\s*(\d{1,2}[a-z]{0,2} of [A-Z][a-z]+ \d{2,4})\s*/i);
    var items = [];
    for (var i = 1; i < m.length; i += 2) {
      items.push({
        date: m[i],
        item: m[i+1]
      });
    }
    callback(null, items);
  });
};

module.exports = recent;