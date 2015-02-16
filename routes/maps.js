var express = require('express');
var router = express.Router();

var avalon = require("../controller/avalon");
var util = require("../helper/util");

// Routes
  router.get(['/', "/index.html"], getIndex);
  router.get(['/:map', "/viewmap.php"], getMap);

// Methods
  function getIndex(req, res, next) {
    avalon.info("maps.md", function(err, meta, extra) {
      if (err) return next(err);
      res.render('maps/index', { meta:meta.meta, extra:extra, avalon: avalon });
    })
  }

  function getMap(req, res, next) {
    avalon.info("maps.md", function(err, meta, extra) {
      if (err) return next(err);
      var param = req.params["map"] || req.query["map"];

      var map = meta.meta.maps.reduce(function(memo, section) {
        var maps = section.maps.filter(function(item) {
          return item.url == param;
        });
        if (maps.length >= 1) memo = maps[0];
        return memo;
      }, null);

      if (!map) return next("No map found!");
      res.render('maps/viewmap', { map: map, meta:meta.meta, extra:extra, avalon: avalon });
    })
  }


module.exports = router;