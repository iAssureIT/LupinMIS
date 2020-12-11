const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

const SectorMappingController = require('../controllers/sectorMappings');

router.post('/',   SectorMappingController.create_sectorMapping);
router.patch('/update',   SectorMappingController.update_sectorMapping);

router.get('/list',  SectorMappingController.list_sectorMapping);
router.get('/list_arraySector/:goalType/:goal',  SectorMappingController.list_sectors_with_goalType_goal);
router.get('/count',  SectorMappingController.count_sectorMapping);
router.get('/list/:startRange/:limitRange',  SectorMappingController.list_sectorMapping_with_limits);
router.get('/edit/list/:startRange/:limitRange',  SectorMappingController.list_sectorMapping_with_limits_edit);

router.get('/:sectorMappingID',   SectorMappingController.fetch_SectorMapping);

router.delete('/:sectorMappingID',  SectorMappingController.delete_sectorMapping);

module.exports = router;
