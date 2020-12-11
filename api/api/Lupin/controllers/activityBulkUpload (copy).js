const mongoose             = require("mongoose");
const ActivityReport       = require('../models/activityReport');
const BeneficiaryFamilies  = require('../models/families');
const ListOfbeneficiary    = require('../models/beneficiaries');
const Sectors              = require('../models/sectors');
const FailedRecords        = require('../models/failedRecords');
const ProjectMapping       = require('../models/projectMappings');
const moment               = require('moment');

exports.bulk_upload_type_A_activities = (req,res,next)=>{
    // console.log("bulk_upload_excelRows req.body = ",req.body);
    var excelRows       = req.body.data;
    var newactivityLst  = [];
    var validData1      = [];
    var sector          = [];
    var validData       = [];
    var validObjects    = [];
    var invalidData     = [];
    var invalidObjects  = [];
    var validationRemark= ''; 
    var failedRecords   = [];
    var Count           = 0;
    var DuplicateCount  = 0;
    var unitCost        = 0;
    var quantity        = 0;
    var LHWRF           = 0;
    var NABARD          = 0;
    var bankLoan        = 0;
    var govtscheme      = 0;
    var directCC        = 0;
    var indirectCC      = 0;
    var other           = 0;
    var beneficiaryObject  = {};
    var beneficiaryArray   = [];
    var activity_id        = "";
    var validationRemark   = ''; 
    var uploadTime = new Date();

    getActivityData(); 
    async function getActivityData(){
        var center_id       = req.body.reqdata.center_ID;
        var allSectorsData       = await getAllSectors();
        var allFamilyData        = await findAllFamily(center_id);
        var allBeneficiaryData   = await findAllBeneficiary(center_id);
        var allActivityData      = await findAllActivity();
        for(var i = 0 ; i < excelRows.length ; i++){
            var unitCost         = isNaN(Number(excelRows[i].unitCost)) ? 0 : parseFloat(excelRows[i].unitCost);
            var quantity         = isNaN(Number(excelRows[i].quantity)) ? 0 : parseFloat(excelRows[i].quantity);
            var LHWRF            = isNaN(Number(excelRows[i].LHWRF)) ? 0 : parseFloat(excelRows[i].LHWRF);
            var NABARD           = isNaN(Number(excelRows[i].NABARD)) ? 0 : parseFloat(excelRows[i].NABARD);
            var bankLoan         = isNaN(Number(excelRows[i].bankLoan)) ? 0 : parseFloat(excelRows[i].bankLoan);
            var govtscheme       = isNaN(Number(excelRows[i].govtscheme)) ? 0 : parseFloat(excelRows[i].govtscheme);
            var directCC         = isNaN(Number(excelRows[i].directCC)) ? 0 : parseFloat(excelRows[i].directCC);
            var indirectCC       = isNaN(Number(excelRows[i].indirectCC)) ? 0 : parseFloat(excelRows[i].indirectCC);
            var other            = isNaN(Number(excelRows[i].other)) ? 0 :  parseFloat(excelRows[i].other);    
            var noOfBeneficiaries = isNaN(Number(excelRows[i].noOfBeneficiaries)) ? 0 :  parseInt(excelRows[i].noOfBeneficiaries);    
            if(excelRows[i].date != "-" && excelRows[i].sectorName !="-"&& excelRows[i].activityName !="-" && excelRows[i].subactivityName !="-" && excelRows[i].familyID != '-' && excelRows[i].beneficiaryID != '-'){
                if(excelRows[i].sectorName!="-"){
                    beneficiaryArray = [];
                }
                if (excelRows[i].district == '-') {
                    validationRemark += "district not found, " ;  
                }
                if (excelRows[i].block == '-') {
                    validationRemark += "block not found, " ;  
                }
                if (excelRows[i].village == '-') {
                    validationRemark += "village not found, " ;  
                }
                if (excelRows[i].sectorName == '-') {
                    validationRemark += "sectorName not found, " ;  
                }
                if (excelRows[i].activityName == '-') {
                    validationRemark += "activityName not found, " ;  
                }
                if (excelRows[i].subactivityName == '-') {
                    validationRemark += "subactivityName not found, " ;  
                }
                if (excelRows[i].date == '-') {
                    validationRemark += "date not found, " ;  
                }else{
                    var validDate = moment(excelRows[i].date);
                    if(validDate.isValid()==false){
                        validationRemark += "date is not valid, use Format 'YYYY-MM-DD' or 'DD/MM/YYYY', " ;  
                        // console.log('validDate',validDate, validDate.isValid());
                        excelRows[i].date = validDate;
                    }
                }
                // if (excelRows[i].familyID == '-') {
                //     validationRemark += "familyID not found, " ;  
                // }
                // if (excelRows[i].beneficiaryID == '-') {
                //     validationRemark += "beneficiaryID not found, " ;  
                // }
                if (excelRows[i].isUpgraded != "Yes" && excelRows[i].isUpgraded != "No") {
                    validationRemark += "isUpgraded should be only 'Yes' or  'No', " 
                }
                if ( (parseFloat(unitCost) * parseFloat(quantity)).toFixed(4) != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other ).toFixed(4)) {
                    validationRemark += "Total Costs are not equal!";
                }
                if (excelRows[i].programCategory != "LHWRF Grant" && excelRows[i].programCategory != "Project Fund") {
                    validationRemark += "projectCategoryType should be only 'LHWRF Grant' or  'Project Fund', " 
                }
                if (excelRows[i].programCategory == "LHWRF Grant") {
                    excelRows[i].projectName = "all"
                }
                // if (validationRemark == '')
                    if(excelRows[i].programCategory=="Project Fund"){
                        var projectsData     = await allProjects();
                        sector  = projectsData.filter((data)=>{
                            // console.log('data.projectName',data.projectName,excelRows[i].projectName);
                            // console.log("sectorName",data.sector.sectorName, excelRows[i].sectorName);
                            // console.log('activityName',data.sector.activityName, excelRows[i].activityName);
                            // console.log('subactivityName',data.sector.subActivityName, excelRows[i].subactivityName);
                            // if ((data.projectName.toUpperCase()) == ((excelRows[i].projectName.toUpperCase()).trim()), (data.sector.sectorName).toUpperCase() == ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()) == ((excelRows[i].activityName.toUpperCase()).trim()) && (data.sector.subActivityName.toUpperCase()) == ((excelRows[i].subactivityName.toUpperCase()).trim()) ){
                            // console.log((data.projectName.toUpperCase()).trim() , ((excelRows[i].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() , ((excelRows[i].sectorName.toUpperCase()).trim()) , (data.sector.activityName.toUpperCase()).trim() , (excelRows[i].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() , ((excelRows[i].subactivityName.toUpperCase()).trim()) );
                            // console.log((data.projectName.toUpperCase()).trim() , ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() , ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() , (excelRows[i].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() , ((excelRows[i].subactivityName.toUpperCase()).trim()) );
                            if ((data.projectName.toUpperCase()).trim() == ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() == (excelRows[i].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() == ((excelRows[i].subactivityName.toUpperCase()).trim()) ){
                                return data;
                            }
                        })
                    }else if(excelRows[i].programCategory=="LHWRF Grant"){
                        sector = allSectorsData.filter((data)=>{
                            // console.log("sectorName",data.sector, excelRows[i].sectorName);
                            // console.log("activityName",data.activity.activityName, excelRows[i].activityName);
                            // console.log('subactivityName',data.activity.subActivity.subActivityName, excelRows[i].subactivityName);
                            // console.log(((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() ,((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() , ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase());
                            if (((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() && 
                                ((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() &&  
                                ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase()) {
                                    return data;
                            }
                        })
                    }
                    // console.log('sector',sector.length);
                    var getunit =  allSectorsData.filter((data)=>{
                        if (((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() && 
                            ((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() &&  
                            ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase()) {
                                return data;
                        }
                    })
                    if(getunit.length>0){
                        var unit = getunit[0].activity.subActivity.unit;
                        // console.log("unit",unit);
                    }
                    if (sector.length>0) {
                        if (excelRows[i].familyID) {
                            familyObject = allFamilyData.filter((data)=>{
                                if (((data.familyID).trim()).toLowerCase() == ((excelRows[i].familyID).trim()).toLowerCase()) {
                                    return data;
                                }
                            })
                            // console.log('familyObject',familyObject);
                            if (familyObject.length>0) {
                                if (excelRows[i].beneficiaryID) {
                                    beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                        // console.log(((data.beneficiaryID).trim()).toLowerCase() , ((excelRows[i].beneficiaryID).trim()).toLowerCase() , 
                                        //     ((data.firstNameOfBeneficiary).trim()).toLowerCase() ,(excelRows[i].firstNameOfBeneficiary.trim()).toLowerCase());
                                        // console.log(((data.beneficiaryID).trim()).toLowerCase() == ((excelRows[i].beneficiaryID).trim()).toLowerCase() && 
                                        //     ((data.firstNameOfBeneficiary).trim()).toLowerCase() == (excelRows[i].firstNameOfBeneficiary.trim()).toLowerCase());
                                        if (((data.beneficiaryID).trim()).toLowerCase() == ((excelRows[i].beneficiaryID).trim()).toLowerCase() && 
                                            ((data.firstNameOfBeneficiary).trim()).toLowerCase() == (excelRows[i].firstNameOfBeneficiary.trim()).toLowerCase()) {
                                            return data;
                                        }
                                    })
                                    var date;
                                    // console.log("typeof excelRows[i].date == 'number'",typeof excelRows[i].date == 'number');
                                    if (typeof excelRows[i].date == 'number') {
                                        date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                    }else{
                                        date = moment(excelRows[i].date,'YYYY-MM-DD')._i;
                                    }
                                    // console.log('date',date);
                                    // console.log("beneficiaryObject",beneficiaryObject.length,beneficiaryObject);
                                    if(beneficiaryObject.length == 0){
                                        invalidObjects = excelRows[i];
                                        validationRemark += "Beneficiary details not found";
                                        invalidObjects.failedRemark = validationRemark;
                                        invalidData.push(invalidObjects);
                                        // console.log('invalidObjects',invalidObjects);
                                    }else{
                                        if (validationRemark == ''){
                                            // console.log('beneficiaryObject',beneficiaryObject);
                                            var district             = excelRows[i].district.trim();
                                            var block                = excelRows[i].block.trim();
                                            var village              = excelRows[i].village.trim();
                                            var location             = excelRows[i].location.trim();
                                            var date                 = date;
                                            var projectCategoryType = excelRows[i].programCategory;
                                            var projectName         = excelRows[i].projectName == "LHWRF Grant" ? "all" : excelRows[i].projectName;
                                            var sectorName          = excelRows[i].sectorName.trim();
                                            var activityName        = excelRows[i].activityName.trim();
                                            var subactivityName     = excelRows[i].subactivityName.trim();
                                            var sector_ID           = projectCategoryType== "LHWRF Grant" ? sector[0]._id :sector[0].sector.sector_ID ;
                                            var activity_ID         = projectCategoryType== "LHWRF Grant" ? sector[0].activity._id : sector[0].sector.activity_ID;
                                            var subactivity_ID      = projectCategoryType== "LHWRF Grant" ? sector[0].activity.subActivity._id : sector[0].sector.subActivity_ID;
                                            // console.log('sector_ID',sector_ID);
                                            // console.log('activity_ID',activity_ID);
                                            // console.log('subactivity_ID',subactivity_ID);
                                            // var sectorName           = sector[0].sector;
                                            // var activityName         = sector[0].activity.activityName;
                                            // var subactivityName      = sector[0].activity.subActivity.subActivityName;
                                            var upgradefamily      = await upgradeFamily(familyObject[0]._id, excelRows[i].isUpgraded)
                                            var upgradebeneficiary = await upgradeBeneficiary(beneficiaryObject[0]._id, excelRows[i].isUpgraded)
                                            beneficiaryObjects        = {
                                                beneficiary_ID         : beneficiaryObject[0]._id,
                                                beneficiaryID          : beneficiaryObject[0].beneficiaryID,
                                                family_ID              : familyObject[0]._id,
                                                familyID               : familyObject[0].familyID,
                                                nameofbeneficiary      : beneficiaryObject[0].surnameOfBeneficiary+" "+beneficiaryObject[0].firstNameOfBeneficiary+" " + beneficiaryObject[0].middleNameOfBeneficiary,
                                                relation               : excelRows[i].relation,
                                                dist                   : familyObject[0].dist,
                                                block                  : familyObject[0].block,
                                                village                : familyObject[0].village,
                                                isUpgraded             : upgradefamily=== true ? "Yes" : "No",
                                                caste                  : familyObject[0].caste,
                                                incomeCategory         : familyObject[0].incomeCategory,
                                                landCategory           : familyObject[0].landCategory,
                                                specialCategory        : familyObject[0].specialCategory,
                                                genderOfbeneficiary    : beneficiaryObject[0].genderOfbeneficiary,
                                                birthYearOfbeneficiary : beneficiaryObject[0].birthYearOfbeneficiary,
                                                qtyPerBen              : quantity,
                                                unitCost               : unitCost,
                                                totalCostPerBen        : unitCost * quantity,
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
                                            };                                            
                                            beneficiaryArray.push(beneficiaryObjects);
                                            const activityReport = {
                                                _id                 : new mongoose.Types.ObjectId(),   
                                                center_ID           : req.body.reqdata.center_ID,
                                                centerName          : req.body.reqdata.centerName,
                                                projectCategoryType : projectCategoryType,
                                                projectName         : projectName,   
                                                type                : projectCategoryType== "LHWRF Grant" ? true : false,
                                                district            : district,
                                                block               : block,
                                                village             : village,
                                                location            : location,
                                                date                : date,
                                                sectorName          : sectorName,
                                                activityName        : activityName,
                                                subactivityName     : subactivityName,
                                                sector_ID           : sector_ID,
                                                activity_ID         : activity_ID,
                                                subactivity_ID      : subactivity_ID,
                                                typeofactivity      : req.body.reqdata.typeofactivity,
                                                noOfBeneficiaries   : beneficiaryArray && beneficiaryArray.length > 0 ? beneficiaryArray.length : 0,
                                                unit                : unit,
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
                                                listofBeneficiaries : beneficiaryArray,
                                                remark              : excelRows[i].remark,
                                                fileName            : req.body.fileName,
                                                uploadTime          : uploadTime,
                                                createdAt           : new Date()
                                            };
                                            activity_id = await addActivity(activityReport);    
                                        }else{
                                            var date;
                                            if (excelRows[i].date == '-') { 
                                                excelRows[i].Date = '-';
                                            }else{
                                                if (typeof excelRows[i].date == 'number') {
                                                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                                }else{
                                                    date = moment(new Date(excelRows[i].date)).format("YYYY-MM-DD")
                                                }
                                                excelRows[i].date = date;
                                            }
                                            invalidObjects = excelRows[i];
                                            invalidObjects.failedRemark = validationRemark;
                                            invalidData.push(invalidObjects);
                                        }                            
                                    }
                                }
                            }else{
                                var date;
                                if (typeof excelRows[i].date == 'number') {
                                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                }else{
                                    var mydate = new Date(excelRows[i].date);
                                    
                                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                                }
                                excelRows[i].date = date;
                                invalidObjects = excelRows[i];
                                validationRemark +=  "Family & Beneficiary details not found ";
                                invalidObjects.failedRemark = validationRemark;
                                invalidData.push(invalidObjects);
                            }
                        }
                    }else{
                        var date;
                        if (typeof excelRows[i].date == 'number') {
                            date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                        }else{
                            var mydate = new Date(excelRows[i].date);
                            
                            date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                        }
                        excelRows[i].date = date;
                        invalidObjects = excelRows[i];
                        if(excelRows[i].programCategory=="Project Fund"){
                            validationRemark += "Project Name or Subactivity details of particular Project not found";
                        }else if(excelRows[i].programCategory=="LHWRF Grant"){
                            // console.log(excelRows[i].date, date);
                            validationRemark += "Subactivity details not found";
                        }
                        invalidObjects.failedRemark = validationRemark;
                        invalidData.push(invalidObjects);
                    }
                
            }else if((excelRows[i].date == "-" || excelRows[i].sectorName =="-"|| excelRows[i].activityName =="-"|| excelRows[i].subactivityName =="-" ) && excelRows[i].district == "-"  && excelRows[i].familyID == "-" ){
                var date;
                if (typeof excelRows[i].date == 'number') {
                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    var mydate = new Date(excelRows[i].date);
                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                }
                excelRows[i].date = date;
                // console.log("excelRows+++++++++++++++++++++",excelRows[i]);
                invalidObjects = excelRows[i];
                validationRemark += "Sector details or Date not found.";
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            }else if( excelRows[i].familyID == '-' || excelRows[i].beneficiaryID == '-') {
                var date;
                if (typeof excelRows[i].date == 'number') {
                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    var mydate = new Date(excelRows[i].date);
                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                }
                excelRows[i].date = date;
               // console.log("excelRows=====================",excelRows[i]);
                invalidObjects = excelRows[i];
                validationRemark += "Family or Beneficiary details not found.";
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            }else {
                var date;
                if (typeof excelRows[i].date == 'number') {
                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    var mydate = new Date(excelRows[i].date);
                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                }
                excelRows[i].date = date;
               // console.log("excelRows=====================",excelRows[i]);
                invalidObjects = excelRows[i];
                validationRemark += "Sector details not found.";
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            }
            validationRemark= '';
        }
        // console.log('invalidObjects',invalidObjects);
        // console.log('invalidData===============',invalidData);
        // console.log('failedRemark===============',invalidObjects.failedRemark);
            // console.log(' activity_id && beneficiaryArray==============', activity_id , beneficiaryArray);
        if( activity_id && beneficiaryArray){
            await updateActivityData( activity_id, beneficiaryArray);
            // activity_id = "";
            // beneficiaryArray = [];
        }
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        // console.log('failedRecords===============',failedRecords);
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
        });
    }    
};
function upgradeFamily(family_ID, isUpgraded){
    // console.log('beneficiaryObjects',beneficiaryObjects);
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.findOne({ _id : family_ID})
        .exec()
        .then(data =>{
            if(data.isUpgraded == "Yes"){
                // console.log("data.isUpgraded", data.isUpgraded);
                resolve(false);
            }else{
                BeneficiaryFamilies.updateOne(
                    { _id:family_ID},  
                    {
                        $set:{
                            isUpgraded        : isUpgraded,
                        }
                    }
                )
                .then(familydata =>{
                    // console.log('familydata',familydata._id,familydata)
                    resolve(true);
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
function upgradeBeneficiary(beneficiary_ID, isUpgraded){
    // console.log('',);
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.findOne({ _id : beneficiary_ID})
        .exec()
        .then(data =>{
            if(data.isUpgraded == "Yes"){
                // console.log("data.isUpgraded", data.isUpgraded);
                resolve(false);
            }else{
                ListOfbeneficiary.updateOne(
                    { _id : beneficiary_ID},  
                    {
                        $set:{
                            isUpgraded        : isUpgraded,
                        }
                    }
                )
                .exec()
                .then(bendata=>{
                    // console.log('bendata',bendata);
                    resolve(true);
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
exports.bulk_upload_type_B_activities = (req,res,next)=>{
    var excelRows = req.body.data;
    // console.log("excelRows",excelRows);
    var newactivityLst = [];
    var validData = [];
    var sector = [];
    var validObjects = [];
    var invalidData = [];
    var invalidObjects = [];
    var validationRemark = ''; 
    var failedRecords = [];
    var Count = 0;
    var DuplicateCount = 0;
    var uploadTime = new Date();
    getActivityData(); 
    async function getActivityData(){
        var allSectorsData = await getAllSectors();
        for(var i = 0 ; i < excelRows.length ; i++){
            var unitCost = isNaN(Number(excelRows[i].unitCost)) ? 0 : parseFloat(excelRows[i].unitCost);
            var quantity = isNaN(Number(excelRows[i].quantity)) ? 0 : parseFloat(excelRows[i].quantity);
            var LHWRF = isNaN(Number(excelRows[i].LHWRF)) ? 0 : parseFloat(excelRows[i].LHWRF);
            var NABARD = isNaN(Number(excelRows[i].NABARD)) ? 0 : parseFloat(excelRows[i].NABARD);
            var bankLoan = isNaN(Number(excelRows[i].bankLoan)) ? 0 : parseFloat(excelRows[i].bankLoan);
            var govtscheme = isNaN(Number(excelRows[i].govtscheme)) ? 0 : parseFloat(excelRows[i].govtscheme);
            var directCC = isNaN(Number(excelRows[i].directCC)) ? 0 : parseFloat(excelRows[i].directCC);
            var indirectCC = isNaN(Number(excelRows[i].indirectCC)) ? 0 : parseFloat(excelRows[i].indirectCC);
            var other = isNaN(Number(excelRows[i].other)) ? 0 :  parseFloat(excelRows[i].other);    
            var noOfBeneficiaries = isNaN(Number(excelRows[i].noOfBeneficiaries)) ? 0 :  parseInt(excelRows[i].noOfBeneficiaries);    
            
            if (excelRows[i].district == '-') {
                validationRemark += "district not found, " ;  
            }
            if (excelRows[i].block == '-') {
                validationRemark += "block not found, " ;  
            }
            if (excelRows[i].village == '-') {
                validationRemark += "village not found, " ;  
            }
            if (excelRows[i].sectorName == '-') {
                validationRemark += "sectorName not found, " ;  
            }
            if (excelRows[i].activityName == '-') {
                validationRemark += "activityName not found, " ;  
            }
            if (excelRows[i].subactivityName == '-') {
                validationRemark += "subactivityName not found, " ;  
            }
            if (excelRows[i].date == '-') {
                validationRemark += "date not found, " ;  
            }else{
                var validDate = moment(excelRows[i].date);
                if(validDate.isValid()==false){
                    validationRemark += "date is not valid, use Format 'YYYY-MM-DD' or 'DD/MM/YYYY', " ;  
                    // console.log('validDate',validDate, validDate.isValid());
                    excelRows[i].date = validDate;
                }
            }
            if ( (parseFloat(unitCost) * parseFloat(quantity)).toFixed(4) != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other ).toFixed(4)) {
                validationRemark += "Total Costs are not equal!";
            }
            if (excelRows[i].programCategory != "LHWRF Grant" && excelRows[i].programCategory != "Project Fund") {
                validationRemark += "projectCategoryType should be only 'LHWRF Grant' or  'Project Fund', " 
            }
            if (excelRows[i].programCategory == "LHWRF Grant") {
                excelRows[i].projectName = "all"
            }
            // if (validationRemark == '') {
                if(excelRows[i].programCategory=="Project Fund"){
                    var projectsData     = await allProjects();
                    sector  = projectsData.filter((data)=>{
                        console.log((data.projectName.toUpperCase()).trim() , ((excelRows[i].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() , ((excelRows[i].sectorName.toUpperCase()).trim()) , (data.sector.activityName.toUpperCase()).trim() , (excelRows[i].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() , ((excelRows[i].subactivityName.toUpperCase()).trim()) );
                        console.log((data.projectName.toUpperCase()).trim() , ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() , ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() , (excelRows[i].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() , ((excelRows[i].subactivityName.toUpperCase()).trim()) );
                        // if ((data.projectName.toUpperCase()) == ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName).toUpperCase() == ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()) == ((excelRows[i].activityName.toUpperCase()).trim()) && (data.sector.subActivityName.toUpperCase()) == ((excelRows[i].subactivityName.toUpperCase()).trim()) ){
                        if ((data.projectName.toUpperCase()).trim() == ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() == (excelRows[i].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() == ((excelRows[i].subactivityName.toUpperCase()).trim()) ){
                            return data;
                        }
                    })
                }else if(excelRows[i].programCategory=="LHWRF Grant"){
                    sector = allSectorsData.filter((data)=>{
                        // console.log("sectorName",data.sector, excelRows[i].sectorName);
                        // console.log("activityName",data.activity.activityName, excelRows[i].activityName);
                        // console.log('subactivityName',data.activity.subActivity.subActivityName, excelRows[i].subactivityName);
                        // console.log(((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() ,((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() , ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase());
                        if (((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() && 
                            ((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() &&  
                            ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase()) {
                                return data;
                        }
                    })
                }
                // console.log('sector',sector);
                var getunit =  allSectorsData.filter((data)=>{
                    if (((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() && 
                        ((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() &&  
                        ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase()) {
                            return data;
                    }
                })
                if(getunit.length>0){
                    var unit = getunit[0].activity.subActivity.unit;
                    console.log("unit",unit);
                }
                if (sector.length>0) {
                    if (validationRemark != '') {                   
                        var date;
                        if (typeof excelRows[i].date == 'number') {
                            date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                        }else{
                            date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                        }
                        var district             = excelRows[i].district.trim();
                        var block                = excelRows[i].block.trim();
                        var village              = excelRows[i].village.trim();
                        var location             = excelRows[i].location.trim();
                        var projectCategoryType = excelRows[i].programCategory;
                        var projectName         = excelRows[i].projectName == "LHWRF Grant" ? "all" : excelRows[i].projectName;
                        var sectorName          = excelRows[i].sectorName.trim();
                        var activityName        = excelRows[i].activityName.trim();
                        var subactivityName     = excelRows[i].subactivityName.trim();
                        var sector_ID           = projectCategoryType== "LHWRF Grant" ? sector[0]._id :sector[0].sector.sector_ID ;
                        var activity_ID         = projectCategoryType== "LHWRF Grant" ? sector[0].activity._id : sector[0].sector.activity_ID;
                        var subactivity_ID      = projectCategoryType== "LHWRF Grant" ? sector[0].activity.subActivity._id : sector[0].sector.subActivity_ID;
                        // console.log('sector_ID',sector_ID);
                        // console.log('activity_ID',activity_ID);
                        // console.log('subactivity_ID',subactivity_ID);
                        validObjects = excelRows[i];
                        // console.log('validObjects==========',validObjects);
                        validObjects.center_ID           = req.body.reqdata.center_ID;
                        validObjects.centerName          = req.body.reqdata.centerName;
                        validObjects.projectCategoryType = projectCategoryType;
                        validObjects.projectName         = projectName;   
                        validObjects.type                = projectCategoryType== "LHWRF Grant" ? true : false;
                        validObjects.district            = district;
                        validObjects.block               = block;
                        validObjects.village             = village;
                        validObjects.location            = location;
                        validObjects.date                = date;
                        validObjects.sectorName          = sectorName;
                        validObjects.activityName        = activityName;
                        validObjects.subactivityName     = subactivityName;
                        validObjects.typeofactivity      = req.body.reqdata.typeofactivity;
                        validObjects.sector_ID           = sector_ID;
                        validObjects.activity_ID         = activity_ID;
                        validObjects.subactivity_ID      = subactivity_ID;
                        validObjects.noOfBeneficiaries   = noOfBeneficiaries;
                        validObjects.unit                = unit;
                        validObjects.unitCost            = unitCost;
                        validObjects.uploadTime          = uploadTime;
                        validObjects.quantity            = quantity;
                        validObjects.totalCost           = unitCost * quantity;
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
                        validObjects.remark              = excelRows[i].remark;
                        validObjects.fileName            = req.body.fileName;
                        validObjects.createdAt           = new Date()
                        validData.push(validObjects); 
                        // console.log("subactivityName",validData)
                    }else{
                        var date;
                        if (excelRows[i].date == '-') { 
                            excelRows[i].Date = '-';
                        }else{
                            if (typeof excelRows[i].date == 'number') {
                                date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                            }else{
                                date = moment(new Date(excelRows[i].date)).format("YYYY-MM-DD")
                            }
                            excelRows[i].date = date;
                        }
                        invalidObjects = excelRows[i];
                        invalidObjects.failedRemark = validationRemark;
                        invalidData.push(invalidObjects);
                    }
                }else{
                    var date;
                    if (typeof excelRows[i].date == 'number') {
                        date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                    }else{
                        var mydate = new Date(excelRows[i].date);
                        
                        date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                    }
                    excelRows[i].date = date;
                    invalidObjects = excelRows[i];
                    if(excelRows[i].programCategory=="Project Fund"){
                        validationRemark += "Project Name or Subactivity details of particular Project not found";
                    }else if(excelRows[i].programCategory=="LHWRF Grant"){
                        validationRemark += "Subactivity details not found";
                    }
                    invalidObjects.failedRemark = validationRemark;
                    invalidData.push(invalidObjects);
                }
            validationRemark= '';
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
    }    
};
function addActivity(activityReportObject){
  //  console.log('center',center)
    return new Promise(function(resolve,reject){
        const activityReport = new ActivityReport(activityReportObject);
        activityReport.save()
        .then(activity=>{
            // console.log('activity',activity);
              resolve(activity._id); 
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    });
}
function updateActivityData(_id, beneficiaryArray){
    // console.log('_id, beneficiaryArrayyyyyyyyyyy',_id, beneficiaryArray.length);
    return new Promise((resolve,reject)=>{
        ActivityReport.updateOne(
                {_id : _id}, 
                {$set: {listofBeneficiaries : beneficiaryArray}}
        )
        .then(data =>{
                resolve(data);
       
        })
        .catch(err =>{
            console.log('err',err);
            reject(err);
        });
    });
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
function findAllFamily(center_id){
    return new Promise((resolve,reject)=>{
        BeneficiaryFamilies.find({"center_ID":center_id})
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
function findAllBeneficiary(center_id){
    return new Promise((resolve,reject)=>{
        ListOfbeneficiary.find({"center_ID":center_id})
        .then(data =>{
            resolve(data);
        })
        .catch(err =>{
            reject(err);
        });
    });
}
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
}
function allProjects(){
    return new Promise((resolve,reject)=>{
        ProjectMapping.aggregate([{$unwind: "$sector"}])
        // ProjectMapping.find()
            .exec()
            .then(data=>{
                resolve(data);
            })
            .catch(err =>{
                reject(err);
            });
    });
};
exports.bulk_upload_type_A_activitiesWithArrayOfBen = (req,res,next)=>{
    // console.log("bulk_upload_excelRows req.body = ",req.body);
    var excelRows       = req.body.data;
    var newactivityLst  = [];
    var validData1      = [];
    var sector          = [];
    var validData       = [];
    var validObjects    = [];
    var invalidData     = [];
    var invalidObjects  = [];
    var validationRemark= ''; 
    var failedRecords   = [];
    var Count           = 0;
    var DuplicateCount  = 0;
    var unitCost        = 0;
    var quantity        = 0;
    var LHWRF           = 0;
    var NABARD          = 0;
    var bankLoan        = 0;
    var govtscheme      = 0;
    var directCC        = 0;
    var indirectCC      = 0;
    var other           = 0;
    var beneficiaryObject  = {};
    var beneficiaryArray   = [];
    var activity_id        = "";
    var validationRemark   = ''; 
    var uploadTime = new Date();

    getActivityData(); 
    async function getActivityData(){
        var center_id       = req.body.reqdata.center_ID;
        var allSectorsData       = await getAllSectors();
        var allFamilyData        = await findAllFamily(center_id);
        var allBeneficiaryData   = await findAllBeneficiary(center_id);
        var allActivityData      = await findAllActivity();
        for(var i = 0 ; i < excelRows.length ; i++){
            var unitCost = isNaN(Number(excelRows[i].unitCost)) ? 0 : parseFloat(excelRows[i].unitCost);
            var quantity = isNaN(Number(excelRows[i].quantity)) ? 0 : parseFloat(excelRows[i].quantity);
            var LHWRF            = isNaN(Number(excelRows[i].LHWRF)) ? 0 : parseFloat(excelRows[i].LHWRF);
            var NABARD           = isNaN(Number(excelRows[i].NABARD)) ? 0 : parseFloat(excelRows[i].NABARD);
            var bankLoan         = isNaN(Number(excelRows[i].bankLoan)) ? 0 : parseFloat(excelRows[i].bankLoan);
            var govtscheme       = isNaN(Number(excelRows[i].govtscheme)) ? 0 : parseFloat(excelRows[i].govtscheme);
            var directCC         = isNaN(Number(excelRows[i].directCC)) ? 0 : parseFloat(excelRows[i].directCC);
            var indirectCC       = isNaN(Number(excelRows[i].indirectCC)) ? 0 : parseFloat(excelRows[i].indirectCC);
            var other            = isNaN(Number(excelRows[i].other)) ? 0 :  parseFloat(excelRows[i].other);    
            var noOfBeneficiaries = isNaN(Number(excelRows[i].noOfBeneficiaries)) ? 0 :  parseInt(excelRows[i].noOfBeneficiaries);    
            
        
            if(excelRows[i].date != "-" && excelRows[i].sectorName !="-"&& excelRows[i].activityName !="-" && excelRows[i].subactivityName !="-" && excelRows[i].familyID != '-' && excelRows[i].beneficiaryID != '-'){
                if(excelRows[i].sectorName!="-"){
                    beneficiaryArray = [];
                }
                if (excelRows[i].district == '-') {
                    validationRemark += "district not found, " ;  
                }
                if (excelRows[i].block == '-') {
                    validationRemark += "block not found, " ;  
                }
                if (excelRows[i].village == '-') {
                    validationRemark += "village not found, " ;  
                }
                if (excelRows[i].sectorName == '-') {
                    validationRemark += "sectorName not found, " ;  
                }
                if (excelRows[i].activityName == '-') {
                    validationRemark += "activityName not found, " ;  
                }
                if (excelRows[i].subactivityName == '-') {
                    validationRemark += "subactivityName not found, " ;  
                }
                if (excelRows[i].date == '-') {
                    validationRemark += "date not found, " ;  
                }
                // if (excelRows[i].familyID == '-') {
                //     validationRemark += "familyID not found, " ;  
                // }
                // if (excelRows[i].beneficiaryID == '-') {
                //     validationRemark += "beneficiaryID not found, " ;  
                // }
                if (excelRows[i].isUpgraded != "Yes" && excelRows[i].isUpgraded != "No") {
                    validationRemark += "isUpgraded should be only 'Yes' or  'No', " 
                }
                if ( (parseFloat(unitCost) * parseFloat(quantity)).toFixed(4) != (LHWRF + NABARD + bankLoan + govtscheme + directCC + indirectCC + other ).toFixed(4)) {
                    validationRemark += "Total Costs are not equal!";
                }
                if (excelRows[i].programCategory != "LHWRF Grant" && excelRows[i].programCategory != "Project Fund") {
                    validationRemark += "projectCategoryType should be only 'LHWRF Grant' or  'Project Fund', " 
                }
                if (excelRows[i].programCategory == "LHWRF Grant") {
                    excelRows[i].projectName = "all"
                }
                if (validationRemark == '') {
                    if(excelRows[i].programCategory=="Project Fund"){
                        var projectsData     = await allProjects();
                        sector  = projectsData.filter((data)=>{
                            // console.log('data.projectName',data.projectName,excelRows[i].projectName);
                            // console.log("sectorName",data.sector.sectorName, excelRows[i].sectorName);
                            // console.log('activityName',data.sector.activityName, excelRows[i].activityName);
                            // console.log('subactivityName',data.sector.subActivityName, excelRows[i].subactivityName);
                            // if ((data.projectName.toUpperCase()) == ((excelRows[i].projectName.toUpperCase()).trim()), (data.sector.sectorName).toUpperCase() == ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()) == ((excelRows[i].activityName.toUpperCase()).trim()) && (data.sector.subActivityName.toUpperCase()) == ((excelRows[i].subactivityName.toUpperCase()).trim()) ){
                            console.log((data.projectName.toUpperCase()).trim() , ((excelRows[i].projectName.toUpperCase()).trim()) , (data.sector.sectorName.trim()).toUpperCase() , ((excelRows[i].sectorName.toUpperCase()).trim()) , (data.sector.activityName.toUpperCase()).trim() , (excelRows[i].activityName.toUpperCase()).trim() , (data.sector.subActivityName.toUpperCase()).trim() , ((excelRows[i].subactivityName.toUpperCase()).trim()) );
                            console.log((data.projectName.toUpperCase()).trim() , ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() , ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() , (excelRows[i].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() , ((excelRows[i].subactivityName.toUpperCase()).trim()) );
                            if ((data.projectName.toUpperCase()).trim() == ((excelRows[i].projectName.toUpperCase()).trim()) && (data.sector.sectorName.trim()).toUpperCase() == ((excelRows[i].sectorName.toUpperCase()).trim()) && (data.sector.activityName.toUpperCase()).trim() == (excelRows[i].activityName.toUpperCase()).trim() && (data.sector.subActivityName.toUpperCase()).trim() == ((excelRows[i].subactivityName.toUpperCase()).trim()) ){
                                return data;
                            }
                        })
                    }else if(excelRows[i].programCategory=="LHWRF Grant"){
                        sector = allSectorsData.filter((data)=>{
                            // console.log("sectorName",data.sector, excelRows[i].sectorName);
                            // console.log("activityName",data.activity.activityName, excelRows[i].activityName);
                            // console.log('subactivityName',data.activity.subActivity.subActivityName, excelRows[i].subactivityName);
                            // console.log(((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() ,((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() , ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase());
                            if (((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() && 
                                ((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() &&  
                                ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase()) {
                                    return data;
                            }
                        })
                    }
                    console.log('sector',sector.length);
                    var getunit =  allSectorsData.filter((data)=>{
                        if (((data.sector).trim()).toUpperCase() === ((excelRows[i].sectorName).trim()).toUpperCase() && 
                            ((data.activity.activityName).trim()).toUpperCase() === ((excelRows[i].activityName).trim()).toUpperCase() &&  
                            ((data.activity.subActivity.subActivityName).trim()).toUpperCase() === ((excelRows[i].subactivityName).trim()).toUpperCase()) {
                                return data;
                        }
                    })
                    if(getunit.length>0){
                        var unit = getunit[0].activity.subActivity.unit;
                        // console.log("unit",unit);
                    }
                    if (sector.length>0) {
                        if (excelRows[i].familyID) {
                            familyObject = allFamilyData.filter((data)=>{
                                if (((data.familyID).trim()).toLowerCase() == ((excelRows[i].familyID).trim()).toLowerCase()) {
                                    return data;
                                }
                            })
                            // console.log('familyObject',familyObject);
                            if (familyObject.length>0) {
                                if (excelRows[i].beneficiaryID) {
                                    beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                        if (((data.beneficiaryID).trim()).toLowerCase() == ((excelRows[i].beneficiaryID).trim()).toLowerCase() && 
                                            ((data.firstNameOfBeneficiary).trim()).toLowerCase() == (excelRows[i].firstNameOfBeneficiary.trim()).toLowerCase()) {
                                            return data;
                                        }
                                    })
                                    var date;
                                    if (typeof excelRows[i].date == 'number') {
                                        date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                    }else{
                                        date = moment(excelRows[i].date,'YYYY-MM-DD')._i;
                                    }
                                    // console.log("beneficiaryObject.length",beneficiaryObject.length);
                                    if(beneficiaryObject.length == 0){
                                        invalidObjects = excelRows[i];
                                        validationRemark += "Beneficiary details not found";
                                        invalidObjects.failedRemark = validationRemark;
                                        invalidData.push(invalidObjects);
                                    }else{
                                        // console.log('beneficiaryObject',beneficiaryObject);
                                        var district             = excelRows[i].district.trim();
                                        var block                = excelRows[i].block.trim();
                                        var village              = excelRows[i].village.trim();
                                        var location             = excelRows[i].location.trim();
                                        var date                 = date;
                                        var projectCategoryType = excelRows[i].programCategory;
                                        var projectName         = excelRows[i].projectName == "LHWRF Grant" ? "all" : excelRows[i].projectName;
                                        var sectorName          = excelRows[i].sectorName.trim();
                                        var activityName        = excelRows[i].activityName.trim();
                                        var subactivityName     = excelRows[i].subactivityName.trim();
                                        var sector_ID           = projectCategoryType== "LHWRF Grant" ? sector[0]._id :sector[0].sector.sector_ID ;
                                        var activity_ID         = projectCategoryType== "LHWRF Grant" ? sector[0].activity._id : sector[0].sector.activity_ID;
                                        var subactivity_ID      = projectCategoryType== "LHWRF Grant" ? sector[0].activity.subActivity._id : sector[0].sector.subActivity_ID;
                                        // console.log('sector_ID',sector_ID);
                                        // console.log('activity_ID',activity_ID);
                                        // console.log('subactivity_ID',subactivity_ID);
                                        // var sectorName           = sector[0].sector;
                                        // var activityName         = sector[0].activity.activityName;
                                        // var subactivityName      = sector[0].activity.subActivity.subActivityName;
                                        beneficiaryObjects        = {
                                            beneficiary_ID         : beneficiaryObject[0]._id,
                                            beneficiaryID          : beneficiaryObject[0].beneficiaryID,
                                            family_ID              : familyObject[0]._id,
                                            familyID               : familyObject[0].familyID,
                                            nameofbeneficiary      : beneficiaryObject[0].surnameOfBeneficiary+" "+beneficiaryObject[0].firstNameOfBeneficiary+" " + beneficiaryObject[0].middleNameOfBeneficiary,
                                            relation               : excelRows[i].relation,
                                            dist                   : familyObject[0].dist,
                                            block                  : familyObject[0].block,
                                            village                : familyObject[0].village,
                                            caste                  : familyObject[0].caste,
                                            incomeCategory         : familyObject[0].incomeCategory,
                                            landCategory           : familyObject[0].landCategory,
                                            specialCategory        : familyObject[0].specialCategory,
                                            genderOfbeneficiary    : beneficiaryObject[0].genderOfbeneficiary,
                                            birthYearOfbeneficiary : beneficiaryObject[0].birthYearOfbeneficiary,
                                            isUpgraded             : excelRows[i].isUpgraded,
                                        }; 
                                        beneficiaryArray.push(beneficiaryObjects);
                                        const activityReport = {
                                            _id                 : new mongoose.Types.ObjectId(),   
                                            center_ID           : req.body.reqdata.center_ID,
                                            centerName          : req.body.reqdata.centerName,
                                            projectCategoryType : projectCategoryType,
                                            projectName         : projectName,   
                                            type                : projectCategoryType== "LHWRF Grant" ? true : false,
                                            district            : district,
                                            block               : block,
                                            village             : village,
                                            location            : location,
                                            date                : date,
                                            sectorName          : sectorName,
                                            activityName        : activityName,
                                            subactivityName     : subactivityName,
                                            sector_ID           : sector_ID,
                                            activity_ID         : activity_ID,
                                            subactivity_ID      : subactivity_ID,
                                            typeofactivity      : req.body.reqdata.typeofactivity,
                                            noOfBeneficiaries   : 0,
                                            unit                : unit,
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
                                            listofBeneficiaries : beneficiaryArray,
                                            remark              : excelRows[i].remark,
                                            fileName            : req.body.fileName,
                                            uploadTime          : uploadTime,
                                            createdAt           : new Date()
                                        };
                                        activity_id = await addActivity(activityReport);                                
                                    }
                                }
                            }else{
                                var date;
                                if (typeof excelRows[i].date == 'number') {
                                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                }else{
                                    var mydate = new Date(excelRows[i].date);
                                    
                                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                                }
                                excelRows[i].date = date;
                                invalidObjects = excelRows[i];
                                validationRemark +=  "Family & Beneficiary details not found ";
                                invalidObjects.failedRemark = validationRemark;
                                invalidData.push(invalidObjects);
                            }
                        }
                    }else{
                        var date;
                        if (typeof excelRows[i].date == 'number') {
                            date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                        }else{
                            var mydate = new Date(excelRows[i].date);
                            
                            date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                        }
                        excelRows[i].date = date;
                        invalidObjects = excelRows[i];
                        if(excelRows[i].programCategory=="Project Fund"){
                            validationRemark += "Project Name or Subactivity details of particular Project not found";
                        }else if(excelRows[i].programCategory=="LHWRF Grant"){
                            console.log(excelRows[i].date, date);
                            validationRemark += "Subactivity details not found";
                        }
                        invalidObjects.failedRemark = validationRemark;
                        invalidData.push(invalidObjects);
                    }
                }else{
                    var date;
                    if (excelRows[i].date == '-') { 
                        excelRows[i].Date = '-';
                    }else{
                        if (typeof excelRows[i].date == 'number') {
                            date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                        }else{
                            date = moment(new Date(excelRows[i].date)).format("YYYY-MM-DD")
                        }
                        excelRows[i].date = date;
                    }
                    invalidObjects = excelRows[i];
                    invalidObjects.failedRemark = validationRemark;
                    invalidData.push(invalidObjects);
                }
            }else if((excelRows[i].date == "-" || excelRows[i].sectorName =="-"|| excelRows[i].activityName =="-"|| excelRows[i].subactivityName =="-" ) && excelRows[i].district == "-"  && excelRows[i].familyID == "-" ){
                var date;
                if (typeof excelRows[i].date == 'number') {
                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    var mydate = new Date(excelRows[i].date);
                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                }
                excelRows[i].date = date;
                // console.log("excelRows+++++++++++++++++++++",excelRows[i]);
                invalidObjects = excelRows[i];
                validationRemark += "Sector details or Date not found.";
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            }else if( excelRows[i].familyID == '-' || excelRows[i].beneficiaryID == '-') {
                var date;
                if (typeof excelRows[i].date == 'number') {
                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    var mydate = new Date(excelRows[i].date);
                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                }
                excelRows[i].date = date;
               // console.log("excelRows=====================",excelRows[i]);
                invalidObjects = excelRows[i];
                validationRemark += "Family or Beneficiary details not found.";
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            
            }else if(excelRows[i].familyID != "-" && excelRows[i].surnameOfFH !="-"&& excelRows[i].beneficiaryID !="-" && excelRows[i].sectorName=="-"){
                // console.log( "activity_id---------------", activity_id);   
                if (excelRows[i].familyID) {
                    familyObject = allFamilyData.filter((data)=>{
                        if (((data.familyID).trim()).toLowerCase() == ((excelRows[i].familyID).trim()).toLowerCase()) {
                            return data;
                        }
                    })
                    // console.log('familyObject',familyObject);
                    if (familyObject.length>0) {
                        if (excelRows[i].beneficiaryID) {
                            beneficiaryObject = allBeneficiaryData.filter((data)=>{
                                if (((data.beneficiaryID).trim()).toLowerCase() == ((excelRows[i].beneficiaryID).trim()).toLowerCase() && 
                                    ((data.firstNameOfBeneficiary).trim()).toLowerCase() == (excelRows[i].firstNameOfBeneficiary.trim()).toLowerCase()) {
                                    return data;
                                }
                            })
                            console.log('beneficiaryObject.length',beneficiaryObject.length);
                            if(beneficiaryObject.length == 0){
                                var date;
                                if (typeof excelRows[i].date == 'number') {
                                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                                }else{
                                    var mydate = new Date(excelRows[i].date);
                                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                                }
                                excelRows[i].date = date;
                                invalidObjects = excelRows[i];
                                validationRemark += "Beneficiary details not found";
                                invalidObjects.failedRemark = validationRemark;
                                invalidData.push(invalidObjects);
                            }else{                                
                                beneficiaryObjects   = {
                                    beneficiary_ID         : beneficiaryObject[0]._id,
                                    beneficiaryID          : beneficiaryObject[0].beneficiaryID,
                                    family_ID              : familyObject[0]._id,
                                    familyID               : familyObject[0].familyID,
                                    nameofbeneficiary      : beneficiaryObject[0].surnameOfBeneficiary+" "+beneficiaryObject[0].firstNameOfBeneficiary+" " + beneficiaryObject[0].middleNameOfBeneficiary,
                                    relation               : beneficiaryObject[0].relation,
                                    dist                   : familyObject[0].dist,
                                    block                  : familyObject[0].block,
                                    village                : familyObject[0].village,
                                    caste                  : familyObject[0].caste,
                                    incomeCategory         : familyObject[0].incomeCategory,
                                    landCategory           : familyObject[0].landCategory,
                                    specialCategory        : familyObject[0].specialCategory,
                                    genderOfbeneficiary    : beneficiaryObject[0].genderOfbeneficiary,
                                    birthYearOfbeneficiary : beneficiaryObject[0].birthYearOfbeneficiary,
                                    isUpgraded             : excelRows[i].isUpgraded,
                                }; 
                                beneficiaryArray.push(beneficiaryObjects);
                                if( activity_id && beneficiaryArray){
                                    if(excelRows[i].sectorName!="-"){
                                        beneficiaryArray= []
                                    }
                                    await updateActivityData( activity_id, beneficiaryArray);
                                }
                            }
                        }
                    }else{
                        var date;
                        if (typeof excelRows[i].date == 'number') {
                            date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                        }else{
                            var mydate = new Date(excelRows[i].date);
                            date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                        }
                        excelRows[i].date = date;
                        invalidObjects = excelRows[i];
                        validationRemark +=  "Family not found ";
                        invalidObjects.failedRemark = validationRemark;
                        invalidData.push(invalidObjects);
                    }
                }
            }else {
                var date;
                if (typeof excelRows[i].date == 'number') {
                    date = moment(new Date(Math.round((excelRows[i].date - 25569)*86400*1000))).format("YYYY-MM-DD");
                }else{
                    var mydate = new Date(excelRows[i].date);
                    date = moment(excelRows[i].date,'YYYY-MM-DD')._i
                }
                excelRows[i].date = date;
               // console.log("excelRows=====================",excelRows[i]);
                invalidObjects = excelRows[i];
                validationRemark += "Sector details not found.";
                invalidObjects.failedRemark = validationRemark;
                invalidData.push(invalidObjects);
            }
        }
        // console.log('invalidObjects',invalidObjects);
        // console.log('invalidData===============',invalidData);
        // console.log('failedRemark===============',invalidObjects.failedRemark);
            // console.log(' activity_id && beneficiaryArray==============', activity_id , beneficiaryArray);
        if( activity_id && beneficiaryArray){
            await updateActivityData( activity_id, beneficiaryArray);
            // activity_id = "";
            // beneficiaryArray = [];
        }
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = req.body.fileName;
        failedRecords.totalRecords = req.body.totalRecords;
        // console.log('failedRecords===============',failedRecords);
        await insertFailedRecords(failedRecords,req.body.updateBadData);
        res.status(200).json({
            "message": "Bulk upload process is completed successfully!",
            "completed": true
        });
    }    
};