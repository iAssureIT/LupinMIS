import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
// import BenificiaryName        from './BenificiaryName.js';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader                 from "../../common/Loader.js";

import 'react-table/react-table.css';
import "./ActivityReportView.css";

class ActivityReportView extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
      "activity" : {},
      "activty_ID" : this.props.match.params.id,
      "tableHeading"      : {
        beneficiaryID         : "Beneficiery ID",
        nameofbeneficiary     : "Name of Beneficieries",
        familyID              : "Family ID",
        relation              : "Relation",
        dist                  : "District",
        block                 : "Block",
        village               : "Village",
        caste                 : "Caste",
        incomeCategory        : "Income Category",
        landCategory          : "Land Category",
        specialCategory       : "Special Category",
        genderOfbeneficiary   : "Gender",
        birthYearOfbeneficiary: "Birth Year",
        isUpgraded            : "Upgraded",
        unitCost              : "Unit Cost",
        qtyPerBen             : "Quantity Per Beneficiery",
        totalCostPerBen       : "Total Cost Per Beneficiery",
        LHWRF                 : "LHWRF",
        NABARD                : "NABARD",
        bankLoan              : "Bank Loan",
        govtscheme            : "Govt",
        directCC              : "Direct CC",
        indirectCC            : "Indirect CC",
        other                 : "Other",
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        paginationApply            : false,
        downloadApply              : true,
        searchApply                : false,
      },
    }
  }
 
  handleChange(event){
    event.preventDefault();
 
  }
  componentDidMount(){
    $(".fullpageloader").show();
    $("html,body").scrollTop(0)
    axios({
      method: 'get',
      url: '/api/activityReport/'+this.state.activty_ID,
    }).then((response)=> {
    $(".fullpageloader").hide();
      // console.log("response",response.data);
      if (response.data && response.data[0]) {
        this.setState({
          "activity" :  response.data[0]
        })
      }
    }).catch((error)=> {
      console.log("error = ",error);
    });
  }

  getData(){ 
    axios({
      method: 'get',
      url: '/api/activityReport/'+this.state.activty_ID,
    }).then((response)=> {
      var tableData = response.data[0].listofBeneficiaries.map((a, i)=>{
        // console.log("a",a)
        return {
            _id                       : a._id,
            beneficiaryID             : a.beneficiaryID,
            nameofbeneficiary         : a.nameofbeneficiary,
            familyID                  : a.familyID,
            relation                  : a.relation,
            dist                      : a.dist,
            block                     : a.block,
            village                   : a.village,
            caste                     : a.caste,
            incomeCategory            : a.incomeCategory,
            landCategory              : a.landCategory,
            specialCategory           : a.specialCategory,
            genderOfbeneficiary       : a.genderOfbeneficiary,
            birthYearOfbeneficiary    : a.birthYearOfbeneficiary,
            isUpgraded                : a.isUpgraded,
            unitCost                  : a.unitCost,
            qtyPerBen                 : a.qtyPerBen,
            totalCostPerBen           : a.totalCostPerBen,
            LHWRF                     : a.sourceofFund.LHWRF,              
            NABARD                    : a.sourceofFund.NABARD,              
            bankLoan                  : a.sourceofFund.bankLoan,              
            govtscheme                : a.sourceofFund.govtscheme,              
            directCC                  : a.sourceofFund.directCC,              
            indirectCC                : a.sourceofFund.indirectCC,              
            other                     : a.sourceofFund.other,            
          }
      })
      this.setState({
        tableData : tableData,
      },()=>{
      })
    })
    .catch(function(error){      
      console.log("error = ",error); 
    });
  }

  // componentWillUnmount(){
  //     $("script[src='/js/adminLte.js']").remove();
  //     $("link[href='/css/dashboard.css']").remove();
  // }
  toglehidden()
  {
   this.setState({
       shown: !this.state.shown
      });
  }
  download(event) {
      event.preventDefault();
      $('#headerid').hide();
      // $('#editPen').hide();
      // $('#statusDiv').hide();
      // $('#btnDiv').hide();
      $('#sidebar').toggleClass('active');
      $('#headerid').toggleClass('headereffect');
      $('#dashbordid').toggleClass('dashboardeffect')
      $('#sidebar').hide();
      // $('#widgets').hide();
      $('#printButton').hide();
      // $('.button2').hide();
      $('.main-footer').hide();
      $(".box-header").hide();

      window.print();

      $('#headerid').show();
      $('#sidebar').toggleClass('active')
      $('#headerid').toggleClass('headereffect');
      $('#dashbordid').toggleClass('dashboardeffect')
      $('#sidebar').show();
      // $('#widgets').show();
      $('#printButton').show();
      // $('.button2').show();
      // $('#editPen').show();
      // $('#statusDiv').show();
      $('.main-footer').show();
      $(".box-header").show();
  }

  render() {
    return (
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper">
             <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact headingBox">
                      <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 pageSubHeader">
                        Activity Report View
                      </div>
                      {<div className="col-lg-1 col-lg-offset-5 col-md-1 col-md-offset-5">
                          <i id="printButton" onClick={this.download.bind(this)} className="fa fa-download tableDwldicons"></i>
                      </div>}
                      </div>
                      <hr className="hr-head"/>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 outerForm">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                              <h5>Activity Details</h5>
                            </div>
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Date</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity  ? moment(this.state.activity.date).format('DD-MM-YYYY') : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Program Type</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.projectCategoryType ? this.state.activity.projectCategoryType : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Project Name</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.projectName==="all" ? "-" : this.state.activity.projectName}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Sector</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sectorName ? this.state.activity.sectorName : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Activity</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.activityName ? this.state.activity.activityName : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Sub-Activity</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.subactivityName ? this.state.activity.subactivityName : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Type</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.typeofactivity ? this.state.activity.typeofactivity : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Unit</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.unit ? this.state.activity.unit : "-"}</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                              {
                                this.state.activity.typeofactivity === "Type B Activity" ?
                                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                      <div><b>No. of Beneficieries</b></div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                       <div>{this.state.activity && this.state.activity.noOfBeneficiaries ? this.state.activity.noOfBeneficiaries : 0}</div>
                                    </div>
                                  </div>
                                : null
                              }
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>District</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.district ? this.state.activity.district : "-"} </div>                  
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Block</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.block ? this.state.activity.block : "-"} </div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Village</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.village ? this.state.activity.village : "-"} </div>                  
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Location</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.location ? this.state.activity.location : "-"} </div>                  
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Unit Cost</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>
                                   {this.state.activity && this.state.activity.unitCost ? this.state.activity.unitCost : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Quantity</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.quantity ? this.state.activity.quantity : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Total Cost</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.totalCost ? this.state.activity.totalCost : "-"}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 outerForm">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                              <h5>Sources of Fund</h5>
                            </div>
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails NOpadding outerBlockclss">
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>LHWRF</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.LHWRF : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>NABARD</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.NABARD : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Bank Loan</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.bankLoan : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Govt. Scheme</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.govtscheme : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Direct CC</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.directCC : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Indirect CC</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.indirectCC : "-"} </div>                  
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt"> 
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Other</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.other : "-"}</div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 mt">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  <div><b>Total</b></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                   <div>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.total : "-"}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {
                          this.state.activity.typeofactivity !== "Type B Activity" ?
                          <div className="">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                              <h5>List of Beneficieries</h5>
                            </div>
                              <IAssureTable 
                                tableName = "List of Beneficieries"
                                id = "ListofBeneficieries"
                                tableHeading={this.state.tableHeading}
                                tableData={this.state.tableData}
                                getData={this.getData.bind(this)}
                                tableObjects={this.state.tableObjects} 
                              /> 
                           { /*<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                                                         <table id="table-to-xls" className="table customTable table-bordered table-hover table-responsive table-striped valign">
                                                           <thead>
                                                             <tr> 
                                                               <th className="textAlignLeft"> Sr No. </th> 
                                                               <th className="textAlignLeft"> Family ID</th> 
                                                               <th className="textAlignLeft"> Name of Beneficieries </th>
                                                               <th className="textAlignLeft"> Beneficiery ID </th>
                                                               <th className="textAlignLeft"> Relation </th>
                                                               <th className="textAlignLeft"> District </th>
                                                               <th className="textAlignLeft"> Block </th>
                                                               <th className="textAlignLeft"> Village </th>
                                                               <th className="textAlignLeft"> Caste </th>
                                                               <th className="textAlignLeft"> Income Category </th>
                                                               <th className="textAlignLeft"> Land Category </th>
                                                               <th className="textAlignLeft"> Special Category </th>
                                                               <th className="textAlignLeft"> Gender </th>
                                                               <th className="textAlignLeft"> Birth Year</th>
                                                               <th className="textAlignLeft"> Upgraded </th>
                                                               <th className="textAlignLeft"> Unit Cost </th>
                                                               <th className="textAlignLeft"> Quantity Per Beneficiery </th>
                                                               <th className="textAlignLeft"> Total Cost Per Beneficiery </th>
                                                               <th className="textAlignLeft"> LHWRF </th>
                                                               <th className="textAlignLeft"> NABARD </th>
                                                               <th className="textAlignLeft"> Bank Loan </th>
                                                               <th className="textAlignLeft"> Govt </th>
                                                               <th className="textAlignLeft"> Direct CC </th>
                                                               <th className="textAlignLeft"> Indirect CC </th>
                                                               <th className="textAlignLeft"> Other </th>
                                                             </tr>
                                                           </thead>
                                                           <tbody>
                                                             {this.state.activity.listofBeneficiaries && this.state.activity.listofBeneficiaries.length > 0?
                                                               this.state.activity.listofBeneficiaries.map((beneficiery,index)=>{
                                                                 return(
                                                                     <tr key={index}>
                                                                       <td className="textAlignCenter">{index+1}</td>
                                                                       <td>{beneficiery.familyID}</td>
                                                                       <td>{beneficiery.nameofbeneficiary}</td>
                                                                       <td>{beneficiery.beneficiaryID}</td>
                                                                       <td>{beneficiery.relation}</td>
                                                                       <td>{beneficiery.dist}</td>
                                                                       <td>{beneficiery.block}</td>
                                                                       <td>{beneficiery.village}</td>
                                                                       <td>{beneficiery.caste}</td>                     
                                                                       <td>{beneficiery.incomeCategory}</td>            
                                                                       <td>{beneficiery.landCategory}</td>              
                                                                       <td>{beneficiery.specialCategory}</td>           
                                                                       <td>{beneficiery.genderOfbeneficiary}</td>       
                                                                       <td>{beneficiery.birthYearOfbeneficiary}</td>    
                                                                       <td>{beneficiery.isUpgraded}</td>                
                                                                       <td>{beneficiery.unitCost}</td>                  
                                                                       <td>{beneficiery.qtyPerBen}</td>                 
                                                                       <td>{beneficiery.totalCostPerBen}</td>           
                                                                       <td>{beneficiery.sourceofFund.LHWRF}</td>              
                                                                       <td>{beneficiery.sourceofFund.NABARD}</td>              
                                                                       <td>{beneficiery.sourceofFund.bankLoan}</td>              
                                                                       <td>{beneficiery.sourceofFund.govtscheme}</td>              
                                                                       <td>{beneficiery.sourceofFund.directCC}</td>              
                                                                       <td>{beneficiery.sourceofFund.indirectCC}</td>              
                                                                       <td>{beneficiery.sourceofFund.other}</td>              
                                                                     </tr>
                                                                   )
                                                               })  
                                                               :
                                                               null
                                                             }
                                                            
                                                           </tbody>
                                                         </table>
                                                       </div>*/}
                          </div>
                          :null
                        }
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
export default ActivityReportView;