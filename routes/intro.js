var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('intro/index', { title: "Introduction to Avalon: The Net's First Online Text Based Roleplaying Game" });
});

router.get("/:section", function(req, res) {
  res.render("intro/page", { title: "Introduction - " + req.params.section, page: req.params.section});
})

module.exports = router;