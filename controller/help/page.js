var sanitizeHtml = require('sanitize-html');

// Page object - contains content
var Page = function(title, helpcontent, autocontent) {
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

  this.html = parsePage(this.help);
}

function parsePage(content) {
  // convert http://blah into hyperlinks
  // convert HELP BLAH into hyperlinks
  // ** = highlight
  // * bold
  var lines = content.split("\n");

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var block = false;

    line = line.replace(/\</g,'&lt;');
    line = line.replace(/\>/g,'&gt;');

    // highlight **
    line = line.replace(/^\*\*(.*)/g, function(match, p1, offset, str) {
      block = true;
      return "<h3 class='ui title underline'>" + p1 + "</h3>";
    })

    // bold *
    line = line.replace(/^\*(.*)/g, function(match, p1, offset, str) {
      return "<b>" + p1 + "</b>";
    })

    line = line.replace(/(.*[^>\"])http:\/\/([A-Za-z.-][A-Za-z.-]*)(.*)/g, function(match, p1, p2, p3) {
      return p1 + "<a href=\"" + p2.toLowerCase() + "\">" + p2 + "</a>" + p3;
    })

    // HELP XXX into hyperlink
    line = line.replace(/(.*[^>])HELP ([A-Z][A-Z]*)(.*)/g, function(match, p1, p2, p3, offset, str) {
      return p1 + "<a href=\"/help/pages/" + p2.toLowerCase() + "\">HELP " + p2 + "</a>" + p3;
    })

    // .. to .
    line = line.replace(/(.*[^\.])\.\.([^\.].*)/g, function(match, p1, p2, offset, str) {
      return p1  + "." + p2;
    })

    if (line.indexOf("   ") >= 0) {
      block = true;
      line = "<pre>" + line + "</pre>";
    }

    if (line.trim() === "") {
      block = true;
      line = "<br>";
    }

    if (line == "!") {
      block = true;
      line = "";
    }


    if (block === false) {
      line = "<p>" + line + "</p>";
    }

    lines[i] = sanitizeHtml(line, {
        allowedTags: [ "h1", "h2", "h3", "h4", "pre", "p", "br", 'b', 'i', 'em', 'strong', 'a' ],
        allowedAttributes: {
          'a': [ 'href' ],
          "h1": ["class"],
          "h2": ["class"],
          "h3": ["class"],
          "h4": ["class"],
        }
      });
  }

  return lines.join("\n");
}

module.exports = Page;