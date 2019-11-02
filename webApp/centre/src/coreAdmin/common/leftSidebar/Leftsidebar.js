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
   Addclass(event){
     // $(".menuContent").toggleClass("openContent");
   /*   if ($('menuContent').attr('aria-expanded') === true) {
      $(this).find(".menuContent").toggleClass("openContent");
  }*/
    $("pull-right-container").children('i').css({"transform": "rotate(-90deg)"});

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
                  <a href="#planreport" data-toggle="collapse" aria-expanded="false" className="menuContent" onClick={this.Addclass.bind(this)}>
                    <i className="fa fa-file" />
                    Plan Related Reports
                  {/*      <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>*/}
                  </a>
                  <ul className="collapse list-unstyled" id="planreport">
                    <li>
                      <a href="/activitywise-annual-plan-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Annual Plan</span>
                      </a>
                    </li>
                    <li>
                      <a href="/activity-wise-periodic-plan-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Periodic Plan</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sector-wise-periodic-plan-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Periodic Plan</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sector-wise-annual-plan-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Annual Plan</span>
                      </a>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText">
                  <a href="#report" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-book" />
                    Reports
                  </a>
                  <ul className="collapse list-unstyled" id="report">
                   {/* <li>
                      <a href="/Report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Report</span>
                      </a>
                    </li>*/}
                    <li>
                      <a href="/activitywise-annual-completion-report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Activitywise Annual Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sector-wise-annual-completion-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sectorwise Annual Report</span>
                      </a>
                    </li>
                   <li>
                      <a href="/activity-wise-periodic-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Periodic Variance</span>
                      </a>
                    </li>
                    <li>
                      <a href="/sectorwise-periodic-variance-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sectorwise Periodic Variance</span>
                      </a>
                    </li>
                    <li>
                      <a href="/activity-wise-periodic-physical-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Peri. Physi. Vari.</span>
                      </a>
                    </li>
                    <li>
                      <a href="/geographical-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Geographical Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/villagewise-family-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Villagewise Family Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/category-wise-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Categorywise Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/upgraded-beneficiary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Upgraded Beneficiary Report</span>
                      </a>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText">
                  <a href="#sreport" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-bars" />
                    Special Reports
                  </a>
                  <ul className="collapse list-unstyled" id="sreport">
                    <li>
                      <a href="/SDG-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">SDG Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/ADP-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">ADP Report</span>
                      </a>
                    </li>
                    <li>
                      <a href="/EMP-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">EMP Report</span>
                      </a>
                    </li>
                  </ul>
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
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
