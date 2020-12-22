import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import _                      from 'underscore';
import swal                   from 'sweetalert';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 
import Loader                 from "../../../common/Loader.js";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureITTable.jsx";
import ListOfBeneficiaries    from "../listOfBeneficiaries/ListOfBeneficiaries.js";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";
import "./Activity.css";

class ActivityTypeB extends Component{
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
      "noOfBeneficiaries" : 0,
      "totalCost"         : 0,
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
      "typeofactivity"      : "Type B Activity",
      "type"                : true,      
      "shown"               : true,      
      "bActivityActive"     : "inactive",   
      "listofDistrict"      : [],
      "listofBlocks"        : [],
      "listofVillages"      : [],
      "tableData"           : [],
      "downloadData"        : [],
      fields                : {},
      errors                : {},
      "twoLevelHeader"      : {
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
        projectCategoryType        : "Program Type",
        projectName                : "Project Name",
        date                       : "Intervention Date",
        place                      : "Intervention Place",
        sectorName                 : "Sector",
        activity                   : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalCost                  : "Total Cost",
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
      "downloadtableHeading"      : {
        projectCategoryType        : "Program Type",
        projectName                : "Project Name",
        date                       : "Intervention Date",
        district                   : "District",
        block                      : "Block",
        village                    : "Village",
        location                   : "Location",
        sectorName                 : "Sector",
        activityName               : "Activity",
        typeofactivity             : "Type of activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalCost                  : "Total Cost",
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
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        paginationapply            : true,
        paginationApply            : false,
        downloadApply              : true,
        searchApply                : false,
        editUrl                    : '/b-type-activity-form'
      },
      "selectedBeneficiaries"      : [],
      "startRange"                 : 0,
      "limitRange"                 : 10,
      "editId"                     : this.props.match.params ? this.props.match.params.id : '',
      fileDetailUrl                : "/api/activityReport/get/filedetails/",
      goodRecordsTable             : [],
      failedRecordsTable           : [],
      bTypeActivitygoodRecordsHeading           :{
        projectCategoryType        : "Program Type",
        projectName                : "Project Name",
        date                       : "Date",
        place                      : "Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalCost                  : "Total Cost",
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
      bTypeActivityfailedtableHeading           :{
        programCategory            : "Program Type",
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
    }
    this.uploadedData        = this.uploadedData.bind(this);
    this.handleTotalChange   = this.handleTotalChange.bind(this);
    this.getTypeBFileDetails = this.getTypeBFileDetails.bind(this);
  }
 
  remainTotal(event){
    event.preventDefault(); 
    // console.log("event.target.name",event.target.name);
    // console.log("subTotal",subTotal);
    var totalBudget = parseFloat(this.state.totalCost);
    var subTotal    = parseFloat(this.state.LHWRF) + parseFloat(this.state.NABARD) + parseFloat(this.state.bankLoan) + parseFloat(this.state.govtscheme) + parseFloat(this.state.directCC) + parseFloat(this.state.indirectCC) + parseFloat(this.state.other);
    var arr = ["LHWRF","NABARD","bankLoan","govtscheme","directCC","indirectCC","other"];
    var findIndex = arr.findIndex((obj)=>{return obj  === event.target.name});
    // console.log("findIndex",findIndex);
    if (findIndex !== -1) {/*
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
    */}
    this.setState({"total": subTotal });
  }

  handleChange(event){
    event.preventDefault();
    this.setState({      
      [event.target.name]: event.target.value
    },()=>{        
      var inputGetData = {
        "sector_ID"      : "all",
        "activity_ID"    : "all",
        "subactivity_ID" : "all",
        "typeofactivity" : "Type B Activity",
        "startRange"     : this.state.startRange,
        "limitRange"     : this.state.limitRange,
        "center_ID"      : this.state.center_ID,
        "year"           : this.state.year,
      }
      this.getData(inputGetData);
    });
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
            function dynamicSort(property) {
              var sortOrder = 1;
              if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
              }
              return function (a,b) {
                if(sortOrder === -1){
                  return b[property].localeCompare(a[property]);
                }else{
                  return a[property].localeCompare(b[property]);
                }        
              }
            }
            array.sort(dynamicSort("sector"));
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
  }

  handleTotalChange(event){
    event.preventDefault();
    const target = event.target;
    const name   = target.name;
    this.setState({
       [name]: target.value,
    },()=>{
      if (this.state.unitCost > 0 & this.state.quantity > 0) {
        var totalCost = (parseFloat(this.state.unitCost) * parseFloat(this.state.quantity)).toFixed(2);
        this.setState({
          "total"     : totalCost,
          "totalCost" : totalCost,
          "LHWRF"     : totalCost,
        });
      }else{
        this.setState({
          "total"     : "",
          "totalCost" : "",
          "LHWRF"     : "",
        });        
      }
    });
  }

  uploadedData(data){
    var inputGetData = {
      "sector_ID"      :  "all",
      "activity_ID"    :  "all",
      "subactivity_ID" :  "all",
      "typeofactivity" :  "Type B Activity",
      "startRange"     :  this.state.startRange,
      "limitRange"     :  this.state.limitRange,
      "center_ID"      :  this.state.center_ID,
      "year"           :  this.state.year,
    }
    this.getData(inputGetData);
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
    if ($("#BtypeActivity").valid()){
      // console.log("date",this.state.dateofIntervention);
      var activityValues= {
        "center_ID"         : this.state.center_ID,
        "centerName"        : this.state.centerName,
        "date"              : this.refs.dateofIntervention.value,
        "stateCode"         : this.state.stateCode,
        "district"          : this.refs.district.value,
        "block"             : this.refs.block.value,
        "village"           : this.refs.village.value,
        "location"          : this.refs.location.value,
        "dateofIntervention": this.refs.dateofIntervention.value,
        "sector_ID"         : this.refs.sector.value.split('|')[1],
        "sectorName"        : this.refs.sector.value.split('|')[0],
        "typeofactivity"    : "Type B Activity",
        "activity_ID"       : this.refs.activity.value.split('|')[1],
        "activityName"      : this.refs.activity.value.split('|')[0],
        "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
        "subactivityName"   : this.refs.subactivity.value.split('|')[0],
        "unit"              : document.getElementById('unit').innerHTML,
        "unitCost"          : this.refs.unitCost.value,
        "noOfBeneficiaries" : this.refs.noOfBeneficiaries.value,
        "quantity"          : this.refs.quantity.value,
        "totalCost"         : this.state.totalCost,
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
      if (parseFloat(this.state.total) === parseFloat(this.state.totalCost)) {
        axios.post('/api/activityReport',activityValues)
        .then((response)=>{
          var inputGetData = {
            "sector_ID"      :  "all",
            "activity_ID"    :  "all",
            "subactivity_ID" :  "all",
            "typeofactivity" :  "Type B Activity",
            "startRange"     :  this.state.startRange,
            "limitRange"     :  this.state.limitRange,
            "center_ID"      :  this.state.center_ID,
            "year"           :  this.state.year,
          }
          this.getData(inputGetData);
          this.setState({
            "shown"                   : true,
            "selectedValues"          : this.state.selectedBeneficiaries,
            "projectName"             : "-- Select --",
            "projectCategoryType"     : "LHWRF Grant",
            "type"                    : true,
            "district"                : "-- Select --",
            "block"                   : "-- Select --",
            "village"                 : "-- Select --",
            "dateofIntervention"      : momentString,
            "sector"                  : "-- Select --",
            "typeofactivity"          : "-- Select --",
            "nameofactivity"          : "",
            "activity"                : "-- Select --",
            "subactivity"             : "-- Select --",
            "location"                : "",
            "unit"                    : "",
            "unitCost"                : "0",
            "quantity"                : "0",
            "noOfBeneficiaries"       : "0",
            "totalCost"               : "0",
            "LHWRF"                   : "0",
            "NABARD"                  : "0",
            "bankLoan"                : "0",
            "govtscheme"              : "0",
            "directCC"                : "0",
            "indirectCC"              : "0",
            "other"                   : "0",
            "total"                   : "0",
            "remark"                  : "",
            "selectedBeneficiaries"   :[],
            "selectedValues"          : [],    
            "listofBeneficiaries"     : [],      
            "subActivityDetails"      : '',
            "sendBeneficiary"         : [],
          })    
          swal({
            title : response.data.message,
            text  : response.data.message,
          });   
        })
        .catch(function(error){
          console.log('error',error);
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
    if ($("#BtypeActivity").valid()){
      var activityValues= {
        "activityReport_ID"   : this.state.editId,
        "categoryType"        : this.state.projectCategoryType,
        "center_ID"           : this.state.center_ID,
        "centerName"          : this.state.centerName,
        "date"                : this.refs.dateofIntervention.value,
        "stateCode"           : this.state.stateCode,
        "district"            : this.refs.district.value,
        "block"               : this.refs.block.value,
        "village"             : this.refs.village.value,
        "location"            : this.refs.location.value,
        "sector_ID"           : this.refs.sector.value.split('|')[1],
        "sectorName"          : this.refs.sector.value.split('|')[0],
        "typeofactivity"      : "Type B Activity",
        "activity_ID"         : this.refs.activity.value.split('|')[1],
        "activityName"        : this.refs.activity.value.split('|')[0],
        "subactivity_ID"      : this.refs.subactivity.value.split('|')[1],
        "subactivityName"     : this.refs.subactivity.value.split('|')[0],
        "unit"                : document.getElementById('unit').innerHTML,
        "unitCost"            : this.refs.unitCost.value,
        "noOfBeneficiaries"   : this.refs.noOfBeneficiaries.value,
        "quantity"            : this.refs.quantity.value,
        "totalCost"           : this.state.totalCost,
        "LHWRF"               : this.refs.LHWRF.value,
        "NABARD"              : this.refs.NABARD.value,
        "bankLoan"            : this.refs.bankLoan.value,
        "govtscheme"          : this.refs.govtscheme.value,
        "directCC"            : this.refs.directCC.value,
        "indirectCC"          : this.refs.indirectCC.value,
        "other"               : this.refs.other.value,
        "total"               : this.state.total,
        "remark"              : this.refs.remark.value,
        "listofBeneficiaries" : this.state.selectedBeneficiaries,
        "projectName"         : this.state.projectCategoryType==='LHWRF Grant'?'all':this.state.projectName,
        "projectCategoryType" : this.state.projectCategoryType,
        "type"                : this.state.projectCategoryType=== "LHWRF Grant" ? true : false,
      };
      // console.log('activityValues',activityValues)
      if (parseFloat(this.state.total) === parseFloat(this.state.totalCost)) {
        axios.patch('/api/activityReport',activityValues)
        .then((response)=>{
          var inputGetData = {
            "sector_ID"      :  "all",
            "activity_ID"    :  "all",
            "subactivity_ID" :  "all",
            "typeofactivity" :  "Type B Activity",
            "startRange"     :  this.state.startRange,
            "limitRange"     :  this.state.limitRange,
            "center_ID"      :  this.state.center_ID,
            "year"           :  this.state.year,
          }
          this.getData(inputGetData);
          swal({
            title : response.data.message,
            text  : response.data.message,
          });
          this.setState({
            "projectName"            : "-- Select --",
            "projectCategoryType"    : "LHWRF Grant",
            "shown"                  : true,
            "type"                   : true,
            "district"               : "-- Select --",
            "block"                  : "-- Select --",
            "village"                : "-- Select --",
            "dateofIntervention"     : momentString,
            "sector"                 : "-- Select --",
            "typeofactivity"         : "-- Select --",
            "nameofactivity"         : "",
            "activity"               : "-- Select --",
            "subactivity"            : "-- Select --",
            "unit"                   : "",
            "location"               : "",
            "unitCost"               : "0",
            "noOfBeneficiaries"      : "0",
            "quantity"               : "0",
            "totalCost"              : "0",
            "LHWRF"                  : "0",
            "NABARD"                 : "0",
            "bankLoan"               : "0",
            "govtscheme"             : "0",
            "directCC"               : "0",
            "indirectCC"             : "0",
            "other"                  : "0",
            "total"                  : "0",
            "remark"                 : "",
            "selectedBeneficiaries"  : [],
            "selectedValues"         : [],    
            "listofBeneficiaries"    : [],      
            "subActivityDetails"     : '',
            "sendBeneficiary"        : [],      
            "editId"                 : "",
          });
        })
        .catch(function(error){ 
          // console.log("error = ",error);
        });
        this.props.history.push('/b-type-activity-form');
      }else{
        swal("abc",'Total Costs are not equal! Please check.');
      }
    }else{
      $("html,body").scrollTop(0)
    }
  }

  toglehidden(){
    this.setState({
      shown: !this.state.shown
    });

    this.getAvailableSectors();
    this.getAvailableProjectName();
  }
  getAvailableVillages(center_ID, district, block){
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

  getAvailableBlocks(center_ID, districtB){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      })
    .then((response)=> {
      function removeDuplicates(data, param, district){
        return data.filter(function(item, pos, array){
          return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
        })
      }
      var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", districtB);
      this.setState({
        listofBlocks     : availableblockInCenter,
      },()=>{
        // console.log('listofBlocks',this.state.listofBlocks);
      })
    })
    .catch(function (error) {
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
        // console.log("editData",response);
        var editData = response.data[0];
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
                  nameofbeneficiary         : response.data[0].surnameOfBeneficiary+' '+response.data[0].firstNameOfBeneficiary+' '+response.data[0].middleNameOfBeneficiary,
                  relation                  : a.relation,
                  dist                      : a.dist,
                  block                     : a.block,
                  village                   : a.village,
                  isUpgraded                : a.isUpgraded,
                })
                if(editData.listofBeneficiaries.length===(i+1)){
                  this.setState({
                    selectedBeneficiaries : bentableData
                  },()=>{
                    this.getBeneficiaries(this.state.selectedBeneficiaries);
                  })
                }
              })
              .catch(function(error){ 
                console.log("error = ",error);
              });
            })
          }
          this.setState({
            "shown"                 : false,
            "editData"              : editData,
            "dateofIntervention"    : editData.date,
            "stateCode"             : editData.stateCode,
            "district"              : editData.district,
            "block"                 : editData.block,
            "village"               : editData.village,
            "location"              : editData.location,
            "date"                  : editData.date,
            "sector"                : editData.sectorName+'|'+editData.sector_ID,
            "typeofactivity"        : editData.typeofactivity,
            "bActivityActive"       : editData.typeofactivity==="Type B Activity" ? "inactive"     : "active",
            "activity"              : editData.activityName+'|'+editData.activity_ID,
            "subactivity"           : editData.subactivityName+'|'+editData.subactivity_ID,
            "subActivityDetails"    : editData.unit,
            "unitCost"              : editData.unitCost,
            "quantity"              : editData.quantity,
            "totalCost"             : editData.totalCost,
            "LHWRF"                 : editData.sourceofFund.LHWRF,
            "NABARD"                : editData.sourceofFund.NABARD,
            "bankLoan"              : editData.sourceofFund.bankLoan,
            "govtscheme"            : editData.sourceofFund.govtscheme,
            "directCC"              : editData.sourceofFund.directCC,
            "indirectCC"            : editData.sourceofFund.indirectCC,
            "other"                 : editData.sourceofFund.other,
            "total"                 : editData.sourceofFund.total,
            "noOfBeneficiaries"     : editData.noOfBeneficiaries ? editData.noOfBeneficiaries     : "",
            "remark"                : editData.remark,
            // "listofBeneficiaries"   : this.state.bentableData,
            // "selectedBeneficiaries" : this.state.bentableData,
            "listofBeneficiaries"   : editData.listofBeneficiaries,
            "selectedBeneficiaries" : editData.listofBeneficiaries,
            "projectCategoryType"   : editData.projectCategoryType,
            "projectName"           : editData.projectName==='all'?'-- Select --':editData.projectName,
            "type"                  : editData.projectCategoryType==="LHWRF Grant" ? true : false,
            "sectorId"              : editData.sector_ID,
            "activityId"            : editData.activity_ID,
          }, ()=>{
            // console.log("this.state.sector",this.state.sector);
            this.getAvailableSectors();
            this.getAvailableCenter(this.state.center_ID);
            this.getAvailableActivity(this.state.sectorId);
            this.getAvailableSubActivity(this.state.sectorId, this.state.activityId)
            this.getAvailableVillages(this.state.center_ID, this.state.district, this.state.block);
            this.getAvailableBlocks(this.state.center_ID, this.state.district);
            this.getAvailableCenter(this.state.center_ID);
            this.getBeneficiaries(this.state.selectedBeneficiaries);
          });
        }
      })
      .catch(function (error) {
        // console.log("error = ",error);
      });
    }
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
 
  getData(inputGetData){ 
    this.setState({
      propsdata : inputGetData
    })
    if(inputGetData){
      // console.log("getData inputGetData = ",inputGetData);
      $(".fullpageloader").show();
      axios.post('/api/activityReport/filterlist',inputGetData)
      // axios.get('/api/activityReport/filterlist/'+center_ID+'/'+startDate+'/'+endDate+'/all/all/all/'+"Type B Activity")
      .then((response)=>{
        $(".fullpageloader").hide();
        var newTableData = response.data.data.map((a, i)=>{
          return {
            _id                        : a._id,
            projectCategoryType        : a.projectCategoryType,
            projectName                : a.projectName==='all'?'-':a.projectName,
            // date                       : (a.date),
            date                       : moment(a.date).format('DD/MM/YYYY'),
            place                      : a.place,
            sectorName                 : a.sectorName,
            activity                   : a.activity,
            subactivityName            : a.subactivityName,
            unit                       : a.unit,
            unitCost                   : this.addCommas(a.unitCost),
            quantity                   : this.addCommas(a.quantity),
            totalCost                  : this.addCommas(a.totalCost),
            numofBeneficiaries         : (a.noOfBeneficiaries)!==null ? this.addCommas(a.noOfBeneficiaries): 0,
            // numofBeneficiaries         : a.noOfBeneficiaries,
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
     
        if(inputGetData.appendArray){
          this.setState({
            tableData    : this.state.tableData.concat(newTableData),
            // downloadData : this.state.downloadData.concat(newDownloadData)
          })              
        }else{
          this.setState({
            tableData    : newTableData,
            // downloadData : newDownloadData
          })                            
        }
      })
      .catch(function(error){      
        console.log("error = ",error); 
      });

      axios.get('/api/activityReport/count/'+inputGetData.center_ID+'/'+inputGetData.year+'/Type B Activity')
          .then((res)=>{
            this.setState({
              dataCount    : res.data.dataCount,
            },()=>{
              // console.log("this.state.dataCount",this.state.dataCount)
            })
          })
          .catch(function(error){      
            console.log("error = ",error); 
          });
    }
  }

  getDownloadData(year){ 
    if(year){
      var inputGetAllData = {
        "sector_ID"      : "all",
        "activity_ID"    : "all",
        "subactivity_ID" : "all",
        "typeofactivity" : "Type B Activity",
        "startRange"     : "all",
        "limitRange"     : "all",
        "year"           : year,
        "center_ID"      : this.state.center_ID,
      }
      if(inputGetAllData){
        axios.post('/api/activityReport/filterlist',inputGetAllData)
            .then((response)=>{
              var newDownloadData = response.data.data.map((a, i)=>{

                return {
                  _id                        : a._id,
                  projectCategoryType        : a.projectCategoryType,
                  projectName                : a.projectName==='all'?'-':a.projectName,
                  date                       : moment(a.date).format('DD-MM-YYYY'),
                  district                   : a.district,
                  block                      : a.block,
                  village                    : a.village,
                  location                   : a.location,
                  sectorName                 : a.sectorName,
                  activityName               : a.activityName,
                  typeofactivity             : a.typeofactivity,
                  subactivityName            : a.subactivityName,
                  unit                       : a.unit,
                  unitCost                   : this.addCommas(a.unitCost),
                  quantity                   : this.addCommas(a.quantity),
                  totalCost                  : this.addCommas(a.totalCost),
                  numofBeneficiaries         : (a.noOfBeneficiaries)!==null ? this.addCommas(a.noOfBeneficiaries): 0,
                  // numofBeneficiaries         : a.noOfBeneficiaries,
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
                downloadData : newDownloadData
              })                            
            })
            .catch(function(error){      
              console.log("error = ",error); 
            });
      }
    }
  }
  componentDidMount() {
    $.validator.addMethod("regxDate", function(value, element, regexpr) { 
      return value!=='';
    }, "This field is required.");
    $("#BtypeActivity").validate({
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
    
    var editId       = this.props.match.params ? this.props.match.params.id : '';
    const center_ID  = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.year();
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
      editId       : editId
    },()=>{
      this.getAvailableCenter(this.state.center_ID);
    })
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.id;
      this.setState({
        "editId" : editId,
      })  
      this.edit(editId);
    }
  }
  deleted(){
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');
    this.setState({
      "stateCode"             : this.state.stateCode,
      "district"              : '-- Select --',
      "block"                 : '-- Select --',
      "village"               : '-- Select --',
      "date"                  : momentString,
      "sector"                : '-- Select --',
      "typeofactivity"        : '-- Select --',
      "activity"              : '-- Select --',
      "subactivity"           : '-- Select --',
      "location"              : '',
      "subActivityDetails"    : '',
      "unitCost"              : 0,
      "quantity"              : 0,
      "totalCost"             : 0,
      "LHWRF"                 : 0,
      "NABARD"                : 0,
      "bankLoan"              : 0,
      "govtscheme"            : 0,
      "directCC"              : 0,
      "indirectCC"            : 0,
      "other"                 : 0,
      "total"                 : 0,
      "remark"                : '',
      "listofBeneficiaries"   : [],
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
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      var availableSectors = response.data;
      availableSectors.sort(dynamicSort("sector"));
      this.setState({
        availableSectors : availableSectors
      })
    }).catch(function (error) {
      // console.log('error', error);
    });
  }
  selectSector(event){
    event.preventDefault();
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      [event.target.name]  : event.target.value,
      sector_ID            : sector_ID,
      activity             : '-- Select --',
      subActivityDetails   : "",
      subactivity          : "-- Select --",
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
      })
      .then((response)=> {     
        var availableActivity = response.data[0].activity;
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function (a,b) {
            if(sortOrder === -1){
              return b[property].localeCompare(a[property]);
            }else{
              return a[property].localeCompare(b[property]);
            }        
          }
        }
        availableActivity.sort(dynamicSort("activityName"));
        if(response&&response.data[0]){
          this.setState({
            availableActivity : availableActivity,
          })
        }
      })
      .catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  selectActivity(event){
    event.preventDefault();
    this.setState({
      [event.target.name]:event.target.value,
      subActivityDetails : "-- Select --",
      subactivity        : "-- Select --"
    });
    var activity_ID = event.target.value.split('|')[1];
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
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      availableSubActivity.sort(dynamicSort("subActivityName"));
      this.setState({
        availableSubActivity : availableSubActivity
      });
    }).catch(function (error) {
      console.log("error = ",error);
    });    
  }
  selectSubActivity(event){
    event.preventDefault();
    var subActivity_ID = event.target.value.split('|')[1];
    var subActivityDetails = _.flatten(this.state.availableSubActivity.map((a, i)=>{ return a._id === subActivity_ID ? a.unit : ""}))
    this.setState({
      [event.target.name]:event.target.value,
      subActivityDetails : subActivityDetails
    })
    this.handleChange(event);
  }
  getAvailableCenter(center_ID){
    if(center_ID){
      axios({
        method: 'get',
        url: '/api/centers/'+center_ID,
        }).then((response)=> {
          if(response.data){
            function removeDuplicates(data, param){
              return data.filter(function(item, pos, array){
                return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
              })
            }
            var availableDistInCenter = removeDuplicates(response.data[0].villagesCovered, "district");
            function dynamicSort(property) {
              var sortOrder = 1;
              if(property[0] === "-") {
                sortOrder = -1;
                property  = property.substr(1);
              }
              return function (a,b) {
                if(sortOrder === -1){
                  return b[property].localeCompare(a[property]);
                }else{
                  return a[property].localeCompare(b[property]);
                }        
              }
            }
            availableDistInCenter.sort(dynamicSort("district"));
            this.setState({
              listofDistrict  : availableDistInCenter,
            })
          }
        }).catch(function (error) {
          console.log("error"+error);
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
        // console.log('availableblockInCenter ============',response);
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
          }
          return function (a,b) {
            if(sortOrder === -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
          }
        }
        availableblockInCenter.sort(dynamicSort("block"));
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
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
        })
      .then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.district,this.state.block);
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
          }
          return function (a,b) {
            if(sortOrder === -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
          }
        }
        availablevillageInCenter.sort(dynamicSort("village"));
        this.setState({
          listofVillages   : availablevillageInCenter,
        })
      })
      .catch(function (error) {
        console.log("error = ",error);
      });
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    });
  }
  getAvailableProjectName(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    })
    .then((response)=> {
      var availableProjects = response.data
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      availableProjects.sort(dynamicSort("projectName")); 
      this.setState({
        availableProjects : availableProjects
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  handleToggle(event) {  
    event.preventDefault();
    if (this.state.type===true){
      this.setState({
        type                 : false,
        projectCategoryType  :"Project Fund",
        sector               : '-- Select --',
        subactivity          : "-- Select --",
        activity             : '-- Select --',
        availableSubActivity : [],
        sector_ID            : "",
        activity_ID          : "",
      })
    }else{
      this.setState({
        type                 : true,
        projectCategoryType  :"LHWRF Grant",
        projectName          :"-- Select --",
        sectorName           : '-- Select --',
        subactivity          : "-- Select --",
        activity             : '-- Select --',
        availableSubActivity : [],
        sector_ID            : "",
        activity_ID          : "",
      },()=>{
        this.getAvailableSectors();
      })
    }  
  }
  handleToggleP(event){
    this.getAvailableSectors()
    this.setState({
      [event.target.name] : event.target.value,
      sector              : '-- Select --',
      availableActivity   : [],
      availableSubActivity: [],
      subActivityDetails  : "",
      subactivity         : "-- Select --",
      activity            : '-- Select --',
    },()=>{
      if (this.state.projectCategoryType === "LHWRF Grant") {
        this.setState({
          projectName:"-- Select --",
        })
      }
    })
  }
  getTypeBFileDetails(fileName){
    axios
    .get(this.state.fileDetailUrl+this.state.center_ID+"/"+fileName)
    .then((response)=> {
      // console.log('response',response);
      $('.fullpageloader').hide();  
      if(response&&response.data) {
        this.setState({
          fileDetailsTypeB:response.data,
          failedRecordsCountTypeB : response.data.failedRecords.length,
          goodDataCountTypeB : response.data.goodrecords.length
        });
        var tableDatas = response.data.goodrecords.filter((data,i)=>{
          return data.typeofactivity === "Type B Activity";
        });   
        var tableData = tableDatas.map((a, i)=>{
          return{
            "projectCategoryType" : a.projectCategoryType        ? a.projectCategoryType    : '-',
            "projectName"         : a.projectName==="all"        ? '-' : a.projectName,
            "date"                : a.date                       ? moment(a.date).format('DD/MM/YYYY') : '-',
            "place"               : a.district + ", " + a.block + ", " + a.village + ", " + a.location,
            "sectorName"          : a.sectorName                 ? a.sectorName : '-',
            "activityName"        : a.activityName               ? a.activityName : '-',
            "subactivityName"     : a.subactivityName            ? a.subactivityName : '-',
            "unit"                : a.unit                       ? a.unit : '-',
            "unitCost"            : a.unitCost                   ? a.unitCost : '-',
            "quantity"            : a.quantity                   ? a.quantity : '-',
            "totalCost"           : a.totalCost                  ? a.totalCost : '-',
            "numofBeneficiaries"  : (a.numofBeneficiaries!=="0" || a.numofBeneficiaries!==0)  ? a.numofBeneficiaries : a.noOfBeneficiaries,
            "LHWRF"               : a.sourceofFund.LHWRF        ? a.sourceofFund.LHWRF : '-',
            "NABARD"              : a.sourceofFund.NABARD       ? a.sourceofFund.NABARD : '-',
            "bankLoan"            : a.sourceofFund.bankLoan     ? a.sourceofFund.bankLoan : '-',
            "govtscheme"          : a.sourceofFund.govtscheme   ? a.sourceofFund.govtscheme : '-',
            "directCC"            : a.sourceofFund.directCC     ? a.sourceofFund.directCC : '-',
            "indirectCC"          : a.sourceofFund.indirectCC   ? a.sourceofFund.indirectCC : '-',
            "other"               : a.sourceofFund.other        ? a.sourceofFund.other : '-',
            "remark"              : a.remark                    ? a.remark : '-',
          }
        })
        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
            "programCategory"     : a.programCategory        ? a.programCategory    : '-',
            "projectName"         : a.projectName==="all"    ? '-' : a.projectName,
            "date"                : a.date                   ? moment(a.date).format('DD/MM/YYYY') : '-',
            "place"               : a.district + ", " + a.block + ", " + a.village + ", " + a.location,
            "sectorName"          : a.sectorName             ? a.sectorName : '-',
            "activityName"        : a.activityName           ? a.activityName : '-',
            "subactivityName"     : a.subactivityName        ? a.subactivityName : '-',
            "unit"                : a.unit                   ? a.unit : '-',
            "unitCost"            : a.unitCost               ? a.unitCost : '-',
            "quantity"            : a.quantity               ? a.quantity : '-',
            "numofBeneficiaries"  : (a.numofBeneficiaries!=="0" || a.numofBeneficiaries!==0)  ? a.numofBeneficiaries : a.noOfBeneficiaries,
            "LHWRF"               : a.LHWRF                  ? a.LHWRF : '-',
            "NABARD"              : a.NABARD                 ? a.NABARD : '-',
            "bankLoan"            : a.bankLoan               ? a.bankLoan : '-',
            "govtscheme"          : a.govtscheme             ? a.govtscheme : '-',
            "directCC"            : a.directCC               ? a.directCC : '-',
            "indirectCC"          : a.indirectCC             ? a.indirectCC : '-',
            "other"               : a.other                  ? a.other : '-',
            "remark"              : a.remark                 ? a.remark : '-',
            "failedRemark"        : a.failedRemark           ? a.failedRemark : '-',
          }
        })
        this.setState({
          goodRecordsTableTypeB   : tableData,
          failedRecordsTableTypeB : failedRecordsTable
        })
      }
    })
    .catch((error)=> { 
    }) 
  }  
  year() {
    let financeYear;
    let today = moment();
    // console.log('today',today);
    if(today.month() >= 3){
      financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    else{
      financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    this.setState({
        financeYear :financeYear
    },()=>{
      // console.log('financeYear',this.state.financeYear);
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      // console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
        firstYear  :firstYear,
        secondYear :secondYear,
        year       :financialYear
      },()=>{
        var inputGetData = {
          "sector_ID"      :  "all",
          "activity_ID"    :  "all",
          "subactivity_ID" :  "all",
          "typeofactivity" :  "Type B Activity",
          "startRange"     :  this.state.startRange,
          "limitRange"     :  this.state.limitRange,
          "center_ID"      :  this.state.center_ID,
          "year"           :  this.state.year,
        }
        this.getData(inputGetData);
        this.getDownloadData(this.state.year);
        var upcomingFirstYear =parseInt(this.state.firstYear)+3
        var upcomingSecondYear=parseInt(this.state.secondYear)+3
        var years = [];
        for (var i = 2017; i < upcomingFirstYear; i++) {
          for (var j = 2018; j < upcomingSecondYear; j++) {
            if (j-i===1){
              var financeYear = "FY "+i+" - "+j;
              years.push(financeYear);
              this.setState({
                years  :years,
              })              
            }
          }
        }
      })
    })
  }
 
  render() {
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    var displayBlock = {
      display: this.state.shown ? "block" : "none"
    }
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
                    <hr className="hr-head container-fluid row"/>
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                      <h4 className="col-lg-4 col-md-6 col-xs-12 col-sm-12 pageSubHeader">Type B Activity</h4>
                      <div className="col-lg-4 col-lg-offset-4 col-md-6 col-sm-12 col-xs-12">
                        <ul className="nav tabNav nav-pills NOpadding">
                          <li className="active col-lg-5 col-lg-offset-1 col-md-6 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualactivity">Manual</a></li>
                          <li className="col-lg-5 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center" data-tab = "bulkactivityTypeB" ><a data-toggle="pill"  href="#bulkactivityTypeB">Bulk Upload</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content">
                    <div id="manualactivity"  className="tab-pane fade in active ">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt"> 
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-right">
                          <button type="button" className="btn addBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.toglehidden.bind(this)}>Create</button>
                        </div> 
                      </div>
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="BtypeActivity" style={hidden}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box_Filter">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                              Create Activity Report
                            </div>
                            <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">Date of Intervention</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofIntervention" >
                                <input type="date" className="form-control inputBox toUpper" name="dateofIntervention" ref="dateofIntervention" value={this.state.dateofIntervention} onChange={this.handleChange.bind(this)} required/>
                              </div>
                              <div className="errorMsg">{this.state.errors.dateofIntervention}</div>
                            </div>

                            <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 valid_box " >
                              <div className="" id="projectCategoryType" >
                                <label className=" formLable">Program Type<span className="asterix">*</span></label>
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
                                <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                                    <label className="formLable">District<span className="asterix">*</span></label>
                                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                      <select className="custom-select form-control inputBox" ref="district" name="district" value={this.state.district} onChange={this.distChange.bind(this)} >
                                        <option  value = "">-- Select --</option>
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
                                      <option  value = "">-- Select --</option>
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
                                      <option  value = "">-- Select --</option>
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
                                <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                                  <label className="formLable">Location<span className="asterix"></span></label>
                                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="location" >
                                    <input type="text"   className="form-control inputBox" name="location" placeholder="" ref="location" value={this.state.location} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                  <div className="errorMsg">{this.state.errors.location}</div>
                                </div>
                              </div> 
                            </div><br/>
                            <div className="row">
                              <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                                <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                                  <label className="formLable">Sector<span className="asterix">*</span></label>
                                      {/*this.state.sector*/}
                                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                    <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)} >
                                      <option  value = "">-- Select --</option>
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
                                      <option  value = "">-- Select --</option>
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
                                      <option  value = "">-- Select --</option>
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

                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                  <label className="formLable">Unit of Measurement</label>
                                  <div className=""  >
                                      <div className="form-control inputBox inputBox-main unitDiasbleBox">
                                        {this.state.subActivityDetails ? 
                                            <label className="formLable" id="unit">{this.state.subActivityDetails}</label>
                                          :
                                            null
                                        }
                                      </div>
                                  </div>
                                </div>
                              </div> 
                            </div><br/>
                            <div className="row ">
                              <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
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
                                    <input type="number" className="form-control inputBox inputBox-main" name="totalCost" placeholder="" ref="totalCost"  value={(this.state.totalCost)} disabled />
                                  </div>
                                  <div className="errorMsg">{this.state.errors.totalCost}</div>
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
                                     
                                        <div className="form-control inputBox inputBox-main unitDiasbleBox">
                                          {this.state.total ? 
                                              <label className="formLable" id="total">{(parseFloat(this.state.total)).toFixed(2)}</label>
                                            :
                                            0
                                          }
                                        </div>
                                    
                                  </div>
                                  <div className="errorMsg">{this.state.errors.total}</div>
                                </div>
                              </div> 
                            </div><br/>
                          
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
                          </div>
                        </div>
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt" style={displayBlock}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box_Filter">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                              Filters for List
                            </div>  
                            <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                              <label className="formLable">Year</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                                <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                                 <option className="hidden" >-- Select Year --</option>
                                 {
                                  this.state.years 
                                  ?
                                    this.state.years.map((data, i)=>{
                                      return <option key={i}>{data}</option>
                                    })
                                  : null
                                 }
                                </select>
                              </div>
                            </div> 
                          </div>
                        </div>
                        <div className="mt">
                          <IAssureTable 
                            tableName            = "B Type Activity Report"
                            id                   = "bTypeActivityReport"
                            downloadtableHeading ={this.state.downloadtableHeading}
                            downloadData         ={this.state.downloadData}
                            tableHeading         ={this.state.tableHeading}
                            twoLevelHeader       ={this.state.twoLevelHeader} 
                            dataCount            ={this.state.dataCount}
                            tableData            ={this.state.tableData}
                            getData              ={this.getData.bind(this)}
                            tableObjects         ={this.state.tableObjects} 
                            filterData           ={this.state.propsdata}
                            isDeleted            ={this.deleted.bind(this)}
                            viewTable            = {true}
                            viewLink             = "activityReportView"
                            getDownloadData      ={this.getDownloadData.bind(this)}
                          /> 
                        </div>
                      </div>

                    </div>
                    <div id="bulkactivityTypeB" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                          <BulkUpload 
                            url                ="/api/activityReport/bulk_upload_type_B_activities" 
                            data               ={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID, "typeofactivity" : "Type B Activity"}} 
                            uploadedData       ={this.uploadedData} 
                            bulkTableID        = "activityTypeB"
                            fileurl            ="https://lupiniassureit.s3.ap-south-1.amazonaws.com/master/templates/Type-B-Activity-Submission.xlsx"
                            fileDetailUrl      ={this.state.fileDetailUrl}
                            getFileDetails     ={this.getTypeBFileDetails.bind(this)}
                            getData            ={this.getData.bind(this)}
                            fileDetails        ={this.state.fileDetailsTypeB}
                            goodRecordsHeading ={this.state.bTypeActivitygoodRecordsHeading}
                            failedtableHeading ={this.state.bTypeActivityfailedtableHeading}
                            failedRecordsTable ={this.state.failedRecordsTableTypeB}
                            failedRecordsCount ={this.state.failedRecordsCountTypeB}
                            goodRecordsTable   ={this.state.goodRecordsTableTypeB}
                            goodDataCount      ={this.state.goodDataCountTypeB}
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
export default ActivityTypeB;