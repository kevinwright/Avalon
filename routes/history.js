var express = require('express');
var router = express.Router();
var _ = require("lodash");

var avalon = require("../controller/avalon");

// Methods
  function getOrdinations(req, res, next) {
    avalon.info("history/ordinations.md", function(err, meta) {
      if (err) return next(err);
      res.render('history/list', {
        page: "ordinations",
        meta: meta.meta
      });
    });
  }

  function getModernHistory(req, res, next) {
    avalon.info("history/modernhistory.md", function(err, meta) {
      if (err) return next(err);
      res.render('history/list', {
        page: "modernhistory",
        meta: meta.meta
      });
    });
  }

  function getAncientHistory(req, res, next) {
    avalon.info("history/ancienthistory.md", function(err, meta) {
      if (err) return next(err);
      res.render('history/list', {
        page: "ancienthistory",
        meta: meta.meta
      });
    });
  }

  function getTimeline(req, res, next) {
    avalon.info("history/timeline.md", function(err, meta) {
      if (err) return next(err);
      var _mapped = {};
      var timeline = _.map(meta.meta.timeline, function(n) {
        var century = Math.floor(n.year / 100) + 1;
        if (_mapped[century]) return n;
        n.anchor = century;
        _mapped[century] = true;
        return n;
      });
      res.render('history/timeline', {
        page: "timeline",
        meta: meta.meta,
        timeline : timeline
      });
    });
  }


// Routes
  router.get(['/', "/index.html"], getTimeline);
  router.get(['/ordinations', "/ordinations.html"], getOrdinations);
  router.get(['/timeline'], getTimeline);
  router.get(['/modernhistory', "/modernhistory.html"], getModernHistory);
  router.get(['/ancienthistory', "/ancienthistory.html"], getAncientHistory);



module.exports = router;