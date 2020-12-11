const mongoose          = require("mongoose");
const globalVariable    = require("../../../nodemon.js");
var request             = require('request-promise');
const ObjectID          = require('mongodb').ObjectID;
var moment              = require('moment');
const AnnualPlan        = require('../models/annualPlans.js');
const ActivityReport    = require('../models/activityReport.js');
const Sectors           = require('../models/sectors.js');
const MonthlyPlan       = require('../models//monthlyPlans.js');
const Center            = require('../models/centers.js');
const Families          = require('../models/families.js');
const SectorMapping     = require('../models/sectorMappings.js');
const ProjectMapping    = require('../models/projectMappings.js');

function derive_year_month(dateData){
    var startYear = moment(dateData.startDate).format("YYYY");
    var endYear   = moment(dateData.endDate).format("YYYY");
    var startMonth = moment(dateData.startDate).format("MM");
    var endMonth = moment(dateData.endDate).format("MM");
    var monthList = [];
    var yearList = [];
    var tempDate = dateData.startDate;
    if(startYear == endYear){
        if(startMonth >= 4 && endMonth <=12){
            var year = 'FY ' + (startYear) + ' - ' + (parseInt(startYear)+1);
        }else{
            var year = 'FY ' + (startYear-1) + ' - ' + (startYear);
        }
        for(m = startMonth; m <= endMonth; m++ ){
            monthList.push(moment('0'+m).format("MMMM"));
        }
        yearList.push(startYear);
    }else{
        yearList.push(startYear);
        yearList.push(endYear);
        var year = 'FY ' + (startYear) + ' - ' + (endYear);
        var stDate = new Date(dateData.startDate);
        var endDate = new Date(dateData.endDate);
        var m1 = stDate.getMonth() + 1;
        var m2 = endDate.getMonth() + 1;
        var m3 =0;  
        if(m2<m1) {
            m3 = 12;
        }else{
            m3 = m2;
        }
        for(let m=m1; m <= m3; m++ ){
            if(m < 10){
                m = '0'+m;
            }else{
                m = String(m);
            }
            monthList.push(moment(m).format("MMMM"));
        }
        for(let m=1; m<=m2;m++){
            monthList.push(moment('0'+m).format("MMMM"));    
        }
    }
    if(yearList.length > 0 && monthList.length > 0){
        return {
                    "year"          : year,
                    "yearList"      : yearList,
                    "monthList"     : monthList
                };
    }
};
function getCenterName(center_ID){
    return new Promise(function(resolve,reject){
        Center.findOne({"_id":ObjectID(center_ID)})
                    .exec()
                    .then(data=>{
                        if(data){
                            resolve(data.centerName);
                        }else{
                            resolve("-");
                        }
                    })
                    .catch(err=>{
                        reject(err);
                    });
    }); 
};
//Admin Dashboard
exports.report_center= (req,res,next)=>{ 
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    AnnualPlan.aggregate([
                            {
                                $match : {
                                            "year" : deriveDate.year
                                        }
                            },
                            {
                                $group : {
                                                "_id"           : "$center_ID",
                                                "totalBuget"    : {"$sum":"$totalBudget"}
                                          }
                            }
                        ])
                .exec()
                .then(data=>{
                    // console.log('report_center_data',data);
                    if(data.length > 0){
                        getData();
                        async function getData(){
                            var returnData = [];
                            var j = 0;
                            for(j = 0 ; j < data.length; j++){
                                if(data[j].totalBuget > 0){
                                    returnData.push({
                                                        "_id"                       : data[j]._id,
                                                        "name"                      : await getCenterName(data[j]._id),
                                                        "annualPlan_TotalBudget"    : data[j].totalBuget,
                                                        "annualPlan_TotalBudget_L"  : (data[j].totalBuget / 100000),
                                                    });
                                }
                            }
                            if(j >= data.length){
                                res.status(200).json(returnData);
                            }
                        }
                    }else{
                       res.status(200).json([]); 
                    }
                })
                .catch(err=>{
                    res.status(404).json(err);
                });
};
exports.report_sector= (req,res,next)=>{ 
    // console.log("In report_sector",req.params);
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    AnnualPlan.aggregate([
                            {
                                $match : {
                                            "year" : deriveDate.year
                                        }
                            },
                            {
                                $group : {
                                                "_id"                       : "$sector_ID",
                                                "name"                      : { "$first" : "$sectorName"},
                                                "annualPlan_TotalBudget"    : { "$sum" : "$totalBudget" },
                                          }
                            },
                            {
                                $project : {
                                                "_id"                       : 1,
                                                "name"                      : 1,
                                                "annualPlan_TotalBudget"    : 1,
                                                // "annualPlan_TotalBudget_L"  : { "$concat": [ { "$divide" : ["$annualPlan_TotalBudget",100000] }, "L" ] }
                                            }
                            },
                            {
                                $lookup : {
                                        from          : "sectors",
                                        localField    : "name",
                                        foreignField  : "sector",
                                        as            : "sectorDetails"
                                }
                            },
                            {
                               $unwind : "$sectorDetails" 
                            },
                            {
                                $project : {
                                                "_id" : 1,
                                                "name"                      : 1,
                                                "annualPlan_TotalBudget"    : 1,
                                                "sectorShortName"           : "$sectorDetails.sectorShortName"
                                            }
                            }
                        ])
                .exec()
                    .then(data=>{
                        // res.status(200).json(data);
                        var returnData = [];
                        var  j = 0;
                        for( j = 0 ; j < data.length ; j++){
                            returnData.push({
                                "_id"                       : data[j]._id,
                                "name"                      : data[j].name,
                                "sectorShortName"           : data[j].sectorShortName,
                                "annualPlan_TotalBudget"    : data[j].annualPlan_TotalBudget,
                                "annualPlan_TotalBudget_L"  : (data[j].annualPlan_TotalBudget / 100000),
                            });
                        }
                        if(j >= data.length){
                            res.status(200).json(returnData);
                        }
                    })
                    .catch(err=>{
                        res.status(404).json(err);
                    });
};
function fetchSectorDetails(sector_ID){
    return new Promise(function(resolve,reject){
        Sectors.findOne({"_id" : ObjectID(sector_ID)})
               .exec()
               .then(data=>{
                    resolve(data)
               })
               .catch(err=>{
                        reject(err);
                    });
    }); 
};
function getBeneficiariesCount(searchQuery,uidStatus){
    var query = "1";
    if(uidStatus === 'withUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : ""
                            }
                };
    }else if(uidStatus === 'withoutUID'){
        query = {
                    $match : { 
                                "listofBeneficiaries.uidNumber" : {$ne : ""}
                            }
                };
    }else{
        query = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }
    if(uidStatus != "1"){
        return new Promise(function(resolve,reject){
            ActivityReport.aggregate(
                                        [
                                            searchQuery,
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
                                            {
                                                $project : {
                                                                "listofBeneficiaries.beneficiary_ID"   : 1,
                                                                "listofBeneficiaries.family_ID"        : 1,
                                                                "listofBeneficiaries.uidNumber"        : "$listofBeneficiaries1.uidNumber",
                                                                "listofBeneficiaries.isUpgraded"       : 1,
                                                            }
                                            },
                                            query,
                                            {
                                                $group : {
                                                            "_id"                   : null,
                                                            "listofBeneficiaries"   : { $push:  "$listofBeneficiaries" },
                                                            "upGrade"               : { "$push" : { "$cond" : [ {"$eq" : ["$listofBeneficiaries.isUpgraded" , "Yes"] },"$listofBeneficiaries",null ] } },
                                                        }
                                            },
                                            {
                                                $project : {
                                                    "listofBeneficiaries"   : { "$setUnion" : [ "$listofBeneficiaries.family_ID", "$listofBeneficiaries.family_ID" ] },
                                                    "upGrade"               : 1,
                                                    "Reach"                 : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                }
                                            },
                                            //get count of FamilyUpgradation
                                            {
                                                $project : {
                                                    "listofBeneficiaries"   : 1,
                                                    // "upGrade"               : { $filter : { input : "$listofBeneficiaries", as : "beneficiaries", cond : { $ne : ["$$beneficiaries" , null] } } },
                                                    // "upGrade"               : { "$setDifference" :[ "$upGrade" , [null] ] },
                                                    "upGrade"               : { "$setUnion" : [ "$upGrade.family_ID", "$upGrade.family_ID" ] },
                                                    "Reach"                 : 1,
                                                }
                                            },
                                            {
                                                $project : {
                                                    "Reach"                 : 1,
                                                    "upGrade"               : 1,
                                                    "FamilyUpgradation"     : { $cond: { if: { $isArray: "$listofBeneficiaries" }, then: { $size: "$listofBeneficiaries" }, else: 0} },
                                                    "FamilyUpgradation1"    : { $cond: { if: { $isArray: "$upGrade" }, then: { $size: "$upGrade" }, else: 0} },
                                                }
                                            },
                                        ]
                            )
                            .exec()
                            .then(data=>{
                                resolve({
                                    "Reach"             : data.length && data[0] && data[0].Reach              ? parseInt(data[0].Reach) : 0,
                                    "FamilyUpgradation" : data.length && data[0] && data[0].FamilyUpgradation1 ? parseInt(data[0].FamilyUpgradation1) : 0,
                                })
                            })
                            .catch(err =>{
                                console.log(err);
                                reject(err);
                            });
        });
    }
};
exports.sector_familyupgrade_outreach_count = (req,res,next)=>{
    var query = "1";

    if(req.params.center_ID != "all"){
        query = {
                    "center_ID"         : String(req.params.center_ID),
                    "date"              : {$gte : req.params.startDate, $lte : req.params.endDate},
                };
    }else{
        query = {
                    "date"              : {$gte : req.params.startDate, $lte : req.params.endDate},
                };
    }
    if(query != "1"){
        Sectors.aggregate([
                        {
                            $project : {
                                "sector_ID"         : "$_id",
                                "sectorName"        : "$sector",
                                "sectorShortName"   : "$sectorShortName",
                                "startDate"         : req.params.startDate,
                                "endDate"           : req.params.endDate,
                            }
                        }
                ])
                .exec()
                .then(data=>{
                    // res.status(200).json(data);
                    getData();
                   async function getData(){
                        var k = 0 ; 
                        var returnData = [];
                        for(k = 0 ; k < data.length ; k++){
                            if(req.params.center_ID != "all"){
                                query = {
                                            $match : {
                                                "center_ID"         : String(req.params.center_ID),
                                                "sector_ID"         : String(data[k].sector_ID),
                                                "date"              : {$gte : req.params.startDate, $lte : req.params.endDate},
                                            }
                                        };
                            }else{
                                query = {
                                            $match : {
                                                "sector_ID"         : String(data[k].sector_ID),
                                                "date"              : {$gte : req.params.startDate, $lte : req.params.endDate},
                                            }
                                        };
                            }                       
                            var upgrade_reach_count = await getBeneficiariesCount(query,"all");
                            returnData.push({
                                                achievement_Reach               : upgrade_reach_count && upgrade_reach_count.Reach ? upgrade_reach_count.Reach : 0,
                                                achievement_FamilyUpgradation   : upgrade_reach_count && upgrade_reach_count.FamilyUpgradation ? upgrade_reach_count.FamilyUpgradation : 0,
                                                sectorShortName                 : data[k].sectorShortName,
                                                sectorName                      : data[k].sectorName
                                            })
                        }
                        if(k >= data.length){
                            res.status(200).json(returnData);
                        }
                   };
                })
                .catch(err =>{
                    console.log(err);
                     res.status(200).json(err);
                });
    }
};
exports.list_count_center_district_blocks_villages = (req,res,next)=>{
    Center.aggregate([
                        {
                            $match : { 
                                            _id: { $exists: true }
                                    } 
                        },
                        {
                            $project : {
                                            "districtsCovered"  : 1,
                                            "blocksCovered"     : 1,
                                            "villagesCovered"   : 1,
                                            "centerName"        : 1,
                                            "countCenter"       : { $sum : 1},
                                            "countDirstrict"    : { $size : "$districtsCovered"},
                                            "countBlocks"       : { $size : "$blocksCovered"},
                                            "countVillages"     : { $size : "$villagesCovered"},
                                        }
                        },
                        {
                            $group : {
                                        "_id" : "$_id",
                                        "districtsCovered"  : {$push : "$districtsCovered"},
                                        "blocksCovered"     : {$push : "$blocksCovered.block"},
                                        "villagesCovered"   : {$push : "$villagesCovered.village"},
                                        "centerName"        : {$push : "$centerName"},
                                        "countCenter"       : { $sum : 1},
                                        "countDirstrict"    : { $sum : "$countDirstrict"},
                                        "countBlocks"       : { $sum : "$countBlocks"},
                                        "countVillages"     : { $sum : "$countVillages"},
                                    }
                        },
                        {
                            $unwind : "$districtsCovered"
                        },
                        {
                            $unwind : "$blocksCovered"
                        },
                        {
                            $unwind : "$villagesCovered"
                        },
                        {
                            $group : {
                                        "_id" : "$null",
                                        "districtsCovered"  : {$push : "$districtsCovered"},
                                        "blocksCovered"     : {$push : "$blocksCovered"},
                                        "villagesCovered"   : {$push : "$villagesCovered"},
                                        "centerName"        : {$push : "$centerName"},
                                        "countCenter"       : { $sum : 1},
                                        "countDirstrict"    : { $sum : "$countDirstrict"},
                                        "countBlocks"       : { $sum : "$countBlocks"},
                                        "countVillages"     : { $sum : "$countVillages"},
                                    }
                        },
                        {
                            $unwind : "$centerName"
                        },
                        {
                            $unwind : "$centerName"
                        },
                        {
                            $group : {
                                        "_id" : null,
                                        "districtsCovered"  : {$first : "$districtsCovered"},
                                        "blocksCovered"     : {$first : "$blocksCovered"},
                                        "villagesCovered"   : {$first : "$villagesCovered"},
                                        "centerName"        : {$push : "$centerName"},
                                        "countCenter"       : { $sum : 1},
                                        "countDirstrict"    : { $first : "$countDirstrict"},
                                        "countBlocks"       : { $first : "$countBlocks"},
                                        "countVillages"     : { $first : "$countVillages"},   
                                    }
                        },
                        {
                            $unwind : "$districtsCovered"
                        },
                        {
                            $unwind : "$districtsCovered"
                        },
                        {
                            $project : {
                                        "_id" : null,
                                        "districtsCovered"  : { $slice: [ { $split: [ "$districtsCovered" , "|" ] },1]},
                                        "blocksCovered"     : 1,
                                        "villagesCovered"   : 1,
                                        "centerName"        : 1,
                                        "countCenter"       : 1,
                                        "countDirstrict"    : 1,
                                        "countBlocks"       : 1,
                                        "countVillages"     : 1,   
                                    }
                        },
                        {
                            $unwind : "$districtsCovered"
                        },
                        {
                            $group : {
                                        "_id" : null,
                                        "districtsCovered"  : {$push : "$districtsCovered"},
                                        "blocksCovered"     : {$first : "$blocksCovered"},
                                        "villagesCovered"   : {$first : "$villagesCovered"},
                                        "centerName"        : {$first : "$centerName"},
                                        "countCenter"       : { $first : "$countCenter"},
                                        "countDirstrict"    : { $first : "$countDirstrict"},
                                        "countBlocks"       : { $first : "$countBlocks"},
                                        "countVillages"     : { $first : "$countVillages"},   
                                    }
                        },
                        {
                            $unwind : "$blocksCovered"
                        },
                        {
                            $unwind : "$blocksCovered"
                        },
                        {
                            $group : {
                                        "_id" : null,
                                        "districtsCovered"  : {$first : "$districtsCovered"},
                                        "blocksCovered"     : {$push : "$blocksCovered"},
                                        "villagesCovered"   : {$first : "$villagesCovered"},
                                        "centerName"        : {$first : "$centerName"},
                                        "countCenter"       : { $first : "$countCenter"},
                                        "countDirstrict"    : { $first : "$countDirstrict"},
                                        "countBlocks"       : { $first : "$countBlocks"},
                                        "countVillages"     : { $first : "$countVillages"},   
                                    }
                        },
                        {
                            $unwind : "$villagesCovered"
                        },
                        {
                            $unwind : "$villagesCovered"
                        },
                        {
                            $group : {
                                        "_id" : null,
                                        "districtsCovered"  : {$first : "$districtsCovered"},
                                        "blocksCovered"     : {$first : "$blocksCovered"},
                                        "villagesCovered"   : {$push : "$villagesCovered"},
                                        "centerName"        : {$first : "$centerName"},
                                        "countCenter"       : { $first : "$countCenter"},
                                        "countDistrict"     : { $first : "$countDirstrict"},
                                        "countBlocks"       : { $first : "$countBlocks"},
                                        "countVillages"     : { $first : "$countVillages"},   
                                    }
                        },
                ])
                .exec()
                .then(data=>{
                    res.status(200).json(data);
                })
                .catch(err =>{
                    console.log(err);
                     res.status(200).json(err);
                }); 
};
exports.list_count_center_district_blocks_villages_list = (req,res,next)=>{
    //:center_ID/:district/:block
    var selector = {};
    if(req.params.district !== 'all'){
        selector.district = req.params.district;
    }
    if(req.params.block !== 'all'){
        selector.block = req.params.block;
    }
    var query = {
                    $match : selector 
                }
    var centerquery = "1";
    if(req.params.center_ID !== 'all'){
        centerquery =  
                    {
                        $match : {"_id" : ObjectID(req.params.center_ID)}
                    };
    }else{
        centerquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }

    Center.aggregate([
                        centerquery,
                        {
                            $project : {
                                            "villagesCovered"   : 1,
                                            "centerName"        : 1,
                                            "center_ID"         : "$_id",
                                        }
                        },
                        {
                            $unwind : "$villagesCovered"
                        },
                        {
                            $project : {
                                            "center_ID"         : 1,
                                            "centerName"        : 1,
                                            "district"          : "$villagesCovered.district",
                                            "block"             : "$villagesCovered.block",
                                            "village"           : "$villagesCovered.village",
                                        }
                        },
                        {
                            $project : {
                                            "center_ID"         : 1,
                                            "centerName"        : 1,
                                            "district"          : { $slice: [ { $split: [ "$district" , "|" ] },1]},
                                            "block"             : 1,
                                            "village"           : 1,
                                        }
                        },
                        
                        {
                            $unwind : "$district"
                        },
                        query
                ])
                .sort({"centerName":1})
                .exec()
                .then(data=>{
                    // console.log('data',data);
                    res.status(200).json(data);
                })
                .catch(err =>{
                    console.log(err);
                     res.status(200).json(err);
                }); 
};

exports.list_count_center_district_blocks_villages_list_trial = (req,res,next)=>{
    //:center_ID/:district/:block
    var selector = {};
    if(req.params.district !== 'all'){
        selector.district = req.params.district;
    }
    if(req.params.block !== 'all'){
        selector.block = req.params.block;
    }
    var query = {
                    $match : selector 
                }
    var centerquery = "1";
    if(req.params.center_ID !== 'all'){
        centerquery =  
                    {
                        $match : {"_id" : ObjectID(req.params.center_ID)}
                    };
    }else{
        centerquery = {
                    $match:{
                                "_id" : {$exists : true}
                        }
                };
    }

    Center.aggregate([
                        centerquery,
                        {
                            $project : {    
                                            "villagesCovered"   : 1,
                                            "centerName"        : 1,
                                            "center_ID"         : "$_id",
                                        }
                        },
                        {
                            $unwind : "$villagesCovered"
                        },
                        {
                            $project : {
                                            "center_ID"         : 1,
                                            "centerName"        : 1,
                                            "district"          : "$villagesCovered.district",
                                            "block"             : "$villagesCovered.block",
                                            "village"           : "$villagesCovered.village",
                                        }
                        },
                        {
                            $project : {
                                            "center_ID"         : 1,
                                            "centerName"        : 1,
                                            "district"          : { $slice: [ { $split: [ "$district" , "|" ] },1]},
                                            "block"             : 1,
                                            "village"           : 1,
                                        }
                        },
                        
                        {
                            $unwind : "$district"
                        },
                        query,
                        {
                            $group: {
                                _id : {
                                    "center_ID"         : "$center_ID",
                                    "centerName"        : "$centerName",
                                }, 
                                "districts"             : { $push:  {"district": "$district"} },
                                "blocks"                : { $push:  {"district": "$district", "block": "$block"} },
                                "villages"              : { $push:  {"district": "$district", "block": "$block", "village": "$village"} },
                            }  
                        },
                        {
                            $project : {
                                            "center_ID"          : "$_id.center_ID",
                                            "centerName"         : "$_id.centerName",
                                            "districts"          : 1,
                                            "blocks"             : 1,
                                            "villages"           : 1,
                                            "_id"                : null
                                        }
                        },
                ])
                .sort({"centerName":1})
                .exec()
                .then(data=>{
                    var allData = data.map((a, index)=>{
                        a.districts.sort(dynamicSort("district"));
                        a.blocks.sort(dynamicSort("block"));
                        a.villages.sort(dynamicSort("village"));
                        return {
                            // "_id"               : a._id,
                            "center_ID"         : a.center_ID,
                            "centerName"        : a.centerName,
                            "districts"         : a.districts,
                            "blocks"            : a.blocks,
                            "villages"          : a.villages,
                        }
                    })
                    // console.log('data',data);
                    res.status(200).json(allData);
                })
                .catch(err =>{
                    console.log(err);
                     res.status(200).json(err);
                }); 
};
//Center Reports
exports.report_sector_center= (req,res,next)=>{ 
    // console.log("In report_sector center",req.params);
    var deriveDate = derive_year_month({startDate : req.params.startDate, endDate : req.params.endDate});
    AnnualPlan.aggregate([
                            {
                                $match : {
                                            "year"      : deriveDate.year,
                                            "center_ID" : req.params.center_ID
                                        }
                            },
                            {
                                $group : {
                                                "_id"                       : "$sector_ID",
                                                "name"                      : { "$first" : "$sectorName"},
                                                "annualPlan_TotalBudget"    : { "$sum" : "$totalBudget" },
                                          }
                            },
                            {
                                $project : {
                                                "_id"                       : 1,
                                                "name"                      : 1,
                                                "annualPlan_TotalBudget"    : 1,
                                                // "annualPlan_TotalBudget_L"  : "$annualPlan_TotalBudget"
                                            }
                            },
                            {
                                $lookup : {
                                        from          : "sectors",
                                        localField    : "name",
                                        foreignField  : "sector",
                                        as            : "sectorDetails"
                                }
                            },
                            {
                               $unwind : "$sectorDetails" 
                            },
                            {
                                $project : {
                                                "_id" : 1,
                                                "name"                      : 1,
                                                "annualPlan_TotalBudget"    : 1,
                                                "sectorShortName"           : "$sectorDetails.sectorShortName"
                                            }
                            },
                            {
                                $sort : { "name" : 1}
                            }
                        ])
                .exec()
                    .then(data=>{
                        var returnData = [];
                        var  j = 0;
                        for( j = 0 ; j < data.length ; j++){
                            returnData.push({
                                "_id"                       : data[j]._id,
                                "name"                      : data[j].name,
                                "sectorShortName"           : data[j].sectorShortName,
                                "annualPlan_TotalBudget"    : data[j].annualPlan_TotalBudget,
                                "annualPlan_TotalBudget_L"  : (data[j].annualPlan_TotalBudget / 100000),
                            });
                        }
                        if(j >= data.length){
                            res.status(200).json(returnData);
                        }
                    })
                    .catch(err=>{
                        res.status(404).json(err);
                    });
};

