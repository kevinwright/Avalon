var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

router.get('/', function(req, res) {
  res.render('news/index', { avalon:avalon, title: "The Latest news from Avalon, Online RPG Game" });
});

module.exports = router;