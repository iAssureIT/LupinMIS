import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./Beneficiary.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Beneficiary extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"            :"",
      "beneficiaryID"       :"",
      "nameofbeneficiaries" :"",
      "fields"              : {},
      "errors"              : {},
      "tableHeading"        : {
        familyID            : "Family ID",
        beneficiaryID       : "Beneficiary ID",
        nameofbeneficiaries : "Name of Beneficiary",
        actions             : 'Action',
      },
      "tableObjects"        : {
        apiLink             : '/api/beneficiaries/',
        editUrl             : '/beneficiary/',
      },
      "startRange"          : 0,
      "limitRange"          : 10,
      "editId"              : this.props.match.params ? this.props.match.params.id : ''
    }
    console.log('params', this.props.match.params);
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
    var beneficaryArray=[];
    var id2 = this.state.uID;
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

  Update(event){
    event.preventDefault();
      if(this.refs.familyID.value == "" || this.refs.beneficiaryID.value =="" || this.refs.nameofbeneficiaries.value=="")
      {
        if (this.validateFormReq() && this.validateForm()){
        }
      }else{
     
      var beneficiaryValue= 
      {
        "beneficiary_ID"        : this.state.editId,          
        "family_ID"             : this.refs.familyID.value.split('|')[1],          
        "familyID"              : this.refs.familyID.value.split('|')[0],          
        "beneficiaryID"         : this.refs.beneficiaryID.value,          
        "nameofbeneficiaries"   : this.refs.nameofbeneficiaries.value,
      };

      let fields                    = {};
      fields["familyID"]            = "";
      fields["beneficiaryID"]       = "";
      fields["nameofbeneficiaries"] = "";      
      console.log('beneficiaryValue', beneficiaryValue);
      axios.patch('/api/beneficiaries/update',beneficiaryValue)
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
      this.setState({
        "familyID"                 :"",
        "beneficiaryID"            :"",
        "nameofbeneficiaries"      :"",   
        fields:fields
      });
      this.props.history.push('/beneficiary');
      this.setState({
        "editId"              : "",
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

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
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
    // console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableFamilyId();
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/beneficiaries/'+id,
    })
    .then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      
      this.setState({
        "familyID"              : editData.familyID+"|"+editData.family_ID,          
        "beneficiaryID"         : editData.beneficiaryID,          
        "nameofbeneficiaries"   : editData.nameofbeneficiaries,
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
    });
  }
  
  getLength(){
    axios.get('/api/beneficiaries/count')
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
  getData(startRange, limitRange){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.post('/api/beneficiaries/list',data)
    .then((response)=>{
      console.log('response', response.data);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){

    });
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
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Create New Beneficiary</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="familyID" >
                            <select className="custom-select form-control inputBox" value={this.state.familyID} ref="familyID" name="familyID" onChange={this.handleChange.bind(this)} >
                              <option value="" className="hidden" >-- Select --</option>
                             {/* <option value={"PL00001"+"|"+"id"}>PL00001</option>
                              <option value={"PL00002"+"|"+"id"}>PL00002</option>
                              <option value={"PL00003"+"|"+"id"}>PL00003</option>
                              <option value={"PL00004"+"|"+"id"}>PL00004</option>
                              <option value={"PL00005"+"|"+"id"}>PL00005</option>*/}
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
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
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
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default Beneficiary