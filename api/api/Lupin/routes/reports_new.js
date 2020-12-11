const express                         = require("express");
const router 	                      = express.Router();
const ReportsNewController 			  = require('../controllers/reports_new.js');
const PlanningReportsController 	  = require('../controllers/planningReports.js');
const Reports2Controller              = require('../controllers/reports2.js');
const checkAuth                       = require('../../coreAdmin/middlerware/check-auth.js');

//code on 25-Feb-2020 Anagha
router.get('/sector_annual_plans/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsNewController.reports_new_sector_annual_plan);

router.get('/sector_periodic_plans/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsNewController.reports_new_sector_periodic_plan);

router.get('/sector_annual_achievement_reports/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  ReportsNewController.reports_new_sector_annual_achievement_report);

router.get('/activity_annual_plans/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  ReportsNewController.reports_new_activity__annual_plan);

router.get('/activity_periodic_plans/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  ReportsNewController.reports_new_activity_periodic_plan);

router.get('/activity_annual_achievement_reports/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  ReportsNewController.reports_new_activity_annual_achievement_report);

router.get('/geographical_annual_achievement_reports/:startDate/:endDate/:center_ID/:district/:block/:village/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID',  ReportsNewController.reports_new_geographical_annual_achievement_report);

router.get('/category_reports/:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus/:income/:land/:special',  ReportsNewController.report_new_category);

router.get('/category_report_count/:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus/:income/:land/:special',  ReportsNewController.report_category);


// Priyanka
//Planning Reports
router.get('/sector_quarterly_plans/:quarter/:year/:center_ID/:projectCategoryType/:projectName',  PlanningReportsController.reports_new_sector_quarterly_plan);

router.get('/sector_annualPlan/:year/:center_ID/:projectCategoryType/:projectName',  PlanningReportsController.reports_sector_annual_plan);

router.get('/activity_quarterly_plans/:quarter/:year/:center_ID/:projectCategoryType/:projectName/:sector_ID/:activity_ID/:subactivity_ID' ,  PlanningReportsController.reports_new_activity_quarterly_plan);

router.get('/activity_annual_plans/:year/:center_ID/:projectCategoryType/:projectName/:sector_ID/:activity_ID/:subactivity_ID' ,  PlanningReportsController.reports_activity_annual_plan);

//Reporting System

router.get('/activitywise_report/:startDate/:endDate/:center_ID/:sector_ID/:projectCategoryType/:projectName/:uidstatus/:activity_ID/:subactivity_ID' ,  Reports2Controller.activitywise_report);

router.get('/sectorwise_report/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:uidstatus',  Reports2Controller.sectorwise_report);

router.get('/center_wise_Achievements/:startDate/:endDate',  Reports2Controller.center_wise_Achievements);

router.get('/plan_vs_Achivement_Financial/:startDate/:endDate/:center_ID',  Reports2Controller.plan_vs_Achivement_Financial);

router.get('/plan_vs_Achievement_Physical/:startDate/:endDate/:center_ID',  Reports2Controller.plan_vs_Achievement_Physical);

router.get('/cumulative_Data/:startDate/:endDate/:center_ID',  Reports2Controller.cumulative_Data);

//Goal Reports
router.get('/goal/:startDate/:endDate/:center_ID/:goal_type/:goal/:uidstatus/:projectCategoryType/:projectName/:district',  Reports2Controller.report_goal);

module.exports = router;