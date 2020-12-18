import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import $              from 'jquery';
import { render } from 'react-dom';
import { Route , withRouter} from 'react-router-dom';
import Rightsidebar from '../rightSidebar/Rightsidebar.js';
// // import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './Header.css';

export default class Header extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      loggedIn : false,
      "role"                : localStorage.getItem("role")
    }
  }

  componentDidMount(){
    const Token     = localStorage.getItem("token");
    const emailId   = localStorage.getItem("emailId");
    const center_ID = localStorage.getItem("center_ID");
    const fullName  = localStorage.getItem("fullName");
   // console.log("localStorage =",localStorage.getItem('user_ID'));
    // console.log("localStorage =",localStorage);
    this.setState({
      emailId   : emailId,
      fullName  : fullName,
    },()=>{
      // console.log("fullName =",this.state.fullName);
    });   
  }
      
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  toggleLeftNav(event){
    event.preventDefault()
    $('#sidebar').toggleClass('active')
    $('#headerid').toggleClass('headereffect');
    $('#dashbordid').toggleClass('dashboardeffect')
  }

  toggleNav(event){
    event.preventDefault()
    var currentWidth =  document.getElementById("mySidenav").style.width;
    // console.log("currentWidth",currentWidth);
    if(currentWidth === "230px")
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
      },()=>{
        localStorage.removeItem("emailId")
        localStorage.removeItem("center_ID")
        localStorage.removeItem("centerName")
        localStorage.removeItem("fullName")
        localStorage.removeItem('role')
      })
      // browserHistory.push("/login"); 
      // this.props.history.push("/login");
    }
  }


  LogoutSectionHover(event){
     $(".colorboxbefore").toggleClass("colorbox");
    $('.showme').toggle(); 
  }

  render(){

    return(
    <div>
            <header className="">
              <div className="col-lg-12 padd0 pageHeader">
                <div className="col-lg-6 col-md-4 col-sm-4 col-xs-4 padd0">
                  <div className="">
                    <div id="sidebarCollapse" onClick={this.toggleLeftNav.bind(this)} className="col-lg-1 col-md-1 col-sm-1 col-xs-1 hover ">
                    <i className="fa fa-bars headicon"></i>
                  </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 padd0 pull-right">
                  <div className="">

                  {/*
                    this.state.role !== "viewer" ? 
                    : null
                  */}
                  <React.Fragment>
                      <div onClick={this.toggleNav.bind(this)} className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right hover">
                        <i className="fa fa-cogs headicon "></i>
                      </div>
                  </React.Fragment>
                  <div className="col-lg-5 col-md-8 col-sm-8 col-xs-8 pull-right padd0">
                    <div className="col-lg-12 col-md-7 col-sm-9 col-xs-12  hover pull-right logoutAct">
                      <div className="row hover" onClick={this.LogoutSectionHover.bind(this)}>
                          {/*         <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colorboxbefore hoverText mailtext"> {this.state.emailId ? this.state.emailId : ""} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<i className="fa fa-angle-down"></i> </span>  */}
                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colorboxbefore hoverText "> 
                          <span className="col-lg-10 ">
                            <label className="mailtext formLable"  title={this.state.emailId ? this.state.emailId : ""}><b>{this.state.emailId ? this.state.emailId : ""}</b></label>
                          </span>  
                          <span className="col-lg-2">
                            <i className="fa fa-angle-down"></i> 
                          </span> 
                        </span> 
                        <div className="arrow-up showme"></div>
                        <div className="col-lg-12 user-footer showme">
                          <div className=" " > 
                            <p className="pull-right fntC" style={{"cursor":"pointer"}} title="Close">X</p><br/>
                            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 pull-left padd0 ">
                              <img src="/images/person.png" alt="user" height="50px" className=" marLeft "/>
                            </div>
                            <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 pull-right  padd0 ">
                             <h5 className="fontB fs12 nomargin ">
                                {this.state.fullName ? this.state.fullName : ""}
                             {/*   Super Admin*/}
                             </h5>
                              <h6 className="fontB fs12 dropmailtext" title={this.state.emailId ? this.state.emailId : ""}>{/*superAdmin@gmail.com*/} {this.state.emailId ? this.state.emailId : ""}</h6>
                            </div>
                          </div>
                          <div className="marTop">
                          <hr className="borderline marTop"/>
                            {/*<span className="pull-left">
                              <a  className=" profileTitle btnpadd " href="/#">
                               <button type="button" className="profilebtn btn">Profile</button></a>
                            </span>*/}
                            {/*<span className="pull-right">*/}
                            <span className="col-lg-offset-4">
                              <a  className="profileTitle btnpadd" href="/login">
                              {/* <button type="button" className="profilebtn">Logout</button>*/}
                                 <button type="button" className="btn  profilebtn" onClick={this.logout.bind(this)}>Sign Out</button>
                              </a>
                           </span>  
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
             {  /*   <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right hover paddLeft5">
                    <i className="fa fa-bell  headicon "><span className="label label-warning labelhead ">10</span></i>
                  </div>*/}
                </div>
              </div>
            </div>
            </header>
            <div id="mySidenav" className="sidenav">
              <Rightsidebar/>
            </div>
      </div>
    );
  }
}