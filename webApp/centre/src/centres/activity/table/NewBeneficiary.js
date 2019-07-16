import React, { Component }   from 'react';
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
      "center_id"         : "",
      "centerName"        : "",
      "dist"              : this.refs.dist.value,
      "block"             : this.refs.block.value,
      "village"           : this.refs.village.value,
      "date"              : this.refs.date.value,
      "sector"            : this.refs.sector.value,
      "typeofactivity"    : this.refs.typeofactivity.value,
      "activity"          : this.refs.activity.value,
      "subactivity"       : this.refs.subactivity.value,
      "unit"              : this.state.unit.value,
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

    });
 
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  }
  componentDidMount() {
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getData(this.state.startRange, this.state.limitRange);
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
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
/*

  SubmitActivity(event){
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()) {
    var id2 = this.state.uID;
    var activityValues= 
    {
      "center_ID"         : "123",
      "centerName"        : "Pune",
      "district"          : this.refs.dist.value,
      "block"             : this.refs.block.value,
      "village"           : this.refs.village.value,
      "date"              : this.refs.dateOfIntervention.value,
      "sectorName"        : this.refs.sector.value,
      "sector_ID"         : this.refs.sector.value,
      "typeofactivity"    : this.refs.typeofactivity.value,
      "activity_ID"       : this.refs.activity.value,
      "activityName"      : this.refs.activity.value,
      "subactivity_ID"    : this.refs.subactivity.value,
      "subactivityName"   : this.refs.subactivity.value,
      "unit"              : this.state.unit,
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
      "remark"            : this.state.remark,
      "listofBeneficiaries": this.state.listofBeneficiaries
    };

    let fields                  = {};
    fields["dist"]              = "";
    fields["block"]             = "";
    fields["village"]           = "";
    fields["dateOfIntervention"]= "";
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
    this.setState({
      "dist"              : "",
      "block"             : "",
      "village"           : "",
      "dateOfIntervention": "",
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
      fields:fields
    });
    axios.post('/api/activityReport',activityValues)
      .then(function(response){
        swal({
          title : response.data.message,
          text  : response.data.message,
        });
      this.getData(this.state.startRange, this.state.limitRange);      
      })
      .catch(function(error){        
      });
    }
  }
  Update(event)
  {
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()) {
    var id2 = this.state.uID;
    var activityValues= 
    {
      // "center_id"         : this.refs.QualificationLevel.value,
      // "centerName"        : this.refs.centerName.value,
      "dist"              : this.refs.dist.value,
      "block"             : this.refs.block.value,
      "village"           : this.refs.village.value,
      "Date"              : this.refs.dateOfIntervention.value,
      "sector"            : this.refs.sector.value,
      "typeofactivity"    : this.refs.typeofactivity.value,
      "activity"          : this.refs.activity.value,
      "subactivity"       : this.refs.subactivity.value,
      // "unit"              : this.state.unit,
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
    };

    let fields                  = {};
    fields["dist"]              = "";
    fields["block"]             = "";
    fields["village"]           = "";
    fields["dateOfIntervention"]= "";
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
    this.setState({
      "dist"              : "",
      "block"             : "",
      "village"           : "",
      "dateOfIntervention": "",
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
      fields:fields
    });
    axios.patch('/api/activityReport',activityValues)
      .then(function(response){
        swal({
          title : response.data.message,
          text  : response.data.message,
        });
      this.getData(this.state.startRange, this.state.limitRange);      
      })
      .catch(function(error){        
      });
    }
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
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
      if (!fields["dateOfIntervention"]) {
        formIsValid = false;
        errors["dateOfIntervention"] = "This field is required.";
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
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  

  edit(id){
    axios({
      method: 'get',
      url: '/api/activityReport/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      this.setState({
        "dist"              : editData.dist,
        "block"             : editData.block,
        "village"           : editData.village,
        "Date"              : editData.Date,
        "sector"            : editData.sector,
        "typeofactivity"    : editData.typeofactivity,
        "activity"          : editData.activity,
        "subactivity"       : editData.subactivity,
        // "unit"              : editData.dist,
        "unitCost"          : editData.unitCost,
        "quantity"          : editData.quantity,
        "totalcost"         : editData.totalcost,
        "LHWRF"             : editData.LHWRF,
        "NABARD"            : editData.NABARD,
        "bankLoan"          : editData.bankLoan,
        "govtscheme"        : editData.govtscheme,
        "directCC"          : editData.directCC,
        "indirectCC"        : editData.indirectCC,
        "other"             : editData.other,
        "total"             : editData.total,
      });
    }).catch(function (error) {
    });
  }*/

  getData(startRange, limitRange){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.get('/api/beneficiaries/list',data)
    .then((response)=>{
      console.log('response beneficiaries', response.data);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
  }

  // componentWillReceiveProps(nextProps){
  //   var editId = nextProps.match.params.id;
  //   if(nextProps.match.params.id){
  //     this.setState({
  //       editId : editId
  //     })
  //     this.edit(editId);
  //     this.getData(this.state.startRange, this.state.limitRange);
  //   }
  // }
  


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
    // console.log("",this.state.Date)
    return (
        <div className="col-lg-12 col-sm-12 col-xs-12" >
          <div className="row">
            <h4 className="pageSubHeader col-lg-6 col-sm-6 col-xs-6 ">List of Beneficiaries</h4>
           {/* <div className="addContainerAct col-lg-6 pull-right mr30" data-toggle="modal" data-target="#myModal"> <i className="fa fa-plus" aria-hidden="true"></i></div>
             <div className="modal fade in " id="myModal" role="dialog">
              <div className="modal-dialog modal-lg " >
                <div className="modal-content ">*/}
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
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
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
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
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
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                          </div>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight row">
                            <div className=" col-lg-6 col-sm-12 col-xs-12 col-lg-offset-3 formLable boxHeightother ">
                              <label className="formLable">Search</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                             <div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1  boxHeightother">
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt23" >
                                <div className="addContainerAct col-lg-6 pull-right" id="click_advance"  onClick={this.toglehidden.bind(this)}><div className="display_advance" id="display_advance"><i className="fa fa-plus" aria-hidden="true" id="click"></i></div></div>
                              </div>
                            </div>
                          </div> 
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight " style={hidden}>
                             <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 formLable boxHeightother">
                              <label className="formLable">Family ID </label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>L000001</option>
                                  <option>B000001</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                            <div className=" col-lg-4 col-sm-12 col-xs-12 formLable boxHeightother ">
                              <label className="formLable">Beneficiary Name</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
                            </div>
                            <div className=" col-lg-4 col-sm-12 col-xs-12 formLable boxHeightother ">
                              <label className="formLable">Beneficiary ID</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                <input type="text"  className="form-control inputBox" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                              </div>
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
                              />
                            </div>
                          </div> 
                        </div>
                        <div className="col-lg-12">
                            <br/><button className=" col-lg-2 btn submit pull-right" > Add</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
           /* </div>
          </div>
        </div>*/
    );
  }
}
export default NewBeneficiary