import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";

import 'react-table/react-table.css';
import "./Family.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Family extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"             :"",
      "nameOfFamilyHead"     :"",
      "uID"                  :"",
      "caste"                :"",
      "category"             :"",
      "LHWRFCentre"          :"",
      "centerArray"          : ["Pune", "Bharatpur"],
      "state"                :"Maharastra",
      "district"             :"",
      "block"                :"",
      "village"              :"",
      "contact"              :"",
      fields: {},
      errors: {},
      "tableObjects"         : {
     
        apiLink               : '/api/families/',
        editUrl               : '/family/'
      },
      "tableHeading"          : {
        familyID              : "Family ID",
        familyHead            : "Name of Family Head",
        uidNumber             : "UID Number",
        contactNumber         : "Contact Number",
        caste                 : "Caste",
        familyCategory        : "Family Category",        
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
        actions               : 'Action',
      },            
      "startRange"            : 0,
      "limitRange"            : 10,
      "editId"                : this.props.match.params ? this.props.match.params.id : ''    
    }
    console.log('editId' , this.state.editId);
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    console.log('editId' , editId);
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);
      })
      
      this.getData(this.state.startRange, this.state.limitRange);
    }
  }
  
  componentDidMount() {
    console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getData(this.state.startRange, this.state.limitRange);
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"             :this.refs.familyID.value, 
      "nameOfFamilyHead"     :this.refs.nameOfFamilyHead.value, 
      "uID"                  :this.refs.uID.value, 
      "caste"                :this.refs.caste.value, 
      "category"             :this.refs.category.value, 
      // "LHWRFCentre"          :this.refs.LHWRFCentre.value, 
      // "state"                :this.refs.state.value, 
      "district"             :this.refs.district.value, 
      "block"                :this.refs.block.value, 
      "village"              :this.refs.village.value, 
      "contact"              :this.refs.contact.value,
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
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

  SubmitFamily(event){
    event.preventDefault();
    if (this.validateForm() && this.validateFormReq()) {
    var familyValues= 
      {
        "familyID"             :this.refs.familyID.value, 
        "familyHead"           :this.refs.nameOfFamilyHead.value, 
        "contactNumber"        :this.refs.contact.value, 
        "uidNumber"            :this.refs.uID.value, 
        "caste"                :this.refs.caste.value, 
        "familyCategory"       :this.refs.category.value, 
        // "center"               :this.refs.LHWRFCentre.value, 
        // "state"                :this.state.state, 
        "dist"                 :this.refs.district.value, 
        "block"                :this.refs.block.value, 
        "village"              :this.refs.village.value, 
      };
      let fields = {};
      fields["familyID"]          = "";
      fields["nameOfFamilyHead"]  = "";
      fields["uID"]               = "";
      fields["contact"]           = "";
      fields["caste"]             = "";
      fields["category"]          = "";
      fields["district"]          = "";
      fields["block"]             = "";
      fields["village"]           = "";
      axios.post('/api/families',familyValues)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      this.setState({
        "familyID"             :"",
        "nameOfFamilyHead"     :"",
        "uID"                  :"",
        "caste"                :"",
        "category"             :"",
        "LHWRFCentre"          :"",
        "state"                :"",
        "district"             :"",
        "block"                :"",
        "village"              :"",
        "contact"              :"",
        fields:fields
      });
    }    
  }

  UpdateFamily(event){
    event.preventDefault();
    if(this.refs.familyID.value === "" || this.refs.nameOfFamilyHead.value ==="" || this.refs.contact.value===""
     || this.refs.uID.value==="" || this.refs.caste.value==="" || this.refs.category.value==="" 
     || this.refs.district.value==="" || this.refs.block.value==="" || this.refs.village.value==="" )
    {
    if (this.validateFormReq() && this.validateForm()){
     }
    }else{
      var familyValues = {
        "family_ID"            :this.state.editId, 
        "familyID"             :this.refs.familyID.value,
        "familyHead"           :this.refs.nameOfFamilyHead.value, 
        "contactNumber"        :this.refs.contact.value, 
        "uidNumber"            :this.refs.uID.value, 
        "caste"                :this.refs.caste.value, 
        "familyCategory"       :this.refs.category.value, 
        "dist"                 :this.refs.district.value, 
        "block"                :this.refs.block.value, 
        "village"              :this.refs.village.value, 
      };
      let fields = {};
      fields["familyID"]          = "";
      fields["nameOfFamilyHead"]  = "";
      fields["uID"]               = "";
      fields["contact"]           = "";
      fields["caste"]             = "";
      fields["category"]          = "";
      fields["district"]          = "";
      fields["block"]             = "";
      fields["village"]           = "";

      console.log('familyValues', familyValues);

      axios.patch('/api/families/update', familyValues)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      this.setState({
        "familyID"             :"",
        "nameOfFamilyHead"     :"",
        "uID"                  :"",
        "caste"                :"",
        "category"             :"",
        "LHWRFCentre"          :"",
        "state"                :"",
        "district"             :"",
        "block"                :"",
        "village"              :"",
        "contact"              :"",
        fields:fields
      });
      this.props.history.push('/family');
      this.setState({
        "editId"               : "",
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
    if (!fields["nameOfFamilyHead"]) {
      formIsValid = false;
      errors["nameOfFamilyHead"] = "This field is required.";
    }
    if (!fields["uID"]) {
      formIsValid = false;
      errors["uID"] = "This field is required.";
    }
    if (!fields["caste"]) {
      formIsValid = false;
      errors["caste"] = "This field is required.";
    }          
    if (!fields["category"]) {
      formIsValid = false;
      errors["category"] = "This field is required.";
    }          
    if (!fields["contact"]) {
      formIsValid = false;
      errors["contact"] = "This field is required.";
    }          
   /* if (!fields["state"]) {
      formIsValid = false;
      errors["state"] = "This field is required.";
    }    */      
    if (!fields["district"]) {
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
    this.setState({
      errors: errors
    });
    return formIsValid;
  }
  validateForm(){
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);

    if (typeof fields["contact"] !== "undefined") {
      if (!fields["contact"].match(/^[0-9]{10}$/)) {
        formIsValid = false;
        errors["contact"] = "Please enter valid mobile no.";
      }
    }
    if (typeof fields["familyID"] !== "undefined") {
      // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
      if (!fields["familyID"].match(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$|^$/)) {
        formIsValid = false;
        errors["familyID"] = "Please enter valid Family ID.";
      }
    }
    if (typeof fields["uID"] !== "undefined") {
      // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
      if (!fields["uID"].match(/^[_0-9]*((-|\s)*[_0-9]){12}$/)) {
        formIsValid = false;
        errors["uID"] = "Please enter valid Aadhar No.";
      }
    }
    if (typeof fields["nameOfFamilyHead"] !== "undefined") {
      // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
      if (!fields["nameOfFamilyHead"].match(/^[_A-z]*((-|\s)*[_A-z])*$|^$/)) {
        formIsValid = false;
        errors["nameOfFamilyHead"] = "Please enter valid Name.";
      }
    }
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/families/'+id,
    }).then((response)=> {
      var editData = response.data[0];     
      this.setState({
      "familyID"              : editData.familyID,
      "nameOfFamilyHead"      : editData.familyHead, 
      "contact"               : editData.contactNumber,
      "uID"                   : editData.uidNumber,
      "caste"                 : editData.caste,
      "category"              : editData.familyCategory, 
      // "LHWRFCentre"           : editData.center, 
      // "state"                 : editData.state, 
      "district"              : editData.dist, 
      "block"                 : editData.block, 
      "village"               : editData.village, 
      });
    })
    .catch(function(error){      
    });
  }

  getData(startRange, limitRange){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.get('/api/families/list',data)
    .then((response)=>{
      console.log('response', response.data);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
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
                      Master Data                                        </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="family">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Create New Family</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="familyID" >
                            <input type="text" className="form-control inputBox nameParts" ref="familyID" name="familyID" value={this.state.familyID} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.familyID}</div>
                        </div>
                        <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">Name of Family Head </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="nameOfFamilyHead" >
                            <input type="text" className="form-control inputBox nameParts" ref="nameOfFamilyHead" name="nameOfFamilyHead" value={this.state.nameOfFamilyHead} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.nameOfFamilyHead}</div>
                        </div>
                        <div className="col-lg-4 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uID" >
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="uID" name="uID" value={this.state.uID} onKeyDown={this.isNumberKey.bind(this)}  maxLength = "12" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.uID}</div>
                        </div>
                                              
                      </div><br/>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">Contact Number </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="contact" >
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="contact" name="contact" value={this.state.contact} onKeyDown={this.isNumberKey.bind(this)} maxLength="10" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.contact}</div>
                        </div>  
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Caste</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="caste" >
                            <select className="custom-select form-control inputBox" ref="caste" name="caste" value={this.state.caste} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              <option>General</option>
                              <option>SC</option>
                              <option>ST</option>
                              <option>NT</option>
                              <option>Other</option>                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.caste}</div>
                        </div>                      
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family Category   </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="category" >
                            <select className="custom-select form-control inputBox"ref="category" name="category" value={this.state.category} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Landless</option>
                              <option>BPL</option>
                              <option>Widow Headed</option>
                              <option>Marginal Farmer</option>
                              <option>Small Farmer</option>
                              <option>Big Farmer</option>
                              <option>Handicapped</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.category}</div>
                        </div>
                        
                      </div>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">District</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                            <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pune</option>
                              <option>Thane</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.district}</div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Block</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                            <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pimpari</option>
                              <option>Haveli</option>
                              <option>Chinchwad</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Village</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                            <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Shivne</option>
                              <option>Hadapsar</option>
                              <option>Manjari</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.village}</div>
                        </div>
                
                      </div> 
                    </div><br/>
                    <div className="col-lg-12">
                      <br/>
                      {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit  pull-right" onClick={this.UpdateFamily.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitFamily.bind(this)}> Submit </button>
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
export default Family