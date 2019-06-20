import React, { Component } 		from 'react';
// import { render } 					from 'react-dom';
// import TrackerReact 				from 'meteor/ultimatejs:tracker-react';
  import UMaddRoles 					from './UMaddRoles.jsx';
  import UMadd_role 					from './UMadd_role.jsx';
// import { UserManagementMaster }  	from '/imports/admin/userManagement/UM/UserManagementMaster.js';
/*import './userManagement.css';
*/
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';


export default class UMRolesList extends Component {
	constructor(){
		super();
		this.state = {
				allPosts : [],

		}
	}

	componentDidMount(){

		axios
			.get('/roles/list')
			.then(
				(res)=>{
					console.log('res', res);
					const postsdata = res.data;
					console.log('postsdata',postsdata);
					this.setState({
						allPosts : postsdata,
					});
				}
			)
			.catch((error)=>{

				console.log("error = ",error);
				// alert("Something went wrong! Please check Get URL.");
				 });				

	}
  		getdata(data){
  			console.log("getdata",data);
  			var allPosts = this.state.allPosts;
  			allPosts.push(data);
  			this.setState({
  				allPosts:allPosts
  			})

  		}

	render(){

       return(
			<div className="">
				<div className=""></div>
				<section className="">
			        <div className="">
			          	<div className="">
	                        <div className="">
	                            <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                            	<div className=" col-lg-1 col-md-1 col-xs-1 col-sm-1 box-header with-border text-center">
                                         <h4 className="weighttitle"><a href="/UMListOfUsers"><i className="cursorpointer fa fa-chevron-circle-left"></i></a></h4>
                                    </div>
                                    <div className=" col-lg-11 col-md-11 col-xs-11 col-sm-11 box-header with-border">
                                         <h4 className="weighttitle">List of Roles</h4>
                                    </div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addRolesInWrap">
											<UMaddRoles getdata={this.getdata.bind(this)} />
										<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<table className="table iAssureITtable-bordered table-striped table-hover">
												<thead className="tempTableHeader">
													<tr className="">
														<th className="umDynamicHeader srpadd textAlignCenter"> Role </th>
														<th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
													</tr>
												</thead>
												<tbody>
												{this.state.allPosts.map( (roleData, index)=>{
												   return( 
													<tr>
														<td className="textAlignLeft">{roleData.role}</td>		
														<td className="roleTextCenter"> 						
															<i className="fa fa-pencil editTcon editIcon" data-toggle="modal" data-target="#edit" title="Edit Department Name" ></i>
															&nbsp;&nbsp;
															<i className="deleteIcon roleDelete  redFont fa fa-trash delIcon detailsCenter"  id="" title="Edit Department Name" ></i>
														</td>		
														<div id="edit" className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" role="dialog">
														  <div className="modal-dialog adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12" role="document">
														    <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
														      <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
														        <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel1">Edit Role</h4>
														        <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
									                              	<button type="button" className="adminCloseButton" data-dismiss="modal" data-target="edit">&times;</button>
									                            </div>
														      </div>
														      <div className="modal-body addressModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<form className="editroles">
																		<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12 col-sm-12 paddingLeftz addRoleMarginBtm">
																			<label className="textAlignLeft">Role Name</label>
																			<input type="text" ref="roleName" className="form-control rolesField" required/>
																		</div>
																		<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="form-group col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-xs-12 col-sm-12">
																				<label>&nbsp;</label>
																			    <button type="button" id="" className="btn adminFinish-btn" data-dismiss="modal">Edit Role</button>
																			</div>
																		</div>
																	</form>
														      </div>
														    </div>

														  </div>
														</div>

													</tr>
													)
													
													})
												}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
	

       		
	    );

	} 

}