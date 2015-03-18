var PAGESDIR = global.avalon.dir.library_pages;
var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var util = require("../helper/util");

var files = require(global.avalon.files.pages);

function renderPage(page) {
  return function (req, res, next) {
    util.renderFile(PAGESDIR+"/"+page.file, function(err, blocks) {
      if (err) return next(err);
      page.library = blocks.normal;
      res.render("dynamic/"+page.template, {
        avalon: avalon,
        page: page
      });
    });
  };
}

function renderHTML(page) {
  return function (req, res, next) {
    util.readFile(PAGESDIR+"/"+page.file, function(err, content) {
      if (err) return next(err);
      page.html = content;
      res.render("dynamic/"+page.template, {
        avalon: avalon,
        page: page
      });
    });
  };
}

for (var i = 0; i<files.length; i++) {
  var page = files[i];
  if (page.type === "library") {
    router.get(page.url, renderPage(page));
  } else if (page.type === "html") {
    router.get(page.url, renderHTML(page));
  } else if (page.type === "download") {
    router.use(page.url, express.static(page.file));
  } else if (page.type === "directory") {
    console.log(page.file, page.url);
    router.use(page.url, express.static(page.file));
  }
}

module.exports = router;