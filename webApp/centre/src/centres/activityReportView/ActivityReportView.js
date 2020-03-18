import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactHTMLTableToExcel  from 'react-html-table-to-excel';
import ReactTable             from "react-table";
import moment                 from "moment";
import BenificiaryName        from './BenificiaryName.js';
import Loader                 from "../../common/Loader.js";

import 'react-table/react-table.css';
import "./ActivityReportView.css";

class ActivityReportView extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      "activity" : {},
      "activty_ID" : this.props.match.params.id 
     
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
      console.log("response",response.data);
      if (response.data && response.data[0]) {
        this.setState({
          "activity" :  response.data[0]
        })
      }
    }).catch((error)=> {
      console.log("error = ",error);
    });

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
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
                        <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                          Activity Report View
                        </div>
                       <hr className="hr-head"/>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>Activity Details</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails NOpadding outerBlockclss ">
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Date</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity  ? moment(this.state.activity.createdAt).format('DD-MM-YYYY') : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Sector</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sectorName ? this.state.activity.sectorName : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Activity</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.activityName ? this.state.activity.activityName : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Sub-Activity</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.subactivityName ? this.state.activity.subactivityName : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Type</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.typeofactivity ? this.state.activity.typeofactivity : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>District</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.district ? this.state.activity.district : "-"} </p>                  
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails NOpadding">
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Block</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.block ? this.state.activity.block : "-"} </p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Village</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.village ? this.state.activity.village : "-"} </p>                  
                             
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Unit</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.unit ? this.state.activity.unit : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Unit Cost</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.unitCost ? this.state.activity.unitCost : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Quantity</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.quantity ? this.state.activity.quantity : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Total Cost</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.totalcost ? this.state.activity.totalcost : "-"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>Sources of Fund</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails NOpadding outerBlockclss">
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>LHWRF</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.LHWRF : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>NABARD</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.NABARD : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Bank Loan</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.bankLoan : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Govt. Scheme</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.govtscheme : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Direct CC</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.directCC : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Indirect CC</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.indirectCC : "-"} </p>                  
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails NOpadding ">
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Other</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.other : "-"}</p>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                            <p><b>Total</b></p>
                          </div>
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                             <p>{this.state.activity && this.state.activity.sourceofFund ? this.state.activity.sourceofFund.total : "-"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>List of Beneficieries</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <table id="table-to-xls" className="table customTable table-bordered table-hover table-responsive table-striped valign">
                          <thead>
                            <tr> 
                              <th className="text-center"> Sr No. </th> 
                              <th className="text-center"> Family ID</th> 
                              <th className="text-center"> Name of Beneficieries </th>
                              <th className="text-center"> Beneficiery ID </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.activity.listofBeneficiaries && this.state.activity.listofBeneficiaries.length > 0?
                              this.state.activity.listofBeneficiaries.map((beneficiery,index)=>{
                                return(
                                    <tr key={index}>
                                      <td>{index+1}</td>
                                      <td>{beneficiery.familyID}</td>
                                      <td><BenificiaryName beni_ID={beneficiery.beneficiary_ID} /></td>
                                      <td>{beneficiery.beneficiaryID}</td>
                                    </tr>
                                  )
                              })  
                              :
                              null
                            }
                           
                          </tbody>
                        </table>
                        </div>
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