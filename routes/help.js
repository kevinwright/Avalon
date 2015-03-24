var express = require('express');
var router = express.Router();

var help = require("../controller/help");

router.get('/', help.index);
router.get('/index.html', help.index);
router.get('/full', help.full);

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
router.get('/pages', help.page);

module.exports = router;