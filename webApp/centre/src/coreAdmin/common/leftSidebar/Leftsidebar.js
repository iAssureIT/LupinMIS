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

  eventclk1(event){
    // event.preventDefault();
    // $(event.currentTarget).children('.treeview-menu').slideToggle();
    // $(event.currentTarget).addClass('active');
    // $(event.currentTarget).children(Link).children(".rotate").toggleClass("down");
    // $(event.currentTarget).siblings('li').removeClass('active');

  } 

   Addclass(event){
     // $(".menuContent").toggleClass("openContent");
   /*   if ($('menuContent').attr('aria-expanded') === true) {
      $(this).find(".menuContent").toggleClass("openContent");
  }*/
    $("pull-right-container").children('i').css({"transform": "rotate(-90deg)"});
 
  }   
  render(){
    console.log('nkhjh',  window.screen.height );  
    var sidebarHeight = window.screen.height - 185;
    return(
      <div className="">
        <aside className="leftsidebar">
          <div className="wrapper">
            <nav id="sidebar">
              <div className="sidebar-header">
                <h4 className="text-center"><b>Center Lupin MIS</b></h4>
                <strong className="sidebarLogoName">LFMIS <p className="fz14">Center</p></strong>
              </div>
              <ul className="list-unstyled sidebar-menu components scrollBox" style={{height:  sidebarHeight+"px"}}>
              
                <li className=" sidebarMenuText">
                  <Link to="/">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </Link>
                </li>


                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#planreport" data-toggle="collapse" aria-expanded="false" className="menuContent">
                    <i className="fa fa-file" />
                      Planning Management
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i> 
                  </Link>
                  <ul className="collapse list-unstyled" id="planreport">
                    <li className="sidebarMenuText">
                      <Link to="/plan-details" >
                        <i className="fa fa-pie-chart" />
                        Add New Plan
                      </Link>
                    </li>                  
                    <li>
                      <Link to="/activitywise-annual-plan-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Annual Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-plan-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Periodic Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-annual-plan-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Annual Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-periodic-plan-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Periodic Plan</span>
                      </Link>
                    </li>
                  </ul>
                </li> 



                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#Activity" data-toggle="collapse" className="menuContent" aria-expanded="false">
                    <i className="fa fa-edit" />
                    Activity Management
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse  list-unstyled" id="Activity">
                    <li>
                      <Link to="/activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Submit Activity</span>
                      </Link>
                    </li>                   
                    <li>
                      <Link to="/viewActivity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">View all Activities</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activityReportView">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Report View</span>
                      </Link>
                    </li>
                  </ul>
                </li>                 




                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#report" data-toggle="collapse" className="menuContent"  aria-expanded="false">
                    <i className="fa fa-book" />
                    Reporting System
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>

                  <ul className="collapse list-unstyled" id="report">
                    <li>
                      <Link to="/sector-wise-annual-completion-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sectorwise-periodic-variance-summary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Financial Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activitywise-annual-completion-report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Activity Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Financial Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-physical-variance-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Physical Variance</span>
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
                        <span className="sidebarMenuSubText">Family Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category-wise-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Category Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/upgraded-beneficiary-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Beneficiary Report</span>
                      </Link>
                    </li>
                  </ul>
                </li> 



                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#sreport" data-toggle="collapse" className="menuContent" aria-expanded="false">
                    <i className="fa fa-bars" />
                    Special Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse list-unstyled" id="sreport">
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




                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#MasterData" data-toggle="collapse" className="menuContent" aria-expanded="false">
                    <i className="fa fa-folder" />
                    Family & Beneficiary
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse list-unstyled" id="MasterData">
                    <li>
                      <Link to="/family">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Create Family</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="beneficiary">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Create Beneficiary</span>
                      </Link>
                    </li>             
                  </ul>
                </li> 



                <li className="sidebarMenuText" >
                  <Link to="/centerList" >
                    <i className="fa fa-th" />
                    Center List
                  </Link>
                </li>



                <li className="sidebarMenuText">
                  <Link to="/caseStudy" >
                    <i className="fa fa-th" />
                    Case Study
                  </Link>
                </li>



                <li className="sidebarMenuText">
                  <Link to="/highlight" >
                    <i className="fa fa-th" />
                    Highlights
                  </Link>
                </li>



              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
