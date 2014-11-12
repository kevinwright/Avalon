var HELPDIR = "/help/help";
var fs = require("fs");

var recent = function(callback) {
  fs.readFile(HELPDIR + "/site-recent", "utf8", function(err, data) {
    if (err) return console.error(err);

    var m = data.trim().split(/\s*(\d{1,2}[a-z]{0,2} of [A-Z][a-z]+ \d{2,4})\s*/i);
    console.log(m);
  });
}

module.exports = recent();