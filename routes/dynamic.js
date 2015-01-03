var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var fs = require("fs");

var marked = require("meta-marked");
var pages = require("//help/library/pages");

function render(page) {
  return function (req, res) {
    res.render("dynamic/"+page.template, {
      avalon: avalon,
      page: page
    })
  }
}

function addPage(page) {
  fs.readFile(page.file, "utf8", function(err, content) {
    if (err) return console.error(err);
    page.library = marked(content)
    router.get(page.url, render(page));
    console.log("Page added: "+page.url);
  });
}

function addHtml(page) {
  fs.readFile(page.file, "utf8", function(err, content) {
    if (err) return console.error(err);
    page.html = content
    router.get(page.url, render(page));
    console.log("Page added: "+page.url);
  });
}

for (var i = 0; i<pages.length; i++) {
  var page = pages[i];
  if (page.type == "library") {
    addPage(page);
  } else if (page.type == "html") {
    addHtml(page);
  }
}

module.exports = router;