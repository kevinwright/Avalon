var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var util = require("../helper/util");
var recent = require("../controller/news/recent.js");
var schedule = require("../controller/news/schedule.js");

// Methods
  function getIndex(req, res, next) {
    schedule(function(err, scheduleData) {
      if (err) return next(err);
      recent(function(err, recents) {
        if (err) return next(err);
        avalon.info("news.md", function(err, meta) {
          if (err) return next(err);
          util.renderYAML("/library/affairs", function(err, content) {
            if (err) return next(err);
            res.render('news/index', {
              meta: meta.meta,
              affairs: content.affairs,
              recent: recents,
              events: scheduleData
            });
          });
        });
      });
    });
  }

// Routes
  router.get(['/', "/index.html"], getIndex);


module.exports = router;