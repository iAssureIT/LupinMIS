const mongoose = require('mongoose');

const sectorsSchema = mongoose.Schema({
	_id			    : mongoose.Schema.Types.ObjectId,
    sector          : String,
    sectorShortName : String,
    user_ID         : String,
    activity        : [{
                            activityName : String,
                            subActivity  : [{
                                                subActivityName     : String,
                                                unit                : String,
                                                familyUpgradation   : String,
                                                outreach            : String 
                                            }]
                        }],
    // createdBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },	
    createdAt       : Date,
});

module.exports = mongoose.model('sectors',sectorsSchema);
