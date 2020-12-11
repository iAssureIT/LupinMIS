const express 	= require("express");
const router 	= express.Router();

const TypeOfCenterController = require('../controllers/typeofcenters.js');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',  TypeOfCenterController.create_typeofcenter);
router.patch('/update',  TypeOfCenterController.update_typeofcenter);
router.get('/list',  TypeOfCenterController.list_typeofcenter);
router.delete('/:ID',  TypeOfCenterController.delete_typeofcenter);
router.get('/:ID',  TypeOfCenterController.fetch_typeofcenter);

module.exports = router;