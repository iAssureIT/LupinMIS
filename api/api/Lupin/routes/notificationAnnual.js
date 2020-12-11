const express 	= require("express");
const router 	= express.Router();

const NotificationAnnualController = require('../controllers/notificationAnnual');

router.get('/:runDate/:planYear', NotificationAnnualController.planReminder);

module.exports = router;
