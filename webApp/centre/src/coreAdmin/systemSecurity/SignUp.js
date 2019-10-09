import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {browserHistory} from 'react-router';
import swal from 'sweetalert';
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://qalmisapi.iassureit.com/';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

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
            auth:{
                fullName        : '',
                lastname        : '',
                mobileNumber    : '',
                email           : '',
                pwd       		: '',
                signupPassword  : '',
                role 			: '',
                status 			: '',
                centerName		: '',
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
	            
 			console.log("-------auth------>>",auth);

        document.getElementById("signUpBtn").value = 'We are processing. Please Wait...';            
            
        var firstname                = this.refs.firstname.value;
        var mobile                   = this.refs.mobileNumber.value;
        var email                    = this.refs.signupEmail.value;
        var passwordVar              = this.refs.signupPassword.value;
        var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;
        var centerName				 = this.refs.centerName.value;
 		
            if(formValid(this.state.formerrors)){
    			console.log('companyName==',this.state.formerrors);
            if (passwordVar === signupConfirmPasswordVar) {
                return (passwordVar.length >= 6) ? 
                	(true, 
                	 console.log("formValues= ",auth),
		             document.getElementById("signUpBtn").value = 'Sign Up',
      				// browserHistory.push("/"),
                	axios
                	 	.post('/api/users',auth)
			            .then((response)=> {
			                console.log("-------userData------>>",response);
		            		swal("success","Information submitted successfully ");
			                // this.props.history.push("/confirm-otp");
		            		
			                this.props.history.push("/login");
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
                document.getElementById("signUpBtn").value = 'Sign Up';
		        return swal("Passwords does not match","Please Try Again")
            }
            }else{
                document.getElementById("signUpBtn").value = 'Sign Up';
				swal("Please enter mandatory fields", "");
				console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
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
	       formerrors.mobileV = mobileRegex.test(value) ? '' : "Please Enter Numbers only";
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
	    this.setState({ formerrors,
	      [name]:value
	    } );
	}
 	acceptcondition(event){
	    var conditionaccept = event.target.value;
	    console.log("condition",conditionaccept);
	    if(conditionaccept=="acceptedconditions"){
	        $(".acceptinput").removeAttr('disabled');
	        // if(this.state.roletype=="Student"){
	        //     document.getElementById("lastname").removeAttribute("");
	        // }else{
	        //     null;
	        // }
	    } else{
	        $(".acceptinput").addAttr('disabled');
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

	getCenters(){
	    axios({
	      method: 'get',
	      url: '/api/centers/list',
	    }).then((response)=> {
	        // console.log('response ==========', response.data);
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
		var y = 530;
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
		// console.log("formerrors====?>>>",formerrors);
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
                    	<div className="col-lg-4 col-lg-offset-7 col-md-6 col-md-offset-3 col-sm-12 signupPadding signUpFormWrap loginOesWrap loginforms1 middleblock hght" style={{"marginTop": margint , "height": h}}>
						<div className="divLoginInWrap">
						<form id="signUpUser" onSubmit={this.usersignup.bind(this)}>
						<h4 className="signInNameTitle "><span className="bordbt">SIGN UP</span></h4>
							<div className="col-lg-12 col-md-12 signUpInnerWrapperOES signupfrm">
								<div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd boxMarg">
							   		<span className="blocking-span noIb">
									   <input type="text" className="form-control abacusTextbox oesSignUpForm formLable" id="firstname" ref="firstname" name="firstname"  onChange={this.handleChange} data-text="firstNameV" required/>
									   {this.state.formerrors.firstNameV  && (
				                        <span className="text-danger">{this.state.formerrors.firstNameV}</span> 
				                      )}
							    		<span className="floating-label">
								    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
								    		First Name
							    		</span>					   			
									</span>
								</div>
							    <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd1 boxMarg">
									<span className="blocking-span noIb">   
										<input type="text" className="form-control abacusTextbox oesSignUpForm formLable" id="lastname" ref="lastname" name="lastname"  onChange={this.handleChange} data-text="lastNameV" required/>
										{this.state.formerrors.lastNameV  && (
				                        <span className="text-danger">{this.state.formerrors.lastNameV}</span> 
				                      )}
								    	<span className="floating-label1 lbfloatpass">
								    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
								    		Last Name
								    	</span>					   			
									</span>
							    </div>
							    <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd boxMarg">
							   		<span className="blocking-span noIb">   
									   <input className="form-control  abacusTextbox oesSignUpForm formLable" ref="mobileNumber" name="mobileNumber" id="mobileNumber" onChange={this.handleChange} data-text="mobileV" required/>
									   {this.state.formerrors.mobileV  && (
				                        <span className="text-danger">{this.state.formerrors.mobileV}</span> 
				                      )}
									   <span className="floating-label">
									   <i className="fa fa-mobile signupIconFont" aria-hidden="true"></i>Mobile Number</span>					   			
								    </span>
								</div>
							    <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd1 boxMarg">
									<span className="blocking-span noIb">   
									<select className="form-control inputBox abacusTextbox oesSignUpForm formLable" value={this.state.centerName} ref ="centerName" id="centerName" name="centerName" data-text="centerName">
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
							    <div className="form-group form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent boxMarg">
									<span className="blocking-span noIb">   
									  <input type="email" className="form-control signupsetting formLable abacusTextbox oesSignUpForm" ref="signupEmail" name="signupEmail" onChange={this.handleChange} data-text="emailIDV" required/>
									  {this.state.formerrors.emailIDV  && (
				                        <span className="text-danger">{this.state.formerrors.emailIDV}</span> 
				                      )}
							    		<span className="floating-label"><i className="fa fa-envelope-o signupIconFont" aria-hidden="true"></i>Email ID</span>					   			
									</span>
							    </div>				   		
						   		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent marBtm">
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

					                    <span className="blocking-span noIb">
						                    <input type="password" className="form-control pass border3 oesSignUpForm formLable confirmbtm inputTextPass tmsLoginTextBox" ref="signupPassword" name="signupPassword" required/>
						                    <span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Password</span>                 
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
							   			
					                     <span className="blocking-span noIb">
						                    <input type="password" className="form-control pass border3 oesSignUpForm formLable confirmbtm inputTextPass tmsLoginTextBox" ref="signupConfirmPassword" name="signupConfirmPassword" required/>
						                    <span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Confirm Password</span>                 
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
							    	<input id="signUpBtn" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 acceptinput UMloginbutton UMloginbutton1 hvr-sweep-to-right" type="submit" value="Sign Up" disabled/>
							    </div>		   

						    	<div className="col-lg-12 col-md-4 col-sm-4 col-xs-4 ">
							    	<Link to='/' className="UMGreyy  signInbtn1"><u>Sign In</u></Link> 	
						    	</div>
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