const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
var request             = require('request-promise');
const ObjectID          = require('mongodb').ObjectID;
var moment              = require('moment');
const AnnualPlan        = require('../models/annualPlans.js');
const ActivityReport    = require('../models/activityReport.js');
const Sectors           = require('../models/sectors.js');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Center            = require('../models/centers.js');
const Families          = require('../models/families.js');
const SectorMapping     = require('../models/sectorMappings.js');
const ProjectMapping    = require('../models/projectMappings.js');

function derive_year_month(dateData){
    var startYear = moment(dateData.startDate).format("YYYY");
    var endYear   = moment(dateData.endDate).format("YYYY");
    var startMonth = moment(dateData.startDate).format("MM");
    var endMonth = moment(dateData.endDate).format("MM");
    var monthList = [];
    var yearList = [];
    var tempDate = dateData.startDate;
    if(startYear == endYear){
        if(startMonth >= 4 && endMonth <=12){
            var year = 'FY ' + (startYear) + ' - ' + (parseInt(startYear)+1);
        }else{
            var year = 'FY ' + (startYear-1) + ' - ' + (startYear);
        }
        for(m = startMonth; m <= endMonth; m++ ){
            monthList.push(moment('0'+m).format("MMMM"));
        }
        yearList.push(startYear);
    }else{
        yearList.push(startYear);
        yearList.push(endYear);
        var year = 'FY ' + (startYear) + ' - ' + (endYear);
        var stDate = new Date(dateData.startDate);
        var endDate = new Date(dateData.endDate);
        var m1 = stDate.getMonth() + 1;
        var m2 = endDate.getMonth() + 1;
        var m3 =0;  
        if(m2<m1) {
            m3 = 12;
        }else{
            m3 = m2;
        }
        for(let m=m1; m <= m3; m++ ){
            if(m < 10){
                m = '0'+m;
            }else{
                m = String(m);
            }
            monthList.push(moment(m).format("MMMM"));
        }
        for(let m=1; m<=m2;m++){
            monthList.push(moment('0'+m).format("MMMM"));    
        }
    }
    if(yearList.length > 0 && monthList.length > 0){
        return {
                    "year"          : year,
                    "yearList"      : yearList,
                    "monthList"     : monthList
                };
    }
};
function getBeneficiariesCount(searchQuery){
    return new Promise(function(resolve,reject){
        ActivityReport.aggregate(
                                    [
                                        searchQuery,
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
                                                            "listofBeneficiaries.beneficiary_ID"   : 1,
                                                            "listofBeneficiaries.family_ID"        : 1,
                                                            "listofBeneficiaries.uidNumber"        : "$listofBeneficiaries1.uidNumber",
                                                            "listofBeneficiaries.isUpgraded"       : 1,
                                                        }
                                        },
                                        {
                                            $group : {
                                                        "_id"                   : null,
                                                        "listofBeneficiaries"   : { $push:  "$listofBeneficiaries" },
                                                        "upGrade"               : { "$push" : { "$cond" : [ {"$eq" : ["$listofBeneficiaries.isUpgraded" , "Yes"] },"$listofBeneficiaries",null ] } },
                                                    }
                                        },
                                        {
                                            $project : {
                                                "listofBeneficiaries"   : { "$setUnion" : [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                                "upGrade"               : 1,
                                                "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                            }
                                        },
                                        //get count of FamilyUpgradation
                                        {
                                            $project : {
                                                "listofBeneficiaries"   : 1,
                                                // "upGrade"               : { $filter : { input : "$listofBeneficiaries", as : "beneficiaries", cond : { $ne : ["$$beneficiaries" , null] } } },
                                                // "upGrade"               : { "$setDifference" :[ "$upGrade" , [null] ] },
                                                "upGrade"               : { "$setUnion" : [ "$upGrade.family_ID", "$upGrade.family_ID" ] },
                                                "Reach"                 : 1,
                                            }
                                        },
                                        {
                                            $project : {
                                                "Reach"                 : 1,
                                                "upGrade"               : 1,
                                                "FamilyUpgradation"     : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                "FamilyUpgradation1"    : { $cond: { if: { $isArray: "$upGrade" }, then: { $size: "$upGrade" }, else: 0} },
                                            }
                                        },
                                    ]
                        )
                        .exec()
                        .then(data=>{
                            resolve({
                                "Reach"             : data.length && data[0] && data[0].Reach              ? data[0].Reach : 0,
                                "FamilyUpgradation" : data.length && data[0] && data[0].FamilyUpgradation1 ? data[0].FamilyUpgradation1 : 0,
                            })
                        })
                        .catch(err =>{
                            console.log(err);
                            reject(err);
                        });
    });
};
function getActivityReport(center_ID,startDate,endDate){
	return new Promise(function(resolve,reject){
        ActivityReport  .aggregate([
                                {
                                	$match : {
                                		"center_ID" : String(center_ID),
                                		"date"      : {$gte : startDate, $lte : endDate}
                                	}
                                },
                                {
                                    $group : {
                                        "_id"               : null,
                                        "LHWRF"             : { "$sum" : "$sourceofFund.LHWRF" },
                                        "Govt"              : { "$sum" : "$sourceofFund.govtscheme" },
                                        "Other"             : { "$sum" : "$sourceofFund.other" },                                        
                                        "TotalBudget"       : { "$sum" : "$totalcost" },
                                        "NABARD"            : { "$sum" : "$sourceofFund.NABARD" },
                                        "Bank_Loan"         : { "$sum" : "$sourceofFund.bankLoan" },
                                        "DirectCC"          : { "$sum" : "$sourceofFund.directCC" },
                                        "IndirectCC"        : { "$sum" : "$sourceofFund.indirectCC" },
                                    }
                                },
                                {
                                	$project : {
		// OtherOrg 				= Total Budget - (LHWRF + Govt + Community)
                                			"LHWRF"				: "$LHWRF",
											"otherSource"		: { "$subtract": [ "$TotalBudget", "$LHWRF" ] },
											"TotalBudget" 		: "$TotalBudget",
											"Govt"				: "$Govt",
											"Community"			: { "$add": [ "$DirectCC", "$IndirectCC" ] },
											"otherOrg"			: { "$subtract" : [ "$TotalBudget", {"$add": [ "$LHWRF", "$Govt" , "$DirectCC" , "$IndirectCC" ]}]}
                                	}
                                }
                    ])
                    .exec()
                    .then(data=>{
                        // console.log("data ",data[0].Govt);
                        // resolve(data)
                    	getData()
                    	async function getData(){
                    		var reachFamilyUpgrade = await getBeneficiariesCount({
									                                	$match : {
									                                		"center_ID" : String(center_ID),
									                                		"date"      : {$gte : startDate, $lte : endDate}
									                                	}
									                                });
                        	resolve({
                        				"LHWRF"				: data.length && data[0] && data[0].LHWRF ? data[0].LHWRF : 0,
										"otherSource"		: data.length && data[0] && data[0].otherSource ? data[0].otherSource : 0,
										"Govt"				: data.length && data[0] && data[0].Govt ? data[0].Govt : 0,
										"Community"			: data.length && data[0] && data[0].Community ? data[0].Community : 0,
										"otherOrg"			: data.length && data[0] && data[0].otherOrg ? data[0].otherOrg : 0,
                                        "TotalBudget"       : data.length && data[0] && data[0].TotalBudget ? data[0].TotalBudget : 0,
                                        "Reach"				: reachFamilyUpgrade && reachFamilyUpgrade.Reach ? reachFamilyUpgrade.Reach : 0,
										"FamilyUpgradation" : reachFamilyUpgrade && reachFamilyUpgrade.FamilyUpgradation ? reachFamilyUpgrade.FamilyUpgradation : 0,
                        			});
                    	}
                    })
                    .catch(err=>{
                        reject(err);
                    });
    });
};
function getAdminCost(center_ID,startDate,endDate){
    return new Promise(function(resolve,reject){
        AnnualPlan  .aggregate([
                                {
                                    $match : {
                                        "center_ID"         : String(center_ID),
                                        "date"              : {$gte : startDate, $lte : endDate},
                                        "sectorName"        : "Admin Cost",
                                        "activityName"      : "Admin Cost",
                                        "subactivityName"  : "Admin Cost",
                                    }
                                },
                    ])
                    .exec()
                    .then(data=>{
                        if(data.length > 0){
                            resolve(data[0].totalBudget)
                        }else{
                            resolve(0)
                        }
                        
                    })
                    .catch(err=>{
                        reject(err);
                    });
    });
};
function getDataAnnualPlan(center_ID, year,startDate,endDate){
	return new Promise(function(resolve,reject){
        AnnualPlan  .aggregate([
                                {
                                	$match : {
                                		"center_ID" : String(center_ID),
                                		"year"		: year
                                	}
                                },
                                {
                                    $group : {
                                        "_id"               : null,
                                        "LHWRF"             : { "$sum" : "$LHWRF" },
                                        "Govt"              : { "$sum" : "$govtscheme" },
                                        "Other"             : { "$sum" : "$other" },                                        
                                        "TotalBudget"       : { "$sum" : "$totalBudget" },
                                        "NABARD"            : { "$sum" : "$NABARD" },
                                        "Bank_Loan"         : { "$sum" : "$bankLoan" },
                                        "DirectCC"          : { "$sum" : "$directCC" },
                                        "IndirectCC"        : { "$sum" : "$indirectCC" },
                                        "Reach"				: { "$sum" : "$noOfBeneficiaries"},
                                        "FamilyUpgradation" : { "$sum" : "$noOfFamilies"}
                                    }
                                },
                                {
                                	$project : {
                                			"LHWRF"				: "$LHWRF",
											"otherSource"		: { "$subtract": [ "$TotalBudget", "$LHWRF" ] },
											"TotalBudget" 		: "$TotalBudget",
											"FamilyUpgradation"	: "$FamilyUpgradation",
											"Reach"				: "$Reach",
                                	}
                                }
                    ])
                    .exec()
                    .then(data=>{
                        	resolve(data[0]);
                    })
                    .catch(err=>{
                        reject(err);
                    });
    });
};
exports.getRanking = (req,res,next)=>{
	var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
	Center.find()
		  .exec()
		  .then(data=>{
                if(data.length > 0 ){
                	getData();
                	async function getData(){
                		var returnData = [];
                		var k = 0;
                		for(k = 0 ; k < data.length ; k++){
                			var annualData 					    = await getDataAnnualPlan(data[k]._id, deriveDate.year,req.params.startDate,req.params.endDate);
                			var activityData				    = await getActivityReport(data[k]._id, req.params.startDate,req.params.endDate);
                            var adminCost                       = await getAdminCost(data[k]._id);
                            // console.log("adminCost ",await getAdminCost(data[k]._id));
                            var LHWRF_Sactioned                 = getDataAnnualPlan && getDataAnnualPlan.LHWRF ? (getDataAnnualPlan.LHWRF / 100000) : 0;
                            var LHWRF_Utilized                  = getActivityReport && getActivityReport.LHWRF ? (getActivityReport.LHWRF / 100000) : 0;
                            var Other_Sactioned                 = getDataAnnualPlan && getDataAnnualPlan.otherSource ? (getDataAnnualPlan.otherSource / 100000) : 0;
                            var Other_Utilized                  = getActivityReport && getActivityReport.otherSource ? (getActivityReport.otherSource / 100000) : 0;
                            var Total_Sactioned                 = LHWRF_Sactioned + Other_Sactioned;
                            var Total_Utilized                  = LHWRF_Utilized + Other_Utilized;
                            var Admin_Cost                      = adminCost ? adminCost : 0;
                            var OutReach                        = getActivityReport && getActivityReport.Reach ? getActivityReport.Reach : 0;
                            var Families_Sactioned              = getDataAnnualPlan && getDataAnnualPlan.FamilyUpgradation ? getDataAnnualPlan.FamilyUpgradation : 0;
                            var Families_Utilized               = getActivityReport && getActivityReport.FamilyUpgradation? getActivityReport.FamilyUpgradation : 0;
                            var Fund_Mobilized_Govt             = getActivityReport && getActivityReport.Govt ? (getActivityReport.Govt / 100000) : 0;
                            var Fund_Mobilized_Other            = getActivityReport && getActivityReport.otherOrg ? (getActivityReport.otherOrg / 100000) : 0;
                            var Fund_Mobilized_Community        = getActivityReport && getActivityReport.Community ? (getActivityReport.Community / 100000) : 0;
                            var Fund_Mobilized_Total            = Fund_Mobilized_Govt + Fund_Mobilized_Other + Fund_Mobilized_Community;
                            var LHWRF_Ratio                     = LHWRF_Utilized / LHWRF_Sactioned;
                            var Other_Ratio                     = Other_Utilized / Other_Sactioned;
                            var Total_Ratio                     = Total_Utilized / Total_Sactioned;

                            var Cost_Per_Village                = Total_Ratio / OutReach;
                            var Cost_Per_Family                 = Total_Ratio / Families_Utilized;
                            var Admin_Cost_Percentage           = Admin_Cost / Total_Utilized;

                            var Fund_Mobilized_Govt_Ratio       = Fund_Mobilized_Govt / Total_Sactioned;
                            var Fund_Mobilized_Other_Ratio      = Fund_Mobilized_Other / Total_Sactioned;
                            var Fund_Mobilized_Community_Ratio  = Fund_Mobilized_Community / Total_Sactioned;
                            var Fund_Mobilized_Total_Ratio      = Fund_Mobilized_Total / Total_Sactioned;

                            var sum                             = (LHWRF_Ratio + Other_Ratio + Total_Ratio + Admin_Cost_Percentage + Fund_Mobilized_Total_Ratio);
                            var Factor                          = sum / 100;

                            returnData.push({
                                                "_id"                       : data[k]._id,
                                                "centerName"                : data[k].centerName,
                                                "LHWRF_Utilized"            : (Factor * LHWRF_Ratio * 100) ? (Factor * LHWRF_Ratio * 100) : 0,
                                                "Other_Utilized"            : (Factor * Other_Ratio * 100) ? (Factor * Other_Ratio * 100) : 0,
                                                "totalBudget_Utilized"      : (Factor * Total_Ratio * 100) ? (Factor * Total_Ratio * 100) : 0,
                                                "outReach"                  : 0,
                                                "FamilyUpgradation"         : 0,
                                                "Admin_Cost"                : Admin_Cost,
                                                "sum"                       : sum,
                                                "Factor"                    : Factor,
                                                "score"                     : 0,
                							});
                		}
                		if(k >= data.length){
                			res.status(200).json(returnData);
                		}
                	}
                }else{
                	res.status(200).json({message:"Data not found"})
                }
		  })
		  .catch(err=>{
                res.status(200).json(err);
            });
};
// exports.getRanking = (req,res,next)=>{
//     var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
//     // console.log("req.params",req.params.endDate);
//     Center.find()
//           .exec()
//           .then(data=>{ 5163
//                 if(data.length > 0 ){
//                     getData();
//                     async function getData(){
//                         var returnData = [];
//                         var k = 0;
//                         for(k = 0 ; k < data.length ; k++){
//                             var annualData                  = await getDataAnnualPlan(data[k]._id, deriveDate.year,req.params.startDate,req.params.endDate);
//                             var activityData                = await getActivityReport(data[k]._id, req.params.startDate,req.params.endDate);
//                             // console.log("activityData =====",activityData);
//                             var LHWRF_Sactioned             = annualData && annualData.LHWRF ? annualData.LHWRF : 0;
//                             var Other_Sactioned             = annualData && annualData.otherSource ? annualData.otherSource : 0;
//                             var totalBudget_Sactioned       = annualData && annualData.TotalBudget ? annualData.TotalBudget : 0;
//                             var FamilyUpgradation_Target    = annualData && annualData.FamilyUpgradation ? annualData.FamilyUpgradation : 0;
//                             var Reach_Target                = annualData && annualData.Reach ? annualData.Reach : 0;
//                             var FamilyUpgradated            = activityData && activityData.FamilyUpgradation ? activityData.FamilyUpgradation : 0;
//                             var LHWRF_Utilized              = activityData && activityData.LHWRF ? activityData.LHWRF : 0;
//                             var Other_Utilized              = activityData && activityData.otherSource ? activityData.otherSource : 0;
//                             var totalBudget_Utilized        = activityData && activityData.TotalBudget ? activityData.TotalBudget : 0;
//                             var Govt_Utilized               = activityData && activityData.Govt ? activityData.Govt : 0;
//                             var Community_Utilized          = activityData && activityData.Community ? activityData.Community : 0;
//                             var otherOrg_Utilized           = activityData && activityData.otherOrg ? activityData.otherOrg : 0;
//                             var outReach_Utilized           = activityData && activityData.Reach ? activityData.Reach : 0;
//                             var FamilyUpgradation_Utilized  = activityData && activityData.FamilyUpgradation ? activityData.FamilyUpgradation : 0;
//                             var Total_Utilized_Other        = Govt_Utilized + Community_Utilized + otherOrg_Utilized;
//                             var score                       = (((LHWRF_Utilized / LHWRF_Sactioned)*2)+((Other_Utilized / Other_Sactioned)*2)+((Total_Utilized_Other / totalBudget_Sactioned) * 2) + ((outReach_Utilized / Reach_Target) * 2) + ((FamilyUpgradation_Utilized / FamilyUpgradation_Target) *2)).toFixed(2);
//                             // console.log("score ",score);
//                             returnData.push({
                                
//                                                 "_id"                       : data[k]._id,
//                                                 "centerName"                : data[k].centerName,
//                                                 // "LHWRF_Sactioned"            : annualData && annualData.LHWRF ? annualData.LHWRF : 0,
//                                                 // "Other_Sactioned"            : annualData && annualData.otherSource ? annualData.otherSource : 0,
//                                                 // "totalBudget_Sactioned"      : annualData && annualData.TotalBudget ? annualData.TotalBudget : 0,
//                                                 "FamilyUpgradation_Target"  : annualData && annualData.FamilyUpgradation ? annualData.FamilyUpgradation : 0,
//                                                 "Reach_Target"              : annualData && annualData.Reach ? annualData.Reach : 0,
//                                                 "LHWRF_Utilized"            : activityData && activityData.LHWRF ? activityData.LHWRF : 0,
//                                                 "Other_Utilized"            : activityData && activityData.otherSource ? activityData.otherSource : 0,
//                                                 "totalBudget_Utilized"      : activityData && activityData.TotalBudget ? activityData.TotalBudget : 0,
//                                                 // "Govt_Utilized"              : activityData && activityData.Govt ? activityData.Govt : 0,
//                                                 // "Community_Utilized"     : activityData && activityData.Community ? activityData.Community : 0,
//                                                 // "otherOrg_Utilized"          : activityData && activityData.otherOrg ? activityData.otherOrg : 0,
//                                                 "outReach"          : activityData && activityData.Reach ? activityData.Reach : 0,
//                                                 "FamilyUpgradation": activityData && activityData.FamilyUpgradation ? activityData.FamilyUpgradation : 0,
                                                
//                                                 "LHWRF_Ratio"               : (LHWRF_Utilized / LHWRF_Sactioned) ? (LHWRF_Utilized / LHWRF_Sactioned) : 0,
//                                                 "Total_Utilized_Other"      : (Govt_Utilized + Community_Utilized + otherOrg_Utilized) ? (Govt_Utilized + Community_Utilized + otherOrg_Utilized) : 0,
//                                                 "Cost_Village"              : (totalBudget_Utilized / outReach_Utilized) ? (totalBudget_Utilized / outReach_Utilized) : 0,
//                                                 "Cost_Upgrade"              : (totalBudget_Utilized / FamilyUpgradation_Utilized) ? (totalBudget_Utilized / FamilyUpgradation_Utilized) : 0,
//                                                 "Other_Ratio"               : (Other_Utilized / Other_Sactioned) ? (Other_Utilized / Other_Sactioned) : 0,
//                                                 "TotalBudget_Ratio"         : (totalBudget_Utilized / totalBudget_Sactioned) ? (totalBudget_Utilized / totalBudget_Sactioned) : 0,
//                                                 "Govt_Ratio"                : (Govt_Utilized / totalBudget_Sactioned) ? (Govt_Utilized / totalBudget_Sactioned) : 0,
//                                                 "otherOrg_Ratio"            : (otherOrg_Utilized / totalBudget_Sactioned) ? (otherOrg_Utilized / totalBudget_Sactioned) : 0,
//                                                 "Community_Ratio"           : (Community_Utilized / totalBudget_Sactioned) ? (Community_Utilized / totalBudget_Sactioned) : 0,
//                                                 "Total_Utilized_Ratio"      : (Total_Utilized_Other / totalBudget_Sactioned) ? (Total_Utilized_Other / totalBudget_Sactioned) : 0,
                                                
//                                                 // "score"                     : (((LHWRF_Utilized / LHWRF_Sactioned)*2)+((Other_Utilized / Other_Sactioned)*2)+((Total_Utilized_Other / totalBudget_Sactioned) * 2) + ((outReach_Utilized / Reach_Target) * 2) + ((FamilyUpgradation_Utilized / FamilyUpgradation_Target) *2)).toFixed(2) ? (((LHWRF_Utilized / LHWRF_Sactioned)*2)+((Other_Utilized / Other_Sactioned)*2)+((Total_Utilized_Other / totalBudget_Sactioned) * 2) + ((outReach_Utilized / Reach_Target) * 2) + ((FamilyUpgradation_Utilized / FamilyUpgradation_Target) *2)).toFixed(2) : 0,
//                                                 "score"                     : score != "NaN" ? score : 0,
//                                             });
//                         }
//                         if(k >= data.length){
//                             res.status(200).json(returnData);
//                         }
//                     }
//                 }else{
//                     res.status(200).json({message:"Data not found"})
//                 }
//           })
//           .catch(err=>{
//                 res.status(200).json(err);
//             });
// };