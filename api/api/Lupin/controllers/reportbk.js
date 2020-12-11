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

var query_annualPlan        = {};
var query_monthlyPlan       = {};
var query_activityReport    = {};

function getResultData(data,selectData){
    return new Promise(function(resolve,reject){
        var returnData                              = [];
        var annualPlan_PhysicalUnit                 = 0;                        
        var annualPlan_TotalBudget                  = 0;
        var annualPlan_Reach                        = 0;
        var annualPlan_FamilyUpgradation            = 0;
        var annualPlan_LHWRF                        = 0;
        var annualPlan_NABARD                       = 0;
        var annualPlan_Bank_Loan                    = 0;
        var annualPlan_Govt                         = 0;
        var annualPlan_DirectCC                     = 0;
        var annualPlan_IndirectCC                   = 0;
        var annualPlan_Other                        = 0;
        var annualPlan_UnitCost                     = 0;
        var achievement_Reach                       = 0;
        var achievement_FamilyUpgradation           = 0;
        var achievement_PhysicalUnit                = 0;
        var achievement_UnitCost                    = 0;
        var achievement_TotalBudget                 = 0;
        var achievement_LHWRF                       = 0;
        var achievement_NABARD                      = 0;
        var achievement_Bank_Loan                   = 0;
        var achievement_DirectCC                    = 0;
        var achievement_IndirectCC                  = 0;
        var achievement_Govt                        = 0;
        var achievement_Other                       = 0;
        var achievement_Total                       = 0;
        var curr_achievement_Reach                       = 0;
        var curr_achievement_FamilyUpgradation           = 0;
        var curr_achievement_PhysicalUnit                = 0;
        var curr_achievement_UnitCost                    = 0;
        var curr_achievement_TotalBudget                 = 0;
        var curr_achievement_LHWRF                       = 0;
        var curr_achievement_NABARD                      = 0;
        var curr_achievement_Bank_Loan                   = 0;
        var curr_achievement_DirectCC                    = 0;
        var curr_achievement_IndirectCC                  = 0;
        var curr_achievement_Govt                        = 0;
        var curr_achievement_Other                       = 0;
        var curr_achievement_Total                       = 0;
        var monthlyPlan_PhysicalUnit                = 0;
        var monthlyPlan_UnitCost                    = 0;
        var monthlyPlan_TotalBudget                 = 0;
        var monthlyPlan_LHWRF                       = 0;
        var monthlyPlan_NABARD                      = 0;
        var monthlyPlan_Bank_Loan                   = 0;
        var monthlyPlan_IndirectCC                  = 0;
        var monthlyPlan_DirectCC                    = 0;
        var monthlyPlan_Govt                        = 0;
        var monthlyPlan_Other                       = 0;
        var monthlyPlan_Reach                       = 0;
        var monthlyPlan_FamilyUpgradation           = 0;
        var curr_monthlyPlan_PhysicalUnit           = 0;
        var curr_monthlyPlan_UnitCost               = 0;
        var curr_monthlyPlan_TotalBudget            = 0;
        var curr_monthlyPlan_LHWRF                  = 0;
        var curr_monthlyPlan_NABARD                 = 0;
        var curr_monthlyPlan_Bank_Loan              = 0;
        var curr_monthlyPlan_IndirectCC             = 0;
        var curr_monthlyPlan_DirectCC               = 0;
        var curr_monthlyPlan_Govt                   = 0;
        var curr_monthlyPlan_Other                  = 0;
        var curr_monthlyPlan_Reach                  = 0;
        var curr_monthlyPlan_FamilyUpgradation      = 0;
        var variance_monthlyPlan_PhysicalUnit       = 0;
        var variance_monthlyPlan_UnitCost           = 0;
        var variance_monthlyPlan_TotalBudget        = 0;
        var variance_monthlyPlan_LHWRF              = 0;
        var variance_monthlyPlan_NABARD             = 0;
        var variance_monthlyPlan_Bank_Loan          = 0;
        var variance_monthlyPlan_IndirectCC         = 0;
        var variance_monthlyPlan_DirectCC           = 0;
        var variance_monthlyPlan_Govt               = 0;
        var variance_monthlyPlan_Other              = 0;
        var variance_monthlyPlan_Reach              = 0;
        var variance_monthlyPlan_FamilyUpgradation  = 0;
        getData();
        async function getData(){
            for(i = 0 ; i < data.length; i++){
                var annualPlanQuery         = {};
                var monthlyPlanQuery        = {};
                var activityReportQuery     = {};
                var currtentActivityReportQuery     = {};
                var currentMonthlyPlanQuery = {};
                var currentMonthStartDate   =  moment(data[i].endDate).format("YYYY")+'-'+moment(data[i].endDate).format("MM")+'-01';
                switch(selectData){
                    case "subActivities" :
                        if(data[i].center_ID != 'all'){
                            annualPlanQuery = {
                                                $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "year"              : data[i].year
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "year"              : { $in : data[i].yearList},
                                                            "month"             : { $in : data[i].monthList}
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "year"              : { $in : [moment(data[i].endDate).format("YYYY")]},
                                                            "month"             : { $in : [moment(data[i].endDate).format("MMMM")]}
                                                        }
                                            };
                            activityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate}
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}
                                                        }
                                            };
                        }else{
                            annualPlanQuery = {
                                                $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "year"              : data[i].year
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "year"              : { $in : data[i].yearList},
                                                            "month"             : { $in : data[i].monthList}
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "year"              : { $in : [moment(data[i].endDate).format("YYYY")]},
                                                            "month"             : { $in : [moment(data[i].endDate).format("MMMM")]}
                                                        }
                                            };
                            activityReportQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate}
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}
                                                        }
                                            };
                        }
                        var selectDataName = {
                                "name"      : data[i].activityName + " : " + data[i].subActivityName,
                                "unit"      : data[i].unit
                        };
                    break;
                    case "sector"   :
                        if(data[i].center_ID != 'all'){
                            annualPlanQuery = {
                                                $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "year"              : data[i].year
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "year"              : { $in : data[i].yearList},
                                                            "month"             : { $in : data[i].monthList}
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "year"              : { $in : [moment(data[i].endDate).format("YYYY")]},
                                                            "month"             : { $in : [moment(data[i].endDate).format("MMMM")]}
                                                        }
                                            };
                            activityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate}
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}
                                                        }
                                            };
                        }else{
                            annualPlanQuery = {
                                                $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "year"              : data[i].year
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "year"              : { $in : data[i].yearList},
                                                            "month"             : { $in : data[i].monthList}
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "year"              : { $in : [moment(data[i].endDate).format("YYYY")]},
                                                            "month"             : { $in : [moment(data[i].endDate).format("MMMM")]}
                                                        }
                                            };
                            activityReportQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate}
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}
                                                        }
                                            };
                        }
                        var selectDataName = {
                                "name"      : data[i].sector,
                                "unit"      : ""
                        };
                    break;
                    case "geographical" :
                        if(data[i].center_ID != 'all'){
                            activityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            annualPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}
                                                        }
                                            };

                        }else{
                            activityReportQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            annualPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate},
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "sector_ID"         : String(data[i].sector_ID),
                                                            "activity_ID"       : String(data[i].activity_ID),
                                                            "subactivity_ID"    : String(data[i].subactivity_ID),
                                                            "district"          : data[i].district,
                                                            "block"             : data[i].block,
                                                            "village"           : data[i].village,
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}
                                                        }
                                            };
                        }
                        var selectDataName = {
                                "name"      : data[i].activityName + " : " + data[i].subActivityName,
                                "unit"      : ""
                        };
                    break;
                    case "center" :
                        if(data[i].center_ID != 'all'){
                            activityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate},
                                                        }
                                            };
                            annualPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "year"              : data[i].year
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "year"              : { $in : data[i].yearList},
                                                            "month"             : { $in : data[i].monthList}
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "center_ID"         : String(data[i].center_ID),
                                                            "year"              : { $in : [moment(data[i].endDate).format("YYYY")]},
                                                            "month"             : { $in : [moment(data[i].endDate).format("MMMM")]}
                                                        }
                                            };
                        }else{
                            activityReportQuery = {
                                                    $match : {
                                                            "date"              : {$gte : data[i].startDate, $lte : data[i].endDate},
                                                        }
                                            };
                            currtentActivityReportQuery = {
                                                    $match : {
                                                            "date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate},
                                                        }
                                            };
                            annualPlanQuery = {
                                                    $match : {
                                                            "year"              : data[i].year
                                                        }
                                            };
                            monthlyPlanQuery = {
                                                    $match : {
                                                            "year"              : { $in : data[i].yearList},
                                                            "month"             : { $in : data[i].monthList}
                                                        }
                                            };
                            currentMonthlyPlanQuery = {
                                                    $match : {
                                                            "year"              : { $in : [moment(data[i].endDate).format("YYYY")]},
                                                            "month"             : { $in : [moment(data[i].endDate).format("MMMM")]}
                                                        }
                                            };
                        }
                        var selectDataName = {
                                "name"      : data[i].centerName,
                                "unit"      : ""
                        };
                    break;
                    default :
                        resolve("Invalid Option");
                    break;
                };

                var annualPlanData                      = await annualPlan(annualPlanQuery);
                var monthlyPlanData                     = await monthlyPlan(monthlyPlanQuery);
                var activityReportData                  = await activityReport(activityReportQuery);
                var currentactivityReportData           = await activityReport(currtentActivityReportQuery);
                var currentMonthly                      = await monthlyPlan(currentMonthlyPlanQuery);
                annualPlan_PhysicalUnit                 += annualPlanData.PhysicalUnit ? annualPlanData.PhysicalUnit : 0;                        
                annualPlan_TotalBudget                  += annualPlanData.TotalBudget ? annualPlanData.TotalBudget : 0;
                annualPlan_Reach                        += annualPlanData.Reach ? annualPlanData.Reach : 0;
                annualPlan_FamilyUpgradation            += annualPlanData.FamilyUpgradation ? annualPlanData.FamilyUpgradation : 0;
                annualPlan_LHWRF                        += annualPlanData.LHWRF ? annualPlanData.LHWRF : 0;
                annualPlan_NABARD                       += annualPlanData.NABARD ? annualPlanData.NABARD : 0;
                annualPlan_Bank_Loan                    += annualPlanData.Bank_Loan ? annualPlanData.Bank_Loan : 0;
                annualPlan_Govt                         += annualPlanData.Govt ? annualPlanData.Govt : 0;
                annualPlan_DirectCC                     += annualPlanData.DirectCC ? annualPlanData.DirectCC : 0;
                annualPlan_IndirectCC                   += annualPlanData.IndirectCC ? annualPlanData.IndirectCC : 0;
                annualPlan_Other                        += annualPlanData.Other ? annualPlanData.Other : 0;
                annualPlan_UnitCost                     += annualPlanData.UnitCost ? annualPlanData.UnitCost : 0;

                monthlyPlan_PhysicalUnit                += monthlyPlanData.PhysicalUnit ? monthlyPlanData.PhysicalUnit : 0;
                monthlyPlan_UnitCost                    += monthlyPlanData.UnitCost ? monthlyPlanData.UnitCost : 0;
                monthlyPlan_TotalBudget                 += monthlyPlanData.TotalBudget ? monthlyPlanData.TotalBudget : 0;
                monthlyPlan_LHWRF                       += monthlyPlanData.LHWRF ? monthlyPlanData.LHWRF : 0;
                monthlyPlan_NABARD                      += monthlyPlanData.NABARD ? monthlyPlanData.NABARD : 0;
                monthlyPlan_Bank_Loan                   += monthlyPlanData.Bank_Loan ? monthlyPlanData.Bank_Loan : 0;
                monthlyPlan_IndirectCC                  += monthlyPlanData.IndirectCC ? monthlyPlanData.IndirectCC : 0;
                monthlyPlan_DirectCC                    += monthlyPlanData.DirectCC ? monthlyPlanData.DirectCC : 0;
                monthlyPlan_Govt                        += monthlyPlanData.Govt ? monthlyPlanData.Govt : 0;
                monthlyPlan_Other                       += monthlyPlanData.Other ? monthlyPlanData.Other : 0;
                monthlyPlan_Reach                       += monthlyPlanData.Reach ? monthlyPlanData.Reach : 0;
                monthlyPlan_FamilyUpgradation           += monthlyPlanData.FamilyUpgradation ? monthlyPlanData.FamilyUpgradation : 0;

                curr_monthlyPlan_PhysicalUnit           += currentMonthly.PhysicalUnit ? currentMonthly.PhysicalUnit : 0;
                curr_monthlyPlan_UnitCost               += currentMonthly.UnitCost ? currentMonthly.UnitCost : 0;
                curr_monthlyPlan_TotalBudget            += currentMonthly.TotalBudget ? currentMonthly.TotalBudget : 0;
                curr_monthlyPlan_LHWRF                  += currentMonthly.LHWRF ? currentMonthly.LHWRF : 0;
                curr_monthlyPlan_NABARD                 += currentMonthly.NABARD ? currentMonthly.NABARD : 0;
                curr_monthlyPlan_Bank_Loan              += currentMonthly.Bank_Loan ? currentMonthly.Bank_Loan : 0;
                curr_monthlyPlan_IndirectCC             += currentMonthly.IndirectCC ? currentMonthly.IndirectCC : 0;
                curr_monthlyPlan_DirectCC               += currentMonthly.DirectCC ? currentMonthly.DirectCC : 0;
                curr_monthlyPlan_Govt                   += currentMonthly.Govt ? currentMonthly.Govt : 0;
                curr_monthlyPlan_Other                  += currentMonthly.Other ? currentMonthly.Other : 0;
                curr_monthlyPlan_Reach                  += currentMonthly.Reach ? currentMonthly.Reach : 0;
                curr_monthlyPlan_FamilyUpgradation      += currentMonthly.FamilyUpgradation ? currentMonthly.FamilyUpgradation : 0;

                achievement_Reach                       += activityReportData.Reach ? activityReportData.Reach :0;
                achievement_FamilyUpgradation           += activityReportData.FamilyUpgradation/3 ? activityReportData.FamilyUpgradation/3 : 0;
                achievement_PhysicalUnit                += activityReportData.PhysicalUnit ? activityReportData.PhysicalUnit : 0;
                achievement_UnitCost                    += activityReportData.UnitCost ? activityReportData.UnitCost : 0;
                achievement_TotalBudget                 += activityReportData.TotalBudget ? activityReportData.TotalBudget : 0;
                achievement_LHWRF                       += activityReportData.LHWRF ? activityReportData.LHWRF : 0;
                achievement_NABARD                      += activityReportData.NABARD ? activityReportData.NABARD : 0;
                achievement_Bank_Loan                   += activityReportData.Bank_Loan ? activityReportData.Bank_Loan : 0;
                achievement_DirectCC                    += activityReportData.DirectCC ? activityReportData.DirectCC : 0;
                achievement_IndirectCC                  += activityReportData.IndirectCC ? activityReportData.IndirectCC : 0;
                achievement_Govt                        += activityReportData.Govt ? activityReportData.Govt : 0;
                achievement_Other                       += activityReportData.Other ? activityReportData.Other : 0;
                achievement_Total                       += activityReportData.Total ? activityReportData.Total : 0;

                curr_achievement_Reach                  += currentactivityReportData.Reach ? currentactivityReportData.Reach :0;
                curr_achievement_FamilyUpgradation           += currentactivityReportData.FamilyUpgradation/3 ? currentactivityReportData.FamilyUpgradation/3 : 0;
                curr_achievement_PhysicalUnit                += currentactivityReportData.PhysicalUnit ? currentactivityReportData.PhysicalUnit : 0;
                curr_achievement_UnitCost                    += currentactivityReportData.UnitCost ? currentactivityReportData.UnitCost : 0;
                curr_achievement_TotalBudget                 += currentactivityReportData.TotalBudget ? currentactivityReportData.TotalBudget : 0;
                curr_achievement_LHWRF                       += currentactivityReportData.LHWRF ? currentactivityReportData.LHWRF : 0;
                curr_achievement_NABARD                      += currentactivityReportData.NABARD ? currentactivityReportData.NABARD : 0;
                curr_achievement_Bank_Loan                   += currentactivityReportData.Bank_Loan ? currentactivityReportData.Bank_Loan : 0;
                curr_achievement_DirectCC                    += currentactivityReportData.DirectCC ? currentactivityReportData.DirectCC : 0;
                curr_achievement_IndirectCC                  += currentactivityReportData.IndirectCC ? currentactivityReportData.IndirectCC : 0;
                curr_achievement_Govt                        += currentactivityReportData.Govt ? currentactivityReportData.Govt : 0;
                curr_achievement_Other                       += currentactivityReportData.Other ? currentactivityReportData.Other : 0;
                curr_achievement_Total                       += currentactivityReportData.Total ? currentactivityReportData.Total : 0;

                variance_monthlyPlan_PhysicalUnit       += (monthlyPlanData.monthlyPlan_PhysicalUnit - activityReportData.PhysicalUnit) ? (monthlyPlanData.monthlyPlan_PhysicalUnit - activityReportData.PhysicalUnit) : 0;
                variance_monthlyPlan_UnitCost           += (monthlyPlanData.monthlyPlan_UnitCost     - activityReportData.UnitCost) ? (monthlyPlanData.monthlyPlan_UnitCost     - activityReportData.UnitCost) : 0; 
                variance_monthlyPlan_TotalBudget        += (monthlyPlanData.monthlyPlan_TotalBudget  - activityReportData.TotalBudget) ? (monthlyPlan_TotalBudget  - activityReportData.TotalBudget) : 0;
                variance_monthlyPlan_LHWRF              += (monthlyPlanData.monthlyPlan_LHWRF        - activityReportData.LHWRF) ? (monthlyPlanData.monthlyPlan_LHWRF        - activityReportData.LHWRF) : 0; 
                variance_monthlyPlan_NABARD             += (monthlyPlanData.monthlyPlan_NABARD       - activityReportData.NABARD) ? (monthlyPlanData.monthlyPlan_NABARD       - activityReportData.NABARD) : 0;
                variance_monthlyPlan_Bank_Loan          += (monthlyPlanData.monthlyPlan_Bank_Loan    - activityReportData.Bank_Loan) ? (monthlyPlanData.monthlyPlan_Bank_Loan    - activityReportData.Bank_Loan): 0;
                variance_monthlyPlan_IndirectCC         += (monthlyPlanData.monthlyPlan_IndirectCC   - activityReportData.IndirectCC) ? (monthlyPlanData.monthlyPlan_IndirectCC   - activityReportData.IndirectCC) : 0;
                variance_monthlyPlan_DirectCC           += (monthlyPlanData.monthlyPlan_DirectCC     - activityReportData.DirectCC) ? (monthlyPlanData.monthlyPlan_DirectCC     - activityReportData.DirectCC) : 0;
                variance_monthlyPlan_Govt               += (monthlyPlanData.monthlyPlan_Govt         - activityReportData.Govt) ? (monthlyPlanData.monthlyPlan_Govt         - activityReportData.Govt) : 0; 
                variance_monthlyPlan_Other              += (monthlyPlanData.monthlyPlan_Other        - activityReportData.Other) ? (monthlyPlanData.monthlyPlan_Other        - activityReportData.Other) : 0;
                variance_monthlyPlan_Reach              += (monthlyPlanData.monthlyPlan_Reach        - activityReportData.Reach) ? (monthlyPlanData.monthlyPlan_Reach        - activityReportData.Reach) : 0;
                variance_monthlyPlan_FamilyUpgradation  += (monthlyPlanData.monthlyPlan_FamilyUpgradation - activityReportData.FamilyUpgradation) ? (monthlyPlanData.monthlyPlan_FamilyUpgradation - activityReportData.FamilyUpgradation) : 0;
                returnData.push({
                    "name"                                  : selectDataName.name,
                    "unit"                                  : selectDataName.unit,

                    "annualPlan_UnitCost"                   : (annualPlanData.UnitCost) ? (annualPlanData.UnitCost) : 0,
                    "annualPlan_PhysicalUnit"               : annualPlanData.PhysicalUnit ? annualPlanData.PhysicalUnit : 0,                        
                    "annualPlan_TotalBudget"                : annualPlanData.TotalBudget ? annualPlanData.TotalBudget : 0,
                    "annualPlan_Reach"                      : annualPlanData.Reach ? annualPlanData.Reach : 0,
                    "annualPlan_FamilyUpgradation"          : annualPlanData.FamilyUpgradation ? annualPlanData.FamilyUpgradation : 0,
                    "annualPlan_LHWRF"                      : annualPlanData.LHWRF ? annualPlanData.LHWRF : 0,
                    "annualPlan_NABARD"                     : annualPlanData.NABARD ? annualPlanData.NABARD : 0,
                    "annualPlan_Bank_Loan"                  : annualPlanData.Bank_Loan ? annualPlanData.Bank_Loan : 0,
                    "annualPlan_Govt"                       : annualPlanData.Govt ? annualPlanData.Govt : 0,
                    "annualPlan_DirectCC"                   : annualPlanData.DirectCC ? annualPlanData.DirectCC : 0,
                    "annualPlan_IndirectCC"                 : annualPlanData.IndirectCC ? annualPlanData.IndirectCC : 0,
                    "annualPlan_Other"                      : annualPlanData.Other ? annualPlanData.Other : 0,
                    "annualPlan_Remark"                     : annualPlanData.Remark ? annualPlanData.Remark : 0,
                    
                    "annualPlan_UnitCost_L"                 : annualPlanData.UnitCost/100000 ? annualPlanData.UnitCost/100000 : 0,
                    "annualPlan_PhysicalUnit_L"             : annualPlanData.PhysicalUnit/100000 ? annualPlanData.PhysicalUnit/100000 : 0,
                    "annualPlan_TotalBudget_L"              : annualPlanData.TotalBudget/100000 ? annualPlanData.TotalBudget/100000 : 0,
                    "annualPlan_LHWRF_L"                    : annualPlanData.LHWRF/100000 ? annualPlanData.LHWRF/100000 : 0,
                    "annualPlan_NABARD_L"                   : annualPlanData.NABARD/100000 ? annualPlanData.NABARD/100000 : 0,
                    "annualPlan_Bank_Loan_L"                : annualPlanData.Bank_Loan/100000 ? annualPlanData.Bank_Loan/100000 : 0,
                    "annualPlan_Govt_L"                     : annualPlanData.Govt/100000 ? annualPlanData.Govt/100000 : 0,
                    "annualPlan_DirectCC_L"                 : annualPlanData.DirectCC/100000 ? annualPlanData.DirectCC/100000 : 0,
                    "annualPlan_IndirectCC_L"               : annualPlanData.IndirectCC/100000 ? annualPlanData.IndirectCC/100000 : 0,
                    "annualPlan_Other_L"                    : annualPlanData.Other/100000 ? annualPlanData.Other/100000 : 0,

                    "monthlyPlan_PhysicalUnit"              : monthlyPlanData.PhysicalUnit ? monthlyPlanData.PhysicalUnit : 0,
                    "monthlyPlan_UnitCost"                  : monthlyPlanData.UnitCost ? monthlyPlanData.UnitCost : 0,
                    "monthlyPlan_TotalBudget"               : monthlyPlanData.TotalBudget ? monthlyPlanData.TotalBudget : 0,
                    "monthlyPlan_LHWRF"                     : monthlyPlanData.LHWRF ? monthlyPlanData.LHWRF : 0,
                    "monthlyPlan_NABARD"                    : monthlyPlanData.NABARD ? monthlyPlanData.NABARD : 0,
                    "monthlyPlan_Bank_Loan"                 : monthlyPlanData.Bank_Loan ? monthlyPlanData.Bank_Loan : 0,
                    "monthlyPlan_IndirectCC"                : monthlyPlanData.IndirectCC ? monthlyPlanData.IndirectCC : 0,
                    "monthlyPlan_DirectCC"                  : monthlyPlanData.DirectCC ? monthlyPlanData.DirectCC : 0,
                    "monthlyPlan_Govt"                      : monthlyPlanData.Govt ? monthlyPlanData.Govt : 0,
                    "monthlyPlan_Other"                     : monthlyPlanData.Other ? monthlyPlanData.Other : 0,
                    "monthlyPlan_Reach"                     : monthlyPlanData.Reach ? monthlyPlanData.Reach : 0,
                    "monthlyPlan_FamilyUpgradation"         : monthlyPlanData.FamilyUpgradation ? monthlyPlanData.FamilyUpgradation : 0,

                    "curr_monthlyPlan_PhysicalUnit"         : currentMonthly.PhysicalUnit ? currentMonthly.PhysicalUnit : 0,
                    "curr_monthlyPlan_UnitCost"             : currentMonthly.UnitCost ? currentMonthly.UnitCost : 0,
                    "curr_monthlyPlan_TotalBudget"          : currentMonthly.TotalBudget ? currentMonthly.TotalBudget : 0,
                    "curr_monthlyPlan_LHWRF"                : currentMonthly.LHWRF ? currentMonthly.LHWRF : 0,
                    "curr_monthlyPlan_NABARD"               : currentMonthly.NABARD ? currentMonthly.NABARD : 0,
                    "curr_monthlyPlan_Bank_Loan"            : currentMonthly.Bank_Loan ? currentMonthly.Bank_Loan : 0,
                    "curr_monthlyPlan_IndirectCC"           : currentMonthly.IndirectCC ? currentMonthly.IndirectCC : 0,
                    "curr_monthlyPlan_DirectCC"             : currentMonthly.DirectCC ? currentMonthly.DirectCC : 0,
                    "curr_monthlyPlan_Govt"                 : currentMonthly.Govt ? currentMonthly.Govt : 0,
                    "curr_monthlyPlan_Other"                : currentMonthly.Other ? currentMonthly.Other : 0,
                    "curr_monthlyPlan_Reach"                : currentMonthly.Reach ? currentMonthly.Reach : 0,
                    "curr_monthlyPlan_FamilyUpgradation"    : currentMonthly.FamilyUpgradation ? currentMonthly.FamilyUpgradation : 0,

                    "monthlyPlan_PhysicalUnit_L"            : monthlyPlanData.PhysicalUnit/100000 ? monthlyPlanData.PhysicalUnit/100000 : 0,
                    "monthlyPlan_UnitCost_L"                : monthlyPlanData.UnitCost/100000 ? monthlyPlanData.UnitCost/100000 : 0,
                    "monthlyPlan_TotalBudget_L"             : monthlyPlanData.TotalBudget/100000 ? monthlyPlanData.TotalBudget/100000 : 0,
                    "monthlyPlan_LHWRF_L"                   : monthlyPlanData.LHWRF/100000 ? monthlyPlanData.LHWRF/100000 : 0,
                    "monthlyPlan_NABARD_L"                  : monthlyPlanData.NABARD/100000 ? monthlyPlanData.NABARD/100000 : 0,
                    "monthlyPlan_Bank_Loan_L"               : monthlyPlanData.Bank_Loan/100000 ? monthlyPlanData.Bank_Loan/100000 : 0,
                    "monthlyPlan_IndirectCC_L"              : monthlyPlanData.IndirectCC/100000 ? monthlyPlanData.IndirectCC/100000 : 0,
                    "monthlyPlan_DirectCC_L"                : monthlyPlanData.DirectCC/100000 ? monthlyPlanData.DirectCC/100000 : 0,
                    "monthlyPlan_Govt_L"                    : monthlyPlanData.Govt/100000 ? monthlyPlanData.Govt/100000 : 0,
                    "monthlyPlan_Other_L"                   : monthlyPlanData.Other/100000 ? monthlyPlanData.Other/100000 : 0,
                    "Per_Periodic"                          : monthlyPlanData.TotalBudget ? (((activityReportData.Total / monthlyPlanData.TotalBudget ) * 100).toFixed(2)) : "-",

                    "achievement_Reach"                     : activityReportData.Reach ? activityReportData.Reach : 0,
                    "achievement_FamilyUpgradation"         : activityReportData.FamilyUpgradation/3 ? activityReportData.FamilyUpgradation/3 : 0,
                    "achievement_PhysicalUnit"              : activityReportData.PhysicalUnit ? activityReportData.PhysicalUnit : 0,
                    "achievement_UnitCost"                  : activityReportData.UnitCost ? activityReportData.UnitCost : 0,
                    "achievement_TotalBudget"               : activityReportData.TotalBudget ? activityReportData.TotalBudget : 0,
                    "achievement_LHWRF"                     : activityReportData.LHWRF ? activityReportData.LHWRF : 0,
                    "achievement_NABARD"                    : activityReportData.NABARD ? activityReportData.NABARD : 0,
                    "achievement_Bank_Loan"                 : activityReportData.Bank_Loan ? activityReportData.Bank_Loan : 0,
                    "achievement_DirectCC"                  : activityReportData.DirectCC ? activityReportData.DirectCC : 0,
                    "achievement_IndirectCC"                : activityReportData.IndirectCC ? activityReportData.IndirectCC : 0,
                    "achievement_Govt"                      : activityReportData.Govt ? activityReportData.Govt : 0,
                    "achievement_Other"                     : activityReportData.Other ? activityReportData.Other : 0,
                    "achievement_Total"                     : activityReportData.Total ? activityReportData.Total : 0,
                    "Per_Annual"                            : annualPlanData.TotalBudget ? (((activityReportData.Total / annualPlanData.TotalBudget ) * 100).toFixed(2)) : "-",

                    "curr_achievement_Reach"                     : currentactivityReportData.Reach ? currentactivityReportData.Reach : 0,
                    "curr_achievement_FamilyUpgradation"         : currentactivityReportData.FamilyUpgradation/3 ? currentactivityReportData.FamilyUpgradation/3 : 0,
                    "curr_achievement_PhysicalUnit"              : currentactivityReportData.PhysicalUnit ? currentactivityReportData.PhysicalUnit : 0,
                    "curr_achievement_UnitCost"                  : currentactivityReportData.UnitCost ? currentactivityReportData.UnitCost : 0,
                    "curr_achievement_TotalBudget"               : currentactivityReportData.TotalBudget ? currentactivityReportData.TotalBudget : 0,
                    "curr_achievement_LHWRF"                     : currentactivityReportData.LHWRF ? currentactivityReportData.LHWRF : 0,
                    "curr_achievement_NABARD"                    : currentactivityReportData.NABARD ? currentactivityReportData.NABARD : 0,
                    "curr_achievement_Bank_Loan"                 : currentactivityReportData.Bank_Loan ? currentactivityReportData.Bank_Loan : 0,
                    "curr_achievement_DirectCC"                  : currentactivityReportData.DirectCC ? currentactivityReportData.DirectCC : 0,
                    "curr_achievement_IndirectCC"                : currentactivityReportData.IndirectCC ? currentactivityReportData.IndirectCC : 0,
                    "curr_achievement_Govt"                      : currentactivityReportData.Govt ? currentactivityReportData.Govt : 0,
                    "curr_achievement_Other"                     : currentactivityReportData.Other ? currentactivityReportData.Other : 0,
                    "curr_achievement_Total"                     : currentactivityReportData.Total ? currentactivityReportData.Total : 0,
                    "curr_Per_Monthly"                           : currentMonthly.TotalBudget ? (((currentactivityReportData.Total / currentMonthly.TotalBudget ) * 100).toFixed(2)) : "-",

                    "achievement_UnitCost_L"                : activityReportData.UnitCost/100000 ? activityReportData.UnitCost/100000 : 0,
                    "achievement_PhysicalUnit_L"            : activityReportData.PhysicalUnit/100000 ? activityReportData.PhysicalUnit/100000 : 0,
                    "achievement_TotalBudget_L"             : activityReportData.TotalBudget/100000 ? activityReportData.TotalBudget/100000 : 0,
                    "achievement_LHWRF_L"                   : activityReportData.LHWRF/100000 ? activityReportData.LHWRF/100000 : 0,
                    "achievement_NABARD_L"                  : activityReportData.NABARD/100000 ? activityReportData.NABARD/100000 : 0,
                    "achievement_Bank_Loan_L"               : activityReportData.Bank_Loan/100000 ? activityReportData.Bank_Loan/100000 : 0,
                    "achievement_DirectCC_L"                : activityReportData.DirectCC/100000 ? activityReportData.DirectCC/100000 : 0,
                    "achievement_IndirectCC_L"              : activityReportData.IndirectCC/100000 ? activityReportData.IndirectCC/100000 : 0,
                    "achievement_Govt_L"                    : activityReportData.Govt/100000 ? activityReportData.Govt/100000 : 0,
                    "achievement_Other_L"                   : activityReportData.Other/100000 ? activityReportData.Other/100000 : 0,
                    "achievement_Total_L"                   : activityReportData.Total/100000 ? activityReportData.Total/100000 : 0,

                    "variance_monthlyPlan_PhysicalUnit"     : monthlyPlanData.PhysicalUnit - activityReportData.PhysicalUnit ? monthlyPlanData.PhysicalUnit - activityReportData.PhysicalUnit : 0,
                    "variance_monthlyPlan_UnitCost"         : monthlyPlanData.UnitCost     - activityReportData.UnitCost ? monthlyPlanData.UnitCost     - activityReportData.UnitCost : 0,
                    "variance_monthlyPlan_TotalBudget"      : monthlyPlanData.TotalBudget  - activityReportData.TotalBudget ? monthlyPlanData.TotalBudget  - activityReportData.TotalBudget : 0,
                    "variance_monthlyPlan_LHWRF"            : monthlyPlanData.LHWRF        - activityReportData.LHWRF ? monthlyPlanData.LHWRF        - activityReportData.LHWRF : 0, 
                    "variance_monthlyPlan_NABARD"           : monthlyPlanData.NABARD       - activityReportData.NABARD ? monthlyPlanData.NABARD       - activityReportData.NABARD : 0,
                    "variance_monthlyPlan_Bank_Loan"        : monthlyPlanData.Bank_Loan    - activityReportData.Bank_Loan ? monthlyPlanData.Bank_Loan    - activityReportData.Bank_Loan : 0,
                    "variance_monthlyPlan_IndirectCC"       : monthlyPlanData.IndirectCC   - activityReportData.IndirectCC ? monthlyPlanData.IndirectCC   - activityReportData.IndirectCC : 0,
                    "variance_monthlyPlan_DirectCC"         : monthlyPlanData.DirectCC     - activityReportData.DirectCC ? monthlyPlanData.DirectCC     - activityReportData.DirectCC : 0,
                    "variance_monthlyPlan_Govt"             : monthlyPlanData.Govt         - activityReportData.Govt ? monthlyPlanData.Govt         - activityReportData.Govt : 0,
                    "variance_monthlyPlan_Other"            : monthlyPlanData.Other        - activityReportData.Other ? monthlyPlanData.Other        - activityReportData.Other : 0,
                    "variance_monthlyPlan_Total"            : monthlyPlanData.TotalBudget  - activityReportData.Total ? monthlyPlanData.TotalBudget  - activityReportData.Total : 0,
                    "variance_monthlyPlan_Reach"            : monthlyPlanData.Reach        - activityReportData.Reach ? monthlyPlanData.Reach        - activityReportData.Reach : 0,
                    "variance_monthlyPlan_FamilyUpgradation": monthlyPlanData.FamilyUpgradation - activityReportData.FamilyUpgradation ? monthlyPlanData.FamilyUpgradation - activityReportData.FamilyUpgradation : 0,

                    "variance_monthlyPlan_PhysicalUnit"     : (monthlyPlanData.PhysicalUnit - activityReportData.PhysicalUnit)/100000 ? (monthlyPlanData.PhysicalUnit - activityReportData.PhysicalUnit)/100000 : 0,
                    "variance_monthlyPlan_UnitCost"         : (monthlyPlanData.UnitCost     - activityReportData.UnitCost)/100000 ? (monthlyPlanData.UnitCost     - activityReportData.UnitCost)/100000 : 0,
                    "variance_monthlyPlan_TotalBudget_L"    : (monthlyPlanData.TotalBudget  - activityReportData.TotalBudget)/100000 ? (monthlyPlanData.TotalBudget  - activityReportData.TotalBudget)/100000 : 0,
                    "variance_monthlyPlan_LHWRF_L"          : (monthlyPlanData.LHWRF        - activityReportData.LHWRF)/100000 ? (monthlyPlanData.LHWRF        - activityReportData.LHWRF)/100000 : 0,
                    "variance_monthlyPlan_NABARD_L"         : (monthlyPlanData.NABARD       - activityReportData.NABARD)/100000 ? (monthlyPlanData.NABARD       - activityReportData.NABARD)/100000 : 0,
                    "variance_monthlyPlan_Bank_Loan_L"      : (monthlyPlanData.Bank_Loan    - activityReportData.Bank_Loan)/100000 ? (monthlyPlanData.Bank_Loan    - activityReportData.Bank_Loan)/100000 : 0 ,
                    "variance_monthlyPlan_IndirectCC_L"     : (monthlyPlanData.IndirectCC   - activityReportData.IndirectCC)/100000 ? (monthlyPlanData.IndirectCC   - activityReportData.IndirectCC)/100000 : 0,
                    "variance_monthlyPlan_DirectCC_L"       : (monthlyPlanData.DirectCC     - activityReportData.DirectCC)/100000 ? (monthlyPlanData.DirectCC     - activityReportData.DirectCC)/100000 : 0,
                    "variance_monthlyPlan_Govt_L"           : (monthlyPlanData.Govt         - activityReportData.Govt)/100000 ? (monthlyPlanData.Govt         - activityReportData.Govt)/100000 : 0,
                    "variance_monthlyPlan_Other_L"          : (monthlyPlanData.Other        - activityReportData.Other)/100000 ? (monthlyPlanData.Other        - activityReportData.Other)/100000 : 0,
                    "variance_monthlyPlan_Total_L"          : (monthlyPlanData.TotalBudget  - activityReportData.Total)/100000 ? (monthlyPlanData.TotalBudget  - activityReportData.Total)/100000 : 0,
                });
            }
            if(i >= data.length){
                returnData.push({
                    "name"                                  : "Total",
                    "unit"                                  : "",
                    
                    "annualPlan_Remark"                     : "",                    
                    "annualPlan_UnitCost"                   : annualPlan_UnitCost ? annualPlan_UnitCost : 0,
                    "annualPlan_PhysicalUnit"               : annualPlan_PhysicalUnit ? annualPlan_PhysicalUnit : 0,                        
                    "annualPlan_TotalBudget"                : annualPlan_TotalBudget ? annualPlan_TotalBudget : 0,
                    "annualPlan_Reach"                      : annualPlan_Reach ? annualPlan_Reach : 0,
                    "annualPlan_FamilyUpgradation"          : annualPlan_FamilyUpgradation ? annualPlan_FamilyUpgradation : 0,
                    "annualPlan_LHWRF"                      : annualPlan_LHWRF ? annualPlan_LHWRF : 0,
                    "annualPlan_NABARD"                     : annualPlan_NABARD ? annualPlan_NABARD : 0,
                    "annualPlan_Bank_Loan"                  : annualPlan_Bank_Loan ? annualPlan_Bank_Loan : 0,
                    "annualPlan_Govt"                       : annualPlan_Govt ? annualPlan_Govt : 0,
                    "annualPlan_DirectCC"                   : annualPlan_DirectCC ? annualPlan_DirectCC : 0,
                    "annualPlan_IndirectCC"                 : annualPlan_IndirectCC ? annualPlan_IndirectCC : 0,
                    "annualPlan_Other"                      : annualPlan_Other ? annualPlan_Other : 0,
                    
                    "annualPlan_UnitCost_L"                 : annualPlan_UnitCost/100000 ? annualPlan_UnitCost/100000 : 0,
                    "annualPlan_PhysicalUnit_L"             : annualPlan_PhysicalUnit/100000 ? annualPlan_PhysicalUnit/100000 : 0,
                    "annualPlan_TotalBudget_L"              : annualPlan_TotalBudget/100000 ? annualPlan_TotalBudget/100000 : 0,
                    "annualPlan_LHWRF_L"                    : annualPlan_LHWRF/100000 ? annualPlan_LHWRF/100000 : 0,
                    "annualPlan_NABARD_L"                   : annualPlan_NABARD/100000 ? annualPlan_NABARD/100000 : 0,
                    "annualPlan_Bank_Loan_L"                : annualPlan_Bank_Loan/100000 ? annualPlan_Bank_Loan/100000 : 0,
                    "annualPlan_Govt_L"                     : annualPlan_Govt/100000 ? annualPlan_Govt/100000 : 0,
                    "annualPlan_DirectCC_L"                 : annualPlan_DirectCC/100000 ? annualPlan_DirectCC/100000 : 0,
                    "annualPlan_IndirectCC_L"               : annualPlan_IndirectCC/100000 ? annualPlan_IndirectCC/100000 : 0,
                    "annualPlan_Other_L"                    : annualPlan_Other/100000 ? annualPlan_Other/100000 : 0, 

                    "monthlyPlan_PhysicalUnit"              : monthlyPlan_PhysicalUnit ? monthlyPlan_PhysicalUnit : 0,
                    "monthlyPlan_TotalBudget"               : monthlyPlan_TotalBudget ? monthlyPlan_TotalBudget : 0,
                    "monthlyPlan_LHWRF"                     : monthlyPlan_LHWRF ? monthlyPlan_LHWRF : 0,
                    "monthlyPlan_NABARD"                    : monthlyPlan_NABARD ? monthlyPlan_NABARD : 0,
                    "monthlyPlan_Bank_Loan"                 : monthlyPlan_Bank_Loan ? monthlyPlan_Bank_Loan : 0,
                    "monthlyPlan_IndirectCC"                : monthlyPlan_IndirectCC ? monthlyPlan_IndirectCC : 0,
                    "monthlyPlan_DirectCC"                  : monthlyPlan_DirectCC ? monthlyPlan_DirectCC : 0,
                    "monthlyPlan_Govt"                      : monthlyPlan_Govt ? monthlyPlan_Govt : 0,
                    "monthlyPlan_Other"                     : monthlyPlan_Other ? monthlyPlan_Other : 0,
                    "monthlyPlan_Reach"                     : monthlyPlan_Reach ? monthlyPlan_Reach : 0,
                    "monthlyPlan_FamilyUpgradation"         : monthlyPlan_FamilyUpgradation ? monthlyPlan_FamilyUpgradation : 0,
                    "Per_Periodic"                          : " ",
                    "monthlyPlan_PhysicalUnit_L"            : monthlyPlan_PhysicalUnit/100000 ? monthlyPlan_PhysicalUnit/100000 : 0,
                    "monthlyPlan_TotalBudget_L"             : monthlyPlan_TotalBudget/100000 ? monthlyPlan_TotalBudget/100000 : 0,
                    "monthlyPlan_LHWRF_L"                   : monthlyPlan_LHWRF/100000 ? monthlyPlan_LHWRF/100000 : 0,
                    "monthlyPlan_NABARD_L"                  : monthlyPlan_NABARD/100000 ? monthlyPlan_NABARD/100000 : 0,
                    "monthlyPlan_Bank_Loan_L"               : monthlyPlan_Bank_Loan/100000 ? monthlyPlan_Bank_Loan/100000 : 0,
                    "monthlyPlan_IndirectCC_L"              : monthlyPlan_IndirectCC/100000 ? monthlyPlan_IndirectCC/100000 : 0,
                    "monthlyPlan_DirectCC_L"                : monthlyPlan_DirectCC/100000 ? monthlyPlan_DirectCC/100000 : 0,
                    "monthlyPlan_Govt_L"                    : monthlyPlan_Govt/100000 ? monthlyPlan_Govt/100000 : 0,
                    "monthlyPlan_Other_L"                   : monthlyPlan_Other/100000 ? monthlyPlan_Other/100000 : 0,

                    "curr_monthlyPlan_PhysicalUnit"         : curr_monthlyPlan_PhysicalUnit ? curr_monthlyPlan_PhysicalUnit : 0,
                    "curr_monthlyPlan_TotalBudget"          : curr_monthlyPlan_TotalBudget ? curr_monthlyPlan_TotalBudget : 0,
                    "curr_monthlyPlan_LHWRF"                : curr_monthlyPlan_LHWRF ? curr_monthlyPlan_LHWRF : 0,
                    "curr_monthlyPlan_NABARD"               : curr_monthlyPlan_NABARD ? curr_monthlyPlan_NABARD : 0,
                    "curr_monthlyPlan_Bank_Loan"            : curr_monthlyPlan_Bank_Loan ? curr_monthlyPlan_Bank_Loan : 0,
                    "curr_monthlyPlan_IndirectCC"           : curr_monthlyPlan_IndirectCC ? curr_monthlyPlan_IndirectCC : 0,
                    "curr_monthlyPlan_DirectCC"             : curr_monthlyPlan_DirectCC ? curr_monthlyPlan_DirectCC : 0,
                    "curr_monthlyPlan_Govt"                 : curr_monthlyPlan_Govt ? curr_monthlyPlan_Govt : 0,
                    "curr_monthlyPlan_Other"                : curr_monthlyPlan_Other ? curr_monthlyPlan_Other : 0,
                    "curr_monthlyPlan_Reach"                : curr_monthlyPlan_Reach ? curr_monthlyPlan_Reach : 0,
                    "curr_monthlyPlan_FamilyUpgradation"    : curr_monthlyPlan_FamilyUpgradation ? curr_monthlyPlan_FamilyUpgradation : 0,
                    "curr_Per_Periodic"                     : " ",
                    "curr_monthlyPlan_PhysicalUnit_L"       : curr_monthlyPlan_PhysicalUnit/100000 ? curr_monthlyPlan_PhysicalUnit/100000 : 0,
                    "curr_monthlyPlan_TotalBudget_L"        : curr_monthlyPlan_TotalBudget/100000 ? curr_monthlyPlan_TotalBudget/100000 : 0,
                    "curr_monthlyPlan_LHWRF_L"              : curr_monthlyPlan_LHWRF/100000 ? curr_monthlyPlan_LHWRF/100000 : 0,
                    "curr_monthlyPlan_NABARD_L"             : curr_monthlyPlan_NABARD/100000 ? curr_monthlyPlan_NABARD/100000 : 0,
                    "curr_monthlyPlan_Bank_Loan_L"          : curr_monthlyPlan_Bank_Loan/100000 ? curr_monthlyPlan_Bank_Loan/100000 : 0,
                    "curr_monthlyPlan_IndirectCC_L"         : curr_monthlyPlan_IndirectCC/100000 ? curr_monthlyPlan_IndirectCC/100000 : 0,
                    "curr_monthlyPlan_DirectCC_L"           : curr_monthlyPlan_DirectCC/100000 ? curr_monthlyPlan_DirectCC/100000 : 0,
                    "curr_monthlyPlan_Govt_L"               : curr_monthlyPlan_Govt/100000 ? curr_monthlyPlan_Govt/100000 : 0,
                    "curr_monthlyPlan_Other_L"              : curr_monthlyPlan_Other/100000 ? curr_monthlyPlan_Other/100000 : 0,

                    "achievement_Reach"                     : achievement_Reach ? achievement_Reach : 0,
                    "achievement_FamilyUpgradation"         : achievement_FamilyUpgradation ? achievement_FamilyUpgradation : 0,
                    "achievement_PhysicalUnit"              : achievement_PhysicalUnit ? achievement_PhysicalUnit : 0,
                    "achievement_UnitCost"                  : achievement_UnitCost ? achievement_UnitCost : 0,
                    "achievement_TotalBudget"               : achievement_TotalBudget ? achievement_TotalBudget : 0,
                    "achievement_LHWRF"                     : achievement_LHWRF ? achievement_LHWRF : 0,
                    "achievement_NABARD"                    : achievement_NABARD ? achievement_NABARD : 0,
                    "achievement_Bank_Loan"                 : achievement_Bank_Loan ? achievement_Bank_Loan : 0,
                    "achievement_DirectCC"                  : achievement_DirectCC ? achievement_DirectCC : 0,
                    "achievement_IndirectCC"                : achievement_IndirectCC ? achievement_IndirectCC : 0,
                    "achievement_Govt"                      : achievement_Govt ? achievement_Govt : 0,
                    "achievement_Other"                     : achievement_Other ? achievement_Other : 0,
                    "Per_Annual"                            : " ",
                    "achievement_Total"                     : achievement_Total ? achievement_Total : 0,
                    "achievement_PhysicalUnit_L"            : achievement_PhysicalUnit/100000 ? achievement_PhysicalUnit/100000 : 0,
                    "achievement_UnitCost_L"                : achievement_UnitCost/100000 ? achievement_UnitCost/100000 : 0,
                    "achievement_TotalBudget_L"             : achievement_TotalBudget/100000 ? achievement_TotalBudget/100000 : 0,
                    "achievement_LHWRF_L"                   : achievement_LHWRF/100000 ? achievement_LHWRF/100000 : 0,
                    "achievement_NABARD_L"                  : achievement_NABARD/100000 ? achievement_NABARD/100000 : 0,
                    "achievement_Bank_Loan_L"               : achievement_Bank_Loan/100000 ? achievement_Bank_Loan/100000 : 0,
                    "achievement_DirectCC_L"                : achievement_DirectCC/100000 ? achievement_DirectCC/100000 : 0,
                    "achievement_IndirectCC_L"              : achievement_IndirectCC/100000 ? achievement_IndirectCC/100000 : 0,
                    "achievement_Govt_L"                    : achievement_Govt/100000 ? achievement_Govt/100000 : 0,
                    "achievement_Other_L"                   : achievement_Other/100000 ? achievement_Other/100000 : 0,

                    "curr_achievement_Reach"                     : curr_achievement_Reach ? curr_achievement_Reach : 0,
                    "curr_achievement_FamilyUpgradation"         : curr_achievement_FamilyUpgradation ? curr_achievement_FamilyUpgradation : 0,
                    "curr_achievement_PhysicalUnit"              : curr_achievement_PhysicalUnit ? curr_achievement_PhysicalUnit : 0,
                    "curr_achievement_UnitCost"                  : curr_achievement_UnitCost ? curr_achievement_UnitCost : 0,
                    "curr_achievement_TotalBudget"               : curr_achievement_TotalBudget ? curr_achievement_TotalBudget : 0,
                    "curr_achievement_LHWRF"                     : curr_achievement_LHWRF ? curr_achievement_LHWRF : 0,
                    "curr_achievement_NABARD"                    : curr_achievement_NABARD ? curr_achievement_NABARD : 0,
                    "curr_achievement_Bank_Loan"                 : curr_achievement_Bank_Loan ? curr_achievement_Bank_Loan : 0,
                    "curr_achievement_DirectCC"                  : curr_achievement_DirectCC ? curr_achievement_DirectCC : 0,
                    "curr_achievement_IndirectCC"                : curr_achievement_IndirectCC ? curr_achievement_IndirectCC : 0,
                    "curr_achievement_Govt"                      : curr_achievement_Govt ? curr_achievement_Govt : 0,
                    "curr_achievement_Other"                     : curr_achievement_Other ? curr_achievement_Other : 0,
                    "curr_Per_Monthly"                            : " ",
                    "curr_achievement_Total"                     : curr_achievement_Total ? curr_achievement_Total : 0,
                    "curr_achievement_PhysicalUnit_L"            : curr_achievement_PhysicalUnit/100000 ? curr_achievement_PhysicalUnit/100000 : 0,
                    "curr_achievement_UnitCost_L"                : curr_achievement_UnitCost/100000 ? curr_achievement_UnitCost/100000 : 0,
                    "curr_achievement_TotalBudget_L"             : curr_achievement_TotalBudget/100000 ? curr_achievement_TotalBudget/100000 : 0,
                    "curr_achievement_LHWRF_L"                   : curr_achievement_LHWRF/100000 ? curr_achievement_LHWRF/100000 : 0,
                    "curr_achievement_NABARD_L"                  : curr_achievement_NABARD/100000 ? curr_achievement_NABARD/100000 : 0,
                    "curr_achievement_Bank_Loan_L"               : curr_achievement_Bank_Loan/100000 ? curr_achievement_Bank_Loan/100000 : 0,
                    "curr_achievement_DirectCC_L"                : curr_achievement_DirectCC/100000 ? curr_achievement_DirectCC/100000 : 0,
                    "curr_achievement_IndirectCC_L"              : curr_achievement_IndirectCC/100000 ? curr_achievement_IndirectCC/100000 : 0,
                    "curr_achievement_Govt_L"                    : curr_achievement_Govt/100000 ? curr_achievement_Govt/100000 : 0,
                    "curr_achievement_Other_L"                   : curr_achievement_Other/100000 ? curr_achievement_Other/100000 : 0,

                    "variance_monthlyPlan_PhysicalUnit"     : monthlyPlan_PhysicalUnit - achievement_PhysicalUnit ? monthlyPlan_PhysicalUnit - achievement_PhysicalUnit : 0,
                    "variance_monthlyPlan_UnitCost"         : monthlyPlan_UnitCost     - achievement_UnitCost ? monthlyPlan_UnitCost     - achievement_UnitCost : 0,
                    "variance_monthlyPlan_TotalBudget"      : monthlyPlan_TotalBudget  - achievement_TotalBudget ? monthlyPlan_TotalBudget  - achievement_TotalBudget : 0,
                    "variance_monthlyPlan_LHWRF"            : monthlyPlan_LHWRF        - achievement_LHWRF ? monthlyPlan_LHWRF        - achievement_LHWRF : 0,
                    "variance_monthlyPlan_NABARD"           : monthlyPlan_NABARD       - achievement_NABARD ? monthlyPlan_NABARD       - achievement_NABARD : 0,
                    "variance_monthlyPlan_Bank_Loan"        : monthlyPlan_Bank_Loan    - achievement_Bank_Loan ? monthlyPlan_Bank_Loan    - achievement_Bank_Loan : 0,
                    "variance_monthlyPlan_IndirectCC"       : monthlyPlan_IndirectCC   - achievement_IndirectCC ? monthlyPlan_IndirectCC   - achievement_IndirectCC : 0,
                    "variance_monthlyPlan_DirectCC"         : monthlyPlan_DirectCC     - achievement_DirectCC ? monthlyPlan_DirectCC     - achievement_DirectCC : 0,
                    "variance_monthlyPlan_Govt"             : monthlyPlan_Govt         - achievement_Govt ? monthlyPlan_Govt         - achievement_Govt : 0,
                    "variance_monthlyPlan_Other"            : monthlyPlan_Other        - achievement_Other ? monthlyPlan_Other        - achievement_Other : 0,
                    "variance_monthlyPlan_Reach"            : monthlyPlan_Reach        - achievement_Reach ? monthlyPlan_Reach        - achievement_Reach : 0,
                    "variance_monthlyPlan_FamilyUpgradation": monthlyPlan_FamilyUpgradation - achievement_FamilyUpgradation ? monthlyPlan_FamilyUpgradation - achievement_FamilyUpgradation : 0,

                    "variance_monthlyPlan_PhysicalUnit"     : (monthlyPlan_PhysicalUnit - achievement_PhysicalUnit)/100000 ? (monthlyPlan_PhysicalUnit - achievement_PhysicalUnit)/100000 : 0,
                    "variance_monthlyPlan_UnitCost"         : (monthlyPlan_UnitCost     - achievement_UnitCost)/100000 ? (monthlyPlan_UnitCost     - achievement_UnitCost)/100000 : 0,
                    "variance_monthlyPlan_TotalBudget_L"    : (monthlyPlan_TotalBudget  - achievement_TotalBudget)/100000 ? (monthlyPlan_TotalBudget  - achievement_TotalBudget)/100000 : 0,
                    "variance_monthlyPlan_LHWRF_L"          : (monthlyPlan_LHWRF        - achievement_LHWRF)/100000 ? (monthlyPlan_LHWRF        - achievement_LHWRF)/100000 : 0,
                    "variance_monthlyPlan_NABARD_L"         : (monthlyPlan_NABARD       - achievement_NABARD)/100000 ? (monthlyPlan_NABARD       - achievement_NABARD)/100000 : 0,
                    "variance_monthlyPlan_Bank_Loan_L"      : (monthlyPlan_Bank_Loan    - achievement_Bank_Loan)/100000 ? (monthlyPlan_Bank_Loan    - achievement_Bank_Loan)/100000 : 0,
                    "variance_monthlyPlan_IndirectCC_L"     : (monthlyPlan_IndirectCC   - achievement_IndirectCC)/100000 ? (monthlyPlan_IndirectCC   - achievement_IndirectCC)/100000 : 0,
                    "variance_monthlyPlan_DirectCC_L"       : (monthlyPlan_DirectCC     - achievement_DirectCC)/100000 ? (monthlyPlan_DirectCC     - achievement_DirectCC)/100000 : 0,
                    "variance_monthlyPlan_Govt_L"           : (monthlyPlan_Govt         - achievement_Govt)/100000 ? (monthlyPlan_Govt         - achievement_Govt)/100000 : 0,
                    "variance_monthlyPlan_Other_L"          : (monthlyPlan_Other        - achievement_Other)/100000 ? (monthlyPlan_Other        - achievement_Other)/100000 : 0,
                },
                {
                    "name"                                  : "Total %",
                    "unit"                                  : "",
                    
                    "annualPlan_Remark"                     : "",                    
                    "annualPlan_UnitCost"                   : " ",
                    "annualPlan_PhysicalUnit"               : " ",                        
                    "annualPlan_TotalBudget"                : "100 %",
                    "annualPlan_Reach"                      : " ",
                    "annualPlan_FamilyUpgradation"          : " ",
                    "annualPlan_LHWRF"                      : " ",
                    "annualPlan_NABARD"                     : " ",
                    "annualPlan_Bank_Loan"                  : " ",
                    "annualPlan_Govt"                       : " ",
                    "annualPlan_DirectCC"                   : " ",
                    "annualPlan_IndirectCC"                 : " ",
                    "annualPlan_Other"                      : " ",
                    
                    "annualPlan_UnitCost_L"                 : " ",
                    "annualPlan_PhysicalUnit_L"             : " ",
                    "annualPlan_TotalBudget_L"              : " ",
                    "annualPlan_LHWRF_L"                    : " ",
                    "annualPlan_NABARD_L"                   : " ",
                    "annualPlan_Bank_Loan_L"                : " ",
                    "annualPlan_Govt_L"                     : " ",
                    "annualPlan_DirectCC_L"                 : " ",
                    "annualPlan_IndirectCC_L"               : " ",
                    "annualPlan_Other_L"                    : " ", 

                    "monthlyPlan_PhysicalUnit"              : "",
                    "monthlyPlan_TotalBudget"               : "100 %",
                    "monthlyPlan_LHWRF"                     : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_LHWRF / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_NABARD"                    : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_NABARD / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_Bank_Loan"                 : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Bank_Loan / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_IndirectCC"                : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_IndirectCC / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_DirectCC"                  : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_DirectCC / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_Govt"                      : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Govt / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_Other"                     : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Other / monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "monthlyPlan_Reach"                     : " ",
                    "monthlyPlan_FamilyUpgradation"         : " ",
                    "Per_Periodic"                          : " ",
                    "monthlyPlan_PhysicalUnit_L"            : " ",
                    "monthlyPlan_TotalBudget_L"             : " ",
                    "monthlyPlan_LHWRF_L"                   : " ",
                    "monthlyPlan_NABARD_L"                  : " ",
                    "monthlyPlan_Bank_Loan_L"               : " ",
                    "monthlyPlan_IndirectCC_L"              : " ",
                    "monthlyPlan_DirectCC_L"                : " ",
                    "monthlyPlan_Govt_L"                    : " ",
                    "monthlyPlan_Other_L"                   : " ",

                    "curr_monthlyPlan_PhysicalUnit"              : "",
                    "curr_monthlyPlan_TotalBudget"               : "100 %",
                    "curr_monthlyPlan_LHWRF"                     : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_LHWRF / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_NABARD"                    : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_NABARD / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_Bank_Loan"                 : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Bank_Loan / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_IndirectCC"                : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_IndirectCC / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_DirectCC"                  : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_DirectCC / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_Govt"                      : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Govt / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_Other"                     : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Other / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) : 0,
                    "curr_monthlyPlan_Reach"                     : " ",
                    "curr_monthlyPlan_FamilyUpgradation"         : " ",
                    "curr_Per_Periodic"                          : " ",
                    "curr_monthlyPlan_PhysicalUnit_L"            : " ",
                    "curr_monthlyPlan_TotalBudget_L"             : " ",
                    "curr_monthlyPlan_LHWRF_L"                   : " ",
                    "curr_monthlyPlan_NABARD_L"                  : " ",
                    "curr_monthlyPlan_Bank_Loan_L"               : " ",
                    "curr_monthlyPlan_IndirectCC_L"              : " ",
                    "curr_monthlyPlan_DirectCC_L"                : " ",
                    "curr_monthlyPlan_Govt_L"                    : " ",
                    "curr_monthlyPlan_Other_L"                   : " ",

                    "achievement_Reach"                     : annualPlan_Reach > 0 ? (((achievement_Reach / annualPlan_Reach) * 100).toFixed(2)) : "-", 
                    "achievement_FamilyUpgradation"         : annualPlan_FamilyUpgradation > 0 ? (((achievement_FamilyUpgradation / annualPlan_FamilyUpgradation ) * 100).toFixed(2)) : "-",
                    "achievement_PhysicalUnit"              : " ",
                    "achievement_UnitCost"                  : " ",
                    "achievement_TotalBudget"               : achievement_TotalBudget ? achievement_TotalBudget : 0,
                    "achievement_LHWRF"                     : achievement_TotalBudget > 0 ? (((achievement_LHWRF / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_NABARD"                    : achievement_TotalBudget > 0 ? (((achievement_NABARD / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_Bank_Loan"                 : achievement_TotalBudget > 0 ? (((achievement_Bank_Loan / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_DirectCC"                  : achievement_TotalBudget > 0 ? (((achievement_DirectCC / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_IndirectCC"                : achievement_TotalBudget > 0 ? (((achievement_IndirectCC / achievement_TotalBudget) * 100).toFixed(2)) : "-", 
                    "achievement_Govt"                      : achievement_TotalBudget > 0 ? (((achievement_Govt / achievement_TotalBudget) * 100).toFixed(2)) : "-", 
                    "achievement_Other"                     : achievement_TotalBudget > 0 ? (((achievement_Other / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_Total"                     : achievement_TotalBudget > 0 ? (((achievement_Total / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "Per_Annual"                            : " ",
                    "achievement_PhysicalUnit_L"            : " ",
                    "achievement_UnitCost_L"                : " ",
                    "achievement_TotalBudget_L"             : "100%",
                    "achievement_LHWRF_L"                   : achievement_TotalBudget > 0 ? (((achievement_LHWRF / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_NABARD_L"                  : achievement_TotalBudget > 0 ? (((achievement_NABARD / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_Bank_Loan_L"               : achievement_TotalBudget > 0 ? (((achievement_Bank_Loan / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_DirectCC_L"                : achievement_TotalBudget > 0 ? (((achievement_DirectCC / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_IndirectCC_L"              : achievement_TotalBudget > 0 ? (((achievement_IndirectCC / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_Govt_L"                    : achievement_TotalBudget > 0 ? (((achievement_Govt / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_Other_L"                   : achievement_TotalBudget > 0 ? (((achievement_Other / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "achievement_Total_L"                   : achievement_TotalBudget > 0 ? (((achievement_Total / achievement_TotalBudget) * 100).toFixed(2)) : "-",

                    "curr_achievement_Reach"                     : annualPlan_Reach > 0 ? (((curr_achievement_Reach / annualPlan_Reach) * 100).toFixed(2)) : "-", 
                    "curr_achievement_FamilyUpgradation"         : annualPlan_FamilyUpgradation > 0 ? (((curr_achievement_FamilyUpgradation / annualPlan_FamilyUpgradation ) * 100).toFixed(2)) : "-",
                    "curr_achievement_PhysicalUnit"              : " ",
                    "curr_achievement_UnitCost"                  : " ",
                    "curr_achievement_TotalBudget"               : curr_achievement_TotalBudget ? curr_achievement_TotalBudget : 0,
                    "curr_achievement_LHWRF"                     : curr_achievement_TotalBudget > 0 ? (((curr_achievement_LHWRF / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_NABARD"                    : curr_achievement_TotalBudget > 0 ? (((curr_achievement_NABARD / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_Bank_Loan"                 : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Bank_Loan / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_DirectCC"                  : curr_achievement_TotalBudget > 0 ? (((curr_achievement_DirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_IndirectCC"                : curr_achievement_TotalBudget > 0 ? (((curr_achievement_IndirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-", 
                    "curr_achievement_Govt"                      : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Govt / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-", 
                    "curr_achievement_Other"                     : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Other / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_Total"                     : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Total / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_Per_Annual"                            : " ",
                    "curr_achievement_PhysicalUnit_L"            : " ",
                    "curr_achievement_UnitCost_L"                : " ",
                    "curr_achievement_TotalBudget_L"             : "100%",
                    "curr_achievement_LHWRF_L"                   : curr_achievement_TotalBudget > 0 ? (((curr_achievement_LHWRF / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_NABARD_L"                  : curr_achievement_TotalBudget > 0 ? (((curr_achievement_NABARD / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_Bank_Loan_L"               : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Bank_Loan / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_DirectCC_L"                : curr_achievement_TotalBudget > 0 ? (((curr_achievement_DirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_IndirectCC_L"              : curr_achievement_TotalBudget > 0 ? (((curr_achievement_IndirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_Govt_L"                    : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Govt / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_Other_L"                   : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Other / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",
                    "curr_achievement_Total_L"                   : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Total / curr_achievement_TotalBudget) * 100).toFixed(2)) : "-",

                    "variance_monthlyPlan_PhysicalUnit"     : " ",
                    "variance_monthlyPlan_UnitCost"         : " ",
                    "variance_monthlyPlan_TotalBudget"      : "100 %",
                    "variance_monthlyPlan_LHWRF"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_LHWRF        - achievement_LHWRF) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_NABARD"           : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_NABARD       - achievement_NABARD) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_Bank_Loan"        : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Bank_Loan    - achievement_Bank_Loan) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_IndirectCC"       : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_IndirectCC   - achievement_IndirectCC) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_DirectCC"         : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_DirectCC     - achievement_DirectCC) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_Govt"             : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Govt         - achievement_Govt) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_Other"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Other        - achievement_Other) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_Total"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_TotalBudget  - achievement_Total) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_Reach"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Reach        - achievement_Reach) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",
                    "variance_monthlyPlan_FamilyUpgradation": (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_FamilyUpgradation - achievement_FamilyUpgradation) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) : "-",

                    "variance_monthlyPlan_PhysicalUnit"     : " ",
                    "variance_monthlyPlan_UnitCost"         : " ",
                    "variance_monthlyPlan_TotalBudget_L"    : " ",
                    "variance_monthlyPlan_LHWRF_L"          : " ",
                    "variance_monthlyPlan_NABARD_L"         : " ",
                    "variance_monthlyPlan_Bank_Loan_L"      : " ",
                    "variance_monthlyPlan_IndirectCC_L"     : " ",
                    "variance_monthlyPlan_DirectCC_L"       : " ",
                    "variance_monthlyPlan_Govt_L"           : " ",
                    "variance_monthlyPlan_Other_L"          : " ",
                    "variance_monthlyPlan_Total_L"          : " ",
                });
                resolve(returnData);
            }
        }
    });
}
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
function annualPlan(searchQuery){
    return new Promise(function(resolve,reject){
        AnnualPlan  .aggregate([
                                searchQuery,
                                {
                                        $group : {
                                            "_id"               : null,
                                            "PhysicalUnit"      : { "$sum" : "$physicalUnit" },
                                            "TotalBudget"       : { "$sum" : "$totalBudget" },
                                            "Reach"             : { "$sum" : "$noOfBeneficiaries" },
                                            "FamilyUpgradation" : { "$sum" : "$noOfFamilies" },
                                            "LHWRF"             : { "$sum" : "$LHWRF" },
                                            "NABARD"            : { "$sum" : "$NABARD" },
                                            "Bank_Loan"         : { "$sum" : "$bankLoan" },
                                            "Govt"              : { "$sum" : "$govtscheme" },
                                            "DirectCC"          : { "$sum" : "$directCC" },
                                            "IndirectCC"        : { "$sum" : "$indirectCC" },
                                            "Other"             : { "$sum" : "$other" },
                                            "Remark"            : { "$sum" : "$remark" },
                                            "UnitCost"          : { "$sum" : "$unitCost" },            
                                        }
                                    }
                    ])
                    .exec()
                    .then(data=>{
                        if(data.length > 0){
                            resolve({
                                    "Reach"                  : data[0].Reach                ? data[0].Reach             : 0,
                                    "FamilyUpgradation"      : data[0].FamilyUpgradation    ? data[0].FamilyUpgradation : 0,
                                    "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit      : 0,
                                    "TotalBudget"            : data[0].TotalBudget          ? data[0].TotalBudget       : 0,
                                    "LHWRF"                  : data[0].LHWRF                ? data[0].LHWRF             : 0,
                                    "NABARD"                 : data[0].NABARD               ? data[0].NABARD            : 0,
                                    "Bank_Loan"              : data[0].Bank_Loan            ? data[0].Bank_Loan         : 0,
                                    "DirectCC"               : data[0].DirectCC             ? data[0].DirectCC          : 0,
                                    "IndirectCC"             : data[0].IndirectCC           ? data[0].IndirectCC        : 0,
                                    "Govt"                   : data[0].Govt                 ? data[0].Govt              : 0,
                                    "Other"                  : data[0].Other                ? data[0].Other             : 0,
                                    "UnitCost"               : data[0].UnitCost             ? data[0].UnitCost          : 0,
                                    "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit      : 0,
                                    "TotalExp"               : data[0].TotalExp             ? data[0].TotalExp          : 0, 
                                    "Remark"                 : data[0].Remark               ? data[0].Remark            : "-", 
                                });
                        }else{
                            resolve({
                                "PhysicalUnit"      : 0,
                                "TotalBudget"       : 0,
                                "Reach"             : 0,
                                "FamilyUpgradation" : 0,
                                "LHWRF"             : 0,
                                "NABARD"            : 0,
                                "Bank_Loan"         : 0,
                                "Govt"              : 0,
                                "DirectCC"          : 0,
                                "IndirectCC"        : 0,
                                "Other"             : 0,
                                "Remark"            : "",
                                "unitCost"          : 0,
                            });
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    });
};
function monthlyPlan(searchQuery){
    // console.log("searchQuery ",searchQuery);
    return new Promise(function(resolve,reject){
        MonthlyPlan.aggregate([
                                searchQuery,
                                {
                                    $group : 
                                            {
                                                "_id"               : null,
                                                "PhysicalUnit"      : { "$sum" : "$physicalUnit" },
                                                "UnitCost"          : { "$sum" : "$unitCost" },
                                                "TotalBudget"       : { "$sum" : "$totalBudget" },
                                                "LHWRF"             : { "$sum" : "$LHWRF" },
                                                "NABARD"            : { "$sum" : "$NABARD" },
                                                "Bank_Loan"         : { "$sum" : "$bankLoan" },
                                                "IndirectCC"        : { "$sum" : "$indirectCC"},
                                                "DirectCC"          : { "$sum" : "$directCC"},
                                                "Govt"              : { "$sum" : "$govtscheme"},
                                                "Other"             : { "$sum" : "$other"},
                                                "Reach"             : { "$sum" : "$noOfBeneficiaries"},
                                                "FamilyUpgradation"     : { "$sum" : "$noOfFamilies"}
                                            }
                                }
                    ])
                    .exec()
                    .then(data=>{
                        if(data.length > 0){
                            resolve({
                                    "Reach"                  : data[0].Reach                ? data[0].Reach             : 0,
                                    "FamilyUpgradation"      : data[0].FamilyUpgradation    ? data[0].FamilyUpgradation : 0,
                                    "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit      : 0,
                                    "TotalBudget"            : data[0].TotalBudget          ? data[0].TotalBudget       : 0,
                                    "LHWRF"                  : data[0].LHWRF                ? data[0].LHWRF             : 0,
                                    "NABARD"                 : data[0].NABARD               ? data[0].NABARD            : 0,
                                    "Bank_Loan"              : data[0].Bank_Loan            ? data[0].Bank_Loan         : 0,
                                    "DirectCC"               : data[0].DirectCC             ? data[0].DirectCC          : 0,
                                    "IndirectCC"             : data[0].IndirectCC           ? data[0].IndirectCC        : 0,
                                    "Govt"                   : data[0].Govt                 ? data[0].Govt              : 0,
                                    "Other"                  : data[0].Other                ? data[0].Other             : 0,
                                    "UnitCost"               : data[0].UnitCost             ? data[0].UnitCost          : 0,
                                    "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit      : 0,
                                });
                        }else{
                            resolve({
                                "_id"           : null,
                                "PhysicalUnit"  : 0,
                                "UnitCost"      : 0,
                                "TotalBudget"   : 0,
                                "LHWRF"         : 0,
                                "NABARD"        : 0,
                                "Bank_Loan"     : 0,
                                "IndirectCC"    : 0,
                                "DirectCC"      : 0,
                                "Govt"          : 0,
                                "Other"         : 0,
                                "Reach"         : 0,
                                "FamilyUpgradation" : 0
                            });
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};
function activityReport(searchQuery){
    return new Promise(function(resolve,reject){
        ActivityReport.aggregate(
                                    [
                                        searchQuery,
                                        {
                                            $project : {
                                                "listofBeneficiaries"   : { "$setUnion": [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                                "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                "PhysicalUnit"          : "$quantity",
                                                "TotalBudget"           : "$totalcost",
                                                "LHWRF"                 : "$sourceofFund.LHWRF",
                                                "NABARD"                : "$sourceofFund.NABARD",
                                                "Bank_Loan"             : "$sourceofFund.bankLoan",
                                                "DirectCC"              : "$sourceofFund.directCC",
                                                "IndirectCC"            : "$sourceofFund.indirectCC",
                                                "Govt"                  : "$sourceofFund.govtscheme",
                                                "Other"                 : "$sourceofFund.other",
                                                "Total"                 : "$sourceofFund.total",
                                                "UnitCost"              : "$unitCost"
                                            }
                                        },
                                        {
                                            $group : {
                                                "_id"               : null,
                                                "Reach"             : { "$sum" : "$Reach" }, 
                                                "FamilyUpgradation" : { "$sum" : "$Reach" },
                                                "PhysicalUnit"      : { "$sum" : "$PhysicalUnit" },
                                                "TotalBudget"       : { "$sum" : "$TotalBudget" },
                                                "LHWRF"             : { "$sum" : "$LHWRF" },
                                                "NABARD"            : { "$sum" : "$NABARD" },
                                                "Bank_Loan"         : { "$sum" : "$Bank_Loan" },
                                                "DirectCC"          : { "$sum" : "$DirectCC" },
                                                "IndirectCC"        : { "$sum" : "$IndirectCC" },
                                                "Govt"              : { "$sum" : "$Govt" },
                                                "Other"             : { "$sum" : "$Other" },
                                                "Total"             : { "$sum" : "$Total"},
                                                "UnitCost"          : { "$sum" : "$UnitCost"}
                                            }
                                        }
                                    ]
                        )
                        .exec()
                        .then(data=>{
                            if(data.length > 0 ){
                                resolve({
                                    "Reach"                  : data[0].Reach                ? data[0].Reach             : 0,
                                    "FamilyUpgradation"      : data[0].FamilyUpgradation    ? data[0].FamilyUpgradation : 0,
                                    "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit      : 0,
                                    "TotalBudget"            : data[0].TotalBudget          ? data[0].TotalBudget       : 0,
                                    "LHWRF"                  : data[0].LHWRF                ? data[0].LHWRF             : 0,
                                    "NABARD"                 : data[0].NABARD               ? data[0].NABARD            : 0,
                                    "Bank_Loan"              : data[0].Bank_Loan            ? data[0].Bank_Loan         : 0,
                                    "DirectCC"               : data[0].DirectCC             ? data[0].DirectCC          : 0,
                                    "IndirectCC"             : data[0].IndirectCC           ? data[0].IndirectCC        : 0,
                                    "Govt"                   : data[0].Govt                 ? data[0].Govt              : 0,
                                    "Other"                  : data[0].Other                ? data[0].Other             : 0,
                                    "UnitCost"               : data[0].UnitCost             ? data[0].UnitCost          : 0,
                                    "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit      : 0,
                                    "Total"                  : data[0].Total                ? data[0].Total             : 0, 
                                });
                            }else{
                                resolve({
                                    "Reach"                  : 0,
                                    "FamilyUpgradation"      : 0,
                                    "PhysicalUnit"           : 0,
                                    "TotalBudget"            : 0,
                                    "LHWRF"                  : 0,
                                    "NABARD"                 : 0,
                                    "Bank_Loan"              : 0,
                                    "DirectCC"               : 0,
                                    "Indirect"               : 0,
                                    "Govt"                   : 0,
                                    "Other"                  : 0,
                                    "UnitCost"               : 0,
                                    "PhysicalUnit"           : 0,
                                    "Total"                  : 0,
                                });
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            reject(err);
                        });
    });
};
function getSubActivities(searchQuery){
    return new Promise(function(resolve,reject){
        Sectors.aggregate([
                            {
                                $match : {
                                    "_id"           : new ObjectID(searchQuery.sector_ID),
                                    "activity._id"  : new ObjectID(searchQuery.activity_ID)
                                }
                            },
                            { 
                                $project: {
                                    "sector"    : 1,
                                    "activity": { 
                                        $filter: {
                                            input: '$activity',
                                            as: 'activity',
                                            cond: { $eq: ['$$activity._id', new ObjectID(searchQuery.activity_ID)]}
                                        }
                                    }
                                }
                            },
                            {
                                $unwind : "$activity"
                            },
                            {
                                $unwind : "$activity.subActivity"    
                            },
                            {
                                $project : {
                                    "goalName"          : searchQuery.goal,
                                    "sector_ID"         : "$_id",
                                    "sectorName"        : "$sector",
                                    "activity_ID"       : "$activity._id",
                                    "activityName"      : "$activity.activityName",
                                    "subActivity"       : "$activity.subActivity._id",
                                    "subActivityName"   : "$activity.subActivity.subActivityName",
                                    "unit"              : "$activity.subActivity.unit",
                                }
                            }
                ])
                .exec()
                .then(sectors=>{
                    resolve(sectors);
                })
                .catch(err=>{
                    reject(err);
                });
    });
};
exports.reports_activity = (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    var query = "1";
    if(req.params.sector_ID === 'all'){
        query = {
                    $match : { "_id" : {$exists : true}}
                };
    }else{
        query = {
                    $match : { "_id" : ObjectID(req.params.sector_ID)}
                }
    }
    Sectors .aggregate(
                        [
                            query,
                            {
                                $unwind : "$activity"
                            },
                            {
                                $unwind : "$activity.subActivity"
                            },
                            {
                                $project : {
                                            "sector_ID"      : "$_id",
                                            "sector"         : "$sector",
                                            "activity_ID"    : "$activity._id",
                                            "activityName"   : "$activity.activityName",
                                            "subactivity_ID" : "$activity.subActivity._id",
                                            "subActivityName": "$activity.subActivity.subActivityName",
                                            "unit"           : "$activity.subActivity.unit",
                                            "center_ID"      : req.params.center_ID,
                                            "year"           : deriveDate.year,
                                            "startDate"      : req.params.startDate,
                                            "endDate"        : req.params.endDate,
                                            "yearList"       : deriveDate.yearList,
                                            "monthList"      : deriveDate.monthList,
                                            "_id"            : 0,
                                        }
                            }
                        ]
            )
            .exec()
            .then(sec_activity_subactivity=>{
                getData();
                var selectQuery_annualPlan = {};
                async function getData(){
                    if(sec_activity_subactivity.length > 0){
                        var returData = await getResultData(sec_activity_subactivity,"subActivities");
                        res.status(200).json(returData);
                    }else{
                        res.status(200).json({message:"Data not found"});
                    }
                }
            })
            .catch(err=>{
                res.status(200).json(err);
            });
};
exports.reports_sector= (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    Sectors .aggregate(
                        [
                            {
                                $project : {
                                            "sector_ID"      : "$_id",
                                            "sector"         : "$sector",
                                            "activity_ID"    : "$activity._id",
                                            "activityName"   : "$activity.activityName",
                                            "subactivity_ID" : "$activity.subActivity._id",
                                            "subActivityName": "$activity.subActivity.subActivityName",
                                            "unit"           : "$activity.subActivity.unit",
                                            "center_ID"      : req.params.center_ID,
                                            "year"           : deriveDate.year,
                                            "startDate"      : req.params.startDate,
                                            "endDate"        : req.params.endDate,
                                            "yearList"       : deriveDate.yearList,
                                            "monthList"      : deriveDate.monthList,
                                            "_id"            : 0,
                                        }
                            }
                        ]
            )
            .exec()
            .then(sec_activity_subactivity=>{
                getData();
                var selectQuery_annualPlan = {};
                async function getData(){
                    if(sec_activity_subactivity.length > 0){
                        var returData = await getResultData(sec_activity_subactivity,"sector");
                        res.status(200).json(returData);
                    }else{
                        res.status(200).json({message:"Data not found"});
                    }
                }
            })
            .catch(err=>{
                res.status(200).json(err);
            });
};
exports.reports_geographical= (req,res,next)=>{ 
    var query = "1";
    if(req.params.sector_ID === 'all'){
        query = {
                    $match : { "_id" : {$exists : true}}
                };
    }else{
        query = {
                    $match : { "_id" : ObjectID(req.params.sector_ID)}
                }
    }
    if(query != "1"){
        Sectors .aggregate(
                            [
                                query,
                                {
                                    $unwind : "$activity"
                                },
                                {
                                    $unwind : "$activity.subActivity"
                                },
                                {
                                    $project : {
                                                "sector_ID"      : "$_id",
                                                "sector"         : "$sector",
                                                "activity_ID"    : "$activity._id",
                                                "activityName"   : "$activity.activityName",
                                                "subactivity_ID" : "$activity.subActivity._id",
                                                "subActivityName": "$activity.subActivity.subActivityName",
                                                "unit"           : "$activity.subActivity.unit",
                                                "district"       : req.params.district,
                                                "block"          : req.params.block,
                                                "village"        : req.params.village,
                                                "center_ID"      : req.params.center_ID,
                                                "startDate"      : req.params.startDate,
                                                "endDate"        : req.params.endDate,
                                                "_id"            : 0,
                                            }
                                }
                            ]
                )
                .exec()
                .then(sec_activity_subactivity=>{
                    getData();
                    var selectQuery_annualPlan = {};
                    async function getData(){
                        if(sec_activity_subactivity.length > 0){
                            var returData = await getResultData(sec_activity_subactivity,"geographical");
                            res.status(200).json(returData);
                        }else{
                            res.status(200).json({message:"Data not found"});
                        }
                    }
                })
                .catch(err=>{
                    res.status(200).json(err);
                });
    }
};
exports.report_center= (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    if(req.params.center_ID != "all"){
        Center .aggregate(
                            [
                                {
                                    $match : { "_id" : new ObjectID(req.params.center_ID)}
                                },
                                {
                                    $project : {
                                        "center_ID"      : "$_id",
                                        "centerName"     : "$centerName",
                                        "year"           : deriveDate.year,
                                        "startDate"      : req.params.startDate,
                                        "endDate"        : req.params.endDate,
                                        "yearList"       : deriveDate.yearList,
                                        "monthList"      : deriveDate.monthList,
                                        "_id"            : 0,
                                    }
                                }
                            ]
                )
                .exec()
                .then(sec_activity_subactivity=>{
                    getData();
                    var selectQuery_annualPlan = {};
                    async function getData(){
                        if(sec_activity_subactivity.length > 0){
                            var returData = await getResultData(sec_activity_subactivity,"center");
                            res.status(200).json(returData);
                        }else{
                            res.status(200).json({message:"Data not found"});
                        }
                    }
                })
                .catch(err=>{
                    res.status(200).json(err);
                });
    }else{
        if(req.params.centertype_ID != "all"){
            Center .aggregate(
                                [
                                    {
                                        $match:{ 
                                                    "type_ID" : req.params.centertype_ID 
                                                }
                                    },
                                    {
                                        $project : {
                                            "center_ID"      : "$_id",
                                            "centerName"     : "$centerName",
                                            "year"           : deriveDate.year,
                                            "startDate"      : req.params.startDate,
                                            "endDate"        : req.params.endDate,
                                            "yearList"       : deriveDate.yearList,
                                            "monthList"      : deriveDate.monthList,
                                            "_id"            : 0,
                                        }
                                    }
                                ]
                    )
                    .exec()
                    .then(sec_activity_subactivity=>{
                        getData();
                        var selectQuery_annualPlan = {};
                        async function getData(){
                            if(sec_activity_subactivity.length > 0){
                                var returData = await getResultData(sec_activity_subactivity,"center");
                                res.status(200).json(returData);
                            }else{
                                res.status(200).json({message:"Data not found"});
                            }
                        }
                    })
                    .catch(err=>{
                        res.status(200).json(err);
                    });
        }else{
            Center .aggregate(
                                [
                                    {
                                        $project : {
                                            "center_ID"      : "$_id",
                                            "centerName"     : "$centerName",
                                            "year"           : deriveDate.year,
                                            "startDate"      : req.params.startDate,
                                            "endDate"        : req.params.endDate,
                                            "yearList"       : deriveDate.yearList,
                                            "monthList"      : deriveDate.monthList,
                                            "_id"            : 0,
                                        }
                                    }
                                ]
                    )
                    .exec()
                    .then(sec_activity_subactivity=>{
                        getData();
                        var selectQuery_annualPlan = {};
                        async function getData(){
                            if(sec_activity_subactivity.length > 0){
                                var returData = await getResultData(sec_activity_subactivity,"center");
                                res.status(200).json(returData);
                            }else{
                                res.status(200).json({message:"Data not found"});
                            }
                        }
                    })
                    .catch(err=>{
                        res.status(200).json(err);
                    });
        }
    }
};
exports.report_village = (req,res,next)=>{
    var query = {};
    if(req.params.sector_ID != "all"){
        query = {
                    $match : {
                                sector_ID         : String(req.params.sector_ID),
                                district          : req.params.district,
                                block             : req.params.block,
                                village           : req.params.village,
                                date              : {$gte : req.params.startDate, $lte : req.params.endDate}
                    }
                };
    }else{
        query = {
                    $match : {
                                district          : req.params.district,
                                block             : req.params.block,
                                village           : req.params.village,
                                date              : {$gte : req.params.startDate, $lte : req.params.endDate}
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
                                            $group : {
                                                "_id"       : {
                                                                // "familyHead"        : "$listofBeneficiaries.familyHead",
                                                                "familyID"          : "$listofBeneficiaries.familyID",
                                                                "activity_ID"       : "$activity_ID",
                                                                "activityName"      : "$activityName",
                                                                "subactivity_ID"    : "$subactivity_ID",
                                                                "subactivityName"   : "$subactivityName",
                                                                "unit"              : "$unit",
                                                                
                                                            },
                                                "UnitCost"  : { "$sum" : "$unitCost"},
                                                "quantity"  : { "$sum" : "$quantity"},
                                                // "total"     : { "$sum" : "$totalcost"},
                                                "LHWRF"     : { "$sum" : "$sourceofFund.LHWRF"},
                                                "NABARD"    : { "$sum" : "$sourceofFund.NABARD"},
                                                "Bank_Loan" : { "$sum" : "$sourceofFund.bankLoan"},
                                                "Govt"      : { "$sum" : "$sourceofFund.govtscheme"},
                                                "DirectCC"  : { "$sum" : "$sourceofFund.directCC"},
                                                "IndirectCC": { "$sum" : "$sourceofFund.indirectCC"},
                                                "Other"     : { "$sum" : "$sourceofFund.other"},
                                                "total"     : { "$sum" : "$sourceofFund.total"},

                                            }
                                        },
                                        {
                                            $project : {
                                                // "name_family"       : "$_id.familyHead",
                                                "familyID"          : "$_id.familyID",
                                                "activityName"      : "$_id.activityName",
                                                "subactivityName"   : "$_id.subactivityName",
                                                "unit"              : "$_id.unit",
                                                "UnitCost"          : 1,
                                                "quantity"          : 1,
                                                "LHWRF"             : 1,
                                                "NABARD"            : 1,
                                                "Bank_Loan"         : 1,
                                                "Govt"              : 1,
                                                "DirectCC"          : 1,
                                                "IndirectCC"        : 1,
                                                "Other"             : 1,
                                                "total"             : 1,
                                                "_id"               : 0,
                                            }
                                        },
                                        {
                                            $lookup : {
                                                    from            : "families",
                                                    localField      : "familyID",
                                                    foreignField    : "familyID",
                                                    as              : "family"
                                            }
                                        },
                                        {
                                            $unwind : "$family"
                                        },
                                        {
                                            $project : {
                                                "familyID"          : 1,
                                                "activityName"      : 1,
                                                "subactivityName"   : 1,
                                                "unit"              : 1,
                                                "UnitCost"          : 1,
                                                "quantity"          : 1,
                                                "LHWRF"             : 1,
                                                "NABARD"            : 1,
                                                "Bank_Loan"         : 1,
                                                "Govt"              : 1,
                                                "DirectCC"          : 1,
                                                "IndirectCC"        : 1,
                                                "Other"             : 1,
                                                "total"             : 1,
                                                "name_family"       : "$family.familyHead",
                                            }
                                        }
                                    ]
                        )
                        .exec()
                        .then(data=>{
                                res.status(200).json(data);
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(200).json(err);
                        });
};
exports.report_source = (req,res,next)=>{
    console.log("report_source ",req.body);
    var endYear         = moment(req.params.endDate).format("YYYY");
    var endMonth        = moment(req.params.endDate).format("MMMM");
    var endStartDate    = endYear+'-'+moment(req.params.endDate).format("MM")+'-01';
    request({
                "method"    : "GET", 
                "url"       : "http://localhost:"+globalVariable.port+"/api/report/center/"+req.params.startDate+"/"+req.params.endDate+"/"+req.params.center_ID,
                // "body"      : {lstcontrolblocks : newCBList },
                "json"      : true,
                "headers"   : {
                                "User-Agent": "Test Agent"
                            },
                'auth'      : {
                                'bearer': req.body.token
                            }
            })
            .then(source=>{
                if(source.length > 0){
                    getData();
                    async function getData(){
                        var len = source.length;
                        console.log("len ",source.length);
                        var returnData          = [];
                        var lastmonth_monthly   = {};
                        var lastmonth_activity  = {};
                        if(req.params.center_ID != "all"){
                            lastmonth_monthly   = await monthlyPlan({
                                                                            $match : {
                                                                                        "center_ID"         : String(req.params.center_ID),
                                                                                        "year"              : { $in : [endYear]},
                                                                                        "month"             : { $in : [endMonth]}
                                                                                    }
                                                                        });
                            lastmonth_activity  = await activityReport({
                                                                            $match : {
                                                                                            "center_ID"         : String(req.params.center_ID),
                                                                                            "date"              : {$gte : endStartDate, $lte : req.params.endDate},
                                                                                        }
                                                                        });
                        }else{
                            lastmonth_monthly   = await monthlyPlan({
                                                                            $match : {
                                                                                        "year"              : { $in : [endYear]},
                                                                                        "month"             : { $in : [endMonth]}
                                                                                    }
                                                                        });
                            lastmonth_activity  = await activityReport({
                                                                            $match : {
                                                                                            "date"              : {$gte : endStartDate, $lte : req.params.endDate},
                                                                                        }
                                                                        });
                        }
                        if(lastmonth_monthly && lastmonth_activity){
                            console.log("per_cum_achi",source[len-2].monthlyPlan_LHWRF_L,source[len-2].achievement_LHWRF_L);
                            console.log("per_cum_achi",(source[len-2].achievement_LHWRF_L  / source[len-2].monthlyPlan_LHWRF_L) * 100);
                            returnData.push(
                                        {
                                            "source"            : "LHWRF",
                                            "annualPlan"        : source[len-2].annualPlan_LHWRF_L ?  (source[len-2].annualPlan_LHWRF_L).toFixed(2) : 0,
                                            "cum_monthly"       : source[len-2].monthlyPlan_LHWRF_L ? (source[len-2].monthlyPlan_LHWRF_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_LHWRF_L ? (source[len-2].achievement_LHWRF_L).toFixed(2) : 0,
                                            "per_cum_achi"      : source[len-2].monthlyPlan_LHWRF_L > 0 ? ((source[len-2].achievement_LHWRF_L  / source[len-2].monthlyPlan_LHWRF_L) * 100).toFixed(2): "-", 
                                            "monthlyPlan"       : lastmonth_monthly.LHWRF ? (lastmonth_monthly.LHWRF/100000).toFixed(2) : 0,
                                            "achi_month"        : lastmonth_activity.LHWRF ? (lastmonth_activity.LHWRF/100000).toFixed(2) : 0,
                                            "per_achi"          : (lastmonth_monthly.LHWRF/100000) > 0 ? ( (lastmonth_activity.LHWRF/100000) / (lastmonth_monthly.LHWRF/100000) * 100).toFixed(2) : "-", 
                                        },
                                        {
                                            "source"            : "NABARD",
                                            "annualPlan"        : source[len-2].annualPlan_NABARD_L ? (source[len-2].annualPlan_NABARD_L).toFixed(2) : 0,    
                                            "cum_monthly"       : source[len-2].monthlyPlan_NABARD_L ? (source[len-2].monthlyPlan_NABARD_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_NABARD_L ? (source[len-2].achievement_NABARD_L).toFixed(2) : 0,
                                            "per_cum_achi"      : source[len-2].monthlyPlan_NABARD_L  > 0 ? ((source[len-2].achievement_NABARD_L / source[len-2].monthlyPlan_NABARD_L) * 100).toFixed(2) : "-", 
                                            "monthlyPlan"       : lastmonth_monthly.NABARD ? (lastmonth_monthly.NABARD/100000).toFixed(2) : 0,
                                            "achi_month"        : lastmonth_activity.NABARD ? (lastmonth_activity.NABARD/100000).toFixed(2) : 0,
                                            "per_achi"          : (lastmonth_monthly.NABARD/100000) > 0 ? ((lastmonth_activity.NABARD/100000) / (lastmonth_monthly.NABARD/100000) * 100).toFixed(2) : "-",
                                        },
                                        {
                                            "source"            : "Bank Loan",
                                            "annualPlan"        : source[len-2].annualPlan_Bank_Loan_L ? (source[len-2].annualPlan_Bank_Loan_L).toFixed(2) : 0, 
                                            "cum_monthly"       : source[len-2].monthlyPlan_Bank_Loan_L ? (source[len-2].monthlyPlan_Bank_Loan_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_Bank_Loan_L ? (source[len-2].achievement_Bank_Loan_L).toFixed(2) : 0,    
                                            "per_cum_achi"      : source[len-2].monthlyPlan_Bank_Loan_L  > 0 ? ((source[len-2].achievement_Bank_Loan_L / source[len-2].monthlyPlan_Bank_Loan_L) * 100).toFixed(2) : "-", 
                                            "monthlyPlan"       : lastmonth_monthly.Bank_Loan ? (lastmonth_monthly.Bank_Loan/100000).toFixed(2) : 0,
                                            "achi_month"        : lastmonth_activity.Bank_Loan ? (lastmonth_monthly.Bank_Loan/100000).toFixed(2) : 0,
                                            "per_achi"          : (lastmonth_monthly.Bank_Loan/100000) > 0 ? ((lastmonth_activity.Bank_Loan/100000) / (lastmonth_monthly.Bank_Loan/100000) * 100).toFixed(2) : "-",
                                        },
                                        {
                                            "source"            : "Community Contribution directCC",
                                            "annualPlan"        : source[len-2].annualPlan_DirectCC_L ? (source[len-2].annualPlan_DirectCC_L).toFixed(2) : 0,
                                            "cum_monthly"       : source[len-2].monthlyPlan_DirectCC_L ? (source[len-2].monthlyPlan_DirectCC_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_DirectCC_L ? (source[len-2].achievement_DirectCC_L).toFixed(2) : 0,    
                                            "per_cum_achi"      : source[len-2].monthlyPlan_DirectCC_L  > 0 ? ((source[len-2].achievement_DirectCC_L / source[len-2].monthlyPlan_DirectCC_L) * 100).toFixed(2) : "-",
                                            "monthlyPlan"       : lastmonth_monthly.DirectCC ? (lastmonth_monthly.DirectCC/100000).toFixed(2) : 0,
                                            "achi_month"        : lastmonth_activity.DirectCC ? (lastmonth_monthly.DirectCC/100000).toFixed(2) : 0,
                                            "per_achi"          : (lastmonth_monthly.DirectCC/100000) > 0 ? ((lastmonth_activity.DirectCC/100000) / (lastmonth_monthly.DirectCC/100000) * 100).toFixed(2) : "-",
                                        },
                                        {
                                            "source"            : "Community Contribution indirectCC",
                                            "annualPlan"        : source[len-2].annualPlan_IndirectCC_L ? (source[len-2].annualPlan_IndirectCC_L).toFixed(2) : 0,    
                                            "cum_monthly"       : source[len-2].monthlyPlan_IndirectCC_L ? (source[len-2].monthlyPlan_IndirectCC_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_IndirectCC_L ? (source[len-2].achievement_IndirectCC_L).toFixed(2) : 0,
                                            "per_cum_achi"      : source[len-2].monthlyPlan_IndirectCC_L  > 0 ? ((source[len-2].achievement_IndirectCC_L / source[len-2].monthlyPlan_IndirectCC_L) * 100).toFixed(2) : "-",
                                            "monthlyPlan"       : lastmonth_monthly.IndirectCC ? (lastmonth_monthly.IndirectCC/100000).toFixed(2) : 0,
                                            "achi_month"        : lastmonth_activity.IndirectCC ? (lastmonth_activity.IndirectCC/100000).toFixed(2) : 0,
                                            "per_achi"          : (lastmonth_monthly.IndirectCC/100000) > 0 ? ((lastmonth_activity.IndirectCC/100000) / (lastmonth_monthly.IndirectCC/100000) * 100).toFixed(2) : "-",
                                        },
                                        {
                                            "source"            : "Govt.",
                                            "annualPlan"        : source[len-2].annualPlan_Govt_L ? (source[len-2].annualPlan_Govt_L ).toFixed(2): 0,    
                                            "cum_monthly"       : source[len-2].monthlyPlan_Govt_L ? (source[len-2].monthlyPlan_Govt_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_Govt_L ? (source[len-2].achievement_Govt_L).toFixed(2) : 0,
                                            "per_cum_achi"      : source[len-2].monthlyPlan_Govt_L  > 0 ? ((source[len-2].achievement_Govt_L / source[len-2].monthlyPlan_Govt_L) * 100).toFixed(2) : "-",
                                            "monthlyPlan"       : lastmonth_monthly.Govt ? (lastmonth_monthly.Govt/100000).toFixed(2) : 0,
                                            "achi_month"        : lastmonth_activity.Govt ? (lastmonth_activity.Govt/100000).toFixed(2): 0,
                                            "per_achi"          : (lastmonth_monthly.Govt/100000) > 0 ? ((lastmonth_activity.Govt/100000) / (lastmonth_monthly.Govt/100000) * 100).toFixed(2) : "-",
                                        },
                                        {
                                            "source"            : "Others",
                                            "annualPlan"        : source[len-2].annualPlan_Other_L ? (source[len-2].annualPlan_Other_L).toFixed(2) : 0, 
                                            "cum_monthly"       : source[len-2].monthlyPlan_Other_L ? (source[len-2].monthlyPlan_Other_L).toFixed(2) : 0,
                                            "cum_achi"          : source[len-2].achievement_Other_L ? (source[len-2].achievement_Other_L).toFixed(2) : 0,   
                                            "per_cum_achi"      : source[len-2].monthlyPlan_Other_L > 0 ? ((source[len-2].achievement_Other_L / source[len-2].monthlyPlan_Other_L) * 100).toFixed(2) : "-",
                                            "monthlyPlan"       : lastmonth_monthly.Other ? (lastmonth_monthly.Other/100000).toFixed(2): 0,
                                            "achi_month"        : lastmonth_activity.Other ? (lastmonth_activity.Other/100000).toFixed(2): 0,
                                            "per_achi"          : (lastmonth_monthly.Other/100000) > 0 ? ((lastmonth_activity.Other/100000) / (lastmonth_monthly.Other/100000) * 100).toFixed(2) : "-",
                                        },
                                        {
                                            "source"            : "Total",
                                            "annualPlan"        : (source[len-2].annualPlan_Other_L + source[len-2].annualPlan_Govt_L + source[len-2].annualPlan_IndirectCC_L + source[len-2].annualPlan_DirectCC_L + source[len-2].annualPlan_Bank_Loan_L + source[len-2].annualPlan_NABARD_L + source[len-2].annualPlan_LHWRF_L).toFixed(2), 
                                            "cum_monthly"       : (source[len-2].monthlyPlan_Other_L + source[len-2].monthlyPlan_Govt_L + source[len-2].monthlyPlan_IndirectCC_L + source[len-2].monthlyPlan_DirectCC_L + source[len-2].monthlyPlan_Bank_Loan_L + source[len-2].monthlyPlan_NABARD_L + source[len-2].monthlyPlan_LHWRF_L).toFixed(2),
                                            "cum_achi"          : (source[len-2].achievement_Other_L + source[len-2].achievement_Govt_L + source[len-2].achievement_IndirectCC_L + source[len-2].achievement_DirectCC_L + source[len-2].achievement_Bank_Loan_L + source[len-2].achievement_NABARD_L + source[len-2].achievement_LHWRF_L).toFixed(2),   
                                            "per_cum_achi"      : "",
                                            "monthlyPlan"       : ((lastmonth_monthly.Other + lastmonth_monthly.Govt + lastmonth_monthly.IndirectCC + lastmonth_monthly.DirectCC + lastmonth_monthly.Bank_Loan + lastmonth_monthly.NABARD + lastmonth_monthly.LHWRF)/100000).toFixed(2),
                                            "achi_month"        : ((lastmonth_activity.Other + lastmonth_activity.Govt + lastmonth_activity.IndirectCC + lastmonth_activity.DirectCC + lastmonth_activity.Bank_Loan + lastmonth_activity.NABARD + lastmonth_activity.LHWRF)/100000).toFixed(2),
                                            "per_achi"          : "",
                                        }
                            );
                            res.status(200).json(returnData); 
                        }
                    }
                }else{
                    res.status(200).json({message:"Data not found"});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(200).json(err);
            });
};
exports.report_goal = (req,res,next)=>{
    SectorMapping   .aggregate([
                                    {   
                                        $match : { "type" : req.params.goal } 
                                    },
                                    {
                                        $unwind : "$sector"
                                    },
                                    {
                                        $project : {
                                            "goal"          : "$goal",
                                            "sector_ID"     : "$sector.sector_ID",
                                            "sector"        : "$sector.sectorName",
                                            "activity_ID"   : "$sector.activity_ID",
                                            "activityName"  : "$sector.activityName",
                                        }
                                    }
                                ])
                    .exec()
                    .then(goalData=>{
                        if(goalData.length > 0){
                            getData();
                            async function getData(){
                                var sector_subactivity = [];
                                var returnData = [];
                                for(i = 0 ; i < goalData.length ; i++){
                                    var dataSectors = await getSubActivities({
                                                                                    "goal"          : goalData[i].goal,
                                                                                    "sector_ID"     : goalData[i].sector_ID,
                                                                                    "activity_ID"   : goalData[i].activity_ID
                                                                            });    
                                    sector_subactivity = sector_subactivity.concat(dataSectors);      
                                }
                                if(i >= goalData.length){
                                    var amount              = 0;
                                    var quantity            = 0;
                                    var beneficiaries       = 0;
                                    var LHWRF               = 0;
                                    var NABARD              = 0;
                                    var govt                = 0;
                                    var bank                = 0;
                                    var community           = 0;
                                    var Other               = 0;
                                    for(j = 0 ; j < sector_subactivity.length ; j++){
                                        var activityReportdata  = {};
                                        if(req.params.center_ID != "all"){
                                            activityReportdata = await activityReport({
                                                                                        $match : {
                                                                                            "center_ID"     : String(req.params.center_ID),
                                                                                            "sector_ID"     : String(sector_subactivity[j].sector_ID),
                                                                                            "activity_ID"   : String(sector_subactivity[j].activity_ID),
                                                                                            "date"          : {$gte : req.params.startDate, $lte : req.params.endDate}
                                                                                        }
                                                                                });
                                        }else{
                                            activityReportdata = await activityReport({
                                                                                        $match : {
                                                                                            "sector_ID"     : String(sector_subactivity[j].sector_ID),
                                                                                            "activity_ID"   : String(sector_subactivity[j].activity_ID),
                                                                                            "date"          : {$gte : req.params.startDate, $lte : req.params.endDate}
                                                                                        }
                                                                                });
                                        }
                                        amount              += activityReportdata.TotalBudget ;
                                        quantity            += activityReportdata.PhysicalUnit ;
                                        beneficiaries       += activityReportdata.Reach ;
                                        LHWRF               += activityReportdata.LHWRF ;
                                        NABARD              += activityReportdata.NABARD ;
                                        govt                += activityReportdata.Govt ;
                                        bank                += activityReportdata.Bank_Loan ;
                                        community           += (activityReportdata.DirectCC + activityReportdata.IndirectCC) ;
                                        Other               += activityReportdata.Other ;
                                        returnData.push({
                                            "goalName"          : sector_subactivity[j].goalName,
                                            "activityName"      : sector_subactivity[j].sectorName + " : " + sector_subactivity[j].activityName + " : " + sector_subactivity[j].subActivityName,
                                            "unit"              : sector_subactivity[j].unit,
                                            "Quantity"          : activityReportdata.PhysicalUnit,
                                            "Amount"            : activityReportdata.TotalBudget,
                                            "Beneficiaries"     : activityReportdata.Reach,
                                            "LHWRF"             : activityReportdata.LHWRF,
                                            "NABARD"            : activityReportdata.NABARD,
                                            "Govt"              : activityReportdata.Govt,
                                            "Bank"              : activityReportdata.Bank_Loan,
                                            "Community"         : activityReportdata.DirectCC + activityReportdata.IndirectCC, 
                                            "Other"             : activityReportdata.Other
                                        });
                                    }
                                    if(j >= sector_subactivity.length){
                                        returnData.push(
                                            {
                                                "goalName"          : "Total",
                                                "activityName"      : "",
                                                "unit"              : "",
                                                "Quantity"          : quantity,
                                                "Amount"            : amount,
                                                "Beneficiaries"     : beneficiaries,
                                                "LHWRF"             : LHWRF,
                                                "NABARD"            : NABARD,
                                                "Govt"              : govt,
                                                "Bank"              : bank,
                                                "Community"         : community, 
                                                "Other"             : Other, 
                                            },
                                            {
                                                "goalName"          : "% To Expd",
                                                "activityName"      : "",
                                                "unit"              : "",
                                                "Quantity"          : "",
                                                "Amount"            : 100,
                                                // achievement_TotalBudget > 0 ? (((achievement_LHWRF / achievement_TotalBudget) * 100).toFixed(2)) : "-",
                                                // "Beneficiaries"     : ((amount * beneficiaries) * 100 ).toFixed(2),
                                                "Beneficiaries"     : "",
                                                "LHWRF"             : ((amount * LHWRF) * 100).toFixed(2),
                                                "NABARD"            : ((amount * NABARD) * 100).toFixed(2),
                                                "Govt"              : ((amount * govt) * 100).toFixed(2),
                                                "Bank"              : ((amount * bank) * 100).toFixed(2),
                                                "Community"         : ((amount * community) * 100).toFixed(2), 
                                                "Other"             : ((amount * Other) * 100).toFixed(2), 
                                            }
                                        );
                                        res.status(200).json(returnData);
                                    }
                                }
                            }
                        }else{
                            res.status(200).json({message : "Data Not Found"});
                        }
                    })
                    .catch(err=>{
                        res.status(200).json(err);
                    });
};
exports.report_category = (req,res,next)=>{
    var query = {};
    if(req.params.center_ID != "all" && req.params.district != "all"){
        query = {
                    $match : {
                                "district"   : req.params.district,
                                "date"       : {$gte : req.params.startDate, $lte : req.params.endDate},
                                "center_ID"  : req.params.center_ID,
                    }
                };
    }else if(req.params.center_ID == "all" && req.params.district != "all"){
        query = {
                    $match : {
                                "district"   : req.params.district,
                                "date"       : {$gte : req.params.startDate, $lte : req.params.endDate}
                    }
                };
    }else{
        query = {
                    $match : {
                                // "district"   : req.params.district,
                                "date"       : {$gte : req.params.startDate, $lte : req.params.endDate}
                    }
                };
    }
    ActivityReport  .aggregate(
                                [
                                    query,
                                    {
                                        $project : {
                                                "listofBeneficiaries" : 1
                                            }
                                    },
                                    {
                                        $unwind : "$listofBeneficiaries"
                                    },
                                    {
                                        $project : {
                                                    "_id"               : "$_id",
                                                    "family_ID"         : "$listofBeneficiaries.family_ID",
                                                    "familyID"          : "$listofBeneficiaries.familyID",
                                                    // "familyHead"        : "$listofBeneficiaries.familyHead",
                                                    "beneficiary_ID"    : "$listofBeneficiaries.beneficiary_ID",
                                                    // "beneficiaryID"     : "$listofBeneficiaries.beneficiaryID"
                                        }
                                    },
                                    {
                                        $lookup : {
                                                from          : "families",
                                                localField    : "familyID",
                                                foreignField  : "familyID",
                                                as            : "families"
                                        }
                                    },
                                    {
                                        $unwind : "$families"
                                    },
                                    {
                                        $project : {
                                                    "_id"               : 1,
                                                    "family_ID"         : 1,
                                                    "familyID"          : 1,
                                                    // "familyHead"        : 1,
                                                    "beneficiary_ID"    : 1,
                                                    // "beneficiaryID"     : 1,
                                                    "category"          : "$families.familyCategory",
                                                    "Reach"             : { "$sum" : 1}
                                        }
                                    },
                                    {
                                        $group : {
                                                    "_id"       : {
                                                                    "family_ID"     : "$family_ID",
                                                                    "familyID"      : "$familyID",
                                                                    "category"      : "$category",
                                                                    "beneficiary_ID": "$beneficiary_ID"
                                                                },
                                                    "Reach"     : { "$sum" : 1}
                                                }    
                                    },
                                    {
                                        $group : {
                                                    "_id"                   : "$_id.category",
                                                    "Reach"                 : { "$sum" : "$Reach" },
                                                    "FamilyUpgradation"     : { "$sum" : 1}
                                                }
                                    },
                                    {
                                        $project : {
                                                    "Reach"                 : 1,
                                                    "FamilyUpgradation"     : 1,
                                                    "FamilyCategory"        : "$_id",
                                                    "_id"                   : 0
                                                }
                                    }
                                ]
                    )
                    .exec()
                    .then(activityReport=>{
                        var totalReach              = 0 ;
                        var totalFamilyUpgradation  = 0 ;
                        for(i = 0 ; i < activityReport.length ; i ++){
                            totalReach              += activityReport[i].Reach;
                            totalFamilyUpgradation  += activityReport[i].FamilyUpgradation;
                        }
                        if(i >= activityReport.length){
                            activityReport.push({
                                    "FamilyCategory"    : "Total",
                                    "Reach"             : totalReach,
                                    "FamilyUpgradation" : totalFamilyUpgradation
                            });
                            res.status(200).json(activityReport);
                        }
                    })
                    .catch(err=>{
                      res.status(200).json(err);  
                    });
};
exports.report_upgraded = (req,res,next)=>{
    var query = {};
    if(req.params.center_ID != "all" && req.params.district != "all"){
        query = {
                    $match : {
                                "district"   : req.params.district,
                                "date"       : {$gte : req.params.startDate, $lte : req.params.endDate},
                                "center_ID"  : req.params.center_ID,
                    }
                };
    }else if(req.params.center_ID == "all" && req.params.district != "all"){
        query = {
                    $match : {
                                "district"   : req.params.district,
                                "date"       : {$gte : req.params.startDate, $lte : req.params.endDate}
                    }
                };
    }else{
        query = {
                    $match : {
                                // "district"   : req.params.district,
                                "date"       : {$gte : req.params.startDate, $lte : req.params.endDate}
                    }
                };
    }
    ActivityReport  .aggregate(
                                [
                                    query,
                                    {
                                        $unwind : "$listofBeneficiaries"
                                    },
                                    {
                                        $project : {
                                                "district"          : "$district",
                                                "village"           : "$village",
                                                "block"             : "$block",
                                                "date"              : "$date",
                                                "sector_ID"         : "$sector_ID",
                                                "sectorName"        : "$sectorName",
                                                "activity_ID"       : "$activity_ID",
                                                "activityName"      : "$activityName",
                                                "subactivity_ID"    : "$subactivity_ID",
                                                "subactivityName"   : "$subactivityName",
                                                "unit"              : "$unit",
                                                "quantity"          : "$quantity",
                                                "unitCost"          : "$unitCost",
                                                "totalcost"         : "$totalcost",
                                                "LHWRF"             : "$sourceofFund.LHWRF",
                                                "NABARD"            : "$sourceofFund.NABARD",
                                                "bankLoan"          : "$sourceofFund.bankLoan",
                                                "govtscheme"        : "$sourceofFund.govtscheme",
                                                "directCC"          : "$sourceofFund.directCC",
                                                "indirectCC"        : "$sourceofFund.indirectCC",
                                                "other"             : "$sourceofFund.other",
                                                "total"             : "$sourceofFund.total",
                                                "beneficiaryID"     : "$listofBeneficiaries.nameofbeneficiary"
                                            }
                                    }
                                ]
                    )
                    .exec()
                    .then(activityReport=>{
                        res.status(200).json(activityReport);
                    })
                    .catch(err=>{
                      res.status(200).json(err);  
                    });  
};
exports.report_dashboard = (req,res,next)=>{
    var todayDate = derive_year_month({startDate : req.params.startYear+'-04-01', endDate : req.params.endYear+'-03-31'});
    var startYear = req.params.startYear;
    var endYear = req.params.endYear;
    getData();
    async function getData(){

        var curr_monthApril = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-04-01'), $lte : (startYear+'-04-31')},
                                                        }
                                                     });
        var month_monthApril = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["April"]}
                                                            }
                                                });
        
        var curr_monthMay = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-05-01'), $lte : (startYear+'-05-31')},
                                                        }
                                                     });
        var month_monthMay = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["May"]}
                                                            }
                                                });
        
        var curr_monthJune = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-06-01'), $lte : (startYear+'-06-31')},
                                                        }
                                                     });
        var month_monthJune = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["June"]}
                                                            }
                                                });
        
        var curr_monthJuly = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-07-01'), $lte : (startYear+'-07-31')},
                                                        }
                                                     });
        var month_monthJuly = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["July"]}
                                                            }
                                                });
        
        var curr_monthAugust = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-08-01'), $lte : (startYear+'-08-31')},
                                                        }
                                                     });
        var month_monthAugust = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["August"]}
                                                            }
                                                });
        
        var curr_monthSeptember = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-09-01'), $lte : (startYear+'-09-31')},
                                                        }
                                                     });
        var month_monthSeptember = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["September"]}
                                                            }
                                                });
        
        var curr_monthOctober = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-10-01'), $lte : (startYear+'-10-31')},
                                                        }
                                                     });
        var month_monthOctober = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["October"]}
                                                            }
                                                });
        
        var curr_monthNovember = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-11-01'), $lte : (startYear+'-11-31')},
                                                        }
                                                     });
        var month_monthNovember = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["November"]}
                                                            }
                                                });
        
        var curr_monthDecember = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (startYear+'-12-01'), $lte : (startYear+'-12-31')},
                                                        }
                                                     });
        var month_monthDecember = await monthlyPlan({$match : {
                                                                "year"  : { $in : [startYear]},
                                                                "month" : { $in : ["December"]}
                                                            }
                                                });
        
        var curr_monthJanuary = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (endYear+'-01-01'), $lte : (endYear+'-01-31')},
                                                        }
                                                     });
        var month_monthJanuary = await monthlyPlan({$match : {
                                                                "year"  : { $in : [endYear]},
                                                                "month" : { $in : ["January"]}
                                                            }
                                                });
        
        var curr_monthFebruary = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (endYear+'-02-01'), $lte : (endYear+'-02-31')},
                                                        }
                                                     });
        var month_monthFebruary = await monthlyPlan({$match : {
                                                                "year"  : { $in : [endYear]},
                                                                "month" : { $in : ["February"]}
                                                            }
                                                });
        
        var curr_monthMarch = await activityReport({$match : 
                                                        {
                                                            "date" : {$gte : (endYear+'-03-01'), $lte : (endYear+'-03-31')},
                                                        }
                                                     });
        var month_monthMarch = await monthlyPlan({$match : {
                                                                "year"  : { $in : [endYear]},
                                                                "month" : { $in : ["March"]}
                                                            }
                                                });
        
        var yearData = [
                            {
                                "month"                         : "April",
                                "startDate"                     : startYear+'-04-01',
                                "endDate"                       : startYear+'-04-30',
                                "curr_achievement_TotalBudget"  : curr_monthApril.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthApril.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthApril.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthApril.Reach,
                            },
                            {
                                "month"                         : "May",
                                "startDate"                     : startYear+'-05-01',
                                "endDate"                       : startYear+'-05-31',
                                "curr_achievement_TotalBudget"  : curr_monthMay.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthMay.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthMay.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthMay.Reach,
                            },
                            {
                                "month"                         : "June",
                                "startDate"                     : startYear+'-06-01',
                                "endDate"                       : startYear+'-06-30',
                                "curr_achievement_TotalBudget"  : curr_monthJune.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthJune.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthJune.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthJune.Reach,
                            },
                            {
                                "month"                         : "July",
                                "startDate"                     : startYear+'-07-01',
                                "endDate"                       : startYear+'-07-31',
                                "curr_achievement_TotalBudget"  : curr_monthJuly.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthJuly.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthJuly.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthJuly.Reach,
                            },
                            {
                                "month"                         : "August",
                                "startDate"                     : startYear+'-08-01',
                                "endDate"                       : startYear+'-08-31',
                                "curr_achievement_TotalBudget"  : curr_monthAugust.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthAugust.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthAugust.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthAugust.Reach,
                            },
                            {
                                "month"                         : "September",
                                "startDate"                     : startYear+'-09-01',
                                "endDate"                       : startYear+'-09-30',
                                "curr_achievement_TotalBudget"  : curr_monthSeptember.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthSeptember.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthSeptember.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthSeptember.Reach,
                            },
                            {
                                "month"                         : "October",
                                "startDate"                     : startYear+'-10-01',
                                "endDate"                       : startYear+'-10-31',
                                "curr_achievement_TotalBudget"  : curr_monthOctober.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthOctober.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthOctober.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthOctober.Reach,
                            },
                            {
                                "month"                         : "November",
                                "startDate"                     : startYear+'-11-01',
                                "endDate"                       : startYear+'-11-30',
                                "curr_achievement_TotalBudget"  : curr_monthNovember.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthNovember.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthNovember.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthNovember.Reach,
                            },
                            {
                                "month"                         : "December",
                                "startDate"                     : startYear+'-12-01',
                                "endDate"                       : startYear+'-12-31',
                                "curr_achievement_TotalBudget"  : curr_monthDecember.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthDecember.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthDecember.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthDecember.Reach,
                            },
                            {
                                "month"                         : "January",
                                "startDate"                     : endYear+'-01-01',
                                "endDate"                       : endYear+'-01-31',
                                "curr_achievement_TotalBudget"  : curr_monthJanuary.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthJanuary.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthJanuary.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthJanuary.Reach,
                            },
                            {
                                "month"                         : "February",
                                "startDate"                     : endYear+'-02-01',
                                "endDate"                       : endYear+'-02-29',
                                "curr_achievement_TotalBudget"  : curr_monthFebruary.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthFebruary.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthFebruary.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthFebruary.Reach,
                            },
                            {
                                "month"                         : "March",
                                "startDate"                     : endYear+'-03-01',
                                "endDate"                       : endYear+'-03-31',
                                "curr_achievement_TotalBudget"  : curr_monthMarch.TotalBudget,
                                "curr_achievement_Reach"        : curr_monthMarch.Reach,
                                "monthlyPlan_TotalBudget"       : month_monthMarch.TotalBudget,
                                "monthlyPlan_Reach"             : month_monthMarch.Reach,
                            },
                            
                        ];
        res.status(200).json(yearData);
    }
};
////Update code
function activityReport(searchQuery,uidStatus){
    var query = "1";
    if(uidStatus === 'withUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
                            }
                };
    }else if(uidStatus === 'withoutUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else{
        query = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    if(uidStatus != "1"){
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
                                                                "quantity"                             : 1,
                                                                "totalcost"                            : 1,
                                                                "sourceofFund"                         : 1,
                                                                "unitCost"                             : 1,
                                                                "projectCategoryType"                  : 1,
                                                            }
                                            },
                                            query,
                                            {
                                                $group : {
                                                            "_id"                   : null,
                                                            "listofBeneficiaries"   : { $push:  "$listofBeneficiaries" },
                                                            "upGrade"               : { "$push" : { "$cond" : [ {"$eq" : ["$listofBeneficiaries.isUpgraded" , "Yes"] },"$listofBeneficiaries",null ] } },
                                                            "PhysicalUnit"          : { "$sum" : "$quantity" },
                                                            "TotalBudget"           : { "$sum" : "$totalcost" },
                                                            "LHWRF"                 : { "$sum" : "$sourceofFund.LHWRF" },
                                                            "NABARD"                : { "$sum" : "$sourceofFund.NABARD" },
                                                            "Bank_Loan"             : { "$sum" : "$sourceofFund.bankLoan" },
                                                            "DirectCC"              : { "$sum" : "$sourceofFund.directCC" },
                                                            "IndirectCC"            : { "$sum" : "$sourceofFund.indirectCC" },
                                                            "Govt"                  : { "$sum" : "$sourceofFund.govtscheme" },
                                                            "Other"                 : { "$sum" : "$sourceofFund.other" },
                                                            "Total"                 : { "$sum" : "$sourceofFund.total"},
                                                            "UnitCost"              : { "$sum" : "$unitCost"},
                                                            "projectCategoryType"   : { "$first" : "$projectCategoryType"}
                                                        }
                                            },
                                            {
                                                $project : {
                                                    "listofBeneficiaries"   : { "$setUnion" : [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                                    // "upGrade"               : { $filter : { input : "$listofBeneficiaries", as : "beneficiaries", cond : { $ne : ["$$beneficiaries" , null] } } },
                                                    // "upGrade"               : { "$setDifference" :[ "$upGrade" , [null] ] },
                                                    "upGrade"               : 1,
                                                    "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                    "PhysicalUnit"          : 1,
                                                    "TotalBudget"           : 1,
                                                    "LHWRF"                 : 1,
                                                    "NABARD"                : 1,
                                                    "Bank_Loan"             : 1,
                                                    "DirectCC"              : 1,
                                                    "IndirectCC"            : 1,
                                                    "Govt"                  : 1,
                                                    "Other"                 : 1,
                                                    "Total"                 : 1,
                                                    "UnitCost"              : 1,
                                                    "projectCategoryType"   : 1,
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
                                                    "PhysicalUnit"          : 1,
                                                    "TotalBudget"           : 1,
                                                    "LHWRF"                 : 1,
                                                    "NABARD"                : 1,
                                                    "Bank_Loan"             : 1,
                                                    "DirectCC"              : 1,
                                                    "IndirectCC"            : 1,
                                                    "Govt"                  : 1,
                                                    "Other"                 : 1,
                                                    "Total"                 : 1,
                                                    "UnitCost"              : 1,
                                                    "projectCategoryType"   : 1,
                                                }
                                            },
                                            {
                                                $project : {
                                                    "Reach"                 : 1,
                                                    "upGrade"               : 1,
                                                    "FamilyUpgradation"     : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                    "FamilyUpgradation1"    : { $cond: { if: { $isArray: "$upGrade" }, then: { $size: "$upGrade" }, else: 0} },
                                                    "PhysicalUnit"          : 1,
                                                    "TotalBudget"           : 1,
                                                    "LHWRF"                 : 1,
                                                    "NABARD"                : 1,
                                                    "Bank_Loan"             : 1,
                                                    "DirectCC"              : 1,
                                                    "IndirectCC"            : 1,
                                                    "Govt"                  : 1,
                                                    "Other"                 : 1,
                                                    "Total"                 : 1,
                                                    "UnitCost"              : 1,
                                                    "upGrade"               : 1,
                                                    "projectCategoryType"   : 1,
                                                }
                                            },
                                        ]
                            )
                            .exec()
                            .then(data=>{
                                // resolve(data);
                                if(data.length > 0 ){
                                    resolve({
                                        "Reach"                  : data[0].Reach                ? data[0].Reach             : 0,
                                        // "FamilyUpgradation"      : data[0].FamilyUpgradation    ? data[0].FamilyUpgradation : 0,
                                        "FamilyUpgradation"     : data[0].FamilyUpgradation1   ? data[0].FamilyUpgradation1: 0,
                                        "PhysicalUnit"           : data[0].PhysicalUnit         ? data[0].PhysicalUnit / data[0].Reach       : 0,
                                        "TotalBudget"            : data[0].TotalBudget          ? data[0].TotalBudget / data[0].Reach       : 0,
                                        "LHWRF"                  : data[0].LHWRF                ? data[0].LHWRF / data[0].Reach             : 0,
                                        "NABARD"                 : data[0].NABARD               ? data[0].NABARD  / data[0].Reach           : 0,
                                        "Bank_Loan"              : data[0].Bank_Loan            ? data[0].Bank_Loan  / data[0].Reach        : 0,
                                        "DirectCC"               : data[0].DirectCC             ? data[0].DirectCC  / data[0].Reach         : 0,
                                        "IndirectCC"             : data[0].IndirectCC           ? data[0].IndirectCC   / data[0].Reach      : 0,
                                        "Govt"                   : data[0].Govt                 ? data[0].Govt  / data[0].Reach             : 0,
                                        "Other"                  : data[0].Other                ? data[0].Other  / data[0].Reach            : 0,
                                        "UnitCost"               : data[0].UnitCost             ? data[0].UnitCost  / data[0].Reach         : 0,
                                        "Total"                  : data[0].Total                ? data[0].Total  / data[0].Reach            : 0, 
                                        "projectCategoryType"    : data[0].projectCategoryType,  
                                        "upGrade"                : data[0].upGrade
                                    });
                                }else{
                                    resolve({
                                    "Reach"                  : 0,
                                    "FamilyUpgradation"      : 0,
                                    "PhysicalUnit"           : 0,
                                    "TotalBudget"            : 0,
                                    "LHWRF"                  : 0,
                                    "NABARD"                 : 0,
                                    "Bank_Loan"              : 0,
                                    "DirectCC"               : 0,
                                    "IndirectCC"             : 0,
                                    "Govt"                   : 0,
                                    "Other"                  : 0,
                                    "UnitCost"               : 0,
                                    "PhysicalUnit"           : 0,
                                    "upGrade"                : 0,
                                });
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                                reject(err);
                            });
        });
    }
};

