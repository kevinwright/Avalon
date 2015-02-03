var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var play = require("../controller/play");

// Routes
  router.get(['/', "/index.html"], getIndex);
  router.post('/', play.post);

// Methods
  function getIndex(req, res, next) {
    avalon.info("play.md", function(err, meta) {
      if (err) return next(err);
      res.render('play/index', {meta: meta.meta, avalon: avalon});
    });
  }

module.exports = router;