import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {browserHistory} from 'react-router';
import swal from 'sweetalert';
import $ from "jquery";
import validate               from 'jquery-validation';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

import axios from 'axios';

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
}
const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const mobileRegex  = RegExp(/^[0-9][0-9]{9}$|^$/);
const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);

class SignUp extends Component {

 	constructor(){
      super();
        this.state = {           
            loggedIn : false,
            fields	 : {},
     	    errors	 : {},
     	    buttonValue : 'Sign Up',
            auth:{
                fullName        : '',
                lastname        : '',
                mobileNumber    : '',
                email           : '',
                pwd       		: '',
                signupPassword  : '',
                role 			: '',
                status 			: '',
                centerName		: 'Center Name',
                center_ID		: '',               
            },
             formerrors :{
				        	firstNameV 		: "",
				        	lastNameV		: "",
				        	mobileV 		: "",
				        	emailIDV		: "",
					     },
        }
        // console.log("In constructor");
         this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {

    }
 	usersignup(event){
 		event.preventDefault();
 		if($("#signUpUser").valid()){
 			if($('#idacceptcondition').is(":checked")){
		 		this.setState({
		     	    buttonValue : 'Please Wait...'
		 		})	
				console.log("-------this.state.auth------>>",this.state.auth);
				var auth={
		            firstName       : this.refs.firstname.value,
		            lastName        : this.refs.lastname.value,
		            mobileNumber    : this.refs.mobileNumber.value,
		            emailId         : this.refs.signupEmail.value,
		            pwd        		: this.refs.signupPassword.value,
		            signupPassword  : this.refs.signupConfirmPassword.value,
		            roles 			: 'MIS Coordinator',
		            status			: "Blocked",
		            centerName		: this.refs.centerName.value.split('|')[0],
		            center_ID		: this.refs.centerName.value.split('|')[1],
		        }
				// console.log("-------auth------>>",auth);

		        document.getElementById("signUpBtn").value = 'We are processing. Please Wait...';            
		            
		        var firstname                = this.refs.firstname.value;
		        var lastname                 = this.refs.lastname.value;
		        var mobile                   = this.refs.mobileNumber.value;
		        var email                    = this.refs.signupEmail.value;
		        var passwordVar              = this.refs.signupPassword.value;
		        var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;
		        var centerName				 = this.refs.centerName.value;
		 		
		        if (passwordVar === signupConfirmPasswordVar) {
		            return (passwordVar.length >= 6) ? 
		            	(true, 
		            	 // console.log("formValues= ",auth),
			             document.getElementById("signUpBtn").value = 'Sign Up',
		  				// browserHistory.push("/"),
		            	axios
		            	 	.post('/api/users',auth)
				            .then((response)=> {
					            console.log("-------userData------>>",response);
				            	if(response.data.user_id){
					            	var msgvariable = {
			                            '[User]'    : firstname+' '+lastname,
			                        }
		                            // console.log("msgvariable :"+JSON.stringify(msgvariable));
		                            var inputObj = {  
		                                to           : email,
		                                templateName : 'User - Signup Notification',
		                                variables    : msgvariable,
		                            }
		                            axios
			                	 	.post('/api/masternotification/send-mail',inputObj)
						            .then((response)=> {
						            	// console.log("-------mail------>>",response);
					            		this.setState({
		     	    						buttonValue : 'Sign Up'
					            		},()=>{
						            		swal("success","Information submitted successfully ");
							                this.props.history.push("/login");
					            		})
						            })
						            .catch(function (error) {
						                console.log(error);
						            })
				            	}else{
				            		this.setState({
		 	    						buttonValue : 'Sign Up'
				            		},()=>{
		    							swal(response.data.message);
				            		})
				            	}
				             //    // this.props.history.push("/confirm-otp");
				            })
				            .catch(function (error) {
				                console.log(error);
		    					swal("Unable to submit data ",error);
				            })
		            	)
		            :
		                (
			                document.getElementById("signUpBtn").value = 'Sign Up',
			                swal("Password should be at least 6 Characters Long","Please try again or create an Account")       
		                )
		            
		        } else {
		            // document.getElementById("signUpBtn").value = 'Sign Up';
		            this.setState({
		            	buttonValue : 'Sign Up' 
		            },()=>{
			        	swal("Please Try Again","Passwords does not match")
		            })
		        }
		  //       if(formValid(this.state.formerrors)){
				// 	console.log('companyName===',this.state.formerrors);
		  //       }else{
		  //           document.getElementById("signUpBtn").value = 'Sign Up';
				// 	swal("Please enter mandatory fields", "");
				// 	console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
				// }
	 		}else{
	 			swal("Accept Terms and Conditions", "Please accept Terms and Conditions");
	 		}        
 		}
 	}
 	handleChange(event){
	    // const target = event.target;
	    // const {name , value}   = event.target;
	    const datatype = event.target.getAttribute('data-text');
	    const {name,value} = event.target;
	    let formerrors = this.state.formerrors;
	    
	    console.log("datatype",datatype);
	    switch (datatype){
	     
	       case 'firstNameV' : 
	       formerrors.firstNameV = firstnameRegex.test(value) ? '' : "Please Enter Valid Name";
	       break;
	       
	       case 'lastNameV' : 
	       formerrors.lastNameV = lastnameRegex.test(value) ? '' : "Please Enter Valid Name";
	       break;

	       case 'mobileV' : 
	       formerrors.mobileV = mobileRegex.test(value) ? '' : "Please enter valid mobile number";
	       break;

	       case 'emailIDV' : 
	       formerrors.emailIDV = emailRegex.test(value) ? '' : "Invalid EmailID";
	       break;
	       
	       default :
	       break;

	      //  case 'companyName' : 
	      //  formerrors.companyName = value.length < 1 && value.lenght > 0 ? 'Minimum 1 Character ' : "";
	      //  break;

	    }
	    // this.setState({formerrors,})
	    // this.setState({ formerrors,
	    //   [name]:value
	    // } );
	}
 	acceptcondition(event){
	    var conditionaccept = event.target.value;
	    // console.log("condition",conditionaccept);
	    if(conditionaccept==="acceptedconditions"){
	        // $(".acceptinput").removeAttr('disabled');
	        // if(this.state.roletype==="Student"){
	        //     document.getElementById("lastname").removeAttribute("");
	        // }else{
	        //     null;
	        // }
	    } else{
	        // $(".acceptinput").addAttr('disabled');
	    }
    }

    showModal(){
        // if(this.state.roletype){
        //     $(".modalbg").css("display","block");
        // }else{
        //      swal("Please select student or franchise","","warning");
        // }
        $(".modalbg").css("display","block");
    }
    hideModal(){
        $(".modalbg").css("display","none");
    }
    componentDidMount(){
    	$.validator.addMethod("regxCenter", function(value, element, regexpr) { 
	      return value!==regexpr;
	    }, "This field is required.");
	    $.validator.addMethod("regxEmail", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "Please enter a valid email address.");
	    $.validator.addMethod("regxMobile", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "Please enter a valid mobile number.");
	    $.validator.addMethod("regxName", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain alphabets.");
    	$("#signUpUser").validate({
	      rules: {
	        firstname: {
	          required: true,
	          regxName:firstnameRegex
	        },
	        lastname: {
	          required: true,
	          regxName: lastnameRegex
	        },
	        mobileNumber: {
	          required: true,
	          regxMobile:mobileRegex 
	        },
	        centerName: {
	          required: true,
	          regxCenter: this.refs.centerName.value
	        },
	        signupEmail: {
	          required: true,
	          regxEmail: emailRegex
	        },
	        signupPassword: {
	          required: true,
	        },
	        signupConfirmPassword: {
	          required: true,
	        },
	      },
	      errorPlacement: function(error, element) {
	        if (element.attr("name") === "firstname"){
	          error.insertAfter("#firstnameErr");
	        }
	        if (element.attr("name") === "lastname"){
	          error.insertAfter("#lastnameErr");
	        }
	        if (element.attr("name") === "mobileNumber"){
	          error.insertAfter("#mobileNumberErr");
	        }
	        if (element.attr("name") === "centerName"){
	          error.insertAfter("#centerNameErr");
	        }
	        if (element.attr("name") === "signupEmail"){
	          error.insertAfter("#signupEmailErr");
	        }
	        if (element.attr("name") === "signupPassword"){
	          error.insertAfter("#signupPasswordErr");
	        }
	        if (element.attr("name") === "signupConfirmPassword"){
	          error.insertAfter("#signupConfirmPasswordErr");
	        }
	      }
	    });
    	axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    	this.getCenters();
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
    showSignPass1(){
        $('.showPwdConf').toggleClass('showPwd1');
        $('.hidePwdConf').toggleClass('hidePwd1');
        return $('.inputTextPassConf').attr('type', 'text');
    }
    hideSignPass1(){
        $('.showPwdConf').toggleClass('showPwd1');
        $('.hidePwdConf').toggleClass('hidePwd1');
        return $('.inputTextPassConf').attr('type', 'password');
    }

	getCenters(){
	    axios({
	      method: 'get',
	      url: '/api/centers/list',
	    }).then((response)=> {
	        // console.log('response ============', response.data);
	        this.setState({
	          listofCenters : response.data
	        },()=>{
	        // console.log('listofCenters', this.state.listofCenters);
	        })
	    }).catch(function (error) {
	      console.log('error', error);
	    });
	}
	render(){
		var y = 480;
	    var h = y + 'px';

	    var x = $(window).height();   
	    var z = 0;
	    var winHeight =(x-z) + 'px';
	    var winHeight1 =(x-z) ;
	    // console.log('x',$(window).height());
	    // console.log('winHeight',winHeight1);

	    var innerheight = winHeight1-20 + 'px';
	    var innerheight1 = winHeight1-110 ;
	   
	    var margin = parseInt( innerheight1-y );
	    var margint = (margin/2);
	    // console.log('margint',margint);
	    // console.log('margin',margin);
    	var windowWidth = $(window).width();
      // console.log('ww',windowWidth);
		if(windowWidth>=320&&windowWidth<=992){
		var backImage = "visible-xs col-xs-12 visible-sm col-sm-12 noBackImage"
		}else{
		var backImage = "signUpBackground hidden-xs hidden-sm"
		}


		const {formerrors} = this.state;
		// console.log("formerrors=====?>>>",formerrors);
      /*console.log("-------------------------------",this.state.loggedIn)*/    
		return(
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 middlepo middlebord pull-right" id="contentsroll" style={{"height": innerheight}}>
         		<div className="row">
            		<div id="scrollcont" className={backImage} style={{"height": winHeight}}>
            			<div className="col-lg-12 systemHeader   ">
		                  	<div className="col-lg-6 col-md-6 col-sm-6 ">
		                    	<img className="lupinImage" src="images/lupin.png" height="70px"/>
		                  	</div>
		                  	<div className="col-lg-6 col-md-6 col-sm-6 text-center logoName">
		                    	Management Information System
		                  	</div>
		                </div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
                    	<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signupPadding signUpFormWrap loginOesWrap loginforms1 middleblock hght" style={{"marginTop": margint , "height": h}}>
						<div className="divLoginInWrap">
						<form id="signUpUser" onSubmit={this.usersignup.bind(this)}>
						<h4 className="signInNameTitle "><span className="bordbt">SIGN UP</span></h4>
							<div className="col-lg-12 col-md-12 signUpInnerWrapperOES signupfrm">
								<div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd boxMarg">
							   		<span id="firstnameErr" className="blocking-span noIb">
									   <input type="text" className="form-control abacusTextbox oesSignUpForm formLable" id="firstname" ref="firstname" name="firstname"  onChange={this.handleChange} data-text="firstNameV" required/>
									   {this.state.formerrors.firstNameV  && (
				                        <span className="text-danger">{this.state.formerrors.firstNameV}</span> 
				                      )}
							    		<span className="floating-label">
								    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
								    		First Name<label className="sign asterix">*</label>
							    		</span>					   			
									</span>
								</div>
							    <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd1 boxMarg">
									<span id="lastnameErr" className="blocking-span noIb">   
										<input type="text" className="form-control abacusTextbox oesSignUpForm formLable" id="lastname" ref="lastname" name="lastname"  onChange={this.handleChange} data-text="lastNameV" required/>
										{this.state.formerrors.lastNameV  && (
				                        <span className="text-danger">{this.state.formerrors.lastNameV}</span> 
				                      )}
								    	<span className="floating-label1 lbfloatpass">
								    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
								    		Last Name<label className="sign asterix">*</label>
								    	</span>					   			
									</span>
							    </div>
							</div>
							<div className="col-lg-12 col-md-12 signUpInnerWrapperOES">
							    <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd boxMarg">
							   		<span id="mobileNumberErr" className="blocking-span noIb">   
									   <input className="form-control  abacusTextbox oesSignUpForm formLable" ref="mobileNumber" name="mobileNumber" id="mobileNumber" onChange={this.handleChange} data-text="mobileV" required/>
									   {this.state.formerrors.mobileV  && (
				                        <span className="text-danger">{this.state.formerrors.mobileV}</span> 
				                      )}
									   <span className="floating-label">
									   <i className="fa fa-mobile signupIconFont" aria-hidden="true"></i>Mobile Number<label className="sign asterix">*</label></span>					   			
								    </span>
								</div>
							    <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd1 boxMarg">
									<span id="centerNameErr" className="blocking-span noIb">   
									<select className="form-control abacusTextbox oesSignUpForm formLable" value={this.state.centerName} ref ="centerName" id="centerName" name="centerName" data-text="centerName">
		                               	<option hidden> Center Name</option>
		                                  {
		                                    this.state.listofCenters && this.state.listofCenters.length > 0 ? 
		                                    this.state.listofCenters.map((data, index)=>{
		                                      // console.log(data);
		                                      return(
		                                        <option className="formLable" key={index} value={data.centerName+'|'+data._id}>{data.centerName}</option>
		                                      );
		                                    })
		                                    :
		                                    null
		                                  }  
		                              </select>
										{/*<input type="text" className="form-control abacusTextbox oesSignUpForm" id="lastname" ref="lastname" name="lastname"  onChange={this.handleChange} data-text="lastNameV" required/>
										{this.state.formerrors.la
										stNameV  && (
				                        <span className="text-danger">{this.state.formerrors.lastNameV}</span> 
				                      )}*/}
								    	{/*<span className="floating-label1 lbfloatpass">
								    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
								    		Center Name
								    	</span>		*/}			   			
									</span>
{/*									<div className="formLable mrgtop6">Center Name<span className="requiredsign"></span></div>
*/}		                           
		                              
		                            
							    </div>	
							</div>
						    <div className="form-group form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent boxMarg">
								<span className="blocking-span noIb">   
								  <input id="signupEmailErr" type="email" className="form-control signupsetting formLable abacusTextbox oesSignUpForm" ref="signupEmail" name="signupEmail" onChange={this.handleChange} data-text="emailIDV" required/>
								  {this.state.formerrors.emailIDV  && (
			                        <span className="text-danger">{this.state.formerrors.emailIDV}</span> 
			                      )}
						    		<span className="floating-label"><i className="fa fa-envelope-o signupIconFont" aria-hidden="true"></i>Email ID<label className="sign asterix">*</label></span>					   			
								</span>
						    </div>				   		
					   		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
							    <div className="form-group form-group1 fltlft input-group col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
						   			{/*<span className="blocking-span noIb">
										<input type="password" className="form-control pass oesSignUpForm confirmbtm inputTextPass" ref="signupPassword" name="signupPassword" required/>
										<span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Password</span>					   			
									</span>
									<span className="input-group-addon eyeicon  glyphi-custommm">
										<i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
										<i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
									</span>
				                    <span className="focus-border">
				                    	<i></i>
				                    </span>*/}

				                    <span className="blocking-span noIb" id="signupPasswordErr">
					                    <input type="password" className="form-control pass border3 oesSignUpForm formLable confirmbtm inputTextPass tmsLoginTextBox" ref="signupPassword" name="signupPassword" required/>
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
						   		<div className="input-group textpdEye fltlft col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
						   			
				                     <span className="blocking-span noIb" id="signupConfirmPasswordErr">
					                    <input type="password" className="form-control pass border3 oesSignUpForm formLable confirmbtm inputTextPassConf tmsLoginTextBox" ref="signupConfirmPassword" name="signupConfirmPassword" required/>
					                    <span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Confirm Password<label className="sign asterix">*</label></span>                 
					                  </span>
					                <div className="showHideSignDiv">
					                  <i className="fa fa-eye showPwdConf showEyeupSign" aria-hidden="true" onClick={this.showSignPass1.bind(this)}></i>
					                  <i className="fa fa-eye-slash hidePwdConf hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass1.bind(this)}></i>
					                </div> 
					                  <span className="focus-border">
					                    <i></i>
					                  </span>
								</div>
							</div>
						    <div className="form-group form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent signUpContainer termspad">
				                <input  id="idacceptcondition" type="checkbox"  value="acceptedconditions" onClick={this.acceptcondition.bind(this)}/>
				                <Link data-toggle="modal" data-target="#myModal" className="form-checkbox UMGrey1 modalbutton fontbold terms1 pull-left" onClick={this.showModal.bind(this)}>&nbsp;I agree to the <span className="under"> terms & conditions</span><label className="sign asterix">*</label></Link>
				                <span className="signUpCheck"></span>
				            </div>
						    <div class="modal fade" id="myModal" role="dialog">
						      <div class="modal-dialog">
						        <div class="modal-content">

						          <div class="modal-header">
						            <button type="button" class="close" data-dismiss="modal">&times;</button>
						            <h2 className="modaltext">Terms & Conditions</h2>
						          </div>
						          <div class="modal-body">
						            <p className="modaltext modalpara modalparascroll">{this.state.termsCondition?this.state.termsCondition.instruction:null}</p>
						          </div>
						          <div class="modal-footer">
						            <button type="button" class="btn btn-default" data-dismiss="modal">Proceed</button>
						          </div>
						        </div>
						      </div>
						    </div>

							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 form-group1 rrnRegisterBtn">
						    	<input id="signUpBtn" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 acceptinput UMloginbutton UMloginbutton1 hvr-sweep-to-right" type="submit" value={this.state.buttonValue} disabled={this.state.buttonValue==='Please Wait...'?true:false}/>
						    </div>		   

					    	<div className="col-lg-12 col-md-4 col-sm-4 col-xs-4 ">
						    	<Link to='/' className="UMGreyy  signInbtn1"><u>Sign In</u></Link> 	
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
export default SignUp;