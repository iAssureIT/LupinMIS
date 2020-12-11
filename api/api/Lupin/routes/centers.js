const express 	= require("express");
const router 	= express.Router();

const CentersController = require('../controllers/centers');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   CentersController.create_centers);
router.patch('/',   CentersController.update_centers);

router.get('/list', CentersController.list_centers);
router.get('/count',  CentersController.count_centers);
router.get('/count/typeofcenter',  CentersController.count_centers_centerType);
router.get('/list/:startRange/:limitRange', CentersController.list_centers_with_limits);

router.get('/:centerID',   CentersController.fetch_centers);

router.delete('/:centerID',  CentersController.delete_centers);
// router.delete('/', checkAuth, CentersController.deleteall_centers);

router.post('/sendnotification',CentersController.mailIfMonthlyPlanNotFilled);

module.exports = router;