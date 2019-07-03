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
                <h4 className="text-center"><b>Smart HRMS</b></h4>
                <strong>SEAS</strong>
              </div>
              <ul className="list-unstyled components">
                <li className="active sidebarMenuText">
                  <a href="/">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </a>
                </li>

                <li className="sidebarMenuText">
                  <a href="#Induction" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-users" />
                    Employee Induction
                  </a>
                  <ul className="collapse list-unstyled" id="Induction">
                    <li>
                      <a href="/admin/FormIndex/BasicInfo">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Employee Info Form</span>
                      </a>
                    </li> 
                    <li>
                      <a href="/admin/ProfilePreview">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Profile Preview</span>
                      </a>
                    </li>                   
                    <li>
                      <a href="/admin/EmployeeList">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Allocation of Role & Dept.</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/RoleAllocation">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Role Allocation by HR</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/RoleApproval">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">HR Manager Approval</span>
                      </a>
                    </li>  
                  </ul>
                </li> 

                <li className="sidebarMenuText">
                  <a href="#MasterData" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-database" />
                    Master Data
                  </a>
                  <ul className="collapse list-unstyled" id="MasterData">
                    <li>
                      <a href="/admin/ManageLocations">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Manage Locations</span>
                      </a>
                    </li> 
                    <li>
                      <a href="/admin/Grade">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Grade</span>
                      </a>
                    </li>                   
                    <li>
                      <a href="/admin/Category">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Category</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/Designation">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Designation</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/Department">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Department</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/Diseases">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Diseases</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/Languages">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Languages</span>
                      </a>
                    </li>
                    {/*<li>
                      <a href="/admin/MaritalStatus">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Marital status</span>
                      </a>
                    </li>*/}
                    <li>
                      <a href="/admin/Religion">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Religion</span>
                      </a>
                    </li>
                  </ul>
                </li> 

                <li className="sidebarMenuText">
                  <a href="#Leave" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-calendar" />
                    Leave Management 
                  </a>
                  <ul className="collapse list-unstyled" id="Leave">
                      <li>
                        <a href="/admin/leaveSettings">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Leave Settings</span>
                        </a>
                      </li>
                      <li>
                        <a href="/admin/leavePolicySettings">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Leave Policy Setting</span>
                        </a>
                      </li>
                      <li>
                        <a href="/admin/LocationWiseHolidays">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Locationwise Holidays Form</span>
                        </a>
                      </li>                    
                      <li>
                        <a href="/admin/HolidaysHistory">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Holidays History</span>
                        </a>
                      </li>
                  </ul>
                </li> 

                <li className="sidebarMenuText">
                  <a href="#Shift" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-user-circle" />
                    Shift Management
                  </a>
                  <ul className="collapse list-unstyled" id="Shift">
                    <li>
                      <a href="/admin/shiftSetting">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Shift Setting Table</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/shiftAllot">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Shift Allocation</span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin/empInfo">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Employee Induction</span>
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="sidebarMenuText">
                  <a href="#Attendance" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-clock-o" />
                    Time & Attendance
                  </a>
                  <ul className="collapse list-unstyled" id="Attendance">
                    <li>
                        <a href="/admin/empGraphicalReport">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Employee Graphical Report</span>
                        </a>
                      </li>
                      <li>
                        <a href="/admin/empTextReport">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Employee Text Report</span>
                        </a>
                      </li>                    
                      <li>
                        <a href="/admin/managerTextReport">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Manager Text Report</span>
                        </a>
                      </li>
                      <li>
                        <a href="/admin/managerGraphicalReport">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Manager Graphical Report</span>
                        </a>
                      </li>
                      <li>
                        <a href="/admin/DataAbsent">
                          <i className="fa fa-circle-o" /> <span className="sidebarMenuSubText">Absent Report</span>
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
