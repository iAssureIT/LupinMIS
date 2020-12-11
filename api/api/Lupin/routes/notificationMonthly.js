const express 	= require("express");
const router 	= express.Router();

const NotificationMonthlyController = require('../controllers/notificationMonthly.js');

router.get('/:runDate/:planMonth/:planYear', NotificationMonthlyController.planReminder);

module.exports = router;
