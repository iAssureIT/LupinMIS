import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import _                      from 'underscore';
import swal                   from 'sweetalert';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 
import Loader                 from "../../../common/Loader.js";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import ListOfBeneficiaries    from "../listOfBeneficiaries/ListOfBeneficiaries.js";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";
import "./Activity.css";

var add = 0;
class Activity extends Component{
  constructor(props){
    super(props);
    this.state = { 
      "center_ID"         : "",
      "centerName"        : "",
      "district"          : "-- Select --",
      "block"             : "-- Select --",
      "dateofIntervention": moment(new Date()).format('YYYY-MM-DD'),
      "village"           : "-- Select --",
      "date"              : "",
      "sector"            : "-- Select --",
      "typeofactivity"    : "-- Select --",
      "nameofactivity"    : "",
      "activity"          : "-- Select --",
      "subactivity"       : "-- Select --",
      "unit"              : "Number",
      "unitCost"          : 0,
      "quantity"          : 0,
      "noOfBeneficiaries"      : 0,
      "totalcost"         : 0,
      "NABARD"            : 0,
      "LHWRF"             : 0,
      "bankLoan"          : 0,
      "govtscheme"        : 0,
      "directCC"          : 0,
      "indirectCC"        : 0,
      "other"             : 0,
      "total"             : 0,
      "remark"            : "",
      "projectCategoryType" : "LHWRF Grant",
      "projectName"         : "-- Select --",
      "type"                : true,      
      "shown"               : true,      
      "bActivityActive"     : "active",      
      "listofDistrict"    :[],
      "listofBlocks"      :[],
      "listofVillages"    :[],
      fields              : {},
      errors              : {},
      "twoLevelHeader"   : {
        apply             : true,
        firstHeaderData   : [
                            {
                              heading : 'Activity Details',
                              mergedColoums : 13,
                              hide : false
                            },
                            {
                              heading : 'Source of Fund',
                              mergedColoums : 7,
                              hide : true
                            },
                            {
                              heading : '',
                              mergedColoums : 1,
                              hide : true
                            },
                            {
                              heading : '',
                              mergedColoums : 1,
                              hide : true
                            }
                          ]
      },
      "tableHeading"      : {
        projectCategoryType        : "Category",
        projectName                : "Project Name",
        date                       : "Intervention Date",
        place                      : "Intervention Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
        numofBeneficiaries         : "Beneficiary",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank",
        govtscheme                 : "Government",
        directCC                   : "DirectCC",
        indirectCC                 : "IndirectCC",
        other                      : "Other",
        // total                      : "Total",
        remark                     : "Remark",
        actions                    : 'Action',
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        paginationApply            : false,
        downloadApply              : true,
        searchApply                : false,
        editUrl                    : '/activity/'
      },
      "selectedBeneficiaries"      : [],
      "startRange"                 : 0,
      "limitRange"                 : 10000,
      "editId"                     : this.props.match.params ? this.props.match.params.id : '',
      fileDetailUrl                : "/api/activityReport/get/filedetails/",
      beneficiaryFileDetailUrl     : "/api/activityReport/get/beneficiaryFiledetails/",
      goodRecordsTable             : [],
      failedRecordsTable           : [],
      beneficiaryGoodRecordsTable  : [],
      beneficiaryFailedRecordsTable : [],
      goodRecordsHeading           :{
        projectCategoryType        : "Category",
        projectName                : "Project Name",
        date                       : "Date",
        place                      : "Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
        numofBeneficiaries         : "Beneficiary",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank",
        govtscheme                 : "Government",
        directCC                   : "DirectCC",
        indirectCC                 : "IndirectCC",
        other                      : "Other",
        remark                     : "Remark",
      },
      failedtableHeading           :{
        projectCategoryType        : "Category",
        projectName                : "Project Name",
        date                       : "Date",
        place                      : "Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        numofBeneficiaries         : "Beneficiary",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank",
        govtscheme                 : "Government",
        directCC                   : "DirectCC",
        indirectCC                 : "IndirectCC",
        other                      : "Other",
        remark                     : "Remark",
        failedRemark               : "Failed Data Remark",
      },
      beneficiaryGoodRecordsHeading           :{
        sectorName                 : "Sector Name",
        activityName               : "Activity Name",
        subactivityName            : "Subactivity Name",
        date                       : "Date",
        beneficiaryID              : "Beneficiary ID",
        familyID                   : "Family ID",
        nameofbeneficiary          : "Beneficiary Name",
        relation                   : "Relation",
        place                      : "Place" 
      },
      beneficiaryFailedtableHeading           :{
        sectorName                 : "Sector Name",
        activityName               : "Activity Name",
        subactivityName            : "Subactivity Name",
        date                       : "Date",
        familyID                   : "Family ID",
        surnameOfFH                : "FH Surname",
        firstNameOfFH              : "FH Firstname",
        middleNameOfFH             : "FH Middlename",
        uidNumberOfFH              : "FH UID Number",
        contactNumber              : "Contact Number",
        FHGender                   : "FH Gender",
        FHYearOfBirth              : "FH Birth Year",
        caste                      : "Caste",
        landCategory               : "Land holding Category",
        incomeCategory             : "Income Category",
        specialCategory            : "Special Category",
        place                      : "Place",
        beneficiaryID              : "Beneficiary ID",  
        surnameOfBeneficiary       : "Beneficiary Surname",
        firstNameOfBeneficiary     : "Beneficiary Firstname",
        middleNameOfBeneficiary    : "Beneficiary middlename,",
        relation                   : "Relation",
        uidNumber                  : "Beneficiary UID Number",
        genderOfbeneficiary        : "Beneficiary Gender",
        birthYearOfbeneficiary     : "Beneficiary Birth Year",  
        failedRemark               : "Failed Data Remark",            
      }    
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.handleTotalChange = this.handleTotalChange.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
  }

 
  remainTotal(event){
    event.preventDefault(); 
    // console.log("event.target.name",event.target.name);
    var totalBudget = parseFloat(this.state.totalcost);
    var subTotal    = parseFloat(this.state.LHWRF) + parseFloat(this.state.NABARD) + parseFloat(this.state.bankLoan) + parseFloat(this.state.govtscheme) + parseFloat(this.state.directCC) + parseFloat(this.state.indirectCC) + parseFloat(this.state.other);
    // console.log("subTotal",subTotal);
    var arr = ["LHWRF","NABARD","bankLoan","govtscheme","directCC","indirectCC","other"];
    var findIndex = arr.findIndex((obj)=>{return obj  === event.target.name});
    // console.log("findIndex",findIndex);
    if (findIndex !== -1) {
      if (parseFloat(subTotal) < parseFloat(totalBudget)) {
        var getstate = arr[findIndex + 1];
        if (getstate) {
          this.setState({[getstate] : (totalBudget - subTotal).toFixed(2) });
        }
        for (var k = findIndex + 2; k < arr.length; k++) {
          var currentStates = arr[k];
          if (currentStates) {
            this.setState({[currentStates] : 0 });
          }
        }
      }else{
        var remainTotal =  0;
        for (var j = 0; j < findIndex; j++) {
          remainTotal += parseFloat(this.state[arr[j]]);
        }
        if (remainTotal > 0 ) {
          this.setState({[arr[findIndex]] : totalBudget - remainTotal });
        }
        for (var i = findIndex + 1; i < arr.length; i++) {
          var currentState = arr[i];
          if (currentState) {
            this.setState({[currentState] : 0 });
          }
        }
      }
    }
    this.setState({"total": subTotal });
  }

  handleChange(event){
    event.preventDefault();
      if(event.currentTarget.name==='typeofactivity'){
        let dataID = $(event.currentTarget).find('option:selected').attr('data-id')
        if(dataID==="BtypeActivity"){
          this.setState({
            bActivityActive: "inactive"
          });
        }else if(dataID==="commonlevel" || dataID==="familylevel"){
          this.setState({
            bActivityActive: "active"
          });
        }
      }

      if(event.currentTarget.name==='projectName'){
        let id = $(event.currentTarget).find('option:selected').attr('data-id')
        axios.get('/api/projectMappings/fetch/'+id)
        .then((response)=>{
          
          if(response.data[0].sector&&response.data[0].sector.length>0){
            var returnData = [...new Set(response.data[0].sector.map(a => a.sector_ID))]
            if(returnData&&returnData.length>0){
              var array = returnData.map((data,index) => {
                let getIndex = response.data[0].sector.findIndex(x => x.sector_ID===data)
                if(getIndex>=0){
                  return {
                    '_id' : response.data[0].sector[getIndex].sector_ID,
                    'sector' : response.data[0].sector[getIndex].sectorName
                  };
                }
              });
              this.setState({
                availableSectors : array,
                subActivityDetails : "",
                subactivity : "-- Select --",
                activity    : '-- Select --',
                availableSubActivity : [],
                sector_ID : array[0]._id
              },()=>{
                this.getAvailableActivity(array[0]._id)
              })
            }

          }
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      }
      this.setState({      
        [event.target.name]: event.target.value
      },()=>{
    });
  }
  handleTotalChange(event){
    event.preventDefault();
    const target = event.target;
    const name   = target.name;
    this.setState({
       [name]: target.value,
    },()=>{
      if (this.state.unitCost > 0 & this.state.quantity > 0) {
        // console.log("this.state.unitCost = ",this.state.unitCost);
        var totalcost = (parseFloat(this.state.unitCost) * parseFloat(this.state.quantity)).toFixed(2);
        // console.log("totalcost = ",totalcost);
        this.state.LHWRF = 0;
        this.state.NABARD = 0;
        this.state.bankLoan = 0;
        this.state.govtscheme = 0;
        this.state.directCC = 0;
        this.state.indirectCC = 0;
        this.state.other = 0;
        this.setState({
        });   
        this.setState({
          "total"     : totalcost,
          "totalcost" : totalcost,
          "LHWRF"     : totalcost,
          "NABARD"    : 0,
          "bankLoan"  : 0,
          "govtscheme": 0,
          "directCC"  : 0,
          "indirectCC" : 0,
          "other"     : 0,
        });
      }else{
        this.setState({
          "total"     : "",
          "totalcost" : "",
          "LHWRF"     : "",
        });        
      }
    });
  }
  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  isTextKey(evt){
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  uploadedData(data){
    this.getData(this.state.startRange,this.state.limitRange,this.state.center_ID)
  }
  getBeneficiaries(selectedBeneficiaries){
    this.setState({
      selectedBeneficiaries : selectedBeneficiaries
    })
  }

  SubmitActivity(event){
    event.preventDefault();
    // console.log("date = ", this.refs.dateofIntervention.value);
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');
    if ($("#Academic_details").valid()){
      // console.log("date",this.state.dateofIntervention);
      var activityValues= {
        "center_ID"         : this.state.center_ID,
        "centerName"        : this.state.centerName,
        "date"              : this.refs.dateofIntervention.value,
        "stateCode"         : this.state.stateCode,
        "district"          : this.refs.district.value,
        "block"             : this.refs.block.value,
        "village"           : this.refs.village.value,
        "dateofIntervention": this.refs.dateofIntervention.value,
        "sector_ID"         : this.refs.sector.value.split('|')[1],
        "sectorName"        : this.refs.sector.value.split('|')[0],
        "typeofactivity"    : this.refs.typeofactivity.value,
        "activity_ID"       : this.refs.activity.value.split('|')[1],
        "activityName"      : this.refs.activity.value.split('|')[0],
        "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
        "subactivityName"   : this.refs.subactivity.value.split('|')[0],
        "unit"              : document.getElementById('unit').innerHTML,
        "unitCost"          : this.refs.unitCost.value,
        "noOfBeneficiaries" : this.refs.typeofactivity.value==="B Type Activity" ? this.refs.noOfBeneficiaries.value : "",
        "quantity"          : this.refs.quantity.value,
        "totalcost"         : this.state.totalcost,
        "LHWRF"             : this.refs.LHWRF.value,
        "NABARD"            : this.refs.NABARD.value,
        "bankLoan"          : this.refs.bankLoan.value,
        "govtscheme"        : this.refs.govtscheme.value,
        "directCC"          : this.refs.directCC.value,
        "indirectCC"        : this.refs.indirectCC.value,
        "other"             : this.refs.other.value,
        "total"             : this.state.total,
        "remark"            : this.refs.remark.value,
        "listofBeneficiaries" : this.state.selectedBeneficiaries,
        "projectName"         : this.state.projectCategoryType==='LHWRF Grant'?'all':this.state.projectName,
        "projectCategoryType" : this.state.projectCategoryType,
        "type"                : this.state.projectCategoryType=== "LHWRF Grant" ? true : false,
      };
      
      console.log("activityValues", activityValues);
      if (parseFloat(this.state.total) === parseFloat(this.state.totalcost)) {

        axios.post('/api/activityReport',activityValues)
        .then((response)=>{
          console.log("response", response);
          this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
            this.setState({
              selectedValues : this.state.selectedBeneficiaries 
            })    
            swal({
              title : response.data.message,
              text  : response.data.message,
            });   
          })
        .catch(function(error){       
          // console.log('error',error);
          if(error.message === "Request failed with status code 401"){
            swal({
                title : "abc",
                text  : "Session is Expired. Kindly Sign In again."
            });
          }
        });
        this.setState({
          "projectName"        : "-- Select --",
          "projectCategoryType" : "LHWRF Grant",
          "type"                : true,
          "district"          : "-- Select --",
          "block"             : "-- Select --",
          "village"           : "-- Select --",
          "dateofIntervention": momentString,
          "sector"            : "-- Select --",
          "typeofactivity"    : "-- Select --",
          "nameofactivity"    : "",
          "activity"          : "-- Select --",
          "subactivity"       : "-- Select --",
          "unit"              : "",
          "unitCost"          : "0",
          "quantity"          : "0",
          "noOfBeneficiaries"      : "0",
          "totalcost"         : "0",
          "LHWRF"             : "0",
          "NABARD"            : "0",
          "bankLoan"          : "0",
          "govtscheme"        : "0",
          "directCC"          : "0",
          "indirectCC"        : "0",
          "other"             : "0",
          "total"             : "0",
          "remark"            : "",
          "selectedBeneficiaries" :[],
          "selectedValues"         : [],    
          "listofBeneficiaries": [],      
          "subActivityDetails" : '',
          // "availableSectors"   : [],
          // "availableActivity"  : [],
          // "availableSubActivity": [],
          "sendBeneficiary"     : [],
        });
      }else{
        swal("abc",'Total Costs are not equal! Please check.');
      }
    }else{
      $("html,body").scrollTop(0)
    }
  }
  Update(event){
    event.preventDefault();
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');
    if ($("#Academic_details").valid()){
      var activityValues= {
        "activityReport_ID" : this.state.editId,
        "categoryType"      : this.state.projectCategoryType,
        "center_ID"         : this.state.center_ID,
        "centerName"        : this.state.centerName,
        "date"              : this.refs.dateofIntervention.value,
        "stateCode"         : this.state.stateCode,
        "district"          : this.refs.district.value,
        "block"             : this.refs.block.value,
        "village"           : this.refs.village.value,
        "sector_ID"         : this.refs.sector.value.split('|')[1],
        "sectorName"        : this.refs.sector.value.split('|')[0],
        "typeofactivity"    : this.refs.typeofactivity.value,
        "activity_ID"       : this.refs.activity.value.split('|')[1],
        "activityName"      : this.refs.activity.value.split('|')[0],
        "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
        "subactivityName"   : this.refs.subactivity.value.split('|')[0],
        "unit"              : document.getElementById('unit').innerHTML,
        "unitCost"          : this.refs.unitCost.value,
        "noOfBeneficiaries" : this.refs.typeofactivity.value==="B Type Activity" ? this.refs.noOfBeneficiaries.value : "",
        "quantity"          : this.refs.quantity.value,
        "totalcost"         : this.state.totalcost,
        "LHWRF"             : this.refs.LHWRF.value,
        "NABARD"            : this.refs.NABARD.value,
        "bankLoan"          : this.refs.bankLoan.value,
        "govtscheme"        : this.refs.govtscheme.value,
        "directCC"          : this.refs.directCC.value,
        "indirectCC"        : this.refs.indirectCC.value,
        "other"             : this.refs.other.value,
        "total"             : this.state.total,
        "remark"            : this.refs.remark.value,
        "listofBeneficiaries" : this.state.selectedBeneficiaries,
        "projectName"         : this.state.projectCategoryType==='LHWRF Grant'?'all':this.state.projectName,
        "projectCategoryType" : this.state.projectCategoryType,
        "type"                : this.state.projectCategoryType=== "LHWRF Grant" ? true : false,
      };
      // console.log('activityValues',activityValues)
      axios.patch('/api/activityReport',activityValues)
      .then((response)=>{
        // console.log("update",response);
        this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);      
        swal({
          title : response.data.message,
          text  : response.data.message,
        });
      })
      .catch(function(error){ 
        // console.log("error = ",error);
      });
      this.setState({
        "projectName"        : "-- Select --",
        "projectCategoryType" : "LHWRF Grant",
        "type"                : true,
        "district"          : "-- Select --",
        "block"             : "-- Select --",
        "village"           : "-- Select --",
        "dateofIntervention": momentString,
        "sector"            : "-- Select --",
        "typeofactivity"    : "-- Select --",
        "nameofactivity"    : "",
        "activity"          : "-- Select --",
        "subactivity"       : "-- Select --",
        "unit"              : "",
        "unitCost"          : "0",
        "noOfBeneficiaries"      : "0",
        "quantity"          : "0",
        "totalcost"         : "0",
        "LHWRF"             : "0",
        "NABARD"            : "0",
        "bankLoan"          : "0",
        "govtscheme"        : "0",
        "directCC"          : "0",
        "indirectCC"        : "0",
        "other"             : "0",
        "total"             : "0",
        "remark"            : "",
        "selectedBeneficiaries" :[],
        "selectedValues"         : [],    
        "listofBeneficiaries": [],      
        "subActivityDetails" : '',
        // "availableSectors"   : [],
        // "availableActivity"  : [],
        // "availableSubActivity": [],
        "sendBeneficiary"     : [],      
        "editId"              : "",
      });
      this.props.history.push('/activity');
    }else{
      $("html,body").scrollTop(0)
    }
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
       
    if(this.state.bActivityActive==="inactive"){
      if (!fields["noOfBeneficiaries"]) {
        $("html,body").scrollTop(0);
        formIsValid = false;
        errors["noOfBeneficiaries"] = "This field is required.";
      }     
    }

      if (!fields["district"]) {
        $("html,body").scrollTop(0);
        formIsValid = false;
        errors["district"] = "This field is required.";
      }     
       if (!fields["block"]) {
        formIsValid = false;
        errors["block"] = "This field is required.";
      }     
      if (!fields["village"]) {
        formIsValid = false;
        errors["village"] = "This field is required.";
      }
    /*  if (!fields["dateofIntervention"]) {
        formIsValid = false;
        errors["dateofIntervention"] = "This field is required.";
      }*/
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }          
      if (!fields["typeofactivity"]) {
        formIsValid = false;
        errors["typeofactivity"] = "This field is required.";
      }          
      if (!fields["activity"]) {
        formIsValid = false;
        errors["activity"] = "This field is required.";
      }          
      if (!fields["subactivity"]) {
        formIsValid = false;
        errors["subactivity"] = "This field is required.";
      }          
      if (!fields["unitCost"]) {
        formIsValid = false;
        errors["unitCost"] = "This field is required.";
      }          
      if (!fields["quantity"]) {
        formIsValid = false;
        errors["quantity"] = "This field is required.";
      }          
      if (!fields["bankLoan"]) {
        formIsValid = false;
        errors["bankLoan"] = "This field is required.";
      }          
      if (!fields["govtscheme"]) {
        formIsValid = false;
        errors["govtscheme"] = "This field is required.";
      }
      if (!fields["NABARD"]) {
        formIsValid = false;
        errors["NABARD"] = "This field is required.";
      }          
      if (!fields["LHWRF"]) {
        formIsValid = false;
        errors["LHWRF"] = "This field is required.";
      }          
      if (!fields["directCC"]) {
        formIsValid = false;
        errors["directCC"] = "This field is required.";
      }          
      if (!fields["indirectCC"]) {
        formIsValid = false;
        errors["indirectCC"] = "This field is required.";
      }          
      if (!fields["other"]) {
        formIsValid = false;
        errors["other"] = "This field is required.";
      }          
      this.setState({
        errors: errors
      });
      return formIsValid;
  }


  toglehidden(){
   this.setState({
     shown: !this.state.shown
    });
  }
  
  getAvailableVillages(center_ID, district, block)
  {
    axios({
        method: 'get',
        url: '/api/centers/'+center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village", district, block);
        this.setState({
          listofVillages   : availablevillageInCenter,
        },()=>{
          // console.log('listofVillages',this.state.listofVillages);
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  getAvailableBlocks(center_ID, districtB)
  {
        // console.log("center_ID = ",center_ID,"district",districtB);
    axios({
          method: 'get',
          url: '/api/centers/'+center_ID,
          }).then((response)=> {
          // console.log('availableblockInCenter ==========',response);
          function removeDuplicates(data, param, district){
            return data.filter(function(item, pos, array){
              return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
            })
          }
          // console.log('villagesCovered',response.data[0].villagesCovered);
          var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", districtB);
          this.setState({
            listofBlocks     : availableblockInCenter,
          },()=>{
            // console.log('listofBlocks',this.state.listofBlocks);
          })
        }).catch(function (error) {
          console.log("error = ",error);
        });
  }
  edit(id){
    // console.log('this.state.center_ID',this.state.center_ID)
    if(id){
      axios({
        method: 'get',
        url: '/api/activityReport/'+id,
      }).then((response)=> {

        var editData = response.data[0];
        // console.log("editData",editData);
        if(editData){
          var bentableData = []
          if(editData.listofBeneficiaries&&editData.listofBeneficiaries.length>0){
            editData.listofBeneficiaries.map((a, i)=>{
              axios.get('/api/beneficiaries/'+a.beneficiary_ID)
              .then((response)=>{
                // console.log('response',response)
                bentableData.push({
                  _id                       : a._id,
                  beneficiary_ID            : a.beneficiary_ID,
                  beneficiaryID             : a.beneficiaryID,
                  family_ID                 : a.family_ID,
                  familyID                  : a.familyID,
                  nameofbeneficiaries       : response.data[0].surnameOfBeneficiary+' '+response.data[0].firstNameOfBeneficiary+' '+response.data[0].middleNameOfBeneficiary,
                  relation                  : a.relation,
                  dist                      : a.dist,
                  block                     : a.block,
                  village                   : a.village,
                  isUpgraded                : a.isUpgraded,
                })
                if(editData.listofBeneficiaries.length===(i+1)){
                  this.setState({
                    selectedBeneficiaries : bentableData
                  })
                }
              })
              .catch(function(error){ 
                console.log("error = ",error);
              });
            })
          }
          this.setState({
            "editData"          : editData,
            "dateofIntervention": editData.date,
            "stateCode"         : editData.stateCode,
            "district"          : editData.district,
            "block"             : editData.block,
            "village"           : editData.village,
            "date"              : editData.date,
            "sector"            : editData.sectorName+'|'+editData.sector_ID,
            "typeofactivity"    : editData.typeofactivity,
            "bActivityActive"   : editData.typeofactivity==="B Type Activity" ? "inactive" : "active",
            "activity"          : editData.activityName+'|'+editData.activity_ID,
            "subactivity"       : editData.subactivityName+'|'+editData.subactivity_ID,
            "subActivityDetails": editData.unit,
            "unitCost"          : editData.unitCost,
            "quantity"          : editData.quantity,
            "totalcost"         : editData.totalcost,
            "LHWRF"             : editData.sourceofFund.LHWRF,
            "NABARD"            : editData.sourceofFund.NABARD,
            "bankLoan"          : editData.sourceofFund.bankLoan,
            "govtscheme"        : editData.sourceofFund.govtscheme,
            "directCC"          : editData.sourceofFund.directCC,
            "indirectCC"        : editData.sourceofFund.indirectCC,
            "other"             : editData.sourceofFund.other,
            "total"             : editData.sourceofFund.total,
            "noOfBeneficiaries" : editData.noOfBeneficiaries ? editData.noOfBeneficiaries : "",
            "remark"            : editData.remark,
            // "listofBeneficiaries"   : this.state.bentableData,
            // "selectedBeneficiaries" : this.state.bentableData,
            "listofBeneficiaries"   : editData.listofBeneficiaries,
            "selectedBeneficiaries" : editData.listofBeneficiaries,
            "projectCategoryType"   : editData.projectCategoryType,
            "projectName"           : editData.projectName==='all'?'-- Select --':editData.projectName,
            "type"                  : editData.projectCategoryType==="LHWRF Grant" ? true : false,
            "sectorId"   : editData.sector_ID,
            "activityId" : editData.activity_ID,
          }, ()=>{
            this.getAvailableCenter(this.state.center_ID);
            this.getAvailableActivity(this.state.sectorId);
            this.getAvailableSubActivity(this.state.sectorId, this.state.activityId)
            this.getAvailableVillages(this.state.center_ID, this.state.district, this.state.block);
            this.getAvailableBlocks(this.state.center_ID, this.state.district);
            this.getAvailableCenter(this.state.center_ID);
          });
        }
      })
      .catch(function (error) {
        // console.log("error = ",error);
      });
    }
  }

  getLength(center_ID){
   /* axios.get('/api/activityReport/count/'+center_ID)
    .then((response)=>{
      console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
    });*/
  }
  
  addCommas(x) {
    x=x.toString();
    if(x.includes('%')){
        return x;
    }else{
      if(x.includes('.')){
        var pointN = x.split('.')[1];
        var lastN = x.split('.')[0];
        var lastThree = lastN.substring(lastN.length-3);
        var otherNumbers = lastN.substring(0,lastN.length-3);
        if(otherNumbers !== '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
        return(res);
      }else{
        var lastThree = x.substring(x.length-3);
        var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers !== '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return(res);
      }
    }
  }

  getData(startRange, limitRange, center_ID){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    $(".fullpageloader").show();
    axios.post('/api/activityReport/list/'+center_ID, data)
    .then((response)=>{
    $(".fullpageloader").hide();
      console.log("response",response);
      var tableData = response.data.map((a, i)=>{
        return {
          _id                        : a._id,
          projectCategoryType        : a.projectCategoryType,
          projectName                : a.projectName==='all'?'-':a.projectName,
          date                       : moment(a.date).format('DD-MM-YYYY'),
          place                      : a.place,
          sectorName                 : a.sectorName,
          activityName               : a.activityName,
          subactivityName            : a.subactivityName,
          unit                       : a.unit,
          unitCost                   : this.addCommas(a.unitCost),
          quantity                   : this.addCommas(a.quantity),
          totalcost                  : this.addCommas(a.totalcost),
          numofBeneficiaries         : this.addCommas(a.numofBeneficiaries) !=="0" ? this.addCommas(a.numofBeneficiaries) : this.addCommas(a.noOfBeneficiaries),
          LHWRF                      : this.addCommas(a.LHWRF),
          NABARD                     : this.addCommas(a.NABARD),
          bankLoan                   : this.addCommas(a.bankLoan),
          govtscheme                 : this.addCommas(a.govtscheme),
          directCC                   : this.addCommas(a.directCC),
          indirectCC                 : this.addCommas(a.indirectCC),
          other                      : this.addCommas(a.other),
          remark                     : a.remark,
        }
      })
      this.setState({
        tableData : tableData
      },()=>{
        // console.log('tableData',this.state.tableData);
      })
    })
    .catch(function(error){      
      console.log("error = ",error); 
    });
  }

  componentDidMount() {
    $.validator.addMethod("regxDate", function(value, element, regexpr) { 
      return value!=='';
    }, "This field is required.");
    $("#Academic_details").validate({
      rules: {
        dateofIntervention:{
          required: true,
          regxDate: this.refs.dateofIntervention.value
        },
        district: {
          required: true,
        },
        block: {
          required: true,
        },
        village: {
          required: true,
        },
        sector: {
          required: true,
        },
        typeofactivity: {
          required: true,
        },
        activity: {
          required: true,
        },
        subactivity: {
          required: true,
        },
        unitCost: {
          required: true,
        },
        quantity: {
          required: true,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "dateofIntervention"){
          error.insertAfter("#dateofIntervention");
        }
        if (element.attr("name") === "district"){
          error.insertAfter("#district");
        }
        if (element.attr("name") === "block"){
          error.insertAfter("#block");
        }
        if (element.attr("name") === "village"){
          error.insertAfter("#village");
        }
        if (element.attr("name") === "sector"){
          error.insertAfter("#sector");
        }
        if (element.attr("name") === "typeofactivity"){
          error.insertAfter("#typeofactivity");
        }
        if (element.attr("name") === "activity"){
          error.insertAfter("#activity");
        }
        if (element.attr("name") === "subactivity"){
          error.insertAfter("#subactivity");
        }
        if (element.attr("name") === "unitCost"){
          error.insertAfter("#unitCost");
        }
        if (element.attr("name") === "quantity"){
          error.insertAfter("#quantity");
        }
      }
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    var editId = this.props.match.params ? this.props.match.params.id : '';
    this.setState({
      editId : editId
    },()=>{
      if(this.state.editId){      
        this.getAvailableActivity(this.state.editSectorId);
        this.edit(this.state.editId);
      }
    })
    this.getLength();
    // this.getBlock(this.state.stateCode, this.state.district);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // this.getToggleValue();
    this.getLength(this.state.center_ID);
    this.getAvailableProjectName();
    this.getAvailableCenter(this.state.center_ID);
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    // console.log("center_ID =",this.state.center_ID);
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log('nextProps',nextProps)
    if(nextProps){
      var editId = nextProps.match.params.id;
      this.getAvailableSectors();      
      this.getAvailableCenter(this.state.center_ID);      
      // this.getBlock(this.state.stateCode, this.state.district);
      this.setState({
        "editId" : editId,
      })  
      this.edit(editId);
      this.getLength();
    }
  }
  
  deleted(){
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');
    this.setState({
      "stateCode"         : this.state.stateCode,
      "district"          : '-- Select --',
      "block"             : '-- Select --',
      "village"           : '-- Select --',
      "date"              : momentString,
      "sector"            : '-- Select --',
      "typeofactivity"    : '-- Select --',
      "activity"          : '-- Select --',
      "subactivity"       : '-- Select --',
      "subActivityDetails": '',
      "unitCost"          : 0,
      "quantity"          : 0,
      "totalcost"         : 0,
      "LHWRF"             : 0,
      "NABARD"            : 0,
      "bankLoan"          : 0,
      "govtscheme"        : 0,
      "directCC"          : 0,
      "indirectCC"        : 0,
      "other"             : 0,
      "total"             : 0,
      "remark"            : '',
      "listofBeneficiaries" : [],
      "selectedBeneficiaries" : [],
      "sendBeneficiary"       : [],
      "selectedValues"        : [],
      "projectCategoryType"   : this.state.projectCategoryType,
      "projectName"           : '-- Select --',
    })
  } 

  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
      if(response&&response.data){
        this.setState({
          availableSectors : response.data
        })
      }
    }).catch(function (error) {
      // console.log('error', error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      sector_ID          : sector_ID,
      activity           : '-- Select --',
      subActivityDetails : "",
      subactivity : "-- Select --",
      availableSubActivity : []
    })
    this.handleChange(event);
    this.getAvailableActivity(sector_ID);
  }

  getAvailableActivity(sector_ID){
    if(sector_ID){
      axios({
        method: 'get',
        url: '/api/sectors/'+sector_ID,
      }).then((response)=> {
        if(response&&response.data[0]){
          this.setState({
            availableActivity : response.data[0].activity
          })
        }
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }

  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var activity_ID = event.target.value.split('|')[1];
    this.setState({
      subActivityDetails : ""
    });
    this.handleChange(event);
    this.getAvailableSubActivity(this.state.sector_ID, activity_ID);
  }

  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      var availableSubActivity = _.flatten(response.data.map((a, i)=>{
        return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] });
      }))
      this.setState({
        availableSubActivity : availableSubActivity
      });
    }).catch(function (error) {
      console.log("error = ",error);
    });    
  }
  selectSubActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var subActivity_ID = event.target.value.split('|')[1];
    var subActivityDetails = _.flatten(this.state.availableSubActivity.map((a, i)=>{ return a._id === subActivity_ID ? a.unit : ""}))
    this.setState({
      subActivityDetails : subActivityDetails
    })
    this.handleChange(event);
  }

  getAvailableCenter(center_ID){
    // console.log("CID"  ,center_ID);
    if(center_ID){
      axios({
        method: 'get',
        url: '/api/centers/'+center_ID,
        }).then((response)=> {
        // console.log('availableDistInCenter ==========',response);
        function removeDuplicates(data, param){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
          })
        }
        var availableDistInCenter = removeDuplicates(response.data[0].villagesCovered, "district");
        // var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block");
        // var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village");
        // console.log('availableblockInCenter',availableblockInCenter)
        this.setState({
          // listofVillages   : availablevillageInCenter,
          // listofBlocks     : availableblockInCenter,
          listofDistrict   : availableDistInCenter,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
  distChange(event){    
    event.preventDefault();
    var district = event.target.value;
     // console.log('district=', district);
    this.setState({
      district: district,
      block : '-- Select --',
      village : '-- Select --',
      listofVillages : []
    },()=>{
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        // console.log('availableblockInCenter ==========',response);
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
    this.handleChange(event);
  }
  
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block
    },()=>{
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.district,this.state.block);
        this.setState({
          listofVillages   : availablevillageInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
      // console.log("block",block);
      // this.getVillages(this.state.stateCode, this.state.district, this.state.block);
    });
    this.handleChange(event);
  }
  
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    });
    this.handleChange(event);
  }

  getAvailableProjectName(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      // console.log('responseP', response); 
      this.setState({
        availableProjects : response.data
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  handleToggle(event) {  
    event.preventDefault();
    if (this.state.type===true){
      this.setState({
        type: false,
        projectCategoryType  :"Project Fund",
        sector           : '-- Select --',
        subactivity      : "-- Select --",
        activity         : '-- Select --',
        availableSubActivity : [],
        sector_ID            : "",
        activity_ID          : "",
      },()=>{
      })
    }
    else{
      this.setState({
        type: true,
        projectCategoryType  :"LHWRF Grant",
        projectName          :"-- Select --",
        sectorName           : '-- Select --',
        subactivity      : "-- Select --",
        activity         : '-- Select --',
        availableSubActivity : [],
        sector_ID            : "",
        activity_ID          : "",
      },()=>{
      })
    }  
  }
  handleToggleP(event){
    // event.preventDefault();
    this.getAvailableSectors()
    this.setState({
      [event.target.name] : event.target.value,
      sector : '-- Select --',
      availableActivity: [],
      availableSubActivity: [],
      subActivityDetails : "",
      subactivity : "-- Select --",
      activity    : '-- Select --',
    },()=>{
      if (this.state.projectCategoryType === "LHWRF Grant") {
        this.setState({
          projectName:"-- Select --",
        })
      }
    })
  }
  getFileDetails(fileName){
    axios
    .get(this.state.fileDetailUrl+this.state.center_ID+"/"+fileName)
    .then((response)=> {
      $('.fullpageloader').hide();  
      if(response&&response.data) {
        this.setState({
          fileDetails:response.data,
          failedRecordsCount : response.data.failedRecords.length,
          goodDataCount : response.data.goodrecords.length
        });
        var tableData = response.data.goodrecords.map((a, i)=>{
          return{
            "projectCategoryType" : a.projectCategoryType        ? a.projectCategoryType    : '-',
            "projectName"         : a.projectName        ? a.projectName    : '-',
            "date"                : a.date     ? a.date : '-',
            "place"               : a.district + ", " + a.block + ", " + a.village ,
            "sectorName"          : a.sectorName     ? a.sectorName : '-',
            "activityName"        : a.activityName     ? a.activityName : '-',
            "subactivityName"     : a.subactivityName     ? a.subactivityName : '-',
            "unit"                : a.unit     ? a.unit : '-',
            "unitCost"            : a.unitCost     ? a.unitCost : '-',
            "quantity"            : a.quantity     ? a.quantity : '-',
            "totalcost"           : a.totalcost     ? a.totalcost : '-',
            "numofBeneficiaries"  : (a.numofBeneficiaries!=="0" || a.numofBeneficiaries!==0)  ? a.numofBeneficiaries : a.noOfBeneficiaries,
            "LHWRF"               : a.LHWRF     ? a.LHWRF : '-',
            "NABARD"              : a.NABARD     ? a.NABARD : '-',
            "bankLoan"            : a.bankLoan     ? a.bankLoan : '-',
            "govtscheme"          : a.govtscheme     ? a.govtscheme : '-',
            "directCC"            : a.directCC     ? a.directCC : '-',
            "indirectCC"          : a.indirectCC     ? a.indirectCC : '-',
            "other"               : a.other     ? a.other : '-',
            "remark"              : a.remark     ? a.remark : '-',
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
            "projectCategoryType" : a.projectCategoryType        ? a.projectCategoryType    : '-',
            "projectName"         : a.projectName        ? a.projectName    : '-',
            "date"                : a.date     ? a.date : '-',
            "place"               : a.district + ", " + a.block + ", " + a.village ,
            "sectorName"          : a.sectorName     ? a.sectorName : '-',
            "activityName"        : a.activityName     ? a.activityName : '-',
            "subactivityName"     : a.subactivityName     ? a.subactivityName : '-',
            "unit"                : a.unit     ? a.unit : '-',
            "unitCost"            : a.unitCost     ? a.unitCost : '-',
            "quantity"            : a.quantity     ? a.quantity : '-',
            "numofBeneficiaries"  : (a.numofBeneficiaries!=="0" || a.numofBeneficiaries!==0)  ? a.numofBeneficiaries : a.noOfBeneficiaries,
            "LHWRF"               : a.LHWRF     ? a.LHWRF : '-',
            "NABARD"              : a.NABARD     ? a.NABARD : '-',
            "bankLoan"            : a.bankLoan     ? a.bankLoan : '-',
            "govtscheme"          : a.govtscheme     ? a.govtscheme : '-',
            "directCC"            : a.directCC     ? a.directCC : '-',
            "indirectCC"          : a.indirectCC     ? a.indirectCC : '-',
            "other"               : a.other     ? a.other : '-',
            "remark"              : a.remark     ? a.remark : '-',
            "failedRemark"        : a.failedRemark     ? a.failedRemark : '-',
          }
        })
        this.setState({
          goodRecordsTable : tableData,
          failedRecordsTable : failedRecordsTable
        })
      }
    })
    .catch((error)=> { 
          
    }) 
  } 
  
  getBenefiaciaryFileDetails(fileName){
    
    axios
    .get(this.state.beneficiaryFileDetailUrl+this.state.center_ID+"/"+fileName)
    .then((response)=> {
      $('.fullpageloader').hide();  
      if(response&&response.data) {
        this.setState({
          fileDetails:response.data,
          beneficiaryFailedRecordsCount : response.data.failedRecords.length,
          beneficiaryGoodDataCount : response.data.goodrecords.length
        });
       
        var tableData = response.data.goodrecords.map((a, i)=>{
          return{
            "sectorName"        : a.sectorName      ? a.sectorName      : '-',
            "activityName"      : a.activityName    ? a.activityName   : '-',
            "subactivityName"   : a.subactivityName ? a.subactivityName : '-',
            "date"              : a.date            ? a.date : '-',  
            "noOfBeneficiaries" : a.noOfBeneficiaries            ? a.noOfBeneficiaries : '-',  
            "beneficiaryID"     : a.listofBeneficiaries.beneficiaryID ? a.listofBeneficiaries.beneficiaryID      : '-',
            "familyID"          : a.listofBeneficiaries.familyID      ? a.listofBeneficiaries.familyID      : '-',
            "nameofbeneficiary" : a.listofBeneficiaries.nameofbeneficiary ? a.listofBeneficiaries.nameofbeneficiary : '-',
            "relation"          : a.listofBeneficiaries.relation ? a.listofBeneficiaries.relation : '-', 
            "place"             : a.listofBeneficiaries.dist + ", " + a.listofBeneficiaries.block + ", " + a.listofBeneficiaries.village,
          }
        })
         
        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
            "sectorName"      : a.sectorName      ? a.sectorName      : '-',
            "activityName"    : a.activityName    ? a.activityName   : '-',
            "subactivityName" : a.subactivityName ? a.subactivityName : '-',
            "date"            : a.date            ? a.date : '-',
            "familyID"        : a.familyID        ? a.familyID : '-',
            "surnameOfFH"     : a.surnameOfFH     ? a.surnameOfFH : '-',
            "firstNameOfFH"   : a.firstNameOfFH   ? a.firstNameOfFH : '-',
            "middleNameOfFH"  : a.middleNameOfFH  ? a.middleNameOfFH : '-',
            "uidNumberOfFH"   : a.uidNumberOfFH   ? a.uidNumberOfFH : '-',
            "contactNumber"   : a.contactNumber   ? a.contactNumber : '-',
            "FHGender"        : a.FHGender        ? a.FHGender : '-',
            "FHYearOfBirth"   : a.FHYearOfBirth   ? a.FHYearOfBirth : '-',
            "caste"           : a.caste           ? a.caste : '-',
            "landCategory"    : a.landCategory    ? a.landCategory : '-',
            "incomeCategory"  : a.incomeCategory  ? a.incomeCategory : '-',
            "specialCategory" : a.specialCategory ? a.specialCategory : '-',
            "place"           : a.dist + ", " + a.block + ", " + a.village,
            "beneficiaryID"   : a.beneficiaryID     ? a.beneficiaryID : '-',
            "surnameOfBeneficiary"    : a.surnameOfBeneficiary     ? a.surnameOfBeneficiary : '-',
            "firstNameOfBeneficiary"  : a.firstNameOfBeneficiary     ? a.firstNameOfBeneficiary : '-',
            "middleNameOfBeneficiary" : a.middleNameOfBeneficiary     ? a.middleNameOfBeneficiary : '-',
            "relation"        : a.relation     ? a.relation : '-',
            "uidNumber"       : a.uidNumber     ? a.uidNumber : '-',
            "genderOfbeneficiary"     : a.genderOfbeneficiary     ? a.genderOfbeneficiary : '-',
            "birthYearOfbeneficiary"  : a.birthYearOfbeneficiary     ? a.birthYearOfbeneficiary : '-',
            "failedRemark"    : a.failedRemark     ? a.failedRemark : '-',
          }
        })
        
        this.setState({
          beneficiaryGoodRecordsTable : tableData,
          beneficiaryFailedRecordsTable : failedRecordsTable
        },()=>{

        })
      }
    })
    .catch((error)=> { 
          
    }) 
  }

  render() {
    // console.log('this.state.bActivityActive',this.state.bActivityActive);
    return (
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row"> 
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                        Activity Reporting                                     
                     </div>
                    <hr className="hr-head container-flui7d row"/>
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <h4 className="col-lg-6 col-md-6 col-xs-12 col-sm-12 pageSubHeader NOpadding">Activity Details</h4>
                      <ul className="nav tabNav nav-pills col-lg-6 col-md-3 col-sm-12 col-xs-12 NOpadding">
                        <li className="active col-lg-3 col-md-3 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualactivity">Manual</a></li>
                        <li className="col-lg-3 col-md-3 col-xs-6 col-sm-6 NOpadding  text-center" data-tab = "bulkactivity" ><a data-toggle="pill"  href="#bulkactivity">Bulk Upload</a></li>
                        <li className="col-lg-5 col-md-5 col-xs-6 col-sm-6 NOpadding  text-center" data-tab = "bulkbeneficiary" ><a data-toggle="pill"  href="#bulkbeneficiary">Beneficiary Bulk Upload</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="tab-content ">
                    <div id="manualactivity"  className="tab-pane fade in active ">
                    <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">

                      <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                        <label className="formLable">Activity Type<span className="asterix">*</span></label>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeofactivity" >
                          <select className="custom-select form-control inputBox" ref="typeofactivity" name="typeofactivity" value={this.state.typeofactivity} onChange={this.handleChange.bind(this)} >
                            <option disabled="disabled" selected={true}>-- Select --</option>
                            <option data-id="commonlevel">Common Level Activity</option>
                            <option data-id="familylevel">Family Level Activity</option>
                            <option data-id="BtypeActivity">B Type Activity</option>
                          </select>
                        </div>
                        <div className="errorMsg">{this.state.errors.typeofactivity}</div>
                      </div>

                      <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 valid_box " >
                        <div className="" id="projectCategoryType" >
                          <label className=" formLable">Category Type<span className="asterix">*</span></label>
                          {this.state.type===true ?

                           <div className=" switch" onClick={this.handleToggle.bind(this)} >
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="week"  checked />
                              <label htmlFor="week" className="formLable switch-label switch-label-off">LHWRF Grant</label>
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="month"  />
                              <label htmlFor="month" className="formLable switch-label switch-label-on">Project Fund</label>
                              <span className="switch-selection"></span>
                            </div>
                            :
                             <div className="col-lg-12 col-sm-12 col-xs-12 switch" onClick={this.handleToggle.bind(this)} >
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="week"   />
                              <label htmlFor="week" className="formLable switch-label switch-label-off">LHWRF Grant</label>
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="month" checked  />
                              <label htmlFor="month" className="formLable switch-label switch-label-on">Project Fund</label>
                              <span className="switch-selection" ></span>
                            </div>
                          }
                        </div>
                      </div>
                    {/*  <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 valid_box " >
                                            <div className="" id="projectCategoryType" >
                                              <label className=" formLable">Category Type<span className="asterix">*</span></label>
                                              
                                              <div className="switch" >
                                                <input type="radio" className="switch-input pull-left" name="projectCategoryType" checked={this.state.projectCategoryType === "LHWRF Grant"} onChange={this.handleToggle.bind(this)} value="LHWRF Grant" id="week" />
                                                <label htmlFor="week" className="formLable switch-label switch-label-off">LHWRF Grant</label>
                                                <input type="radio" className="switch-input pull-right" name="projectCategoryType" checked={this.state.projectCategoryType === "Project Fund"} onChange={this.handleToggle.bind(this)} value="Project Fund" id="month"  />
                                                <label htmlFor="month" className="formLable switch-label switch-label-on">Project Fund</label>
                                                <span className="switch-selection"></span>
                                              </div>
                                            </div>
                                           
                                          </div>*/}
                        {/*console.log("projectCategoryType",this.state.projectCategoryType)*/}
                      {
                        this.state.projectCategoryType ==="Project Fund" ? 

                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Project Name</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectName" >
                              <select className="custom-select form-control inputBox" ref="projectName" name="projectName" value={this.state.projectName} onChange={this.handleChange.bind(this)} >
                                <option className="hidden" >-- Select --</option>
                                {
                                  this.state.availableProjects && this.state.availableProjects.length > 0  ? 
                                  this.state.availableProjects.map((data, index)=>{
                                    return(
                                      <option key={index} value={(data.projectName)} data-id={data._id}>{(data.projectName)}</option>
                                    );
                                  })
                                  :
                                  null
                                }  
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                        : ""
                      } 
                      <br/>
                      
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                          
                          <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Date of Intervention</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofIntervention" >
                              <input type="date" className="form-control inputBox toUpper" name="dateofIntervention" ref="dateofIntervention" value={this.state.dateofIntervention} onChange={this.handleChange.bind(this)} required/>
                            </div>
                            <div className="errorMsg">{this.state.errors.dateofIntervention}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">District<span className="asterix">*</span></label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox" ref="district" name="district" value={this.state.district} onChange={this.distChange.bind(this)} >
                                  <option disabled="disabled" selected={true}>-- Select --</option>
                                  {
                                    this.state.listofDistrict && this.state.listofDistrict.length > 0 ? 
                                    this.state.listofDistrict.map((data, index)=>{
                                      // console.log('dta', data);
                                      return(
                                        <option key={index} value={data.district.split('|')[0]}>{this.camelCase(data.district.split('|')[0])}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.district}</div>
                          </div>
                          <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Block<span className="asterix">*</span></label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                              <select className="custom-select form-control inputBox" ref="block" name="block"  value={this.state.block} onChange={this.selectBlock.bind(this)} >
                                <option disabled="disabled" selected={true}>-- Select --</option>
                                {
                                  this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                  this.state.listofBlocks.map((data, index)=>{
                                    return(
                                      <option key={index} value={data.block}>{this.camelCase(data.block)}</option>
                                    );
                                  })
                                  :
                                  null
                                }  
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.block}</div>
                          </div>
                          <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Village<span className="asterix">*</span></label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                              <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.selectVillage.bind(this)} >
                                <option disabled="disabled" selected={true}>-- Select --</option>
                                {
                                  this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                                  this.state.listofVillages.map((data, index)=>{
                                    return(
                                      <option key={index} value={data.village}>{this.camelCase(data.village)}</option>
                                    );
                                  })
                                  :
                                  null
                                } 
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.village}</div>
                          </div>
                        </div> 
                      </div><br/>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Sector<span className="asterix">*</span></label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                              <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)} >
                                <option disabled="disabled" selected={true}>-- Select --</option>
                                {
                                  this.state.availableSectors && this.state.availableSectors.length >0 ?
                                  this.state.availableSectors.map((data, index)=>{
                                    return(
                                      <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                                    );
                                  })
                                  :
                                  null
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.sector}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Activity<span className="asterix">*</span></label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                              <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                                <option disabled="disabled" selected={true}>-- Select --</option>
                                {
                                  this.state.availableActivity && this.state.availableActivity.length >0 ?
                                  this.state.availableActivity.map((data, index)=>{
                                    if(data.activityName ){
                                      return(
                                        <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                      );
                                    }
                                  })
                                  :
                                  null
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.activity}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Sub-Activity<span className="asterix">*</span></label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                              <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                                <option disabled="disabled" selected={true}>-- Select --</option>
                                  {
                                    this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                                    this.state.availableSubActivity.map((data, index)=>{
                                      if(data.subActivityName ){
                                        return(
                                          <option className="" key={data._id} data-upgrade={data.familyUpgradation} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                        );
                                      }
                                    })
                                    :
                                    null
                                  }
                                  
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.subactivity}</div>
                          </div>   
                          {
                            this.state.bActivityActive==="inactive" ?
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="formLable">No.of Beneficiaries</label>
                                <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="noOfBeneficiaries" >
                                  <input type="number" className="form-control inputBox" name="noOfBeneficiaries" placeholder="" ref="noOfBeneficiaries"  value={this.state.noOfBeneficiaries}  onChange={this.handleChange.bind(this)}/>
                                </div>
                                <div className="errorMsg">{this.state.errors.noOfBeneficiaries}</div>
                              </div>
                            :null
                          } 
                          {/*<div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Activity Type<span className="asterix">*</span></label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeofactivity" >
                              <select className="custom-select form-control inputBox" ref="typeofactivity" name="typeofactivity" value={this.state.typeofactivity} onChange={this.handleChange.bind(this)} >
                                <option disabled="disabled" selected={true}>-- Select --</option>
                                <option>Common Level Activity</option>
                                 <option>Family Level Activity</option>
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.typeofactivity}</div>
                          </div>*/}
                        </div> 
                      </div><br/>
                      <div className="row ">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className=""  >
                              <label className="formLable">Unit of Measurement</label>
                                <div className="form-control inputBox inputBox-main unit">
                                  {this.state.subActivityDetails ? 
                                      <label className="formLable" id="unit">{this.state.subActivityDetails}</label>
                                    :
                                      null
                                  }
                                </div>
                            </div>
                            <div className="errorMsg">{this.state.errors.unit}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Unit Cost</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="unitCost" >
                              <input type="number"   className="form-control inputBox" name="unitCost" placeholder="" ref="unitCost" value={this.state.unitCost}   onChange={this.handleTotalChange.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.unitCost}</div>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <label className="formLable">Quantity</label>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="quantity" >
                              <input type="number" className="form-control inputBox" name="quantity" placeholder="" ref="quantity"  value={this.state.quantity}  onChange={this.handleTotalChange.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.quantity}</div>
                          </div>
                           <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <div className=" " id="PassoutYear" >

                              <label className="formLable">Total Cost of Activity :</label>
                            
                              <input type="number" className="form-control inputBox inputBox-main" name="totalcost " placeholder="" ref="totalcost"  value={(parseFloat(this.state.totalcost)).toFixed(2)} disabled />
                              
                            </div>
                            <div className="errorMsg">{this.state.errors.totalcost}</div>
                          </div>
                        </div> 
                      </div>
                      <div className="col-lg-12 boxHeightother">
                        <label className="formLable">Remark</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="remark" >
                              <input type="text"   className="form-control inputBox" name="remark" placeholder="" ref="remark" value={this.state.remark}   onChange={this.handleChange.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.remark}</div>
                      </div>
                      <div className="col-lg-12 ">
                         <hr className=""/>
                      </div>
                      <div className="col-lg-12 ">
                         <div className="pageSubHeader">Sources of Fund</div>
                      </div>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">LHWRF</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRF" >
                              <input type="number" min="0"  className="form-control inputBox "  name="LHWRF" placeholder="" ref="LHWRF" value={this.state.LHWRF}    onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.LHWRF}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">NABARD</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="NABARD" >                              
                              <input type="number" min="0" className="form-control inputBox " name="NABARD" placeholder=""ref="NABARD" value={this.state.NABARD}  onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.NABARD}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Bank Loan</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="bankLoan" >
                              <input type="number" min="0" className="form-control inputBox " name="bankLoan" placeholder=""ref="bankLoan" value={this.state.bankLoan}  onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.bankLoan}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Govt. Schemes</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="govtscheme" >
                              <input type="number" min="0"   className="form-control inputBox " name="govtscheme" placeholder="" ref="govtscheme"  value={this.state.govtscheme}  onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.govtscheme}</div>
                          </div>
                        </div> 
                      </div><br/>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Direct Community Contribution</label>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="directCC" >
                              <input type="number" min="0" className="form-control inputBox" name="directCC" placeholder=""ref="directCC"  value={this.state.directCC} onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.directCC}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Indirect Community Contribution</label>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="indirectCC" >
                              <input type="number" min="0" className="form-control inputBox " name="indirectCC" placeholder=""ref="indirectCC"  value={this.state.indirectCC} onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.indirectCC}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Other</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="other" >
                              <input type="number" min="0"   className="form-control inputBox" name="other" placeholder="" ref="other"  value={this.state.other} onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.other}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <div className="" id="total" >
                              <label className="formLable">Total :</label>                            
                               
                                  <div className="form-control inputBox inputBox-main unit">
                                    {this.state.total ? 
                                        <label className="formLable" id="total">{(parseFloat(this.state.total)).toFixed(2)}</label>
                                      :
                                      0
                                    }
                                  </div>
                              
                              {/*<label className="formLable">&nbsp;{this.state.total ?  this.state.total : " 0"}</label>     */}    
                            </div>
                            <div className="errorMsg">{this.state.errors.total}</div>
                          </div>
                        </div> 
                      </div><br/>
                      
                      {
                        this.state.bActivityActive==="active" ? 
                        <div className="">
                          <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                             <hr className=""/>
                          </div>
                          <div className="tableContainrer">
                            <ListOfBeneficiaries 
                              getBeneficiaries={this.getBeneficiaries.bind(this)}
                              selectedValues={this.state.selectedValues}
                              sendBeneficiary={this.state.selectedBeneficiaries}
                            />
                          </div>
                        </div>
                        : null
                      }
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <br/>
                        {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.SubmitActivity.bind(this)}> Submit </button>
                        }
                      </div> 
                      <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                        <hr className=""/>
                      </div>
                    </form>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                    <IAssureTable 
                      tableName = "Activity Report"
                      id = "activityReport"
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects} 
                      isDeleted={this.deleted.bind(this)}
                      viewTable = {true}
                      viewLink = "activityReportView"
                    /> 
                  </div> 
                  </div>
                    <div id="bulkactivity" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                          <BulkUpload url="/api/activityReport/bulk_upload_activities" 
                            data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID}} 
                            uploadedData={this.uploadedData} 

                            fileurl="https://lupiniassureit.s3.ap-south-1.amazonaws.com/master/templates/Activity+Submission.xlsx"
                            // fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Activity+Submission.xlsx"
                            fileDetailUrl={this.state.fileDetailUrl}
                            getFileDetails={this.getFileDetails.bind(this)}
                            getData={this.getData.bind(this)}
                            fileDetails={this.state.fileDetails}
                            goodRecordsHeading ={this.state.goodRecordsHeading}
                            failedtableHeading={this.state.failedtableHeading}
                            failedRecordsTable ={this.state.failedRecordsTable}
                            failedRecordsCount={this.state.failedRecordsCount}
                            goodRecordsTable={this.state.goodRecordsTable}
                            goodDataCount={this.state.goodDataCount}
                          />
                        </div>
                      </div>
                    </div>
                    <div id="bulkbeneficiary" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                          <BulkUpload url="/api/activityReport/bulk_upload_beneficiaries" 
                            data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID}} 
                            uploadedData={this.uploadedData} 
                            fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Beneficiries+In+Activity+Submission.xlsx"
                            fileDetailUrl={this.state.beneficiaryFileDetailUrl}
                            getData={this.getData.bind(this)}
                            getFileDetails={this.getBenefiaciaryFileDetails.bind(this)}
                            fileDetails={this.state.fileDetails}
                            goodRecordsHeading ={this.state.beneficiaryGoodRecordsHeading}
                            failedtableHeading={this.state.beneficiaryFailedtableHeading}
                            failedRecordsTable ={this.state.beneficiaryFailedRecordsTable}
                            failedRecordsCount={this.state.beneficiaryFailedRecordsCount}
                            goodRecordsTable={this.state.beneficiaryGoodRecordsTable}
                            goodDataCount={this.state.beneficiaryGoodDataCount}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default Activity;