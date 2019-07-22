import React,{Component}                          from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render }                                 from 'react-dom';
import { BrowserRouter as Router, Route,Switch }  from 'react-router-dom';
import $                                          from "jquery";

import Header                                     from '../common/header/Header.js';
import Footer                                     from '../common/footer/Footer.js'
import Dashboard                                  from '../dashboard/Dashboard.js'
import Leftsidebar                                from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                               from '../common/rightSidebar/Rightsidebar.js'
/*
import UMListOfUsers                              from '../userManagement/UM/UMListOfUsers.js';
import EditUserProfile                            from '../userManagement/UM/EditUserProfile.js';
import UMRolesList                                from '../userManagement/Roles/UMRolesList.js';
import CompanySetting                             from '../companysetting/Components/CompanySetting.js';
import ViewTemplates                              from '../NotificationManagement/ViewTemplates.js';

import AddModuleFacility                          from '../accessManagement/AddModuleFacility.js';
import AssignPermissionToModules                  from '../accessManagement/AssignPermissionToModules.js';
*/
import Family                                     from '../../coreAdmin/masterData/family/Family.js';
import Beneficiary                                from '../../coreAdmin/masterData/beneficiary/Beneficiary.js';

import Activity                                   from "../../centres/activity/createActivityReport/Activity.js";
import ViewActivity                               from "../../centres/activity/viewActivity/ViewActivity.js";
// import table                                      from "../../centres/activity/table/NewBeneficiary.js";
import Plan                                       from "../../centres/plan/PlanDetails.js";
import CenterList                                 from "../../centres/centerList/centerList.js";


import ActivityReportView                         from "../../centres/activityReportView/ActivityReportView.js";


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

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
                  {/*Master Data*/}
                    <Route path="/beneficiary"                         exact strict component={ Beneficiary } />
                    <Route path="/beneficiary/"                         exact strict component={ Beneficiary } />
                    <Route path="/beneficiary/:id"                     exact strict component={ Beneficiary } />
                    <Route path="/family"                              exact strict component={ Family } />
                    <Route path="/family/"                              exact strict component={ Family } />
                    <Route path="/family/:id"                          exact strict component={ Family } />
                   {/*Plans Routes*/}
                    <Route path="/plan"                         exact strict component={ Plan } />
                    <Route path="/plan/"                         exact strict component={ Plan } />
                    <Route path="/plan/:id"                         exact strict component={ Plan } />
{/*                    <Route path="/table"                               exact strict component={ table } />
*/}                    <Route path="/activity"                            exact strict component={ Activity } />
*/}                    <Route path="/activity/"                            exact strict component={ Activity } />
                    <Route path="/activity/:id"                        exact strict component={ Activity } />
                    <Route path="/viewActivity"                        exact strict component={ ViewActivity } />
                    <Route path="/activityReportView"                  exact strict component={ ActivityReportView } />
                    <Route path="/centerList"                          exact strict component={ CenterList } />

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
    );
  }
}
export default Layout;




// value={data.centerName+'|'+data._id}

