var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");
var murmur = require('murmurhash3');


function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


var digest = function(callback) {
  util.readStdEventFile(LIBDIR + "/webdigest", function(err, entries) {
    if (err) return callback(err);

    var notTicker = function (evt) { return evt.title.toUpperCase().indexOf("TICKER") < 0 };
    entries = entries.filter(notTicker);

    entries.forEach(function(entry) {
      var escaped = escapeHtml(entry.description);
      entry.links = [];
      entry.linkHashes = [];
      entry.description = escaped.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        function(substr, text, url) {
          var urlHash = murmur.murmur128HexSync(url);
          console.log('urlHash = ' + urlHash);
          entry.links.push(url);
          entry.linkHashes.push(urlHash);
          var link = '<a href="' + url + '"><i class="ui sup icon external"></i></a>';
          var span = '<span class="clickable link link-' + urlHash + '" data-link="' + urlHash + '">' + text + '</span>';
          return span + link;
        }
      );
    });

    callback(null, entries);
  });
};

module.exports = digest;
