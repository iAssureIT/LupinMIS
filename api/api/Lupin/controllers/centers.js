const mongoose          = require("mongoose");
var moment              = require('moment');

const Centers           = require('../models/centers');
const TypeOfCenter      = require('../models/typeofcenters.js')

const ActivityReport    = require('../models/activityReport.js');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Families          = require('../models/families.js');
const ListOfbeneficiary = require('../models/beneficiaries');

exports.create_centers = (req,res,next)=>{
    Centers.findOne({ $and: [ { type_ID : req.body.type_ID }, { centerName : req.body.centerName } ] })
	// Centers.find({type_ID : req.body.type_ID, centerName : req.body.centerName})
		.exec()
		.then(data =>{
            if(data){
                // res.status(200).json({message : "Center Name and Type Already Exists"});
                res.status(200).json({message : "Center already exist in Type of Center"});
            }else{
				const centers = new Centers({
                    _id                  : new mongoose.Types.ObjectId(),                    
                    type_ID              : req.body.type_ID,
                    centerName           : req.body.centerName,
                    address              : req.body.address,
                  
                    districtsCovered     : req.body.districtsCovered,
                    blocksCovered        : req.body.blocksCovered,
                    villagesCovered      : req.body.villagesCovered,

                    centerInchargeName   : req.body.centerInchargeName,
                    centerInchargeMobile : req.body.centerInchargeMobile,
                    centerInchargeEmail  : req.body.centerInchargeEmail,
                    
                    establishmentDate    : req.body.establishmentDate,
                  
                    misCoordinatorName   : req.body.misCoordinatorName,
                    misCoordinatorMobile : req.body.misCoordinatorMobile,
                    misCoordinatorEmail  : req.body.misCoordinatorEmail,
                    createdAt            : new Date()
                });
                centers.save()
                    .then(data=>{
                        res.status(200).json({
                            "message": "Center Details submitted Successfully."
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
exports.update_centers = (req,res,next)=>{
    Centers.updateOne(
            { _id:req.body.center_ID},  
            {
                $set:{
                    type_ID              : req.body.type_ID,
                    centerName           : req.body.centerName,
                    address              : req.body.address,
                  
                    districtsCovered     : req.body.districtsCovered,
                    blocksCovered        : req.body.blocksCovered,
                    villagesCovered      : req.body.villagesCovered,

                    centerInchargeName   : req.body.centerInchargeName,
                    centerInchargeMobile : req.body.centerInchargeMobile,
                    centerInchargeEmail  : req.body.centerInchargeEmail,
                    
                    establishmentDate    : req.body.establishmentDate,
                  
                    misCoordinatorName   : req.body.misCoordinatorName,
                    misCoordinatorMobile : req.body.misCoordinatorMobile,
                    misCoordinatorEmail  : req.body.misCoordinatorEmail,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Center Details updated Successfully."
                });
            }else{
                res.status(200).json({
                    "message": "Center Details not modified"
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

exports.list_centers = (req,res,next)=>{
    Centers.find()
       .sort({"centerName":1})
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
exports.list_centers_with_limits = (req,res,next)=>{
    Centers.aggregate([
                            {
                                $lookup :{
                                            from            : "typeofcenters",
                                            localField      : "type_ID",
                                            foreignField    : "_id",
                                            as              : "typeofcenter"
                                        }
                            },
                            {
                                $unwind : "$typeofcenter"
                            },
                            {
                                $project : {
                                                "address"               : 1,
                                                "type_ID"               : 1,
                                                "centerName"            : 1,
                                                "centerInchargeName"    : 1,
                                                "centerInchargeMobile"  : 1,
                                                "centerInchargeEmail"   : 1,
                                                "misCoordinatorName"    : 1, 
                                                "misCoordinatorMobile"  : 1,
                                                "misCoordinatorEmail"   : 1,
                                                "villagesCovered"       : 1,
                                                "type"                  : "$typeofcenter.typeofCenter"
                                            }
                            }
                        ]
        )
    .sort({"createdAt":1})
    .skip(parseInt(req.params.startRange))
    .limit(parseInt(req.params.limitRange))
    .exec()
    .then(data=>{
        // console.log("center data ",data);
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "address"               : '<div class="wrapText text-left">'+x.address.addressLine+", "+"</div><p class='text-left'>"+x.address.district+", "+x.address.state+", "+x.address.pincode+"</p>",
                "type_ID"               : '<div class="wrapText">'+x.type_ID+"</div>",
                "centerName"            : x.centerName,
                "centerInchargeDetail"  : "<div class='text-left'><p>"+x.centerInchargeName+"</p><p>"+x.centerInchargeMobile+"</p><p>"+x.centerInchargeEmail+"</p></div>",
                "misCoordinatorDetail"  : "<div class='text-left'><p>"+x.misCoordinatorName+"</p><p>"+x.misCoordinatorMobile+"</p><p>"+x.misCoordinatorEmail+"</p>",
                "numberofVillage"       : x.villagesCovered.length,
                "type"                  : x.type
            }
        })
        res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_centers = (req,res,next)=>{
    Centers.find({})
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "address"               : "<p>"+x.address.addressLine+", "+x.address.district+", "+"</p><p>"+x.address.state+", "+x.address.pincode+"</p>",
                "type_ID"               : x.type_ID,
                "centerName"            : x.centerName,
                "centerInchargeDetail"  : "<p>"+x.centerInchargeName+"</p><p>"+x.centerInchargeMobile+"</p><p>"+x.centerInchargeEmail+"</p>",
                "misCoordinatorDetail"  : "<p>"+x.misCoordinatorName+"</p><p>"+x.misCoordinatorMobile+"</p><p>"+x.misCoordinatorEmail+"</p>",
                "numberofVillage"       : x.villagesCovered.length
            }
        })
        res.status(200).json({"dataCount":allData.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_centers = (req,res,next)=>{
    Centers.find({_id : req.params.centerID})
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
exports.delete_centers = (req,res,next)=>{
    var query = "1";
    query = {
                "center_ID" : req.params.centerID
            };
    ActivityReport.find(query)
    .exec()
    .then(activityData=>{
        MonthlyPlan.find(query)
        .exec()
        .then(plansData=>{
            Families.find(query)
            .exec()
            .then(familiesData=>{
                ListOfbeneficiary.find(query)
                .exec()
                .then(benData=>{
                    // console.log('activityData',activityData.length);
                    // console.log('plansData',plansData.length);
                    if(activityData.length>0 && plansData.length>0 && familiesData.length>0 && benData.length>0){
                        res.status(200).json({
                            "message" : "Center Details can not be deleted, Master Data, Quarterly Plans & Activity Reports is present in this Center"
                        });
                    }else if(activityData.length==0 && plansData.length>0 && familiesData.length==0 && benData.length==0){
                        res.status(200).json({
                            "message" : "Center Details can not be deleted, Quarterly Plans is present in this Center"
                        });
                    }else if(activityData.length>0  && plansData.length==0 && familiesData.length==0 && benData.length==0){
                        res.status(200).json({
                            "message" : "Center Details can not be deleted, Activity Reports is present in this Center"
                        });
                    }else if(activityData.length==0  && plansData.length==0 && familiesData.length>0 && benData.length>0){
                        res.status(200).json({
                            "message" : "Center Details can not be deleted, Master Data is present in this Center"
                        });
                    }else if(activityData.length==0  && plansData.length==0 && familiesData.length==0 && benData.length>0){
                        res.status(200).json({
                            "message" : "Center Details can not be deleted, Master Data is present in this Center"
                        });
                    }else{
                        Centers.deleteOne({_id:req.params.centerID})
                        .exec()
                        .then(data=>{
                            res.status(200).json({
                                "message": "Center Details deleted Successfully."
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
};
exports.count_centers_centerType = (req,res,next)=>{
    TypeOfCenter.aggregate([
                        {
                            $lookup : {
                                        from            : "centers",
                                        localField      : "_id",
                                        foreignField    : "type_ID",
                                        as              : "center"
                            }
                        },
                        {
                            $project : {
                                "typeOfCenter" : "$typeofCenter",
                                "count"        : {"$size":"$center"}
                            }
                        }
            ])
           .then(data=>{
                // var actuallength = data.length;
                var returnData = [];
                var DDP = data.find(function(obj){
                                        return obj.typeOfCenter === 'DDP District Development Program Center'
                                    });
                returnData.push(DDP);
                var ADP = data.find(function(obj){
                                        return obj.typeOfCenter === 'ADP Aspirational District Program Center'
                                    });
                returnData.push(ADP);
                var worksite = data.find(function(obj){
                                        return obj.typeOfCenter === 'Worksite center'
                                    });
                returnData.push(worksite);
                var d = data.filter(function(obj) { return returnData.indexOf(obj) == -1; });
                var newArray = returnData.concat(d);

                res.status(200).json(newArray);
                
           })
           .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
           })
};
// exports.deleteall_centers = (req,res,next)=>{
//     Centers.delete()
//     .exec()
//     .then(data=>{
//         res.status(200).json({
//             "message": "Center List Deleted Successfully."
//         });
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// };

exports.mailIfMonthlyPlanNotFilled = (req,res,next)=>{
    // var now = new Date("2019-12-25");
    var now = new Date();
    // console.log("now ",now);
    var nextMonth = now.getMonth()+1; 
    var year = now.getFullYear();
    var month = "";
    // var current = now.getMonth()+1;
    if(nextMonth >= 12){
        year = year+1;
        month = moment(new Date(year,nextMonth)).format("MMMM");
    }else{
        month = moment(new Date(year,nextMonth)).format("MMMM");
    }
    year = year.toString();
    // console.log("Month ",month," Year ",year);
    // res.status(200).json({"Date":now,"Next Month":nextMonth,"Month":month,"Year":year});

    if(req.body.securityPass === 'Lupin123'){
        Centers.aggregate([
                            { $addFields: { "article_id": { "$toString": "$_id" }}},
                            {
                                $lookup : {
                                        from          : "monthlyplans",
                                        localField    : "article_id",
                                        foreignField  : "center_ID",
                                        as            : "monthlyplans"
                                }
                            },
                            {
                                $unwind : "$monthlyplans"
                            },
                            {
                                $match : {
                                            $and : [
                                                    { "monthlyplans.month" : month},
                                                    { "monthlyplans.year" : year}
                                            ]
                                }
                            }
            ])
              .then(data=>{
                if(data){
                    console.log("length ",data.length);
                    res.status(200).json(data);
                }
              })
              .catch(err => {
                    console.log("Failed while fatching center data");
                    res.status(500).json({error : err.message});
              })
    }else{
        res.status(200).json("Invalid Operation");
    }
};


