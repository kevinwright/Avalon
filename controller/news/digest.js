var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var fs = require('fs');
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
  var readCallback = function(err, entries) {
    if (err) return callback(err);

    var digest = {
      types: [],
      entries: []
    };

    var notTicker = function (evt) { return evt.title.toUpperCase().indexOf("TICKER") < 0 };
    entries = entries.filter(notTicker);

    var types = { maxCount: 0 };

    entries.forEach(function(entry) {
      var escaped = escapeHtml(entry.description);
      var type = entry.type.trim().toUpperCase();
      if(types.hasOwnProperty(type)) {
        var newCount = types[type] + 1;
        types[type] = newCount;
        types.maxCount = Math.max(types.maxCount, newCount);
      } else {
        types[type] = 1;
      }
      entry.type = type;
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
      digest.entries.push(entry);
    });

    for(var i=0; i <= types.maxCount; ++i) {
      for(var key in types) {
        if (types.hasOwnProperty(key) && key !== 'maxCount' && types[key] === i){
          digest.types.push(key);
        }
      }
    }

    callback(null, digest);
  };

  fs.stat(LIBDIR + "/webdigest-processed", function(err, stat){
    var fname = (err || !stat.isFile()) ? "/webdigest" : "/webdigest-processed";
    util.readStdEventFile(LIBDIR + fname, readCallback);
  });

};

module.exports = digest;
