var express = require('express');
var router = express.Router();

var help = require("../controller/help");

router.get('/', help.index);
router.get('/sections/:section', help.section);
router.get('/pages/:page', help.page);


module.exports = router;