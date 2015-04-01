var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var recent = require("../controller/news/recent.js");
var util = require("../helper/util");
var helpParser = require("../controller/help/parser");
var HELPDIR = global.avalon.dir.help;


// Methods

  function getIndex(req, res, next) {
    util.readFile(HELPDIR+"/"+"schedule", function(err, eventsFile) {
      if (err) return next(err);
      var eventsData = helpParser(eventsFile);
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
              events: eventsData
            });
          });
        });
      });
    });
  }

// Routes
  router.get(['/', "/index.html"], getIndex);


module.exports = router;