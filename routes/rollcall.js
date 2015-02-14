var express = require('express');
var router = express.Router();

var rollcall = require("../controller/rollcall");

router.get(['/', "/index.html"], rollcall.index);
router.get(['/order/:order', "/orders/:order"], rollcall.list);
router.get(['/guild/:guild', "/guilds/:guild"], rollcall.list);
router.get(['/city/:city', "/cities/:city"], rollcall.list);
router.get('/characters/:character.html', rollcall.character);
router.get(['/characters/:character', '/character/:character'], rollcall.character);
router.get('/deities', rollcall.deities);
router.get(['/list', "/list.html"], rollcall.redirect);

module.exports = router;