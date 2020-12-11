const express 	= require("express");
const router 	= express.Router();

const DistrictController = require('../controllers/districts');

router.get('/get/list/:countryCode/:stateCode', DistrictController.getDistricts);

router.get('/get/alllist/:countryID/:stateID', DistrictController.getDistrictsList);

router.post('/get/list', DistrictController.getDistrictsFromMultipleStates);

router.post('/post/bulkinsert', DistrictController.bulkinsert);
 
router.get('/get/filedetails/:fileName',DistrictController.filedetails);

router.get('/get/:districtID', DistrictController.fetchDistrict);

router.delete('/:districtID', DistrictController.deleteDistict);

module.exports = router;