const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
const ObjectID          = require('mongodb').ObjectID;
var request             = require('request-promise');
var moment              = require('moment');
const AnnualPlan        = require('../models/annualPlans.js');
const ActivityReport    = require('../models/activityReport.js');
const Sectors           = require('../models/sectors.js');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Center            = require('../models/centers.js');
const Families          = require('../models/families.js');
const SectorMapping     = require('../models/sectorMappings.js');
const ProjectMapping    = require('../models/projectMappings.js');
const TypeOfGoal        = require('../models/typeofgoals.js');

exports.activitywise_report = (req,res,next)=>{
	// console.log('activitywise_report req.params',req.params);
	var selector = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
	if(req.params.center_ID !== 'all'){
		selector.center_ID = req.params.center_ID;
	}
	if(req.params.sector_ID !== 'all'){
		selector.sector_ID = req.params.sector_ID;
	}
	if(req.params.activity_ID !== 'all'){
		selector.activity_ID = req.params.activity_ID;
	}
	if(req.params.subactivity_ID !== 'all'){
		selector.subactivity_ID = req.params.subactivity_ID;
	}
	if(req.params.projectCategoryType !== 'all'){
		selector.projectCategoryType = req.params.projectCategoryType;
	}
	if(req.params.projectName !== 'all'){
		selector.projectName = req.params.projectName;
	}
	// console.log('selector',selector);
	
	ActivityReport.aggregate([ 
								{
									$match : selector 
								},
								{
									$group : {
										"_id":    {
													"projectCategoryType"	: "$projectCategoryType",
													"projectName" 	  		: "$projectName",
													"sectorName" 		    : "$sectorName",
													"activityName" 		    : "$activityName",
													"subactivityName" 		: "$subactivityName",
													"center_ID"             : "$center_ID",
													"sector_ID"             : "$sector_ID",
													"activity_ID"           : "$activity_ID",
													"subactivity_ID"        : "$subactivity_ID",
													"unit" 					: "$unit",
													// "unitCost"				: "$unitCost",
												}, 
										"quantity" 		: { "$sum" : "$quantity" },
										"total"    		: { "$sum" : "$sourceofFund.total" },
										"LHWRF"    		: { "$sum" : "$sourceofFund.LHWRF" },
										"NABARD"   		: { "$sum" : "$sourceofFund.NABARD" },
										"bankLoan" 		: { "$sum" : "$sourceofFund.bankLoan" },
										"govtscheme" 	: { "$sum" : "$sourceofFund.govtscheme" },
										"directCC"      : { "$sum" : "$sourceofFund.directCC" },
										"indirectCC"    : { "$sum" : "$sourceofFund.indirectCC" },
										"other"    		: { "$sum" : "$sourceofFund.other" },
									}
								},
                                {
                                    $project: {
                                    	"_id"                    : 0,  
										"projectCategoryType"	: "$_id.projectCategoryType",
										"projectName" 	  		: "$_id.projectName",
										"sectorName" 		    : "$_id.sectorName",
										"activityName" 		    : "$_id.activityName",
										"subactivityName" 		: "$_id.subactivityName",
										"center_ID"             : "$_id.center_ID",
										"sector_ID"             : "$_id.sector_ID",
										"activity_ID"           : "$_id.activity_ID",
										"subactivity_ID"        : "$_id.subactivity_ID",
										"unit" 					: "$_id.unit",
										// "unitCost"				: "$_id.unitCost",  
										"quantity" 		        : 1,
										"total"    		        : 1,
										"LHWRF"    		        : 1,
										"NABARD"   		        : 1,
										"bankLoan" 		        : 1,
										"govtscheme" 	        : 1,
										"directCC"              : 1,
										"indirectCC"            : 1,
										"other"    		        : 1,              
                                    }
                                }
	])
    .exec()
    .then(data=>{
	    getData();
	    async function getData(){
	        var activitydata            = [];
	        var totalTotal              = 0;
	        var totalLHWRF              = 0;
	        var totalNABARD             = 0;
	        var totalbankLoan           = 0;
	        var totaldirectCC           = 0;
	        var totalindirectCC         = 0;
	        var totalgovtscheme         = 0;
	        var totalother              = 0;
	        var totalReach              = 0;
	        var totalFamilyUpgradation  = 0;
			let date = {$gte : req.params.startDate, $lte : req.params.endDate}
	        for (var i = 0; i < data.length; i++) {
	        	// console.log("data============",data.length)  	    
				var benCounts = await getBeneficiaryCount({ 
															center_ID           : data[i].center_ID, 
															sector_ID           : data[i].sector_ID,
															activity_ID         : data[i].activity_ID,
															subactivity_ID      : data[i].subactivity_ID,
															projectCategoryType : data[i].projectCategoryType,
															projectName         : data[i].projectName,
															date                : date
				                                        })
				// console.log("benCounts Activity.................",benCounts);
	            totalReach            += benCounts.reachCount ? benCounts.reachCount : 0;
	            totalFamilyUpgradation+= benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0;
	            // Number(12.1).toFixed(2) = 12.10
	            totalTotal            += data[i].total            ?  data[i].total       : 0;
	            totalLHWRF            += data[i].LHWRF            ?  data[i].LHWRF       : 0;
	            totalNABARD           += data[i].NABARD           ?  data[i].NABARD      : 0;
	            totalbankLoan         += data[i].bankLoan         ?  data[i].bankLoan    : 0;
	            totaldirectCC         += data[i].directCC         ?  data[i].directCC    : 0;
	            totalindirectCC       += data[i].indirectCC       ?  data[i].indirectCC  : 0;
	            totalgovtscheme       += data[i].govtscheme       ?  data[i].govtscheme  : 0;
	            totalother            += data[i].other            ?  data[i].other       : 0;
	            var activitydetails =  {              
	                "projectCategoryType"    : data[i].projectCategoryType,
	                "projectName"            : data[i].projectName,
	                "sectorName"             : data[i].sectorName,
	                "activityName"           : data[i].activityName,
	                "subactivityName"        : data[i].subactivityName,
					"center_ID"              : data[i].center_ID,
					"sector_ID"              : data[i].sector_ID,
					"activity_ID"            : data[i].activity_ID,
					"subactivity_ID"         : data[i].subactivity_ID,
	                "unit"                   : data[i].unit,
	                "unitCost"               : data[i].total            ? Number((data[i].total/data[i].quantity)/100000).toFixed(2) : 0,// Average unitCost calculated dividing total by quantity
	                "quantity"               : data[i].quantity,
	                "total"                  : data[i].total            ? Number(data[i].total/100000).toFixed(2) : 0,
	                "LHWRF"                  : data[i].LHWRF            ? Number(data[i].LHWRF/100000).toFixed(2) : 0,
	                "NABARD"                 : data[i].NABARD           ? Number(data[i].NABARD/100000).toFixed(2) : 0,
	                "bankLoan"               : data[i].bankLoan         ? Number(data[i].bankLoan/100000).toFixed(2) : 0,
	                "directCC"               : data[i].directCC         ? Number(data[i].directCC/100000).toFixed(2) : 0,
	                "indirectCC"             : data[i].indirectCC       ? Number(data[i].indirectCC/100000).toFixed(2) : 0,
	                "govtscheme"             : data[i].govtscheme       ? Number(data[i].govtscheme/100000).toFixed(2) : 0,
	                "other"                  : data[i].other            ? Number(data[i].other/100000).toFixed(2) : 0,
	                "reach"                  : benCounts.reachCount ? benCounts.reachCount : 0,
	            	"familyUpgradation"      : benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0,
	            }
	            console.log("activitydetails",activitydetails);
	        	activitydata.push(activitydetails);  
	        }
	        if(i >= data.length && data.length > 0){
	            activitydata.push( 
		            {              
		                "projectCategoryType"    : "-",
		                "projectName"            : "-",
		                "sectorName"             : "<b>Total</b>",
		                "activityName"           : "-",
		                "subactivityName"        : "-",
						"center_ID"              : "-",
						"sector_ID"              : "-",
						"activity_ID"            : "-",
						"subactivity_ID"         : "-",
		                "unit"                   : "-",
		                "unitCost"               : "-",
		                "quantity"               : "-",
		                "total"                  : "<b>" + Number(totalTotal/100000).toFixed(2) + "</b>",
		                "LHWRF"                  : "<b>" + Number(totalLHWRF/100000).toFixed(2) + "</b>",
		                "NABARD"                 : "<b>" + Number(totalNABARD/100000).toFixed(2) + "</b>",
		                "bankLoan"               : "<b>" + Number(totalbankLoan/100000).toFixed(2) + "</b>",
		                "directCC"               : "<b>" + Number(totaldirectCC/100000).toFixed(2) + "</b>",
		                "indirectCC"             : "<b>" + Number(totalindirectCC/100000).toFixed(2) + "</b>",
		                "govtscheme"             : "<b>" + Number(totalgovtscheme/100000).toFixed(2) + "</b>",
		                "other"                  : "<b>" + Number(totalother/100000).toFixed(2) + "</b>",
		                "reach"                  : "<b>" + (totalReach) + "</b>",
		                "familyUpgradation"      : "<b>" + (totalFamilyUpgradation) + "</b>",
		            },           
		            {              
		                "projectCategoryType"    : "-",
		                "projectName"            : "-",
		                "sectorName"             : "<b>Total %</b>",
		                "activityName"           : "-",
		                "subactivityName"        : "-",
						"center_ID"              : "-",
						"sector_ID"              : "-",
						"activity_ID"            : "-",
						"subactivity_ID"         : "-",
		                "unit"                   : "-",
		                "unitCost"               : "-",
		                "quantity"               : "-",
		                "total"                  : totalTotal > 0      ? "<b>"+Number((totalTotal / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "LHWRF"                  : totalLHWRF > 0      ? "<b>"+Number((totalLHWRF / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "NABARD"                 : totalNABARD > 0     ? "<b>"+Number((totalNABARD / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "bankLoan"               : totalbankLoan > 0   ? "<b>"+Number((totalbankLoan / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "directCC"               : totaldirectCC > 0   ? "<b>"+Number((totaldirectCC / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "indirectCC"             : totalindirectCC > 0 ? "<b>"+Number((totalindirectCC / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "govtscheme"             : totalgovtscheme > 0 ? "<b>"+Number((totalgovtscheme / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "other"                  : totalother > 0      ? "<b>"+Number((totalother / totalTotal)*100).toFixed(2) + "%" + "</b>": "<b>" + 0 + "</b>",
		                "reach"                  : "",
		                "familyUpgradation"      : "",
		            }
	            );
	        }
	        res.status(200).json(activitydata);
    	}
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};
function getBeneficiaryCount(query){
	// console.log('query',query);
    return new Promise(function(resolve,reject){
		ActivityReport.find(query)
	    .exec()
	    .then(actData=>{
	  		// console.log("actData",actData)
	    	var beneficiaryCount = {};
			var typeB_Reach = 0;
			var benficiariesArray = [];
			var newArray = [];
			for(var i=0; i<actData.length; i++){
				if(actData[i].typeofactivity == "Family Level Activity"){
	  				// console.log("i",i,"actData[i].listofBeneficiaries============",actData[i].listofBeneficiaries.length);
	  				benficiariesArray.push(...actData[i].listofBeneficiaries);
	  				// console.log('benficiariesArray',benficiariesArray);
				}
				if(actData[i].typeofactivity == "Type B Activity"){
					// console.log("typeB_Reach---- prev-",typeB_Reach)
					// console.log("actData[i].noOfBeneficiaries-----",actData[i].noOfBeneficiaries)
					typeB_Reach = typeB_Reach + actData[i].noOfBeneficiaries;
					// console.log("typeB_Reach-----",typeB_Reach)
				}						
			}
			// console.log("typeB_Reach****",typeB_Reach)
			//==== make benficiariesArray unique =====
			var flags = {};
			var uniqueBeneficiaries = benficiariesArray.filter(function(entry) {
			    if (flags[entry.beneficiary_ID]) {
			        return false;
			    }
			    flags[entry.beneficiary_ID] = true;
			    return true;
			});
	        var upgradedBeneficiaries = benficiariesArray.filter((data)=>{
                if (data.isUpgraded==="Yes") {
                    return data;
                }
            })
			// console.log('upgradedBeneficiaries',upgradedBeneficiaries);
			var uniqueFamily = upgradedBeneficiaries.filter(function(entry) {
			    if (flags[entry.family_ID]) {
			        return false;
			    }
			    flags[entry.family_ID] = true;
			    return true;
			});
			// console.log('uniqueFamily',uniqueFamily);
	        var upgradedfamilies = uniqueFamily.filter((data)=>{
			// console.log('data.isUpgraded',data.isUpgraded);

                if (data.isUpgraded==="Yes") {
                    return data;
                }
            })
			// console.log('upgradedfamilies******************',upgradedfamilies);
			beneficiaryCount.reachCount          = benficiariesArray.length + typeB_Reach; 
			beneficiaryCount.uniqueBenCount      = uniqueBeneficiaries.length + typeB_Reach;
			beneficiaryCount.uniqueFamilyCount   = uniqueFamily.length > 0        ? uniqueFamily.length        : 0;
			beneficiaryCount.upgradedfamilyCount = upgradedfamilies.length > 0    ? upgradedfamilies.length    : 0; 
			beneficiaryCount.upgradedBeneficiaryCount = upgradedBeneficiaries.length > 0    ? upgradedBeneficiaries.length    : 0; 
			resolve(beneficiaryCount);
	    })
	    .catch(err =>{
            reject(err);
	    });
	});
};
function findAllFamily(selector){
    return new Promise((resolve,reject)=>{
        Families.find({})
        .exec()
        .then(data =>{
            // console.log('data',data)
            if(data){
                resolve(data);
            }else{
                resolve(0);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
exports.sectorwise_report = (req,res,next)=>{
	// console.log('activitywise_report req.params',req.params);
	var selector = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
	if(req.params.center_ID !== 'all'){
		selector.center_ID = req.params.center_ID;
	}
	if(req.params.projectCategoryType !== 'all'){
		selector.projectCategoryType = req.params.projectCategoryType;
	}
	if(req.params.projectName !== 'all'){
		selector.projectName = req.params.projectName;
	}
	ActivityReport.aggregate([ 
								{
									$match : selector 
								},
								{
									$group : {
										"_id":    {
													"projectCategoryType"	: "$projectCategoryType",
													"projectName" 	  		: "$projectName",
													"sectorName" 		    : "$sectorName",
													"center_ID"             : "$center_ID",
													"sector_ID"             : "$sector_ID",
												}, 
										"total"    		: { "$sum" : "$sourceofFund.total" },
										"LHWRF"    		: { "$sum" : "$sourceofFund.LHWRF" },
										"NABARD"   		: { "$sum" : "$sourceofFund.NABARD" },
										"bankLoan" 		: { "$sum" : "$sourceofFund.bankLoan" },
										"govtscheme" 	: { "$sum" : "$sourceofFund.govtscheme" },
										"directCC"      : { "$sum" : "$sourceofFund.directCC" },
										"indirectCC"    : { "$sum" : "$sourceofFund.indirectCC" },
										"other"    		: { "$sum" : "$sourceofFund.other" },
									}
								},
                                {
                                    $project: {
                                    	"_id"                    : 0,  
										"projectCategoryType"	: "$_id.projectCategoryType",
										"projectName" 	  		: "$_id.projectName",
										"sectorName" 		    : "$_id.sectorName",
										"center_ID"             : "$_id.center_ID",
										"sector_ID"             : "$_id.sector_ID",
										"total"    		        : 1,
										"LHWRF"    		        : 1,
										"NABARD"   		        : 1,
										"bankLoan" 		        : 1,
										"govtscheme" 	        : 1,
										"directCC"              : 1,
										"indirectCC"            : 1,
										"other"    		        : 1,              
                                    }
                                }
	])
    .exec()
    .then(data=>{    	
	    getData();
	    async function getData(){
	        var activitydata = [];
	        var totalTotal              = 0;
	        var totalLHWRF              = 0;
	        var totalNABARD             = 0;
	        var totalbankLoan           = 0;
	        var totaldirectCC           = 0;
	        var totalindirectCC         = 0;
	        var totalgovtscheme         = 0;
	        var totalother              = 0;
	        var totalReach              = 0;
	        var totalFamilyUpgradation  = 0;
			let date = {$gte : req.params.startDate, $lte : req.params.endDate};
	        for (var i = 0; i < data.length; i++) {
	        	// console.log("data",data)
	        	// console.log("data[i]",data[i]);
	        	var benCounts = await getBeneficiaryCount({ 
															center_ID           : data[i].center_ID, 
															sector_ID           : data[i].sector_ID,
															projectCategoryType : data[i].projectCategoryType,
															projectName         : data[i].projectName,
															date                : date
				                                        })
				// console.log("benCountsSector.................",benCounts);
	            totalReach            += benCounts.reachCount ? benCounts.reachCount : 0;
	            totalFamilyUpgradation+= benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0;
	            totalTotal            += data[i].total       ?  data[i].total    : 0;
	            totalLHWRF            += data[i].LHWRF       ?  data[i].LHWRF    : 0;
	            totalNABARD           += data[i].NABARD      ?  data[i].NABARD    : 0;
	            totalbankLoan         += data[i].bankLoan    ?  data[i].bankLoan    : 0;
	            totaldirectCC         += data[i].directCC    ?  data[i].directCC    : 0;
	            totalindirectCC       += data[i].indirectCC  ?  data[i].indirectCC    : 0;
	            totalgovtscheme       += data[i].govtscheme  ?  data[i].govtscheme    : 0;
	            totalother            += data[i].other       ?  data[i].other    : 0;
	            // console.log('totalTotal',totalTotal);
	            var activitydetails =  {              
	                "projectCategoryType"    : data[i].projectCategoryType,
	                "projectName"            : data[i].projectName,
	                "sectorName"             : data[i].sectorName,
	                "total"                  : data[i].total         ? Number(data[i].total/100000).toFixed(2) : 0,
	                "LHWRF"                  : data[i].LHWRF         ? Number(data[i].LHWRF/100000).toFixed(2) : 0,
	                "NABARD"                 : data[i].NABARD        ? Number(data[i].NABARD/100000).toFixed(2) : 0,
	                "bankLoan"               : data[i].bankLoan      ? Number(data[i].bankLoan/100000).toFixed(2) : 0,
	                "directCC"               : data[i].directCC      ? Number(data[i].directCC/100000).toFixed(2) : 0,
	                "indirectCC"             : data[i].indirectCC    ? Number(data[i].indirectCC/100000).toFixed(2) : 0,
	                "govtscheme"             : data[i].govtscheme    ? Number(data[i].govtscheme/100000).toFixed(2) : 0,
	                "other"                  : data[i].other         ? Number(data[i].other/100000).toFixed(2) : 0,
	                "reach"                  : benCounts.reachCount  ? benCounts.reachCount : 0,
	            	"familyUpgradation"      : benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0,
	            }
				// console.log('activitydetails',activitydetails);
	        	activitydata.push(activitydetails);      
	        }
	        if(i >= data.length && data.length > 0){
	            activitydata.push( 
		            {              
		                "projectCategoryType"    : "-",
		                "projectName"            : "-",
		                "sectorName"             : "<b>Total</b>",
		                "total"                  : "<b>"+Number(totalTotal/100000).toFixed(2)+"</b>",
		                "LHWRF"                  : "<b>"+Number(totalLHWRF/100000).toFixed(2)+"</b>",
		                "NABARD"                 : "<b>"+Number(totalNABARD/100000).toFixed(2)+"</b>",
		                "bankLoan"               : "<b>"+Number(totalbankLoan/100000).toFixed(2)+"</b>",
		                "directCC"               : "<b>"+Number(totaldirectCC/100000).toFixed(2)+"</b>",
		                "indirectCC"             : "<b>"+Number(totalindirectCC/100000).toFixed(2)+"</b>",
		                "govtscheme"             : "<b>"+Number(totalgovtscheme/100000).toFixed(2)+"</b>",
		                "other"                  : "<b>"+Number(totalother/100000).toFixed(2)+"</b>",
		                "reach"                  : "<b>" + totalReach + "</b>",
		                "familyUpgradation"      : "<b>" + totalFamilyUpgradation + "</b>",
		            },           
		            {              
		                "projectCategoryType"    : "-",
		                "projectName"            : "-",
		                "sectorName"             : "<b>Total %</b>",
		                "total"                  : totalTotal > 0      ? "<b>"+Number((totalTotal / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "LHWRF"                  : totalLHWRF > 0      ? "<b>"+Number((totalLHWRF / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "NABARD"                 : totalNABARD > 0     ? "<b>"+Number((totalNABARD / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "bankLoan"               : totalbankLoan > 0   ? "<b>"+Number((totalbankLoan / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "directCC"               : totaldirectCC > 0   ? "<b>"+Number((totaldirectCC / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "indirectCC"             : totalindirectCC > 0 ? "<b>"+Number((totalindirectCC / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "govtscheme"             : totalgovtscheme > 0 ? "<b>"+Number((totalgovtscheme / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		                "other"                  : totalother > 0      ? "<b>"+Number((totalother / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>"+0+"</b>",
		            	"reach"                  : "",
		                "familyUpgradation"      : "",
		            }
	            );
	        }
	        res.status(200).json(activitydata);
    	}
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};
exports.report_goal_Old = (req,res,next)=>{
    // router.get('/goal/:startDate/:endDate/:center_ID/:goal_type/:goal/:uidstatus/:projectCategoryType/:projectName',  ReportsNewController.report_goal);
    var query = "1";
    if(req.params.goal == "all"){
        query = {   
                    $match : { "type_ID" : ObjectID(req.params.goal_type) } 
                };
    }else{
        query = {   
                    $match : { 
                                "type_ID" : ObjectID(req.params.goal_type),
                                "goal"    : req.params.goal 
                            } 
                };
    }
    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = 	{
                    $match : { 
                                "listofBeneficiaries1.uidNumber" : {$ne : "-"}
                            }
                };
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
                    $match : { 
                                "listofBeneficiaries1.uidNumber" : "-"
                            }
                };
    }else{
        uidquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    // console.log('query',query);
    if(query != "1"){
        SectorMapping.aggregate([
                                    query,
                                    {
                                        $lookup : {
                                                        from            : "typeofgoals",
                                                        localField      : "type_ID",
                                                        foreignField    : "_id",
                                                        as              : "goalType", 
                                                }
                                    },
                                    {
                                        $unwind : "$goalType"
                                    },
                                    {
                                        $unwind : "$sector"
                                    },
                                    {
                                        $project : {
                                            "goal"          : "$goal",
                                            "type_ID"       : "$type_ID",
                                            "goalType"      : "$goalType.typeofGoal",
                                            "sector_ID"     : "$sector.sector_ID",
                                            "sectorName"    : "$sector.sectorName",
                                            "activity_ID"   : "$sector.activity_ID",
                                            "activityName"  : "$sector.activityName",
                                        }
                                    }
                                ])
            .exec()
            .then(goalData=>{
                    // console.log('goalData',goalData.length);
                    var activitydata = [];
                    if(goalData.length > 0){
                        var flags = {};
                        var uniqueSector_IDs = goalData.filter(function(entry) {
                            if (flags[entry.sector_ID]) {
                                return false;
                            }
                            flags[entry.sector_ID] = true;
                            return true;
                        });
                        uniqueSector_IDs = uniqueSector_IDs.map((a, i)=>{
		                    return  a.sector_ID;
		                })
                        var uniqueActivityArray = goalData.filter(function(entry) {
                            if (flags[entry.activity_ID]) {
                                return false;
                            }
                            flags[entry.activity_ID] = true;
                            return true;
                        });
                        uniqueActivity_IDs = uniqueActivityArray.map((a, i)=>{
		                    return  a.activity_ID;
		                })
                        // console.log('uniqueActivityArray',uniqueActivityArray);
                        uniqueGoal = uniqueActivityArray.map((a, i)=>{
		                    return  {
		                    	goal          : a.goal,
		                    	goalType      : a.type_ID,
		                    	goal_Type     : a.goalType,
		                    	activity_ID   : a.activity_ID,
		                    }
		                })
                        var selector = {
                            date        : {$gte : req.params.startDate, $lte : req.params.endDate},
                            sector_ID   : {$in : uniqueSector_IDs},
                            activity_ID : {$in : uniqueActivity_IDs},
                        };
                        if(req.params.center_ID !== 'all'){
                            selector.center_ID = req.params.center_ID;
                        }
                        if(req.params.projectCategoryType !== 'all'){
                            selector.projectCategoryType = req.params.projectCategoryType;
                        }
                        if(req.params.projectName !== 'all'){
                            selector.projectName = req.params.projectName;
                        }
                        if(req.params.district !== 'all'){
                            selector.district = req.params.district;
                        }
                        // console.log('selector',selector);
                        // console.log('selector.sector_ID',selector.sector_ID);
                        ActivityReport.aggregate([ 
                                                {
                                                    $match : selector 
                                                },  
		                                        {
		                                            $unwind : "$listofBeneficiaries"
		                                        },
		                                        {
		                                            $lookup : {
		                                                    from          : "listofbeneficiaries",
		                                                    localField    : "listofBeneficiaries.beneficiary_ID",
		                                                    foreignField  : "_id",
		                                                    as            : "listofBeneficiaries1"
		                                            }
		                                        },
		                                        {
		                                            $unwind : "$listofBeneficiaries1"
		                                        },
		                                        uidquery,
												{
													$group : {
														"_id":    {
																	"projectCategoryType"	: "$projectCategoryType",
																	"projectName" 	  		: "$projectName",
																	"sectorName" 		    : "$sectorName",
																	"activityName" 		    : "$activityName",
																	"subactivityName" 		: "$subactivityName",
																	"center_ID"             : "$center_ID",
																	"sector_ID"             : "$sector_ID",
																	"activity_ID"           : "$activity_ID",
																	"subactivity_ID"        : "$subactivity_ID",
																	"unit" 					: "$unit",
																	// "unitCost"				: "$unitCost",
																}, 
														"quantity" 		: { "$sum" : "$quantity" },
														"total"    		: { "$sum" : "$sourceofFund.total" },
														"LHWRF"    		: { "$sum" : "$sourceofFund.LHWRF" },
														"NABARD"   		: { "$sum" : "$sourceofFund.NABARD" },
														"bankLoan" 		: { "$sum" : "$sourceofFund.bankLoan" },
														"govtscheme" 	: { "$sum" : "$sourceofFund.govtscheme" },
														"directCC"      : { "$sum" : "$sourceofFund.directCC" },
														"indirectCC"    : { "$sum" : "$sourceofFund.indirectCC" },
														"other"    		: { "$sum" : "$sourceofFund.other" },
													}
												},
				                                {
				                                    $project: {
				                                    	"_id"                    : 0,  
														"projectCategoryType"	: "$_id.projectCategoryType",
														"projectName" 	  		: "$_id.projectName",
														"sectorName" 		    : "$_id.sectorName",
														"activityName" 		    : "$_id.activityName",
														"subactivityName" 		: "$_id.subactivityName",
														"center_ID"             : "$_id.center_ID",
														"sector_ID"             : "$_id.sector_ID",
														"activity_ID"           : "$_id.activity_ID",
														"subactivity_ID"        : "$_id.subactivity_ID",
														"unit" 					: "$_id.unit",
														// "unitCost"				: "$_id.unitCost",  
														"quantity" 		        : 1,
														"total"    		        : 1,
														"LHWRF"    		        : 1,
														"NABARD"   		        : 1,
														"bankLoan" 		        : 1,
														"govtscheme" 	        : 1,
														"directCC"              : 1,
														"indirectCC"            : 1,
														"other"    		        : 1,              
				                                    }
				                                }
                                            ])
                            .exec()
                            .then(data=>{
							    getData();
							    async function getData(){
							        var activitydata            = [];
							        var totalTotal              = 0;
							        var totalLHWRF              = 0;
							        var totalNABARD             = 0;
							        var totalbankLoan           = 0;
							        var totaldirectCC           = 0;
							        var totalindirectCC         = 0;
							        var totalgovtscheme         = 0;
							        var totalother              = 0;
							        var totalReach              = 0;
							        var totalFamilyUpgradation  = 0;
									let date = {$gte : req.params.startDate, $lte : req.params.endDate};
							        for (var i = 0; i < data.length; i++) {
							        	// console.log("data============",data.length)  	    
										var benCounts = await getBeneficiaryCount({ 
																					center_ID           : data[i].center_ID, 
																					sector_ID           : data[i].sector_ID,
																					activity_ID         : data[i].activity_ID,
																					subactivity_ID      : data[i].subactivity_ID,
																					projectCategoryType : data[i].projectCategoryType,
																					projectName         : data[i].projectName,
																					date                : date
										                                        })
										// console.log("benCounts.................",benCounts);
							            totalReach            += benCounts.reachCount ? benCounts.reachCount : 0;
							            totalFamilyUpgradation+= benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0;
							            totalTotal            += data[i].total            ?  parseFloat((data[i].total).toFixed(2)) : 0;
							            totalLHWRF            += data[i].LHWRF            ?  parseFloat((data[i].LHWRF).toFixed(2)) : 0;
							            totalNABARD           += data[i].NABARD           ?  parseFloat((data[i].NABARD).toFixed(2)) : 0;
							            totalbankLoan         += data[i].bankLoan         ?  parseFloat((data[i].bankLoan).toFixed(2)) : 0;
							            totaldirectCC         += data[i].directCC         ?  parseFloat((data[i].directCC).toFixed(2)) : 0;
							            totalindirectCC       += data[i].indirectCC       ?  parseFloat((data[i].indirectCC).toFixed(2)) : 0;
							            totalgovtscheme       += data[i].govtscheme       ?  parseFloat((data[i].govtscheme).toFixed(2)) : 0;
							            totalother            += data[i].other            ?  parseFloat((data[i].other).toFixed(2)) : 0;
    						        	var goalType = uniqueGoal.filter((goalData)=>{
    						        		// console.log('goalData',goalData);
		                                    if(goalData.activity_ID == data[i].activity_ID && req.params.goal_type == goalData.goalType){
		                    				// console.log( " && req.params.goal_type === goalData.goalType","'",req.params.goal_type,"'",goalData.goalType,"'",req.params.goal_type == goalData.goalType);
		                    				// console.log('activity_ID==========',goalData.activity_ID, data[i].activity_ID,goalData.activity_ID == data[i].activity_ID);
		                                    	return data.goal_Type; 
		                                    }
		                                })
										var goalName = uniqueGoal.filter((goalData)=>{
		                    				// console.log('activdataity_ID==========',goalData.activity_ID ,data[i].activity_ID,goalData.activity_ID == data[i].activity_ID);
		                    					// console.log( " && req.params.goal === goalData.goal", req.params.goal, goalData.goal,req.params.goal === goalData.goal);
		                                    if(goalData.activity_ID == data[i].activity_ID && req.params.goal == goalData.goal){
		                                    	return data; 
		                                    }
		                                })
	                    				// console.log('goalType********',goalType);
	                    				// console.log('goalName********',goalName);

							            var activitydetails =  {              
							                "goalType"               : goalType,
							                "goalName"               : goalName,
							                "projectCategoryType"    : data[i].projectCategoryType,
							                "projectName"            : data[i].projectName,
							                "sectorName"             : data[i].sectorName,
							                "activityName"           : data[i].activityName,
							                "subactivityName"        : data[i].subactivityName,
											"center_ID"              : data[i].center_ID,
											"sector_ID"              : data[i].sector_ID,
											"activity_ID"            : data[i].activity_ID,
											"subactivity_ID"         : data[i].subactivity_ID,
							                "unit"                   : data[i].unit,
							                "unitCost"               : data[i].total            ? parseFloat((data[i].total)/(data[i].quantity)).toFixed(2) : 0,
							                "quantity"               : data[i].quantity,
							                "total"                  : data[i].total            ? parseFloat((data[i].total).toFixed(2)) : 0,
							                "LHWRF"                  : data[i].LHWRF            ? parseFloat((data[i].LHWRF).toFixed(2)) : 0,
							                "NABARD"                 : data[i].NABARD           ? parseFloat((data[i].NABARD).toFixed(2)) : 0,
							                "bankLoan"               : data[i].bankLoan         ? parseFloat((data[i].bankLoan).toFixed(2)) : 0,
							                "directCC"               : data[i].directCC         ? parseFloat((data[i].directCC).toFixed(2)) : 0,
							                "indirectCC"             : data[i].indirectCC       ? parseFloat((data[i].indirectCC).toFixed(2)) : 0,
							                "govtscheme"             : data[i].govtscheme       ? parseFloat((data[i].govtscheme).toFixed(2)) : 0,
							                "other"                  : data[i].other            ? parseFloat((data[i].other).toFixed(2)) : 0,
							                "reach"                  : benCounts.reachCount ? benCounts.reachCount : 0,
							            	"familyUpgradation"      : benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0,
							            }
							            // console.log("activitydetails",activitydetails);
							        	activitydata.push(activitydetails);  
							        }
							        if(i >= data.length && data.length > 0){
							            activitydata.push( 
								            {              
								                "projectCategoryType"    : "-",
								                "projectName"            : "-",
								                "sectorName"             : "Total",
								                "activityName"           : "-",
								                "subactivityName"        : "-",
												"center_ID"              : "-",
												"sector_ID"              : "-",
												"activity_ID"            : "-",
												"subactivity_ID"         : "-",
								                "unit"                   : "-",
								                "unitCost"               : "-",
								                "quantity"               : "-",
								                "total"                  : totalTotal.toFixed(2),
								                "LHWRF"                  : totalLHWRF.toFixed(2),
								                "NABARD"                 : totalNABARD.toFixed(2),
								                "bankLoan"               : totalbankLoan.toFixed(2),
								                "directCC"               : totaldirectCC.toFixed(2),
								                "indirectCC"             : totalindirectCC.toFixed(2),
								                "govtscheme"             : totalgovtscheme.toFixed(2),
								                "other"                  : totalother.toFixed(2),
								                "reach"                  : "",
								                "familyUpgradation"      : "",
								            },           
								            {              
								                "projectCategoryType"    : "-",
								                "projectName"            : "-",
								                "sectorName"             : "Total %",
								                "activityName"           : "-",
								                "subactivityName"        : "-",
												"center_ID"              : "-",
												"sector_ID"              : "-",
												"activity_ID"            : "-",
												"subactivity_ID"         : "-",
								                "unit"                   : "-",
								                "unitCost"               : "-",
								                "quantity"               : "-",
								                "total"                  : totalTotal > 0      ? (((totalTotal / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "LHWRF"                  : totalLHWRF > 0      ? (((totalLHWRF / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "NABARD"                 : totalNABARD > 0     ? (((totalNABARD / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "bankLoan"               : totalbankLoan > 0   ? (((totalbankLoan / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "directCC"               : totaldirectCC > 0   ? (((totaldirectCC / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "indirectCC"             : totalindirectCC > 0 ? (((totalindirectCC / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "govtscheme"             : totalgovtscheme > 0 ? (((totalgovtscheme / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "other"                  : totalother > 0      ? (((totalother / totalTotal)*100).toFixed(2)) + "%" : 0,
								                "reach"                  : "",
								                "familyUpgradation"      : "",
								            }
							            );
							        }
							        res.status(200).json(activitydata);
						    	}
                                // console.log('data=========',data);
                                // console.log('data.length=========',data.length);
                                // res.status(200).json(data);
                            })
                            .catch(err=>{
                                res.status(500).json({
                                    error: err
                                });
                            });	                                   
                    }else{
				        res.status(200).json(activitydata);
                    }
            })
            .catch(err=>{
                console.log('err---',err);
                res.status(500).json({
                    error: err
                });  
            });
    }
};
function getAllGoalNames(goal_type){
	// console.log('goal_type',goal_type);
    return new Promise(function(resolve,reject){
	    TypeOfGoal.find({_id : goal_type})       
		    .exec()
		    .then(data=>{
		    	// console.log(data[0].goal);
	            resolve(data[0].goal);
		    })
		    .catch(err =>{
	            reject(err);
		    });
    })
}
exports.report_goal = (req,res,next)=>{
    // router.get('/goal/:startDate/:endDate/:center_ID/:goal_type/:goal/:uidstatus/:projectCategoryType/:projectName',  ReportsNewController.report_goal);
    getData();
    async function getData(){
    var uidquery = "1";
    if(req.params.uidstatus === 'withUID'){
        uidquery = 	{
	                    $match : { 
	                                "listofBeneficiaries1.uidNumber" : {$ne : "-"}
	                            }
                	};
    }else if(req.params.uidstatus === 'withoutUID'){
        uidquery = {
	                    $match : { 
	                                "listofBeneficiaries1.uidNumber" : "-"
	                            }
	                };
    }else{
        uidquery = {
	                    $match:{
	                                "_id" : {$exists : true}
	                        	}
	                };
    }
    var goalselector  = {type_ID : ObjectID(req.params.goal_type)}
	var activityArray = [];
	var activityReportRecords = [];
		if(req.params.goal == 'all'){
			var goalNames = await getAllGoalNames(req.params.goal_type);
            goalNames = goalNames.map((data)=>{
                return data.goalName;
            })
            // console.log('goalNames================',goalNames);
			var goalData = [];
			if(goalNames.length > 0){
			    var totalTotal              = 0;
			    var totalLHWRF              = 0;
			    var totalNABARD             = 0;
			    var totalbankLoan           = 0;
			    var totaldirectCC           = 0;
			    var totalindirectCC         = 0;
			    var totalgovtscheme         = 0;
			    var totalother              = 0;
			    var totalReach              = 0;
			    var totalFamilyUpgradation  = 0;
				for(var i = 0; i < goalNames.length; i++){
					goalselector.goal = goalNames[i];
					// console.log('goalNames[i]==========',goalNames[i],i);
					// console.log('goalselector==========',i,goalselector);
					goalData = await getSectorMappingData(goalselector);
	                var activitydata = [];
	                if(goalData.length > 0){
	                    var flags = {};
	                    var uniqueSector_IDs = goalData.filter(function(entry) {
	                        if (flags[entry.sector_ID]) {
	                            return false;
	                        }
	                        flags[entry.sector_ID] = true;
	                        return true;
	                    });
	                    uniqueSector_IDs = uniqueSector_IDs.map((a, i)=>{
		                    return  a.sector_ID;
		                })
	                    var uniqueActivityArray = goalData.filter(function(entry) {
	                        if (flags[entry.activity_ID]) {
	                            return false;
	                        }
	                        flags[entry.activity_ID] = true;
	                        return true;
	                    });
	                    uniqueActivity_IDs = uniqueActivityArray.map((a, i)=>{
		                    return  a.activity_ID;
		                })
	                    var selector = {
	                        date        : {$gte : req.params.startDate, $lte : req.params.endDate},
	                        sector_ID   : {$in : uniqueSector_IDs},
	                        activity_ID : {$in : uniqueActivity_IDs},
	                    };
	                    if(req.params.center_ID !== 'all'){
	                        selector.center_ID = req.params.center_ID;
	                    }
	                    if(req.params.projectCategoryType !== 'all'){
	                        selector.projectCategoryType = req.params.projectCategoryType;
	                    }
	                    if(req.params.projectName !== 'all'){
	                        selector.projectName = req.params.projectName;
	                    }
	                    if(req.params.district !== 'all'){
	                        selector.district = req.params.district;
	                    }
						activityReportRecords[i] = await getActivityReport_Goal(goalData[0].goalType, goalselector.goal, selector, uidquery, req.params.startDate, req.params.endDate);
	                    // console.log('activityReportRecords[i]',activityReportRecords[i].length);
		  				activityArray.push(...activityReportRecords[i]);

	                }
				} //for loop
			    for (var j = 0; j < activityArray.length; j++) {
			        totalReach            += activityArray[j].reach            ?  (activityArray[j].reach) : 0;
			        totalFamilyUpgradation+= activityArray[j].familyUpgradation?  (activityArray[j].familyUpgradation) : 0;
			        totalTotal            += activityArray[j].total            ?  parseFloat(activityArray[j].total) : 0;
			        totalLHWRF            += activityArray[j].LHWRF            ?  parseFloat(activityArray[j].LHWRF) : 0;
			        totalNABARD           += activityArray[j].NABARD           ?  parseFloat(activityArray[j].NABARD) : 0;
			        totalbankLoan         += activityArray[j].bankLoan         ?  parseFloat(activityArray[j].bankLoan) : 0;
			        totaldirectCC         += activityArray[j].directCC         ?  parseFloat(activityArray[j].directCC) : 0;
			        totalindirectCC       += activityArray[j].indirectCC       ?  parseFloat(activityArray[j].indirectCC) : 0;
			        totalgovtscheme       += activityArray[j].govtscheme       ?  parseFloat(activityArray[j].govtscheme) : 0;
			        totalother            += activityArray[j].other            ?  parseFloat(activityArray[j].other) : 0;
		        }
	            if(j >= activityArray.length && activityArray.length > 0){
			        activityArray.push( 
			            {              
			                "projectCategoryType"    : "-",
			                "projectName"            : "-",
			                "sectorName"             : "<b>Total</b>",
			                "activityName"           : "-",
			                "subactivityName"        : "-",
							"center_ID"              : "-",
							"sector_ID"              : "-",
							"activity_ID"            : "-",
							"subactivity_ID"         : "-",
			                "unit"                   : "-",
			                "unitCost"               : "-",
			                "quantity"               : "-",
			                "total"                  : "<b>" + Number(totalTotal).toFixed(2)+"</b>",
			                "LHWRF"                  : "<b>" + Number(totalLHWRF).toFixed(2)+"</b>",
			                "NABARD"                 : "<b>" + Number(totalNABARD).toFixed(2)+"</b>",
			                "bankLoan"               : "<b>" + Number(totalbankLoan).toFixed(2)+"</b>",
			                "directCC"               : "<b>" + Number(totaldirectCC).toFixed(2)+"</b>",
			                "indirectCC"             : "<b>" + Number(totalindirectCC).toFixed(2)+"</b>",
			                "govtscheme"             : "<b>" + Number(totalgovtscheme).toFixed(2)+"</b>",
			                "other"                  : "<b>" + Number(totalother).toFixed(2)+"</b>",
			                "reach"                  : "<b>" + totalReach + "</b>",
			                "familyUpgradation"      : "<b>" + totalFamilyUpgradation + "</b>",
						    "goalType"               : "-",
						    "goalName"               : "-",
			            },           
			            {              
			                "projectCategoryType"    : "-",
			                "projectName"            : "-",
			                "sectorName"             : "<b>Total %</b>",
			                "activityName"           : "-",
			                "subactivityName"        : "-",
							"center_ID"              : "-",
							"sector_ID"              : "-",
							"activity_ID"            : "-",
							"subactivity_ID"         : "-",
			                "unit"                   : "-",
			                "unitCost"               : "-",
			                "quantity"               : "-",
			                "total"                  : totalTotal > 0      ? "<b>"+Number((totalTotal / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "LHWRF"                  : totalLHWRF > 0      ? "<b>"+Number((totalLHWRF / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "NABARD"                 : totalNABARD > 0     ? "<b>"+Number((totalNABARD / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "bankLoan"               : totalbankLoan > 0   ? "<b>"+Number((totalbankLoan / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "directCC"               : totaldirectCC > 0   ? "<b>"+Number((totaldirectCC / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "indirectCC"             : totalindirectCC > 0 ? "<b>"+Number((totalindirectCC / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "govtscheme"             : totalgovtscheme > 0 ? "<b>"+Number((totalgovtscheme / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "other"                  : totalother > 0      ? "<b>"+Number((totalother / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "reach"                  : "-",
			                "familyUpgradation"      : "-",
						    "goalType"               : "-",
						    "goalName"               : "-",
			            }
			        );
			    }
        		// console.log("activityArray==================",activityArray.length);

			}
	        res.status(200).json(activityArray);
			// console.log("activityArray*************",activityArray);
		}else{
			// console.log('req.params',req.params);
			var goalData = [];

			goalselector.goal = req.params.goal;
			// console.log('goalNames[i]==========',goalNames[i],i);
			// console.log('goalselector==========',i,goalselector);
			goalData = await getSectorMappingData(goalselector);
            var activitydata = [];
            if(goalData.length > 0){
                var flags = {};
                var uniqueSector_IDs = goalData.filter(function(entry) {
                    if (flags[entry.sector_ID]) {
                        return false;
                    }
                    flags[entry.sector_ID] = true;
                    return true;
                });
                uniqueSector_IDs = uniqueSector_IDs.map((a, i)=>{
                    return  a.sector_ID;
                })
                var uniqueActivityArray = goalData.filter(function(entry) {
                    if (flags[entry.activity_ID]) {
                        return false;
                    }
                    flags[entry.activity_ID] = true;
                    return true;
                });
                uniqueActivity_IDs = uniqueActivityArray.map((a, i)=>{
                    return  a.activity_ID;
                })
                var selector = {
                    date        : {$gte : req.params.startDate, $lte : req.params.endDate},
                    sector_ID   : {$in : uniqueSector_IDs},
                    activity_ID : {$in : uniqueActivity_IDs},
                };
                if(req.params.center_ID !== 'all'){
                    selector.center_ID = req.params.center_ID;
                }
                if(req.params.projectCategoryType !== 'all'){
                    selector.projectCategoryType = req.params.projectCategoryType;
                }
                if(req.params.projectName !== 'all'){
                    selector.projectName = req.params.projectName;
                }
                if(req.params.district !== 'all'){
                    selector.district = req.params.district;
                }
				activityReportRecords[i] = await getActivityReport_Goal(goalData[0].goalType, goalselector.goal, selector, uidquery, req.params.startDate, req.params.endDate);
                // console.log('activityReportRecords[i]',activityReportRecords[i].length);
  				activityArray.push(...activityReportRecords[i]);
			    
			    var totalTotal              = 0;
			    var totalLHWRF              = 0;
			    var totalNABARD             = 0;
			    var totalbankLoan           = 0;
			    var totaldirectCC           = 0;
			    var totalindirectCC         = 0;
			    var totalgovtscheme         = 0;
			    var totalother              = 0;
			    var totalReach              = 0;
			    var totalFamilyUpgradation  = 0;
			    for (var j = 0; j < activityArray.length; j++) {
			        totalReach            += activityArray[j].reach            ?  parseFloat(activityArray[j].reach) : 0;
			        totalFamilyUpgradation+= activityArray[j].familyUpgradation?  parseFloat(activityArray[j].familyUpgradation) : 0;
			        totalTotal            += activityArray[j].total            ?  parseFloat(activityArray[j].total) : 0;
			        totalLHWRF            += activityArray[j].LHWRF            ?  parseFloat(activityArray[j].LHWRF) : 0;
			        totalNABARD           += activityArray[j].NABARD           ?  parseFloat(activityArray[j].NABARD) : 0;
			        totalbankLoan         += activityArray[j].bankLoan         ?  parseFloat(activityArray[j].bankLoan) : 0;
			        totaldirectCC         += activityArray[j].directCC         ?  parseFloat(activityArray[j].directCC) : 0;
			        totalindirectCC       += activityArray[j].indirectCC       ?  parseFloat(activityArray[j].indirectCC) : 0;
			        totalgovtscheme       += activityArray[j].govtscheme       ?  parseFloat(activityArray[j].govtscheme) : 0;
			        totalother            += activityArray[j].other            ?  parseFloat(activityArray[j].other) : 0;
		        }
	            if(j >= activityArray.length && activityArray.length > 0){
			        activityArray.push( 
			            {              
			                "projectCategoryType"    : "-",
			                "projectName"            : "-",
			                "sectorName"             : "<b>Total</b>",
			                "activityName"           : "-",
			                "subactivityName"        : "-",
							"center_ID"              : "-",
							"sector_ID"              : "-",
							"activity_ID"            : "-",
							"subactivity_ID"         : "-",
			                "unit"                   : "-",
			                "unitCost"               : "-",
			                "quantity"               : "-",
			                "total"                  : "<b>" + Number(totalTotal).toFixed(2)+"</b>",
			                "LHWRF"                  : "<b>" + Number(totalLHWRF).toFixed(2)+"</b>",
			                "NABARD"                 : "<b>" + Number(totalNABARD).toFixed(2)+"</b>",
			                "bankLoan"               : "<b>" + Number(totalbankLoan).toFixed(2)+"</b>",
			                "directCC"               : "<b>" + Number(totaldirectCC).toFixed(2)+"</b>",
			                "indirectCC"             : "<b>" + Number(totalindirectCC).toFixed(2)+"</b>",
			                "govtscheme"             : "<b>" + Number(totalgovtscheme).toFixed(2)+"</b>",
			                "other"                  : "<b>" + Number(totalother).toFixed(2)+"</b>",
			                "reach"                  : "<b>" + totalReach + "</b>",
			                "familyUpgradation"      : "<b>" + totalFamilyUpgradation + "</b>",
						    "goalType"               : "-",
						    "goalName"               : "-",
			            },           
			            {              
			                "projectCategoryType"    : "-",
			                "projectName"            : "-",
			                "sectorName"             : "<b>Total %</b>",
			                "activityName"           : "-",
			                "subactivityName"        : "-",
							"center_ID"              : "-",
							"sector_ID"              : "-",
							"activity_ID"            : "-",
							"subactivity_ID"         : "-",
			                "unit"                   : "-",
			                "unitCost"               : "-",
			                "quantity"               : "-",
			                "total"                  : totalTotal > 0      ? "<b>"+Number((totalTotal / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "LHWRF"                  : totalLHWRF > 0      ? "<b>"+Number((totalLHWRF / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "NABARD"                 : totalNABARD > 0     ? "<b>"+Number((totalNABARD / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "bankLoan"               : totalbankLoan > 0   ? "<b>"+Number((totalbankLoan / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "directCC"               : totaldirectCC > 0   ? "<b>"+Number((totaldirectCC / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "indirectCC"             : totalindirectCC > 0 ? "<b>"+Number((totalindirectCC / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "govtscheme"             : totalgovtscheme > 0 ? "<b>"+Number((totalgovtscheme / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "other"                  : totalother > 0      ? "<b>"+Number((totalother / totalTotal)*100).toFixed(2) + "%"+ "</b>" : "<b>"+ 0 +"</b>",
			                "reach"                  : "-",
			                "familyUpgradation"      : "-",
						    "goalType"               : "-",
						    "goalName"               : "-",
			            }
			        );
			    }
            }
    		// console.log("activityArray==================",activityArray);    if(j >= activityArray.length && activityArray.length > 0){
			      
	        res.status(200).json(activityArray);
		}
	}
}
function getSectorMappingData(goalselector){
    return new Promise(function(resolve,reject){
		SectorMapping.aggregate([
	                                {
										$match : goalselector 
									},
	                                {
	                                    $lookup : {
	                                                    from            : "typeofgoals",
	                                                    localField      : "type_ID",
	                                                    foreignField    : "_id",
	                                                    as              : "goalType", 
	                                            }
	                                },
	                                { $unwind : "$goalType"},
	                                { $unwind : "$sector"  },
	                                {
	                                    $project : {
	                                        "goal"          : "$goal",
	                                        "type_ID"       : "$type_ID",
	                                        "goalType"      : "$goalType.typeofGoal",
	                                        "sector_ID"     : "$sector.sector_ID",
	                                        "sectorName"    : "$sector.sectorName",
	                                        "activity_ID"   : "$sector.activity_ID",
	                                        "activityName"  : "$sector.activityName",
	                                    }
	                                }
	                            ])
        .exec()
        .then(goalDatas=>{
        	resolve(goalDatas)
        	// console.log('goalDatas',goalDatas.length);
		})
		.catch(err=>{
			reject(err)
		});	       
	});
}
function getActivityReport_Goal(goalType, goalName, selector, uidquery,startDate, endDate){
	// console.log('goalType',goalType);
    return new Promise(function(resolve,reject){
		ActivityReport.aggregate([ 
		                {
		                    $match : selector 
		                },  
		                {
		                    $unwind : "$listofBeneficiaries"
		                },
		                {
		                    $lookup : {
		                            from          : "listofbeneficiaries",
		                            localField    : "listofBeneficiaries.beneficiary_ID",
		                            foreignField  : "_id",
		                            as            : "listofBeneficiaries1"
		                    }
		                },
		                {
		                    $unwind : "$listofBeneficiaries1"
		                },
		                uidquery,
						{
							$group : {
								"_id":    {
											"projectCategoryType"	: "$projectCategoryType",
											"projectName" 	  		: "$projectName",
											"sectorName" 		    : "$sectorName",
											"activityName" 		    : "$activityName",
											"subactivityName" 		: "$subactivityName",
											"center_ID"             : "$center_ID",
											"sector_ID"             : "$sector_ID",
											"activity_ID"           : "$activity_ID",
											"subactivity_ID"        : "$subactivity_ID",
											"unit" 					: "$unit",
											// "unitCost"				: "$unitCost",
										}, 
								"quantity" 		: { "$sum" : "$quantity" },
								"total"    		: { "$sum" : "$sourceofFund.total" },
								"LHWRF"    		: { "$sum" : "$sourceofFund.LHWRF" },
								"NABARD"   		: { "$sum" : "$sourceofFund.NABARD" },
								"bankLoan" 		: { "$sum" : "$sourceofFund.bankLoan" },
								"govtscheme" 	: { "$sum" : "$sourceofFund.govtscheme" },
								"directCC"      : { "$sum" : "$sourceofFund.directCC" },
								"indirectCC"    : { "$sum" : "$sourceofFund.indirectCC" },
								"other"    		: { "$sum" : "$sourceofFund.other" },
							}
						},
		                {
		                    $project: {
		                    	"_id"                    : 0,  
								"projectCategoryType"	: "$_id.projectCategoryType",
								"projectName" 	  		: "$_id.projectName",
								"sectorName" 		    : "$_id.sectorName",
								"activityName" 		    : "$_id.activityName",
								"subactivityName" 		: "$_id.subactivityName",
								"center_ID"             : "$_id.center_ID",
								"sector_ID"             : "$_id.sector_ID",
								"activity_ID"           : "$_id.activity_ID",
								"subactivity_ID"        : "$_id.subactivity_ID",
								"unit" 					: "$_id.unit",
								// "unitCost"				: "$_id.unitCost",  
								"quantity" 		        : 1,
								"total"    		        : 1,
								"LHWRF"    		        : 1,
								"NABARD"   		        : 1,
								"bankLoan" 		        : 1,
								"govtscheme" 	        : 1,
								"directCC"              : 1,
								"indirectCC"            : 1,
								"other"    		        : 1,              
		                    }
		                }
		            ])
		.exec()
		.then(data=>{
			getData();
			async function getData(){
				let date = {$gte : startDate, $lte : endDate};
			    var activitydata            = [];
			    for (var i = 0; i < data.length; i++) {
			    	// console.log("data============",data.length)  	    
					var benCounts = await getBeneficiaryCount({ 
																center_ID           : data[i].center_ID, 
																sector_ID           : data[i].sector_ID,
																activity_ID         : data[i].activity_ID,
																subactivity_ID      : data[i].subactivity_ID,
																projectCategoryType : data[i].projectCategoryType,
																projectName         : data[i].projectName,
																date                : date
					                                        })
					// console.log("benCounts.................",benCounts);
			        // totalReach            += benCounts.reachCount ? benCounts.reachCount : 0;
			        // totalFamilyUpgradation+= benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0
			        var activitydetails =  {              
			            "projectCategoryType"    : data[i].projectCategoryType,
			            "projectName"            : data[i].projectName,
			            "sectorName"             : data[i].sectorName,
			            "activityName"           : data[i].activityName,
			            "subactivityName"        : data[i].subactivityName,
						"center_ID"              : data[i].center_ID,
						"sector_ID"              : data[i].sector_ID,
						"activity_ID"            : data[i].activity_ID,
						"subactivity_ID"         : data[i].subactivity_ID,
			            "unit"                   : data[i].unit,
			            "unitCost"               : data[i].total            ? Number((data[i].total/data[i].quantity)/100000).toFixed(2) : 0,
			            "quantity"               : data[i].quantity,
			            "total"                  : data[i].total            ? Number(data[i].total/100000).toFixed(2) : 0,
			            "LHWRF"                  : data[i].LHWRF            ? Number(data[i].LHWRF/100000).toFixed(2) : 0,
			            "NABARD"                 : data[i].NABARD           ? Number(data[i].NABARD/100000).toFixed(2) : 0,
			            "bankLoan"               : data[i].bankLoan         ? Number(data[i].bankLoan/100000).toFixed(2) : 0,
			            "directCC"               : data[i].directCC         ? Number(data[i].directCC/100000).toFixed(2) : 0,
			            "indirectCC"             : data[i].indirectCC       ? Number(data[i].indirectCC/100000).toFixed(2) : 0,
			            "govtscheme"             : data[i].govtscheme       ? Number(data[i].govtscheme/100000).toFixed(2) : 0,
			            "other"                  : data[i].other            ? Number(data[i].other/100000).toFixed(2) : 0,
			            "reach"                  : benCounts.reachCount ? benCounts.reachCount : 0,
			        	"familyUpgradation"      : benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0,
			        }
			    	activitydata.push(activitydetails); 
					activitydata.forEach(function (element) {
						element.goalType = goalType;
						element.goalName = goalName;
					}); 
			        // console.log("activitydata",activitydata);
			    }			   
			    resolve(activitydata);
			}
		})
		.catch(err=>{
			reject(err)
		});	       
	});
}
exports.center_wise_Achievements = (req,res,next)=>{
	// console.log('activitywise_report req.params',req.params);
	// var startDate = new Date(req.params.startDate);
	// var endDate   = new Date(req.params.endDate);
	var selector = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
	Center.aggregate([
                        {
                            $match : { 
                                            _id: { $exists: true }
                                      } 
                        },
                        {
                            $project : {
                                "center_ID"             : "$_id",
                                "centerName"            : "$centerName",
                                // "_id"                   : 0,
                            }
                        }
					])
    .sort({"centerName":1})
	.exec()
    .then(data=>{
	    getCenterData();
	    async function getCenterData(){
	    	// console.log('data',data.length);
	        var centerData              = [];
	        var totalTotal              = 0;
	        var totalLHWRF              = 0;
	        var totalNABARD             = 0;
	        var totalbankLoan           = 0;
	        var totaldirectCC           = 0;
	        var totalindirectCC         = 0;
	        var totalgovtscheme         = 0;
	        var totalother              = 0;
	        var totalReach              = 0;
	        var totalFamilyUpgradation  = 0;
	    	for (var i = 0; i < data.length; i++) {
				var selector1 = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
				selector1.center_ID = data[i].center_ID.toString();
				var centerAchievements = await CenterAchievements_Report(selector1, selector)  
				var benCounts          = await getBeneficiaryCount(selector1)
				// console.log('centerAchievements',centerAchievements);  		
				// console.log('benCounts',benCounts);  
				var centerdetails =  {              
	                "reach"                  : benCounts.reachCount                ? (benCounts.reachCount) : 0,
	                "familyUpgradation"      : benCounts.upgradedfamilyCount       ? (benCounts.upgradedfamilyCount) : 0,
	                "center_ID"              : centerAchievements[0].center_ID     ? centerAchievements[0].center_ID    : data[i].center_ID,
	                "centerName"             : centerAchievements[0].centerName    ? centerAchievements[0].centerName    : data[i].centerName,
	                "total"                  : centerAchievements[0].total         ? Number(centerAchievements[0].total/100000).toFixed(2) : 0,
	                "LHWRF"                  : centerAchievements[0].LHWRF         ? Number(centerAchievements[0].LHWRF/100000).toFixed(2) : 0,
	                "NABARD"                 : centerAchievements[0].NABARD        ? Number(centerAchievements[0].NABARD/100000).toFixed(2) : 0,
	                "bankLoan"               : centerAchievements[0].bankLoan      ? Number(centerAchievements[0].bankLoan/100000).toFixed(2) : 0,
	                "directCC"               : centerAchievements[0].directCC      ? Number(centerAchievements[0].directCC/100000).toFixed(2) : 0,
	                "indirectCC"             : centerAchievements[0].indirectCC    ? Number(centerAchievements[0].indirectCC/100000).toFixed(2) : 0,
	                "govtscheme"             : centerAchievements[0].govtscheme    ? Number(centerAchievements[0].govtscheme/100000).toFixed(2) : 0,
	                "other"                  : centerAchievements[0].other         ? Number(centerAchievements[0].other/100000).toFixed(2) : 0,
	            }
	        	centerData.push(centerdetails);      
				// console.log('centerdetails',centerdetails);  
	    	}
	    	for (var j = 0; j < centerData.length; j++) {
	            totalReach            += centerData[j].reach             ? centerData[j].reach      : 0;
	            totalFamilyUpgradation+= centerData[j].familyUpgradation ? centerData[j].familyUpgradation      : 0;
	            totalTotal            += centerData[j].total             ? parseFloat(centerData[j].total)      : 0;
	            totalLHWRF            += centerData[j].LHWRF             ? parseFloat(centerData[j].LHWRF)      : 0;
	            totalNABARD           += centerData[j].NABARD            ? parseFloat(centerData[j].NABARD)     : 0;
	            totalbankLoan         += centerData[j].bankLoan          ? parseFloat(centerData[j].bankLoan)   : 0;
	            totaldirectCC         += centerData[j].directCC          ? parseFloat(centerData[j].directCC)   : 0;
	            totalindirectCC       += centerData[j].indirectCC        ? parseFloat(centerData[j].indirectCC) : 0;
	            totalgovtscheme       += centerData[j].govtscheme        ? parseFloat(centerData[j].govtscheme) : 0;
	            totalother            += centerData[j].other             ? parseFloat(centerData[j].other)      : 0;
			}
	        if(j >= centerData.length && centerData.length > 0){
	            centerData.push( 
		            {              
		                "center_ID" 	         : "-",
		                "centerName"             : "<b>Total</b>",
		                "total"                  : "<b>"+Number(totalTotal).toFixed(2)+"</b>",
		                "LHWRF"                  : "<b>"+Number(totalLHWRF).toFixed(2)+"</b>",
		                "NABARD"                 : "<b>"+Number(totalNABARD).toFixed(2)+"</b>",
		                "bankLoan"               : "<b>"+Number(totalbankLoan).toFixed(2)+"</b>",
		                "directCC"               : "<b>"+Number(totaldirectCC).toFixed(2)+"</b>",
		                "indirectCC"             : "<b>"+Number(totalindirectCC).toFixed(2)+"</b>",
		                "govtscheme"             : "<b>"+Number(totalgovtscheme).toFixed(2)+"</b>",
		                "other"                  : "<b>"+Number(totalother).toFixed(2)+"</b>",
		                "reach"                  : "<b>"+totalReach+"</b>",
		                "familyUpgradation"      : "<b>"+totalFamilyUpgradation+"</b>",
		            },           
		            {              
		                "center_ID"   			 : "-",
		                "centerName"             : "<b>Total %</b>",
		                "total"                  : totalTotal > 0      ? "<b>" + Number((totalTotal / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "LHWRF"                  : totalLHWRF > 0      ? "<b>" + Number((totalLHWRF / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "NABARD"                 : totalNABARD > 0     ? "<b>" + Number((totalNABARD / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "bankLoan"               : totalbankLoan > 0   ? "<b>" + Number((totalbankLoan / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "directCC"               : totaldirectCC > 0   ? "<b>" + Number((totaldirectCC / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "indirectCC"             : totalindirectCC > 0 ? "<b>" + Number((totalindirectCC / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "govtscheme"             : totalgovtscheme > 0 ? "<b>" + Number((totalgovtscheme / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "other"                  : totalother > 0      ? "<b>" + Number((totalother / totalTotal)*100).toFixed(2) + "%" + "</b>" : "<b>" +0 + "</b>",
		                "reach"                  : "",
		                "familyUpgradation"      : "",
		            }
	            );
	        }
        	res.status(200).json(centerData);
	    }
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};
function CenterAchievements_Report(selector1,selector){
	// console.log('selector1',selector1);
    return new Promise(function(resolve,reject){
		ActivityReport.aggregate([ 
									{
										$match : selector1 
									},
									{
										$group : {
											"_id":  {
														"center_ID" 		    : "$center_ID",
														"centerName"	     	: "$centerName",
													}, 
											"total"    		: { "$sum" : "$sourceofFund.total" },
											"LHWRF"    		: { "$sum" : "$sourceofFund.LHWRF" },
											"NABARD"   		: { "$sum" : "$sourceofFund.NABARD" },
											"bankLoan" 		: { "$sum" : "$sourceofFund.bankLoan" },
											"govtscheme" 	: { "$sum" : "$sourceofFund.govtscheme" },
											"directCC"      : { "$sum" : "$sourceofFund.directCC" },
											"indirectCC"    : { "$sum" : "$sourceofFund.indirectCC" },
											"other"    		: { "$sum" : "$sourceofFund.other" },
										}
									},
	                                {
	                                    $project: {
											"center_ID"           	: "$_id.center_ID",
											"centerName" 	  		: "$_id.centerName",
											"total"    		        : 1,
											"LHWRF"    		        : 1,
											"NABARD"   		        : 1,
											"bankLoan" 		        : 1,
											"govtscheme" 	        : 1,
											"directCC"              : 1,
											"indirectCC"            : 1,
											"other"    		        : 1,              
	                                    	"_id"                   : 0,  
	                                    }
	                                }
		])
	    .exec()
	    .then(data=>{
		    getData();
		    async function getData(){
		    	// console.log("data=====",data)
                if(data && data.length > 0){
                    resolve(data);
                }else{
                    resolve([{
								"center_ID"           	: "",
								"centerName" 	  		: "",
								"total"    		        : 0,
								"LHWRF"    		        : 0,
								"NABARD"   		        : 0,
								"bankLoan" 		        : 0,
								"govtscheme" 	        : 0,
								"directCC"              : 0,
								"indirectCC"            : 0,
								"other"    		        : 0,              
	                        }]);
                }
		        resolve(data);
		    }
	    })
	    .catch(err=>{
            reject(err);
	    });    
    });
};
exports.plan_vs_Achievement_Physical = (req,res,next)=>{
	// console.log('activitywise_report req.params',req.params);
    // var startDate = req.params.startDate;
    // var endDate   = req.params.endDate;
	var selector = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
	Sectors.aggregate([
                {
                    $project : {
                                "sector_ID"             : "$_id",
                                "sector"                : "$sector",
                            }
                }
            ])
    .exec()
    .then(data=>{
	    getData();
	    async function getData(){
	    	var centerData = [];
	    	// console.log('data',data);
			var selector1 = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
	    	if(req.params.center_ID !== 'all'){
				selector1.center_ID = req.params.center_ID;
			}
			var selector2 = {"startDate": {$gte : req.params.startDate, $lte : req.params.endDate}, "endDate": {$gte : req.params.startDate, $lte : req.params.endDate}};
			if(req.params.center_ID !== 'all'){
				selector2.center_ID = req.params.center_ID;
			}
	        // console.log("activitydata",activitydata)
	        for (var i = 0; i < data.length; i++) {
				selector1.sector_ID = (data[i].sector_ID);
				selector2.sector_ID = (data[i].sector_ID).toString();
				var benCounts       = await getBeneficiaryCount(selector1)
        		// console.log("selector2",selector2)
        		var plandata        = await monthlyPlan_Physical(selector2);
                var totalplan_reach      		 = 0;
                var totalplan_upgradation		 = 0;
                var totalachievement_reach       = 0;
            	var totalachievement_upgradation = 0;
        		for (var j = 0; j < plandata.length; j++) {
					// console.log("plandata.................",plandata);
            		var centerdetails =  {       
            			"sector"		         : data[i].sector,       
	                    "sectorName"      		 : plandata[j].sectorName,
	                    "plan_reach"      		 : plandata[j].noOfBeneficiaries ? (plandata[j].noOfBeneficiaries) : 0,
	                    "plan_upgradation"		 : plandata[j].noOfFamilies      ? (plandata[j].noOfFamilies) : 0,
		                "achievement_reach"      : benCounts.reachCount          ? benCounts.reachCount : 0,
		            	"achievement_upgradation": benCounts.upgradedfamilyCount ? benCounts.upgradedfamilyCount : 0,
		            }
        			centerData.push(centerdetails);      
		        }
		    	for (var j = 0; j < centerData.length; j++) {     
                    totalplan_reach      		 += centerData[j].plan_reach                ? (centerData[j].plan_reach) : 0;
                    totalplan_upgradation		 += centerData[j].plan_upgradation          ? (centerData[j].plan_upgradation) : 0;
	                totalachievement_reach       += centerData[j].achievement_reach         ? (centerData[j].achievement_reach) : 0;
	            	totalachievement_upgradation += centerData[j].achievement_upgradation   ? (centerData[j].achievement_upgradation) : 0;
				}
	        }
	        if(i >= centerData.length && centerData.length > 0){
	            centerData.push( 
		            {                
	        			"sector"		         : "<b>Total</b>",       
	                    "sectorName"      		 : "<b>Total</b>",       
						"plan_reach"      		 : "<b>"+totalplan_reach+"</b>",
						"plan_upgradation"		 : "<b>"+totalplan_upgradation+"</b>",
						"achievement_reach"      : "<b>"+totalachievement_reach+"</b>",
						"achievement_upgradation": "<b>"+totalachievement_upgradation+"</b>",
		            }
	            );
	        }
	        // console.log('centerData',centerData);
	        res.status(200).json(centerData);
		}
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};
function monthlyPlan_Physical(searchQuery){
    // console.log('searchQuery****************',searchQuery);
    return new Promise(function(resolve,reject){
        MonthlyPlan.aggregate([
                                {
                                    $match : searchQuery
                                },
                                {
                                    $group : 
                                            {
												"_id":   {
													"sector_ID"  	: "$sector_ID",
													"sectorName"    : "$sectorName",
												}, 
                                                "noOfBeneficiaries" : { "$sum" : "$noOfBeneficiaries" },
                                                "noOfFamilies"      : { "$sum" : "$noOfFamilies" },
                                            }
                                },
                                {
                                    $project: {
                                        "sector_ID"              : "$_id.sector_ID",
                                        "sectorName"             : "$_id.sectorName",
                                        "noOfBeneficiaries"      : 1,
                                        "noOfFamilies"           : 1,
                                        "_id"					 : 0,
                                    }
                                }
                    ])
                    .exec()
                    .then(data=>{
                        // console.log('monthlyPlandata',data);
                        if(data && data.length > 0){
                            resolve(data);
                        }else{
                            resolve([{
                                    "noOfBeneficiaries"      : 0,
                                    "noOfFamilies"           : 0,
                                    "sector_ID"              : "",
                                    "sectorName"             : ""
                                }]);
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};
exports.plan_vs_Achivement_Financial = (req,res,next)=>{
	// console.log("req.params",req.params);
    getData();
    async function getData(){
        var dataReturn   = [];
        var activitydata = [];
        var plandata = [];
	    var startDate = req.params.startDate;
	    var endDate   = req.params.endDate;
		var selector1 = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
		if(req.params.center_ID !== 'all'){
			selector1.center_ID = req.params.center_ID;
		}
		var selector2 = {"startDate": {$gte : req.params.startDate, $lte : req.params.endDate}, "endDate": {$gte : req.params.startDate, $lte : req.params.endDate}};
		if(req.params.center_ID !== 'all'){
			selector2.center_ID = req.params.center_ID;
		}
		var achievement_TotalBudget   = 0;
		var achievement_LHWRF         = 0;
		var achievement_NABARD        = 0;
		var achievement_Bank_Loan     = 0;
		var achievement_DirectCC      = 0;
		var achievement_IndirectCC    = 0;
		var achievement_Govt          = 0;
		var achievement_Other         = 0;
		var plan_TotalBudget          = 0;
		var plan_LHWRF                = 0;
		var plan_NABARD               = 0;
		var plan_Bank_Loan            = 0;
		var plan_DirectCC             = 0;
		var plan_IndirectCC           = 0;
		var plan_Govt                 = 0;
		var plan_Other                = 0;
        var activitydata = await activityReport(selector1);
        var plandata     = await monthlyPlan_Financial(selector2);
    
        // console.log("activitydata",activitydata)
        // console.log("plandata",plandata)
        for (var i = 0; i < activitydata.length; i++) {
            achievement_TotalBudget   += activitydata[i].total       ? (activitydata[i].total)       :0;                     
            achievement_LHWRF         += activitydata[i].LHWRF       ? (activitydata[i].LHWRF)       :0;         
            achievement_NABARD        += activitydata[i].NABARD      ? (activitydata[i].NABARD)      :0;           
            achievement_Bank_Loan     += activitydata[i].bankLoan    ? (activitydata[i].bankLoan)    :0;                 
            achievement_Govt          += activitydata[i].govtscheme  ? (activitydata[i].govtscheme)  :0;       
            achievement_DirectCC      += activitydata[i].directCC    ? (activitydata[i].directCC)    :0;               
            achievement_IndirectCC    += activitydata[i].indirectCC  ? (activitydata[i].indirectCC)  :0;                   
            achievement_Other         += activitydata[i].other       ? (activitydata[i].other)       :0;         
        // console.log("achievement_TotalBudget",achievement_TotalBudget)
        }
        for (var j = 0; j < plandata.length; j++) {
            plan_TotalBudget   += plandata[j].TotalBudget ? (plandata[j].TotalBudget)  :0;                     
            plan_LHWRF         += plandata[j].LHWRF       ? (plandata[j].LHWRF)        :0;         
            plan_NABARD        += plandata[j].NABARD      ? (plandata[j].NABARD)       :0;           
            plan_Bank_Loan     += plandata[j].Bank_Loan   ? (plandata[j].Bank_Loan)    :0;                 
            plan_DirectCC      += plandata[j].DirectCC    ? (plandata[j].DirectCC)     :0;               
            plan_IndirectCC    += plandata[j].IndirectCC  ? (plandata[j].IndirectCC)   :0;                   
            plan_Govt          += plandata[j].Govt        ? (plandata[j].Govt)         :0;       
            plan_Other         += plandata[j].Other       ? (plandata[j].Other)        :0;         
        // console.log("plan_TotalBudget",plan_TotalBudget)
        }
        // console.log("activitydata",activitydata)
        // console.log("plandata",plandata)
        if(i >= activitydata.length && activitydata.length > 0 && j >= plandata.length && plandata.length > 0){
        	dataReturn.push(
                {
                    "source"             : "LHWRF",
                    "plan"      		 : plan_LHWRF ? Number(plan_LHWRF).toFixed(2) : 0,
                    "achievement"        : achievement_LHWRF ? Number(achievement_LHWRF).toFixed(2) : 0,
                },
                {
                    "source"             : "NABARD",
                    "plan"      		 : plan_NABARD ? Number(plan_NABARD).toFixed(2) : 0,
                    "achievement"        : achievement_NABARD ? Number(achievement_NABARD).toFixed(2) : 0,
                },
                {
                    "source"             : "Bank Loan",
                    "plan"      		 : plan_Bank_Loan ? Number(plan_Bank_Loan).toFixed(2) : 0,
                    "achievement"        : achievement_Bank_Loan ? Number(achievement_Bank_Loan).toFixed(2) : 0,
                },
                {
                    "source"             : "DirectCC",
                    "plan"      		 : plan_DirectCC ? Number(plan_DirectCC).toFixed(2) : 0,
                    "achievement"        : achievement_DirectCC ? Number(achievement_DirectCC).toFixed(2) : 0,
                },
                {
                    "source"             : "IndirectCC",
                    "plan"      		 : plan_IndirectCC ? Number(plan_IndirectCC).toFixed(2) : 0,
                    "achievement"        : achievement_IndirectCC ? Number(achievement_IndirectCC).toFixed(2) : 0,
                },
                {
                    "source"             : "Govt.",
                    "plan"      		 : plan_Govt ? Number(plan_Govt).toFixed(2) : 0,
                    "achievement"        : achievement_Govt ? Number(achievement_Govt).toFixed(2) : 0,
                },
                {
                    "source"             : "Others",
                    "plan"      		 : plan_Other ? Number(plan_Other).toFixed(2) : 0,
                    "achievement"        : achievement_Other ? Number(achievement_Other).toFixed(2) : 0,
                },
                {
                    "source"             : "<b>Total</b>",
                    "plan"      		 : plan_TotalBudget ? "<b>"+Number(plan_TotalBudget).toFixed(2)+"</b>" : "<b>"+0+"</b>",
                    "planTotal"          : plan_TotalBudget ? Number(plan_TotalBudget).toFixed(2)  : 0,
                    "achievement"        : achievement_TotalBudget ? "<b>"+Number(achievement_TotalBudget).toFixed(2)+"</b>" : "<b>"+0+"</b>",
                }
            )
        }
        // console.log("dataReturn",dataReturn)
        res.status(200).json(dataReturn);
    }
};
function monthlyPlan_Financial(searchQuery){
    // console.log('searchQuery****************',searchQuery);
    return new Promise(function(resolve,reject){
        MonthlyPlan.aggregate([
                                {
                                    $match : searchQuery
                                },
                                {
                                    $group : 
                                            {
												"_id":   {
													"center_ID"  	: "$center_ID",
													"center"    : "$center",
												}, 
                                                "noOfBeneficiaries" : { "$sum" : "$noOfBeneficiaries" },
                                                "noOfFamilies"      : { "$sum" : "$noOfFamilies" },
                                                "TotalBudget"       : { "$sum" : "$totalBudget" },
                                                "LHWRF"             : { "$sum" : "$LHWRF" },
                                                "NABARD"            : { "$sum" : "$NABARD" },
                                                "Bank_Loan"         : { "$sum" : "$bankLoan" },
                                                "IndirectCC"        : { "$sum" : "$indirectCC"},
                                                "DirectCC"          : { "$sum" : "$directCC"},
                                                "Govt"              : { "$sum" : "$govtscheme"},
                                                "Other"             : { "$sum" : "$other"},
                                            }
                                },
                                {
                                    $project: {
                                        "center_ID"              : "$_id.center_ID",
                                        "center"                 : "$_id.center",
                                        "noOfBeneficiaries"      : 1,
                                        "noOfFamilies"           : 1,
                                        "TotalBudget"            : 1,
                                        "LHWRF"                  : 1,
                                        "NABARD"                 : 1,
                                        "Bank_Loan"              : 1,
                                        "DirectCC"               : 1,
                                        "IndirectCC"             : 1,
                                        "Govt"                   : 1,
                                        "Other"                  : 1,
                                        "_id"					 : 0,
                                    }
                                }
                    ])
                    .exec()
                    .then(data=>{
                        var returnData = [];
                        // console.log('monthlyPlandata',data);
                        for(k = 0 ; k < data.length; k++){
                            returnData.push({
                                "noOfBeneficiaries"      : data[k].noOfBeneficiaries    ? (data[k].noOfBeneficiaries/100000)                            : 0,
                                "noOfFamilies"           : data[k].noOfFamilies         ? (data[k].noOfFamilies/100000)                                 : 0,
                                "TotalBudget"            : data[k].TotalBudget          ? (data[k].TotalBudget/100000)                                  : 0,
                                "LHWRF"                  : data[k].LHWRF                ? (data[k].LHWRF/100000)                                        : 0,
                                "NABARD"                 : data[k].NABARD               ? (data[k].NABARD/100000)                                       : 0,
                                "Bank_Loan"              : data[k].Bank_Loan            ? (data[k].Bank_Loan/100000)                                    : 0,
                                "DirectCC"               : data[k].DirectCC             ? (data[k].DirectCC/100000)                                     : 0,
                                "IndirectCC"             : data[k].IndirectCC           ? (data[k].IndirectCC/100000)                                   : 0,
                                "Govt"                   : data[k].Govt                 ? (data[k].Govt/100000)                                         : 0,
                                "Other"                  : data[k].Other                ? (data[k].Other/100000)                                        : 0,
                                "Total"                  : data[k].Total                ? (data[k].Total/100000)                                        : 0, 
                                "center_ID"              : data[k].center_ID,
                                "center"                 : data[k].center
                            });
                        }
                        if(k >= data.length && returnData.length > 0){
                            resolve(returnData);
                        }else{
                            resolve([{
                                "noOfBeneficiaries"      : 0,
                                "noOfFamilies"           : 0,
                                "TotalBudget"            : 0,
                                "LHWRF"                  : 0,
                                "NABARD"                 : 0,
                                "Bank_Loan"              : 0,
                                "DirectCC"               : 0,
                                "IndirectCC"             : 0,
                                "Govt"                   : 0,
                                "Other"                  : 0,
                                "center_ID"              : "",
                                "center"                 : ""
                            }]);
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};
function activityReport(searchQuery){
	// console.log('searchQuery',searchQuery);
    return new Promise(function(resolve,reject){
		ActivityReport.aggregate([ 
									{
										$match : searchQuery 
									},
									{
										$group : {
											"_id":  {
														"center_ID" 		    : "$center_ID",
														"centerName"	     	: "$centerName",
													}, 
											"total"    		: { "$sum" : "$sourceofFund.total" },
											"LHWRF"    		: { "$sum" : "$sourceofFund.LHWRF" },
											"NABARD"   		: { "$sum" : "$sourceofFund.NABARD" },
											"bankLoan" 		: { "$sum" : "$sourceofFund.bankLoan" },
											"govtscheme" 	: { "$sum" : "$sourceofFund.govtscheme" },
											"directCC"      : { "$sum" : "$sourceofFund.directCC" },
											"indirectCC"    : { "$sum" : "$sourceofFund.indirectCC" },
											"other"    		: { "$sum" : "$sourceofFund.other" },
										}
									},
	                                {
	                                    $project: {
											"center_ID"           	: "$_id.center_ID",
											"centerName" 	  		: "$_id.centerName",
											"total"    		        : 1,
											"LHWRF"    		        : 1,
											"NABARD"   		        : 1,
											"bankLoan" 		        : 1,
											"govtscheme" 	        : 1,
											"directCC"              : 1,
											"indirectCC"            : 1,
											"other"    		        : 1,              
	                                    	"_id"                   : 0,  
	                                    }
	                                }
						])
                        .exec()
                        .then(data=>{   
                        	// console.log('dataaaa',data);
                            getAsyncData();
                            async function  getAsyncData(){
                                var returnData = [];
                                var k = 0;
                                for(k = 0 ; k < data.length; k++){
                                    returnData.push({
                                        "center_ID"              : data[k].center_ID,
                                        "centerName"             : data[k].centerName,
                                        "total"                  : data[k].total                ? (data[k].total/100000)                 : 0, 
                                        "LHWRF"                  : data[k].LHWRF                ? (data[k].LHWRF/100000)                 : 0,
                                        "NABARD"                 : data[k].NABARD               ? (data[k].NABARD/100000)                : 0,
                                        "bankLoan"               : data[k].bankLoan             ? (data[k].bankLoan/100000)              : 0,
                                        "govtscheme"             : data[k].govtscheme           ? (data[k].govtscheme/100000)            : 0,
                                        "directCC"               : data[k].directCC             ? (data[k].directCC/100000)              : 0,
                                        "indirectCC"             : data[k].indirectCC           ? (data[k].indirectCC/100000)            : 0,
                                        "other"                  : data[k].other                ? (data[k].other/100000)                 : 0,
                                    });
                                }

                                if(k >= data.length && returnData.length > 0){
                                    resolve(returnData);
                                }else{
                                    resolve([{
                                        "center_ID"              : "",
                                        "centerName"             : "",
                                        "total"                  : 0,
                                        "LHWRF"                  : 0,
                                        "NABARD"                 : 0,
                                        "bankLoan"               : 0,
                                        "govtscheme"             : 0,
                                        "directCC"               : 0,
                                        "indirectCC"             : 0,
                                        "other"                  : 0,
                                    }]);
                                }
                                // console.log('returnDataaaaaaa',returnData);
                            }
                        })
                        .catch(err =>{
                            console.log(err);
                            reject(err);
                        });
    });
};
exports.cumulative_Data = (req,res,next)=>{
	// console.log('activitywise_report req.params',req.params);
	var startDate = new Date(req.params.startDate);
	var endDate   = new Date(req.params.endDate);
	var selector = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
	Center.aggregate([
                        {
                            $match : { 
                                            _id: { $exists: true }
                                      } 
                        },
                        {
                            $project : {
                                "center_ID"             : "$_id",
                                "centerName"            : "$centerName",
                                // "_id"                   : 0,
                            }
                        }
					])
    .sort({"centerName":1})
	.exec()
    .then(data=>{
	    getCenterData();
	    async function getCenterData(){
	    	// console.log('data',data.length);
	        var cumulativeData          = [];
	        var centerData              = [];
	        var totalTotal              = 0;
	        var totalupgradedBenCount   = 0;
	        var totalReach              = 0;
	        var totalFamilyUpgradation  = 0;
	    	for (var i = 0; i < data.length; i++) {
				var selector1 = {"date": {$gte : req.params.startDate, $lte : req.params.endDate} };
				selector1.center_ID = data[i].center_ID.toString();
				var centerAchievements = await CenterAchievements_Report(selector1, selector)  
				var benCounts          = await getBeneficiaryCount(selector1)
				// console.log('centerAchievements',centerAchievements);  		
				// console.log('benCounts',benCounts);  
				var centerdetails =  {              
	                "upgradedBeneficiaryCount"  : benCounts.upgradedBeneficiaryCount  ? (benCounts.upgradedBeneficiaryCount) : 0,
	                "reach"                     : benCounts.reachCount                ? (benCounts.reachCount) : 0,
	                "familyUpgradation"         : benCounts.upgradedfamilyCount       ? (benCounts.upgradedfamilyCount) : 0,
	                "total"                     : centerAchievements[0].total         ? (centerAchievements[0].total)   : 0,
	            }
	        	centerData.push(centerdetails);      
	    	}
	    	for (var j = 0; j < centerData.length; j++) {
	            totalupgradedBenCount += centerData[j].upgradedBeneficiaryCount  ? centerData[j].upgradedBeneficiaryCount      : 0;
	            totalReach            += centerData[j].reach                     ? centerData[j].reach      : 0;
	            totalFamilyUpgradation+= centerData[j].familyUpgradation         ? centerData[j].familyUpgradation      : 0;
	            totalTotal            += centerData[j].total                     ? (centerData[j].total/100000)      : 0;
			}
	        if(j >= centerData.length && centerData.length > 0){
	            cumulativeData.push( 
		            {              
		                "total"                  : Number(totalTotal).toFixed(2),
		                "reach"                  : totalReach,
		                "familyUpgradation"      : totalFamilyUpgradation,
		                "upgradedBenCount"       : totalupgradedBenCount,
		            }
	            );
	        }
	        // console.log('cumulativeData',cumulativeData);
        	res.status(200).json(cumulativeData);
	    }
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};