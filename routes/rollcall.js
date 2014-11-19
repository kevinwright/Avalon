var express = require('express');
var router = express.Router();

var rollcall = require("../controller/rollcall");
var avalon = require("../controller/avalon");

router.get('/', rollcall.index);

module.exports = router;