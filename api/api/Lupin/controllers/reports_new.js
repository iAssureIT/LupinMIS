const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
const ObjectID          = require('mongodb').ObjectID;
var request             = require('request-promise');
var moment              = require('moment');
const AnnualPlan        = require('../models/annualPlans.js');
const ActivityReport    = require('../models/activityReport.js');
const Sectors           = require('../models/sectors.js');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Center            = require('../models/centers.js');
const Families          = require('../models/families.js');
const SectorMapping     = require('../models/sectorMappings.js');
const ProjectMapping    = require('../models/projectMappings.js');

function getResultData_nonzeroentries(data,selectData,filterCondition){
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
            var i = 0;
            for(i = 0 ; i < data.length; i++){
                var annualPlanQuery         = {};
                var annualPlanQueryAnd      = {};
                var monthlyPlanQuery        = {};
                var monthlyPlanQueryAnd     = {};
                var activityReportQuery     = {};
                var currtentActivityReportQuery     = {};
                var currentMonthlyPlanQuery = {};
                var currentMonthlyPlanQueryAnd = {};
                var currentMonthStartDate   =  moment(data[i].endDate).format("YYYY")+'-'+moment(data[i].endDate).format("MM")+'-01';
                switch(selectData){
                    case "sector"   :
                        annualPlanQuery["$and"] = [];
                        annualPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        annualPlanQuery["$and"].push({"year"              : data[i].year});
                        // annualPlanQuery["$and"].push({"startDate"              : {$gte:data[i].startDate}});
                        // annualPlanQuery["$and"].push({"endDate"                : {$lte:data[i].endDate}});

                        monthlyPlanQuery["$and"] = [];
                        monthlyPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        monthlyPlanQuery["$and"].push({"year"              : { $in : data[i].yearList}});
                        monthlyPlanQuery["$and"].push({"month"             : { $in : data[i].monthList}});

                        currentMonthlyPlanQuery["$and"] = [];
                        currentMonthlyPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        currentMonthlyPlanQuery["$and"].push({"year"              : { $in : [moment(data[i].endDate).format("YYYY")]}});
                        currentMonthlyPlanQuery["$and"].push({"month"             : { $in : [moment(data[i].endDate).format("MMMM")]}});
                        
                        activityReportQuery["$and"] = [];
                        activityReportQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        activityReportQuery["$and"].push({"date"              : {$gte : data[i].startDate, $lte : data[i].endDate}});
                        
                        currtentActivityReportQuery["$and"] = [];
                        currtentActivityReportQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        currtentActivityReportQuery["$and"].push({"date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}});
                        
                        if(data[i].center_ID != "all"){
                            annualPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            monthlyPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            currentMonthlyPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            activityReportQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            currtentActivityReportQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                        }
                        if(data[i].projectCategoryType != "all"){
                            annualPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            monthlyPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            currentMonthlyPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            activityReportQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            currtentActivityReportQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            if(data[i].projectName != "all"){
                                annualPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                monthlyPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                currentMonthlyPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                activityReportQuery["$and"].push({"projectName"           : data[i].projectName});
                                currtentActivityReportQuery["$and"].push({"projectName"           : data[i].projectName});
                            }   
                        }
                        var selectDataName = {
                                "name"      : data[i].sector,
                                "unit"      : ""
                        };
                    break;
                    case "subActivities"   :
                        annualPlanQuery["$and"] = [];
                        annualPlanQuery["$and"].push({"sector_ID"      : String(data[i].sector_ID)});
                        annualPlanQuery["$and"].push({"activity_ID"    : String(data[i].activity_ID)});
                        annualPlanQuery["$and"].push({"subactivity_ID" : String(data[i].subactivity_ID)});
                        annualPlanQuery["$and"].push({"year"           : data[i].year});


                        monthlyPlanQuery["$and"] = [];
                        monthlyPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        monthlyPlanQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        monthlyPlanQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        monthlyPlanQuery["$and"].push({"year"              : { $in : data[i].yearList}});
                        monthlyPlanQuery["$and"].push({"month"             : { $in : data[i].monthList}});
                        // monthlyPlanQuery["$and"].push({"month"             : String(data[i].month)});
                        // console.log('String(data[i].month)',String(data[i].month));

                        currentMonthlyPlanQuery["$and"] = [];
                        currentMonthlyPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        currentMonthlyPlanQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        currentMonthlyPlanQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        currentMonthlyPlanQuery["$and"].push({"year"              : { $in : [moment(data[i].endDate).format("YYYY")]}});
                        currentMonthlyPlanQuery["$and"].push({"month"             : { $in : [moment(data[i].endDate).format("MMMM")]}});
                        
                        activityReportQuery["$and"] = [];
                        activityReportQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        activityReportQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        activityReportQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        activityReportQuery["$and"].push({"date"              : {$gte : data[i].startDate, $lte : data[i].endDate}});
                        
                        currtentActivityReportQuery["$and"] = [];
                        currtentActivityReportQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        currtentActivityReportQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        currtentActivityReportQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        currtentActivityReportQuery["$and"].push({"date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}});
                        
                        if(data[i].center_ID != "all"){
                            annualPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            monthlyPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            currentMonthlyPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            activityReportQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            currtentActivityReportQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                        }
                        if(data[i].projectCategoryType != "all"){
                            annualPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            monthlyPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            currentMonthlyPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            activityReportQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            currtentActivityReportQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            if(data[i].projectName != "all"){
                                annualPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                monthlyPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                currentMonthlyPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                activityReportQuery["$and"].push({"projectName"           : data[i].projectName});
                                currtentActivityReportQuery["$and"].push({"projectName"           : data[i].projectName});
                            }   
                        }
                        var selectDataName = {
                                "sectorName"           : data[i].sector,
                                "activityName"         : data[i].activityName,
                                "subactivityName"      : data[i].subActivityName,
                                "name"      : "<div class='wrapText text-left'><b>Sector : </b>"+data[i].sector+"<br/><b>Activity : </b>" + data[i].activityName + "<br/><b>Sub-Activity : </b>" + data[i].subActivityName+'</div>',
                                "unit"      : data[i].unit
                        };
                    break;
                    case "geographical"   :
                        annualPlanQuery["$and"] = [];
                        annualPlanQuery["$and"].push({"sector_ID"      : String(data[i].sector_ID)});
                        annualPlanQuery["$and"].push({"activity_ID"    : String(data[i].activity_ID)});
                        annualPlanQuery["$and"].push({"subactivity_ID" : String(data[i].subactivity_ID)});


                        monthlyPlanQuery["$and"] = [];
                        monthlyPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        monthlyPlanQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        monthlyPlanQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});

                        currentMonthlyPlanQuery["$and"] = [];
                        currentMonthlyPlanQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        currentMonthlyPlanQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        currentMonthlyPlanQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        
                        activityReportQuery["$and"] = [];
                        activityReportQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        activityReportQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        activityReportQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        activityReportQuery["$and"].push({"date"              : {$gte : data[i].startDate, $lte : data[i].endDate}});
                        
                        currtentActivityReportQuery["$and"] = [];
                        currtentActivityReportQuery["$and"].push({"sector_ID"         : String(data[i].sector_ID)});
                        currtentActivityReportQuery["$and"].push({"activity_ID"       : String(data[i].activity_ID)});
                        currtentActivityReportQuery["$and"].push({"subactivity_ID"    : String(data[i].subactivity_ID)});
                        currtentActivityReportQuery["$and"].push({"date"              : {$gte : currentMonthStartDate, $lte : data[i].endDate}});
                        
                        if(data[i].center_ID != "all"){
                            annualPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            monthlyPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            currentMonthlyPlanQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            activityReportQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                            currtentActivityReportQuery["$and"].push({"center_ID"         : String(data[i].center_ID)});
                        }
                        if(data[i].projectCategoryType != "all"){
                            annualPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            monthlyPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            currentMonthlyPlanQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            activityReportQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            currtentActivityReportQuery["$and"].push({"projectCategoryType"   : data[i].projectCategoryType});
                            if(data[i].projectName != "all"){
                                annualPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                monthlyPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                currentMonthlyPlanQuery["$and"].push({"projectName"           : data[i].projectName});
                                activityReportQuery["$and"].push({"projectName"           : data[i].projectName});
                                currtentActivityReportQuery["$and"].push({"projectName"           : data[i].projectName});
                            }   
                        }
                        if(data[i].district != "all"){
                            activityReportQuery["$and"].push({"district"   : data[i].district});
                            currtentActivityReportQuery["$and"].push({"district"   : data[i].district});  
                            if(data[i].block != "all"){
                                activityReportQuery["$and"].push({"block"   : data[i].block});
                                currtentActivityReportQuery["$and"].push({"block"   : data[i].block});  
                                if(data[i].village != "all"){
                                    activityReportQuery["$and"].push({"village"   : data[i].village});
                                    currtentActivityReportQuery["$and"].push({"village"   : data[i].village});  
                                }
                            }
                        }
                        var selectDataName = {
                                "sectorName"           : data[i].sector,
                                "activityName"         : data[i].activityName,
                                "subactivityName"      : data[i].subActivityName,
                                "name"      : "<div class='wrapText  text-left'><b>Sector : </b>"+data[i].sector+"<br/><b>Activity : </b>" + data[i].activityName + "<br/><b>Sub-Activity : </b>" + data[i].subActivityName+'</div>',
                                "unit"      : data[i].unit
                        };
                    break;
                    default :
                        resolve("Invalid Option");
                    break;
                };
                var uid = data[i].uidStatus ? data[i].uidStatus : 'all';
                var annualPlanData                      = await annualPlan(annualPlanQuery);
                var monthlyPlanData                     = await monthlyPlan(monthlyPlanQuery);
                var activityReportData                  = await activityReport(activityReportQuery,uid);
                var currentactivityReportData           = await activityReport(currtentActivityReportQuery,uid);
                var currentMonthly                      = await monthlyPlan(currentMonthlyPlanQuery);
                var dataLen = 0;
                for(dataLen = 0 ; dataLen < activityReportData.length ; dataLen++){
                    var ifCondition = "0";
                    switch(filterCondition){
                        case 'annual' : 
                            if(annualPlanData[dataLen]){
                                ifCondition = annualPlanData[dataLen].TotalBudget !== 0 && annualPlanData[dataLen].PhysicalUnit !== 0 && annualPlanData[dataLen].Reach !== 0;
                            }else{
                                ifCondition = false;
                            }
                            break;
                        case 'quarter' : 
                            if(monthlyPlan[dataLen]){
                            // console.log('monthlyPlan[dataLen]',monthlyPlan[dataLen]);
                                ifCondition = monthlyPlan[dataLen].TotalBudget !== 0 && monthlyPlan[dataLen].PhysicalUnit !== 0 && monthlyPlan[dataLen].Reach !== 0;
                            }else{
                                ifCondition = false;   
                            }
                            break;
                        case 'periodic' : 
                            if(monthlyPlanData[dataLen]){
                                ifCondition = monthlyPlanData[dataLen].TotalBudget !== 0 && monthlyPlanData[dataLen].PhysicalUnit !== 0 && monthlyPlanData[dataLen].Reach !== 0;
                            }else{
                                ifCondition = false;   
                            }
                            break;
                        case 'pure_achievement' :

                            if(activityReportData[dataLen]){
                                ifCondition = activityReportData[dataLen].TotalBudget !== 0 && activityReportData[dataLen].PhysicalUnit !== 0;
                            }else{
                                ifCondition = false;
                            }
                            break;
                        default : 
                            ifCondition = true;
                            break;
                    }
                    if(ifCondition){
                        annualPlan_PhysicalUnit                 += annualPlanData[dataLen] && annualPlanData[dataLen].PhysicalUnit ? (annualPlanData[dataLen].PhysicalUnit) : 0;                        
                        annualPlan_TotalBudget                  += annualPlanData[dataLen] && annualPlanData[dataLen].TotalBudget ? (annualPlanData[dataLen].TotalBudget) : 0;
                        annualPlan_Reach                        += annualPlanData[dataLen] && annualPlanData[dataLen].Reach ? parseInt(annualPlanData[dataLen].Reach) : 0;
                        annualPlan_FamilyUpgradation            += annualPlanData[dataLen] && annualPlanData[dataLen].FamilyUpgradation ? annualPlanData[dataLen].FamilyUpgradation : 0;
                        annualPlan_LHWRF                        += annualPlanData[dataLen] && annualPlanData[dataLen].LHWRF ? (annualPlanData[dataLen].LHWRF) : 0;
                        annualPlan_NABARD                       += annualPlanData[dataLen] && annualPlanData[dataLen].NABARD ? (annualPlanData[dataLen].NABARD) : 0;
                        annualPlan_Bank_Loan                    += annualPlanData[dataLen] && annualPlanData[dataLen].Bank_Loan ? (annualPlanData[dataLen].Bank_Loan) : 0;
                        annualPlan_Govt                         += annualPlanData[dataLen] && annualPlanData[dataLen].Govt ? (annualPlanData[dataLen].Govt) : 0;
                        annualPlan_DirectCC                     += annualPlanData[dataLen] && annualPlanData[dataLen].DirectCC ? (annualPlanData[dataLen].DirectCC) : 0;
                        annualPlan_IndirectCC                   += annualPlanData[dataLen] && annualPlanData[dataLen].IndirectCC ? (annualPlanData[dataLen].IndirectCC) : 0;
                        annualPlan_Other                        += annualPlanData[dataLen] && annualPlanData[dataLen].Other ? (annualPlanData[dataLen].Other) : 0;
                        annualPlan_UnitCost                     += annualPlanData[dataLen] && annualPlanData[dataLen].UnitCost ? (annualPlanData[dataLen].UnitCost) : 0;

                        monthlyPlan_PhysicalUnit                += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].PhysicalUnit ? (monthlyPlanData[dataLen].PhysicalUnit) : 0;
                        monthlyPlan_UnitCost                    += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].UnitCost ? (monthlyPlanData[dataLen].UnitCost) : 0;
                        monthlyPlan_TotalBudget                 += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].TotalBudget ? (monthlyPlanData[dataLen].TotalBudget) : 0;
                        monthlyPlan_LHWRF                       += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].LHWRF ? (monthlyPlanData[dataLen].LHWRF) : 0;
                        monthlyPlan_NABARD                      += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].NABARD ? (monthlyPlanData[dataLen].NABARD) : 0;
                        monthlyPlan_Bank_Loan                   += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Bank_Loan ? (monthlyPlanData[dataLen].Bank_Loan) : 0;
                        monthlyPlan_IndirectCC                  += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].IndirectCC ? (monthlyPlanData[dataLen].IndirectCC) : 0;
                        monthlyPlan_DirectCC                    += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].DirectCC ? (monthlyPlanData[dataLen].DirectCC) : 0;
                        monthlyPlan_Govt                        += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Govt ? (monthlyPlanData[dataLen].Govt) : 0;
                        monthlyPlan_Other                       += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Other ? (monthlyPlanData[dataLen].Other) : 0;
                        monthlyPlan_Reach                       += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Reach ? monthlyPlanData[dataLen].Reach : 0;
                        monthlyPlan_FamilyUpgradation           += monthlyPlanData[dataLen] && monthlyPlanData[dataLen].FamilyUpgradation ? monthlyPlanData[dataLen].FamilyUpgradation : 0;

                        curr_monthlyPlan_PhysicalUnit           += currentMonthly[dataLen] && currentMonthly[dataLen].PhysicalUnit ? (currentMonthly[dataLen].PhysicalUnit) : 0;
                        curr_monthlyPlan_UnitCost               += currentMonthly[dataLen] && currentMonthly[dataLen].UnitCost ? (currentMonthly[dataLen].UnitCost) : 0;
                        curr_monthlyPlan_TotalBudget            += currentMonthly[dataLen] && currentMonthly[dataLen].TotalBudget ? (currentMonthly[dataLen].TotalBudget) : 0;
                        curr_monthlyPlan_LHWRF                  += currentMonthly[dataLen] && currentMonthly[dataLen].LHWRF ? (currentMonthly[dataLen].LHWRF) : 0;
                        curr_monthlyPlan_NABARD                 += currentMonthly[dataLen] && currentMonthly[dataLen].NABARD ? (currentMonthly[dataLen].NABARD) : 0;
                        curr_monthlyPlan_Bank_Loan              += currentMonthly[dataLen] && currentMonthly[dataLen].Bank_Loan ? (currentMonthly[dataLen].Bank_Loan) : 0;
                        curr_monthlyPlan_IndirectCC             += currentMonthly[dataLen] && currentMonthly[dataLen].IndirectCC ? (currentMonthly[dataLen].IndirectCC) : 0;
                        curr_monthlyPlan_DirectCC               += currentMonthly[dataLen] && currentMonthly[dataLen].DirectCC ? (currentMonthly[dataLen].DirectCC) : 0;
                        curr_monthlyPlan_Govt                   += currentMonthly[dataLen] && currentMonthly[dataLen].Govt ? (currentMonthly[dataLen].Govt) : 0;
                        curr_monthlyPlan_Other                  += currentMonthly[dataLen] && currentMonthly[dataLen].Other ? (currentMonthly[dataLen].Other) : 0;
                        curr_monthlyPlan_Reach                  += currentMonthly[dataLen] && currentMonthly[dataLen].Reach ? currentMonthly[dataLen].Reach : 0;
                        curr_monthlyPlan_FamilyUpgradation      += currentMonthly[dataLen] && currentMonthly[dataLen].FamilyUpgradation ? currentMonthly[dataLen].FamilyUpgradation : 0;

                        achievement_Reach                       += activityReportData[dataLen] && activityReportData[dataLen].Reach ? activityReportData[dataLen].Reach :0;
                        achievement_FamilyUpgradation           += activityReportData[dataLen] && activityReportData[dataLen].FamilyUpgradation ? activityReportData[dataLen].FamilyUpgradation : 0;
                        achievement_PhysicalUnit                += activityReportData[dataLen] && activityReportData[dataLen].PhysicalUnit ? (activityReportData[dataLen].PhysicalUnit) : 0;
                        achievement_UnitCost                    += activityReportData[dataLen] && activityReportData[dataLen].UnitCost ? (activityReportData[dataLen].UnitCost) : 0;
                        achievement_TotalBudget                 += activityReportData[dataLen] && activityReportData[dataLen].TotalBudget ? (activityReportData[dataLen].TotalBudget) : 0;
                        achievement_LHWRF                       += activityReportData[dataLen] && activityReportData[dataLen].LHWRF ? (activityReportData[dataLen].LHWRF) : 0;
                        achievement_NABARD                      += activityReportData[dataLen] && activityReportData[dataLen].NABARD ? (activityReportData[dataLen].NABARD) : 0;
                        achievement_Bank_Loan                   += activityReportData[dataLen] && activityReportData[dataLen].Bank_Loan ? (activityReportData[dataLen].Bank_Loan) : 0;
                        achievement_DirectCC                    += activityReportData[dataLen] && activityReportData[dataLen].DirectCC ? (activityReportData[dataLen].DirectCC) : 0;
                        achievement_IndirectCC                  += activityReportData[dataLen] && activityReportData[dataLen].IndirectCC ? (activityReportData[dataLen].IndirectCC) : 0;
                        achievement_Govt                        += activityReportData[dataLen] && activityReportData[dataLen].Govt ? (activityReportData[dataLen].Govt) : 0;
                        achievement_Other                       += activityReportData[dataLen] && activityReportData[dataLen].Other ? (activityReportData[dataLen].Other) : 0;
                        achievement_Total                       += activityReportData[dataLen] && activityReportData[dataLen].Total ? (activityReportData[dataLen].Total) : 0;

                        curr_achievement_Reach                  += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Reach ? currentactivityReportData[dataLen].Reach :0;
                        curr_achievement_FamilyUpgradation      += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].FamilyUpgradation ? currentactivityReportData[dataLen].FamilyUpgradation : 0;
                        curr_achievement_PhysicalUnit           += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].PhysicalUnit ? (currentactivityReportData[dataLen].PhysicalUnit) : 0;
                        curr_achievement_UnitCost               += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].UnitCost ? (currentactivityReportData[dataLen].UnitCost) : 0;
                        curr_achievement_TotalBudget            += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].TotalBudget ? (currentactivityReportData[dataLen].TotalBudget) : 0;
                        curr_achievement_LHWRF                  += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].LHWRF ? (currentactivityReportData[dataLen].LHWRF) : 0;
                        curr_achievement_NABARD                 += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].NABARD ? (currentactivityReportData[dataLen].NABARD) : 0;
                        curr_achievement_Bank_Loan              += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Bank_Loan ? (currentactivityReportData[dataLen].Bank_Loan) : 0;
                        curr_achievement_DirectCC               += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].DirectCC ? (currentactivityReportData[dataLen].DirectCC) : 0;
                        curr_achievement_IndirectCC             += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].IndirectCC ? (currentactivityReportData[dataLen].IndirectCC) : 0;
                        curr_achievement_Govt                   += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Govt ? (currentactivityReportData[dataLen].Govt) : 0;
                        curr_achievement_Other                  += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Other ? (currentactivityReportData[dataLen].Other) : 0;
                        curr_achievement_Total                  += currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Total ? (currentactivityReportData[dataLen].Total) : 0;

                        variance_monthlyPlan_PhysicalUnit       += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? (monthlyPlanData[dataLen].PhysicalUnit - activityReportData[dataLen].PhysicalUnit) : 0;
                        variance_monthlyPlan_UnitCost           += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].UnitCost     - activityReportData[dataLen].UnitCost)) : 0; 
                        variance_monthlyPlan_TotalBudget        += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].monthlyPlan_TotalBudget  - activityReportData[dataLen].TotalBudget)) : 0;
                        variance_monthlyPlan_LHWRF              += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].LHWRF        - activityReportData[dataLen].LHWRF)) : 0; 
                        variance_monthlyPlan_NABARD             += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].NABARD       - activityReportData[dataLen].NABARD)) : 0;
                        variance_monthlyPlan_Bank_Loan          += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].Bank_Loan    - activityReportData[dataLen].Bank_Loan)): 0;
                        variance_monthlyPlan_IndirectCC         += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].IndirectCC   - activityReportData[dataLen].IndirectCC)) : 0;
                        variance_monthlyPlan_DirectCC           += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].DirectCC     - activityReportData[dataLen].DirectCC)) : 0;
                        variance_monthlyPlan_Govt               += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].Govt         - activityReportData[dataLen].Govt)) : 0; 
                        variance_monthlyPlan_Other              += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? ((monthlyPlanData[dataLen].Other        - activityReportData[dataLen].Other)) : 0;
                        variance_monthlyPlan_Reach              += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? (monthlyPlanData[dataLen].Reach        - activityReportData[dataLen].Reach) : 0;
                        variance_monthlyPlan_FamilyUpgradation  += (monthlyPlanData[dataLen] && activityReportData[dataLen] ) ? (monthlyPlanData[dataLen].FamilyUpgradation - activityReportData[dataLen].FamilyUpgradation) : 0;
                        // console.log("achievement_UnitCost ",activityReportData[dataLen].UnitCost);
                        // console.log("achievement_UnitCost_L ",activityReportData[dataLen].UnitCost/100000);
                            
                        returnData.push({
                            "sectorName"                            : selectDataName.sectorName,
                            "activityName"                          : selectDataName.activityName,
                            "subactivityName"                       : selectDataName.subactivityName,
                            "name"                                  : selectDataName.name,
                            "unit"                                  : selectDataName.unit,

                            "annualPlan_UnitCost"                   : (annualPlanData[dataLen] && annualPlanData[dataLen].UnitCost) ? parseFloat((annualPlanData[dataLen].UnitCost).toFixed(4)) : 0,
                            "annualPlan_PhysicalUnit"               : annualPlanData[dataLen] && annualPlanData[dataLen].PhysicalUnit ? parseFloat((annualPlanData[dataLen].PhysicalUnit).toFixed(2)) : 0,                        
                            "annualPlan_TotalBudget"                : annualPlanData[dataLen] && annualPlanData[dataLen].TotalBudget ? parseFloat((annualPlanData[dataLen].TotalBudget).toFixed(4)) : 0,
                            "annualPlan_Reach"                      : annualPlanData[dataLen] && annualPlanData[dataLen].Reach ? parseInt(annualPlanData[dataLen].Reach) : 0,
                            "annualPlan_FamilyUpgradation"          : annualPlanData[dataLen] && annualPlanData[dataLen].FamilyUpgradation ? annualPlanData[dataLen].FamilyUpgradation : 0,
                            "annualPlan_LHWRF"                      : annualPlanData[dataLen] && annualPlanData[dataLen].LHWRF ? parseFloat((annualPlanData[dataLen].LHWRF).toFixed(4)) : 0,
                            "annualPlan_NABARD"                     : annualPlanData[dataLen] && annualPlanData[dataLen].NABARD ? parseFloat((annualPlanData[dataLen].NABARD).toFixed(4)) : 0,
                            "annualPlan_Bank_Loan"                  : annualPlanData[dataLen] && annualPlanData[dataLen].Bank_Loan ? parseFloat((annualPlanData[dataLen].Bank_Loan).toFixed(4)) : 0,
                            "annualPlan_Govt"                       : annualPlanData[dataLen] && annualPlanData[dataLen].Govt ? parseFloat((annualPlanData[dataLen].Govt).toFixed(4)) : 0,
                            "annualPlan_DirectCC"                   : annualPlanData[dataLen] && annualPlanData[dataLen].DirectCC ? parseFloat((annualPlanData[dataLen].DirectCC).toFixed(4)) : 0,
                            "annualPlan_IndirectCC"                 : annualPlanData[dataLen] && annualPlanData[dataLen].IndirectCC ? parseFloat((annualPlanData[dataLen].IndirectCC).toFixed(4)) : 0,
                            "annualPlan_Other"                      : annualPlanData[dataLen] && annualPlanData[dataLen].Other ? parseFloat((annualPlanData[dataLen].Other).toFixed(4)) : 0,
                            "annualPlan_Remark"                     : annualPlanData[dataLen] && annualPlanData[dataLen].Remark ? annualPlanData[dataLen].Remark : "-",
                            "annualPlan_projectCategoryType"        : annualPlanData[dataLen] && annualPlanData[dataLen].projectCategoryType ? annualPlanData[dataLen].projectCategoryType : "-",
                            "annualPlan_projectName"                : annualPlanData[dataLen] && annualPlanData[dataLen].projectName ? annualPlanData[dataLen].projectName : "-",
                            
                            "annualPlan_UnitCost_L"                 : annualPlanData[dataLen] && annualPlanData[dataLen].UnitCost/100000 ? parseFloat((annualPlanData[dataLen].UnitCost/100000).toFixed(4)) : 0,
                            "annualPlan_PhysicalUnit_L"             : annualPlanData[dataLen] && annualPlanData[dataLen].PhysicalUnit/100000 ? parseFloat((annualPlanData[dataLen].PhysicalUnit/100000).toFixed(2)) : 0,
                            "annualPlan_TotalBudget_L"              : annualPlanData[dataLen] && annualPlanData[dataLen].TotalBudget/100000 ? parseFloat((annualPlanData[dataLen].TotalBudget/100000).toFixed(4)) : 0,
                            "annualPlan_LHWRF_L"                    : annualPlanData[dataLen] && annualPlanData[dataLen].LHWRF/100000 ? parseFloat((annualPlanData[dataLen].LHWRF/100000).toFixed(4)) : 0,
                            "annualPlan_NABARD_L"                   : annualPlanData[dataLen] && annualPlanData[dataLen].NABARD/100000 ? parseFloat((annualPlanData[dataLen].NABARD/100000).toFixed(4)) : 0,
                            "annualPlan_Bank_Loan_L"                : annualPlanData[dataLen] && annualPlanData[dataLen].Bank_Loan/100000 ? parseFloat((annualPlanData[dataLen].Bank_Loan/100000).toFixed(4)) : 0,
                            "annualPlan_Govt_L"                     : annualPlanData[dataLen] && annualPlanData[dataLen].Govt/100000 ? parseFloat((annualPlanData[dataLen].Govt/100000).toFixed(4)) : 0,
                            "annualPlan_DirectCC_L"                 : annualPlanData[dataLen] && annualPlanData[dataLen].DirectCC/100000 ? parseFloat((annualPlanData[dataLen].DirectCC/100000).toFixed(4)) : 0,
                            "annualPlan_IndirectCC_L"               : annualPlanData[dataLen] && annualPlanData[dataLen].IndirectCC/100000 ? parseFloat((annualPlanData[dataLen].IndirectCC/100000).toFixed(4)) : 0,
                            "annualPlan_Other_L"                    : annualPlanData[dataLen] && annualPlanData[dataLen].Other/100000 ? parseFloat((annualPlanData[dataLen].Other/100000).toFixed(4)) : 0,

                            "monthlyPlan_PhysicalUnit"              : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].PhysicalUnit ? parseFloat((monthlyPlanData[dataLen].PhysicalUnit).toFixed(2)) : 0,
                            "monthlyPlan_UnitCost"                  : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].UnitCost ? parseFloat((monthlyPlanData[dataLen].UnitCost).toFixed(4)) : 0,
                            "monthlyPlan_TotalBudget"               : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].TotalBudget ? parseFloat((monthlyPlanData[dataLen].TotalBudget).toFixed(4)) : 0,
                            "monthlyPlan_LHWRF"                     : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].LHWRF ? parseFloat((monthlyPlanData[dataLen].LHWRF).toFixed(4)) : 0,
                            "monthlyPlan_NABARD"                    : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].NABARD ? parseFloat((monthlyPlanData[dataLen].NABARD).toFixed(4)) : 0,
                            "monthlyPlan_Bank_Loan"                 : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Bank_Loan ? parseFloat((monthlyPlanData[dataLen].Bank_Loan).toFixed(4)) : 0,
                            "monthlyPlan_IndirectCC"                : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].IndirectCC ? parseFloat((monthlyPlanData[dataLen].IndirectCC).toFixed(4)) : 0,
                            "monthlyPlan_DirectCC"                  : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].DirectCC ? parseFloat((monthlyPlanData[dataLen].DirectCC).toFixed(4)) : 0,
                            "monthlyPlan_Govt"                      : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Govt ? parseFloat((monthlyPlanData[dataLen].Govt).toFixed(4)) : 0,
                            "monthlyPlan_Other"                     : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Other ? parseFloat((monthlyPlanData[dataLen].Other).toFixed(4)) : 0,
                            "monthlyPlan_Reach"                     : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].Reach ? monthlyPlanData[dataLen].Reach : 0,
                            "monthlyPlan_FamilyUpgradation"         : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].FamilyUpgradation ? monthlyPlanData[dataLen].FamilyUpgradation : 0,
                            "monthlyPlan_projectCategoryType"       : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].projectCategoryType ? monthlyPlanData[dataLen].projectCategoryType : "-",
                            "monthlyPlan_projectName"               : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].projectName ? monthlyPlanData[dataLen].projectName : "-",

                            "curr_monthlyPlan_PhysicalUnit"         : currentMonthly[dataLen] && currentMonthly[dataLen].PhysicalUnit ? parseFloat((currentMonthly[dataLen].PhysicalUnit).toFixed(2)) : 0,
                            "curr_monthlyPlan_UnitCost"             : currentMonthly[dataLen] && currentMonthly[dataLen].UnitCost ? parseFloat((currentMonthly[dataLen].UnitCost).toFixed(4)) : 0,
                            "curr_monthlyPlan_TotalBudget"          : currentMonthly[dataLen] && currentMonthly[dataLen].TotalBudget ? parseFloat((currentMonthly[dataLen].TotalBudget).toFixed(4)) : 0,
                            "curr_monthlyPlan_LHWRF"                : currentMonthly[dataLen] && currentMonthly[dataLen].LHWRF ? parseFloat((currentMonthly[dataLen].LHWRF).toFixed(4)) : 0,
                            "curr_monthlyPlan_NABARD"               : currentMonthly[dataLen] && currentMonthly[dataLen].NABARD ? parseFloat((currentMonthly[dataLen].NABARD).toFixed(4)) : 0,
                            "curr_monthlyPlan_Bank_Loan"            : currentMonthly[dataLen] && currentMonthly[dataLen].Bank_Loan ? parseFloat((currentMonthly[dataLen].Bank_Loan).toFixed(4)) : 0,
                            "curr_monthlyPlan_IndirectCC"           : currentMonthly[dataLen] && currentMonthly[dataLen].IndirectCC ? parseFloat((currentMonthly[dataLen].IndirectCC).toFixed(4)) : 0,
                            "curr_monthlyPlan_DirectCC"             : currentMonthly[dataLen] && currentMonthly[dataLen].DirectCC ? parseFloat((currentMonthly[dataLen].DirectCC).toFixed(4)) : 0,
                            "curr_monthlyPlan_Govt"                 : currentMonthly[dataLen] && currentMonthly[dataLen].Govt ? parseFloat((currentMonthly[dataLen].Govt).toFixed(4)) : 0,
                            "curr_monthlyPlan_Other"                : currentMonthly[dataLen] && currentMonthly[dataLen].Other ? parseFloat((currentMonthly[dataLen].Other).toFixed(4)) : 0,
                            "curr_monthlyPlan_Reach"                : currentMonthly[dataLen] && currentMonthly[dataLen].Reach ? currentMonthly[dataLen].Reach : 0,
                            "curr_monthlyPlan_FamilyUpgradation"    : currentMonthly[dataLen] && currentMonthly[dataLen].FamilyUpgradation ? currentMonthly[dataLen].FamilyUpgradation : 0,

                            "monthlyPlan_PhysicalUnit_L"            : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].PhysicalUnit/100000).toFixed(2) ? parseFloat((monthlyPlanData[dataLen].PhysicalUnit/100000).toFixed(2)) : 0,
                            "monthlyPlan_UnitCost_L"                : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].UnitCost/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].UnitCost/100000).toFixed(4)) : 0,
                            "monthlyPlan_TotalBudget_L"             : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].TotalBudget/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].TotalBudget/100000).toFixed(4)) : 0,
                            "monthlyPlan_LHWRF_L"                   : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].LHWRF/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].LHWRF/100000).toFixed(4)) : 0,
                            "monthlyPlan_NABARD_L"                  : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].NABARD/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].NABARD/100000).toFixed(4)) : 0,
                            "monthlyPlan_Bank_Loan_L"               : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Bank_Loan/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].Bank_Loan/100000).toFixed(4)) : 0,
                            "monthlyPlan_IndirectCC_L"              : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].IndirectCC/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].IndirectCC/100000).toFixed(4)) : 0,
                            "monthlyPlan_DirectCC_L"                : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].DirectCC/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].DirectCC/100000).toFixed(4)) : 0,
                            "monthlyPlan_Govt_L"                    : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Govt/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].Govt/100000).toFixed(4)) : 0,
                            "monthlyPlan_Other_L"                   : monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Other/100000).toFixed(4) ? parseFloat((monthlyPlanData[dataLen].Other/100000).toFixed(4)) : 0,
                            "Per_Periodic"                          : monthlyPlanData[dataLen] && monthlyPlanData[dataLen].TotalBudget && activityReportData[dataLen] && activityReportData[dataLen].Total ? (parseFloat((((activityReportData[dataLen].Total / monthlyPlanData[dataLen].TotalBudget ) * 100).toFixed(2)))+"%") : "-",

                            "achievement_projectCategory"           : activityReportData[dataLen] && activityReportData[dataLen].projectCategoryType ? activityReportData[dataLen].projectCategoryType : "-",
                            "achievement_Reach"                     : activityReportData[dataLen] && activityReportData[dataLen].Reach ? parseInt(activityReportData[dataLen].Reach) : 0,
                            "achievement_FamilyUpgradation"         : activityReportData[dataLen] && activityReportData[dataLen].FamilyUpgradation ? parseInt(activityReportData[dataLen].FamilyUpgradation) : 0,
                            "achievement_PhysicalUnit"              : activityReportData[dataLen] && activityReportData[dataLen].PhysicalUnit ? parseFloat((activityReportData[dataLen].PhysicalUnit).toFixed(2)) : 0,
                            "achievement_UnitCost"                  : activityReportData[dataLen] && activityReportData[dataLen].UnitCost ? parseFloat((activityReportData[dataLen].UnitCost).toFixed(4)) : 0,
                            "achievement_TotalBudget"               : activityReportData[dataLen] && activityReportData[dataLen].TotalBudget ? parseFloat((activityReportData[dataLen].TotalBudget).toFixed(4)) : 0,
                            "achievement_LHWRF"                     : activityReportData[dataLen] && activityReportData[dataLen].LHWRF ? parseFloat((activityReportData[dataLen].LHWRF).toFixed(4)) : 0,
                            "achievement_NABARD"                    : activityReportData[dataLen] && activityReportData[dataLen].NABARD ? parseFloat((activityReportData[dataLen].NABARD).toFixed(4)) : 0,
                            "achievement_Bank_Loan"                 : activityReportData[dataLen] && activityReportData[dataLen].Bank_Loan ? parseFloat((activityReportData[dataLen].Bank_Loan).toFixed(4)) : 0,
                            "achievement_DirectCC"                  : activityReportData[dataLen] && activityReportData[dataLen].DirectCC ? parseFloat((activityReportData[dataLen].DirectCC).toFixed(4)) : 0,
                            "achievement_IndirectCC"                : activityReportData[dataLen] && activityReportData[dataLen].IndirectCC ? parseFloat((activityReportData[dataLen].IndirectCC).toFixed(4)) : 0,
                            "achievement_Govt"                      : activityReportData[dataLen] && activityReportData[dataLen].Govt ? parseFloat((activityReportData[dataLen].Govt).toFixed(4)) : 0,
                            "achievement_Other"                     : activityReportData[dataLen] && activityReportData[dataLen].Other ? parseFloat((activityReportData[dataLen].Other).toFixed(4)) : 0,
                            "achievement_Total"                     : activityReportData[dataLen] && activityReportData[dataLen].Total ? parseFloat((activityReportData[dataLen].Total).toFixed(4)) : 0,
                            "Per_Annual"                            : activityReportData[dataLen] && annualPlanData[dataLen] && annualPlanData[dataLen].TotalBudget && activityReportData[dataLen].Total ? (parseFloat((((activityReportData[dataLen].Total / annualPlanData[dataLen].TotalBudget ) * 100).toFixed(2)))+"%") : "-",
                            "achievement_district"                  : activityReportData[dataLen] && activityReportData[dataLen].district ? activityReportData[dataLen].district : "-",
                            "achievement_block"                     : activityReportData[dataLen] && activityReportData[dataLen].block ? activityReportData[dataLen].block : "-",
                            "achievement_village"                   : activityReportData[dataLen] && activityReportData[dataLen].village ? activityReportData[dataLen].village : "-",

                            "curr_achievement_Reach"                     : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Reach ? parseInt(currentactivityReportData[dataLen].Reach) : 0,
                            "curr_achievement_FamilyUpgradation"         : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].FamilyUpgradation ? parseInt(currentactivityReportData[dataLen].FamilyUpgradation) : 0,
                            "curr_achievement_PhysicalUnit"              : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].PhysicalUnit ? parseFloat((currentactivityReportData[dataLen].PhysicalUnit).toFixed(2)) : 0,
                            "curr_achievement_UnitCost"                  : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].UnitCost ? parseFloat((currentactivityReportData[dataLen].UnitCost).toFixed(4)) : 0,
                            "curr_achievement_TotalBudget"               : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].TotalBudget ? parseFloat((currentactivityReportData[dataLen].TotalBudget).toFixed(4)) : 0,
                            "curr_achievement_LHWRF"                     : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].LHWRF ? parseFloat((currentactivityReportData[dataLen].LHWRF).toFixed(4)) : 0,
                            "curr_achievement_NABARD"                    : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].NABARD ? parseFloat((currentactivityReportData[dataLen].NABARD).toFixed(4)) : 0,
                            "curr_achievement_Bank_Loan"                 : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Bank_Loan ? parseFloat((currentactivityReportData[dataLen].Bank_Loan).toFixed(4)) : 0,
                            "curr_achievement_DirectCC"                  : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].DirectCC ? parseFloat((currentactivityReportData[dataLen].DirectCC).toFixed(4)) : 0,
                            "curr_achievement_IndirectCC"                : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].IndirectCC ? parseFloat((currentactivityReportData[dataLen].IndirectCC).toFixed(4)) : 0,
                            "curr_achievement_Govt"                      : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Govt ? parseFloat((currentactivityReportData[dataLen].Govt).toFixed(4)) : 0,
                            "curr_achievement_Other"                     : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Other ? parseFloat((currentactivityReportData[dataLen].Other).toFixed(4)) : 0,
                            "curr_achievement_Total"                     : currentactivityReportData[dataLen] && currentactivityReportData[dataLen].Total ? parseFloat((currentactivityReportData[dataLen].Total).toFixed(4)) : 0,
                            "curr_Per_Monthly"                           : currentactivityReportData[dataLen] && currentMonthly[dataLen] && currentMonthly[dataLen].TotalBudget && currentactivityReportData[dataLen].Total ? parseFloat((((currentactivityReportData[dataLen].Total / currentMonthly[dataLen].TotalBudget ) * 100).toFixed(4))) : "-",

                            "achievement_UnitCost_L"                : activityReportData[dataLen] && activityReportData[dataLen].UnitCost && (activityReportData[dataLen].UnitCost/100000) ? parseFloat((activityReportData[dataLen].UnitCost/100000).toFixed(4)) : 0,
                            "achievement_PhysicalUnit_L"            : activityReportData[dataLen] && activityReportData[dataLen].PhysicalUnit && (activityReportData[dataLen].PhysicalUnit/100000) ? parseFloat((activityReportData[dataLen].PhysicalUnit/100000).toFixed(2)) : 0,
                            "achievement_TotalBudget_L"             : activityReportData[dataLen] && activityReportData[dataLen].TotalBudget && (activityReportData[dataLen].TotalBudget/100000) ? parseFloat((activityReportData[dataLen].TotalBudget/100000).toFixed(4)) : 0,
                            "achievement_LHWRF_L"                   : activityReportData[dataLen] && activityReportData[dataLen].LHWRF && (activityReportData[dataLen].LHWRF/100000) ? parseFloat((activityReportData[dataLen].LHWRF/100000).toFixed(4)) : 0,
                            "achievement_NABARD_L"                  : activityReportData[dataLen] && activityReportData[dataLen].NABARD && (activityReportData[dataLen].NABARD/100000) ? parseFloat((activityReportData[dataLen].NABARD/100000).toFixed(4)) : 0,
                            "achievement_Bank_Loan_L"               : activityReportData[dataLen] && activityReportData[dataLen].Bank_Loan && (activityReportData[dataLen].Bank_Loan/100000) ? parseFloat((activityReportData[dataLen].Bank_Loan/100000).toFixed(4)) : 0,
                            "achievement_DirectCC_L"                : activityReportData[dataLen] && activityReportData[dataLen].DirectCC && (activityReportData[dataLen].DirectCC/100000) ? parseFloat((activityReportData[dataLen].DirectCC/100000).toFixed(4)) : 0,
                            "achievement_IndirectCC_L"              : activityReportData[dataLen] && activityReportData[dataLen].IndirectCC && (activityReportData[dataLen].IndirectCC/100000) ? parseFloat((activityReportData[dataLen].IndirectCC/100000).toFixed(4)) : 0,
                            "achievement_Govt_L"                    : activityReportData[dataLen] && activityReportData[dataLen].Govt && (activityReportData[dataLen].Govt/100000) ? parseFloat((activityReportData[dataLen].Govt/100000).toFixed(4)) : 0,
                            "achievement_Other_L"                   : activityReportData[dataLen] && activityReportData[dataLen].Other && (activityReportData[dataLen].Other/100000) ? parseFloat((activityReportData[dataLen].Other/100000).toFixed(4)) : 0,
                            "achievement_Total_L"                   : activityReportData[dataLen] && activityReportData[dataLen].Total && (activityReportData[dataLen].Total/100000) ? parseFloat((activityReportData[dataLen].Total/100000).toFixed(4)) : 0,
                            "projectCategoryType"                   : activityReportData[dataLen] && activityReportData[dataLen].projectCategoryType,
                            "projectName"                           : activityReportData[dataLen] && activityReportData[dataLen].projectName != 'all' ? activityReportData[dataLen].projectName : "-",
                            "variance_monthlyPlan_PhysicalUnit"     : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].PhysicalUnit - activityReportData[dataLen].PhysicalUnit) ? parseFloat((monthlyPlanData[dataLen].PhysicalUnit - activityReportData[dataLen].PhysicalUnit).toFixed(2)) : 0,
                            "variance_monthlyPlan_UnitCost"         : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].UnitCost     - activityReportData[dataLen].UnitCost) ? parseFloat((monthlyPlanData[dataLen].UnitCost     - activityReportData[dataLen].UnitCost).toFixed(4)) : 0,
                            "variance_monthlyPlan_TotalBudget"      : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].TotalBudget) ? parseFloat((monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].TotalBudget).toFixed(4)) : 0,
                            "variance_monthlyPlan_LHWRF"            : activityReportData[dataLen] && monthlyPlanData[dataLen]  ? parseFloat((monthlyPlanData[dataLen].LHWRF        - activityReportData[dataLen].LHWRF).toFixed(4)) : 0, 
                            "variance_monthlyPlan_NABARD"           : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].NABARD       - activityReportData[dataLen].NABARD) ? parseFloat((monthlyPlanData[dataLen].NABARD       - activityReportData[dataLen].NABARD).toFixed(4)) : 0,
                            "variance_monthlyPlan_Bank_Loan"        : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Bank_Loan    - activityReportData[dataLen].Bank_Loan) ? parseFloat((monthlyPlanData[dataLen].Bank_Loan    - activityReportData[dataLen].Bank_Loan).toFixed(4)) : 0,
                            "variance_monthlyPlan_IndirectCC"       : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].IndirectCC   - activityReportData[dataLen].IndirectCC) ? parseFloat((monthlyPlanData[dataLen].IndirectCC   - activityReportData[dataLen].IndirectCC).toFixed(4)) : 0,
                            "variance_monthlyPlan_DirectCC"         : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].DirectCC     - activityReportData[dataLen].DirectCC) ? parseFloat((monthlyPlanData[dataLen].DirectCC     - activityReportData[dataLen].DirectCC).toFixed(4)) : 0,
                            "variance_monthlyPlan_Govt"             : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Govt         - activityReportData[dataLen].Govt) ? parseFloat((monthlyPlanData[dataLen].Govt         - activityReportData[dataLen].Govt).toFixed(4)) : 0,
                            "variance_monthlyPlan_Other"            : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Other        - activityReportData[dataLen].Other) ? parseFloat((monthlyPlanData[dataLen].Other        - activityReportData[dataLen].Other).toFixed(4)) : 0,
                            "variance_monthlyPlan_Total"            : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].Total) ? parseFloat((monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].Total).toFixed(4)) : 0,
                            "variance_monthlyPlan_Reach"            : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Reach        - activityReportData[dataLen].Reach) ? monthlyPlanData[dataLen].Reach        - activityReportData[dataLen].Reach : 0,
                            "variance_monthlyPlan_FamilyUpgradation": activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].FamilyUpgradation - activityReportData[dataLen].FamilyUpgradation) ? monthlyPlanData[dataLen].FamilyUpgradation - activityReportData[dataLen].FamilyUpgradation : 0,

                            // "variance_monthlyPlan_PhysicalUnit"     : (monthlyPlanData[dataLen].PhysicalUnit - activityReportData[dataLen].PhysicalUnit)/100000 ? (monthlyPlanData[dataLen].PhysicalUnit - activityReportData[dataLen].PhysicalUnit)/100000 : 0,
                            "variance_monthlyPlan_UnitCost_L"         : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].UnitCost     - activityReportData[dataLen].UnitCost)/100000 ? parseFloat(((monthlyPlanData[dataLen].UnitCost     - activityReportData[dataLen].UnitCost)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_TotalBudget_L"    : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].TotalBudget)/100000 ? parseFloat(((monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].TotalBudget)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_LHWRF_L"          : activityReportData[dataLen] && monthlyPlanData[dataLen]  ? parseFloat(((monthlyPlanData[dataLen].LHWRF        - activityReportData[dataLen].LHWRF)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_NABARD_L"         : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].NABARD       - activityReportData[dataLen].NABARD)/100000 ? parseFloat(((monthlyPlanData[dataLen].NABARD       - activityReportData[dataLen].NABARD)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_Bank_Loan_L"      : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Bank_Loan    - activityReportData[dataLen].Bank_Loan)/100000 ? parseFloat(((monthlyPlanData[dataLen].Bank_Loan    - activityReportData[dataLen].Bank_Loan)/100000).toFixed(4)) : 0 ,
                            "variance_monthlyPlan_IndirectCC_L"     : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].IndirectCC   - activityReportData[dataLen].IndirectCC)/100000 ? parseFloat(((monthlyPlanData[dataLen].IndirectCC   - activityReportData[dataLen].IndirectCC)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_DirectCC_L"       : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].DirectCC     - activityReportData[dataLen].DirectCC)/100000 ? parseFloat(((monthlyPlanData[dataLen].DirectCC     - activityReportData[dataLen].DirectCC)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_Govt_L"           : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Govt         - activityReportData[dataLen].Govt)/100000 ? parseFloat(((monthlyPlanData[dataLen].Govt         - activityReportData[dataLen].Govt)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_Other_L"          : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].Other        - activityReportData[dataLen].Other)/100000 ? parseFloat(((monthlyPlanData[dataLen].Other        - activityReportData[dataLen].Other)/100000).toFixed(4)) : 0,
                            "variance_monthlyPlan_Total_L"          : activityReportData[dataLen] && monthlyPlanData[dataLen] && (monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].Total)/100000 ? parseFloat(((monthlyPlanData[dataLen].TotalBudget  - activityReportData[dataLen].Total)/100000).toFixed(4)) : 0,
                        });
                    }
                }
            }
            if(i >= data.length && returnData.length > 0){
                    returnData.push({
                        "sectorName"                            : "Total",
                        "activityName"                          : "",
                        "subactivityName"                       : "",
                        "name"                                  : "Total",
                        "unit"                                  : "",
                        
                        "annualPlan_Remark"                     : "",                      
                        "annualPlan_UnitCost"                   : " ",
                        "annualPlan_PhysicalUnit"               : " ",                  
                        // "annualPlan_UnitCost"                   : annualPlan_UnitCost ? annualPlan_UnitCost : 0,
                        // "annualPlan_PhysicalUnit"               : annualPlan_PhysicalUnit ? annualPlan_PhysicalUnit : 0,                        
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
                        "annualPlan_projectCategoryType"        : "-",
                        "annualPlan_projectName"                : "-",                  
                        "annualPlan_UnitCost_L"                 : " ",
                        "annualPlan_PhysicalUnit_L"             : " ",     
                        // "annualPlan_UnitCost_L"                 : annualPlan_UnitCost/100000 ? parseFloat((annualPlan_UnitCost/100000).toFixed(4)) : 0,
                        // "annualPlan_PhysicalUnit_L"             : annualPlan_PhysicalUnit/100000 ? parseFloat((annualPlan_PhysicalUnit/100000).toFixed(4)) : 0,
                        "annualPlan_TotalBudget_L"              : annualPlan_TotalBudget/100000 ? parseFloat((annualPlan_TotalBudget/100000).toFixed(4)) : 0,
                        "annualPlan_LHWRF_L"                    : annualPlan_LHWRF/100000 ? parseFloat((annualPlan_LHWRF/100000).toFixed(4)) : 0,
                        "annualPlan_NABARD_L"                   : annualPlan_NABARD/100000 ? parseFloat((annualPlan_NABARD/100000).toFixed(4)) : 0,
                        "annualPlan_Bank_Loan_L"                : annualPlan_Bank_Loan/100000 ? parseFloat((annualPlan_Bank_Loan/100000).toFixed(4)) : 0,
                        "annualPlan_Govt_L"                     : annualPlan_Govt/100000 ? parseFloat((annualPlan_Govt/100000).toFixed(4)) : 0,
                        "annualPlan_DirectCC_L"                 : annualPlan_DirectCC/100000 ? parseFloat((annualPlan_DirectCC/100000).toFixed(4)) : 0,
                        "annualPlan_IndirectCC_L"               : annualPlan_IndirectCC/100000 ? parseFloat((annualPlan_IndirectCC/100000).toFixed(4)) : 0,
                        "annualPlan_Other_L"                    : annualPlan_Other/100000 ? parseFloat((annualPlan_Other/100000).toFixed(4)) : 0, 

                        "monthlyPlan_PhysicalUnit"              : " ",
                        //  "monthlyPlan_PhysicalUnit"              : monthlyPlan_PhysicalUnit ? monthlyPlan_PhysicalUnit : 0,
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
                        "monthlyPlan_projectCategoryType"       : "-",
                        "monthlyPlan_projectName"               : "-",
                        "Per_Periodic"                          : " ",
                        "monthlyPlan_PhysicalUnit_L"            : " ",
                        // "monthlyPlan_PhysicalUnit_L"            : monthlyPlan_PhysicalUnit/100000 ? parseFloat((monthlyPlan_PhysicalUnit/100000).toFixed(2)) : 0,
                        "monthlyPlan_TotalBudget_L"             : monthlyPlan_TotalBudget/100000 ? parseFloat((monthlyPlan_TotalBudget/100000).toFixed(4)) : 0,
                        "monthlyPlan_LHWRF_L"                   : monthlyPlan_LHWRF/100000 ? parseFloat((monthlyPlan_LHWRF/100000).toFixed(4)) : 0,
                        "monthlyPlan_NABARD_L"                  : monthlyPlan_NABARD/100000 ? parseFloat((monthlyPlan_NABARD/100000).toFixed(4)) : 0,
                        "monthlyPlan_Bank_Loan_L"               : monthlyPlan_Bank_Loan/100000 ? parseFloat((monthlyPlan_Bank_Loan/100000).toFixed(4)) : 0,
                        "monthlyPlan_IndirectCC_L"              : monthlyPlan_IndirectCC/100000 ? parseFloat((monthlyPlan_IndirectCC/100000).toFixed(4)) : 0,
                        "monthlyPlan_DirectCC_L"                : monthlyPlan_DirectCC/100000 ? parseFloat((monthlyPlan_DirectCC/100000).toFixed(4)) : 0,
                        "monthlyPlan_Govt_L"                    : monthlyPlan_Govt/100000 ? parseFloat((monthlyPlan_Govt/100000).toFixed(4)) : 0,
                        "monthlyPlan_Other_L"                   : monthlyPlan_Other/100000 ? parseFloat((monthlyPlan_Other/100000).toFixed(4)) : 0,

                        "curr_monthlyPlan_PhysicalUnit"         : " ",
                        // "curr_monthlyPlan_PhysicalUnit"         : curr_monthlyPlan_PhysicalUnit ? curr_monthlyPlan_PhysicalUnit : 0,
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
                        "curr_monthlyPlan_PhysicalUnit_L"       : " ",
                        // "curr_monthlyPlan_PhysicalUnit_L"       : curr_monthlyPlan_PhysicalUnit/100000 ? parseFloat((curr_monthlyPlan_PhysicalUnit/100000).toFixed(2)) : 0,
                        "curr_monthlyPlan_TotalBudget_L"        : curr_monthlyPlan_TotalBudget/100000 ? parseFloat((curr_monthlyPlan_TotalBudget/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_LHWRF_L"              : curr_monthlyPlan_LHWRF/100000 ? parseFloat((curr_monthlyPlan_LHWRF/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_NABARD_L"             : curr_monthlyPlan_NABARD/100000 ? parseFloat((curr_monthlyPlan_NABARD/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_Bank_Loan_L"          : curr_monthlyPlan_Bank_Loan/100000 ? parseFloat((curr_monthlyPlan_Bank_Loan/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_IndirectCC_L"         : curr_monthlyPlan_IndirectCC/100000 ? parseFloat((curr_monthlyPlan_IndirectCC/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_DirectCC_L"           : curr_monthlyPlan_DirectCC/100000 ? parseFloat((curr_monthlyPlan_DirectCC/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_Govt_L"               : curr_monthlyPlan_Govt/100000 ? parseFloat((curr_monthlyPlan_Govt/100000).toFixed(4)) : 0,
                        "curr_monthlyPlan_Other_L"              : curr_monthlyPlan_Other/100000 ? parseFloat((curr_monthlyPlan_Other/100000).toFixed(4)) : 0,

                        "achievement_projectCategory"           : " ",
                        "achievement_Reach"                     : achievement_Reach ? parseInt(achievement_Reach) : 0,
                        "achievement_FamilyUpgradation"         : achievement_FamilyUpgradation ? parseInt(achievement_FamilyUpgradation) : 0,
                        "achievement_PhysicalUnit"              : " ",
                        "achievement_UnitCost"                  : " ",
                        // "achievement_UnitCost"                  : achievement_UnitCost ? parseFloat(achievement_UnitCost) : 0,
                        // "achievement_PhysicalUnit"              : achievement_PhysicalUnit ? parseFloat(achievement_PhysicalUnit) : 0,
                        "achievement_TotalBudget"               : achievement_TotalBudget ? parseFloat(achievement_TotalBudget) : 0,
                        "achievement_LHWRF"                     : achievement_LHWRF ? parseFloat(achievement_LHWRF) : 0,
                        "achievement_NABARD"                    : achievement_NABARD ? parseFloat(achievement_NABARD) : 0,
                        "achievement_Bank_Loan"                 : achievement_Bank_Loan ? parseFloat(achievement_Bank_Loan) : 0,
                        "achievement_DirectCC"                  : achievement_DirectCC ? parseFloat(achievement_DirectCC) : 0,
                        "achievement_IndirectCC"                : achievement_IndirectCC ? parseFloat(achievement_IndirectCC) : 0,
                        "achievement_Govt"                      : achievement_Govt ? parseFloat(achievement_Govt) : 0,
                        "achievement_Other"                     : achievement_Other ? parseFloat(achievement_Other) : 0,
                        "achievement_district"                  : "-",
                        "achievement_block"                     : "-",
                        "achievement_village"                   : "-",
                        "Per_Annual"                            : " ",
                        "achievement_Total"                     : achievement_Total ? parseFloat(achievement_Total.toFixed(4)) : 0,
                        "achievement_PhysicalUnit_L"            : " ",
                        "achievement_UnitCost_L"                : " ",
                        // "achievement_PhysicalUnit_L"            : achievement_PhysicalUnit/100000 ? parseFloat((achievement_PhysicalUnit/100000).toFixed(2)) : 0,
                        // "achievement_UnitCost_L"                : achievement_UnitCost/100000 ? parseFloat((achievement_UnitCost/100000).toFixed(4)) : 0,
                        "achievement_TotalBudget_L"             : achievement_TotalBudget/100000 ? parseFloat((achievement_TotalBudget/100000).toFixed(4)) : 0,
                        "achievement_LHWRF_L"                   : achievement_LHWRF/100000 ? parseFloat((achievement_LHWRF/100000).toFixed(4)) : 0,
                        "achievement_NABARD_L"                  : achievement_NABARD/100000 ? parseFloat((achievement_NABARD/100000).toFixed(4)) : 0,
                        "achievement_Bank_Loan_L"               : achievement_Bank_Loan/100000 ? parseFloat((achievement_Bank_Loan/100000).toFixed(4)) : 0,
                        "achievement_DirectCC_L"                : achievement_DirectCC/100000 ? parseFloat((achievement_DirectCC/100000).toFixed(4)) : 0,
                        "achievement_IndirectCC_L"              : achievement_IndirectCC/100000 ? parseFloat((achievement_IndirectCC/100000).toFixed(4)) : 0,
                        "achievement_Govt_L"                    : achievement_Govt/100000 ? parseFloat((achievement_Govt/100000).toFixed(4)) : 0,
                        "achievement_Other_L"                   : achievement_Other/100000 ? parseFloat((achievement_Other/100000).toFixed(4)) : 0,

                        "projectCategoryType"                   : "-",
                        "projectName"                           : "-",
                        "curr_achievement_Reach"                     : curr_achievement_Reach ? curr_achievement_Reach : 0,
                        "curr_achievement_FamilyUpgradation"         : curr_achievement_FamilyUpgradation ? curr_achievement_FamilyUpgradation : 0,
                        "curr_achievement_PhysicalUnit"              : " ",
                        "curr_achievement_UnitCost"                  : " ",
                        // "curr_achievement_PhysicalUnit"              : curr_achievement_PhysicalUnit ? curr_achievement_PhysicalUnit : 0,
                        // "curr_achievement_UnitCost"                  : curr_achievement_UnitCost ? curr_achievement_UnitCost : 0,
                        "curr_achievement_TotalBudget"               : curr_achievement_TotalBudget ? curr_achievement_TotalBudget : 0,
                        "curr_achievement_LHWRF"                     : curr_achievement_LHWRF ? curr_achievement_LHWRF : 0,
                        "curr_achievement_NABARD"                    : curr_achievement_NABARD ? curr_achievement_NABARD : 0,
                        "curr_achievement_Bank_Loan"                 : curr_achievement_Bank_Loan ? curr_achievement_Bank_Loan : 0,
                        "curr_achievement_DirectCC"                  : curr_achievement_DirectCC ? curr_achievement_DirectCC : 0,
                        "curr_achievement_IndirectCC"                : curr_achievement_IndirectCC ? curr_achievement_IndirectCC : 0,
                        "curr_achievement_Govt"                      : curr_achievement_Govt ? curr_achievement_Govt : 0,
                        "curr_achievement_Other"                     : curr_achievement_Other ? curr_achievement_Other : 0,
                        "curr_Per_Monthly"                            : " ",
                        "curr_achievement_Total"                     : curr_achievement_Total ? parseFloat(curr_achievement_Total.toFixed(4)) : 0,
                        "curr_achievement_PhysicalUnit_L"            : " ",
                        "curr_achievement_UnitCost_L"                : " ",
                        // "curr_achievement_PhysicalUnit_L"            : curr_achievement_PhysicalUnit/100000 ? parseFloat((curr_achievement_PhysicalUnit/100000).toFixed(2)) : 0,
                        // "curr_achievement_UnitCost_L"                : curr_achievement_UnitCost/100000 ? parseFloat((curr_achievement_UnitCost/100000).toFixed(4)) : 0,
                        "curr_achievement_TotalBudget_L"             : curr_achievement_TotalBudget/100000 ? parseFloat((curr_achievement_TotalBudget/100000).toFixed(4)) : 0,
                        "curr_achievement_LHWRF_L"                   : curr_achievement_LHWRF/100000 ? parseFloat((curr_achievement_LHWRF/100000).toFixed(4)) : 0,
                        "curr_achievement_NABARD_L"                  : curr_achievement_NABARD/100000 ? parseFloat((curr_achievement_NABARD/100000).toFixed(4)) : 0,
                        "curr_achievement_Bank_Loan_L"               : curr_achievement_Bank_Loan/100000 ? parseFloat((curr_achievement_Bank_Loan/100000).toFixed(4)) : 0,
                        "curr_achievement_DirectCC_L"                : curr_achievement_DirectCC/100000 ? parseFloat((curr_achievement_DirectCC/100000).toFixed(4)) : 0,
                        "curr_achievement_IndirectCC_L"              : curr_achievement_IndirectCC/100000 ? parseFloat((curr_achievement_IndirectCC/100000).toFixed(4)) : 0,
                        "curr_achievement_Govt_L"                    : curr_achievement_Govt/100000 ? parseFloat((curr_achievement_Govt/100000).toFixed(4)) : 0,
                        "curr_achievement_Other_L"                   : curr_achievement_Other/100000 ? parseFloat((curr_achievement_Other/100000).toFixed(4)) : 0,

                        "variance_monthlyPlan_PhysicalUnit"     : monthlyPlan_PhysicalUnit - achievement_PhysicalUnit ? parseFloat((monthlyPlan_PhysicalUnit - achievement_PhysicalUnit).toFixed(2)) : 0,
                        "variance_monthlyPlan_UnitCost"         : " ",
                        // "variance_monthlyPlan_UnitCost"         : monthlyPlan_UnitCost     - achievement_UnitCost ? parseFloat((monthlyPlan_UnitCost     - achievement_UnitCost).toFixed(4)) : 0,
                        "variance_monthlyPlan_TotalBudget"      : monthlyPlan_TotalBudget  - achievement_TotalBudget ? parseFloat((monthlyPlan_TotalBudget  - achievement_TotalBudget).toFixed(4)) : 0,
                        "variance_monthlyPlan_LHWRF"            : monthlyPlan_LHWRF        - achievement_LHWRF ? parseFloat((monthlyPlan_LHWRF        - achievement_LHWRF).toFixed(4)) : 0,
                        "variance_monthlyPlan_NABARD"           : monthlyPlan_NABARD       - achievement_NABARD ? parseFloat((monthlyPlan_NABARD       - achievement_NABARD).toFixed(4)) : 0,
                        "variance_monthlyPlan_Bank_Loan"        : monthlyPlan_Bank_Loan    - achievement_Bank_Loan ? parseFloat((monthlyPlan_Bank_Loan    - achievement_Bank_Loan).toFixed(4)) : 0,
                        "variance_monthlyPlan_IndirectCC"       : monthlyPlan_IndirectCC   - achievement_IndirectCC ? parseFloat((monthlyPlan_IndirectCC   - achievement_IndirectCC).toFixed(4)) : 0,
                        "variance_monthlyPlan_DirectCC"         : monthlyPlan_DirectCC     - achievement_DirectCC ? parseFloat((monthlyPlan_DirectCC     - achievement_DirectCC).toFixed(4)) : 0,
                        "variance_monthlyPlan_Govt"             : monthlyPlan_Govt         - achievement_Govt ? parseFloat((monthlyPlan_Govt         - achievement_Govt).toFixed(4)) : 0,
                        "variance_monthlyPlan_Other"            : monthlyPlan_Other        - achievement_Other ? parseFloat((monthlyPlan_Other        - achievement_Other).toFixed(4)) : 0,
                        "variance_monthlyPlan_Reach"            : monthlyPlan_Reach        - achievement_Reach ? (monthlyPlan_Reach        - achievement_Reach) : 0,
                        "variance_monthlyPlan_FamilyUpgradation": monthlyPlan_FamilyUpgradation - achievement_FamilyUpgradation ? (monthlyPlan_FamilyUpgradation - achievement_FamilyUpgradation) : 0,

                        // "variance_monthlyPlan_PhysicalUnit"     : (monthlyPlan_PhysicalUnit - achievement_PhysicalUnit)/100000 ? (monthlyPlan_PhysicalUnit - achievement_PhysicalUnit)/100000 : 0,
                        "variance_monthlyPlan_UnitCost_L"       : " ",
                        // "variance_monthlyPlan_UnitCost_L"       : parseFloat(((monthlyPlan_UnitCost     - achievement_UnitCost)/100000).toFixed(4)),
                        "variance_monthlyPlan_TotalBudget_L"    : parseFloat(((monthlyPlan_TotalBudget  - achievement_TotalBudget)/100000).toFixed(4)),
                        "variance_monthlyPlan_LHWRF_L"          : parseFloat(((monthlyPlan_LHWRF        - achievement_LHWRF)/100000).toFixed(4)),
                        "variance_monthlyPlan_NABARD_L"         : parseFloat(((monthlyPlan_NABARD       - achievement_NABARD)/100000).toFixed(4)),
                        "variance_monthlyPlan_Bank_Loan_L"      : parseFloat(((monthlyPlan_Bank_Loan    - achievement_Bank_Loan)/100000).toFixed(4)),
                        "variance_monthlyPlan_IndirectCC_L"     : parseFloat(((monthlyPlan_IndirectCC   - achievement_IndirectCC)/100000).toFixed(4)),
                        "variance_monthlyPlan_DirectCC_L"       : parseFloat(((monthlyPlan_DirectCC     - achievement_DirectCC)/100000).toFixed(4)),
                        "variance_monthlyPlan_Govt_L"           : parseFloat(((monthlyPlan_Govt         - achievement_Govt)/100000).toFixed(4)),
                        "variance_monthlyPlan_Other_L"          : parseFloat(((monthlyPlan_Other        - achievement_Other)/100000).toFixed(4)),
                    },
                    {
                        "sectorName"                            : "Total %",
                        "activityName"                          : "",
                        "subactivityName"                       : "",
                        "name"                                  : "Total %",
                        "unit"                                  : "",
                        
                        "annualPlan_Remark"                     : "",                    
                        "annualPlan_UnitCost"                   : " ",
                        "annualPlan_PhysicalUnit"               : " ",                        
                        "annualPlan_TotalBudget"                : "100%",
                        "annualPlan_Reach"                      : " ",
                        "annualPlan_FamilyUpgradation"          : " ",
                        "annualPlan_LHWRF"                      : annualPlan_TotalBudget > 0 ? (((annualPlan_LHWRF / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_NABARD"                     : annualPlan_TotalBudget > 0 ? (((annualPlan_NABARD / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_Bank_Loan"                  : annualPlan_TotalBudget > 0 ? (((annualPlan_Bank_Loan / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_Govt"                       : annualPlan_TotalBudget > 0 ? (((annualPlan_Govt / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_DirectCC"                   : annualPlan_TotalBudget > 0 ? (((annualPlan_DirectCC / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_IndirectCC"                 : annualPlan_TotalBudget > 0 ? (((annualPlan_IndirectCC / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_Other"                      : annualPlan_TotalBudget > 0 ? (((annualPlan_Other / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_projectCategoryType"       : "-",
                        "annualPlan_projectName"               : "-",

                        "annualPlan_UnitCost_L"                 : " ",
                        "annualPlan_PhysicalUnit_L"             : " ",
                        "annualPlan_TotalBudget_L"              : "100%",
                        "annualPlan_LHWRF_L"                      : annualPlan_TotalBudget > 0 ? (((annualPlan_LHWRF / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_NABARD_L"                     : annualPlan_TotalBudget > 0 ? (((annualPlan_NABARD / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_Bank_Loan_L"                  : annualPlan_TotalBudget > 0 ? (((annualPlan_Bank_Loan / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_Govt_L"                       : annualPlan_TotalBudget > 0 ? (((annualPlan_Govt / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_DirectCC_L"                   : annualPlan_TotalBudget > 0 ? (((annualPlan_DirectCC / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_IndirectCC_L"                 : annualPlan_TotalBudget > 0 ? (((annualPlan_IndirectCC / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "annualPlan_Other_L"                      : annualPlan_TotalBudget > 0 ? (((annualPlan_Other / annualPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,

                        "monthlyPlan_PhysicalUnit"              : "",
                        "monthlyPlan_TotalBudget"               : "100%",

                        "monthlyPlan_LHWRF"                     : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_LHWRF / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_NABARD"                    : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_NABARD / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Bank_Loan"                 : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Bank_Loan / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_IndirectCC"                : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_IndirectCC / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_DirectCC"                  : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_DirectCC / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Govt"                      : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Govt / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Other"                     : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Other / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Reach"                     : " ",
                        "monthlyPlan_FamilyUpgradation"         : " ",
                        "monthlyPlan_projectCategoryType"       : "-",
                        "monthlyPlan_projectName"               : "-",
                        "Per_Periodic"                          : "-",
                        "monthlyPlan_PhysicalUnit_L"            : " ",
                        "monthlyPlan_TotalBudget_L"             : "100%",

                        "monthlyPlan_LHWRF_L"                   : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_LHWRF / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_NABARD_L"                  : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_NABARD / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Bank_Loan_L"               : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Bank_Loan / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_IndirectCC_L"              : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_IndirectCC / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_DirectCC_L"                : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_DirectCC / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Govt_L"                    : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Govt / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "monthlyPlan_Other_L"                   : monthlyPlan_TotalBudget > 0 ? (((monthlyPlan_Other / monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,

                        "curr_monthlyPlan_PhysicalUnit"              : "",
                        "curr_monthlyPlan_TotalBudget"               : "100%",
                        "curr_monthlyPlan_LHWRF"                     : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_LHWRF / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_NABARD"                    : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_NABARD / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Bank_Loan"                 : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Bank_Loan / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_IndirectCC"                : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_IndirectCC / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_DirectCC"                  : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_DirectCC / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Govt"                      : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Govt / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Other"                     : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Other / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Reach"                     : " ",
                        "curr_monthlyPlan_FamilyUpgradation"         : " ",
                        "curr_Per_Periodic"                          : " ",
                        "curr_monthlyPlan_PhysicalUnit_L"            : " ",
                        "curr_monthlyPlan_TotalBudget_L"             : "100%",

                        "curr_monthlyPlan_LHWRF_L"                   : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_LHWRF / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_NABARD_L"                  : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_NABARD / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Bank_Loan_L"               : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Bank_Loan / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_IndirectCC_L"              : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_IndirectCC / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_DirectCC_L"                : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_DirectCC / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Govt_L"                    : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Govt / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                        "curr_monthlyPlan_Other_L"                   : curr_monthlyPlan_TotalBudget > 0 ? (((curr_monthlyPlan_Other / curr_monthlyPlan_TotalBudget) * 100).toFixed(2)) + "%" : 0,
                       
                        "achievement_projectCategory"           : "",
                        "achievement_Reach"                     : " ", 
                        "achievement_FamilyUpgradation"         : " ",
                        // "achievement_Reach"                     : annualPlan_Reach > 0 ? (((achievement_Reach / annualPlan_Reach) * 100).toFixed(2)) + "%" : "-", 
                        // "achievement_FamilyUpgradation"         : annualPlan_FamilyUpgradation > 0 ? (((achievement_FamilyUpgradation / annualPlan_FamilyUpgradation ) * 100).toFixed(2)) + "%" : "-",
                        "achievement_PhysicalUnit"              : " ",
                        "achievement_UnitCost"                  : " ",
                        // "achievement_TotalBudget"               : achievement_TotalBudget ? achievement_TotalBudget + "%": 0,
                        "achievement_TotalBudget"               : "100%",
                        "achievement_LHWRF"                     : achievement_TotalBudget > 0 ? (((achievement_LHWRF / achievement_TotalBudget) * 100).toFixed(2)) + "%" : "-",
                        "achievement_NABARD"                    : achievement_TotalBudget > 0 ? (((achievement_NABARD / achievement_TotalBudget) * 100).toFixed(2)) + "%" : "-",
                        "achievement_Bank_Loan"                 : achievement_TotalBudget > 0 ? (((achievement_Bank_Loan / achievement_TotalBudget) * 100).toFixed(2)) + "%" : "-",
                        "achievement_DirectCC"                  : achievement_TotalBudget > 0 ? (((achievement_DirectCC / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_IndirectCC"                : achievement_TotalBudget > 0 ? (((achievement_IndirectCC / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-", 
                        "achievement_Govt"                      : achievement_TotalBudget > 0 ? (((achievement_Govt / achievement_TotalBudget) * 100).toFixed(2)) + "%" : "-", 
                        "achievement_Other"                     : achievement_TotalBudget > 0 ? (((achievement_Other / achievement_TotalBudget) * 100).toFixed(2)) + "%" : "-",
                        "achievement_Total"                     : achievement_TotalBudget > 0 ? (((achievement_Total / achievement_TotalBudget) * 100).toFixed(2)) + "%" : "-",
                        "Per_Annual"                            : "-",
                        "achievement_district"                  : "-",
                        "achievement_block"                     : " ",
                        "achievement_village"                   : " ",
                        "achievement_PhysicalUnit_L"            : "-",
                        "achievement_UnitCost_L"                : "-",
                        "achievement_TotalBudget_L"             : "100%",
                        "achievement_LHWRF_L"                   : achievement_TotalBudget > 0 ? (((achievement_LHWRF / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_NABARD_L"                  : achievement_TotalBudget > 0 ? (((achievement_NABARD / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_Bank_Loan_L"               : achievement_TotalBudget > 0 ? (((achievement_Bank_Loan / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_DirectCC_L"                : achievement_TotalBudget > 0 ? (((achievement_DirectCC / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_IndirectCC_L"              : achievement_TotalBudget > 0 ? (((achievement_IndirectCC / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_Govt_L"                    : achievement_TotalBudget > 0 ? (((achievement_Govt / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_Other_L"                   : achievement_TotalBudget > 0 ? (((achievement_Other / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "achievement_Total_L"                   : achievement_TotalBudget > 0 ? (((achievement_Total / achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "projectCategoryType"                   : "-",
                        "projectName"                           : "-",
                        "curr_achievement_Reach"                     : annualPlan_Reach > 0 ? (((curr_achievement_Reach / annualPlan_Reach) * 100).toFixed(2)) + "%": "-", 
                        "curr_achievement_FamilyUpgradation"         : annualPlan_FamilyUpgradation > 0 ? (((curr_achievement_FamilyUpgradation / annualPlan_FamilyUpgradation ) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_PhysicalUnit"              : " ",
                        "curr_achievement_UnitCost"                  : " ",
                        "curr_achievement_TotalBudget"               : curr_achievement_TotalBudget ? curr_achievement_TotalBudget + "%": 0,
                        "curr_achievement_LHWRF"                     : curr_achievement_TotalBudget > 0 ? (((curr_achievement_LHWRF / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_NABARD"                    : curr_achievement_TotalBudget > 0 ? (((curr_achievement_NABARD / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_Bank_Loan"                 : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Bank_Loan / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_DirectCC"                  : curr_achievement_TotalBudget > 0 ? (((curr_achievement_DirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_IndirectCC"                : curr_achievement_TotalBudget > 0 ? (((curr_achievement_IndirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-", 
                        "curr_achievement_Govt"                      : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Govt / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-", 
                        "curr_achievement_Other"                     : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Other / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_Total"                     : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Total / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_Per_Annual"                            : " ",
                        "curr_achievement_PhysicalUnit_L"            : " ",
                        "curr_achievement_UnitCost_L"                : " ",
                        "curr_achievement_TotalBudget_L"             : "100%",
                        "curr_achievement_LHWRF_L"                   : curr_achievement_TotalBudget > 0 ? (((curr_achievement_LHWRF / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_NABARD_L"                  : curr_achievement_TotalBudget > 0 ? (((curr_achievement_NABARD / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_Bank_Loan_L"               : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Bank_Loan / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_DirectCC_L"                : curr_achievement_TotalBudget > 0 ? (((curr_achievement_DirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_IndirectCC_L"              : curr_achievement_TotalBudget > 0 ? (((curr_achievement_IndirectCC / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_Govt_L"                    : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Govt / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_Other_L"                   : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Other / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",
                        "curr_achievement_Total_L"                   : curr_achievement_TotalBudget > 0 ? (((curr_achievement_Total / curr_achievement_TotalBudget) * 100).toFixed(2)) + "%": "-",

                        "variance_monthlyPlan_PhysicalUnit"     : " ",
                        "variance_monthlyPlan_UnitCost"         : " ",
                        "variance_monthlyPlan_TotalBudget"      : "100%",
                        "variance_monthlyPlan_LHWRF"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_LHWRF        - achievement_LHWRF) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_NABARD"           : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_NABARD       - achievement_NABARD) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Bank_Loan"        : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Bank_Loan    - achievement_Bank_Loan) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_IndirectCC"       : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_IndirectCC   - achievement_IndirectCC) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_DirectCC"         : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_DirectCC     - achievement_DirectCC) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Govt"             : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Govt         - achievement_Govt) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Other"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Other        - achievement_Other) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Total"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_TotalBudget  - achievement_Total) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Reach"            : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Reach        - achievement_Reach) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_FamilyUpgradation": (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_FamilyUpgradation - achievement_FamilyUpgradation) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",

                        "variance_monthlyPlan_PhysicalUnit"     : " ",
                        "variance_monthlyPlan_UnitCost"         : " ",
                        "variance_monthlyPlan_TotalBudget_L"    : "100%",

                        "variance_monthlyPlan_LHWRF_L"          : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_LHWRF        - achievement_LHWRF) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_NABARD_L"         : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_NABARD       - achievement_NABARD) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Bank_Loan_L"      : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Bank_Loan    - achievement_Bank_Loan) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_IndirectCC_L"     : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_IndirectCC   - achievement_IndirectCC) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_DirectCC_L"       : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_DirectCC     - achievement_DirectCC) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Govt_L"           : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Govt         - achievement_Govt) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Other_L"          : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_Other        - achievement_Other) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                        "variance_monthlyPlan_Total_L"          : (monthlyPlan_TotalBudget  - achievement_TotalBudget) > 0 ? ((((monthlyPlan_TotalBudget  - achievement_Total) / (monthlyPlan_TotalBudget  - achievement_TotalBudget) ) * 100).toFixed(2)) + "%": "-",
                    

                    });
            }
            resolve(returnData);
        }
    });
};
function derive_year_month(dateData){
    var startYear   = moment(dateData.startDate).format("YYYY");
    var endYear     = moment(dateData.endDate).format("YYYY");
    var startMonth  = moment(dateData.startDate).format("MM");
    var endMonth    = moment(dateData.endDate).format("MM");
    var monthList   = [];
    var yearList    = [];
    var tempDate    = dateData.startDate;
    if(startYear == endYear){
        if(startMonth >= 4 && endMonth <=12){
            var year = 'FY ' + (startYear) + ' - ' + (parseInt(startYear)+1);
        }else{
            var year = 'FY ' + (startYear-1) + ' - ' + (startYear);
        }
        for(m = startMonth; m <= endMonth; m++ ){
            // console.log('moment(0+m).format("MMMM")',moment('0'+m).format("MMMM"));
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
            // console.log('moment(m).format("MMMM")',moment(m).format("MMMM"));
        }
        for(let m=1; m<=m2;m++){
            monthList.push(moment('0'+m).format("MMMM"));   
            // console.log('moment(0+m).format("MMMM")',moment('0'+m).format("MMMM")); 
        }
    }
    // console.log("year ",year);
    // console.log("yearList ",yearList);
    // console.log("monthList ",monthList);
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
                                {
                                    $match : searchQuery
                                },
                                {
                                    $group : {
                                        "_id"                   : "$projectCategoryType",
                                        "PhysicalUnit"          : { "$sum" : "$physicalUnit" },
                                        "TotalBudget"           : { "$sum" : "$totalBudget" },
                                        "Reach"                 : { "$sum" : "$noOfBeneficiaries" },
                                        "FamilyUpgradation"     : { "$sum" : "$noOfFamilies" },
                                        "LHWRF"                 : { "$sum" : "$LHWRF" },
                                        "NABARD"                : { "$sum" : "$NABARD" },
                                        "Bank_Loan"             : { "$sum" : "$bankLoan" },
                                        "Govt"                  : { "$sum" : "$govtscheme" },
                                        "DirectCC"              : { "$sum" : "$directCC" },
                                        "IndirectCC"            : { "$sum" : "$indirectCC" },
                                        "Other"                 : { "$sum" : "$other" },
                                        "Remark"                : { "$sum" : "$remark" },
                                        "UnitCost"              : { "$sum" : "$unitCost" },            
                                        "projectCategoryType"   : { "$first" : "$projectCategoryType"},
                                        "projectName"           : { "$first" : "$projectName"}
                                    }
                                },
                                {
                                    $project: {
                                        "projectCategoryType"    : "$_id", 
                                        "projectName"            : 1,
                                        "Reach"                  : 1,
                                        "FamilyUpgradation"      : 1,
                                        "PhysicalUnit"           : 1,
                                        "TotalBudget"            : 1,
                                        "LHWRF"                  : 1,
                                        "NABARD"                 : 1,
                                        "Bank_Loan"              : 1,
                                        "DirectCC"               : 1,
                                        "IndirectCC"             : 1,
                                        "Govt"                   : 1,
                                        "Other"                  : 1,
                                        "UnitCost"               : 1,
                                    }
                                },
                                {
                                    $sort : { "projectCategoryType" : 1}
                                }
                    ])
                    .exec()
                    .then(data=>{
                        if(data && data.length > 0){
                            resolve(data);
                        }else{
                            resolve([{
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
                                    
                                    "projectCategoryType"    : "-", 
                                    "projectName"                 : "-", 
                                }]);
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    });
};
function monthlyPlan(searchQuery){
    // console.log('searchQuery****************',searchQuery);
    return new Promise(function(resolve,reject){
        MonthlyPlan.aggregate([
                                {
                                    $match : searchQuery
                                },
                                {
                                    $group : 
                                            {
                                                "_id"               : "$projectCategoryType",
                                                "PhysicalUnit"      : { "$sum" : "$physicalUnit" },
                                                // "UnitCost"          : { "$sum" : "$unitCost" },
                                                "UnitCost"          : { "$first" : "$unitCost" },
                                                "TotalBudget"       : { "$sum" : "$totalBudget" },
                                                "LHWRF"             : { "$sum" : "$LHWRF" },
                                                "NABARD"            : { "$sum" : "$NABARD" },
                                                "Bank_Loan"         : { "$sum" : "$bankLoan" },
                                                "IndirectCC"        : { "$sum" : "$indirectCC"},
                                                "DirectCC"          : { "$sum" : "$directCC"},
                                                "Govt"              : { "$sum" : "$govtscheme"},
                                                "Other"             : { "$sum" : "$other"},
                                                "Reach"             : { "$sum" : "$noOfBeneficiaries"},
                                                "FamilyUpgradation"     : { "$sum" : "$noOfFamilies"},            
                                                "projectName"           : { "$first" : "$projectName"}
                                            }
                                },
                                {
                                    $project: {
                                        "projectCategoryType"    : "$_id", 
                                        "projectName"            : 1,
                                        "Reach"                  : 1,
                                        "FamilyUpgradation"      : 1,
                                        "PhysicalUnit"           : 1,
                                        "TotalBudget"            : 1,
                                        "LHWRF"                  : 1,
                                        "NABARD"                 : 1,
                                        "Bank_Loan"              : 1,
                                        "DirectCC"               : 1,
                                        "IndirectCC"             : 1,
                                        "Govt"                   : 1,
                                        "Other"                  : 1,
                                        "UnitCost"               : 1,
                                    }
                                },
                                {
                                    $sort : { "projectCategoryType" : 1}
                                }
                    ])
                    .exec()
                    .then(data=>{
                        // console.log('monthlyPlandata',data);
                        if(data && data.length > 0){
                            resolve(data);
                        }else{
                            resolve([{
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
                                    
                                    "projectCategoryType"    : "-", 
                                    "projectName"            : "-", 
                                }]);
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};
/*function getBeneficiariesCount(searchQuery,uidStatus){
    var query = "1";
    if(uidStatus === 'withUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else if(uidStatus === 'withoutUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
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
                                            {
                                                $match : searchQuery
                                            },
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
                                                                "listofBeneficiaries.familyID"         : "$listofBeneficiaries1.familyID",
                                                                "listofBeneficiaries.uidNumber"        : "$listofBeneficiaries1.uidNumber",
                                                                "listofBeneficiaries.isUpgraded"       : 1,
                                                            }
                                            },
                                            // query,
                                            // {
                                            //     $group : {
                                            //                 "_id"                   : null,
                                            //                 "listofBeneficiaries"   : { $push:  "$listofBeneficiaries" },
                                            //                 "upGrade"               : { "$push" : { "$cond" : [ {"$eq" : ["$listofBeneficiaries.isUpgraded" , "Yes"] },"$listofBeneficiaries.familyID",null ] } },
                                            //             }
                                            // },
                                            // {
                                            //     $project : {
                                            //         "listofBeneficiaries"   : { "$setUnion" : [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                            //         "upGrade"               : 1,
                                            //         "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                            //     }
                                            // },
                                            // // //get count of FamilyUpgradation
                                            // {
                                            //     $project : {
                                            //         "listofBeneficiaries"   : 1,
                                            //         // "upGrade"               : { $filter : { input : "$listofBeneficiaries", as : "beneficiaries", cond : { $ne : ["$$beneficiaries" , null] } } },
                                            //         // "upGrade"               : { "$setDifference" :[ "$upGrade" , [null] ] },
                                            //         // "upGrade"               : { "$setUnion" : [ "$upGrade.family_ID", "$upGrade.family_ID" ] },
                                            //         "upGrade"               : { "$setUnion" : [ "$upGrade", "$upGrade" ] },
                                            //         "Reach"                 : 1,
                                            //     }
                                            // },
                                            // {
                                            //     $project : {
                                            //         "Reach"                 : 1,
                                            //         "upGrade"               : 1,
                                            //         "FamilyUpgradation"     : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                            //         "FamilyUpgradation1"    : { $cond: { if: { $isArray: "$upGrade" }, then: { $size: "$upGrade" }, else: 0} },
                                            //     }
                                            // },
                                        ]
                            )
                            .exec()
                            .then(data=>{
                                console.log('dataaaaaaaaa',data);
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
    }
};*/

function getBeneficiariesCount(searchQuery,uidStatus){
    var query = "1";
    if(uidStatus === 'withUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else if(uidStatus === 'withoutUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
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
                                            {
                                                $match : searchQuery
                                            },
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
                                                                "listofBeneficiaries.familyID"         : "$listofBeneficiaries1.familyID",
                                                                "listofBeneficiaries.uidNumber"        : "$listofBeneficiaries1.uidNumber",
                                                                "listofBeneficiaries.isUpgraded"       : 1,
                                                            }
                                            },
                                            query,
                                            {
                                                $group : {
                                                            "_id"                   : null,
                                                            "listofBeneficiaries"   : { $push:  "$listofBeneficiaries" },
                                                            "upGrade"               : { "$push" : { "$cond" : [ {"$eq" : ["$listofBeneficiaries.isUpgraded" , "Yes"] },"$listofBeneficiaries.familyID",null ] } },
                                                        }
                                            },
                                            {
                                                $project : {
                                                    "listofBeneficiaries"   : { "$setUnion" : [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                                    "upGrade"               : 1,
                                                    "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                }
                                            },
                                            // //get count of FamilyUpgradation
                                            {
                                                $project : {
                                                    "listofBeneficiaries"   : 1,
                                                    "upGrade"               : { "$setUnion" : [ "$upGrade", "$upGrade" ] },
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
                                // console.log('data+++++++++',data);
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
    }
};

function getBeneficiariesCountold(searchQuery,uidStatus){
    var query = "1";
    var unwindquery = "1";
    if(uidStatus === 'withUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else if(uidStatus === 'withoutUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
                            }
                };
    }else{
        query = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    if("listofBeneficiaries"==[]){
        unwindquery = ""
    }else{
        unwindquery ={
                        $unwind : "$listofBeneficiaries1"
                    }
    }
    if(uidStatus != "1"){
        return new Promise(function(resolve,reject){
            ActivityReport.aggregate(
                                        [
                                            {
                                                $match : searchQuery
                                            }, 
                                            {
                                                $project : {
                                                                "noOfBeneficiaries"                    : 1,
                                                                "typeofactivity"                       : 1,
                                                                "listofBeneficiaries"                  : 1,
                                                            }
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
                                                $project : {
                                                                "listofBeneficiaries.beneficiary_ID"   : 1,
                                                                "listofBeneficiaries.family_ID"        : 1,
                                                                "listofBeneficiaries.familyID"         : "$listofBeneficiaries1.familyID",
                                                                "listofBeneficiaries.uidNumber"        : "$listofBeneficiaries1.uidNumber",
                                                                "listofBeneficiaries.isUpgraded"       : 1,
                                                                "noOfBeneficiaries"                    : 1,
                                                                "typeofactivity"                       : 1,
                                                            }
                                            },
                                            query,
                                            {
                                                $group : {
                                                            "_id"                   : null,
                                                            "listofBeneficiaries"   : { $push:  "$listofBeneficiaries" },
                                                            "upGrade"               : { "$push" : { "$cond" : [ {"$eq" : ["$listofBeneficiaries.isUpgraded" , "Yes"] },"$listofBeneficiaries.familyID",null ] } },
                                                            "noOfBeneficiaries"     : {"$sum" : "$noOfBeneficiaries"},
                                                            "typeofactivity"        : {"$first":"$typeofactivity"},
                                                        }
                                            },
                                            // {
                                            //     $project : {
                                            //         "listofBeneficiaries"   : { "$setUnion" : [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                            //         "upGrade"               : 1,
                                            //         "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                            //         "noOfBeneficiaries"     : 1,
                                            //         "typeofactivity"        : 1,
                                            //     }
                                            // },
                                            //get count of FamilyUpgradation
                                            // {
                                            //     $project : {
                                            //         "listofBeneficiaries"   : 1,
                                            //         // "upGrade"               : { $filter : { input : "$listofBeneficiaries", as : "beneficiaries", cond : { $ne : ["$$beneficiaries" , null] } } },
                                            //         // "upGrade"               : { "$setDifference" :[ "$upGrade" , [null] ] },
                                            //         // "upGrade"               : { "$setUnion" : [ "$upGrade.family_ID", "$upGrade.family_ID" ] },
                                            //         "upGrade"               : { "$setUnion" : [ "$upGrade", "$upGrade" ] },
                                            //         "Reach"                 : 1,
                                            //         "noOfBeneficiaries"     : 1,
                                            //         "typeofactivity"        : 1,
                                            //     }
                                            // },
                                            // {
                                            //     $project : {
                                            //         "Reach"                 : 1,
                                            //         "upGrade"               : 1,
                                            //         "FamilyUpgradation"     : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                            //         "FamilyUpgradation1"    : { $cond: { if: { $isArray: "$upGrade" }, then: { $size: "$upGrade" }, else: 0} },
                                            //         "noOfBeneficiaries"     : 1,
                                            //         "typeofactivity"        : 1,
                                            //     }
                                            // },
                                        ]
                            )
                            .exec()
                            .then(data=>{
                                        // console.log('datanew===',data);
                                for(k = 0 ; k < data.length; k++){
                                    // if(data[k].typeofactivity== 'Type B Activity'){
                                    //     console.log('data------===',data[k]);
                                    // }
                                }
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
    }
};
function activityReport(searchQuery,uidStatus){
    return new Promise(function(resolve,reject){
        ActivityReport.aggregate( 
                                    [
                                        {
                                            $match : searchQuery
                                        },
                                        {
                                            $project : {
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
                                                "UnitCost"              : "$unitCost",
                                                "projectCategoryType"   : "$projectCategoryType",
                                                "projectName"           : "$projectName",
                                                "district"              : "$district",
                                                "block"                 : "$block",
                                                "village"               : "$village",
                                                "unit"                  : "$unit"
                                            }
                                        },
                                        {
                                            $group : {
                                                "_id"                   : "$projectCategoryType",
                                                "PhysicalUnit"          : { "$sum"   : "$PhysicalUnit" },
                                                "TotalBudget"           : { "$sum"   : "$TotalBudget" },
                                                "LHWRF"                 : { "$sum"   : "$LHWRF" },
                                                "NABARD"                : { "$sum"   : "$NABARD" },
                                                "Bank_Loan"             : { "$sum"   : "$Bank_Loan" },
                                                "DirectCC"              : { "$sum"   : "$DirectCC" },
                                                "IndirectCC"            : { "$sum"   : "$IndirectCC" },
                                                "Govt"                  : { "$sum"   : "$Govt" },
                                                "Other"                 : { "$sum"   : "$Other" },
                                                "Total"                 : { "$sum"   : "$Total"},
                                                // "UnitCost"              : { "$sum"   : "$UnitCost"},
                                                "UnitCost"              : { "$first"   : "$UnitCost"},
                                                "projectName"           : { "$first" : "$projectName"},
                                                "district"              : { "$first" : "$district"},
                                                "block"                 : { "$first" : "$block"},
                                                "village"               : { "$first" : "$village"},
                                                "unit"               : { "$first" : "$unit"},
                                            }
                                        },
                                        {
                                            $project: {
                                                "projectCategoryType"    : "$_id", 
                                                "projectName"            : 1,
                                                "Reach"                  : 1,
                                                "FamilyUpgradation"      : 1,
                                                "PhysicalUnit"           : 1,
                                                "TotalBudget"            : 1,
                                                "LHWRF"                  : 1,
                                                "NABARD"                 : 1,
                                                "Bank_Loan"              : 1,
                                                "DirectCC"               : 1,
                                                "IndirectCC"             : 1,
                                                "Govt"                   : 1,
                                                "Other"                  : 1,
                                                "UnitCost"               : 1,
                                                "PhysicalUnit"           : 1,
                                                "TotalExp"               : 1, 
                                                "Remark"                 : 1 ,
                                                // "UnitCost"               : 1,
                                                "projectName"            : 1,
                                                "district"               : 1,
                                                "block"                  : 1,
                                                "village"                : 1,
                                                "unit"                   : 1,
                                                "Total"                  : 1,
                                            }
                                        },
                                        {
                                            $sort : { "projectCategoryType" : 1}
                                        }
                                    ]
                        )
                        .exec()
                        .then(data=>{   
                            getAsyncData();
                            async function  getAsyncData(){
                                var returnData = [];
                                var k = 0;
                                for(k = 0 ; k < data.length; k++){
                                    // console.log('activityReportdata[k].====',data[k]);
                                    // console.log('searchQuery',searchQuery);
                                    var Query = searchQuery;
                                    Query["$and"].push({"projectCategoryType"   : data[k].projectCategoryType});
                                    // console.log('Query',Query);
                                    var Reach_FamilyUpgradation = await getBeneficiariesCount(Query,uidStatus);
                                    // var Reach_FamilyUpgradation1 = await getBeneficiariesCountold(Query,uidStatus);
                                    returnData.push({
                                                "Reach"                  : Reach_FamilyUpgradation.Reach ? Reach_FamilyUpgradation.Reach : parseInt(0),
                                                "FamilyUpgradation"      : Reach_FamilyUpgradation.FamilyUpgradation ? Reach_FamilyUpgradation.FamilyUpgradation : parseInt(0),
                                                // "FamilyUpgradation"     : data[0].FamilyUpgradation1   ? data[0].FamilyUpgradation1     : 0,
                                                "PhysicalUnit"           : data[k].PhysicalUnit         ? data[k].PhysicalUnit          : 0,
                                                "TotalBudget"            : data[k].TotalBudget          ? data[k].TotalBudget           : 0,
                                                "LHWRF"                  : data[k].LHWRF                ? data[k].LHWRF                 : 0,
                                                "NABARD"                 : data[k].NABARD               ? data[k].NABARD                : 0,
                                                "Bank_Loan"              : data[k].Bank_Loan            ? data[k].Bank_Loan             : 0,
                                                "DirectCC"               : data[k].DirectCC             ? data[k].DirectCC              : 0,
                                                "IndirectCC"             : data[k].IndirectCC           ? data[k].IndirectCC            : 0,
                                                "Govt"                   : data[k].Govt                 ? data[k].Govt                  : 0,
                                                "Other"                  : data[k].Other                ? data[k].Other                 : 0,
                                                "UnitCost"               : data[k].UnitCost             ? data[k].UnitCost              : 0,
                                                "Total"                  : data[k].Total                ? data[k].Total                 : 0, 
                                                "projectCategoryType"    : data[k].projectCategoryType,  
                                                "projectName"            : data[k].projectName,  
                                                "upGrade"                : data[k].upGrade,
                                                "district"               : data[k].district,
                                                "block"                  : data[k].block,
                                                "village"                : data[k].village,
                                                "unit"                   : data[k].unit
                                            });
                                }
                                if(k >= data.length && returnData.length > 0){
                                    resolve(returnData);
                                }else{
                                    resolve([{
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
                                            "Total"                  : 0, 
                                            "projectCategoryType"    : 0,
                                            "projectName"            : 0, 
                                            "upGrade"                : 0,
                                            "district"               : 0,
                                            "block"                  : 0,
                                            "village"                : 0,
                                            "unit"                : 0,
                                        }]);
                                }
                                // console.log('returnDataaaaaaa',returnData);
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            reject(err);
                        });
    });
};
///Call to Routes
exports.reports_new_sector_annual_plan = (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    Sectors .aggregate(
                        [
                            {
                                $project : {
                                            "sector_ID"             : "$_id",
                                            "sector"                : "$sector",
                                            "activity_ID"           : "$activity._id",
                                            "activityName"          : "$activity.activityName",
                                            "subactivity_ID"        : "$activity.subActivity._id",
                                            "subActivityName"       : "$activity.subActivity.subActivityName",
                                            "unit"                  : "$activity.subActivity.unit",
                                            "center_ID"             : req.params.center_ID,
                                            "year"                  : deriveDate.year,
                                            "startDate"             : req.params.startDate,
                                            "endDate"               : req.params.endDate,
                                            "yearList"              : deriveDate.yearList,
                                            "monthList"             : deriveDate.monthList,
                                            "projectCategoryType"   : req.params.projectCategoryType,
                                            "projectName"           : req.params.projectName,
                                            "uidStatus"             : req.params.uidstatus,
                                            "_id"                   : 0,
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
                        var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"sector","annual");
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
exports.reports_new_sector_periodic_plan= (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    Sectors .aggregate(
                        [
                            {
                                $project : {
                                            "sector_ID"             : "$_id",
                                            "sector"                : "$sector",
                                            "activity_ID"           : "$activity._id",
                                            "activityName"          : "$activity.activityName",
                                            "subactivity_ID"        : "$activity.subActivity._id",
                                            "subActivityName"       : "$activity.subActivity.subActivityName",
                                            "unit"                  : "$activity.subActivity.unit",
                                            "center_ID"             : req.params.center_ID,
                                            "year"                  : deriveDate.year,
                                            "startDate"             : req.params.startDate,
                                            "endDate"               : req.params.endDate,
                                            "yearList"              : deriveDate.yearList,
                                            "monthList"             : deriveDate.monthList,
                                            "projectCategoryType"   : req.params.projectCategoryType,
                                            "projectName"           : req.params.projectName,
                                            "uidStatus"             : req.params.uidstatus,
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
                        var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"sector","periodic");
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
exports.reports_new_sector_annual_achievement_report= (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    Sectors .aggregate(
                        [
                            {
                                $project : {
                                            "sector_ID"             : "$_id",
                                            "sector"                : "$sector",
                                            "activity_ID"           : "$activity._id",
                                            "activityName"          : "$activity.activityName",
                                            "subactivity_ID"        : "$activity.subActivity._id",
                                            "subActivityName"       : "$activity.subActivity.subActivityName",
                                            "unit"                  : "$activity.subActivity.unit",
                                            "center_ID"             : req.params.center_ID,
                                            "year"                  : deriveDate.year,
                                            "startDate"             : req.params.startDate,
                                            "endDate"               : req.params.endDate,
                                            "yearList"              : deriveDate.yearList,
                                            "monthList"             : deriveDate.monthList,
                                            "projectCategoryType"   : req.params.projectCategoryType,
                                            "projectName"           : req.params.projectName,
                                            "uidStatus"             : req.params.uidstatus,
                                            "_id"                   : 0,
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
                        var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"sector","pure_achievement");
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
exports.reports_new_activity__annual_plan = (req,res,next)=>{ 
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
    var activity_subactivity_query = "1";
    if(req.params.activity_ID != 'all'){
        if(req.params.subactivity_ID != 'all'){
            activity_subactivity_query = {
                                        $match : { 
                                                    "activity_ID"       : ObjectID(req.params.activity_ID),
                                                    "subactivity_ID"    : ObjectID(req.params.subactivity_ID)      
                                                }
                                    };
        }else{
            activity_subactivity_query = {
                                        $match : { "activity_ID" : ObjectID(req.params.activity_ID)}
                                    };    
        }
    }else{
        activity_subactivity_query = {
                                        $match : { "_id" : {$exists : true}}
                                    };
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
                                            "sector_ID"             : "$_id",
                                            "sector"                : "$sector",
                                            "activity_ID"           : "$activity._id",
                                            "activityName"          : "$activity.activityName",
                                            "subactivity_ID"        : "$activity.subActivity._id",
                                            "subActivityName"       : "$activity.subActivity.subActivityName",
                                            "unit"                  : "$activity.subActivity.unit",
                                            "center_ID"             : req.params.center_ID,
                                            "year"                  : deriveDate.year,
                                            "startDate"             : req.params.startDate,
                                            "endDate"               : req.params.endDate,
                                            "yearList"              : deriveDate.yearList,
                                            "monthList"             : deriveDate.monthList,
                                            "projectCategoryType"   : req.params.projectCategoryType,
                                            "projectName"           : req.params.projectName,
                                            "uidStatus"             : req.params.uidstatus,
                                            "_id"                   : 1,
                                        }
                            },
                            activity_subactivity_query
                        ]
            )
            .exec()
            .then(sec_activity_subactivity=>{
                getData();
                var selectQuery_annualPlan = {};
                async function getData(){
                    if(sec_activity_subactivity.length > 0){
                        var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"subActivities","annual");
                        res.status(200).json(returData);
                    }else{
                        res.status(200).json([]);
                    }
                }
                        // res.status(200).json(sec_activity_subactivity);
            })
            .catch(err=>{
                res.status(200).json(err);
            });
};
exports.reports_new_activity_periodic_plan = (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    // console.log("deriveDate ",deriveDate);
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
    var activity_subactivity_query = "1";
    if(req.params.activity_ID != 'all'){
        if(req.params.subactivity_ID != 'all'){
            activity_subactivity_query = {
                                        $match : { 
                                                    "activity_ID"       : ObjectID(req.params.activity_ID),
                                                    "subactivity_ID"    : ObjectID(req.params.subactivity_ID)      
                                                }
                                    };
        }else{
            activity_subactivity_query = {
                                        $match : { "activity_ID" : ObjectID(req.params.activity_ID)}
                                    };    
        }
    }else{
        activity_subactivity_query = {
                                        $match : { "_id" : {$exists : true}}
                                    };
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
                                            "sector_ID"             : "$_id",
                                            "sector"                : "$sector",
                                            "activity_ID"           : "$activity._id",
                                            "activityName"          : "$activity.activityName",
                                            "subactivity_ID"        : "$activity.subActivity._id",
                                            "subActivityName"       : "$activity.subActivity.subActivityName",
                                            "unit"                  : "$activity.subActivity.unit",
                                            "center_ID"             : req.params.center_ID,
                                            "year"                  : deriveDate.year,
                                            "startDate"             : req.params.startDate,
                                            "endDate"               : req.params.endDate,
                                            "yearList"              : deriveDate.yearList,
                                            "monthList"             : deriveDate.monthList,
                                            "projectCategoryType"   : req.params.projectCategoryType,
                                            "projectName"           : req.params.projectName,
                                            "uidStatus"             : req.params.uidstatus,
                                            "_id"                   : 1,
                                        }
                            },
                            activity_subactivity_query
                        ]
            )
            .exec()
            .then(sec_activity_subactivity=>{
                getData();
                var selectQuery_annualPlan = {};
                async function getData(){
                    if(sec_activity_subactivity.length > 0){
                        var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"subActivities","periodic");
                        res.status(200).json(returData);
                    }else{
                        res.status(200).json([]);
                    }
                }
            })
            .catch(err=>{
                res.status(200).json(err);
            });
};
exports.reports_new_activity_annual_achievement_report = (req,res,next)=>{ 
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
    var activity_subactivity_query = "1";
    if(req.params.activity_ID != 'all'){
        if(req.params.subactivity_ID != 'all'){
            activity_subactivity_query = {
                                        $match : { 
                                                    "activity_ID"       : ObjectID(req.params.activity_ID),
                                                    "subactivity_ID"    : ObjectID(req.params.subactivity_ID)      
                                                }
                                    };
        }else{
            activity_subactivity_query = {
                                        $match : { "activity_ID" : ObjectID(req.params.activity_ID)}
                                    };    
        }
    }else{
        activity_subactivity_query = {
                                        $match : { "_id" : {$exists : true}}
                                    };
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
                                            "sector_ID"             : "$_id",
                                            "sector"                : "$sector",
                                            "activity_ID"           : "$activity._id",
                                            "activityName"          : "$activity.activityName",
                                            "subactivity_ID"        : "$activity.subActivity._id",
                                            "subActivityName"       : "$activity.subActivity.subActivityName",
                                            "unit"                  : "$activity.subActivity.unit",
                                            "center_ID"             : req.params.center_ID,
                                            "year"                  : deriveDate.year,
                                            "startDate"             : req.params.startDate,
                                            "endDate"               : req.params.endDate,
                                            "yearList"              : deriveDate.yearList,
                                            "monthList"             : deriveDate.monthList,
                                            "projectCategoryType"   : req.params.projectCategoryType,
                                            "projectName"           : req.params.projectName,
                                            "uidStatus"             : req.params.uidstatus,
                                            "_id"                   : 1,
                                        }
                            },
                            activity_subactivity_query
                        ]
            )
            .exec()
            .then(sec_activity_subactivity=>{
                getData();
                var selectQuery_annualPlan = {};
                async function getData(){
                    if(sec_activity_subactivity.length > 0){
                        var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"subActivities","pure_achievement");
                        res.status(200).json(returData);
                    }else{
                        res.status(200).json([]);
                    }
                }
            })
            .catch(err=>{
                res.status(200).json(err);
            });
};
exports.reports_new_geographical_annual_achievement_report= (req,res,next)=>{ 
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
    var activity_subactivity_query = "1";
    if(req.params.activity_ID != 'all'){
        if(req.params.subactivity_ID != 'all'){
            activity_subactivity_query = {
                                        $match : { 
                                                    "activity_ID"       : ObjectID(req.params.activity_ID),
                                                    "subactivity_ID"    : ObjectID(req.params.subactivity_ID)      
                                                }
                                    };
        }else{
            activity_subactivity_query = {
                                        $match : { "activity_ID" : ObjectID(req.params.activity_ID)}
                                    };    
        }
    }else{
        activity_subactivity_query = {
                                        $match : { "_id" : {$exists : true}}
                                    };
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
                                                "sector_ID"             : "$_id",
                                                "sector"                : "$sector",
                                                "activity_ID"           : "$activity._id",
                                                "activityName"          : "$activity.activityName",
                                                "subactivity_ID"        : "$activity.subActivity._id",
                                                "subActivityName"       : "$activity.subActivity.subActivityName",
                                                "unit"                  : "$activity.subActivity.unit",
                                                "district"              : req.params.district,
                                                "block"                 : req.params.block,
                                                "village"               : req.params.village,
                                                "center_ID"             : req.params.center_ID,
                                                "startDate"             : req.params.startDate,
                                                "endDate"               : req.params.endDate,
                                                "projectCategoryType"   : req.params.projectCategoryType,
                                                "projectName"           : req.params.projectName,
                                                "uidStatus"             : req.params.uidstatus,
                                                "_id"                   : 1,
                                            }
                                },
                                activity_subactivity_query
                            ]
                )
                .exec()
                .then(sec_activity_subactivity=>{
                    getData();
                    var selectQuery_annualPlan = {};
                    async function getData(){
                        if(sec_activity_subactivity.length > 0){
                            var returData = await getResultData_nonzeroentries(sec_activity_subactivity,"geographical","pure_achievement");
                            res.status(200).json(returData);
                        }else{
                            res.status(200).json([]);
                        }
                    }
                })
                .catch(err=>{
                    res.status(200).json(err);
                });
    }
};
exports.report_new_category = (req,res,next)=>{
    //:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus/:income/:land/:special

    var query = {};
    query["$and"] = [];
    query["$and"].push({"date"       : {$gte : req.params.startDate, $lte : req.params.endDate}});
    if(req.params.center_ID != "all"){
        query["$and"].push({"center_ID"       : req.params.center_ID});
    }
    if(req.params.district != "all"){
        query["$and"].push({"district"       : req.params.district});
    }
    if(req.params.projectCategoryType != "all"){
        query["$and"].push({"projectCategoryType"       : req.params.projectCategoryType});
        if(req.params.projectName != "all"){
            query["$and"].push({"projectName"       : req.params.projectName});
        }        
    }
    if(req.params.district != "all"){
        query["$and"].push({"district"       : req.params.district});
    }
    var categoryQuery = {};
    // categoryQuery["$and"] = [];
    // categoryQuery["$and"].push({"_id"       : {$exists : true}});
    // if(req.params.income != "all"){
    //     categoryQuery["$and"].push({"incomeCategory"       : req.params.income});
    // }
    // if(req.params.land != "all"){
    //     categoryQuery["$and"].push({"landCategory"       : req.params.land});
    // }
    // if(req.params.special != "all"){
    //     categoryQuery["$and"].push({"specialCategory"       : req.params.special});
    // }

    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
                            }
                };
    }else{
        uidquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    ActivityReport  .aggregate(
                                [
                                    {
                                        $match : query
                                    },
                                    {
                                        $project : {
                                                "listofBeneficiaries" : 1,
                                                "projectCategoryType" : 1,
                                                "projectName"         : 1,
                                                "district"            : 1,
                                            }
                                    },
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
                                                        // "listofBeneficiaries.beneficiaryID"         : 1,
                                                        // "listofBeneficiaries.relation"              : 1,
                                                        // "listofBeneficiaries.dist"                  : 1,
                                                        // "listofBeneficiaries.block"                 : 1,
                                                        // "listofBeneficiaries.village"               : 1,
                                                        "listofBeneficiaries.familyID"              : 1,
                                                        "listofBeneficiaries.beneficiary_ID"        : 1,
                                                        "listofBeneficiaries.uidNumber"             : "$listofBeneficiaries1.uidNumber",
                                                        "listofBeneficiaries.family_ID"             : 1,
                                                        "listofBeneficiaries.nameofbeneficiary"     : 1,
                                                        "listofBeneficiaries.isUpgraded"            : 1,
                                                        "projectCategoryType"                       : 1,
                                                        "projectName"                               : 1,
                                                        "district"                               : 1,
                                                    }
                                    },
                                    uidquery,
                                    {
                                        $project : {
                                                    // "block"             : "$listofbeneficiaries.block",
                                                    // "village"           : "$listofbeneficiaries.village"
                                                    "familyID"          : "$listofBeneficiaries.familyID",
                                                    "_id"               : "$_id",
                                                    "family_ID"         : "$listofBeneficiaries.family_ID",
                                                    "beneficiary_ID"    : "$listofBeneficiaries.beneficiary_ID",
                                                    "projectCategoryType": "$projectCategoryType",
                                                    "projectName"       : "$projectName",
                                                    "upGrade"           : "$listofBeneficiaries.isUpgraded",
                                                    "district"          : "$district",
                                                    "Reach"             : "$listofBeneficiaries.family_ID"
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
                                                    "beneficiary_ID"    : 1,
                                                    "incomeCategory"    : "$families.incomeCategory",
                                                    "landCategory"      : "$families.landCategory",
                                                    "specialCategory"   : "$families.specialCategory",
                                                    "Reach"             : 1,
                                                    "projectCategoryType" : 1,
                                                    "projectName"       : 1,
                                                    "upGrade"           : 1,
                                                    "district"          : 1,
                                        }
                                    },
                                    {
                                        $match : categoryQuery
                                    },
                                    {
                                        $group : {
                                                    "_id"       : {
                                                                    "family_ID"         : "$family_ID",
                                                                    "familyID"          : "$familyID",
                                                                    "incomeCategory"    : "$incomeCategory",
                                                                    "landCategory"      : "$landCategory",
                                                                    "specialCategory"   : "$specialCategory",
                                                                    "beneficiary_ID"    : "$beneficiary_ID",
                                                                    "projectCategoryType": "$projectCategoryType"
                                                                },
                                                    "Reach"     : { "$sum" : 1},
                                                    "upGrade"   : { "$last" : "$upGrade"},
                                                    "projectName" : {"$first" : "$projectName"},
                                                    "district"  : {"$first" : "$district"}
                                                }    
                                    },
                                    {
                                        $group : {
                                                    "_id"                   : {
                                                                                "family_ID"         : "$_id.family_ID",
                                                                                "familyID"          : "$_id.familyID",
                                                                                "incomeCategory"    : "$_id.incomeCategory",
                                                                                "landCategory"      : "$_id.landCategory",
                                                                                "specialCategory"   : "$_id.specialCategory",
                                                                                "projectCategoryType"    : "$_id.projectCategoryType",

                                                                            },
                                                    "Reach"                 : { "$sum" : "$Reach" },
                                                    "FamilyUpgradation"     : { "$sum" : { "$cond" : [ {"$eq" : ["$upGrade" , "Yes"] },1,0 ]}},
                                                    "projectName"           : {"$first" : "$projectName"},
                                                    "district"              : {"$first" : "$district"}
                                                }
                                    },
                                    {
                                        $project : {
                                                    "Reach"                 : 1,
                                                    "FamilyUpgradation"     : 1,
                                                    "incomeCategory"        : "$_id.incomeCategory",
                                                    "landCategory"          : "$_id.landCategory",
                                                    "specialCategory"       : "$_id.specialCategory",
                                                    "_id"                   : 0,
                                                    "projectCategoryType"   : "$_id.projectCategoryType",
                                                    "projectName"           : 1,
                                                    "district"              : 1,
                                                }
                                    },
                                    {
                                        $group : {
                                                    "_id" : {
                                                                "incomeCategory"    : "$incomeCategory",
                                                                "landCategory"      : "$landCategory",
                                                                "specialCategory"   : "$specialCategory",
                                                                "projectCategoryType"    : "$projectCategoryType",
                                                            },
                                                    "Reach"                 : { "$sum" : "$Reach" },
                                                    "FamilyUpgradation"     : { "$sum" : "$FamilyUpgradation"},
                                                    // "projectCategoryType"   : {"$first" : "$projectCategoryType"},
                                                    "projectName"           : {"$first" : "$projectName"},
                                                    "district"           : {"$first" : "$district"}           
                                                }
                                    },
                                    {
                                        $project : {
                                                    "Reach"                 : 1,
                                                    "FamilyUpgradation"     : 1,
                                                    "incomeCategory"        : "$_id.incomeCategory",
                                                    "landCategory"          : "$_id.landCategory",
                                                    "specialCategory"       : "$_id.specialCategory",
                                                    "_id"                   : 0,
                                                    "projectCategoryType"   : "$_id.projectCategoryType",
                                                    "projectName"           : 1,
                                                    "district"              : 1,
                                                }
                                    },
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
                        if(i >= activityReport.length && activityReport.length > 0){
                            activityReport.push({
                                    "incomeCategory"    : "Total",
                                    "landCategory"      : "",
                                    "specialCategory"   : "",
                                    "Reach"             : totalReach,
                                    "FamilyUpgradation" : totalFamilyUpgradation,
                                    "projectCategoryType" : activityReport.projectCategoryType,
                                    "district"            : "-"
                            });
                        }
                        res.status(200).json(activityReport);
                    })
                    .catch(err=>{
                      res.status(200).json(err);  
                    });
};
exports.report_category = (req,res,next)=>{
    //:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus/:income/:land/:special

    var query = {};
    query["$and"] = [];
    query["$and"].push({"date"       : {$gte : req.params.startDate, $lte : req.params.endDate}});
    if(req.params.center_ID != "all"){
        query["$and"].push({"center_ID"       : req.params.center_ID});
    }
    if(req.params.district != "all"){
        query["$and"].push({"district"       : req.params.district});
    }
    if(req.params.projectCategoryType != "all"){
        query["$and"].push({"projectCategoryType"       : req.params.projectCategoryType});
        if(req.params.projectName != "all"){
            query["$and"].push({"projectName"       : req.params.projectName});
        }        
    }
    if(req.params.district != "all"){
        query["$and"].push({"district"       : req.params.district});
    }
    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
                            }
                };
    }else{
        uidquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    ActivityReport  .aggregate(
                                [
                                    {
                                        $match : query
                                    },
                                    {
                                        $project : {
                                                "listofBeneficiaries" : 1,
                                                "projectCategoryType" : 1,
                                                "projectName"         : 1,
                                                "district"            : 1,
                                            }
                                    },
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
                                                        "listofBeneficiaries.familyID"              : 1,
                                                        "listofBeneficiaries.beneficiary_ID"        : 1,
                                                        "listofBeneficiaries.uidNumber"             : "$listofBeneficiaries1.uidNumber",
                                                        "listofBeneficiaries.family_ID"             : 1,
                                                        "listofBeneficiaries.nameofbeneficiary"     : 1,
                                                        "listofBeneficiaries.isUpgraded"            : 1,
                                                        // "projectCategoryType"                       : 1,
                                                        // "projectName"                               : 1,
                                                        "district"                               : 1,
                                                    }
                                    },
                                    uidquery,
                                    {
                                        $project : {
                                                    "familyID"          : "$listofBeneficiaries.familyID",
                                                    "_id"               : "$_id",
                                                    "family_ID"         : "$listofBeneficiaries.family_ID",
                                                    "beneficiary_ID"    : "$listofBeneficiaries.beneficiary_ID",
                                                    // "projectCategoryType": "$projectCategoryType",
                                                    // "projectName"       : "$projectName",
                                                    "upGrade"           : "$listofBeneficiaries.isUpgraded",
                                                    "district"          : "$district",
                                                    "Reach"             : "$listofBeneficiaries.family_ID"
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
                                                    "beneficiary_ID"    : 1,
                                                    "incomeCategory"    : "$families.incomeCategory",
                                                    "landCategory"      : "$families.landCategory",
                                                    "specialCategory"   : "$families.specialCategory",
                                                    "Reach"             : 1,
                                                    // "projectCategoryType" : 1,
                                                    // "projectName"       : 1,
                                                    "upGrade"           : 1,
                                                    "district"          : 1,
                                        }
                                    },
                                    {
                                        $group : {
                                                    "_id"       : {
                                                                    "family_ID"         : "$family_ID",
                                                                    "familyID"          : "$familyID",
                                                                    "incomeCategory"    : "$incomeCategory",
                                                                    "landCategory"      : "$landCategory",
                                                                    "specialCategory"   : "$specialCategory",
                                                                    "beneficiary_ID"    : "$beneficiary_ID",
                                                                    // "projectCategoryType": "$projectCategoryType"
                                                                },
                                                    "Reach"     : { "$sum" : 1},
                                                    "upGrade"   : { "$last" : "$upGrade"},
                                                    // "projectName" : {"$first" : "$projectName"},
                                                    "district"  : {"$first" : "$district"}
                                                }    
                                    },
                                    {
                                        $group : {
                                                    "_id"                   : {
                                                                                "family_ID"         : "$_id.family_ID",
                                                                                "familyID"          : "$_id.familyID",
                                                                                "incomeCategory"    : "$_id.incomeCategory",
                                                                                "landCategory"      : "$_id.landCategory",
                                                                                "specialCategory"   : "$_id.specialCategory",
                                                                                // "projectCategoryType"    : "$_id.projectCategoryType",
                                                                            },
                                                    "Reach"                 : { "$sum" : "$Reach" },
                                                    "FamilyUpgradation"     : { "$sum" : { "$cond" : [ {"$eq" : ["$upGrade" , "Yes"] },1,0 ]}},
                                                    // "projectName"           : {"$first" : "$projectName"},
                                                    "district"              : {"$first" : "$district"}
                                                }
                                    },
                                    {
                                        $project : {
                                                    "Reach"                 : 1,
                                                    "FamilyUpgradation"     : 1,
                                                    "incomeCategory"        : "$_id.incomeCategory",
                                                    "landCategory"          : "$_id.landCategory",
                                                    "specialCategory"       : "$_id.specialCategory",
                                                    "_id"                   : 0,
                                                    // "projectCategoryType"   : "$_id.projectCategoryType",
                                                    // "projectName"           : 1,
                                                    "district"              : 1,
                                                    "BigFarmer"             : { "$sum" : { "$cond" : [ {"$eq" : ["$landCategory", "Big Farmer"] },1,0 ]}},
                                                    "MarginalFarmer"        : { "$sum" : { "$cond" : [ {"$eq" : ["$landCategory", "Marginal Farmer"] },1,0 ]}},
                                                    "SmallFarmer"           : { "$sum" : { "$cond" : [ {"$eq" : ["$landCategory", "Small Farmer"] },1,0 ]}},
                                                    "Landless"              : { "$sum" : { "$cond" : [ {"$eq" : ["$landCategory", "Landless"] },1,0 ]}},
                                                }
                                    },
                                    // {
                                    //     $group : {
                                    //                 "_id" : {
                                    //                             "incomeCategory"    : "$incomeCategory",
                                    //                             "landCategory"      : "$landCategory",
                                    //                             "specialCategory"   : "$specialCategory",
                                    //                             // "projectCategoryType"    : "$projectCategoryType",
                                    //                         },
                                    //                 "Reach"                 : { "$sum" : "$Reach" },
                                    //                 "FamilyUpgradation"     : { "$sum" : "$FamilyUpgradation"},
                                    //                 // "projectCategoryType"   : {"$first" : "$projectCategoryType"},
                                    //                 // "projectName"           : {"$first" : "$projectName"},
                                    //                 "district"           : {"$first" : "$district"}           
                                    //             }
                                    // },
                                    // {
                                    //     $project : {
                                    //                 "Reach"                 : 1,
                                    //                 "FamilyUpgradation"     : 1,
                                    //                 "incomeCategory"        : "$_id.incomeCategory",
                                    //                 "landCategory"          : "$_id.landCategory",
                                    //                 "specialCategory"       : "$_id.specialCategory",
                                    //                 "_id"                   : 0,
                                    //                 // "projectCategoryType"   : "$_id.projectCategoryType",
                                    //                 // "projectName"           : 1,
                                    //                 "district"              : 1,
                                    //             }
                                    // },
                                ]
                    )
                    .exec()
                    .then(activityReport=>{
                        // console.log("activityReport",activityReport)
                        var totalReach              = 0 ;
                        var totalFamilyUpgradation  = 0 ;
                        for(i = 0 ; i < activityReport.length ; i ++){
                            totalReach              += activityReport[i].Reach;
                            totalFamilyUpgradation  += activityReport[i].FamilyUpgradation;
                        }
                        if(i >= activityReport.length && activityReport.length > 0){
                            activityReport.push({
                                    "incomeCategory"    : "Total",
                                    "landCategory"      : "",
                                    "specialCategory"   : "",
                                    "Reach"             : totalReach,
                                    "FamilyUpgradation" : totalFamilyUpgradation,
                                    "projectCategoryType" : activityReport.projectCategoryType,
                                    "district"            : "-"
                            });
                        }
                        res.status(200).json(activityReport);
                    })
                    .catch(err=>{
                      res.status(200).json(err);  
                    });
};
exports.report_new_category_old = (req,res,next)=>{
    //:startDate/:endDate/:center_ID/:district/:projectCategoryType/:projectName/:uidstatus/:income/:land/:special

    var query = {};
    query["$and"] = [];
    query["$and"].push({"date"       : {$gte : req.params.startDate, $lte : req.params.endDate}});
    if(req.params.center_ID != "all"){
        query["$and"].push({"center_ID"       : req.params.center_ID});
    }
    if(req.params.district != "all"){
        query["$and"].push({"district"       : req.params.district});
    }
    if(req.params.projectCategoryType != "all"){
        query["$and"].push({"projectCategoryType"       : req.params.projectCategoryType});
        if(req.params.projectName != "all"){
            query["$and"].push({"projectName"       : req.params.projectName});
        }        
    }
    if(req.params.district != "all"){
        query["$and"].push({"district"       : req.params.district});
    }
    var categoryQuery = {};
    categoryQuery["$and"] = [];
    categoryQuery["$and"].push({"_id"       : {$exists : true}});
    if(req.params.income != "all"){
        categoryQuery["$and"].push({"incomeCategory"       : req.params.income});
    }
    if(req.params.land != "all"){
        categoryQuery["$and"].push({"landCategory"       : req.params.land});
    }
    if(req.params.special != "all"){
        categoryQuery["$and"].push({"specialCategory"       : req.params.special});
    }

    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
                            }
                };
    }else{
        uidquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    ActivityReport  .aggregate(
                                [
                                    {
                                        $match : query
                                    },
                                    {
                                        $project : {
                                                "listofBeneficiaries" : 1,
                                                "projectCategoryType" : 1,
                                                "projectName"         : 1,
                                                "district"            : 1,
                                            }
                                    },
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
                                                        // "listofBeneficiaries.beneficiaryID"         : 1,
                                                        // "listofBeneficiaries.relation"              : 1,
                                                        // "listofBeneficiaries.dist"                  : 1,
                                                        // "listofBeneficiaries.block"                 : 1,
                                                        // "listofBeneficiaries.village"               : 1,
                                                        "listofBeneficiaries.familyID"              : 1,
                                                        "listofBeneficiaries.beneficiary_ID"        : 1,
                                                        "listofBeneficiaries.uidNumber"             : "$listofBeneficiaries1.uidNumber",
                                                        "listofBeneficiaries.family_ID"             : 1,
                                                        "listofBeneficiaries.nameofbeneficiary"     : 1,
                                                        "listofBeneficiaries.isUpgraded"            : 1,
                                                        "projectCategoryType"                       : 1,
                                                        "projectName"                               : 1,
                                                        "district"                               : 1,
                                                    }
                                    },
                                    uidquery,
                                    {
                                        $project : {
                                                    // "block"             : "$listofbeneficiaries.block",
                                                    // "village"           : "$listofbeneficiaries.village"
                                                    "familyID"          : "$listofBeneficiaries.familyID",
                                                    "_id"               : "$_id",
                                                    "family_ID"         : "$listofBeneficiaries.family_ID",
                                                    "beneficiary_ID"    : "$listofBeneficiaries.beneficiary_ID",
                                                    "projectCategoryType": "$projectCategoryType",
                                                    "projectName"       : "$projectName",
                                                    "upGrade"           : "$listofBeneficiaries.isUpgraded",
                                                    "district"          : "$district",
                                                    "Reach"             : "$_id"
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
                                                    // "familyHead"        : 1,
                                                    // "beneficiaryID"     : 1,
                                                    // "category"          : "$families.familyCategory",
                                                    // "Reach"             : { "$sum" : 1},
                                                    "_id"               : 1,
                                                    "family_ID"         : 1,
                                                    "familyID"          : 1,
                                                    "beneficiary_ID"    : 1,
                                                    "incomeCategory"    : "$families.incomeCategory",
                                                    "landCategory"      : "$families.landCategory",
                                                    "specialCategory"   : "$families.specialCategory",
                                                    "Reach"             : 1,
                                                    "projectCategoryType" : 1,
                                                    "projectName"       : 1,
                                                    "upGrade"           : 1,
                                                    "district"          : 1,
                                        }
                                    },
                                    {
                                        $match : categoryQuery
                                    },
                                    {
                                        $group : {
                                                    "_id"       : {
                                                                    "family_ID"         : "$family_ID",
                                                                    "familyID"          : "$familyID",
                                                                    "incomeCategory"    : "$incomeCategory",
                                                                    "landCategory"      : "$landCategory",
                                                                    "specialCategory"   : "$specialCategory",
                                                                    "beneficiary_ID"    : "$beneficiary_ID",
                                                                    "projectCategoryType": "$projectCategoryType"
                                                                },
                                                    "Reach"     : { "$sum" : 1},
                                                    "upGrade"   : { "$last" : "$upGrade"},
                                                    // "projectCategoryType" : {"$first" : "$projectCategoryType"},
                                                    "projectName" : {"$first" : "$projectName"},
                                                    "district"  : {"$first" : "$district"}
                                                }    
                                    },
                                    {
                                        $group : {
                                                    "_id"                   : {
                                                                                "family_ID"         : "$_id.family_ID",
                                                                                "familyID"          : "$_id.familyID",
                                                                                "incomeCategory"    : "$_id.incomeCategory",
                                                                                "landCategory"      : "$_id.landCategory",
                                                                                "specialCategory"   : "$_id.specialCategory",
                                                                                // "beneficiary_ID"    : "$_id.beneficiary_ID",
                                                                                "projectCategoryType"    : "$_id.projectCategoryType",

                                                                            },
                                                    "Reach"                 : { "$sum" : "$Reach" },
                                                    "FamilyUpgradation"     : { "$sum" : { "$cond" : [ {"$eq" : ["$upGrade" , "Yes"] },1,0 ]}},
                                                    // "projectCategoryType"   : {"$first" : "$projectCategoryType"},
                                                    "projectName"           : {"$first" : "$projectName"},
                                                    "district"           : {"$first" : "$district"}
                                                }
                                    },
                                    {
                                        $project : {
                                                    "Reach"                 : 1,
                                                    "FamilyUpgradation"     : 1,
                                                    "incomeCategory"        : "$_id.incomeCategory",
                                                    "landCategory"          : "$_id.landCategory",
                                                    "specialCategory"       : "$_id.specialCategory",
                                                    "_id"                   : 0,
                                                    "projectCategoryType"   : "$_id.projectCategoryType",
                                                    "projectName"           : 1,
                                                    "district"              : 1,
                                                }
                                    },
                                    {
                                        $group : {
                                                    "_id" : {
                                                                "incomeCategory"    : "$incomeCategory",
                                                                "landCategory"      : "$landCategory",
                                                                "specialCategory"   : "$specialCategory",
                                                                "projectCategoryType"    : "$projectCategoryType",
                                                            },
                                                    "Reach"                 : { "$sum" : "$Reach" },
                                                    "FamilyUpgradation"     : { "$sum" : "$FamilyUpgradation"},
                                                    // "projectCategoryType"   : {"$first" : "$projectCategoryType"},
                                                    "projectName"           : {"$first" : "$projectName"},
                                                    "district"           : {"$first" : "$district"}           
                                                }
                                    },
                                    {
                                        $project : {
                                                    "Reach"                 : 1,
                                                    "FamilyUpgradation"     : 1,
                                                    "incomeCategory"        : "$_id.incomeCategory",
                                                    "landCategory"          : "$_id.landCategory",
                                                    "specialCategory"       : "$_id.specialCategory",
                                                    "_id"                   : 0,
                                                    "projectCategoryType"   : "$_id.projectCategoryType",
                                                    "projectName"           : 1,
                                                    "district"              : 1,
                                                }
                                    },
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
                        if(i >= activityReport.length && activityReport.length > 0){
                            activityReport.push({
                                    "incomeCategory"    : "Total",
                                    "landCategory"      : "",
                                    "specialCategory"   : "",
                                    "Reach"             : totalReach,
                                    "FamilyUpgradation" : totalFamilyUpgradation,
                                    "projectCategoryType" : activityReport.projectCategoryType,
                                    "district"          : "-"
                            });
                        }
                        res.status(200).json(activityReport);
                    })
                    .catch(err=>{
                      res.status(200).json(err);  
                    });
};


function activityReportForGoal(searchQuery,uidStatus){
    // console.log('searchQuery',searchQuery);
    return new Promise(function(resolve,reject){
       /* ActivityReport.aggregate( 
                                    [
                                        // {
                                        //     $match : searchQuery
                                        // },
                                    ]
                        )*/
        ActivityReport.find(searchQuery) 
                        .exec()
                        .then(data=>{   
                            // console.log('data',data);
                            getAsyncData();
                            async function  getAsyncData(){

                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            reject(err);
                        });
    });
};

function getSubActivities(searchQuery){
    // console.log('searchQuery',searchQuery);
    return new Promise(function(resolve,reject){
        Sectors.aggregate([
                            {
                                $match : {
                                    "_id"           : ObjectID(searchQuery.sector_ID),
                                    "activity._id"  : ObjectID(searchQuery.activity_ID)
                                }
                            },
                            { 
                                $project: {
                                    "sector"    : 1,
                                    "activity": { 
                                        $filter: {
                                            input: '$activity',
                                            as: 'activity',
                                            cond: { $eq: ['$$activity._id', ObjectID(searchQuery.activity_ID)]}
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
                                    "goalType"          : searchQuery.goalType,
                                    "sector_ID"         : "$_id",
                                    "sectorName"        : "$sector",
                                    "activity_ID"       : "$activity._id",
                                    "activityName"      : "$activity.activityName",
                                    "subActivity"       : "$activity.subActivity._id",
                                    "subActivity_ID"       : "$activity.subActivity._id",
                                    "subActivityName"   : "$activity.subActivity.subActivityName",
                                    "unit"              : "$activity.subActivity.unit",
                                }
                            }
                ])
                .exec()
                .then(sectors=>{
                    // console.log('sectors',sectors);
                    resolve(sectors);
                })
                .catch(err=>{
                    console.log('errrrr',err);
                    reject(err);
                });
    });
};
