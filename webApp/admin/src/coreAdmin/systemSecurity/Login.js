import React, { Component } from 'react';
import { Link} from 'react-router-dom';
// import {browserHistory} from 'react-router-dom';
import { Redirect } from 'react-router';
import swal from 'sweetalert';
import $ from "jquery";
import validate               from 'jquery-validation';

import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

import axios from 'axios';


class Login extends Component {

  constructor(){
      super();
        this.state = {           
          loggedIn : false,
          auth: {
                email           : '',
                pwd             : '',
            }
        }
  }
  componentDidMount(){
    $("#login").validate({
      rules: {
        loginusername: {
          required: true,
        },
        loginpassword: {
          required: true,
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "loginusername"){
          error.insertAfter("#loginusernameErr");
        }
        if (element.attr("name") === "loginpassword"){
          error.insertAfter("#loginpasswordErr");
        }
      }
    });
  }
  userlogin(event){
    event.preventDefault();
    if($("#login").valid()){
      var auth= {
        email       : this.refs.loginusername.value,
        password    : this.refs.loginpassword.value,
        roles       : ['admin','viewer']
      }
      axios
      .post('/api/users/login',auth)
      .then((response)=> {

        console.log("response",response)
        axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.token;
        localStorage.setItem("user_ID",response.data.user_ID);
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("emailId",response.data.emailId);
        // localStorage.setItem("center_ID",response.data.center_ID);
        // localStorage.setItem("centerName",response.data.centerName);
        localStorage.setItem("fullName",response.data.fullName);
        localStorage.setItem("role",response.data.roles[0]);
        if(axios.defaults.headers.common.Authorization){
          this.props.history.push("/dashboard");
          window.location.reload();
          if(localStorage===null){ 
            swal("Invalid Email or Password","Please Enter valid email and password");
          }else{
            this.setState({
                loggedIn  :   true
            },()=>{
            })
          }
        }
      })
      .catch(function (error) {
        if(error.response&&error.response.status===401){
          swal("Invalid Email or Password","Email ID does not exists");
        }else if(error.response&&error.response.status===409){
          swal("Invalid Email or Password","Please Enter a valid password");
        }else{
          swal("Invalid Email or Password","Please try again");
        }
      });
    }
  }
  showSignPass(){
      $('.showPwd').toggleClass('showPwd1');
      $('.hidePwd').toggleClass('hidePwd1');
      return $('.inputTextPass').attr('type', 'text');
  }
  hideSignPass(){
      $('.showPwd').toggleClass('showPwd1');
      $('.hidePwd').toggleClass('hidePwd1');
      return $('.inputTextPass').attr('type', 'password');
  }
  render(){
    var y = 340;
    var h = y + 'px';

    var x = $(window).height();   
    var z = 0;
    var winHeight =(x-z) + 'px';
    var winHeight1 =(x-z) ;

    var innerheight = winHeight1-60 + 'px';
    var innerheight1 = winHeight1-100 ;
   
    var margin = parseInt( innerheight1-y );
    var margint = (margin/2);
    var windowWidth = $(window).width();
    if(windowWidth>=320&&windowWidth<=992){
    var backImage = "visible-xs col-xs-12 visible-sm col-sm-12 noBackImage"
    }else{
    var backImage = "signUpBackground hidden-xs hidden-sm"
    }
    if(this.state.loggedIn===true){
      return <div></div>
    }

    return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 middlepo middlebord pull-right" id="contentsroll" style={{"height": innerheight}}>
          <div className="row">
              <div id="scrollcont" className={backImage} style={{"height": winHeight}}>
                <div className="col-lg-12 systemHeader   ">
                  <div className="col-lg-6 col-md-6 col-sm-6 ">
                    <img alt="lupinImage" className="lupinImage" src="images/lupin.png" height="70px"/>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 text-center logoName">
                    Admin <br/>Management Information System
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">   
                  <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signupPadding signUpFormWrap " style={{ "marginTop": margint , "height": h}}>
                    <div className="divLoginInWrap">
                      <form id="login" className="" onSubmit={this.userlogin.bind(this)}>
                        <div className="col-lg-4 col-lg-offset-4 ">
                     
                        {<h4 className="signInNameTitle mb35"><span className="bordbt">SIGN IN</span></h4>
                        }</div>
                        <div className="col-lg-12 col-md-12 col-sm-12 form-group emailHeight">
                          <div className="inputContent">
                            <span className="blocking-span noIb" id="loginusernameErr">
                              <input type="email" className="col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox" onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="" required/>
                              <span className="floating-label"><i className="fa fa-envelope signupIconFont" aria-hidden="true"/>Email ID<label className="sign asterix">*</label></span>   
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <div className="form-group form-group1 fltlft input-group col-lg-12 col-md-12 col-sm-12 inputContent ">     
                            <span className="blocking-span noIb" id="loginpasswordErr">
                              <input type="password" className="form-control border3 pass oesSignUpForm confirmbtm inputTextPass tmsLoginTextBox" ref="loginpassword" name="loginpassword" required/>
                              <span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Password<label className="sign asterix">*</label></span>                 
                            </span>
                         
                          <div className="showHideSignDiv">
                            <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                            <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                          </div> 
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <input id="logInBtn" type="submit" className="btn col-lg-12 col-md-12 col-xs-12 col-sm-12 UMloginbutton hvr-sweep-to-right" value="Sign In"/>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  customFl pdcls ">
                         
                          <div className="col-lg-6 col-md-6 col-sm-6 pull-right">
                            <Link to='/forgot-pwd' className="UMGreyy UMGreyy_l pull-right">
                              <u>Forgot Password?</u>
                            </Link>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 pdcls btn">
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
  }
}
export default Login;