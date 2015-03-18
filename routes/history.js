var express = require('express');
var router = express.Router();

var avalon = require("../controller/avalon");

// Methods
  function getIndex(req, res, next) {
    avalon.info("history/history.md", function(err, meta, extra) {
      if (err) return next(err);
      res.render('history/index', { meta:meta.meta, extra:extra, avalon: avalon });
    });
  }

  function getOrdinations(req, res, next) {
    avalon.info("history/ordinations.md", function(err, meta) {
      if (err) return next(err);
      res.render('history/list', { meta:meta.meta, avalon: avalon });
    });
  }

  function getModernHistory(req, res, next) {
    avalon.info("history/modernhistory.md", function(err, meta) {
      if (err) return next(err);
      res.render('history/list', { meta:meta.meta, avalon: avalon });
    });
  }

  function getAncientHistory(req, res, next) {
    avalon.info("history/ancienthistory.md", function(err, meta) {
      if (err) return next(err);
      res.render('history/list', { meta:meta.meta, avalon: avalon });
    });
  }


// Routes
  router.get(['/', "/index.html"], getIndex);
  router.get(['/ordinations', "/ordinations.html"], getOrdinations);
  router.get(['/modernhistory', "/modernhistory.html"], getModernHistory);
  router.get(['/ancienthistory', "/ancienthistory.html"], getAncientHistory);



module.exports = router;