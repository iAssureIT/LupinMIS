import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";

// import Header from '../header/Header.js'
import './Leftsidebar.css';

export default class Leftsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
  componentDidMount(){
     /*$(document).ready(function () {
     $('#sidebarCollapse').on('click', function () {
         $('#sidebar').toggleClass('active');
     });
  });*/
  }    

  render(){
    return(
      <div>
        <aside className="leftsidebar">
          <div className="wrapper">
            <nav id="sidebar">
              <div className="sidebar-header">
                <h4 className="text-center"><b>Lupin MIS</b></h4>
                <strong>LFMIS</strong>
              </div>
              <ul className="list-unstyled components">
                <li className="active sidebarMenuText">
                  <a href="/">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </a>
                </li>

                <li className="sidebarMenuText">
                  <a href="#MasterData" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-database" />
                    Master Data
                  </a>
                  <ul className="collapse list-unstyled" id="MasterData">
                  {/*  <li>
                      <a href="/centre">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Centre</span>
                      </a>
                    </li> */}
                      <li>
                        <a href="/centreDetail">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">centreDetail</span>
                        </a>
                      </li>
                    <li>
                      <a href="beneficiary">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Beneficiary</span>
                      </a>
                    </li>                   
                    <li>
                      <a href="/family">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">family</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sectorandactivity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector & Activity</span>
                      </a>
                    </li>
                    <li>
                      <a href="/bulkUpload">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">BulkUpload</span>
                      </a>
                    </li>
                    <li>
                      <a href="/SDGReport">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">SDG Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/empowermentLine">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Empowerment Line</span>
                      </a>
                    </li>
                    <li>
                      <a href="/annualPlan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Annual Plan</span>
                      </a>
                    </li>
                    <li>
                      <a href="/ADPReport">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">ADP Report</span>
                      </a>
                    </li>
                  </ul>
                </li> 

                <li className="sidebarMenuText">
                  <a href="#Leave" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-calendar" />
                    Plan
                  </a>
                  <ul className="collapse list-unstyled" id="Leave">
                      <li>
                        <a href="/annualPlan">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Annual Plan</span>
                        </a>
                      </li>
                      <li>
                        <a href="/monthlyPlan">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">monthlyPlan</span>
                        </a>
                      </li>                    
                      
                  </ul>
                </li> 

               

              

               {/* <li>
                  <a href="#User" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-users" />
                    User Management
                  </a>
                  <ul className="collapse list-unstyled" id="User">
                    <li>
                      <a href="/admin/createUser">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Add New User</span>
                      </a>
                    </li> 
                    <li>
                      <a href="/admin/UMRolesList">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Add Role</span>
                      </a>
                    </li>                  
                    <li>
                      <a href="/admin/UMListOfUsers">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">List Of Users</span>
                      </a>
                    </li>
                  </ul>
                </li>*/}

                <li className="sidebarMenuText">
                  <a href="#Access" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-user-circle" />
                    Access Management
                  </a>
                  <ul className="collapse list-unstyled" id="Access">
                    <li>
                      <a href="/admin/AddModuleFacility">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuText">Add Module Facility</span>
                      </a>
                    </li> 
                    <li>
                      <a href="/admin/AssignPermissionToModule"> 
                        <i className="fa fa-circle-o" /><span className="sidebarMenuText">Assign Permissions</span>
                      </a>
                    </li>    
                  </ul>
                </li>                    
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
