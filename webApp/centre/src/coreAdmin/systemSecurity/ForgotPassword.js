import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';
import validate               from 'jquery-validation';
import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

class ForgotPassword extends Component {
    constructor(){
      super();
      this.state ={
        email  : '',
        buttonValue : 'Send Verification Code',
        // mobile  : '',
        // subscription    : {
        //   user: Meteor.subscribe("userfunction"), 
        // }
      }
    }
    componentDidMount(){
      $("#forgotPassword").validate({
        rules: {
          enterEmail: {
            required: true,
          }
        },
        errorPlacement: function(error, element) {
          if (element.attr("name") === "enterEmail"){
            error.insertAfter("#enterEmailErr");
          }
        }
      });
      var x = this.props.match.params;
      console.log('x',x);
    }
    forgotpassword(event){
      // console.log('forgotpassword');
      event.preventDefault();
      if($("#forgotPassword").valid()){
        var email = this.refs.enterEmail.value;
        // var mobile = this.refs.enterMobNo.value;
        // console.log("email: ",email);
       this.setState({
        email : email,
        buttonValue : 'Please Wait...'
        // mobile : mobile,
       },()=>{
        var userOtp = 1 /*Meteor.users.findOne({"username":email})*/;
        // console.log("userOtp: ",userOtp);
       
        if(userOtp===1){
          var mobileotp = Math.floor(1000 + Math.random() * 9000);
          var emailotp = Math.floor(100000 + Math.random() * 900000);
          localStorage.setItem('emailotp',emailotp)
          localStorage.setItem('email',this.state.email)
          // console.log('this.state.email',this.state.email)
          var that = this
          axios
          .patch('/api/users/setotp/'+this.state.email,{'emailotp' : emailotp,'type' : 'center'})
          .then((response)=> {
            axios
            .get('/api/users/email/'+this.state.email)
            .then((response)=> {
              // console.log("-------name------>>",response);
              if(response&&response.data){
                var msgvariable = {
                  '[User]'    : response.data.profile.firstName+' '+response.data.profile.lastName,
                  '[OTP]'     : emailotp
                }
                // console.log("msgvariable :"+JSON.stringify(msgvariable));
                var inputObj = {  
                  to           : this.state.email,
                  templateName : 'User - Forgot Password OTP',
                  variables    : msgvariable,
                }
                axios
                .post('/api/masternotification/send-mail',inputObj)
                .then((response)=> {
                  // console.log("-------mail------>>",response);
                  this.setState({
                    buttonValue : 'Send Verification Code'
                  },()=>{
                    this.props.history.push("/confirm-otp");
                  })
                })
                .catch(function (error) {
                  console.log(error);
                  swal("abc","Email ID is Invalid.").then(() => {
                    // console.log('that',that)
                    that.setState({
                      buttonValue : 'Send Verification Code'
                    })
                  });                  
                })
              }
            })
            .catch(function (error) {
              console.log(error);
            })
          })
          .catch(function (error) {
            // console.log(error);
            if(error.response.status===404){
              swal('abc','Email Id does not exists.').then(() => {
                // console.log('that',that)
                that.setState({
                  buttonValue : 'Send Verification Code'
                })
              });
            }
          })
        }else{
          swal('Email Address not found',"Please enter valid Email Id","warning");                  
        }
       });

        
        //       // Session.set('mobotp',mobileotp);
        ///////////////
        //       // Session.set('mailotp',emailotp);
              
        //       var newID = userOtp._id;

        ///////////////

        //       // Session.set('newID',newID);

        //       Meteor.call('addOTP', newID , emailotp, function(error,result){
        //         if(error){
        //           Bert.alert(error);
        //         }else{

        //         }
        //       });
            
        //       // //Send OTP    
        //       // Meteor.call('sendOtp',mobile,mobileotp,
        //       // function(error,result){
        //       //   if(error){
        //       //     console.log(error.reason);
        //       //   }else{
        //       //     swal('Successfully sent the OTP to your mobile number');
        //       //   }
        //       // });
                                   
              // // SEND EMAIL VERIFICATION LINK
              // Meteor.call('sendVerificationLinkToUser', email, function(error,result){
              //   if(error){
              //     Bert.alert(error);
              //   }else{ 
              //     swal({text:'Successfully sent the OTP to your Email Address.', showConfirmButton: true,type     : 'success'});                  
              //   } //end else
              // }); // send verification mail ends
              //    FlowRouter.go('/forgotOTPVarification/'+newID);
              // // $('.confirnModalWrap').addClass('newPassword');
              // // $('.NewForgotPasswordWrap').css('display','none');

        
      }
    }

    inputEffect(event){
      event.preventDefault();
      if($(event.target).val() !== ""){
        $(event.target).addClass("has-content");
      }else{
        $(event.target).removeClass("has-content");
      }
    }

  render(){
    
    var y = 325;
    var h = y + 'px';

    var x = $(window).height();   
    var z = 0;
    var winHeight =(x-z) + 'px';
    var winHeight1 =(x-z) ;
    console.log('x',$(window).height());
    console.log('winHeight',winHeight1);

    var innerheight = winHeight1-130 + 'px';
    var innerheight1 = winHeight1-130 ;
   
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
                <div className="divForgotPasswordWrap">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  verifypd">
                    <h3 className="signInNameTitle"><span className="bordbt">VERIFY EMAIL</span> </h3>
                    <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 forPassWrap">
                      <form id="forgotPassword" onSubmit={this.forgotpassword.bind(this)}>
                        <div className="text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                          <span>Enter registerd Email Id<label className="sign asterix">*</label></span>
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr veribtm">
                          <div id="enterEmailErr" className="input-effect input-group col-lg-12">
                            <input type="email" className="effect-21  form-control loginInputs" ref="enterEmail" name="enterEmail" onBlur={this.inputEffect.bind(this)} aria-label="Email Id" aria-describedby="basic-addon1" required/>
                            <span className="input-group-addon glyphi-custommm"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>
                        {/*<div className="text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                          <span>Enter registerd Mobile Number </span>
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr veribtm">
                          <div className="input-effect input-group">
                            <InputMask mask="9999-999-999" maskChar=" " name="enterMobNo" ref="enterMobNo" onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"  pattern="^(0|[0-9-+]*)$" title="Enter Mobile Number!" autoComplete="off" required/>
                            <span className="input-group-addon glyphi-custommm"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>*/}
                        <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr">
                          {/*<Link to='/confirm-otp'>*/}
                            <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn UMloginbutton" disabled={this.state.buttonValue==='Please Wait...'?true:false}>{this.state.buttonValue}</button>
                          {/*</Link>*/}
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls pull-right">
                          <Link to='/' className="UMGreyy "><u>Sign In</u></Link>  
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
export default ForgotPassword;