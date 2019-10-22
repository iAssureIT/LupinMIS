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
      "familyID"            : "",
      "beneficiaryID"       : "",
      "nameofbeneficiaries" : "",
      "fields"              : {},
      "errors"              : {},
      "uID"                 : "",
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
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
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
        if(error.message === "Request failed with status code 401"){
          swal({
              title : "abc",
              text  : "Session is Expired. Kindly Sign In again."
          });
        }
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
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getAvailableFamilyId();
    this.getData(this.state.startRange, this.state.limitRange);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    this.getAvailableCenter(this.state.center_ID);
    console.log("center_ID =",this.state.center_ID);
    });
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
  getAvailableCenter(center_ID){
    // console.log("CID"  ,center_ID);
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        function removeDuplicates(data, param){
            return data.filter(function(item, pos, array){
                return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
            })
        }
        var availableDistInCenter= removeDuplicates(response.data[0].villagesCovered, "district");
        console.log('availableDistInCenter ==========',availableDistInCenter);
        this.setState({
          availableDistInCenter  : availableDistInCenter,
          // availableDistInCenter  : response.data[0].districtsCovered,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
          // districtsCovered : response.data[0].districtsCovered
        },()=>{
        var stateCode =this.state.address.split('|')[0];
         this.setState({
          stateCode  : stateCode,

        },()=>{
        // this.getDistrict(this.state.stateCode, this.state.districtsCovered);
        });
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      var selectedDistrict = this.state.district.split('|')[0];
      // console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      console.log('selectedDistrict',this.state.selectedDistrict);
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
  }
  distChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      var selectedDistrict = this.state.district.split('|')[0];
      // console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      // console.log('selectedDistrict',this.state.selectedDistrict);
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
  }
  getBlock(stateCode, selectedDistrict){
    axios({
      method: 'get',
      // url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/MH/IN',
      url: 'http://locationapi.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
    }).then((response)=> {
        console.log('response ==========', response.data);
        this.setState({
          listofBlocks : response.data
        },()=>{
        console.log('listofBlocks', this.state.listofBlocks);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block
    },()=>{
      // console.log("block",block);
      this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
    });
  }
  getVillages(stateCode, selectedDistrict, block){
    console.log(stateCode, selectedDistrict, block);
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+block,
      // url: 'http://locationapi.iassureit.com/api/cities/get/list/'+block+'/'+selectedDistrict+'/'+stateCode+'/IN',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofVillages : response.data
        },()=>{
        // console.log('listofVillages', this.state.listofVillages);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      // console.log("village",village);
    });
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
            <div className="col-lg-2 col-lg-offset-4 col-md-4 col-sm-6 col-xs-6 text-center addform" data-toggle="modal" data-target="#myModal">
            Add Beneficiary
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
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox" ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)} >
                                  <option  className="hidden" >-- Select --</option>
                                  {
                                    this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 ? 
                                    this.state.availableDistInCenter.map((data, index)=>{
                                      return(
                                        <option key={index} value={(data.district+'|'+data._id)}>{this.camelCase(data.district.split('|')[0])}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                  {/*<option>Pune</option>
                                  <option>Thane</option>*/}
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Block</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                                <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block} onChange={this.selectBlock.bind(this)} >
                                  <option  className="hidden" >-- Select --</option>
                                  {
                                    this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                    this.state.listofBlocks.map((data, index)=>{
                                      console.log('dta', data);
                                      return(
                                        <option key={index} value={this.camelCase(data.blockName)}>{this.camelCase(data.blockName)}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                  {/*<option>Pimpari</option>
                                  <option>Haveli</option>
                                  <option>Chinchwad</option>*/}
                                </select>
                              </div>
                            </div>
                            <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Village</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                                <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.selectVillage.bind(this)} >
                                  <option  className="hidden" >-- Select --</option>
                                  {
                                    this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                                    this.state.listofVillages.map((data, index)=>{
                                      return(
                                        <option key={index} value={this.camelCase(data.cityName)}>{this.camelCase(data.cityName)}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                  {/*<option>Shivne</option>
                                  <option>Hadapsar</option>
                                  <option>Manjari</option>*/}
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
                                  <option  className="hidden" >-- Select --</option>
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