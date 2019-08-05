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


import Header                                     from '../common/header/Header.js'
import Footer                                     from '../common/footer/Footer.js'
import Dashboard                                  from '../dashboard/Dashboard.js'
import Leftsidebar                                from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                               from '../common/rightSidebar/Rightsidebar.js'
// import UMListOfUsers                              from '../global/userManagementG/UM/UMListOfUsers.js';
import UMListOfUsers                              from '../userManagement/UM/UMListOfUsers.js';
import UMListOfEmp                                from '../userManagement/UM/OfficeEmpList.js';

// import EditUserProfile                            from '../userManagementG/UM/EditUserProfile.js';
import EditUserProfile                            from '../userManagement/UM/EditUserProfile.js';
import UMRolesList                                from '../userManagement/Roles/UMRolesList.js';
// import CompanySettingG                            from '../companysettingG/Components/CompanySetting.js';
import CompanySetting                             from '../companysetting/Components/CompanySetting.js';
import ViewTemplates                              from '../NotificationManagement/ViewTemplates.jsx';

/**************************/

import AddModuleFacility                          from '../accessManagement/AddModuleFacility.js';
import AssignPermissionToModules                  from '../accessManagement/AssignPermissionToModules.js';

import SectorAndActivity                          from '../../coreAdmin/masterData/sectorAndActivity/SectorAndActivity.js';
import BulkUpload                                 from '../../coreAdmin/masterData/sectorAndActivity/component/BulkUpload/BulkUpload.js';
import centerDetail                               from '../../coreAdmin/masterData/centerDetail/centerDetail.js';

import SectorMapping                              from '../../coreAdmin/masterData/sectorMapping/SectorMapping.js';

import plan                                       from '../../admin/annualPlan/PlanDetails.js';
import MonthlyPlan                                from '../../admin/monthlyPlan/MonthlyPlan.js';
// import report                                     from "../../admin/Reports/Reports.js";
import report                                     from "../../admin/LupinReports/Report.js";
import report1                                    from "../../admin/LupinReports/ActivitywiseAnnualCompletionReport.js";
import report2                                    from "../../admin/LupinReports/SectorwiseAnnualCompletionSummaryReport.js";
import report3                                    from "../../admin/LupinReports/ActivityWisePeriodicVarianceReport.js";
import report4                                    from "../../admin/LupinReports/SectorwisePeriodicVarianceSummaryReport.js";
import report5                                    from "../../admin/LupinReports/ActivitywisePeriodicPhysicalVarianceReport.js";
import report6                                    from "../../admin/LupinReports/GeographicalReport.js";
import report7                                    from "../../admin/LupinReports/VillagewisefamilyReport.js";
import report8                                    from "../../admin/LupinReports/CategorywiseReport.js";
import report9                                    from "../../admin/LupinReports/UpgradedBeneficiaryReport.js";
import report10                                   from "../../admin/LupinReports/SDGReport.js";
import report11                                   from "../../admin/LupinReports/ADPReport.js";
import report12                                   from "../../admin/LupinReports/EMPReport.js";

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
/*                    <Router>
                          <Switch>
                          <Route path="/umlistofusers" component={UMListOfUsers} exact />
                          <Route path="/umroleslist" component={UMRolesList} exact />
                          <Route path="/edituserprofile" component={EditUserProfile} exact />

                          <Route path="/ViewTemplates" component={ViewTemplates} exact />
                          <Route path="/dashboard" component={Dashboard} exact />

                          <Route path="/companysetting" component={CompanySetting} exact />
                          </Switch>        
                      </Router>  */

  render(){
    // console.log("props = ",this.props);
    // {console.log("loggedIn status layput = ", this.state.loggedIn)}
    if(this.state.loggedIn===true){
      return(
            <div className="App container-fluid">
           
                <div className="row">
                  <div id="headerid" className="headerbackgroundcolor ">
                    <div className="">
                      <Header />
                   </div>
                  </div>
                      <div className="">                  
                        <div id="dashbordid" className="">
                         {/* <button className="btn btn-primary pull-right" onClick={this.logout.bind(this)}>Logout</button>
                          */} <Router>
                              <Switch>
                              <Route path="/" component={Dashboard} exact />
                              <Route path="/dashboard" component={Dashboard} exact />
                              <Route path="/umlistofusers" component={UMListOfUsers} exact />
{/*                              <Route path="/umlistofemp" component={UMListOfEmp} exact />
*/}
                              <Route path="/umroleslist" component={UMRolesList} exact />
                              <Route path="/edituserprofile/:id" component={EditUserProfile} exact />

                              <Route path="/ViewTemplates" component={ViewTemplates} exact />

                              <Route path="/companysetting" component={CompanySetting} exact />
{/*                              <Route path="/companysettingG" component={CompanySettingG} exact />
*/}                              
                             {/*----------------------------------------------*/}

                            {/*Access Management*/}
                              <Route path="/admin/AddModuleFacility"                                      exact strict component={ AddModuleFacility } />
                              <Route path="/admin/AssignPermissionToModule"                               exact strict component={ AssignPermissionToModules } />
                             {/*Master Data*/}
                              <Route path="/center-details"                                               exact strict component={ centerDetail } />
                              <Route path="/center-details/"                                              exact strict component={ centerDetail } />
                              <Route path="/center-details/:id"                                           exact strict component={ centerDetail } />
                              <Route path="/sector-and-activity"                                          exact strict component={ SectorAndActivity } />
                              <Route path="/sector-and-activity/"                                         exact strict component={ SectorAndActivity } />
                              <Route path="/sector-and-activity/:sectorId"                                exact strict component={ SectorAndActivity } />
                              <Route path="/sector-and-activity/:sectorId/:activityId"                    exact strict component={ SectorAndActivity } />
                              <Route path="/sector-and-activity/:sectorId/:activityId/:subactivityId"     exact strict component={ SectorAndActivity } />
                              <Route path="/sector-mapping"                                               exact strict component={ SectorMapping } />
                              <Route path="/sector-mapping/"                                              exact strict component={ SectorMapping } />
                              <Route path="/sector-mapping/:sectorMappingId"                              exact strict component={ SectorMapping } />
                              { /*Plans Routes*/}
                              <Route path="/plan-details"                                                 exact strict component={ plan } />
                              <Route path="/plan-details/"                                                exact strict component={ plan } />
                              <Route path="/plan-details/:id"                                             exact strict component={ plan } />
                              <Route path="/report"                                                       exact strict component={ report } />
                              <Route path="/activitywise-annual-completion-report"                        exact strict component={ report1 } />
                              <Route path="/sector-wise-annual-completion-summary-report"                 exact strict component={ report2 } />
                              <Route path="/activity-wise-periodic-variance-report"                       exact strict component={ report3 } />
                              <Route path="/sectorwise-periodic-variance-summary-report"                  exact strict component={ report4 } />
                              <Route path="/activity-wise-periodic-physical-variance-report"              exact strict component={ report5 } />
                              <Route path="/geographical-report"                                          exact strict component={ report6 } />
                              <Route path="/villagewise-family-report"                                    exact strict component={ report7 } />
                              <Route path="/category-wise-report"                                         exact strict component={ report8 } />
                              <Route path="/upgraded-beneficiary-report"                                  exact strict component={ report9 } />
                              <Route path="/upgraded-beneficiary-report"                                  exact strict component={ report9 } />
                              <Route path="/SDG-report"                                                   exact strict component={ report10 } />
                              <Route path="/ADP-report"                                                   exact strict component={ report11 } />
                              <Route path="/EMP-report"                                                   exact strict component={ report12 } />
                              <Route path="/Report"                                                   exact strict component={ report } />
                              <Route path="/Report/:id"                                                   exact strict component={ report } />

                              

                              </Switch>        
                          </Router>
                        </div>
                      </div>
                  <div className="leftsidebarbackgroundcolor">
                    <div className="row">
                       <Leftsidebar />
                    </div>
                  </div>
                  <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-offset-2">
                    <div className="">
                   </div>
                  </div>
                </div>
            </div> 
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
