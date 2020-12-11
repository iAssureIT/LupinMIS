const mongoose	= require("mongoose");
const Highlight = require('../models/highlights');

exports.create_highlight = (req,res,next)=>{
	Highlight.find()
		.exec()
		.then(data =>{
				const highlight = new Highlight({
                    _id                 : new mongoose.Types.ObjectId(),    
                    center_ID           : req.body.center_ID,
                    center              : req.body.center,
                    date                : req.body.date,
                    userName            : req.body.userName,
                    highlight_File      : req.body.highlight_File,
                    highlight_Image     : req.body.highlight_Image,
                    createdAt           : new Date()
                });
                highlight.save()
                    .then(data=>{
                        res.status(200).json({"message":"Highlight Details submitted Successfully."});
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
exports.update_highlight = (req,res,next)=>{
    Highlight.updateOne(
            { _id:req.body.highlight_ID},  
            {
                $set:{
                    center_ID           : req.body.center_ID,
                    center              : req.body.center,
                    date                : req.body.date,
                    userName            : req.body.userName,
                    highlight_Image     : req.body.highlight_Image,
                    highlight_File      : req.body.highlight_File,
                    createdAt           : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Highlight Details updated Successfully."
                });
            }else{
                res.status(200).json({
                    "message": "Highlight Details not modified"
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
exports.list_highlight = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        Highlight.find(query)
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
exports.list_highlight_with_limits = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        Highlight.find(query)
        .sort({"createdAt":-1})
        .skip(parseInt(req.params.startRange))
        .limit(parseInt(req.params.limitRange))
        .exec()
        .then(data=>{
            var alldata = data.map((a, i)=>{
                return {
                    "_id"                   : a._id,
                    "center"                : a.center,
                    "center_ID"             : a.center_ID,
                    "date"                  : a.date,
                    "userName"              : a.userName,
                    "highlight_Image"       : a.highlight_Image,
                    "highlight_File"        : a.highlight_File,
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
exports.count_highlight = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        Highlight.find(query)
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
exports.fetch_highlight = (req,res,next)=>{
    Highlight.find({_id : req.params.highlightID})
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
exports.delete_highlight = (req,res,next)=>{
    Highlight.deleteOne({_id:req.params.highlightID})
    .exec()
    .then(data=>{
        res.status(200).json({"message":"Highlight Details deleted Successfully"});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};