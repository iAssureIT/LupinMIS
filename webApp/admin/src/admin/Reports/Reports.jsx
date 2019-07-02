import React, { Component } from 'react';
import $                    from 'jquery';
import DailyReport          from './DailyReport.jsx';
import WeeklyReport         from './WeeklyReport.jsx';
import MonthlyReport        from './MonthlyReport.jsx';
import YearlyReport         from './YearlyReport.jsx';
import CustomisedReport     from './CustomisedReport.jsx';
import "./Reports.css";

class Reports extends Component{
	constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Daily",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10,
            "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
            "twoLevelHeader"    : {
                apply           : false,
                firstHeaderData : [
                    {
                        heading : 'Heading 1',
                        mergedColoums : 2
                    },
                    {
                        heading : 'Heading 2',
                        mergedColoums : 2
                    },
                ]
            },
            "tableHeading"      : {
                templateType    : 'Template Type',
                templateName    : 'Template Name',
                subject         : 'Subject', 
                contents        : 'Content',
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
            <div className="content-wrapper">
              <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
                <section className="content">
                  <div className="row">
                    <div className="addrol col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">
                        <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <div className="NOpadding col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="with-border box-header col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <div className="col-lg-9 col-md-9 col-sm-9 col-sm-8 pdcls">
                                   <h4 className="weighttitle">Activity Report</h4>
                              </div>                                                               
                            </div>
                            <div className="col-md-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                               

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                                  <div className="sales-report-main-class">
                                    <div className="sales-report-commonpre">
                                      <div onClick={this.changeReportComponent.bind(this)} id="Daily" className={this.state.currentTabView == "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                                        Daily
                                      </div>
                                      <div onClick={this.changeReportComponent.bind(this)} id="Weekly"  className={this.state.currentTabView == "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                                        Weekly
                                      </div>
                                      <div onClick={this.changeReportComponent.bind(this)} id="Monthly"  className={this.state.currentTabView == "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                                        Monthly
                                      </div>
                                      <div onClick={this.changeReportComponent.bind(this)} id="Yearly"  className={this.state.currentTabView == "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                                        Yearly
                                      </div>
                                      <div onClick={this.changeReportComponent.bind(this)} id="Customised"  className={this.state.currentTabView == "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                                        Customised Dates
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                
                                {
                                  this.state.currentTabView == "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> : 
                                  this.state.currentTabView == "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
                                  this.state.currentTabView == "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
                                  this.state.currentTabView == "Yearly"  ? <YearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
                                  <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} />  
                                }
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
      
              </div>
            
        );
    }
}
export default Reports