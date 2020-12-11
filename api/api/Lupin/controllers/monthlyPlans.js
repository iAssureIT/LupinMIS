const mongoose          = require("mongoose");
var moment              = require('moment');
const _                 = require("underscore");

const AnnualPlan        = require('../models/annualPlans');
const MonthlyPlan       = require('../models/monthlyPlans');
const ProjectMapping    = require('../models/projectMappings');
const Sectors           = require('../models/sectors');
const FailedRecords     = require('../models/failedRecords');

exports.create_monthlyPlan = (req,res,next)=>{
    MonthlyPlan.findOne(
            { 
                $and: 
                    [ 
                        { 
                            "center_ID"                 : req.body.center_ID,
                        },    
                        { 
                            "center"                    : req.body.center,
                        }, 
                        { 
                            "sectorName"                : req.body.sectorName,
                        }, 
                        { 
                            "activityName"              : req.body.activityName
                        }, 
                        { 
                            "subactivityName"           : req.body.subactivityName,
                        }, 
                        { 
                            "month"                     : req.body.month,
                        }, 
                        { 
                            "year"                      : req.body.year,
                        }, 
                        { 
                            "projectCategoryType"       : req.body.projectCategoryType
                        }, 
                        { 
                            "projectName"               : req.body.projectName
                        } 
                    ] 
            }
        )
        .exec()
        .then(data =>{
            // console.log("dataExists========",data);
            if(data){
                res.status(200).json({message: "Plan already exists for given Year and Quarter"})
            }else{
                const monthlyPlan = new MonthlyPlan({
                    _id                 : new mongoose.Types.ObjectId(),    
                    startDate           : req.body.startDate,               
                    endDate             : req.body.endDate,               
                    month               : req.body.month,               
                    year                : req.body.year,
                    center_ID           : req.body.center_ID,
                    center              : req.body.center,
                    projectCategoryType : req.body.projectCategoryType, //"LHWRFGrand" or "ProjectFund"
                    projectName         : req.body.projectName,
                    type                : req.body.type,
                    sector_ID           : req.body.sector_ID,
                    sectorName          : req.body.sectorName,
                    activityName        : req.body.activityName,
                    activity_ID         : req.body.activity_ID,
                    subactivity_ID      : req.body.subactivity_ID,
                    subactivityName     : req.body.subactivityName,
                    unit                : req.body.unit,
                    physicalUnit        : req.body.physicalUnit,
                    unitCost            : req.body.unitCost,
                    totalBudget         : req.body.totalBudget,
                    noOfBeneficiaries   : req.body.noOfBeneficiaries,
                    noOfFamilies        : req.body.noOfFamilies,
                    LHWRF               : req.body.LHWRF,
                    NABARD              : req.body.NABARD,
                    bankLoan            : req.body.bankLoan,
                    govtscheme          : req.body.govtscheme,
                    directCC            : req.body.directCC,
                    indirectCC          : req.body.indirectCC,
                    other               : req.body.other,
                    remark              : req.body.remark,
                    createdAt           : new Date()
                });
                monthlyPlan.save()
                    .then(data=>{
                        // console.log(data._id);
                        getActivityData(); 
                        async function getActivityData(){
                            var fetch_monthlyPlan       = await fetch_monthlyPlanData(data._id);                        
                            var availableQs             = await AllmonthlyPlan({
                                                                $match : {
                                                                            "center_ID"     : fetch_monthlyPlan[0].center_ID, 
                                                                            "year"          : fetch_monthlyPlan[0].year, 
                                                                            "sector_ID"     : fetch_monthlyPlan[0].sector_ID, 
                                                                            "activity_ID"   : fetch_monthlyPlan[0].activity_ID, 
                                                                            "subactivity_ID":  fetch_monthlyPlan[0].subactivity_ID
                                                                        }
                                                            });
                            // console.log("availableQs==========",availableQs)
                            for(var i = 0 ; i < availableQs.length ; i++){
                                var quarter1 = availableQs.filter((quarterMonth)=>{
                                    if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                                })
                                var quarter2 = availableQs.filter((quarterMonth)=>{
                                    if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                                })
                                var quarter3 = availableQs.filter((quarterMonth)=>{
                                    if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                                })
                                var quarter4 = availableQs.filter((quarterMonth)=>{
                                    if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                                })
                                    // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                                if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                                    // console.log("availableQs",availableQs);
                                    var availableAnnualPlan    = await fetch_annualPlan(fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                                    
                                    var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                                    var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                                    var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                                    var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                                    var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                                    var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                                    var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                                    var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                                    var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                                    var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                                    var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);
                                    var unitCost               = parseFloat(req.body.unitCost);
                                    // console.log("totalLHWRF",totalLHWRF,"totalNABARD",totalNABARD,"totalgovtscheme",totalgovtscheme,"totalbankLoan",totalbankLoan,"totalother",totalother);
                                    // console.log("totaldirectCC",totaldirectCC,"totalindirectCC",totalindirectCC,"totaltotalBudget",totaltotalBudget)
                                    if(availableAnnualPlan){
                                        if(totalnoOfFamilies==availableAnnualPlan.noOfFamilies && totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries && totalphysicalUnit==availableAnnualPlan.physicalUnit && totaltotalBudget==availableAnnualPlan.totalBudget &&totalLHWRF==availableAnnualPlan.LHWRF && totalNABARD==availableAnnualPlan.NABARD && totalgovtscheme==availableAnnualPlan.govtscheme && totalbankLoan==availableAnnualPlan.bankLoan && totalother==availableAnnualPlan.other && totaldirectCC==availableAnnualPlan.directCC && totalindirectCC==availableAnnualPlan.indirectCC){
                                            // console.log("availableAnnualPlan.length> 0",availableAnnualPlan)
                                        }else{
                                            // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                                            var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
                                        }
                                    }else{
                                        var createAnnualPlan   = await create_annualPlan(req.body, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
                                    }
                                }
                            }
                        }
                        res.status(200).json({
                           "message": "Quarter Plan Details submitted Successfully"
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.update_monthlyPlan = (req,res,next)=>{
    MonthlyPlan.updateOne(
            { _id:req.body.monthlyPlan_ID},  
            {
                $set:{    
                    startDate           : req.body.startDate,               
                    endDate             : req.body.endDate,             
                    month               : req.body.month,               
                    year                : req.body.year,
                    center_ID           : req.body.center_ID,
                    center              : req.body.center,
                    projectCategoryType : req.body.projectCategoryType, //"LHWRFGrand" or "ProjectFund"
                    projectName         : req.body.projectName,
                    type                : req.body.type,
                    sector_ID           : req.body.sector_ID,
                    sectorName          : req.body.sectorName,
                    activityName        : req.body.activityName,
                    activity_ID         : req.body.activity_ID,
                    subactivity_ID      : req.body.subactivity_ID,
                    subactivityName     : req.body.subactivityName,
                    unit                : req.body.unit,
                    physicalUnit        : req.body.physicalUnit,
                    unitCost            : req.body.unitCost,
                    totalBudget         : req.body.totalBudget,
                    noOfBeneficiaries   : req.body.noOfBeneficiaries,
                    noOfFamilies        : req.body.noOfFamilies,
                    LHWRF               : req.body.LHWRF,
                    NABARD              : req.body.NABARD,
                    bankLoan            : req.body.bankLoan,
                    govtscheme          : req.body.govtscheme,
                    directCC            : req.body.directCC,
                    indirectCC          : req.body.indirectCC,
                    other               : req.body.other,
                    remark              : req.body.remark,
                    createdAt           : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                // console.log(req.body.monthlyPlan_ID);
                getActivityData(); 
                async function getActivityData(){
                    var fetch_monthlyPlan       = await fetch_monthlyPlanData(req.body.monthlyPlan_ID);                        
                    var availableQs             = await AllmonthlyPlan({
                                                        $match : {
                                                                    "center_ID"     : fetch_monthlyPlan[0].center_ID, 
                                                                    "year"          : fetch_monthlyPlan[0].year, 
                                                                    "sector_ID"     : fetch_monthlyPlan[0].sector_ID, 
                                                                    "activity_ID"   : fetch_monthlyPlan[0].activity_ID, 
                                                                    "subactivity_ID":  fetch_monthlyPlan[0].subactivity_ID
                                                                }
                                                    });
                    // console.log("availableQs==========",availableQs)
                    for(var i = 0 ; i < availableQs.length ; i++){
                        var quarter1 = availableQs.filter((quarterMonth)=>{
                            if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                        })
                        var quarter2 = availableQs.filter((quarterMonth)=>{
                            if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                        })
                        var quarter3 = availableQs.filter((quarterMonth)=>{
                            if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                        })
                        var quarter4 = availableQs.filter((quarterMonth)=>{
                            if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                        })
                            // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                        if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                            var availableAnnualPlan    = await fetch_annualPlan(fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                            // console.log("availableAnnualPlan",availableAnnualPlan);
                            
                            var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                            var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                            var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                            var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                            var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                            var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                            var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                            var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                            var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                            var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                            var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);
                            var unitCost               = parseFloat(req.body.unitCost);
                            // console.log("totalLHWRF",totalLHWRF,"totalNABARD",totalNABARD,"totalgovtscheme",totalgovtscheme,"totalbankLoan",totalbankLoan,"totalother",totalother);
                            // console.log("totaldirectCC",totaldirectCC,"totalindirectCC",totalindirectCC,"totaltotalBudget",totaltotalBudget)
                            if(availableAnnualPlan){
                                // console.log(totalnoOfFamilies==availableAnnualPlan.noOfFamilies , totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries , totalphysicalUnit==availableAnnualPlan.physicalUnit , totaltotalBudget==availableAnnualPlan.totalBudget ,totalLHWRF==availableAnnualPlan.LHWRF , totalNABARD==availableAnnualPlan.NABARD , totalgovtscheme==availableAnnualPlan.govtscheme , totalbankLoan==availableAnnualPlan.bankLoan , totalother==availableAnnualPlan.other , totaldirectCC==availableAnnualPlan.directCC , totalindirectCC==availableAnnualPlan.indirectCC)
                                if(totalnoOfFamilies==availableAnnualPlan.noOfFamilies && totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries && totalphysicalUnit==availableAnnualPlan.physicalUnit && totaltotalBudget==availableAnnualPlan.totalBudget &&totalLHWRF==availableAnnualPlan.LHWRF && totalNABARD==availableAnnualPlan.NABARD && totalgovtscheme==availableAnnualPlan.govtscheme && totalbankLoan==availableAnnualPlan.bankLoan && totalother==availableAnnualPlan.other && totaldirectCC==availableAnnualPlan.directCC && totalindirectCC==availableAnnualPlan.indirectCC){
                                    // console.log("availableAnnualPlan.length> 0",availableAnnualPlan)
                                }else{
                                    // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                                    var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
                                    // console.log("updateAnnualPlan",updateAnnualPlan)
                                }
                            }else{
                                var createAnnualPlan   = await create_annualPlan(req.body, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
                                // console.log("createAnnualPlan",createAnnualPlan)
                            }
                        }
                    }
                }
                res.status(200).json({
                    "message": "Quarter Plan Details updated Successfully."
                });
                //     res.status(200).json({
                //         "message": "Monthly Plan Details updated Successfully."
                //     });
            }else{
                res.status(200).json({
                    "message": "Quarter Plan Details not modified"
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
function create_annualPlan(data, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost){
    return new Promise(function(resolve,reject){
        var FYYear = data.year;
        // console.log("create_annualPlanreQ",data)
        const annualPlan = new AnnualPlan({
            _id                 : new mongoose.Types.ObjectId(),     
            month               : "Annual Plan",               
            year                : data.year,
            startDate           : FYYear.substring(3, 7)+"-04-01",
            endDate             : FYYear.substring(10,15)+"-03-31",
            projectCategoryType : data.projectCategoryType, //"LHWRFGrand" or "ProjectFund"
            projectName         : data.projectCategoryType =='LHWRF Grant'?'all':data.projectName,
            // projectName         : data.projectName,
            type                : data.type,
            center_ID           : data.center_ID,
            center              : data.center,
            sector_ID           : data.sector_ID,
            sectorName          : data.sectorName,
            activityName        : data.activityName,
            activity_ID         : data.activity_ID,
            subactivity_ID      : data.subactivity_ID,
            subactivityName     : data.subactivityName,
            unit                : data.unit,
            unitCost            : unitCost,
            physicalUnit        : totalphysicalUnit,
            totalBudget         : totaltotalBudget,
            noOfBeneficiaries   : totalnoOfBeneficiaries,
            noOfFamilies        : totalnoOfFamilies,
            LHWRF               : totalLHWRF,
            NABARD              : totalNABARD,
            bankLoan            : totalbankLoan,
            govtscheme          : totalgovtscheme,
            directCC            : totaldirectCC,
            indirectCC          : totalindirectCC,
            other               : totalother,
            remark              : data.remark,
            createdAt           : new Date()
        });
        annualPlan.save()
        .then(data=>{
            // console.log("annualPlan data=======",data);
            resolve(data);
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    });
};
function update_annualPlan(_id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost){
    // console.log(_id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
    return new Promise(function(resolve,reject){
        AnnualPlan.updateOne(
            { _id:_id},  
            {
                $set:{
                    unitCost            : unitCost,
                    physicalUnit        : totalphysicalUnit,
                    totalBudget         : totaltotalBudget,
                    noOfBeneficiaries   : totalnoOfBeneficiaries,
                    noOfFamilies        : totalnoOfFamilies,
                    LHWRF               : totalLHWRF,
                    NABARD              : totalNABARD,
                    bankLoan            : totalbankLoan,
                    govtscheme          : totalgovtscheme,
                    directCC            : totaldirectCC,
                    indirectCC          : totalindirectCC,
                    other               : totalother,
                    updatedAt           : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                // console.log("update_annualPlan data=======",data);
                resolve(data);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
};
function fetch_annualPlan(center_ID, year, sector_ID, activity_ID, subactivity_ID, projectCategoryType, projectName){
    // console.log("fetch_annualPlan",center_ID, year, sector_ID, activity_ID, subactivity_ID, projectCategoryType, projectName);
    return new Promise(function(resolve,reject){
        AnnualPlan.findOne({
            "center_ID"           : center_ID, 
            "year"                : year, 
            "sector_ID"           : sector_ID, 
            "activity_ID"         : activity_ID, 
            "subactivity_ID"      : subactivity_ID,
            "projectCategoryType" : projectCategoryType,
            "projectName"         : projectName =="-" || projectName =="all" ? "all" : projectName
        })
            .exec()
            .then(data=>{
                // console.log(data);
                resolve(data);
            })
            .catch(err=>{
                reject(err);
            });
    }); 
};
function AllmonthlyPlan(searchQuery){
    // console.log("searchQuery ",searchQuery);
    return new Promise(function(resolve,reject){
        MonthlyPlan.aggregate([
                searchQuery,
            ])
            .exec()
            .then(data=>{
                // console.log(data);
                resolve(data);
             
            })
            .catch(err=>{
                console.log(err);
                reject(err);
            });
    }); 
};
function fetch_monthlyPlanData(monthlyPlanID){
    return new Promise((resolve,reject)=>{
    MonthlyPlan.find({_id : monthlyPlanID})
        .exec()
        .then(data=>{
            // console.log("fetch_monthlyPlan",data);
            resolve(data);
        })
        .catch(err =>{
            reject(err);
        });
    });
};
exports.list_monthlyPlan = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        MonthlyPlan.find(query)       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
};
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
exports.list_monthlyPlan_with_limits = (req,res,next)=>{
    // var query = {month:req.body.month,year:req.body.year, center_ID : req.body.center_ID};
    var query = "1";
    if(req.body.month === 'All Months'){
        if(req.body.center_ID === "all"){
            query = {year:req.body.year}
        }else{
            query = {year:req.body.year, center_ID : req.body.center_ID}
        }
    }else if (req.body.month === 'Till Date'){ 
        var deriveDate = derive_year_month({
                                                startDate : req.body.startDate,
                                                endDate   : req.body.endDate,
                                            });
        if(deriveDate){
            if(req.body.center_ID === "all"){
                query = {month:{$in : deriveDate.monthList},year:req.body.year}
            }else{
                query = {month:{$in : deriveDate.monthList},year:req.body.year, center_ID : req.body.center_ID}
            }
        }
    }else {
        if(req.body.center_ID === 'all'){
            query = {month:req.body.month,year:req.body.year}
        }else{
            query = {month:req.body.month,year:req.body.year, center_ID : req.body.center_ID}
        }
    }
    // console.log("query",query);
    if(query != "1"){
        MonthlyPlan.find(query)
        // .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            if(data){
                var alldata = data.map((a, i)=>{
                    // console.log("a ",a);
                    return {
                        "_id"                 : a._id,
                        "month"               : a.month,
                        "year"                : '<div class="noWrapText text-left">'+a.year+'</p>',
                        "startDate"           : a.startDate,
                        "endDate"             : a.endDate,
                        "projectCategoryType" : a.projectCategoryType,
                        "projectName"         : a.projectName,
                        "type"                : a.type,
                        "center_ID"           : a.center_ID,
                        "center"              : a.center,
                        "sector_ID"           : a.sector_ID,
                        "activity_ID"         : a.activity_ID,
                        "subactivity_ID"      : a.subactivity_ID,
                        "sectorName"          : '<div class="wrapText text-left">'+a.sectorName+'</p>',
                        "activityName"        : '<div class="wrapText text-left">'+a.activityName+'</p>',
                        "subactivityName"     : '<div class="wrapText text-left">'+a.subactivityName+'</p>',
                        "unit"                : a.unit,
                        "physicalUnit"        : a.physicalUnit,
                        "unitCost"            : a.unitCost,
                        "totalBudget"         : a.totalBudget,
                        "noOfBeneficiaries"   : a.noOfBeneficiaries,
                        "noOfFamilies"        : a.noOfFamilies,
                        "LHWRF"               : a.LHWRF,
                        "NABARD"              : a.NABARD,
                        "bankLoan"            : a.bankLoan,
                        "govtscheme"          : a.govtscheme,
                        "directCC"            : a.directCC,
                        "indirectCC"          : a.indirectCC,
                        "other"               : a.other,
                        "remark"              : '<div class="wrapText text-left">'+a.remark+'</p>',
                        "fileName"            : a.fileName,
                    }
                })
                res.status(200).json(alldata.slice(req.body.startRange, req.body.limitRange));
            }
        })
        .catch(err =>{
            // console.log("err===========================",err);
            res.status(500).json({
                error: err
            });
        });
    }
};
exports.count_monthlyPlan = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        MonthlyPlan.find({})
        .exec()
        .then(data=>{
            res.status(200).json({"dataCount":data.length});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
};
exports.fetch_monthlyPlan = (req,res,next)=>{
    MonthlyPlan.find({_id : req.params.monthlyPlanID})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete_monthlyPlan = (req,res,next)=>{
    var fetch_monthlyPlan = [];
    var center_ID         = [];
    var year              = [];
    var sector_ID         = [];
    var activity_ID       = [];
    var subactivity_ID    = [];
    getData(); 
    async function getData(){
        fetch_monthlyPlan = await fetch_monthlyPlanData(req.params.monthlyPlanID); 
        center_ID         = fetch_monthlyPlan[0].center_ID;
        year              = fetch_monthlyPlan[0].year;
        sector_ID         = fetch_monthlyPlan[0].sector_ID;
        activity_ID       = fetch_monthlyPlan[0].activity_ID;
        subactivity_ID    = fetch_monthlyPlan[0].subactivity_ID;
        // console.log("fetch_monthlyPlan",fetch_monthlyPlan);
        MonthlyPlan.deleteOne({_id:req.params.monthlyPlanID})
            .exec()
            .then(data=>{
                getData(); 
                async function getData(){
                    // console.log("center_ID",center_ID,"year",year, "sector_ID",sector_ID,"activity_ID",activity_ID,"subactivity_ID",subactivity_ID);
                    var availableQs             = await AllmonthlyPlan({
                                                    $match : {
                                                            "center_ID"     : center_ID, 
                                                            "year"          : year, 
                                                            "sector_ID"     : sector_ID, 
                                                            "activity_ID"   : activity_ID, 
                                                            "subactivity_ID": subactivity_ID
                                                        }
                                                    });
                    // console.log("availableQs",availableQs);
                    var quarter1 = availableQs.filter((quarterMonth)=>{
                    // console.log("quarterMonth",quarterMonth);
                        if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                    })
                    var quarter2 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                    })
                    var quarter3 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                    })
                    var quarter4 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                    })  
                    var availableAnnualPlan    = await fetch_annualPlan(fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                    // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                    // console.log("availableAnnualPlan.length> 0",availableAnnualPlan);
                    if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                        var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                        var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                        var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                        var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                        var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                        var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                        var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                        var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                        var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                        var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                        var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);
                        var totalunitCost          = parseFloat(fetch_monthlyPlan[0].unitCost);
                        // console.log("totalLHWRF",totalLHWRF,"totalNABARD",totalNABARD,"totalgovtscheme",totalgovtscheme,"totalbankLoan",totalbankLoan,"totalother",totalother);
                        // console.log("totaldirectCC",totaldirectCC,"totalindirectCC",totalindirectCC,"totaltotalBudget",totaltotalBudget)
                        if(availableAnnualPlan){
                            // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                            var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, totalunitCost);
                        }
                    }else if(quarter1.length==0 && quarter2.length==0 && quarter3.length==0 && quarter4.length==0){
                        if(availableAnnualPlan){
                            // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                            var deleteAnnualPlan   = await delete_annualPlan(availableAnnualPlan._id);
                        }
                    }
                }
                res.status(200).json({
                    "message":"Quarter Plan Details deleted Successfully"
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};
function delete_annualPlan(annualPlanID){
    return new Promise((resolve,reject)=>{
        AnnualPlan.deleteOne({_id : annualPlanID})
        .exec()
        .then(data=>{
            // console.log('delete_annualPlandata',data);
            resolve(data);
        })
        .catch(err =>{
          reject(err);
        });
    });
};
function insert_manualPlan(manualPlans,reqdata,sector,fileName){
    return new Promise((resolve,reject)=>{
    MonthlyPlan.find()
        .exec()
        .then(data =>{
                const monthlyPlan = new MonthlyPlan({
                    _id             : new mongoose.Types.ObjectId(),    
                    month               : reqdata.month,               
                    year                : reqdata.year,
                    center_ID           : reqdata.center_ID,
                    center              : reqdata.center,
                    projectCategoryType : reqdata.projectCategoryType, //"LHWRFGrand" or "ProjectFund"
                    projectName         : reqdata.projectName,
                    sector_ID           : sector.sector_ID,
                    sectorName          : manualPlans.sectorName,
                    activityName        : manualPlans.activityName,
                    activity_ID         : sector.activity_ID,
                    subactivity_ID      : sector.subactivity_ID,
                    subactivityName     : manualPlans.subactivityName,
                    unit                : manualPlans.unit,
                    physicalUnit        : parseFloat(manualPlans.physicalUnit),
                    unitCost            : parseFloat(manualPlans.unitCost),
                    totalBudget         : parseFloat(manualPlans.physicalUnit) * parseFloat(manualPlans.unitCost),
                    noOfBeneficiaries   : manualPlans.noOfBeneficiaries,
                    noOfFamilies        : manualPlans.noOfFamilies,
                    LHWRF               : manualPlans.LHWRF,
                    NABARD              : manualPlans.NABARD,
                    bankLoan            : manualPlans.bankLoan,
                    govtscheme          : manualPlans.govtscheme,
                    directCC            : manualPlans.directCC,
                    indirectCC          : manualPlans.indirectCC,
                    other               : manualPlans.other,
                    remark              : manualPlans.remark,
                    fileName            : fileName,
                    createdAt           : new Date()
                });
                monthlyPlan.save()
                    .then(data=>{
                        resolve({"data": data,"message": "Monthly Plan Details submitted Successfully", "created": 1})
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err)
                    });
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });
}
function update_monthlyPlanData(editData){
    var editDatas = editData;
    return new Promise(function(resolve,reject){
        for(var k = 0 ; k < editData.length ; k++){
            // console.log("editData",editData[k]._id);
            var editId = editData[k]._id;
            if(editData[k]._id){
                MonthlyPlan.updateOne(
                        { _id:editData[k]._id},  
                        {
                            $set:{    
                                startDate           : editData[k].startDate,               
                                endDate             : editData[k].endDate,             
                                month               : editData[k].month,               
                                year                : editData[k].year,
                                center_ID           : editData[k].center_ID,
                                center              : editData[k].center,
                                projectCategoryType : editData[k].projectCategoryType, //"LHWRFGrand" or "ProjectFund"
                                projectName         : editData[k].projectCategoryType=='LHWRF Grant'?'all':editData[k].projectName,
                                // projectName         : editData[k].projectName,
                                type                : editData[k].projectCategoryType== "LHWRF Grant" ? true : false,
                                sector_ID           : editData[k].sector_ID,
                                sectorName          : editData[k].sectorName,
                                activityName        : editData[k].activityName,
                                activity_ID         : editData[k].activity_ID,
                                subactivity_ID      : editData[k].subactivity_ID,
                                subactivityName     : editData[k].subactivityName,
                                unit                : editData[k].unit,
                                physicalUnit        : editData[k].physicalUnit,
                                unitCost            : editData[k].unitCost,
                                totalBudget         : editData[k].totalBudget,
                                noOfBeneficiaries   : editData[k].noOfBeneficiaries,
                                noOfFamilies        : editData[k].noOfFamilies,
                                LHWRF               : editData[k].LHWRF,
                                NABARD              : editData[k].NABARD,
                                bankLoan            : editData[k].bankLoan,
                                govtscheme          : editData[k].govtscheme,
                                directCC            : editData[k].directCC,
                                indirectCC          : editData[k].indirectCC,
                                other               : editData[k].other,
                                remark              : editData[k].remark,
                                createdAt           : new Date()
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        // console.log("editId==",editId);
                        // console.log("editDatas===", editDatas);
                        for(var j = 0 ; j < editDatas.length ; j++){
                        // console.log("editDatas===", editDatas[j].unitCost);
                        var unitCost               = parseFloat(editDatas[j].unitCost);
                        // console.log('unitCost',unitCost);
                            if(data){
                                getActivityData(); 
                                async function getActivityData(){
                                    var fetch_monthlyPlan       = await fetch_monthlyPlanData(editId);                        
                                    var availableQs             = await AllmonthlyPlan({
                                                                        $match : {
                                                                                    "center_ID"     : fetch_monthlyPlan[0].center_ID, 
                                                                                    "year"          : fetch_monthlyPlan[0].year, 
                                                                                    "sector_ID"     : fetch_monthlyPlan[0].sector_ID, 
                                                                                    "activity_ID"   : fetch_monthlyPlan[0].activity_ID, 
                                                                                    "subactivity_ID":  fetch_monthlyPlan[0].subactivity_ID
                                                                                }
                                                                    });
                                    // console.log("fetch_monthlyPlan==========",fetch_monthlyPlan)
                                    for(var i = 0 ; i < availableQs.length ; i++){
                                        var quarter1 = availableQs.filter((quarterMonth)=>{
                                            if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                                        })
                                        var quarter2 = availableQs.filter((quarterMonth)=>{
                                            if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                                        })
                                        var quarter3 = availableQs.filter((quarterMonth)=>{
                                            if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                                        })
                                        var quarter4 = availableQs.filter((quarterMonth)=>{
                                            if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                                        })
                                            // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                                        if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                                            // console.log("availableQs",availableQs);
                                            var availableAnnualPlan    = await fetch_annualPlan(fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                                            
                                            var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                                            var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                                            var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                                            var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                                            var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                                            var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                                            var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                                            var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                                            var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                                            var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                                            var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);

                                            // console.log("totalLHWRF",totalLHWRF,"totalNABARD",totalNABARD,"totalgovtscheme",totalgovtscheme,"totalbankLoan",totalbankLoan,"totalother",totalother);
                                            // console.log("totaldirectCC",totaldirectCC,"totalindirectCC",totalindirectCC,"totaltotalBudget",totaltotalBudget)
                                            if(availableAnnualPlan){
                                                // console.log(totalnoOfFamilies==availableAnnualPlan.noOfFamilies , totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries , totalphysicalUnit==availableAnnualPlan.physicalUnit , totaltotalBudget==availableAnnualPlan.totalBudget ,totalLHWRF==availableAnnualPlan.LHWRF , totalNABARD==availableAnnualPlan.NABARD , totalgovtscheme==availableAnnualPlan.govtscheme , totalbankLoan==availableAnnualPlan.bankLoan , totalother==availableAnnualPlan.other , totaldirectCC==availableAnnualPlan.directCC , totalindirectCC==availableAnnualPlan.indirectCC)
                                                if(totalnoOfFamilies==availableAnnualPlan.noOfFamilies && totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries && totalphysicalUnit==availableAnnualPlan.physicalUnit && totaltotalBudget==availableAnnualPlan.totalBudget &&totalLHWRF==availableAnnualPlan.LHWRF && totalNABARD==availableAnnualPlan.NABARD && totalgovtscheme==availableAnnualPlan.govtscheme && totalbankLoan==availableAnnualPlan.bankLoan && totalother==availableAnnualPlan.other && totaldirectCC==availableAnnualPlan.directCC && totalindirectCC==availableAnnualPlan.indirectCC){
                                                    // console.log("availableAnnualPlan.length> 0------------",availableAnnualPlan)
                                                }else{
                                                    // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                                                    var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
                                                    // console.log("updateAnnualPlan------------",updateAnnualPlan);
                                                }
                                            }else{
                                                var createAnnualPlan   = await create_annualPlan(editDatas[j], totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, unitCost);
                                                // console.log("createAnnualPlan----------------",createAnnualPlan);
                                            }
                                        }
                                    }
                                }
                                resolve(data);
                            }else{
                                resolve(data);
                            }
                        }
                    })
                    .catch(err =>{
                        reject(err);
                        console.log(err);
                    });
            }
        }
    });
};
function getSectorData(sectorName,activityName,subactivityName){
    return new Promise((resolve,reject)=>{
        var sectorData={
            "sector_ID" : '',
            "activity_ID" : "",
            "subactivity_ID" : "",
        }
        Sectors.findOne({sector : sectorName})
        .exec()
        .then(data =>{
            // console.log('data',data);
            if(data){
                sectorData.sector_ID = data._id;
                var actvity = data.activity.find((obj)=>{
                    return obj.activityName === activityName
                })
                if (actvity) {
                    sectorData.activity_ID = actvity._id;
                    var subActivity = actvity.subActivity.find((sobj)=>{
                        return sobj.subActivityName === subactivityName
                    })
                    if (subActivity) {
                       sectorData.subactivity_ID = subActivity._id;
                    }
                }
                resolve(sectorData);
                // console.log('sectorData',sectorData);
            }else{
                resolve(sectorData);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
function getUnitofSubactivity(sector_ID, activity_ID, subactivity_ID){
    // console.log("sector_ID, activity_ID, subactivity_ID",sector_ID, activity_ID, subactivity_ID);
    return new Promise(function(resolve,reject){
        Sectors.findOne({ "_id": sector_ID, "activity._id": activity_ID })
        Sectors.aggregate([{$unwind: "$activity"},{$unwind: "$activity.subActivity"}])
        .exec()
        .then(data =>{
            var unit="";
            // console.log('data',data);
            if(data){
                // var subActivityyy = data.activity.filter((sdata)=>{
                //     console.log('sdata',sdata._id, subactivity_ID);
                //     console.log('sdata',sdata.subactivity);
                //     if(sdata.subactivity._id== subactivity_ID){
                //         return data
                //     }
                // })
                // console.log('subActivityyyrrrrrrrr================',subActivityyy);
               
                resolve(data);
            }else{
                // resolve(unit);
            }
        })
        .catch(err =>{
            reject(err);
        });
    }); 
};
/*exports.bulk_upload_manual_plan = (req,res,next)=>{
    var manualPlans = req.body.data;
    var newmplanLst = [];
    var sector = [];
    var validData = [];
    var validObjects = [];
    var editData = [];
    var editObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var uploadTime = new Date();

    getmplanData();
    async function getmplanData(){
        var allSectorsData = await getAllSectors();
        var allMonthlyplans = await getAllMonthlyplans(req.body.reqdata.center_ID);

        for(var k = 0 ; k < manualPlans.length ; k++){
            if (manualPlans[k].sectorName == '-') {
                remark += "sector name not found, " ; 
            }
            if (manualPlans[k].activityName == '-') {
                remark += "activity name not found, ";
            }
            if (typeof manualPlans[k].physicalUnit != 'number') {
                remark += "physicalUnit should be in number format, " 
            }
            if (typeof manualPlans[k].unitCost != 'number') {
                remark += "unitCost should be in number format, " 
            }
            if (typeof manualPlans[k].Reach_Beneficiary != 'number') {
                remark += "noOfBeneficiaries should be in number format, " 
            }
            if (typeof manualPlans[k].noOfFamilies != 'number') {
                remark += "noOfFamilies should be in number format, " 
            }
            if (manualPlans[k].programCategory != "LHWRF Grant" && manualPlans[k].programCategory != "Project Fund") {
                remark += "programCategory should be only 'LHWRF Grant' or  'Project Fund', " 
            }
            if (manualPlans[k].programCategory == "LHWRF Grant") {
                manualPlans[k].projectName = "all"
            }
            if (typeof manualPlans[k].LHWRF != 'number') {
                remark += "LHWRF should be in number format, " 
            }
            if (typeof manualPlans[k].NABARD != 'number') {
                remark += "NABARD should be in number format, " 
            }
            if (typeof manualPlans[k].bankLoan != 'number') {
                remark += "bankLoan should be in number format, " 
            }
            if (typeof manualPlans[k].govtscheme != 'number') {
                remark += "govtscheme should be in number format, " 
            }
            if (typeof manualPlans[k].directCC != 'number') {
                remark += "directCC should be in number format, " 
            }
            if (typeof manualPlans[k].indirectCC != 'number') {
                remark += "indirectCC should be in number format, " 
            }
            if (typeof manualPlans[k].other != 'number') {
                remark += "other should be in number format, " 
            }
            // console.log('manualPlans[k]',manualPlans[k]);
            var FYYear = req.body.reqdata.year;
            var other = typeof manualPlans[k].other == "string" ? 0 : manualPlans[k].other;
            var totalBudget = (parseFloat(manualPlans[k].physicalUnit) * parseFloat(manualPlans[k].unitCost)).toFixed(4);
            var LHWRF = isNaN(Number(manualPlans[k].LHWRF)) ? 0 : parseFloat(manualPlans[k].LHWRF);
            var NABARD = isNaN(Number(manualPlans[k].NABARD)) ? 0 : parseFloat(manualPlans[k].NABARD);
            var bankLoan = isNaN(Number(manualPlans[k].bankLoan)) ? 0 : parseFloat(manualPlans[k].bankLoan);
            var govtscheme = isNaN(Number(manualPlans[k].govtscheme)) ? 0 : parseFloat(manualPlans[k].govtscheme);
            var directCC = isNaN(Number(manualPlans[k].directCC)) ? 0 : parseFloat(manualPlans[k].directCC);
            var indirectCC = isNaN(Number(manualPlans[k].indirectCC)) ? 0 : parseFloat(manualPlans[k].indirectCC);
            var other = isNaN(Number(manualPlans[k].other)) ? 0 :  parseFloat(manualPlans[k].other);    
            if (totalBudget != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other).toFixed(4) ) {
                remark += "total budget should be equal to sum of 7 Source of Funds, " 
            }

            if (remark == '') {
                var projectsData = await allProjects();
                if(manualPlans[k].programCategory=="Project Fund"){
                    var projectsData     = await allProjects();
                    sector  = projectsData.filter((data)=>{
                        // console.log((data.projectName.toUpperCase()).trim() , ((manualPlans[k].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() , ((manualPlans[k].sectorName.toUpperCase()).trim()) , (data.sector.activityName.toUpperCase()).trim() , (manualPlans[k].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() , ((manualPlans[k].subactivityName.toUpperCase()).trim()) );
                        // console.log((data.projectName.toUpperCase()).trim() == ((manualPlans[k].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() == ((manualPlans[k].sectorName.toUpperCase()).trim()), (data.sector.activityName.toUpperCase()).trim() == (manualPlans[k].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() == ((manualPlans[k].subactivityName.toUpperCase()).trim()) );
                        // if ((data.projectName.toUpperCase()).trim() == ((manualPlans[k].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((manualPlans[k].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()) == (manualPlans[k].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()) == ((manualPlans[k].subactivityName.toUpperCase()).trim()) ){
                        if ((data.projectName.toUpperCase()).trim() == ((manualPlans[k].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((manualPlans[k].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() == (manualPlans[k].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() == ((manualPlans[k].subactivityName.toUpperCase()).trim()) ){
                            return data;
                        }
                    })
                }else if(manualPlans[k].programCategory=="LHWRF Grant"){
                    sector = allSectorsData.filter((data)=>{
                        // console.log("sectorName",data.sector, manualPlans[k].sectorName);
                        // console.log("activityName",data.activity.activityName, manualPlans[k].activityName);
                        // console.log('subactivityName',data.activity.subActivity.subActivityName, manualPlans[k].subactivityName);
                        // console.log(((data.sector).trim()).toUpperCase() === ((manualPlans[k].sectorName).trim()).toUpperCase() ,((data.activity.activityName).trim()).toUpperCase() === ((manualPlans[k].activityName).trim()).toUpperCase() , ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((manualPlans[k].subactivityName).trim()).toUpperCase());
                        if (((data.sector).trim()).toUpperCase() === ((manualPlans[k].sectorName).trim()).toUpperCase() && 
                            ((data.activity.activityName).trim()).toUpperCase() === ((manualPlans[k].activityName).trim()).toUpperCase() &&  
                            ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((manualPlans[k].subactivityName).trim()).toUpperCase()) {
                                return data;
                        }
                    })
                }
                // console.log('sector.length',sector.length);
                // console.log('sector',sector);
                var getunit =  allSectorsData.filter((data)=>{
                    if (((data.sector).trim()).toUpperCase() === ((manualPlans[k].sectorName).trim()).toUpperCase() && 
                        ((data.activity.activityName).trim()).toUpperCase() === ((manualPlans[k].activityName).trim()).toUpperCase() &&  
                        ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((manualPlans[k].subactivityName).trim()).toUpperCase()) {
                            return data;
                    }
                })
                // console.log("getunit",getunit);
                if(getunit.length>0){
                    var unit = getunit[0].activity.subActivity.unit;
                    // console.log("unit",unit);
                }
                if (sector.length>0) {
                    var monthlyplanexists  = allMonthlyplans.filter((data)=>{
                        if ((data.sectorName).toLowerCase() == (manualPlans[k].sectorName.trim()).toLowerCase() && (data.activityName).toLowerCase() == (manualPlans[k].activityName.trim()).toLowerCase() 
                            && (data.subactivityName).toLowerCase() == (manualPlans[k].subactivityName.trim()).toLowerCase() 
                            && (data.month).toLowerCase() == (req.body.reqdata.month).toLowerCase() && data.year == req.body.reqdata.year && (data.projectCategoryType).toLowerCase() == (manualPlans[k].programCategory).toLowerCase()  && (data.projectName).toLowerCase() == (manualPlans[k].projectName).toLowerCase()) {
                            return data;
                        }
                    })
                    var sectorName          = manualPlans[k].sectorName.trim();
                    var activityName        = manualPlans[k].activityName.trim();
                    var subactivityName     = manualPlans[k].subactivityName.trim();
                    var sector_ID           = manualPlans[k].programCategory== "LHWRF Grant" ? sector[0]._id :sector[0].sector.sector_ID ;
                    var activity_ID         = manualPlans[k].programCategory== "LHWRF Grant" ? sector[0].activity._id : sector[0].sector.activity_ID;
                    var subactivity_ID      = manualPlans[k].programCategory== "LHWRF Grant" ? sector[0].activity.subActivity._id : sector[0].sector.subActivity_ID;
                    // console.log("monthlyplanexists",monthlyplanexists.length);
                    // var unitSector = await getUnitofSubactivity(sector_ID, activity_ID, subactivity_ID)
                    // var unitSector = await getSectorData(sectorName,activityName,subactivityName)
                    // console.log("unitSector",unitSector);
                    // var unit = await getUnitofSubactivity(sector_ID, activity_ID, subactivity_ID)
                    if (monthlyplanexists.length>0) {
                        // invalidObjects = manualPlans[k];
                        // invalidObjects.failedRemark = "Plan already exists for given Quarter and Year";
                        // invalidData.push(invalidObjects); 

                        editObjects = manualPlans[k];
                        editObjects._id                 = monthlyplanexists[0]._id;    
                        editObjects.sectorName          = sectorName;
                        editObjects.activityName        = activityName;
                        editObjects.subactivityName     = subactivityName;
                        editObjects.unit                = unit;
                        editObjects.month               = req.body.reqdata.month;              
                        editObjects.startDate           = req.body.reqdata.startDate;              
                        editObjects.endDate             = req.body.reqdata.endDate;              
                        editObjects.year                = req.body.reqdata.year;
                        editObjects.center_ID           = req.body.reqdata.center_ID;
                        editObjects.center              = req.body.reqdata.centerName;
                        editObjects.projectCategoryType = manualPlans[k].programCategory; //"LHWRFGrand" or "ProjectFund"
                        editObjects.projectName         = manualPlans[k].programCategory == "LHWRF Grant" ? "all" : manualPlans[k].projectName;
                        editObjects.type                = manualPlans[k].programCategory == "LHWRF Grant" ? true : false,
                        editObjects.sector_ID           = sector_ID;
                        editObjects.activity_ID         = activity_ID;
                        editObjects.subactivity_ID      = subactivity_ID;
                        editObjects.totalBudget         = totalBudget;
                        editObjects.other               = other;       
                        editObjects.fileName            = req.body.fileName;
                        editObjects.uploadTime          = uploadTime;
                        editObjects.createdAt           = new Date();
                        editData.push(editObjects); 
                        // console.log("editData",editData.length);
                        var update_monthlyPlanObjects = update_monthlyPlanData(editData)
                    }else{
                        validObjects = manualPlans[k];
                        validObjects._id                 = new mongoose.Types.ObjectId();    
                        validObjects.sectorName          = sectorName;
                        validObjects.activityName        = activityName;
                        validObjects.subactivityName     = subactivityName;
                        validObjects.unit                = unit;
                        validObjects.month               = req.body.reqdata.month;              
                        validObjects.startDate           = req.body.reqdata.startDate;              
                        validObjects.endDate             = req.body.reqdata.endDate;              
                        validObjects.year                = req.body.reqdata.year;
                        validObjects.center_ID           = req.body.reqdata.center_ID;
                        validObjects.center              = req.body.reqdata.centerName;
                        validObjects.projectCategoryType = manualPlans[k].programCategory; //"LHWRFGrand" or "ProjectFund"
                        validObjects.projectName         = manualPlans[k].programCategory == "LHWRF Grant" ? "all" : manualPlans[k].projectName;
                        validObjects.type                = manualPlans[k].programCategory == "LHWRF Grant" ? true : false,
                        validObjects.sector_ID           = sector_ID;
                        validObjects.activity_ID         = activity_ID;
                        validObjects.subactivity_ID      = subactivity_ID;
                        validObjects.totalBudget         = totalBudget;
                        validObjects.other               = other;       
                        validObjects.fileName            = req.body.fileName;
                        validObjects.uploadTime          = uploadTime;
                        validObjects.createdAt           = new Date();
                        validData.push(validObjects); 

                    }                    
                }else{
                    invalidObjects = manualPlans[k];
                    if(manualPlans[k].programCategory=="Project Fund"){
                        invalidObjects.failedRemark = "Project Name or Subactivity details not found";
                    }else{
                        invalidObjects.failedRemark = "Subactivity details not found";
                    }
                    invalidData.push(invalidObjects);   
                }             
            }else{
                invalidObjects = manualPlans[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }

        MonthlyPlan.insertMany(validData)
        .then(data=>{
            // console.log("data=============",data);
            for(var i = 0 ; i < data.length ; i++){
                if(data[i]._id){
                    // console.log("data[i]._id",data[i]._id);
                    getData(); 
                    async function getData(){
                        var fetch_monthlyPlan       = await fetch_monthlyPlanData(data[i]._id);                        
                        // console.log("fetch_monthlyPlan==========",fetch_monthlyPlan)
                        var availableQs             = await AllmonthlyPlan({
                                                            $match : {
                                                                        "center_ID"     : fetch_monthlyPlan[0].center_ID, 
                                                                        "year"          : fetch_monthlyPlan[0].year, 
                                                                        "sector_ID"     : fetch_monthlyPlan[0].sector_ID, 
                                                                        "activity_ID"   : fetch_monthlyPlan[0].activity_ID, 
                                                                        "subactivity_ID":  fetch_monthlyPlan[0].subactivity_ID
                                                                    }
                                                        });
                        // console.log("availableQs",availableQs);
                        // for(var i = 0 ; i < availableQs.length ; i++){
                            var quarter1 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                            })
                            var quarter2 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                            })
                            var quarter3 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                            })
                            var quarter4 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                            })
                                // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                            if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                                var availableAnnualPlan    = await fetch_annualPlan(fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                                
                                var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                                var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                                var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                                var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                                var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                                var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                                var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                                var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                                var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                                var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                                var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);
                                var totalunitCost          = parseFloat(fetch_monthlyPlan[0].unitCost);
                                // console.log("totalLHWRF",totalLHWRF,"totalNABARD",totalNABARD,"totalgovtscheme",totalgovtscheme,"totalbankLoan",totalbankLoan,"totalother",totalother);
                                // console.log("totaldirectCC",totaldirectCC,"totalindirectCC",totalindirectCC,"totaltotalBudget",totaltotalBudget)
                                if(availableAnnualPlan){
                                    if(totalnoOfFamilies==availableAnnualPlan.noOfFamilies && totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries && totalphysicalUnit==availableAnnualPlan.physicalUnit && totaltotalBudget==availableAnnualPlan.totalBudget &&totalLHWRF==availableAnnualPlan.LHWRF && totalNABARD==availableAnnualPlan.NABARD && totalgovtscheme==availableAnnualPlan.govtscheme && totalbankLoan==availableAnnualPlan.bankLoan && totalother==availableAnnualPlan.other && totaldirectCC==availableAnnualPlan.directCC && totalindirectCC==availableAnnualPlan.indirectCC){
                                        // console.log("availableAnnualPlan.length> 0",availableAnnualPlan)
                                    }else{
                                        // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                                        var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, totalunitCost);
                                    }
                                }else{
                                    var createAnnualPlan   = await create_annualPlan(fetch_monthlyPlan[0], totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, totalunitCost);
                                }
                            // }
                        }
                    }    
                }
            }
        })
        .catch(err =>{
            console.log(err);
        });
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        // console.log("newaplanLst",newaplanLst);
        // if(k >= manualPlans.length){
        //     res.status(200).json({"uploadedData": newmplanLst,"message":"Monthly Plan Details submitted Successfully"});
        // }
        res.status(200).json({
        "message": "Bulk upload process is completed successfully!",
        "completed": true
        });
    }    
}*/
exports.bulk_upload_manual_plan = (req,res,next)=>{
    var manualPlans = req.body.data;
    var newmplanLst = [];
    var sector = [];
    var validData = [];
    var validObjects = [];
    var editData = [];
    var editObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var uploadTime = new Date();

    getmplanData();
    async function getmplanData(){
        var allSectorsData = await getAllSectors();
        var allMonthlyplans = await getAllMonthlyplans(req.body.reqdata.center_ID);
        for(var k = 0 ; k < manualPlans.length ; k++){
        // console.log('manualPlans[k]',manualPlans[k])

            if (manualPlans[k].sectorName == '-') {
                remark += "Sector not found, " ; 
            }
            if (manualPlans[k].activityName == '-') {
                remark += "Activity not found, ";
            }
            if (manualPlans[k].subactivityName == '-') {
                remark += "Subactivity not found, ";
            }
            if (manualPlans[k].Reach_Beneficiary == '-' || manualPlans[k].Reach_Beneficiary == undefined) {
                remark += "Reach_Beneficiary not found, ";
            }
            if (manualPlans[k].Upgradation_Family == '-' || manualPlans[k].Upgradation_Family == undefined) {
                remark += "Upgradation_Family not found, ";
            }
            if (typeof manualPlans[k].physicalUnit != 'number') {
                remark += "physicalUnit should be in number format, " 
            }
            if (typeof manualPlans[k].unitCost != 'number') {
                remark += "unitCost should be in number format, " 
            }
            if (typeof manualPlans[k].Reach_Beneficiary != 'number') {
                remark += "Reach_Beneficiary should be in number format, " 
            }
            if (typeof manualPlans[k].Upgradation_Family != 'number') {
                remark += "Upgradation_Family should be in number format, " 
            }
            if (manualPlans[k].programCategory != "LHWRF Grant" && manualPlans[k].programCategory != "Project Fund") {
                remark += "programCategory should be only 'LHWRF Grant' or  'Project Fund', " 
            }
            if (manualPlans[k].programCategory == "LHWRF Grant") {
                manualPlans[k].projectName = "all"
            }
            if (typeof manualPlans[k].LHWRF != 'number') {
                remark += "LHWRF should be in number format, " 
            }
            if (typeof manualPlans[k].NABARD != 'number') {
                remark += "NABARD should be in number format, " 
            }
            if (typeof manualPlans[k].bankLoan != 'number') {
                remark += "bankLoan should be in number format, " 
            }
            if (typeof manualPlans[k].govtscheme != 'number') {
                remark += "govtscheme should be in number format, " 
            }
            if (typeof manualPlans[k].directCC != 'number') {
                remark += "directCC should be in number format, " 
            }
            if (typeof manualPlans[k].indirectCC != 'number') {
                remark += "indirectCC should be in number format, " 
            }
            if (typeof manualPlans[k].other != 'number') {
                remark += "other should be in number format, " 
            }
            // console.log('manualPlans[k]',manualPlans[k]);
            var FYYear = req.body.reqdata.year;
            var other = typeof manualPlans[k].other == "string" ? 0 : manualPlans[k].other;
            var totalBudget = (parseFloat(manualPlans[k].physicalUnit) * parseFloat(manualPlans[k].unitCost)).toFixed(4);
            var LHWRF = isNaN(Number(manualPlans[k].LHWRF)) ? 0 : parseFloat(manualPlans[k].LHWRF);
            var NABARD = isNaN(Number(manualPlans[k].NABARD)) ? 0 : parseFloat(manualPlans[k].NABARD);
            var bankLoan = isNaN(Number(manualPlans[k].bankLoan)) ? 0 : parseFloat(manualPlans[k].bankLoan);
            var govtscheme = isNaN(Number(manualPlans[k].govtscheme)) ? 0 : parseFloat(manualPlans[k].govtscheme);
            var directCC = isNaN(Number(manualPlans[k].directCC)) ? 0 : parseFloat(manualPlans[k].directCC);
            var indirectCC = isNaN(Number(manualPlans[k].indirectCC)) ? 0 : parseFloat(manualPlans[k].indirectCC);
            var other = isNaN(Number(manualPlans[k].other)) ? 0 :  parseFloat(manualPlans[k].other);    
            if (totalBudget != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other).toFixed(4) ) {
                remark += "total budget should be equal to sum of 7 Source of Funds, " 
            }

            if (remark == '') {
                var projectsData = await allProjects();
                if(manualPlans[k].programCategory=="Project Fund"){
                    var projectsData     = await allProjects();
                    sector  = projectsData.filter((data)=>{
                        // console.log((data.projectName.toUpperCase()).trim() , ((manualPlans[k].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() , ((manualPlans[k].sectorName.toUpperCase()).trim()) , (data.sector.activityName.toUpperCase()).trim() , (manualPlans[k].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() , ((manualPlans[k].subactivityName.toUpperCase()).trim()) );
                        // console.log((data.projectName.toUpperCase()).trim() == ((manualPlans[k].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() == ((manualPlans[k].sectorName.toUpperCase()).trim()), (data.sector.activityName.toUpperCase()).trim() == (manualPlans[k].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() == ((manualPlans[k].subactivityName.toUpperCase()).trim()) );
                        // if ((data.projectName.toUpperCase()).trim() == ((manualPlans[k].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((manualPlans[k].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()) == (manualPlans[k].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()) == ((manualPlans[k].subactivityName.toUpperCase()).trim()) ){
                        if ((data.projectName.toUpperCase()).trim() == ((manualPlans[k].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((manualPlans[k].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() == (manualPlans[k].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() == ((manualPlans[k].subactivityName.toUpperCase()).trim()) ){
                            return data;
                        }
                    })
                }else if(manualPlans[k].programCategory=="LHWRF Grant"){
                    sector = allSectorsData.filter((data)=>{
                        // console.log("sectorName",data.sector, manualPlans[k].sectorName);
                        // console.log("activityName",data.activity.activityName, manualPlans[k].activityName);
                        // console.log('subactivityName',data.activity.subActivity.subActivityName, manualPlans[k].subactivityName);
                        // console.log(((data.sector).trim()).toUpperCase() === ((manualPlans[k].sectorName).trim()).toUpperCase() ,((data.activity.activityName).trim()).toUpperCase() === ((manualPlans[k].activityName).trim()).toUpperCase() , ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((manualPlans[k].subactivityName).trim()).toUpperCase());
                        if (((data.sector).trim()).toUpperCase() === ((manualPlans[k].sectorName).trim()).toUpperCase() && 
                            ((data.activity.activityName).trim()).toUpperCase() === ((manualPlans[k].activityName).trim()).toUpperCase() &&  
                            ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((manualPlans[k].subactivityName).trim()).toUpperCase()) {
                                return data;
                        }
                    })
                }
                // console.log('sector.length',sector.length);
                // console.log('sector',sector);
                var getunit =  allSectorsData.filter((data)=>{
                    if (((data.sector).trim()).toUpperCase() === ((manualPlans[k].sectorName).trim()).toUpperCase() && 
                        ((data.activity.activityName).trim()).toUpperCase() === ((manualPlans[k].activityName).trim()).toUpperCase() &&  
                        ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((manualPlans[k].subactivityName).trim()).toUpperCase()) {
                            return data;
                    }
                })
                // console.log("getunit",getunit);
                if(getunit.length>0){
                    var unit = getunit[0].activity.subActivity.unit;
                    // console.log("unit",unit);
                }
                if (sector.length>0) {
                    var monthlyplanexists  = allMonthlyplans.filter((data)=>{
                        if ((data.sectorName).toLowerCase() == (manualPlans[k].sectorName.trim()).toLowerCase() && (data.activityName).toLowerCase() == (manualPlans[k].activityName.trim()).toLowerCase() 
                            && (data.subactivityName).toLowerCase() == (manualPlans[k].subactivityName.trim()).toLowerCase() 
                            && (data.month).toLowerCase() == (req.body.reqdata.month).toLowerCase() && data.year == req.body.reqdata.year && (data.projectCategoryType).toLowerCase() == (manualPlans[k].programCategory).toLowerCase()  && (data.projectName).toLowerCase() == (manualPlans[k].projectName).toLowerCase()) {
                            return data;
                        }
                    })
                    var sectorName          = manualPlans[k].sectorName.trim();
                    var activityName        = manualPlans[k].activityName.trim();
                    var subactivityName     = manualPlans[k].subactivityName.trim();
                    var sector_ID           = manualPlans[k].programCategory== "LHWRF Grant" ? sector[0]._id :sector[0].sector.sector_ID ;
                    var activity_ID         = manualPlans[k].programCategory== "LHWRF Grant" ? sector[0].activity._id : sector[0].sector.activity_ID;
                    var subactivity_ID      = manualPlans[k].programCategory== "LHWRF Grant" ? sector[0].activity.subActivity._id : sector[0].sector.subActivity_ID;
                    // console.log("monthlyplanexists",monthlyplanexists.length);
                    // var unitSector = await getUnitofSubactivity(sector_ID, activity_ID, subactivity_ID)
                    // var unitSector = await getSectorData(sectorName,activityName,subactivityName)
                    // console.log("unitSector",unitSector);
                    // var unit = await getUnitofSubactivity(sector_ID, activity_ID, subactivity_ID)
                    if (monthlyplanexists.length>0) {
                        // invalidObjects = manualPlans[k];
                        // invalidObjects.failedRemark = "Plan already exists for given Quarter and Year";
                        // invalidData.push(invalidObjects); 

                        editObjects = manualPlans[k];
                        editObjects._id                 = monthlyplanexists[0]._id;    
                        editObjects.sectorName          = sectorName;
                        editObjects.activityName        = activityName;
                        editObjects.subactivityName     = subactivityName;
                        editObjects.unit                = unit;
                        editObjects.month               = req.body.reqdata.month;              
                        editObjects.startDate           = req.body.reqdata.startDate;              
                        editObjects.endDate             = req.body.reqdata.endDate;              
                        editObjects.year                = req.body.reqdata.year;
                        editObjects.center_ID           = req.body.reqdata.center_ID;
                        editObjects.center              = req.body.reqdata.centerName;
                        editObjects.projectCategoryType = manualPlans[k].programCategory; //"LHWRFGrand" or "ProjectFund"
                        editObjects.projectName         = manualPlans[k].programCategory == "LHWRF Grant" ? "all" : manualPlans[k].projectName;
                        editObjects.type                = manualPlans[k].programCategory == "LHWRF Grant" ? true : false,
                        editObjects.sector_ID           = sector_ID;
                        editObjects.activity_ID         = activity_ID;
                        editObjects.subactivity_ID      = subactivity_ID;
                        editObjects.totalBudget         = totalBudget;
                        editObjects.noOfBeneficiaries   = manualPlans[k].Reach_Beneficiary;
                        editObjects.noOfFamilies        = manualPlans[k].Upgradation_Family;
                        editObjects.other               = other;       
                        editObjects.fileName            = req.body.fileName;
                        editObjects.uploadTime          = uploadTime;
                        editObjects.createdAt           = new Date();
                        editData.push(editObjects); 
                        // console.log("editData",editData.length);
                        var update_monthlyPlanObjects = update_monthlyPlanData(editData)
                    }else{
                        validObjects = manualPlans[k];
                        validObjects._id                 = new mongoose.Types.ObjectId();    
                        validObjects.sectorName          = sectorName;
                        validObjects.activityName        = activityName;
                        validObjects.subactivityName     = subactivityName;
                        validObjects.unit                = unit;
                        validObjects.month               = req.body.reqdata.month;              
                        validObjects.startDate           = req.body.reqdata.startDate;              
                        validObjects.endDate             = req.body.reqdata.endDate;              
                        validObjects.year                = req.body.reqdata.year;
                        validObjects.center_ID           = req.body.reqdata.center_ID;
                        validObjects.center              = req.body.reqdata.centerName;
                        validObjects.projectCategoryType = manualPlans[k].programCategory; //"LHWRFGrand" or "ProjectFund"
                        validObjects.projectName         = manualPlans[k].programCategory == "LHWRF Grant" ? "all" : manualPlans[k].projectName;
                        validObjects.type                = manualPlans[k].programCategory == "LHWRF Grant" ? true : false,
                        validObjects.sector_ID           = sector_ID;
                        validObjects.activity_ID         = activity_ID;
                        validObjects.subactivity_ID      = subactivity_ID;
                        validObjects.totalBudget         = totalBudget;
                        validObjects.noOfBeneficiaries   = manualPlans[k].Reach_Beneficiary;
                        validObjects.noOfFamilies        = manualPlans[k].Upgradation_Family;
                        validObjects.other               = other;       
                        validObjects.fileName            = req.body.fileName;
                        validObjects.uploadTime          = uploadTime;
                        validObjects.createdAt           = new Date();
                        validData.push(validObjects); 

                    }                    
                }else{
                    invalidObjects = manualPlans[k];
                    if(manualPlans[k].programCategory=="Project Fund"){
                        invalidObjects.failedRemark = "Project Name or Subactivity details not found";
                    }else{
                        invalidObjects.failedRemark = "Subactivity details not found";
                    }
                    invalidData.push(invalidObjects);   
                }             
            }else{
                invalidObjects = manualPlans[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }
        console.log('validData===========',validData)

        MonthlyPlan.insertMany(validData)
        .then(data=>{
            console.log("data=============",data);
            for(var i = 0 ; i < data.length ; i++){
                if(data[i]._id){
                    // console.log("data[i]._id",data[i]._id);
                    getData(); 
                    async function getData(){
                        var fetch_monthlyPlan       = await fetch_monthlyPlanData(data[i]._id);                        
                        // console.log("fetch_monthlyPlan==========",fetch_monthlyPlan)
                        var availableQs             = await AllmonthlyPlan({
                                                            $match : {
                                                                        "center_ID"     : fetch_monthlyPlan[0].center_ID, 
                                                                        "year"          : fetch_monthlyPlan[0].year, 
                                                                        "sector_ID"     : fetch_monthlyPlan[0].sector_ID, 
                                                                        "activity_ID"   : fetch_monthlyPlan[0].activity_ID, 
                                                                        "subactivity_ID":  fetch_monthlyPlan[0].subactivity_ID
                                                                    }
                                                        });
                        // console.log("availableQs",availableQs);
                        // for(var i = 0 ; i < availableQs.length ; i++){
                            var quarter1 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                            })
                            var quarter2 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                            })
                            var quarter3 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                            })
                            var quarter4 = availableQs.filter((quarterMonth)=>{
                                if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                            })
                                // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                            if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                                var availableAnnualPlan    = await fetch_annualPlan(fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                                
                                var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                                var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                                var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                                var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                                var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                                var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                                var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                                var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                                var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                                var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                                var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);
                                var totalunitCost          = parseFloat(fetch_monthlyPlan[0].unitCost);
                                // console.log("totalLHWRF",totalLHWRF,"totalNABARD",totalNABARD,"totalgovtscheme",totalgovtscheme,"totalbankLoan",totalbankLoan,"totalother",totalother);
                                // console.log("totaldirectCC",totaldirectCC,"totalindirectCC",totalindirectCC,"totaltotalBudget",totaltotalBudget)
                                if(availableAnnualPlan){
                                    if(totalnoOfFamilies==availableAnnualPlan.noOfFamilies && totalnoOfBeneficiaries==availableAnnualPlan.noOfBeneficiaries && totalphysicalUnit==availableAnnualPlan.physicalUnit && totaltotalBudget==availableAnnualPlan.totalBudget &&totalLHWRF==availableAnnualPlan.LHWRF && totalNABARD==availableAnnualPlan.NABARD && totalgovtscheme==availableAnnualPlan.govtscheme && totalbankLoan==availableAnnualPlan.bankLoan && totalother==availableAnnualPlan.other && totaldirectCC==availableAnnualPlan.directCC && totalindirectCC==availableAnnualPlan.indirectCC){
                                        // console.log("availableAnnualPlan.length> 0",availableAnnualPlan)
                                    }else{
                                        // console.log("availableAnnualPlan._id",availableAnnualPlan._id);
                                        var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, totalunitCost);
                                    }
                                }else{
                                    var createAnnualPlan   = await create_annualPlan(fetch_monthlyPlan[0], totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, totalunitCost);
                                }
                            // }
                        }
                    }    
                }
            }
        })
        .catch(err =>{
            console.log(err);
        });
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        // console.log("newaplanLst",newaplanLst);
        // if(k >= manualPlans.length){
        //     res.status(200).json({"uploadedData": newmplanLst,"message":"Monthly Plan Details submitted Successfully"});
        // }
        res.status(200).json({
        "message": "Bulk upload process is completed successfully!",
        "completed": true
        });
    }    
}
function getAllMonthlyplans(center_ID){
    return new Promise((resolve,reject)=>{
        MonthlyPlan.find({center_ID: center_ID})
            .exec()
            .then(data=>{
                resolve(data);
            })
            .catch(err =>{
                reject(err);
            });
    });
};
function allProjects(){
    return new Promise((resolve,reject)=>{
        ProjectMapping.aggregate([{$unwind: "$sector"}])
        // ProjectMapping.find()
            .exec()
            .then(data=>{
                resolve(data);
            })
            .catch(err =>{
                reject(err);
            });
    });
};
function getAllSectors(){
    return new Promise((resolve,reject)=>{        
        Sectors.aggregate([{$unwind: "$activity"},{$unwind: "$activity.subActivity"}])
        .exec()
        .then(data =>{
            //console.log('data',data)
            if(data){
                resolve(data);
            }else{
                resolve(0);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
var insertFailedRecords = async (invalidData,updateBadData) => {
    //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
    FailedRecords.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
            if(data.length>0){
                if (data[0].failedRecords.length>0) {
                    if (updateBadData) {
                        FailedRecords.updateOne({ fileName:invalidData.fileName},  
                        {   $set:   { 'failedRecords': [] } })
                        .then(data=>{
                        if(data.nModified == 1){
                            FailedRecords.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'failedRecords' : invalidData.FailedRecords } 
                                })
                            .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{ reject(err); });
                        }else{
                            resolve(0);
                        }
                        })
                        .catch(err =>{ reject(err); });
                    }else{
                        FailedRecords.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'failedRecords' : invalidData.FailedRecords } 
                                })
                            .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{ reject(err); });
                    }

                }else{
                    FailedRecords.updateOne({ fileName:invalidData.fileName},  
                        {   $set:   {'totalRecords': invalidData.totalRecords},
                            $push:  { 'failedRecords' : invalidData.FailedRecords } 
                        })
                    .then(data=>{
                        if(data.nModified == 1){
                            resolve(data);
                        }else{
                            resolve(data);
                        }
                    })
                    .catch(err =>{ reject(err); });
                }
            }else{
                    const failedRecords = new FailedRecords({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    failedRecords           : invalidData.FailedRecords,
                    fileName                : invalidData.fileName,
                    totalRecords            : invalidData.totalRecords,
                    createdAt               : new Date()
                    });
                    
                    failedRecords
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }
            })  
    
    })            
}
exports.filedetails = (req,res,next)=>{
    var finaldata = {};
    //console.log(req.params.fileName)
    MonthlyPlan.find({center_ID: req.params.center_ID, fileName:req.params.fileName})
    .exec()
    .then(data=>{
        //finaldata.push({goodrecords: data})
        finaldata.goodrecords = data;
        FailedRecords.find({fileName:req.params.fileName})  
            .exec()
            .then(badData=>{
                finaldata.failedRecords = badData[0].failedRecords
                finaldata.totalRecords = badData[0].totalRecords
                res.status(200).json(finaldata);
            })
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_file = (req,res,next)=>{
    MonthlyPlan.aggregate([
                {
                  $match: {center_ID: req.body.center_ID  }
                },
                {
                    $group: {
                        _id : {
                            "fileName"   :"$fileName", 
                            "uploadTime" :"$uploadTime",
                            "month"      :"$month",
                            "year"       :"$year"
                        }, 
                        'count':{$sum:1} 
                    }  
                },
                {
                    $project: {    
                        "fileName"   :"$_id.fileName", 
                        "uploadTime" :"$_id.uploadTime",
                        "month"      :"$_id.month",
                        "year"       :"$_id.year",
                        'count'      : 1
                    }
                }
            ])
    .sort({"uploadTime":-1})
    .exec()
    .then(data=>{
        // console.log('data',data);
        res.status(200).json(data.slice(req.body.startRange, req.body.limitRange));
        /*
            var x = _.unique(_.pluck(data, "fileName"));
            var z = [];
            for(var i=0; i<x.length; i++){
                var y = data.filter((a)=>{
                    // console.log('a',a);
                    if(a.fileName == x[i]) {
                        return data;
                    }
                })
                // console.log("y",y)
                console.log(x[i])
                z.push({
                    "fileName": x[i] !== undefined ? x[i] : "Manual",
                    'count': y.length,
                    "_id" : x[i]
                })
                console.log("z",z)
        }*/
        // res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  
};

exports.fetch_file_count = (req,res,next)=>{
    MonthlyPlan.find({center_ID: req.params.center_ID})
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'count': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.length);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_file = (req,res,next)=>{
    // MonthlyPlan.deleteMany({"fileName":req.params.fileName})
    MonthlyPlan.find({"fileName":req.params.fileName, "month":req.params.month, "year":req.params.year,"uploadTime":req.params.uploadTime})
    .exec()
    .then(data=>{
        // console.log('data',data);
        for(var i = 0 ; i < data.length ; i++){
                var fetch_monthlyPlan = [];
                var center_ID         = [];
                var year              = [];
                var sector_ID         = [];
                var activity_ID       = [];
                var subactivity_ID    = [];
            if(data[i]._id){
                getData(); 
                async function getData(){
                    fetch_monthlyPlan = await fetch_monthlyPlanData(data[i]._id);                        
                    
                    center_ID         = fetch_monthlyPlan[0].center_ID;
                    year              = fetch_monthlyPlan[0].year;
                    sector_ID         = fetch_monthlyPlan[0].sector_ID;
                    activity_ID       = fetch_monthlyPlan[0].activity_ID;
                    subactivity_ID    = fetch_monthlyPlan[0].subactivity_ID;
                    // console.log("fetch_monthlyPlan[0]._id",fetch_monthlyPlan[0]._id);

                    var delete_monthly_Plans    = await delete_monthly_Plan(fetch_monthlyPlan[0]._id, fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                }
            }
        }
        res.status(200).json({
            "message" : "Quarterly Plans of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 };

/*
exports.delete_file = (req,res,next)=>{
    // MonthlyPlan.deleteMany({"fileName":req.params.fileName})
    MonthlyPlan.find({"fileName":req.params.fileName, "month":req.params.month, "year":req.params.year,"uploadTime":req.params.uploadTime})
    .exec()
    .then(data=>{
        // console.log('data',data);
        for(var i = 0 ; i < data.length ; i++){
            if(data[i]._id){
                var fetch_monthlyPlan = [];
                var center_ID         = [];
                var year              = [];
                var sector_ID         = [];
                var activity_ID       = [];
                var subactivity_ID    = [];
                getData(); 
                async function getData(){
                    fetch_monthlyPlan = await fetch_monthlyPlanData(data[i]._id);                        
                    
                    center_ID         = fetch_monthlyPlan[0].center_ID;
                    year              = fetch_monthlyPlan[0].year;
                    sector_ID         = fetch_monthlyPlan[0].sector_ID;
                    activity_ID       = fetch_monthlyPlan[0].activity_ID;
                    subactivity_ID    = fetch_monthlyPlan[0].subactivity_ID;
                    console.log("fetch_monthlyPlan[0]._id",fetch_monthlyPlan[0]._id);

                    
                    var delete_monthly_Plans    = await delete_monthly_Plan(fetch_monthlyPlan[0]._id, fetch_monthlyPlan[0].center_ID, fetch_monthlyPlan[0].year, fetch_monthlyPlan[0].sector_ID, fetch_monthlyPlan[0].activity_ID, fetch_monthlyPlan[0].subactivity_ID, fetch_monthlyPlan[0].projectCategoryType, fetch_monthlyPlan[0].projectName );
                        
                }
            }
        }
        res.status(200).json({
            "message" : "Quarterly Plans of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 };

*/

function delete_monthly_Plan(_id, center_ID, year, sector_ID, activity_ID, subactivity_ID, projectCategoryType, projectName ){
    // console.log(_id, center_ID, year, sector_ID, activity_ID, subactivity_ID, projectCategoryType, projectName );
    return new Promise(function(resolve,reject){
        MonthlyPlan.deleteOne({_id:_id})
            .exec()
            .then(data=>{
                // console.log('datadelete',data);
                getAvailableData(); 
                async function getAvailableData(){
                    // console.log("center_ID",center_ID,"year",year, "sector_ID",sector_ID,"activity_ID",activity_ID,"subactivity_ID",subactivity_ID);
                    var availableQs             = await AllmonthlyPlan({
                                                    $match : {
                                                            "center_ID"     : center_ID, 
                                                            "year"          : year, 
                                                            "sector_ID"     : sector_ID, 
                                                            "activity_ID"   : activity_ID, 
                                                            "subactivity_ID": subactivity_ID,
                                                            "projectCategoryType": projectCategoryType,
                                                            "projectName"        : projectName
                                                        }
                                                    });
                    // console.log("availableQs",availableQs);
                    var quarter1 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month =="Q1 (April to June)" ){ return data;  }
                    })
                    var quarter2 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month == "Q2 (July to September)" ) { return data; }
                    })
                    var quarter3 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month == "Q3 (October to December)")  { return data; }
                    })
                    var quarter4 = availableQs.filter((quarterMonth)=>{
                        if(quarterMonth.month == "Q4 (January to March)")  { return data; }
                    })  
                    var availableAnnualPlan    = await fetch_annualPlan(center_ID, year, sector_ID, activity_ID, subactivity_ID, projectCategoryType, projectName );
                    // console.log("quarter1",quarter1,"quarter2",quarter2,"quarter3",quarter3,"quarter4",quarter4);
                    if(quarter1.length>0 || quarter4.length>0 || quarter3.length>0 || quarter4.length>0){
                        var totalLHWRF             = parseFloat(quarter1.length>0 ? quarter1[0].LHWRF : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].LHWRF : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].LHWRF :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].LHWRF : 0);
                        var totalNABARD            = parseFloat(quarter1.length>0 ? quarter1[0].NABARD : 0)            +parseFloat(quarter2.length >0 ? quarter2[0].NABARD : 0)            +parseFloat(quarter3.length > 0 ? quarter3[0].NABARD :0)            +parseFloat(quarter4.length > 0 ? quarter4[0].NABARD : 0);
                        var totalgovtscheme        = parseFloat(quarter1.length>0 ? quarter1[0].govtscheme : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].govtscheme : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].govtscheme :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].govtscheme : 0);
                        var totalbankLoan          = parseFloat(quarter1.length>0 ? quarter1[0].bankLoan : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].bankLoan : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].bankLoan :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].bankLoan : 0);
                        var totalother             = parseFloat(quarter1.length>0 ? quarter1[0].other : 0)             +parseFloat(quarter2.length >0 ? quarter2[0].other : 0)             +parseFloat(quarter3.length > 0 ? quarter3[0].other :0)             +parseFloat(quarter4.length > 0 ? quarter4[0].other : 0);
                        var totaldirectCC          = parseFloat(quarter1.length>0 ? quarter1[0].directCC : 0)          +parseFloat(quarter2.length >0 ? quarter2[0].directCC : 0)          +parseFloat(quarter3.length > 0 ? quarter3[0].directCC :0)          +parseFloat(quarter4.length > 0 ? quarter4[0].directCC : 0);
                        var totalindirectCC        = parseFloat(quarter1.length>0 ? quarter1[0].indirectCC : 0)        +parseFloat(quarter2.length >0 ? quarter2[0].indirectCC : 0)        +parseFloat(quarter3.length > 0 ? quarter3[0].indirectCC :0)        +parseFloat(quarter4.length > 0 ? quarter4[0].indirectCC : 0);
                        var totaltotalBudget       = parseFloat(quarter1.length>0 ? quarter1[0].totalBudget : 0)       +parseFloat(quarter2.length >0 ? quarter2[0].totalBudget : 0)       +parseFloat(quarter3.length > 0 ? quarter3[0].totalBudget :0)       +parseFloat(quarter4.length > 0 ? quarter4[0].totalBudget : 0);
                        var totalphysicalUnit      = parseFloat(quarter1.length>0 ? quarter1[0].physicalUnit : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].physicalUnit : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].physicalUnit :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].physicalUnit : 0);
                        var totalnoOfFamilies      = parseFloat(quarter1.length>0 ? quarter1[0].noOfFamilies : 0)      +parseFloat(quarter2.length >0 ? quarter2[0].noOfFamilies : 0)      +parseFloat(quarter3.length > 0 ? quarter3[0].noOfFamilies :0)      +parseFloat(quarter4.length > 0 ? quarter4[0].noOfFamilies : 0);
                        var totalnoOfBeneficiaries = parseFloat(quarter1.length>0 ? quarter1[0].noOfBeneficiaries : 0) +parseFloat(quarter2.length >0 ? quarter2[0].noOfBeneficiaries : 0) +parseFloat(quarter3.length > 0 ? quarter3[0].noOfBeneficiaries :0) +parseFloat(quarter4.length > 0 ? quarter4[0].noOfBeneficiaries : 0);
                        var totalunitCost          = parseFloat(quarter1.length>0 ? quarter1[0].unitCost : 0);
                            // console.log("availableAnnualPlan.length>",availableAnnualPlan);
                        if(availableAnnualPlan){
                            // console.log("availableAnnualPlan======>",availableAnnualPlan);
                            // console.log("availableAnnualPlan._id update",availableAnnualPlan._id);
                            var updateAnnualPlan   = await update_annualPlan(availableAnnualPlan._id, totalLHWRF, totalNABARD, totalgovtscheme, totalbankLoan, totalother, totaldirectCC, totalindirectCC, totaltotalBudget, totalphysicalUnit, totalnoOfFamilies, totalnoOfBeneficiaries, totalunitCost);
                        }
                    }else if(quarter1.length==0 && quarter2.length==0 && quarter3.length==0 && quarter4.length==0){
                        if(availableAnnualPlan){
                            // console.log("availableAnnualPlan._id delete",availableAnnualPlan._id);
                            var deleteAnnualPlan   = await delete_annualPlan(availableAnnualPlan._id);
                        }
                    }
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });
};