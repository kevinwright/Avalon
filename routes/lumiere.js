var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var play = require("../controller/play");


var get = function(req, res) {
  var flashvars = {
    username: req.query.username,
    password: req.query.password,
    create: req.query.create,
    gender: req.query.gender,
    email: req.query.email
  };

  res.render('play/lumiere', { avalon:avalon, flashvars: flashvars});
};

router.get('/', get);
router.post('/', play.lumiere);
router.get('/index.html', get);
router.post('/index.html', play.lumiere);


module.exports = router;