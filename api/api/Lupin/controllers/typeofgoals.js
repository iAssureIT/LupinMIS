const mongoose	= require("mongoose");
const _         = require("underscore");
const SectorMapping = require('../models/sectorMappings');
const TypeOfGoal = require('../models/typeofgoals.js');

exports.create_typeofgoal = (req,res,next)=>{
    TypeOfGoal.find({typeofGoal : req.body.typeofGoal})
                .exec()
                .then(data=>{
                    if(data.length > 0){
                        res.status(200).json({message:"Goal Type already exists"});
                    }else{
                        const typeOfCenter = new TypeOfGoal({
                                                    _id                     : new mongoose.Types.ObjectId(),
                                                    typeofGoal              : req.body.typeofGoal,
                                                    createdBy               : req.body.createdBy,
                                                    createdAt               : new Date(),
                                                });
                        // console.log("typeofgoal ",typeOfCenter);
                        typeOfCenter.save()
                                    .then(data=>{
                                        // console.log("data ",data);
                                        res.status(200).json({
                                            "message"   : "Goal Type submitted Successfully",
                                            "ID"        : data._id
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
                .catch(err=>{
                    res.status(500).json({error:err});
                });
};

exports.update_typeofgoal = (req,res,next)=>{
    TypeOfGoal.updateOne(
                            {_id : req.body.ID},
                            {
                                $set : {
                                    typeofGoal : req.body.typeofGoal,
                                }
                            }
                )
                .exec()
                .then(data=>{
                    // console.log("data",data);
                    if(data.nModified === 1){
                        res.status(200).json({message:"Goal Type updated Successfully"})
                    }else{
                        res.status(200).json({message:"Goal Type not modified"})
                    }
                })
                .catch(err=>{
                    res.status(500).json({error:err});
                });
};

exports.insert_goalName = (req,res,next)=>{
    
    var typeofGoal = req.body.typeofGoal 
    TypeOfGoal.findOne(
                { 
                    $and: 
                        [ 
                            { 
                                "_id"               : req.body.ID,
                            }, 
                            { 
                                "goal.goalName"     : req.body.goalName
                            } 
                        ] 
                }
            )
            .exec()
            .then(data=>{
                if(data){
                    res.status(200).json({message: "Goal Name Already Exist"})
                }else{
                    TypeOfGoal.updateOne(
                                { _id:req.body.ID},  
                                {
                                    $push:{
                                        goal  : { goalName: req.body.goalName}
                                    }
                                }
                            )
                            .exec()
                            .then(data=>{
                                // console.log("typeofgoal",typeofGoal)
                                if(data.nModified === 1){
                                    res.status(200).json({
                                        "message": "Goal Name '"+req.body.goalName+"' for Goal Type '"+typeofGoal+"' added successfully."
                                    });
                                }else{
                                    res.status(200).json({
                                        "message": "Goal Name not modified."
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

exports.update_goalName = (req,res,next)=>{
    TypeOfGoal.findOne(
                { 
                    $and: 
                        [ 
                            { 
                                "_id"               : req.body.ID,
                            }, 
                            { 
                                "goal.goalName"     : req.body.goalName
                            } 
                        ] 
                }
            )
            .exec()
            .then(data=>{
                if(data && data.goal._id != req.body.goal_ID){
                    res.status(200).json({message: "Goal Name Already Exist"})
                }else{
                    TypeOfGoal.updateOne(
                                {
                                    "_id"         : req.body.ID,
                                    "goal._id"    : req.body.goal_ID
                                },  
                                {
                                    $set:{
                                        "goal.$.goalName": req.body.goalName
                                    }    
                                }
                            )
                            .exec()
                            .then(data=>{
                                if(data){
                                    res.status(200).json({
                                        "message": "Goal Name '"+req.body.goalName+"' in '"+req.body.typeofGoal+"' Goal Type is Updated Successfully"
                                    });
                                }else{
                                    res.status(401).json({
                                        "message": "Goal Name Not Found"
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

exports.list_typeofgoal = (req,res,next)=>{
    TypeOfGoal.find()
        .sort({"typeofGoal":1})
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

exports.list_goalName_with_limits = (req,res,next)=>{
    TypeOfGoal.find()
    .exec()
    .then(data=>{
        var allData = _.flatten(data.map((a, index)=>{
            return a.goal.map((b, i)=>{
                return {
                  "_id"               : a._id+'-'+b._id,
                  "typeofGoal"        : a.typeofGoal,
                  "goalName"          : '<div  class="text-left">'+b.goalName+'</div>',
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
exports.delete_typeofgoal = (req,res,next)=>{
    SectorMapping.find({type_ID:req.params.ID})
    .exec()
    .then(mappingdata=>{
        if(mappingdata.length>0){
            // console.log("mappingdata",mappingdata.length);
            res.status(200).json({
                "message" : "Goal Type can not be deleted, It is already used in Framework Mapping"
            });
        }else{
            TypeOfGoal.deleteOne({_id:req.params.ID})
            .exec()
            .then(data=>{
                res.status(200).json({"message":"Goal Type deleted Successfully"});
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

exports.delete_goalName = (req,res,next)=>{
    TypeOfGoal.findOne(
        { 
            $and: 
                [ 
                    { 
                        "_id"               : req.params.ID,
                    }, 
                    { 
                        "goal._id"     : req.params.goal_ID
                    } 
                ] 
        }
    )
    .exec()
    .then(data=>{
        var goalNameData = data.goal.filter((data)=>{
            if (data._id==req.params.goal_ID) {
                return data.goalName;
            }
        })
        var goalNames = [];
        goalNames.push(...goalNameData);
        var goalName = goalNames[0].goalName;
        
        SectorMapping.find({goal:goalName})
        .exec()
        .then(mappingdata=>{
            if(mappingdata.length>0){
                // console.log("mappingdata",mappingdata.length);
                res.status(200).json({
                    "message" : "Goal Name can not be deleted, It is already used in Framework Mapping"
                });
            }else{
                TypeOfGoal.updateOne(
                    {
                        "_id"          :  req.params.ID
                    },  
                    // { 
                    //     $pull: { "goal": { "_id": req.params.goal_ID } } 
                    // }
                )
                .exec()
                .then(data=>{
                    if(data){
                        res.status(200).json({
                            "message": "Goal Name Deleted Successfully."
                        });
                    }else{
                        res.status(401).json({
                            "message": "Goal Name Not Found"
                        });
                    }
                })
                .catch(err =>{
                    console.log(err);
                });
            }
        })
        .catch(err =>{
            console.log(err);
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_typeofgoal = (req,res,next)=>{
    TypeOfGoal.find({_id : req.params.ID})       
    .exec()
    .then(data=>{
        // console.log(data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
