var who = require("./api/who.js");
var marked = require("meta-marked");
var fs = require("fs");
var path = require("path");

var util = require("../helper/util");

module.exports = {
  menu: require(global.avalon.files.menu),
  users: function() { return who.users;},
  info: function(file, callback) {
    if (callback) {
      var fileLocation = path.resolve(global.avalon.dir.library_pages, file);
      util.renderFile(fileLocation, function(err, blocks) {
        if (err) return callback(err);
        callback(null, blocks.normal, blocks);
      });
    }
  }
}