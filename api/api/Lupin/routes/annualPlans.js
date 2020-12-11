const express 	= require("express");
const router 	= express.Router();

const AnnualPlanController = require('../controllers/annualPlans');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   AnnualPlanController.create_annualPlan);

router.post('/bulk_upload_annual_plan',   AnnualPlanController.bulk_upload_annual_plan);

router.patch('/update',   AnnualPlanController.update_annualPlan);

router.get('/list/:center_ID',  AnnualPlanController.list_annualPlan);

router.get('/count/:center_ID',  AnnualPlanController.count_annualPlan);

router.post('/list',  AnnualPlanController.list_annualPlan_with_limits);

router.get('/list/:centerID/:year',  AnnualPlanController.fetch_annualPlan_with_ID_and_year);

router.get('/:annualPlanID',   AnnualPlanController.fetch_annualPlan);

router.get('/get/filedetails/:center_ID/:fileName',AnnualPlanController.filedetails);

router.post('/get/files',AnnualPlanController.fetch_file); 

router.get('/get/files/count/:center_ID',AnnualPlanController.fetch_file_count);

router.delete('/file/delete/:fileName',AnnualPlanController.delete_file);

router.delete('/:annualPlanID',  AnnualPlanController.delete_annualPlan); 

module.exports = router;