var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var play = require("../controller/play");
var avalon = require("../controller/avalon");

router.get('/', function(req, res) {
  res.render('play/index', {avalon:avalon});
});
router.post('/', play.post);

module.exports = router;