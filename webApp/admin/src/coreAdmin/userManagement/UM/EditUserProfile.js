import React, { Component } from 'react';
// import {withTracker} from 'meteor/react-meteor-data';
 // import { render } from 'react-dom';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import InputMask from 'react-input-mask';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


class EditUserProfile extends Component{

	constructor(props) {
	  super(props);
	  this.state = {

			}	  	
	  }
	    
	

    componentWillReceiveProps(nextProps) {}


	handleSubmit(event) {}

	handleChange(event){}

	addNew(){}

	
		
	componentDidMount(){}
  	componentWillUnmount(){}

    addMore(event){}

    vehiclesList(){}

    delAddrOfUser(event){}

    addressList(){}

    onInput(event){}

	uploadProfileImg(e){}

	uploadProfileClick(event){}



	render(){      
					   	return (
							<div>
					        {/* Content Wrapper. Contains page content */}
					        <div className="content-wrapper">
					          {/* Content Header (Page header) */}
					          <section className="content-header">
					            <h3 className="contentTitle">Edit User</h3>
					          </section>
					          {/* Main content */}
					          <section className="content viewContent">
					            <div className="row">
					              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					                <div className="box">
					                 
					                  <div className="box-header with-border boxMinHeight">
								            <div className="box-header with-border">
								            <h4 className="reportTitle">Edit User Data</h4>
								            </div>
										
											<div className="box-body">
												
												<div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 EditUserProfileWrap">
													<div className="col-lg-10 col-sm-10 col-xs-10 col-md-10">
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															<span className="blocking-span">	
																<input type="text" value={this.state.firstname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editFirstName" name="firstname" required/>
																<span className="floating-label">First Name</span>
															</span>
															
														</div>
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															<span className="blocking-span">
																<input type="text" value={this.state.lastname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editLastName" name="lastname" required/>
																<span className="floating-label">Last Name</span>
															</span>
																						
														</div>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">	
															<div className="disableLabel">Username/Email</div>
															{/*<span className="blocking-span">	*/}									
																<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="disableInput inputMaterial form-control inputText" ref="editUsername" name="username" required/>
																{/*<span className="floating-label">Username/Email</span>*/}
															{/*</span>*/}
															
														</div>
														
														<div className="col-lg-6 col-sm-6 col-xs-12 col-md-6 group inputContent">
															<span className="blocking-span">
																<span className="defaultLabelOes">Mobile Number</span>
																<InputMask disabled mask="9999-999-999" maskChar=" " pattern="([0-9]|[0-9]|[0-9])" value={this.state.mobNumber} onChange={this.handleChange} className="inputMaterial disableInput form-control inputText" ref="editContactNum" name="mobNumber" required/>
																
															</span>
																							
														</div>

														{/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 examTypeBtn examTypeBtn1">

		                                                  <label className="examTypecontainer rdbtnlf">
		                                                  <input type="radio" checked="checked" name="roleName" ref="roleName" value="Admin" checked={this.state.role==='Admin'} onChange={this.handleChange} checked/>
		                                                    <span className="checkmark"></span>
		                                                    <span>Admin</span>
		                                                  </label>

		                                                  <label className="examTypecontainer rdbtnlf">
		                                                    <input type="radio" name="roleName" ref="roleName" value="Franchise" checked={this.state.role==='Franchise'} onChange={this.handleChange} />
		                                                    <span className="checkmark"></span>
		                                                    <span>Franchise</span>
		                                                  </label>
                                                  
                                                		</div>*/}
														<div className="col-lg-4 col-sm-12 col-xs-12 col-md-12 pull-right userProfileEditBtn">
															<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">Update Profile</button>
														</div>
													</div>

													<div className="col-lg-2 col-sm-2 col-xs-2 col-md-2 userEsitimg">
														<img src={this.state.userProfile} className="img-responsive"/>
														<input name="userPic" ref="userPic" onChange={this.uploadProfileImg.bind(this)} className="useruploadImg" type="file" />
														<button onClick={this.uploadProfileClick.bind(this)} className="uploaduserPic col-lg-12 col-md-12 btn btn-default">Update Photo</button>
													</div>
													<br/>
													</div>
												</div>	
										</div>
									  </div>
									</div>
								  </div>
							    </section>
							  </div>
							</div>
					    );
					
				

	} 

}

export default EditUserProfile;


