const express 	= require("express");
const router 	= express.Router();

const UnitController = require('../controllers/units');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',  UnitController.create_units);
router.patch('/update',  UnitController.update_units);
router.get('/list',  UnitController.list_units);
router.delete('/:ID',  UnitController.delete_units);
router.get('/:ID',  UnitController.fetch_units);

module.exports = router;