const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
var request             = require('request-promise');
var moment              = require('moment');
const MonthlyPlan       = require('../models//monthlyPlans.js');

exports.reports_new_sector_quarterly_plan= (req,res,next)=>{ 
    var query = "1";
    if(req.params.center_ID == 'all'){
        if(req.params.projectCategoryType != "all"){
            if(req.params.projectCategoryType == "LHWRF Grant"){
                query = {month:req.params.quarter,year:req.params.year, projectCategoryType : req.params.projectCategoryType}
            }else if(req.params.projectCategoryType == "Project Fund"){
                if(req.params.projectName == 'all'){
                    query = {month:req.params.quarter,year:req.params.year, projectCategoryType : req.params.projectCategoryType}
                }else{
                    query = {month:req.params.quarter,year:req.params.year, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
                }
            }
        }else{
            query = {month:req.params.quarter,year:req.params.year}
        }
    }else{
        if(req.params.projectCategoryType != "all"){
            if(req.params.projectCategoryType == "LHWRF Grant"){
                query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType}
            }else if(req.params.projectCategoryType == "Project Fund"){
                if(req.params.projectName == 'all'){
                    query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType}
                }else{
                    query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
                }
            }
        }else{
            query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID}
        }
    }

    // console.log("query",query);
    if(query != "1"){
        MonthlyPlan.aggregate([
                                {
                                    $match : query
                                },
                                {
                                    $group: {
                                        _id : {
                                            "month"                 :"$month",
                                            "year"                  :"$year",
                                            "projectCategoryType"   :"$projectCategoryType", 
                                            "projectName"           :"$projectName",
                                            "sector_ID"             :"$sector_ID",
                                            "sectorName"            :"$sectorName",
                                        }, 
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
                                    }  
                                },
                                {
                                    $project: {
                                        "_id"                    : 0,                  
                                        "month"                  : "$_id.month",
                                        "year"                   : "$_id.year",
                                        "projectCategoryType"    : "$_id.projectCategoryType",
                                        "projectName"            : "$_id.projectName",
                                        "sector_ID"              : "$_id.sector_ID",
                                        "sectorName"             : "$_id.sectorName",
                                        "Reach"                  : 1,
                                        "FamilyUpgradation"      : 1,
                                        "TotalBudget"            : 1,
                                        "LHWRF"                  : 1,
                                        "NABARD"                 : 1,
                                        "Bank_Loan"              : 1,
                                        "DirectCC"               : 1,
                                        "IndirectCC"             : 1,
                                        "Govt"                   : 1,
                                        "Other"                  : 1,
                                    }
                                },
                            ])
        .exec()
        .then(data=>{
            var plandata = [];
            // console.log('data',data);
            if(data){
                var totalReach              = 0;
                var totalFamilyUpgradation  = 0;
                var totalTotalBudget        = 0;
                var totalLHWRF              = 0;
                var totalNABARD             = 0;
                var totalBank_Loan          = 0;
                var totalDirectCC           = 0;
                var totalIndirectCC         = 0;
                var totalGovt               = 0;
                var totalOther              = 0;
                for(i = 0 ; i < data.length ; i ++){
                    // console.log('i',i);
                    // console.log("data.length",data.length,'data[i]',data[i]);
                    totalReach                  += data[i].Reach;
                    totalFamilyUpgradation      += data[i].FamilyUpgradation;
                    totalTotalBudget            += data[i].TotalBudget ? data[i].TotalBudget : 0;
                    totalLHWRF                  += data[i].LHWRF       ? data[i].LHWRF : 0;
                    totalNABARD                 += data[i].NABARD      ? data[i].NABARD : 0;
                    totalBank_Loan              += data[i].Bank_Loan   ? data[i].Bank_Loan : 0;
                    totalDirectCC               += data[i].DirectCC    ? data[i].DirectCC : 0;
                    totalIndirectCC             += data[i].IndirectCC  ? data[i].IndirectCC : 0;
                    totalGovt                   += data[i].Govt        ? data[i].Govt : 0;
                    totalOther                  += data[i].Other       ? data[i].Other : 0;
                    var plandetails =  {              
                            "month"                  : data[i].month,
                            "year"                   : data[i].year,
                            "projectCategoryType"    : data[i].projectCategoryType,
                            "projectName"            : data[i].projectName,
                            "sector_ID"              : data[i].sector_ID,
                            "sectorName"             : data[i].sectorName,
                            "Reach"                  : data[i].Reach,
                            "FamilyUpgradation"      : data[i].FamilyUpgradation,
                            "TotalBudget"            : data[i].TotalBudget ? Number(data[i].TotalBudget/100000).toFixed(2) : 0,
                            "LHWRF"                  : data[i].LHWRF       ? Number(data[i].LHWRF/100000).toFixed(2) : 0,
                            "NABARD"                 : data[i].NABARD      ? Number(data[i].NABARD/100000).toFixed(2) : 0,
                            "Bank_Loan"              : data[i].Bank_Loan   ? Number(data[i].Bank_Loan/100000).toFixed(2) : 0,
                            "DirectCC"               : data[i].DirectCC    ? Number(data[i].DirectCC/100000).toFixed(2) : 0,
                            "IndirectCC"             : data[i].IndirectCC  ? Number(data[i].IndirectCC/100000).toFixed(2) : 0,
                            "Govt"                   : data[i].Govt        ? Number(data[i].Govt/100000).toFixed(2) : 0,
                            "Other"                  : data[i].Other       ? Number(data[i].Other/100000).toFixed(2) : 0,
                        }
                    plandata.push(plandetails);      
                    // console.log('totalLHWRF',totalLHWRF);             
                }
                if(i >= data.length && data.length > 0){
                    plandata.push(                    
                        {              
                            "month"                  : "-",
                            "year"                   : "-",
                            "projectCategoryType"    : "-",
                            "projectName"            : "-",
                            "sector_ID"              : "-",
                            "sectorName"             : "<b>Total</b>",
                            "Reach"                  : totalReach,
                            "FamilyUpgradation"      : totalFamilyUpgradation,
                            "TotalBudget"            : "<b>" + Number(totalTotalBudget/100000).toFixed(2) + "</b>",
                            "LHWRF"                  : "<b>" + Number(totalLHWRF/100000).toFixed(2) + "</b>",
                            "NABARD"                 : "<b>" + Number(totalNABARD/100000).toFixed(2) + "</b>",
                            "Bank_Loan"              : "<b>" + Number(totalBank_Loan/100000).toFixed(2) + "</b>",
                            "DirectCC"               : "<b>" + Number(totalDirectCC/100000).toFixed(2) + "</b>",
                            "IndirectCC"             : "<b>" + Number(totalIndirectCC/100000).toFixed(2) + "</b>",
                            "Govt"                   : "<b>" + Number(totalGovt/100000).toFixed(2) + "</b>",
                            "Other"                  : "<b>" + Number(totalOther/100000).toFixed(2) + "</b>",
                        },
                        {              
                            "month"                  : "-",
                            "year"                   : "-",
                            "projectCategoryType"    : "-",
                            "projectName"            : "-",
                            "sector_ID"              : "-",
                            "sectorName"             : "<b>Total %</b>",
                            "Reach"                  : "-",
                            "FamilyUpgradation"      : "-",
                            "TotalBudget"            : totalTotalBudget > 0 ? "<b>" + Number((totalTotalBudget/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "LHWRF"                  : totalLHWRF > 0       ? "<b>" + Number((totalLHWRF/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "NABARD"                 : totalNABARD > 0      ? "<b>" + Number((totalNABARD/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "Bank_Loan"              : totalBank_Loan > 0   ? "<b>" + Number((totalBank_Loan/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "DirectCC"               : totalDirectCC > 0    ? "<b>" + Number((totalDirectCC/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "IndirectCC"             : totalIndirectCC > 0  ? "<b>" + Number((totalIndirectCC/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "Govt"                   : totalGovt > 0        ? "<b>" + Number((totalGovt/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                            "Other"                  : totalOther > 0       ? "<b>" + Number((totalOther/totalTotalBudget) * 100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
                        }
                    );
                }
                res.status(200).json(plandata);
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
    }
};
exports.reports_new_activity_quarterly_plan= (req,res,next)=>{ 
    var query = "1";
    if(req.params.center_ID == 'all'){
        if(req.params.projectCategoryType != "all"){
            if((req.params.projectCategoryType == "LHWRF Grant" || req.params.projectCategoryType == "Project Fund") && req.params.projectName == "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "month"               : req.params.quarter,
                        "year"                : req.params.year,
                        "projectCategoryType" : req.params.projectCategoryType,
                    }
                }
            }else if(req.params.projectCategoryType == "Project Fund" && req.params.projectName != "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "projectName"         : req.params.projectName,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "month"               : req.params.quarter,
                        "year"                : req.params.year,
                        "projectCategoryType" : req.params.projectCategoryType,
                        "projectName"         : req.params.projectName,
                    }
                }
                // query = {month:req.params.quarter,year:req.params.year, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
            }
        }else{            
            if(req.params.sector_ID != 'all'){
                if(req.params.activity_ID != 'all'){
                    if(req.params.subactivity_ID != 'all'){
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                            "subactivity_ID"      : (req.params.subactivity_ID)      
                        }                            
                    }else{
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                        }
                    };    
                }else{
                    query = {
                        "month"               : req.params.quarter,
                        "year"                : req.params.year,
                        "sector_ID"           : (req.params.sector_ID), 
                    }
                }
            }else{
                query = {
                    "month"               : req.params.quarter,
                    "year"                : req.params.year,
                }
            }
            // query = {month:req.params.quarter,year:req.params.year}
        }
    }else{
        if(req.params.projectCategoryType != "all"){
            if((req.params.projectCategoryType == "LHWRF Grant" || req.params.projectCategoryType == "Project Fund") && req.params.projectName == "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "month"               : req.params.quarter,
                        "year"                : req.params.year,
                        "center_ID"           : req.params.center_ID,
                        "projectCategoryType" : req.params.projectCategoryType,
                    }
                }
                // query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType}
            }else if(req.params.projectCategoryType == "Project Fund" && req.params.projectName != "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "month"               : req.params.quarter,
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "projectName"         : req.params.projectName,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "month"               : req.params.quarter,
                        "year"                : req.params.year,
                        "center_ID"           : req.params.center_ID,
                        "projectCategoryType" : req.params.projectCategoryType,
                        "projectName"         : req.params.projectName,
                    }
                }
                // query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
            }
        }else{         
            if(req.params.sector_ID != 'all'){
                if(req.params.activity_ID != 'all'){
                    if(req.params.subactivity_ID != 'all'){
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                            "subactivity_ID"      : (req.params.subactivity_ID)      
                        }                            
                    }else{
                        query = {
                            "month"               : req.params.quarter,
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                        }
                    };    
                }else{
                    query = {
                        "month"               : req.params.quarter,
                        "year"                : req.params.year,
                        "center_ID"           : req.params.center_ID,
                        "sector_ID"           : (req.params.sector_ID), 
                    }
                }
            }else{
                query = {
                    "month"               : req.params.quarter,
                    "year"                : req.params.year,
                    "center_ID"           : req.params.center_ID,
                }
            }
            // query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID}
        }
    }       
    // console.log('query',query);
    if(query != "1"){
        MonthlyPlan.aggregate([
                                {
                                    $match : query
                                },
                              
                                {
                                    $group: {
                                        _id : {
                                            "month"                 :"$month",
                                            "year"                  :"$year",
                                            "projectCategoryType"   :"$projectCategoryType", 
                                            "projectName"           :"$projectName",
                                            "sector_ID"             :"$sector_ID",
                                            "sectorName"            :"$sectorName",
                                            "activityName"          :"$activityName",
                                            "activity_ID"           :"$activity_ID",
                                            "subactivity_ID"        :"$subactivity_ID",
                                            "subactivityName"       :"$subactivityName",
                                            "unit"                  :"$unit",
                                            "unitCost"              :"$unitCost",
                                            "remark"                :"$remark",
                                        }, 
                                        "physicalUnit"      : { "$sum" : "$physicalUnit"},
                                        "TotalBudget"       : { "$sum" : "$totalBudget" },
                                        "LHWRF"             : { "$sum" : "$LHWRF" },
                                        "NABARD"            : { "$sum" : "$NABARD" },
                                        "Bank_Loan"         : { "$sum" : "$bankLoan" },
                                        "IndirectCC"        : { "$sum" : "$indirectCC"},
                                        "DirectCC"          : { "$sum" : "$directCC"},
                                        "Govt"              : { "$sum" : "$govtscheme"},
                                        "Other"             : { "$sum" : "$other"},
                                        "Reach"             : { "$sum" : "$noOfBeneficiaries"},
                                        "FamilyUpgradation" : { "$sum" : "$noOfFamilies"},            
                                    }  
                                },  
                            ])
            .exec()
            .then(data=>{
                var plandata = [];
                // console.log('data',data);
                    // res.status(200).json(data);
                if(data){
                    var totalReach              = 0;
                    var totalFamilyUpgradation  = 0;
                    var totalTotalBudget        = 0;
                    var totalLHWRF              = 0;
                    var totalNABARD             = 0;
                    var totalBank_Loan          = 0;
                    var totalDirectCC           = 0;
                    var totalIndirectCC         = 0;
                    var totalGovt               = 0;
                    var totalOther              = 0;
                    var totalphysicalUnit       = 0;
                    for(i = 0 ; i < data.length ; i ++){
                        totalReach                  += data[i].Reach;
                        totalFamilyUpgradation      += data[i].FamilyUpgradation;
                        // totalphysicalUnit           += data[i].physicalUnit;
                        totalTotalBudget            += data[i].TotalBudget   ? (data[0].TotalBudget) : 0;
                        totalLHWRF                  += data[i].LHWRF         ? (data[0].LHWRF)       : 0;
                        totalNABARD                 += data[i].NABARD        ? (data[0].NABARD)      : 0;
                        totalBank_Loan              += data[i].Bank_Loan     ? (data[0].Bank_Loan)   : 0;
                        totalDirectCC               += data[i].DirectCC      ? (data[0].DirectCC)    : 0;
                        totalIndirectCC             += data[i].IndirectCC    ? (data[0].IndirectCC)  : 0;
                        totalGovt                   += data[i].Govt          ? (data[0].Govt)        : 0;
                        totalOther                  += data[i].Other         ? (data[0].Other)       : 0;
                     
                        var plandetails =  {              
                                "month"                  : data[i]._id.month,
                                "year"                   : data[i]._id.year,
                                "projectCategoryType"    : data[i]._id.projectCategoryType,
                                "projectName"            : data[i]._id.projectName,
                                "sector_ID"              : data[i]._id.sector_ID,
                                "sectorName"             : data[i]._id.sectorName,
                                "activityName"           : data[i]._id.activityName,
                                "activity_ID"            : data[i]._id.activity_ID,
                                "subactivity_ID"         : data[i]._id.subactivity_ID,
                                "subactivityName"        : data[i]._id.subactivityName,
                                "unit"                   : data[i]._id.unit,
                                "remark"                 : data[i]._id.remark,
                                "unitCost"               : data[i]._id.unitCost      ? Number(data[i]._id.unitCost/100000).toFixed(2) : 0,
                                "physicalUnit"           : data[i].physicalUnit,
                                "Reach"                  : data[i].Reach,
                                "FamilyUpgradation"      : data[i].FamilyUpgradation,
                                "TotalBudget"            : data[i].TotalBudget       ? Number(data[i].TotalBudget/100000).toFixed(2) : 0,
                                "LHWRF"                  : data[i].LHWRF             ? Number(data[i].LHWRF/100000).toFixed(2) : 0,
                                "NABARD"                 : data[i].NABARD            ? Number(data[i].NABARD/100000).toFixed(2) : 0,
                                "Bank_Loan"              : data[i].Bank_Loan         ? Number(data[i].Bank_Loan/100000).toFixed(2) : 0,
                                "DirectCC"               : data[i].DirectCC          ? Number(data[i].DirectCC/100000).toFixed(2) : 0,
                                "IndirectCC"             : data[i].IndirectCC        ? Number(data[i].IndirectCC/100000).toFixed(2) : 0,
                                "Govt"                   : data[i].Govt              ? Number(data[i].Govt/100000).toFixed(2) : 0,
                                "Other"                  : data[i].Other             ? Number(data[i].Other/100000).toFixed(2) : 0,
                            }
                        plandata.push(plandetails);      
                        // console.log('totalLHWRF',totalLHWRF);             
                    }
                    if(i >= data.length && data.length > 0){
                        plandata.push(                    
                            {              
                                "month"                  : "-",
                                "year"                   : "-",
                                "projectCategoryType"    : "-",
                                "projectName"            : "-",
                                "sector_ID"              : "-",
                                "sectorName"             : "<b>Total</b>",
                                "activityName"           : "-",
                                "activity_ID"            : "-",
                                "subactivity_ID"         : "-",
                                "subactivityName"        : "-",
                                "unit"                   : "-",
                                "unitCost"               : " ",
                                "physicalUnit"           : " ",
                                "remark"                 : "-",
                                "physicalUnit"           : "-",
                                "Reach"                  : totalReach,
                                "FamilyUpgradation"      : totalFamilyUpgradation,
                                "TotalBudget"            : "<b>" + Number(totalTotalBudget/100000).toFixed(2)+"</b>",
                                "LHWRF"                  : "<b>" + Number(totalLHWRF/100000).toFixed(2)+"</b>",
                                "NABARD"                 : "<b>" + Number(totalNABARD/100000).toFixed(2)+"</b>",
                                "Bank_Loan"              : "<b>" + Number(totalBank_Loan/100000).toFixed(2)+"</b>",
                                "DirectCC"               : "<b>" + Number(totalDirectCC/100000).toFixed(2)+"</b>",
                                "IndirectCC"             : "<b>" + Number(totalIndirectCC/100000).toFixed(2)+"</b>",
                                "Govt"                   : "<b>" + Number(totalGovt/100000).toFixed(2)+"</b>",
                                "Other"                  : "<b>" + Number(totalOther/100000).toFixed(2)+"</b>",
                            },
                            {              
                                "month"                  : "-",
                                "year"                   : "-",
                                "projectCategoryType"    : "-",
                                "projectName"            : "-",
                                "sector_ID"              : "-",
                                "sectorName"             : "<b>Total %</b>",
                                "activityName"           : "-",
                                "activity_ID"            : "-",
                                "subactivity_ID"         : "-",
                                "subactivityName"        : "-",
                                "unit"                   : "-",
                                "unitCost"               : " ",
                                "physicalUnit"           : " ",
                                "remark"                 : "-",
                                "Reach"                  : "-",
                                "FamilyUpgradation"      : "-",
                                "physicalUnit"           : "-",
                                "TotalBudget"            : totalTotalBudget > 0 ? "<b>"+Number((totalTotalBudget/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "LHWRF"                  : totalLHWRF > 0       ? "<b>"+Number((totalLHWRF/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "NABARD"                 : totalNABARD > 0      ? "<b>"+Number((totalNABARD/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "Bank_Loan"              : totalBank_Loan > 0   ? "<b>"+Number((totalBank_Loan/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "DirectCC"               : totalDirectCC > 0    ? "<b>"+Number((totalDirectCC/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "IndirectCC"             : totalIndirectCC > 0  ? "<b>"+Number((totalIndirectCC/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "Govt"                   : totalGovt > 0        ? "<b>"+Number((totalGovt/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                                "Other"                  : totalOther > 0       ? "<b>"+Number((totalOther/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+0+"</b>",
                            }
                        );
                    }
                    res.status(200).json(plandata);
                }
            })
            .catch(err =>{
                res.status(500).json({
                    error: err
                });
            });
    }
};

// router.get('/activity_annual_plans/:year/:center_ID/:projectCategoryType/:projectName/:sector_ID/:activity_ID/:subactivity_ID' ,  PlanningReportsController.reports_activity_annual_plan);
exports.reports_activity_annual_plan= (req,res,next)=>{ 
    var query = "1";
    if(req.params.center_ID == 'all'){
        if(req.params.projectCategoryType != "all"){
            if((req.params.projectCategoryType == "LHWRF Grant" || req.params.projectCategoryType == "Project Fund") && req.params.projectName == "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "year"                : req.params.year,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "year"                : req.params.year,
                        "projectCategoryType" : req.params.projectCategoryType,
                    }
                }
            }else if(req.params.projectCategoryType == "Project Fund" && req.params.projectName != "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "year"                : req.params.year,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "year"                : req.params.year,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "projectName"         : req.params.projectName,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "year"                : req.params.year,
                        "projectCategoryType" : req.params.projectCategoryType,
                        "projectName"         : req.params.projectName,
                    }
                }
                // query = {month:req.params.quarter,year:req.params.year, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
            }
        }else{            
            if(req.params.sector_ID != 'all'){
                if(req.params.activity_ID != 'all'){
                    if(req.params.subactivity_ID != 'all'){
                        query = {
                            "year"                : req.params.year,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                            "subactivity_ID"      : (req.params.subactivity_ID)      
                        }                            
                    }else{
                        query = {
                            "year"                : req.params.year,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                        }
                    };    
                }else{
                    query = {
                        "year"                : req.params.year,
                        "sector_ID"           : (req.params.sector_ID), 
                    }
                }
            }else{
                query = {
                    "year"                : req.params.year,
                }
            }
            // query = {month:req.params.quarter,year:req.params.year}
        }
    }else{
        if(req.params.projectCategoryType != "all"){
            if((req.params.projectCategoryType == "LHWRF Grant" || req.params.projectCategoryType == "Project Fund") && req.params.projectName == "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "year"                : req.params.year,
                        "center_ID"           : req.params.center_ID,
                        "projectCategoryType" : req.params.projectCategoryType,
                    }
                }
                // query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType}
            }else if(req.params.projectCategoryType == "Project Fund" && req.params.projectName != "all"){
                if(req.params.sector_ID != 'all'){
                    if(req.params.activity_ID != 'all'){
                        if(req.params.subactivity_ID != 'all'){
                            query = {
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                                "subactivity_ID"      : (req.params.subactivity_ID)      
                            }                            
                        }else{
                            query = {
                                "year"                : req.params.year,
                                "center_ID"           : req.params.center_ID,
                                "projectCategoryType" : req.params.projectCategoryType,
                                "projectName"         : req.params.projectName,
                                "sector_ID"           : (req.params.sector_ID), 
                                "activity_ID"         : (req.params.activity_ID),
                            }
                        };    
                    }else{
                        query = {
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "projectCategoryType" : req.params.projectCategoryType,
                            "projectName"         : req.params.projectName,
                            "sector_ID"           : (req.params.sector_ID), 
                        }
                    }
                }else{
                    query = {
                        "year"                : req.params.year,
                        "center_ID"           : req.params.center_ID,
                        "projectCategoryType" : req.params.projectCategoryType,
                        "projectName"         : req.params.projectName,
                    }
                }
                // query = {month:req.params.quarter,year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
            }
        }else{         
            if(req.params.sector_ID != 'all'){
                if(req.params.activity_ID != 'all'){
                    if(req.params.subactivity_ID != 'all'){
                        query = {
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                            "subactivity_ID"      : (req.params.subactivity_ID)      
                        }                            
                    }else{
                        query = {
                            "year"                : req.params.year,
                            "center_ID"           : req.params.center_ID,
                            "sector_ID"           : (req.params.sector_ID), 
                            "activity_ID"         : (req.params.activity_ID),
                        }
                    };    
                }else{
                    query = {
                        "year"                : req.params.year,
                        "center_ID"           : req.params.center_ID,
                        "sector_ID"           : (req.params.sector_ID), 
                    }
                }
            }else{
                query = {
                    "year"                : req.params.year,
                    "center_ID"           : req.params.center_ID,
                }
            }
        }
    }       
    // console.log('query',query);
    if(query != "1"){
        MonthlyPlan.aggregate([
                                {
                                    $match : query
                                },
                              
                                {
                                    $group: {
                                        _id : {
                                            // "year"                  :"$year",
                                            "projectCategoryType"   :"$projectCategoryType", 
                                            "projectName"           :"$projectName",
                                            "sector_ID"             :"$sector_ID",
                                            "sectorName"            :"$sectorName",
                                            "activityName"          :"$activityName",
                                            "activity_ID"           :"$activity_ID",
                                            "subactivity_ID"        :"$subactivity_ID",
                                            "subactivityName"       :"$subactivityName",
                                            "unit"                  :"$unit",
                                            "unitCost"              :"$unitCost",
                                        }, 
                                        "physicalUnit"      : { "$sum" : "$physicalUnit"},
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
                                    }  
                                }
                            ])
        .exec()
        .then(data=>{
            var plandata = [];
            // console.log('data',data);
                // res.status(200).json(data);
            if(data){
                var totalReach              = 0;
                var totalFamilyUpgradation  = 0;
                var totalTotalBudget        = 0;
                var totalLHWRF              = 0;
                var totalNABARD             = 0;
                var totalBank_Loan          = 0;
                var totalDirectCC           = 0;
                var totalIndirectCC         = 0;
                var totalGovt               = 0;
                var totalOther              = 0;
                var totalphysicalUnit       = 0;
                for(i = 0 ; i < data.length ; i ++){
                    totalReach                  += data[i].Reach;
                    totalFamilyUpgradation      += data[i].FamilyUpgradation;
                    // totalphysicalUnit           += data[i].physicalUnit;
                    totalTotalBudget            += data[i].TotalBudget  ? data[i].TotalBudget : 0;
                    totalLHWRF                  += data[i].LHWRF        ? data[i].LHWRF : 0;
                    totalNABARD                 += data[i].NABARD       ? data[i].NABARD : 0;
                    totalBank_Loan              += data[i].Bank_Loan    ? data[i].Bank_Loan : 0;
                    totalDirectCC               += data[i].DirectCC     ? data[i].DirectCC : 0;
                    totalIndirectCC             += data[i].IndirectCC   ? data[i].IndirectCC : 0;
                    totalGovt                   += data[i].Govt         ? data[i].Govt : 0;
                    totalOther                  += data[i].Other        ? data[i].Other : 0;
                 
                    var plandetails =  {              
                            "year"                   : data[i]._id.year,
                            "projectCategoryType"    : data[i]._id.projectCategoryType,
                            "projectName"            : data[i]._id.projectName,
                            "sector_ID"              : data[i]._id.sector_ID,
                            "sectorName"             : data[i]._id.sectorName,
                            "activityName"           : data[i]._id.activityName,
                            "activity_ID"            : data[i]._id.activity_ID,
                            "subactivity_ID"         : data[i]._id.subactivity_ID,
                            "subactivityName"        : data[i]._id.subactivityName,
                            "unit"                   : data[i]._id.unit,
                            "remark"                 : data[i]._id.remark,
                            "unitCost"               : data[i]._id.unitCost   ? Number(data[i]._id.unitCost/100000).toFixed(2) : 0,
                            "physicalUnit"           : data[i].physicalUnit,
                            "Reach"                  : data[i].Reach,
                            "FamilyUpgradation"      : data[i].FamilyUpgradation,
                            "TotalBudget"            : data[i].TotalBudget    ? Number(data[i].TotalBudget/100000).toFixed(2): 0,
                            "LHWRF"                  : data[i].LHWRF          ? Number(data[i].LHWRF/100000).toFixed(2): 0,
                            "NABARD"                 : data[i].NABARD         ? Number(data[i].NABARD/100000).toFixed(2): 0,
                            "Bank_Loan"              : data[i].Bank_Loan      ? Number(data[i].Bank_Loan/100000).toFixed(2): 0,
                            "DirectCC"               : data[i].DirectCC       ? Number(data[i].DirectCC/100000).toFixed(2): 0,
                            "IndirectCC"             : data[i].IndirectCC     ? Number(data[i].IndirectCC/100000).toFixed(2): 0,
                            "Govt"                   : data[i].Govt           ? Number(data[i].Govt/100000).toFixed(2): 0,
                            "Other"                  : data[i].Other          ? Number(data[i].Other/100000).toFixed(2): 0,
                        }
                    plandata.push(plandetails);      
                    // console.log('totalLHWRF',totalLHWRF);             
                }
                if(i >= data.length && data.length > 0){
                    plandata.push(                    
                        {              
                            "year"                   : "-",
                            "projectCategoryType"    : "-",
                            "projectName"            : "-",
                            "sector_ID"              : "-",
                            "sectorName"             : "<b>Total</b>",
                            "activityName"           : "-",
                            "activity_ID"            : "-",
                            "subactivity_ID"         : "-",
                            "subactivityName"        : "-",
                            "unit"                   : "-",
                            "unitCost"               : " ",
                            "physicalUnit"           : " ",
                            "remark"                 : "-",
                            "physicalUnit"           : "-",
                            "Reach"                  : totalReach,
                            "FamilyUpgradation"      : totalFamilyUpgradation,
                            "TotalBudget"            : "<b>"+Number(totalTotalBudget/100000).toFixed(2)+"</b>",
                            "LHWRF"                  : "<b>"+Number(totalLHWRF/100000).toFixed(2)+"</b>",
                            "NABARD"                 : "<b>"+Number(totalNABARD/100000).toFixed(2)+"</b>",
                            "Bank_Loan"              : "<b>"+Number(totalBank_Loan/100000).toFixed(2)+"</b>",
                            "DirectCC"               : "<b>"+Number(totalDirectCC/100000).toFixed(2)+"</b>",
                            "IndirectCC"             : "<b>"+Number(totalIndirectCC/100000).toFixed(2)+"</b>",
                            "Govt"                   : "<b>"+Number(totalGovt/100000).toFixed(2)+"</b>",
                            "Other"                  : "<b>"+Number(totalOther/100000).toFixed(2)+"</b>",
                        },
                        {              
                            "year"                   : "-",
                            "projectCategoryType"    : "-",
                            "projectName"            : "-",
                            "sector_ID"              : "-",
                            "sectorName"             : "<b>Total %</b>",
                            "activityName"           : "-",
                            "activity_ID"            : "-",
                            "subactivity_ID"         : "-",
                            "subactivityName"        : "-",
                            "unit"                   : "-",
                            "unitCost"               : " ",
                            "physicalUnit"           : " ",
                            "remark"                 : "-",
                            "Reach"                  : " ",
                            "FamilyUpgradation"      : " ",
                            "physicalUnit"           : " ",
                            "TotalBudget"            : totalTotalBudget > 0 ? "<b>"+Number((totalTotalBudget/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "LHWRF"                  : totalLHWRF > 0       ? "<b>"+Number((totalLHWRF/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "NABARD"                 : totalNABARD > 0      ? "<b>"+Number((totalNABARD/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "Bank_Loan"              : totalBank_Loan > 0   ? "<b>"+Number((totalBank_Loan/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "DirectCC"               : totalDirectCC > 0    ? "<b>"+Number((totalDirectCC/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "IndirectCC"             : totalIndirectCC > 0  ? "<b>"+Number((totalIndirectCC/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "Govt"                   : totalGovt > 0        ? "<b>"+Number((totalGovt/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                            "Other"                  : totalOther > 0       ? "<b>"+Number((totalOther/totalTotalBudget) * 100).toFixed(2) + "%"+"<b>" : "<b>"+0+"</b>",
                        }
                    );
                }
                res.status(200).json(plandata);
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
    }
};

exports.reports_sector_annual_plan= (req,res,next)=>{ 
    var query = "1";
        var query = "1";
    if(req.params.center_ID == 'all'){
        if(req.params.projectCategoryType != "all"){
            if(req.params.projectCategoryType == "LHWRF Grant"){
                query = {year:req.params.year, projectCategoryType : req.params.projectCategoryType}
            }else if(req.params.projectCategoryType == "Project Fund"){
                if(req.params.projectName == 'all'){
                    query = {year:req.params.year, projectCategoryType : req.params.projectCategoryType}
                }else{
                    query = {year:req.params.year, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
                }
            }
        }else{
            query = {year:req.params.year}
        }
    }else{
        if(req.params.projectCategoryType != "all"){
            if(req.params.projectCategoryType == "LHWRF Grant"){
                query = {year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType}
            }else if(req.params.projectCategoryType == "Project Fund"){
                if(req.params.projectName == 'all'){
                    query = {year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType}
                }else{
                    query = {year:req.params.year, center_ID : req.params.center_ID, projectCategoryType : req.params.projectCategoryType, projectName : req.params.projectName}
                }
            }
        }else{
            query = {year:req.params.year, center_ID : req.params.center_ID}
        }
    }
    // console.log('query',query);

    if(query != "1"){
        MonthlyPlan.aggregate([
                                {
                                    $match : query
                                },
                                {
                                    $group: {
                                        _id : {
                                            "year"                  :"$year",
                                            "projectCategoryType"   :"$projectCategoryType", 
                                            "projectName"           :"$projectName",
                                            "sector_ID"             :"$sector_ID",
                                            "sectorName"            :"$sectorName",
                                        }, 
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
                                    }  
                                },
                                {
                                    $project: {
                                        "_id"                    : 0,                  
                                        "year"                   : "$_id.year",
                                        "projectCategoryType"    : "$_id.projectCategoryType",
                                        "projectName"            : "$_id.projectName",
                                        "sector_ID"              : "$_id.sector_ID",
                                        "sectorName"             : "$_id.sectorName",
                                        "Reach"                  : 1,
                                        "FamilyUpgradation"      : 1,
                                        "TotalBudget"            : 1,
                                        "LHWRF"                  : 1,
                                        "NABARD"                 : 1,
                                        "Bank_Loan"              : 1,
                                        "DirectCC"               : 1,
                                        "IndirectCC"             : 1,
                                        "Govt"                   : 1,
                                        "Other"                  : 1,
                                    }
                                },                   
                              
                            ])
        .exec()
        .then(data=>{
            var plandata = [];
            // console.log('data',data);
            if(data){
                var totalReach              = 0;
                var totalFamilyUpgradation  = 0;
                var totalTotalBudget        = 0;
                var totalLHWRF              = 0;
                var totalNABARD             = 0;
                var totalBank_Loan          = 0;
                var totalDirectCC           = 0;
                var totalIndirectCC         = 0;
                var totalGovt               = 0;
                var totalOther              = 0;
                for(i = 0 ; i < data.length ; i ++){
                    totalReach                  += data[i].Reach;
                    totalFamilyUpgradation      += data[i].FamilyUpgradation;
                    totalTotalBudget            += data[i].TotalBudget ? data[i].TotalBudget : 0;
                    totalLHWRF                  += data[i].LHWRF       ? data[i].LHWRF : 0;
                    totalNABARD                 += data[i].NABARD      ? data[i].NABARD : 0;
                    totalBank_Loan              += data[i].Bank_Loan   ? data[i].Bank_Loan : 0;
                    totalDirectCC               += data[i].DirectCC    ? data[i].DirectCC : 0;
                    totalIndirectCC             += data[i].IndirectCC  ? data[i].IndirectCC : 0;
                    totalGovt                   += data[i].Govt        ? data[i].Govt : 0;
                    totalOther                  += data[i].Other       ? data[i].Other : 0;
                    var plandetails =  {              
                            "year"                   : data[i].year,
                            "projectCategoryType"    : data[i].projectCategoryType,
                            "projectName"            : data[i].projectName,
                            "sector_ID"              : data[i].sector_ID,
                            "sectorName"             : data[i].sectorName,
                            "Reach"                  : data[i].Reach,
                            "FamilyUpgradation"      : data[i].FamilyUpgradation,
                            "TotalBudget"            : data[i].TotalBudget ? Number(data[i].TotalBudget/100000).toFixed(2) : 0,
                            "LHWRF"                  : data[i].LHWRF       ? Number(data[i].LHWRF/100000).toFixed(2) : 0,
                            "NABARD"                 : data[i].NABARD      ? Number(data[i].NABARD/100000).toFixed(2) : 0,
                            "Bank_Loan"              : data[i].Bank_Loan   ? Number(data[i].Bank_Loan/100000).toFixed(2) : 0,
                            "DirectCC"               : data[i].DirectCC    ? Number(data[i].DirectCC/100000).toFixed(2) : 0,
                            "IndirectCC"             : data[i].IndirectCC  ? Number(data[i].IndirectCC/100000).toFixed(2) : 0,
                            "Govt"                   : data[i].Govt        ? Number(data[i].Govt/100000).toFixed(2) : 0,
                            "Other"                  : data[i].Other       ? Number(data[i].Other/100000).toFixed(2) : 0,
                        }
                    plandata.push(plandetails);      
                    // console.log('totalLHWRF',totalLHWRF);             
                }
                if(i >= data.length && data.length > 0){
                    plandata.push(                    
                        {              
                            "year"                   : "-",
                            "projectCategoryType"    : "-",
                            "projectName"            : "-",
                            "sector_ID"              : "-",
                            "sectorName"             : "<b>Total</b>",
                            "Reach"                  : totalReach,
                            "FamilyUpgradation"      : totalFamilyUpgradation,
                            "TotalBudget"            : "<b>"+Number(totalTotalBudget/100000).toFixed(2)+"</b>",
                            "LHWRF"                  : "<b>"+Number(totalLHWRF/100000).toFixed(2)+"</b>",
                            "NABARD"                 : "<b>"+Number(totalNABARD/100000).toFixed(2)+"</b>",
                            "Bank_Loan"              : "<b>"+Number(totalBank_Loan/100000).toFixed(2)+"</b>",
                            "DirectCC"               : "<b>"+Number(totalDirectCC/100000).toFixed(2)+"</b>",
                            "IndirectCC"             : "<b>"+Number(totalIndirectCC/100000).toFixed(2)+"</b>",
                            "Govt"                   : "<b>"+Number(totalGovt/100000).toFixed(2)+"</b>",
                            "Other"                  : "<b>"+Number(totalOther/100000).toFixed(2)+"</b>",
                        },
                        {              
                            "year"                   : "-",
                            "projectCategoryType"    : "-",
                            "projectName"            : "-",
                            "sector_ID"              : "-",
                            "sectorName"             : "<b>Total %</b>",
                            "Reach"                  : " ",
                            "FamilyUpgradation"      : " ",
                            "TotalBudget"            : totalTotalBudget > 0 ? "<b>"+Number((totalTotalBudget/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "LHWRF"                  : totalLHWRF > 0       ? "<b>"+Number((totalLHWRF/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "NABARD"                 : totalNABARD > 0      ? "<b>"+Number((totalNABARD/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "Bank_Loan"              : totalBank_Loan > 0   ? "<b>"+Number((totalBank_Loan/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "DirectCC"               : totalDirectCC > 0    ? "<b>"+Number((totalDirectCC/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "IndirectCC"             : totalIndirectCC > 0  ? "<b>"+Number((totalIndirectCC/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "Govt"                   : totalGovt > 0        ? "<b>"+Number((totalGovt/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                            "Other"                  : totalOther > 0       ? "<b>"+Number((totalOther/totalTotalBudget) * 100).toFixed(2) + "%"+"</b>" : "<b>"+ 0 + "</b>",
                        }
                    );
                }
                res.status(200).json(plandata);
            }
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
    }
};

