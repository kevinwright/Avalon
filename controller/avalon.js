var who = require("./api/who.js");
var marked = require("meta-marked");
var fs = require("fs");

var NodeCache = require( "node-cache" );
var libCache = new NodeCache( { stdTTL: 600, checkperiod: 1200 } );

var catchBlock = function(content) {
  var blockType = "normal";
  var lines = content.split("\n");
  var blocks = {}
  for (var i=0; i<lines.length; i++) {
    var line = lines[i];

    if (line.substr(0,1) == "@") {
      blockType = line.substr(1).trim();
      if (blockType === "end") blockType = "normal";
      continue;
    }
    if (blocks[blockType])
      blocks[blockType] += line + "\n"
    else
      blocks[blockType] = line + "\n";
  }
  return blocks;
}

module.exports = {
  menu: require(global.avalon.files.menu),
  users: function() { return who.users;},
  stats: function(req, res) {
    res.render("stats.jade", {
      stats: libCache.getStats()
    });
  },
  info: function(file, callback) {
    if (callback) {
      libCache.get( file, function( err, hit ){
        if( !err && hit[file] ){
          var blocks = hit[file];
          callback(null, blocks.normal, blocks);
        } else {
          fs.readFile(global.avalon.dir.library_pages + "/" + file, "utf8", function(libErr, librarycontent) {
            if (libErr) return callback(libErr);

            var blocks = catchBlock(librarycontent);
            for(var key in blocks) {
                if(blocks.hasOwnProperty(key)) {
                    blocks[key] = marked(blocks[key]);
                }
            }
            
            libCache.set( file, blocks, function( err, success ){
              if( !err && success ){
                console.log( success );
              }
            });
            callback(null, blocks.normal, blocks);
          });
        }
      });

    }
  }
}