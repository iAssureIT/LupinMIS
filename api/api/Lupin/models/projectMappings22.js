
const mongoose = require('mongoose');

const projectMappingsSchema = mongoose.Schema({
    _id             : mongoose.Schema.Types.ObjectId,
    type_ID         : { type: mongoose.Schema.Types.ObjectId, ref: 'typeofgoals' },
    goalName        : String,
    projectName     : String,
    startDate       : String,
    endDate         : String,
    sector          : [{
                        sector_ID    : String,
                        sectorName   : String,
                        activity_ID  : String,
                        activityName : String,
                        subActivity_ID  : String,
                        subActivityName : String,
                    }],
    createdAt       : Date,
});

module.exports = mongoose.model('projectMappings',projectMappingsSchema);