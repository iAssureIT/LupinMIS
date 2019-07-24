import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';

import IAssureTable           from "./IAssureTable.jsx";
// import "./Activity.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class NewBeneficiary extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      "familyID"            :"",
      "beneficiaryID"       :"",
      "nameofbeneficiaries" :"",
      "fields"              : {},
      "errors"              : {},
      "uID"                 :"",
      "shown"               : true,
      "twoLevelHeader"      : {
        apply               : false,
        firstHeaderData       : [
                                {
                                    heading : '',
                                    mergedColoums : 10
                                },
                                {
                                    heading : 'Source of Fund',
                                    mergedColoums : 7
                                },
                              ]
      },
      "tableHeading"        : {
        familyID            : "Family ID",
        beneficiaryID       : "Beneficiary ID",
        nameofbeneficiaries : "Name of Beneficiary",
        // actions             : 'Action',
      },
      shown                 : true,
      fields: {},
      errors: {},
      " tableObjects"       : {
        apiLink             : '/api/activityReport/',
        editUrl             : '/activity/'
      },
      // selectedBeneficiaries : [],
      "startRange"          : 0,
      "limitRange"          : 10,
      // "editId"             : this.props.match.params ? this.props.match.params.id : '',
      fields: {},
      errors: {},    
    }
  }
  
  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"              : this.refs.familyID.value,          
      "beneficiaryID"         : this.refs.beneficiaryID.value,          
      "nameofbeneficiaries"   : this.refs.nameofbeneficiaries.value,
    });
    let fields                = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors                = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
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

  SubmitBeneficiary(event){
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()){
      var beneficiaryValue= 
      {
        "family_ID"             : this.refs.familyID.value.split('|')[1],          
        "familyID"              : this.refs.familyID.value.split('|')[0],          
        "beneficiaryID"         : this.refs.beneficiaryID.value,          
        "nameofbeneficiaries"   : this.refs.nameofbeneficiaries.value,
      };
      let fields                    = {};
      fields["familyID"]            = "";
      fields["beneficiaryID"]       = "";
      fields["nameofbeneficiaries"] = "";

      this.setState({
        "familyID"                 :"",
        "beneficiaryID"            :"",
        "nameofbeneficiaries"      :"",   
        fields:fields
      });
      axios.post('/api/beneficiaries',beneficiaryValue)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
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
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
      if (!fields["familyID"]) {
        formIsValid = false;
        errors["familyID"] = "This field is required.";
      }     
       if (!fields["beneficiaryID"]) {
        formIsValid = false;
        errors["beneficiaryID"] = "This field is required.";
      }     
       if (!fields["nameofbeneficiaries"]) {
        formIsValid = false;
        errors["nameofbeneficiaries"] = "This field is required.";
      }     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
    if (typeof fields["beneficiaryID"] !== "undefined") {
      // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
      if (!fields["beneficiaryID"].match(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$|^$/)) {
        formIsValid = false;
        errors["beneficiaryID"] = "Please enter valid Beneficiary ID.";
      }
    }
    if (typeof fields["nameofbeneficiaries"] !== "undefined") {
      // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
      if (!fields["nameofbeneficiaries"].match(/^[_A-z]*((-|\s)*[_A-z])*$|^$/)) {
        formIsValid = false;
        errors["nameofbeneficiaries"] = "Please enter valid Name.";
      }
    }

      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  componentDidMount() {
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getAvailableFamilyId();
    this.getData(this.state.startRange, this.state.limitRange);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps){
      this.setState({
        selectedValues : nextProps.selectedValues,
        sendBeneficiary: nextProps.sendBeneficiary,
        // selectedBeneficiaries: nextProps.sendBeneficiary
      })
    }
  }
  getData(startRange, limitRange){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.get('/api/beneficiaries/list',data)
    .then((response)=>{
      
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
  }

  toglehidden(){
   this.setState({
     shown: !this.state.shown
    });
  }
  addBeneficiary(selectedBeneficiaries){
    this.setState({
      selectedBeneficiaries : selectedBeneficiaries
    })
  }
  addBeneficiaries(event){
    event.preventDefault();
    this.props.listofBeneficiaries(this.state.selectedBeneficiaries);
  }

  getAvailableFamilyId(){
    axios({
      method: 'get',
      url: '/api/families/list',
    }).then((response)=> {
        
        this.setState({
          availableFamilies : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
    console.log("availableFamilies", this.state.availableFamilies)
  }

  render() {
     var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
          <div className="">
            <h4 className="pageSubHeader col-lg-6 col-sm-6 col-xs-6 noPadding">List of Beneficiaries</h4>
            <div className="col-lg-1 col-lg-offset-5 col-md-4 col-sm-6 col-xs-6 text-center addform" data-toggle="modal" data-target="#myModal">
            Add
            </div>
           {/* <div className="addContainerAct col-lg-6 pull-right mr30" data-toggle="modal" data-target="#myModal">
               <i className="fa fa-plus" aria-hidden="true"></i>
            </div>*/}
            <div className="modal fade in " id="myModal" role="dialog">
              <div className="modal-dialog modal-lg " >
                <div className="modal-content ">
                  <div className=" ">
                    <div className="col-lg-12  col-md-10 pageContent margTop">
                      <button type="button" className="close" data-dismiss="modal"> <i className="fa fa-times"></i></button>
                        <div className="col-lg-12 ">
                          <h4 className="pageSubHeader">Add Beneficiary</h4>
                        </div>
                        <div className="row"> 
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                            <div className=" col-lg-3  col-lg-offset-1 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">District</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Pune</option>
                                  <option>Thane</option>
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Block</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Pimpari</option>
                                  <option>Haveli</option>
                                  <option>Chinchwad</option>
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Village</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Shivne</option>
                                  <option>Hadapsar</option>
                                  <option>Manjari</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight row">
                            <div className=" col-lg-6 col-sm-12 col-xs-12 col-lg-offset-3 formLable boxHeightother ">
                              <label className="formLable">Search</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                             <div className=" col-lg-2 col-md-1 col-sm-1 col-xs-1  boxHeightother">
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt23" >
                                <div className="text-center addform" id="click_advance"  onClick={this.toglehidden.bind(this)}>
                                  Create 
                                </div>
                                {/*<div className="addContainerAct col-lg-6 pull-right" id="click_advance"  onClick={this.toglehidden.bind(this)}><div className="display_advance" id="display_advance"><i className="fa fa-plus" aria-hidden="true" id="click"></i></div>
                                </div>*/}
                              </div>
                            </div>
                          </div> 
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight boxHeightother" style={hidden}>
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Family ID </label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="familyID" >
                                <select className="custom-select form-control inputBox" ref="familyID" name="familyID"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  {
                                    this.state.availableFamilies ? this.state.availableFamilies.map((data, index)=>{
                                      return(
                                        <option key={data._id} value={data.familyID+'|'+data._id}>{data.familyID}</option>
                                        );
                                    }) 
                                    : 
                                    null                            
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.familyID}</div>
                            </div>
                            <div className=" col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Beneficiary ID</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="beneficiaryID" >
                                {/*<div className="input-group-addon inputIcon">
                                  <i className="fa fa-graduation-cap fa"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox"  placeholder=""value={this.state.beneficiaryID} ref="beneficiaryID" name="beneficiaryID" onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.beneficiaryID}</div>
                            </div>
                            <div className=" col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Name of Beneficiary</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="nameofbeneficiaries" >
                                {/*<div className="input-group-addon inputIcon">
                                  <i className="fa fa-graduation-cap fa"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox"  placeholder="" value={this.state.nameofbeneficiaries} ref="nameofbeneficiaries" name="nameofbeneficiaries" onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)} />
                              </div>
                              <div className="errorMsg">{this.state.errors.nameofbeneficiaries}</div>
                            </div>    
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt23">
                              <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Submit </button>
                            </div>                      
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                            <div className="">  
                              <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                tableObjects={this.state.tableObjects}
                                getBeneficiaries={this.addBeneficiary.bind(this)}    
                                selectedValues = {this.state.selectedValues}  
                                sendBeneficiary={this.state.sendBeneficiary}
                              />
                            </div>
                          </div> 
                        </div>
                        <div className="col-lg-12">
                            <br/><button className=" col-lg-2 btn submit pull-right" data-dismiss="modal" onClick={this.addBeneficiaries.bind(this)}> Add</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default NewBeneficiary