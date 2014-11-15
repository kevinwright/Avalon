var express = require('express');
var router = express.Router();

var help = require("../controller/help");

router.get('/', help.index);
router.get('/sections/:section.html', help.section);
router.get('/sections/:section', help.section);
router.get('/pages/:page.html', help.page);
router.get('/pages/:page', help.page);
router.get("/search", help.search);

module.exports = router;