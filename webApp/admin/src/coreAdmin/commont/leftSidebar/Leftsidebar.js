import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";
import Header from '../header/Header.js'


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
                <div className="sidebar-header">{/*
                    <h4 className="logopos">ProjectAdmin Sidebar</h4>*/}
                    <h4 className=" zeromargin"><img className="imgLogo " src="images/Logo.png"  alt="TGK" width="80px" height="45px" /></h4>
                  
                    <strong className="clspadding">  <img src="images/Keylogo.png"  alt="TGK" height="28px"/></strong>
                </div>

                <ul className="list-unstyled components">
                    <li className="active">
                    <a href="#">
                            <i className="glyphicon glyphicon-briefcase"></i>
                            Dashboard
                     </a>
                    </li>
                    <li>
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">
                            <i className="glyphicon glyphicon-home"></i>
                            Master Data
                        </a>
                        <ul className="collapse list-unstyled" id="homeSubmenu">
                            <li><a href="/masterdata">Amenities</a></li>
                            {/*<li><a href="#">Data 2</a></li>
                            <li><a href="#">Data 3</a></li>*/}
                        </ul>

                        <a href="#sell-o-meter" data-toggle="collapse" aria-expanded="false">
                            <i className="glyphicon fa fa-star-half-o"></i>
                            Sell-O-Meter
                        </a>
                        <ul className="collapse list-unstyled" id="sell-o-meter">
                            <li><a href="/sellometer">Property Indexation</a></li>
                            <li><a href="/classrating">Sell-O-Meter Rating</a></li>
                            {/*<li><a href="#">Data 3</a></li>*/}
                        </ul>

                         <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false">
                            <i className="glyphicon glyphicon-duplicate"></i>
                            Reporting System
                        </a>
                        <ul className="collapse list-unstyled" id="pageSubmenu">
                            <li><a href="#">Report 1</a></li>
                            <li><a href="#">Report 2</a></li>
                            <li><a href="#">Report 3</a></li>
                        </ul>
                        
                    </li>
                   {/* <li>
                        <a href="/masterdata">
                            <i className="glyphicon glyphicon-link"></i>
                           Master Data
                        </a>
                    </li>*/}
                   {/* <li>
                        <a href="#">
                            <i className="glyphicon glyphicon-paperclip"></i>
                            Framework Management
                        </a>
                    </li>*/}
                    
                </ul>

               </nav>

        </div>
 
            </aside>
      </div>
    );
  }
}
