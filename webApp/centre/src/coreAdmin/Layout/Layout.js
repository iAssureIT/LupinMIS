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
import Beneficiary                                from '../../coreAdmin/masterData/beneficiary/Beneficiary.js';

import Activity                                   from "../../centres/activity/createActivityReport/Activity.js";
import ViewActivity                               from "../../centres/activity/viewActivity/ViewActivity.js";
import ActivityReportView                         from "../../centres/activityReportView/ActivityReportView.js";
// import table                                      from "../../centres/activity/table/NewBeneficiary.js";
import Plan                                       from "../../centres/plan/PlanDetails.js";
/*import Monthwise                                       from "../../centres/plan/Monthwise.js";*/
import CenterList                                 from "../../centres/centerList/centerList.js";


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

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

                            {/*Master Data*/}
                              <Route path="/beneficiary"                         exact strict component={ Beneficiary } />
                              <Route path="/beneficiary/"                         exact strict component={ Beneficiary } />
                              <Route path="/beneficiary/:id"                     exact strict component={ Beneficiary } />
                              <Route path="/family"                              exact strict component={ Family } />
                              <Route path="/family/"                              exact strict component={ Family } />
                              <Route path="/family/:id"                          exact strict component={ Family } />
                             {/*Plans Routes*/}
                              <Route path="/plan-details"                         exact strict component={ Plan } />
                              <Route path="/plan-details/"                         exact strict component={ Plan } />
                              <Route path="/plan-details/:id"                         exact strict component={ Plan } />
                {/*                    <Route path="/table"                               exact strict component={ table } />*/}                    <Route path="/activity"                            exact strict component={ Activity } />
                              <Route path="/activity/"                            exact strict component={ Activity } />
                              <Route path="/activity/:id"                        exact strict component={ Activity } />
                              <Route path="/viewActivity"                        exact strict component={ ViewActivity } />
                              <Route path="/activityReportView"                  exact strict component={ ActivityReportView } />
                              <Route path="/centerList"                          exact strict component={ CenterList } />
                {/*                    <Route path="/monthwise"                         exact strict component={ Monthwise } />
                */}                                              
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




// value={data.centerName+'|'+data._id}

