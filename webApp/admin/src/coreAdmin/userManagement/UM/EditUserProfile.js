import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import axios 	 from 'axios';
import swal      from 'sweetalert';
import $ from "jquery";
import validate               from 'jquery-validation';
import "./userManagement.css";
class EditUserProfile extends Component{
	constructor(props) {
	  super(props);
 		var UserId = this.props.match.params.id;
	  	this.state = {
	  		UserId    : UserId,
	  		fullname  : "",
	  		username  : "",
	  		mobNumber : "",
	  		userProfile : "",
	  		firstName : "",
	  		lastName  : "",
	  		centerName  : "",
		}	  	
		this.handleChange = this.handleChange.bind(this);
	}
	handleSubmit(event) {
		if($('#editUser').valid()){
			var userid = this.state.UserId;
			var formvalues = {
				"firstName"		: this.refs.firstName.value,
				"lastName" 		: this.refs.lastName.value,
				"emailId"  		: this.refs.username.value,
				"mobileNumber"  : this.state.mobNumber,
				"centerName" 	: this.state.centerName.split("|")[0],
				"center_ID" 	: this.state.centerName.split("|")[1]
			}
			axios.patch('/api/users/'+userid, formvalues)
			.then((response)=> {		
				
				swal({
						title: "User updated successfully",
						text: "User updated successfully",
					});
				 this.props.history.push('/umlistofusers');	
				console.log('response --====================',response);


					var data = {
						"startRange"        : this.state.startRange,
			            "limitRange"        : this.state.limitRange, 
					}
					axios.post('/api/users/userslist', data)
					.then( (res)=>{      
						console.log("here  list response==============",res);
						var tableData = res.data.map((a, i)=>{
							return {
								_id 			: a._id,
								fullName        : a.fullName,
				                emailId    		: a.emailId,
				                mobNumber       : a.mobNumber, 
				                status        	: a.status,	
				                roles 			: a.roles,
				                centerName 		: a.centerName,
				                center_ID 		: a.center_ID,
							}
						})
						this.setState({
				          completeDataCount : res.data.length,
				          tableData 		: tableData,          
				        },()=>{
				        })
					})
					.catch((error)=>{
						console.log("error = ",error);
						// alert("Something went wrong! Please check Get URL.");
					});

			})
			.catch(function (error) {
				if(error.response.status===401){
				 window.location = '/umlistofusers';		
				}
			});
		}
	}

	
	handleChange(event){
        const target = event.target.value;
        const name   = event.target.name;
          this.setState({ 
	      [name]:target,
	    },()=>{
	    })
	}
	
	componentDidMount(){
		const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
		const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
		const mobileRegex  = RegExp(/^[0-9][0-9]{9}$|^$/);
		const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
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
    	$("#editUser").validate({
	      rules: {
	        firstName: {
	          required: true,
	          regxName:firstnameRegex
	        },
	        lastName: {
	          required: true,
	          regxName: lastnameRegex
	        },
	        mobNumber: {
	          required: true,
	          regxMobile:mobileRegex 
	        },
	        centerName: {
	          required: true,
	          regxCenter: this.refs.centerName.value
	        },
	        username: {
	          required: true,
	          regxEmail: emailRegex
	        }
	      },
	      errorPlacement: function(error, element) {
	        if (element.attr("name") == "firstName"){
	          error.insertAfter("#firstNameErr");
	        }
	        if (element.attr("name") == "lastName"){
	          error.insertAfter("#lastNameErr");
	        }
	        if (element.attr("name") == "mobNumber"){
	          error.insertAfter("#mobNumberErr");
	        }
	        if (element.attr("name") == "centerName"){
	          error.insertAfter("#centerNameErr");
	        }
	        if (element.attr("name") == "username"){
	          error.insertAfter("#usernameErr");
	        }
	      }
	    });
 		this.getCenters();
		var userid = this.state.UserId;
		 axios.get('/api/users/'+ userid)
	      .then( (res)=>{
	        console.log("here data_______________",res.data);
	       
	        var FName = res.data.profile.fullName.split(' ');
	        var FirstName = FName[0];
	        var LastName = FName[1];
	        var Email = res.data.profile.emailId ? res.data.profile.emailId : null;
	        var Mnob  = res.data.profile.mobileNumber ? res.data.profile.mobileNumber : null;
	        var centerName  = res.data.profile.centerName ? res.data.profile.centerName : null;
	        var center_ID   = res.data.profile.center_ID ? res.data.profile.center_ID : null;
			this.refs.firstName.value = FirstName;
			this.refs.lastName.value = LastName;
			this.refs.username.value = Email;
			this.refs.mobNumber.value = Mnob;
			this.refs.centerName.value = centerName;
			this.setState({
			  	mobNumber : Mnob,
			  	centerName : centerName+"|"+center_ID,
			});
	      })
	      .catch((error)=>{
	        console.log("error = ",error);
	        alert("Something went wrong! Please check Get URL.");
	      });
	}
	handleChangeCenter(event){
		event.preventDefault();
		this.setState({
			centerName : event.target.value,
		})
	}
  	getCenters(){
	    axios({
	      method: 'get',
	      url: '/api/centers/list',
	    }).then((response)=> {
	        this.setState({
	          listofCenters : response.data
	        })
	    }).catch(function (error) {
	      console.log('error', error);
	    });
	 }
  	
	render(){      
		return (
     	<div className="container-fluid">
	        <div className="row">
		        <div className="formWrapper">
		            <section className="content">
		                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
			                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
			            		Edit User Data
			                </div>
			                <hr className="hr-head container-fluid row"/>
							<div className="box-body">												
								<div className="row">												
									<form id="editUser">
										<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
											<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 btmmargin inputContent">
	                                          <label className="formLable">First Name <label className="requiredsign">*</label></label>
	                                          <span className="blocking-span">
	                                           <div className="input-group inputBox-main  new_inputbx " id="firstNameErr">
	                                             <div className="input-group-addon remove_brdr inputIcon">
	                                             <i className="fa fa-user-circle fa "></i>
	                                            </div>  
	                                              <input type="text" style={{textTransform:'capitalize'}}
	                                               className="form-control UMname inputBox  has-content"
	                                                id="firstName" ref="firstName" name="firstName" onChange={this.handleChange}  placeholder="First Name"/>
	                                           </div>   
	                                          </span>
	                                      	</div>
											<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 btmmargin inputContent">
												<label className="formLable">Last Name <label className="requiredsign">*</label></label>
												<span className="blocking-span ">
													<div className="input-group inputBox-main  new_inputbx " id="lastNameErr">
														<div className="input-group-addon remove_brdr inputIcon">
														  <i className="fa fa-user-circle fa "></i>
														</div>  
														<input type="text"className="form-control UMname inputBox  has-content indexcls" 
														 id="lastName" ref="lastName" name="lastName" onChange={this.handleChange}  placeholder="Last Name" />
													</div>   
												</span>
											</div>
											<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6 group btmmargin inputContent">
												<label className="formLable">Username/Email <label className="requiredsign">*</label></label>
	                                          	<span className="blocking-span ">
													<div className="input-group inputBox-main  new_inputbx " id="usernameErr">
														<div className="input-group-addon remove_brdr inputIcon">
														  <i className="fa fa-user-circle fa "></i>
														</div>  
	                                          			<input type="text" disabled  onChange={this.handleChange} className="disableInput inputMaterial form-control inputBox" ref="username" name="username" required/>
													</div>   
												</span>
											</div>
											<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group btmmargin inputContent">
												<label className="formLable">Mobile Number <label className="requiredsign">*</label></label>
	                                              <span className="blocking-span">
	                                               <div className="input-group inputBox-main  new_inputbx " id="mobNumberErr">
	                                                 <div className="input-group-addon remove_brdr inputIcon">
	                                                <i className="fa fa-mobile"></i>
	                                                </div>  
	                                                  <InputMask  mask="9999999999"  type="text" style={{textTransform:'capitalize'}}
	                                                   className="form-control UMname inputBox  has-content"
	                                                    id="mobNumber" ref="mobNumber" name="mobNumber" value={this.state.mobNumber} onChange={this.handleChange} placeholder="mobile number"/>
	                                               </div>   
	                                              </span>
											</div>
											<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 group btmmargin inputContent">
					                            <div className="formLable ">Center Name<span className="requiredsign">*</span></div>
												<span className="blocking-span">
													<div className="input-group inputBox-main  new_inputbx " id="centerNameErr">
														<div className="input-group-addon remove_brdr inputIcon">
														  <i className="fa fa-crosshairs fa "></i>
														</div>  
														<select className="form-control inputBox UMname" value={this.state.centerName} ref ="centerName" id="centerName" name="centerName" data-text="centerName" onChange={this.handleChangeCenter.bind(this)} >
					                                <option hidden> --Select-- </option>

					                                  {
					                                    this.state.listofCenters && this.state.listofCenters.length > 0 ? 
					                                    this.state.listofCenters.map((data, index)=>{
					                                      return(
					                                        <option key={index} value={data.centerName+'|'+data._id}>{data.centerName}</option>
					                                      );
					                                    })
					                                    :
					                                    null
					                                  }  
					                              </select>
													</div>   
												</span>
											</div>	
										</div>
									</form>
									<br/>
								</div>	
									<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right btmmargin userProfileEditBtn">
											<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn submit pull-right">Update Profile</button>
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

export default EditUserProfile;


