const mongoose	          = require("mongoose");
const ObjectID            = require('mongodb').ObjectID;
const ListOfbeneficiary   = require('../models/beneficiaries');
const Families            = require('../models/families.js');
const BeneficiaryFamilies = require('../models/families');
const ActivityReport      = require('../models/activityReport');
const FailedRecords       = require('../models/failedRecords');
const _                   = require("underscore");

function pad_with_zeroes(number, length) {
  return new Promise((resolve,reject)=>{
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        resolve(my_string);
        // return my_string;
  })
};
function fetchBeneficiaryID(center){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne({"center":center})
                                   .sort({createdAt:-1})
                                   .exec()
                                   .then(member=>{
                                        var IDdetails = center.toUpperCase().slice(0,2)+'-BI-';
                                        if(member){
                                            var lastBeneficiaryID = member.beneficiaryID;
                                            // console.log('lastBeneficiaryID',lastBeneficiaryID);
                                            var lastbID = parseInt(lastBeneficiaryID.split('-BI-')[1]);
                                            var bID = lastbID + 1;
                                            var bIDLength = (bID.toString()).length
                                            padSTring();
                                            async function padSTring(){
                                                var bID1 = await pad_with_zeroes(0,6-bIDLength);
                                                // var beneficiaryID1 = BASE.substr(0, 6 - Math.ceil(bID / 10)) + bID ;
                                                var beneficiaryID1 =  bID1+''+bID; 
                                                resolve(IDdetails+''+beneficiaryID1);
                                                // console.log("bID1",bID1,"beneficiaryID1",beneficiaryID1,"bID",bID, "beneficiaryID", beneficiaryID)
                                            }
                                        }else{
                                            resolve(IDdetails+"000000")
                                        }
                                    })
                                    .catch(err=>{
                                        reject(err);
                                    })
    });
}
exports.create_listOfbeneficiary = (req,res,next)=>{
	ListOfbeneficiary.findOne({uidNumber                : req.body.uidNumber })
		.exec()
		.then(data =>{
            if(data && req.body.uidNumber != "-" && req.body.uidNumber){
                res.status(200).json({message:"UID already exist"})
            }else{
                var center = req.body.center;
                getData();
                async function getData(){
                    var beneficiaryID = await fetchBeneficiaryID(center);
                    // console.log("beneficiaryID", beneficiaryID);
                    const listOfbeneficiary = new ListOfbeneficiary({
                        _id                     : new mongoose.Types.ObjectId(),    
                        beneficiaryID           : beneficiaryID,
                        family_ID               : req.body.family_ID,
                        familyID                : req.body.familyID,
                        center_ID               : req.body.center_ID,
                        center                  : req.body.center,
                        surnameOfBeneficiary    : req.body.surnameOfBeneficiary,
                        firstNameOfBeneficiary  : req.body.firstNameOfBeneficiary,
                        middleNameOfBeneficiary : req.body.middleNameOfBeneficiary,
                        birthYearOfbeneficiary  : req.body.birthYearOfbeneficiary,
                        genderOfbeneficiary     : req.body.genderOfbeneficiary,
                        uidNumber               : req.body.uidNumber,
                        relation                : req.body.relation,
                        createdAt               : new Date()
                    });
                    listOfbeneficiary.save()
                        .then(data=>{
                            res.status(200).json({"message":"Beneficiary Details submitted Successfully"});
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            }
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
exports.update_listOfbeneficiary = (req,res,next)=>{
    ListOfbeneficiary.findOne({uidNumber                : req.body.uidNumber })
        .exec()
        .then(data =>{
            if(data && (data._id != req.body.beneficiary_ID) && req.body.uidNumber != "-"){
                res.status(200).json({message:"UID already exist"})
            }else{
                ListOfbeneficiary.updateOne(
                        { _id:req.body.beneficiary_ID},  
                        {
                            $set:{
                                family_ID               : req.body.family_ID,
                                familyID                : req.body.familyID,
                                beneficiaryID           : req.body.beneficiaryID,
                                center_ID               : req.body.center_ID,
                                center                  : req.body.center,
                                surnameOfBeneficiary    : req.body.surnameOfBeneficiary,
                                firstNameOfBeneficiary  : req.body.firstNameOfBeneficiary,
                                middleNameOfBeneficiary : req.body.middleNameOfBeneficiary,
                                birthYearOfbeneficiary  : req.body.birthYearOfbeneficiary,
                                genderOfbeneficiary     : req.body.genderOfbeneficiary,
                                // nameofbeneficiaries     : req.body.nameofbeneficiaries,
                                uidNumber               : req.body.uidNumber,
                                relation                : req.body.relation,
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        // console.log("ben.data",data)
                        if(data.nModified === 1){
                            res.status(200).json({
                                "message": "Beneficiary Details updated Successfully."
                            });
                        }else{
                            res.status(200).json({
                                "message": "Beneficiary Details not modified"
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
exports.list_listOfbeneficiary = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        if(req.params.UIDStatus === 'withuid'){
            query = [
                        { 
                            $match:{
                                center_ID : {$exists : true},
                                uidNumber : { $exists: true }
                            },
                        },
                        {
                            $match:{
                              uidNumber : { $ne: "-" }  
                            }
                        }
                    ];
        }else if(req.params.UIDStatus === 'withoutuid'){
            query = [
                        { 
                            $match:{
                                center_ID : {$exists : true},
                                $or:[
                                    {uidNumber : { $exists: false }},
                                    {uidNumber : { $eq: "-" }}
                                ]
                            },
                        }
                    ];
        }else{
            query = [
                        { 
                            $match:{
                                center_ID : {$exists : true},
                            }
                        }
                    ];    
        }
    }else{
        // query = [{ 
        //             $match:{
        //                 "center_ID" : req.params.center_ID
        //             }
        //         }];
        if(req.params.UIDStatus === 'withuid'){
            query = [
                        { 
                            $match:{
                                "center_ID" : req.params.center_ID,
                                uidNumber : { $exists: true }
                            },
                        },
                        {
                            $match:{
                              uidNumber : { $ne: "-" }  
                            }
                        }
                    ];
        }else if(req.params.UIDStatus === 'withoutuid'){
            query = [
                        { 
                            $match:{
                                "center_ID" : req.params.center_ID,
                                $or:[
                                    {uidNumber : { $exists: false }},
                                    {uidNumber : { $eq: "-" }}
                                ]
                            },
                        }
                    ];
        }else{
            query = [
                        { 
                            $match:{
                                "center_ID" : req.params.center_ID,
                            }
                        }
                    ];    
        }
    }
    if(query != "1"){  
        // console.log("query ",query); 
        ListOfbeneficiary.aggregate(query)
            .exec()
            .then(data=>{
                // console.log("family",data.length);
                var allData = data.map((x, i)=>{
                    return {
                        "_id"                     : x._id,
                        "beneficiaryID"           : x.beneficiaryID,
                        "family_ID"               : x.family_ID,
                        "familyID"                : x.familyID,
                        "center_ID"               : x.center_ID,
                        "center"                  : x.center,
                        "surnameOfBeneficiary"    : x.surnameOfBeneficiary,
                        "firstNameOfBeneficiary"  : x.firstNameOfBeneficiary,
                        "middleNameOfBeneficiary" : x.middleNameOfBeneficiary,
                        "birthYearOfbeneficiary"  : x.birthYearOfbeneficiary,
                        "genderOfbeneficiary"     : x.genderOfbeneficiary,
                        "nameofbeneficiaries"     : x.surnameOfBeneficiary+" "+x.firstNameOfBeneficiary+" " + x.middleNameOfBeneficiary,
                        "uidNumber"               : x.uidNumber,                       
                        "relation"                : x.relation,                       
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
    }
};
exports.list_listOfbeneficiary_with_limits = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        ListOfbeneficiary.find(query)
            .sort({"createdAt":-1})
            .exec()
            .then(data=>{

                // console.log("family",data);
                var allData = data.map((x, i)=>{
                    return {
                        "_id"                     : x._id,
                        "beneficiaryID"           : x.beneficiaryID,
                        "family_ID"               : x.family_ID,
                        "familyID"                : x.familyID,
                        "center_ID"               : x.center_ID,
                        "center"                  : x.center,
                        "surnameOfBeneficiary"    : x.surnameOfBeneficiary,
                        "firstNameOfBeneficiary"  : x.firstNameOfBeneficiary,
                        "middleNameOfBeneficiary" : x.middleNameOfBeneficiary,
                        "birthYearOfbeneficiary"  : x.birthYearOfbeneficiary,
                        "genderOfbeneficiary"     : x.genderOfbeneficiary,
                        "nameofbeneficiaries"     : x.surnameOfBeneficiary+" "+x.firstNameOfBeneficiary+" " + x.middleNameOfBeneficiary,
                        "uidNumber"               : x.uidNumber,                       
                        "relation"                : x.relation,                       
                    }
                })            
                res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};
exports.count_listOfbeneficiary = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        ListOfbeneficiary.find(query)
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
exports.fetch_listOfbeneficiary = (req,res,next)=>{
    ListOfbeneficiary.find({_id : req.params.listOfbeneficiaryID})
        .exec()
        .then(data=>{
            // console.log('data',data)
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete_listOfbeneficiary = (req,res,next)=>{
    var query = "1";
    query = {
                "listofBeneficiaries.beneficiary_ID" : req.params.listOfbeneficiaryID
            };
    ActivityReport.find(query)
        .exec()
        .then(data=>{
            // console.log('data',data)
            if(data.length>0){
                res.status(200).json({
                    "message":"Beneficiary can not be deleted, It is already used in Activity Report"
                });

            }else{
                ListOfbeneficiary.deleteOne({_id:req.params.listOfbeneficiaryID})
                .exec()
                .then(data=>{
                    res.status(200).json({
                        "message":"Beneficiary Details deleted Successfully"
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
exports.search_beneficiary = (req,res,next)=>{
    // console.log("req.body.searchText",req.body.searchText);

    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(req.body.searchText){
        ListOfbeneficiary.find(
            {
                $and:[
                    {$or:[
                        {"familyID"                : { "$regex" : req.body.searchText, $options: "i" }},
                        {"beneficiaryID"           : { "$regex" : req.body.searchText, $options: "i" }},
                        {"surnameOfBeneficiary"    : { "$regex" : req.body.searchText, $options: "i" }},
                        {"firstNameOfBeneficiary"  : { "$regex" : req.body.searchText, $options: "i" }},
                        {"middleNameOfBeneficiary" : { "$regex" : req.body.searchText, $options: "i" }},
                        {"uidNumber"               : { "$regex" : req.body.searchText, $options: "i" }},
                        {"relation"                : { "$regex" : req.body.searchText, $options: "i" }},
                        {"genderOfbeneficiary"     : { "$regex" : req.body.searchText, $options: "i" }},
                        {"birthYearOfbeneficiary"  : { "$regex" : req.body.searchText, $options: "i" }},
                    ]
                },query],             
            },
            
        )
        .exec()
        .then( data =>{
            // console.log('data ',data);
            if(data.length > 0){
                return res.status(200).json({
                    "message" : 'Search-Successfull',
                    "data": data
                });     
            }else{
                return res.status(404).json({
                    "message" : 'No-Data-Available',        
                }); 
            }   
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }else{
        return res.status(404).json({
            "message" : 'No-Data-Available',        
        }); 
    }
}

exports.list_beneficiary_centerwise = (req,res,next) =>{
    var query = {};
    if(req.params.centerID !== 'all'){
        if(req.params.district !== 'all'){
            if(req.params.blocks !== 'all'){
                if(req.params.village !== 'all'){
                    query = {
                                "center_ID" : req.params.centerID,
                                "dist"      : req.params.district,
                                "block"     : req.params.blocks,
                                "village"   : req.params.village,
                            };   
                }else{
                    query = {
                                "center_ID" : req.params.centerID,
                                "dist"      : req.params.district,
                                "block"     : req.params.blocks,
                            };
                }
            }else{
                query = {
                            "center_ID" : req.params.centerID,
                            "dist"      : req.params.district,
                        };
            }
        }else{
            query = {
                        "center_ID" : req.params.centerID,
                    };
        }
    }else{
        if(req.params.district !== 'all'){
            if(req.params.blocks !== 'all'){
                if(req.params.village !== 'all'){
                    query = {
                                "dist"      : req.params.district,
                                "block"     : req.params.blocks,
                                "village"   : req.params.village,
                            };
                }else{
                    query = {
                                "dist"      : req.params.district,
                                "block"     : req.params.blocks,
                            };
                }
            }else{
                query = {
                            "dist"      : req.params.district,
                        };
            }
        }else{
            query = {
                            "_id"      : {$exists : true},
                        };
        }
    }
    // console.log("query ",query);
    Families.aggregate([
                    {
                        $match : query
                    },                  
                    { $addFields  : { "_id": { $toString: "$_id" }}},
                    {
                        $lookup : {
                                from            : "listofbeneficiaries",
                                foreignField    : "family_ID",
                                localField      : "_id",
                                as              : "beneficiariesInFamily"
                        }
                    },
                    {
                        $unwind : "$beneficiariesInFamily"
                    },
                    {
                        $project : {
                            "familyID"               : 1,
                            "family_ID"              : "$beneficiariesInFamily.family_ID",
                            "center_ID"              : 1,
                            "center"                 : 1,
                            "state"                  : 1,
                            "dist"                   : 1,
                            "block"                  : 1,
                            "village"                : 1,
                            "caste"                  : 1,
                            "incomeCategory"         : 1,
                            "landCategory"           : 1,
                            "specialCategory"        : 1,
                            "_id"                    : "$beneficiariesInFamily._id",
                            "beneficiary_ID"         : "$beneficiariesInFamily._id",
                            "beneficiaryID"          : "$beneficiariesInFamily.beneficiaryID",
                            "surnameOfBeneficiary"   : "$beneficiariesInFamily.surnameOfBeneficiary",
                            "firstNameOfBeneficiary" : "$beneficiariesInFamily.firstNameOfBeneficiary",
                            "nameofbeneficiaries"    : { $concat: [ "$beneficiariesInFamily.surnameOfBeneficiary", " ", "$beneficiariesInFamily.firstNameOfBeneficiary", " ","$beneficiariesInFamily.middleNameOfBeneficiary"] },
                            "nameofbeneficiary"      : { $concat: [ "$beneficiariesInFamily.surnameOfBeneficiary", " ", "$beneficiariesInFamily.firstNameOfBeneficiary", " ","$beneficiariesInFamily.middleNameOfBeneficiary"] },
                            "middleNameOfBeneficiary": "$beneficiariesInFamily.middleNameOfBeneficiary",
                            "uidNumber"              : "$beneficiariesInFamily.uidNumber",
                            "relation"               : "$beneficiariesInFamily.relation",
                            "genderOfbeneficiary"    : "$beneficiariesInFamily.genderOfbeneficiary",
                            "birthYearOfbeneficiary" : "$beneficiariesInFamily.birthYearOfbeneficiary",
                        }
                    },
            ])
            .sort({"beneficiaryID":1})
            .exec()
            .then(familyData=>{
                // console.log("familyData",familyData)
                // console.log("familyData.length",familyData.length)
                res.status(200).json(familyData);
            })
            .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
};

exports.list_beneficiary_filterwise = (req,res,next) =>{
    var query = "1";
    if(req.body.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.body.center_ID};
    }
    var selector = {};
    selector["$and"] = [];
    if(req.body.center_ID !== "all"){
        selector["$and"].push({"families.center_ID" : req.body.center_ID})
    }
    if(req.body.district !== "all"){
        selector["$and"].push({"families.dist": req.body.district})
    }
    if(req.body.blocks !== "all"){
        selector["$and"].push({"families.block": req.body.blocks})
    }
    if(req.body.village !== "all"){
        selector["$and"].push({"families.village": req.body.village})
    }
    if(req.body.searchText!=="all"){
        selector["$and"].push( { $or:
                                    [
                                        {"familyID"                : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"beneficiaryID"           : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"surnameOfBeneficiary"    : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"firstNameOfBeneficiary"  : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"middleNameOfBeneficiary" : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"uidNumber"               : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"relation"                : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"genderOfbeneficiary"     : { "$regex" : req.body.searchText, $options: "i" }},
                                        {"birthYearOfbeneficiary"  : { "$regex" : req.body.searchText, $options: "i" }},
                                    ]
                                })
    }
    /*Skip & limit*/
    if(req.body.startRange !== "all"){
        skip = parseInt(req.body.startRange);
    }else{
        skip = 0
    }
    if(req.body.limitRange !== "all"){
        limit = parseInt(req.body.limitRange);
    }else{
        limit = 1000000000000000000
    }
    if(query != "1"){           
        ListOfbeneficiary.aggregate([

                        {
                            $addFields: {
                                "family_ID": { $toObjectId:"$family_ID" }
                            }
                        },   
                        {
                            $lookup : {
                                    from          : "families",
                                    localField    : "family_ID",
                                    foreignField  : "_id",
                                    as            : "families"
                            }
                        },   
                       /* {
                            $lookup : {
                                    from          : "families",
                                    localField    : "familyID",
                                    foreignField  : "familyID",
                                    as            : "families"
                            }
                        },*/
                        {
                            $unwind : "$families" 
                        },       
                        {
                            $match : query
                        },      
                        {
                            $match : selector
                        },
                        {
                            $project : {

                                "_id"                     : 1,
                                "beneficiaryID"           : 1,
                                "family_ID"               : 1,
                                "familyID"                : 1,
                                "center_ID"               : 1,
                                "center"                  : 1,
                                "surnameOfBeneficiary"    : 1,
                                "firstNameOfBeneficiary"  : 1,
                                "middleNameOfBeneficiary" : 1,
                                "birthYearOfbeneficiary"  : 1,
                                "genderOfbeneficiary"     : 1,
                                "nameofbeneficiaries"     : 1,
                                "uidNumber"               : 1,
                                "relation"                : 1,
                                "nameofbeneficiaries"    : { $concat: [ "$surnameOfBeneficiary", " ", "$firstNameOfBeneficiary", " ","$middleNameOfBeneficiary"] },
                                "dist"                   : "$families.dist",
                                "block"                  : "$families.block",
                                "village"                : "$families.village",
                                "caste"                  : "$families.caste",
                                "incomeCategory"         : "$families.incomeCategory",
                                "landCategory"           : "$families.landCategory",
                                "specialCategory"        : "$families.specialCategory",
                            }
                        },
                ])
                .skip(skip)
                .limit(limit)
                .sort({"beneficiaryID":1})
                .exec()
                .then(familyData=>{
                    // console.log("familyData",familyData);
                    console.log("familyData***************===",familyData.length)
                    res.status(200).json(familyData);
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
    }
};

function insert_benificaries(benificiary,center,center_ID,family_ID,fileName){
    return new Promise((resolve,reject)=>{
         ListOfbeneficiary.findOne(
            {
                $and : 
                [
                    {
                        familyID                 : benificiary.familyID,
                    },
                    {
                        surnameOfBeneficiary     : benificiary.surnameOfBeneficiary,
                    },
                    {
                        firstNameOfBeneficiary   : benificiary.firstNameOfBeneficiary,
                    },
                    {
                        middleNameOfBeneficiary  : benificiary.middleNameOfBeneficiary,
                    },
                    {
                        uidNumber                : benificiary.uidNumber,
                    }
                ]
            }
        )
        .exec()
        .then(data =>{
            if(data){
                resolve(0)
            }else{
                getData();
                async function getData(){
                    var beneficiaryID = await fetchBeneficiaryID(center);
                    const listOfbeneficiary = new ListOfbeneficiary({
                        _id                     : new mongoose.Types.ObjectId(),    
                        beneficiaryID           : beneficiaryID,
                        family_ID               : family_ID,
                        familyID                : family_ID,
                        center_ID               : center_ID,
                        center                  : center,
                        surnameOfBeneficiary    : benificiary.surnameOfBeneficiary,
                        firstNameOfBeneficiary  : benificiary.firstNameOfBeneficiary,
                        middleNameOfBeneficiary : benificiary.middleNameOfBeneficiary,
                        // nameofbeneficiaries     : req.body.nameofbeneficiaries,
                        uidNumber               : benificiary.uidNumber,
                        relation                : benificiary.relation,
                        fileName                : fileName,
                        createdAt               : new Date()
                    });
                    listOfbeneficiary.save()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err =>{
                            console.log(err);
                            reject(err);
                        });
                }
            }
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    });
}
function fetchAllFamilyID(center_ID){
    return new Promise((resolve,reject)=>{
        //console.log('Family_ID',familyID)
        BeneficiaryFamilies.find({center_ID:center_ID})
            .exec()
            .then(data=>{
                resolve(data);
            })
            .catch((err)=>{
                reject(err);
            })
    });
}
function fetchfamily_ID(familyID){
    return new Promise((resolve,reject)=>{
        //console.log('Family_ID',familyID)
        BeneficiaryFamilies.findOne({"familyID": familyID})
                                    .exec()
                                    .then(data=>{
                                        //console.log("data",data);
                                        if (data) {
                                            resolve(data.familyID);
                                        }else{
                                            resolve("Family not exists");
                                        }
                                    })
                                    .catch((err)=>{
                                        reject(err);
                                    })
    });
}
exports.bulk_upload_benificiaries_OLD = (req,res,next)=>{
    var benificiaries = req.body.data;
    var newbenificiaryLst = [];
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    var uploadTime = new Date();
    getBenificiaryData();

    async function getBenificiaryData(){
        var allFamilyIDs = await fetchAllFamilyID(req.body.reqdata.center_ID);
        var allBeneficiaries = await fetchAllBeneficiaries(req.body.reqdata.center_ID);

        
        var lastBeneficiaryID = await fetchLatestBeneficiaryID(req.body.reqdata.center_ID, req.body.reqdata.centerName);
        beneficiaryID = formBeneficiaryId(req.body.reqdata.centerName, lastBeneficiaryID)
        for(var k = 0 ; k < benificiaries.length ; k++){
            
            if (benificiaries[k].familyID == '-') {
                remark += "familyID not found, " ;  
            }
            if (benificiaries[k].surnameOfBeneficiary == '-') {
                remark += "surnameOfBeneficiary not found, " ;  
            }
            if (benificiaries[k].firstNameOfBeneficiary == '-') {
                remark += "firstNameOfBeneficiary not found, " ;  
            }
            if (benificiaries[k].relation == '-') {
                remark += "relation not found, " ;  
            }
            if (benificiaries[k].uidNumber != '-') {
                if (benificiaries[k].uidNumber.toString().replace(/ +/g, "").length != 12) {
                    remark += "UID should be 12 digit number " ;  
                }
            }
            if (remark == '') {
                var family = allFamilyIDs.filter((data)=>{
                    // console.log("***********",((data.familyID) == (benificiaries[k].familyID).trim()) ,((data.surnameOfFH) == (benificiaries[k].surnameOfBeneficiary).trim()))
                    // console.log("***********",(data.familyID) ,(benificiaries[k].familyID).trim() ,(data.surnameOfFH), (benificiaries[k].surnameOfBeneficiary).trim())
                    if (((data.familyID) == (benificiaries[k].familyID).trim()) && ((data.surnameOfFH) == (benificiaries[k].surnameOfBeneficiary).trim())) {
                        return data;
                    }
                })
                // console.log("family******************",family)  

                if (family.length>0) { 
                    if (benificiaries[k].uidNumber != '-') {
                        var beneficiary = allBeneficiaries.filter((data)=>{
                            if (family[0].familyID == (benificiaries[k].familyID) && data.uidNumber == (benificiaries[k].uidNumber)
                                && (data.surnameOfBeneficiary).trim() == (benificiaries[k].surnameOfBeneficiary).trim() 
                                && (data.firstNameOfBeneficiary).trim() == (benificiaries[k].firstNameOfBeneficiary).trim() 
                                && (data.middleNameOfBeneficiary).trim() == (benificiaries[k].middleNameOfBeneficiary).trim() ) 
                            {
                                return data;
                            }
                        })
                    }else{
                        var beneficiary = allBeneficiaries.filter((data)=>{
                            if ((family[0].familyID).trim() == (benificiaries[k].familyID).trim() && (data.surnameOfBeneficiary).trim() == (benificiaries[k].surnameOfBeneficiary).trim() 
                                && (data.firstNameOfBeneficiary).trim() == (benificiaries[k].firstNameOfBeneficiary).trim() 
                                && (data.middleNameOfBeneficiary).trim() == (benificiaries[k].middleNameOfBeneficiary).trim()) 
                            {
                                return data;
                            }
                        })  
                    }
                    // console.log("beneficiary",beneficiary)
                    if (beneficiary.length>0) {
                        DuplicateCount++;
                        remark += "FamilyID and Name of Beneficiary already exist";
                        invalidObjects = benificiaries[k];
                        invalidObjects.failedRemark = remark;
                        invalidData.push(invalidObjects);
                    }else{
                        Count++;
                        validObjects                = benificiaries[k];
                        validObjects.beneficiaryID  = beneficiaryID;
                        validObjects.family_ID      = family[0]._id;
                        validObjects.familyID       = family[0].familyID;
                        validObjects.center_ID      = req.body.reqdata.center_ID;
                        validObjects.center         = req.body.reqdata.centerName;
                        validObjects.fileName       = req.body.fileName;
                        validObjects.uploadTime     = uploadTime;
                        validObjects.createdAt      = new Date();
                        validData.push(validObjects); 
                        beneficiaryID = formBeneficiaryId(req.body.reqdata.centerName, beneficiaryID) 
                    }
                }else{
                    remark += "Family not exists";
                    invalidObjects = benificiaries[k];
                    invalidObjects.failedRemark = remark;
                    invalidData.push(invalidObjects);
                }
                
            }else{
                invalidObjects = benificiaries[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }//listControls end
        // console.log("DuplicateCount",DuplicateCount);

        ListOfbeneficiary.insertMany(validData)
        .then(data=>{
            //console.log("data",data);
        })
        .catch(err =>{
            console.log(err);
        });
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords,req.body.updateBadData);

        if(k >= benificiaries.length){
           // res.status(200).json({"uploadedData": newbenificiaryLst,"message":"Beneficiaries Uploaded Successfully"})
        }
        var msgstr = "";
        if (DuplicateCount > 0 && Count > 0) {
            if (DuplicateCount > 1 && Count > 1) {
               msgstr =  " " + Count+" Beneficiaries are added successfully and "+"\n"+DuplicateCount+" Beneficiaries are duplicate";
            }
            else if(DuplicateCount ==1 && Count == 1 ){
                msgstr =  " " + Count+" beneficiary is added successfully and "+"\n"+DuplicateCount+" beneficiary is duplicate";
            }
            else if(DuplicateCount > 1 && Count == 1)
            {
                msgstr =  " " + Count+" beneficiary is added successfully and "+"\n"+DuplicateCount+" beneficiaries are duplicate";
            }else if(DuplicateCount == 1 && Count > 1){
                msgstr =  " " + Count+" beneficiaries are added successfully and "+"\n"+DuplicateCount+" beneficiary is duplicate";
            }
        }
        else if(DuplicateCount > 0 && Count == 0)
        {
            if (DuplicateCount > 1) {
                msgstr = "Failed to add beneficiaries as "+DuplicateCount+" beneficiaries are duplicate";
            }else{
                msgstr = "Failed to add beneficiaries as "+DuplicateCount+" beneficiary is duplicate";
            }
            
        }
        else if(DuplicateCount == 0 && Count > 0)
        { 
            if (Count > 1) {
                msgstr = " " + Count+" beneficiaries are added successfully";
            }else{
                msgstr = " " + Count+" beneficiary is added successfully";
            }            
        }else{
            // console.log('DuplicateCount',DuplicateCount,"Count",Count);
            msgstr = "Failed to add beneficiaries";
        }
        res.status(200).json({
            "message": msgstr,
            "completed": true
        });
    }    
} 
exports.bulk_upload_benificiaries = (req,res,next)=>{
    var benificiaries = req.body.data;
    var newbenificiaryLst = [];
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    var uploadTime = new Date();
    getBenificiaryData();

    async function getBenificiaryData(){
        var allFamilyIDs = await fetchAllFamilyID(req.body.reqdata.center_ID);
        var allBeneficiaries = await fetchAllBeneficiaries(req.body.reqdata.center_ID);

        
        var lastBeneficiaryID = await fetchLatestBeneficiaryID(req.body.reqdata.center_ID, req.body.reqdata.centerName);
        beneficiaryID = formBeneficiaryId(req.body.reqdata.centerName, lastBeneficiaryID)
        for(var k = 0 ; k < benificiaries.length ; k++){
            
            if (benificiaries[k].familyID == '-') {
                remark += "familyID not found, " ;  
            }
            if (benificiaries[k].surnameOfBeneficiary == '-') {
                remark += "surnameOfBeneficiary not found, " ;  
            }
            if (benificiaries[k].firstNameOfBeneficiary == '-') {
                remark += "firstNameOfBeneficiary not found, " ;  
            }
            if (benificiaries[k].relation == '-') {
                remark += "relation not found, " ;  
            }
            if (benificiaries[k].uidNumber != '-') {                
                if (typeof benificiaries[k].uidNumber != 'number') {
                    remark += "UID should be in number format, "; 
                }
                if (benificiaries[k].uidNumber.toString().replace(/ +/g, "").length != 12) {
                    remark += "UID should be 12 digit number " ;  
                }
            }
            if (remark == '') {
                var family = allFamilyIDs.filter((data)=>{
                    // console.log((data.familyID),"===",(benificiaries[k].familyID).trim())
                    // console.log('(data.familyID) == (benificiaries[k].familyID).trim()',((data.familyID) == (benificiaries[k].familyID).trim()))
                    // console.log((data.surnameOfFH).trim(),"===",(benificiaries[k].surnameOfBeneficiary).trim(), "==========",((data.surnameOfFH).trim() === (benificiaries[k].surnameOfBeneficiary).trim()))
                    // console.log("((data.surnameOfFH).trim() == (benificiaries[k].surnameOfBeneficiary).trim())",((data.surnameOfFH).trim() == (benificiaries[k].surnameOfBeneficiary).trim()))
                    if (((data.familyID) == (benificiaries[k].familyID).trim()) && ((data.surnameOfFH).trim() == (benificiaries[k].surnameOfBeneficiary).trim())) {
                        return data;
                    }
                })  
                // console.log("family",family)
                if (family.length>0) { 
                    if (benificiaries[k].uidNumber != '-') {
                        var beneficiary = allBeneficiaries.filter((data)=>{
                            if (family[0].familyID == (benificiaries[k].familyID) && data.uidNumber == (benificiaries[k].uidNumber)
                                && (data.surnameOfBeneficiary).trim() == (benificiaries[k].surnameOfBeneficiary).trim() 
                                && (data.firstNameOfBeneficiary).trim() == (benificiaries[k].firstNameOfBeneficiary).trim() 
                                && (data.middleNameOfBeneficiary).trim() == (benificiaries[k].middleNameOfBeneficiary).trim() ) 
                            {
                                return data;
                            }
                        })
                    }else{
                        var beneficiary = allBeneficiaries.filter((data)=>{
                            if ((family[0].familyID).trim() == (benificiaries[k].familyID).trim() && (data.surnameOfBeneficiary).trim() == (benificiaries[k].surnameOfBeneficiary).trim() 
                                && (data.firstNameOfBeneficiary).trim() == (benificiaries[k].firstNameOfBeneficiary).trim() 
                                && (data.middleNameOfBeneficiary).trim() == (benificiaries[k].middleNameOfBeneficiary).trim()) 
                            {
                                return data;
                            }
                        })  
                    }
                    
                    if (beneficiary.length>0) {
                        DuplicateCount++;
                        remark += "FamilyID and Name of Beneficiary already exist";
                        invalidObjects = benificiaries[k];
                        invalidObjects.failedRemark = remark;
                        invalidData.push(invalidObjects);
                    }else{
                        Count++;
                        validObjects                = benificiaries[k];
                        validObjects.beneficiaryID  = beneficiaryID;
                        validObjects.family_ID      = family[0]._id;
                        validObjects.familyID       = family[0].familyID;
                        validObjects.center_ID      = req.body.reqdata.center_ID;
                        validObjects.center         = req.body.reqdata.centerName;
                        validObjects.fileName       = req.body.fileName;
                        validObjects.uploadTime     = uploadTime;
                        validObjects.createdAt      = new Date();
                        // validData.push(validObjects); 
                        // beneficiaryID = formBeneficiaryId(req.body.reqdata.centerName, beneficiaryID) 
                        var addBeneficiary = await insertBeneficiary(validObjects, req.body.reqdata.centerName)
                        if (addBeneficiary.duplicate) {
                            if (benificiaries[k]) {
                                DuplicateCount++;
                                remark += "Duplicate Beneficiary found";
                                invalidObjects = benificiaries[k];
                                invalidObjects.failedRemark = remark;
                                invalidData.push(invalidObjects);
                                // console.log("invalidData",k,invalidData.length)
                            }
                        }else if (addBeneficiary.duplicateUID) {
                            if (benificiaries[k]) {
                                DuplicateCount++;
                                remark += "Duplicate UID found";
                                invalidObjects = benificiaries[k];
                                invalidObjects.failedRemark = remark;
                                invalidData.push(invalidObjects);
                                // console.log("invalidData",k,invalidData.length)
                            }
                        }else if (addBeneficiary.duplicate && addBeneficiary.duplicateUID) {
                            if (benificiaries[k]) {
                                DuplicateCount++;
                                remark += "Duplicate Beneficiary && Duplicate UID found";
                                invalidObjects = benificiaries[k];
                                invalidObjects.failedRemark = remark;
                                invalidData.push(invalidObjects);
                                // console.log("invalidData",k,invalidData.length)
                            }
                        }
                    }
                }else{
                    remark += "Family not exists";
                    invalidObjects = benificiaries[k];
                    invalidObjects.failedRemark = remark;
                    invalidData.push(invalidObjects);
                }                
            }else{
                invalidObjects = benificiaries[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }//listControls end
        // console.log("DuplicateCount",DuplicateCount);

        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords,req.body.updateBadData);
        if(k >= benificiaries.length){
           // res.status(200).json({"uploadedData": newbenificiaryLst,"message":"Beneficiaries Uploaded Successfully"})
        }
        var msgstr = "";
        if (DuplicateCount > 0 && Count > 0) {
            if (DuplicateCount > 1 && Count > 1) {
               msgstr =  " " + Count+" Beneficiaries are added successfully and "+"\n"+DuplicateCount+" Beneficiaries are duplicate";
            }
            else if(DuplicateCount ==1 && Count == 1 ){
                msgstr =  " " + Count+" beneficiary is added successfully and "+"\n"+DuplicateCount+" beneficiary is duplicate";
            }
            else if(DuplicateCount > 1 && Count == 1)
            {
                msgstr =  " " + Count+" beneficiary is added successfully and "+"\n"+DuplicateCount+" beneficiaries are duplicate";
            }else if(DuplicateCount == 1 && Count > 1){
                msgstr =  " " + Count+" beneficiaries are added successfully and "+"\n"+DuplicateCount+" beneficiary is duplicate";
            }
        }
        else if(DuplicateCount > 0 && Count == 0){
            if (DuplicateCount > 1) {
                msgstr = "Failed to add beneficiaries as "+DuplicateCount+" beneficiaries are duplicate";
            }else{
                msgstr = "Failed to add beneficiaries as "+DuplicateCount+" beneficiary is duplicate";
            }            
        }
        else if(DuplicateCount == 0 && Count > 0)
        { 
            if (Count > 1) {
                msgstr = " " + Count+" beneficiaries are added successfully";
            }else{
                msgstr = " " + Count+" beneficiary is added successfully";
            }            
        }else{
            // console.log('DuplicateCount',DuplicateCount,"Count",Count);
            msgstr = "Failed to add beneficiaries";
        }
        res.status(200).json({
            "message": msgstr,
            "completed": true
        });
    }    
} 
function insertBeneficiary(validData, centerName){
    return new Promise((resolve,reject)=>{ 
        duplicateControl();
        async function duplicateControl(){ 
            var benPresent = await findBeneficiary(validData);
            var duplicateUID = validData.uidNumber  !== '-' ? await findBeneficiaryDuplicateUID(validData) : 0;
            // console.log('benPresent',benPresent)    
            if (benPresent===0 && duplicateUID===0 ) {
                const listOfbeneficiary = new ListOfbeneficiary({
                    _id                     : new mongoose.Types.ObjectId(),    
                    beneficiaryID           : validData.beneficiaryID,
                    family_ID               : validData.family_ID,
                    familyID                : validData.familyID,
                    center_ID               : validData.center_ID,
                    center                  : validData.center,
                    surnameOfBeneficiary    : validData.surnameOfBeneficiary,
                    firstNameOfBeneficiary  : validData.firstNameOfBeneficiary,
                    middleNameOfBeneficiary : validData.middleNameOfBeneficiary,
                    birthYearOfbeneficiary  : validData.birthYearOfbeneficiary,
                    genderOfbeneficiary     : validData.genderOfbeneficiary,
                    uidNumber               : validData.uidNumber,
                    uploadTime              : validData.uploadTime,
                    relation                : validData.relation,
                    fileName                : validData.fileName,
                    createdAt               : new Date()
                });
                listOfbeneficiary.save()
                    .then(bendata=>{
                        resolve(bendata);
                        // console.log("ben",data);
                    })
                    .catch(err =>{
                        reject(err);
                        console.log("benefErr",err);
                    });
                    beneficiaryID = formBeneficiaryId(centerName, beneficiaryID)

            }else if (benPresent!==0 && duplicateUID===0 ){
                resolve({benPresent:benPresent, duplicate: true});
            }else if (benPresent===0 && duplicateUID!==0 ){
                resolve({duplicateUID:duplicateUID, duplicateBenUID: true});
            }else if (benPresent!==0 && duplicateUID!==0 ){
                resolve({benPresent:benPresent, duplicateUID:duplicateUID, duplicateBenUID: true, duplicate: true});
            }
        }
    });
}
function findBeneficiaryDuplicateUID(validData) {
    return new Promise(function(resolve,reject){  
    ListOfbeneficiary.findOne({
                                "center_ID"      : (validData.center_ID),
                                "uidNumber"      : (validData.uidNumber)
                            })
                .exec()
                .then(benObject=>{
                    // console.log('benObject===',benObject);
                    if(benObject){
                        resolve(benObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function findBeneficiary(validData) {
    return new Promise(function(resolve,reject){  
    ListOfbeneficiary.findOne({
                                "familyID"                 : (validData.familyID).trim(),
                                "surnameOfBeneficiary"     : (validData.surnameOfBeneficiary).trim(), 
                                "firstNameOfBeneficiary"   : (validData.firstNameOfBeneficiary).trim(), 
                                "middleNameOfBeneficiary"  : (validData.middleNameOfBeneficiary),
                                "center_ID"                : (validData.center_ID),
                                // "uidNumber"                : (validData.uidNumber)
                            })
                .exec()
                .then(benObject=>{
                    // console.log('benObject===',benObject);
                    if(benObject){
                        resolve(benObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function fetchAllBeneficiaries(center_ID){
    return new Promise((resolve,reject)=>{
        //console.log('Family_ID',familyID)
        ListOfbeneficiary.find({ center_ID:center_ID })
            .exec()
            .then(data=>{
                resolve(data);
            })
            .catch((err)=>{
                reject(err);
            })
    });
}
function fetchLatestBeneficiaryID(center_ID, centerName){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne({center_ID:center_ID})
           .sort({createdAt:-1})
           .exec()
           .then(member=>{
                var IDdetails = centerName.toUpperCase().slice(0,2)+'-BI-';
                if(member){
                    resolve(member.beneficiaryID)
                }else{
                    resolve(IDdetails+"000000")
                }
            })
            .catch(err=>{
                reject(err);
            })
    });
}
function formBeneficiaryId(centerName, lastBeneficiaryID){
        
        var IDdetails = centerName.toUpperCase().slice(0,2)+'-BI-';
        //console.log('spplit',lastBeneficiaryID.split('-BI-'))
        var lastbID = parseInt(lastBeneficiaryID.split('-BI-')[1]);
        //console.log('lastbID',lastbID)
        var bID = lastbID + 1;
        var bIDLength = (bID.toString()).length;
        
                var bID1 = '' + 0;
                while (bID1.length < 6-bIDLength) {
                    bID1 = '0' + bID1;
                }
                var beneficiaryID =  IDdetails+''+bID1+''+bID; 
                // console.log('beneficiaryID',beneficiaryID)
                return beneficiaryID;
}
var insertFailedRecords = async (invalidData,updateBadData) => {
    //console.log('updateBadData',updateBadData);
    return new Promise(function(resolve,reject){ 
    FailedRecords.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
            if(data.length>0){
                //console.log('data',data)   
                if (data[0].failedRecords.length>0) {
                    if (updateBadData) {
                        FailedRecords.updateOne({ fileName:invalidData.fileName},  
                        {   $set:   { 'failedRecords': [] } })
                        .then(data=>{
                        if(data.nModified == 1){
                            FailedRecords.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'failedRecords' : invalidData.FailedRecords } 
                                })
                            .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{ reject(err); });
                        }else{
                            resolve(0);
                        }
                        })
                        .catch(err =>{ reject(err); });
                    }else{
                        FailedRecords.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'failedRecords' : invalidData.FailedRecords } 
                                })
                            .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{ reject(err); });
                    } 

                }else{
                    FailedRecords.updateOne({ fileName:invalidData.fileName},  
                        {   $set:   {'totalRecords': invalidData.totalRecords},
                            $push:  { 'failedRecords' : invalidData.FailedRecords } 
                        })
                    .then(data=>{
                        if(data.nModified == 1){
                            resolve(data);
                        }else{
                            resolve(data);
                        }
                    })
                    .catch(err =>{ reject(err); });
                }
            }else{
                    const failedRecords = new FailedRecords({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    failedRecords           : invalidData.FailedRecords,
                    fileName                : invalidData.fileName,
                    totalRecords            : invalidData.totalRecords,
                    createdAt               : new Date()
                    });
                    
                    failedRecords
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }
            })  
    
    })            
}
exports.filedetails = (req,res,next)=>{
    var finaldata = {};
    //console.log(req.params.fileName)
    ListOfbeneficiary.find({center_ID: req.params.center_ID,fileName:req.params.fileName})
    .exec()
    .then(data=>{
        //finaldata.push({goodrecords: data})
        finaldata.goodrecords = data;
        FailedRecords.find({fileName:req.params.fileName})  
            .exec()
            .then(badData=>{
                finaldata.failedRecords = badData[0].failedRecords
                finaldata.totalRecords = badData[0].totalRecords
                res.status(200).json(finaldata);
            })
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_file = (req,res,next)=>{
    ListOfbeneficiary.aggregate([
                {
                  $match: {center_ID: req.body.center_ID  }
                },
                {
                    $group: {
                        _id : {
                            "fileName"   :"$fileName", 
                            "uploadTime" :"$uploadTime",
                        }, 
                        'count':{$sum:1} 
                    }  
                },
                {
                    $project: {    
                        "fileName"   :"$_id.fileName", 
                        "uploadTime" :"$_id.uploadTime",
                        'count'      : 1
                    }
                }
            ])
    .sort({"uploadTime":-1})
    .exec()
    .then(data=>{
        // console.log('data',data);
        res.status(200).json(data.slice(req.body.startRange, req.body.limitRange));

    // ListOfbeneficiary.find({center_ID: req.body.center_ID})
    // .exec()
    // .then(data=>{
    //     var x = _.unique(_.pluck(data, "fileName"));
    //         // console.log('x',x);
    //     var z = [];
    //     for(var i=0; i<x.length; i++){
    //         var y = data.filter((a)=> a.fileName == x[i]);
    //         // console.log('y',y);
    //         // console.log('x[i]',x[i]);
    //         z.push({
    //             "fileName": x[i] !== undefined ? x[i] : "Manual",
    //             'count': y.length,
    //             "_id" : x[i]
    //         })
    //         console.log('z',z);
    //     }
    //     res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_file_count = (req,res,next)=>{
    ListOfbeneficiary.find({center_ID: req.params.center_ID})
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'count': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.length);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_file = (req,res,next)=>{
    ListOfbeneficiary.deleteMany({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message" : "Beneficiaries of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  
};
