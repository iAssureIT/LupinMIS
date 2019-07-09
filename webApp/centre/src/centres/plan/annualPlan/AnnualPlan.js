import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';

import 'react-table/react-table.css';
import "./AnnualPlan.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';


class AnnualPlan extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      "center"              :"",
      "sector_id"           :"",
      "sectorName"          :"",
      "subActivity"         :"",
      "activity"            :"",
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
      "month"               :"",
      "heading"             :"Monthly Plan",
      "Months"              :["April","May","June","--Quarter 1--","July","August","September","--Quarter 2--","October","November","December","--Quarter 3--","January","February","March","--Quarter 4--",],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "YearPair"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],

      shown                 : true,
      fields: {},
      errors: {},
       "twoLevelHeader"              : {
        apply                     : true,
        firstHeaderData           : [
                                      {
                                          heading : '',
                                          mergedColoums : 10
                                      },
                                      {
                                          heading : 'Source of Fund',
                                          mergedColoums : 7
                                      },
                                   /*   {
                                          heading : 'MIS Coordinator',
                                          mergedColoums : 3
                                      },*/
                                    ]
      },
      "tableHeading"                : {
        month                      : "Month",
        sectorName                 : "Sector",
        activity                   : "Activity",
        subActivity                : "Sub-Activity",
        unit                       : "Unit",
        physicalUnit               : "Physical Unit",
        unitCost                   : "Unit Cost",
        totalBudget                : "Total Cost",
        noOfBeneficiaries          : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
        actions                     : 'Action',
      },
       "tableObjects"              : {
        apiLink                   : '/api/annualPlans/'
      },
      "startRange"                  : 0,
      "limitRange"                  : 10,
      "editId"                      : this.props.match.params ? this.props.match.params.id : ''
    }
      
  }
 
  handleChange(event){
    event.preventDefault();


    this.setState({
      "month"               : this.refs.month.value,          
      "sectorName"          : this.refs.sectorName.value,
      "year"                : this.refs.year.value,          
      "activity"            : this.refs.activity.value,
      "physicalUnit"        : this.refs.physicalUnit.value,
      "unitCost"            : this.refs.unitCost.value,
      "totalBudget"         : this.refs.totalBudget.value,
      "noOfBeneficiaries"   : this.refs.noOfBeneficiaries.value,
      "LHWRF"               : this.refs.LHWRF.value,
      "NABARD"              : this.refs.NABARD.value,
      "bankLoan"            : this.refs.bankLoan.value,
      "govtscheme"          : this.refs.govtscheme.value,
      "directCC"            : this.refs.directCC.value,
      "indirectCC"          : this.refs.indirectCC.value,
      "other"               : this.refs.other.value,
      "remark"              : this.refs.remark.value,
    /*  "center"              : this.refs.center.value,
      "sector_id"           : this.refs.sector_id.value,*/
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  /*  if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }*/
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      // this.edit(editId);
    }
  }

  SubmitAnnualPlan(event){
    event.preventDefault();
    var id2 = this.state.uID;
    if (this.validateFormReq()) {
    var annualPlanValues= 
    {
      "year"                : this.refs.year.value,          
      "month"               : this.refs.month.value,          
      // "center"              : this.refs.center.value,
      // "sector_id"           : this.refs.sector_id.value,
      "sectorName"          : this.refs.sectorName.value,
      "activity"            : this.refs.activity.value,
      "physicalUnit"        : this.refs.physicalUnit.value,
      "unitCost"            : this.refs.unitCost.value,
      "totalBudget"         : this.refs.totalBudget.value,
      "noOfBeneficiaries"   : this.refs.noOfBeneficiaries.value,
      "LHWRF"               : this.refs.LHWRF.value,
      "NABARD"              : this.refs.NABARD.value,
      "bankLoan"            : this.refs.bankLoan.value,
      "govtscheme"          : this.refs.govtscheme.value,
      "directCC"            : this.refs.directCC.value,
      "indirectCC"          : this.refs.indirectCC.value,
      "other"               : this.refs.other.value,
      "remark"              : this.refs.remark.value,
    };

    let fields = {};
    fields["year"]              = "";
    fields["month"]             = "";
    fields["sectorName"]        = "";
    fields["activity"]          = "";
    fields["physicalUnit"]      = "";
    fields["unitCost"]          = "";
    fields["totalBudget"]       = "";
    fields["noOfBeneficiaries"] = "";
    fields["LHWRF"]             = "";
    fields["NABARD"]            = "";
    fields["bankLoan"]          = "";
    fields["govtscheme"]        = "";
    fields["directCC"]          = "";
    fields["indirectCC"]        = "";
    fields["other"]             = "";
    fields["remark"]            = "";
   
    this.setState({
      "year"                :"",
      "month"               :"",
      "center"              :"",
      "sector_id"           :"",
      "sectorName"          :"",
      "activity"            :"",
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
      "fields":fields
    });
    console.log("annualPlanValues",annualPlanValues);
     axios.post('/api/annualPlans/',annualPlanValues)
    .then(function(response){
      swal({
        title : response.data,
        text  : response.data
      });
            console.log("response"+response.data);

      this.getData(this.state.startRange, this.state.limitRange);
      
    })
    .catch(function(error){
                  console.log("error"+error);

        });
      }
  }
  getData(startRange, limitRange){
   axios({
      method: 'get',
      url: '/api/annualPlans/list',
    }).then((response)=> {
      console.log('response======================', response.data)
      this.setState({
        tableData : response.data
      })
     
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  Update(event){
    event.preventDefault();
    if (this.validateForm() && this.validateFormReq()) {
     /* var academicArray=[];
      var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');

      var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
      var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});*/

      var id2 = this.state.uID;
        /*    if (this.validateForm()) {*/    
       var annualPlanValues= 
    {
      "year"                : this.refs.year.value,          
      "month"               : this.refs.month.value,          
      // "center"              : this.refs.center.value,
      // "sector_id"           : this.refs.sector_id.value,
      "sectorName"          : this.refs.sectorName.value,
      "activity"            : this.refs.activity.value,
      "physicalUnit"        : this.refs.physicalUnit.value,
      "unitCost"            : this.refs.unitCost.value,
      "totalBudget"         : this.refs.totalBudget.value,
      "noOfBeneficiaries"   : this.refs.noOfBeneficiaries.value,
      "LHWRF"               : this.refs.LHWRF.value,
      "NABARD"              : this.refs.NABARD.value,
      "bankLoan"            : this.refs.bankLoan.value,
      "govtscheme"          : this.refs.govtscheme.value,
      "directCC"            : this.refs.directCC.value,
      "indirectCC"          : this.refs.indirectCC.value,
      "other"               : this.refs.other.value,
      "remark"              : this.refs.remark.value,
    };

    let fields = {};
    fields["year"]              = "";
    fields["month"]             = "";
    fields["sectorName"]        = "";
    fields["activity"]          = "";
    fields["physicalUnit"]      = "";
    fields["unitCost"]          = "";
    fields["totalBudget"]       = "";
    fields["noOfBeneficiaries"] = "";
    fields["LHWRF"]             = "";
    fields["NABARD"]            = "";
    fields["bankLoan"]          = "";
    fields["govtscheme"]        = "";
    fields["directCC"]          = "";
    fields["indirectCC"]        = "";
    fields["other"]             = "";
    fields["remark"]            = "";
   
  
      // console.log('centreDetail',centreDetail);
      axios.post('/api/annualPlans',annualPlanValues)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
        this.getData(this.state.startRange, this.state.limitRange);
        
      })
      .catch(function(error){
        
      });
     this.setState({
        "year"                :"",
        "month"                :"",
        "center"              :"",
        "sector_id"           :"",
        "sectorName"          :"",
        "activity"            :"",
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
        "fields":fields
      });
    }
  }

  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["sectorName"]) {
      formIsValid = false;
      errors["sectorName"] = "This field is required.";
    }     
     if (!fields["activity"]) {
      formIsValid = false;
      errors["activity"] = "This field is required.";
    }     
      
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  componentDidMount() {
    this.getData(this.state.startRange, this.state.limitRange)
  }
  toglehidden()
  {
   this.setState({
       shown: !this.state.shown
      });
  }
  edit(id){
    axios({
      method: 'get',
      url: '/api/annualPlans/'+id,
      }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      this.setState({
        "typeOfCentre"             : editData.type,
        "nameOfCentre"             : editData.centerName,
        "address"                  : editData.address,
        "state"                    : editData.state,
        "district"                 : editData.district,
        "pincode"                  : editData.pincode,
        "centreInchargeName"       : editData.centerInchargename,
        "centreInchargeContact"    : editData.centerInchargemobile,
        "centreInchargeEmail"      : editData.centerInchargeemail,
        "MISCoordinatorName"       : editData.misCoordinatorname,
        "MISCoordinatorContact"    : editData.misCoordinatormobile,
        "MISCoordinatorEmail"      : editData.misCoordinatoremail,
        "selectedVillages"         : editData.villagesCovered,
        "districtCovered"          :"",
        "blockCovered"             :"",
        "villagesCovered"          : editData.villagesCovered,
      });
    }).catch(function (error) {
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
                    <div className="row">
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                           <div className=" col-lg-3  col-lg-offset-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                              <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.handleChange.bind(this)} >
                                <option className="" >Annually</option>
                               {this.state.Months.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                              <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year }  onChange={this.handleChange.bind(this)} >
                                <option className="hidden" >-- Select Year --</option>
                               {this.state.month  ? (this.state.month !== "Annually" ?
                                  this.state.Year.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                  ):
                                  this.state.YearPair.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                  ) ) : 
                                  this.state.YearPair.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                  )
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.year}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 " >
                              <div className="addContainerAct col-lg-6 pull-right" id="click_advance"  onClick={this.toglehidden.bind(this)}><div className="display_advance" id="display_advance"><i className="fa fa-plus" aria-hidden="true" id="click"></i></div></div>
                            </div>
                          </div>
                        </div> 
                      </div><br/>                      
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"  style={hidden} id="Academic_details">
                        
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                              <label className="formLable">Sector </label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorName" >
                                <select className="custom-select form-control inputBox" ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Value 1</option>
                                  <option>Value 2</option>
                                  <option>Value 3</option>
                                  <option>Value 4</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.sectorName}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                              <label className="formLable">Activity </label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                                <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity} onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Value 1</option>
                                  <option>Value 2</option>
                                  <option>Value 3</option>
                                  <option>Value 4</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.activity}</div>
                            </div>
                          </div> 
                        </div><br/>
                       
                        <div className="">
                          <div className=" col-lg-10 col-lg-offset-2 col-sm-12 col-xs-12  boxHeight ">
                            <div className="row">
                              <div className="col-lg-12 col-sm-12 col-xs-12  ">
                                <div className="col-lg-3 col-md-1 col-sm-1 col-xs-1 ">
                                </div> 
                                <div className="col-lg-3 col-md-1 col-sm-1 col-xs-1 row ">
                                </div> 
                                <div className="col-lg-3 col-md-1 col-sm-1 col-xs-1 row ">
                                </div> 
                                <div className="col-lg-3 col-md-1 col-sm-1 col-xs-1 row ">
                                </div> 
                              </div>
                            </div>
                          </div> 
                        </div><br/>
                      
                        <div className=" subActDiv ">
                          <div className=" ">
                            <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 contentDiv  ">
                                <label className="">Sub-Activity 1</label><br/>
                                <label className="formLable">Unit :</label>
                            </div>
                            <div className="col-lg-10 col-sm-10 col-xs-10 ">
                              <div className="row">
                                <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                  <label className="formLable head">Sub-Activity Details</label>
                                </div>
                              </div>
                              <div className=" row">
                                <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Physical Units</label>
                                  <div className=" input-group inputBox-main " id="unit" >
                                    <input type="text" className="form-control inputBox nameParts" name="unit" placeholder=""ref="unit" value={this.state.unit} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Unit Cost</label>
                                  <div className=" input-group inputBox-main" id="physicalUnit" >
                                    <input type="text" className="form-control inputBox nameParts" name="physicalUnit" placeholder=""ref="physicalUnit" value={this.state.physicalUnit} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>  
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Total Cost</label>
                                  <div className="input-group inputBox-main" id="unitCost" >
                                    <input type="text" className="form-control inputBox nameParts" name="unitCost" placeholder=""ref="unitCost" value={this.state.unitCost} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>  
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">No.of Benef.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                  <label className="formLable head">Financial Sources</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">LHWRF</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">NABARD</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Bank Loan</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Govt. Schemes</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Direct Comm. Contri.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Indirect Comm. Contri.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>
                              <div className=" row">
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                              <label className="formLable">Other</label>
                              <div className=" input-group inputBox-main" id="totalBudget" >
                                <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                                <div className=" col-lg-10 col-md-10 col-sm-12 col-xs-12 planfields">
                                  <label className="formLable">Remark</label>
                                  <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="remark" >
                                    <input type="text" className="form-control inputBox nameParts" name="remark" placeholder="Remark" ref="remark" value={this.state.remark}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>  
                            </div>  
                          </div><br/>
                          <div className="row">
                            
                            <div className=" col-lg-10 col-lg-offset-2 col-sm-12 col-xs-12  padmi3">
                              <div className=" col-lg-12 col-md-6 col-sm-6 col-xs-12 padmi3 ">
                                <label className="formLable"></label>
                                <div className="errorMsg">{this.state.errors.remark}</div>
                              </div>
                            </div> 
                          </div><br/>
                        </div>
                        <div className=" subActDiv ">
                          <div className=" ">
                            <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 contentDiv  ">
                                <label className="">Sub-Activity 1</label><br/>
                                <label className="formLable">Unit :</label>
                            </div>
                            <div className="col-lg-10 col-sm-10 col-xs-10 ">
                              <div className="row">
                                <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                  <label className="formLable head">Sub-Activity Details</label>
                                </div>
                              </div>
                              <div className=" row">
                                <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Physical Units</label>
                                  <div className=" input-group inputBox-main " id="unit" >
                                    <input type="text" className="form-control inputBox nameParts" name="unit" placeholder=""ref="unit" value={this.state.unit} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Unit Cost</label>
                                  <div className=" input-group inputBox-main" id="physicalUnit" >
                                    <input type="text" className="form-control inputBox nameParts" name="physicalUnit" placeholder=""ref="physicalUnit" value={this.state.physicalUnit} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>  
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Total Cost</label>
                                  <div className="input-group inputBox-main" id="unitCost" >
                                    <input type="text" className="form-control inputBox nameParts" name="unitCost" placeholder=""ref="unitCost" value={this.state.unitCost} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>  
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">No.of Benef.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                  <label className="formLable head">Financial Sources</label>
                                </div>
                              </div>
                              <div className="row">
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">LHWRF</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">NABARD</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Bank Loan</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Govt. Schemes</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Direct Comm. Contri.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Indirect Comm. Contri.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>
                              <div className=" row">
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                              <label className="formLable">Other</label>
                              <div className=" input-group inputBox-main" id="totalBudget" >
                                <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                                <div className=" col-lg-10 col-md-10 col-sm-12 col-xs-12 planfields">
                                  <label className="formLable">Remark</label>
                                  <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="remark" >
                                    <input type="text" className="form-control inputBox nameParts" name="remark" placeholder="Remark" ref="remark" value={this.state.remark}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>  
                            </div>  
                          </div><br/>
                          <div className="row">
                            
                            <div className=" col-lg-10 col-lg-offset-2 col-sm-12 col-xs-12  padmi3">
                              <div className=" col-lg-12 col-md-6 col-sm-6 col-xs-12 padmi3 ">
                                <label className="formLable"></label>
                                <div className="errorMsg">{this.state.errors.remark}</div>
                              </div>
                            </div> 
                          </div><br/>
                        </div>

                      
                      
                        
                        <div className="col-lg-12">
                         <br/>{
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.SubmitAnnualPlan.bind(this)}> Submit </button>
                        }
                        </div>
                      
                      </form>
                    </div>
                    <div className="AnnualHeadCont">
                      <div className="annualHead">
                      {
                        this.state.month=="--Quarter 1--"
                          ?
                            <h5>Quarterly Plan for April May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                          :
                            <h5>{this.state.month !== "Annually" ? "Monthly Plan "+ this.state.month : "Annual Plan " }{ this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                        }
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                      <div className="row">  
                       {/*<IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          // tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}

                        />*/}
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
export default AnnualPlan
