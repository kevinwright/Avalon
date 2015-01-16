var express = require('express');
var router = express.Router();

var avalon = require("../controller/avalon");

// Routes
  router.get(['/', "/index.html"], getIndex);
  router.get(['/ordinations', "/ordinations.html"], getOrdinations);
  router.get(['/modernhistory', "/modernhistory.html"], getModernHistory);
  router.get(['/ancienthistory', "/ancienthistory.html"], getAncientHistory);

// Methods
  function getIndex(req, res) {
    avalon.info("history.md", function(err, meta, extra) {
      if (err) return console.log(err);
      res.render('history/index', { meta:meta.meta, extra:extra, avalon: avalon });
    })
  }

  function getOrdinations(req, res) {
    res.render('history/ordinations', { title: "Ordinations - The Greatest Event in the Land", avalon: avalon });
  }

  function getModernHistory(req, res) {
    res.render('history/modernhistory', { title: "Modern History", avalon: avalon });
  }

  function getAncientHistory(req, res) {
    res.render('history/ancienthistory', { title: "Ancient History", avalon: avalon });
  }



module.exports = router;