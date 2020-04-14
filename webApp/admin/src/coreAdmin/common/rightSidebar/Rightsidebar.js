import React,{Component}                      from 'react';
import {BrowserRouter as Router, Route,Link } from 'react-router-dom';
import $                                      from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
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
          }    
  

  render(){
    return(
      <Router>
        <div>
          <aside className="leftsidebar">
            <div className="wrapper">
              <nav id="sidebar1">       
                <ul className="list-unstyled components">
                 
                  {/*<li className="sidebarMenuText">
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
                  </li>*/}
                  {
                  this.state.role !== "viewer" ? 
                    <React.Fragment>
                      <li className="active">
                        <div className="rightsideHeading ">
                             {/*   <i className="fa fa-server"></i> &nbsp;*/}
                               Core Admin Modules
                        </div>
                      </li>
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
                      </React.Fragment>
                    : null
                  }
                  
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Router>
    );
  }
}
