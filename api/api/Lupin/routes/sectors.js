const express 	= require("express");
const router 	= express.Router();

const sectorsController = require('../controllers/sectors');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',  sectorsController.create_sectors);

router.post('/activity',sectorsController.fetch_sectors_nonduplicate_activity);

router.patch('/update',  sectorsController.update_sectors);

router.patch('/activity',  sectorsController.insert_activity);
router.patch('/activity/update',  sectorsController.update_activity);

router.patch('/activity/delete/:sectorsID/:activityID',  sectorsController.delete_activity);

router.patch('/subactivity',   sectorsController.insert_subactivity);
router.patch('/subactivity/update',   sectorsController.update_subactivity);

router.patch('/subactivity/delete/:sectorsID/:activityID/:subActivityID',  sectorsController.delete_subactivity);

router.get('/list',  sectorsController.list_sectors);
router.get('/count',  sectorsController.sectors_length);
router.get('/activity/count',  sectorsController.activity_length);
router.get('/subactivity/count',  sectorsController.subactivity_length);
router.post('/list',  sectorsController.list_sectors_with_limits);
router.post('/activity/list',  sectorsController.list_activity_with_limits);
router.get('/activity/list',  sectorsController.list_activity);
router.post('/subactivity/list',  sectorsController.list_subactivity_with_limits);
router.get('/subactivity/list',  sectorsController.list_subactivity);

router.get('/:sectorsID',   sectorsController.fetch_sectors);

router.delete('/delete/:sectorsID',  sectorsController.delete_sectors);

module.exports = router;