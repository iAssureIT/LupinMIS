const mongoose	     = require("mongoose");
const _              = require("underscore");
const Sectors        = require('../models/sectors');
const AnnualPlan     = require('../models/annualPlans');
const ActivityReport = require('../models/activityReport');
const MonthlyPlan    = require('../models/monthlyPlans');
const ProjectMapping = require('../models/projectMappings');
const SectorMapping  = require('../models/sectorMappings');
const ObjectID       = require('mongodb').ObjectID;


exports.create_sectors = (req,res,next)=>{
    Sectors.findOne({sector : req.body.sector})
    .exec()
    .then(data =>{
        if(data){
            res.status(200).json({message:"Sector already exists"});
        }else{
            const sectors = new Sectors({
                _id                 : new mongoose.Types.ObjectId(),                    
                sector              : req.body.sector,
                sectorShortName     : req.body.sectorShortName,
                user_ID             : req.body.user_ID,
                createdAt           : new Date()
            });
            sectors.save()
                .then(data=>{
                    res.status(200).json({
                        "message"    : "Sector Details Submitted Successfully", 
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
exports.update_sectors = (req,res,next)=>{
    Sectors.findOne({sector : req.body.sector})
    .exec()
    .then(data =>{
        if(data && data._id != req.body.sector_ID){
            res.status(200).json({message:"Sector already exists"});
        }else{
            Sectors.updateOne(
                    { _id:req.body.sector_ID},  
                    {
                        $set:{
                            sector              : req.body.sector,
                            sectorShortName     : req.body.sectorShortName,
                            user_ID             : req.body.user_ID
                        }
                    }
                )
                .exec()
                .then(data=>{
                    if(data.nModified === 1){
                        res.status(200).json({
                            "message": "Sector Details Updated Successfully."
                        });
                    }else{
                        res.status(200).json({
                            "message": "Sector Details not Updated"
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
exports.insert_activity = (req,res,next)=>{
    Sectors.findOne(
                { 
                    $and: 
                        [ 
                            { 
                                "_id"                       : req.body.sector_ID,
                            }, 
                            { 
                                "activity.activityName"     : req.body.activityName
                            } 
                        ] 
                }
            )
            .exec()
            .then(data=>{
                if(data){
                    res.status(200).json({message: "Activity Name Already Exist"})
                }else{
                    Sectors.updateOne(
                                { _id:req.body.sector_ID},  
                                {
                                    $push:{
                                        activity  : { activityName: req.body.activityName}
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                if(data.nModified === 1){
                                    res.status(200).json({
                                        "message": "Activity '"+req.body.activityName+"' for sector '"+req.body.sector+"' added successfully."
                                    });
                                }else{
                                    res.status(200).json({
                                        "message": "Activity not modified."
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
exports.update_activity = (req,res,next)=>{
    Sectors.findOne(
                { 
                    $and: 
                        [ 
                            { 
                                "_id"                       : req.body.sector_ID,
                            }, 
                            { 
                                "activity.activityName"     : req.body.activityName
                            } 
                        ] 
                },
                {_id: 0, activity: {$elemMatch: {activityName: req.body.activityName}}}
            )
            .exec()
            .then(data=>{
                if(data && data.activity[0]._id == req.body.activity_ID){
                    res.status(200).json({message: "Activity Name not modified"})
                }else if(data && data.activity[0]._id != req.body.activity_ID){
                    res.status(200).json({message: "Activity Name Already Exist"})
                }else{
                    Sectors.updateOne(
                                {
                                    "_id"             : req.body.sector_ID,
                                    "activity._id"    : req.body.activity_ID
                                },  
                                {
                                    $set:{
                                        "activity.$.activityName": req.body.activityName
                                    }    
                                }
                            )
                            .exec()
                            .then(data1=>{
                                if(data1.nModified === 1){
                                    res.status(200).json({
                                        "message": "Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is Updated Successfully"
                                    });
                                }else{
                                    res.status(401).json({
                                        "message": "Sector Not Found"
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
exports.insert_subactivity = (req,res,next)=>{
    // console.log("req.body",req.body)
    Sectors.findOne(
                { 
                    $and: 
                        [ 
                            { 
                                "_id"                   : req.body.sector_ID,
                            }, 
                            { 
                                "activity._id"          : req.body.activity_ID
                            },  
                            {
                                "activity.subActivity.subActivityName"  : req.body.subActivityName,
                            }
                        ] 
                }
            )
            .exec()
            .then(data=>{
                // console.log("data",data)
                if(data){
                    res.status(200).json({message: "Sub Activity Name Already Exist"})
                }else{
                    Sectors.updateOne(
                                {
                                    "_id"           : req.body.sector_ID,
                                    "activity._id"  : req.body.activity_ID
                                },  
                                {
                                    $push : { "activity.$.subActivity" : {
                                        "subActivityName"   : req.body.subActivityName,
                                        "unit"              : req.body.unit,
                                        "familyUpgradation" : req.body.familyUpgradation,
                                        "outreach"          : req.body.outreach
                                        } 
                                    }        
                                }
                            )
                            .exec()
                            .then(data=>{
                                if(data){
                                    res.status(200).json({
                                        "message": "Subactivity '"+req.body.subActivityName+"' for the Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is added Successfully"
                                    });
                                }else{
                                    res.status(401).json({
                                        "message": "Sector Not Found"
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
exports.update_subactivity = (req,res,next)=>{
    // console.log("req.body ",req.body);
    Sectors.updateOne(
                    {
                        "_id":ObjectID(req.body.sector_ID)
                        // "_id":ObjectID("5ddb9245244404e1f1069da5")
                    },
                    {
                        $set:{
                                "activity.$[t].subActivity.$[d].subActivityName"    : req.body.subActivityName,
                                "activity.$[t].subActivity.$[d].unit"               : req.body.unit,
                                "activity.$[t].subActivity.$[d].familyUpgradation"  : req.body.familyUpgradation,
                                "activity.$[t].subActivity.$[d].outreach"           : req.body.outreach,
                            }
                    },
                    {
                        arrayFilters:[
                            {"t._id":ObjectID(req.body.activity_ID)},
                            {"d._id":ObjectID(req.body.subactivity_ID)},
                            ],
                            //multi:false
                     }
                  )
            .then(data=>{
                // console.log("data ",data);
                if(data.nModified === 1){
                    res.status(200).json({
                        "message": "Subactivity '"+req.body.subActivityName+"' for the Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is Updated Successfully"
                    });
                }else{
                    res.status(200).json({
                        "message": "Sector Not Found"
                    });
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    // Sectors.updateOne(
    //                 {
    //                     "_id":ObjectID(req.body.sector_ID)
    //                 },
    //                 {
    //                     $set:{
    //                             "activity.$[t].subActivity.$[d].subActivityName"    : req.body.subActivityName,
    //                             "activity.$[t].subActivity.$[d].unit"               : req.body.unit,
    //                             "activity.$[t].subActivity.$[d].familyUpgradation"  : req.body.familyUpgradation,
    //                             "activity.$[t].subActivity.$[d].outreach"           : req.body.outreach,
    //                         }
    //                 },
    //                 {
    //                     arrayFilters:[
    //                         {"t._id":ObjectID(req.body.activity_ID)},
    //                         {"d._id":ObjectID(req.body.activity_ID)},
    //                         ],
    //                         multi:false
    //                  }
    //               )
    //         .exec()
    //         .then(data=>{
    //             console.log("data ",data);
    //             if(data.nModified === 1){
    //                 res.status(200).json({
    //                     "message": "Subactivity '"+req.body.subActivityName+"' for the Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is Updated Successfully"
    //                 });
    //             }else{
    //                 res.status(401).json({
    //                     "message": "Sector Not Found"
    //                 });
    //             }
    //         })
    //         .catch(err =>{
    //             console.log(err);
    //             res.status(500).json({
    //                 error: err
    //             });
    //         });
    // Sectors.updateOne(
    //                                 {
    //                                     "_id"             : req.body.sector_ID,
    //                                     "activity._id"    : req.body.activity_ID
    //                                 },  
    //                                 {
    //                                     $set : { "activity.$.subActivity" : {
    //                                         "subActivityName"   : req.body.subActivityName,
    //                                         "unit"              : req.body.unit,
    //                                         "familyUpgradation" : req.body.familyUpgradation,
    //                                         "outreach"          : req.body.outreach
    //                                         } 
    //                                     }        
    //                                 }
    //                             )
    //                             .exec()
    //                             .then(data=>{
    //                                 if(data){
    //                                     res.status(200).json({
    //                                         "message": "Subactivity '"+req.body.subActivityName+"' for the Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is Updated Successfully"
    //                                     });
    //                                 }else{
    //                                     res.status(401).json({
    //                                         "message": "Sector Not Found"
    //                                     });
    //                                 }
    //                             })
    //                             .catch(err =>{
    //                                 console.log(err);
    //                                 res.status(500).json({
    //                                     error: err
    //                                 });
    //                             });
    // Sectors.findOne(
    //             { 
    //                 $and: 
    //                     [ 
    //                         { 
    //                             "_id"                   : req.body.sector_ID,
    //                         }, 
    //                         { 
    //                             "activity._id"          : req.body.activity_ID
    //                         },  
    //                         {
    //                             "activity.subActivity.subActivityName"  : req.body.subActivityName,
    //                         }
    //                     ] 
    //             }
    //         )
    //         .exec()
    //         .then(data=>{
    //             if(data && data.activity._id != req.body.activity_ID && data.activity.subActivity._id != req.body.subactivity_ID){
    //                 res.status(200).json({message: "Sub Activity Name Already Exist"})
    //             }else{
    //                 Sectors.updateOne(
    //                                 {
    //                                     "_id"             : req.body.sector_ID,
    //                                     "activity._id"    : req.body.activity_ID
    //                                 },  
    //                                 {
    //                                     $set : { "activity.$.subActivity" : {
    //                                         "subActivityName"   : req.body.subActivityName,
    //                                         "unit"              : req.body.unit,
    //                                         "familyUpgradation" : req.body.familyUpgradation,
    //                                         "outreach"          : req.body.outreach
    //                                         } 
    //                                     }        
    //                                 }
    //                             )
    //                             .exec()
    //                             .then(data=>{
    //                                 if(data){
    //                                     res.status(200).json({
    //                                         "message": "Subactivity '"+req.body.subActivityName+"' for the Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is Updated Successfully"
    //                                     });
    //                                 }else{
    //                                     res.status(401).json({
    //                                         "message": "Sector Not Found"
    //                                     });
    //                                 }
    //                             })
    //                             .catch(err =>{
    //                                 console.log(err);
    //                                 res.status(500).json({
    //                                     error: err
    //                                 });
    //                             });
    //             }
    //         })
    //         .catch(err =>{
    //             console.log(err);
    //             res.status(500).json({
    //                 error: err
    //             });
    //         });      
};
exports.list_sectors = (req,res,next)=>{
    Sectors.find()
        .sort({"sector":1})
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
exports.list_sectors_with_limits = (req,res,next)=>{
    Sectors.find()
    .sort({"sector":1})
    // .sort({"createdAt":-1})
    .exec()
    .then(data=>{
        res.status(200).json(data.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      if(sortOrder == -1){
        return b[property].localeCompare(a[property]);
      }else{
        return a[property].localeCompare(b[property]);
      }        
    }
}
exports.list_activity_with_limits = (req,res,next)=>{
    Sectors.find()
    .sort({"sector":1})
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            a.activity.sort(dynamicSort("activityName"));
            return a.activity.map((b, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id,
                  "sector"            : '<div class="wrapText text-left">'+a.sector+'</div>',
                  "sectorShortName"   : a.sectorShortName,
                  "activityName"      : '<div class="activityWrapText  text-left">'+b.activityName+'</div>',
                }
            })
        }))
        res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.list_activity = (req,res,next)=>{
    Sectors.find()
    .sort({"sector":1})
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            a.activity.sort(dynamicSort("activityName"));
            return a.activity.map((b, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id,
                  "sector"            : a.sector,
                  "sectorShortName"   : a.sectorShortName,
                  "activityName"      : b.activityName,
                }
            })
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
exports.list_subactivity_with_limits = (req,res,next)=>{
    Sectors.find()
    .sort({"sector":1})
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            a.activity.sort(dynamicSort("activityName"));
            return a.activity.map((b, i)=>{
                b.subActivity.sort(dynamicSort("subActivityName"));
                return b.subActivity.map((c, i)=>{
                    return {
                      "_id"               : a._id+'-'+b._id+'-'+c._id,
                      "sector"            : '<div class="wrapText text-left">'+a.sector+'</div>',
                      "sectorShortName"   : a.sectorShortName,
                      "activityName"      : '<div class="wrapText text-left">'+b.activityName+'</div>',
                      "subActivityName"   : '<div class="wrapText  text-left">'+c.subActivityName+'</div>',
                      "unit"              : c.unit,
                      "familyUpgradation" : c.familyUpgradation
                    }
                })
            })
        }))
        res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.list_subactivity = (req,res,next)=>{
    Sectors.find()
    .sort({"sector":1})
    // .sort({"activity.subActivity.subActivityName":1})
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            a.activity.sort(dynamicSort("activityName"));
            return a.activity.map((b, i)=>{
                b.subActivity.sort(dynamicSort("subActivityName"));
                return b.subActivity.map((c, i)=>{
                    return {
                      "_id"               : a._id+'-'+b._id+'-'+c._id,
                      "sector"            : a.sector,
                      "sectorShortName"   : a.sectorShortName,
                      "activityName"      : b.activityName,
                      "subActivityName"   : c.subActivityName,
                      "unit"              : c.unit,
                      "familyUpgradation" : c.familyUpgradation
                    }
                })
            })
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
exports.fetch_sectors = (req,res,next)=>{
    Sectors.find({_id : req.params.sectorsID})
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
function getAnnualPlanActivity(month,year,subactivity_ID,dataFor,center_ID,projectCategoryType,projectName){
    return new Promise((resolve,reject)=>{
        AnnualPlan.findOne({"subactivity_ID": subactivity_ID , "month" : month ,"year": year,"center_ID":center_ID, "projectCategoryType":projectCategoryType, "projectName":projectName })
                .exec()
                .then((data)=>{
                    // console.log("data in annual activity",data);
                    if (data) {
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                })
                .catch((err)=>{
                    reject(err);
                })
    });
}
function getMonthlyPlanActivity(month,year,subactivity_ID,dataFor,center_ID,projectCategoryType,projectName){
    return new Promise((resolve,reject)=>{
        MonthlyPlan.findOne({"subactivity_ID": subactivity_ID , "month" : month ,"year": year,"center_ID":center_ID, "projectCategoryType":projectCategoryType, "projectName":projectName })
                .exec()
                .then((data)=>{
                    // console.log("data in monthly activity",data);
                    if (data) {
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                })
                .catch((err)=>{
                    reject(err);
                })
    });
}
exports.fetch_sectors_nonduplicate_activity = (req,res,next)=>{
    // console.log("req.body",req.body);
    let subActivities = [];
    Sectors.findOne({_id : req.body.sector_ID})
        .exec()
        .then(data=>{
            // console.log("data ",data);
            if (data) {
                var getActivity = data.activity.find((activity,index)=>{
                    return String(activity._id) === req.body.activity_ID
                })
                // console.log("getActivity ",getActivity)
                if (getActivity) {
                    getPlanData();
                    async function getPlanData() {
                        var j = 0;
                        for (var j = 0; j < getActivity.subActivity.length; j++) {
                            // console.log("getActivity.subActivity[j]._id ",getActivity.subActivity[j]._id);
                            var getsubActivities = req.body.planFor === "Annual" ? await getAnnualPlanActivity(req.body.month,req.body.year,getActivity.subActivity[j]._id,req.body.dataFor,req.body.center_ID, req.body.projectCategoryType,req.body.projectName) : await getMonthlyPlanActivity(req.body.month,req.body.year,getActivity.subActivity[j]._id,req.body.dataFor,req.body.center_ID, req.body.projectCategoryType,req.body.projectName) ;
                            if (!getsubActivities) {
                                // console.log("getsubActivities ",getActivity.subActivity[j]);
                                subActivities.push(getActivity.subActivity[j]);
                            }
                            
                        }
                        if(j >= getActivity.subActivity.length){
                            // console.log("1 subActivities ",subActivities);
                            res.status(200).json(subActivities);
                        }
                        
                    }

                }else{
                            // console.log("2 subActivities ",subActivities);

                    res.status(200).json(subActivities);
                }

            }else{
                            // console.log("3 subActivities ",subActivities);

                res.status(200).json(subActivities);
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.sectors_length = (req,res,next)=>{
    Sectors.find()
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
};
exports.activity_length = (req,res,next)=>{
    Sectors.find() 
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id,
                  "sector"            : a.sector,
                  "activityName"      : b.activityName,
                }
            })
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
exports.subactivity_length = (req,res,next)=>{
    Sectors.find()       
    .exec()
    .then(data=>{
        var allData = [];
        var activityData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id,
                  "sector"            : a.sector,
                  "activityName"      : b.activityName,
                }
            })
        }))
        var subactivityData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
                return b.subActivity.map((c, j)=>{
                    return {
                        "_id"               : a._id+'-'+b._id+'-'+c._id,
                        "sector"            : a.sector,
                        "activityName"      : b.activityName,
                        "subActivityName"   : c.subActivityName,
                        "unit"              : c.unit,
                        "familyUpgradation" : c.familyUpgradation,
                    }
                })
            })
        }))
        allData.push(
                        {
                            data             : "Sector",
                            count            : data.length,
                        },
                        {
                            data             : "Activity",
                            count            : activityData.length,
                        },
                        {
                            data             : "Subactivity",
                            count            : subactivityData.length,
                        }
                    ) 
        // console.log('allData',allData);
        // res.status(200).json({"dataCount":allData.length});
        res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_sectors = (req,res,next)=>{
    Sectors.find({_id:req.params.sectorsID})
        .exec()
        .then(data=>{   
            var activityArray = data[0].activity
            var query = "1";
            query = {
                        "sector_ID" : req.params.sectorsID
                    };
            ActivityReport.find(query)
            .exec()
            .then(activityData=>{
                MonthlyPlan.find(query)
                .exec()
                .then(plansData=>{
                    ProjectMapping.find(query)
                    .exec()
                    .then(mappingProjectData=>{
                        SectorMapping.find(query)
                        .exec()
                        .then(mappingSectorData=>{
                            // console.log('activityData',activityData.length);
                            // console.log('plansData',plansData.length);
                            if(activityData.length>0 && plansData.length>0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Quarterly Plan & Activity Report"
                                });
                            }else if(activityData.length==0 && plansData.length>0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Quarterly Plan"
                                });
                            }else if(activityData.length>0  && plansData.length==0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Activity Report"
                                });
                            }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length > 0 && mappingProjectData.length > 0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Project Mapping & Framework Mapping"
                                });
                            }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length > 0 && mappingProjectData.length == 0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Framework Mapping"
                                });
                            }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length == 0 && mappingProjectData.length > 0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Project Mapping."
                                });
                            }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length == 0 && mappingProjectData.length == 0 && activityArray.length> 0){
                                res.status(200).json({
                                    "message" : "Sector can not be deleted, It is already used in Activity Master."
                                });
                            }else{ 
                                Sectors.deleteOne({_id:req.params.sectorsID})
                                .exec()
                                .then(data=>{
                                    res.status(200).json({
                                        "message"    : "Sector Deleted Successfully.", 
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
                    })
                })
            })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_activity = (req,res,next)=>{
    // console.log('req.params',req.params);
    Sectors.aggregate([
                            {
                                $match : {
                                    "_id"           : ObjectID(req.params.sectorsID),
                                    "activity._id"  : ObjectID(req.params.activityID)
                                }
                            },
                            { 
                                $project: {
                                    "sector"    : 1,
                                    "activity": { 
                                        $filter: {
                                            input: '$activity',
                                            as: 'activity',
                                            cond: { $eq: ['$$activity._id', ObjectID(req.params.activityID)]}
                                        }
                                    }
                                }
                            },
                            {
                                $unwind : "$activity"
                            },
                        ])                
    .exec()
    .then(data=>{   
        // console.log('data',data);
        var subActivityArray = data[0].activity.subActivity;   
        // console.log('subActivityArray',subActivityArray);
        var query = "1";
        query = {
                    "activity_ID" : req.params.activityID
                };
        var mappingQuery = "1";
        mappingQuery = {
                    "sector.activity_ID" : req.params.activityID
                };
        ActivityReport.find(query)
        .exec()
        .then(activityData=>{
            MonthlyPlan.find(query)
            .exec()
            .then(plansData=>{
                ProjectMapping.find(mappingQuery)
                .exec()
                .then(mappingProjectData=>{
                    SectorMapping.find(mappingQuery)
                    .exec()
                    .then(mappingSectorData=>{
                        // console.log('activityData',activityData.length);
                        // console.log('plansData',plansData.length);
                        if(activityData.length>0 && plansData.length>0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Quarterly Plan & Activity Report"
                            });
                        }else if(activityData.length==0 && plansData.length>0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Quarterly Plan"
                            });
                        }else if(activityData.length>0  && plansData.length==0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Activity Report"
                            });
                        }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length > 0 && mappingProjectData.length > 0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Project Mapping & Framework Mapping"
                            });
                        }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length > 0 && mappingProjectData.length == 0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Framework Mapping"
                            });
                        }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length == 0 && mappingProjectData.length > 0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Project Mapping."
                            });
                        }else if(activityData.length==0  && plansData.length==0 && mappingSectorData.length == 0 && mappingProjectData.length == 0 && subActivityArray.length> 0){
                            res.status(200).json({
                                "message" : "Activity can not be deleted, It is already used in Subactivity Master."
                            });
                        }else{ 
                            Sectors.updateOne(
                                {
                                    "_id"          :  req.params.sectorsID
                                },  
                                { 
                                    $pull: { "activity": { "_id": req.params.activityID } } 
                                }
                            )
                            .exec()
                            .then(data=>{
                                res.status(200).json({
                                    "message": "Activity Deleted Successfully."
                                });
                            })
                            .catch(err =>{
                                console.log(err);
                            });
                        }
                    })
                })
            })
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_subactivity = (req,res,next)=>{
    // console.log("req.params",req.params);
    var query = "1";
    query = {
                "subactivity_ID" : req.params.subActivityID
            };
    var mappingQuery = "1";
    mappingQuery = {
                    "sector.subActivity_ID" : req.params.subActivityID
                };
    ActivityReport.find(query)
    .exec()
    .then(activityData=>{
        MonthlyPlan.find(query)
        .exec()
        .then(plansData=>{
            ProjectMapping.find(query)
            .exec()
            .then(mappingProjectData=>{
                // console.log('activityData',activityData.length);
                // console.log('plansData',plansData.length);
                if(activityData.length>0 && plansData.length>0){
                    res.status(200).json({
                        "message" : "Subactivity can not be deleted, It is already used in Quarterly Plan & Activity Report"
                    });
                }else if(activityData.length==0 && plansData.length>0){
                    res.status(200).json({
                        "message" : "Subactivity can not be deleted, It is already used in Quarterly Plan"
                    });
                }else if(activityData.length>0  && plansData.length==0){
                    res.status(200).json({
                        "message" : "Subactivity can not be deleted, It is already used in Activity Report"
                    });
                }else if(activityData.length==0  && plansData.length==0 && mappingProjectData.length > 0){
                    res.status(200).json({
                        "message" : "Subactivity can not be deleted, It is already used in Project Mapping."
                    });
                }else{
                    Sectors.updateOne(
                        {
                            "_id"          :  req.params.sectorsID,
                            "activity._id" :  req.params.activityID
                        },  
                        { 
                            $pull: { "activity.$.subActivity": { "_id": req.params.subActivityID } } 
                        }
                    )
                    .exec()
                    .then(data=>{
                        if(data){
                            res.status(200).json({
                                "message": "Subactivity Deleted Successfully."
                            });
                        }else{
                            res.status(401).json({
                                "message": "Sector Not Found"
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
        })
    })
};