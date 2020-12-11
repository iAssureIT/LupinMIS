const express 	= require("express");
const router 	= express.Router();

const MonthlyPlansController = require('../controllers/monthlyPlans');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   MonthlyPlansController.create_monthlyPlan);

router.post('/bulk_upload_manual_plan',MonthlyPlansController.bulk_upload_manual_plan);

router.patch('/update',   MonthlyPlansController.update_monthlyPlan);

router.get('/list/:center_ID',  MonthlyPlansController.list_monthlyPlan);

router.get('/count/:center_ID',  MonthlyPlansController.count_monthlyPlan);

router.post('/list',  MonthlyPlansController.list_monthlyPlan_with_limits);

router.get('/:monthlyPlanID',  MonthlyPlansController.fetch_monthlyPlan);

router.get('/get/filedetails/:center_ID/:fileName',MonthlyPlansController.filedetails);

router.post('/get/files',MonthlyPlansController.fetch_file); 

router.get('/get/files/count/:center_ID',MonthlyPlansController.fetch_file_count);

router.delete('/file/delete/:fileName/:month/:year/:uploadTime',MonthlyPlansController.delete_file);

router.delete('/:monthlyPlanID',  MonthlyPlansController.delete_monthlyPlan);


module.exports = router;