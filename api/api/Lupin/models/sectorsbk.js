const mongoose	= require("mongoose");
const _         = require("underscore");
const Sectors   = require('../models/sectors');
const AnnualPlan = require('../models/annualPlans');
const MonthlyPlan = require('../models/monthlyPlans');
const ObjectID   = require('mongodb').ObjectID;


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
                }
            )
            .exec()
            .then(data=>{
                if(data && data.activity._id != req.body.activity_ID){
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
                            .then(data=>{
                                if(data){
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

            console.log('req.body',req.body);
    //==== Take sub activity array ===

    Sectors.findOne({"_id" : req.body.sector_ID})
        .exec()
        .then(data=>{
            const activity = data.activity.find(function(element){
                return element._id = req.body.activity_ID;
            });
            if(activity){
                    console.log("activity = ",activity);
                var subActivity = activity.subActivity;
                if(subActivity){
                    // console.log("subActivity = ",subActivity);
                    const subActIndex = subActivity.findIndex((obj => obj._id == req.body.subactivity_ID));
                    if(subActIndex>1){
                    console.log("subActivity = ",subActivity[subActIndex]);
                    console.log("subActIndex = ",subActIndex);

                        // subActivity[subActIndex].sector             = req.body.sector;
                        // subActivity[subActIndex].activityName       = req.body.activityName;
                        subActivity[subActIndex].subActivityName    = req.body.subActivityName;
                        subActivity[subActIndex].unit               = req.body.unit;
                        subActivity[subActIndex].familyUpgradation  = req.body.familyUpgradation;

                        Sectors.updateOne(
                                        {
                                            "_id"             : req.body.sector_ID,
                                            "activity._id"    : req.body.activity_ID
                                        },  
                                        {
                                            $set : { "activity.$.subActivity" : subActivity }        
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data){
                                            res.status(200).json({
                                                "message": "Subactivity '"+req.body.subActivityName+"' for the Activity '"+req.body.activityName+"' in '"+req.body.sector+"' Sector is Updated Successfully"
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
                    }else{
                        res.status(401).json({
                            "message": "Something went wrong"
                        });

                    }
                }

            }
        })
        .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                })
};





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
          .sort({"createdAt":-1})
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
exports.list_activity_with_limits = (req,res,next)=>{
    Sectors.find()
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id,
                  "sector"            : a.sector,
                  "sectorShortName"   : a.sectorShortName,
                  "activityName"      : '<div class="activityWrapText">'+b.activityName+'</div>',
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
    .sort({"activity.activityName":1})
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
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
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
              return b.subActivity.map((c, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id+'-'+c._id,
                  "sector"            : a.sector,
                  "sectorShortName"   : a.sectorShortName,
                  "activityName"      : '<div class="wrapText">'+b.activityName+'</div>',
                  "subActivityName"   : '<div class="wrapText">'+c.subActivityName+'</div>',
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
    .sort({"activity.subActivity.subActivityName":1})
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
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
function getAnnualPlanActivity(month,year,subactivity_ID,dataFor){
    return new Promise((resolve,reject)=>{
        AnnualPlan.findOne({"subactivity_ID": subactivity_ID , "month" : month ,"year": year})
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
function getMonthlyPlanActivity(month,year,subactivity_ID,dataFor){
    return new Promise((resolve,reject)=>{
        MonthlyPlan.findOne({"subactivity_ID": subactivity_ID , "month" : month ,"year": year})
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
            if (data) {
                
                var getActivity = data.activity.find((activity,index)=>{
                    return String(activity._id) === req.body.activity_ID
                })
                if (getActivity) {
                    getPlanData();
                    async function getPlanData() {
                        for (var i = 0; i < getActivity.subActivity.length; i++) {
                            var getsubActivities = req.body.planFor === "Annual" ? await getAnnualPlanActivity(req.body.month,req.body.year,getActivity.subActivity[i]._id,req.body.dataFor) : await getMonthlyPlanActivity(req.body.month,req.body.year,getActivity.subActivity[i]._id,req.body.dataFor) ;
                            if (!getsubActivities) {
                                subActivities.push(getActivity.subActivity[i]);
                            }
                            
                        }
                        if(i >= getActivity.subActivity.length){
                            res.status(200).json(subActivities);
                        }
                        
                    }

                }else{
                    res.status(200).json(subActivities);
                }

            }else{
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
        var allData = _.flatten(data.map((a, index)=>{
            return a.activity.map((b, i)=>{
              return b.subActivity.map((c, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id+'-'+c._id,
                  "sector"            : a.sector,
                  "activityName"      : b.activityName,
                  "subActivityName"   : c.subActivityName,
                  "unit"              : c.unit,
                  "familyUpgradation" : c.familyUpgradation
                }
              })
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
exports.delete_sectors = (req,res,next)=>{
    console.log('req.params.sectorsID', req.params.sectorsID);
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
};
exports.delete_activity = (req,res,next)=>{
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
        if(data){
            res.status(200).json({
                "message": "Activity Deleted Successfully."
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
};
exports.delete_subactivity = (req,res,next)=>{
    console.log("req.params",req.params);
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
};