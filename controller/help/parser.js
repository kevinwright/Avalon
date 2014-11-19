module.exports = function(content) {
  // convert http://blah into hyperlinks
  // convert HELP BLAH into hyperlinks
  // ** = highlight
  // * bold
  var lines = content.split("\n");
  var intable = false;

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

    if (intable && (line.length == 0 || /^[ |-]*$/.test(line))) {
      line = "<tr><td><hr/></td></tr>";
      lines[i] = line;
      continue;
    }


    if (line.indexOf("|") >= 0) {
      var originalLine = line;
      if (intable === false) {
        var line = "<table class='ui table'><tbody>";
      } else {
        line = "";
      }
      block = true; intable = true;
      var columns = originalLine.split("|");
      line += "<tr>";
      for (var colI = 0; colI < columns.length; colI++) {
        line += "<td>" + columns[colI].trim() + "</td>";
      }
      line += "</tr>";
    } else {
      if (!block && intable === true) {
        line = "</tbody></table><br>" + line;
        intable = false;
        block = true;
      }
    }

    if (!block && line.indexOf("   ") >= 0) {
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

    lines[i] = line;
    // lines[i] = sanitizeHtml(line, {
    //     allowedTags: [ "h1", "h2", "h3", "h4", "pre", "p", "br", 'b', 'i', 'em', 'strong', 'a', "table", "tr", "td", "tbody", "thead", "th" ],
    //     allowedAttributes: {
    //       'a': [ 'href' ],
    //       "h1": ["class"],
    //       "h2": ["class"],
    //       "h3": ["class"],
    //       "h4": ["class"],
    //       "table": ["class"],
    //       "td": ["colspan"]
    //     }
    //   });
  }

  return lines.join("\n");
}