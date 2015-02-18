#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var timer = new Date();
var total = 0;

global.avalon = {
  dir: {
    help: "/help/help",
    world: "/library/world/",
    rollcall: "/help/rollcall",
    autohelp: "/help/autohelp",
    bb: "/help/bb",
    library: "/library",
    library_pages: "/library/pages",
    library_help: "/library/help",
    intro: "/library/intro"
  },
  files: {
    menu: "/library/menu.js",
    synonyms: "/library/synonyms.js",
    pages: "/library/pages.js",
    toc: "/library/intro/toc.js"
  }
}

var data = '<?xml version="1.0" encoding="UTF-8"?>';
data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

function writeUrl(urlpath, lm, changefreq, prior) {
  var url = "<url>";
  url += "<loc>http://www.avalon-rpg.com" + urlpath + "</loc>";
  if (lm) {
    var date = lm.getFullYear() + "-" + (lm.getMonth() + 1) + "-" + lm.getDate();
    url += "<lastmod>"+date+"</lastmod>";
  }
  if (changefreq) url += "<changefreq>"+changefreq+"</changefreq>";
  if (prior) url += "<priority>"+prior+"</priority>";
  url += "</url>";
  return url;
}

function getHelp() {
  var auto = fs.readdirSync(global.avalon.dir.autohelp);
  var help = fs.readdirSync(global.avalon.dir.help);

  return auto.map(function(file) {
      return file.slice(0, file.length - 1); // remove 0
  }).filter(function(file) {
      return help.indexOf(file) != -1; // check if file also in help
  }).map(function(file) { // grab last modified
      var location = path.resolve(global.avalon.dir.help, file);
      try {
        return {
          file: file,
          lastmod: fs.statSync(location).mtime
        };
      } catch(err) {
        console.error("Error reading: ", err.path);
      }
  }).filter(function(file) { // clear files with errors
    return file;
  });
}

function getRollcall() {
  var characters = fs.readdirSync(global.avalon.dir.rollcall);
  return characters.map(function(file) {
    var location = path.resolve(global.avalon.dir.rollcall, file);
    try {
      return {
        file: file,
        lastmod: fs.statSync(location).mtime
      };
    } catch(err) {
      console.error(err);
    }
  }).filter(function(file) { // clear files with errors
    return file;
  });
}

function getBBBoards() {
  var boards = require(global.avalon.dir.bb + "/boards.json").boards;
  return boards.map(function(board) {
    var location = path.resolve(global.avalon.dir.bb, board.href);
    try {
      return {
        url: board.shortname,
        id: board.id,
        file: board.href,
        lastmod: fs.statSync(location).mtime
      }
    } catch(err) {
      // console.error("No board file for: ", board.shortname);
    }
  }).filter(function(file) {return file});
}

function getPages() {
  return require(global.avalon.files.pages);
}

var helpFiles = getHelp();
console.warn("Help Files: ", helpFiles.length);
total+= helpFiles.length;

for (var i in helpFiles) {
  var file = helpFiles[i];
  data += writeUrl("/help/pages/" + file.file, file.lastmod, "monthly", 0.8);
}

var rollcallFiles = getRollcall();
console.warn("Rollcall Files: ", rollcallFiles.length);
total += rollcallFiles.length;

for (var i in rollcallFiles) {
  var file = rollcallFiles[i];
  data += writeUrl("/rollcall/characters/" + file.file, file.lastmod, "weekly", 0.2);
}

var BBboards = getBBBoards();
for (var i in BBboards) {
  var file = BBboards[i];
  data += writeUrl("/bb/" + file.url, file.lastmod, "weekly", 0.3);
}
console.warn("Boards: ", BBboards.length);
total += BBboards.length;

// for (var i in BBboards) {
//   try {
//     var BBposts = require(global.avalon.dir.bb + "/" + BBboards[i].file).posts;

//     for (var j in BBposts) {
//       var file = BBposts[j];
//       var datetime = file.timestamp.split("T");
//       var dA = datetime[0].split("-");
//       var date = new Date(dA[2], dA[1]-1, dA[0]);

//       data += writeUrl("/bb/" + BBboards[i].url + "/" + file.number + "/" + encodeURIComponent(file.subject), new Date(date), "never", 0.1);
//     }

//   } catch(err) {
//     console.error(err);
//   }

//   total += BBposts.length;
//   console.warn("BB Posts: ", BBboards[i].url, BBposts.length);
// }


var pages = getPages();
console.warn("Pages: ", pages.length);
for (var i in pages) {
  var page = pages[i];
  if (page.canonical) writeUrl(page.canonical);
  else if (page.url) {
    if (typeof page.url == "array") writeUrl(page.url[0]);
    else writeUrl(page.url);
  }
}

data += "</urlset>";
// console.log(data);
console.warn("%s links in %sms", total, new Date() - timer);