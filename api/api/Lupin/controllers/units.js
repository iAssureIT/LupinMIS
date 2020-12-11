const mongoose	= require("mongoose");
const Unit = require('../models/units.js');

exports.create_units = (req,res,next)=>{
    // console.log('req.body',req.body)
    Unit.find({unit : req.body.unit})
                .exec()
                .then(data=>{
                    // console.log('data',data)
                    if(data.length > 0){
                        res.status(200).json({message:"Type of Center already exists"});
                    }else{

                        const unit = new Unit({
                            _id                     : new mongoose.Types.ObjectId(),
                            unit                    : req.body.unit,
                            createdBy               : req.body.createdBy,
                            createdAt               : new Date(),
                        });
                        // console.log("unit ",unit);
                        unit.save()
                                    .then(data=>{
                                        // console.log("data ",data);
                                        res.status(200).json({
                                            "message"   : "Unit submitted Successfully.",
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
                    // console.log('err',err)
                    res.status(500).json({error:err});
                });
};
exports.update_units = (req,res,next)=>{
    Unit.updateOne(
                            {_id : req.body.ID},
                            {
                                $set : {
                                    unit : req.body.unit,
                                }
                            }
                )
                .exec()
                .then(data=>{
                    // console.log("data",data);
                    if(data.nModified === 1){
                        res.status(200).json({message:"Unit updated Successfully."})
                    }else{
                        res.status(200).json({message:"Unit not modified."})
                    }
                })
                .catch(err=>{
                    res.status(500).json({error:err});
                });
};
exports.list_units = (req,res,next)=>{
    Unit.find()
        .sort({"unit":1})
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
exports.delete_units = (req,res,next)=>{
    Unit.deleteOne({_id:req.params.ID})
    .exec()
    .then(data=>{
        res.status(200).json({"message":"Unit deleted Successfully"});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_units = (req,res,next)=>{
    Unit.find({_id : req.params.ID})       
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