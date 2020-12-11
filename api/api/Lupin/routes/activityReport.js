const express 	= require("express");
const router 	= express.Router();

const ActivityReportController = require('../controllers/activityReport');
const ActivityBulkUploadController = require('../controllers/activityBulkUpload.js');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',  ActivityReportController.create_activityReport);
router.patch('/',  ActivityReportController.update_activityReport);

router.get('/list/:center_ID', ActivityReportController.list_activityReport);

router.get('/count/:center_ID/:year/:typeofactivity', ActivityReportController.count_activityReport);

router.post('/list/:center_ID', ActivityReportController.list_activityReport_with_limits);

router.get('/:activityReportID', ActivityReportController.fetch_activityReport);
 
router.delete('/:activityReportID', ActivityReportController.delete_activityReport);

router.get('/annualCompletion/:activity_ID/:subactivity_ID/:startDate/:endDate', ActivityReportController.fetch_activityReport_annual_completion_Data);

router.get('/list/:center_ID/:startDate/:endDate', ActivityReportController.fetch_activityReport_annual_Data);

router.get('/get/filedetails/:center_ID/:fileName',ActivityReportController.filedetails);

router.post('/get/files',ActivityReportController.fetch_file); 

router.get('/get/files/count/:center_ID',ActivityReportController.fetch_file_count);

router.delete('/file/delete/:fileName/:uploadTime',ActivityReportController.delete_file);

router.get('/get/beneficiaryFiledetails/:center_ID/:fileName',ActivityReportController.beneficiaryFiledetails);

router.post('/get/beneficiaryfiles',ActivityReportController.beneficiaryfiles); 

router.get('/get/beneficiaryFiles/count/:center_ID',ActivityReportController.beneficiaryFilesCount);

router.delete('/file/deleteBeneficiariesInActivity/:fileName',ActivityReportController.deleteBeneficiariesInActivity);

router.get('/filterlist/:center_ID/:startDate/:endDate/:sector_ID/:activity_ID/:subactivity_ID/:typeofactivity/:skip/:limit', ActivityReportController.fetch_activityReport_withFilters);

router.post('/filterlist', ActivityReportController.post_activityReport_withFilters);

/*Bulk Upload*/

// router.post('/bulk_upload_activities', ActivityReportController.bulk_upload_activities);

router.post('/bulk_upload_activities', ActivityBulkUploadController.bulk_upload_type_A_activities);
router.post('/bulk_upload_type_B_activities', ActivityBulkUploadController.bulk_upload_type_B_activities);


router.post('/bulk_upload_beneficiaries', ActivityReportController.bulk_upload_beneficiaries);

module.exports = router;