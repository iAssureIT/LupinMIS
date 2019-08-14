import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $                    from 'jquery';
import axios                  from 'axios';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import EMPReport            from "../../admin/LupinReports/EMPReport.js";

import "../Reports/Reports.css";
class SDGReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10,
        "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : '',
                    mergedColoums : 1
                }, 
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : 'Details of Activity contributing SDG',
                    mergedColoums : 5
                },
                {
                    heading : 'Financial Sharing "Rs"',
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : {
            "yghj"    : 'SDGs',
            "dgfg"    : 'Activity',
            "ertr"    : 'Unit',
            "abcf"    : 'Quantity',
            "ghgh"    : 'Amount',
            "abui"    : 'Beneficiaries',
            "hgfh"    : 'LHWRF',
            "hffg"    : 'NABARD',
            "tert"    : 'Bank Loan',
            "ouio"    : 'Direct Community  Contribution',
            "jshk"    : 'Indirect Community  Contribution',
            "khjk"    : 'Govt',
            "kgkk"    : 'Others',
        
        },
    }
    
        window.scrollTo(0, 0);
  }
  componentDidMount(){
    this.getAvailableSectors()
    this.getDistrict();
  }
  componentDidMount(){
    this.getState();
    this.getAvailableCenters();
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
        
        this.setState({
          availableCenters : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }   
  getState(){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/states/get/list/IN',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofStates : response.data
        },()=>{
        // console.log('listofStates', this.state.listofStates);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectState(event){
    event.preventDefault();
    var selectedState = event.target.value;
    this.setState({
      state : selectedState,
    },()=>{
      var stateCode = this.state.state.split('|')[1];
      // console.log('state', stateCode);
      this.setState({
        stateCode :stateCode
      },()=>{
      console.log('stateCode',this.state.stateCode);
      this.getDistrict(this.state.stateCode);
      })
    });
    this.handleChange(event);
  }
  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentComp,
    })
  }
  selectReportPath(e){
    this.props.history.push(`/${e.target.value}`);
   /* e.preventDefault();
    var selectedReport = e.target.value;
    this.setState({
      selectedReport : selectedReport,
    },()=>{
      console.log('selectedReport',this.state.selectedReport);
      })*/
  }
  
  render(){

    return(
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Reports                   
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                      {console.log("sdasd" , this.value)}
                        <label className="formLable">Select Report</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="report" >
                          <select className="custom-select form-control inputBox" ref="report" name="report" value={this.state.report}  onChange={this.selectReportPath.bind(this)} >
                            <option className="hidden" >-- Select --</option>
                            <option className="formLable" value="activitywise-annual-completion-report">Activity wise Annual Completion Report</option>
                            <option className="formLable" value="sector-wise-annual-completion-summary-report">Sector wise Annual Completion Summary Report</option>
                            <option className="formLable" value="activity-wise-periodic-variance-report">Activity wise Periodic Variance Report (Physical & Financial)</option>
                            <option className="formLable" value="sectorwise-periodic-variance-summary-report">Sector wise Periodic Variance Summary Report</option>
                            <option className="formLable" value="activity-wise-periodic-physical-variance-report">Activity wise Periodic Physical Variance Report</option>
                            <option className="formLable" value="geographical-report">Geographical Report</option>
                            <option className="formLable" value="villagewise-family-report">Villagewise Family Report</option>
                            <option className="formLable" value="category-wise-report">Category wise Report</option>
                            <option className="formLable" value="upgraded-beneficiary-report">Upgraded Beneficiary Report</option>
                            <option className="formLable" value="SDG-report">SDG Report</option>
                            <option className="formLable" value="ADP-report">ADP Report</option>
                            <option className="formLable" value="EMP-report">EMP Report</option>
                            
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                      </div>                     
                    </div>                    
                        {/*<div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                          <Link href="this.state.selectedReport"><EMPReport/></Link>
                        </div> */}                    
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
export default SDGReport
{/*https://reactstrap.github.io/components/dropdowns/*/}