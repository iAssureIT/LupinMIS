const mongoose = require('mongoose');

const centersSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    type_ID                 : { type: mongoose.Schema.Types.ObjectId, ref: 'typeofcenters' },
    centerName              : String,
    address                 : { 
                                addressLine : String,
                                state       : String,
                                district    : String,
                                pincode     : String,
                                stateCode   : String
                            },
    districtsCovered        : Array,
    blocksCovered           : Array,
    villagesCovered         : Array,

    centerInchargeName      : String,
    centerInchargeMobile    : String,
    centerInchargeEmail     : String,
    
    establishmentDate       : Date,
    
    misCoordinatorName      : String,
    misCoordinatorMobile    : String,
    misCoordinatorEmail     : String,
    createdBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt           : Date,
});

module.exports = mongoose.model('centers',centersSchema);



     