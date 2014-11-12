var express = require('express');
var router = express.Router();

var recent = require("../controller/recent")

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: "Avalon: The Net's First Online Text Based Roleplaying Game" });
});

module.exports = router;