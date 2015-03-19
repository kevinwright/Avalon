var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");


// Methods
  function getIndex(req, res, next) {
    avalon.info("news.md", function(err, meta) {
      if (err) return next(err);
      res.render('news/index', {
        meta: meta.meta
      });
    });
  }

// Routes
  router.get(['/', "/index.html"], getIndex);


module.exports = router;