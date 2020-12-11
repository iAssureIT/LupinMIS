const express 	= require("express");
const router 	= express.Router();

const BeneficiaryFamiliesController = require('../controllers/families');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   BeneficiaryFamiliesController.create_beneficiaryFamilies);
router.patch('/update',   BeneficiaryFamiliesController.update_beneficiaryFamilies);

router.get('/list/:center_ID',  BeneficiaryFamiliesController.list_beneficiaryFamilies);
router.get('/count/:center_ID',  BeneficiaryFamiliesController.count_beneficiaryFamilies);
router.post('/list/:center_ID',  BeneficiaryFamiliesController.list_beneficiaryFamilies_with_limits);

router.get('/:beneficiaryFamiliesID',   BeneficiaryFamiliesController.fetch_beneficiaryFamilies);

router.post('/bulk_upload_families',BeneficiaryFamiliesController.bulk_upload_families);

router.get('/get/filedetails/:center_ID/:fileName',BeneficiaryFamiliesController.filedetails);

router.post('/get/files',BeneficiaryFamiliesController.fetch_file); 

router.get('/get/files/count/:center_ID',BeneficiaryFamiliesController.fetch_file_count);

router.delete('/file/delete/:fileName/:uploadTime',BeneficiaryFamiliesController.delete_file);

router.delete('/:beneficiaryFamiliesID',  BeneficiaryFamiliesController.delete_beneficiaryFamilies);

router.post('/searchValue/:center_ID',BeneficiaryFamiliesController.family_search); 

router.post('/get/family/list',  BeneficiaryFamiliesController.list_beneficiary_centerwise);

module.exports = router;