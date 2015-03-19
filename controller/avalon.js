var who = require("./api/who.js");
var path = require("path");
var util = require("../helper/util");

var fs = require("fs");
var yaml = require("js-yaml");

var _website = yaml.safeLoad(fs.readFileSync(global.avalon.files.website));

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
  },
  get website () {
    util.renderYAML(global.avalon.files.website, function(err, content) {
      if (err) return;
      _website = content;
    });
    return _website;
  }
};