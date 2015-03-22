var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var util = require("../helper/util");


// Methods
  function getIndex(req, res, next) {
    avalon.info("news.md", function(err, meta) {
      if (err) return next(err);
      util.renderYAML("/library/affairs", function(err, content) {
        if (err) return next(err);
        res.render('news/index', {
          meta: meta.meta,
          affairs: content.affairs
        });
      });
    });
  }

// Routes
  router.get(['/', "/index.html"], getIndex);


module.exports = router;