
const mongoose = require('mongoose');

const listOfbeneficiarySchema = mongoose.Schema({
    _id		            	: mongoose.Schema.Types.ObjectId,
    family_ID            	: String,
    familyID            	: String,
    beneficiaryID      		: String,
    surnameOfBeneficiary    : String,
    firstNameOfBeneficiary  : String,
    middleNameOfBeneficiary : String,
    uidNumber               : String,
    relation			  	: String,
    genderOfbeneficiary     : String,
    birthYearOfbeneficiary  : String,
    center_ID               : String,
    center          		: String,
    isUpgraded              : String, //for ActivityReport Purpose
    upgradedInActivity      : String,
    fileName                : String,
    uploadTime              : Date,
    createdAt           	: Date
});

module.exports = mongoose.model('listOfbeneficiary',listOfbeneficiarySchema);


