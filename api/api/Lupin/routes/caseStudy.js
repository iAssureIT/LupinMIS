const express 	= require("express");
const router 	= express.Router();

const CaseStudyController = require('../controllers/caseStudy');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   CaseStudyController.create_caseStudy);
router.patch('/update',   CaseStudyController.update_caseStudy);

router.get('/list/:center_ID',  CaseStudyController.list_caseStudy);
router.get('/count/:center_ID',  CaseStudyController.count_caseStudy);
router.get('/list/:startRange/:limitRange/:center_ID',  CaseStudyController.list_caseStudy_with_limits);

router.get('/:caseStudyID',  CaseStudyController.fetch_caseStudy);

router.delete('/:caseStudyID',  CaseStudyController.delete_caseStudy);

module.exports = router;