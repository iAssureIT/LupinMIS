import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import validate               from 'jquery-validation';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import CreateBeneficiary      from "./CreateBeneficiary.js";
import "./Beneficiary.css";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";

class Beneficiary extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"            :"",
      "beneficiaryID"       :"",
      "nameofbeneficiaries" :"",
      "relation"            :"",
      "fields"              : {},
      "errors"              : {},
      "tableHeading"        : {
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        nameofbeneficiaries : "Name of Beneficiary",
        uidNumber           : "UID Number",
        relation            : "Relation with Family Head",
        actions             : 'Action',
      },
      "tableObjects"        : {
        apiLink             : '/api/beneficiaries/',
        editUrl             : '/beneficiary/',        
        paginationApply     : false,
        searchApply         : false,
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
    if(event.currentTarget.name==='familyID'){
      let id = $(event.currentTarget).find('option:selected').attr('data-id')
      axios.get('/api/families/'+id)
      .then((response)=>{
        // console.log('response',response)
        this.setState({"surnameOfBeneficiary":response.data[0].surnameOfFH})
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
    });
  
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
      // "nameofbeneficiaries"   : this.refs.nameofbeneficiaries.value,
      "uidNumber"                 : this.refs.uidNumber.value,
      "relation"                  : this.refs.relation.value,
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
      "relation"                 :"",   
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
      };

      let fields                    = {};
      fields["familyID"]            = "";
      fields["nameofbeneficiaries"] = "";      
      fields["uidNumber"]           = "";   
      fields["relation"]            = "";   
      fields["surnameOfBeneficiary"]      = "";
      fields["firstNameOfBeneficiary"]    = "";
      fields["middleNameOfBeneficiary"]   = "";
   
      console.log('beneficiaryValue', beneficiaryValue);
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
        "relation"                 :"",
        "surnameOfBeneficiary"     :"",   
        "firstNameOfBeneficiary"   :"",   
        "middleNameOfBeneficiary"  :"",   
        fields:fields
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
    console.log('mani ',nextProps.match.params.id);
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


        $("#createBeneficiary").validate({
          rules: {
            uidNumber: {
              // required: true,
              regxUIDNumber: /^[_0-9]*((-|\s)*[_0-9]){12}$|^$/,
            },
            familyID: {
              required: true,
            },
            surnameOfBeneficiary: {
              required: true,
            },
            firstNameOfBeneficiary: {
              required: true,
            },
            middleNameOfBeneficiary: {
              required: true,        
            },
            relation: {
              required: true,        
            },
          },
          errorPlacement: function(error, element) {
            if (element.attr("name") == "familyID"){
              error.insertAfter("#familyIDErr");
            }
            if (element.attr("name") == "surnameOfBeneficiary"){
              error.insertAfter("#surnameOfBeneficiaryErr");
            }
            if (element.attr("name") == "uidNumber"){
              error.insertAfter("#uidNumberErr");
            }
            if (element.attr("name") == "firstNameOfBeneficiary"){
              error.insertAfter("#firstNameOfBeneficiaryErr");
            }
            if (element.attr("name") == "middleNameOfBeneficiary"){
              error.insertAfter("#middleNameOfBeneficiaryErr");
            }
            if (element.attr("name") == "relation"){
              error.insertAfter("#relationErr");
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
      // console.log('editData',editData);
      
      this.setState({
        "beneficiaryID"            : editData.beneficiaryID,
        "familyID"                 : editData.familyID+"|"+editData.family_ID,          
        "surnameOfBeneficiary"     : editData.surnameOfBeneficiary,
        "firstNameOfBeneficiary"   : editData.firstNameOfBeneficiary,
        "middleNameOfBeneficiary"  : editData.middleNameOfBeneficiary,
        "uidNumber"                : editData.uidNumber,          
        "relation"                 : editData.relation,          
      });      
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
        "relation"                 : "",          
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
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
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

  getData(startRange, limitRange, center_ID){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    console.log(center_ID);
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
          }
        })
        this.setState({
          tableData : tableData
        },()=>{
          console.log("tableData",this.state.tableData)
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  getAvailableFamilyId(center_ID){
    axios({
      method: 'get',
      url: '/api/families/list/'+center_ID,
    }).then((response)=> {
    console.log("availableFamiliesresponse", response);
        
        this.setState({
          availableFamilies : response.data
        })
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  getFileDetails(fileName){
      axios
      .get(this.state.fileDetailUrl+fileName)
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
              nameofbeneficiaries : a.firstNameOfBeneficiary + " " + a.middleNameOfBeneficiary + " " + a.surnameOfBeneficiary ,
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
                  <ul className="nav nav-pills col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-12 col-xs-12">
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
                              <label className="formLable">Surname of Beneficiary </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="surnameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="surnameOfBeneficiary" name="surnameOfBeneficiary" value={this.state.surnameOfBeneficiary} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.surnameOfBeneficiary}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">First Name of Beneficiary </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="firstNameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="firstNameOfBeneficiary" name="firstNameOfBeneficiary" value={this.state.firstNameOfBeneficiary} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.firstNameOfBeneficiary}</div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">Middle Name of Beneficiary </label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="middleNameOfBeneficiaryErr" >
                                <input type="text" className="form-control inputBox" ref="middleNameOfBeneficiary" name="middleNameOfBeneficiary" value={this.state.middleNameOfBeneficiary} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.middleNameOfBeneficiary}</div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 valid_box ">
                              <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uidNumberErr" >
                                <input type="text" className="form-control inputBox "  placeholder=""ref="uidNumber" name="uidNumber" value={this.state.uidNumber} onKeyDown={this.isNumberKey.bind(this)}  maxLength = "12" onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.uidNumber}</div>
                            </div>
                            <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12  valid_box">
                              <label className="formLable">Relation with Family Head</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="relationErr" >
                                {/*<div className="input-group-addon inputIcon">
                                  <i className="fa fa-graduation-cap fa"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox"  placeholder="" value={this.state.relation} ref="relation" name="relation" onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.relation}</div>
                            </div>
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
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
                      </div>
                    </div>
                    <div id="bulkbenificiary" className="tab-pane fade in ">
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default Beneficiary
