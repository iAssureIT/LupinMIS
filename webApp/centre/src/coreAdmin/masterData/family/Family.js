import React, { Component }   from 'react';
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
      "centerArray"          : [],
      "state"                :"Maharastra",
      "district"             :"",
      "block"                :"",
      "village"              :"",
      "contact"              :"",
      fields: {},
      errors: {},
      "twoLevelHeader"       : {
        apply                : false,
        firstHeaderData      : [
                                {
                                    heading : '',
                                    mergedColoums : 10
                                },
                                {
                                    heading : 'Source of  Fund',
                                    mergedColoums : 7
                                },
                                {
                                    heading : 'MIS Coordinator',
                                    mergedColoums : 3
                                },
                              ]
      },
        "tableObjects"        : {
        apiLink               : '/api/families/',
        editUrl               : '/family/'
      },
      "tableHeading"          : {
        familyID              : "Family ID",
        // beneficariesId     : "Beneficiary ID",
        familyHead            : "Name of Family Head",
        contactNumber         : "Contact Number",
        uidNumber             : "UID Number",
        // caste              : "Caste",
        familyCategory        : "Family Category",
        center                : "LHWRF Centre",
        state                 : "State",
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
        actions               : 'Action',

      },  
     
      " tableObjects"         : {
        apiLink               : '/api/family/',
        editUrl               : '/family/',
      },
      "startRange"            : 0,
      "limitRange"            : 10,
      "editId"                : this.props.match.params ? this.props.match.params.id : ''
    
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"             :this.refs.familyID.value, 
      "nameOfFamilyHead"     :this.refs.nameOfFamilyHead.value, 
      "uID"                  :this.refs.uID.value, 
      "caste"                :this.refs.caste.value, 
      "category"             :this.refs.category.value, 
      "LHWRFCentre"          :this.refs.LHWRFCentre.value, 
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
        familyID             :this.refs.familyID.value, 
        familyHead           :this.refs.nameOfFamilyHead.value, 
        contactNumber        :this.refs.contact.value, 
        uidNumber            :this.refs.uID.value, 
        Caste                :this.refs.caste.value, 
        familyCategory       :this.refs.category.value, 
        center               :this.refs.LHWRFCentre.value, 
        state                :this.state.state, 
        dist                 :this.refs.district.value, 
        block                :this.refs.block.value, 
        village              :this.refs.village.value, 
      };

      let fields = {};
      fields["familyID"]          = "";
      fields["nameOfFamilyHead"]  = "";
      fields["uID"]               = "";
      fields["caste"]             = "";
      fields["category"]          = "";
      fields["LHWRFCentre"]       = "";
      fields["state"]             = "";
      fields["district"]          = "";
      fields["block"]             = "";
      fields["village"]           = "";

      axios.post('/api/families',familyValues)
        .then(function(response){
          swal({
            title : response.data,
            text  : response.data
          });
          this.getData(this.state.startRange, this.state.limitRange);
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
    if(this.refs.familyID.value == "" || this.refs.nameOfFamilyHead.value =="" || this.refs.contact.value==""
     || this.refs.uID.value=="" || this.refs.caste.value=="" || this.refs.familyCategory.value=="" 
     || this.refs.center.value=="" || this.refs.this.state.value=="" 
     || this.refs.dist.value=="" || this.refs.block.value=="" || this.refs.village.value=="" )
    {
      if (this.validateFormReq() && this.validateForm()){
      }
    }else{
      event.preventDefault();
      var familyValues= 
      {
          families_ID          :this.refs.editId.value, 
          familyID             :this.refs.familyID.value,
          familyHead           :this.refs.nameOfFamilyHead.value, 
          contactNumber        :this.refs.contact.value, 
          uidNumber            :this.refs.uID.value, 
          Caste                :this.refs.caste.value, 
          familyCategory       :this.refs.category.value, 
          center               :this.refs.LHWRFCentre.value, 
          state                :this.state.state, 
          dist                 :this.refs.district.value, 
          block                :this.refs.block.value, 
          village              :this.refs.village.value, 
      };
      let fields = {};
      fields["familyID"]          = "";
      fields["nameOfFamilyHead"]  = "";
      fields["uID"]               = "";
      fields["caste"]             = "";
      fields["category"]          = "";
      fields["LHWRFCentre"]       = "";
      fields["state"]             = "";
      fields["district"]          = "";
      fields["block"]             = "";
      fields["village"]           = "";

      axios.patch('/api/families/update',familyValues)
        .then(function(response){
          swal({
            title : response.data,
            text  : response.data
          });
          this.getData(this.state.startRange, this.state.limitRange);
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
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
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
      if (!fields["LHWRFCentre"]) {
        formIsValid = false;
        errors["LHWRFCentre"] = "This field is required.";
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
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

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
      console.log('editData',editData);
     
      this.setState({
      "familyID"             : editData.familyID,
      "familyHead"           : editData.familyHead, 
      "uidNumber"            : editData.uidNumber,
      "caste"                : editData.caste,
      "familyCategory"       : editData.familyCategory, 
      "center"               : editData.center, 
      "state"                : editData.state, 
      "dist"                 : editData.dist, 
      "block"                : editData.block, 
      "village"              : editData.village, 
      });

    }).catch(function (error) {
    });
  }
 
  getData(startRange, limitRange){
   axios({
      method: 'get',
      url: '/api/families/list',
    }).then(function(response){
      console.log('response======================', response.data);
      this.setState({
        tableData : response.data
      });
     
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      console.log(this.state.editId);
      this.edit(editId);
    }
  }
  
  componentDidMount() {
    console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    axios({
      method: 'get',
      url: '/api/families/list',
      }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return});
      this.setState({
        tableData : response.data,
        editUrl   : this.props.match.params
      },()=>{
        
      });
    }).catch(function (error) {
      console.log('error', error);
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
                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="familyID" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts" ref="familyID" name="familyID" value={this.state.familyID} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.familyID}</div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">Name of Family Head </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="nameOfFamilyHead" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts" ref="nameOfFamilyHead" name="nameOfFamilyHead" value={this.state.nameOfFamilyHead} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.nameOfFamilyHead}</div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">UID No (Aadhar Card No)  </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="uID" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="uID" name="uID" value={this.state.uID}  maxLength = "12" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.uID}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                          <label className="formLable">Contact Number </label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="contact" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""ref="contact" name="contact" value={this.state.contact} onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.uID}</div>
                        </div>
                        
                      </div><br/>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Caste</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="caste" >
                            <select className="custom-select form-control inputBox" ref="caste" name="caste" value={this.state.caste} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              <option>SC</option>
                              <option>NT</option>
                              <option>Open</option>
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
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">LHWRF Centre</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRFCentre" >
                            <select className="custom-select form-control inputBox"ref="LHWRFCentre" name="LHWRFCentre" value={this.state.LHWRFCentre} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                                 {this.state.centerArray.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.LHWRFCentre}</div>
                        </div>
                        
                        
                  
                      </div>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group unit" id="state" >
                            <label className="formLable">State :</label>
                          </div>
                          <div className="errorMsg">{this.state.errors.state}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">District</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                            <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              <option>Pune</option>
                              
                            </select>
                          </div>
{/*                          <div className="errorMsg">{this.state.errors.district}</div>
*/}                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Block</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                            <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                              <option>Pimpari</option>
                              <option>Pimpari</option>
                              <option>Pimpari</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Village</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                            <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.handleChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option>Shivne</option>
                              <option>Shivne</option>
                              <option>Shivne</option>
                              <option>Shivne</option>
                              
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
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.SubmitFamily.bind(this)}> Submit </button>
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