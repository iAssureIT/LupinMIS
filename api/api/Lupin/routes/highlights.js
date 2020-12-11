const express 	= require("express");
const router 	= express.Router();

const HighlightController = require('../controllers/highlights');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   HighlightController.create_highlight);
router.patch('/update',   HighlightController.update_highlight);

router.get('/list/:center_ID',  HighlightController.list_highlight);
router.get('/count/:center_ID',  HighlightController.count_highlight);
router.get('/list/:startRange/:limitRange/:center_ID',  HighlightController.list_highlight_with_limits);

router.get('/:highlightID',  HighlightController.fetch_highlight);

router.delete('/:highlightID',  HighlightController.delete_highlight);

module.exports = router;