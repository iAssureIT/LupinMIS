import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 

import "./Activity.css";
import NewBeneficiary from "../addBeneficiary/NewBeneficiary.js";

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
      "village"           : "",
      "Date"              : "",
      "sector"            : "",
      "typeofactivity"    : "",
      "nameofactivity"    : "",
      "activity"          : "",
      "subactivity"       : "",
      "unit"              : "",
      "unitCost"          : "",
      "quantity"          : "",
      "totalcost"         : "",
      "bankLoan"            : "",
      "govtscheme"          : "",
      "directCC"            : "",
      "indirectCC"          : "",
      "other"               : "",
      "total"               : "",
      shown               : true,
      fields: {},
      errors: {}
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
      "Date"              : this.refs.dateOfIntervention.value,
      "sector"            : this.refs.sector.value,
      "typeofactivity"    : this.refs.typeofactivity.value,
      // "nameofactivity"    : this.refs.nameofactivity.value,
      "activity"          : this.refs.activity.value,
      "subactivity"       : this.refs.subactivity.value,
      // "unit"              : this.refs.unit.value,
      "unitCost"          : this.refs.unitCost.value,
      "quantity"          : this.refs.quantity.value,
/*      "totalcost"         : this.state.totalcost,
*/    "bankLoan"          : this.refs.bankLoan.value,
      "govtscheme"        : this.refs.govtscheme.value,
      "directCC"          : this.refs.directCC.value,
      "indirectCC"        : this.refs.indirectCC.value,
      "other"             : this.refs.other.value,
      // "total"             : this.refs.total.value,
    });
    var total = parseInt(this.state.unitCost) * parseInt(this.state.quantity)
    this.setState({
      "totalcost" : total
    })
    console.log(this.state.totalcost);
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
  isTextKey(evt)
  {
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
  SubmitActivity(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    // if (this.validateForm()) {
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
      "unit"              : this.state.unit,
      "unitCost"          : this.refs.unitCost.value,
      "quantity"          : this.refs.quantity.value,
      "totalcost"         : this.state.totalcost,
      "bankLoan"          : this.refs.bankLoan.value,
      "govtscheme"        : this.refs.govtscheme.value,
      "directCC"          : this.refs.directCC.value,
      "indirectCC"        : this.refs.indirectCC.value,
      "other"             : this.refs.other.value,
      "total"             : this.state.total,
    };

    let fields = {};
    fields["centerName"] = "";
    fields["dist"] = "";
    fields["block"] = "";
    fields["village"] = "";
    fields["Date"] = "";
    fields["sector"] = "";
    fields["typeofactivity"] = "";
    fields["nameofactivity"] = "";
    fields["activity"] = "";
    fields["subactivity"] = "";
    fields["unit"] = "";
    fields["unitCost"] = "";
    fields["quantity"] = "";
    fields["totalcost"] = "";
    this.setState({
      "center_id"         : "",
      "centerName"        : "",
      "dist"              : "",
      "block"             : "",
      "village"           : "",
      "Date"              : "",
      "sector"            : "",
      "typeofactivity"    : "",
      "nameofactivity"    : "",
      "activity"          : "",
      "subactivity"       : "",
      "unit"              : "",
      "unitCost"          : "",
      "quantity"          : "",
      "totalcost"         : "",
      "bankLoan"          : "",
      "govtscheme"        : "",
      "directCC"          : "",
      "indirectCC"        : "",
      "other"             : "",
      "total"             : "",
      fields:fields
    });
    
    axios.post('/api/activityReport/', activityValues)
      .then( (res)=>{
        console.log(res);
        if(res.status == 201){
          alert("Data inserted Successfully!")
            this.refs.dist.value = '';
            this.refs.block.value = '';
            this.refs.village.value = '';
            this.refs.dateOfIntervention.value = '';
            this.refs.sector.value = '';
            this.refs.typeofactivity.value = '';
            this.refs.activity.value = '';
            this.refs.subactivity.value = '';
            this.state.unit = '';
            this.refs.unitCost.value = '';
            this.refs.quantity.value = '';
            this.state.totalcost = '';
            this.refs.bankLoan.value = '';
            this.refs.govtscheme.value = '';
            this.refs.directCC.value = '';
            this.refs.indirectCC.value = '';
            this.refs.other.value = '';
            this.state.total = '';
        }
      })
      .catch((error)=>{
        console.log("error = ",error);
        alert("Something went wrong! Please check Get URL.");
      });
      console.log("academicValues =>",activityValues);
      academicArray.push(activityValues);
      console.log("add value",activityValues);      
      alert("Data inserted Successfully!")
      // }
    }

    calTotal(event){
      event.preventDefault();
      var LHWRF = this.state.LHWRF;
      var NABARD = this.state.NABARD;
      var bankLoan = this.state.bankLoan;
      var govtscheme = this.state.govtscheme;
      var directCC = this.state.directCC;
      var indirectCC = this.state.indirectCC;
       add = LHWRF + NABARD + bankLoan + govtscheme + directCC +indirectCC;
      console.log("total=",add);
    }

    toglehidden()
    {
     this.setState({
       shown: !this.state.shown
      });
    }

    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    render() {
      var shown = {
        display: this.state.shown ? "block" : "none"
      };
      
      var hidden = {
        display: this.state.shown ? "none" : "block"
      }
    
      const data = [{
      srno: 1,
      FamilyID: "L000001",
      NameofBeneficiary: "Priyanka Lewade",
      BeneficiaryID: "PL0001",
      },{
      srno: 2,
      FamilyID: "B000001",
      NameofBeneficiary: "Priyanka Bhanvase",
      BeneficiaryID: "PB0001",
      }
      ]
      const columns = [ 
      {
        Header: ' ',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-3">
              <div className=" col-lg-offset-1 checkActivityContainer">
                <input type="checkbox" name="check1" id="sameCheck" />
              <span className="Activitycheckmark"></span>
              </div>
            </div>
            )     
          },
        {
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'Family ID',
        accessor: 'FamilyID', 
        }, 
        {
        Header: 'Name of Beneficiary',
        accessor: 'NameofBeneficiary', 
        }, 
        {
        Header: 'Beneficiary ID',
        accessor: 'BeneficiaryID', 
        },
        {
        Header: 'Action',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-3">
              <div className="col-lg-6" onClick={() => this.deleteData(row.original)}>
            <i className="fa fa-trash"> </i>
              </div>
             
            </div>
            )     
          }
        ]
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
                       <h4 className="pageSubHeader">Activity Report</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                        
                        <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Date of intervention</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateOfIntervention" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="date" className="form-control inputBox toUpper"  placeholder="" name="dateOfIntervention" ref="dateOfIntervention"  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.dateOfIntervention}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">District</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="dist" >
                              <select className="custom-select form-control inputBox" ref="dist" name="dist" value={this.state.dist} onChange={this.handleChange.bind(this)} >
                                <option  className="hidden" >--select--</option>
                                <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                                <option>Value 4</option>
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.dist}</div>
                          </div>
                        <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Block</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                            <select className="custom-select form-control inputBox" ref="block" name="block"  value={this.state.block} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                                <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                                <option>Value 4</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                       <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <label className="formLable">Village</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                            <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                               <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                                <option>Value 4</option>
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
                            <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                              <option>Value 1</option>
                              <option>Value 2</option>
                              <option>Value 3</option>
                              <option>Value 4</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.sector}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Type of Activity</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeofactivity" >
                            <select className="custom-select form-control inputBox" ref="typeofactivity" name="typeofactivity" value={this.state.typeofactivity} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                               <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                                <option>Value 4</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.typeofactivity}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Activity</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                            <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                                <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                                <option>Value 4</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.activity}</div>
                        </div>
                         <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                          <label className="formLable">Sub-Activity</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                            <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >--select--</option>
                                <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                                <option>Value 4</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.subactivity}</div>
                        </div>
                        
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                          <div className="unit" id="" >
                          <label className="formLable">Unit :</label>
                          </div>
                          <div className="errorMsg">{this.state.errors.unit}</div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <label className="formLable">Unit Cost</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="unitCost" >
                            {/*<div className="input-group-addon inputIcon">
                             <i className="fa fa-building fa iconSize14"></i>
                            </div>*/}
                            <input type="text"   className="form-control inputBox nameParts" name="unitCost" placeholder="" ref="unitCost" value={this.state.unitCost}   onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.unitCost}</div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                          <label className="formLable">Quantity</label>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="quantity" >
                            {/*<div className="input-group-addon inputIcon">
                             <i className="fa fa-university fa iconSize14"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts" name="quantity" placeholder=""ref="quantity" value={this.state.quantity}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.quantity}</div>
                        </div>
                         <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                          <div className="unit " id="PassoutYear" >
                            <label className="formLable">Total Cost of Activity : {this.state.totalcost}</label>

                          </div>
                          <div className="errorMsg">{this.state.errors.totalcost}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 ">
                       <hr className="hr-head"/>
                    </div>
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Sources of Fund</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">LHWRF</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRF" >
                          
                            <input type="text"   className="form-control inputBox nameParts" name="LHWRF" placeholder="" ref="LHWRF" onKeyUp={this.calTotal.bind(this)} value={this.state.LHWRF}    onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.LHWRF}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">NABARD</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="NABARD" >
                            
                            <input type="text" className="form-control inputBox nameParts" name="NABARD" placeholder=""ref="NABARD" onKeyUp={this.calTotal.bind(this)} value={this.state.NABARD}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.NABARD}</div>
                        </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Bank Loan</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="bankLoan" >
                          
                            <input type="text" className="form-control inputBox nameParts" name="bankLoan" placeholder=""ref="bankLoan"  onKeyUp={this.calTotal.bind(this)}  value={this.state.bankLoan}  onChange={this.handleChange.bind(this)}/>
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
                            {/*<div className="input-group-addon inputIcon">
                             <i className="fa fa-building fa iconSize14"></i>
                            </div>*/}
                            <input type="text"   className="form-control inputBox nameParts" name="govtscheme" placeholder="" ref="govtscheme"  onKeyUp={this.calTotal.bind(this)}   value={this.state.govtscheme}    onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.govtscheme}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Direct Beneficiary Contribution</label>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="directCC" >
                            {/*<div className="input-group-addon inputIcon">
                             <i className="fa fa-university fa iconSize14"></i>
                            </div>directCC
                            */}<input type="text" className="form-control inputBox nameParts" name="directCC" placeholder=""ref="directCC"  onKeyUp={this.calTotal.bind(this)}  value={this.state.directCC}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.directCC}</div>
                        </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Indirect Beneficiary Contribution</label>
                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="indirectCC" >
                            {/*<div className="input-group-addon inputIcon">
                             <i className="fa fa-university fa iconSize14"></i>
                            </div>
                            */}<input type="text" className="form-control inputBox nameParts" name="indirectCC" placeholder=""ref="indirectCC" onKeyUp={this.calTotal.bind(this)}  value={this.state.indirectCC}  onChange={this.handleChange.bind(this)}/>
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
                          
                            <input type="text"   className="form-control inputBox nameParts" name="other" placeholder="" ref="other"  onKeyUp={this.calTotal.bind(this)}   value={this.state.other}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.other}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <div className="unit" id="total" >
                            <label className="formLable">Total :</label>

                          </div>
                          <div className="errorMsg">{this.state.errors.total}</div>
                        </div>
                        
                      </div> 
                    </div><br/>
                                           
                    <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                       <hr className="hr-head"/>
                    </div>
                    <div className="col-lg-12 col-sm-12 col-xs-12" >
                      <div className="row">
                        <h4 className="pageSubHeader col-lg-6 col-sm-6 col-xs-6 ">List of Beneficiaries</h4>
                        <div className="addContainerAct col-lg-6 pull-right mr30" data-toggle="modal" data-target="#myModal"> <i class="fa fa-plus" aria-hidden="true"></i></div>
                         <div className="modal fade in " id="myModal" role="dialog">
                          <div className="modal-dialog modal-lg " >
                            <div class="modal-content ">
                              <div class=" ">
                                <div className="col-lg-12  col-md-10 pageContent margTop">
                                  <button type="button" class="close" data-dismiss="modal"> <i class="fa fa-times"></i></button>
                                  <form id="form">
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
                                              <option>Value 1</option>
                                              <option>Value 2</option>
                                              <option>Value 3</option>
                                              <option>Value 4</option>
                                            </select>
                                          </div>
                                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                                        </div>
                                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                                          <label className="formLable">Block</label>
                                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                              <option  className="hidden" >--select--</option>
                                              <option>Value 1</option>
                                              <option>Value 2</option>
                                              <option>Value 3</option>
                                              <option>Value 4</option>
                                            </select>
                                          </div>
                                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                                        </div>
                                        <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                                          <label className="formLable">Village</label>
                                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                                            <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel" onChange={this.handleChange.bind(this)} >
                                              <option  className="hidden" >--select--</option>
                                              <option>Value 1</option>
                                              <option>Value 2</option>
                                              <option>Value 3</option>
                                              <option>Value 4</option>
                                            </select>
                                          </div>
                                          <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                                        </div>
                                      </div>
                                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight row">
                                        <div className=" col-lg-6 col-sm-12 col-xs-12 col-lg-offset-3 formLable boxHeightother ">
                                          <label className="formLable">Search</label>
                                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                            <input type="text"  className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                                          </div>
                                        </div>
                                         <div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1  boxHeightother">
                                          <div className="col-lg-12 col-sm-12 col-xs-12 mt23" >
                                            <div className="addContainerAct col-lg-6 pull-right" id="click_advance"  onClick={this.toglehidden.bind(this)}><div className="display_advance" id="display_advance"><i class="fa fa-plus" aria-hidden="true" id="click"></i></div></div>
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
                                            <input type="text"  className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-4 col-sm-12 col-xs-12 formLable boxHeightother ">
                                          <label className="formLable">Beneficiary ID</label>
                                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                            <input type="text"  className="form-control inputBox nameParts" name="UniversityName" placeholder=""ref="UniversityName"   onChange={this.handleChange.bind(this)}/>
                                          </div>
                                        </div>
                                      </div>
                                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeightother ">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt " >  
                                          <ReactTable 
                                            data            = {data}
                                            columns         = {columns}
                                            sortable        = {true}
                                            defaultPageSiz  = {5}
                                            minRows         = {3} 
                                            className       = {"-striped -highlight"}
                                            showPagination  = {true}
                                          />
                                          </div> 
                                      </div>
                                      <div className="col-lg-12">
                                          <br/><button className=" col-lg-2 btn submit pull-right" > Add</button>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tableContainrer">
                      <NewBeneficiary />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitActivity.bind(this)}> Submit</button>
                    </div> 
                  </form>
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