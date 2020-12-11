const mongoose	= require("mongoose");
var moment              = require('moment');

const MonthlyPlan = require('../models/monthlyPlans');
const Sectors   = require('../models/sectors');
const FailedRecords = require('../models/failedRecords');
const _         = require("underscore");

exports.create_monthlyPlan = (req,res,next)=>{

	MonthlyPlan.find()
		.exec()
		.then(data =>{

				const monthlyPlan = new MonthlyPlan({
                    _id             : new mongoose.Types.ObjectId(),    
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
                        res.status(200).json({
                           "message": "Monthly Plan Details submitted Successfully"
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
			
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
                res.status(200).json({
                    "message": "Monthly Plan Details updated Successfully."
                });
            }else{
                res.status(200).json({
                    "message": "Monthly Plan Details not modified"
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
    if(query != "1"){
        MonthlyPlan.find(query)
        // .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            // console.log("data",data);
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
            console.log(err);
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
    MonthlyPlan.deleteOne({_id:req.params.monthlyPlanID})
        .exec()
        .then(data=>{
            res.status(200).json({
                "message":"Monthly Plan Details deleted Successfully"
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
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
            }else{
                resolve(sectorData);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
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
exports.bulk_upload_manual_plan = (req,res,next)=>{
    var manualPlans = req.body.data;
    // console.log("manualPlans",manualPlans);
    var newmplanLst = [];
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];

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
            if (typeof manualPlans[k].noOfBeneficiaries != 'number') {
                remark += "noOfBeneficiaries should be in number format, " 
            }
            if (typeof manualPlans[k].noOfFamilies != 'number') {
                remark += "noOfFamilies should be in number format, " 
            }
            if (req.body.reqdata.projectCategoryType != "LHWRF Grant" && req.body.reqdata.projectCategoryType != "Project Fund") {
                remark += "projectCategoryType should be only 'LHWRF Grant' or  'Project Fund', " 
            }
            // if (typeof manualPlans[k].LHWRF != 'number') {
            //     remark += "LHWRF should be in number format, " 
            // }
            // if (typeof manualPlans[k].NABARD != 'number') {
            //     remark += "NABARD should be in number format, " 
            // }
            // if (typeof manualPlans[k].bankLoan != 'number') {
            //     remark += "bankLoan should be in number format, " 
            // }
            // if (typeof manualPlans[k].govtscheme != 'number') {
            //     remark += "govtscheme should be in number format, " 
            // }
            // if (typeof manualPlans[k].directCC != 'number') {
            //     remark += "directCC should be in number format, " 
            // }
            // if (typeof manualPlans[k].indirectCC != 'number') {
            //     remark += "indirectCC should be in number format, " 
            // }
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

                var sector = allSectorsData.filter((data)=>{
                    if (data.sector == manualPlans[k].sectorName.trim() && data.activity.activityName == manualPlans[k].activityName.trim() && data.activity.subActivity.subActivityName == manualPlans[k].subactivityName.trim()) {
                        return data;
                    }
                })
                
                if (sector.length>0) {
                    var monthlyplanexists  = allMonthlyplans.filter((data)=>{
                    if (data.sectorName == manualPlans[k].sectorName.trim() && data.activityName == manualPlans[k].activityName.trim() 
                        && data.subactivityName == manualPlans[k].subactivityName.trim() 
                        && data.month == req.body.reqdata.month && data.year == req.body.reqdata.year && data.projectCategoryType == req.body.reqdata.projectCategoryType  && data.projectName == req.body.reqdata.projectName) {
                            return data;
                        }
                    })
                        
                    if (monthlyplanexists.length>0) {
                        invalidObjects = manualPlans[k];
                        invalidObjects.failedRemark = "Activity already exists for given month and year";
                        invalidData.push(invalidObjects); 
                    }else{
                        var sectorName = manualPlans[k].sectorName.trim();
                        var activityName = manualPlans[k].activityName.trim();
                        var subactivityName = manualPlans[k].subactivityName.trim();

                        validObjects = manualPlans[k];
                        validObjects.sectorName          = sectorName;
                        validObjects.activityName        = activityName;
                        validObjects.subactivityName     = subactivityName;
                        validObjects.month               = req.body.reqdata.month;              
                        validObjects.year                = req.body.reqdata.year;
                        validObjects.center_ID           = req.body.reqdata.center_ID;
                        validObjects.center              = req.body.reqdata.centerName;
                        validObjects.projectCategoryType = req.body.reqdata.projectCategoryType; //"LHWRFGrand" or "ProjectFund"
                        validObjects.projectName         = req.body.reqdata.projectCategoryType == "LHWRF Grant" ? "-" : req.body.reqdata.projectName;
                        validObjects.sector_ID           = sector[0]._id;
                        validObjects.activity_ID         = sector[0].activity._id;
                        validObjects.subactivity_ID      = sector[0].activity.subActivity._id;
                        validObjects.totalBudget         = totalBudget;
                        validObjects.other               = other;       
                        validObjects.fileName            = req.body.fileName;
                        validObjects.createdAt           = new Date();
                        validData.push(validObjects); 
                    }
                    
                }else{
                    invalidObjects = manualPlans[k];
                    invalidObjects.failedRemark = "Subactivity details not found";
                    invalidData.push(invalidObjects);   
                }
                
            }else{
                invalidObjects = manualPlans[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
                //res.status(200).json({"message":"Something went wrong!"});
            }
            remark= '';
        }
        //console.log("validData",validData);
        MonthlyPlan.insertMany(validData)
        .then(data=>{
            //console.log("data",data);
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
var getAllMonthlyplans = async (center_ID) => {
    return new Promise((resolve,reject)=>{
    MonthlyPlan.find({center_ID: center_ID})
        .exec()
        .then(data=>{
            resolve(data);
        })
        .catch(err =>{
            console.log(err);
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
    MonthlyPlan.find({center_ID: req.body.center_ID})
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            console.log(x[i])
            z.push({
                "fileName": x[i] !== undefined ? x[i] : "Manual",
                'count': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
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
    MonthlyPlan.deleteMany({"fileName":req.params.fileName})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message" : "Monthly Plans of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};