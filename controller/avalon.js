var who = require("./api/who.js");
var marked = require("meta-marked");
var fs = require("fs");

module.exports = {
  users: function() { return who.users;},
  info: function(file, callback) {
    if (callback) {
      fs.readFile(global.avalon.dir.library_pages + "/" + file, "utf8", function(libErr, librarycontent) {
        if (libErr) return callback(libErr);
        callback(null, marked(librarycontent));
      });
    }
  }
}