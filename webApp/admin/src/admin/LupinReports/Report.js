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
import Report1                                    from "../../admin/LupinReports/ActivitywiseAnnualCompletionReport.js";
import Report2                                    from "../../admin/LupinReports/SectorwiseAnnualCompletionSummaryReport.js";
import Report3                                    from "../../admin/LupinReports/ActivityWisePeriodicVarianceReport.js";
import Report4                                    from "../../admin/LupinReports/SectorwisePeriodicVarianceSummaryReport.js";
import Report5                                    from "../../admin/LupinReports/ActivitywisePeriodicPhysicalVarianceReport.js";
import Report6                                    from "../../admin/LupinReports/GeographicalReport.js";
import Report7                                    from "../../admin/LupinReports/VillagewisefamilyReport.js";
import Report8                                    from "../../admin/LupinReports/CategorywiseReport.js";
import Report9                                    from "../../admin/LupinReports/UpgradedBeneficiaryReport.js";
import Report10                                   from "../../admin/LupinReports/SDGReport.js";
import Report11                                   from "../../admin/LupinReports/ADPReport.js";
import Report12                                   from "../../admin/LupinReports/EMPReport.js";
import "../Reports/Reports.css";


const ReportsList = [];
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

    for (let i=1; i<13;i++) {
        ReportsList[i] = React.getComponentByName(`Report${i}`);
    }
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
    // this.props.history.push(`/${e.target.value}`);
   e.preventDefault();
    // var selectedReport = e.target.id;
    var selectedReport = e.target.value;
    console.log('selectedReport', selectedReport)

    this.setState({
      selectedReport : selectedReport,
    },()=>{
      console.log('selectedReport',this.state.selectedReport);
      })
  }
  
  render(){
      const selectedReport = this.state.selectedReport;
console.log("selectedReport", selectedReport)
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
                        <label className="formLable"><b>Select Report</b></label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="report" >
                          {/*<div onClick={this.changeReportComponent.bind(this)} id="Daily" className={this.state.currentTabView === "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                            Daily
                          </div>*/}
                          <select className="custom-select form-control inputBox" ref="report" name="report" value={this.state.report} onChange={this.selectReportPath.bind(this)} >
                            <option className="hidden" >-- Select --</option>
                            <option className="formLable" id="Report1" value="Report1">Activity wise Annual Completion Report</option>
                            <option className="formLable" id="Report2" value="Report2">Sector wise Annual Completion Summary Report</option>
                            <option className="formLable" id="Report3" value="Report3">Activity wise Periodic Variance Report (Physical & Financial)</option>
                            <option className="formLable" id="Report4" value="Report4">Sector wise Periodic Variance Summary Report</option>
                            <option className="formLable" id="Report5" value="Report5">Activity wise Periodic Physical Variance Report</option>
                            <option className="formLable" id="Report6" value="Report6">Geographical Report</option>
                            <option className="formLable" id="Report7" value="Report7">Villagewise Family Report</option>
                            <option className="formLable" id="Report8" value="Report8">Category wise Report</option>
                            <option className="formLable" id="Report9" value="Report9">Upgraded Beneficiary Report</option>
                            <option className="formLable" id="Report10" value="Report10">SDG Report</option>
                            <option className="formLable" id="Report11" value="Report11">ADP Report</option>
                            <option className="formLable" id="Report12" value="Report12">EMP Report</option>
                            
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                      </div>                     
                    </div>                    
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                          {/*<selectedReport />*/}
                          {
                            this.state.selectedReport=='Report1'?
                            <Report1 />
                            :
                            this.state.selectedReport=='Report2'?
                            <Report2 />
                            :
                            this.state.selectedReport=='Report3'?
                            <Report3 />
                            :
                            this.state.selectedReport=='Report4'?
                            <Report4 />
                            :
                            this.state.selectedReport=='Report5'?
                            <Report5 />
                            :
                            this.state.selectedReport=='Report6'?
                            <Report6 />
                            :
                            this.state.selectedReport=='Report7'?
                            <Report7 />
                            :
                            this.state.selectedReport=='Report8'?
                            <Report8 />
                            :
                            this.state.selectedReport=='Report9'?
                            <Report9 />
                            :
                            this.state.selectedReport=='Report10'?
                            <Report10 />
                            :
                            this.state.selectedReport=='Report11'?
                            <Report11 />
                            :
                            this.state.selectedReport=='Report12'?
                            <Report12 />
                            :
                            null
                          }
                        </div> 
                    <div>
                    {/*  {
                         ReportsList[this.props.componentId]
                      }*/}
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
export default SDGReport
/*https://reactstrap.github.io/components/dropdowns/*/