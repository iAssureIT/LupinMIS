import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./PlanDetails.css";
import BulkUpload             from "../bulkupload/BulkUpload.js";
import $ from 'jquery';
var add=0

class PlanDetails extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
      "center"              :"",
      "sector_id"           :"",
      "sectorName"          :"-- Select --",
      "subActivity"         :"",
      "activityName"        :"-- Select --",
      "physicalUnit"        :"",
      "unitCost"            :"",
      "totalBudget"         :"",
      "noOfBeneficiaries"   :"",
      "LHWRF"               :"",
      "NABARD"              :"",
      "bankLoan"            :"",
      "govtscheme"          :"",
      "directCC"            :"",
      "indirectCC"          :"",
      "other"               :"",
      "remark"              :"",
      "shown"               : true,
      "uID"                 :"",
      "month"               :"Annual Plan", 
      "heading"             :"Annual Plan",
      "months"              :["Annual Plan","All Months","April","May","June","July","August","September","October","November","December","January","February","March"],
      "years"               :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
      "year"                :"FY 2019 - 2020",
      "shown"               : true,
       "twoLevelHeader"     : {
        apply               : true,
        firstHeaderData     : [
                                {
                                    heading : 'Activity Details',
                                    mergedColoums : 12
                                },
                                {
                                    heading : 'Source of Fund',
                                    mergedColoums : 9
                                },
                               
                              ]
      },
      "tableHeading"        : {
        month               : "Month",
        year                : "Year",
        sectorName          : "Sector",
        activityName        : "Activity",
        subactivityName     : "Sub-Activity",
        unit                : "Unit",
        physicalUnit        : "Physical Unit",
        unitCost            : "Unit Cost",
        totalBudget         : "Total Cost",
        noOfBeneficiaries   : "No. Of Beneficiaries",
        noOfFamilies        : "No. Of Families",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank Loan",
        govtscheme          : "Govt. Scheme",
        directCC            : "Direct Community Contribution",
        indirectCC          : "Indirect Community Contribution",
        other               : "Other",
        remark              : "Remark",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/annualPlans/',
        paginationApply     : false,
        downloadApply       : true,
        searchApply         : false,
        editUrl             : '/plan-details/',
      },   
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fields                : {},
      errors                : {},
      subActivityDetails    : [],
      apiCall               : '/api/annualPlans',
      totalBud              : 0,
      annualFileDetailUrl   : "/api/annualPlans/get/filedetails/",
      monthlyFileDetailUrl  : "/api/monthlyplans/get/filedetails/",
      goodRecordsTable      : [],
      failedRecordsTable    : [],
      goodRecordsHeading :{
        month               : "Month",
        year                : "Year",
        sectorName          : "Sector",
        activityName        : "Activity",
        subactivityName     : "Sub-Activity",
        unit                : "Unit",
        physicalUnit        : "Physical Unit",
        unitCost            : "Unit Cost",
        totalBudget         : "Total Cost",
        noOfBeneficiaries   : "No. Of Beneficiaries",
        noOfFamilies        : "No. Of Families",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank Loan",
        govtscheme          : "Govt. Scheme",
        directCC            : "Direct Community Contribution",
        indirectCC          : "Indirect Community Contribution",
        other               : "Other",
        remark              : "Remark"
    },
    failedtableHeading :{
        sectorName          : "Sector",
        activityName        : "Activity",
        subactivityName     : "Sub-Activity",
        unit                : "Unit",
        physicalUnit        : "Physical Unit",
        unitCost            : "Unit Cost",
        noOfBeneficiaries   : "No. Of Beneficiaries",
        noOfFamilies        : "No. Of Families",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank Loan",
        govtscheme          : "Govt. Scheme",
        directCC            : "Direct Community Contribution",
        indirectCC          : "Indirect Community Contribution",
        other               : "Other",
        remark              : "Remark",
        failedRemark        : 'Failed Data Remark',
    },
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.remainTotal  = this.remainTotal.bind(this);
    this.handlesubactivityChange = this.handlesubactivityChange.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
  }
  handlesubactivityChange(event){
   // event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checked' ? target.checked : target.value;
    const name   = (target.name).split('-')[0];
    var index    = (target.name).split('-')[1];
    var obj      = this.state.availableSubActivity[parseInt(index)]; 
    obj[name]    = value;

    this.setState({
      [event.target.name]: value,
    },()=>{
      // console.log("name",name);
      if (name === "physicalUnit" || name === "unitCost") {
        this.calculateTotalBudget(index); 
      }
      if (name === "noOfBeneficiaries" || name === "noOfFamilies") {
        if (parseInt(this.state[`noOfBeneficiaries-${index}`]) < parseInt(this.state[`noOfFamilies-${index}`]) ) {
          swal("No. of Families should not greater than No. of Beneficiaries");
         this.state.availableSubActivity[parseInt(index)].noOfBeneficiaries = 0;
         this.state.availableSubActivity[parseInt(index)].noOfFamilies = 0;
          this.setState({
            [`noOfBeneficiaries-${index}`] : 0,
            [`noOfFamilies-${index}`] : 0
          });
        }
      }
      // this.addsubActivityDetails(id,name,value,this.state.totalBud);
    });  
  }
  calculateTotalBudget(index){
    if (this.state["physicalUnit-"+index] && this.state["unitCost-"+index]) {
      const total =  parseInt(this.state["physicalUnit-"+index]) * parseInt(this.state["unitCost-"+index]);
      // console.log("total",total);
      this.state.availableSubActivity[parseInt(index)].totalBudget = total;
      this.state.availableSubActivity[parseInt(index)].LHWRF = total;
      this.state.availableSubActivity[parseInt(index)].NABARD = 0;
      this.state.availableSubActivity[parseInt(index)].bankLoan = 0;
      this.state.availableSubActivity[parseInt(index)].directCC = 0;
      this.state.availableSubActivity[parseInt(index)].govtscheme = 0;
      this.state.availableSubActivity[parseInt(index)].indirectCC = 0;
      this.state.availableSubActivity[parseInt(index)].other = 0;
      this.setState({ 
        ["totalBudget-"+index] : total,
        ["LHWRF-"+index] : total,
        ["NABARD-"+index] : 0,
        ["bankLoan-"+index] : 0,
        ["directCC-"+index] : 0,
        ["govtscheme-"+index] : 0,
        ["indirectCC-"+index] : 0,
        ["other-"+index] : 0,
      })

    }
  }

  handleChange(event){
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      fields
    },()=>{
      this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }

  remainTotal(index,name){
    var totalBudget    = this.state.availableSubActivity[parseInt(index)].totalBudget;
    var getsubActivity = this.state.availableSubActivity[parseInt(index)];
    var subTotal       = parseInt(getsubActivity.LHWRF) + parseInt(getsubActivity.NABARD) + parseInt(getsubActivity.bankLoan) + parseInt(getsubActivity.govtscheme) + parseInt(getsubActivity.directCC) + parseInt(getsubActivity.indirectCC) + parseInt(getsubActivity.other);
    var arr            = ["LHWRF","NABARD","bankLoan","govtscheme","directCC","indirectCC","other"];
    var findIndex      = arr.findIndex((obj)=>{return obj  === name});

    if (findIndex !== -1) {
      if (parseInt(subTotal) < parseInt(totalBudget)) {
         var getstate = arr[findIndex + 1];
          if (getstate) {
             getsubActivity[getstate] = totalBudget - subTotal;
             this.setState({[getstate+"-"+index] : totalBudget - subTotal });
          }
          for (var k = findIndex + 2; k < arr.length; k++) {
            var currentStates = arr[k];
            if (currentStates) {
               getsubActivity[currentStates] = 0;
               this.setState({[currentStates+"-"+index] : 0 });
            }
          }
      }else{
        var remainTotal =  0;
        for (var j = 0; j < findIndex; j++) {
            remainTotal += parseInt(getsubActivity[arr[j]]);
        }
        if (remainTotal > 0 ) {
          getsubActivity[arr[findIndex]] = totalBudget - remainTotal;
          this.setState({[arr[findIndex]+"-"+index] : totalBudget - remainTotal});
        }
        for (var i = findIndex + 1; i < arr.length; i++) {
          var currentState = arr[i];
          if (currentState) {
             getsubActivity[currentState] = 0;
             this.setState({[currentState+"-"+index] : 0 });
          }
        }
      }
      
    }

  }
  
  subActivityDetails(event){
    // console.log("subActivityDetails",subActivityDetails);
    // event.preventDefault();
    var id = (event.target.name).split('-')[1];
    const name  = event.target.name;
    const value = event.target.value;
    let fields = this.state.fields;
    const x =  this.refs["physicalUnit-"+id].value * this.refs["unitCost-"+id].value;
    // console.log('x',x)
    this.setState({
      [event.target.name] : event.target.value,
      totalBud : x,
      ["totalBudget-"+id] : x,
      ["LHWRF-"+id] : x,
      ["NABARD-"+id] : 0,
      ["bankLoan-"+id] : 0,
      ["directCC-"+id] : 0,
      ["govtscheme-"+id] : 0,
      ["indirectCC-"+id] : 0,
      ["other-"+id] : 0,
    },()=>{
      // console.log('totalBud=========',this.state.totalBud );
      if (parseInt(this.state[`noOfBeneficiaries-${id}`]) < parseInt(this.state[`noOfFamilies-${id}`]) ) {
        swal("No. of Families should not greater than No. of Beneficiaries");
        this.setState({
          [`noOfBeneficiaries-${id}`] : 0,
          [`noOfFamilies-${id}`] : 0
        });
      }
      this.addsubActivityDetails(id,name,value,this.state.totalBud);
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
    
  }
  addsubActivityDetails(id,name,value,totalBud){
    var subActivityDetails = this.state.subActivityDetails;
    
    // console.log("this.state.subActivityDetails",this.state.subActivityDetails);
    var idExist = subActivityDetails.filter((a)=>{return a.subactivity_ID === id});
    var name = (name).split('-')[0];
    // console.log("idExist",idExist);
     var y =parseInt(totalBud);  
     // console.log("y1 = ",y);
    if(idExist.length > 0){      
     // console.log("y2 = ",idExist.length );
      for(var i=0; i<subActivityDetails.length; i++){
        if(subActivityDetails[i].subactivity_ID === id){
          subActivityDetails[i][name] = value;
          subActivityDetails[i].totalBudget = y
        }
      }
    }else{
     // console.log("y3 = ",y);
      subActivityDetails.push({
        "subactivity_ID"      : id,
        "subactivityName"     : document.getElementById('subActivityName-'+id).innerHTML,
        "unit"                : document.getElementById('unit-'+id).innerHTML,
        "totalBudget"         : y,
        [name]                : value

      })
    }
    this.setState({
      subActivityDetails : subActivityDetails
    },()=>{
      console.log("subActivityDetails",this.state.subActivityDetails);
    })

  }
  uploadedData(data){
     this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
  }
  SubmitAnnualPlan(event){
    event.preventDefault();
    var subActivityDetails = this.state.availableSubActivity.filter((data,i)=>{
      return data.totalBudget > 0;
    });   
    // console.log("subActivityDetails",subActivityDetails);

      let fields = {};
      // fields["year"]              = "";
      // fields["month"]             = "";
      // fields["sectorName"]        = "";
      // fields["activityName"]      = "";
      // fields["physicalUnit"]      = "";
      // fields["unitCost"]          = "";
      // fields["totalBudget"]       = "";
      // fields["noOfFamilies"]      = "";
      // fields["noOfBeneficiaries"] = "";
      // fields["LHWRF"]             = "";
      // fields["NABARD"]            = "";
      // fields["bankLoan"]          = "";
      // fields["govtscheme"]        = "";
      // fields["directCC"]          = "";
      // fields["indirectCC"]        = "";
      // fields["other"]             = "";
      // fields["remark"]            = "";
      // // console.log("this.state.apiCall",this.state.apiCall);
      if(subActivityDetails.length > 0){
        for(var i=0; i<subActivityDetails.length; i++){
          var planValues = {
            "month"               : this.state.month,          
            "year"                : this.state.year,          
            "center_ID"           : this.state.center_ID,
            "center"              : this.state.centerName,
            "sector_ID"           : this.state.sectorName.split('|')[1],
            "sectorName"          : this.state.sectorName.split('|')[0],
            "activity_ID"         : this.state.activityName.split('|')[1],
            "activityName"        : this.state.activityName.split('|')[0],
            "subactivity_ID"      : subActivityDetails[i]._id,
            "subactivityName"     : subActivityDetails[i].subActivityName,
            "unit"                : subActivityDetails[i].unit,
            "physicalUnit"        : parseInt(subActivityDetails[i].physicalUnit),
            "unitCost"            : parseInt(subActivityDetails[i].unitCost),
            "totalBudget"         : parseInt(subActivityDetails[i].totalBudget),
            "noOfBeneficiaries"   : parseInt(subActivityDetails[i].noOfBeneficiaries),
            "noOfFamilies"        : parseInt(subActivityDetails[i].noOfFamilies),
            "LHWRF"               : parseInt(subActivityDetails[i].LHWRF),
            "NABARD"              : parseInt(subActivityDetails[i].NABARD),
            "bankLoan"            : parseInt(subActivityDetails[i].bankLoan),
            "govtscheme"          : parseInt(subActivityDetails[i].govtscheme),
            "directCC"            : parseInt(subActivityDetails[i].directCC),
            "indirectCC"          : parseInt(subActivityDetails[i].indirectCC),
            "other"               : parseInt(subActivityDetails[i].other),
            "remark"              : subActivityDetails[i].remark,
          };
          axios.post(this.state.apiCall, planValues)
            .then((response)=>{
              // console.log("response",response);
              if (response.status === 200 ) {
                swal({
                  title : response.data.message,
                  text  : response.data.message
                });
                // swal("Plan created successfully");
              }
              if(this.state.month ==='Annual'){
                var email = localStorage.getItem('email')
                var msgvariable = {
                  '[User]'    : localStorage.getItem('fullName'),
                  '[FY]'    : this.refs.year.value,
                }
                // console.log("msgvariable :"+JSON.stringify(msgvariable));
                var inputObj = {  
                  to           : email,
                  templateName : 'User - Annual Plan Submitted',
                  variables    : msgvariable,
                }
                // axios
                // .post('/api/masternotification/send-mail',inputObj)
                // .then((response)=> {
                //   // console.log("-------mail------>>",response);
                  
                // })
                // .catch(function (error) {
                //     console.log(error);
                // })
                  this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
              }else{
                var email = localStorage.getItem('email')
                var msgvariable = {
                  '[User]'    : localStorage.getItem('fullName'),
                  '[FY]'    : this.refs.year.value,
                  '[monthName]' : this.refs.month.value
                }
                // console.log("msgvariable :"+JSON.stringify(msgvariable));
                var inputObj = {  
                  to           : email,
                  templateName : 'User - Monthly Plan Submitted',
                  variables    : msgvariable,
                }
                // axios
                // .post('/api/masternotification/send-mail',inputObj)
                // .then((response)=> {
                //   // console.log("-------mail------>>",response);
                  
                // })
                // .catch(function (error) {
                //     console.log(error);
                // })
                  this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
              }
            })
            .catch(function(error){
              console.log("error"+error);
          });
          Object.entries(planValues).map( 
            ([key, value], i)=> {
              this.setState({
                [key+'-'+this.state.subactivity_ID] : ""
              },()=>{
                console.log(this.state[key+'-'+this.state.subactivity_ID]);
              })
            }
          );
        }
      }else{
        this.validateFormReq();
        swal({
          title : "abc",
          text  : "Please fill atleast one SubActivity Details."
        });
      }
      this.setState({
        "year"                : "FY 2019 - 2020",
        "month"               : "Annual Plan",
        "center"              :"",
        "sector_id"           :"",
        "sectorName"          :"-- Select --",
        "activityName"        :"-- Select --",
        "fields"              :fields,
        "editId"              :"",
        "subActivityDetails"  :[],
        "availableSubActivity":[],
        "availableActivity"   :[],
        "subActivityDetails[i][name]":"",
        "shown"               : true,
        // shown                 : !this.state.shown
      });
  }
  Update(event){    
    event.preventDefault();
    var subActivityDetails = this.state.availableSubActivity;
    if(subActivityDetails&&subActivityDetails.length > 0){
      for(var i=0; i<subActivityDetails.length; i++){
        var planValues = {
          "annualPlan_ID"       : this.state.editId,
          "monthlyPlan_ID"      : this.state.editId,
          "month"               : this.state.month,          
          "year"                : this.state.year,           
          "center_ID"           : this.state.center_ID,
          "center"              : this.state.centerName,
          "sector_ID"           : this.state.sectorName.split('|')[1],
          "sectorName"          : this.state.sectorName.split('|')[0],
          "activity_ID"         : this.state.activityName.split('|')[1],
          "activityName"        : this.state.activityName.split('|')[0],
          "subactivity_ID"      : subActivityDetails[i]._id,
          "subactivityName"     : subActivityDetails[i].subActivityName,
          "unit"                : subActivityDetails[i].unit,
          "physicalUnit"        : parseInt(subActivityDetails[i].physicalUnit),
          "unitCost"            : parseInt(subActivityDetails[i].unitCost),
          "totalBudget"         : parseInt(subActivityDetails[i].totalBudget),
          "noOfBeneficiaries"   : parseInt(subActivityDetails[i].noOfBeneficiaries),
          "noOfFamilies"        : parseInt(subActivityDetails[i].noOfFamilies),
          "LHWRF"               : parseInt(subActivityDetails[i].LHWRF),
          "NABARD"              : parseInt(subActivityDetails[i].NABARD),
          "bankLoan"            : parseInt(subActivityDetails[i].bankLoan),
          "govtscheme"          : parseInt(subActivityDetails[i].govtscheme),
          "directCC"            : parseInt(subActivityDetails[i].directCC),
          "indirectCC"          : parseInt(subActivityDetails[i].indirectCC),
          "other"               : parseInt(subActivityDetails[i].other),
          "remark"              : subActivityDetails[i].remark,
        };
        // console.log('planValues',planValues)
        axios.patch(this.state.apiCall+'/update', planValues)
          .then((response)=>{
            // console.log('response',response)
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
          })
          .catch(function(error){
            console.log("error"+error);
        }); 
        this.setState({
          "year"                : "FY 2019 - 2020",
          "month"               : "Annual Plan",
          "center"              : "",
          "sector_id"           : "",
          "sectorName"          : "-- Select --",
          "activityName"        : "-- Select --",
          "editId"              :"",
          "availableSubActivity":[],
          "months"              :["Annual Plan","All Months", "April","May","June","July","August","September","October","November","December","January","February","March"],
          "years"               :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
          "shown"               : true,
          "apiCall"             : '/api/annualPlans'
        },()=>{
          this.props.history.push('/plan-details');
        });
      }
    }
    // this.props.history.push('/plan-details')
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    // $("html,body").scrollTop(0);
      if (!fields["sectorName"]) {
        formIsValid = false;
        errors["sectorName"] = "This field is required.";
      }     
      if (!fields["activityName"]) {
        formIsValid = false;
        errors["activityName"] = "This field is required.";
      }  
     /* if (!fields["year"]) {
        formIsValid = false;
        errors["year"] = "This field is required.";
      }      */
      /*if (!fields["month"]) {
        formIsValid = false;
        errors["month"] = "This field is required.";
      } 
      if (!fields["year"]) {
        formIsValid = false;
        errors["year"] = "This field is required.";
      }       
       */     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    // $("html,body").scrollTop(0);

      this.setState({
        errors: errors 
      });
      return formIsValid;
  }

  getLength(){
    axios.get(this.state.apiCall+'/count'+"/"+this.state.center_ID)
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){      
    });
  }
  selectMonth(event){
    event.preventDefault();
    var tableObjects = this.state.tableObjects;
    tableObjects["apiLink"] = event.target.value === 'Annual Plan' ? '/api/annualPlans/' : '/api/monthlyPlans/';
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      "years"               : event.target.value  === 'Annual Plan' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "month"               : event.target.value,        
      "apiCall"             : event.target.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
      "sectorName"          : "-- Select --",
      "activityName"        : "-- Select --",
      "availableSubActivity": [],
      tableObjects,
      fields
    },()=>{
      this.setState({
        "year" : this.state.years[0]
      },()=>{
        // console.log('month =====', this.state.month, this.state.year)
        this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);

      })
    });

    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
  getData(center_ID, month, year, startRange, limitRange ){
    var data = {
    center_ID  : center_ID,
    month      : month,
    year       : year,
    startRange : startRange,
    limitRange : limitRange
    }
    // console.log("data",data);
    axios.post(this.state.apiCall+'/list', data)
      .then((response)=>{
          // console.log("response",response);
      var tableData = response.data.map((a, i)=>{
        return {
        _id                 : a._id,
        month               : a.month,
        year                : a.year,
        sectorName          : a.sectorName,
        activityName        : a.activityName,
        subactivityName     : a.subactivityName,
        unit                : a.unit,
        physicalUnit        : a.physicalUnit,
        unitCost            : a.unitCost,
        totalBudget         : a.totalBudget,
        noOfBeneficiaries   : a.noOfBeneficiaries,
        noOfFamilies        : a.noOfFamilies,
        LHWRF               : a.LHWRF,
        NABARD              : a.NABARD,
        bankLoan            : a.bankLoan,
        govtscheme          : a.govtscheme,
        directCC            : a.directCC,
        indirectCC          : a.indirectCC,
        other               : a.other,
        remark              : a.remark,
        
        }
      })

        this.setState({
          tableData : tableData
        },()=>{
          // console.log("tableData",this.state.tableData);
        });
      })
      .catch(function(error){
        console.log("error"+error);
      });
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableSectors();
    var editId = nextProps.match.params.id;

    if(nextProps.match.params.id){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        if(this.state.editId && this.state.month === 'Annual Plan'){
          this.setState({
            "months"              :["Annual Plan"],
            "years"               : this.refs.month.value === 'Annual Plan' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }else if(this.state.editId && this.state.month !== 'Annual Plan'){
          this.setState({
            "months"              :["All Months", "April","May","June","July","August","September","October","November","December","January","February","March"],
            "years"               :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }
        this.getAvailableActivity(this.state.editSectorId);
        this.getAvailableSubActivity(this.state.editSectorId);
        this.edit(this.state.editId);
      })    
    }    
    this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    if(nextProps){
      this.getLength();
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    if(this.state.editId){     
      this.edit(this.state.editId);       
    }
    this.setState({
      "year"  : this.state.years[0],
      apiCall : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
    },()=>{
      // console.log('year', this.state.year)
       this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    })
    this.getLength();
   

    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    });
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
      console.log("error"+error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      sector_ID : sector_ID
    })
    this.handleChange(event);
    this.getAvailableActivity(sector_ID);
  }
  getAvailableActivity(sector_ID){
    // console.log("sector_ID",sector_ID);
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      
        this.setState({
          availableActivity : response.data[0].activity,
          activityName      : "-- Select --",
          availableSubActivity : []
        },()=>{
          // console.log("availableActivity=",this.state.availableActivity);
        })
    }).catch(function (error) {
      console.log("error"+error);
    });
  }
  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var activity_ID = event.target.value.split('|')[1];
    this.handleChange(event);
    this.getAvailableSubActivity(this.state.sector_ID, activity_ID);
  }
  
  getAvailableSubActivity(sector_ID, activity_ID){

    var data={
      "sector_ID"   : sector_ID,
      "activity_ID" : activity_ID,
      "planFor"     : this.state.month === "Annual Plan" ? "Annual" : "Monthly",
      "month"       : this.state.month,
      "year"        : this.state.year
    }
    axios.post('/api/sectors/activity',data)
    .then((response)=> {
      // console.log("response.data",response.data);
        // var availableSubActivity = _.flatten(response.data.map((a, i)=>{
        //     return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] 
        //   });
        // }))
        var newavailableSubActivity = response.data.map((data,index)=>{
          data.physicalUnit = 0;
          data.unitCost     = 0;
          data.LHWRF        = 0;
          data.NABARD       = 0;
          data.bankLoan     = 0;
          data.govtscheme   = 0; 
          data.directCC     = 0;
          data.indirectCC   = 0;
          data.other        = 0;
          data.totalBudget  = 0;
          data.noOfBeneficiaries = 0;
          data.noOfFamilies = 0;
          data.remark       = '';
          return data;
        });
        // console.log("newavailableSubActivity",newavailableSubActivity);
        this.setState({
          availableSubActivity : newavailableSubActivity
        },()=>{
          // console.log("availableSubActivity after",this.state.availableSubActivity);
        })
        // this.excludeSubmittedSubActivity(availableSubActivity);       
    }).catch((error)=> {
      console.log("error"+error);
    }); 
  }
  edit(id){
    axios({
      method: 'get',
      url: this.state.apiCall+'/'+id,
      }).then((response)=> {
      var editData = response.data[0];
      // console.log("editData :",editData);
      this.getAvailableActivity(editData.sector_ID);
      this.setState({
        "availableSubActivity"    : [{
          _id                   : editData.subactivity_ID,
          "subActivityName"     : editData.subactivityName,
          "unit"                : editData.unit,
          "physicalUnit"        : editData.physicalUnit,
          "unitCost"            : editData.unitCost,
          "totalBudget"         : editData.totalBudget,
          "noOfBeneficiaries"   : editData.noOfBeneficiaries,
          "noOfFamilies"        : editData.noOfFamilies,
          "unit"                : editData.unit,
          "LHWRF"               : editData.LHWRF,
          "NABARD"              : editData.NABARD,
          "bankLoan"            : editData.bankLoan,
          "govtscheme"          : editData.govtscheme,
          "directCC"            : editData.directCC,
          "indirectCC"          : editData.indirectCC,
          "other"               : editData.other,
          "remark"              : editData.remark,
        }],
        "shown"                   : false,
        "year"                    : editData.year,
        "month"                   : editData.month,
        "center"                  : editData.center,
        "sectorName"              : editData.sectorName+'|'+editData.sector_ID,
        "activityName"            : editData.activityName+'|'+editData.activity_ID,
        "subactivity_ID"          : editData.subactivity_ID,
      },()=>{
       
      })      
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    }).catch(function (error) {
      // console.log("error"+error);
    });
  }
  toglehidden(){   
    this.setState({
     shown: !this.state.shown
    },()=>{
      // console.log('shown', this.state.shown, !this.state.shown);
    });
  }
  getSearchText(searchText, startRange, limitRange){
    this.setState({
      tableData : []
    })
  }
  getFileDetails(fileName){
    var fileDetailUrl = this.state.month == "Annual Plan" ? this.state.annualFileDetailUrl : this.state.monthlyFileDetailUrl;
      axios
      .get(fileDetailUrl+fileName)
      .then((response)=> {
      $('.fullpageloader').hide();  
      if (response) {
        this.setState({
            fileDetails:response.data,
            failedRecordsCount : response.data.failedRecords.length,
            goodDataCount : response.data.goodrecords.length
        });

          var tableData = response.data.goodrecords.map((a, i)=>{
           
          return{
              "month"        : a.month        ? a.month    : '-',
              "year"        : a.year        ? a.year    : '-',
              "sectorName"        : a.sectorName        ? a.sectorName    : '-',
              "activityName"       : a.activityName        ? a.activityName    : '-',
              "subactivityName"      : a.subactivityName     ? a.subactivityName : '-',
              "unit"         : a.unit     ? a.unit : '-',
              "physicalUnit"   : a.physicalUnit     ? a.physicalUnit : '-',
              "unitCost"   : a.unitCost     ? a.unitCost : '-',
              "totalBudget"   : a.totalBudget     ? a.totalBudget : '-',
              "noOfBeneficiaries"      : a.noOfBeneficiaries     ? a.noOfBeneficiaries : '-',
              "noOfFamilies"   : a.noOfFamilies     ? a.noOfFamilies : '-',
              "LHWRF" : a.LHWRF ? a.LHWRF : '-',
              "NABARD" : a.NABARD ? a.NABARD : '-', 
              "bankLoan"   : a.bankLoan     ? a.bankLoan : '-', 
              "govtscheme"   : a.govtscheme     ? a.govtscheme : '-',
              "directCC"   : a.directCC     ? a.directCC : '-',
              "indirectCC"   : a.indirectCC     ? a.indirectCC : '-',
              "other"   : a.other     ? a.other : '-',
              "remark"   : a.remark     ? a.remark : '-'
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
            "sectorName"        : a.sectorName        ? a.sectorName    : '-',
            "activityName"       : a.activityName        ? a.activityName    : '-',
            "subactivityName"      : a.subactivityName     ? a.subactivityName : '-',
            "unit"         : a.unit     ? a.unit : '-',
            "physicalUnit"   : a.physicalUnit     ? a.physicalUnit : '-',
            "unitCost"   : a.unitCost     ? a.unitCost : '-',
            "noOfBeneficiaries"      : a.noOfBeneficiaries     ? a.noOfBeneficiaries : '-',
            "noOfFamilies"   : a.noOfFamilies     ? a.noOfFamilies : '-',
            "LHWRF" : a.LHWRF ? a.LHWRF : '-',
            "NABARD" : a.NABARD ? a.NABARD : '-', 
            "bankLoan"   : a.bankLoan     ? a.bankLoan : '-', 
            "govtscheme"   : a.govtscheme     ? a.govtscheme : '-',
            "directCC"   : a.directCC     ? a.directCC : '-',
            "indirectCC"   : a.indirectCC     ? a.indirectCC : '-',
            "other"   : a.other     ? a.other : '-',
            "remark"   : a.remark     ? a.remark : '-',
            "failedRemark"   : a.failedRemark     ? a.failedRemark : '-'
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
  render() {
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    // console.log("after edit", this.state.subActivityDetails);
    return ( 
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                          Plan Details                          
                      </div>
                      <hr className="hr-head container-fluid row"/>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">                    
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 boxHeight">
                      <label className="formLable">Plan</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                        <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.selectMonth.bind(this)} >
                          <option disabled={true}>-- Select Plan --</option>
                         {this.state.months.map((data,index) =>
                          <option key={index}  value={data} >{data}</option>
                          )}
                          
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.month}</div>
                    </div>
                    <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 zeroIndex boxHeight">
                       <label className="formLable">Year</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year }  onChange={this.handleChange.bind(this)} >
                          <option disabled={true}>-- Select Year --</option>
                         {
                          this.state.years.map((data, i)=>{
                            return <option key={i}>{data}</option>
                          })
                         }
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.year}</div>
                    </div>
                    <ul className="nav nav-pills col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3 col-sm-12 col-xs-12 mt">
                      <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualplan">Manual</a></li>
                      <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkplan">Bulk Upload</a></li>
                    </ul> 
                  </div> 
                  <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      <div id="manualplan"  className="tab-pane fade in active ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt"> 
                           <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-right">
                              <button type="button" className="btn addBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.toglehidden.bind(this)}>Add Plan</button>
                           </div> 
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                        <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt outerForm"  style={hidden}>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 NOpadding ">                
                              <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                                <label className="formLable">Sector</label><span className="asterix">*</span>
                                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorName" >
                                  <select className="custom-select form-control inputBox" ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.selectSector.bind(this)}>
                                    <option disabled={true} >-- Select --</option>
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
                                <div className="errorMsg">{this.state.errors.sectorName}</div>
                              </div>
                              <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                                <label className="formLable">Activity</label><span className="asterix">*</span>
                                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activityName" >
                                  <select className="custom-select form-control inputBox"ref="activityName" name="activityName" value={this.state.activityName} onChange={this.selectActivity.bind(this)} >
                                    <option  disabled={true} >-- Select --</option>
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
                                <div className="errorMsg">{this.state.errors.activityName}</div>
                              </div>                  
                            </div> 
                          <br/>  
                          <div>
                            {this.state.availableSubActivity ? <hr className=""/> :""}
                          </div>                     
                            {
                              this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                              this.state.availableSubActivity.map((data, index)=>{
                                if(data.subActivityName ){
                                  return(
                                    <div className="subActDiv"  key={data._id}>
                                          <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3 contentDiv  ">
                                            <label className="head" value={data.subActivityName+'|'+data._id} id={"subActivityName-"+data._id}>{data.subActivityName} </label><br/>
                                            <label className="formLable visibilityHidden">Unit :<span id={"unit-"+data._id}>{data.unit}</span></label>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 NOpadding">
                                            <div className="row">
                                              <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                                <label className="formLable head">Sub-Activity Details</label>
                                              </div>
                                            </div>
                                           
                                            <div className="row ">
                                              <div className="col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                                <label className="formLable">Physical Units</label>
                                                <div className="input-group inputBox-main " id={"physicalUnit-"+index} >
                                                  <input type="number" min="0" className="form-control inputBox nameParts" name={"physicalUnit-"+index} placeholder="" value={data.physicalUnit} onChange={this.handlesubactivityChange}/>
                                                  <span className="input-group-addon inputAddonforphysicalunit" title={data.unit}>{data.unit.length>8?data.unit.substr(0,5)+'...':data.unit}</span>
                                                </div>{/*{console.log("state",this.state)}*/}
                                              </div>
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                                <label className="formLable">Unit Cost</label>
                                                <div className=" input-group inputBox-main" id={"unitCost-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="text"  min="0" className="form-control inputBox nameParts" name={"unitCost-"+index} placeholder="" value={data.unitCost} onChange={this.handlesubactivityChange}/>
                                                </div>
                                              </div>  
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                                <label className="formLable">Total Cost</label>
                                                <div className="input-group inputBox-main" id={"totalBudget-"+index} >                                         
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox formLable " name={"totalBudget-"+index} disabled value={data.totalBudget}/>
                                                </div>
                                              </div>  
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                                <label className="formLable">No.of Beneficiaries</label>
                                                <div className=" input-group inputBox-main" id={"noOfBeneficiaries-"+index} >
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"noOfBeneficiaries-"+index} placeholder="" value={data.noOfBeneficiaries} onChange={this.handlesubactivityChange}/>                              
                                                </div>
                                              </div> 
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields ">
                                                <label className="formLable">No.of Families</label>
                                                <div className=" input-group inputBox-main" id={"noOfFamilies-"+index} >
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"noOfFamilies-"+index} placeholder="" value={data.noOfFamilies} onChange={this.handlesubactivityChange}/>                              
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields   ">
                                                <label className="formLable head">Sources of Fund</label>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">LHWRF</label>
                                                <div className=" input-group inputBox-main" id={"LHWRF-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"LHWRF-"+index} placeholder="" value={data.LHWRF} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"LHWRF")}/>
                                                </div>
                                              </div>
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">NABARD</label>
                                                <div className=" input-group inputBox-main" id={"NABARD-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"NABARD-"+index} placeholder="" value={data.NABARD} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"NABARD")}/>
                                                </div>
                                              </div>
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">Bank Loan</label>
                                                <div className=" input-group inputBox-main" id={"bankLoan-"+index}>
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"bankLoan-"+index} placeholder="" value={data.bankLoan} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"bankLoan")}/>
                                                </div>
                                              </div>
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">Govt. Schemes</label>
                                                <div className=" input-group inputBox-main" id={"govtscheme-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"govtscheme-"+index} placeholder="" value={data.govtscheme} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"govtscheme")}/>
                                                </div>
                                              </div>
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">Direct Com. Cont.</label>
                                                <div className=" input-group inputBox-main" id={"directCC-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"directCC-"+index} placeholder="" value={data.directCC} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"directCC")}/>
                                                </div>
                                              </div>
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">Indirect Com. Cont.</label>
                                                <div className=" input-group inputBox-main" id={"indirectCC-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"indirectCC-"+index} placeholder="" value={data.indirectCC} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"indirectCC")}/>
                                                </div>
                                              </div>
                                            </div>
                                            <div className=" row">
                                              <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                                <label className="formLable">Other</label>
                                                <div className=" input-group inputBox-main" id={"other-"+index} >
                                                  <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                                  <input type="number"  min="0" className="form-control inputBox nameParts" name={"other-"+index} placeholder="" value={data.other} onChange={this.handlesubactivityChange} onBlur={()=> this.remainTotal(index,"other")}/>
                                                </div>
                                              </div>
                                              <div className=" col-lg-10 col-md-10 col-sm-12 col-xs-12 planfields">
                                                <label className="formLable">Remark</label>
                                                <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id={"remark-"+index} >
                                                  <input type="text" className="form-control inputBox nameParts" name={"remark-"+index} placeholder="Remark" value={data.remark} onChange={this.handlesubactivityChange} />
                                                </div>
                                              </div>
                                            </div>  
                                            <div className="row">                            
                                              <div className=" col-lg-10 col-lg-offset-2 col-sm-12 col-xs-12  padmi3">
                                                <div className=" col-lg-12 col-md-6 col-sm-6 col-xs-12 padmi3 ">
                                                  <label className="formLable"></label>
                                                  <div className="errorMsg">{this.state.errors.remark}</div>
                                                </div>
                                              </div> 
                                            </div><br/>
                                          </div>  <br/>
                                    </div>
                                  );
                                }else{
                                  return <label>Please check either all sub Activity Details are submitted or you don't have sub activity for activity. </label>
                                }
                              })
                              : 
                              null
                            }                           
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                           <br/>{
                            this.state.editId ? 
                            <button className=" col-lg-2 btn submit pull-right" onClick={this.Update.bind(this)}> Update </button>
                            :
                            <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitAnnualPlan.bind(this)}> Submit </button>
                          }
                          </div>                        
                        </form>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  formLable " >
                          <div className="row">  
                           <IAssureTable 
                              tableName = "Plan Details"
                              id = "PlanDetails"
                              tableHeading={this.state.tableHeading}
                              twoLevelHeader={this.state.twoLevelHeader} 
                              dataCount={this.state.dataCount}
                              tableData={this.state.tableData}
                              getData={this.getData.bind(this)}
                              tableObjects={this.state.tableObjects}
                              getSearchText={this.getSearchText.bind(this)}
                            />
                          </div>
                        </div> 
                      </div>
                      <div id="bulkplan" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                          <BulkUpload url={this.state.month == "Annual Plan" ? "/api/annualPlans/bulk_upload_annual_plan" : "/api/monthlyPlans/bulk_upload_manual_plan"}  
                          data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID,"month":this.state.month,"year":this.state.year}} 
                          uploadedData={this.uploadedData} 
                          fileurl="https://lupiniassureit.s3.ap-south-1.amazonaws.com/Plan%2BSubmission.xlsx"
                          fileDetailUrl={this.state.month == "Annual Plan" ? this.state.annualFileDetailUrl : this.state.monthlyFileDetailUrl}
                          getFileDetails={this.getFileDetails}
                          fileDetails={this.state.fileDetails}
                          goodRecordsHeading ={this.state.goodRecordsHeading}
                          failedtableHeading={this.state.failedtableHeading}
                          failedRecordsTable ={this.state.failedRecordsTable}
                          failedRecordsCount={this.state.failedRecordsCount}
                          goodRecordsTable={this.state.goodRecordsTable}
                          goodDataCount={this.state.goodDataCount}/>
                        </div>
                      </div>
                  </div>
                 
                  <div className="AnnualHeadCont">
                    <div className="annualHead">
                    {
                      this.state.month==="--Quarter 1--"
                        ?
                          <h5>Quarterly Plan for April, May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                        :
                          <h5 defaultValue="Annual Plan">{this.state.month === "Annual Plan" ? "Annual Plan": "Monthly Plan" || this.state.month !== "Annual Plan" ? "Monthly Plan": "Annual Plan"}{ this.state.year !=="-- Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
                          // <h5>{this.state.month !== "Annually" ? "Monthly Plan "+ this.state.month : "Annual Plan " }{ this.state.year !=="-- Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
                      }
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
export default PlanDetails