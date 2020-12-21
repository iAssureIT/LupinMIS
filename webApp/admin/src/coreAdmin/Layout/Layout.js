import React,{Component}                         from 'react';
import { render }                                from 'react-dom';
import { Redirect }                              from 'react-router-dom';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import $                                         from "jquery";
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// Section: 1 - SystemSecurity ******************************************************
import Login                                      from '../systemSecurity/Login.js';
import ConfirmOtp                                 from '../systemSecurity/ConfirmOtp.js';
import ForgotPassword                             from '../systemSecurity/ForgotPassword.js';
import ResetPassword                              from '../systemSecurity/ResetPassword.js';
import SignUp                                     from '../systemSecurity/SignUp.js';
import VerifyAccount                              from '../systemSecurity/VerifyAccount.js';

import CenterwiseBarChart                         from '../dashboard/chart1/CenterwiseBarChart1.js'
import SourcewiseBarChart                         from '../dashboard/chart1/SourcewiseBarChart1.js'
import Chart1                                     from '../dashboard/chart1/chart1.js'
import Chart                                      from '../dashboard/chart1/chart.js'
import CenterwiseBudget                           from '../dashboard/chart1/CenterwiseBudget.js'
import monthwiseCharts                            from '../dashboard/chart1/monthwiseCharts.js'

import Header                                     from '../common/header/Header.js'
import Footer                                     from '../common/footer/Footer.js'
import Dashboard                                  from '../dashboard/Dashboard.js'
// import DashboardNew                               from '../dashboard/DashboardNew.js'
import Leftsidebar                                from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                               from '../common/rightSidebar/Rightsidebar.js'
import UMListOfUsers                              from '../userManagement/UM/UMListOfUsers.js';
import UMListOfEmp                                from '../userManagement/UM/OfficeEmpList.js';
import UserProfile                                from '../userManagement/UM/UserProfile.js';
import ResetPwd                                   from '../userManagement/UM/ResetPassword.js';

import EditUserProfile                            from '../userManagement/UM/EditUserProfile.js';
import UMRolesList                                from '../userManagement/Roles/UMRolesList.js';
import OrganizationSetting                        from '../companysetting/Components/OrganizationSetting.js';
import ViewTemplates                              from '../NotificationManagement/ViewTemplates.jsx';

/**************************/

import AddModuleFacility                          from '../accessManagement/AddModuleFacility.js';
import AssignPermissionToModules                  from '../accessManagement/AssignPermissionToModules.js';

import SectorAndActivity                          from '../../coreAdmin/masterData/sectorAndActivity/SectorAndActivity.js';

import SectorAndActivityRedirect                  from '../../coreAdmin/masterData/sectorAndActivity/SandA.js';

import ListOfVillages                             from '../../coreAdmin/masterData/ListOfVillages/ListOfVillages.js';
import ListOfDistricts                            from '../../coreAdmin/masterData/ListOfVillages/ListOfDistricts.js';
import ListOfBlocks                               from '../../coreAdmin/masterData/ListOfVillages/ListOfBlocks.js';

import Unit                                       from '../../coreAdmin/masterData/sectorAndActivity/component/unit/Unit.js';
import BulkUpload                                 from '../../coreAdmin/masterData/sectorAndActivity/component/BulkUpload/BulkUpload.js';
import centerDetail                               from '../../coreAdmin/masterData/centerDetail/centerDetail.js';
import Type_Center                                from '../../coreAdmin/masterData/typeOfCenter/typeOfCenter.js';
import Type_Goal                                  from '../../coreAdmin/masterData/typeOfGoal/typeOfGoalP.js';
import TypeOfGoalContainer                        from '../../coreAdmin/masterData/typeOfGoal/typeOfGoalContainer.js';

import ProjectDefinition                            from '../../coreAdmin/masterData/projectMapping/ProjectDefinition.js';
// import ProjectDefinition                            from '../../coreAdmin/masterData/projectMapping/ProjectDefinition_copy.js';
import ProjectMapping                             from '../../coreAdmin/masterData/projectMapping/ProjectDefinition_copy.js';
import SectorMapping                              from '../../coreAdmin/masterData/sectorMapping/SectorMapping.js';

import plan                                       from '../../admin/annualPlan/PlanDetails.js';

import CaseStudy                                  from "../../admin/addFile/CaseStudy.js";
import CaseStudyView                              from "../../admin/addFile/CaseStudyView.js";
import AddFilePrivate                             from "../../admin/addFile/AddFilePrivate.js";
import Highlight                                  from "../../admin/highLight/Highlight.js"; 
import HighlightView                              from "../../admin/highLight/HighlightView.js"; 
// import report1                                    from "../../admin/LupinReportsOld/ActivityAnnualreport/ActivityAnnualreport.js";
// import report2                                    from "../../admin/LupinReportsOld/SectorwiseAnnualCompletionSummaryReport/SectorwiseAnnualCompletionSummaryReport.js";
// import report3                                    from "../../admin/LupinReportsOld/ActivityWisePeriodicVarianceReport/ActivityWisePeriodicVarianceReport.js";
// import report4                                    from "../../admin/LupinReportsOld/SectorwisePeriodicVarianceSummaryReport/SectorwisePeriodicVarianceSummaryReport.js";
// import report5                                    from "../../admin/LupinReportsOld/ActivitywisePeriodicPhysicalVarianceReport/ActivitywisePeriodicPhysicalVarianceReport.js";
// import report6                                    from "../../admin/LupinReportsOld/GeographicalReport/GeographicalReport.js";
// import report7                                    from "../../admin/LupinReportsOld/VillagewisefamilyReport/VillagewisefamilyReport.js";
// import report8                                    from "../../admin/LupinReportsOld/CategorywiseReport/CategorywiseReport.js";
// import report9                                    from "../../admin/LupinReportsOld/UpgradedBeneficiaryReport/UpgradedBeneficiaryReport.js";
// import report10                                   from "../../admin/LupinReportsOld/GoalSectorReport/GoalSectorReport.js";
// import report13                                   from "../../admin/LupinReportsOld/ActivitywiseAnnualPlanReport/ActivitywiseAnnualPlanReport.js";
// import report14                                   from "../../admin/LupinReportsOld/ActivitywisePeriodicPlanReport/ActivitywisePeriodicPlanReport.js";
// import report15                                   from "../../admin/LupinReportsOld/SectorwisePeriodicPlanSummaryReport/SectorwisePeriodicPlanSummaryReport.js";
// import report16                                   from "../../admin/LupinReportsOld/SectorwiseAnnualPlanSummaryReport/SectorwiseAnnualPlanSummaryReport.js";
// import report17                                   from "../../admin/LupinReportsOld/CenterRankingReport/CenterRankingReport.js";

import ProjectReport                              from "../../admin/LupinReportsOld/GoalSectorReport/ProjectReport.js";

import ActivitywisePlan                           from "../../admin/LupinReports/ActivitywisePlan/ActivitywisePlan.js";
import SectorwisePlan                             from "../../admin/LupinReports/SectorwisePlan/SectorwisePlan.js";
import ActivityWiseReport                         from "../../admin/LupinReports/ActivityWiseReport/ActivityWiseReport.js";
import SectorwiseReport                           from "../../admin/LupinReports/SectorwiseReport/SectorwiseReport.js";
import FamilyCoverageReport                       from "../../admin/LupinReports/FamilyCoverageReport/FamilyCoverageReport.js";
import BeneficiaryCoverageReport                  from "../../admin/LupinReports/BeneficiaryCoverageReport/BeneficiaryCoverageReport.js";
import CategorywiseReport                         from "../../admin/LupinReports/CategorywiseReport/CategorywiseReport.js";
import GoalSectorReport                           from "../../admin/LupinReports/GoalSectorReport/GoalSectorReport.js";


import VillageBulkUpload                          from '../../coreAdmin/masterData/LocationMaster/VillageBulkUpload.js';
import BlockBulkUpload                            from '../../coreAdmin/masterData/LocationMaster/BlockBulkUpload.js';
import DistrictBulkUpload                         from '../../coreAdmin/masterData/LocationMaster/DistrictBulkUpload.js';
import StateBulkUpload                            from '../../coreAdmin/masterData/LocationMaster/StateBulkUpload.js';
import ListofLocations                            from '../../coreAdmin/masterData/LocationMaster/ListofLocations.js';

class Layout extends Component{
  
  constructor(props) {
    super();
    this.state = {
          loggedIn : false,
    }
  }  
  componentDidMount(){
    const token = localStorage.getItem("token");
    // console.log("Dashboard Token = ",token);
    if(token!==null){
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
    }
  }

  render(){
    if(this.state.loggedIn===true){
      return(
        <Router>
            <div className="App container-fluid">
              <div className="row">
                <div id="headerid" className="headerbackgroundcolor">
                  <div className="">
                    <Header />
                 </div>
                </div>
                <div id="dashbordid" className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="">
                    <div className=" mainCuserprofileontentBottom">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mainContentBackground">                  
                      <Switch>
                          <Route path="/profile/:id"                                                            exact component={UserProfile}  />
                          <Route path="/reset-password"                                                         exact component={ResetPwd}  />
                          <Route path="/CenterwiseBarChart"                                                     exact component={CenterwiseBarChart}  />
                          <Route path="/SourcewiseBarChart"                                                     exact component={SourcewiseBarChart}  />
                          <Route path="/Chart"                                                                  exact component={Chart}  />
                          <Route path="/monthwiseCharts"                                                        exact component={monthwiseCharts}  />
                          <Route path="/CenterwiseBudget"                                                       exact component={CenterwiseBudget}  />
                          <Route path="/Chart1"                                                                 exact component={Chart1}  />
                          <Route path="/"                                                                       exact component={Dashboard}  />
                          {/*<Route path="/DashboardNew"                                                           exact component={DashboardNew}  />*/}
                          <Route path="/dashboard"                                                              exact component={Dashboard}  />
                          <Route path="/umlistofusers"                                                          exact component={UMListOfUsers}  />
                          <Route path="/umroleslist"                                                            exact component={UMRolesList}  />
                          <Route path="/edituserprofile/:id"                                                    exact component={EditUserProfile}  />
                          <Route path="/ViewTemplates"                                                          exact component={ViewTemplates}  />
                          <Route path="/companysetting"                                                         exact component={OrganizationSetting}  />
                          {/*Master Data*/}
                          <Route path="/type-center"                                                            exact strict component={ Type_Center } />
                          <Route path="/type-center/"                                                           exact strict component={ Type_Center } />
                          <Route path="/type-center/:typeofCenterId"                                            exact strict component={ Type_Center } />
                         {/* <Route path="/type-goal"                                                              exact strict component={ Type_Goal } />
                          <Route path="/type-goal/"                                                              exact strict component={ Type_Goal } />
                          <Route path="/type-goal/:typeofGoalId"                                                exact strict component={ Type_Goal } />*/}

                          <Route path="/listofvillages"                                                         exact strict component={ ListOfVillages } />
                          <Route path="/listofdistricts"                                                        exact strict component={ ListOfDistricts } />
                          <Route path="/listofblocks"                                                           exact strict component={ ListOfBlocks } />

                          <Route path="/type-goal"                                                              exact strict component={ TypeOfGoalContainer } />
                          <Route path="/type-goal/"                                                             exact strict component={ TypeOfGoalContainer } />
                          <Route path="/type-goal/:typeofGoalId"                                                exact strict component={ TypeOfGoalContainer } />
                          <Route path="/type-goal/:typeofGoalId/:goalNameId"                                    exact strict component={ TypeOfGoalContainer } />
                          <Route path="/center-details"                                                         exact strict component={ centerDetail } />
                          <Route path="/center-details/"                                                        exact strict component={ centerDetail } />
                          <Route path="/center-details/:id"                                                     exact strict component={ centerDetail } />
                         
                          <Route path="/sector-and-activity"                                                    exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/"                                                   exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/unit/"                                              exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/unit/:unitID"                                       exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/:sectorId"                                          exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/:sectorId/:activityId"                              exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/:sectorId/:activityId/:subactivityId"               exact strict component={ SectorAndActivity } />
                          
                          <Route path="/SectorAndActivityRedirect/"                                              exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName"                                      exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/"                                     exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/unit/"                                exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/unit/:unitID"                         exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/:sectorId"                            exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/:sectorId/:activityId"                exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/:sectorId/:activityId/:subactivityId" exact strict component={ SectorAndActivityRedirect } />
  
                          <Route path="/project-definition"                                                      exact strict component={ ProjectDefinition } />
                          <Route path="/project-definition/"                                                     exact strict component={ ProjectDefinition } />
                          <Route path="/project-definition/:projectMappingId"                                    exact strict component={ ProjectDefinition } />
                          <Route path="/project-mapping"                                                         exact strict component={ ProjectMapping } />
                          <Route path="/project-mapping/"                                                        exact strict component={ ProjectMapping } />
                          <Route path="/project-mapping/:projectMappingId"                                       exact strict component={ ProjectMapping } />
                          <Route path="/sector-mapping"                                                          exact strict component={ SectorMapping } />
                          <Route path="/sector-mapping/"                                                         exact strict component={ SectorMapping } />
                          <Route path="/sector-mapping/:sectorMappingId"                                         exact strict component={ SectorMapping } />
                          { /*Plans Routes*/}
                          <Route path="/plan-details"                                                            exact strict component={ plan } />
                          <Route path="/plan-details/"                                                           exact strict component={ plan } />
                          <Route path="/plan-details/:id"                                                        exact strict component={ plan } />
                          
                          <Route path="/caseStudy"                                                               exact strict component={ CaseStudy } />
                          <Route path="/caseStudy/"                                                              exact strict component={ CaseStudy } />
                          <Route path="/caseStudy/:id"                                                           exact strict component={ CaseStudy } />
                          <Route path="/caseStudyView/:id"                                                       exact strict component={ CaseStudyView } />
                          
                          <Route path="/highlight"                                                               exact strict component={ Highlight } />
                          <Route path="/highlight/"                                                              exact strict component={ Highlight } />
                          <Route path="/highlight/:id"                                                           exact strict component={ Highlight } />                      
                          <Route path="/highlightview/:id"                                                       exact strict component={ HighlightView } />                      

                          <Route path="/statebulkupload"                                                         exact strict component={ StateBulkUpload } />
                          <Route path="/statebulkupload/"                                                         exact strict component={ StateBulkUpload } />
                          <Route path="/statebulkupload/:stateID"                                                exact strict component={ StateBulkUpload } />
                          <Route path="/districtbulkupload"                                                      exact strict component={ DistrictBulkUpload } />
                          <Route path="/districtbulkupload/"                                                      exact strict component={ DistrictBulkUpload } />
                          <Route path="/districtbulkupload/:districtID"                                          exact strict component={ DistrictBulkUpload } />
                          <Route path="/blockbulkupload"                                                         exact strict component={ BlockBulkUpload } />
                          <Route path="/blockbulkupload/"                                                         exact strict component={ BlockBulkUpload } />
                          <Route path="/blockbulkupload/:blockID"                                                exact strict component={ BlockBulkUpload } />
                          <Route path="/villagebulkupload"                                                       exact strict component={ VillageBulkUpload } />
                          <Route path="/villagebulkupload/"                                                       exact strict component={ VillageBulkUpload } />
                          <Route path="/villagebulkupload/:villageID"                                            exact strict component={ VillageBulkUpload } />
                          <Route path="/listoflocations"                                                         exact strict component={ ListofLocations } />

                          {/*<Route path="/category-wise-report"                                                    exact strict component={ report8 } />
                          <Route path="/goal-sector-report"                                                      exact strict component={ report10 } />*/}
                   { /*      <Route path="/activitywise-annual-completion-report"                                   exact strict component={ report1 } />
                           <Route path="/sector-wise-annual-completion-summary-report"                            exact strict component={ report2 } />
                           <Route path="/activity-wise-periodic-variance-report"                                  exact strict component={ report3 } />
                           <Route path="/sectorwise-periodic-variance-summary-report"                             exact strict component={ report4 } />
                           <Route path="/activity-wise-periodic-physical-variance-report"                         exact strict component={ report5 } />
                           <Route path="/geographical-report"                                                     exact strict component={ report6 } />
                           <Route path="/villagewise-family-report"                                               exact strict component={ report7 } />
                           <Route path="/upgraded-beneficiary-report"                                             exact strict component={ report9 } />
                           <Route path="/activitywise-annual-plan-report"                                         exact strict component={ report13 } />
                           <Route path="/activity-wise-periodic-plan-report"                                      exact strict component={ report14 } />
                           <Route path="/sector-wise-periodic-plan-summary-report"                                exact strict component={ report15 } />
                           <Route path="/sector-wise-annual-plan-summary-report"                                  exact strict component={ report16 } />
                           <Route path="/Project-report"                                                          exact strict component={ ProjectReport } />
                           <Route path="/center-ranking-report"                                                   exact strict component={ report17 } />*/ }
                          <Route path="/activity-wise-plan"                                                      exact strict component={ ActivitywisePlan } />
                          <Route path="/sector-wise-plan"                                                        exact strict component={ SectorwisePlan } />
                          <Route path="/activity-wise-report"                                                    exact strict component={ ActivityWiseReport } />
                          <Route path="/sector-wise-report"                                                      exact strict component={ SectorwiseReport } />
                          <Route path="/family-coverage-report"                                                  exact strict component={ FamilyCoverageReport } />
                          <Route path="/beneficiary-coverage-report"                                             exact strict component={ BeneficiaryCoverageReport } />
                          <Route path="/category-wise-report"                                                    exact strict component={ CategorywiseReport } />
                          <Route path="/goal-sector-report"                                                      exact strict component={ GoalSectorReport } />
                      </Switch>        
                      </div>
                    </div>
                  </div>
                  <div className="footerCSS col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <Footer />
                  </div>
                </div>
                <div className="leftsidebarbackgroundcolor">
                  <div className="row">
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
