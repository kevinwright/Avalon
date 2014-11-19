var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var play = require("../controller/play");

router.get('/', function(req, res) {
  res.render('play/index');
});
router.post('/', play.post);


router.get('/javalon', function(req, res) {
  res.render('play/index');
});

router.get('/lumiere', function(req, res) {
  res.render('play/index');
});

module.exports = router;