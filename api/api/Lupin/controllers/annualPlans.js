const mongoose          = require("mongoose");

const AnnualPlan        = require('../models/annualPlans');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Sectors           = require('../models/sectors');
const FailedRecords     = require('../models/failedRecords');
const _                 = require("underscore");

exports.create_annualPlan = (req,res,next)=>{
    var FYYear = req.body.year;
    const annualPlan = new AnnualPlan({
        _id                 : new mongoose.Types.ObjectId(),     
        month               : req.body.month,               
        year                : req.body.year,
        startDate           : FYYear.substring(3, 7)+"-04-01",
        endDate             : FYYear.substring(10,15)+"-03-31",
        projectCategoryType : req.body.projectCategoryType, //"LHWRFGrand" or "ProjectFund"
        projectName         : req.body.projectName,
        type                : req.body.type,
        center_ID           : req.body.center_ID,
        center              : req.body.center,
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
    annualPlan.save()
        .then(data=>{
            res.status(200).json({
                "message" : "Annual Plan Details submitted Successfully."
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.update_annualPlan = (req,res,next)=>{
    AnnualPlan.updateOne(
        { _id:req.body.annualPlan_ID},  
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
        if(data.nModified === 1){
            res.status(200).json({
                "message": "Annual Plan Details updated Successfully."
            });
        }else{
            res.status(401).json({
                "message": "Annual Plan Details not updated"
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
exports.list_annualPlan = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        AnnualPlan.find(query)
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
exports.fetch_annualPlan_with_ID_and_year = (req,res,next)=>{
    AnnualPlan.find({center_ID : req.params.centerID, year : req.params.year})
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
exports.list_annualPlan_with_limits = (req,res,next)=>{
    //console.log("req",req.body);
    var query = "1";
    if(req.body.center_ID != 'all'){
        query = { year : req.body.year, center_ID : req.body.center_ID}
    }else{
        query = { year : req.body.year}
    }
    if(query != "1"){
        AnnualPlan.find(query)
        .sort({"createdAt":-1})
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
                        "physicalUnit"        : parseFloat((a.physicalUnit).toFixed(4)),
                        "unitCost"            : parseFloat((a.unitCost).toFixed(4)),
                        "totalBudget"         : a.totalBudget,
                        "noOfBeneficiaries"   : a.noOfBeneficiaries,
                        "noOfFamilies"        : a.noOfFamilies,
                        "LHWRF"               : parseFloat((a.LHWRF).toFixed(4)),
                        "NABARD"              : parseFloat((a.NABARD).toFixed(4)),
                        "bankLoan"            : parseFloat((a.bankLoan).toFixed(4)),
                        "govtscheme"          : parseFloat((a.govtscheme).toFixed(4)),
                        "directCC"            : parseFloat((a.directCC).toFixed(4)),
                        "indirectCC"          : parseFloat((a.indirectCC).toFixed(4)),
                        "other"               : parseFloat((a.other).toFixed(4)),
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
exports.count_annualPlan = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        AnnualPlan.find(query)
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

exports.fetch_annualPlan = (req,res,next)=>{
    AnnualPlan.find({_id : req.params.annualPlanID})
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
exports.delete_annualPlan = (req,res,next)=>{
    AnnualPlan.deleteOne({_id:req.params.annualPlanID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message":"Annual Plan Details deleted Successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
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
            //console.log('data',data)
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
function insert_annualPlan(annualPlans,reqdata,sector,fileName){
    return new Promise((resolve,reject)=>{
        var FYYear = reqdata.year;
        const annualPlan = new AnnualPlan({
            _id                 : new mongoose.Types.ObjectId(),     
            month               : reqdata.month,               
            year                : reqdata.year,
            startDate           : FYYear.substring(3, 7)+"-04-01",
            endDate             : FYYear.substring(10,15)+"-03-31",
            center_ID           : reqdata.center_ID,
            center              : reqdata.center,
            projectCategoryType : reqdata.projectCategoryType, //"LHWRFGrand" or "ProjectFund"
            projectName         : reqdata.projectName,
            sector_ID           : sector.sector_ID,
            sectorName          : annualPlans.sectorName,
            activityName        : annualPlans.activityName,
            activity_ID         : sector.activity_ID,
            subactivity_ID      : sector.subactivity_ID,
            subactivityName     : annualPlans.subactivityName ? annualPlans.subactivityName : annualPlans.activityName,
            unit                : annualPlans.unit,
            physicalUnit        : annualPlans.physicalUnit,
            unitCost            : annualPlans.unitCost,
            totalBudget         : parseFloat(annualPlans.physicalUnit) * parseFloat(annualPlans.unitCost),
            noOfBeneficiaries   : annualPlans.noOfBeneficiaries,
            noOfFamilies        : annualPlans.noOfFamilies,
            LHWRF               : annualPlans.LHWRF,
            NABARD              : annualPlans.NABARD,
            bankLoan            : annualPlans.bankLoan,
            govtscheme          : annualPlans.govtscheme,
            directCC            : annualPlans.directCC,
            indirectCC          : annualPlans.indirectCC,
            other               : typeof annualPlans.other == "string" ? 0 : annualPlans.other,
            remark              : annualPlans.remark,
            fileName            : fileName,
            createdAt           : new Date()
        });
        annualPlan.save()
        .then(data=>{
            resolve({"data": data,"message":"Annual Plan Details submitted Successfully", "created": 1})
        })
        .catch(err =>{
            console.log(err);
           reject(err);
        });
    });
}
exports.bulk_upload_annual_plan = (req,res,next)=>{
    var annualPlans = req.body.data;
    // console.log("annualPlans",annualPlans);
    var newaplanLst = [];
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    
    getaplanData();
    async function getaplanData(){    
        var allSectorsData = await getAllSectors();
        var allAnnualplans = await getAllAnnualplans(req.body.reqdata.center_ID);

        for(var k = 0 ; k < annualPlans.length ; k++){
            if (annualPlans[k].sectorName == '-') {
                remark += "sector name not found, " ; 
                // annualPlans[k].sectorName = null; 
            }
            if (annualPlans[k].activityName == '-') {
                remark += "activity name not found, ";
                // annualPlans[k].activityName = null; 
            }
            if (typeof annualPlans[k].physicalUnit != 'number') {
                remark += "physicalUnit should be in number format, " 
            }
            
            if (typeof annualPlans[k].unitCost != 'number') {
                remark += "unitCost should be in number format, " 
            }

            if (typeof annualPlans[k].noOfBeneficiaries != 'number') {
                remark += "noOfBeneficiaries should be in number format, " 
            }
            if (typeof annualPlans[k].noOfFamilies != 'number') {
                remark += "noOfFamilies should be in number format, " 
            }
            if (annualPlans[k].programCategory != "LHWRF Grant" && annualPlans[k].programCategory != "Project Fund") {
                remark += "projectCategoryType should be only 'LHWRF Grant' or  'Project Fund', " 
            }
            /*************commented part********/
            
            if (typeof annualPlans[k].LHWRF != 'number') {
                remark += "LHWRF should be in number format, " 
            }
            if (typeof annualPlans[k].NABARD != 'number') {
                remark += "NABARD should be in number format, " 
            }
            // console.log('bankLoan',typeof annualPlans[k].bankLoan, annualPlans[k].bankLoan)
            if (typeof annualPlans[k].bankLoan != 'number') {
                remark += "bankLoan should be in number format, " 
            }
            
            // console.log('govtscheme',typeof annualPlans[k].govtscheme, annualPlans[k].govtscheme)
            if (typeof annualPlans[k].govtscheme != 'number') {
                remark += "govtscheme should be in number format, " 
            }
            // console.log('govtscheme',typeof annualPlans[k].directCC, annualPlans[k].directCC)
            if (typeof annualPlans[k].directCC != 'number') {
                remark += "directCC should be in number format, " 
            }
            // console.log('govtscheme',typeof annualPlans[k].indirectCC, annualPlans[k].indirectCC)
            if (typeof annualPlans[k].indirectCC != 'number') {
                remark += "indirectCC should be in number format, " 
            }
            /*********************/

            var FYYear = req.body.reqdata.year;
            var other = typeof annualPlans[k].other == "string" ? 0 : annualPlans[k].other;
            var totalBudget = (parseFloat(annualPlans[k].physicalUnit) * parseFloat(annualPlans[k].unitCost)).toFixed(4);
            
            var LHWRF = isNaN(Number(annualPlans[k].LHWRF)) ? 0 : parseFloat(annualPlans[k].LHWRF);
            var NABARD = isNaN(Number(annualPlans[k].NABARD)) ? 0 : parseFloat(annualPlans[k].NABARD);
            var bankLoan = isNaN(Number(annualPlans[k].bankLoan)) ? 0 : parseFloat(annualPlans[k].bankLoan);
            var govtscheme = isNaN(Number(annualPlans[k].govtscheme)) ? 0 : parseFloat(annualPlans[k].govtscheme);
            var directCC = isNaN(Number(annualPlans[k].directCC)) ? 0 : parseFloat(annualPlans[k].directCC);
            var indirectCC = isNaN(Number(annualPlans[k].indirectCC)) ? 0 : parseFloat(annualPlans[k].indirectCC);
            var other = isNaN(Number(annualPlans[k].other)) ? 0 :  parseFloat(annualPlans[k].other);    
            
            if (totalBudget != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other).toFixed(4) ) {
                remark += "total budget should be equal to sum of 7 Source of Funds, " 
            }
            
            if (remark == '') {
                
                var sector = allSectorsData.filter((data)=>{
                    if ((data.sector).toLowerCase() == (annualPlans[k].sectorName.trim()).toLowerCase() && (data.activity.activityName).toLowerCase() == (annualPlans[k].activityName.trim()).toLowerCase() && (data.activity.subActivity.subActivityName).toLowerCase() == (annualPlans[k].subactivityName.trim()).toLowerCase()) {
                        return data;
                    }
                })
                console.log("sector",sector)
                if (sector.length>0) {
                    //console.log("year",req.body.reqdata.year)
                    var annualplanexists  = allAnnualplans.filter((data)=>{
                        if ((data.sectorName).toLowerCase() == (annualPlans[k].sectorName.trim()).toLowerCase() && (data.activityName).toLowerCase() == (annualPlans[k].activityName.trim()).toLowerCase() 
                            && (data.subactivityName).toLowerCase() == (annualPlans[k].subactivityName.trim()).toLowerCase() && (data.year).toLowerCase() == (req.body.reqdata.year).toLowerCase()  && (data.projectCategoryType).toLowerCase() == (annualPlans[k].programCategory).toLowerCase() && (data.projectName).toLowerCase() == (annualPlans[k].projectName).toLowerCase()) {
                            return data;
                        }
                    })
                    
                    if (annualplanexists.length>0) {
                        invalidObjects = annualPlans[k];
                        invalidObjects.failedRemark = "Activity already exists for given year";
                        invalidData.push(invalidObjects); 
                    }else{
                        var sectorName = annualPlans[k].sectorName.trim()
                        var activityName = annualPlans[k].activityName.trim()
                        var subactivityName = annualPlans[k].subactivityName.trim()

                        validObjects = annualPlans[k]; 
                        validObjects.sectorName          = sectorName;
                        validObjects.activityName        = activityName;
                        validObjects.subactivityName     = subactivityName;
                        validObjects.month               = req.body.reqdata.month;              
                        validObjects.year                = req.body.reqdata.year;
                        validObjects.startDate           = FYYear.substring(3, 7)+"-04-01";
                        validObjects.endDate             = FYYear.substring(10,15)+"-03-31";
                        validObjects.center_ID           = req.body.reqdata.center_ID;
                        validObjects.center              = req.body.reqdata.centerName;
                        validObjects.projectCategoryType = annualPlans[k].programCategory; //"LHWRFGrand" or "ProjectFund"
                        validObjects.projectName         = annualPlans[k].programCategory == "LHWRF Grant" ? "-" : annualPlans[k].projectName;
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
                    invalidObjects = annualPlans[k];
                    invalidObjects.failedRemark = "Subactivity details not found";
                    invalidData.push(invalidObjects);   
                }
                
            }else{
                //console.log('2. annualPlans',annualPlans[k])
                invalidObjects = annualPlans[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }
        //console.log("validData",validData);
        AnnualPlan.insertMany(validData)
        .then(data=>{
            //console.log("data",data);
        })
        .catch(err =>{
            console.log(err);
        });
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords, req.body.updateBadData);
        
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
            });
    }
}
var getAllAnnualplans = async (center_ID) => {
    return new Promise((resolve,reject)=>{
    AnnualPlan.find({center_ID: center_ID})
        .exec()
        .then(data=>{
            resolve(data);
        })
        .catch(err =>{
            console.log(err);
        });
    });
};
var insertFailedRecords = async (invalidData, updateBadData) => {
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
    AnnualPlan.find({center_ID: req.params.center_ID,fileName:req.params.fileName})
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
    AnnualPlan.find({center_ID: req.body.center_ID})
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
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
    AnnualPlan.find({center_ID: req.params.center_ID})
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
    AnnualPlan.deleteMany({"fileName":req.params.fileName})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message" : "Plans of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });   
};


function annualPlan(searchData){
    return new Promise(function(resolve,reject){
        AnnualPlan  .findOne(
                            {
                                "center_ID"         : searchData.center_ID,
                                "sector_ID"         : searchData.sector_ID,
                                "activity_ID"       : searchData.activity_ID,
                                "subactivity_ID"    : searchData.subactivity_ID,
                                "year"              : searchData.year
                            }
                    )
                    .exec()
                    .then(annualPlanData=>{
                        if(annualPlanData){
                            resolve({
                                "physicalUnit"  : annualPlanData.physicalUnit,
                                "totalBudget"   : annualPlanData.totalBudget,
                                "reach"         : annualPlanData.noOfBeneficiaries,
                                "familyUpgrade" : annualPlanData.noOfFamilies,
                                "LHWRF"         : annualPlanData.LHWRF,
                                "NABARD"        : annualPlanData.NABARD,
                                "bankLoan"      : annualPlanData.bankLoan,
                                "govtscheme"    : annualPlanData.govtscheme,
                                "directCC"      : annualPlanData.directCC,
                                "indirectCC"    : annualPlanData.indirectCC,
                                "other"         : annualPlanData.other,
                                "remark"        : annualPlanData.remark,
                                "unitCost"      : annualPlanData.unitCost
                            });
                        }else{
                            resolve({
                                "physicalUnit"  : 0,
                                "totalBudget"   : 0,
                                "reach"         : 0,
                                "familyUpgrade" : 0,
                                "LHWRF"         : 0,
                                "NABARD"        : 0,
                                "bankLoan"      : 0,
                                "govtscheme"    : 0,
                                "directCC"      : 0,
                                "indirectCC"    : 0,
                                "other"         : 0,
                                "remark"        : "",
                                "unitCost"      : 0,
                            });
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    });
};


function monthlyPlan(monthlyData){
    return new Promise(function(resolve,reject){
        MonthlyPlan.aggregate([
                        {
                            $match :
                                    {
                                        "sector_ID"     : String(monthlyData.sector_ID),
                                        "activity_ID"   : String(monthlyData.activity_ID),
                                        "subactivity_ID": String(monthlyData.subactivity_ID),
                                        "year"          : { $in : monthlyData.yearList},
                                        "month"         : { $in : monthlyData.monthList}
                                    }
                        },
                        {
                            $group : 
                                    {
                                        "_id"                           : null,
                                        "monthlyPlan_physicalUnit"      : { "$sum" : "$physicalUnit" },
                                        "monthlyPlan_totalBudget"       : { "$sum" : "$totalBudget" },
                                        "monthlyPlan_LHWRF"             : { "$sum" : "$LHWRF" },
                                        "monthlyPlan_NABARD"            : { "$sum" : "$NABARD" },
                                        "monthlyPlan_Bank_Loan"         : { "$sum" : "$bankLoan" },
                                        "monthlyPlan_Indirect"          : { "$sum" : "$indirectCC"},
                                        "monthlyPlan_DirectCC"          : { "$sum" : "$directCC"},
                                        "monthlyPlan_govtscheme"        : { "$sum" : "$govtscheme"},
                                        "monthlyPlan_other"             : { "$sum" : "$other"},
                                        "monthlyPlan_reach"             : { "$sum" : "$noOfBeneficiaries"},
                                        "monthlyPlan_familyUpgrade"     : { "$sum" : "$noOfFamilies"}
                                    }
                        }
                    ])
                    .exec()
                    .then(monthlyData=>{
                        if(monthlyData.length > 0){
                            resolve(monthlyData[0]);
                        }else{
                            resolve({
                                "_id"                       : null,
                                "monthlyPlan_physicalUnit"  : 0,
                                "monthlyPlan_totalBudget"   : 0,
                                "monthlyPlan_LHWRF"         : 0,
                                "monthlyPlan_NABARD"        : 0,
                                "monthlyPlan_Bank_Loan"     : 0,
                                "monthlyPlan_Indirect"      : 0,
                                "monthlyPlan_DirectCC"      : 0,
                                "monthlyPlan_govtscheme"    : 0,
                                "monthlyPlan_other"         : 0,
                                "monthlyPlan_reach"         : 0,
                                "monthlyPlan_familyUpgrade" : 0
                            });
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};