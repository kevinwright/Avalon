var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var fs = require("fs");

var marked = require("meta-marked");
var pages = [];

function render(page) {
  return function (req, res) {
    res.render("dynamic/"+page.template, {
      avalon: avalon,
      page: page
    })
  }
}

function watchChange(page) {
  fs.watchFile(page.file, function(curr, prev) {
    if (page.type == "library") {
      fs.readFile(page.file, "utf8", function(err, content) {
        if (err) return console.error(err);
        page.library = marked(content)
        console.log("text changed " + page.file);
      });
    } else if (page.type == "html") {
      fs.readFile(page.file, "utf8", function(err, content) {
        if (err) return console.error(err);
        page.html = content
        console.log("text changed " + page.file);
      });
    }
  })
}

function addPage(page) {
  fs.readFile(page.file, "utf8", function(err, content) {
    if (err) return console.error(err);
    page.library = marked(content)
    router.get(page.url, render(page));
    console.log("Page added: "+page.url);
    pages.push(page);
    watchChange(page);
  });
}

function addHtml(page) {
  fs.readFile(page.file, "utf8", function(err, content) {
    if (err) return console.error(err);
    page.html = content
    router.get(page.url, render(page));
    console.log("Page added: "+page.url);
    pages.push(page);
    watchChange(page);
  });
}

function init() {
  var files = require("/help/library/pages");
  for (var i = 0; i<files.length; i++) {
    var page = files[i];
    if (page.type == "library") {
      addPage(page);
    } else if (page.type == "html") {
      addHtml(page);
    }
  }
}

init();
module.exports = router;