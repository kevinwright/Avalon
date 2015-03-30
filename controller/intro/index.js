var INTRODIR = global.avalon.dir.intro,
    TOCFILE = global.avalon.files.toc;

var util = require("../../helper/util.js");

var toc = util.renderYAMLSync(TOCFILE);
var legacy = require(INTRODIR + "/legacy.js");

var _ = require("lodash");

function NoPageError(url, cat, result, params) {
  this.name = "NoPageError";
  this.message = "Intro page not found";
  this.url = url;
  this.cat = cat;
  this.result = result;
  this.query = params;
  this.type = "intro";
  this.status = 404;
}

function Controller() {
  this.index = function(req, res, next) {
    util.renderFile(INTRODIR + "/index.md", function(err, blocks) {
      if (err) return next(err);
      res.render('intro/index', {
        meta: blocks.normal.meta,
        extra: blocks,
        toc: toc
      });
    });
  };

  this.legacy = function(req, res, next) {
    var url = req.params.page || req.query.page;
    var result = legacy.filter(function(item) {
      return item.url === "/" + url && item.file;
    });

    if (result.length === 0) {
      var top = toc.filter(function(top) {
        return top.short === url;
      });

      if (top && top.length > 0) {
        return res.redirect("/intro" + top[0].items[0].url);
      }

      return next(new NoPageError(url, "legacy", result, {page: url}));
    }
    
    util.renderFile(result[0].file, function(err, blocks) {
      if (err) return next(err);
      res.render("intro/legacy", {
        meta: blocks.normal.meta,
        extra: blocks,
        legacy: legacy,
        page: result[0],
      });
    });
  };

  this.page = function(req, res, next) {
    var category = req.params.category || req.query.category;
    var page = req.params.page || req.query.page;
    var url = "/" + category + "/" + page;

    var cat, result;

    toc.filter(function(top) {
      var items = top.items.filter(function(item) {
        return item.url === url;
      });

      if (items.length > 0) {
        cat = top;
        result = items[0];
      }
    });

    if (!cat  || !result) {
      if (cat) {
        return res.redirect("/intro/" + category);
      } else {
        return next(new NoPageError(url, cat, result, req.params));
      }
    }


    var linkList = _.filter(_.flatten(_.pluck(toc, 'items')), function(item) {
      return item.file;
    });
    var index = _.findIndex(linkList, result);
    var previous = linkList[index - 1];
    var nextArticle = linkList[index + 1];

    util.renderFile(INTRODIR+"/"+result.file, function(err, blocks) {
      if (err) {
        return util.renderFile(INTRODIR+"/empty.md", function(secondErr, blocks) {
          blocks.normal.html = "<pre><code>"+JSON.stringify(err, null, 2)+"</code></pre>";
          res.status(404);
          res.render("intro/page", {
            meta: blocks.normal.meta,
            extra: blocks,
            toc: toc,
            cat: cat,
            page: result,
          });
        });
      } else {
        if (!blocks.normal.meta) return next(err);
        res.render("intro/page", {
          meta: blocks.normal.meta,
          extra: blocks,
          toc: toc,
          cat: cat,
          page: result,
          previous: previous,
          next: nextArticle
        });
      }
    });
  };
}

module.exports = new Controller();