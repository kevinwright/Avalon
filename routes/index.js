var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var recent = require("../controller/news/recent.js");

// Routes
  router.get(['/', "/index.html"], getIndex);

// Methods
  function getIndex(req, res, next) {
    recent(function(err, data) {
      avalon.info("front.md", function(err, meta, extra) {
        avalon.info("play.md", function(err, play) {
          if (err) return next(err);
          meta.meta.form = play.meta.form;
          res.render('index', { avalon: avalon, meta: meta.meta, extra:extra, recent: data });
        });
      });
    })
  }


module.exports = router;