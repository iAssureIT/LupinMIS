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
                <h4 className="text-center"><b>Center Lupin MIS</b></h4>
                <strong className="sidebarLogoName">LFMIS <p className="fz14">Center</p></strong>
              </div>
              <ul className="list-unstyled sidebar-menu components">
                <li className=" sidebarMenuText">
                  <a href="/">
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
                <li className="sidebarMenuText">
                  <a href="#Activity" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-edit" />
                    Activity
                   {/* <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>*/}
                  </a>
                  <ul className="collapse list-unstyled" id="Activity">
                    <li>
                      <a href="/activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Submit Activity</span>
                      </a>
                    </li>                   
                    <li>
                      <a href="/viewActivity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">View all Activities</span>
                      </a>
                    </li>
                    <li>
                      <a href="/activityReportView">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Report View</span>
                      </a>
                    </li>
                  </ul>
                </li> 
                {/*<li className="sidebarMenuText">
                  <a href="/planDetails" >
                    <i className="fa fa-book" />
                    Reports
                  </a>
                </li>*/}
                <li className="sidebarMenuText">
                  <a href="/centerList" >
                    <i className="fa fa-th" />
                    Center List
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/caseStudy" >
                    <i className="fa fa-th" />
                    Case Study
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="/highlight" >
                    <i className="fa fa-th" />
                    Highlights
                  </a>
                </li>
                <li className="sidebarMenuText">
                  <a href="#MasterData" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-folder" />
                    Beneficiary Management
                  </a>
                  <ul className="collapse list-unstyled" id="MasterData">
                    <li>
                      <a href="/family">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Create Family</span>
                      </a>
                    </li>
                    <li>
                      <a href="beneficiary">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Create Beneficiary</span>
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
