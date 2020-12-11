const express 	= require("express");
const router 	= express.Router();

const BlocksController = require('../controllers/blocks');

router.get('/get/list/:countryCode/:stateCode/:districtName', BlocksController.getBlocks);

router.get('/get/alllist/:countryID/:stateID/:districtID', BlocksController.getBlocksList);

router.get('/get/BlocksByState/:countryCode/:stateCode', BlocksController.getBlocksByState);

router.post('/post/bulkinsert', BlocksController.bulkinsert);

router.get('/get/filedetails/:fileName',BlocksController.filedetails);

router.delete('/:blockID', BlocksController.deleteBlock);

module.exports = router;  