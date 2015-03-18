var express = require('express');
var router = express.Router();
var play = require("../controller/play");


var get = function(req, res) {
  res.redirect("/play/");
};

router.get('/', get);
router.post('/', play.lumiere);
router.get('/index.html', get);
router.post('/index.html', play.lumiere);


module.exports = router;