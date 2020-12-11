const mongoose	= require("mongoose");

const Centers      = require('../models/centers');
const TypeOfCenter = require('../models/typeofcenters.js');

exports.create_typeofcenter = (req,res,next)=>{
    TypeOfCenter.find({typeofCenter : req.body.typeofCenter})
                .exec()
                .then(data=>{
                    if(data.length > 0){
                        res.status(200).json({message:"Type of Center already exists"});
                    }else{
                        const typeOfCenter = new TypeOfCenter({
                                                    _id                     : new mongoose.Types.ObjectId(),
                                                    typeofCenter            : req.body.typeofCenter,
                                                    createdBy               : req.body.createdBy,
                                                    createdAt               : new Date(),
                                                });
                        // console.log("typeofcenter ",typeOfCenter);
                        typeOfCenter.save()
                                    .then(data=>{
                                        // console.log("data ",data);
                                        res.status(200).json({
                                            "message"   : "Type of Center Details submitted Successfully.",
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

exports.update_typeofcenter = (req,res,next)=>{
    TypeOfCenter.updateOne(
                            {_id : req.body.ID},
                            {
                                $set : {
                                    typeofCenter : req.body.typeofCenter,
                                }
                            }
                )
                .exec()
                .then(data=>{
                    // console.log("data",data);
                    if(data.nModified === 1){
                        res.status(200).json({message:"Type of Center Details updated Successfully."})
                    }else{
                        res.status(200).json({message:"Type of Center Details not modified."})
                    }
                })
                .catch(err=>{
                    res.status(500).json({error:err});
                });
};


exports.list_typeofcenter = (req,res,next)=>{
    TypeOfCenter.find()
        .sort({"typeofCenter":1})
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


exports.delete_typeofcenter = (req,res,next)=>{
    Centers.find({type_ID:req.params.ID})
    .exec()
    .then(centerData=>{
        if(centerData.length>0){
            // console.log("centerData",centerData.length);
            res.status(200).json({
                "message" : "Type of Center can not be deleted, It is already used in Centers Details"
            });
        }else{
            TypeOfCenter.deleteOne({_id:req.params.ID})
            .exec()
            .then(data=>{
                res.status(200).json({"message":"Type of Center Details deleted Successfully"});
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

exports.fetch_typeofcenter = (req,res,next)=>{
    TypeOfCenter.find({_id : req.params.ID})       
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