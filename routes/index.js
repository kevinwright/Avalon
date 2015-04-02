var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var recent = require("../controller/news/recent.js");
var schedule = require("../controller/news/schedule.js");
var util = require("../helper/util");

// Methods

  function getIndex(req, res, next) {
   schedule(function(err, scheduleData, scheduleHelp) {
      if (err) return next(err);
      recent(function(err, recents) {
        if (err) return next(err);
        avalon.info("front.md", function(err, meta, extra) {
          if (err) return next(err);
          util.renderYAML("/library/affairs", function(err, content) {
            if (err) return next(err);
            res.render('index', {
              meta: meta.meta,
              extra:extra,
              affairs: content.affairs,
              recent: recents,
              events: scheduleData,
              scheduleHelp: scheduleHelp
            });
          });
        });
      });
    });
  }

// Routes
  router.get(['/', "/index.html"], getIndex);


module.exports = router;