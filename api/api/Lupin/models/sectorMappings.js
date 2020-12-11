
const mongoose = require('mongoose'); 

const sectorMappingsSchema = mongoose.Schema({
    _id             : mongoose.Schema.Types.ObjectId,
    type_ID         : { type: mongoose.Schema.Types.ObjectId, ref: 'typeofgoals' },
    goal            : String,
    sector          : [{
                        sector_ID : String,
                        sectorName   : String,
                        activity_ID : String,
                        activityName : String,
                    }],
    createdAt       : Date,
});

module.exports = mongoose.model('sectorMappings',sectorMappingsSchema);