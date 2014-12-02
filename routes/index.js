var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var recent = require("../controller/news/recent.js");

/* GET home page. */
router.get('/', function(req, res) {
  recent(function(data) {
    res.render('index', { title: "Avalon: The Net's First Online Text Based Roleplaying Game", avalon: avalon, recent: data.splice(0, 6) });
  })
});
router.get('/index.html', function(req, res) {
  recent(function(data) {
    res.render('index', { title: "Avalon: The Net's First Online Text Based Roleplaying Game", avalon: avalon, recent: data.splice(0, 6) });
  })
});

module.exports = router;