const mongoose = require('mongoose');

const unitsSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    unit            		: String,
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('units',unitsSchema);



     