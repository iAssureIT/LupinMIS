const express 	= require("express");
const router 	= express.Router();
const ReportsController = require('../controllers/reports.js');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');
const FamilyTrackingReportsController = require('../controllers/FamilyTrackingReports.js');


router.get('/activity/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus' ,  ReportsController.reports_activity);

router.get('/sector/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.reports_sector);

router.get('/geographical/:startDate/:endDate/:center_ID/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.reports_geographical);

router.get('/center/:startDate/:endDate/:center_ID/:centertype_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.report_center);

router.get('/village/:startDate/:endDate/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:center_ID/:activity_ID/:subactivity_ID',  ReportsController.report_village);


router.get('/category/:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus',  ReportsController.report_category);

router.get('/upgraded/:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus/:upgraded',  ReportsController.report_upgraded);

router.get('/source/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.report_source);

router.get('/goal/:startDate/:endDate/:center_ID/:goal_type/:goal/:uidstatus/:projectCategoryType/:projectName',  ReportsController.report_goal);

// router.get('/goal_project/:startDate/:endDate/:center_ID/:uidstatus/:projectName',  ReportsController.report_goal_project);

router.get('/dashboard/:startYear/:endYear/:center_ID',ReportsController.report_dashboard);

//code on 30-Dec-19 Anagha
router.get('/activity_annual_plan/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  ReportsController.reports_activity__annual_plan);
// router.get('/activity_annual_plan/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus' ,  ReportsController.reports_activity__annual_plan);

router.get('/activity_periodic_plan/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  ReportsController.reports_activity_periodic_plan);
// router.get('/activity_periodic_plan/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus' ,  ReportsController.reports_activity_periodic_plan);

router.get('/activity_annual_achievement_report/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  ReportsController.reports_activity_annual_achievement_report);
// router.get('/activity_annual_achievement_report/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus' ,  ReportsController.reports_activity_annual_achievement_report);

router.get('/sector_annual_plan/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.reports_sector_annual_plan);

router.get('/sector_periodic_plan/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.reports_sector_periodic_plan);

router.get('/sector_annual_achievement_report/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.reports_sector_annual_achievement_report);

router.get('/geographical_annual_achievement_report/:startDate/:endDate/:center_ID/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID',  ReportsController.reports_geographical_annual_achievement_report);
// router.get('/geographical_annual_achievement_report/:startDate/:endDate/:center_ID/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsController.reports_geographical_annual_achievement_report);

router.get('/tempquery',ReportsController.temp_controller);

router.get('/testannual/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus',ReportsController.test_annualreport)


/*family tracking Reports*/
router.get('/upgrade_family_report/:startDate/:endDate/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:center_ID/:activity_ID/:subactivity_ID/:isUpgraded',  FamilyTrackingReportsController.report_upgraded_family_coverage);

router.get('/report_upgraded_beneficiary_coverage/:startDate/:endDate/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:center_ID/:activity_ID/:subactivity_ID/:isUpgraded',  FamilyTrackingReportsController.report_upgraded_beneficiary_coverage);

router.get('/family_coverage/:startDate/:endDate/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:center_ID/:activity_ID/:subactivity_ID',  FamilyTrackingReportsController.report_family_coverage);

router.get('/report_category/:startDate/:endDate/:center_ID/:district/:block/:village',  FamilyTrackingReportsController.report_category);


module.exports = router;