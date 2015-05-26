var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var recent = require("../controller/news/recent.js");
var schedule = require("../controller/news/schedule.js");
var affairs = require("../controller/news/affairs.js");
var events = require("../controller/news/events.js");
var elections = require("../controller/news/elections.js");
var digest = require("../controller/news/digest.js");


// Methods
  function getIndex(req, res, next) {
    schedule(function(err, scheduleData, scheduleHelp) {
      if (err) return next(err);
      recent(function(err, recents) {
        if (err) return next(err);
        avalon.info("news.md", function(err, meta) {
          if (err) return next(err);
          affairs(function(err, affairsData) {
            if (err) return next(err);
            events(function(err, eventsData) {
              if (err) return next(err);
              elections(function(err, electionsData) {
                if (err) return next(err);
                digest(function(err, digestData) {
                  if (err) return next(err);
                  res.render('news/index', {
                    meta: meta.meta,
                    affairs: affairsData,
                    recent: recents,
                    events: eventsData,
                    elections: electionsData,
                    digest: digestData,
                    schedule: scheduleData,
                    scheduleHelp: scheduleHelp
                  });
                });
              });
            });
          });
        });
      });
    });
  }

function getDigest(req, res, next) {
  digest(function(err, digestData) {
    if (err) return next(err);
    res.render('news/digest', {
      digest: digestData
    });
  });
}

// Routes
  router.get(['/', "/index.html"], getIndex);
  router.get(['/digest/', '/digest/index.html', "/digest.html"], getDigest);


module.exports = router;