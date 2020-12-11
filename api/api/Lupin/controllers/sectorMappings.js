const mongoose      = require("mongoose");
const _             = require("underscore");
const ObjectID          = require('mongodb').ObjectID;
const SectorMapping = require('../models/sectorMappings');
const Sector        = require('../models/sectors.js');

exports.create_sectorMapping = (req,res,next)=>{
    // console.log("create_sectorMapping ",req.body );
    SectorMapping.findOne({"type_ID" : req.body.type_ID, "goal" : req.body.goal})
        .exec()
        .then(data =>{
                if(data){
                    res.status(200).json("Data Already Exists")
                }else{
                    const sectorMapping = new SectorMapping({
                        _id                 : new mongoose.Types.ObjectId(),                    
                        type_ID             : req.body.type_ID,
                        goal                : req.body.goal,
                        sector              : req.body.sector,
                        createdAt           : new Date()
                    });
                    sectorMapping.save()
                    .then(data=>{
                        res.status(200).json({
                            "message" : "Sector Mapping Submitted Successfully."
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: e                });
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
exports.update_sectorMapping = (req,res,next)=>{
    SectorMapping.findOne({"type_ID" : req.body.type_ID, "goal" : req.body.goal})
        .exec()
        .then(data =>{
                if(data && data._id != req.body.sectorMapping_ID){
                    res.status(200).json("Data Already Exists")
                }else{
                    SectorMapping.updateOne(
                            { _id:req.body.sectorMapping_ID},
                            {
                                $set:{
                                    type_ID             : req.body.type_ID,
                                    goal                : req.body.goal,
                                    sector              : req.body.sector,
                                    createdAt           : new Date()
                                }
                            }
                        )
                        .exec()
                        .then(data=>{
                            if(data.nModified == 1){
                                res.status(200).json({
                                    "message": "Sector Mapping Updated Successfully."
                                });
                            }else{
                                res.status(200).json({
                                    "message": "Sector Mapping not modified"
                                });
                            }
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
exports.list_sectorMapping = (req,res,next)=>{
    SectorMapping.find()
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
exports.list_sectorMapping_with_limits = (req,res,next)=>{
    // SectorMapping.find()  
    SectorMapping.aggregate([
                            {
                                $lookup :{
                                            from            : "typeofgoals",
                                            localField      : "type_ID",
                                            foreignField    : "_id",
                                            as              : "typeofgoal"
                                        }
                            },
                            {
                                $unwind : "$typeofgoal"
                            },
                             {
                                $project : {
                                                "type_ID"      : 1,
                                                "goal"         : 1,
                                                "sector"         : 1,
                                                /*"sectorName"   : "$sector.sectorName",
                                                "activityName" : "$sector.activityName",*/
                                                "type"         : "$typeofgoal.typeofGoal"
                                            }
                            },
                            
                        ]
        )     
    .sort({"createdAt":-1})
    .skip(parseInt(req.params.startRange))
    .limit(parseInt(req.params.limitRange))
    .exec()
    .then(data=>{
         var allData = _.flatten(data.map((a, i)=>{
            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "type"                : a.type,
                "goal"                : a.goal, 
                "sectorName"          : ((a.sector.map((b, j)=>{return '<p class="mapWrapText text-left">'+b.sectorName+'</p>'})).toString()).replace(/,/g, " "),
                "activityName"        : ((a.sector.map((b, j)=>{return '<p class="mapWrapText text-left">'+b.activityName+'</p>'})).toString()).replace(/,/g, " ")
            }
        
        }))
        res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_sectorMapping = (req,res,next)=>{
    SectorMapping.find()      
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, i)=>{
            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "goal"                : a.goal, 
                "sectorName"          : ((a.sector.map((b, j)=>{return '<p>'+b.sectorName+'</p>'})).toString()).replace(/,/g, " "),
                "activityName"        : ((a.sector.map((b, j)=>{return '<p>'+b.activityName+'</p>'})).toString()).replace(/,/g, " ")
            }
        }))
        res.status(200).json({"dataCount":allData.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.list_sectorMapping_with_limits_edit = (req,res,next)=>{
    SectorMapping.aggregate([
                            {
                                $lookup :{
                                            from            : "typeofgoals",
                                            localField      : "type_ID",
                                            foreignField    : "_id",
                                            as              : "typeofgoal"
                                        }
                            },
                            {
                                $unwind : "$typeofgoal"
                            },
                            {
                                $project : {
                                                "type_ID"      : 1,
                                                "goal"         : 1,
                                                "sector"         : 1,
                                                /*"sectorName"   : "$sector.sectorName",
                                                "activityName" : "$sector.activityName",*/
                                                "type"         : "$typeofgoal.typeofGoal"
                                            }
                            },
                            /*
                            {
                                $unwind : "$sector"
                            },
                            */

                        ]
        )     
    .skip(parseInt(req.params.startRange))
    .limit(parseInt(req.params.limitRange))
    .exec()
    .then(data=>{
        // console.log("data ",data);
       /* var allData = (data.map((a, i)=>{
            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "type"                : a.type,
                "goal"                : a.goal, 
                "sectorName"          : a.sectorName,
                "activityName"        : a.activityName,
            }
        }))*/
         var allData = _.flatten(data.map((a, i)=>{
            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "type"                : a.type,
                "goal"                : a.goal, 
                "sectorName"          : ((a.sector.map((b, j)=>{return '<p  class="mapWrapText text-left">'+b.sectorName+'</p>'})).toString()).replace(/,/g, " "),
                "activityName"        : ((a.sector.map((b, j)=>{return '<p  class="mapWrapText text-left">'+b.activityName+'</p>'})).toString()).replace(/,/g, " ")
            }
        }))
        res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_SectorMapping = (req,res,next)=>{
    SectorMapping.find({_id : req.params.sectorMappingID})
       
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
exports.delete_sectorMapping = (req,res,next)=>{
    SectorMapping.deleteOne({_id:req.params.sectorMappingID})
        .exec()
        .then(data=>{
            res.status(200).json({
                "message" : "Sector Mapping Deleted Successfully."
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
function fetchSubActivity(sector_ID,activity_ID){
    // console.log('fetchSubActivity',sector_ID,activity_ID);
    return new Promise(function(resolve,reject){
        Sector.find(
                        {"_id":ObjectID(sector_ID),"activity._id":ObjectID(activity_ID)},
                        {_id: 0, "activity": {$elemMatch: {"_id": ObjectID(activity_ID)}}}
                    )
                .exec()
                .then(data=>{
                // console.log("data****",data);
                    if(data.length>0){
                        // console.log("data[0].activity[0].subActivity",data[0].activity[0].subActivity);
                        resolve(data[0].activity[0].subActivity);
                    }
                })
                .catch(err=>{
                    reject(err);
                });
    });
};
exports.list_sectors_with_goalType_goalP = (req,res,next)=>{
    SectorMapping.aggregate([
                        {
                            $match : {
                                        "type_ID"   : ObjectID(req.params.goalType),
                                        "goal"      : req.params.goal
                                    }
                        },
                        {
                            $unwind : "$sector"
                        },
                        {
                            $project : {
                                            "type_ID"   : 1,
                                            "goal"      : 1,
                                            "sector"    : {
                                                                "_id"           : "$sector._id",
                                                                // "sector_ID"     : ObjectID("$sector.sector_ID"),
                                                                "sector_ID"     : "$sector.sector_ID",
                                                                "sectorName"    : "$sector.sectorName",
                                                                "activity"      : [{
                                                                                        "_id"           : "$sector.activity_ID",
                                                                                        "activity_ID"   : "$sector.activity_ID",
                                                                                        "activityName"  : "$sector.activityName",
                                                                                    }
                                                                                  ]
                                                            }
                                        }
                        },
                        {
                            $unwind : "$sector.activity"
                        },
                        {
                            $group : {
                                            "_id"               : {
                                                                    "sector_ID"         : "$sector.sector_ID",
                                                                    "type_ID"           : "$type_ID",
                                                                    "goal"              : "$goal" 
                                                                },
                                            "sector_id"        : { "$first" : "$sector._id"},
                                            "sector_ID"  : { "$first" : "$sector.sector_ID"},
                                            "sectorName" : { "$first" : "$sector.sectorName"},
                                            "activity"   : { "$push" : "$sector.activity"},

                                    }
                        },
                        {
                            $project : {
                                            "_id"       : "$_id.sector_ID",
                                            "type_ID"   : "$_id.type_ID",
                                            "goal"      : "$_id.goal",
                                            "sector"    : {
                                                                "sector_ID"  : "$sector_ID",
                                                                "sector"     : "$sectorName",
                                                                "activity"   : "$activity"
                                                         }
                                        }
                        },
                        {
                            $group : {
                                        "_id" : {
                                                    "type_ID" : "$type_ID",
                                                    "goal"    : "$goal"
                                                },
                                        "sector" : {"$push" : "$sector"}
                                    }
                        },
                        {
                            $project : {
                                            "type_ID"   : "$_id.type_ID",
                                            "goal"      : "$_id.goal",
                                            "sector"    : 1,
                                            "_id"       : 0
                                        }
                        }

                ])
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
exports.list_sectors_with_goalType_goal = (req,res,next)=>{
    SectorMapping.aggregate([
                        {
                            $match : {
                                        "type_ID"   : ObjectID(req.params.goalType),
                                        "goal"      : req.params.goal
                                    }
                        },
                        {
                            $unwind : "$sector"
                        },
                        {
                            $project : {
                                            "type_ID"   : 1,
                                            "goal"      : 1,
                                            "sector"    : {
                                                                "_id"           : "$sector._id",
                                                                // "sector_ID"     : ObjectID("$sector.sector_ID"),
                                                                "sector_ID"     : "$sector.sector_ID",
                                                                "sectorName"    : "$sector.sectorName",
                                                                "activity"      : [{
                                                                                        "_id"           : "$sector.activity_ID",
                                                                                        "activity_ID"   : "$sector.activity_ID",
                                                                                        "activityName"  : "$sector.activityName",
                                                                                    }
                                                                                  ]
                                                            }
                                        }
                        },
                        {
                            $unwind : "$sector.activity"
                        },
                        {
                            $group : {
                                            "_id"               : {
                                                                    "sector_ID"         : "$sector.sector_ID",
                                                                    "type_ID"           : "$type_ID",
                                                                    "goal"              : "$goal" 
                                                                },
                                            "sector_id"        : { "$first" : "$sector._id"},
                                            "sector_ID"  : { "$first" : "$sector.sector_ID"},
                                            "sectorName" : { "$first" : "$sector.sectorName"},
                                            "activity"   : { "$push" : "$sector.activity"},

                                    }
                        },
                        {
                            $project : {
                                            "_id"       : "$_id.sector_ID",
                                            "type_ID"   : "$_id.type_ID",
                                            "goal"      : "$_id.goal",
                                            "sector"    : {
                                                                "sector_ID"  : "$sector_ID",
                                                                "sector"     : "$sectorName",
                                                                "activity"   : "$activity"
                                                         }
                                        }
                        },
                        {
                            $group : {
                                        "_id" : {
                                                    "type_ID" : "$type_ID",
                                                    "goal"    : "$goal"
                                                },
                                        "sector" : {"$push" : "$sector"}
                                    }
                        },
                        {
                            $project : {
                                            "type_ID"   : "$_id.type_ID",
                                            "goal"      : "$_id.goal",
                                            "sector"    : 1,
                                            "_id"       : 0
                                        }
                        }

                ])
                 .exec()
                 .then(data=>{
                    // console.log("data ",data);
                    // res.status(200).json(data);
                    if(data.length > 0){
                        getData();
                        async function getData(){
                            var returnData = {
                                                "type_ID" : data[0].type_ID,
                                                "goal"    : data[0].goal,
                                                "sector"  : [],
                                            };
                            var j = 0;
                            var sectorData = data[0].sector;
                            for( j = 0 ; j < sectorData.length ; j++){
                                var k = 0;
                                var sector = {
                                                "sector_ID" : sectorData[j].sector_ID,
                                                "sector"    : sectorData[j].sector,
                                                "activity"  : []
                                             };
                                var activityData = sectorData[j].activity;
                                // console.log("sectorData ",sectorData);
                                var subActivities = [];
                                for(k = 0 ; k < activityData.length ; k++){
                                    // console.log('sectorData[j].sector_ID,activityData[k].activity_ID',sectorData[j].sector_ID,activityData[k].activity_ID);
                                    subActivities.push(await fetchSubActivity(sectorData[j].sector_ID,activityData[k].activity_ID))
                                    sector.activity.push({
                                                            "activity_ID" : activityData[k].activity_ID,
                                                            "activityName": activityData[k].activityName,
                                                            "subActivity" : subActivities
                                                        })
                                }
                                if(k >= activityData.length){
                                    returnData.sector.push(sector);
                                }
                            }
                            if(j >= sectorData.length){
                                res.status(200).json(returnData);
                            }
                        }
                    }else{
                        res.status(200).json({
                            "message": "Framework Mapping data is not available"
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