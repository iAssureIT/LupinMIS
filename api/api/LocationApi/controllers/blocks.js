const mongoose    	= require("mongoose");
const async         = require("async");

const FailedRecords = require('../../Lupin/models/failedRecords.js');
var   ObjectID      = require('mongodb').ObjectID;
const States        = require('../models/states');
const Districts     = require('../models/districts');
const Blocks        = require('../models/blocks');
const Cities        = require('../models/cities');
 
exports.getBlocksList = (req,res,next)=>{ 
  var selector = {};
  if(req.params.countryID != 'all'){
    selector.countryID = ObjectID(req.params.countryID);
  }
  if(req.params.stateID != 'all'){
    selector.stateID = ObjectID(req.params.stateID);
  }
  if(req.params.districtID != 'all'){
    selector.districtID = ObjectID(req.params.districtID);
  }
  var query = { $match : selector};
  // console.log('selector',selector);
    Blocks.aggregate([
              query,
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
               { $lookup:
                     {
                       from: 'districts',
                       localField: 'districtID',
                       foreignField: '_id',
                       as: 'districtDetails'
                     }
               },
            ])
            .sort({ "blockName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                  // console.log(data)
                    var allData = data.map((x, i)=>{
                        // console.log("x",x)
                        // console.log("x.districtDetails",x.districtDetails)
                        // console.log("x.districtDetails[0]",x.districtDetails[0])
                        return {
                            "_id"                 : x._id,
                            "countryID"           : x.countryDetails[0]._id,
                            "countryCode"         : x.countryDetails[0].countryCode,
                            "countryName"         : x.countryDetails[0].countryName, 
                            "stateID"             : x.stateDetails[0]._id, 
                            "stateCode"           : x.stateDetails[0].stateCode,
                            "stateName"           : camelCase(x.stateDetails[0].stateName),
                            "districtID"          : x.districtDetails.length > 0 ? x.districtDetails[0]._id : "",
                            "districtName"        : x.districtDetails.length > 0 ? camelCase(x.districtDetails[0].districtName) : "",
                            "blockName"           : camelCase(x.blockName),
                        }
                        })
                        res.status(200).json(allData);
                }else{
                    res.status(200).json({"message" : 'Block not found for this '+ req.params.stateCode +' State Code and '+req.params.districtName+' District'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}
exports.getBlocks = (req,res,next)=>{ 
    Blocks.aggregate([
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
     { $lookup:
           {
             from: 'districts',
             localField: 'districtID',
             foreignField: '_id',
             as: 'districtDetails'
           }
     },
      { "$match" : { "countryDetails.countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                     "stateDetails.stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } ,
                     "districtDetails.districtName":  { "$regex": req.params.districtName, $options: "i" } } 
    }            
    ]).sort({ "blockName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                  // console.log(data)
                    var allData = data.map((x, i)=>{
                        return {
                            "_id"                 : x._id,
                            "countryID"           : x.countryDetails[0]._id,
                            "countryCode"         : x.countryDetails[0].countryCode,
                            "countryName"         : x.countryDetails[0].countryName, 
                            "stateID"             : x.stateDetails[0]._id, 
                            "stateCode"           : x.stateDetails[0].stateCode,
                            "stateName"           : camelCase(x.stateDetails[0].stateName),
                            "districtID"          : x.districtDetails[0]._id,
                            "districtName"        : camelCase(x.districtDetails[0].districtName),
                            "blockName"           : camelCase(x.blockName),
                        }
                        })
                        res.status(200).json(allData);
                }else{
                    res.status(200).json({"message" : 'Block not found for this '+ req.params.stateCode +' State Code and '+req.params.districtName+' District'});
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
exports.getBlocksByState = (req,res,next)=>{ 
    // console.log(req.params);

    Blocks.aggregate([
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
     { $lookup:
           {
             from: 'districts',
             localField: 'districtID',
             foreignField: '_id',
             as: 'districtDetails'
           }
     },
      { "$unwind": "$countryDetails" },
      { "$unwind": "$stateDetails" },
      { "$unwind": "$districtDetails" },
      { "$addFields": { countryCode     : '$countryDetails.countryCode', 
                        countryName     : '$countryDetails.countryName',
                        stateCode       : '$stateDetails.stateCode',
                        stateName       : '$stateDetails.stateName',
                        districtName    : '$districtDetails.districtName'
                      } },
      { "$match" : { "countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                     "stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } } 
    }            
    ]).sort({ "blockName": 1 })

            .exec()
            .then(data=>{
                //console.log(data);
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Block not found for this '+ req.params.stateCode +' State Code'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
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
      if (finaldata[k].blockName == '-') {
        validationRemark += "blockName not found, " ;  
      }
      if (validationRemark == '') {
        var statePresent    = await findState(finaldata[k].stateName);
        // console.log('statePresent',statePresent)
        var stateID = statePresent._id;
        if(stateID) {
          var districtPresent = await findDistrict(finaldata[k].districtName, stateID);
          var districtID = districtPresent._id;          
          if (districtID) {
            var insertBlockObject = await insertBlock(finaldata[k], stateID, districtID, reqdata, req.body.fileName)
            var blockID = insertBlockObject._id;
            if (insertBlockObject.duplicate) {
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
            validationRemark = "District Name not available";
            invalidObjects.failedRemark = validationRemark;
            invalidData.push(invalidObjects);
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
var insertBlock = async (data, stateID, districtID, reqdata, fileName) => {
  return new Promise(function(resolve,reject){ 
    blockDuplicateControl();
    async function blockDuplicateControl(){
      var blockPresent = await findBlock(data.blockName, stateID, districtID);
      //console.log('statePresent',statePresent)    
      if (blockPresent==0) {
        const block = new Blocks({
          _id                     : new mongoose.Types.ObjectId(),                    
          countryID               : reqdata.countryID,
          stateID                 : stateID,
          districtID              : districtID,
          blockName               : data.blockName,
          fileName                : fileName,
          createdAt               : new Date()
        });
          
        block
        .save()
        .then(data=>{
          resolve(data._id);
        })
        .catch(err =>{
          console.log(err);
          reject(err);
        });
      }else{
        var blockPresent = await findBlock(data.blockName, stateID, districtID);
        resolve({blockPresent:blockPresent, duplicate: true});
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

function findBlock(blockName, stateID, districtID) {
  return new Promise(function(resolve,reject){  
    Blocks.findOne({   
          "blockName":blockName,
          //"blockName": {'$regex' : "^"+blockName+"$" , $options: "i"}, 
          "stateID": stateID,  "districtID":districtID})
        .exec()
        .then(blockObject=>{
          if(blockObject){
              resolve(blockObject);
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
  Blocks.find({fileName:req.params.fileName})
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
          // console.log('stateObject',stateObject);
          if(stateObject){
              resolve(stateObject);
          }else{
              resolve(0);
          }
      })
  })           
}
function findDistrictName(stateID) {
    return new Promise(function(resolve,reject){  
    Districts.find({_id : stateID})
        .exec()
        .then(stateObject=>{
            // console.log('stateObject',stateObject);
            if(stateObject){
                resolve(stateObject);
            }else{
                resolve(0);
            }
        })
    })           
}
exports.deleteBlock = (req,res,next)=>{
  // console.log("_id",req.params.blockID);
  Cities.find({"blockID":req.params.blockID})
  .exec()
  .then(cityData=>{
    // console.log('cityData',cityData.length);
    if(cityData.length > 0){
      res.status(200).json({
          "message" : "Block can not be deleted, It is already used in City"
      });
    }else{
      Blocks.deleteOne({"_id":req.params.blockID})
      .exec()
      .then(data=>{
        // console.log('data',data);
        res.status(200).json({
          "message" : "Block deleted successfully"
        });
      })
      .catch(err =>{
        console.log(err);          
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