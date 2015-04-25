var express = require('express');
var router = express.Router();

var api = require("../controller/api");

router.get('/', function(req, res) {
  res.render('api');
});

router.get("/stats/", api.stats);
router.get("/editor", api.editor);
router.post("/editor", api.editorPost);
router.post("/editorFeature", api.editorFeature);
router.get("/who/", api.who);
router.get("/avatar/:username.jpg", api.avatar);
router.get("/checkname/", api.checkName);
router.get("/checkname/:username", api.checkName);

module.exports = router;