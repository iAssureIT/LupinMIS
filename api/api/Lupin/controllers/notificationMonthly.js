const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
var request             = require('request-promise');
const ObjectID          = require('mongodb').ObjectID;
var moment              = require('moment');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Center            = require('../models/centers.js');

function fetchPlanStatusCenter(center_ID,planMonth,planYear){
    return new Promise(function(resolve,reject){
        MonthlyPlan.find({
        						center_ID 	: String(center_ID),
        						month 		: String(planMonth),
        						year		: String(planYear)
        				})
                    .exec()
                    .then(data=>{
                        if(data.length > 0){
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};

exports.planReminder = (req,res,next)=>{
	Center  .find()
			.exec()
            .then(centerList=>{
            	getData()
            	async function getData(){
            		var j = 0;
            		var returnData = [];
            		for(j = 0 ; j < centerList.length ; j++){
	            		var monthlyData = await fetchPlanStatusCenter(centerList[j]._id,req.params.planMonth,req.params.planYear);
	            		if(monthlyData){
                            request({
                                        "method"    : "GET", 
                                        "url"       : "http://localhost:"+globalVariable.port+"/api/masternotification/send-mail",
                                        "body"      : {
                                                            "templateName": "monthlyplanreminder",
                                                            "variables"   : {
                                                                                '[User]'    : centerList[j].centerInchargeName,
                                                                            },
                                                            "to"          : centerList[j].misCoordinatorEmail
                                                        },
                                        "json"      : true,
                                        "headers"   : {
                                                        "User-Agent": "Test Agent"
                                                    }
                                    })
                                    .then(cb=>{
                                        // resolve({cb,data}); 
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        // res.status(200).json(err);
                                    });
	            			// returnData.push(centerList[j].centerName);
	            		} 
	            	}
	            	if(j >= centerList.length){
		            	res.status(200).json("Successfully")
	            	}
            	}
            })
            .catch(err=>{
                res.status(200).json(err);
            })
};