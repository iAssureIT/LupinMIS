import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import $              from 'jquery';
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
clickFunction(event){
   document.getElementById("mySidenav").style.display = "block"; 
}
logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      },()=>{
        localStorage.removeItem("emailId");
        localStorage.removeItem("center_ID");
        localStorage.removeItem("centerName");
        localStorage.removeItem("fullName");
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
    <div className="section-not-print">
            <header className="">
              <div className="col-lg-12 padd0 pageHeader">
                <div className="col-lg-6 col-md-4 col-sm-4 col-xs-4 padd0">
                  <div className="">
                    <div id="sidebarCollapse" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 hover ">
                    <i className="fa fa-bars headicon"></i>
                  </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 padd0">
                  <div className="col-lg-5 col-md-7 col-sm-9 col-xs-12 pull-right hover logoutAct">
                    <div className="row hover" onClick={this.LogoutSectionHover.bind(this)}>
{/*                      <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colorboxbefore hoverText mailtext"> {this.state.emailId ? this.state.emailId : ""}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<i className="fa fa-angle-down"></i>  </span>  */}
                      <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colorboxbefore hoverText "> 
                        <span className="col-lg-10 ">
                          <label className="mailtext" >{this.state.emailId ? this.state.emailId : ""}</label>
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
                            <img src="images/person.png" height="50px" className=" marLeft "/>
                          </div>
                          <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 pull-right  padd0 ">
                           <h5 className="fontB fs12 nomargin ">
                              {this.state.fullName ? this.state.fullName : ""}
                           {/*   Super Admin*/}
                           </h5>
                            <h6 className="fontB fs12 dropmailtext">{/*superAdmin@gmail.com*/} {this.state.emailId ? this.state.emailId : ""}</h6>
                          </div>
                        </div>
                        <hr className="borderline marTop"/>
                        <div className="marTop">
                          {/*<span className="pull-left">
                            <a  className=" profileTitle btnpadd" href="/#">
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


/*
                    */