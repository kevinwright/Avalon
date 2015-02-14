var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

var api = require("../controller/api");

router.get('/', function(req, res) {
  res.render('api', { avalon:avalon, title: "API Documentation" });
});

router.get("/stats/", api.stats);
router.get("/who/", api.who);
router.get("/checkname/", api.checkName);
router.get("/checkname/:username", api.checkName);

module.exports = router;