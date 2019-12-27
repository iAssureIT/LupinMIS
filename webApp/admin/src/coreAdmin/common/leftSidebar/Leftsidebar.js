import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render }        from 'react-dom';
import $                 from "jquery";
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

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
  /* Highlight current li*/
     $(document).ready(function () {
      $('.activeClass li').on('click', function() {
        $('.activeClass li').removeClass('activeOne');
        $(this).addClass('activeOne');
      });
    });
  }    

  
  Addclass(event){
     // $(".menuContent").toggleClass("openContent");
   /*   if ($('menuContent').attr('aria-expanded') === true) {
      $(this).find(".menuContent").toggleClass("openContent");
  }*/
    $("pull-right-container").children('i').css({"transform": "rotate(-90deg)"});

  }   


  eventclk1(event){
    // event.preventDefault();
    // $(event.currentTarget).children('.treeview-menu').slideToggle();
    // $(event.currentTarget).addClass('active');
    // $(event.currentTarget).children(Link).children(".rotate").toggleClass("down");
    // $(event.currentTarget).siblings('li').removeClass('active');

  } 

  render(){
    // console.log('nkhjh',  window.screen.height );  
    var sidebarHeight = window.screen.height - 180;
    return(
      <div>
        <aside className="leftsidebar">
          <div className="wrapper">
            <nav id="sidebar">
              <div className="sidebar-header">
                <h4 className="text-center"><b>Admin Lupin MIS</b></h4>
                <strong className="sidebarLogoName">LFMIS <p className="">Admin</p></strong>
              </div>
              <ul className="list-unstyled components scrollBox" style={{height:  sidebarHeight+"px"}}>
                <li className=" sidebarMenuText">
                  <Link to="/dashboard" title="Dashboard">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </Link>
                </li>
                

                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#planreport" data-toggle="collapse" aria-expanded="false" className="menuContent" title="Plan Related Reports">
                    <i className="fa fa-file" />
                    Planning Management
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i> 

                  {/*      <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>*/}
                  </Link>
                  <ul className="collapse   list-unstyled activeClass" id="planreport">
                    <li className="sidebarMenuText">
                      <Link to="/plan-details" title="Plan Details">
                        <i className="fa fa-pie-chart" />
                        Annual & Monthly Plan
                      </Link>
                    </li>
                    <li>
                      <Link to="/activitywise-annual-plan-report" title="Activity Annual Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Annual Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-plan-report" title="Activity Periodic Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Periodic Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-annual-plan-summary-report" title="Sector Annual Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Annual Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-periodic-plan-summary-report" title="Sector Periodic Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Periodic Plan</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#report" data-toggle="collapse" className="menuContent"  aria-expanded="false" title="Reports">
                    <i className="fa fa-book" />
                    Reporting Management
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse list-unstyled activeClass" id="report">
                   {/* <li>
                      <Link to="/Report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Report</span>
                      </Link>
                    </li>*/}
                    <li>
                      <Link to="/sector-wise-annual-completion-summary-report" title="Sector Annual Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sectorwise-periodic-variance-summary-report" title="Sector Financial Variance">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Financial Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activitywise-annual-completion-report" title="Activity Annual Report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Activity Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-variance-report" title="Activity Financial Variance">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Financial Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-physical-variance-report" title="Activity Physical Variance">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Physical Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/geographical-report" title="Geographical Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Geographical Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category-wise-report" title="Category Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Category Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/villagewise-family-report" title="Family Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Family Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/upgraded-beneficiary-report" title="Beneficiary Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Beneficiary Report</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText treeview menu-open"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#sreport" data-toggle="collapse" className="menuContent"  aria-expanded="false" title="Special Reports">
                    <i className="fa fa-bars" />
                    Special Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse  list-unstyled activeClass" id="sreport">
                    <li>
                      <Link to="/SDG-report" title="SDG Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">SDG Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/ADP-report" title="ADP Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">ADP Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/EMP-report" title="EMP Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">EMP Report</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#MasterData" data-toggle="collapse" className="menuContent" aria-expanded="false" title="Master Data">
                    <i className="fa fa-database" />
                    Master Data
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse   list-unstyled activeClass" id="MasterData">
                    <li>
                      <Link to="/type-center" title="Center Type">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Center Type</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/center-details" title="Center Details">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Center Details</span>
                      </Link>
                    </li> 

                    <li>
                      <Link to="/sector-and-activity" title="Sector & Activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector & Activity</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/type-goal" title="Goal Type">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Goal Type</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-mapping" title="Sector Mapping">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Goal Sector Mapping</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/project-mapping" title="Project Definition">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Project Definition</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                {/*<li className="sidebarMenuText">
                    <Link to="/dashboard" >
                      <i className="fa fa-list" />
                      Case Studies
                    </Link>
                  </li>
                  <li className="sidebarMenuText">
                    <Link to="/dashboard" >
                      <i className="fa fa-hand-o-right " />
                      Highlights
                    </Link>
                  </li>*/}
             {/*   <li className="sidebarMenuText">
                  <Link to="/dashboard" >
                    <i className="fa fa-map-marker" />
                    Training Center
                  </Link>
                </li>*/}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
