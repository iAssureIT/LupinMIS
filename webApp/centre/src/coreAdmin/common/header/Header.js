import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { Route , withRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './Header.css';
import Rightsidebar from '../rightSidebar/Rightsidebar.js';

export default class Header extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
              loggedIn : false,
    }
  }

  componentDidMount(){
    const Token     = localStorage.getItem("token");
    const emailId   = localStorage.getItem("emailId");
    const center_ID = localStorage.getItem("center_ID");
    const fullName  = localStorage.getItem("fullName");
    // console.log("localStorage =",localStorage.getItem('fullName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      emailId   : emailId,
      fullName  : fullName,
    },()=>{
      console.log("fullName =",this.state.fullName);
    });   
  }
    
openNav() {
  var currentWidth =  document.getElementById("mySidenav").style.width;
  console.log("currentWidth",currentWidth);
  document.getElementById("mySidenav").style.width = "250px";
}

closeNav() {
  var currentWidth =  document.getElementById("mySidenav").style.width;
  console.log("currentWidth",currentWidth);
  document.getElementById("mySidenav").style.width = "0";

}

toggleNav(){

  var currentWidth =  document.getElementById("mySidenav").style.width;
  console.log("currentWidth",currentWidth);

  if(currentWidth == "230px")
  {
   document.getElementById("mySidenav").style.width = "0"; 
 }else{
    document.getElementById("mySidenav").style.width = "230px";
 }

}

logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      })
      // browserHistory.push("/login");
      // this.props.history.push("/login");
    }
  }


  render(){

    return(
    <div>
            <header className="pageHeader">
              <div className="col-lg-12 padd0">
                <div className="col-lg-6 col-md-4 col-sm-4 col-xs-4 padd0">
                  <div className="">
                    <div id="sidebarCollapse" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 hover ">
                    <i className="fa fa-bars headicon"></i>
                  </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 padd0">
                  <div className="row">
                  {/* { <div onClick={this.toggleNav.bind(this)}className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right hover">
                    <i className="fa fa-cogs headicon "></i>
                  </div>}*/}
                  {/*<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right hover paddLeft5">
                    <i className="fa fa-bell  headicon "><span className="label label-warning labelhead ">10</span></i>
                  </div>*/}
                  <div className="col-lg-5 col-md-6 col-sm-6 col-xs-6 pull-right noPadding">
                    <div className="">
                     { /*<div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 ">
                      <img src="image/person.png" className="img "/>
                      </div>*/}
                      <div className="col-lg-12 col-md-10 col-xs-6 col-sm-6 dropdown hover">
                        <span className=" topmargin pull-right">
                          <button className="dropbtn arrowbtn">
                           <span className="hidden-xs angleright"><i className="fa fa-angle-down" aria-hidden="true"></i></span>
                          </button>
                          <div className="dropdown-content col-lg-12 col-md-10 col-xs-6 col-sm-6   marTop" >
                              <ul className="paddleft nomargin">
                                <li className="user-header">
                                  <ul className="menu paddleft">
                                    <li>
                                      <a className="noneAtag">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 padd0 " > 
                                            <div className="col-lg-3  col-md-6 col-sm-12 col-xs-12 pull-left padd0 marTop ">
                                              <img src="images/person.png" height="50px" className=" marLeft "/>
                                            </div>
                                            <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 pull-right padd0 marTop">
                                             <h6 className="fontB fs12 nomargin ">
                                                 {this.state.fullName ? this.state.fullName : ""}
                                             </h6>
                                              <h6 className="fontB fs12"> {this.state.emailId ? this.state.emailId : ""}</h6>
                                            </div>
                                        </div>
                                      </a>
                                     <hr className="borderline marTop"/>
                                      <div className="profilefoot"> 
                                      <div>                                     
                                        <span className="pull-left">
                                          <a  className=" profileTitle btnpadd " >
                                           <button type="button" className="profilebtn btn">Profile</button></a>
                                        </span>
                                        <span className="pull-right">
                                          <a  className="profileTitle btnpadd" href="/login">
                                          {/* <button type="button" className="profilebtn">Logout</button>*/}
                                        <button type="button" className="btn  profilebtn" onClick={this.logout.bind(this)}>Logout</button>
                                          </a>

                                       </span>  
                                      </div>
                                      </div>
                                    </li>
                                  </ul>
                                </li>                                        
                              </ul>
                          </div>
                        </span>
                        <span className="hoverText pull-right">{this.state.emailId ? this.state.emailId : ""} &nbsp;</span>  

                      </div>
                    </div>
                  </div>                
                  
                </div>
              </div>
            </div>
            </header>
       {/*   <div id="mySidenav" className="sidenav">*/}
         {/* <a href="javascript:void(0)" className="closebtn" onClick={this.toggleNav.bind(this)} >&times;</a>
         */}
       {/*  <Rightsidebar/>
        </div>*/}
      </div>
    );
  }
}