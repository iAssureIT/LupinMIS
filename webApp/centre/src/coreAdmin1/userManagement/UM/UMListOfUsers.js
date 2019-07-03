import React, { Component } 		from 'react';
import CreateUser 					from './CreateUser.js';
import axios                        from 'axios';

import './userManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
axios.defaults.baseURL = 'http://localhost:3006';
axios.defaults.headers.post['Content-Type'] = 'application/json';





class UMListOfUsers extends Component {
	constructor(props){
		super(props);
		this.state = {
		 	allPosts : [],
		}

	}

	componentDidMount(){

		this.setState({
			allPosts : [
				{
					_id		  : '1',
					firstname : 'Amit',
					lastname  : 'Shinde',
					Email     : 'Amitrshinde156@gmail.com',
					mobNumber : '8888069628',
					Status 	  : 'Active',
					roles     : 'Admin'

				},
				{	
					_id		  : '2',
					firstname : 'Amit',
					lastname  : 'Shinde',
					Email     : 'Amitrshinde156@gmail.com',
					mobNumber : '8888069628',
					Status    : 'Blocked',
					roles     : 'user'
				}]
		});
		axios
			.get('/users/list')
			.then(
				(res)=>{
					console.log(res);
					const postsdata = res.data;
					this.setState({
						allPosts : postsdata,
					});
				}
			)
			.catch((error)=>{

				console.log("error = ",error);
				alert("Something went wrong! Please check Get URL.");
				 });				

	}

render(){
     return(
   		<div className=" ">
   		<div className="">
      	</div>
			<section className="">
		        <div className="">
		        <div className="">
		          	<div className="">
			            <div className="">
				            
							<div className="modal-bodyuser ">

						        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 box-header with-border nopaddingum2">

									<div className="col-lg-3 col-md-3 col-sm-6 col-xs-12  paddingright">

										<h4 className="usrmgnttitle weighttitle">User Management</h4>
									</div>
									<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 "  id="createmodalcl">
										<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform clickforhideshow" data-toggle="modal" data-target="#CreateUserModal">Add User</button>
											<CreateUser />
									</div>
									<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 "  id="createmodalcl">
										<a href="/umroleslist"><button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform clickforhideshow">Add Role</button></a>
									</div>
							
				                    <div className="col-lg-7 col-md-6 col-sm-12 col-xs-12 searchTableBoxAlignSETUM">
				                   		<span className="blocking-span">
					                   		<input type="text" name="search"  className="col-lg-8 col-md-8 col-sm-8 Searchusers Searchfind inputTextSearch outlinebox pull-right "  placeholder="&#128269; Search by Name "  />
					                   	</span>
				                    </div>
								</div>
						        <form className="newTemplateForm">
									
									<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 usrmgnhead">
										<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
											<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Select Action</label>
											<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" id="userListDropdownId" ref="userListDropdown" name="userListDropdown" >
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption">-- Select --</option>	
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>	
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Delete Selected Acccounts</option>	
												{/* 	this.adminRolesListData().map( (rolesData)=>{
														return <UMAddRolRow key={rolesData._id} roleDataVales={rolesData}/>
												  	})
												*/}
												{ /*this.adminRolesListData().map( (rolesData)=>{
													return <UMDelRolRow key={rolesData._id} roleDataVales={rolesData}/>
													  })
												*/}
											</select>

										</div> 
										

										<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
											
											<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Select Role</label>
											<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="roleListDropdown" name="roleListDropdown" >
												<option name="roleListDDOption">-- Select --</option>
												<option value="all" name="roleListDDOption">Show All</option>		
												{ /*this.rolesListData().map( (rolesData)=>{
													return <UMSelectRoleUsers key={rolesData._id} roleDataVales={rolesData}/>
												  }) 
												*/}	
												 
											</select>
										</div>

				
										<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
											<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Select Status</label>
											<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="blockActive" name="blockActive" >
												<option>-- Select --</option>	
												<option value="all"	>Show All</option>	
												<option value="Blocked">Blocked</option>	
												<option value="Active">Active </option>	
											</select>
										</div>

										<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
											<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Users/Page</label>
			                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			                                	<select  id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding  form-control">
			                                		<option value="Not Selected">Select Limit</option>
			                                		<option value={10}>10</option>
			                                		<option value={25}>25</option>
			                                		<option value={50}>50</option>
			                                		<option value={100}>100</option>
			                                		<option value={500}>500</option>
			                                	</select>
			                                </div>
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
										<div className="table-responsive">
											<table id="listOfUsersDwnld" className="table iAssureITtable-bordered table-striped table-hover" >
												<thead className="tempTableHeader">
													<tr className="">
														<th className="umDynamicHeader srpadd">
															<input type="checkbox" className="allSelector col-lg-1 col-md-1 col-sm-3 col-xs-1 umchksett" name="allSelector"/> 
								
														</th>
														
														<th className="umDynamicHeader srpadd ">
															<span className="" >User Name&nbsp;&nbsp;
																<span className="fa fa-caret-up custom  namesortup"  id="sortup" />
																<span className="fa fa-caret-down custom namesortdown" id="sortdown"/>   
															</span>
														</th>
														<th className="umDynamicHeader srpadd "> Email&nbsp;&nbsp;
															<span className="fa fa-caret-up custom  mailsortup " id="mailsortup"/>
															<span className="fa fa-caret-down custom mailsortdown" id="mailsortdown"/> 	
														</th>
				
														<th className="umDynamicHeader srpadd">Mobile Number

														</th>
														<th className="umDynamicHeader srpadd ">Roles </th>
														<th className="umDynamicHeader srpadd ">Status</th>
														
														<th className="umDynamicHeader srpadd ">  Action </th>				
													</tr>
												</thead>
											{ this.state.allPosts 
											?
												this.state.allPosts.length>0 
												? 												
												<tbody className="noLRPad ">
														{ this.state.allPosts.map( (usersData, index)=>{

																return(/*<tr className="" id={"bgclrum"+index} key={index} onMouseOver={this.hoveronbox.bind(this)} onMouseLeave={this.rmhover.bind(this)}>*/		
																<tr className="" key={index}>		
																	<td className="">
																		<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={usersData._id} /> 
																	
																	</td>
																	
																	<td className="">
																		<div className="um-username"> 
																			
																			<div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 userEmailIds noLRPad">
																				{usersData.firstname} {usersData.lastname}
																			
																			</div>	
																		</div>
																	</td>	
																	<td className=""> 
																		{usersData.username}
																	</td>	
																	
																	<td className="">{usersData.mobNumber}</td>	
																	<td className="">{usersData.roles}</td>
																	
															
																		
																	{/*<td className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> {this.lastLogin()} </td>	*/}
																	<td className=""> 
																		{/*<div className="activeStat">{this.onlineStatus()}</div>	*/}


																		{
																			usersData.Status == "Active" ?
																				<div className="activeStat" title="Active user"></div>

																			:
																				<div className="inactiveStat" title="Blocked user"></div>
																		}
																	</td>	
																	{/*<td className=""> */}
																	<td className="">
																		<i className="fa fa-key" aria-hidden="true" title="Change Password " data-toggle="modal" data-target={"#RestpwdModal-"+usersData._id}></i> &nbsp; &nbsp;
																		<i className="fa fa-pencil" aria-hidden="true" title="Edit Profile" id={usersData._id}></i> &nbsp; &nbsp;
																		<i className="fa fa-trash redFont" aria-hidden="true" title="Delete User " data-toggle="modal" data-target={"#showDeleteModal-"+usersData._id}></i>
																	</td>
																	{/*</td>	*/}
																	<div className="modal fade modalHide" id={"RestpwdModal-"+usersData._id}  role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
																		  <div className="modal-dialog" role="document">
																		    <div className="modal-content modalContent ummodallftmg">
																		      <div className="modal-header userHeader form-group">
																		        
																		        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
																		        
																		          &times;
																		        </button>
																		        <h4 className="modal-title" id="exampleModalLabel1">Reset Password</h4>
																		      </div>
																		     <div className="modal-body row">

																		             	{/*<ResetPassword id={usersData._id}/>*/}
																		             	 <div className="" id={usersData._id}>
																				                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">

																				                <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
																				                    <form id={usersData._id}>
																				                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 resetInptFld">
																				                            <span className="blocking-span" id="resetPwd">
																				                               <input type="password" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formFloatingLabels signUpTextBox inputTextPass outlinebox" value={this.state.resetPassword} ref="resetPassword" name="resetPassword" id="resetPassword"  autoComplete="off"/>
																				                               <span className="floating-label">
																				                                    <i className="fa fa-lock signupIconFont" aria-hidden="true"></i> 
																				                                    New Password 
																				                               </span>   
																				                               <label className="error"></label>                           
																				                            </span>
																				                            <div className="showHideResetDiv showiconUM">
																				                              <i className="fa fa-eye showPwdreset" aria-hidden="true" ></i>
																				                              <i className="fa fa-eye-slash hidePwdreset" aria-hidden="true" ></i>
																				                            </div> 
																				                        </div>
																				                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 form-group marginTop17">
																				                            <span className="blocking-span" id="resetConPwd">
																				                               <input type="password" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formFloatingLabels signUpTextBox inputTextPass outlinebox" value={this.state.resetPasswordConfirm}  ref="resetPasswordConfirm" name="resetPasswordConfirm" id="resetPasswordConfirm"  autoComplete="off"/>
																				                               <span className="floating-label">
																				                                    <i className="fa fa-lock signupIconFont" aria-hidden="true"></i> 
																				                                    Confirm Password 
																				                               </span>  
																				                               <label className="error"></label>                                
																				                            </span>
																				                            <div className="showHideResetDiv showiconUM">
																				                              <i className="fa fa-eye showPwdreset" aria-hidden="true"></i>
																				                              <i className="fa fa-eye-slash hidePwdreset" aria-hidden="true"></i>
																				                            </div>
																				                        </div>
																				                        <div className="submitButtonWrapper pull-right col-lg-4 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12">
																				                            <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 btnSubmit outlinebox" id={usersData._id} >Reset Password</button>
																				                        </div>																				                           
																				                    </form>
																				                </div>
																				              </div>
																				        </div>
																		      </div>
																	
																		   </div>
																		  </div>
																	</div>	
						
									                                <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={"showDeleteModal-"+usersData._id} role="dialog">
	                                                                <div className=" modal-dialog adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                                  <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
	                                                                    <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
	                                                                      <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"showDeleteModal-"+usersData._id}>&times;</button>
	                                                                    </div>
	                                                                   
	                                                                
	                                                                    </div>
	                                                                    <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                                      <h4 className="blackLightFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to delete this User?</h4>
	                                                                    </div>
	                                                                    
	                                                                    <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
	                                                                      </div>
	                                                                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                                                        <button id={usersData._id} type="button" className="btn adminFinish-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
	                                                                      </div>
	                                                                    </div>
	                                                                  </div>
	                                                                </div>
	                                                            </div>
													</tr>)


													
														}) 
													
													}
														
												</tbody>
												:
												<tbody>
							                      <tr className="trAdmin">
							                        <td colSpan="9" className="noTempData">No Record Found!</td>
							                      </tr>
							                    </tbody> 
													
											:
											<tbody>
												<td colSpan="9" >
													{/*<td colSpan="9" className="ntdiaplay">Nothing to display.</td>*/}
													<div className="loaderimgcent col-lg-12 col-md-12  "><img src="/images/loadersglms.gif" className="loaderimgcent" alt=""/></div>

												</td>
											</tbody>
											
											}
										</table>
										</div>
										{this.state.showMore == true ?
											<button onClick={this.showMore.bind(this)} className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-4 col-sm-offset-3 col-xs-4 col-xs-offset-3 btn showMore marginTop17">Show More</button>
											:
											null
					                    }
									</div>
								
					
								</form>
						    </div>

						</div>
					</div>
				</div></div>
			</section>
  		</div>
     );
    }

}


export default UMListOfUsers;