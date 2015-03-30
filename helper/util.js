var NodeCache = require( "node-cache" );

var fs = require("fs");
var yaml = require("js-yaml");
var marked = require("marked");
var _ = require("lodash");
var ttlTime = 600;

if (process.env.NODE_ENV === "production") ttlTime = 600;
else ttlTime = 10;

var fileCache = new NodeCache( { stdTTL: ttlTime, checkperiod: ttlTime*2 } );
var fileErrCache = {}; // we should cache errors, or else it will try to look for it each time

var markCache = new NodeCache( { stdTTL: ttlTime, checkperiod: ttlTime*2 } );
var markErrCache = {};

// returns: err, success
var readFile = function(file, callback) {
  if (file in fileErrCache) {
    return callback(fileErrCache[file]);
  }

  fileCache.get(file, function(err, hit){
    if( !err && hit[file] ) {
      return callback(null, hit[file]);
    }

    fs.readFile(file, "utf8", function(fileErr, content) {
      if (fileErr) {
        console.log( "Error Cached: ", file );
        fileErrCache[file] = fileErr;
        return callback(fileErr);
      }
      
      callback(null, content);

      fileCache.set( file, content, function( err, success ){
        if( !err && success ){
          console.log( "Cached: ", file );
        } else {
          console.error( "Cache Failed: ", file );
        }
      });

    });
  });
};

var readdir = function(dir, callback) {
  if (dir in fileErrCache) {
    return callback(fileErrCache[dir]);
  }

  fileCache.get(dir, function(err, hit){
    if( !err && hit[dir] ) {
      return callback(null, hit[dir]);
    }

    fs.readdir(dir, function(fileErr, content) {
      if (fileErr) {
        console.log( "Error Cached: ", dir );
        fileErrCache[dir] = fileErr;
        return callback(fileErr);
      }
      
      callback(null, content);

      fileCache.set( dir, content, function( err, success ){
        if( !err && success ){
          console.log( "Cached: ", dir );
        } else {
          console.error( "Cache Failed: ", dir );
        }
      });

    });
  });
};


// Rendering Library Files
  var catchBlock = function(content) {
    var blockType = "normal";
    var lines = content.split("\n");
    var blocks = {};
    for (var i=0; i<lines.length; i++) {
      var line = lines[i];

      if (line.substr(0,1) === "@") {
        blockType = line.substr(1).trim();
        if (blockType === "end") blockType = "normal";
        continue;
      }
      if (blocks[blockType])
        blocks[blockType] += line + "\n";
      else
        blocks[blockType] = line + "\n";
    }
    return blocks;
  };

  // Splits the given string into a meta section and a markdown section
  // if a meta section is present, else returns null
  function splitInput(str) {
    if (str.slice(0, 3) !== '---') return;

    var matcher = /\n(\.{3}|-{3})/g;
    var metaEnd = matcher.exec(str);

    return metaEnd && [str.slice(0, metaEnd.index), str.slice(matcher.lastIndex)];
  }

  // [Based on meta-marked](https://github.com/j201/meta-marked)
  var metaMarked = Object.create(marked);
  metaMarked = function(src, opt, callback) {
    if (Object.prototype.toString.call(src) !== '[object String]')
      throw new TypeError('First parameter must be a string.');
    src=src.trim();
    var mySplitInput = splitInput(src);

    return mySplitInput ?  {
        meta : yaml.safeLoad(mySplitInput[0], {onWarning: function(err) {console.warn(err);}}),
        html : marked(mySplitInput[1], opt, callback)
      } : {
        meta : null,
        html : marked(src, opt, callback)
      };
  };

  // returns: err, blocks
  var render = function(content, callback) {
    var blocks = catchBlock(content);
    for (var key in blocks) {
      if(blocks.hasOwnProperty(key)) {
        try {
          blocks[key] = metaMarked(blocks[key]);
        } catch(err) {
          return callback(err);
        }
      }
    }
    callback(null, blocks);
  };
  var renderSync = function(content) {
    var blocks = catchBlock(content);
    for (var key in blocks)
      if(blocks.hasOwnProperty(key))
        blocks[key] = metaMarked(blocks[key]);
    return blocks;
  };

  var renderFile = function(file, callback) {
    if (file in fileErrCache) return callback(fileErrCache[file]);
    if (file in markErrCache) return callback(markErrCache[file]);

    markCache.get(file, function( err, hit ){
      if (!err && hit[file]) return callback(null, hit[file]);

      readFile(file, function(fileErr, content) {
        if (fileErr) {
          console.log( "Error Cached: ", file );
          fileErrCache[file] = fileErr;
          return callback(fileErr);
        }

        render(content, function(markErr, blocks) {
          if (markErr) {
            console.log( "Error Cached: ", file );
            markErrCache[file] = markErr;
            return callback(markErr);
          }

          callback(null, blocks);

          markCache.set( file, blocks, function( err, success ){
            if( !err && success ){
              console.log( "Marked: ", file );
            } else {
              console.error( "Mark Failed: ", file );
            }
          });
        });
      });

    });
  };

  var renderFileSync = function(file) {
    var content = fs.readFileSync(file).toString();
    return renderSync(content);
  };

  var renderYAML = function(file, callback) {
    if (file in fileErrCache) return callback(fileErrCache[file]);
    readFile(file, function(fileErr, content) {
      if (fileErr) {
        console.log( "Error Cached: ", file );
        fileErrCache[file] = fileErr;
        return callback(fileErr);
      }
      callback(null, yaml.safeLoad(content));
    });
  };

  var renderYAMLSync = function(file) {
    return yaml.safeLoad(fs.readFileSync(file));
  };


  var renderJSON = function(file, callback) {
    if (file in fileErrCache) return callback(fileErrCache[file]);
    readFile(file, function(fileErr, content) {
      if (fileErr) {
        console.log( "Error Cached: ", file );
        fileErrCache[file] = fileErr;
        return callback(fileErr);
      }
      callback(null, JSON.parse(content));
    });
  };


function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


var stopWords = ["about", "all", "alone", "also", "am", "and", "as", "at",
"because", "before", "beside", "besides", "between", "but", "by", "etc", "for",
"i", "is", "in", "of", "on", "other", "others", "so", "than", "that", "though",
"or", "your", "not", "be", "will", "did", "you", "are", "any", "a", "want",
"from", "this", "here", "were", "their", "year", "month", "day",
"over", "written",
"the", "we", "my", "to", "too", "trough", "until"];
function getKeywords(str) {
  return _(str.split(/\b/))
    .map(function(w) {
      return w.toLowerCase();
    })
    .filter(function(w) {
      return /^[a-z]+$/.test(w);
    })
    .filter(function(w) {
      return stopWords.indexOf(w) === -1 && w.length > 4;
    })
    .countBy()
    .map(function (count, word) {
      return {
        word: word,
        count: count
      };
    })
    .sortBy("count")
    .reverse()
    .pluck("word")
    .slice(0, 20)
    .value();
}

function getDescription(str) {
  var maxLength = 250;
  var trimmedString = str.substr(0, maxLength);
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  return trimmedString.replace(/(\r\n|\n|\r)/gm," ");
}

module.exports = {
  readFile: readFile,
  readdir: readdir,
  catchBlock: catchBlock,
  marked: metaMarked,
  render: render,
  renderSync: renderSync,
  renderFile: renderFile,
  renderFileSync: renderFileSync,
  renderYAML: renderYAML,
  renderYAMLSync: renderYAMLSync,
  renderJSON: renderJSON,
  cap: cap,
  getKeywords: getKeywords,
  getDescription: getDescription,
  cache: {
    file: fileCache,
    library: markCache
  }
};
