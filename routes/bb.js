var express = require('express');
var router = express.Router();

var avalon = require("../controller/avalon");

router.get('/', function(req, res) {
  res.render('index', { title: "BB", avalon: avalon });
});

module.exports = router;