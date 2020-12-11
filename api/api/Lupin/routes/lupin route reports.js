const express 	= require("express");
const router 	= express.Router();

const ReportsController = require('../controllers/reports.js');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.get('/annual_completion/:year/:center_ID',  ReportsController.annual_completion);

router.get('/sector_wise_annual/:startDate/:endDate',  ReportsController.sector_wise)

module.exports = router;