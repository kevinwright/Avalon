var express = require('express');
var router = express.Router();

var avalon = require("../controller/avalon");

router.get('/', function(req, res) {
  res.render('history/index', { title: "The History of This Roleplaying World", avalon: avalon });
});

router.get('/ordinations', function(req, res) {
  res.render('history/ordinations', { title: "Ordinations - The Greatest Event in the Land", avalon: avalon });
});

router.get('/modernhistory', function(req, res) {
  res.render('history/modernhistory', { title: "Modern History", avalon: avalon });
});

router.get('/ancienthistory', function(req, res) {
  res.render('history/ancienthistory', { title: "Ancient History", avalon: avalon });
});


module.exports = router;