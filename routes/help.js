var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('help/index', { title: "Introduction to Avalon: The Net's First Online Text Based Roleplaying Game" });
});

module.exports = router;