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
    console.log('nkhjh',  window.screen.height );  
    var sidebarHeight = window.screen.height - 185;
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
                  <Link to="/dashboard">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="sidebarMenuText">
                  <Link to="/plan-details" >
                    <i className="fa fa-pie-chart" />
                    Plan Details
                  </Link>
                </li>
                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#planreport" data-toggle="collapse" aria-expanded="false" className="menuContent">
                    <i className="fa fa-file" />
                    Plan Related Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i> 

                  {/*      <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>*/}
                  </Link>
                  <ul className="collapse   list-unstyled" id="planreport">
                    <li>
                      <Link to="/activitywise-annual-plan-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Annual Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-plan-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Peri. Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-annual-plan-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Annual Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-periodic-plan-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Peri. Plan</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#report" data-toggle="collapse" className="menuContent"  aria-expanded="false">
                    <i className="fa fa-book" />
                    Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse list-unstyled" id="report">
                   {/* <li>
                      <Link to="/Report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Report</span>
                      </Link>
                    </li>*/}
                    <li>
                      <Link to="/activitywise-annual-completion-report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Activitywise Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-annual-completion-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sectorwise Annual Report</span>
                      </Link>
                    </li>
                   <li>
                      <Link to="/activity-wise-periodic-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Peri. Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sectorwise-periodic-variance-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sectorwise Peri. Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-physical-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activitywise Peri. Physi. Vari.</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/geographical-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Geographical Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/villagewise-family-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Villagewise Family Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category-wise-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Categorywise Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/upgraded-beneficiary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Upgraded Beneficiary Report</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText treeview active menu-open"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#sreport" data-toggle="collapse" className="menuContent"  aria-expanded="false">
                    <i className="fa fa-bars" />
                    Special Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse  list-unstyled" id="sreport">
                    <li>
                      <Link to="/SDG-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">SDG Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/ADP-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">ADP Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/EMP-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">EMP Report</span>
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#MasterData" data-toggle="collapse" className="menuContent" aria-expanded="false">
                    <i className="fa fa-database" />
                    Master Data
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse   list-unstyled" id="MasterData">
                    <li>
                      <Link to="/type-center">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Type of Center</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/center-details">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Center Details</span>
                      </Link>
                    </li> 

                    <li>
                      <Link to="/sector-and-activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector & Activity</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/type-goal">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Type of Goal</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-mapping">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Mapping</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/project-mapping">
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
                
               {/* <li className="sidebarMenuText">
                  <Link to="#Access" data-toggle="collapse" aria-expanded="false">
                    <i className="fa fa-user-circle" />
                    Access Management
                  </Link>
                  <ul className="collapse list-unstyled" id="Access">
                    <li>
                      <Link to="/admin/AddModuleFacility">
                        <i className="fa fa-circle-o" /> <span className="sidebarMenuText">Add Module Facility</span>
                      </Link>
                    </li> 
                    <li>
                      <Link to="/admin/AssignPermissionToModule"> 
                        <i className="fa fa-circle-o" /><span className="sidebarMenuText">Assign Permissions</span>
                      </Link>
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
