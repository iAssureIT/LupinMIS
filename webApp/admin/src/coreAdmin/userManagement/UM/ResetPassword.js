import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import swal from 'sweetalert';
import $ from "jquery";
import 'font-awesome/css/font-awesome.min.css';
// // import 'bootstrap/dist/css/bootstrap.min.css';
import "./userManagement.css";

import axios from 'axios';

class ResetPassword extends Component {

constructor(){
	super();
	this.state = {
		'newpassword' : "",
		'oldpassword' : "",
		'confirmPassword' : "",
	}
	this.changepassword = this.changepassword.bind(this);
}
handleChange=(event)=>{
	event.preventDefault();
	var name = event.target.name;
	this.setState({
		[name] : event.target.value
	})
}

componentDidMount() {
    const Token     = localStorage.getItem("token");
    const emailId   = localStorage.getItem("emailId");
    const center_ID = localStorage.getItem("center_ID");
	this.setState({
		emailId:emailId
	})
	// $.validator.addMethod("regxold", function(value, element, regexpr) {         
	 //      return regexpr.test(value);
	 //    }, "Password should be at least 6 characters long!");
    $("#resetPassword").validate({
      rules: {
        oldpassword: {
          required: true,
        },
        newpassword: {
          required: true,
        },
        confirmPassword: {
          required: true,
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "newpassword"){
          error.insertAfter("#newpasswordErr");
        }
        if (element.attr("name") == "oldpassword"){
          error.insertAfter("#oldpasswordErr");
        }
        if (element.attr("name") == "confirmPassword"){
          error.insertAfter("#confirmPasswordErr");
        }
      }
    });
}

oldpasswordChange = (oldpassword,emailId,newpassword,confirmPassword,user_id,value,key)=>{
	var loginValues = { email: emailId, password: oldpassword }
	axios.post('/api/users/post', loginValues)
	.then(response => {
		if(response.data.status === "verified"){
			this.setState({btnLoading: false})
			if (this.validInput()) {
				if(newpassword == confirmPassword){
					var body = {
					pwd : newpassword,
					userID : user_id,
					emailId : emailId,
					}
					if(body && user_id){
						axios.patch('/api/users/patch/one/resetpwd/'+user_id,body)
						.then((response)=>{
						})
						.catch((error)=>{
						console.log('error',error)
						if(error.message === "Request failed with status code 401")
						{
						}
						})
					}
				}else{
					this.setState({invalid:true})
				}
			}
		}
	})
	.catch(error => {
		if (error.response.status == 401) {
			console.log("ERROR in Responce");
			this.setState({invalidpassword:true})
		}
	})
}



changepassword(event) {
	event.preventDefault();
	if($('#resetPassword').valid()){
		var user_id = this.state.user_ID;
		var auth= {
			email : this.state.emailId,
			password : this.state.oldpassword,
	        roles       : ['admin','viewer']
	    }	
	      axios
	      .post('/api/users/login',auth)
			.then(response => {
				console.log('response',response);
				console.log('response',response.data.emailId);
				if(response){
					console.log('response.data.email === this.state.emailId',response.data.email, this.state.emailId);
					if(response.data.emailId === this.state.emailId){
						if(this.state.newpassword === this.state.confirmPassword){
							var body = {
								pwd : this.state.newpassword,
								user_id : user_id,
								emailId : this.state.emailId,
							}


							axios.patch('/api/users/patch/one/resetpwd/'+user_id,body)
							.then((response)=>{
								console.log("In response==>>>",response);
								swal(" ", "Your Password has been changed");
								this.setState({
									oldpassword:"",
									newpassword:"",
									confirmPassword:"",
								})

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
									console.log("token",token);
									// browserHistory.push("/login"); 
							        this.props.history.push("/login");
  					                window.location.reload();
							    }
							})
							.catch((error)=>{
							console.log('error',error)
							})
						}else{
							swal("Invalid Password","Please Enter valid New password and confirm password");
						}
					}else{
						swal("Invalid Password","Please Enter valid Old password");
					}
				}
			})
			.catch(error => {
				if (error.response.status == 401) {
					console.log("ERROR in Responce");
					swal("Invalid Password","Please Enter correct password");
					this.setState({invalidpassword:true})
				}
		})
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

render(){
		return(
		    <div className="container-fluid">
		        <div className="row">
		          	<div className="formWrapper">
		            	<section className="content">
		              		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
		                		<div className="row">
					                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
					                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
					                      Reset Password   
					                    </div>
					                    <hr className="hr-head container-fluid row"/>
					                </div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signupPadding resetForm " >
											<div className="divLoginInWrap">
												<form id="resetPassword" >
													<div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="input-group" id="oldpasswordErr">
															<input type="password" className="form-control loginInputs inputTextPass" ref="oldpassword" name="oldpassword" value={this.state.oldpassword} onChange={this.handleChange} placeholder="Old Password" aria-label="oldpassword" aria-describedby="basic-addon1" />
															{/*title="Password should be at least 6 characters long!" pattern=".{6,}" required*/}
															<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
																<i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																<i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
															</span>
														</div>
													</div>
													<div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="input-group" id="newpasswordErr">
															<input type="password" className="form-control loginInputs inputTextPass" ref="newpassword" name="newpassword" value={this.state.newpassword} onChange={this.handleChange} placeholder="New Password" aria-label="Password" aria-describedby="basic-addon1" />
															<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
																<i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																<i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
															</span>
														</div>
													</div>
													<div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="input-group" id="confirmPasswordErr">
															<input type="password" className="form-control loginInputs inputTextPass" ref="confirmPassword" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm Password" aria-label="confirmPassword" aria-describedby="basic-addon1" />
															<span className="input-group-addon addons glyphi-custommm padBoth" id="basic-addon1">
																<i className="fa fa-eye Pass showPwd" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																<i className="fa fa-eye-slash Pass hidePwd" aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
															</span>
														</div>
													</div>
													<div className="submitButtonWrapper pdleftclr col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<button type="submit" onClick={this.changepassword.bind(this)} className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submit">Reset Password</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>            
		                	</div>
		            	</section>
		          	</div>
		        </div>
      		</div>
		);
	}
}
export default ResetPassword;