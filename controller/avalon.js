var who = require("./api/who.js");
var path = require("path");
var util = require("../helper/util");

var _website = util.renderYAMLSync(global.avalon.files.website);
var _menu = util.renderYAMLSync(global.avalon.files.menu);

module.exports = {
  get menu () {
    return _menu;
  },
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
    return _website;
  }
};

setInterval(function() {
  util.renderYAML(global.avalon.files.website, function(err, content) {
    if (err) return;
    _website = content;
  });
  util.renderYAML(global.avalon.files.menu, function(err, content) {
    if (err) return;
    _menu = content;
  });
}, 180000);