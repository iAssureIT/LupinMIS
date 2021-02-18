const express 	= require("express");
const router 	= express.Router();

const ListOfbeneficiaryController = require('../controllers/beneficiaries');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   ListOfbeneficiaryController.create_listOfbeneficiary);

router.post('/bulk_upload_beneficiary',ListOfbeneficiaryController.bulk_upload_benificiaries);

router.patch('/update', ListOfbeneficiaryController.update_listOfbeneficiary);

router.get('/list/:center_ID/:UIDStatus', ListOfbeneficiaryController.list_listOfbeneficiary); 
/*withUID : withuid or withoutuid or all*/

// router.patch('/update',  checkAuth, ListOfbeneficiaryController.update_listOfbeneficiary);
 
// router.get('/list/:center_ID', checkAuth, ListOfbeneficiaryController.list_listOfbeneficiary);

// router.get('/count/:center_ID', checkAuth, ListOfbeneficiaryController.count_listOfbeneficiary);
// router.post('/list/:center_ID', checkAuth, ListOfbeneficiaryController.list_listOfbeneficiary_with_limits);
router.get('/count/:center_ID', ListOfbeneficiaryController.count_listOfbeneficiary);
router.post('/list/:center_ID', ListOfbeneficiaryController.list_listOfbeneficiary_with_limits);

// router.get('/get/beneficiary/list/:centerID/:district/:blocks/:village/:startRange/:limitRange',  ListOfbeneficiaryController.list_beneficiary_centerwise);
router.get('/get/beneficiary/list/:centerID/:district/:blocks/:village',  ListOfbeneficiaryController.list_beneficiary_centerwise);

router.post('/get/beneficiary/list',  ListOfbeneficiaryController.list_beneficiary_filterwise);

router.get('/:listOfbeneficiaryID',  ListOfbeneficiaryController.fetch_listOfbeneficiary);

router.get('/get/filedetails/:center_ID/:fileName',ListOfbeneficiaryController.filedetails);

router.post('/get/files',ListOfbeneficiaryController.fetch_file); 

router.get('/get/files/count/:center_ID',ListOfbeneficiaryController.fetch_file_count);

router.delete('/file/delete/:fileName/:uploadTime',ListOfbeneficiaryController.delete_file);

router.delete('/:listOfbeneficiaryID',  ListOfbeneficiaryController.delete_listOfbeneficiary);

router.post('/searchValue/:center_ID',  ListOfbeneficiaryController.search_beneficiary); 
/*get all */
router.post('/get/all', ListOfbeneficiaryController.getAllBeneficiaries); 

module.exports = router;