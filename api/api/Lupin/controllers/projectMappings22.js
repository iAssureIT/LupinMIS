const mongoose       = require("mongoose");
var moment           = require('moment');
const _              = require("underscore");
const ProjectMapping = require('../models/projectMappings');
const ObjectID       = require('mongodb').ObjectID;


exports.create_projectMapping = (req,res,next)=>{
    console.log("project Mapping =====> ",req.body);
    ProjectMapping.find()
        .exec()
        .then(data =>{
                const projectMapping = new ProjectMapping({
                    _id                 : new mongoose.Types.ObjectId(),                    
                    type_ID             : req.body.type_ID,
                    goalName            : req.body.goalName,
                    projectName         : req.body.projectName,
                    sector              : req.body.sector,
                    startDate           : req.body.startDate,
                    endDate             : req.body.endDate,
                    createdAt           : new Date()
                });
                projectMapping.save()
                .then(data=>{
                    res.status(200).json({
                        "message" : "Project Mapping Submitted Successfully."
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
exports.update_projectMapping = (req,res,next)=>{
    ProjectMapping.updateOne(
        { _id:req.body.projectMapping_ID},
        {
            $set:{
                type_ID             : req.body.type_ID,
                goalName            : req.body.goalName,
                projectName         : req.body.projectName,
                sector              : req.body.sector,
                startDate           : req.body.startDate,
                endDate             : req.body.endDate,
                createdAt           : new Date()
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({
                "message": "Project Mapping Updated Successfully."
            });
        }else{
            res.status(200).json({
                "message": "Project Mapping Not modified"
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
exports.list_projectMapping = (req,res,next)=>{
    ProjectMapping.find()
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
exports.list_projectMapping_with_limits = (req,res,next)=>{
    // ProjectMapping.find()  
    ProjectMapping.aggregate([                                
                                {
                                    $lookup :{
                                                "from"            : "typeofgoals",
                                                "localField"      : "type_ID",
                                                "foreignField"    : "_id",
                                                "as"              : "typeofgoal"
                                            }
                                },
                                {
                                    $unwind : "$typeofgoal"
                                },
                                {
                                    $project : {
                                                    "type_ID"           : "$type_ID", 
                                                    "goalName"           : 1, 
                                                    "typeofGoal"          : "$typeofgoal.typeofGoal", 
                                                    "projectName"       : "$projectName",
                                                    "sector"            : 1,
                                                    "startDate"         : 1,
                                                    "endDate"           : 1
                                                }
                                },
                                // {
                                //     $group : {
                                //                 "_id" : "$_id",
                                //                 "projectName" : { "$first":"$projectName"},
                                //                 "sector" : { "$first":"$sector"},
                                //                 "startDate" : { "$first":"$startDate"},
                                //                 "endDate" : { "$first":"$endDate"},
                                //                 "type_ID" : { "$push" : "$type_ID"}
                                //             }
                                // },
                        ]
        )     
    .sort({"createdAt":-1})
    .skip(parseInt(req.params.startRange))
    .limit(parseInt(req.params.limitRange))
    .exec()
    .then(data=>{

         var allData = _.flatten(data.map((a, i)=>{
            var subActivityName = ((a.sector.map((b, j)=>{return '<p>'+b.subActivityName+'</p>'})).toString()).replace(/,/g, " ");
            var replaceStr = subActivityName.replace("/<p></p>/gi", "<p>-</p>") ;

            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "typeofGoal"          : a.typeofGoal,
                "goalName"            : '<div class="wrapText text-left">'+a.goalName+'</div>',
                "projectName"         : '<p  class="wrapText text-left"><b>'+a.projectName+'</b></p>'+'<p class="text-left">'+moment(a.startDate).format('DD-MM-YYYY')+'</p>'+'<p class="text-left">'+moment(a.endDate).format('DD-MM-YYYY')+'</p>', 
                // "startDate"           : a.startDate, 
                // "endDate"             : a.endDate, 
                "sectorName"          : ((a.sector.map((b, j)=>{return '<p class="wrapText prewrapText text-left">'+b.sectorName+'</p>'})).toString()).replace(/,/g, " "),
                "activityName"        : ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.activityName+'</p>'})).toString()).replace(/,/g, " ") ? ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.activityName+'</p>'})).toString()).replace(/,/g, " ") : "-",
                "subActivityName"     : ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.subActivityName+'</p>'})).toString()).replace(/,/g, " ") ? ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.subActivityName+'</p>'})).toString()).replace(/,/g, " ") : ((a.sector.map((b, j)=>{return '<p>'+"-"+'</p>'})).toString()).replace(/,/g, " ") 
            }
        
        }))
        res.status(200).json(allData);
        // console.log("allData",allData);

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_projectMapping = (req,res,next)=>{
    ProjectMapping.find()      
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, i)=>{
            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "goalName"            : a.goalName,
                "projectName"         : a.projectName, 
                "startDate"           : a.startDate, 
                "endDate"             : a.endDate, 
                "sectorName"          : ((a.sector.map((b, j)=>{return '<p>'+b.sectorName+'</p>'})).toString()).replace(/,/g, " "),
                "activityName"        : ((a.sector.map((b, j)=>{return '<p>'+b.activityName+'</p>'})).toString()).replace(/,/g, " "),
                "subActivityName"     : ((a.sector.map((b, j)=>{return b.subActivityName?'<p>'+b.subActivityName+'</p>':'-'})).toString()).replace(/,/g, " ")
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
exports.list_projectMapping_with_limits_edit = (req,res,next)=>{
    ProjectMapping.aggregate([
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
                                                "projectName"  : 1,
                                                "sector"       : 1,
                                                "startDate"    : 1,
                                                "endDate"      : 1,
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
                "projectName"                : a.projectName, 
                "sectorName"          : a.sectorName,
                "activityName"        : a.activityName,
            }
        }))*/
         var allData = _.flatten(data.map((a, i)=>{
            return {
                "_id"                 : a._id,
                "type_ID"             : a.type_ID,
                "typeofGoal"          : a.typeofGoal,
                "goalName"            : '<div class="wrapText text-left">'+a.goalName+'</div>',
                "projectName"         : '<p  class="wrapText text-left"><b>'+a.projectName+'</b></p>'+'<p>'+moment(a.startDate).format('DD-MM-YYYY')+'</p>'+'<p>'+moment(a.endDate).format('DD-MM-YYYY')+'</p>', 
                // "startDate"           : a.startDate, 
                // "endDate"             : a.endDate, 
                "sectorName"          : ((a.sector.map((b, j)=>{return '<p class="wrapText text-left">'+b.sectorName+'</p>'})).toString()).replace(/,/g, " "),
                "activityName"        : ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.activityName+'</p>'})).toString()).replace(/,/g, " ") ? ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.activityName+'</p>'})).toString()).replace(/,/g, " ") : "-",
                "subActivityName"     : ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.subActivityName+'</p>'})).toString()).replace(/,/g, " ") ? ((a.sector.map((b, j)=>{return '<p class="prewrapText text-left">'+b.subActivityName+'</p>'})).toString()).replace(/,/g, " ") : ((a.sector.map((b, j)=>{return '<p>'+"-"+'</p>'})).toString()).replace(/,/g, " ") 
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
exports.fetch_projectMapping = (req,res,next)=>{
    console.log("req.params.projectMappingID ",req.params.projectMappingID);
    ProjectMapping.aggregate([
                                {
                                    $match : {"_id" : ObjectID(req.params.projectMappingID)}
                                },                             
                                {
                                    $lookup :{
                                                "from"            : "typeofgoals",
                                                "localField"      : "type_ID",
                                                "foreignField"    : "_id",
                                                "as"              : "typeofgoal"
                                            }
                                },
                                {
                                    $unwind : "$typeofgoal"
                                },
                                {
                                    $project : {
                                                    "type_ID"           : "$type_ID", 
                                                    "typeofGoal"        : "$typeofgoal.typeofGoal", 
                                                    "projectName"       : "$projectName",
                                                    "goalName"          : 1, 
                                                    "sector"            : 1,
                                                    "startDate"         : 1,
                                                    "endDate"           : 1
                                                }
                                },
                              
        ])
        .exec()
        .then(data=>{
            // console.log("data = ", data[0].sector);

            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete_projectMapping = (req,res,next)=>{
    ProjectMapping.deleteOne({_id:req.params.projectMappingID})
        .exec()
        .then(data=>{
            res.status(200).json({
                "message" : "Project Mapping Deleted Successfully."
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//Code by Anagha
exports.list_sectors_with_array_activity = (req,res,next)=>{
    console.log("list_sectors_with_array_activity");
    ProjectMapping.aggregate([
                        {
                            $match : {
                                        "projectName" : req.params.projectName
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
                                                                "sector_ID"     : "$sector.sector_ID",
                                                                "sectorName"    : "$sector.sectorName",
                                                                "activity"      : [{
                                                                                        "_id"           : "$sector.activity_ID",
                                                                                        "activity_ID"   : "$sector.activity_ID",
                                                                                        "activityName"  : "$sector.activityName",
                                                                                        "subActivity"   : [{
                                                                                                                "_id"           : "$sector.activity_ID",
                                                                                                                "activity_ID"   : "$sector.activity_ID",
                                                                                                                "activityName"  : "$sector.activityName",
                                                                                                            }]
                                                                                    }
                                                                                  ]
                                                            }
                                        }
                        },
                        // {
                        //     $unwind : "$sector.activity"
                        // },
                        // {
                        //     $group : {
                        //                     "_id"               : {
                        //                                             "sector_ID"         : "$sector.sector_ID",
                        //                                             "type_ID"           : "$type_ID",
                        //                                             "goal"              : "$goal" 
                        //                                         },
                        //                     "sector_id"        : { "$first" : "$sector._id"},
                        //                     "sector_ID"  : { "$first" : "$sector.sector_ID"},
                        //                     "sectorName" : { "$first" : "$sector.sectorName"},
                        //                     "activity"   : { "$push" : "$sector.activity"},

                        //             }
                        // },
                        // {
                        //     $project : {
                        //                     "_id"       : "$_id.sector_ID",
                        //                     "type_ID"   : "$_id.type_ID",
                        //                     "goal"      : "$_id.goal",
                        //                     "sector"    : {
                        //                                         "sector_ID"  : "$sector_ID",
                        //                                         "sector"     : "$sectorName",
                        //                                         "activity"   : "$activity"
                        //                                  }
                        //                 }
                        // },
                        // {
                        //     $group : {
                        //                 "_id" : {
                        //                             "type_ID" : "$type_ID",
                        //                             "goal"    : "$goal"
                        //                         },
                        //                 "sector" : {"$push" : "$sector"}
                        //             }
                        // },
                        // {
                        //     $project : {
                        //                     "type_ID"   : "$_id.type_ID",
                        //                     "goal"      : "$_id.goal",
                        //                     "sector"    : 1,
                        //                     "_id"       : 0
                        //                 }
                        // }

                ])
                 .exec()
                 .then(data=>{
                    // console.log("data ",data);
                    res.status(200).json(data);
                    // if(data.length > 0){
                    //     getData();
                    //     async function getData(){
                    //         var returnData = {
                    //                             "sector"  : [],
                    //                         };
                    //         var j = 0;
                    //         var sectorData = data[0].sector;
                    //         for( j = 0 ; j < sectorData.length ; j++){
                    //             var k = 0;
                    //             var sector = {
                    //                             "sector_ID" : sectorData[j].sector_ID,
                    //                             "sector"    : sectorData[j].sector,
                    //                             "activity"  : []
                    //                          };
                    //             var activityData = sectorData[j].activity;
                    //             // console.log("activityData ",activityData);
                    //             var subActivities = [];
                    //             for(k = 0 ; k < activityData.length ; k++){
                    //                 subActivities.push(await fetchSubActivity(sectorData[j].sector_ID,activityData[k].activity_ID))
                    //                 sector.activity.push({
                    //                                         "activity_ID" : activityData[k].activity_ID,
                    //                                         "activityName": activityData[k].activityName,
                    //                                         "subActivity" : subActivities
                    //                                     })
                    //             }
                    //             if(k >= activityData.length){
                    //                 returnData.sector.push(sector);
                    //             }
                    //         }
                    //         if(j >= sectorData.length){
                    //             res.status(200).json(returnData);
                    //         }
                    //     }
                    // }else{
                    //     res.status(200).json({
                    //         "message": "Framework Mapping data is not available"
                    //     });
                    // }
                 })
                 .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
};