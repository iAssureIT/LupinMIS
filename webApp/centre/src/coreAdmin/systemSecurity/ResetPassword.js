import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import swal from 'sweetalert';
import axios from 'axios';
import $ from "jquery";

import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

class ResetPassword extends Component {

  constructor(){
      super();
        this.state = {           
        
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
  showSignPassC(){
    $('.showPwdC').toggleClass('showPwd1C');
    $('.hidePwdC').toggleClass('hidePwd1C');
    return $('.inputTextPassC').attr('type', 'text');
  }
  hideSignPassC(){
    $('.showPwdC').toggleClass('showPwd1C');
    $('.hidePwdC').toggleClass('hidePwd1C');
    return $('.inputTextPassC').attr('type', 'password');
  }
  changepassword(event){
    event.preventDefault()
    var email = localStorage.getItem('email')
    var password = this.refs.resetPassword.value;
    var confirmpassword = this.refs.resetPasswordConfirm.value;
    if(password===confirmpassword){
      axios
      .patch('/api/users/resetpwd/'+email,{'pwd' : password})
      .then((response)=> {
        localStorage.removeItem('emailotp')
        localStorage.removeItem('email')
        this.props.history.push('/')  
      })
      .catch(function (error) {
        console.log(error);
      })
    }else{
      swal("Password doesn't match")
    }
  }

  render(){
   
    var y = 320;
    var h = y + 'px';

    var x = $(window).height();   
    var z = 0;
    var winHeight =(x-z) + 'px';
    var winHeight1 =(x-z) ;
    console.log('x',$(window).height());
    console.log('winHeight',winHeight1);

    var innerheight = winHeight1-160 + 'px';
    var innerheight1 = winHeight1-160 ;
   
    var margin = parseInt( innerheight1-y );
    var margint = (margin/2);
    console.log('margint',margint);
    console.log('margin',margin);
    var windowWidth = $(window).width();
    // console.log('ww',windowWidth);
    if(windowWidth>=320&&windowWidth<=992){
    var backImage = "visible-xs col-xs-12 visible-sm col-sm-12 noBackImage"
    }else{
    var backImage = "signUpBackground hidden-xs hidden-sm"
    }
    if(this.state.loggedIn===true){
      return <div></div>
    }


    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-right" id="contentsroll" style={{"height": innerheight}}>
          <div className="row">
            <div id="scrollcont" className={backImage} style={{"height": winHeight}}>
                <div className="col-lg-12 systemHeader   ">
                  <div className="col-lg-6 col-md-6 col-sm-6 ">
                    <img className="lupinImage" src="images/lupin.png" height="70px"/>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 text-center logoName">
                    Center <br/>Management Information System
                  </div>
                </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">   
                <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signupPadding signUpFormWrap " style={{ "marginTop": margint , "height": h}}>
                  <div className="divLoginInWrap">
                    {/*<div className="col-lg-4 col-lg-offset-4  ">
                      <img className="logoImage" src="images/logo.png" height="70px"/>
                    </div>    */}  
                    <h3 className="signInNameTitle"> <span className="bordbt">RESET PASSWORD</span></h3>
                    <div className="FormWrapper1 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form id="resetPassword" onSubmit={this.changepassword.bind(this)}>
                        <div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-group">
                            <span className="input-group-addon addons glyphi-custommmLeft" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                            <input type="password" className="form-control loginInputs inputTextPass" ref="resetPassword" name="resetPassword" placeholder="New Password" aria-label="Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                            <span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
                              <i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                              <i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                            </span>
                          </div>
                        </div>
                        <div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-group">
                            <span className="input-group-addon addons glyphi-custommmLeft" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                            <input type="password" className="form-control loginInputs inputTextPassC" ref="resetPasswordConfirm" name="resetPasswordConfirm" placeholder="Confirm New Password" aria-label="Confirm Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                            <span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
                              <i className="fa fa-eye Pass showPwdC" aria-hidden="true" onClick={this.showSignPassC.bind(this)}></i>
                              <i className="fa fa-eye-slash Pass hidePwdC" aria-hidden="true" onClick={this.hideSignPassC.bind(this)}></i>
                            </span>
                          </div>
                        </div>
                        <div className="submitButtonWrapper pdleftclr col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn UMloginbutton">Reset Password</button>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pdcls">
                           <Link to='/' className="UMGreyy"><u>Sign In</u></Link>   
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
export default ResetPassword;