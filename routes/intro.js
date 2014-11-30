var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

router.get('/', function(req, res) {
  res.render('intro/index', { avalon:avalon, title: "Introduction to Avalon: The Net's First Online Text Based Roleplaying Game" });
});
router.get('/index.html', function(req, res) {
  res.render('intro/index', { avalon:avalon, title: "Introduction to Avalon: The Net's First Online Text Based Roleplaying Game" });
});


// router.get("/:section", function(req, res) {
//   res.render("intro/page", { avalon:avalon, title: "Introduction - " + req.params.section, page: req.params.section});
// })

module.exports = router;