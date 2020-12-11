
const mongoose = require('mongoose');

const monthlyPlansSchema = mongoose.Schema({
    _id		            : mongoose.Schema.Types.ObjectId,
    startDate           : String,
    endDate             : String,
    month               : String,
    year                : String,
    projectCategoryType : String, //"LHWRFGrand" or "ProjectFund"
    projectName         : String,
    type                : String,
    center_ID           : String,
    center              : String,
    sector_ID           : String,
    sectorName          : String,
    activityName        : String,
    activity_ID         : String,
    subactivity_ID      : String,
    subactivityName     : String,
    unit                : String,
    physicalUnit        : Number,
    unitCost            : Number,
    totalBudget         : Number,
    noOfBeneficiaries   : Number,
    noOfFamilies        : Number,
    LHWRF               : Number,
    NABARD              : Number,
    bankLoan            : Number,
    govtscheme          : Number,
    directCC            : Number,
    indirectCC          : Number,
    other               : Number,
    remark              : String,
    fileName            : String,
    createdAt           : Date,
    updatedAt           : Date,
    uploadTime          : Date,
});

module.exports = mongoose.model('monthlyPlans',monthlyPlansSchema);




