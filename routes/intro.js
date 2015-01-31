var express = require('express');
var router = express.Router();
var intro = require("../controller/intro");

// Routes
  router.get(['/', "/index.html"], intro.index);
  router.get("/:category/:page", intro.page);

module.exports = router;