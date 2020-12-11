const mongoose	= require("mongoose");
const async = require("async");
const BadRecord = require('../models/badrecords');
var   ObjectID    = require('mongodb').ObjectID;
const FailedRecords = require('../../Lupin/models/failedRecords.js');
const _         = require("underscore");
const States = require('../models/states');
const Districts = require('../models/districts');
const Blocks      = require('../models/blocks');
const Cities      = require('../models/cities');


exports.getDistrictsList = (req,res,next)=>{
    // console.log('params',req.params);
    var selector = {};
    if(req.params.countryID != 'all'){
        selector.countryID = ObjectID(req.params.countryID);
    }
    if(req.params.stateID != 'all'){
        selector.stateID = ObjectID(req.params.stateID);
    }
    var query = { $match : selector};
    // console.log('query',query);
    Districts.aggregate([
                    query,
                    { 
                        $lookup:
                           {
                             from: 'countries',
                             localField: 'countryID',
                             foreignField: '_id',
                             as: 'countryDetails'
                           }
                    },
                    { 
                        $lookup: 
                           {
                             from: 'states',
                             localField: 'stateID',
                             foreignField: '_id',
                             as: 'stateDetails'
                           }
                    },
                    { "$unwind": "$countryDetails" },
                    { "$unwind": "$stateDetails" },
                    { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                                        countryName     : '$countryDetails.countryName',
                                        stateCode       : '$stateDetails.stateCode',
                                        stateName       : '$stateDetails.stateName'
                                      } },
                ])
                .sort({ "districtName": 1 })
                .exec()
                .then(data=>{
                    if(data.length>0){
                        var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryCode,
                            "countryName"         : x.countryName,  
                            "stateCode"           : x.stateCode,
                            "stateName"           : camelCase(x.stateName),
                            "districtName"        : camelCase(x.districtName),
                        }
                        })
                        res.status(200).json(allData);
                    }else{
                        res.status(200).json({"message" : 'District not found for this '+ req.params.stateCode +' State Code and '+req.params.countryCode+' Country Code'});
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}
exports.getDistricts = (req,res,next)=>{
    Districts.aggregate([
        { $lookup:
               {
                 from: 'countries',
                 localField: 'countryID',
                 foreignField: '_id',
                 as: 'countryDetails'
               }
        },
        { $lookup: 
               {
                 from: 'states',
                 localField: 'stateID',
                 foreignField: '_id',
                 as: 'stateDetails'
               }
         },
          { "$unwind": "$countryDetails" },
          { "$unwind": "$stateDetails" },
          { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                            countryName     : '$countryDetails.countryName',
                            stateCode       : '$stateDetails.stateCode',
                            stateName       : '$stateDetails.stateName'
                          } },
          { "$match" : { "countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                         "stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } } }                 
        ])
        .sort({ "districtName": 1 })
                .exec()
                .then(data=>{
                    if(data.length>0){
                        var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryCode,
                            "countryName"         : x.countryName,  
                            "stateCode"           : x.stateCode,
                            "stateName"           : camelCase(x.stateName),
                            "districtName"        : camelCase(x.districtName),
                        }
                        })
                        res.status(200).json(allData);
                        //res.status(200).json(data);
                    }else{
                        res.status(200).json({"message" : 'District not found for this '+ req.params.stateCode +' State Code and '+req.params.countryCode+' Country Code'});
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

exports.getDistrictsFromMultipleStates = (req,res,next)=>{
    Districts.aggregate([
    { $lookup:
           {
             from: 'countries',
             localField: 'countryID',
             foreignField: '_id',
             as: 'countryDetails'
           }
    },
    { $lookup: 
           {
             from: 'states',
             localField: 'stateID',
             foreignField: '_id',
             as: 'stateDetails'
           }
     },
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.body.countryCode, $options: "i" },
                     "stateCode"   :  { $in :   req.body.stateCodes  }  } }                 
    ]).sort({ "districtName": 1 })
    
                .exec()
                .then(data=>{
                    if(data.length>0){
                        var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryCode"         : x.countryCode,
                            "countryName"         : x.countryName,  
                            "stateCode"           : x.stateCode,
                            "stateName"           : camelCase(x.stateName),
                            "districtName"        : camelCase(x.districtName),
                        }
                        })
                        res.status(200).json(allData);
                        //res.status(200).json(data);
                    }else{
                        res.status(200).json({"message" : 'District not found for this '+ req.params.stateCode +' State Code and '+req.params.countryCode+' Country Code'});
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}
var camelCase = (str)=>{
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

exports.bulkinsert = (req,res,next)=>{
    // console.log('req.body',req.body);
    var goodRecord = 0;
    var badRecord = 0;
    var DuplicateCount = 0;
    var invalidData = [];
    var invalidObjects = [];
    var validationRemark   = ''; 
    var failedRecords   = [];

    getData();
    async function getData(){
        var invalidData = [];
        var invalidObjects = [];
        var finaldata = req.body.data;
        // console.log('finaldata',finaldata.length)
        var excelData = req.body.excelData;
        var reqdata = req.body.reqdata;        
        // console.log('reqdata',reqdata)

        for(k = 0 ; k < finaldata.length ; k++){
            if (finaldata[k].stateName == '-') {
                validationRemark += "stateName not found, " ;  
            }
            if (finaldata[k].districtName == '-') {
                validationRemark += "districtName not found, " ;  
            }
            if (validationRemark == '') {
                var statePresent    = await findState(finaldata[k].stateName);
                // console.log('statePresent',statePresent)
                var stateID = statePresent._id;

                if (stateID) {
                    var insertDistrictObject = await insertDistrict(finaldata[k], stateID, reqdata, req.body.fileName)
                    var districtID = insertDistrictObject;
                    // console.log('insertDistrictObject',insertDistrictObject);
                    if (insertDistrictObject.duplicate) {
                        if (finaldata[k]) {
                            DuplicateCount++;
                            invalidObjects = finaldata[k];
                            validationRemark = "Duplicate record found";
                            invalidObjects.failedRemark = validationRemark;
                            invalidData.push(invalidObjects);
                        }
                    }else{
                        goodRecord++;
                    }
                }else{
                    invalidObjects = finaldata[k];
                    validationRemark = "State Name not available";
                    invalidObjects.failedRemark = validationRemark;
                    invalidData.push(invalidObjects);
                }
            }else{
                invalidObjects = finaldata[k];
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            }   
            validationRemark= '';      
        }
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        // console.log('failedRecords===============',failedRecords);
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
        });       
    }
};

var insertDistrict = async (data, stateID, reqdata, fileName) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        districtDuplicateControl();
        async function districtDuplicateControl(){    
            var districtPresent = await findDistrict(data.districtName, stateID);
            // console.log('districtPresent',districtPresent)    
            if (districtPresent==0) {
                const district = new Districts({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    countryID               : reqdata.countryID,
                    stateID                 : stateID,
                    districtName            : data.districtName,
                    fileName                : fileName,
                    createdAt               : new Date()
                    });
                    
                    district
                    .save()
                    .then(data=>{
                        resolve(data);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var districtPresent = await findDistrict(data.districtName, stateID);
                resolve({districtPresent:districtPresent, duplicate: true});
                // console.log('districtPresent',districtPresent);
            }
        }
    })
}

function findState(stateName) {
    return new Promise(function(resolve,reject){  
    States.findOne({ "stateName": {'$regex' : "^"+stateName+"$" , $options: "i"} })
                .exec()
                .then(stateObject=>{
                    if(stateObject){
                        resolve(stateObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}

function findDistrict(districtName, stateID) {
    return new Promise(function(resolve,reject){  
    Districts.findOne({ "districtName": {'$regex' : districtName , $options: "i"}, "stateID": stateID })
                .exec()
                .then(districtObject=>{
                    // console.log('districtObject===',districtObject);
                    if(districtObject){
                        resolve(districtObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
var insertFailedRecords = async (invalidData,updateBadData) => {
    //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
    FailedRecords.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
                if(data.length>0){
                    //console.log('data',data)   
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
    // console.log(req.params.fileName)
    Districts.find({fileName:req.params.fileName})
    .exec()
    .then(data=>{
        // console.log('data',data);
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

exports.fetchDistrict = (req,res,next)=>{
    Districts.find({_id : req.params.districtID})
    .exec()
    .then(data=>{
        // console.log('data',data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

function findStateName(stateID) {
    return new Promise(function(resolve,reject){  
    States.find({_id : stateID})
        .exec()
        .then(stateObject=>{
            console.log('stateObject',stateObject);
            if(stateObject){
                resolve(stateObject);
            }else{
                resolve(0);
            }
        })
    })           
}
/*
exports.filedetails = (req,res,next)=>{
    var finaldata = {};
    // console.log(req.params.fileName)
    Districts.find({fileName:req.params.fileName})
    .exec()
    .then(data=>{
        getData();
        async function getData(){
            console.log("data");
            for(i = 0 ; i < data.length ; k++){
                var stateName = await findStateName(data[i].stateID)
                data.stateName = stateName;
            }
            //finaldata.push({goodrecords: data})
            finaldata.goodrecords = data;
            console.log('finaldata.goodrecords',finaldata.goodrecords);
            FailedRecords.find({fileName:req.params.fileName})  
                .exec()
                .then(badData=>{
                    finaldata.failedRecords = badData[0].failedRecords
                    finaldata.totalRecords = badData[0].totalRecords
                    res.status(200).json(finaldata);
                })
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
*/

var insertBadData = async (invalidData) => {
    //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
        BadRecord.find({fileName:invalidData.fileName})  
                .exec()
                .then(data=>{
                    if(data.length>0){
                        if (data[0].badRecords.length>0) {
                            BadRecord.updateOne({ fileName:invalidData.fileName},  
                                 {   $set:   { 'badRecords': [] } })
                                .then(data=>{
                                if(data.nModified == 1){
                                   BadRecord.updateOne({ fileName:invalidData.fileName},  
                                    {   $set:   {'totalRecords': invalidData.totalRecords},
                                        $push:  { 'badRecords' : invalidData.badRecords } 
                                    })
                                    .then(data=>{
                                    if(data.nModified == 1){
                                        resolve(data);
                                    }else{
                                        resolve(data);
                                    }
                                })
                                .catch(err =>{
                                    reject(err);
                                });
                                }else{
                                    resolve(0);
                                }
                            })
                            .catch(err =>{
                                reject(err);
                            });
                        } 
                        else{
                            //console.log('data',data)   
                            BadRecord.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'badRecords' : invalidData.badRecords } 
                                })
                                .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{
                                reject(err);
                            });
                        } 
                    }else{
                        const badRecord = new BadRecord({
                        _id                     : new mongoose.Types.ObjectId(),                    
                        badRecords              : invalidData.badRecords,
                        fileName                : invalidData.fileName,
                        totalRecords            : invalidData.totalRecords,
                        createdAt               : new Date()
                        });
                        
                        badRecord
                        .save({checkKeys: false})
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

exports.deleteDistict = (req,res,next)=>{
    // console.log("_id",req.params.districtID);
    Blocks.find({"districtID":req.params.districtID})
    .exec()
    .then(blockData=>{
        Cities.find({"districtID":req.params.districtID})
        .exec()
        .then(cityData=>{
            // console.log('blockData',blockData.length);
            // console.log('cityData',cityData.length);
            if(blockData.length > 0 && cityData.length > 0){
                res.status(200).json({
                    "message" : "District can not be deleted, It is already used in Block & City"
                });
            }else if(blockData.length > 0 && cityData.length == 0){
                res.status(200).json({
                    "message" : "District can not be deleted, It is already used in Block"
                });
            }else{
                Districts.deleteOne({"_id":req.params.districtID})
                .exec()
                .then(data=>{
                    // console.log('data',data);
                    res.status(200).json({
                        "message" : "District deleted successfully"
                    });
                })
                .catch(err =>{
                    console.log(err);
                    
                });
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};