import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';

import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
// import "./AnnualPlan.css";

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
      "month"               :"Annually",
      "heading"             :"Monthly Plan",
      "months"              :["April","May","June","--Quarter 1--","July","August","September","--Quarter 2--","October","November","December","--Quarter 3--","January","February","March","--Quarter 4--",],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "YearPair"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],

      shown                 : true,
       "twoLevelHeader"     : {
        apply               : true,
        firstHeaderData     : [
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
      "tableHeading"        : {
        month               : "Month",
        sectorName          : "Sector",
        activity            : "Activity",
        subActivity         : "Sub-Activity",
        unit                : "Unit",
        physicalUnit        : "Physical Unit",
        unitCost            : "Unit Cost",
        totalBudget         : "Total Cost",
        noOfBeneficiaries   : "No. Of Beneficiaries",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank Loan",
        govtscheme          : "Govt. Scheme",
        directCC            : "Direct Community Contribution",
        indirectCC          : "Indirect Community Contribution",
        other               : "Other",
        actions             : 'Action',
      },
      " tableObjects"       : {
        apiLink             : '/api/annualPlans/',
        editUrl             : '/Plan/',
      },
      "startRange"          : 0,
      "limitRange"          : 10,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fields                : {},
      errors                : {},
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
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
   
  SubmitAnnualPlan(event){
    event.preventDefault();
    var id2 = this.state.uID;
    if (this.validateFormReq() &&this.validateForm()) {
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
    }
  }
    
  getData(startRange, limitRange){
   axios({
      method: 'get',
      url: '/api/annualPlans/list',
    }).then(function(response){
      console.log('response======================', response.data);
      this.setState({
        tableData : response.data
      });
     
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  Update(event){    
    event.preventDefault();
    if(this.refs.year.value == "" || this.refs.month.value =="" || this.refs.sectorName.value=="" || this.refs.activity.value=="" 
      || this.refs.physicalUnit.value=="" || this.refs.unitCost.value=="" || this.refs.totalBudget.value=="" || this.refs.noOfBeneficiaries.value=="" 
      || this.refs.LHWRF.value=="" || this.refs.NABARD.value=="" || this.refs.bankLoan.value=="" || this.refs.govtscheme.value=="" 
      || this.refs.directCC.value=="" || this.refs.indirectCC.value=="" || this.refs.other.value=="" || this.refs.remark.value=="")
      {
        if (this.validateFormReq() && this.validateForm()){
        }
      }else{
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
      axios.patch('/api/annualPlans/',annualPlanValues)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error"+error);
        });
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
        "fields"              :fields
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
  
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

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
      url: '/api/annualPlans/list',
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

  edit(id){
    axios({
      method: 'get',
      url: '/api/annualPlans/'+id,
      }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      this.setState({
        "year"                : editData.year,
        "month"               : editData.month,
        "center"              : editData.center,
        "sectorName"          : editData.sectorName,
        "activity"            : editData.activity,
        "physicalUnit"        : editData.physicalUnit,
        "unitCost"            : editData.unitCost,
        "totalBudget"         : editData.totalBudget,
        "noOfBeneficiaries"   : editData.noOfBeneficiaries,
        "LHWRF"               : editData.LHWRF,
        "NABARD"              : editData.NABARD,
        "bankLoan"            : editData.bankLoan,
        "govtscheme"          : editData.govtscheme,
        "directCC"            : editData.directCC,
        "indirectCC"          : editData.indirectCC,
        "other"               : editData.other,
        "remark"              : editData.remark,
      });
    }).catch(function (error) {
    });
  }

  toglehidden(){
   this.setState({
       shown: !this.state.shown
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
                        Activity wise Annual completion Report                                        
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
                               {this.state.months.map((data,index) =>
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
                              <div className="addContainerAct " id="click_advance"  onClick={this.toglehidden.bind(this)}>
                                <div className="display_advance" id="display_advance">Add Center
                                  {/*<i className="fa fa-plus" aria-hidden="true" id="click"></i>*/}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> 
                      </div><br/>                      
                   {/* <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"  style={hidden} id="Academic_details">
                        
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
                       
                        <div className=" subActDiv ">
                          <div className=" ">
                            <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 contentDiv  ">
                                <label className="">Sub-Activity 1</label><br/>
                                <label className="formLable">Unit :<span></span></label>
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
                                    <input type="text" className="form-control inputBoxAP nameParts" name="physicalUnit" placeholder=""ref="physicalUnit" value={this.state.physicalUnit} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Unit Cost</label>
                                  <div className=" input-group inputBox-main" id="physicalUnit" >
                                    <input type="text" className="form-control inputBoxAP nameParts" name="unitCost" placeholder=""ref="unitCost" value={this.state.unitCost} onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>  
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">Total Cost</label>
                                  <div className="input-group inputBox-main" id="unitCost" >
                                    <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>  
                                <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                  <label className="formLable">No.of Benef.</label>
                                  <div className=" input-group inputBox-main" id="totalBudget" >
                                    <input type="text" className="form-control inputBoxAP nameParts" name="noOfBeneficiaries" placeholder=""ref="noOfBeneficiaries" value={this.state.noOfBeneficiaries} onChange={this.handleChange.bind(this)}/>                              
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
                                  <div className=" input-group inputBox-main" id="LHWRF" >
                                    <input type="text" className="form-control inputBox nameParts" name="LHWRF" placeholder=""ref="LHWRF" value={this.state.LHWRF}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">NABARD</label>
                                  <div className=" input-group inputBox-main" id="NABARD" >
                                    <input type="text" className="form-control inputBox nameParts" name="NABARD" placeholder=""ref="NABARD" value={this.state.NABARD}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Bank Loan</label>
                                  <div className=" input-group inputBox-main" id="bankLoan" >
                                    <input type="text" className="form-control inputBox nameParts" name="bankLoan" placeholder=""ref="bankLoan" value={this.state.bankLoan}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Govt. Schemes</label>
                                  <div className=" input-group inputBox-main" id="govtscheme" >
                                    <input type="text" className="form-control inputBox nameParts" name="govtscheme" placeholder=""ref="govtscheme" value={this.state.govtscheme}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Direct Comm. Contri.</label>
                                  <div className=" input-group inputBox-main" id="directCC" >
                                    <input type="text" className="form-control inputBox nameParts" name="directCC" placeholder=""ref="directCC" value={this.state.directCC}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                  <label className="formLable">Indirect Comm. Contri.</label>
                                  <div className=" input-group inputBox-main" id="indirectCC" >
                                    <input type="text" className="form-control inputBox nameParts" name="indirectCC" placeholder=""ref="indirectCC" value={this.state.indirectCC}  onChange={this.handleChange.bind(this)}/>
                                  </div>
                                </div>
                              </div>
                              <div className=" row">
                                <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                              <label className="formLable">Other</label>
                              <div className=" input-group inputBox-main" id="other" >
                                <input type="text" className="form-control inputBox nameParts" name="other" placeholder=""ref="other" value={this.state.other}  onChange={this.handleChange.bind(this)}/>
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
                      
                    </form>*/}
                    </div>
                    <div className="AnnualHeadCont">
                      <div className="annualHead">
                      {
                        this.state.month=="--Quarter 1--"
                          ?
                            <h5>Quarterly Plan for April, May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                          :
                            <h5>{this.state.month !== "Annually" ? "Monthly Plan "+ this.state.month : "Annual Plan " }{ this.state.year !=="-- Select Year --" ? " - "+(this.state.year ? this.state.year :"" ) : null}</h5> 
                        }
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                      <div className="row">  
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
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default AnnualPlan
