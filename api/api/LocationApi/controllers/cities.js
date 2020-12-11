const mongoose	  = require("mongoose");
const async       = require("async");
var   ObjectID    = require('mongodb').ObjectID;

const States      = require('../models/states');
const Districts   = require('../models/districts');
const Blocks      = require('../models/blocks');
const Cities      = require('../models/cities');
const FailedRecords = require('../../Lupin/models/failedRecords.js');

exports.getCities = (req,res,next)=>{
  // console.log('req',req.params);
    Cities.aggregate([
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
          { $lookup:
                 {
                   from: 'blocks',
                   localField: 'blockID',
                   foreignField: '_id',
                   as: 'blockDetails'
                 }
          },    
          { "$match" : 
              {  
                "countryDetails.countryCode" :  { "$regex": req.params.countryCode, $options: "i" },
                "stateDetails.stateCode"   :  { "$regex": req.params.stateCode, $options: "i" } ,
                //"districtDetails.districtName":  { "$regex": req.params.districtName, $options: "i" },
                //"blockName"   :  { "$regex": req.params.blockName, $options: "i" }
              } 
          }     
        ])
        .exec()
        .then(data=>{   
          if(data.length>0){   
            var allData = data.map((x, i)=>{
              //console.log(x);   
              if (x.districtDetails[0].districtName.toLowerCase() == req.params.districtName
                && x.blockDetails[0].blockName.toLowerCase()== req.params.blockName) {}
                return {
                  "_id"                 : x._id,
                  "countryCode"         : x.countryDetails[0].countryCode,
                  "countryName"         : x.countryDetails[0].countryName, 
                  "stateCode"           : x.stateDetails[0].stateCode, 
                  "stateName"           : camelCase(x.stateDetails[0].stateName),
                  "districtName"        : x.districtDetails.length > 0 ? camelCase(x.districtDetails[0].districtName) : "",
                  "blockName"           : x.blockDetails.length > 0 ? camelCase(x.blockDetails[0].blockName) : "",
                  "cityName"            : camelCase(x.cityName)  
                }
              })
              res.status(200).json(allData); 
          }else{
            res.status(200).json({"message" : 'City not found for this '+ req.params.districtName +' District and '+req.params.blockName+' block'});
          }
        })
        .catch(err =>{
          console.log(err);
          res.status(500).json({
              error: err
          });
        });
};
exports.getVillagelist = (req,res,next)=>{
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
  if(req.params.blockID != 'all'){
    selector.blockID = ObjectID(req.params.blockID);
  }  
  var query = { $match : selector};
  // console.log('query',query);
    Cities.aggregate([
          query,
          { $lookup:
                 {
                   from: 'countries',
                   localField: 'countryID',
                   foreignField: '_id',
                   as: 'countryDetails'
                 }
          },
          {
            $unwind : "$countryDetails"
          },
          { $lookup:
                 {
                   from: 'states',
                   localField: 'stateID',
                   foreignField: '_id',
                   as: 'stateDetails'
                 }
          },
          {
            $unwind : "$stateDetails"
          },
          { $lookup:
                 {
                   from: 'districts',
                   localField: 'districtID',
                   foreignField: '_id',
                   as: 'districtDetails'
                 }
          },
          {
            $unwind : "$districtDetails"
          },
          { $lookup:
                 {
                   from: 'blocks',
                   localField: 'blockID',
                   foreignField: '_id',
                   as: 'blockDetails'
                 }
          },  
          {
            $unwind : "$blockDetails"
          },
          {
            $project: {
                "countryCode"  :  "$countryDetails.countryCode",
                "countryName"  :  "$countryDetails.countryName",
                "stateCode"    :  "$stateDetails.stateCode",
                "stateName"    :  "$stateDetails.stateName",
                "districtName" :  "$districtDetails.districtName",
                "blockName"    :  "$blockDetails.blockName",
                "cityName"     :  "$cityName",
              }
            }
        ])
        .exec()
        .then(data=>{
          // console.log('data',data.length);
          res.status(200).json(data); 
        })
        .catch(err =>{
          console.log(err);
          res.status(500).json({
              error: err
          });
        });
};
exports.getpostVillagelist = (req,res,next)=>{
  var selector = {};
  if(req.body.countryID != 'all'){
    selector.countryID = ObjectID(req.body.countryID);
  }
  if(req.body.stateID != 'all'){
    selector.stateID = ObjectID(req.body.stateID);
  }
  if(req.body.districtID != 'all'){
    selector.districtID = ObjectID(req.body.districtID);
  }
  if(req.body.blockID != 'all'){
    selector.blockID = ObjectID(req.body.blockID);
  }  
  var query = { $match : selector};
  // console.log('query',query);
    Cities.aggregate([
          query,
          { $lookup:
                 {
                   from: 'countries',
                   localField: 'countryID',
                   foreignField: '_id',
                   as: 'countryDetails'
                 }
          },
          {
            $unwind : "$countryDetails"
          },
          { $lookup:
                 {
                   from: 'states',
                   localField: 'stateID',
                   foreignField: '_id',
                   as: 'stateDetails'
                 }
          },
          {
            $unwind : "$stateDetails"
          },
          { $lookup:
                 {
                   from: 'districts',
                   localField: 'districtID',
                   foreignField: '_id',
                   as: 'districtDetails'
                 }
          },
          {
            $unwind : "$districtDetails"
          },
          { $lookup:
                 {
                   from: 'blocks',
                   localField: 'blockID',
                   foreignField: '_id',
                   as: 'blockDetails'
                 }
          },  
          {
            $unwind : "$blockDetails"
          },
          {
            $project: {
                "countryCode"  :  "$countryDetails.countryCode",
                "countryName"  :  "$countryDetails.countryName",
                "stateCode"    :  "$stateDetails.stateCode",
                "stateName"    :  "$stateDetails.stateName",
                "districtName" :  "$districtDetails.districtName",
                "blockName"    :  "$blockDetails.blockName",
                "cityName"     :  "$cityName",
              }
            }
        ])
        .exec()
        .then(data=>{
          // console.log('data',data.length);
          res.status(200).json(data.slice(req.body.startRange, req.body.limitRange)); 
        })
        .catch(err =>{
          console.log(err);
          res.status(500).json({
              error: err
          });
        });
};
var camelCase = (str)=>{
  return str
  .toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
}
exports.getCitiesWithId = (req,res,next)=>{
    Cities.find({
    "countryID" : ObjectID(req.params.countryID),
    "stateID"   : ObjectID(req.params.stateID),
    "districtID": ObjectID(req.params.districtID),
    "blockID"   : ObjectID(req.params.blockID)
    })
    .exec()
    .then(data=>{  
        if(data.length>0){   
          var allData = data.map((x, i)=>{
          //console.log(x);   
          return {
              "_id"                 : x._id,
              "cityName"            : camelCase(x.cityName)  
          }
          })
          res.status(200).json(allData); 
        }else{
            res.status(200).json({"message" : 'City not found for this '+ req.params.districtName +' District and '+req.params.blockName+' block'});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
}
exports.getCitiesByState = (req,res,next)=>{

        // Remove these 2 lines after client confirmation. These are temporary lines.
        // These two lines are just to reduce the data coming in to website. 
        //                "districtName"  :  "Pune",
        //                "blockName"     :  "Haveli",
        

        Cities  
        .find({
                "countryCode"   :   { "$regex": req.params.countryCode, $options: "i"},
                "stateCode"     :   { "$regex": req.params.stateCode, $options: "i"},
                "districtName"  :  "Pune",
                "blockName"     :  "Haveli",  
              },{districtName:1, blockName:1, cityName:1})
            .sort({"cityName": 1})
            .exec()
            .then(data=>{             
                if(data.length>0){
                    // console.log("getCitiesByState data = ", data);
                    res.status(200).json(data);
                }else{
                    res.status(403).json({"message" : 'City not found for this state code: '+ req.params.stateCode });
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};
exports.addCity = (req,res,next)=>{
    // This API is used for Adding/inserting State from UI side
     States.findOne({ "cityName": {'$regex' : req.body.cityName , $options: "i"} })
    .exec()
    .then(state=>{
        if(!state){
            const state = new States({
                _id                     : new mongoose.Types.ObjectId(),                    
                countryCode             : req.body.countryCode,
                countryName             : req.body.countryName,
                stateName               : req.body.stateName,
                stateCode               : req.body.stateCode,
                cityName                : req.body.cityName,
                createdAt               : new Date()
            });

                    
            state.save()
                .then(data=>{
                    res.status(200).json({
                        message: "City inserted successfully",
                    })
                })
                .catch(err =>{
                    console.log(err);
                    reject(err);
                });
        }else{
             res.status(200).json({
                message: "City already exist",
            })
        }
    })
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
            if (finaldata[k].villageName == '-') {
                validationRemark += "villageName not found, " ;  
            }
            if (validationRemark == '') {
                var statePresent    = await findState(finaldata[k].stateName);
                var stateID         = statePresent._id;
                if(stateID) {
                    var districtPresent = await findDistrict(finaldata[k].districtName, stateID);
                    var districtID      = districtPresent._id;
                    if (districtID) {
                        var blockPresent    = await findBlock(finaldata[k].blockName, stateID, districtID);
                        var blockID         = blockPresent._id;
                        if (blockID) {
                            var insertCityObject = await insertCity(finaldata[k], stateID, districtID, blockID, reqdata, req.body.fileName)
                            if (insertCityObject.duplicate) {
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
                            validationRemark = "Block Name not available";
                            invalidObjects.failedRemark = validationRemark;
                            invalidData.push(invalidObjects);
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
        failedRecords.fileName      = req.body.fileName;
        failedRecords.totalRecords  = req.body.totalRecords;
        // console.log('failedRecords===============',failedRecords);
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        res.status(200).json({
          "message": "Bulk upload process is completed successfully!",
          "completed": true
        });       
    }
};
var insertCity = async (data, stateID, districtID, blockID, reqdata, fileName) => {
    //console.log('categoryObject',categoryObject.subCategory_ID)
    return new Promise(function(resolve,reject){ 
        cityDuplicateControl();
        async function cityDuplicateControl(){
            var cityPresent = await findCity(data.villageName, stateID, districtID, blockID);
            //console.log('cityPresent',cityPresent)    
            if (cityPresent==0) {
            const city = new Cities({
                        _id                     : new mongoose.Types.ObjectId(),                    
                        countryID               : reqdata.countryID,
                        stateID                 : stateID,
                        districtID              : districtID,
                        blockID                 : blockID,
                        cityName                : data.villageName,
                        fileName                : fileName,
                        createdAt               : new Date()
                    });
                    city
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                var cityPresent = await findCity(data.villageName, stateID, districtID, blockID);
                resolve({cityPresent:cityPresent, duplicate: true});
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
function findCity(cityName, stateID, districtID, blockID) {
    return new Promise(function(resolve,reject){  
        Cities.findOne({   
                    "cityName": cityName, 
                    "stateID": stateID,  
                    "districtID":districtID,
                    "blockID":blockID
                })
                .exec()
                .then(cityObject=>{
                    //console.log('cityObject',cityObject)
                    if(cityObject){
                        resolve(cityObject);
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
  Cities.find({fileName:req.params.fileName})
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

exports.deleteCity = (req,res,next)=>{
    // console.log("_id",req.params.villageID);
    Cities.deleteOne({"_id":req.params.villageID})
    .exec()
    .then(data=>{
      // console.log('data',data);
      res.status(200).json({
        "message" : "Village deleted successfully"
      });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};