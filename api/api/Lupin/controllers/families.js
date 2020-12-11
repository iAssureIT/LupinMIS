const mongoose            = require("mongoose");
const _                   = require("underscore");
var   ObjectId            = require('mongodb').ObjectID;
const FailedRecords       = require('../models/failedRecords');
const Centers             = require('../models/centers');
const ListOfbeneficiary   = require('../models/beneficiaries');
const BeneficiaryFamilies = require('../models/families');
const ActivityReport      = require('../models/activityReport');

function pad_with_zeroes(number, length) {
  return new Promise((resolve,reject)=>{ 
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        resolve(my_string);
        // return my_string;
    })
}
function fetchFamilyID(center){
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.findOne({"center":center})
                                   .sort({createdAt:-1})
                                   .exec()
                                   .then(member=>{
                                        var IDdetails = center.toUpperCase().slice(0,2)+'-FI-';
                                        var familyID = "";
                                        if(member){
                                            var lastFamilyID = member.familyID;
                                            var lastfID = parseInt(lastFamilyID.split('-FI-')[1]);
                                            // console.log(lastfID)
                                            var fID = lastfID + 1;
                                            var fIDLength = (fID.toString()).length;
                                            padSTring();
                                            async function padSTring(){
                                                var fID1 = await pad_with_zeroes(0,6-fIDLength);
                                                // var familyID1 = BASE.substr(0, 6 - Math.ceil(fID / 10)) + fID ;
                                                var familyID1 =  fID1+''+fID; 
                                                resolve(IDdetails+''+familyID1);
                                                // var familyID = familyIDetails;
                                                //console.log("fID1",fID1,"familyID1",familyID1,"fID",fID, "familyID", familyID)
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
exports.create_beneficiaryFamilies = (req,res,next)=>{
    BeneficiaryFamilies.findOne({uidNumber : req.body.uidNumber})
        .exec()
        .then(data =>{
            // console.log(data, req.body.uidNumber );
            // if(data &&( req.body.uidNumber != "" || req.body.uidNumber != "-")&& req.body.uidNumber){
            if(data && req.body.uidNumber != "-" && req.body.uidNumber){
                res.status(200).json({message : "UID Already Exists"});
            }else{
                var center = req.body.center;
                getData();
                async function getData(){
                    var familyID = await fetchFamilyID(center);
                    const beneficiaryFamilies = new BeneficiaryFamilies({
                                _id             : new mongoose.Types.ObjectId(),                    
                                familyID        : familyID,
                                surnameOfFH     : req.body.surnameOfFH,
                                firstNameOfFH   : req.body.firstNameOfFH,
                                middleNameOfFH  : req.body.middleNameOfFH,
                                contactNumber   : req.body.contactNumber,
                                uidNumber       : req.body.uidNumber,
                                caste           : req.body.caste,
                                incomeCategory  : req.body.incomeCategory,
                                landCategory    : req.body.landCategory,
                                specialCategory : req.body.specialCategory,
                                FHGender        : req.body.FHGender,
                                FHYearOfBirth   : req.body.FHYearOfBirth,
                                center_ID       : req.body.center_ID,
                                center          : req.body.center,
                                state           : req.body.state,
                                dist            : req.body.dist,
                                block           : req.body.block,
                                village         : req.body.village,
                                createdAt           : new Date()
                            });
                        beneficiaryFamilies.save()
                        .then(data=>{   
                            // console.log("data.familyID",data.familyID,data._id);                         
                            getBenData();
                            async function getBenData(){
                                var beneficiaryID = await fetchBeneficiaryID(center);
                                // console.log("beneficiaryID", beneficiaryID);
                                const listOfbeneficiary = new ListOfbeneficiary({
                                    _id                     : new mongoose.Types.ObjectId(),    
                                    beneficiaryID           : beneficiaryID,
                                    family_ID               : data._id,
                                    familyID                : data.familyID,
                                    center_ID               : req.body.center_ID,
                                    center                  : req.body.center,
                                    surnameOfBeneficiary    : req.body.surnameOfFH,
                                    firstNameOfBeneficiary  : req.body.firstNameOfFH,
                                    middleNameOfBeneficiary : req.body.middleNameOfFH,
                                    birthYearOfbeneficiary  : req.body.FHYearOfBirth,
                                    genderOfbeneficiary     : req.body.FHGender,
                                    uidNumber               : req.body.uidNumber,
                                    relation                : "Self",
                                    createdAt               : new Date()
                                });
                                listOfbeneficiary.save()
                                    .then(data=>{
                                        // console.log("ben",data);
                                        // res.status(200).json({"message":"Beneficiary Details submitted Successfully"});
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                            }
                            res.status(200).json({
                                "message": "Family Details submitted Successfully."
                            });
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
function fetchBeneficiaryID(center){
    // console.log("center=============",center)
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
exports.update_beneficiaryFamilies = (req,res,next)=>{
    BeneficiaryFamilies.findOne({uidNumber : req.body.uidNumber})
                        .exec()
                        .then(data =>{
                            // if(data && (data._id != req.body.family_ID) && ( req.body.uidNumber != "" || req.body.uidNumber != "-")){
                            if(data && (data._id != req.body.family_ID) && req.body.uidNumber != "-"){
                                // console.log("data._id", data._id , "req.body.family_ID" ,req.body.family_ID);
                                res.status(200).json({message : "UID Already Exists"});
                            }else{
                                BeneficiaryFamilies.updateOne(
                                    { _id:req.body.family_ID},  
                                    {
                                        $set:{
                                            familyID        : req.body.familyID,
                                            surnameOfFH     : req.body.surnameOfFH,
                                            firstNameOfFH   : req.body.firstNameOfFH,
                                            middleNameOfFH  : req.body.middleNameOfFH,
                                            familyHead      : req.body.familyHead,
                                            contactNumber   : req.body.contactNumber,
                                            uidNumber       : req.body.uidNumber,
                                            caste           : req.body.caste,
                                            incomeCategory  : req.body.incomeCategory,
                                            landCategory    : req.body.landCategory,
                                            specialCategory : req.body.specialCategory,
                                            FHGender        : req.body.FHGender,
                                            FHYearOfBirth   : req.body.FHYearOfBirth,
                                            center          : req.body.center,
                                            state           : req.body.state,
                                            dist            : req.body.dist,
                                            block           : req.body.block,
                                            village         : req.body.village,
                                        }
                                    }
                                )
                                .exec()
                                .then(data=>{
                                    if(data.nModified == 1){
                                        res.status(200).json({
                                            "message": "Family Details updated Successfully."
                                        });
                                    }else{
                                        res.status(200).json({
                                            "message": "Family Details not modified"
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
exports.list_beneficiaryFamilies = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        BeneficiaryFamilies.find(query)
            .sort({"familyID":1})
            .exec()
            .then(data=>{
                // console.log("family",data);
                var allData = data.map((x, i)=>{
                    return {
                        "_id"                   : x._id,
                        "familyID"              : x.familyID,
                        "nameOfFH"              : x.surnameOfFH+" "+x.firstNameOfFH+" "+x.middleNameOfFH,
                        "surnameOfFH"           : x.surnameOfFH,
                        "firstNameOfFH"         : x.firstNameOfFH,
                        "middleNameOfFH"        : x.middleNameOfFH,
                        "familyHead"            : x.familyHead,
                        "contactNumber"         : x.contactNumber,
                        "uidNumber"             : x.uidNumber,
                        "caste"                 : x.caste,
                        "incomeCategory"        : x.incomeCategory,
                        "landCategory"          : x.landCategory,
                        "specialCategory"       : x.specialCategory,
                        "FHGender"              : x.FHGender,
                        "FHYearOfBirth"         : x.FHYearOfBirth,
                        "center"                : x.center,
                        "state"                 : x.state,
                        "dist"                  : x.dist,
                        "block"                 : x.block,
                        "village"               : x.village
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
exports.list_beneficiaryFamilies_with_limits = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID };
    }
    if(query != "1"){   
        BeneficiaryFamilies.find(query)
        .sort({"createdAt":-1})
        .exec()
        .then(data=>{

                var allData = data.map((x, i)=>{
                    return {
                        "_id"                   : x._id,
                        "familyID"              : x.familyID,
                        "surnameOfFH"           : x.surnameOfFH,
                        "firstNameOfFH"         : x.firstNameOfFH,
                        "middleNameOfFH"        : x.middleNameOfFH,
                        "nameOfFH"              : x.surnameOfFH+" "+x.firstNameOfFH+" "+x.middleNameOfFH,
                        "familyHead"            : x.familyHead,
                        "contactNumber"         : x.contactNumber,
                        "uidNumber"             : x.uidNumber,
                        "caste"                 : x.caste,
                        "incomeCategory"        : x.incomeCategory,
                        "landCategory"          : x.landCategory,
                        "specialCategory"       : x.specialCategory,
                        "FHGender"              : x.FHGender,
                        "FHYearOfBirth"         : x.FHYearOfBirth,
                        "center"                : x.center,
                        "state"                 : x.state,
                        "dist"                  : x.dist,
                        "block"                 : x.block,
                        "village"               : x.village
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
exports.count_beneficiaryFamilies = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        BeneficiaryFamilies.find(query)
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
exports.fetch_beneficiaryFamilies = (req,res,next)=>{
    BeneficiaryFamilies.find({_id : req.params.beneficiaryFamiliesID})       
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
exports.delete_beneficiaryFamilies = (req,res,next)=>{    
    var query = "1";
    query = {
                "listofBeneficiaries.family_ID" : req.params.beneficiaryFamiliesID
            };
    ActivityReport.find(query)
        .exec()
        .then(activityData=>{
            ListOfbeneficiary.find({family_ID : req.params.beneficiaryFamiliesID})
            .exec()
            .then(beneficiaryData=>{
                // console.log('beneficiaryData',beneficiaryData)
                // console.log('activityData',activityData)

                if(activityData.length>0 && beneficiaryData.length>0){
                    res.status(200).json({
                        "message" : "Family can not be deleted, It is already used in Beneficiary & Activity Report"
                    });
                }else if(activityData.length==0 && beneficiaryData.length>0){
                    res.status(200).json({
                        "message" : "Family can not be deleted, It is already used in Beneficiary"
                    });
                }else if(activityData.length>0  && beneficiaryData.length==0){
                    res.status(200).json({
                        "message" : "Family can not be deleted, It is already used in Activity Report"
                    });
                }else{    
                    BeneficiaryFamilies.deleteOne({_id:req.params.beneficiaryFamiliesID})
                    .exec()
                    .then(data=>{
                        res.status(200).json({"message":"Family deleted Successfully"});
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
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
function insert_families(family,center,center_ID, fileName){
  //  console.log('center',center)
  return new Promise(function(resolve,reject){
      // BeneficiaryFamilies.findOne({$or:[{uidNumber : family.uidNumber},{mfamilyID : family.familyID}])
    BeneficiaryFamilies.findOne({mfamilyID : family.familyID})
        .exec()
        .then(data =>{
            if(data){
                resolve(0);
            }else{
                // console.log('uidNumber',family.uidNumber)
                if (family.uidNumber != '-') {
                  BeneficiaryFamilies.findOne({uidNumber : family.uidNumber})
                    .exec()
                    .then(data =>{
                        // console.log('data',data)
                        if(data){
                            resolve(1);
                        }else{
                            getData();
                            async function getData(){
                                var familyID = await fetchFamilyID(center);
                                const beneficiaryFamilies = new BeneficiaryFamilies({
                                            _id             : new mongoose.Types.ObjectId(),                    
                                            familyID        : familyID,
                                            mfamilyID       : family.familyID,
                                            surnameOfFH     : family.surnameOfFH,
                                            firstNameOfFH   : family.firstNameOfFH,
                                            middleNameOfFH  : family.middleNameOfFH,
                                            contactNumber   : family.contactNumber,
                                            uidNumber       : family.uidNumber,
                                            caste           : family.caste,
                                            incomeCategory  : family.incomeCategory,
                                            landCategory    : family.landCategory,
                                            specialCategory : family.specialCategory,
                                            center_ID       : center_ID,
                                            center          : center,
                                            state           : family.state,
                                            dist            : family.dist,
                                            block           : family.block,
                                            village         : family.village,
                                            fileName        : fileName,
                                            createdAt       : new Date()
                                        });
                                beneficiaryFamilies.save()
                                    .then(family=>{
                                          resolve(family); 
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

                }else{
                    getData();
                            async function getData(){
                                var familyID = await fetchFamilyID(center);
                                const beneficiaryFamilies = new BeneficiaryFamilies({
                                            _id             : new mongoose.Types.ObjectId(),                    
                                            familyID        : familyID,
                                            mfamilyID       : family.familyID,
                                            surnameOfFH     : family.surnameOfFH,
                                            firstNameOfFH   : family.firstNameOfFH,
                                            middleNameOfFH  : family.middleNameOfFH,
                                            contactNumber   : family.contactNumber,
                                            uidNumber       : family.uidNumber,
                                            caste           : family.caste,
                                            incomeCategory  : family.incomeCategory,
                                            landCategory    : family.landCategory,
                                            specialCategory : family.specialCategory,
                                            center_ID       : center_ID,
                                            center          : center,
                                            state           : family.state,
                                            dist            : family.dist,
                                            block           : family.block,
                                            village         : family.village,
                                            fileName        : fileName,
                                            createdAt       : new Date()
                                        });
                                beneficiaryFamilies.save()
                                    .then(family=>{
                                          resolve(family); 
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        reject(err);
                                    });
                            }
                    
                }
            }
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    });
}
var fetchFamilyData = async (id) => {
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.find({_id : id})       
        .exec()
        .then(data=>{
            resolve(data);
        })
        .catch(err =>{
        });
    });
};
var fetch_center_data = async (centerID) => {
    return new Promise((resolve,reject)=>{
        Centers.find({_id : centerID})
        .exec()
        .then(data=>{
            resolve(data);
        })
        .catch(err =>{
        });
    });
};
exports.bulk_upload_families = (req,res,next)=>{
    var families = req.body.data;
    // console.log("families",families.length);
    var newfamilyLst = [];
    var validData = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    var beneficiaryFamiliesData = [];
    var uploadTime = new Date();
    getFamilyData();
    async function getFamilyData(){
        var lastFamilyID        = await fetchLatestFamilyID(req.body.reqdata.center_ID, req.body.reqdata.centerName);
        var fetch_center        = await fetch_center_data(req.body.reqdata.center_ID);
        familyID                = formFamilyId(req.body.reqdata.centerName, lastFamilyID)
        var lastBeneficiaryID   = await fetchLatestBeneficiaryID(req.body.reqdata.center_ID, req.body.reqdata.centerName);
        beneficiaryID           = formBeneficiaryId(req.body.reqdata.centerName, lastBeneficiaryID)
        beneficiaryFamiliesData = await fetchBeneficiaryFamilies(req.body.reqdata.center_ID);
        // console.log("familyID",familyID)
        for(var k = 0 ; k < families.length ; k++){
            // console.log("beneficiaryFamiliesData",beneficiaryFamiliesData,k)
            if (families[k].surnameOfFH == '-') {
                remark += "surnameOfFH not found, " ;  
            }
            if (families[k].firstNameOfFH == '-') {
                remark += "firstNameOfFH not found, " ;  
            }
            if (families[k].dist == '-') {
                remark += "district not found, " ;  
            }
            if (families[k].block == '-') {
                remark += "block not found, " ;  
            }
            if (families[k].village == '-') {
                remark += "village not found, " ;  
            }
            if (families[k].uidNumber != '-') {
                // console.log("families[k].uidNumber",families[k].uidNumber)
                if (typeof families[k].uidNumber != 'number') {
                    remark += "UID should be in number format, "; 
                }
                if (families[k].uidNumber.toString().replace(/ +/g, "").length != 12) {
                    remark += "UID should be 12 digit number " ;  
                }
            }
            if (families[k].contactNumber != '-') {
                if (typeof families[k].contactNumber != 'number') {
                    remark += "Contact Number should be in number format, "; 
                }
                if (families[k].contactNumber.toString().replace(/ +/g, "").length != 10) {
                    remark += "Contact Number should be 10 digit number " ;  
                }
            }
                var flag = beneficiaryFamiliesData.filter((data)=>{
                    // console.log("families[k]",families[k])
                    // console.log((data.firstNameOfFH) === (families[k].firstNameOfFH).trim())
                    // console.log((data.firstNameOfFH), (families[k].firstNameOfFH).trim())
                    // console.log((data.surnameOfFH) === (families[k].surnameOfFH).trim())
                    // console.log((data.surnameOfFH) , (families[k].surnameOfFH).trim())
                    // console.log((data.middleNameOfFH) === (families[k].middleNameOfFH) )
                    // console.log((data.middleNameOfFH) , (families[k].middleNameOfFH) )
                    // console.log((data.village) === (families[k].village).trim())
                    // console.log((data.village), (families[k].village).trim())
                    if ((data.firstNameOfFH) === (families[k].firstNameOfFH).trim() && (data.surnameOfFH) === (families[k].surnameOfFH).trim() && (data.middleNameOfFH) === (families[k].middleNameOfFH) && (data.village) === (families[k].village).trim() && (data.block) === (families[k].block).trim()) {
                        return data;
                    }
                })
                var districtLocation = fetch_center[0].villagesCovered.filter((data)=>{
                    if ((data.district.split('|')[0]).trim() === (families[k].dist).trim()) {
                        return data;
                    }
                })
                var blockLocation = fetch_center[0].villagesCovered.filter((data)=>{
                    if ((data.block).trim() === (families[k].block).trim()) {
                        return data;
                    }
                })
                var villageLocation = fetch_center[0].villagesCovered.filter((data)=>{
                    if ((data.village).trim() === (families[k].village).trim()) {
                        return data;
                    }
                })
                // console.log("flag.length",flag.length, "districtLocation.length ",districtLocation,  "blockLocation.length ",blockLocation,  "villageLocation.length ",villageLocation)
                // console.log('flag',flag)
                if (flag.length > 0 || districtLocation.length === 0 || blockLocation.length === 0 || villageLocation.length === 0) {
                    DuplicateCount++;
                    invalidObjects = families[k];
                    if(flag.length > 0){
                        remark += "Name of Family already exists in this village";
                    }else if(districtLocation.length == 0){
                        remark += "District is not available in this Center";
                    }else if(blockLocation.length == 0){
                        remark += "Block is not available in this Center";
                    }else if(villageLocation.length == 0){
                        remark += "Village is not available in this Center";
                    }
                    invalidObjects.failedRemark = remark;
                    invalidData.push(invalidObjects);
                    // console.log('remark',remark);
                }else{

                    var validObjects = [];
                    // if (families[k].uidNumber != '-') {
                        var flag2 = families[k].uidNumber !== '-' ? 
                                                    beneficiaryFamiliesData.filter((data)=>{
                                                        // if (data.uidNumber == (families[k].uidNumber)) {
                                                        if (data.uidNumber === (families[k].uidNumber)) {
                                                            return data;
                                                        }
                                                    })
                                                    : []
                        // console.log('flag2',flag2)
                        if (flag2.length===0) {
                            Count++;
                            validObjects = families[k];
                            validObjects.familyID   = familyID;
                            validObjects.center_ID  = req.body.reqdata.center_ID;
                            validObjects.center     = req.body.reqdata.centerName;
                            validObjects.fileName   = req.body.fileName;
                            validObjects.uploadTime = uploadTime;
                            validObjects.createdAt  = new Date();
                            // validData.push(validObjects); 
                            // console.log("validData",k,validData.length)
                            var addFamily = await insert_family(validObjects, req.body.reqdata.centerName)
                            if (addFamily.duplicate) {
                                if (families[k]) {
                                    DuplicateCount++;
                                    remark += "Duplicate Family found";
                                    invalidObjects = families[k];
                                    invalidObjects.failedRemark = remark;
                                    invalidData.push(invalidObjects);
                                    // console.log("invalidData",k,invalidData.length)
                                }
                            }else if (addFamily.duplicateFamilyUID) {
                                if (families[k]) {
                                    DuplicateCount++;
                                    remark += "Duplicate UID found";
                                    invalidObjects = families[k];
                                    invalidObjects.failedRemark = remark;
                                    invalidData.push(invalidObjects);
                                    // console.log("invalidData",k,invalidData.length)
                                }
                            }else if (addFamily.duplicate && addFamily.duplicateFamilyUID) {
                                if (families[k]) {
                                    DuplicateCount++;
                                    remark += "Duplicate Family && Duplicate UID found";
                                    invalidObjects = families[k];
                                    invalidObjects.failedRemark = remark;
                                    invalidData.push(invalidObjects);
                                    // console.log("invalidData",k,invalidData.length)
                                }
                            }
                            // console.log('validObjects',validObjects,k)
                        }else{
                            // console.log('flag2else',flag2)
                            DuplicateCount++;
                            remark += "family uidNumber should not be duplicate";
                            invalidObjects = families[k];
                            invalidObjects.failedRemark = remark;
                            invalidData.push(invalidObjects);
                            // console.log("invalidData",k,invalidData.length)
                        }
                }
            remark= '';
        }
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        // console.log("newfamilyLst",newfamilyLst);
        if(k >= families.length){
            //res.status(200).json({"uploadedData": newfamilyLst,"message":"Families Uploaded Successfully"})
        }
        var msgstr = "";
        if (DuplicateCount > 0 && Count > 0) {
            if (DuplicateCount > 1 && Count > 1) {
               msgstr =  " " + Count+" families are added successfully and "+"\n"+DuplicateCount+" families are duplicate";
            }
            else if(DuplicateCount ==1 && Count == 1 ){
                msgstr =  " " + Count+" family is added successfully and "+"\n"+DuplicateCount+" family is duplicate";
            }
            else if(DuplicateCount > 1 && Count == 1)
            {
                msgstr =  " " + Count+" family is added successfully and "+"\n"+DuplicateCount+" families are duplicate";
            }else if(DuplicateCount == 1 && Count > 1){
                msgstr =  " " + Count+" families are added successfully and "+"\n"+DuplicateCount+" family is duplicate";
            }
        }else if(DuplicateCount > 0 && Count == 0){
            if (DuplicateCount > 1) {
                msgstr = "Failed to add families as "+DuplicateCount+" families are duplicate";
            }else{
                msgstr = "Failed to add families as "+DuplicateCount+" family is duplicate";
            }     
        }else if(DuplicateCount == 0 && Count > 0){ 
            if (Count > 1) {
                msgstr = " " + Count+" families are added successfully";
            }else{
                msgstr = " " + Count+" family is added successfully";
            }            
        }else{
            msgstr = "Failed to add families";
        }
        res.status(200).json({
            "message": msgstr,
            "completed": true
        });
    }    
}
function insert_family(validData, centerName){
    return new Promise((resolve,reject)=>{ 
        duplicateControl();
        async function duplicateControl(){ 
            var familyPresent = await findfamily(validData);
            var duplicateUID = validData.uidNumber  !== '-' ? await findfamilyDuplicateUID(validData) : 0;
            // console.log('validData',validData)    
            if (familyPresent===0 && duplicateUID===0 ) {
                const beneficiaryFamilies = new BeneficiaryFamilies({
                    _id             : new mongoose.Types.ObjectId(),                    
                    familyID        : validData.familyID,
                    surnameOfFH     : validData.surnameOfFH.trim(),
                    firstNameOfFH   : validData.firstNameOfFH.trim(),
                    middleNameOfFH  : validData.middleNameOfFH,
                    contactNumber   : validData.contactNumber,
                    uidNumber       : validData.uidNumber,
                    caste           : validData.caste  !== "-" ? validData.caste.trim() : "-",
                    incomeCategory  : validData.incomeCategory  !== "-" ? validData.incomeCategory.trim() : "-",
                    landCategory    : validData.landCategory  !== "-" ? validData.landCategory.trim() : "-",
                    specialCategory : validData.specialCategory  !== "-" ? validData.specialCategory.trim() : "-",
                    FHGender        : validData.FHGender  !== "-" ? validData.FHGender.trim() : "-",
                    FHYearOfBirth   : validData.FHYearOfBirth,
                    center_ID       : validData.center_ID,
                    center          : validData.center,
                    state           : validData.state,
                    dist            : validData.dist.trim(),
                    block           : validData.block.trim(),
                    village         : validData.village.trim(),
                    fileName        : validData.fileName,
                    uploadTime      : validData.uploadTime,
                    createdAt       : new Date()
                });
                // console.log('beneficiaryFamilies',beneficiaryFamilies);
                beneficiaryFamilies.save()
                .then(data=>{   
                    // console.log("family********************",data);
                    // console.log("data.familyID",data.familyID,data._id,"beneficiaryID2",beneficiaryID);                         
                    if(data._id){
                        // console.log("beneficiaryID2",beneficiaryID)
                        const listOfbeneficiary = new ListOfbeneficiary({
                            _id                     : new mongoose.Types.ObjectId(),    
                            beneficiaryID           : beneficiaryID,
                            family_ID               : data._id,
                            familyID                : validData.familyID,
                            center_ID               : validData.center_ID,
                            center                  : validData.center,
                            surnameOfBeneficiary    : validData.surnameOfFH.trim(),
                            firstNameOfBeneficiary  : validData.firstNameOfFH.trim(),
                            middleNameOfBeneficiary : validData.middleNameOfFH,
                            birthYearOfbeneficiary  : validData.FHYearOfBirth,
                            genderOfbeneficiary     : validData.FHGender  !== "-" ? validData.FHGender.trim() : "-",
                            uidNumber               : validData.uidNumber,
                            uploadTime              : validData.uploadTime,
                            relation                : "Self",
                            fileName                : validData.fileName,
                            createdAt               : new Date()
                        });
                        listOfbeneficiary.save()
                            .then(bendata=>{
                                resolve(bendata);
                                // console.log("ben",bendata._id);
                            })
                            .catch(err =>{
                                console.log("benefErr",err);
                            });
                    }
                    getBenData();
                    async function getBenData(){
                        beneficiaryID = await formBeneficiaryId(centerName, beneficiaryID)
                        // console.log("beneficiaryID3",beneficiaryID)
                        familyID = await formFamilyId(centerName, familyID);
                        // console.log("familyID",familyID)
                    }
                })
                .catch(err =>{
                    reject(err);
                    console.log("FamilyErr",err);
                });
            }else if (familyPresent!==0 && duplicateUID===0 ){
                resolve({familyPresent:familyPresent, duplicate: true});
            }else if (familyPresent===0 && duplicateUID!==0 ){
                resolve({duplicateUID:duplicateUID, duplicateFamilyUID: true});
            }else if (familyPresent!==0 && duplicateUID!==0 ){
                resolve({familyPresent:familyPresent, duplicateUID:duplicateUID, duplicateFamilyUID: true, duplicate: true});
            }
        }
    });
}
function findfamilyDuplicateUID(validData) {
    return new Promise(function(resolve,reject){  
    BeneficiaryFamilies.findOne({
                                    "center_ID"      : (validData.center_ID),
                                    "uidNumber"      : (validData.uidNumber)
                                })
                .exec()
                .then(familyObject=>{
                    // console.log('familyObject===',familyObject);
                    if(familyObject){
                        resolve(familyObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function findfamily(validData) {
    return new Promise(function(resolve,reject){  
    BeneficiaryFamilies.findOne({
                                    "firstNameOfFH"  : (validData.firstNameOfFH).trim(), 
                                    "surnameOfFH"    : (validData.surnameOfFH).trim(), 
                                    "middleNameOfFH" : (validData.middleNameOfFH), 
                                    "village"        : (validData.village).trim(),
                                    "block"          : (validData.block).trim(),
                                    "center_ID"      : (validData.center_ID),
                                    // "uidNumber"      : (validData.uidNumber)
                                })
                .exec()
                .then(familyObject=>{
                    // console.log('familyObject===',familyObject);
                    if(familyObject){
                        resolve(familyObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
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
function fetchLatestFamilyID(center_ID, centerName){
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.findOne({center_ID:center_ID})
           .sort({createdAt:-1})
           .exec()
           .then(member=>{
                var IDdetails = centerName.toUpperCase().slice(0,2)+'-FI-';
                if(member){
                    resolve(member.familyID)
                }else{
                    resolve(IDdetails+"000000")
                }
            })
            .catch(err=>{
                reject(err);
            })
    });
}
function formFamilyId(centerName, lastFamilyID){
        var IDdetails = centerName.toUpperCase().slice(0,2)+'-FI-';
        var lastfID = lastFamilyID ? parseInt(lastFamilyID.split('-FI-')[1]) : 0;
        var fID = lastfID + 1;
        var fIDLength = (fID.toString()).length;
                var fID1 = '' + 0;
                while (fID1.length < 6-fIDLength) {
                    fID1 = '0' + fID1;
                }
                var familyID =  IDdetails+''+fID1+''+fID; 
                // console.log("familyID",familyID)
                return familyID;
}
var fetchBeneficiaryFamilies = async (center_ID)=>{
    return new Promise(function(resolve,reject){ 
        BeneficiaryFamilies.find({center_ID:center_ID})
        .exec()
        .then(data=>{
            resolve(data);            
        })
        .catch(err =>{
            console.log(err);
            reject(err); 
        });
    })
}
var insertFailedRecords = async (invalidData,updateBadData) => {
    //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
    FailedRecords.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
            if(data.length>0){
                //console.log('data',data[0].failedRecords.length)   
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
    BeneficiaryFamilies.find({center_ID: req.params.center_ID,fileName:req.params.fileName})
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
    BeneficiaryFamilies.aggregate([
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


    // BeneficiaryFamilies.find({center_ID: req.body.center_ID})
    // .exec()
    // .then(data=>{
    //     var x = _.unique(_.pluck(data, "fileName"));
    //     var z = [];
    //     for(var i=0; i<x.length; i++){
    //         var y = data.filter((a)=> a.fileName == x[i]);
    //         z.push({
    //             "fileName": x[i] !== undefined ? x[i] : "Manual",
    //             'count': y.length,
    //             "_id" : x[i]
    //         })
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
    BeneficiaryFamilies.find({center_ID: req.params.center_ID})
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
    BeneficiaryFamilies.deleteMany({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
    .exec()
    .then(data=>{
        // console.log('data',data);
            ListOfbeneficiary.deleteMany({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
            .exec()
            .then(bendata=>{
                // console.log('bendata',bendata);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });  
        res.status(200).json({
            "message" : "Families of file "+req.params.fileName+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.family_search = (req,res,next)=>{
    // console.log("req.body.searchText",req.body.searchText);
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(req.body.searchText){
        BeneficiaryFamilies.find(
            {
                $and:[
                    {$or:[
                        {"familyID"       :   { "$regex": req.body.searchText, $options: "i"}},
                        {"surnameOfFH"    :   { "$regex": req.body.searchText, $options: "i"}},
                        {"firstNameOfFH"  :   { "$regex": req.body.searchText, $options: "i"}},
                        {"middleNameOfFH" :   { "$regex": req.body.searchText, $options: "i"}},
                        {"contactNumber"  :   { "$regex": req.body.searchText, $options: "i"}},
                        {"uidNumber"      :   { "$regex": req.body.searchText, $options: "i"}},
                        {"caste"           :   { "$regex": req.body.searchText, $options: "i"}},
                        {"incomeCategory"  :   { "$regex": req.body.searchText, $options: "i"}},
                        {"specialCategory" :   { "$regex": req.body.searchText, $options: "i"}},
                        {"landCategory"    :   { "$regex": req.body.searchText, $options: "i"}},
                        {"dist"            :   { "$regex": req.body.searchText, $options: "i"}},
                        {"block"           :   { "$regex": req.body.searchText, $options: "i"}},
                        {"village"         :   { "$regex": req.body.searchText, $options: "i"}},
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
};

exports.list_beneficiary_centerwise = (req,res,next) =>{
    var selector = {};
    selector["$and"] = [];
    if(req.body.center_ID != "all"){
        selector["$and"].push({"center_ID" : req.body.center_ID})
    }
    if(req.body.district != "all"){
        selector["$and"].push({"dist": req.body.district})
    }
    if(req.body.blocks != "all"){
        selector["$and"].push({"block": req.body.blocks})
    }
    if(req.body.village != "all"){
        selector["$and"].push({"village": req.body.village})
    }
    if(req.body.caste != "all"){
        selector["$and"].push({"caste" : req.body.caste})
    }
    if(req.body.specialCategory != "all"){
        selector["$and"].push({"specialCategory": req.body.specialCategory})
    }
    if(req.body.landCategory != "all"){
        selector["$and"].push({"landCategory": req.body.landCategory})
    }
    if(req.body.incomeCategory != "all"){
        selector["$and"].push({"incomeCategory": req.body.incomeCategory})
    }
    if(req.body.searchText!="all"){
        selector["$and"].push({ $or:
                                    [
                                        {"familyID"       :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"surnameOfFH"    :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"firstNameOfFH"  :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"middleNameOfFH" :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"contactNumber"  :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"uidNumber"      :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"caste"           :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"incomeCategory"  :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"specialCategory" :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"landCategory"    :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"dist"            :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"block"           :   { "$regex": req.body.searchText, $options: "i"}},
                                        {"village"         :   { "$regex": req.body.searchText, $options: "i"}},
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
        limit = 10000000
    }
    // var query = { $match : selector};
    // console.log("selector ",selector);
    // console.log("query ",query);
    BeneficiaryFamilies.find(selector)
            .skip(skip)
            .limit(limit)
            .sort({"familyID":1})
            .exec()
            .then(data=>{
                // console.log("family",data);
                var allData = data.map((x, i)=>{
                    return {
                        "_id"                   : x._id,
                        "familyID"              : x.familyID,
                        "surnameOfFH"           : x.surnameOfFH,
                        "firstNameOfFH"         : x.firstNameOfFH,
                        "middleNameOfFH"        : x.middleNameOfFH,
                        "nameOfFH"              : x.surnameOfFH+" "+x.firstNameOfFH+" "+x.middleNameOfFH,
                        "familyHead"            : x.familyHead,
                        "contactNumber"         : x.contactNumber,
                        "uidNumber"             : x.uidNumber,
                        "caste"                 : x.caste,
                        "incomeCategory"        : x.incomeCategory,
                        "landCategory"          : x.landCategory,
                        "specialCategory"       : x.specialCategory,
                        "FHGender"              : x.FHGender,
                        "FHYearOfBirth"         : x.FHYearOfBirth,
                        "center"                : x.center,
                        "state"                 : x.state,
                        "dist"                  : x.dist,
                        "block"                 : x.block,
                        "village"               : x.village,
                        "isUpgraded"            : x.isUpgraded
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
exports.bulk_upload_families_OLD = (req,res,next)=>{
    var families = req.body.data;
    // console.log("families",families.length);
    var newfamilyLst = [];
    var validData = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    var uploadTime = new Date();
    getFamilyData();
    async function getFamilyData(){
        var beneficiaryFamiliesData = await fetchBeneficiaryFamilies(req.body.reqdata.center_ID);
        var lastFamilyID        = await fetchLatestFamilyID(req.body.reqdata.center_ID, req.body.reqdata.centerName);
        var fetch_center        = await fetch_center_data(req.body.reqdata.center_ID);
        familyID                = formFamilyId(req.body.reqdata.centerName, lastFamilyID)
        var lastBeneficiaryID   = await fetchLatestBeneficiaryID(req.body.reqdata.center_ID, req.body.reqdata.centerName);
        beneficiaryID           = formBeneficiaryId(req.body.reqdata.centerName, lastBeneficiaryID)
        // console.log("beneficiaryID1",beneficiaryID)
        for(var k = 0 ; k < families.length ; k++){
            if (families[k].surnameOfFH == '-') {
                remark += "surnameOfFH not found, " ;  
            }
            if (families[k].firstNameOfFH == '-') {
                remark += "firstNameOfFH not found, " ;  
            }
            if (families[k].dist == '-') {
                remark += "district not found, " ;  
            }
            if (families[k].block == '-') {
                remark += "block not found, " ;  
            }
            if (families[k].village == '-') {
                remark += "village not found, " ;  
            }
            if (families[k].uidNumber != '-') {
                // console.log(families[k])
                if (families[k].uidNumber.toString().replace(/ +/g, "").length != 12) {
                    remark += "UID should be 12 digit number " ;  
                }
            }
            if (families[k].contactNumber != '-') {
                if (families[k].contactNumber.toString().replace(/ +/g, "").length != 10) {
                    remark += "contactNumber should be 10 digit number " ;  
                }
            }
            if (remark == '') {
                var flag = beneficiaryFamiliesData.filter((data)=>{
                    if ((data.firstNameOfFH) == (families[k].firstNameOfFH).trim() && (data.surnameOfFH) == (families[k].surnameOfFH).trim() && (data.middleNameOfFH) == (families[k].middleNameOfFH).trim()) {
                        return data;
                    }
                })
                var districtLocation = fetch_center[0].villagesCovered.filter((data)=>{
                    if ((data.district.split('|')[0]).trim() == (families[k].dist).trim()) {
                        return data;
                    }
                })
                var blockLocation = fetch_center[0].villagesCovered.filter((data)=>{
                    if ((data.block).trim() == (families[k].block).trim()) {
                        return data;
                    }
                })
                var villageLocation = fetch_center[0].villagesCovered.filter((data)=>{
                    if ((data.village).trim() == (families[k].village).trim()) {
                        return data;
                    }
                })
                // console.log("flag.length",flag.length, "districtLocation.length ",districtLocation,  "blockLocation.length ",blockLocation,  "villageLocation.length ",villageLocation)
                // console.log('flag',flag)
                if (flag.length > 0 || districtLocation.length == 0 || blockLocation.length == 0 || villageLocation.length == 0) {
                    DuplicateCount++;
                    invalidObjects = families[k];
                    if(flag.length > 0){
                        remark += "Name of Family already exists in this village";
                    }else if(districtLocation.length == 0){
                        remark += "District is not available in this Center";
                    }else if(blockLocation.length == 0){
                        remark += "Block is not available in this Center";
                    }else if(villageLocation.length == 0){
                        remark += "Village is not available in this Center";
                    }
                    invalidObjects.failedRemark = remark;
                    invalidData.push(invalidObjects);
                    // console.log('remark',remark);
                }else{
                    var validObjects = [];
                    if (families[k].uidNumber != '-') {
                        var flag2 = beneficiaryFamiliesData.filter((data)=>{
                            if (data.uidNumber == (families[k].uidNumber)) {
                                return data;
                            }
                        })
                        // console.log('flag2',flag2)
                        if (flag2.length>0) {
                            DuplicateCount++;
                            remark += "family uidNumber should not be duplicate";
                            invalidObjects = families[k];
                            invalidObjects.failedRemark = remark;
                            invalidData.push(invalidObjects);
                        }else{
                            // console.log('flag2else',flag2)
                            Count++;
                            validObjects = families[k];
                            validObjects.familyID   = familyID;
                            validObjects.center_ID  = req.body.reqdata.center_ID;
                            validObjects.center     = req.body.reqdata.centerName;
                            validObjects.fileName   = req.body.fileName;
                            validObjects.uploadTime = uploadTime;
                            validObjects.createdAt  = new Date();
                            validData.push(validObjects); 
                            familyID = formFamilyId(req.body.reqdata.centerName, familyID);
                        }
                    }else{
                        Count++;
                        validObjects = families[k];
                        validObjects.familyID   = familyID;
                        validObjects.center_ID  = req.body.reqdata.center_ID;
                        validObjects.center     = req.body.reqdata.centerName;
                        validObjects.fileName   = req.body.fileName;
                        validObjects.uploadTime = uploadTime;
                        validObjects.createdAt  = new Date();
                        validData.push(validObjects);  
                        familyID = formFamilyId(req.body.reqdata.centerName, familyID) 
                    }
                }
            }else{
                invalidObjects = families[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }
        if(validData){
            for(var i = 0 ; i < validData.length ; i++){
                // console.log('validObjects',familyID,validObjects);
                const beneficiaryFamilies = new BeneficiaryFamilies({
                    _id             : new mongoose.Types.ObjectId(),                    
                    familyID        : validData[i].familyID,
                    surnameOfFH     : validData[i].surnameOfFH,
                    firstNameOfFH   : validData[i].firstNameOfFH,
                    middleNameOfFH  : validData[i].middleNameOfFH,
                    contactNumber   : validData[i].contactNumber,
                    uidNumber       : validData[i].uidNumber,
                    caste           : validData[i].caste,
                    incomeCategory  : validData[i].incomeCategory,
                    landCategory    : validData[i].landCategory,
                    specialCategory : validData[i].specialCategory,
                    FHGender        : validData[i].FHGender,
                    FHYearOfBirth   : validData[i].FHYearOfBirth,
                    center_ID       : validData[i].center_ID,
                    center          : validData[i].center,
                    state           : validData[i].state,
                    dist            : validData[i].dist,
                    block           : validData[i].block,
                    village         : validData[i].village,
                    fileName        : validData[i].fileName,
                    uploadTime      : validData[i].uploadTime,
                    createdAt       : new Date()
                });
                // console.log('beneficiaryFamilies',beneficiaryFamilies);
                beneficiaryFamilies.save()
                .then(data=>{   
                    // console.log("family",data);
                    // console.log("data.familyID",data.familyID,data._id);                         
                    getBenData();
                    async function getBenData(){
                        // console.log("beneficiaryID2",beneficiaryID)
                        const listOfbeneficiary = new ListOfbeneficiary({
                            _id                     : new mongoose.Types.ObjectId(),    
                            beneficiaryID           : beneficiaryID,
                            family_ID               : data._id,
                            familyID                : data.familyID,
                            center_ID               : data.center_ID,
                            center                  : data.center,
                            surnameOfBeneficiary    : data.surnameOfFH,
                            firstNameOfBeneficiary  : data.firstNameOfFH,
                            middleNameOfBeneficiary : data.middleNameOfFH,
                            birthYearOfbeneficiary  : data.FHYearOfBirth,
                            genderOfbeneficiary     : data.FHGender,
                            uidNumber               : data.uidNumber,
                            uploadTime              : data.uploadTime,
                            relation                : "Self",
                            fileName                : data.fileName,
                            createdAt               : new Date()
                        });
                        listOfbeneficiary.save()
                            .then(data=>{
                                // console.log("ben",data);
                            })
                            .catch(err =>{
                                console.log("benefErr",err);
                            });
                        beneficiaryID = formBeneficiaryId(req.body.reqdata.centerName, beneficiaryID)
                        // console.log("beneficiaryID3",beneficiaryID)
                    }
                })
                .catch(err =>{
                    console.log("FamilyErr",err);
                });
                // familyID = formFamilyId(req.body.reqdata.centerName, familyID) 
            }
        }
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        // console.log("newfamilyLst",newfamilyLst);
        if(k >= families.length){
            //res.status(200).json({"uploadedData": newfamilyLst,"message":"Families Uploaded Successfully"})
        }
        var msgstr = "";
        if (DuplicateCount > 0 && Count > 0) {
            if (DuplicateCount > 1 && Count > 1) {
               msgstr =  " " + Count+" families are added successfully and "+"\n"+DuplicateCount+" families are duplicate";
            }
            else if(DuplicateCount ==1 && Count == 1 ){
                msgstr =  " " + Count+" family is added successfully and "+"\n"+DuplicateCount+" family is duplicate";
            }
            else if(DuplicateCount > 1 && Count == 1)
            {
                msgstr =  " " + Count+" family is added successfully and "+"\n"+DuplicateCount+" families are duplicate";
            }else if(DuplicateCount == 1 && Count > 1){
                msgstr =  " " + Count+" families are added successfully and "+"\n"+DuplicateCount+" family is duplicate";
            }
        }else if(DuplicateCount > 0 && Count == 0){
            if (DuplicateCount > 1) {
                msgstr = "Failed to add families as "+DuplicateCount+" families are duplicate";
            }else{
                msgstr = "Failed to add families as "+DuplicateCount+" family is duplicate";
            }     
        }else if(DuplicateCount == 0 && Count > 0){ 
            if (Count > 1) {
                msgstr = " " + Count+" families are added successfully";
            }else{
                msgstr = " " + Count+" family is added successfully";
            }            
        }else{
            msgstr = "Failed to add families";
        }
        res.status(200).json({
            "message": msgstr,
            "completed": true
        });
    }    
}