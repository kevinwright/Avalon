var express = require('express');
var router = express.Router();

var bb = require("../controller/bb");

router.get('/', bb.index);
router.get('/index.html', bb.index);

router.get('/:board.html', bb.board);
router.get('/:board', bb.board);

router.get('/:board/section/participant-:person.html', bb.participant);
router.get('/:board/participant/:person', bb.participant);

router.get('/:board/:id.html', bb.post);
router.get('/:board/:id', bb.post);
router.get('/:board/:id/:subject.html', bb.post);
router.get('/:board/:id/:subject', bb.post);
router.get('/:board/:id/*', bb.post);



module.exports = router;