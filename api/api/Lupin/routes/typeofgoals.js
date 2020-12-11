const express 	= require("express");
const router 	= express.Router();

const TypeOfGoalController = require('../controllers/typeofgoals.js');
const checkAuth = require('../../coreAdmin/middlerware/check-auth.js');

router.post('/',   TypeOfGoalController.create_typeofgoal);
router.patch('/update',   TypeOfGoalController.update_typeofgoal);
router.get('/list',   TypeOfGoalController.list_typeofgoal);
router.delete('/:ID',  TypeOfGoalController.delete_typeofgoal);
router.get('/:ID',   TypeOfGoalController.fetch_typeofgoal);


router.patch('/goalName',  TypeOfGoalController.insert_goalName);
router.patch('/goalName/update',  TypeOfGoalController.update_goalName);

router.patch('/goalName/delete/:ID/:goal_ID',  TypeOfGoalController.delete_goalName);
router.post('/goalName/list',  TypeOfGoalController.list_goalName_with_limits);

module.exports = router;