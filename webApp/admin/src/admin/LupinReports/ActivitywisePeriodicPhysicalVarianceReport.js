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
                    heading : 'Annual Physical Plan',
                    mergedColoums : 3
                },
                {
                    heading : "Periodic Physical Plan",
                    mergedColoums : 3
                },
                {
                    heading : "Periodic Achievements",
                    mergedColoums : 3
                },
                {
                    heading : "Periodic Varance Report",
                    mergedColoums : 3
                },
            ]
        },
        "tableHeading"      : {
            "abcs"    : 'Activity & Sub Activity',
            "abcd"    : 'Unit',
            "dfgg"    : 'Physical Units', 
            "abcx"    : "Reach",
            "dfng"    : 'Family Upgradation plan', 
            "vbvh"    : 'Physical Units', 
            "jjij"    : "Reach",
            "mkmk"    : 'Family Upgradation plan', 
            "xfxf"    : 'Physical Units', 
            "hhhh"    : "Reach",
            "uiuh"    : 'Family Upgraded', 
            "xxdx"    : 'Physical Units', 
            "jjjn"    : "Reach",
            "xcbv"    : 'Family Upgraded', 
        },
    }
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
        <hr className="hr-map "/>
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
            Activity wise Periodic Physical Variance Report                 
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