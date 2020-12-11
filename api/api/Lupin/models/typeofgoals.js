const mongoose = require('mongoose');

const typeofgoalSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    typeofGoal              : String,
    goal 			     	: [{
    								goalName : String,
    							}],
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('typeofgoals',typeofgoalSchema);



     