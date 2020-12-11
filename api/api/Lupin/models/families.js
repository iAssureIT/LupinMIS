
const mongoose = require('mongoose');

const familiesSchema = mongoose.Schema({
    _id		        : mongoose.Schema.Types.ObjectId,
    familyID        : String,
    mfamilyID       : String, 
    surnameOfFH     : String,
    firstNameOfFH   : String,
    middleNameOfFH  : String,
    contactNumber   : String,
    uidNumber       : String,
    caste           : String,
    incomeCategory  : String,
    landCategory    : String,
    specialCategory : String,
    center_ID       : String,
    center          : String,
    state           : String,
    dist            : String,
    block           : String,
    village         : String,
    FHGender        : String,
    FHYearOfBirth   : String,
    isUpgraded      : String, //for ActivityReport Purpose
    upgradedInActivity : String,
    fileName        : String,
    uploadTime      : Date,
    createdAt       : Date
});

module.exports = mongoose.model('families',familiesSchema);


