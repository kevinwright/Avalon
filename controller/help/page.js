var helpParser = require("./parser");
var marked = require("meta-marked");

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false
// });

// Page object - contains content
var Page = function(title, helpcontent, autocontent, isLibrary) {
  this.title = title;
  this.help = helpcontent;
  this.auto = autocontent;

  var pageArr = /(\d+\.\d+)\s+(\w+)\s+(.*)/.exec(this.auto);
  if (!pageArr) pageArr = /(\d+\.\d+)\s+(\w+\'s)\s+(.*)/.exec(this.auto);
  if (pageArr) {
    this.id = pageArr[1];
    this.title = pageArr[2];
    this.description = pageArr[3];
    this.section = this.id.split(".")[0];
  }

  if (isLibrary) {
    try {
      var blocks = catchBlock(this.help);
      this.library = marked(blocks.normal);
      if (blocks.advanced)
        this.advanced = marked(blocks.advanced);
      if (blocks.gods)
        this.gods = marked(blocks.gods);
    } catch(err) {
      console.error(err);
      this.html = "<h3 class='ui title center'>Something went wrong when viewing the file</h3>";
    }
  } else {
    this.html = helpParser(this.help);
  }
}

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


module.exports = Page;