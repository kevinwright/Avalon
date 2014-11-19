var express = require('express');
var router = express.Router();

var help = require("../controller/help");
var avalon = require("../controller/avalon");

router.get('/', help.index);
router.get('/sections/:section.html', help.section);
router.get('/sections/:section', help.section);

// backwards compatible
router.get('/pages/:page.news.html', help.page);
router.get('/pages/:page.mod.html', help.page);
router.get('/pages/:page.ord.html', help.page);
router.get('/pages/:page.anc.html', help.page);
router.get('/pages/:page.html', help.page);

router.get('/pages/:page', help.page);
router.get("/search", help.search);

module.exports = router;