import React, { Component } from 'react';
import $                    from 'jquery';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import "../Reports/Reports.css";

class ActivityWisePeriodicVarianceReport extends Component{
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
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 2
                },
                {
                    heading : "Source of Financial Periodic Plan (Physical & Financial 'Lakh')",
                    mergedColoums : 9
                },
                {
                    heading : "Source wise Financial Periodic Achievements",
                    mergedColoums : 9
                },
                {
                    heading : "Agency wise Variance Periodic Report 'Lakh'",
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : {
            "abcs"    : 'Activity & Sub Activity',
            "abcd"    : 'Unit',
            "dfgg"    : 'Physical Units', 
            "abcx"    : "Total Budget 'Lakh'",
            "dfng"    : 'Physical Units', 
            "abbx"    : "Total Budget 'Lakh'",
            "ouio"    : 'LHWRF',
            "dgfg"    : 'NABARD',
            "ghgh"    : 'Bank Loan',
            "werr"    : 'Direct Community  Contribution',
            "ghgf"    : 'Indirect Community  Contribution',
            "ertr"    : 'Govt',
            "abui"    : 'Others',
            "yiyi"    : 'Physical Units', 
            "abax"    : "Financal Total",
            "ouis"    : 'LHWRF',
            "dgfd"    : 'NABARD',
            "dhgh"    : 'Bank Loan',
            "wcrr"    : 'Direct Community  Contribution',
            "ghqf"    : 'Indirect Community  Contribution',
            "ertd"    : 'Govt',
            "afui"    : 'Others',
            "dfwg"    : 'Physical Units', 
            "amcx"    : "Financal Total",
            "ouyo"    : 'LHWRF',
            "dghg"    : 'NABARD',
            "ghlh"    : 'Bank Loan',
            "wenr"    : 'Direct Community  Contribution',
            "ghmf"    : 'Indirect Community  Contribution',
            "ere"    : 'Govt',
            "abhi"    : 'Others',
        },
    }/*Sr No  Activity & Sub Activity Unit  Annual Plan   Periodic Plan (Physical & Financial 'Lakh'                  Periodic Achievements                 Variance Periodic Report 'Lakh'                 
      Physical Units   Total Budget 'Lakh'  Physical Units  Total Budget 'Lakh' Source of Financial Plan              Physical Units   Financal Total Source wise Financial Achievements              Physical Units  Financial Total Agency wise Variance              
              LHWRF NABARD  Bank Loan Community Contribution    GOVT  Others      LHWRF NABARD  Bank Loan Community Contribution    GOVT  Other     LHWRF NABARD  Bank Loan Community Contribution    GOVT  Others  
                    Indirect  Indirect                Indirect  Indirect                Indirect  Indirect      */
    window.scrollTo(0, 0);
  }

  componentDidMount(){

  }
  
  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentComp,
    })
  }
  render(){
    return( 
      <div className="row">
        <hr className="hr-map"/>
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
            Activity wise Periodic Variance Report (Physical & Financial)                   
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
            <div className="sales-report-main-class">
              <div className="sales-report-commonpre">
                {/*<div onClick={this.changeReportComponent.bind(this)} id="Daily" className={this.state.currentTabView === "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                  Daily
                </div>
                <div onClick={this.changeReportComponent.bind(this)} id="Weekly"  className={this.state.currentTabView === "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                  Weekly
                </div>*/}
                <div onClick={this.changeReportComponent.bind(this)} id="Monthly"  className={this.state.currentTabView === "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                  Monthly
                </div>
                <div onClick={this.changeReportComponent.bind(this)} id="Yearly"  className={this.state.currentTabView === "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                  Yearly
                </div>
                <div onClick={this.changeReportComponent.bind(this)} id="Customised"  className={this.state.currentTabView === "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                  Customised Dates
                </div>
              </div>
            </div>
          </div>
          
          {
            /*this.state.currentTabView === "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> :
            this.state.currentTabView === "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
           */ this.state.currentTabView === "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> :  
            this.state.currentTabView === "Yearly"  ? <YearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
            <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} />  
          }
          
        </div>
      </div>    
    );
  }
}
export default ActivityWisePeriodicVarianceReport