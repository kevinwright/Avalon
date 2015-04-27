var express = require('express');
var router = express.Router();
var intro = require("../controller/intro");

// Routes
  router.get(['/intro/', "/intro/index.html"], intro.index);
  router.get(["/intro/:page"], intro.legacy);
  router.get("/intro/:category/:page", intro.page);

  router.get("/features", intro.featureIndex);
  router.get("/guide", intro.guideIndex);
  router.get("/features/:page", intro.feature);
  router.get("/guide/:page", intro.guide);

module.exports = router;