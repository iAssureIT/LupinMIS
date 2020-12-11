const express 	= require("express");
const router 	= express.Router();
const ReportsController = require('../controllers/reports_dashboard.js');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.get('/center_admin/:startDate/:endDate',  ReportsController.report_center);

router.get('/sector_admin/:startDate/:endDate',  ReportsController.report_sector);

router.get('/sector_center/:center_ID/:startDate/:endDate',  ReportsController.report_sector_center);

router.get('/sector_familyupgrade_outreach_count/:center_ID/:startDate/:endDate',ReportsController.sector_familyupgrade_outreach_count);

router.get('/list_count_center_district_blocks_villages',ReportsController.list_count_center_district_blocks_villages);

router.get('/list_count_center_district_blocks_villages_list/:center_ID/:district/:block',ReportsController.list_count_center_district_blocks_villages_list);

module.exports = router;