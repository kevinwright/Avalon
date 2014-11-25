var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

router.get('/', function(req, res) {
  res.render('play/lumiere', { avalon:avalon,
    title: "The Latest news from Avalon, Online RPG Game" });
});

router.get('/index.html', function(req, res) {
  res.render('play/lumiere', { avalon:avalon,
    title: "The Latest news from Avalon, Online RPG Game" });
});



module.exports = router;