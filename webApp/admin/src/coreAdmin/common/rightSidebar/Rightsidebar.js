import React,{Component}                      from 'react';
// import {BrowserRouter as Router, Route,Link } from 'react-router-dom';
import $                                      from "jquery";
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import { render }        from 'react-dom';

// // import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


import './Rightsidebar.css';
export default class Rightsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      "role"                : localStorage.getItem("role")
    }
  }
  componentDidMount(){
    $(document).ready(function () {
      $('.activeClass li').on('click', function() {
        $('.activeClass li').removeClass('activeOne');
        $(this).addClass('activeOne');
      });
    });
  }    
  eventclk1(event){
    // event.preventDefault();
    // $(event.currentTarget).children('.treeview-menu').slideToggle();
    // $(event.currentTarget).addClass('active');
    // $(event.currentTarget).children(Link).children(".rotate").toggleClass("down");
    // $(event.currentTarget).siblings('li').removeClass('active');
  } 
  render(){
    return(
        <div>
          <aside className="leftsidebar">
            <div className="wrapper">
              <nav id="sidebar1">       
                <ul className="list-unstyled components">
                  <li className="active">
                    <div className="rightsideHeading ">
                      Core Admin Modules
                    </div>
                  </li>
                  <li className="sidebarMenuText">
                    <a href={"/profile/"+localStorage.getItem('user_ID')}>
                       <i className="fa fa-user"></i> 
                         My Profile
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/reset-password">
                       <i className="fa fa-hand-o-left"></i> 
                       Reset Password
                    </a>
                  </li>
                  {
                  this.state.role !== "viewer" ? 
                    <React.Fragment>
                      
                      <li className="sidebarMenuText">
                        <a href="/companysetting" >
                          <i className="fa fa-building" />
                          Organization Setting
                        </a>
                      </li>
                      <li className="sidebarMenuText">
                        <a href="/ViewTemplates" >
                          <i className="fa fa-envelope" />
                          Notification Management
                        </a>
                      </li>
                      <li className="sidebarMenuText">
                        <a href="/umlistofusers" >
                           <i className="fa fa-users"></i> 
                             User Management
                        </a>
                      </li>
                      <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                        <Link to="#LocationMaster" data-toggle="collapse" className="" aria-expanded="false" title="Location Master">
                          <i className="fa fa-map-marker" />
                          Location Master
                          <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                        </Link>
                        <ul className="collapse   list-unstyled activeClass" id="LocationMaster">
                          <li>
                            <Link to="/statebulkupload" title="State Bulk Upload">
                              <i className="fa fa-circle-o" /> 
                              <span className="sidebarMenuSubText">State Bulk Upload</span>
                            </Link>
                          </li>
                          <li>
                            <Link to="/districtbulkupload" title="District Bulk Upload">
                              <i className="fa fa-circle-o" /> 
                              <span className="sidebarMenuSubText">District Bulk Upload</span>
                            </Link>
                          </li>
                          <li>
                            <Link to="/blockbulkupload" title="Block Bulk Upload">
                              <i className="fa fa-circle-o" /> 
                              <span className="sidebarMenuSubText">Block Bulk Upload</span>
                            </Link>
                          </li>
                          <li>
                            <Link to="/villagebulkupload" title="Village Bulk Upload">
                              <i className="fa fa-circle-o" /> 
                              <span className="sidebarMenuSubText">Village Bulk Upload</span>
                            </Link>
                          </li>
                          <li>
                            <Link to="/listoflocations" title="List of Location">
                              <i className="fa fa-circle-o" /> 
                              <span className="sidebarMenuSubText">List of Location</span>
                            </Link>
                          </li>
                        </ul>
                      </li> 
                      </React.Fragment>
                    : null
                  }
                  
                </ul>
              </nav>
            </div>
          </aside>
        </div>
    );
  }
}
