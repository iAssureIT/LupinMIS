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
           {       /*<li className="sidebarMenuText">
                               <a href={"/profile/"+localStorage.getItem('user_ID')}>
                                  <i className="fa fa-user"></i> 
                                    My Profile
                               </a>
                             </li>*/}
                  <li className="sidebarMenuText">
                    <a href="/reset-password">
                       <i className="fa fa-hand-o-left"></i> 
                       Reset Password
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
