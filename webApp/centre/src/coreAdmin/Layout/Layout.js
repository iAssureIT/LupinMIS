import React,{Component}                         from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render }                                from 'react-dom';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import $                                         from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import Header                      from '../common/header/Header.js';
import Footer                      from '../common/footer/Footer.js'
import Dashboard                   from '../dashboard/Dashboard.js'
import Leftsidebar                 from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                from '../common/rightSidebar/Rightsidebar.js'

import UMListOfUsers               from '../userManagement/UM/UMListOfUsers.js';
import EditUserProfile             from '../userManagement/UM/EditUserProfile.js';
import UMRolesList                 from '../userManagement/Roles/UMRolesList.js';
import CompanySetting              from '../companysetting/Components/CompanySetting.js';
import ViewTemplates               from '../NotificationManagement/ViewTemplates.js';

import AddModuleFacility           from '../accessManagement/AddModuleFacility.js';
import AssignPermissionToModules   from '../accessManagement/AssignPermissionToModules.js';

import ManageLocation              from "../../coreAdmin/masterData/manageLocation/ManageLocation.js"
import Department                  from '../../coreAdmin/masterData/department/Department.js';
import Designation                 from '../../coreAdmin/masterData/designation/Designation.js';
import Diseases                    from '../../coreAdmin/masterData/diseases/Diseases.js';
import Grade                       from '../../coreAdmin/masterData/grade/Grade.js';
import Languages                   from '../../coreAdmin/masterData/languages/Languages.js';
import Category                    from '../../coreAdmin/masterData/category/Category.js';
import Religion                    from '../../coreAdmin/masterData/religion/Addreligion.js';

import Activity                    from '../../centres/activity/Activity.js';
import Family                      from '../../centres/family/Family.js';
import Beneficiary                 from '../../coreAdmin/masterData/beneficiary/Beneficiary.js';

import AnnualPlan                 from "../../centres/annualPlan/AnnualPlan.js";
import MonthlyPlan                from "../../centres/monthlyPlan/MonthlyPlan.js";
import MonthlyPlanView            from "../../centres/monthlyPlanView/MonthlyPlanView.js";

import ViewActivity               from "../../centres/viewActivity/ViewActivity.js";

class Layout extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
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
  }

  render(){
     return(
      <div className="App container-fluid">
          <div className="row">
            <div id="headerid" className="headerbackgroundcolor ">
              <Header />
            </div>
            <div className="">
              <div id="dashbordid" className="">
                <Router>
                  <Switch>
                    <Route path="/" component={Dashboard} exact />
                  {/*Admin Routes*/}
                    <Route path="/umlistofusers"        component={UMListOfUsers}   exact />
                    <Route path="/umroleslist"          component={UMRolesList}     exact />
                    <Route path="/edituserprofile"      component={EditUserProfile} exact />
                    <Route path="/ViewTemplates"        component={ViewTemplates}   exact />
                    <Route path="/companysetting"       component={CompanySetting}  exact />
                  {/*Access Management*/}
                    <Route path="/admin/AddModuleFacility"            exact strict component={ AddModuleFacility } />
                    <Route path="/admin/AssignPermissionToModule"     exact strict component={ AssignPermissionToModules } />
                  {/*EmpInduction*/} 
                    {/*<Route path="/admin/FormIndex/BasicInfo"             exact strict component={ FormIndex } />          
                    <Route path="/admin/ProfilePreview"        exact strict component={ ProfilePreview } />
                    <Route path="/admin/DocVerification"       exact strict component={ DocVerification } />          
                    <Route path="/admin/RoleApproval"          exact strict component={ RoleApproval } />          
                    <Route path="/admin/RoleAllocation"        exact strict component={ RoleAllocation } />          
                    <Route path="/admin/EmployeeList"          exact strict component={ EmployeeList } />          
                  */}{/*Master Data*/}
                    <Route path="/admin/ManageLocations"               exact strict component={ ManageLocation } />
                    <Route path="/admin/Department"                    exact strict component={ Department } />
                    <Route path="/admin/Designation"                   exact strict component={ Designation } />
                    <Route path="/admin/Diseases"                      exact strict component={ Diseases } />
                    <Route path="/admin/Languages"                     exact strict component={ Languages } />
                    <Route path="/admin/Grade"                         exact strict component={ Grade } />
                    <Route path="/admin/category"                      exact strict component={ Category } />
                    <Route path="/admin/Religion"                      exact strict component={ Religion } />
                    <Route path="/Activity"                            exact strict component={ Activity } />
                    <Route path="/Beneficiary"                         exact strict component={ Beneficiary } />
                    <Route path="/Family"                              exact strict component={ Family } />
                    <Route path="/AnnualPlan"                          exact strict component={ AnnualPlan } />
                    <Route path="/MonthlyPlan"                         exact strict component={ MonthlyPlan } />
                    <Route path="/MonthlyPlanView"                     exact strict component={ MonthlyPlanView } />
                    
                    <Route path="/ViewActivity"                        exact strict component={ ViewActivity } />


                  </Switch>        
                </Router>
              </div>
            </div>
            <div className="leftsidebarbackgroundcolor">
              <div className="row">
                 <Leftsidebar />
{/*                 <ProfileSidebar />
*/}              </div>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-offset-2">
             
            </div>
              </div>
          </div>
/*      </div>
*/    );
  }
}
export default Layout;






