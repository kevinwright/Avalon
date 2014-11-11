var Page = function(id, title, description) {
  this.id = id;
  this.title = title;
  this.description = description;
}

function parsePage(content) {
  var pagesArr = content.trim().split("\n");
  var pages = [];
  for (var i=0;i<pagesArr.length;i++) {
    var pageArr = /(\d+\.\d+)\s+(\w+)\s+(.*)/.exec(pagesArr[i]);
    if (pageArr) {
      pages.push( new Page(pageArr[1], pageArr[2], pageArr[3]) )
    } else {
      // console.error(pageArr, pagesArr[i]);
    }
  }
  return pages;
}

var Section = function(header, hint, content) {
  this.content = content;
  this.header = header;
  this.hint = hint;
  this.pages = parsePage(this.content);

  var headerRegex = /Section #(\d+) - (.*)/g.exec(this.header);
  this.id = headerRegex[1];
  this.title = headerRegex[2];
}

module.exports = Section;