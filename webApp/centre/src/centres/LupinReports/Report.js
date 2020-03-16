/*import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, withRouter } from "react-router-dom";

import $                          from 'jquery';
import axios                      from 'axios';
import ReactHTMLTableToExcel      from 'react-html-table-to-excel';
import EMPReport                  from "../../admin/LupinReports/EMPReport.js";
import Report1                    from "../../admin/LupinReports/ActivitywiseAnnualCompletionReport.js";
import Report2                    from "../../admin/LupinReports/SectorwiseAnnualCompletionSummaryReport.js";
import Report3                    from "../../admin/LupinReports/ActivityWisePeriodicVarianceReport.js";
import Report4                    from "../../admin/LupinReports/SectorwisePeriodicVarianceSummaryReport.js";
import Report5                    from "../../admin/LupinReports/ActivitywisePeriodicPhysicalVarianceReport.js";
import Report6                    from "../../admin/LupinReports/GeographicalReport.js";
import Report7                    from "../../admin/LupinReports/VillagewisefamilyReport.js";
import Report8                    from "../../admin/LupinReports/CategorywiseReport.js";
import Report9                    from "../../admin/LupinReports/UpgradedBeneficiaryReport.js";
import Report10                   from "../../admin/LupinReports/SDGReport.js";
import Report11                   from "../../admin/LupinReports/ADPReport.js";
import Report12                   from "../../admin/LupinReports/EMPReport.js";
import Report13                   from "../../admin/LupinReports/ActivitywiseAnnualPlanReport.js";
import Report14                   from "../../admin/LupinReports/ActivitywisePeriodicPlanReport.js";
import Report15                   from "../../admin/LupinReports/SectorwisePeriodicPlanSummaryReport.js";
import Report16                   from "../../admin/LupinReports/SectorwiseAnnualPlanSummaryReport.js";
import "../Reports/Reports.css";

      
class Report extends Component {


  onChange = (e) => {
    this.props.history.push(`/report/${e.target.value}`);
  }
  render() {
    return (
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="formWrapper">
            <section className="">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Reports                   
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" valid_box ">  
                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable"><b>Select Report</b></label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="report" >
                          <select onChange={this.onChange} className="custom-select form-control inputBox" ref="report">
                            <option  className="hidden" value="">Select</option>
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
                            <option className="formLable" value="activitywise-annual-plan-report">Activity wise Annual Plan Report</option>                             
                            <option className="formLable" value="activity-wise-periodic-plan-report">Activity wise Periodic Plan Report</option>                             
                            <option className="formLable" value="sector-wise-periodic-plan-summary-report">Sector wise Periodic Plan Summary Report</option>                             
                            <option className="formLable" value="sector-wise-annual-plan-summary-report">Sector wise Annual Plan Summary Report</option>                             
                          </select>
                        </div>
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

const Menu = withRouter(Report);


function App1() {
  return (
    <BrowserRouter>     
      <div className="App1  content">
        <div className="pageContent">
          <div className="">
            <Menu />
            <Route path="/report/activitywise-annual-completion-report"           render={() => <div><Report1 /></div>}  />
            <Route path="/report/sector-wise-annual-completion-summary-report"    render={() => <div><Report2 /></div>}  />
            <Route path="/report/activity-wise-periodic-variance-report"          render={() => <div><Report3 /></div>} />
            <Route path="/report/sectorwise-periodic-variance-summary-report"     render={() => <div><Report4 /></div>}  />
            <Route path="/report/activity-wise-periodic-physical-variance-report" render={() => <div><Report5 /></div>}  />
            <Route path="/report/geographical-report"                             render={() => <div><Report6 /></div>} />
            <Route path="/report/villagewise-family-report"                       render={() => <div><Report7 /></div>}  />
            <Route path="/report/category-wise-report"                            render={() => <div><Report8 /></div>} />
            <Route path="/report/upgraded-beneficiary-report"                     render={() => <div><Report9 /></div>}  />
            <Route path="/report/SDG-report"                                      render={() => <div><Report10 /></div>} />
            <Route path="/report/ADP-report"                                      render={() => <div><Report11 /></div>}  />
            <Route path="/report/EMP-report"                                      render={() => <div><Report12 /></div>}  />
            <Route path="/report/activitywise-annual-plan-report"                 render={() => <div><Report13 /></div>}  />
            <Route path="/report/activity-wise-periodic-plan-report"              render={() => <div><Report14 /></div>}  />
            <Route path="/report/sector-wise-periodic-plan-summary-report"        render={() => <div><Report15 /></div>}  />
            <Route path="/report/sector-wise-annual-plan-summary-report"          render={() => <div><Report16 /></div>}  />
          </div>
        </div>
      </div>
 
 </BrowserRouter>
  );
}

export default App1*/