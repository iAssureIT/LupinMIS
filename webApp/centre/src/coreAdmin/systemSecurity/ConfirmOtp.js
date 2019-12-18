import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';

import './SignUp.css';

 class ConfirmOtp extends Component {
    constructor(props){
      super(props);
      this.state ={
        // "subscription" : {
        //   user         : Meteor.subscribe("userfunction"), 
        // }
      }
    }
    componentDidMount(){
      $("#OTPMobMail").validate({
        rules: {
          emailotp: {
            required: true,
          }
        },
        errorPlacement: function(error, element) {
          if (element.attr("name") == "emailotp"){
            error.insertAfter("#emailotpErr");
          }
        }
      });
    }
    confirmOTP(event){
      // console.log('confirm otp');
      event.preventDefault();
      if($('#OTPMobMail').valid()){
        var url = this.props.match.params;
        // console.log('url = ',url);
        var sentEmailOTP = localStorage.getItem('emailotp')
        var currentOTP = this.refs.emailotp.value
        if(sentEmailOTP===currentOTP){
          this.props.history.push('/reset-pwd')
        }
      }

      // var checkUserExist = FlowRouter.getParam("mailId");
      // var userData = Meteor.users.findOne({"_id":checkUserExist});
      // if(userData){
      //   var userProfile = userData.profile;    
      //   var roles = userData.roles;

      //   if(userProfile){
      //     var sessionValue2 = userProfile.sentEmailOTP;

      //   }
      // }

      // if(sessionValue2){
        
      //   var mailotp = sessionValue2;
      //   var newID = userData._id;
      //   var userData = Meteor.users.findOne({"_id":newID});
      //   if(userData){

      //     var userEmail = userData.username;
      //     var profile = userData.profile;
      //     if(profile){
      //       if(profile.userCode){
      //       var password = profile.userCode.split("").reverse().join(""); 
      //       }
      //     }
      //   }
      // }else{

      //   var username = $('input[name="loginusername"]').val();
      //   var userOtp = Meteor.users.findOne({"username":username});
      //   if(userOtp){
      //     var mailotp = userOtp.profile.sentEmailOTP;
      //     if(userOtp.profile.userCode){
      //       var usercode = userOtp.profile.userCode.split("").reverse().join("");
      //       var newID = userOtp._id;

      //     }
      //   }
      // }
      // var emailotp = this.refs.emailotp.value;
      // if(mailotp == emailotp){
      //   Meteor.call('createUserByAdminSetEmailToTrue',newID,
      //   function(error,result){
      //     if(error){
      //       // console.log(error.reason,"danger","growl-top-right");
      //     }else{
      //       if($('#OTPMobMail').hasClass('newPassword')){
             
      //       }else{
             
      //         if(userEmail && password){
      //           var email = userEmail;
      //           var passwordVar = password;
      //         }else{
      //           var email = username;
      //           var passwordVar = usercode;
      //         }
      //       }  
      //     }
      //   });

      //   Meteor.call('updateOTP', newID , mailotp ,roles, function(error,result){
      //     if(error){
      //       swal("error");
      //     }else{
      //       var curUrl = location.pathname;
      //       var urlArray = curUrl.split('/');
      //       var isFirstOTPurl = urlArray[1];
      //       if(isFirstOTPurl != 'otpFirstVarification'){
      //       FlowRouter.go('/resetPassword/'+newID);
      //       }else{
              
      //            Meteor.logout();
      //            swal("OTP Verified Successfully",
      //                 // 'Please complete your registration process by completing your profile after login. ',
      //                 'To continue filling registration form please contact admin first to make your account active.',
      //               'success');
      //               FlowRouter.go('/');
               
      //       }
      //     }
      //   });
      // }else{
      //   swal('OTP is Incorrect',
      //         '',
      //         'warning');
      // }
    // $('#assureIDModal').show();
    }



    inputEffect(event){
      event.preventDefault();
      if($(event.target).val() != ""){
        $(event.target).addClass("has-content");
      }else{
        $(event.target).removeClass("has-content");
      }
    }

    resendOtp(event){
      event.preventDefault();
      var element = document.getElementById("resendOtpBtn");
      element.classList.add("btn-success");
      element.classList.remove("resendOtpColor");
      var sentEmailOTP = localStorage.getItem('emailotp')
      var email = localStorage.getItem('email')
      axios
      .patch('/api/users/setotp/'+email,{'emailotp' : sentEmailOTP})
      .then((response)=> {
        axios
        .get('/api/users/email/'+email)
        .then((response)=> {
          // console.log("-------name------>>",response);
          if(response&&response.data){
            var msgvariable = {
              '[User]'    : response.data.profile.firstName+' '+response.data.profile.lastName,
              '[OTP]'     : sentEmailOTP
            }
            // console.log("msgvariable :"+JSON.stringify(msgvariable));
            var inputObj = {  
              to           : email,
              templateName : 'User - Forgot Password OTP',
              variables    : msgvariable,
            }
            // axios
            // .post('/api/masternotification/send-mail',inputObj)
            // .then((response)=> {
            // })
            // .catch(function (error) {
            //   console.log(error);
            // })
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      })
      .catch(function (error) {
        console.log(error);
      })
      // var checkUserExist = FlowRouter.getParam("mailId");
      // var userData = Meteor.users.findOne({"_id":checkUserExist});
      // if(userData){
      //   var userProfile = userData.profile;    
      //   if(userProfile){
      //     var sessionValue2 = userProfile.sentEmailOTP;
      //     var mobNumber = userProfile.mobNumber;
      //     var firstName  = userProfile.firstname;

      //   }
      //    var emailotp = Math.floor(100000 + Math.random() * 900000);

      //   Meteor.call('addOTP', userData._id, emailotp, function(error,result){
      //     if(error){
      //       console.log(error);
      //     }else{

      //       Meteor.call("sendSMSMsg",firstName,mobNumber,emailotp,(error,result)=>{
      //         if(error){

      //         }else{
      //           swal("We have sent OTP to your registered mobile number","","success");
      //              $("input[name=emailotp]").val('');   
      //           element.classList.add("resendOtpColor");
      //           element.classList.remove("btn-success");
      //         }
      //       });
      //     }
      //   });
      // }else{
      //   swal("You are not registered","","warning");
      // }

    }


  render(){
    // if(location.pathname=='/forgotOTPVarification/'+FlowRouter.getParam("mailId")){
    //    var mobileEmail = 'Email Id';
    //    var resendOtp ='';
    // }else{
      var resendOtpWrap = "resendOtpWrap resendOtpWrapcss";
      var mobileEmail = 'Mobile Number';
      var resendOtp = <span onClick={this.resendOtp.bind(this)}><u>Resend OTP</u></span>;
    // }

    var y = 380;
    var h = y + 'px';

    var x = $(window).height();   
    var z = 0;
    var winHeight =(x-z) + 'px';
    var winHeight1 =(x-z) ;
    console.log('x',$(window).height());
    console.log('winHeight',winHeight1);

    var innerheight = winHeight1-80 + 'px';
    var innerheight1 = winHeight1-80 ;
   
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
              <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signUpFormWrap " style={{ "marginTop": margint , "height": h}}>
                <div className="divLoginInWrap">
                  
                      <div className="divConfirmOtpModalWrap">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" className="firstverification">
                          <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                            <span>We have sent you a Verification Code to your registered <b>mobile and Email </b>.<br/><br/></span>
                          </div>
                          <form id="OTPMobMail" onSubmit={this.confirmOTP.bind(this)}>
                            <div className="col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 veriemail veribtm1">
                              <div className="text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                                <span>Enter six digit verification code received on <b>Email<label className="sign asterix">*</label></b>.<br/></span>
                              </div>
                              <div className="input-effect input-group" id="emailotpErr">
                                <input type="text" className="effect-21 form-control loginInputs " ref="emailotp" name="emailotp" onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" title="Please enter numbers only!" maxLength="6" pattern="(0|[0-9]*)" required/>
                                <span className="input-group-addon glyphi-custommm"><i className="fa fa-key" aria-hidden="true"></i></span>
                                <span className="focus-border">
                                  <i></i>
                                </span>
                              </div>
                             {/* <div className="text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                                <span>Enter four digit verification code received on <b>Mobile</b>.<br/></span>
                              </div>
                              <div className="input-effect input-group veribtm1">
                                <input type="text" className="effect-21 form-control loginInputs " ref="emailotp" name="emailotp" onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" title="Please enter numbers only!" maxLength="4" pattern="(0|[0-9]*)" required/>
                                <span className="input-group-addon glyphi-custommm"><i className="fa fa-key" aria-hidden="true"></i></span>
                                <span className="focus-border">
                                  <i></i>
                                </span>
                              </div>*/}
                            </div>
                            <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 veriemail">
                              <button type="submit" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12 UMloginbutton">Submit</button>
                            </div>
                            <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 veriemail">
                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls">
                                <Link to='/' className="UMGreyy"><u>Sign In</u></Link>  
                              </div>
                              <div id="resendOtpBtn" className={"col-lg-6 col-md-6 col-sm-12 col-xs-12  resendOtpColor "+resendOtpWrap}>
                                {resendOtp}
                              </div>
                            </div>
                          </form>
                        </div>
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
export default ConfirmOtp;