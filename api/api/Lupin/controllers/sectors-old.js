const mongoose	= require("mongoose");

const Sectors = require('../models/sectors');

exports.create_sectors = (req,res,next)=>{

	Sectors.find()
		.exec()
		.then(data =>{

				const sectors = new Sectors({
                    _id                 : new mongoose.Types.ObjectId(),                    
                    sector              : req.body.sector,
                    activity            :   [{
                                                activityName : req.body.activityName,
                                                subactivity  : [{
                                                                subactivityName     : req.body.subactivityName,
                                                                unit                : req.body.unit,
                                                                familyUpgradation   : req.body.familyUpgradation,
                                                                outreach            : req.body.outreach
                                                            }]
                                            }],
                    // createdBy           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                    createdAt           : new Date()
                });
                console.log('sectors ',sectors);
                sectors.save()
                    .then(data=>{
                        res.status(200).json(" Sector Added");
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

exports.list_sectors = (req,res,next)=>{
    Sectors.find()
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

exports.fetch_sectors = (req,res,next)=>{
    Sectors .find({_id : req.params.sectorsID})
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



exports.delete_sectors = (req,res,next)=>{
    Sectors.deleteOne({_id:req.params.sectorsID})
        .exec()
        .then(data=>{
            res.status(200).json("Sector Deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


