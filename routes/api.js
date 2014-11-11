var express = require('express');
var router = express.Router();

var api = require("../controller/api");

router.get('/', function(req, res) {
  res.render('api', { title: "API Documentation" });
});


router.get("/checkname/", api.checkName);
router.get("/checkname/:name", api.checkName);

module.exports = router;