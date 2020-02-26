import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import validate               from 'jquery-validation';
import DatePicker           from "react-datepicker";
// import YearPicker from "react-year-picker";
import Datetime from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import CreateBeneficiary      from "./CreateBeneficiary.js";
import "./Beneficiary.css";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";

class Beneficiary extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      // "relation"            :"-- Select --",
      "Check"                         :false,
      "relation"                      :"-- Select --",
      "familyID"                      :"",
      "beneficiaryID"                 :"",
      "uidNumberCheck"                :"",
      "firstNameOfBeneficiary"        :"",
      "middleNameOfBeneficiaryCheck"  :"",
      "firstNameOfBeneficiaryCheck"   :"",
      "middleNameOfBeneficiary"       :"",
      "surnameOfBeneficiary"          :"",
      "nameofbeneficiaries"           :"",
      "birthYearOfbeneficiary"        :"",
      "genderOfbeneficiary"           :"-- Select --",
      "fields"              : {},
      "errors"              : {},
      "tableHeading"        : {
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head",
        genderOfbeneficiary : "Gender",
        birthYearOfbeneficiary : "Birth Year",
        actions             : 'Action',
      },
      "tableObjects"        : {
        apiLink             : '/api/beneficiaries/',
        editUrl             : '/beneficiary/',        
        paginationApply     : false,
        downloadApply       : true,
        searchApply         : true,
      },
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fileDetailUrl         : "/api/beneficiaries/get/filedetails/",
      goodRecordsTable      : [],
      failedRecordsTable    : [],
      goodRecordsHeading :{
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head"
      },
      failedtableHeading :{
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head",
        failedRemark        : "Failed Data Remark"
      }
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
  }

  handleChange(event){
    event.preventDefault();
    // console.log(event);
    if(event.currentTarget.name==='familyID'){
      let id = $(event.currentTarget).find('option:selected').attr('data-id')
      // $(".fullpageloader").show();
      axios.get('/api/families/'+id)
      .then((response)=>{
        // console.log('response families',response)
        this.setState({
          "surnameOfBeneficiary"          :response.data[0].surnameOfFH,
          "firstNameOfBeneficiaryCheck"   :response.data[0].firstNameOfFH,
          "uidNumberCheck"                :response.data[0].uidNumber,
          "middleNameOfBeneficiaryCheck"  :response.data[0].middleNameOfFH,
          "firstNameOfBeneficiary"    : "",
          "middleNameOfBeneficiary"   : "",
          "uidNumber"                 :"",
          "relation"                  : "-- Select --",
        })
        // $(".fullpageloader").hide();

      })
      .catch(function(error){ 
        console.log("error = ",error);
      });
    }
    this.setState({
      "familyID"                  : this.refs.familyID.value,          
      "surnameOfBeneficiary"      : this.refs.surnameOfBeneficiary.value,
      "firstNameOfBeneficiary"    : this.refs.firstNameOfBeneficiary.value,
      "middleNameOfBeneficiary"   : this.refs.middleNameOfBeneficiary.value,
      "uidNumber"                 : this.refs.uidNumber.value,
      "relation"                  : this.refs.relation.value,
      "genderOfbeneficiary"       : this.refs.genderOfbeneficiary.value,
    });
  /*    if(this.refs.firstNameOfBeneficiary.value === this.state.firstNameOfBeneficiaryCheck )
    {
       
      var uidNumber = this.state.uidNumberCheck;
      var middleNameOfBeneficiaryCheck = this.state.middleNameOfBeneficiaryCheck;
      this.setState({
          uidNumber : uidNumber,
          relation  : "Self",
          middleNameOfBeneficiary : middleNameOfBeneficiaryCheck,
          Check     : false,
      })
          
    }
    else{
      this.setState({
          uidNumber : "",
          relation  : "-- Select --",
          middleNameOfBeneficiary : "",
          Check     : false,
      })

    }*/
  } 

  SubmitBeneficiary(event){
    event.preventDefault();
    var id2 = this.state.uidNumber;
    if($('#createBeneficiary').valid()){
    // if (this.validateFormReq() && this.validateForm()){
    var beneficiaryValue= 
    {
      "center_ID"                 : this.state.center_ID,
      "center"                    : this.state.centerName,
      "family_ID"                 : this.refs.familyID.value.split('|')[1],          
      "familyID"                  : this.refs.familyID.value.split('|')[0],             
      "surnameOfBeneficiary"      : this.refs.surnameOfBeneficiary.value,
      "firstNameOfBeneficiary"    : this.refs.firstNameOfBeneficiary.value,
      "middleNameOfBeneficiary"   : this.refs.middleNameOfBeneficiary.value,     
      "uidNumber"                 : this.refs.uidNumber.value,
      "relation"                  : this.refs.relation.value,
      "birthYearOfbeneficiary"    : this.state.birthYearOfbeneficiary,
      "genderOfbeneficiary"       : this.refs.genderOfbeneficiary.value,
    };
    // let fields                          = {};
    // fields["familyID"]                  = "";
    // fields["beneficiaryID"]             = "";
    // fields["uidNumber"]                 = "";
    // fields["relation"]                  = "";
    // fields["surnameOfBeneficiary"]      = "";
    // fields["firstNameOfBeneficiary"]    = "";
    // fields["middleNameOfBeneficiary"]   = "";

    this.setState({
      "familyID"                 :"",
      "beneficiaryID"            :"",
      "surnameOfBeneficiary"     :"",   
      "firstNameOfBeneficiary"   :"",   
      "middleNameOfBeneficiary"  :"",   
      "uidNumber"                :"",   
      "relation"                 :"-- Select --",
      "genderOfbeneficiary"      :"-- Select --",
      "date"                     :"",   
      "birthYearOfbeneficiary"   :"",   
      // fields:fields
    });
    axios.post('/api/beneficiaries',beneficiaryValue)
      .then((response)=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
        swal({
          title : response.data.message,
          text  : response.data.message,
        });
      })
      .catch((error)=>{
        console.log("error = ",error);
      });
    }
  }
  uploadedData(data){
    this.getData(this.state.startRange,this.state.limitRange,this.state.center_ID)
  }
  Update(event){
    event.preventDefault();
      /*if(this.refs.familyID.value === "" ||  this.refs.relation.value===""
        || this.refs.surnameOfBeneficiary.value===""|| this.refs.firstNameOfBeneficiary.value===""|| this.refs.middleNameOfBeneficiary.value==="")
      {
        if (this.validateFormReq() && this.validateForm()){
        }
      }else{*/
    if($('#createBeneficiary').valid()){
      var beneficiaryValue= 
      {
        "center_ID"             : this.state.center_ID,
        "center"                : this.state.centerName,
        "beneficiary_ID"        : this.state.editId,          
        "beneficiaryID"         : this.state.beneficiaryID,          
        "family_ID"             : this.refs.familyID.value.split('|')[1],          
        "familyID"              : this.refs.familyID.value.split('|')[0],           
        "surnameOfBeneficiary"      : this.refs.surnameOfBeneficiary.value,
        "firstNameOfBeneficiary"    : this.refs.firstNameOfBeneficiary.value,
        "middleNameOfBeneficiary"   : this.refs.middleNameOfBeneficiary.value,          
        "uidNumber"                 : this.refs.uidNumber.value,
        "relation"                  : this.refs.relation.value,
        "birthYearOfbeneficiary"    : this.state.birthYearOfbeneficiary,
        "genderOfbeneficiary"       : this.refs.genderOfbeneficiary.value,
      };
      // console.log('beneficiaryValue', beneficiaryValue);
      axios.patch('/api/beneficiaries/update',beneficiaryValue)
        .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
          swal({
            title : response.data.message,
            text  : response.data.message,
          });
          
        })
        .catch((error)=>{
          console.log("error = ",error);
        });
      this.setState({
        "familyID"                 :"",
        "nameofbeneficiaries"      :"",   
        "uidNumber"                :"",
        "surnameOfBeneficiary"     :"",   
        "firstNameOfBeneficiary"   :"",   
        "middleNameOfBeneficiary"  :"",   
        "date"                     :"",   
        "birthYearOfbeneficiary"   :"",   
        "relation"                 :"-- Select --",
        "genderOfbeneficiary"      :"-- Select --",   
      });
      this.props.history.push('/beneficiary');
      this.setState({
        "editId"              : "",
      });
    }
  }
  // validateFormReq() {
  //   let fields = this.state.fields;
  //   let errors = {};
  //   let formIsValid = true;
  //   $("html,body").scrollTop(0);
  //     if (!fields["familyID"]) {
  //       formIsValid = false;
  //       errors["familyID"] = "This field is required.";
  //     }     
  //      if (!fields["surnameOfBeneficiary"]) {
  //       formIsValid = false;
  //       errors["surnameOfBeneficiary"] = "This field is required.";
  //     }        
  //      if (!fields["firstNameOfBeneficiary"]) {
  //       formIsValid = false;
  //       errors["firstNameOfBeneficiary"] = "This field is required.";
  //     }        
  //      if (!fields["middleNameOfBeneficiary"]) {
  //       formIsValid = false;
  //       errors["middleNameOfBeneficiary"] = "This field is required.";
  //     }       
  //      if (!fields["relation"]) {
  //       formIsValid = false;
  //       errors["relation"] = "This field is required.";
  //     }     
  //     this.setState({
  //       errors: errors
  //     });
  //     return formIsValid;
  // }

  // validateForm() {
  //   let fields = this.state.fields;
  //   let errors = {};
  //   let formIsValid = true;
  //   $("html,body").scrollTop(0);
   
    

  //     this.setState({
  //       errors: errors
  //     });
  //     return formIsValid;
  // }

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    // console.log('mani ',nextProps.match.params.id);
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
    }
   
    if(nextProps){
      this.getLength();
    }  
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    // console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }

    this.getLength();
    // this.getData();
    this.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableFamilyId();
    const center_ID = localStorage.getItem("center_ID");
    // const token = localStorage.getItem("token");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
     this.getLength(this.state.center_ID);
    // this.getData();
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    this.getAvailableFamilyId(this.state.center_ID);
    });    
 
    $.validator.addMethod("regxUIDNumber", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Aadhar Number.");
    $.validator.addMethod("regxsurnameOfBeneficiary", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Surname.");
    $.validator.addMethod("regxfirstNameOfBeneficiary", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid First Name.");
    // $.validator.addMethod("regxmiddleNameOfBeneficiary", function(value, element, regexpr) {         
    //   return regexpr.test(value);
    // }, "Please enter valid Middle Name.");

        $("#createBeneficiary").validate({
          rules: {
            uidNumber: {
              // required: true,
              regxUIDNumber: /^[_0-9]*((-|\s)*[_0-9]){12}$|^$/,
            },
            familyID: {
              required: true,
            },
            relation: {
              required: true,
            },
            surnameOfBeneficiary: {
              required: true,
              regxsurnameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,
            },
            firstNameOfBeneficiary: {
              required: true,
              regxfirstNameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,
            },
            middleNameOfBeneficiary: {
              // required: true,
               // regxmiddleNameOfBeneficiary: /^( [a-zA-Z ])*$/,
               // regxmiddleNameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,   
            },
          },
          errorPlacement: function(error, element) {
            if (element.attr("name") === "familyID"){
              error.insertAfter("#familyIDErr");
            }
            if (element.attr("name") === "relation"){
              error.insertAfter("#relationErr");
            }
            if (element.attr("name") === "surnameOfBeneficiary"){
              error.insertAfter("#surnameOfBeneficiaryErr");
            }
            if (element.attr("name") === "uidNumber"){
              error.insertAfter("#uidNumberErr");
            }
            if (element.attr("name") === "firstNameOfBeneficiary"){
              error.insertAfter("#firstNameOfBeneficiaryErr");
            }
            if (element.attr("name") === "middleNameOfBeneficiary"){
              error.insertAfter("#middleNameOfBeneficiaryErr");
            }
          }
        });
  }

  edit(id){
    if(id && id != undefined){
      axios({
      method: 'get',
      url: '/api/beneficiaries/'+id,
    })
    .then((response)=> {
      var editData = response.data[0];
      console.log('editData',response);
      if(editData){
        this.setState({
          "beneficiaryID"            : editData.beneficiaryID,
          "familyID"                 : editData.familyID+"|"+editData.family_ID,          
          "surnameOfBeneficiary"     : editData.surnameOfBeneficiary,
          "firstNameOfBeneficiary"   : editData.firstNameOfBeneficiary,
          "middleNameOfBeneficiary"  : editData.middleNameOfBeneficiary,
          "uidNumber"                : editData.uidNumber,          
          "relation"                 : editData.relation,          
          "date"                     : editData.birthYearOfbeneficiary,          
          "genderOfbeneficiary"      : editData.genderOfbeneficiary,          
        },()=>{
          console.log('edit===',this.state.birthYearOfbeneficiary);
        });      
      }
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    })
    .catch(function (error) {
      console.log("error = ",error);
    });
    }else{
      this.setState({
        "beneficiaryID"            : "",
        "familyID"                 : "",          
        "surnameOfBeneficiary"     : "",
        "firstNameOfBeneficiary"   : "",
        "middleNameOfBeneficiary"  : "",
        "uidNumber"                : "",      
        "relation"                 :"-- Select --",
        "genderOfbeneficiary"      :"-- Select --",       
        "date"                     :"",   
        "birthYearOfbeneficiary"   :"",   
      });     
    }
    
  }
  
  getLength(center_ID){
    axios.get('/api/beneficiaries/count/'+center_ID)
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });
  }

  getData(startRange, limitRange, center_ID){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    // console.log(center_ID);
    // var centerID = this.state.center_ID;
    if (center_ID){
      axios.post('/api/beneficiaries/list/'+center_ID,data)
        // console.log('/api/beneficiaries/get/beneficiary/list/'+centerID+"/all/all/all",this.state.center_ID);
      // axios.get('/api/beneficiaries/get/beneficiary/list/'+centerID+"/all/all/all")
      .then((response)=>{
        console.log('response', response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                       : a._id,
            beneficiaryID             : a.beneficiaryID,
            familyID                  : a.familyID,
            nameofbeneficiaries       : a.nameofbeneficiaries,
            uidNumber                 : a.uidNumber,
            relation                  : a.relation,
            genderOfbeneficiary       : a.genderOfbeneficiary,   
            birthYearOfbeneficiary    : a.birthYearOfbeneficiary,   
          }
        })
        this.setState({
          tableData : tableData
        },()=>{
          // console.log("tableData",this.state.tableData)
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  getAvailableFamilyId(center_ID){
    if(center_ID){
      axios({
        method: 'get',
        url: '/api/families/list/'+center_ID,
      }).then((response)=> {
      // console.log("availableFamiliesresponse", response);
          this.setState({
            availableFamilies : response.data
          })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  getFileDetails(fileName){
      axios
      .get(this.state.fileDetailUrl+this.state.center_ID+"/"+fileName)
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
              "beneficiaryID"  : a.beneficiaryID        ? a.beneficiaryID    : '-',
              "familyID"       : a.familyID        ? a.familyID    : '-',
              "uidNumber"      : a.uidNumber     ? a.uidNumber : '-',
              "nameofbeneficiaries" : a.firstNameOfBeneficiary + " " + a.middleNameOfBeneficiary + " " + a.surnameOfBeneficiary ,
              "relation"       : a.relation     ? a.relation : '-',
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
            "beneficiaryID"  : a.beneficiaryID        ? a.beneficiaryID    : '-',
            "familyID"       : a.familyID        ? a.familyID    : '-',
            "uidNumber"      : a.uidNumber     ? a.uidNumber : '-',
            "nameofbeneficiaries" : a.firstNameOfBeneficiary + " " + a.middleNameOfBeneficiary + " " + a.surnameOfBeneficiary ,
            "relation"       : a.relation     ? a.relation : '-',
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
  getSearchText(searchText){
    var searchText = searchText;
    // console.log('searchText',searchText)
    var formValues ={
      searchText : searchText,
    }
    if(searchText) {
      axios
      .post('/api/beneficiaries/searchValue/'+this.state.center_ID, formValues)
      .then(
        (res)=>{
          // console.log('res', res);
          if(res.data.data&&res.data.data.length>0){
            var tableData = res.data.data.map((a, i)=>{
              return {
                _id                       : a._id,
                beneficiaryID             : a.beneficiaryID,
                familyID                  : a.familyID,
                nameofbeneficiaries       : a.surnameOfBeneficiary+" "+a.firstNameOfBeneficiary+" " +a.middleNameOfBeneficiary,
                uidNumber                 : a.uidNumber,
                relation                  : a.relation,
                genderOfbeneficiary       : a.genderOfbeneficiary,   
                birthYearOfbeneficiary    : a.birthYearOfbeneficiary,
              }
            })
          }
        this.setState({
          tableData     : tableData,          
        })
      }).catch((error)=>{ 
        console.log('error',error)
        // swal("No results found","","error");
        this.setState({
          tableData     : [],          
        })
      });
    }
  }
  getUID(event)
  {
  /*  if(this.state.firstNameOfBeneficiary === this.state.firstNameOfBeneficiaryCheck )
    {
       
      var uidNumber = this.state.uidNumberCheck;
      var middleNameOfBeneficiaryCheck = this.state.middleNameOfBeneficiaryCheck;
      this.setState({
          uidNumber : uidNumber,
          relation  : "Self",
          middleNameOfBeneficiary : middleNameOfBeneficiaryCheck,
          Check     : false,
      })
          
    }

    else if(this.refs.firstNameOfBeneficiary.value == ""){
      this.setState({
          uidNumber : "",
          relation  : "-- Select --",
          middleNameOfBeneficiary : "",
          Check     : false,
      })

    }*/
  }
  handleYear(date){
      this.setState({
        birthYearOfbeneficiary    : date.year(),
        date    : date,
      },()=>{
      });
    };
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Beneficiary Management                                       
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <ul className="nav tabNav nav-pills col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-12 col-xs-12">
                    <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualbenificiary">Manual</a></li>
                    <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkbenificiary">Bulk Upload</a></li>
                  </ul> 
                  <div className="tab-content ">
                    <div id="manualbenificiary"  className="tab-pane fade in active ">
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="createBeneficiary">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                           <h4 className="pageSubHeader">Create New Beneficiary</h4>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                          <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box">
                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Family ID</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="familyIDErr" >
                                <select className="custom-select form-control inputBox" value={this.state.familyID} ref="familyID" name="familyID" onChange={this.handleChange.bind(this)} >
                                  <option value="" className="hidden" >-- Select --</option>
                                  {
                                    this.state.availableFamilies && this.state.availableFamilies.length>0 ? this.state.availableFamilies.map((data, index)=>{
                                    // console.log(data)
                                      return(
                                        <option key={data._id} value={data.familyID+'|'+data._id} data-id={data._id}>{data.familyID}</option>
                                        );
                                    }) 
                                    : 
                                    null                            
                                  }
                                </select>
                              </div>
                            </div>
                           {/* <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Beneficiary ID</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="beneficiaryID" >
                                <input type="text" className="form-control inputBox"  placeholder=""value={this.state.beneficiaryID} ref="beneficiaryID" name="beneficiaryID" onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.beneficiaryID}</div>
                            </div>*/}
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Surname  </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="surnameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="surnameOfBeneficiary" name="surnameOfBeneficiary" value={this.state.surnameOfBeneficiary}  onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">First Name  </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="firstNameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="firstNameOfBeneficiary" name="firstNameOfBeneficiary" value={this.state.firstNameOfBeneficiary} onBlur={this.getUID.bind(this)}  onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Middle Name  </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="middleNameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="middleNameOfBeneficiary" name="middleNameOfBeneficiary" value={this.state.middleNameOfBeneficiary}    onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uidNumberErr" >
                                <input type="number" className="form-control inputBox "  placeholder=""ref="uidNumber" name="uidNumber" value={this.state.uidNumber} maxLength = "12" onChange={this.handleChange.bind(this)} />
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Relation with Family Head</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="relationErr" >
                                <select className="custom-select form-control inputBox" ref="relation" name="relation" value={this.state.relation} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' disabled="disabled" >-- Select --</option>
                                  <option>Self</option>
                                  <option>Wife</option>
                                  <option>Husband</option>
                                  <option>Son</option>
                                  <option>Daughter</option>
                                  <option>Father</option>
                                  <option>Mother</option>
                                  <option>Brother</option>
                                  <option>Sister</option>
                                  <option>Daughter-in-Law</option>
                                  <option>Son-in-Law</option>
                                  <option>Grandson</option>
                                  <option>Granddaughter</option>
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Gender</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="genderOfbeneficiaryErr" >
                                <select className="custom-select form-control inputBox" ref="genderOfbeneficiary" name="genderOfbeneficiary" value={this.state.genderOfbeneficiary} onChange={this.handleChange.bind(this)}  >
                                  <option selected='true' disabled="disabled" >-- Select --</option>
                                  <option>Female</option>
                                  <option>Male</option>
                                  <option>Transgender</option>
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Birth Year</label>
                              <div className="">
                                {console.log('birthYearOfbeneficiary',this.state.birthYearOfbeneficiary)}
                                <Datetime 
                                  dateFormat="YYYY"
                                  name="birthYearOfbeneficiary" 
                                  id="birthYearOfbeneficiaryErr"
                                  value={this.state.date}
                                  closeOnSelect={true}
                                  onChange={this.handleYear.bind(this)} 
                                  className="inputBox-main" 
                                />
                              </div>
                            </div>

                            {/*<div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Birth Year</label>
                              <div className="inputBox-main">
                              {console.log('birthYearOfbeneficiary',this.state.birthYearOfbeneficiary)}
                              <YearPicker 
                                name="birthYearOfbeneficiary" 
                                id="birthYearOfbeneficiaryErr"
                                defaultValue={this.state.birthYearOfbeneficiary}
                                onChange={this.handleYear.bind(this)} 
                                className=""
                               />
                            </div>
                            </div>*/}

                          </div> 
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                          {
                            this.state.editId ? 
                            <button className=" col-lg-2 btn submit pull-right" onClick={this.Update.bind(this)}> Update </button>
                            :
                            <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Submit </button>
                          }
                        </div> 
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                        <IAssureTable 
                          tableName = "Beneficiary"
                          id = "Beneficiary"
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
                    <div  id="bulkbenificiary" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                        <BulkUpload url="/api/beneficiaries/bulk_upload_beneficiary" 
                        data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID}}
                        uploadedData={this.uploadedData} 
                        fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Create+Beneficiaries.xlsx"
                        fileDetailUrl={this.state.fileDetailUrl}
                        getFileDetails={this.getFileDetails}
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
                                
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default Beneficiary
