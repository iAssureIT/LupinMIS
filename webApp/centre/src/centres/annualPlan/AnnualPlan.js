import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";

import 'react-table/react-table.css';
import "./AnnualPlan.css";

class AnnualPlan extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      "year"                :"",
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
      "shown"               : true,
      "uID"                 :"",
      "month"               :"",
      "Months"              :["January","February","March","April","May","June","July","August","September","October","November","December"],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {}
    }
    this.changeTab = this.changeTab.bind(this); 
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "year"                : this.refs.year.value,          
      "month"                : this.refs.month.value,          
    /*  "center"              : this.refs.center.value,
      "sector_id"           : this.refs.sector_id.value,*/
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
    console.log('nextProps',nextProps);
    if(nextProps.BasicInfoId){
       if(nextProps.BasicInfoId.academicsInfo&&nextProps.BasicInfoId.academicsInfo.length>0){
        this.setState({
         academicData:nextProps.BasicInfoId.academicsInfo
        })
      }
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
  SubmitAnnualPlan(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    // if (this.validateForm()) {
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
    fields["year"] = "";
    fields["month"] = "";
    // fields["center"] = "";
    // fields["sector_id"] = "";
    fields["sectorName"] = "";
    fields["activity"] = "";
    fields["physicalUnit"] = "";
    fields["unitCost"] = "";
    fields["totalBudget"] = "";
    fields["noOfBeneficiaries"] = "";
    fields["LHWRF"] = "";
    fields["NABARD"] = "";
    fields["bankLoan"] = "";
    fields["govtscheme"] = "";
    fields["directCC"] = "";
    fields["indirectCC"] = "";
    fields["other"] = "";
    fields["remark"] = "";
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
      axios
      .post('https://jsonplaceholder.typicode.com/posts',{annualPlanValues})
      .then(function(response){
        console.log(response);
      })
      .catch(function(error){
        console.log(error);
      });
      console.log("annualPlanValues =>",annualPlanValues);
      academicArray.push(annualPlanValues);
      console.log("add value",annualPlanValues);      
      alert("Data inserted Successfully!")
      // }
    }
    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    toglehidden()
    {
     this.setState({
         shown: !this.state.shown
        });
    }

    changeTab = (data)=>{
      this.setState({
        tabtype : data,
      })
      console.log("tabtype",this.state.tabtype);
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
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'SDG Goal',
        accessor: 'FamilyID', 
        }, {
        Header: 'Sector',
        accessor: 'NameofBeneficiary', 
        }, {
        Header: 'Activity',
        accessor: 'noMAp', 
        },{
        Header: 'Sub-Activity',
        accessor: 'noMAp', 
        },{
        Header: 'Quantity',
        accessor: 'noMAp', 
        },{
        Header: 'Amount',
        accessor: 'noMAp', 
        },{
        Header: 'Beneficiary',
        accessor: 'noMAp', 
        },{
        Header: "Financial Sharing",
        columns: [
        {
          Header: "LHWRF",
          accessor: "LHWRF"
        },
        {
          Header: "NABARD",
          accessor: "NABARD"
        },{
          Header: "Bank Loan",
          accessor: "BankLoan"
        },{
          Header: "Govt",
          accessor: "BankLoan"
        },{
          Header: "Direct Beneficiary",
          accessor: "BankLoan"
        },{
          Header: "Indirect Beneficiary",
          accessor: "BankLoan"
        },
        ]
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
                                <option className="" >All Months</option>
                               {this.state.Months.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                              <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                                <option className="hidden" >-- Select Year --</option>
                               {this.state.Year.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.year}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 " >
                              <div className="addContainerAct col-lg-6 pull-right" id="click_advance"  onClick={this.toglehidden.bind(this)}><div className="display_advance" id="display_advance"><i class="fa fa-plus" aria-hidden="true" id="click"></i></div></div>
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
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Sub-Activity </label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subActivity" >
                                <select className="custom-select form-control inputBox" ref="subActivity" name="subActivity"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--select--</option>
                                  <option>Value 1</option>
                                  <option>Value 2</option>
                                  <option>Value 3</option>
                                  <option>Value 4</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Unit</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="CollegeName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts" name="unit" placeholder="" ref="unit" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.unit}</div>
                            </div>
                            <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Physical Units</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="physicalUnit" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts" name="physicalUnit" placeholder="" ref="physicalUnit"  value={this.state.physicalUnit} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.physicalUnit}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
 
                            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Unit Cost</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="unitCost" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts" name="unitCost" placeholder="" ref="unitCost"  value={this.state.unitCost} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.unitCost}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                              <label className="formLable">Total Cost</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="totalBudget" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts" name="totalBudget" placeholder=""ref="totalBudget" value={this.state.totalBudget}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.totalBudget}</div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">No. of Beneficiaries</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="UniversityName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts" name="noOfBeneficiaries" placeholder=""ref="noOfBeneficiaries" value={this.state.noOfBeneficiaries} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.noOfBeneficiaries}</div>
                            </div>
                             
                          </div> 
                        </div><br/>
                        <div className="col-lg-12 ">
                           <h4 className="pageSubHeader">Financial Sources  </h4>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-md-3 col-sm-6 col-xs-12 ">
                              <label className="formLable">LHWRF</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRF" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts" name="LHWRF" placeholder="" ref="LHWRF"  value={this.state.LHWRF}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.LHWRF}</div>
                            </div>
                            <div className=" col-md-3 col-sm-6 col-xs-12 ">
                              <label className="formLable">NABARD</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="NABARD" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts" name="NABARD" placeholder="" ref="NABARD" value={this.state.NABARD} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.NABARD}</div>
                            </div><div className=" col-md-3 col-sm-6 col-xs-12 ">
                              <label className="formLable">Bank Loan</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="bankLoan" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox nameParts" name="bankLoan" placeholder=""ref="bankLoan" value={this.state.bankLoan} onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.bankLoan}</div>
                            </div>
                            <div className=" col-md-3 col-sm-6 col-xs-12 ">
                              <label className="formLable">Govt. Schemes</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="govtscheme" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts" name="govtscheme" placeholder="" ref="govtscheme"  value={this.state.govtscheme}    onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.govtscheme}</div>
                            </div>
                            
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Direct Community Contribution</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="directCC" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>
                                */}<input type="text" className="form-control inputBox nameParts" name="directCC" placeholder="" ref="directCC" value={this.state.directCC}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.directCC}</div>
                            </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Indirect Community Contribution</label>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="indirectCC" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>
                                */}<input type="text" className="form-control inputBox nameParts" name="indirectCC" placeholder=""ref="indirectCC" value={this.state.indirectCC}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.indirectCC}</div>
                            </div>
                            <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="formLable">Other</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="other" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts" name="other" placeholder="" ref="other"  value={this.state.other}    onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.other}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                          <label className="formLable">Remark</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="remark" >
                            {/*<div className="input-group-addon inputIcon">
                             <i className="fa fa-building fa iconSize14"></i>
                            </div>*/}
                            <input type="text"   className="form-control inputBox nameParts" name="remark" placeholder="" ref="remark"  value={this.state.remark}  onChange={this.handleChange.bind(this)}/>
                          </div>
                          <div className="errorMsg">{this.state.errors.remark}</div>
                        </div>
                        <div className="col-lg-12">
                         <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitAnnualPlan.bind(this)}> Submit</button>
                        </div>
                      </form>
                    </div>
                    <div className="AnnualHeadCont">
                      <div className="annualHead"><h5>Annual Plan of { this.state.year !=="-- Select Year --" ? this.state.year : null}</h5> 
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >  
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
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default AnnualPlan