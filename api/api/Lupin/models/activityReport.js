
const mongoose = require('mongoose');

const activityReportSchema = mongoose.Schema({
    _id		            : mongoose.Schema.Types.ObjectId,
    projectCategoryType : String, //"LHWRFGrand" or "ProjectFund"
    projectName         : String,
    type                : String,
    center_ID           : String,
    centerName          : String,
    stateCode           : String,
    district            : String, 
    location            : String, 
    block               : String,
    village             : String,
    date                : String,  
    sector_ID           : String,
    sectorName          : String,
    typeofactivity      : String,
    activity_ID         : String,
    activityName        : String,
    subactivity_ID      : String,
    subactivityName     : String,
    unit                : String,
    unitCost            : Number,
    quantity            : Number,
    noOfBeneficiaries   : Number,
    totalCost           : Number,
    sourceofFund        : {
        LHWRF               : Number,
        NABARD              : Number,
        bankLoan            : Number,
        govtscheme          : Number,
        directCC            : Number,
        indirectCC          : Number,
        other               : Number,
        total               : Number
    },

    // listofBeneficiaries     : Array,
    listofBeneficiaries     :   [{
                                    beneficiary_ID      : {type: mongoose.Schema.Types.ObjectId, ref: 'listofbeneficiaries'},
                                    beneficiaryID       : String,
                                    family_ID           : String,
                                    familyID            : String,
                                    nameofbeneficiary   : String,
                                    relation            : String,
                                    dist                : String,
                                    block               : String,
                                    village             : String,
                                    originalUpgrade     : String,
                                    isUpgraded          : String,
                                    fileName            : String,
                                    caste                  : String,
                                    incomeCategory         : String,
                                    landCategory           : String,
                                    specialCategory        : String,
                                    genderOfbeneficiary    : String,
                                    birthYearOfbeneficiary : String,
                                    qtyPerBen              : Number,
                                    unitCost               : Number,
                                    totalCostPerBen        : Number,
                                    sourceofFund        : {
                                        LHWRF               : Number,
                                        NABARD              : Number,
                                        bankLoan            : Number,
                                        govtscheme          : Number,
                                        directCC            : Number,
                                        indirectCC          : Number,
                                        other               : Number,
                                        total               : Number
                                    },
                                }],
    remark                  : String,
    uploadTime              : Date,
    fileName                : String,
    createdAt               : Date
});
// activityReportSchema.index({ projectCategoryType: 1, projectName: 1, center_ID: true, sector_ID: true, activity_ID : true });
module.exports = mongoose.model('activityReport',activityReportSchema);
                  