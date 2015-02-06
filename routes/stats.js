var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

var NodeCache = require( "node-cache" );
var libCache = new NodeCache( { stdTTL: 600, checkperiod: 1200 } );

// Routes
  router.get("/", getIndex);

// Methods
  function getIndex(req, res) {
    res.render("stats.jade", {
      avalon: avalon,
      stats: libCache.getStats()
    });
  }

module.exports = router;