const mongoose = require('mongoose');

const typeofcenterSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    typeofCenter            : String,
    createdBy               : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt               : Date,
});

module.exports = mongoose.model('typeofcenters',typeofcenterSchema);



     