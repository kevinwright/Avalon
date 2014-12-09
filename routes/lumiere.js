var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");


var get = function(req, res) {
  var flashvars = {
    username: req.query["username"],
    password: req.query["password"],
    create: req.query["create"],
    gender: req.query["gender"],
    email: req.query["email"]
  }

  res.render('play/lumiere', { avalon:avalon, flashvars: flashvars});
}

var post = function(req, res) {
  var flashvars = {
    username: req.body["username"],
    password: req.body["password"],
    create: req.body["create"],
    gender: req.body["gender"],
    email: req.body["email"]
  }

  res.render('play/lumiere', { avalon:avalon, flashvars: flashvars});
}

router.get('/', get);
router.post('/', post);
router.get('/index.html', get);
router.post('/index.html', post);


module.exports = router;