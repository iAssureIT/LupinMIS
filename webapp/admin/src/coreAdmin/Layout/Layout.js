import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
// import {browserHistory} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";

// Section: 1 - SystemSecurity ******************************************************
import Login            from '../systemSecurity/Login.js';
import ConfirmOtp       from '../systemSecurity/ConfirmOtp.js';
import ForgotPassword   from '../systemSecurity/ForgotPassword.js';
import ResetPassword    from '../systemSecurity/ResetPassword.js';
import SignUp           from '../systemSecurity/SignUp.js';
import VerifyAccount    from '../systemSecurity/VerifyAccount.js';
// import CommonPage        from './components/layouts/CommonLayout.js';

import Header from '../common/header/Header.js'
import Footer from '../common/footer/Footer.js'
import Dashboard from '../dashboard/Dashboard.js'
import Leftsidebar from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar from '../common/rightSidebar/Rightsidebar.js'
import UMListOfUsers from '../userManagement/UM/UMListOfUsers.js';
import EditUserProfile from '../userManagement/UM/EditUserProfile.js';
import UMRolesList from '../userManagement/Roles/UMRolesList.js';
import CompanySetting from '../companysetting/Components/CompanySetting.js';
import ViewTemplates from '../NotificationManagement/ViewTemplates.jsx';

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
    console.log("Dashboard Token = ",token);
    if(token!==null){
    console.log("*********===***********imin ",token);
      this.setState({
        loggedIn : true
      })
    }
              
  }

  logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      })
      // browserHistory.push("/login");
      // this.props.history.push("/login");
    }
  }

  render(){
    {console.log("loggedIn status layput = ", this.state.loggedIn)}
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
                      <button className="btn btn-primary pull-right" onClick={this.logout.bind(this)}>Logout</button>
                      <Router>
                          <Switch>
                          <Route path="/umlistofusers" component={UMListOfUsers} exact />
                          <Route path="/umroleslist" component={UMRolesList} exact />
                          <Route path="/edituserprofile" component={EditUserProfile} exact />

                          <Route path="/ViewTemplates" component={ViewTemplates} exact />
                          <Route path="/dashboard" component={Dashboard} exact />

                          <Route path="/companysetting" component={CompanySetting} exact />
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
