const express 	= require("express");
const router 	= express.Router();

const ProjectMappingController = require('../controllers/projectMappings');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   ProjectMappingController.create_projectMapping);
router.patch('/update',   ProjectMappingController.update_projectMapping);

router.get('/fetch/:projectMappingID',   ProjectMappingController.fetch_projectMapping);
router.get('/list',  ProjectMappingController.list_projectMapping);
router.get('/count',  ProjectMappingController.count_projectMapping);
router.get('/list/subarrayofactivity/:projectName',ProjectMappingController.list_sectors_with_array_activity);
router.get('/list/:startRange/:limitRange',  ProjectMappingController.list_projectMapping_with_limits);
router.get('/edit/list/:startRange/:limitRange',  ProjectMappingController.list_projectMapping_with_limits_edit);

router.delete('/:projectMappingID',  ProjectMappingController.delete_projectMapping);

module.exports = router;
