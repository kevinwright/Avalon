var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('news/index', { title: "News" });
});

router.get('/recent', function(req, res) {
  res.render('news/recent', {
    title: "Recent Events",
    
  });
});

module.exports = router;