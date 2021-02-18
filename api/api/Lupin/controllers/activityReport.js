const mongoose	= require("mongoose");
const ActivityReport = require('../models/activityReport');
const BeneficiaryFamilies = require('../models/families');
const ListOfbeneficiary = require('../models/beneficiaries');
const Sectors   = require('../models/sectors');
const FailedRecords = require('../models/failedRecords');
const _         = require("underscore");
const moment    = require('moment');

exports.create_activityReport = (req,res,next)=>{
    getData();
    async function getData(){
        var beneficiaries = req.body.listofBeneficiaries;
        for (var i = 0; i < beneficiaries.length; i++) {
            var upgradefamily      = await upgradeFamily(beneficiaries[i]);
            var upgradebeneficiary = await upgradeBeneficiary(beneficiaries[i]);
            // console.log('upgradefamily',upgradefamily);
            // console.log('upgradebeneficiary',upgradebeneficiary);
            beneficiaries[i].isUpgraded = upgradefamily == false ? "No" : upgradefamily;
        }
    	ActivityReport.find() 
    		.exec()
    		.then(data =>{ 
				const activityReport = new ActivityReport({
                    _id                 : new mongoose.Types.ObjectId(),    
                    center_ID           : req.body.center_ID,
                    centerName          : req.body.centerName,
                    projectCategoryType : req.body.projectCategoryType,
                    projectName         : req.body.projectName,
                    type                : req.body.type,
                    // stateCode           : req.body.stateCode,
                    district            : req.body.district,
                    block               : req.body.block,
                    village             : req.body.village,
                    location            : req.body.location,
                    date                : req.body.date,
                    sector_ID           : req.body.sector_ID,
                    sectorName          : req.body.sectorName,
                    typeofactivity      : req.body.typeofactivity,
                    activity_ID         : req.body.activity_ID,
                    activityName        : req.body.activityName,
                    subactivity_ID      : req.body.subactivity_ID,
                    subactivityName     : req.body.subactivityName,
                    unit                : req.body.unit,
                    unitCost            : req.body.unitCost,
                    noOfBeneficiaries   : req.body.noOfBeneficiaries,
                    quantity            : req.body.quantity,
                    totalCost           : req.body.totalCost,                
                    sourceofFund        : {
                                            LHWRF               : req.body.LHWRF,
                                            NABARD              : req.body.NABARD,
                                            bankLoan            : req.body.bankLoan,
                                            govtscheme          : req.body.govtscheme,
                                            directCC            : req.body.directCC,
                                            indirectCC          : req.body.indirectCC,
                                            other               : req.body.other,
                                            total               : req.body.total
                                          },
                    listofBeneficiaries : beneficiaries,
                    remark              : req.body.remark,
                    createdAt           : new Date()
                });
                activityReport.save()
                .then(data=>{
                    getActivityData();
                    async function getActivityData(){
                        var activity_id = data._id
                        // console.log('activity_id',activity_id);
                        var beneficiaries = req.body.listofBeneficiaries;
                        for (var i = 0; i < beneficiaries.length; i++) {                            
                            // console.log('upgradefamily1',upgradefamily);
                            // console.log('upgradebeneficiary1',upgradebeneficiary);
                            if(upgradefamily != false){
                                var updatefamily       = await updateFamilywithActivityID(beneficiaries[i].family_ID,activity_id);
                            }
                            if(upgradebeneficiary != false){
                                var updatebeneficiary  = await updateBeneficiary(beneficiaries[i].beneficiary_ID,activity_id);
                            }
                            // console.log('updatefamily',updatefamily);
                            // console.log('updatebeneficiary',updatebeneficiary);
                        }
                        res.status(200).json({"message":"Activity Report Details submitted Successfully."});
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
    }
};
function updateFamilywithActivityID(family_ID, activity_id){
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.updateOne(
            { _id:family_ID},  
            {
                $set:{
                    upgradedInActivity  : activity_id,
                }
            }
        )
        .then(familydata =>{
            // console.log('familydata',familydata);
            resolve(familydata);
        })
        .catch(err =>{
            console.log(err);
        });
    });
}
function updateBeneficiary(beneficiary_ID, activity_id){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.updateOne(
            { _id : beneficiary_ID},  
            {
                $set:{
                    upgradedInActivity  : activity_id,
                }
            }
        )
        .then(bendata =>{
            // console.log('bendata',bendata);
            resolve(bendata);
        })
        .catch(err =>{
            console.log(err);
        });
    });
}
function upgradeFamilyBeforeUpdating(beneficiaryObject, activityReport_ID){
    // console.log('beneficiaryObject',beneficiaryObject);
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.findOne({ _id : beneficiaryObject.family_ID})
        .exec()
        .then(data =>{
            if(data.isUpgraded === "Yes"){
                BeneficiaryFamilies.findOne(
                    { _id:beneficiaryObject.family_ID},  
                )
                .then(familydata =>{
                    // console.log("activityReport_ID === familydata.upgradedInActivity ",activityReport_ID === familydata.upgradedInActivity ,activityReport_ID ,"===", familydata.upgradedInActivity )
                    if(activityReport_ID === familydata.upgradedInActivity ){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                })
                .catch(err =>{
                    console.log(err);
                });
            }else{
                BeneficiaryFamilies.updateOne(
                    { _id:beneficiaryObject.family_ID},  
                    {
                        $set:{
                            isUpgraded        : beneficiaryObject.isUpgraded,
                        }
                    }
                )
                .then(familydata =>{
                    // console.log('familydata',familydata._id,familydata)
                    resolve(beneficiaryObject.isUpgraded);
                })
                .catch(err =>{
                    console.log(err);
                });
            }
        })
        .catch(err =>{
            reject(err);
        });                 
    });
}

function upgradeBeneficiaryBeforeUpdating(beneficiaryObject, activityReport_ID){
    // console.log('beneficiaryObject',beneficiaryObject);
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne({ _id : beneficiaryObject.beneficiary_ID})
        .exec()
        .then(data =>{
            if(data.isUpgraded == "Yes"){
                ListOfbeneficiary.findOne(
                    { _id : beneficiaryObject.beneficiary_ID},  
                )
                .then(bendata =>{
                    // console.log("activityReport_ID === bendata.upgradedInActivity ",activityReport_ID === bendata.upgradedInActivity ,activityReport_ID ,"===", bendata.upgradedInActivity )
                    if(activityReport_ID === bendata.upgradedInActivity ){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                })
                .catch(err =>{
                    console.log(err);
                });
            }else{
                ListOfbeneficiary.updateOne(
                    { _id : beneficiaryObject.beneficiary_ID},  
                    {
                        $set:{
                            isUpgraded        : beneficiaryObject.isUpgraded,
                        }
                    }
                )
                .exec()
                .then(bendata=>{
                    // console.log('bendata',bendata);
                    resolve(beneficiaryObject.isUpgraded);
                })
                .catch(err =>{
                    console.log(err);
                });
            }
        })
        .catch(err =>{
            reject(err);
        });                 
    });
}

exports.update_activityReport = (req,res,next)=>{
    getData();
    async function getData(){
        var beneficiaries = req.body.listofBeneficiaries;
        for (var i = 0; i < beneficiaries.length; i++) {
            var upgradefamily      = await upgradeFamilyBeforeUpdating(beneficiaries[i], req.body.activityReport_ID);
            var upgradebeneficiary = await upgradeBeneficiaryBeforeUpdating(beneficiaries[i], req.body.activityReport_ID);
            console.log('upgradefamily',upgradefamily);
            // console.log('upgradebeneficiary',upgradebeneficiary);
            beneficiaries[i].isUpgraded = upgradefamily === true ? "Yes" : "No";
            console.log('beneficiaries[i].isUpgraded',beneficiaries[i].isUpgraded)
        }
        ActivityReport.updateOne(
                { _id:req.body.activityReport_ID},  
                {
                    $set:{
                        center_ID           : req.body.center_ID,
                        centerName          : req.body.centerName,
                        // stateCode           : req.body.stateCode,
                        district            : req.body.district,
                        projectCategoryType : req.body.projectCategoryType,
                        projectName         : req.body.projectName,
                        type                : req.body.type,
                        block               : req.body.block,
                        village             : req.body.village,
                        location            : req.body.location,
                        date                : req.body.date,
                        sector_ID           : req.body.sector_ID,
                        sectorName          : req.body.sectorName,
                        typeofactivity      : req.body.typeofactivity,
                        activity_ID         : req.body.activity_ID,
                        activityName        : req.body.activityName,
                        subactivity_ID      : req.body.subactivity_ID,
                        subactivityName     : req.body.subactivityName,
                        unit                : req.body.unit,
                        unitCost            : req.body.unitCost,
                        quantity            : req.body.quantity,
                        noOfBeneficiaries   : req.body.noOfBeneficiaries,
                        totalCost           : req.body.totalCost,                
                        sourceofFund        : {
                                                LHWRF               : req.body.LHWRF,
                                                NABARD              : req.body.NABARD,
                                                bankLoan            : req.body.bankLoan,
                                                govtscheme          : req.body.govtscheme,
                                                directCC            : req.body.directCC,
                                                indirectCC          : req.body.indirectCC,
                                                other               : req.body.other,
                                                total               : req.body.total
                                              },
                        listofBeneficiaries : beneficiaries,
                        remark              : req.body.remark,
                        createdAt           : new Date()
                    }
                }
            )
            .exec()
            .then(data=>{

                getActivityData();
                async function getActivityData(){
                    var activity_id = data._id
                    // console.log('activity_id',activity_id);
                    var beneficiaries = req.body.listofBeneficiaries;
                    for (var i = 0; i < beneficiaries.length; i++) {                            
                        // console.log('upgradefamily1',upgradefamily);
                        // console.log('upgradebeneficiary1',upgradebeneficiary);
                        if(upgradefamily === true){
                            var updatefamily       =  await updateFamilywithActivityID(beneficiaries[i].family_ID,activity_id);
                        }
                        if(upgradebeneficiary === true){
                            var updatebeneficiary  = await updateBeneficiary(beneficiaries[i].beneficiary_ID,activity_id);
                        }
                        // console.log('updatefamily',updatefamily);
                        // console.log('updatebeneficiary',updatebeneficiary);
                    }
                    if(data.nModified == 1){
                            res.status(200).json({
                                "message": "Activity Report Details updated Successfully."
                            });
                    }else{
                        res.status(200).json({
                            "message": "Activity Report Details not modified"
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
    }
};

function upgradeFamily(beneficiaryObject){
    // console.log('beneficiaryObject',beneficiaryObject);
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.findOne({ _id : beneficiaryObject.family_ID})
        .exec()
        .then(data =>{
            if(data.isUpgraded === "Yes"){
                // console.log("data.isUpgraded", data.isUpgraded);
                resolve(false);
            }else{
                BeneficiaryFamilies.updateOne(
                    { _id:beneficiaryObject.family_ID},  
                    {
                        $set:{
                            isUpgraded        : beneficiaryObject.isUpgraded,
                        }
                    }
                )
                .then(familydata =>{
                    // console.log('familydata',familydata._id,familydata)
                    resolve(beneficiaryObject.isUpgraded);
                })
                .catch(err =>{
                    console.log(err);
                });
            }
        })
        .catch(err =>{
            reject(err);
        });                 
    });
}
function upgradeBeneficiary(beneficiaryObject){
    // console.log('beneficiaryObject',beneficiaryObject);
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne({ _id : beneficiaryObject.beneficiary_ID})
        .exec()
        .then(data =>{
            if(data.isUpgraded == "Yes"){
                // console.log("data.isUpgraded", data.isUpgraded);
                resolve(false);
            }else{
                ListOfbeneficiary.updateOne(
                    { _id : beneficiaryObject.beneficiary_ID},  
                    {
                        $set:{
                            isUpgraded        : beneficiaryObject.isUpgraded,
                        }
                    }
                )
                .exec()
                .then(bendata=>{
                    // console.log('bendata',bendata);
                    resolve(beneficiaryObject.isUpgraded);
                })
                .catch(err =>{
                    console.log(err);
                });
            }
        })
        .catch(err =>{
            reject(err);
        });                 
    });
}
exports.list_activityReport = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){   
        ActivityReport.find(query)
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
exports.list_activityReport_with_limits = (req,res,next)=>{
    var query = "1";
    if(req.params.center_ID === 'all'){
        query = {};
    }else{
        query = { "center_ID" : req.params.center_ID};
    }
    if(query != "1"){
        ActivityReport.find(query)
        .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            if(data){
                var alldata = data.map((a, i)=>{
                    // console.log("a ",a);
                    return {
                        "_id"                   : a._id,
                        "centerName"            : a.centerName,
                        "date"                  : a.date,
                        "district"              : a.district,
                        "block"                 : a.block,
                        "village"               : a.village,
                        "location"              : a.location,
                        "place"                 : "<div class='Width100 text-left'>"+a.district+", "+a.block+", "+a.village+ (a.location ? ", "+a.location : "")+"</div>",
                        "stateCode"             : a.stateCode,
                        "sectorName"            : a.sectorName,
                        "activity"              : '<p class="wrapText">Name: '+a.activityName+'</p><p> Type: '+a.typeofactivity+'</p>',
                        "typeofactivity"        : a.typeofactivity,
                        "activityName"          : a.activityName,
                        "subactivityName"       : '<div class="wrapText">'+a.subactivityName+'</p>',
                        "projectName"           : a.projectName,
                        "projectCategoryType"   : a.projectCategoryType,
                        "type"                  : a.type,
                        "unit"                  : a.unit,
                        "unitCost"              : (a.unitCost).toFixed(2),
                        "noOfBeneficiaries"     : a.noOfBeneficiaries,
                        "quantity"              : a.quantity,
                        "totalCost"             : a.totalCost,     
                        "LHWRF"                 : a.sourceofFund.LHWRF,
                        "NABARD"                : a.sourceofFund.NABARD,
                        "bankLoan"              : a.sourceofFund.bankLoan,
                        "govtscheme"            : a.sourceofFund.govtscheme,
                        "directCC"              : a.sourceofFund.directCC,
                        "indirectCC"            : a.sourceofFund.indirectCC,
                        "other"                 : a.sourceofFund.other,
                        "total"                 : a.sourceofFund.total,
                        "numofBeneficiaries"    : a.listofBeneficiaries&&a.listofBeneficiaries.length>0?a.listofBeneficiaries.length:0,    
                        "remark"                : a.remark,
                    }
                })
                res.status(200).json(alldata.slice(req.body.startRange, req.body.limitRange));
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
};

exports.fetch_activityReport = (req,res,next)=>{
    ActivityReport.find({_id : req.params.activityReportID})
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
/*exports.delete_activityReport = (req,res,next)=>{
    ActivityReport.findOne({_id : req.params.activityReportID})
    .exec()
    .then(data=>{
        // console.log('data',data);
        var listofBeneficiaries = data.listofBeneficiaries;
        for (var i = 0; i < listofBeneficiaries.length; i++) {
            var family_ID = listofBeneficiaries[i].family_ID
            var isUpgraded = listofBeneficiaries[i].isUpgraded
            // console.log('listofBeneficiaries[i]',listofBeneficiaries[i]);
            // console.log('isUpgraded',isUpgraded);
            if(listofBeneficiaries[i].isUpgraded==="Yes"){
                BeneficiaryFamilies.updateOne(
                    { _id:listofBeneficiaries[i].family_ID},  
                    {
                        $set:{
                            isUpgraded        : "No",
                        }
                    }
                )
                .then(familydata =>{
                    // console.log('familydata',familydata)
                })
                ListOfbeneficiary.updateOne(
                    { _id : listofBeneficiaries[i].beneficiary_ID},  
                    {
                        $set:{
                            isUpgraded        : "No",
                        }
                    }
                )
                .exec()
                .then(bendata=>{
                    // console.log('bendata',bendata);
                })
            }
        }
        ActivityReport.deleteOne({_id:req.params.activityReportID})
        .exec()
        .then(data=>{
            res.status(200).json({"message":"Activity Report Details deleted Successfully"});
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
*/
function findActivityOrigUpgradedbyFamily(family_ID){
    return new Promise((resolve,reject)=>{
        ActivityReport.find({
                            "listofBeneficiaries.family_ID" : family_ID,
                            "listofBeneficiaries.originalUpgrade": "Yes"
                        })
        .exec()
        .then(data=>{
            // console.log('findActivityOrigUpgradedbyFamily',data.length);
            resolve(data);
        })
        .catch(err =>{
            console.log(err);
        });
    })
}

function updateActivitytoUpgrade(beneficiary_ID, family_ID, activity_id){
    // console.log('beneficiary_ID, family_ID, activity_id',beneficiary_ID, family_ID, activity_id);
    return new Promise((resolve,reject)=>{
        ActivityReport.updateOne(
            {
                "_id" : activity_id,
                "listofBeneficiaries.family_ID" : family_ID,
                "listofBeneficiaries.beneficiary_ID" : beneficiary_ID
            }, 
            {$set: {"listofBeneficiaries.$.isUpgraded" : "Yes"}}
        )
        .then(data =>{
            // console.log('updateActivitytoUpgrade',data);
            resolve(data);       
        })
        .catch(err =>{
            console.log('err',err);
            reject(err);
        });
    });
}
exports.delete_activityReportOkkkk = (req,res,next)=>{
    ActivityReport.findOne({_id : req.params.activityReportID})
    .exec()
    .then(data=>{
        // console.log('data',data);
        // console.log('req.params.activityReportID',req.params.activityReportID);
        var activityDate = data.date;
        var listofBeneficiaries = data.listofBeneficiaries;
        // console.log('listofBeneficiaries',listofBeneficiaries);
        BeneficiaryFamilies.find({ upgradedInActivity : req.params.activityReportID})
        .exec()
        .then(familyUpgradedinActivity =>{
            getData();
            async function getData(){
                // console.log('familyUpgradedinActivity',familyUpgradedinActivity);
                for(k = 0; k < familyUpgradedinActivity.length; k++){
                    // var familyId = familyUpgradedinActivity[k].family_ID;
                    var familyId = familyUpgradedinActivity[k]._id;
                    // console.log('familyId============',familyId,k,familyUpgradedinActivity[k].family_ID); 
                    var activityOrigUpgradedbyFamily = await findActivityOrigUpgradedbyFamily(familyId);
                    // console.log('activityOrigUpgradedbyFamily========',activityOrigUpgradedbyFamily.length);
                    if(activityOrigUpgradedbyFamily && activityOrigUpgradedbyFamily.length > 0){
                        var index = activityOrigUpgradedbyFamily.findIndex(function(o){ return o._id == req.params.activityReportID })
                        if(index != -1){
                            activityOrigUpgradedbyFamily.splice(index, 1)
                        }
                        // console.log('activityOrigUpgradedbyFamily1',activityOrigUpgradedbyFamily.length);
                        var nextActivityDate = activityOrigUpgradedbyFamily.sort(function(x, y){
                            return moment(x.date) - moment(y.date);
                        })
                        // console.log('nextActivityDate========================',nextActivityDate.length);
                        if(nextActivityDate.length>0){
                            BeneficiaryFamilies.updateOne(
                                {_id : familyUpgradedinActivity[k]._id},
                                {$set : {
                                        upgradedInActivity : nextActivityDate[0]._id 
                                    }
                                }
                            )
                            .exec()
                            .then(familiesData =>{
                            })

                            ListOfbeneficiary.updateOne(
                                {_id : familyUpgradedinActivity[k]._id},
                                {$set : {
                                        upgradedInActivity : nextActivityDate[0]._id 
                                    }
                                }
                            )
                            .exec()
                            .then(benData =>{
                            })
                            var updateActivitytoUpgradeIt = await updateActivitytoUpgrade(familyUpgradedinActivity[k]._id,nextActivityDate[0]._id);

                        }
                    }
                }
            }
        })
        .catch(err =>{
            console.log(err);
        });
   /*     for (var i = 0; i < listofBeneficiaries.length; i++) {

            if(listofBeneficiaries[i].isUpgraded==="Yes"){
                BeneficiaryFamilies.updateOne(
                    { _id:listofBeneficiaries[i].family_ID},  
                    {
                        $set:{
                            isUpgraded         : "No",
                            upgradedInActivity : ""
                        }
                    }
                )
                .then(familydata =>{
                    // console.log('familydata',familydata)
                })
                ListOfbeneficiary.updateOne(
                    { _id : listofBeneficiaries[i].beneficiary_ID},  
                    {
                        $set:{
                            isUpgraded         : "No",
                            upgradedInActivity : ""
                        }
                    }
                )
                .exec()
                .then(bendata=>{
                    // console.log('bendata',bendata);
                })
            }
        }*/
        ActivityReport.deleteOne({_id:req.params.activityReportID})
            .exec()
            .then(data=>{
                res.status(200).json({"message":"Activity Report Details deleted Successfully"});
            })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_activityReport = (req,res,next)=>{
    // console.log('req.params.activityReportID',req.params.activityReportID);
    ActivityReport.findOne({_id : req.params.activityReportID})
    .exec()
    .then(data=>{
        var activityDate = data.date;
        if(data.typeofactivity==="Family Level Activity"){
            var listofBeneficiaries = data.listofBeneficiaries;

            // console.log('listofBeneficiaries',listofBeneficiaries);
            for (var i = 0; i < listofBeneficiaries.length; i++) {
                // console.log('listofBeneficiaries[i]._id',listofBeneficiaries[i]._id);
              
                var beneficiaryidInListofBen = listofBeneficiaries[i].beneficiary_ID;

                BeneficiaryFamilies.find({ 
                    "_id" :listofBeneficiaries[i].family_ID,
                    "upgradedInActivity" : req.params.activityReportID
                })
                .exec()
                .then(familyUpgradedinActivity =>{
                    // console.log('familyUpgradedinActivity',familyUpgradedinActivity);
                    getData();
                    async function getData(){
                        for(k = 0; k < familyUpgradedinActivity.length; k++){
                            var familyId = familyUpgradedinActivity[k]._id;
                            var activityOrigUpgradedbyFamily = await findActivityOrigUpgradedbyFamily(familyId);
                            
                            // console.log('familyId============',familyId,k,familyUpgradedinActivity[k].familyID); 
                            // console.log('activityOrigUpgradedbyFamily========',activityOrigUpgradedbyFamily.length);
                            
                            if(activityOrigUpgradedbyFamily && activityOrigUpgradedbyFamily.length > 0){
                                var index = activityOrigUpgradedbyFamily.findIndex(function(o){ return o._id == req.params.activityReportID })
                                if(index != -1){
                                    activityOrigUpgradedbyFamily.splice(index, 1)
                                }
                                // console.log('activityOrigUpgradedbyFamily1',activityOrigUpgradedbyFamily.length);
                                var nextActivityDate = activityOrigUpgradedbyFamily.sort(function(x, y){
                                    return moment(x.date) - moment(y.date);
                                })
                                // console.log('nextActivityDate========================',nextActivityDate.length);
                                if(nextActivityDate.length>0){
                                    BeneficiaryFamilies.updateOne(
                                        {_id : familyUpgradedinActivity[k]._id},
                                        {$set : {
                                                upgradedInActivity : nextActivityDate[0]._id 
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(familiesData =>{
                                        // console.log('familiesData*************',familiesData)
                                        // console.log("familyUpgradedinActivity[k]._id------", familyId);
                                        // console.log('listofBeneficiaries[i].beneficiary_ID111',beneficiaryidInListofBen);
                                        ListOfbeneficiary.find({ 
                                            "_id" :beneficiaryidInListofBen,
                                            "upgradedInActivity" : req.params.activityReportID
                                        })
                                        .exec()
                                        .then(benUpgradedinActivity =>{
                                            getBenData();
                                            async function getBenData(){
                                                // console.log('benUpgradedinActivity',benUpgradedinActivity);
                                                // console.log('beneficiaryidInListofBen',beneficiaryidInListofBen);
                                                // console.log("familyUpgradedinActivity[k]._id******", familyId);
                                                for (var j = 0; j < benUpgradedinActivity.length; j++) {
                                                    ListOfbeneficiary.updateOne(
                                                        {_id : benUpgradedinActivity[j]._id},
                                                        {$set : {
                                                                upgradedInActivity : nextActivityDate[0]._id 
                                                            }
                                                        }
                                                    )
                                                    .exec()
                                                    .then(benficiaryData =>{
                                                        // console.log('benficiaryData*************',benficiaryData)
                                                    })
                                                    // console.log("familyUpgradedinActivity[k]._id====", familyId);
                                                    var updateActivitytoUpgradeIt = await updateActivitytoUpgrade(benUpgradedinActivity[j]._id, familyId, nextActivityDate[0]._id);
                                                }
                                            }
                                        })
                                    })


                                }
                            }
                        }

                    }
                })

                // if(listofBeneficiaries[i].isUpgraded==="Yes"){
                //     BeneficiaryFamilies.updateOne(
                //         {    "_id":listofBeneficiaries[i].family_ID,
                //             "upgradedInActivity" : req.params.activityReportID},  
                //         {
                //             $set:{
                //                 isUpgraded         : "No",
                //                 upgradedInActivity : ""
                //             }
                //         }
                //     )
                //     .then(familydata =>{
                //         console.log('familydata*************',familydata)
                //     })
                //     ListOfbeneficiary.updateOne(
                //         {   
                //             "_id" : beneficiaryidInListofBen,
                //             "upgradedInActivity" : req.params.activityReportID,  
                //         },  
                //         {
                //             $set:{
                //                 isUpgraded         : "No",
                //                 upgradedInActivity : ""
                //             }
                //         }
                //     )
                //     .exec()
                //     .then(bendata=>{
                //         console.log('bendata**********',bendata);
                //     })
                // }
            }
        }
        ActivityReport.deleteOne({_id:req.params.activityReportID})
        .exec()
        .then(data=>{
            res.status(200).json({"message":"Activity Report Details deleted Successfully"});
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.delete_file = (req,res,next)=>{
    ActivityReport.find({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
    .exec()
    .then(activitydata=>{
        // console.log('activitydata.length',activitydata.length);
        for (var n = 0; n < activitydata.length; n++) {
            getfileData();
            async function getfileData(){
                // console.log('activitydata[n]._id',activitydata[n]._id,"=========",n);
                var actID = activitydata[n]._id
                ActivityReport.findOne({"_id" : actID})
                .exec()
                .then(data=>{
                    // console.log("data==========================",data)
                    if(data.typeofactivity==="Family Level Activity"){
                        // var activityDate = data.date;
                        var listofBeneficiaries = data.listofBeneficiaries;
                        // console.log('activityDate',activityDate);
                        for (var i = 0; i < listofBeneficiaries.length; i++) {
                            // console.log('listofBeneficiaries[i]._id',listofBeneficiaries[i]._id,i);
                          
                            var beneficiaryidInListofBen = listofBeneficiaries[i].beneficiary_ID;

                            BeneficiaryFamilies.find({ 
                                "_id" :listofBeneficiaries[i].family_ID,
                                "upgradedInActivity" : actID
                            })
                            .exec()
                            .then(familyUpgradedinActivity =>{
                                // console.log('familyUpgradedinActivity',familyUpgradedinActivity.length);
                                getData();
                                async function getData(){
                                    for(k = 0; k < familyUpgradedinActivity.length; k++){
                                        var familyId = familyUpgradedinActivity[k]._id;
                                        var activityOrigUpgradedbyFamily = await findActivityOrigUpgradedbyFamily(familyId);
                                        
                                        // console.log('activityOrigUpgradedbyFamily========',activityOrigUpgradedbyFamily.length);
                                        
                                        if(activityOrigUpgradedbyFamily && activityOrigUpgradedbyFamily.length > 0){
                                            var index = activityOrigUpgradedbyFamily.findIndex(function(o){ return o._id == actID })
                                            if(index != -1){
                                                activityOrigUpgradedbyFamily.splice(index, 1)
                                            }
                                            // console.log('activityOrigUpgradedbyFamily1',activityOrigUpgradedbyFamily.length);
                                            var nextActivityDate = activityOrigUpgradedbyFamily.sort(function(x, y){
                                                return moment(x.date) - moment(y.date);
                                            })
                                            // console.log('nextActivityDate========================',nextActivityDate.length);
                                            if(nextActivityDate.length>0){
                                                BeneficiaryFamilies.updateOne(
                                                    // {_id : familyUpgradedinActivity[k]._id},
                                                    {_id : familyId},
                                                    {$set : {
                                                            upgradedInActivity : nextActivityDate[0]._id 
                                                        }
                                                    }
                                                )
                                                .exec()
                                                .then(familiesData =>{
                                                    // console.log('familiesData*************',familiesData)
                                                    // console.log("familyUpgradedinActivity[k]._id------", familyId);
                                                    // console.log('listofBeneficiaries[i].beneficiary_ID111',beneficiaryidInListofBen);
                                                    ListOfbeneficiary.find({ 
                                                        "_id" :beneficiaryidInListofBen,
                                                        "upgradedInActivity" : actID
                                                    })
                                                    .exec()
                                                    .then(benUpgradedinActivity =>{
                                                        getBenData();
                                                        async function getBenData(){
                                                            // console.log('benUpgradedinActivity',benUpgradedinActivity);
                                                            // console.log('beneficiaryidInListofBen',beneficiaryidInListofBen);
                                                            // console.log("familyUpgradedinActivity[k]._id******", familyId);
                                                            for (var j = 0; j < benUpgradedinActivity.length; j++) {
                                                                ListOfbeneficiary.updateOne(
                                                                    {_id : benUpgradedinActivity[j]._id},
                                                                    {$set : {
                                                                            upgradedInActivity : nextActivityDate[0]._id 
                                                                        }
                                                                    }
                                                                )
                                                                .exec()
                                                                .then(benficiaryData =>{
                                                                    // console.log('benficiaryData*************',benficiaryData)
                                                                })
                                                                // console.log("familyUpgradedinActivity[k]._id====", familyId);
                                                                var updateActivitytoUpgradeIt = await updateActivitytoUpgrade(benUpgradedinActivity[j]._id, familyId, nextActivityDate[0]._id);
                                                            }
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                    }

                                }
                            })


                            if(listofBeneficiaries[i].isUpgraded==="Yes"){
                                BeneficiaryFamilies.updateOne(
                                    {    "_id":listofBeneficiaries[i].family_ID,
                                        "upgradedInActivity" : actID},  
                                    {
                                        $set:{
                                            isUpgraded         : "No",
                                            upgradedInActivity : ""
                                        }
                                    }
                                )
                                .then(familydata =>{
                                    // console.log('familydata*************',familydata)
                                })
                                ListOfbeneficiary.updateOne(
                                    {   
                                        "_id" : beneficiaryidInListofBen,
                                        "upgradedInActivity" : actID,  
                                    },  
                                    {
                                        $set:{
                                            isUpgraded         : "No",
                                            upgradedInActivity : ""
                                        }
                                    }
                                )
                                .exec()
                                .then(bendata=>{
                                    // console.log('bendata**********',bendata);
                                })
                            }
                        }
                    }
                })
                // console.log('actID',actID);
                        
                // ActivityReport.deleteOne({_id:actID})
                // .exec()
                // .then(data=>{
                //    console.log('data',data);
                //     // resolve( data,
                //     //     {"message":"Activity Report Details deleted Successfully"}
                //     // );       
                //     res.status(200).json({"message":"Activity Report Details deleted Successfully"});
                // })
                // var deleteActivity = await deleteActivity(actID);
                // res.status(200).json({"message":"Activity Report Details deleted Successfully"});
            }
        }
        ActivityReport.deleteMany({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
            .exec()
            .then(data=>{
                // console.log('data',data);
                res.status(200).json({
                    "message" : "Activities of file "+req.params.fileName+" deleted successfully"
                });
            })
            .catch(err =>{
                console.log(err);
            });     
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });    
};
function deleteActivity(actID){
    // console.log("actID",actID);
    return new Promise((resolve,reject)=>{
        ActivityReport.deleteOne({_id:actID})
        .exec()
        .then(data=>{
           // console.log('data',data);
            resolve( data,
                {"message":"Activity Report Details deleted Successfully"}
            );       
            // res.status(200).json({"message":"Activity Report Details deleted Successfully"});
        })
        .catch(err =>{
            console.log('err',err);
            reject(err);
        });
    });
}
// exports.delete_file = (req,res,next)=>{
//     ActivityReport.find({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
//     .exec()
//     .then(activitydata=>{
//         getData();
//         async function getData(){
//             console.log('activitydata',activitydata.length);
//             var updateFamily = await updateUpgradationOfFamily(activitydata);
//             var updateBen = await updateUpgradationOfBen(activitydata);
//             ActivityReport.deleteMany({"fileName":req.params.fileName, "uploadTime":req.params.uploadTime})
//             .exec()
//             .then(data=>{
//                 console.log('data',data);
//                 res.status(200).json({
//                     "message" : "Activities of file "+req.params.fileName+" deleted successfully"
//                 });
//             })
//             .catch(err =>{
//                 console.log(err);
//             });     
//         }
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });    
// };
function updateUpgradationOfFamily(activityData){
    // console.log('activityData',activityData.length);
    return new Promise((resolve,reject)=>{
        for (var k = 0; k < activityData.length; k++) {
            ActivityReport.findOne({_id : activityData[k]._id})
            .exec()
            .then(data=>{
                // console.log('data',data._id,data.listofBeneficiaries.length);
                var listofBeneficiaries = data.listofBeneficiaries;
                for (var i = 0; i < listofBeneficiaries.length; i++) {
                    var family_ID  = listofBeneficiaries[i].family_ID
                    var isUpgraded = listofBeneficiaries[i].isUpgraded
                    // console.log('isUpgraded',isUpgraded);
                    if(listofBeneficiaries[i].isUpgraded==="Yes"){
                        BeneficiaryFamilies.updateOne(
                            { _id:listofBeneficiaries[i].family_ID},  
                            {
                                $set:{
                                    isUpgraded        : "No",
                                }
                            }
                        )
                        .then(familydata =>{
                            resolve(familydata);
                            // console.log('familydata',familydata)
                        })
                        .catch(err =>{
                            reject(err);
                            console.log(err);
                        }); 
                    }else{
                        resolve(listofBeneficiaries[i].isUpgraded);
                        // console.log('listofBeneficiaries[i].isUpgraded',listofBeneficiaries[i].isUpgraded);
                    }
                }
            })
        }
    });
};
function updateUpgradationOfBen(activityData){
    return new Promise((resolve,reject)=>{
        for (var k = 0; k < activityData.length; k++) {
            ActivityReport.findOne({_id : activityData[k]._id})
            .exec()
            .then(data=>{
                // console.log('data',data._id,data.listofBeneficiaries.length);
                var listofBeneficiaries = data.listofBeneficiaries;
                for (var i = 0; i < listofBeneficiaries.length; i++) {
                    var family_ID  = listofBeneficiaries[i].family_ID
                    var isUpgraded = listofBeneficiaries[i].isUpgraded
                    // console.log('isUpgraded',isUpgraded);
                    if(listofBeneficiaries[i].isUpgraded==="Yes"){
                        ListOfbeneficiary.updateOne(
                            { _id : listofBeneficiaries[i].beneficiary_ID},  
                            {
                                $set:{
                                    isUpgraded        : "No",
                                }
                            }
                        )
                        .exec()
                        .then(bendata=>{
                            resolve(bendata);
                            // console.log('bendata',bendata);
                        })
                        .catch(err =>{
                            reject(err);
                            console.log(err);
                        });     
                    }else{
                        resolve(listofBeneficiaries[i].isUpgraded);
                        // console.log('listofBeneficiaries[i].isUpgraded',listofBeneficiaries[i].isUpgraded);
                    }
                }
            })
        }
    });
};
exports.fetch_activityReport_annual_completion_Data = (req,res,next)=>{
    ActivityReport.aggregate(
                                [
                                    {
                                        $match : {
                                            $and: [
                                                    // { sector_ID         : req.params.sector_ID },
                                                    { activity_ID       : req.params.activity_ID },
                                                    { subactivity_ID    : req.params.subactivity_ID },
                                                    // { date              : {$gte : new Date(req.params.startDate), $lte : new Date(req.params.endDate)}}
                                                ]                
                                        }
                                    },
                                    {
                                        $project : {
                                            "reach"         : {"$size" : "$listofBeneficiaries"},
                                            "physicalUnit"  : "$quantity",
                                            "totalExp"      : "$totalCost",
                                            "LHWRF"         : "$sourceofFund.LHWRF",
                                            "NABARD"        : "$sourceofFund.NABARD",
                                            "bankLoan"      : "$sourceofFund.bankLoan",
                                            "Direct"        : "$sourceofFund.directCC",
                                            "Indirect"      : "$sourceofFund.indirectCC",
                                            "Govt"          : "$sourceofFund.govtscheme",
                                            "Other"         : "$sourceofFund.other"
                                        }
                                    },
                                    {
                                        $group : {
                                            "_id" : null,
                                            "annualFYAchie_Reach"            : {
                                                                                "$sum" : "$reach"
                                                                            },
                                            //Need to Work 
                                            "annualFYAchie_Upgradation"     : {
                                                                                "$sum" : "$reach"
                                                                            },
                                            "annualFYAchie_physcialUnit"    : {
                                                                                "$sum" : "$physicalUnit"
                                                                            },
                                            "annualFYAchie_totalExp"        : {
                                                                                "$sum" : "$totalExp"
                                                                            },
                                            "scrFYAchie_LHWRF "             : {
                                                                                "$sum" : "$LHWRF"
                                                                            },
                                            "scrFYAchie_NABARD"             : {
                                                                                "$sum" : "$NABARD"
                                                                            },
                                            "scrFYAchie_BankLoan"           : {
                                                                                "$sum" : "$bankLoan"
                                                                            },
                                            "scrFYAchie_Direct"             : {
                                                                                "$sum" : "$Direct"
                                                                            },
                                            "scrFYAchie_Indirect"           : {
                                                                                "$sum" : "$Indirect"
                                                                            },
                                            "scrFYAchie_Govt"               : {
                                                                                "$sum" : "$Govt"
                                                                            },
                                            "scrFYAchie_Other"              : {
                                                                                "$sum" : "$Other"
                                                                            }
                                        }
                                    }
                                ]
                    )
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
exports.fetch_activityReport_annual_Data = (req,res,next)=>{
    // console.log('req.params',req.params);
    var query = "1";
    if(req.params.center_ID != "all"){
        query = {
                    "center_ID"         : String(req.params.center_ID),
                    "date"              : {$gte : (req.params.startDate), $lte : (req.params.endDate)},
                };
    }else{
        query = {
                    "date"              : {$gte : (req.params.startDate), $lte : (req.params.endDate)},
                };
    }
    if(query != "1"){
        // console.log('query',query);
        ActivityReport.find(query)
            .sort({"createdAt":-1})
            .exec()
            .then(data=>{
                // console.log('dataaaa',data);
                if(data){
                    var alldata = data.map((a, i)=>{
                        // console.log("a ",a);
                        return {
                            _id                   : a._id,
                            centerName            : a.centerName,
                            date                  : a.date,
                            district              : a.district,
                            block                 : a.block,
                            village               : a.village,
                            location              : a.location,
                            place                 : "<div class='Width100 text-left'>"+a.district+", "+a.block+", "+a.village+ (a.location ? ", "+a.location : "")+"</div>",
                            stateCode             : a.stateCode,
                            sectorName            : a.sectorName,
                            activity              : '<p class="wrapText">Name: '+a.activityName+'</p><p> Type: '+a.typeofactivity+'</p>',
                            typeofactivity        : a.typeofactivity,
                            activityName          : a.activityName,
                            subactivityName       : '<div class="wrapText">'+a.subactivityName+'</p>',
                            projectName           : a.projectName,
                            projectCategoryType   : a.projectCategoryType,
                            type                  : a.type,
                            unit                  : a.unit,
                            unitCost              : (a.unitCost),
                            //"unitCost"           : (a.unitCost).toFixed(2),
                            noOfBeneficiaries     : a.noOfBeneficiaries,
                            quantity              : a.quantity,
                            totalCost             : a.totalCost,     
                            LHWRF                 : a.sourceofFund.LHWRF,
                            NABARD                : a.sourceofFund.NABARD,
                            bankLoan              : a.sourceofFund.bankLoan,
                            govtscheme            : a.sourceofFund.govtscheme,
                            directCC              : a.sourceofFund.directCC,
                            indirectCC            : a.sourceofFund.indirectCC,
                            other                 : a.sourceofFund.other,
                            total                 : a.sourceofFund.total,
                            numofBeneficiaries    : a.listofBeneficiaries&&a.listofBeneficiaries.length>0?a.listofBeneficiaries.length:0,    
                            listofBeneficiaries   : a.listofBeneficiaries,
                            remark                : a.remark,
                        }
                    })
                    res.status(200).json(alldata);
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};
exports.fetch_activityReport_withFilters = (req,res,next)=>{
    // console.log('req.params',req.params);
    var query = "1";
    if(req.params.center_ID !== "all"){
        query = {
                    "center_ID"         : String(req.params.center_ID),
                    "date"              : {$gte : (req.params.startDate), $lte : (req.params.endDate)},
                };
    }else{
        query = {
                    "date"              : {$gte : (req.params.startDate), $lte : (req.params.endDate)},
                };
    }
    if(req.params.sector_ID !== "all"){
        query.sector_ID = req.params.sector_ID;
    }
    if(req.params.activity_ID !== "all"){
        query.activity_ID = req.params.activity_ID;
    }
    if(req.params.subactivity_ID !== "all"){
        query.subactivity_ID = req.params.subactivity_ID;
    }
    if(req.params.typeofactivity !== "all"){
        query.typeofactivity = req.params.typeofactivity;
    }
    /*Skip & limit*/
    if(req.params.skip !== "all"){
        skip = parseInt(req.params.skip);
    }else{
        skip = 0
    }
    if(req.params.limit !== "all"){
        limit = parseInt(req.params.limit);
    }else{
        limit = 100000000
    }
    if(query != "1"){
        // console.log("1=========",new Date())
        // console.log('query',query);
        ActivityReport.find(query)
            // .limit(100)
            .skip(skip)
            .limit(limit)
            .sort({"createdAt":-1})
            .then(data=>{
                // console.log('dataaaa',data);
                if(data){
                    var alldata = data.map((a, i)=>{
                        // console.log("a ",a);
                        return {
                            "_id"                   : a._id,
                            "centerName"            : a.centerName,
                            "date"                  : a.date,
                            "district"              : a.district,
                            "block"                 : a.block,
                            "village"               : a.village,
                            "location"              : a.location,
                            "place"                 : "<div class='Width100 text-left'>"+a.district+", "+a.block+", "+a.village+ (a.location ? ", "+a.location : "")+"</div>",
                            "stateCode"             : a.stateCode,
                            "sectorName"            : a.sectorName,
                            "activity"              : '<p class="wrapText">Name: '+a.activityName+'</p><p> Type: '+a.typeofactivity+'</p>',
                            "typeofactivity"        : a.typeofactivity,
                            "activityName"          : a.activityName,
                            "subactivityName"       : '<div class="wrapText">'+a.subactivityName+'</div>',
                            "projectName"           : a.projectName,
                            "projectCategoryType"   : a.projectCategoryType,
                            "type"                  : a.type,
                            "unit"                  : a.unit,
                            "unitCost"              : (a.unitCost).toFixed(2),
                            "noOfBeneficiaries"     : a.noOfBeneficiaries,
                            "quantity"              : a.quantity,
                            "totalCost"             : a.totalCost,     
                            "LHWRF"                 : a.sourceofFund.LHWRF,
                            "NABARD"                : a.sourceofFund.NABARD,
                            "bankLoan"              : a.sourceofFund.bankLoan,
                            "govtscheme"            : a.sourceofFund.govtscheme,
                            "directCC"              : a.sourceofFund.directCC,
                            "indirectCC"            : a.sourceofFund.indirectCC,
                            "other"                 : a.sourceofFund.other,
                            "total"                 : a.sourceofFund.total,
                            "numofBeneficiaries"    : a.listofBeneficiaries&&a.listofBeneficiaries.length>0?a.listofBeneficiaries.length:0,    
                            "listofBeneficiaries"   : a.listofBeneficiaries,
                            "remark"                : '<div class="text-left wrapText">'+a.remark+'</div>',
                        }
                    })
                    res.status(200).json({
                                            "data":alldata,
                                            "dataCount": alldata.length
                                        });
                    // console.log("2=========",new Date(),"alldata",alldata.length)
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};
exports.post_activityReport_withFilters = (req,res,next)=>{
    // console.log('req.body==========',req.body.year);
    var query     = "1";
    var startDate = req.body.year.substring(3, 7)+"-04-01";
    var endDate   = req.body.year.substring(10, 15)+"-03-31";    

    if(req.body.center_ID !== "all"){
        query = {
                    "center_ID"         : String(req.body.center_ID),
                    "date"              : {$gte : startDate, $lte : endDate},
                };
    }else{
        query = {
                    "date"              : {$gte : startDate, $lte : endDate},
                };
    }
    if(req.body.sector_ID !== "all"){
        query.sector_ID = req.body.sector_ID;
    }
    if(req.body.activity_ID !== "all"){
        query.activity_ID = req.body.activity_ID;
    }
    if(req.body.subactivity_ID !== "all"){
        query.subactivity_ID = req.body.subactivity_ID;
    }
    if(req.body.typeofactivity !== "all"){
        query.typeofactivity = req.body.typeofactivity;
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
        limit = 100000000
    }
    if(query != "1"){
        // console.log("1=========",new Date())
        console.log('query',query);
        
        ActivityReport.find(query)
            .skip(skip)
            .limit(limit)
            .sort({"date":1})
            .then(data=>{
                // console.log('dataaaa',data);
                if(data){
                    var alldata = data.map((a, i)=>{
                        // console.log("a ",a);
                        return {
                            "_id"                   : a._id,
                            "centerName"            : a.centerName,
                            "date"                  : moment(a.date).format('DD-MM-YYYY'),
                            // "date"                  : a.date,
                            "district"              : a.district,
                            "block"                 : a.block,
                            "village"               : a.village,
                            "location"              : a.location,
                            "place"                 : "<div class='Width100 text-left'>"+a.district+", "+a.block+", "+a.village+ (a.location ? ", "+a.location : "")+"</div>",
                            "stateCode"             : a.stateCode,
                            "sectorName"            : a.sectorName,
                            "activity"              : '<p class="wrapText">Name: '+a.activityName+'</p><p> Type: '+a.typeofactivity+'</p>',
                            "typeofactivity"        : a.typeofactivity,
                            "activityName"          : a.activityName,
                            "subactivityName"       : '<div class="wrapText">'+a.subactivityName+'</div>',
                            "projectName"           : a.projectName,
                            "projectCategoryType"   : a.projectCategoryType,
                            "type"                  : a.type,
                            "unit"                  : a.unit,
                            "unitCost"              : (a.unitCost).toFixed(2),
                            "noOfBeneficiaries"     : a.noOfBeneficiaries,
                            "quantity"              : a.quantity,
                            "totalCost"             : a.totalCost,     
                            "LHWRF"                 : a.sourceofFund.LHWRF,
                            "NABARD"                : a.sourceofFund.NABARD,
                            "bankLoan"              : a.sourceofFund.bankLoan,
                            "govtscheme"            : a.sourceofFund.govtscheme,
                            "directCC"              : a.sourceofFund.directCC,
                            "indirectCC"            : a.sourceofFund.indirectCC,
                            "other"                 : a.sourceofFund.other,
                            "total"                 : a.sourceofFund.total,
                            "numofBeneficiaries"    : a.listofBeneficiaries&&a.listofBeneficiaries.length>0?a.listofBeneficiaries.length:0,    
                            "listofBeneficiaries"   : a.listofBeneficiaries,
                            "remark"                : '<div class="text-left wrapText">'+a.remark+'</div>',
                        }
                    })
                    res.status(200).json(alldata);
                                        //  res.status(200).json({
                                        //     "data":alldata,
                                        //     "dataCount": alldata.length
                                        // });
                    // console.log("2=========",new Date(),"alldata",alldata.length)
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};
exports.post_activityReport_withFilters = (req,res,next)=>{
    // console.log('req.body==========',req.body.year);
    var query     = "1";
    var startDate = req.body.year.substring(3, 7)+"-04-01";
    var endDate   = req.body.year.substring(10, 15)+"-03-31";    

    if(req.body.center_ID !== "all"){
        query = {
                    "center_ID"         : String(req.body.center_ID),
                    "date"              : {$gte : startDate, $lte : endDate},
                };
    }else{
        query = {
                    "date"              : {$gte : startDate, $lte : endDate},
                };
    }
    if(req.body.sector_ID !== "all"){
        query.sector_ID = req.body.sector_ID;
    }
    if(req.body.activity_ID !== "all"){
        query.activity_ID = req.body.activity_ID;
    }
    if(req.body.subactivity_ID !== "all"){
        query.subactivity_ID = req.body.subactivity_ID;
    }
    if(req.body.typeofactivity !== "all"){
        query.typeofactivity = req.body.typeofactivity;
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
        limit = 100000000
    }
    if(query != "1"){
        // console.log("1=========",new Date())
        console.log('query',query);
        
        ActivityReport.find(query)
            .skip(skip)
            .limit(limit)
            .sort({"date":1})
            .then(data=>{
                // console.log('dataaaa',data);
                if(data){
                    var alldata = data.map((a, i)=>{
                        // console.log("a ",a);
                        return {
                            // "_id"                   : a._id,
                            // "centerName"            : a.centerName,
                            // "date"                  : moment(a.date).format('DD-MM-YYYY'),
                            // "district"              : a.district,
                            // "block"                 : a.block,
                            // "village"               : a.village,
                            // "location"              : a.location,
                            // "place"                 : "<div class='Width100 text-left'>"+a.district+", "+a.block+", "+a.village+ (a.location ? ", "+a.location : "")+"</div>",
                            // "stateCode"             : a.stateCode,
                            // "sectorName"            : a.sectorName,
                            // "activity"              : '<p class="wrapText">Name: '+a.activityName+'</p><p> Type: '+a.typeofactivity+'</p>',
                            // "typeofactivity"        : a.typeofactivity,
                            // "activityName"          : a.activityName,
                            // "subactivityName"       : '<div class="wrapText">'+a.subactivityName+'</div>',
                            // "projectName"           : a.projectName,
                            // "projectCategoryType"   : a.projectCategoryType,
                            // "type"                  : a.type,
                            // "unit"                  : a.unit,
                            // "unitCost"              : (a.unitCost).toFixed(2),
                            // "noOfBeneficiaries"     : a.noOfBeneficiaries,
                            // "quantity"              : a.quantity,
                            // "totalCost"             : a.totalCost,     
                            // "LHWRF"                 : a.sourceofFund.LHWRF,
                            // "NABARD"                : a.sourceofFund.NABARD,
                            // "bankLoan"              : a.sourceofFund.bankLoan,
                            // "govtscheme"            : a.sourceofFund.govtscheme,
                            // "directCC"              : a.sourceofFund.directCC,
                            // "indirectCC"            : a.sourceofFund.indirectCC,
                            // "other"                 : a.sourceofFund.other,
                            // "total"                 : a.sourceofFund.total,
                            // "numofBeneficiaries"    : a.listofBeneficiaries&&a.listofBeneficiaries.length>0?a.listofBeneficiaries.length:0,    
                            // "listofBeneficiaries"   : a.listofBeneficiaries,
                            // "remark"                : '<div class="text-left wrapText">'+a.remark+'</div>',

                            "_id"                   : a._id,
                            "projectCategoryType"   : a.projectCategoryType,
                            "projectName"           : a.projectName,
                            "date"                  : moment(a.date).format('DD-MM-YYYY'),
                            "district"              : a.district,
                            "block"                 : a.block,
                            "village"               : a.village,
                            "location"              : a.location,
                            "sectorName"            : a.sectorName,
                            "activityName"          : a.activityName,
                            "typeofactivity"        : a.typeofactivity,
                            "subactivityName"       : '<div class="wrapText">'+a.subactivityName+'</div>',
                            "unit"                  : a.unit,
                            "unitCost"              : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].unitCost).toFixed(2)                : (a.unitCost).toFixed(2),
                            "quantity"              : a.quantity,
                            "totalCost"             : a.totalCost,     
                            "noOfBeneficiaries"     : a.noOfBeneficiaries,
                            "qtyPerBen"             : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].qtyPerBen)               : (a.quantity),
                            "totalCostPerBen"       : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].totalCostPerBen)         : (a.totalCost),
                            "numofBeneficiaries"    : ((a.noOfBeneficiaries)===null) || ((a.noOfBeneficiaries)=== 0) ? (a.numofBeneficiaries) : (a.noOfBeneficiaries),
                            "LHWRF"                 : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.LHWRF)      : (a.sourceofFund.LHWRF),
                            "NABARD"                : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.NABARD)     : (a.sourceofFund.NABARD),
                            "bankLoan"              : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.bankLoan)   : (a.sourceofFund.bankLoan),
                            "govtscheme"            : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.govtscheme) : (a.sourceofFund.govtscheme),
                            "directCC"              : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.directCC)   : (a.sourceofFund.directCC),
                            "indirectCC"            : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.indirectCC) : (a.sourceofFund.indirectCC),
                            "other"                 : a.listofBeneficiaries.length > 0 ? (a.listofBeneficiaries[0].sourceofFund.other)      : (a.sourceofFund.other),
                           
                            // "numofBeneficiaries"    : a.listofBeneficiaries&&a.listofBeneficiaries.length>0?a.listofBeneficiaries.length:a.numofBeneficiaries,    
                            "remark"                : '<div class="text-left wrapText">'+a.remark+'</div>',
                            "total"                 : a.sourceofFund.total,
                            "type"                  : a.type,
                            "listofBeneficiaries"   : a.listofBeneficiaries,
                            "place"                 : "<div class='Width100 text-left'>"+a.district+", "+a.block+", "+a.village+ (a.location ? ", "+a.location : "")+"</div>",
                            "stateCode"             : a.stateCode,
                            "activity"              : '<p class="wrapText">Name: '+a.activityName+'</p><p> Type: '+a.typeofactivity+'</p>',
                            "centerName"            : a.centerName,
                        }
                    })
                    res.status(200).json(alldata);
                                        //  res.status(200).json({
                                        //     "data":alldata,
                                        //     "dataCount": alldata.length
                                        // });
                    // console.log("2=========",new Date(),"alldata",alldata.length)
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
};
exports.count_activityReport = (req,res,next)=>{
    var query = "1";

    var startDate = req.params.year.substring(3, 7)+"-04-01";
    var endDate   = req.params.year.substring(10, 15)+"-03-31";    

    if(req.params.center_ID !== "all"){
        query = {
                    "center_ID"         : req.params.center_ID,
                    "date"              : {$gte : startDate, $lte : endDate},
                };
    }else{
        query = {
                    "date"              : {$gte : startDate, $lte : endDate},
                };
    }
    if(req.params.typeofactivity !== "all"){
        query.typeofactivity = req.params.typeofactivity;
    }
    if(query != "1"){   
        ActivityReport.countDocuments(query)
        .then(data=>{
            console.log("count data = ",data)
            res.status(200).json({"dataCount":data});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
};
function getSectorData(sectorName,activityName,subactivityName){
    return new Promise((resolve,reject)=>{
        var sectorData={
            "sector_ID" : '',
            "activity_ID" : "",
            "subactivity_ID" : "",
        }

        Sectors.findOne({sector : sectorName.trim()})
        .exec()
        .then(data =>{
            // console.log('data',data)
            if(data){
                sectorData.sector_ID = data._id;
                var actvity = data.activity.find((obj)=>{
                    return obj.activityName.trim() === activityName.trim()
                })
                if (actvity) {
                    sectorData.activity_ID = actvity._id;
                    var subActivity = actvity.subActivity.find((sobj)=>{
                        return sobj.subActivityName.trim() === subactivityName.trim()
                    })
                    if (subActivity) {
                       sectorData.subactivity_ID = subActivity._id;
                    }
                }
                resolve(sectorData);
            }else{
                resolve(sectorData);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
};
function insert_activites(activity,centerName,center_ID,sectorData,fileName){
    return new Promise((resolve,reject)=>{
        // console.log( 'noOfBeneficiaries',parseFloat(activity.noOfBeneficiaries),activity.noOfBeneficiaries);
        // console.log("activity.unitCost ", isNaN(Number(activity.unitCost)));
        var unitCost = isNaN(Number(activity.unitCost)) ? 0 : parseFloat(activity.unitCost);
        // console.log( 'unitCostunitCost',unitCost);
        
        var quantity = isNaN(Number(activity.quantity)) ? 0 : parseFloat(activity.quantity);
        // console.log( 'quantity',quantity);

        var LHWRF = isNaN(Number(activity.LHWRF)) ? 0 : parseFloat(activity.LHWRF);
        var NABARD = isNaN(Number(activity.NABARD)) ? 0 : parseFloat(activity.NABARD);
        var bankLoan = isNaN(Number(activity.bankLoan)) ? 0 : parseFloat(activity.bankLoan);
        var govtscheme = isNaN(Number(activity.govtscheme)) ? 0 : parseFloat(activity.govtscheme);
        var directCC = isNaN(Number(activity.directCC)) ? 0 : parseFloat(activity.directCC);
        var indirectCC = isNaN(Number(activity.indirectCC)) ? 0 : parseFloat(activity.indirectCC);
        var other = isNaN(Number(activity.other)) ? 0 :  parseFloat(activity.other);
        
        // var quantity = Number.isNaN(activity.quantity) ? parseInt(activity.quantity) : 0;
        // var LHWRF = Number.isNaN(activity.LHWRF) ? parseInt(activity.LHWRF) : 0;
        // var NABARD = Number.isNaN(activity.NABARD) ? parseInt(activity.NABARD) : 0
        // var bankLoan = Number.isNaN(activity.bankLoan) ? parseInt(activity.bankLoan) : 0
        // var govtscheme = Number.isNaN(activity.govtscheme) ? parseInt(activity.govtscheme) : 0
        // var directCC = Number.isNaN(activity.directCC) ? parseInt(activity.directCC) : 0
        // var indirectCC = Number.isNaN(activity.indirectCC) ? parseInt(activity.indirectCC) : 0
        // var other = Number.isNaN(activity.other) ? parseInt(activity.other) : 0
        var date;
        if (typeof activity.date == 'number') {
            date = moment(new Date(Math.round((activity.date - 25569)*86400*1000))).format("YYYY-MM-DD");
        }else{
            date = moment(activity.date,'YYYY-MM-DD')._i
        }
        const activityReport = new ActivityReport({
            _id                 : new mongoose.Types.ObjectId(), 
            projectCategoryType : activity.projectCategoryType,
            projectName         : activity.projectName,   
            center_ID           : center_ID,
            centerName          : centerName,
            stateCode           : activity.stateCode,
            district            : activity.district,
            noOfBeneficiaries   : activity.noOfBeneficiaries,
            block               : activity.block,
            village             : activity.village,
            date                : date,
            sector_ID           : sectorData.sector_ID,
            sectorName          : activity.sectorName,
            typeofactivity      : activity.typeofactivity,
            activity_ID         : sectorData.activity_ID,
            activityName        : activity.activityName,
            subactivity_ID      : sectorData.subactivity_ID,
            subactivityName     : activity.subactivityName,
            unit                : activity.unit,
            unitCost            : unitCost,
            quantity            : quantity,
            totalCost           : unitCost * quantity,
            sourceofFund        : { 
                                    LHWRF               : LHWRF,
                                    NABARD              : NABARD,
                                    bankLoan            : bankLoan,
                                    govtscheme          : govtscheme,
                                    directCC            : directCC,
                                    indirectCC          : indirectCC,
                                    other               : other,
                                    total               : LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other 
                                  },
            listofBeneficiaries : [],
            remark              : activity.remark,
            fileName            : fileName,
            createdAt           : new Date()
        });
        activityReport.save()
        .then(data=>{
            resolve({"data": data,"message" : "Activity Report Details updated Successfully"});
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
            
        
    });
};
exports.bulk_upload_activities = (req,res,next)=>{
    var activities = req.body.data;
    // console.log("activities",activities);
    var newactivityLst = [];
    var validData1 = [];
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 

    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;

    getActivityData(); 
    async function getActivityData(){
        var allSectorsData = await getAllSectors();
        var allFamilyData = await findAllFamily();
        var allBeneficiaryData = await findAllBeneficiary();
        for(var k = 0 ; k < activities.length ; k++){
            var unitCost = isNaN(Number(activities[k].unitCost)) ? 0 : parseFloat(activities[k].unitCost);
            // console.log( 'unitCostunitCost',unitCost);
            
            var quantity = isNaN(Number(activities[k].quantity)) ? 0 : parseFloat(activities[k].quantity);
            // console.log( 'quantity',quantity);

            var LHWRF = isNaN(Number(activities[k].LHWRF)) ? 0 : parseFloat(activities[k].LHWRF);
            var NABARD = isNaN(Number(activities[k].NABARD)) ? 0 : parseFloat(activities[k].NABARD);
            var bankLoan = isNaN(Number(activities[k].bankLoan)) ? 0 : parseFloat(activities[k].bankLoan);
            var govtscheme = isNaN(Number(activities[k].govtscheme)) ? 0 : parseFloat(activities[k].govtscheme);
            var directCC = isNaN(Number(activities[k].directCC)) ? 0 : parseFloat(activities[k].directCC);
            var indirectCC = isNaN(Number(activities[k].indirectCC)) ? 0 : parseFloat(activities[k].indirectCC);
            var other = isNaN(Number(activities[k].other)) ? 0 :  parseFloat(activities[k].other);    
            var noOfBeneficiaries = isNaN(Number(activities[k].noOfBeneficiaries)) ? 0 :  parseInt(activities[k].noOfBeneficiaries);    
            var beneficiaryObject={}; 
            
            // if (activities[k].district == '-') {
            //     remark += "district not found, " ;  
            // }
            // if (activities[k].location == '-') {
            //     remark += "location not found, " ;  
            // }
            // if (activities[k].block == '-') {
            //     remark += "block not found, " ;  
            // }
            // if (activities[k].village == '-') {
            //     remark += "village not found, " ;  
            // }
            // if (activities[k].sectorName == '-') {
            //     remark += "sectorName not found, " ;  
            // }
            // if (activities[k].activityName == '-') {
            //     remark += "activityName not found, " ;  
            // }
            // if (activities[k].subactivityName == '-') {
            //     remark += "subactivityName not found, " ;  
            // }
            // if (activities[k].date == '-') {
            //     remark += "date not found, " ;  
            // }
            // if (req.body.reqdata.typeofactivity == '-') {
            //     remark += "typeofactivity not found, " ;  
            // }
            // if ( (parseFloat(unitCost) * parseFloat(quantity)).toFixed(4) != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other ).toFixed(4)) {
            //     remark += "Total Costs are not equal!";
            // }

            // //console.log("projectCategoryType",activities[k].projectCategoryType)
            // if (activities[k].projectCategoryType != "LHWRF Grant" && activities[k].projectCategoryType != "Project Fund") {
            //     remark += "projectCategoryType should be only 'LHWRF Grant' or  'Project Fund', " 
            // }
            //console.log('activities',activities[k]);
            //console.log('remark',remark)
            if (remark == '') {
                var sector = allSectorsData.filter((data)=>{
                    if ((data.sector).toLowerCase() == (activities[k].sectorName.trim()).toLowerCase() && (data.activity.activityName).toLowerCase() == (activities[k].activityName.trim()).toLowerCase() && (data.activity.subActivity.subActivityName).toLowerCase() == (activities[k].subactivityName.trim()).toLowerCase()) {
                        return data;
                    }
                })

                if (sector.length>0) {
                    // console.log('activities[k].familyID',activities[k].familyID);
                    // console.log('activities[k]',activities[k]);
                    if (activities[k].familyID) {
                        familyObject = allFamilyData.filter((data)=>{
                            if (((data.familyID).trim()).toLowerCase() == ((activities[k].familyID).trim()).toLowerCase()) {
                                return data;
                            }
                        })
                        // console.log('familyObject',familyObject);
                        if (familyObject.length>0) {
                            if (activities[k].beneficiaryID) {
                                beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                    if (((data.beneficiaryID).trim()).toLowerCase() == ((activities[k].beneficiaryID).trim()).toLowerCase() && 
                                        ((data.firstNameOfBeneficiary).trim()).toLowerCase() == (activities[k].firstNameOfBeneficiary.trim()).toLowerCase()) {
                                        return data;
                                    }
                                })
                            }
                            // console.log('allBeneficiaryData',allBeneficiaryData);
                            // console.log('beneficiaryObject',beneficiaryObject);
                            if (beneficiaryObject.length>0) {
                                var listofBeneficiaries     = [{
                                    beneficiary_ID      : beneficiaryObject[0]._id,
                                    beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                    family_ID           : familyObject[0]._id,
                                    familyID            : familyObject[0].familyID,
                                    nameofbeneficiary   : beneficiaryObject.surnameOfBeneficiary+" "+beneficiaryObject.firstNameOfBeneficiary+" " + beneficiaryObject.middleNameOfBeneficiary,
                                    relation            : activities[k].relation,
                                    dist                : familyObject[0].dist,
                                    block               : familyObject[0].block,
                                    village             : familyObject[0].village,
                                    isUpgraded          : activities[k].isUpgraded,
                                }]
                                // console.log('listofBeneficiaries',listofBeneficiaries)   
                                
                                var date;
                                if (typeof activities[k].date == 'number') {
                                    date = moment(new Date(Math.round((activities[k].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                }else{
                                    date = moment(activities[k].date,'YYYY-MM-DD')._i
                                }

                                var projectCategoryType = activities[k].projectCategoryType;
                                var projectName = activities[k].projectName == "LHWRF Grant" ? "-" : activities[k].projectName;
                                var sectorName = activities[k].sectorName.trim();
                                var activityName = activities[k].activityName.trim();
                                var subactivityName = activities[k].subactivityName.trim();
                                
                                validObjects = activities[k];
                                // console.log('validObjects++++++++++++++++++',validObjects);
                                validObjects.sectorName          = sectorName;
                                validObjects.activityName        = activityName;
                                validObjects.noOfBeneficiaries   = 0;
                                validObjects.subactivityName     = subactivityName;
                                validObjects.projectCategoryType = projectCategoryType;
                                validObjects.projectName         = projectName;   
                                validObjects.center_ID           = req.body.reqdata.center_ID;
                                validObjects.centerName          = req.body.reqdata.centerName;
                                validObjects.typeofactivity      = req.body.reqdata.typeofactivity;
                                validObjects.district            = activities[k].district;
                                validObjects.block               = activities[k].block;
                                validObjects.village             = activities[k].village;
                                validObjects.location            = activities[k].location;
                                validObjects.date                = date.trim();
                                validObjects.sector_ID           = sector[0]._id;
                                validObjects.activity_ID         = sector[0].activity._id;
                                validObjects.subactivity_ID      = sector[0].activity.subActivity._id;
                                validObjects.unitCost            = unitCost;
                                validObjects.quantity            = quantity;
                                validObjects.totalCost           = unitCost * quantity,
                                validObjects.sourceofFund        = { 
                                                        LHWRF               : LHWRF,
                                                        NABARD              : NABARD,
                                                        bankLoan            : bankLoan,
                                                        govtscheme          : govtscheme,
                                                        directCC            : directCC,
                                                        indirectCC          : indirectCC,
                                                        other               : other,
                                                        total               : LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other 
                                                      };
                                validObjects.listofBeneficiaries = listofBeneficiaries;
                                validObjects.remark              = activities[k].remark;
                                validObjects.fileName            = req.body.fileName;
                                validObjects.createdAt           = new Date()
                                validData1.push(validObjects); 
                                // console.log("subactivityName++++++++++++++++++",validData1)
                            }
                        }
                    }else{
                        var date;
                        if (typeof activities[k].date == 'number') {
                            date = moment(new Date(Math.round((activities[k].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                        }else{
                            date = moment(activities[k].date,'YYYY-MM-DD')._i
                        }

                        var projectCategoryType = activities[k].projectCategoryType;
                        var projectName = activities[k].projectName == "LHWRF Grant" ? "-" : activities[k].projectName;
                        var sectorName = activities[k].sectorName.trim();
                        var activityName = activities[k].activityName.trim();
                        var subactivityName = activities[k].subactivityName.trim();
                        
                        validObjects = activities[k];
                        // console.log('validObjects===============',validObjects);
                        validObjects.sectorName          = sectorName;
                        validObjects.activityName        = activityName;
                        validObjects.noOfBeneficiaries   = noOfBeneficiaries;
                        validObjects.subactivityName     = subactivityName;
                        validObjects.projectCategoryType = projectCategoryType;
                        validObjects.projectName         = projectName;   
                        validObjects.center_ID           = req.body.reqdata.center_ID;
                        validObjects.centerName          = req.body.reqdata.centerName;
                        validObjects.typeofactivity      = req.body.reqdata.typeofactivity;
                        validObjects.district            = activities[k].district;
                        validObjects.block               = activities[k].block;
                        validObjects.village             = activities[k].village;
                        validObjects.location            = activities[k].location;
                        validObjects.date                = date.trim();
                        validObjects.sector_ID           = sector[0]._id;
                        validObjects.activity_ID         = sector[0].activity._id;
                        validObjects.subactivity_ID      = sector[0].activity.subActivity._id;
                        validObjects.unitCost            = unitCost;
                        validObjects.quantity            = quantity;
                        validObjects.totalCost           = unitCost * quantity,
                        validObjects.sourceofFund        = { 
                                                LHWRF               : LHWRF,
                                                NABARD              : NABARD,
                                                bankLoan            : bankLoan,
                                                govtscheme          : govtscheme,
                                                directCC            : directCC,
                                                indirectCC          : indirectCC,
                                                other               : other,
                                                total               : LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other 
                                              };
                        validObjects.listofBeneficiaries = [];
                        validObjects.remark              = activities[k].remark;
                        validObjects.fileName            = req.body.fileName;
                        validObjects.createdAt           = new Date()
                        validData.push(validObjects); 
                        // console.log("subactivityName",validData)
                    }
                }else{

                    // console.log('activities===================',activities[k]);
                    if (activities[k].familyID) {
                        familyObject = allFamilyData.filter((data)=>{
                            if (((data.familyID).trim()).toLowerCase() == ((activities[k].familyID).trim()).toLowerCase()) {
                                return data;
                            }
                        })
                        if (familyObject.length>0) {
                            if (activities[k].beneficiaryID) {
                                beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                    if (((data.beneficiaryID).trim()).toLowerCase() == ((activities[k].beneficiaryID).trim()).toLowerCase() && 
                                        ((data.firstNameOfBeneficiary).trim()).toLowerCase() == (activities[k].firstNameOfBeneficiary.trim()).toLowerCase()) {
                                        return data;
                                    }
                                })
                            }
                            if (beneficiaryObject.length>0) {
                                var listofBeneficiaries     = [{
                                    beneficiary_ID      : beneficiaryObject[0]._id,
                                    beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                    family_ID           : familyObject[0]._id,
                                    familyID            : familyObject[0].familyID,
                                    nameofbeneficiary   : beneficiaryObject.surnameOfBeneficiary+" "+beneficiaryObject.firstNameOfBeneficiary+" " + beneficiaryObject.middleNameOfBeneficiary,
                                    relation            : activities[k].relation,
                                    dist                : familyObject[0].dist,
                                    block               : familyObject[0].block,
                                    village             : familyObject[0].village,
                                    isUpgraded          : activities[k].isUpgraded,
                                }]
                                // console.log('listofBeneficiaries',listofBeneficiaries)   
                            
                                
                                // validObjects = activities[k];
                                // console.log('validObjects===============',validObjects);
                                validObjects.listofBeneficiaries = listofBeneficiaries;
                                validData.push(validObjects); 
                                // console.log("validData",validData)
                            }
                        }
                    }


                    //console.log('date',date);
                    // activities[k].date = date;
                    // invalidObjects = activities[k];
                    // invalidObjects.failedRemark = "Subactivity details not found ";
                    // invalidData.push(invalidObjects);
                }
               
            }else{
                var date;
                if (activities[k].date == '-') { 
                    activities[k].date = '-';
                }else{
                    if (typeof activities[k].date == 'number') {
                        date = moment(new Date(Math.round((activities[k].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                    }else{
                        date = moment(new Date(activities[k].date)).format("YYYY-MM-DD")
                    }
                    //console.log('origdate',activities[k].date);
                    //console.log('date2',date);
                    activities[k].date = date;
                }
                invalidObjects = activities[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            remark= '';
        }
        //console.log("validData",validData);
        ActivityReport.insertMany(validData)
        .then(data=>{
            // console.log("data",data);
        })
        .catch(err =>{
            console.log(err);
        });

        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords,req.body.updateBadData);
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
        });
        
        // console.log("newactivityLst",newactivityLst);
        // if(k >= activities.length){
        //     res.status(200).json({"uploadedData": newactivityLst,"message":"Activity Report Details updated Successfully"})
        // }
        //var msgstr = "";
    }    
};
function getAllSectors(){
    return new Promise((resolve,reject)=>{
        
        Sectors.aggregate([{$unwind: "$activity"},{$unwind: "$activity.subActivity"}])
        .exec()
        .then(data =>{
            //console.log('data',data)
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
};
var insertFailedRecords = async (invalidData,updateBadData) => {
    //console.log('invalidData',invalidData);
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
    ActivityReport.find({center_ID: req.params.center_ID, fileName:req.params.fileName})
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
    ActivityReport.aggregate([
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


    // ActivityReport.find({center_ID: req.body.center_ID})
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
    ActivityReport.find({center_ID: req.params.center_ID})
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
function addBeneficiaryToActivity(activityId, listofBeneficiaries){
    // console.log('activityId',activityId)
    // console.log('listofBeneficiaries',listofBeneficiaries[0].beneficiary_ID)
    return new Promise((resolve,reject)=>{
        ActivityReport.findOne({ "_id": activityId ,"listofBeneficiaries.beneficiary_ID" : listofBeneficiaries[0].beneficiary_ID })
        .exec()
        .then(data=>{
            if (data) {
                // console.log('data',0)
                resolve(0);
            }else{
                ActivityReport.updateOne({ _id      : activityId },
                    {
                        $push:  { 'listofBeneficiaries' : listofBeneficiaries }
                    })
                .then(data =>{
                    // console.log('data',data)
                    if(data.nModified == 1){
                        resolve(1);
                    }else{
                        resolve(0);
                    }
                })
                .catch(err =>{
                    reject(err);
                });
            }    
        })
        .catch(err =>{
            reject(err);
        });
    });
}
exports.bulk_upload_beneficiaries = (req,res,next)=>{
    var filedata = req.body.data;
    // console.log("filedata",filedata);
    var newactivityLst = [];
    var validData = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var remark = ''; 
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    var selector = {}
    bulkInsertBeneficiaries(); 
    async function bulkInsertBeneficiaries(){
        var allActivityData = await findAllActivity();
        //console.log('allActivityData',allActivityData)
        var allFamilyData = await findAllFamily();
        var allBeneficiaryData = await findAllBeneficiary();
        for(var k = 0 ; k < filedata.length ; k++){
            if (filedata[k].sectorName == '-') {
                remark += "sectorName not found, " ;  
            }
            if (filedata[k].activityName == '-') {
                remark += "activityName not found, " ;  
            }
            if (filedata[k].subactivityName == '-') {
                remark += "subactivityName not found, " ;  
            }
            if (filedata[k].date == '-') {
                remark += "date not found, " ;  
            }

            if (remark == '') {
                var date;
                var familyObject={};
                var beneficiaryObject={}; 
                if (typeof filedata[k].date == 'number') {
                    date = moment(new Date(Math.round((filedata[k].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    date = moment(filedata[k].date).format("YYYY-MM-DD")
                }
                // find activity if exists
                var activity = allActivityData.filter((data)=>{
                    if (data.sectorName == filedata[k].sectorName.trim() && data.activityName == filedata[k].activityName.trim()
                     && data.subactivityName == filedata[k].subactivityName.trim() && data.date == date) {
                        return data;
                    }
                })
                //console.log("activity",activity)
                if (activity.length>0) {
                    // if family id is not empty 
                    if (filedata[k].familyID != '-') {
                        familyObject = allFamilyData.filter((data)=>{
                            if (data.familyID == filedata[k].familyID) {
                                return data;
                            }
                        })
                        // console.log("familyObject11",familyObject)
                        // if family id present in db
                        if (familyObject.length>0) {
                            if (filedata[k].beneficiaryID != '-') {
                                beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                    if (data.beneficiaryID == filedata[k].beneficiaryID) {
                                        return data;
                                    }
                                })
                            }else{
                                if (filedata[k].uidNumber != '-' ) {
                                    beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                        if (data.uidNumber == filedata[k].uidNumber) {
                                            return data;
                                        }
                                    })
                                }else{
                                    beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                        if (data.surnameOfBeneficiary == filedata[k].surnameOfBeneficiary.trim() && 
                                            data.firstNameOfBeneficiary == filedata[k].firstNameOfBeneficiary.trim() && 
                                            data.middleNameOfBeneficiary == filedata[k].middleNameOfBeneficiary.trim()) {
                                            return data;
                                        }
                                    })
                                }
                            }

                            //console.log('beneficiaryObject',beneficiaryObject)
                            if (beneficiaryObject.length>0) {
                                var listofBeneficiaries     = [{
                                        beneficiary_ID      : beneficiaryObject[0]._id,
                                        beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                        family_ID           : familyObject[0]._id,
                                        familyID            : familyObject[0].familyID,
                                        nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                        relation            : filedata[k].relation,
                                        dist                : familyObject[0].dist,
                                        block               : familyObject[0].block,
                                        village             : familyObject[0].village,
                                        isUpgraded          : filedata[k].isUpgraded,
                                        fileName            : req.body.fileName
                                   }]
                                // console.log('listofBeneficiaries',listofBeneficiaries)   
                                var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                if (!addBeneficiaryToActivityObj) { 
                                    remark += "Beneficiary is already added" ;  
                                }
                            }
                            else{
                                // remark for empty fields in beneficiary
                                if (filedata[k].surnameOfBeneficiary == '-') {
                                    remark += "surnameOfBeneficiary not found, " ;  
                                }
                                if (filedata[k].firstNameOfBeneficiary == '-') {
                                    remark += "firstNameOfBeneficiary not found, " ;  
                                }    
                                if (filedata[k].middleNameOfBeneficiary == '-') {
                                    remark += "middleNameOfBeneficiary not found, " ;  
                                }
                                if (filedata[k].genderOfbeneficiary == '-') {
                                    remark += "genderOfbeneficiary not found, " ;  
                                }
                                if (filedata[k].birthYearOfbeneficiary == '-') {
                                    remark += "birthYearOfbeneficiary not found, " ;  
                                }
                                if (remark=='') {
                                    var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,familyObject._id,familyObject.familyID, req.body.fileName);
                                    var listofBeneficiaries     = [{
                                            beneficiary_ID      : insertBeneficiaryObject._id,
                                            beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                            family_ID           : familyObject[0]._id,
                                            familyID            : familyObject[0].familyID,
                                            nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                            relation            : filedata[k].relation,
                                            dist                : familyObject[0].dist,
                                            block               : familyObject[0].block,
                                            village             : familyObject[0].village,
                                            isUpgraded          : filedata[k].isUpgraded,
                                            fileName            : req.body.fileName
                                       }]
                                    //console.log('listofBeneficiaries',listofBeneficiaries)   
                                    var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                    
                                    addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                    if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                }
                            }
                        }else{
                            // if family id is not present in db and uidNumberOfFH is not empty, check with uidNumberOfFH
                            if (filedata[k].uidNumberOfFH != '-' ) {
                                familyObject = allFamilyData.filter((data)=>{
                                    if (data.uidNumber == filedata[k].uidNumberOfFH) {
                                        return data;
                                    }
                                })
                                
                                if (familyObject.length > 0) {
                                    if (filedata[k].beneficiaryID != '-') {
                                        // find beneficiary by beneficiaryID if exists
                                        beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                            if (data.beneficiaryID == filedata[k].beneficiaryID) {
                                                return data;
                                            }
                                        })
                                    }else{
                                        if (filedata[k].uidNumber != '-' ) {
                                            // find beneficiary by uidNumber if exists
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.uidNumber == filedata[k].uidNumber) {
                                                    return data;
                                                }
                                            })
                                        }else{
                                            // find beneficiary by details
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.surnameOfBeneficiary == filedata[k].surnameOfBeneficiary.trim() && 
                                                    data.firstNameOfBeneficiary == filedata[k].firstNameOfBeneficiary.trim() && 
                                                    data.middleNameOfBeneficiary == filedata[k].middleNameOfBeneficiary.trim()) {
                                                    return data;
                                                }
                                            })
                                        }
                                    }

                                    if (beneficiaryObject != 0) {
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : beneficiaryObject[0]._id,
                                                beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                                family_ID           : familyObject[0]._id,
                                                familyID            : familyObject[0].familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : familyObject[0].dist,
                                                block               : familyObject[0].block,
                                                village             : familyObject[0].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }else{
                                        // remark for empty fields in beneficiary
                                        if (filedata[k].surnameOfBeneficiary == '-') {
                                            remark += "surnameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].firstNameOfBeneficiary == '-') {
                                            remark += "firstNameOfBeneficiary not found, " ;  
                                        }    
                                        if (filedata[k].middleNameOfBeneficiary == '-') {
                                            remark += "middleNameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].genderOfbeneficiary == '-') {
                                            remark += "genderOfbeneficiary not found, " ;  
                                        }
                                        if (filedata[k].birthYearOfbeneficiary == '-') {
                                            remark += "birthYearOfbeneficiary not found, " ;  
                                        }
                                        if (remark=='') {
                                            var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,familyObject._id,familyObject.familyID, req.body.fileName);
                                            var listofBeneficiaries     = [{
                                                    beneficiary_ID      : insertBeneficiaryObject._id,
                                                    beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                    family_ID           : familyObject[0]._id,
                                                    familyID            : familyObject[0].familyID,
                                                    nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                    relation            : filedata[k].relation,
                                                    dist                : familyObject[0].dist,
                                                    block               : familyObject[0].block,
                                                    village             : familyObject[0].village,
                                                    isUpgraded          : filedata[k].isUpgraded,
                                                    fileName            : req.body.fileName
                                               }]
                                            //console.log('listofBeneficiaries',listofBeneficiaries)   
                                            var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                            addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;   
                                            if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                        }    
                                    } 

                                }else{
                                    // remark for empty fields in family
                                    if (filedata[k].surnameOfFH == '-') {
                                        remark += "surnameOfFH not found, " ;  
                                    }
                                    if (filedata[k].firstNameOfFH == '-') {
                                        remark += "firstNameOfFH not found, " ;  
                                    }    
                                    if (filedata[k].middleNameOfFH == '-') {
                                        remark += "middleNameOfFH not found, " ;  
                                    }
                                    if (filedata[k].FHGender == '-') {
                                        remark += "FHGender not found, " ;  
                                    }
                                    if (filedata[k].FHYearOfBirth == '-') {
                                        remark += "FHYearOfBirth not found, " ;  
                                    }
                                    // remark for empty fields in beneficiary
                                    if (filedata[k].surnameOfBeneficiary == '-') {
                                        remark += "surnameOfBeneficiary not found, " ;  
                                    }
                                    if (filedata[k].firstNameOfBeneficiary == '-') {
                                        remark += "firstNameOfBeneficiary not found, " ;  
                                    }    
                                    if (filedata[k].middleNameOfBeneficiary == '-') {
                                        remark += "middleNameOfBeneficiary not found, " ;  
                                    }
                                    if (filedata[k].genderOfbeneficiary == '-') {
                                        remark += "genderOfbeneficiary not found, " ;  
                                    }
                                    if (filedata[k].birthYearOfbeneficiary == '-') {
                                        remark += "birthYearOfbeneficiary not found, " ;  
                                    }
                                    if (remark == '') {
                                        // insert family if not exists
                                        var addFamilyObj = await addFamily(filedata[k], req.body.reqdata, req.body.fileName);
                                        
                                        var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,addFamilyObj._id,addFamilyObj.familyID, req.body.fileName);
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : insertBeneficiaryObject._id,
                                                beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                family_ID           : addFamilyObj._id,
                                                familyID            : addFamilyObj.familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : filedata[k].dist,
                                                block               : filedata[k].block,
                                                village             : filedata[k].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }
                                }
                            }else{
                                // if family id and uidNumberOfFH are empty, check with details
                                familyObject = allFamilyData.filter((data)=>{
                                    if (data.surnameOfFH == filedata[k].surnameOfFH.trim() &&
                                        data.firstNameOfFH == filedata[k].firstNameOfFH.trim() &&
                                        data.middleNameOfFH == filedata[k].middleNameOfFH.trim() ) {
                                        return data;
                                    }
                                })
                                // if family details present in db uppdate beneficiary into db 
                                if (familyObject.length>0) {
                                    if (filedata[k].beneficiaryID != '-') {
                                        // find beneficiary by beneficiaryID if exists
                                        beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                            if (data.beneficiaryID == filedata[k].beneficiaryID) {
                                                return data;
                                            }
                                        })
                                    }else{
                                        if (filedata[k].uidNumber != '-' ) {
                                            // find beneficiary by uidNumber if exists
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.uidNumber == filedata[k].uidNumber) {
                                                    return data;
                                                }
                                            })
                                        }else{
                                            // find beneficiary by details
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.surnameOfBeneficiary == filedata[k].surnameOfBeneficiary.trim() && 
                                                    data.firstNameOfBeneficiary == filedata[k].firstNameOfBeneficiary.trim() && 
                                                    data.middleNameOfBeneficiary == filedata[k].middleNameOfBeneficiary.trim()) {
                                                    return data;
                                                }
                                            })
                                        }
                                    }

                                    if (beneficiaryObject != 0) {
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : beneficiaryObject[0]._id,
                                                beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                                family_ID           : familyObject[0]._id,
                                                familyID            : familyObject[0].familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : familyObject[0].dist,
                                                block               : familyObject[0].block,
                                                village             : familyObject[0].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }else{
                                        // remark for empty fields in beneficiary
                                        if (filedata[k].surnameOfBeneficiary == '-') {
                                            remark += "surnameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].firstNameOfBeneficiary == '-') {
                                            remark += "firstNameOfBeneficiary not found, " ;  
                                        }    
                                        if (filedata[k].middleNameOfBeneficiary == '-') {
                                            remark += "middleNameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].genderOfbeneficiary == '-') {
                                            remark += "genderOfbeneficiary not found, " ;  
                                        }
                                        if (filedata[k].birthYearOfbeneficiary == '-') {
                                            remark += "birthYearOfbeneficiary not found, " ;  
                                        }
                                        if (remark=='') {
                                            var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,familyObject._id,familyObject.familyID, req.body.fileName);
                                            var listofBeneficiaries     = [{
                                                    beneficiary_ID      : insertBeneficiaryObject._id,
                                                    beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                    family_ID           : familyObject[0]._id,
                                                    familyID            : familyObject[0].familyID,
                                                    nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                    relation            : filedata[k].relation,
                                                    dist                : familyObject[0].dist,
                                                    block               : familyObject[0].block,
                                                    village             : familyObject[0].village,
                                                    isUpgraded          : filedata[k].isUpgraded,
                                                    fileName            : req.body.fileName
                                               }]
                                            //console.log('listofBeneficiaries',listofBeneficiaries)   
                                            var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                            addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;   
                                            if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                        }    
                                    }
                                }else{
                                    // remark for empty fields in family
                                    if (filedata[k].surnameOfFH == '-') {
                                        remark += "surnameOfFH not found, " ;  
                                    }
                                    if (filedata[k].firstNameOfFH == '-') {
                                        remark += "firstNameOfFH not found, " ;  
                                    }    
                                    if (filedata[k].middleNameOfFH == '-') {
                                        remark += "middleNameOfFH not found, " ;  
                                    }
                                    if (filedata[k].FHGender == '-') {
                                        remark += "FHGender not found, " ;  
                                    }
                                    if (filedata[k].FHYearOfBirth == '-') {
                                        remark += "FHYearOfBirth not found, " ;  
                                    }
                                    // remark for empty fields in beneficiary
                                    if (filedata[k].surnameOfBeneficiary == '-') {
                                        remark += "surnameOfBeneficiary not found, " ;  
                                    }
                                    if (filedata[k].firstNameOfBeneficiary == '-') {
                                        remark += "firstNameOfBeneficiary not found, " ;  
                                    }    
                                    if (filedata[k].middleNameOfBeneficiary == '-') {
                                        remark += "middleNameOfBeneficiary not found, " ;  
                                    }
                                    if (filedata[k].genderOfbeneficiary == '-') {
                                        remark += "genderOfbeneficiary not found, " ;  
                                    }
                                    if (filedata[k].birthYearOfbeneficiary == '-') {
                                        remark += "birthYearOfbeneficiary not found, " ;  
                                    }
                                    if (remark == '') {
                                        // insert family if not exists
                                        var addFamilyObj = await addFamily(filedata[k], req.body.reqdata, req.body.fileName);
                                        
                                        var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,addFamilyObj._id,addFamilyObj.familyID, req.body.fileName);
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : insertBeneficiaryObject._id,
                                                beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                family_ID           : addFamilyObj._id,
                                                familyID            : addFamilyObj.familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : filedata[k].dist,
                                                block               : filedata[k].block,
                                                village             : filedata[k].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }
                                }
                            }
                        }
                    }else{
                        // if family id is empty and uidNumberOfFH is not empty, check with uidNumberOfFH
                        if (filedata[k].uidNumberOfFH != '-' ) {
                                familyObject = allFamilyData.filter((data)=>{
                                    if (data.uidNumber == filedata[k].uidNumberOfFH) {
                                        return data;
                                    }
                                })
                                if (familyObject.length > 0) {
                                    if (filedata[k].beneficiaryID != '-') {
                                        // find beneficiary by beneficiaryID if exists
                                        beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                            if (data.beneficiaryID == filedata[k].beneficiaryID) {
                                                return data;
                                            }
                                        })
                                    }else{
                                        if (filedata[k].uidNumber != '-' ) {
                                            // find beneficiary by uidNumber if exists
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.uidNumber == filedata[k].uidNumber) {
                                                    return data;
                                                }
                                            })
                                        }else{
                                            // find beneficiary by details
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.surnameOfBeneficiary == filedata[k].surnameOfBeneficiary.trim() && 
                                                    data.firstNameOfBeneficiary == filedata[k].firstNameOfBeneficiary.trim() && 
                                                    data.middleNameOfBeneficiary == filedata[k].middleNameOfBeneficiary.trim()) {
                                                    return data;
                                                }
                                            })
                                        }
                                    }

                                    if (beneficiaryObject != 0) {
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : beneficiaryObject[0]._id,
                                                beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                                family_ID           : familyObject[0]._id,
                                                familyID            : familyObject[0].familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : familyObject[0].dist,
                                                block               : familyObject[0].block,
                                                village             : familyObject[0].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }else{
                                        // remark for empty fields in beneficiary
                                        if (filedata[k].surnameOfBeneficiary == '-') {
                                            remark += "surnameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].firstNameOfBeneficiary == '-') {
                                            remark += "firstNameOfBeneficiary not found, " ;  
                                        }    
                                        if (filedata[k].middleNameOfBeneficiary == '-') {
                                            remark += "middleNameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].genderOfbeneficiary == '-') {
                                            remark += "genderOfbeneficiary not found, " ;  
                                        }
                                        if (filedata[k].birthYearOfbeneficiary == '-') {
                                            remark += "birthYearOfbeneficiary not found, " ;  
                                        }
                                        if (remark=='') {
                                            var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,familyObject._id,familyObject.familyID, req.body.fileName);
                                            var listofBeneficiaries     = [{
                                                    beneficiary_ID      : insertBeneficiaryObject._id,
                                                    beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                    family_ID           : familyObject[0]._id,
                                                    familyID            : familyObject[0].familyID,
                                                    nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                    relation            : filedata[k].relation,
                                                    dist                : familyObject[0].dist,
                                                    block               : familyObject[0].block,
                                                    village             : familyObject[0].village,
                                                    isUpgraded          : filedata[k].isUpgraded,
                                                    fileName            : req.body.fileName
                                               }]
                                            //console.log('listofBeneficiaries',listofBeneficiaries)   
                                            var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                            addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;   
                                            if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                        }    
                                    } 
                                }else{
                                    // innndsdjsdj
                                }
                        }else{
                            // if family id and uidNumberOfFH are empty, check with details
                            familyObject = allFamilyData.filter((data)=>{
                                if (data.surnameOfFH == filedata[k].surnameOfFH.trim() &&
                                    data.firstNameOfFH == filedata[k].firstNameOfFH.trim() &&
                                    data.middleNameOfFH == filedata[k].middleNameOfFH.trim() ) {
                                    return data;
                                }
                            })
                            // if family details present in db uppdate beneficiary into db 
                             if (familyObject.length>0) {
                                    if (filedata[k].beneficiaryID != '-') {
                                        // find beneficiary by beneficiaryID if exists
                                        beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                            if (data.beneficiaryID == filedata[k].beneficiaryID) {
                                                return data;
                                            }
                                        })
                                    }else{
                                        if (filedata[k].uidNumber != '-' ) {
                                            // find beneficiary by uidNumber if exists
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.uidNumber == filedata[k].uidNumber) {
                                                    return data;
                                                }
                                            })
                                        }else{
                                            // find beneficiary by details
                                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                                if (data.surnameOfBeneficiary == filedata[k].surnameOfBeneficiary.trim() && 
                                                    data.firstNameOfBeneficiary == filedata[k].firstNameOfBeneficiary.trim() && 
                                                    data.middleNameOfBeneficiary == filedata[k].middleNameOfBeneficiary.trim()) {
                                                    return data;
                                                }
                                            })
                                        }
                                    }

                                    if (beneficiaryObject != 0) {
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : beneficiaryObject[0]._id,
                                                beneficiaryID       : beneficiaryObject[0].beneficiaryID,
                                                family_ID           : familyObject[0]._id,
                                                familyID            : familyObject[0].familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : familyObject[0].dist,
                                                block               : familyObject[0].block,
                                                village             : familyObject[0].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }else{
                                        // remark for empty fields in beneficiary
                                        if (filedata[k].surnameOfBeneficiary == '-') {
                                            remark += "surnameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].firstNameOfBeneficiary == '-') {
                                            remark += "firstNameOfBeneficiary not found, " ;  
                                        }    
                                        if (filedata[k].middleNameOfBeneficiary == '-') {
                                            remark += "middleNameOfBeneficiary not found, " ;  
                                        }
                                        if (filedata[k].genderOfbeneficiary == '-') {
                                            remark += "genderOfbeneficiary not found, " ;  
                                        }
                                        if (filedata[k].birthYearOfbeneficiary == '-') {
                                            remark += "birthYearOfbeneficiary not found, " ;  
                                        }
                                        if (remark=='') {
                                            var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,familyObject._id,familyObject.familyID, req.body.fileName);
                                            var listofBeneficiaries     = [{
                                                    beneficiary_ID      : insertBeneficiaryObject._id,
                                                    beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                    family_ID           : familyObject[0]._id,
                                                    familyID            : familyObject[0].familyID,
                                                    nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                    relation            : filedata[k].relation,
                                                    dist                : familyObject[0].dist,
                                                    block               : familyObject[0].block,
                                                    village             : familyObject[0].village,
                                                    isUpgraded          : filedata[k].isUpgraded,
                                                    fileName            : req.body.fileName
                                               }]
                                            //console.log('listofBeneficiaries',listofBeneficiaries)   
                                            var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                            addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;   
                                            if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                        }    
                                    }
                                }else{
                                    // remark for empty fields in family
                                    if (filedata[k].surnameOfFH == '-') {
                                        remark += "surnameOfFH not found, " ;  
                                    }
                                    if (filedata[k].firstNameOfFH == '-') {
                                        remark += "firstNameOfFH not found, " ;  
                                    }    
                                    if (filedata[k].middleNameOfFH == '-') {
                                        remark += "middleNameOfFH not found, " ;  
                                    }
                                    if (filedata[k].FHGender == '-') {
                                        remark += "FHGender not found, " ;  
                                    }
                                    if (filedata[k].FHYearOfBirth == '-') {
                                        remark += "FHYearOfBirth not found, " ;  
                                    }
                                    // remark for empty fields in beneficiary
                                    if (filedata[k].surnameOfBeneficiary == '-') {
                                        remark += "surnameOfBeneficiary not found, " ;  
                                    }
                                    if (filedata[k].firstNameOfBeneficiary == '-') {
                                        remark += "firstNameOfBeneficiary not found, " ;  
                                    }    
                                    if (filedata[k].middleNameOfBeneficiary == '-') {
                                        remark += "middleNameOfBeneficiary not found, " ;  
                                    }
                                    if (filedata[k].genderOfbeneficiary == '-') {
                                        remark += "genderOfbeneficiary not found, " ;  
                                    }
                                    if (filedata[k].birthYearOfbeneficiary == '-') {
                                        remark += "birthYearOfbeneficiary not found, " ;  
                                    }
                                    if (remark == '') {
                                        // insert family if not exists
                                        var addFamilyObj = await addFamily(filedata[k], req.body.reqdata, req.body.fileName);
                                        
                                        var insertBeneficiaryObject = await insertBeneficiaryFun(filedata[k], req.body.reqdata,addFamilyObj._id,addFamilyObj.familyID, req.body.fileName);
                                        var listofBeneficiaries     = [{
                                                beneficiary_ID      : insertBeneficiaryObject._id,
                                                beneficiaryID       : insertBeneficiaryObject.beneficiaryID,
                                                family_ID           : addFamilyObj._id,
                                                familyID            : addFamilyObj.familyID,
                                                nameofbeneficiary   : filedata[k].surnameOfBeneficiary+" "+filedata[k].firstNameOfBeneficiary+" " + filedata[k].middleNameOfBeneficiary,
                                                relation            : filedata[k].relation,
                                                dist                : filedata[k].dist,
                                                block               : filedata[k].block,
                                                village             : filedata[k].village,
                                                isUpgraded          : filedata[k].isUpgraded,
                                                fileName            : req.body.fileName
                                           }]
                                        //console.log('listofBeneficiaries',listofBeneficiaries)   
                                        var addBeneficiaryToActivityObj = await addBeneficiaryToActivity(activity[0]._id, listofBeneficiaries);
                                        addBeneficiaryToActivityObj ?  Count++ : DuplicateCount++;
                                        if (!addBeneficiaryToActivityObj) { remark += "Beneficiary is already added" ;  }
                                    }
                                }

                        }
                    }
                }else{
                     remark += "activity not found, " ; 
                }
            }

            if (remark != '') {
                invalidObjects = filedata[k];
                invalidObjects.failedRemark = remark;
                invalidData.push(invalidObjects);
            }
            //console.log('remark',remark)
            remark= '';
        }
        // console.log('Count',Count)
        // console.log('DuplicateCount',DuplicateCount);
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;

        await insertFailedRecords(failedRecords,req.body.updateBadData);
        
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
        });
        
    }    
}
function findAllActivity(sectorName,activityName,subactivityName){
    return new Promise((resolve,reject)=>{
        ActivityReport.find({})
        .exec()
        .then(data =>{
            resolve(data);
        })
        .catch(err =>{
            reject(err);
        });
    });
}
function findAllFamily(selector){
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.find({})
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
function findAllBeneficiary(selector){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.find({})
        .exec()
        .then(data =>{
            resolve(data);
        })
        .catch(err =>{
            reject(err);
        });
    });
}
function findActivity(sectorName,activityName,subactivityName,date){
    return new Promise((resolve,reject)=>{
        ActivityReport.findOne({ 
            "sectorName"      : {$regex : sectorName ,$options: "i"}, 
            "activityName"    : {$regex : activityName ,$options: "i"} ,
            "subactivityName" : {$regex : subactivityName ,$options: "i"} ,
        })
        .exec()
        .then(data =>{
            // console.log('data',data)
            if(data){
                resolve(data._id);
            }else{
                resolve(0);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
function findFamily(selector){
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.findOne(selector)
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
function findBeneficiary(selector){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne(selector)
        .exec()
        .then(data =>{
            // console.log('data',data)
            if(data){
                resolve({ _id : data._id, beneficiaryID: data.beneficiaryID });
            }else{
                resolve(0);
            }
        })
        .catch(err =>{
            reject(err);
        });
    });
}
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
                resolve(IDdetails+"000001")
            }
       })
       .catch(err=>{
            reject(err);
       })
    });
}
function addFamily(family,center, fileName){
  //  console.log('center',center)
    return new Promise(function(resolve,reject){
        BeneficiaryFamilies.findOne({ "surnameOfFH":family.surnameOfFH,
                        "firstNameOfFH"   : family.firstNameOfFH,
                        "middleNameOfFH"  : family.middleNameOfFH,
                        "FHGender"        : family.FHGender,
                        "FHYearOfBirth"   : family.FHYearOfBirth  
            })
        .exec()
        .then(data =>{
            if(data){
                resolve(data);
            }else{
                getData();
                async function getData(){
                    var familyID = await fetchFamilyID(center.centerName);
                    const beneficiaryFamilies = new BeneficiaryFamilies({
                                _id             : new mongoose.Types.ObjectId(),                    
                                familyID        : familyID,
                                surnameOfFH     : family.surnameOfFH,
                                firstNameOfFH   : family.firstNameOfFH,
                                middleNameOfFH  : family.middleNameOfFH,
                                contactNumber   : family.contactNumber,
                                uidNumber       : family.uidNumberOfFH,
                                caste           : family.caste,
                                incomeCategory  : family.incomeCategory,
                                landCategory    : family.landCategory,
                                specialCategory : family.specialCategory,
                                center_ID       : center.center_ID,
                                center          : center.centerName,
                                state           : family.state,
                                dist            : family.dist,
                                block           : family.block,
                                village         : family.village,
                                FHGender        : family.FHGender,
                                FHYearOfBirth   : family.FHYearOfBirth, 
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
    });
}
function insertBeneficiaryFun(benificiary,center,family_ID,familyID,fileName){
    //console.log('center',center)
    return new Promise((resolve,reject)=>{
         ListOfbeneficiary.findOne(
            {
                $and : 
                [
                    {
                        familyID                 : familyID,
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
                        genderOfbeneficiary     : benificiary.genderOfbeneficiary,
                    },
                    {
                        birthYearOfbeneficiary  : benificiary.birthYearOfbeneficiary,
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
                    var beneficiaryID = await fetchBeneficiaryID(center.centerName);
                    const listOfbeneficiary = new ListOfbeneficiary({
                        _id                     : new mongoose.Types.ObjectId(),    
                        beneficiaryID           : beneficiaryID,
                        family_ID               : family_ID,
                        familyID                : familyID,
                        center_ID               : center.center_ID,
                        center                  : center.centerName,
                        surnameOfBeneficiary    : benificiary.surnameOfBeneficiary,
                        firstNameOfBeneficiary  : benificiary.firstNameOfBeneficiary,
                        middleNameOfBeneficiary : benificiary.middleNameOfBeneficiary,
                        // nameofbeneficiaries     : req.body.nameofbeneficiaries,
                        uidNumber               : benificiary.uidNumber,
                        relation                : benificiary.relation,
                        genderOfbeneficiary     : benificiary.genderOfbeneficiary,
                        birthYearOfbeneficiary  : benificiary.birthYearOfbeneficiary,
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
function fetchBeneficiaryID(center){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne({"center":center})
       .sort({createdAt:-1})
       .exec()
       .then(member=>{
            var IDdetails = center.toUpperCase().slice(0,2)+'-BI-';
            if(member){
                var lastBeneficiaryID = member.beneficiaryID;
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
                resolve(IDdetails+"000001")
            }
        })
        .catch(err=>{
            reject(err);
        })
    });  
}
exports.beneficiaryFiledetails = (req,res,next)=>{
    var finaldata = {};
    //console.log(req.params.fileName)
    ActivityReport.aggregate([
        { $match: {"center_ID": req.params.center_ID, "listofBeneficiaries.fileName" : req.params.fileName} },
        { $unwind: "$listofBeneficiaries"}
        ])
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
exports.beneficiaryfiles = (req,res,next)=>{ 
    // console.log(req.body.center_ID)
    /*ActivityReport.find({center_ID: req.body.center_ID})
    .exec()
    .then(data=>{
        var z = [];
        for(var i=0; i<data.length; i++){
            
            if (data[i].listofBeneficiaries.length>0) {
                //console.log(data[i])
                var x = _.unique(_.pluck(data[i].listofBeneficiaries, "fileName"));
                
                for(var j=0; j<x.length; j++){
                var y = data[i].listofBeneficiaries.filter((a)=> a.fileName == x[j]);
                    if (x[j] !== undefined) {
                        z.push({
                            "fileName": x[j] !== undefined ? x[j] : "Manual",
                            'count': y.length,
                            "_id" : x[j]
                        })
                    }
                }
            }
        }*/
    ActivityReport.aggregate([
        { $match : { "center_ID" : req.body.center_ID } },
        { $unwind: "$listofBeneficiaries" },
        { $group : { _id : "$listofBeneficiaries.fileName", count : {$sum: 1  } } }
        ])
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
exports.beneficiaryFilesCount = (req,res,next)=>{
    // ActivityReport.find({center_ID: req.params.center_ID})
    // .exec()
    // .then(data=>{
    //     var x = _.unique(_.pluck(data, "fileName"));
    //     var z = [];
    //     for(var i=0; i<x.length; i++){
    //         var y = data.filter((a)=> a.fileName == x[i]);
    //         z.push({
    //             "fileName": x[i],
    //             'count': y.length,
    //             "_id" : x[i]
    //         })
    //     }
    //     res.status(200).json(z.length);
    // })
    // .catch(err =>{
    //     console.log(err);
    //     res.status(500).json({
    //         error: err
    //     });
    // });
    
    ActivityReport.find({center_ID: req.params.center_ID})
    .exec()
    .then(data=>{
        var z = [];
        for(var i=0; i<data.length; i++){
            var x = _.unique(_.pluck(data[i].listofBeneficiaries, "fileName"));
            var z = [];
            // console.log('x',x[i]);
            var y = data[i].listofBeneficiaries.filter((a)=> a.fileName == x[i]);
            // if (x[i] !== undefined) {
                // console.log("bbbb x[i] ",x[i]);
                z.push({
                    "fileName": x[i] !== undefined ? x[i] : "Manual",
                    'count': y.length,
                    "_id" : x[i]
                })  
            // }
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
exports.deleteBeneficiariesInActivity = (req,res,next)=>{
    // console.log(req.params.fileName)
    ActivityReport.updateMany({}, {$pull : {listofBeneficiaries : {"fileName":req.params.fileName} }})
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

