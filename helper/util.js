var NodeCache = require( "node-cache" );

var fs = require("fs");
var yaml = require("js-yaml");
var marked = require("marked");

if (process.env.NODE_ENV === "production")
  ttlTime = 600
else
  ttlTime = 10
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
}

var readFiles = function(files, callback) {
  var result = [], errors = [], l = files.length;
  files.forEach(function (path, k) {
    readFile(path, function (err, data) {
      // decrease waiting files
      --l;
      // just skip non-npm packages and decrease valid files count
      err && (errors[k] = err);
      !err && (result[k] = data);
      // invoke cb if all read
      !l && cb (errors.length? errors : undef, result);
    });
  });
}


// Rendering Library Files
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

  // Splits the given string into a meta section and a markdown section
  // if a meta section is present, else returns null
  function splitInput(str) {
    if (str.slice(0, 3) !== '---') return;

    var matcher = /\n(\.{3}|-{3})/g;
    var metaEnd = matcher.exec(str);

    return metaEnd && [str.slice(0, metaEnd.index), str.slice(matcher.lastIndex)];
  }

  // [Based on meta-marked](https://github.com/j201/meta-marked)
  var metaMarked = function(src, opt, callback) {
    if (Object.prototype.toString.call(src) !== '[object String]')
      throw new TypeError('First parameter must be a string.');
    src=src.trim();
    var mySplitInput = splitInput(src);

    return mySplitInput ?  {
        meta : yaml.safeLoad(mySplitInput[0]),
        html : marked(mySplitInput[1], opt, callback)
      } : {
        meta : null,
        html : marked(src, opt, callback)
      };
  };
  metaMarked.__proto__ = marked;

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
  }
  var renderSync = function(content) {
    var blocks = catchBlock(content);
    for (var key in blocks)
      if(blocks.hasOwnProperty(key))
        blocks[key] = metaMarked(blocks[key]);
    return blocks;
  }

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
  }

  var renderFileSync = function(file) {
    var content = fs.readFileSync(file).toString();
    return renderSync(content);
  }


function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  readFile: readFile,
  catchBlock: catchBlock,
  marked: metaMarked,
  render: render,
  renderSync: renderSync,
  renderFile: renderFile,
  renderFileSync: renderFileSync,
  cap: cap,
  cache: {
    file: fileCache,
    library: markCache
  }
}
