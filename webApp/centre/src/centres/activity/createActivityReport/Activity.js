import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import _                      from 'underscore';
import swal                   from 'sweetalert';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 

import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import ListOfBeneficiaries    from "../listOfBeneficiaries/ListOfBeneficiaries.js";
import "./Activity.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
var add = 0;

class Activity extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "center_id"         : "",
      "centerName"        : "",
      "dist"              : "",
      "block"             : "",
      "dateofIntervention": "",
      "village"           : "",
      "date"              : "",
      "sector"            : "",
      "typeofactivity"    : "",
      "nameofactivity"    : "",
      "activity"          : "",
      "subactivity"       : "",
      "unit"              : "",
      "unitCost"          : 0,
      "quantity"          : 0,
      "totalcost"         : 0,
      "NABARD"            : 0,
      "LHWRF"             : 0,
      "bankLoan"          : 0,
      "govtscheme"        : 0,
      "directCC"          : 0,
      "indirectCC"        : 0,
      "other"             : 0,
      "total"             : 0,
      shown               : true,
      fields              : {},
      errors              : {},
       "twoLevelHeader"   : {
        apply             : true,
        firstHeaderData   : [
                            {
                              heading : 'Activity Details',
                              mergedColoums : 11
                            },
                            {
                              heading : 'Source of Fund',
                              mergedColoums : 8
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },]
      },
      "tableHeading"      : {
        date                       : "Date",
        place                      : "Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
        numofBeneficiaries         : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
        total                      : "Total",
        remark                     : "Remark",
        actions                    : 'Action',
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        paginationApply            : true,
        searchApply                : true,
        editUrl                    : '/activity/'
      },
      "selectedBeneficiaries"      : [],
      "startRange"                 : 0,
      "limitRange"                 : 10,
      "editId"                     : this.props.match.params ? this.props.match.params.id : ''
    }
  }

  handleChange(event){
    event.preventDefault(); 
    this.setState({
      [event.target.name]: event.target.value
    });
 
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm() ) {
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
  getBeneficiaries(selectedBeneficiaries){
    this.setState({
      selectedBeneficiaries : selectedBeneficiaries
    })
  }
  SubmitActivity(event){
    event.preventDefault();
    if(this.refs.dateofIntervention.value == "" ){
        if (this.validateFormReq() && this.validateForm()){
        }
    }else{
            console.log("date",this.state.dateofIntervention);
      var activityValues= {
        "center_ID"         : "123",
        "centerName"        : "Pune",
        "date"              : this.refs.dateofIntervention.value,
        "district"          : this.refs.dist.value,
        "block"             : this.refs.block.value,
        "village"           : this.refs.village.value,
        "dateofIntervention": this.refs.dateofIntervention.value,
        "sector_ID"         : this.refs.sector.value.split('|')[1],
        "sectorName"        : this.refs.sector.value.split('|')[0],
        "typeofactivity"    : this.refs.typeofactivity.value,
        "activity_ID"       : this.refs.activity.value.split('|')[1],
        "activityName"      : this.refs.activity.value.split('|')[0],
        "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
        "subactivityName"   : this.refs.subactivity.value.split('|')[0],
        "unit"              : document.getElementById('unit').innerHTML,
        "unitCost"          : this.refs.unitCost.value,
        "quantity"          : this.refs.quantity.value,
        "totalcost"         : this.state.totalcost,
        "LHWRF"             : this.refs.LHWRF.value,
        "NABARD"            : this.refs.NABARD.value,
        "bankLoan"          : this.refs.bankLoan.value,
        "govtscheme"        : this.refs.govtscheme.value,
        "directCC"          : this.refs.directCC.value,
        "indirectCC"        : this.refs.indirectCC.value,
        "other"             : this.refs.other.value,
        "total"             : this.state.total,
        "remark"            : this.refs.remark.value,
        "listofBeneficiaries": this.state.selectedBeneficiaries
      };
      let fields                  = {};
      fields["dist"]              = "";
      fields["block"]             = "";
      fields["village"]           = "";
      fields["dateofIntervention"]= "";
      fields["sector"]            = "";
      fields["typeofactivity"]    = "";
      fields["nameofactivity"]    = "";
      fields["activity"]          = "";
      fields["subactivity"]       = "";
      fields["unit"]              = "";
      fields["unitCost"]          = "";
      fields["quantity"]          = "";
      fields["totalcost"]         = "";
      fields["LHWRF"]             = "";
      fields["NABARD"]            = "";
      fields["bankLoan"]          = "";
      fields["govtscheme"]        = "";
      fields["directCC"]          = "";
      fields["indirectCC"]        = "";
      fields["other"]             = "";
      
      axios.post('/api/activityReport',activityValues)
        .then((response)=>{
          swal({
            title : response.data.message,
            text  : response.data.message,
          });
            this.getData(this.state.startRange, this.state.limitRange);  
            this.setState({
              selectedValues : this.state.selectedBeneficiaries 
            })    
          })
        .catch(function(error){       
          console.log('error',error);
        });
      this.setState({
        "dist"                   : "",
        "block"                  : "",
        "village"                : "",
        "dateofIntervention"     : "",
        "sector"                 : "",
        "typeofactivity"         : "",
        "nameofactivity"         : "",
        "activity"               : "",
        "subactivity"            : "",
        "unit"                   : "",
        "unitCost"               : "",
        "quantity"               : "",
        "totalcost"              : "",
        "LHWRF"                  : "",
        "NABARD"                 : "",
        "bankLoan"               : "",
        "govtscheme"             : "",
        "directCC"               : "",
        "indirectCC"             : "",
        "other"                  : "",
        "total"                  : "",
        "remark"                 : "",
        "fields"                 : fields,
        "selectedBeneficiaries"  : [],
        "listofBeneficiaries"    : [],
        "subActivityDetails"     : [],
        "availableActivity"      : [],
        "availableSubActivity"   : []

      });
    }
  }
  Update(event){
    event.preventDefault();
    // if (this.validateFormReq() && this.validateForm()) {
    var activityValues= {
      "activityReport_ID" : this.state.editId,
      "center_ID"         : "123",
      "centerName"        : "Pune",
      "date"              : this.refs.dateofIntervention.value,
      "district"          : this.refs.dist.value,
      "block"             : this.refs.block.value,
      "village"           : this.refs.village.value,
      "dateofIntervention": this.refs.dateofIntervention.value,
      "sector_ID"         : this.refs.sector.value.split('|')[1],
      "sectorName"        : this.refs.sector.value.split('|')[0],
      "typeofactivity"    : this.refs.typeofactivity.value,
      "activity_ID"       : this.refs.activity.value.split('|')[1],
      "activityName"      : this.refs.activity.value.split('|')[0],
      "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
      "subactivityName"   : this.refs.subactivity.value.split('|')[0],
      "unit"              : document.getElementById('unit').innerHTML,
      "unitCost"          : this.refs.unitCost.value,
      "quantity"          : this.refs.quantity.value,
      "totalcost"         : this.state.totalcost,
      "LHWRF"             : this.refs.LHWRF.value,
      "NABARD"            : this.refs.NABARD.value,
      "bankLoan"          : this.refs.bankLoan.value,
      "govtscheme"        : this.refs.govtscheme.value,
      "directCC"          : this.refs.directCC.value,
      "indirectCC"        : this.refs.indirectCC.value,
      "other"             : this.refs.other.value,
      "total"             : this.state.total,
      "remark"            : this.refs.remark.value,
      "listofBeneficiaries": this.state.selectedBeneficiaries
    };
    let fields                  = {};
    fields["dist"]              = "";
    fields["block"]             = "";
    fields["village"]           = "";
    fields["dateofIntervention"]= "";
    fields["sector"]            = "";
    fields["typeofactivity"]    = "";
    fields["nameofactivity"]    = "";
    fields["activity"]          = "";
    fields["subactivity"]       = "";
    fields["unit"]              = "";
    fields["unitCost"]          = "";
    fields["quantity"]          = "";
    fields["totalcost"]         = "";
    fields["LHWRF"]             = "";
    fields["NABARD"]            = "";
    fields["bankLoan"]          = "";
    fields["govtscheme"]        = "";
    fields["directCC"]          = "";
    fields["indirectCC"]        = "";
    fields["other"]             = "";
    fields["remark"]             = "";
    axios.patch('/api/activityReport',activityValues)
    .then((response)=>{
    this.getData(this.state.startRange, this.state.limitRange);      
      swal({
        title : response.data.message,
        text  : response.data.message,
      });
    })
    .catch(function(error){        
    });
    this.setState({
      "dist"              : "",
      "block"             : "",
      "village"           : "",
      "dateofIntervention": "",
      "sector"            : "",
      "typeofactivity"    : "",
      "nameofactivity"    : "",
      "activity"          : "",
      "subactivity"       : "",
      "unit"              : "",
      "unitCost"          : "",
      "quantity"          : "",
      "totalcost"         : "",
      "LHWRF"             : "",
      "NABARD"            : "",
      "bankLoan"          : "",
      "govtscheme"        : "",
      "directCC"          : "",
      "indirectCC"        : "",
      "other"             : "",
      "total"             : "",
      "remark"            : "",
      "fields"            : fields,
      "selectedBeneficiaries" :[],
      "listofBeneficiaries": [],      
      "subActivityDetails" : [],
      "availableSectors"   : [],
      "availableActivity"  : [],
      "availableSubActivity": [],
      
    });
      this.props.history.push('/activity');
      this.setState({
        "editId"              : "",
      });
    // }
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
      if (!fields["dist"]) {
        formIsValid = false;
        errors["dist"] = "This field is required.";
      }     
       if (!fields["block"]) {
        formIsValid = false;
        errors["block"] = "This field is required.";
      }     
      if (!fields["village"]) {
        formIsValid = false;
        errors["village"] = "This field is required.";
      }
      if (!fields["dateofIntervention"]) {
        formIsValid = false;
        errors["dateofIntervention"] = "This field is required.";
      }
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }          
      if (!fields["typeofactivity"]) {
        formIsValid = false;
        errors["typeofactivity"] = "This field is required.";
      }          
      if (!fields["activity"]) {
        formIsValid = false;
        errors["activity"] = "This field is required.";
      }          
      if (!fields["subactivity"]) {
        formIsValid = false;
        errors["subactivity"] = "This field is required.";
      }          
      if (!fields["unitCost"]) {
        formIsValid = false;
        errors["unitCost"] = "This field is required.";
      }          
      if (!fields["quantity"]) {
        formIsValid = false;
        errors["quantity"] = "This field is required.";
      }          
      if (!fields["bankLoan"]) {
        formIsValid = false;
        errors["bankLoan"] = "This field is required.";
      }          
      if (!fields["govtscheme"]) {
        formIsValid = false;
        errors["govtscheme"] = "This field is required.";
      }
      if (!fields["NABARD"]) {
        formIsValid = false;
        errors["NABARD"] = "This field is required.";
      }          
      if (!fields["LHWRF"]) {
        formIsValid = false;
        errors["LHWRF"] = "This field is required.";
      }          
      if (!fields["directCC"]) {
        formIsValid = false;
        errors["directCC"] = "This field is required.";
      }          
      if (!fields["indirectCC"]) {
        formIsValid = false;
        errors["indirectCC"] = "This field is required.";
      }          
      if (!fields["other"]) {
        formIsValid = false;
        errors["other"] = "This field is required.";
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
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  calTotal(event){
    event.preventDefault();
    var LHWRF       = this.state.LHWRF;
    var NABARD      = this.state.NABARD;
    var bankLoan    = this.state.bankLoan;
    var govtscheme  = this.state.govtscheme;
    var directCC    = this.state.directCC;
    var indirectCC  = this.state.indirectCC;
    var other       = this.state.other;
     add = parseInt(LHWRF) + parseInt(NABARD) + parseInt(bankLoan) + parseInt(govtscheme) + parseInt(directCC) + parseInt(indirectCC) + parseInt(other);
    this.setState({
      total : add,
    })
      var unitCost = this.state.unitCost;
    var quantity = this.state.quantity;
    var total = parseInt(unitCost) * parseInt(quantity)
    this.setState({
      "totalcost" : total
    })
  }

  toglehidden(){
   this.setState({
     shown: !this.state.shown
    });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/activityReport/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      this.getAvailableActivity(editData.sector_ID);
      this.getAvailableSubActivity(editData.sector_ID, editData.activity_ID)

      this.setState({
        // "editId" : id,
        "dist"              : editData.district,
        "block"             : editData.block,
        "village"           : editData.village,
        "date"              : editData.date,
        "sector"            : editData.sectorName+'|'+editData.sector_ID,
        "typeofactivity"    : editData.typeofactivity,
        "activity"          : editData.activityName+'|'+editData.activity_ID,
        "subactivity"       : editData.subactivityName+'|'+editData.subactivity_ID,
        "subActivityDetails": editData.unit,
        "unitCost"          : editData.unitCost,
        "quantity"          : editData.quantity,
        "totalcost"         : editData.totalcost,
        "LHWRF"             : editData.sourceofFund.LHWRF,
        "NABARD"            : editData.sourceofFund.NABARD,
        "bankLoan"          : editData.sourceofFund.bankLoan,
        "govtscheme"        : editData.sourceofFund.govtscheme,
        "directCC"          : editData.sourceofFund.directCC,
        "indirectCC"        : editData.sourceofFund.indirectCC,
        "other"             : editData.sourceofFund.other,
        "total"             : editData.sourceofFund.total,
        "remark"            : editData.remark,
        "listofBeneficiaries" : editData.listofBeneficiaries,
        "selectedBeneficiaries" : editData.listofBeneficiaries
      });
    }).catch(function (error) {
    });
    // this.setState({
    //   "editId"              : "",
    // });

  }

  getLength(){
    axios.get('/api/activityReport/count')
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
    axios.post('/api/activityReport/list', data)
    .then((response)=>{

      var tableData = response.data.map((a, i)=>{
        return {
          _id                        : a._id,
          date                       : moment(a.date).format('YYYY-MM-DD'),
          place                      : a.place,
          sectorName                 : a.sectorName,
          typeofactivity             : a.typeofactivity,
          activityName               : a.activityName,
          subactivityName            : a.subactivityName,
          unit                       : a.unit,
          unitCost                   : a.unitCost,
          quantity                   : a.quantity,
          totalcost                  : a.totalcost,
          numofBeneficiaries         : a.numofBeneficiaries,
          LHWRF                      : a.LHWRF,
          NABARD                     : a.NABARD,
          bankLoan                   : a.bankLoan,
          govtscheme                 : a.govtscheme,
          directCC                   : a.directCC,
          indirectCC                 : a.indirectCC,
          other                      : a.other,
          total                      : a.total,
          remark                     : a.remark,
        }
      })
      this.setState({
        tableData : tableData
      })
    })
    .catch(function(error){      
    });
  }

  componentDidMount() {
    this.getAvailableSectors();
    if(this.state.editId){      
      this.getAvailableActivity(this.state.editSectorId);
      this.edit(this.state.editId);
    }
    var editId = this.props.match.params ? this.props.match.params.id : '';
    this.setState({
      editId : editId
    })
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');

    this.setState({
      dateofIntervention :momentString,
    })
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
  }

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    this.getAvailableSectors();      
    this.setState({
      "editId" : editId,
    },()=>{
      console.log('editId componentWillReceiveProps', this.state.editId);
      // this.getAvailableActivity(this.state.editSectorId);
      // this.getAvailableSubActivity(this.state.editSectorId);
      
    })  
    this.edit(editId);
    if(nextProps){
      this.getLength();
    }
  }
   
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      sector_ID          : sector_ID,
      subActivityDetails : ""
    })
    this.handleChange(event);
    this.getAvailableActivity(sector_ID);
  }

  getAvailableActivity(sector_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
        this.setState({
          availableActivity : response.data[0].activity
        },()=>{
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var activity_ID = event.target.value.split('|')[1];
    this.setState({
      subActivityDetails : ""
    });
    this.handleChange(event);
    this.getAvailableSubActivity(this.state.sector_ID, activity_ID);
  }

  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      var availableSubActivity = _.flatten(response.data.map((a, i)=>{
          return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] });
        }))
      this.setState({
        availableSubActivity : availableSubActivity
      },()=>{
      });
    }).catch(function (error) {
      console.log('error', error);
    });    
  }
  selectSubActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var subActivity_ID = event.target.value.split('|')[1];

    var subActivityDetails = _.flatten(this.state.availableSubActivity.map((a, i)=>{ return a._id === subActivity_ID ? a.unit : ""}))
    this.setState({
      subActivityDetails : subActivityDetails
    })
    this.handleChange(event);

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
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                        Activity Reporting                                     
                     </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Activity Details</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                        
                        <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Date of intervention</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofIntervention" >
                            <input type="date" className="form-control inputBox toUpper" name="dateofIntervention" ref="dateofIntervention" value={this.state.dateofIntervention} onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.dateofIntervention}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">District</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="dist" >
                              <select className="custom-select form-control inputBox" ref="dist" name="dist" value={this.state.dist} onChange={this.handleChange.bind(this)} >
                                <option  className="hidden" >--select--</option>
                                <option>Pune</option>
                                <option>Thane</option>
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.dist}</div>
                          </div>
                        <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Block</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                            <select className="custom-select form-control inputBox" ref="block" name="block"  value={this.state.block} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                                <option>Pimpari</option>
                                <option>Haveli</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                       <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <label className="formLable">Village</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                            <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                               <option>Hadapsar</option>
                                <option>Manjari</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.village}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <label className="formLable">Sector </label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)} >
                              <option  className="hidden" >--select--</option>
                              {
                                this.state.availableSectors && this.state.availableSectors.length >0 ?
                                this.state.availableSectors.map((data, index)=>{
                                  return(
                                    <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.sector}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Type of Activity</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeofactivity" >
                            <select className="custom-select form-control inputBox" ref="typeofactivity" name="typeofactivity" value={this.state.typeofactivity} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                              <option>Common Level Activity</option>
                               <option>Family Level Activity</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.typeofactivity}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Activity</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                            <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                              <option  className="hidden" >--select--</option>
                              {
                                this.state.availableActivity && this.state.availableActivity.length >0 ?
                                this.state.availableActivity.map((data, index)=>{
                                  if(data.activityName ){
                                    return(
                                      <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                    );
                                  }
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.activity}</div>
                        </div>
                         <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Sub-Activity</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                            <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                              <option  className="hidden" >--select--</option>
                                {
                                  this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                                  this.state.availableSubActivity.map((data, index)=>{
                                    if(data.subActivityName ){
                                      return(
                                        <option className="" key={data._id} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                      );
                                    }
                                  })
                                  :
                                  null
                                }
                                
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.subactivity}</div>
                        </div>                        
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                          <div className="unit"  >
                            <label className="formLable">Unit :</label><br/>
                              {this.state.subActivityDetails ? 
                                <div >
                                  <label className="formLable" id="unit">{this.state.subActivityDetails}</label>
                                </div>
                                :
                                null
                              }
                          </div>
                          <div className="errorMsg">{this.state.errors.unit}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <label className="formLable">Unit Cost</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="unitCost" >
                            <input type="text"   className="form-control inputBox" name="unitCost" placeholder="" onKeyUp={this.calTotal.bind(this)} ref="unitCost" value={this.state.unitCost} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.unitCost}</div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                          <label className="formLable">Quantity</label>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="quantity" >
                            <input type="text" className="form-control inputBox" name="quantity" placeholder="" ref="quantity" onKeyUp={this.calTotal.bind(this)} onKeyDown={this.isNumberKey.bind(this)} value={this.state.quantity}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.quantity}</div>
                        </div>
                         <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <div className="unit " id="PassoutYear" >
                            <label className="formLable">Total Cost of Activity :</label><br/><label className="formLable"> {this.state.totalcost ?  this.state.totalcost : null}</label>
                          </div>
                          <div className="errorMsg">{this.state.errors.totalcost}</div>
                        </div>
                      </div> 
                    </div>
                    <div className="col-lg-12 ">
                      <label className="formLable">Remark</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="remark" >
                            <input type="text"   className="form-control inputBox" name="remark" placeholder="" ref="remark" value={this.state.remark}   onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.remark}</div>
                    </div>
                    <div className="col-lg-12 ">
                       <hr className=""/>
                    </div>
                    <div className="col-lg-12 ">
                       <div className="pageSubHeader">Sources of Fund</div>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">LHWRF</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRF" >
                            <input type="text"   className="form-control inputBox " name="LHWRF" placeholder="" ref="LHWRF" onKeyUp={this.calTotal.bind(this)} onKeyDown={this.isNumberKey.bind(this)} value={this.state.LHWRF}    onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.LHWRF}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">NABARD</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="NABARD" >
                            
                            <input type="text" className="form-control inputBox " name="NABARD" placeholder=""ref="NABARD" onKeyUp={this.calTotal.bind(this)} onKeyDown={this.isNumberKey.bind(this)} value={this.state.NABARD}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.NABARD}</div>
                        </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Bank Loan</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="bankLoan" >
                            <input type="text" className="form-control inputBox " name="bankLoan" placeholder=""ref="bankLoan"  onKeyUp={this.calTotal.bind(this)}  onKeyDown={this.isNumberKey.bind(this)} value={this.state.bankLoan}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.bankLoan}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Govt. Schemes</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="govtscheme" >
                            <input type="text"   className="form-control inputBox " name="govtscheme" placeholder="" ref="govtscheme"  onKeyUp={this.calTotal.bind(this)}   value={this.state.govtscheme}  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.govtscheme}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Direct Beneficiary Contribution</label>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="directCC" >
                            <input type="text" className="form-control inputBox" name="directCC" placeholder=""ref="directCC"  onKeyUp={this.calTotal.bind(this)}  value={this.state.directCC} onKeyDown={this.isNumberKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.directCC}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Indirect Beneficiary Contribution</label>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="indirectCC" >
                            <input type="text" className="form-control inputBox " name="indirectCC" placeholder=""ref="indirectCC" onKeyUp={this.calTotal.bind(this)}  value={this.state.indirectCC} onKeyDown={this.isNumberKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.indirectCC}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Other</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="other" >
                            <input type="text"   className="form-control inputBox" name="other" placeholder="" ref="other"  onKeyUp={this.calTotal.bind(this)}   value={this.state.other} onKeyDown={this.isNumberKey.bind(this)} onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.other}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <div className="unit" id="total" >
                            <label className="formLable">Total :</label>
                            <br/>
                            <label className="formLable">&nbsp;{this.state.total ?  this.state.total : " 0"}</label>
                          </div>
                          <div className="errorMsg">{this.state.errors.total}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                       <hr className=""/>
                    </div>
                
                    <div className="tableContainrer">
                      <ListOfBeneficiaries 
                        getBeneficiaries={this.getBeneficiaries.bind(this)}
                        selectedValues={this.state.selectedValues}
                        sendBeneficiary={this.state.selectedBeneficiaries}
                      />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <br/>
                      {
                        this.state.editId ? 
                        <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                        :
                        <button className=" col-lg-2 btn submit mt pull-right" onClick={this.SubmitActivity.bind(this)}> Submit </button>
                      }
                    </div> 
                    <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                     <hr className=""/>
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
export default Activity