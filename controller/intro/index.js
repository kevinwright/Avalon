var INTRODIR = global.avalon.dir.intro,
    TOCFILE = global.avalon.files.toc;

var util = require("../../helper/util.js");
var avalon = require("../avalon.js");

var toc = require(TOCFILE);
var legacy = require(INTRODIR + "/legacy.js");

function NoPageError(page, cat, result) {
  this.name = "NoPageError"
  this.message = "No Such Intro Page"
  this.page = page
  this.cat = cat
  this.result = result
}

function Controller() {
  this.index = function(req, res, next) {
    util.renderFile(INTRODIR + "/index.md", function(err, blocks) {
      if (err) return next(err);
      res.render('intro/index', {
        meta: blocks.normal.meta,
        extra: blocks,
        // toc: toc,
        legacy: legacy,
        avalon: avalon
      });
    });
  }

  this.legacy = function(req, res, next) {
    var url = req.params["page"] || req.query["page"];
    var result = legacy.filter(function(item) {
      return (item.url == "/" + url) && item.file;
    })
    if (result.length == 0) return next(new NoPageError(url, "legacy", result));
    
    util.renderFile(result[0].file, function(err, blocks) {
      if (err) return next(err);
      res.render("intro/legacy", {
        meta: blocks.normal.meta,
        extra: blocks,
        legacy: legacy,
        avalon: avalon,
        page: result[0],
      })
    })
  }

  this.page = function(req, res, next) {
    var category = req.params["category"] || req.query["category"];
    var page = req.params["page"] || req.query["page"];
    var url = "/" + category + "/" + page;

    var cat, result;

    toc.filter(function(top) {
      var items = top.items.filter(function(item) {
        return item.url == url;
      })
      if (items.length > 0) {
        cat = top;
        result = items[0];
      }
    })

    if (cat == null && result == null) return next(new NoPageError(url, cat, result));

    util.renderFile(result.file, function(err, blocks) {
      if (err) return next(err);
      res.render("intro/page", {
        meta: blocks.normal.meta,
        extra: blocks,
        toc: toc,
        avalon: avalon,
        cat: cat,
        page: result,
      })
    })
  }
}

module.exports = new Controller();