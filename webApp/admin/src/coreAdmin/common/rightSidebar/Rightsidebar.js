import React,{Component}                      from 'react';
import {BrowserRouter as Router, Route,Link } from 'react-router-dom';
import $                                      from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


import './Rightsidebar.css';

export default class Rightsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
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
                  {/* <li>
                        <a href="#userman" data-toggle="collapse" aria-expanded="false">
                           <i className="fa fa-user-circle"></i> &nbsp;
                           User Management
                        </a>
                        <ul className="collapse list-unstyled " id="userman">
                          <li><a href="/umlistofusers"><p className="leftpadd">List of Users</p></a></li>
                          <li><a href="/umlistofemp"><p className="leftpadd">Team Hierarchy</p></a></li>                           
                        </ul>
                      </li>*/}     
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Router>
    );
  }
}
