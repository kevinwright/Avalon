var helpParser = require("./parser");
var util = require("../../helper/util.js");


module.exports = function(options, callback) {
  var page = {};

  page.title = options.title;
  page.content = {
    help: options.content.help,
    auto: options.content.auto,
    library: options.content.library
  }

  // Parse autohelp
  var pageArr = /(\d+\.\d+)\s+(\w+)\s+(.*)/.exec(page.content.auto);
  if (!pageArr) pageArr = /(\d+\.\d+)\s+(\w+\'s)\s+(.*)/.exec(page.content.auto);

  if (pageArr) {
    page.id = pageArr[1];
    page.title = pageArr[2];
    page.description = pageArr[3];
    page.section = page.id.split(".")[0];
  }

  if (!page.content.library) {
    page.html = helpParser(page.content.help);
    callback(null, page);
  } else {
    page.content.library.meta = page.content.library.normal.meta;
    page.content.library.html = page.content.library.normal.html;
    callback(null, page);
  }
};