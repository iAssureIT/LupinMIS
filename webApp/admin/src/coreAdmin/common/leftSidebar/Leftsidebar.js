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
                  <a href="/dashboard">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/plan-details" >
                    <i className="fa fa-pie-chart" />
                    Plan Details
                  </a>
                </li>
                {/*<li className="sidebarMenuText">
                  <a href="/plan" >
                    <i className="fa fa-book" />
                    Reports
                  </a>
                </li>*/}
               {/* <li className="sidebarMenuText">
                  <a href="/activitywise-annual-completion-report">
                    <i className="fa fa-book" />
                    Reports
                  </a>              
                </li>*/}
                <li className="sidebarMenuText">
                  <a href="#report" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-book" />
                    Reports
                  </a>
                  <ul className="collapse list-unstyled" id="report">
                    <li>
                        <a href="/activitywise-annual-completion-report">
                          <i className="fa fa-circle-o" /> 
                          <span className="sidebarMenuSubText">Activity wise Annual Completion Report</span>
                        </a>
                      </li>

                    <li>
                      <a href="/sector-wise-annual-completion-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Annual Completion Summary Report</span>
                      </a>
                    </li>
                   <li>
                      <a href="/activity-wise-periodic-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity wise Periodic Variance Report (Physical & Financial)</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sectorwise-periodic-variance-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Periodic Variance Summary Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/activity-wise-periodic-physical-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity wise Periodic Physical Variance Report</span>
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
                        <a href="/center-details">
                          <i className="fa fa-circle-o" /> 
                          <span className="sidebarMenuSubText">Center Details</span>
                        </a>
                      </li>

                    <li>
                      <a href="/sector-and-activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector & Activity</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sector-mapping">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Mapping</span>
                      </a>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText">
                  <a href="/dashboard" >
                    <i className="fa fa-list" />
                    Case Studies
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/dashboard" >
                    <i className="fa fa-hand-o-right " />
                    Highlights
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/dashboard" >
                    <i className="fa fa-map-marker" />
                    Training Center
                  </a>
                </li>
                
               {/* <li className="sidebarMenuText">
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
                </li>  */}                  
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
