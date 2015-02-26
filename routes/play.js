var express = require('express');
var router = express.Router();
var play = require("../controller/play");

// Routes
  router.get(['/', "/index.html"], play.get); 

module.exports = router;