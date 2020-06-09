import React,{Component}                         from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import {browserHistory} from 'react-router-dom';
import { render }                                from 'react-dom';
import { Redirect }                              from 'react-router-dom';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import $                                         from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// Section: 1 - SystemSecurity ******************************************************
import Login                                      from '../systemSecurity/Login.js';
import ConfirmOtp                                 from '../systemSecurity/ConfirmOtp.js';
import ForgotPassword                             from '../systemSecurity/ForgotPassword.js';
import ResetPassword                              from '../systemSecurity/ResetPassword.js';
import SignUp                                     from '../systemSecurity/SignUp.js';
import VerifyAccount                              from '../systemSecurity/VerifyAccount.js';
// import CommonPage                              from './components/layouts/CommonLayout.js';

import Header                                     from '../common/header/Header.js';
import Footer                                     from '../common/footer/Footer.js'
import Dashboard                                  from '../dashboard/Dashboard.js'
import Leftsidebar                                from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                               from '../common/rightSidebar/Rightsidebar.js'

import Family                                     from '../../coreAdmin/masterData/family/Family.js';
import FilewiseFamilyList                         from '../../coreAdmin/masterData/family/FilewiseFamilyList.js';

import Beneficiary                                from '../../coreAdmin/masterData/beneficiary/Beneficiary.js';
import FilewiseBeneficiaryList                    from "../../coreAdmin/masterData/beneficiary/FilewiseBeneficiaryList.js";

import Activity                                   from "../../centres/activity/createActivityReport/Activity.js";
import FilewiseActivityList                       from "../../centres/activity/filewiselist/FilewiseActivityList.js";

import FilewiseBeneficiaryActivityList            from "../../centres/activity/filewiselist/FilewiseBeneficiaryActivityList.js";

import ViewActivity                               from "../../centres/activity/viewActivity/ViewActivity.js";
import ActivityReportView                         from "../../centres/activityReportView/ActivityReportView.js";
// import table                                      from "../../centres/activity/table/NewBeneficiary.js";
import Plan                                       from "../../centres/plan/PlanDetails.js";
import FileWisePlanList                           from "../../centres/plan/FileWisePlanList.js";
import FileWiseMonthlyPlanList                    from "../../centres/plan/FileWiseMonthlyPlanList.js";

import CaseStudy                                  from "../../centres/addFile/CaseStudy.js";
import CaseStudyView                              from "../../centres/addFile/CaseStudyView.js";
import AddFilePrivate                             from "../../centres/addFile/AddFilePrivate.js";
import Highlight                                  from "../../centres/highLight/Highlight.js"; 
import HighlightView                              from "../../centres/highLight/HighlightView.js"; 
/*import Monthwise                                       from "../../centres/plan/Monthwise.js";*/
import CenterList                                 from "../../centres/centerList/centerList.js";
import SectorList                                 from "../../centres/sectorList/SectorList.js";

// import report                                     from "../../centres/LupinReports/Report.js";
// import report1                                    from "../../centres/LupinReports/ActivitywiseAnnualCompletionReport.js";
import report1                                    from "../../centres/LupinReports/ActivityAnnualreport/ActivityAnnualreport.js";
import report2                                    from "../../centres/LupinReports/SectorwiseAnnualCompletionSummaryReport/SectorwiseAnnualCompletionSummaryReport.js";
import report3                                    from "../../centres/LupinReports/ActivityWisePeriodicVarianceReport/ActivityWisePeriodicVarianceReport.js";
import report4                                    from "../../centres/LupinReports/SectorwisePeriodicVarianceSummaryReport/SectorwisePeriodicVarianceSummaryReport.js";
import report5                                    from "../../centres/LupinReports/ActivitywisePeriodicPhysicalVarianceReport/ActivitywisePeriodicPhysicalVarianceReport.js";
import report6                                    from "../../centres/LupinReports/GeographicalReport/GeographicalReport.js";
import report7                                    from "../../centres/LupinReports/VillagewisefamilyReport/VillagewisefamilyReport.js";
import report8                                    from "../../centres/LupinReports/CategorywiseReport/CategorywiseReport.js";
import report9                                    from "../../centres/LupinReports/UpgradedBeneficiaryReport/UpgradedBeneficiaryReport.js";
import report10                                   from "../../centres/LupinReports/GoalSectorReport/ProjectReport.js";
import report11                                   from "../../centres/LupinReports/GoalSectorReport/GoalSectorReport.js";
// import report12                                   from "../../centres/LupinReports/EMPReport.js";
import report13                                   from "../../centres/LupinReports/ActivitywiseAnnualPlanReport/ActivitywiseAnnualPlanReport.js";
import report14                                   from "../../centres/LupinReports/ActivitywisePeriodicPlanReport/ActivitywisePeriodicPlanReport.js";
import report15                                   from "../../centres/LupinReports/SectorwisePeriodicPlanSummaryReport/SectorwisePeriodicPlanSummaryReport.js";
import report16                                   from "../../centres/LupinReports/SectorwiseAnnualPlanSummaryReport/SectorwiseAnnualPlanSummaryReport.js";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../IAssureTable/print.css';

class Layout extends Component{
  
  constructor(props) {
    super();
    this.state = {
          loggedIn : false,
    }
  }
   
  componentDidMount(){
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });

    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#headerid').toggleClass('headereffect');
       });
    });
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#dashbordid').toggleClass('dashboardeffect');
      });
    });

    const token = localStorage.getItem("token");
    // console.log("Dashboard Token = ",token);
    if(token!==null){
    // console.log("*********===***********imin ",token);
      this.setState({
        loggedIn : true
      })
    }else{
      console.log("token is not available");
    }              
  }
  logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      // console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      })
      // browserHistory.push("/login");
      // this.props.history.push("/login");
    }
  }
  render(){
    // console.log("props = ",this.props);
    // {console.log("loggedIn status layput = ", this.state.loggedIn)}
    if(this.state.loggedIn===true){
      return(
          <Router>
            <div className="App container-fluid">
              <div className="row">
                <div id="headerid" className="headerbackgroundcolor section-not-print">
                  <div className="">
                    <Header />
                 </div>
                </div> 
                <div id="dashbordid" className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="">
                    <div className=" mainContentBottom">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mainContentBackground">                  
                        <Switch>
                              <Route path="/" component={Dashboard} exact />           
                              <Route path="/dashboard" component={Dashboard} exact />           

                            {/*Master Data*/}
                              <Route path="/beneficiary"                         exact strict component={ Beneficiary } />
                              <Route path="/beneficiary/"                        exact strict component={ Beneficiary } />
                              <Route path="/beneficiary/:id"                     exact strict component={ Beneficiary } />
                              <Route path="/Filewise-beneficiary-list"           exact strict component={ FilewiseBeneficiaryList } />
                              
                              <Route path="/family"                              exact strict component={ Family } />
                              <Route path="/family/"                             exact strict component={ Family } />
                              <Route path="/family/:id"                          exact strict component={ Family } />
                              <Route path="/Filewise-family-list"                exact strict component={ FilewiseFamilyList } />
                              
                             {/*Plans Routes*/}
                              <Route path="/plan-details"                        exact strict component={ Plan } />
                              <Route path="/plan-details/"                       exact strict component={ Plan } />
                              <Route path="/plan-details/:id"                    exact strict component={ Plan } />
                              <Route path="/filewise-plan-list"                  exact strict component={ FileWisePlanList } />
                              <Route path="/filewise-monthly-plan-list"          exact strict component={ FileWiseMonthlyPlanList } />
                              <Route path="/Filewise-activity-list"              exact strict component={ FilewiseActivityList } />
                              <Route path="/Filewise-beneficiary-activity-list"  exact strict component={ FilewiseBeneficiaryActivityList } />
                              <Route path="/activity"                            exact strict component={ Activity } />
                              <Route path="/activity/"                           exact strict component={ Activity } />
                              <Route path="/activity/:id"                        exact strict component={ Activity } />

                              <Route path="/viewActivity"                        exact strict component={ ViewActivity } />
                              <Route path="/activityReportView/:id"              exact strict component={ ActivityReportView } />
                              <Route path="/centerList"                          exact strict component={ CenterList } />
                              <Route path="/sectorList"                          exact strict component={ SectorList } />
                              <Route path="/caseStudy"                           exact strict component={ CaseStudy } />
                              <Route path="/caseStudy/"                          exact strict component={ CaseStudy } />
                              <Route path="/caseStudy/:id"                       exact strict component={ CaseStudy } />
                              <Route path="/caseStudyView/:id"                   exact strict component={ CaseStudyView } />
                              <Route path="/addFile"                             exact strict component={ AddFilePrivate } />
                              <Route path="/highlight"                           exact strict component={ Highlight } />
                              <Route path="/highlight/"                          exact strict component={ Highlight } />
                              <Route path="/highlight/:id"                       exact strict component={ Highlight } />                      
                              <Route path="/highlightview/:id"                   exact strict component={ HighlightView } />                      
                              <Route path="/activitywise-annual-completion-report"                        exact strict component={ report1 } />
                              <Route path="/sector-wise-annual-completion-summary-report"                 exact strict component={ report2 } />
                              <Route path="/activity-wise-periodic-variance-report"                       exact strict component={ report3 } />
                              <Route path="/sectorwise-periodic-variance-summary-report"                  exact strict component={ report4 } />
                              <Route path="/activity-wise-periodic-physical-variance-report"              exact strict component={ report5 } />
                              <Route path="/geographical-report"                                          exact strict component={ report6 } />
                              <Route path="/villagewise-family-report"                                    exact strict component={ report7 } />
                              <Route path="/category-wise-report"                                         exact strict component={ report8 } />
                              <Route path="/upgraded-beneficiary-report"                                  exact strict component={ report9 } />
                              <Route path="/Project-report"                                               exact strict component={ report10 } />
                              <Route path="/goal-sector-report"                                           exact strict component={ report11 } />
                              <Route path="/activitywise-annual-plan-report"                              exact strict component={ report13 } />
                              <Route path="/activity-wise-periodic-plan-report"                           exact strict component={ report14 } />
                              <Route path="/sector-wise-periodic-plan-summary-report"                     exact strict component={ report15 } />
                              <Route path="/sector-wise-annual-plan-summary-report"                       exact strict component={ report16 } />
                            </Switch>        
                      </div>
                    </div>
                  </div>
                  <div className="footerCSS col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <Footer />
                  </div>
                </div>
                <div className="leftsidebarbackgroundcolor section-not-print">
                  <div className="row ">
                    <Leftsidebar />
                  </div>
                </div>
              </div>
            </div> 
          </Router>
        );
    }else{
       return(
        <div>
          <Router>
            <Switch>
              <Route path="/"               exact strict component={ Login } />
              <Route path="/login"          exact strict component={ Login } />
              <Route path="/signup"         exact strict component={ SignUp } />
              <Route path="/forgot-pwd"     exact strict component={ ForgotPassword } />
              <Route path="/reset-pwd"      exact strict component={ ResetPassword } />
              <Route path="/verify-account" exact strict component={ VerifyAccount } />
              <Route path="/confirm-otp"    exact strict component={ ConfirmOtp } />
             
            </Switch>        
          </Router>
        </div>
      );
    }
  }
}
export default Layout;




