const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
const ObjectID          = require('mongodb').ObjectID;
var request             = require('request-promise');
var moment              = require('moment');
const ActivityReport    = require('../models/activityReport.js');
const Families          = require('../models/families');

exports.report_upgraded_beneficiary_coverage = (req,res,next)=>{
    var selector = {};
    selector["$and"] = [];
    selector["$and"].push({"date" : {$gte : req.params.startDate, $lte : req.params.endDate}});
    if(req.params.district !== "all"){
        selector["$and"].push({"district": req.params.district})
    }
    if(req.params.block !== "all"){
        selector["$and"].push({"block": req.params.block})
    }
    if(req.params.village !== "all"){
        selector["$and"].push({"village": req.params.village})
    }
    if(req.params.sector_ID !== "all"){
        selector["$and"].push({"sector_ID": req.params.sector_ID})
    }
    if(req.params.projectCategoryType !== "all"){
        selector["$and"].push({"projectCategoryType": req.params.projectCategoryType})
    }
    if(req.params.projectName !== "all"){
        selector["$and"].push({"projectName": req.params.projectName})
    }
    if(req.params.center_ID !== "all"){
        selector["$and"].push({"center_ID": req.params.center_ID})
    }
    if(req.params.activity_ID !== "all"){
        selector["$and"].push({"activity_ID": req.params.activity_ID})
    }
    if(req.params.subactivity_ID !== "all"){
        selector["$and"].push({"subactivity_ID": req.params.subactivity_ID})
    }
    var query = { $match : selector};
    var upgradedquery = "1";
    if(req.params.isUpgraded === 'Yes'){
        upgradedquery = {
                    $match : { 
                                "listofBeneficiaries.isUpgraded" : "Yes"
                            }
                };
    }else if(req.params.isUpgraded === 'No'){
        upgradedquery = {
                    $match : { 
                                "listofBeneficiaries.isUpgraded" : "No"
                            }
                    };
    }else{
        upgradedquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : "-"}
                            }
                };
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : "-"
                            }
                    };
    }else{
        uidquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    ActivityReport.aggregate(
                            [
                                query,
                                {
                                    $unwind : "$listofBeneficiaries"
                                },
                                
                                {
                                    $lookup : {
                                            from          : "listofbeneficiaries",
                                            localField    : "listofBeneficiaries.beneficiary_ID",
                                            foreignField  : "_id",
                                            as            : "listofBeneficiaries1"
                                    }
                                },
                                {
                                    $unwind : "$listofBeneficiaries1"
                                },
                                {
                                    $project : {
                                        // "family" :"$family",
                                        // "familyID1" :"$family.familyID",
                                        "surnameOfBeneficiary"                      : "$listofBeneficiaries1.surnameOfBeneficiary",
                                        "firstNameOfBeneficiary"                    : "$listofBeneficiaries1.firstNameOfBeneficiary",
                                        "middleNameOfBeneficiary"                   : "$listofBeneficiaries1.middleNameOfBeneficiary",
                                        "name_beneficiary"                          : { $concat: [ "$listofBeneficiaries1.surnameOfBeneficiary", " ", "$listofBeneficiaries1.firstNameOfBeneficiary", " ","$listofBeneficiaries1.middleNameOfBeneficiary"] },
                                        "listofBeneficiaries.beneficiary_ID"        : 1,
                                        "listofBeneficiaries.family_ID"             : 1,
                                        "listofBeneficiaries.beneficiaryID"         : 1,
                                        "listofBeneficiaries.family_ID"             : 1,
                                        "listofBeneficiaries.familyID"              : 1,
                                        "listofBeneficiaries.uidNumber"             : "$listofBeneficiaries1.uidNumber",
                                        "listofBeneficiaries.center_ID"             : "$listofBeneficiaries1.center_ID",
                                        "listofBeneficiaries.isUpgraded"            : "$listofBeneficiaries.isUpgraded",
                                        "listofBeneficiaries.unitCost"              : "$listofBeneficiaries.unitCost",
                                        "listofBeneficiaries.totalCostPerBen"       : "$listofBeneficiaries.totalCostPerBen",
                                        "listofBeneficiaries.qtyPerBen"             : "$listofBeneficiaries.qtyPerBen",
                                        "listofBeneficiaries.sourceofFund"          : "$listofBeneficiaries.sourceofFund",
                                        "activity_ID"                               : 1,
                                        "activityName"                              : 1,
                                        "subactivity_ID"                            : 1,
                                        "subactivityName"                           : 1,
                                        "date"                                      : 1,
                                        "unit"                                      : 1,
                                        "sectorName"                                : 1,
                                        "unitCost"                                  : 1,
                                        "quantity"                                  : 1,
                                        "totalcost"                                 : 1,
                                        "sourceofFund"                              : 1,
                                        "projectCategoryType"                       : 1,
                                        "projectName"                               : 1,
                                        "remark"                                    : 1,
                                        "district"                                  : 1,
                                        "block"                                     : 1,
                                        "village"                                   : 1,
                                    }
                                },
                                uidquery,
                                upgradedquery,
                                {
                                    $group : {
                                        "_id"       : {
                                                        // "familyID1"         : "$familyID1",
                                                        "surnameOfBeneficiary"     : "$surnameOfBeneficiary",
                                                        "firstNameOfBeneficiary"   : "$firstNameOfBeneficiary",
                                                        "middleNameOfBeneficiary"  : "$middleNameOfBeneficiary",
                                                        "name_beneficiary"         : "$name_beneficiary",
                                                        "beneficiaryID"            : "$listofBeneficiaries.beneficiaryID",
                                                        "familyID"                 : "$listofBeneficiaries.familyID",
                                                        "sector_ID"                : "$sector_ID",
                                                        "activity_ID"              : "$activity_ID",
                                                        "subactivity_ID"           : "$subactivity_ID",
                                                        "sectorName"               : "$sectorName",
                                                        "activityName"             : "$activityName",
                                                        "subactivityName"          : "$subactivityName",
                                                        "unit"                     : "$unit",
                                                        "date"                     : "$date",
                                                        "center_ID"                : "$listofBeneficiaries.center_ID",
                                                        "uidNumber"                : "$listofBeneficiaries.uidNumber",
                                                        "isUpgraded"               : "$listofBeneficiaries.isUpgraded",
                                                        "unitCost"                 : "$listofBeneficiaries.unitCost",
                                                        // "center_ID"         : "$center_ID",

                                                    },
                                        "projectCategoryType" : { "$first" : "$projectCategoryType"},
                                        "projectName"         : { "$first" : "$projectName"},
                                        "district"            : { "$first" : "$district"},
                                        "block"               : { "$first" : "$block"},
                                        "village"             : { "$first" : "$village"},

                                        "quantity"            : { "$sum" : "$listofBeneficiaries.qtyPerBen"},
                                        "totalCost"           : { "$sum" : "$listofBeneficiaries.totalCostPerBen"},
                                        "LHWRF"               : { "$sum" : "$listofBeneficiaries.sourceofFund.LHWRF"},
                                        "NABARD"              : { "$sum" : "$listofBeneficiaries.sourceofFund.NABARD"},
                                        "Bank_Loan"           : { "$sum" : "$listofBeneficiaries.sourceofFund.bankLoan"},
                                        "Govt"                : { "$sum" : "$listofBeneficiaries.sourceofFund.govtscheme"},
                                        "DirectCC"            : { "$sum" : "$listofBeneficiaries.sourceofFund.directCC"},
                                        "IndirectCC"          : { "$sum" : "$listofBeneficiaries.sourceofFund.indirectCC"},
                                        "Other"               : { "$sum" : "$listofBeneficiaries.sourceofFund.other"},
                                        "total"               : { "$sum" : "$listofBeneficiaries.sourceofFund.total"},
                                        "remark"              : { "$first" : "$remark"},
                                    }
                                },
                                { "$group": {
                                    "_id": {
                                            // "familyID1"       : "$_id.familyID1",
                                            "surnameOfBeneficiary"   : "$_id.surnameOfBeneficiary",
                                            "firstNameOfBeneficiary" : "$_id.firstNameOfBeneficiary",
                                            "middleNameOfBeneficiary": "$_id.middleNameOfBeneficiary",
                                            "name_beneficiary"       : "$_id.name_beneficiary",
                                            "familyID"               : "$_id.familyID",
                                            "beneficiaryID"          : "$_id.beneficiaryID",
                                            "center_ID"              : "$_id.center_ID",
                                    },
                                    "sectorData": { 
                                        "$push": { 
                                            "name"              : { $concat: [ "<div class='wrapText  text-left'><b>Sector : </b>", "$_id.sectorName", "<br/><b>Activity : </b>", "$_id.activityName","<br/><b>Sub-Activity : </b>","$_id.subactivityName","</div>"] },
                                            "sectorName"        : "$_id.sectorName",
                                            "activity_ID"       : "$_id.activity_ID",
                                            "activityName"      : "$_id.activityName",
                                            "subactivity_ID"    : "$_id.subactivity_ID",
                                            "subactivityName"   : "$_id.subactivityName",
                                            "unit"              : "$_id.unit",
                                            "date"              : "$_id.date",
                                            "unitCost"          : "$_id.unitCost",
                                            "uidNumber"         : "$_id.uidNumber",
                                            "isUpgraded"        : "$_id.isUpgraded",
                                            "projectCategoryType": "$projectCategoryType",
                                            "projectName"        : "$projectName",
                                            "district"           : "$district",
                                            "block"              : "$block",
                                            "village"            : "$village",

                                            "quantity"          : "$quantity",
                                            "totalCost"         : "$totalCost",
                                            "LHWRF"             : "$LHWRF",
                                            "NABARD"            : "$NABARD",
                                            "Bank_Loan"         : "$Bank_Loan",
                                            "Govt"              : "$Govt",
                                            "DirectCC"          : "$DirectCC",
                                            "IndirectCC"        : "$IndirectCC",
                                            "Other"             : "$Other",
                                            "total"             : "$total",
                                            "remark"            : "$remark",
                                        },
                                    },
                                }},
                                { "$sort": { "count": -1 } },
                            ]
                        )
                    .sort({"beneficiaryID":1})
                    .exec()
                    .then(familyData=>{
                        // console.log('familyData',familyData);
                        for(i = 0 ; i < familyData.length ; i ++){
                            var totalLHWRF             =  0;
                            var totalNABARD            =  0;
                            var totalBank_Loan         =  0;
                            var totalGovt              =  0;
                            var totalDirectCC          =  0;
                            var totalIndirectCC        =  0;
                            var totalOther             =  0;
                            var totaltotal             =  0;
                            for(j = 0 ; j < familyData[i].sectorData.length ; j ++){
                                totalLHWRF             += familyData[i].sectorData[j].LHWRF;
                                totalNABARD            += familyData[i].sectorData[j].NABARD;
                                totalBank_Loan         += familyData[i].sectorData[j].Bank_Loan;
                                totalGovt              += familyData[i].sectorData[j].Govt;
                                totalDirectCC          += familyData[i].sectorData[j].DirectCC;
                                totalIndirectCC        += familyData[i].sectorData[j].IndirectCC;
                                totalOther             += familyData[i].sectorData[j].Other;
                                totaltotal             += familyData[i].sectorData[j].total;
                                var totalSectorsData = {
                                    "name"               :  "-",
                                    "sectorName"         :  "-",
                                    "activity_ID"        :  "-",
                                    "activityName"       :  "-",
                                    "subactivity_ID"     :  "-",
                                    "subactivityName"    :  "-",
                                    "unit"               :  "Total",
                                    "date"               :  "-",
                                    "unitCost"           :  "-",
                                    "quantity"           :  "-",
                                    "uidNumber"          :  "-",
                                    "isUpgraded"         :  "-",
                                    "LHWRF"              :  totalLHWRF,
                                    "NABARD"             :  totalNABARD,
                                    "Bank_Loan"          :  totalBank_Loan,
                                    "Govt"               :  totalGovt,
                                    "DirectCC"           :  totalDirectCC,
                                    "IndirectCC"         :  totalIndirectCC,
                                    "Other"              :  totalOther,
                                    "total"              :  totaltotal,
                                    "projectCategoryType":  "-",
                                    "projectName"        :  "-",
                                    "center_ID"          :  "-",
                                    "district"           :  "-",
                                    "block"              :  "-",
                                    "village"            :  "-",
                                }
                            }
                            familyData[i].sectorData.push(totalSectorsData);
                            // console.log('totalSectorsData',totalSectorsData);
                            // console.log('familyData[i].sectorData',familyData[i].sectorData);
                        }
                        res.status(200).json(familyData);
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(200).json(err);
                    });
}
exports.report_upgraded_family_coverage = (req,res,next)=>{
    var selector = {};
    selector["$and"] = [];
    selector["$and"].push({"date" : {$gte : req.params.startDate, $lte : req.params.endDate}});
    if(req.params.district !== "all"){
        selector["$and"].push({"district": req.params.district})
    }
    if(req.params.center_ID !== "all"){
        selector["$and"].push({"center_ID": req.params.center_ID})
    }
    if(req.params.block !== "all"){
        selector["$and"].push({"block": req.params.block})
    }
    if(req.params.village !== "all"){
        selector["$and"].push({"village": req.params.village})
    }
    if(req.params.sector_ID !== "all"){
        selector["$and"].push({"sector_ID": req.params.sector_ID})
    }
    if(req.params.projectCategoryType !== "all"){
        selector["$and"].push({"projectCategoryType": req.params.projectCategoryType})
    }
    if(req.params.projectName !== "all"){
        selector["$and"].push({"projectName": req.params.projectName})
    }
    if(req.params.activity_ID !== "all"){
        selector["$and"].push({"activity_ID": req.params.activity_ID})
    }
    if(req.params.subactivity_ID !== "all"){
        selector["$and"].push({"subactivity_ID": req.params.subactivity_ID})
    }
    var query = { $match : selector};
    var upgradedquery = "1";
    if(req.params.isUpgraded === 'Yes'){
        upgradedquery = {
                    $match : { 
                                "listofBeneficiaries.isUpgraded" : "Yes"
                            }
                };
    }else if(req.params.isUpgraded === 'No'){
        upgradedquery = {
                    $match : { 
                                "listofBeneficiaries.isUpgraded" : "No"
                            }
                    };
    }else{
        upgradedquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : "-"}
                            }
                };
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : "-"
                            }
                    };
    }else{
        uidquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    
    ActivityReport.aggregate(
                            [
                                query,
                                {
                                    $unwind : "$listofBeneficiaries"
                                },
                                
                                {
                                    $lookup : {
                                            from          : "listofbeneficiaries",
                                            localField    : "listofBeneficiaries.beneficiary_ID",
                                            foreignField  : "_id",
                                            as            : "listofBeneficiaries1"
                                    }
                                },
                                {
                                    $unwind : "$listofBeneficiaries1"
                                },
                                {
                                    $addFields: {
                                        "family_ID": { $toObjectId:"$listofBeneficiaries1.family_ID" }
                                    }
                                },                              
                                {
                                    $lookup : {
                                            from          : "families",
                                            localField    : "family_ID",
                                            foreignField  : "_id",
                                            as            : "family"
                                    }
                                },
                                {
                                    $unwind : "$family" 
                                },
                                {
                                    $project : {
                                        "family"                                    : "$family",
                                        "familyID1"                                 : "$family.familyID",
                                        "uidNumber"                                 : "$family.uidNumber",
                                        "name_family"                               : { $concat: [ "$family.surnameOfFH", " ", "$family.firstNameOfFH", " ","$family.middleNameOfFH"] },
                                        "listofBeneficiaries.beneficiary_ID"        : 1,
                                        "listofBeneficiaries.family_ID"             : 1,
                                        "listofBeneficiaries.beneficiaryID"         : 1,
                                        "listofBeneficiaries.family_ID"             : 1,
                                        "listofBeneficiaries.familyID"              : 1,
                                        "listofBeneficiaries.isUpgraded"            : 1,
                                        // "center_ID"                                 : 1,
                                        "listofBeneficiaries.unitCost"              : "$listofBeneficiaries.unitCost",
                                        "listofBeneficiaries.totalCostPerBen"       : "$listofBeneficiaries.totalCostPerBen",
                                        "listofBeneficiaries.qtyPerBen"             : "$listofBeneficiaries.qtyPerBen",
                                        "listofBeneficiaries.sourceofFund"          : "$listofBeneficiaries.sourceofFund",
                                        "date"                                      : 1,
                                        "activity_ID"                               : 1,
                                        "activityName"                              : 1,
                                        "subactivity_ID"                            : 1,
                                        "subactivityName"                           : 1,
                                        "unit"                                      : 1,
                                        "sectorName"                                : 1,
                                        "unitCost"                                  : 1,
                                        "quantity"                                  : 1,
                                        "totalcost"                                 : 1,
                                        "sourceofFund"                              : 1,
                                        "projectCategoryType"                       : 1,
                                        "projectName"                               : 1,
                                        "center_ID"                                 : 1,
                                        "district"                                  : 1,
                                        "block"                                     : 1,
                                        "village"                                   : 1,
                                        "remark"                                    : 1,
                                    }
                                },
                                uidquery,
                                upgradedquery,
                                {
                                    $group : {
                                        "_id"       : {
                                                        "familyID1"       : "$familyID1",
                                                        "name_family"       : "$name_family",
                                                        "familyID"          : "$listofBeneficiaries.familyID",
                                                        "sector_ID"         : "$sector_ID",
                                                        "activity_ID"       : "$activity_ID",
                                                        "subactivity_ID"    : "$subactivity_ID",
                                                        "sectorName"        : "$sectorName",
                                                        "activityName"      : "$activityName",
                                                        "subactivityName"   : "$subactivityName",
                                                        "unit"              : "$unit",
                                                        "unitCost"          : "$listofBeneficiaries.unitCost",
                                                        "uidNumber"         : "$uidNumber",
                                                        // "center_ID"         : "$listofBeneficiaries.center_ID",
                                                        "isUpgraded"        : "$listofBeneficiaries.isUpgraded",
                                                        "date"              : "$date",
                                                        "center_ID"         : "$center_ID",
                                                    },
                                        "projectCategoryType" : { "$first" : "$projectCategoryType"},
                                        "projectName"         : { "$first" : "$projectName"},
                                        "district"            : { "$first" : "$district"},
                                        "block"               : { "$first" : "$block"},
                                        "village"             : { "$first" : "$village"},

                                        "quantity"            : { "$sum" : "$listofBeneficiaries.qtyPerBen"},
                                        "totalCost"           : { "$sum" : "$listofBeneficiaries.totalCostPerBen"},
                                        "LHWRF"               : { "$sum" : "$listofBeneficiaries.sourceofFund.LHWRF"},
                                        "NABARD"              : { "$sum" : "$listofBeneficiaries.sourceofFund.NABARD"},
                                        "Bank_Loan"           : { "$sum" : "$listofBeneficiaries.sourceofFund.bankLoan"},
                                        "Govt"                : { "$sum" : "$listofBeneficiaries.sourceofFund.govtscheme"},
                                        "DirectCC"            : { "$sum" : "$listofBeneficiaries.sourceofFund.directCC"},
                                        "IndirectCC"          : { "$sum" : "$listofBeneficiaries.sourceofFund.indirectCC"},
                                        "Other"               : { "$sum" : "$listofBeneficiaries.sourceofFund.other"},
                                        "total"               : { "$sum" : "$listofBeneficiaries.sourceofFund.total"},
                                        "remark"              : { "$first" : "$remark"},
                                    }
                                },
                                { "$group": {
                                    "_id": {
                                            "familyID1"         : "$_id.familyID1",
                                            "name_family"       : "$_id.name_family",
                                            "familyID"          : "$_id.familyID",
                                            "center_ID"         : "$_id.center_ID",
                                    },
                                    "sectorData": { 
                                        "$push": { 
                                            "name"              : { $concat: [ "<div class='wrapText  text-left'><b>Sector : </b>", "$_id.sectorName", "<br/><b>Activity : </b>", "$_id.activityName","<br/><b>Sub-Activity : </b>","$_id.subactivityName","</div>"] },
                                            "activity_ID"       : "$_id.activity_ID",
                                            "subactivity_ID"    : "$_id.subactivity_ID",
                                            "sectorName"        : "$_id.sectorName",
                                            "activityName"      : "$_id.activityName",
                                            "subactivityName"   : "$_id.subactivityName",
                                            "unit"              : "$_id.unit",
                                            "date"              : "$_id.date",
                                            "unitCost"          : "$_id.unitCost",
                                            "uidNumber"         : "$_id.uidNumber",
                                            "isUpgraded"        : "$_id.isUpgraded",
                                            "quantity"          : "$quantity",
                                            "LHWRF"             : "$LHWRF",
                                            "NABARD"            : "$NABARD",
                                            "Bank_Loan"         : "$Bank_Loan",
                                            "Govt"              : "$Govt",
                                            "DirectCC"          : "$DirectCC",
                                            "IndirectCC"        : "$IndirectCC",
                                            "Other"             : "$Other",
                                            "total"             : "$total",
                                            "projectCategoryType": "$projectCategoryType",
                                            "projectName"        : "$projectName",
                                            "district"           : "$district",
                                            "block"              : "$block",
                                            "village"            : "$village",
                                            "remark"             : "$remark",
                                        },
                                    },
                                }},
                                { "$sort": { "count": -1 } },
                            ]
                        )
                    .sort({"_id.familyID":1})
                    .exec()
                    .then(familyData=>{
                            // console.log("familyData",familyData);
                        var familyArray = [];
                        if(familyData){
                            for(i = 0 ; i < familyData.length ; i ++){
                                var totalquantity          =  0;
                                var totalLHWRF             =  0;
                                var totalNABARD            =  0;
                                var totalBank_Loan         =  0;
                                var totalGovt              =  0;
                                var totalDirectCC          =  0;
                                var totalIndirectCC        =  0;
                                var totalOther             =  0;
                                var totaltotal             =  0;
                                for(j = 0 ; j < familyData[i].sectorData.length ; j ++){
                                    totalquantity          += familyData[i].sectorData[j].quantity;
                                    totalLHWRF             += familyData[i].sectorData[j].LHWRF;
                                    totalNABARD            += familyData[i].sectorData[j].NABARD;
                                    totalBank_Loan         += familyData[i].sectorData[j].Bank_Loan;
                                    totalGovt              += familyData[i].sectorData[j].Govt;
                                    totalDirectCC          += familyData[i].sectorData[j].DirectCC;
                                    totalIndirectCC        += familyData[i].sectorData[j].IndirectCC;
                                    totalOther             += familyData[i].sectorData[j].Other;
                                    totaltotal             += familyData[i].sectorData[j].total;
                                }
                                if(j >= familyData[i].sectorData.length && familyData[i].sectorData.length > 0){
                                    var totalSectorsData = {
                                        "name"              : "-",
                                        "sectorName"        : "-",
                                        "activity_ID"       : "-",
                                        "activityName"      : "-",
                                        "subactivity_ID"    : "-",
                                        "subactivityName"   : "-",
                                        "unit"              : "Total",
                                        "date"              : "-",
                                        "uidNumber"         : "-",
                                        "isUpgraded"        : "-",
                                        "unitCost"          : "-",
                                        "quantity"          : "-",
                                        "LHWRF"             : totalLHWRF,
                                        "NABARD"            : totalNABARD,
                                        "Bank_Loan"         : totalBank_Loan,
                                        "Govt"              : totalGovt,
                                        "DirectCC"          : totalDirectCC,
                                        "IndirectCC"        : totalIndirectCC,
                                        "Other"             : totalOther,
                                        "total"             : totaltotal,
                                        "projectCategoryType": "-",
                                        "projectName"        : "-",
                                        "center_ID"          : "-",
                                        "district"           : "-",
                                        "block"              : "-",
                                        "village"            : "-",
                                    }
                                    // console.log('familyData[i].sectorData',familyData[i].sectorData);
                                    // console.log('totalSectorsData',totalSectorsData,"j",j,"i",i);
                                    familyData[i].sectorData.push(totalSectorsData);
                                }
                            }
                            res.status(200).json(familyData);
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(200).json(err);
                    });
}
exports.report_family_coverage = (req,res,next)=>{
        var selector = {};
        selector["$and"] = [];
        selector["$and"].push({"date" : {$gte : req.params.startDate, $lte : req.params.endDate}});
        if(req.params.district !== "all"){
            selector["$and"].push({"district": req.params.district})
        }
        if(req.params.block !== "all"){
            selector["$and"].push({"block": req.params.block})
        }
        if(req.params.village !== "all"){
            selector["$and"].push({"village": req.params.village})
        }
        if(req.params.sector_ID !== "all"){
            selector["$and"].push({"sector_ID": req.params.sector_ID})
        }
        if(req.params.projectCategoryType !== "all"){
            selector["$and"].push({"projectCategoryType": req.params.projectCategoryType})
        }
        if(req.params.projectName !== "all"){
            selector["$and"].push({"projectName": req.params.projectName})
        }
        if(req.params.center_ID !== "all"){
            selector["$and"].push({"center_ID": req.params.center_ID})
        }
        if(req.params.activity_ID !== "all"){
            selector["$and"].push({"activity_ID": req.params.activity_ID})
        }
        if(req.params.subactivity_ID !== "all"){
            selector["$and"].push({"subactivity_ID": req.params.subactivity_ID})
        }
        var query = { $match : selector};
        var uidquery = "1";
        if(req.params.uidstatus === 'withUID'){
            uidquery = {
                        $match : { 
                                    "listofBeneficiaries.uidNumber" : {$ne : "-"}
                                }
                    };
        }else if(req.params.uidstatus === 'withoutUID'){
            uidquery = {
                        $match : { 
                                    "listofBeneficiaries.uidNumber" : "-"
                                }
                        };
        }else{
            uidquery = {
                        $match:{
                                    "_id" : {$exists : true}
                            }
                    };
        }
        ActivityReport.aggregate(
                                [
                                    query,
                                    {
                                        $unwind : "$listofBeneficiaries"
                                    },
                                    
                                    {
                                        $lookup : {
                                                from          : "listofbeneficiaries",
                                                localField    : "listofBeneficiaries.beneficiary_ID",
                                                foreignField  : "_id",
                                                as            : "listofBeneficiaries1"
                                        }
                                    },
                                    {
                                        $unwind : "$listofBeneficiaries1"
                                    },
                                    {
                                        $addFields: {
                                            "family_ID": { $toObjectId:"$listofBeneficiaries1.family_ID" }
                                        }
                                    },                              
                                    {
                                        $lookup : {
                                                from          : "families",
                                                localField    : "family_ID",
                                                foreignField  : "_id",
                                                as            : "family"
                                        }
                                    },
                                    {
                                        $unwind : "$family" 
                                    },
                                    {
                                        $project : {
                                            "family" :"$family",
                                            "familyID1" :"$family.familyID",
                                            "name_family"                               : { $concat: [ "$family.surnameOfFH", " ", "$family.firstNameOfFH", " ","$family.middleNameOfFH"] },
                                            "listofBeneficiaries.beneficiary_ID"        : 1,
                                            "listofBeneficiaries.family_ID"             : 1,
                                            "listofBeneficiaries.beneficiaryID"         : 1,
                                            "listofBeneficiaries.family_ID"             : 1,
                                            "listofBeneficiaries.familyID"              : 1,
                                            "listofBeneficiaries.uidNumber"             : "$listofBeneficiaries1.uidNumber",
                                            "date"                                      : 1,
                                            "activity_ID"                               : 1,
                                            "activityName"                              : 1,
                                            "subactivity_ID"                            : 1,
                                            "subactivityName"                           : 1,
                                            "unit"                                      : 1,
                                            "sectorName"                                : 1,
                                            "unitCost"                                  : 1,
                                            "quantity"                                  : 1,
                                            "totalcost"                                 : 1,
                                            "sourceofFund"                              : 1,
                                            "listofBeneficiaries.unitCost"              : "$listofBeneficiaries.unitCost",
                                            "listofBeneficiaries.totalCostPerBen"       : "$listofBeneficiaries.totalCostPerBen",
                                            "listofBeneficiaries.qtyPerBen"             : "$listofBeneficiaries.qtyPerBen",
                                            "listofBeneficiaries.sourceofFund"          : "$listofBeneficiaries.sourceofFund",
                                            "projectCategoryType"                       : 1,
                                            "projectName"                               : 1,
                                            "center_ID"                                 : 1,
                                            "district"                                  : 1,
                                            "block"                                     : 1,
                                            "village"                                   : 1,
                                        }
                                    },
                                    uidquery,
                                    {
                                        $group : {
                                            "_id"       : {
                                                            "familyID1"       : "$familyID1",
                                                            "name_family"       : "$name_family",
                                                            "familyID"          : "$listofBeneficiaries.familyID",
                                                            "sector_ID"         : "$sector_ID",
                                                            "activity_ID"       : "$activity_ID",
                                                            "subactivity_ID"    : "$subactivity_ID",
                                                            "sectorName"        : "$sectorName",
                                                            "activityName"      : "$activityName",
                                                            "subactivityName"   : "$subactivityName",
                                                            "unit"              : "$unit",
                                                            "unitCost"          : "$listofBeneficiaries.unitCost",
                                                            "date"              : "$date",
                                                        },
                                            "projectCategoryType" : { "$first" : "$projectCategoryType"},
                                            "projectName"         : { "$first" : "$projectName"},
                                            "center_ID"           : { "$first" : "$center_ID"},
                                            "district"            : { "$first" : "$district"},
                                            "block"               : { "$first" : "$block"},
                                            "village"             : { "$first" : "$village"},

                                            "quantity"            : { "$sum" : "$listofBeneficiaries.qtyPerBen"},
                                            "totalCost"           : { "$sum" : "$listofBeneficiaries.totalCostPerBen"},
                                            "LHWRF"               : { "$sum" : "$listofBeneficiaries.sourceofFund.LHWRF"},
                                            "NABARD"              : { "$sum" : "$listofBeneficiaries.sourceofFund.NABARD"},
                                            "Bank_Loan"           : { "$sum" : "$listofBeneficiaries.sourceofFund.bankLoan"},
                                            "Govt"                : { "$sum" : "$listofBeneficiaries.sourceofFund.govtscheme"},
                                            "DirectCC"            : { "$sum" : "$listofBeneficiaries.sourceofFund.directCC"},
                                            "IndirectCC"          : { "$sum" : "$listofBeneficiaries.sourceofFund.indirectCC"},
                                            "Other"               : { "$sum" : "$listofBeneficiaries.sourceofFund.other"},
                                            "total"               : { "$sum" : "$listofBeneficiaries.sourceofFund.total"},
                                        }
                                    },
                                    { "$group": {
                                        "_id": {
                                                "familyID1"       : "$_id.familyID1",
                                                "name_family"       : "$_id.name_family",
                                                "familyID"          :"$_id.familyID",
                                        },
                                        "sectorData": { 
                                            "$push": { 
                                                "name"              : { $concat: [ "<div class='wrapText  text-left'><b>Sector : </b>", "$_id.sectorName", "<br/><b>Activity : </b>", "$_id.activityName","<br/><b>Sub-Activity : </b>","$_id.subactivityName","</div>"] },
                                                "activity_ID"       : "$_id.activity_ID",
                                                "subactivity_ID"    : "$_id.subactivity_ID",
                                                "sectorName"        : "$_id.sectorName",
                                                "activityName"      : "$_id.activityName",
                                                "subactivityName"   : "$_id.subactivityName",
                                                "unit"              : "$_id.unit",
                                                "date"              : "$_id.date",
                                                "unitCost"          : "$_id.unitCost",
                                                "quantity"          : "$quantity",
                                                "LHWRF"             : "$LHWRF",
                                                "NABARD"            : "$NABARD",
                                                "Bank_Loan"         : "$Bank_Loan",
                                                "Govt"              : "$Govt",
                                                "DirectCC"          : "$DirectCC",
                                                "IndirectCC"        : "$IndirectCC",
                                                "Other"             : "$Other",
                                                "total"             : "$total",
                                                "projectCategoryType": "$projectCategoryType",
                                                "projectName"        : "$projectName",
                                                "center_ID"          : "$center_ID",
                                                "district"           : "$district",
                                                "block"              : "$block",
                                                "village"            : "$village",
                                            },
                                        },
                                    }},
                                    { "$sort": { "count": -1 } },
                                ]
                            )
                        .exec()
                        .then(familyData=>{
                            var familyArray = [];
                            if(familyData){
                                // console.log(familyData);
                                for(i = 0 ; i < familyData.length ; i ++){
                                    var totalquantity          =  0;
                                    var totalLHWRF             =  0;
                                    var totalNABARD            =  0;
                                    var totalBank_Loan         =  0;
                                    var totalGovt              =  0;
                                    var totalDirectCC          =  0;
                                    var totalIndirectCC        =  0;
                                    var totalOther             =  0;
                                    var totaltotal             =  0;
                                    for(j = 0 ; j < familyData[i].sectorData.length ; j ++){
                                        totalquantity          += familyData[i].sectorData[j].quantity;
                                        totalLHWRF             += familyData[i].sectorData[j].LHWRF;
                                        totalNABARD            += familyData[i].sectorData[j].NABARD;
                                        totalBank_Loan         += familyData[i].sectorData[j].Bank_Loan;
                                        totalGovt              += familyData[i].sectorData[j].Govt;
                                        totalDirectCC          += familyData[i].sectorData[j].DirectCC;
                                        totalIndirectCC        += familyData[i].sectorData[j].IndirectCC;
                                        totalOther             += familyData[i].sectorData[j].Other;
                                        totaltotal             += familyData[i].sectorData[j].total;
                                    }
                                    if(j >= familyData[i].sectorData.length && familyData[i].sectorData.length > 0){
                                        var totalSectorsData = {
                                            "name"              : "-",
                                            "sectorName"        : "-",
                                            "activity_ID"       : "-",
                                            "activityName"      : "-",
                                            "subactivity_ID"    : "-",
                                            "subactivityName"   : "-",
                                            "unit"              : "Total",
                                            "date"              : "-",
                                            "unitCost"          : "-",
                                            "quantity"          : "-",
                                            "LHWRF"             : totalLHWRF,
                                            "NABARD"            : totalNABARD,
                                            "Bank_Loan"         : totalBank_Loan,
                                            "Govt"              : totalGovt,
                                            "DirectCC"          : totalDirectCC,
                                            "IndirectCC"        : totalIndirectCC,
                                            "Other"             : totalOther,
                                            "total"             : totaltotal,
                                            "projectCategoryType": "-",
                                            "projectName"        : "-",
                                            "center_ID"          : "-",
                                            "district"           : "-",
                                            "block"              : "-",
                                            "village"            : "-",
                                        }
                                        // console.log('familyData[i].sectorData',familyData[i].sectorData);
                                        // console.log('totalSectorsData',totalSectorsData,"j",j,"i",i);
                                        familyData[i].sectorData.push(totalSectorsData);
                                    }
                                }
                                res.status(200).json(familyData);
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(200).json(err);
                        });
}
exports.report_category = (req,res,next)=>{
    // console.log('req.params',req.params);
    var selector = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
    if(req.params.center_ID !== "all"){
        selector.center_ID = req.params.center_ID;
    }
    if(req.params.district !== "all"){
        selector.district = req.params.district;
    }
    if(req.params.block !== "all"){
        selector.block = req.params.block;
    }
    if(req.params.village !== "all"){
        selector.village = req.params.village;
    }
    // console.log("selector",selector)
    ActivityReport.find(selector)           
    .exec()
    .then(data=>{
        getData();
        async function getData(){
            var activitydata            = [];
            var benInActivity           = [];
            var catgReportArray         = [];

            var beneficiaryCount  = {};
            var typeB_Reach       = 0;
            var benficiariesArray = [];
            var newArray          = [];
            // console.log('data',data.length);
            for(var i=0; i<data.length; i++){
                if(data[i].typeofactivity === "Family Level Activity"){
                    benficiariesArray.push(...data[i].listofBeneficiaries);
                }
                if(data[i].typeofactivity === "Type B Activity"){
                    typeB_Reach = typeB_Reach + data[i].noOfBeneficiaries;
                }                       
            }
            benInActivity        = benficiariesArray;
            // console.log('benInActivity======',benInActivity.length);
            // console.log('typeB_Reach======',typeB_Reach);
        
        
            //===== make  family Array unique ======
            var flags = {};
            var upgradedBeneficiaries = benInActivity.filter((data)=>{
                if (data.isUpgraded==="Yes") {
                    return data;
                }
            })
            // console.log('upgradedBeneficiaries',upgradedBeneficiaries);
            var uniqueFamily = upgradedBeneficiaries.filter(function(entry) {
                if (flags[entry.family_ID]) {
                    return false;
                }
                flags[entry.family_ID] = true;
                return true;
            });
            // console.log('uniqueFamily',uniqueFamily);
            var upgradedFamilies = uniqueFamily.filter((data)=>{
            // console.log('data.isUpgraded',data.isUpgraded);
                if (data.isUpgraded==="Yes") {
                    return data;
                }
            })

            // console.log('upgradedFamilies',upgradedFamilies.length);
            var upgradedFamilyArray = [];
            for(var k=0; k<upgradedFamilies.length; k++){
                var upgradedFamilyData = await getFamilyData(upgradedFamilies[k].family_ID, upgradedFamilies[k].isUpgraded);
                upgradedFamilyArray.push(upgradedFamilyData);
            }              
            //=== Income Category ===
            // console.log('benInActivity',benInActivity.length);
            // console.log('upgradedFamilyArray',upgradedFamilyArray.length);

            var APLArray         = benInActivity.filter(function(o){return o.incomeCategory==="APL";});
            var APLUpgradedArray = upgradedFamilyArray.filter(function(o){return o.incomeCategory==="APL";});

            var BPLArray         = benInActivity.filter(function(o){return o.incomeCategory==="BPL";});
            var BPLUpgradedArray = upgradedFamilyArray.filter(function(o){return o.incomeCategory==="BPL";});
            // console.log('BPLArray',BPLArray.length);
            // console.log('BPLUpgradedArray',BPLUpgradedArray.length);

            var unknownIC = benInActivity.filter(function(o){return o.incomeCategory!=="APL" && o.incomeCategory!=="BPL";});
            var unknownICUpgraded = upgradedFamilyArray.filter(function(o){return o.incomeCategory!=="APL" && o.incomeCategory!=="BPL";});

            catgReportArray.push({srNo: "<b>A</b>", type:"Income Category",categoryName:"<b>Income Category</b>",reachCount:"",upgraded:""});
            catgReportArray.push({srNo: "1", type:"Income Category",categoryName:"BPL",reachCount:BPLArray.length,upgraded:BPLUpgradedArray.length});
            catgReportArray.push({srNo: "2", type:"Income Category",categoryName:"APL",reachCount:APLArray.length,upgraded:APLUpgradedArray.length});
            catgReportArray.push({srNo: "3", type:"Income Category",categoryName:"Unknown",reachCount:unknownIC.length,upgraded:unknownICUpgraded.length});
            catgReportArray.push({
                srNo        : "",
                type        :"Income Category",
                categoryName: "<b>Total (A)</b>",
                reachCount  : "<b>" +( BPLArray.length + APLArray.length + unknownIC.length)+"</b>",
                upgraded    : "<b>" + (BPLUpgradedArray.length + APLUpgradedArray.length + unknownICUpgraded.length)+"</b>"
            });
            //=== Land Catgegory ===
            var bigFarmerArray              = benInActivity.filter(function(o){return o.landCategory==="Big Farmer";});
            var bigFarmerUpgradedArray      = upgradedFamilyArray.filter(function(o){return o.landCategory==="Big Farmer";});

            var smallFarmerArray            = benInActivity.filter(function(o){return o.landCategory==="Small Farmer";});
            var smallFarmerUpgradedArray    = upgradedFamilyArray.filter(function(o){return o.landCategory==="Small Farmer";});

            var marginalFarmerArray         = benInActivity.filter(function(o){return o.landCategory==="Marginal Farmer";});
            var marginalFarmerUpgradedArray = upgradedFamilyArray.filter(function(o){return o.landCategory==="Marginal Farmer";});

            var landlessFarmerArray         = benInActivity.filter(function(o){return o.landCategory==="Landless";});
            var landlessFarmerUpgradedArray = upgradedFamilyArray.filter(function(o){return o.landCategory==="Landless";});

            var unknownLandC                = benInActivity.filter(function(o){return o.landCategory!=="Big Farmer" && o.landCategory!=="Small Farmer" && o.landCategory!=="Marginal Farmer" && o.landCategory!=="Landless";});
            var unknownLandCUpgraded        = upgradedFamilyArray.filter(function(o){return o.landCategory!=="Big Farmer" && o.landCategory!=="Small Farmer" && o.landCategory!=="Marginal Farmer" && o.landCategory!=="Landless";});

            catgReportArray.push({srNo: "<b>B</b>", type:"Land Category",categoryName:"<b>Land Category</b>",reachCount:"",upgraded:""});
            catgReportArray.push({srNo: "1", type:"Land Category",categoryName:"Landless",reachCount:landlessFarmerArray.length,upgraded:landlessFarmerUpgradedArray.length});
            catgReportArray.push({srNo: "2", type:"Land Category",categoryName:"Small Farmer",reachCount:smallFarmerArray.length,upgraded:smallFarmerUpgradedArray.length});
            catgReportArray.push({srNo: "3", type:"Land Category",categoryName:"Marginal Farmer",reachCount:marginalFarmerArray.length,upgraded:marginalFarmerUpgradedArray.length});
            catgReportArray.push({srNo: "4", type:"Land Category",categoryName:"Big Farmer",reachCount:bigFarmerArray.length,upgraded:bigFarmerUpgradedArray.length});
            catgReportArray.push({srNo: "5", type:"Land Category",categoryName:"Unknown",reachCount:unknownLandC.length,upgraded:unknownLandCUpgraded.length});
            catgReportArray.push({
                srNo        : "",
                type        : "Land Category",
                categoryName: "<b>Total (B)</b>",
                reachCount  : "<b>" + (bigFarmerArray.length + smallFarmerArray.length + marginalFarmerArray.length + landlessFarmerArray.length + unknownLandC.length)+"</b>",
                upgraded    : "<b>" + (bigFarmerUpgradedArray.length + smallFarmerUpgradedArray.length + marginalFarmerUpgradedArray.length + landlessFarmerUpgradedArray.length + unknownLandCUpgraded.length)+"</b>"
            });
            //=== Special Category ===
            var normalArray             = benInActivity.filter(function(o){return o.specialCategory==="Normal";});
            var normalUpgradedArray     = upgradedFamilyArray.filter(function(o){return o.specialCategory==="Normal";});

            var diffAbledArray          = benInActivity.filter(function(o){return o.specialCategory==="Differently Abled";});
            var diffAbledUpgradedArray  = upgradedFamilyArray.filter(function(o){return o.specialCategory==="Differently Abled";});

            var veeranganaArray         = benInActivity.filter(function(o){return o.specialCategory==="Veerangana";});
            var veeranganaUpgradedArray = upgradedFamilyArray.filter(function(o){return o.specialCategory==="Veerangana";});

            var widowArray              = benInActivity.filter(function(o){return o.specialCategory==="Widow Headed";});
            var widowUpgradedArray      = upgradedFamilyArray.filter(function(o){return o.specialCategory==="Widow Headed";});

            var unknownSC               = benInActivity.filter(function(o){return o.specialCategory!=="Normal" && o.specialCategory!=="Differently Abled" && o.specialCategory!=="Veerangana" && o.specialCategory!=="Widow Headed";});
            var unknownSCUpgraded       = upgradedFamilyArray.filter(function(o){return o.specialCategory!=="Normal" && o.specialCategory!=="Differently Abled" && o.specialCategory!=="Veerangana" && o.specialCategory!=="Widow Headed";});

            catgReportArray.push({srNo: "<b>C</b>", type:"Special Category",categoryName:"<b>Special Category</b>",reachCount:"",upgraded:""});
            catgReportArray.push({srNo: "1", type:"Special Category",categoryName:"Normal",reachCount:normalArray.length,upgraded:normalUpgradedArray.length});
            catgReportArray.push({srNo: "2", type:"Special Category",categoryName:"Differently Abled",reachCount:diffAbledArray.length,upgraded:diffAbledUpgradedArray.length});
            catgReportArray.push({srNo: "3", type:"Special Category",categoryName:"Veerangana",reachCount:veeranganaArray.length,upgraded:veeranganaUpgradedArray.length});
            catgReportArray.push({srNo: "4", type:"Special Category",categoryName:"Widow Headed",reachCount:widowArray.length,upgraded:widowUpgradedArray.length});
            catgReportArray.push({srNo: "5", type:"Special Category",categoryName:"Unknown",reachCount:unknownSC.length,upgraded:unknownSCUpgraded.length});
            catgReportArray.push({
                srNo        : "",
                type        : "Special Category",
                categoryName: "<b>Total (C)</b>",
                reachCount  : "<b>" + (normalArray.length + diffAbledArray.length + veeranganaArray.length + widowArray.length + unknownSC.length)+"</b>",
                upgraded    : "<b>" + (normalUpgradedArray.length + diffAbledUpgradedArray.length + veeranganaUpgradedArray.length + widowUpgradedArray.length + unknownSCUpgraded.length)+"</b>"
            });

            //=== Caste ===
            // console.log("benInActivity",benInActivity)
            var generalArray         = benInActivity.filter(function(o){return o.caste==="General";});
            var generalUpgradedArray = upgradedFamilyArray.filter(function(o){return o.caste==="General";});

            var SCArray              = benInActivity.filter(function(o){return o.caste==="SC";});
            var SCUpgradedArray      = upgradedFamilyArray.filter(function(o){return o.caste==="SC";});

            var STArray              = benInActivity.filter(function(o){return o.caste==="ST";});
            var STUpgradedArray      = upgradedFamilyArray.filter(function(o){return o.caste==="ST";});
            // console.log('STArray',STArray);
            // console.log('STUpgradedArray',STUpgradedArray);
            var NTArray              = benInActivity.filter(function(o){return o.caste==="NT";});
            var NTUpgradedArray      = upgradedFamilyArray.filter(function(o){return o.caste==="NT";});

            var OBCArray              = benInActivity.filter(function(o){return o.caste==="OBC";});
            var OBCUpgradedArray      = upgradedFamilyArray.filter(function(o){return o.caste==="OBC";});

            var OtherArray           = benInActivity.filter(function(o){return o.caste==="Other";});
            var OtherUpgradedArray   = upgradedFamilyArray.filter(function(o){return o.caste==="Other";});

            var unknownCaste         = benInActivity.filter(function(o){return o.caste!=="General" && o.caste!=="SC" && o.caste!=="ST" && o.caste!=="NT" && o.caste!=="OBC" && o.caste!=="Other";});
            var unknownCasteUpgraded = upgradedFamilyArray.filter(function(o){return o.caste!=="General" && o.caste!=="SC" && o.caste!=="ST" && o.caste!=="NT" && o.caste!=="OBC" && o.caste!=="Other";});

            catgReportArray.push({srNo: "<b>D</b>", type:"Caste",categoryName:"<b>Caste</b>",reachCount:"",upgraded:""});
            catgReportArray.push({srNo: "1", type:"Caste",categoryName:"General",reachCount:generalArray.length,upgraded:generalUpgradedArray.length});
            catgReportArray.push({srNo: "2", type:"Caste",categoryName:"SC",reachCount:SCArray.length,upgraded:SCUpgradedArray.length});
            catgReportArray.push({srNo: "3", type:"Caste",categoryName:"ST",reachCount:STArray.length,upgraded:STUpgradedArray.length});
            catgReportArray.push({srNo: "4", type:"Caste",categoryName:"NT",reachCount:NTArray.length,upgraded:NTUpgradedArray.length});
            catgReportArray.push({srNo: "4", type:"Caste",categoryName:"OBC",reachCount:OBCArray.length,upgraded:OBCUpgradedArray.length});
            catgReportArray.push({srNo: "5", type:"Caste",categoryName:"Other",reachCount:OtherArray.length,upgraded:OtherUpgradedArray.length});
            catgReportArray.push({srNo: "6", type:"Caste",categoryName:"Unknown",reachCount:unknownCaste.length,upgraded:unknownCasteUpgraded.length});
            catgReportArray.push({
                srNo        : "",
                type        : "Caste",
                categoryName: "<b>Total (D)</b>",
                reachCount  : "<b>" + (SCArray.length + generalArray.length + STArray.length + NTArray.length + OBCArray.length + OtherArray.length + unknownCaste.length)+"</b>",
                upgraded    : "<b>" + (SCUpgradedArray.length + generalUpgradedArray.length +  STUpgradedArray.length + NTUpgradedArray.length + OBCUpgradedArray.length + OtherUpgradedArray.length + unknownCasteUpgraded.length)+"</b>"
            });

            // console.log('catgReportArray',catgReportArray);
            res.status(200).json(catgReportArray);
        }
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
}
function getFamily(query){
    return new Promise(function(resolve,reject){
        ActivityReport.find(query)
        .exec()
        .then(actData=>{
            getFamilyData();
            async function getFamilyData(){
                var beneficiaryCount = {};
                var typeB_Reach = 0;
                var benficiariesArray = [];
                var newArray = [];
                // console.log('actData',actData.length);
                for(var i=0; i<actData.length; i++){
                    if(actData[i].typeofactivity === "Family Level Activity"){
                        benficiariesArray.push(...actData[i].listofBeneficiaries);
                    }
                    if(actData[i].typeofactivity === "Type B Activity"){
                        typeB_Reach = typeB_Reach + actData[i].noOfBeneficiaries;
                    }                       
                }
                var benInActivity        = benficiariesArray;
                // console.log('benInActivity======',benInActivity.length);
                beneficiaryCount.benInActivity   = benInActivity.length > 0  ? benInActivity      : [];
                resolve(beneficiaryCount);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
function getFamilyData(family_ID, isUpgraded){
    return new Promise((resolve,reject)=>{
        // console.log('Family_ID',family_ID)
        Families.findOne({"_id": family_ID})
            .exec()
            .then(data=>{
                var family = data;
                // console.log("data",data);
                // console.log("isUpgraded",isUpgraded);
                if (family) {
                    family.upgraded = isUpgraded;
                    // console.log('family============',family.upgraded);
                    resolve(family);
                    // console.log('family=--------------=',family);
                }else{
                    resolve("Family not exists");
                }
            })
            .catch((err)=>{
                reject(err);
            })
    });
}
