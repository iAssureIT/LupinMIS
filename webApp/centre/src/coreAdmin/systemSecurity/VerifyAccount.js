import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import $ from "jquery";

import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

class VerifyAccount extends Component {

  constructor(){
      super();
        this.state = {

        }
  }

  render(){
    
    var y = 300;
    var h = y + 'px';

    var x = $(window).height();   
    var z = 0;
    var winHeight =(x-z) + 'px';
    var winHeight1 =(x-z) ;
    console.log('x',$(window).height());
    console.log('winHeight',winHeight1);

    var innerheight = winHeight1-200 + 'px';
    var innerheight1 = winHeight1-200 ;
   
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
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 middlepo middlebord pull-right" id="contentsroll" style={{"height": innerheight}}>
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
              <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signupPadding signUpFormWrap " style={{"marginTop": margint , "height": h}}>
                <div className="divVerifyEmailWrap">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verifypd">
                    <form id="OTPMobMail" /*onSubmit={this.VerifyMobileAOS.bind(this)}*/>
                      <h3 className="signInNameTitle"><span className="bordbt">VERIFY ACCOUNT</span></h3>
                      <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader mb15">
                          <span>Enter Mobile Number that you used for creating Account </span>
                      </div>
                      <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr veribtm">
                        <div className="input-effect input-group">
                          <InputMask mask="9999-999-999" maskChar=" " name="mobileVerifyAOS" ref="mobileVerifyAOS" /*onChange={this.handleChange}*/ className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"  pattern="^(0|[0-9-+]*)$" title="Enter Mobile Numbers!" autoComplete="off" required/>
                          <span className="input-group-addon glyphi-custommm"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                          <span className="focus-border">
                            <i></i>
                          </span>
                        </div>
                      </div>
                      <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr">
                        <button type="submit" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12 UMloginbutton">Submit</button>
                      </div>
                      <div className="col-lg-5 col-lg-offset-4 col-md-4 col-sm-4 col-xs-4 pdcls">
                        <Link to='/' className="UMGrey signInbtn UMcreateacc pdleftclr col-lg-12 col-md-12 col-sm-12 col-xs-12">Sign In</Link>   
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
export default VerifyAccount;