import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./Beneficiary.css";

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
      "editId"              : props.editId ? props.editId : ''
    }
    // console.log('params', this.props.match.params);
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
    let fields                = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
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
      this.props.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
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
      console.log('beneficiaryValue', beneficiaryValue);
      axios.patch('/api/beneficiaries/update',beneficiaryValue)
        .then((response)=>{
        this.props.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
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
      });
      this.props.history.push('/beneficiary');
      this.setState({
        "editId"              : "",
      });
    }
  }
  componentWillReceiveProps(nextProps){
    var editId = this.props.editId;
    if(nextProps.editId){
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
    // this.props.getData();
    this.props.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableFamilyId();
    const center_ID = localStorage.getItem("center_ID");
    // const token = localStorage.getItem("token");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    console.log("center_ID =",this.state.center_ID);
     this.getLength(this.state.center_ID);
    this.props.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    this.getAvailableFamilyId(this.state.center_ID);
    });   

    $.validator.addMethod("regxUIDNumber", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Aadhar Number.");
    // $.validator.addMethod("regxsurnameOfBeneficiary", function(value, element, regexpr) {         
    //   return regexpr.test(value);
    // }, "Please enter valid Surname.");
    // $.validator.addMethod("regxfirstNameOfBeneficiary", function(value, element, regexpr) {         
    //   return regexpr.test(value);
    // }, "Please enter valid First Name.");
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
              // regxsurnameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,
            },
            firstNameOfBeneficiary: {
              required: true,
              // regxfirstNameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,
            },
            middleNameOfBeneficiary: {
              // required: true,
              // regxmiddleNameOfBeneficiary:/^[A-za-z']+( [A-Za-z']+)*$/,   
            },
          },
          errorPlacement: function(error, element) {
            if (element.attr("name") == "familyID"){
              error.insertAfter("#familyIDErr");
            }
            if (element.attr("name") == "relation"){
              error.insertAfter("#relationErr");
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
          }
        }); 
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

  // getData(startRange, limitRange, center_ID){
  //   var data = {
  //     limitRange : limitRange,
  //     startRange : startRange,
  //   }
  //   console.log(center_ID);
  //   // var centerID = this.state.center_ID;
  //   if (center_ID){
  //     axios.post('/api/beneficiaries/list/'+center_ID,data)
  //       // console.log('/api/beneficiaries/get/beneficiary/list/'+centerID+"/all/all/all",this.state.center_ID);
  //     // axios.get('/api/beneficiaries/get/beneficiary/list/'+centerID+"/all/all/all")
  //     .then((response)=>{
  //       console.log('response', response);
  //       var tableData = response.data.map((a, i)=>{
  //         return {
  //           _id                       : a._id,
  //           beneficiaryID             : a.beneficiaryID,
  //           familyID                  : a.familyID,
  //           nameofbeneficiaries       : a.nameofbeneficiaries,
  //           uidNumber                 : a.uidNumber,
  //           relation                  : a.relation,
  //         }
  //       })
  //       this.setState({
  //         tableData : tableData
  //       },()=>{
  //         console.log("tableData",this.state.tableData)
  //       })
  //     })
  //     .catch(function(error){
  //       console.log("error = ",error);
  //     });
  //   }
  // }
  getAvailableFamilyId(center_ID){
    if(center_ID){
      axios({
        method: 'get',
        url: '/api/families/list/'+center_ID,
      }).then((response)=> {
          
          this.setState({
            availableFamilies : response.data
          })
      }).catch(function (error) {
        console.log("error = ",error);
      });
      console.log("availableFamilies", this.state.availableFamilies)
    }
  }

  render() {
    return (    
      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border_Box" id="createBeneficiary">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
           <h4 className="pageSubHeader">Create New Beneficiary</h4>
        </div>
        <div className=" ">
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
            <label className="formLable">Surname </label><span className="asterix">*</span>
            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="surnameOfBeneficiaryErr" >
              <input type="text" className="form-control inputBox" ref="surnameOfBeneficiary" name="surnameOfBeneficiary" value={this.state.surnameOfBeneficiary} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
            <label className="formLable">First Name </label><span className="asterix">*</span>
            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="firstNameOfBeneficiaryErr" >
              <input type="text" className="form-control inputBox" ref="firstNameOfBeneficiary" name="firstNameOfBeneficiary" value={this.state.firstNameOfBeneficiary} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
            </div>
          </div>
          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box ">
            <label className="formLable">Middle Name </label><span className="asterix"></span>
            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="middleNameOfBeneficiaryErr" >
              <input type="text" className="form-control inputBox" ref="middleNameOfBeneficiary" name="middleNameOfBeneficiary" value={this.state.middleNameOfBeneficiary} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
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
                <option  value="">-- Select --</option>
                <option>Self</option>
                <option>Wife</option>
                <option>Husband</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Brother</option>
                <option>Sister</option>
                <option>Daughter in Law</option>
                <option>Son in Law</option>
                <option>Grandson</option>
                <option>Granddaughter</option>
              </select>
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
    );
  }
}
export default Beneficiary