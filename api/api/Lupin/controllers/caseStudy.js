const mongoose	= require("mongoose");
const CaseStudy = require('../models/caseStudy');

exports.create_caseStudy = (req,res,next)=>{
	CaseStudy.find()
		.exec()
		.then(data =>{
				const caseStudy = new CaseStudy({
                    _id                 : new mongoose.Types.ObjectId(),    
                    center_ID           : req.body.center_ID,
                    center              : req.body.center,
                    date                : req.body.date,
                    sector_ID           : req.body.sector_ID,
                    sectorName          : req.body.sectorName,
                    title               : req.body.title,
                    author              : req.body.author,
                    caseStudy_Image     : req.body.caseStudy_Image,
                    caseStudy_File      : req.body.caseStudy_File,
                    createdAt           : new Date()
                });
                caseStudy.save()
                    .then(data=>{
                        res.status(200).json({"message":"Case Study Details submitted Successfully."});
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
exports.update_caseStudy = (req,res,next)=>{
    CaseStudy.updateOne(
            { _id:req.body.caseStudy_ID},  
            {
                $set:{
                    center_ID           : req.body.center_ID,
                    center              : req.body.center,
                    date                : req.body.date,
                    sector_ID           : req.body.sector_ID,
                    sectorName          : req.body.sectorName,
                    title               : req.body.title,
                    author              : req.body.author,
                    caseStudy_Image     : req.body.caseStudy_Image,
                    caseStudy_File      : req.body.caseStudy_File,
                    createdAt           : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Case Study Details updated Successfully."
                });
            }else{
                res.status(200).json({
                    "message": "Case Study Details not modified"
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
exports.list_caseStudy = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        CaseStudy.find(query)
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
};
exports.list_caseStudy_with_limits = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        CaseStudy.find(query)
        .sort({"createdAt":-1})
        .skip(parseInt(req.params.startRange))
        .limit(parseInt(req.params.limitRange))
        .exec()
        .then(data=>{
            var alldata = data.map((a, i)=>{
                return {
                    "_id"                   : a._id,
                    "center_ID"             : a.center_ID,
                    "center"                : a.center,
                    "date"                  : a.date,
                    "sector_ID"             : a.sector_ID,
                    "sectorName"            : a.sectorName,
                    "title"                 : a.title,
                    "author"                : a.author,
                    "caseStudy_Image"       : a.caseStudy_Image,
                    "caseStudy_File"        : a.caseStudy_File,
                }
            })
            res.status(200).json(alldata);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
};
exports.count_caseStudy = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        CaseStudy.find(query)
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
    }
};
exports.fetch_caseStudy = (req,res,next)=>{
    CaseStudy.find({_id : req.params.caseStudyID})
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
exports.delete_caseStudy = (req,res,next)=>{
    CaseStudy.deleteOne({_id:req.params.caseStudyID})
    .exec()
    .then(data=>{
        res.status(200).json({"message":"Case Study Details deleted Successfully"});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};