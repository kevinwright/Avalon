var sanitizeHtml = require('sanitize-html');

module.exports = function(content) {
  var lines = content.split("\n");
  var finalLines = "";
  var block = false;

  // highlight **
  function makeHeader(match, p1) {
    block = true;
    return "<h3 class='ui title underline'>" + p1 + "</h3>";
  }

  // bold *
  function makeBold(match, p1) {
    return "<b>" + p1 + "</b>";
  }

  // http://blah into hyperlinks
  function makeHTTP(match, p1) {
    return "<a href=\"" + p1.toLowerCase() + "\">" + p1 + "</a>";
  }

  // HELP BLAH into hyperlinks
  function makeHelp(match, p1, p2) {
    if (p2) {
      return " HELP <a href=\"/help/pages/" + p1.toLowerCase() + "\">" + p1 + "</a> / <a href=\"/help/pages/" + p2.toLowerCase() + "\">" + p2 + "</a>";
    } else {
      return " <a href=\"/help/pages/" + p1.toLowerCase() + "\">HELP " + p1 + "</a>";
    }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    line = line.replace(/</g, '&lt;');
    line = line.replace(/\>/g, '&gt;');
    line = line.replace(/^\*\*(.*)/g, makeHeader);
    line = line.replace(/^\*(.*)/g, makeBold);
    line = line.replace(/http:\/\/([A-Za-z.-][A-Za-z.-]*)/g, makeHTTP);
    line = line.replace(/\s?HELP ([A-Z][A-Z]*)\/?([A-Z[A-Z]*)?/g, makeHelp);

    if (!block && line.indexOf("   ") >= 0) {
      block = true;
      line = "<pre>" + line + "</pre>";
    }

    if (line.trim() === "") {
      block = true;
      if (i !== 0 && i !== lines.length - 1) line = "<br>";
    }

    if (line === "!") {
      block = true;
      line = "";
      break;
    }

    if (block === false) {
      line = "<p>" + line + "</p>";
    }

    lines[i] = line;
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
    finalLines += lines[i] + "\n";
  }

  return finalLines;
};