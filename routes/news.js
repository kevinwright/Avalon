var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

// Routes
  router.get(['/', "/index.html"], getIndex);

// Methods
  function getIndex(req, res) {
    avalon.info("news.md", function(err, meta, extra) {
      if (err) return console.error(err);
      res.render('news/index', { meta: meta.meta, avalon:avalon });
    });
  }


module.exports = router;