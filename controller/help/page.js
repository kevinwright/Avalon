var sanitizeHtml = require('sanitize-html');
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
  if (pageArr) {
    this.id = pageArr[1];
    this.title = pageArr[2];
    this.description = pageArr[3];
    this.section = this.id.split(".")[0];
  }

  if (isLibrary) {
    this.library = marked(this.help);
  } else {
    this.html = helpParser(this.help);
  }
}



module.exports = Page;