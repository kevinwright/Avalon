var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var recent = require("../controller/news/recent.js");


// Methods
	function getIndex(req, res, next) {
	  recent(function(err, data) {
	    avalon.info("front.md", function(err, meta, extra) {
	      if (err) return next(err);
	      res.render('index', { avalon: avalon, meta: meta.meta, extra:extra, recent: data });
	    });
	  });
	}

// Routes
  router.get(['/', "/index.html"], getIndex);


module.exports = router;