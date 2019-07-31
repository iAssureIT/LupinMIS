// import React, { Component } 		from 'react';
// import CompanyLocation 					from './CompanyLocation.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/js/modal.js';
// import swal from 'sweetalert';


// export default class CompanyLocationList extends Component {
// 	constructor(){
// 		super();
// 		this.state = {
// 				// allPosts : [],
// 				allPosts : null,
// 				allLoc 	 : null,
// 				editlocId : null,
// 		}
// 	}

// 	componentDidMount(){

// 		axios
// 			.get('/api/tgkSpecificcompanysettings/list')
// 			.then(
// 				(res)=>{
// 					console.log('res', res);
// 					const postsdata = res.data;
// 					console.log('postsdata',postsdata);
// 					this.setState({
// 						allPosts : postsdata,
// 					});


// 		let locationArray =[];
// 		if(this.state.allPosts!=null){

		
// 		 locationArray = this.state.allPosts.map(function(item) { return item.companyLocationsInfo });
// 		}else{
// 	     locationArray = "no data";
// 		}
    
//     	this.setState({
//     		allLoc : locationArray,
//     	});
//     	console.log("locationArray", locationArray);
// 		console.log("this.state.allLoc+++++++++++++++++",this.state.allLoc);


// 				}
// 			)
// 			.catch((error)=>{

// 				console.log("error = ",error);
// 				// alert("Something went wrong! Please check Get URL.");
// 				 });				

// 	}
//   		getdata(data){
//   			console.log("getdata",data);
//   			var allPosts = this.state.allPosts;
//   			allPosts.push(data);
//   			this.setState({
//   				allPosts:allPosts
//   			})

//   		}

//   		deleteLoc(event){
//   			event.preventDefault();
// 			var id = event.target.id;
// 			console.log("id of deleteLoc",id);
// 			var formValues={
// 				companyId  : 1,
// 				locationID : id,
// 			}
// 			const token = '';

// 			axios.patch('/api/tgkSpecificcompanysettings/location/remove',formValues)
// 		    .then( (response)=> {
// 		      // handle success
// 		      console.log("this is response===>>>",response);
// 		      swal("Location deleted successfully","", "success");
		      
// 		    }).catch(function (error) {
// 		      // handle error
// 		      console.log(error);
		     
// 		    })
// 		    .finally(function () {
// 		      // always executed
// 		    });

			

//   		}

//   		editLoc(event){

//   			event.preventDefault();
// 			var id = event.target.id;
// 			console.log("id of edit location",id);
			
// 			this.setState({
// 				editlocId:id,
// 			});		

// 			// this.props.selectedUser(this.state.editlocId);
// 			// here i got id

// 			 swal("No functionality","", "error");
//   		}
// 	render(){

	
//        return(
// 			<div >
// 				<section > 
// 	                            <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12 zeropadd">
	                            	
// 									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addRolesInWrap zeropadd">
// 											<CompanyLocation locId={this.state.editlocId}/>

// 											<div className="tablebox">	
// 										<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 zeropadd">
// 											<table className="table iAssureITtable-bordered table-striped table-hover">
// 												<thead className="tempTableHeader">
// 													<tr className="">
// 														<th className="umDynamicHeader srpadd textAlignCenter"> Location </th>
// 														<th className="umDynamicHeader srpadd textAlignCenter"> ContactNumber </th>
// 														<th className="umDynamicHeader srpadd textAlignCenter"> BlockName </th>
// 														<th className="umDynamicHeader srpadd textAlignCenter"> District </th>
// 														<th className="umDynamicHeader srpadd textAlignCenter"> City </th>
// 														<th className="umDynamicHeader srpadd textAlignCenter"> LocationCode </th>
// 														<th className="umDynamicHeader srpadd textAlignCenter"> Action </th>

// 													</tr>
// 												</thead>
// 												<tbody>
// 												{ this.state.allLoc != null ?
// 													this.state.allLoc[0].map( (locData, index)=>{
// 													/*console.log('locData of 0 here',locData);*/
// 												   return( 
// 														<tr>
														
// 																<td className="textAlignLeft">{locData.Location}</td>
// 																<td className="textAlignLeft">{locData.contactnumber}</td>
// 																<td className="textAlignLeft">{locData.blockname}</td>
// 																<td className="textAlignLeft">{locData.companyDistrict}</td>
// 																<td className="textAlignLeft">{locData.companyCity}</td>
// 																<td className="textAlignLeft">{locData.officeLocationid}</td>

// 																<td className="roleTextCenter"> 				
// 																{/*data-toggle="modal" title="Delete" data-target={`#${locData._id}-edit`}	*/}	
// 																	<i className="fa fa-pencil editTcon editIcon pointerCls"   title="Edit" id={locData._id} onClick={this.editLoc.bind(this)} ></i>
// 																	&nbsp;&nbsp;
// 																	<i className="deleteIcon roleDelete  redFont fa fa-trash delIcon detailsCenter"  id="" title="Edit Department Name" data-toggle="modal" title="Delete" data-target={`#${locData._id}-rm`} ></i>
// 																</td>

// 																<div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${locData._id}-rm`}  role="dialog">
// 												                    <div className=" modal-dialog adminModal adminModal-dialog">
// 												                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
// 												                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 																	        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
// 																	        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
// 																				        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
// 																				          <span aria-hidden="true">&times;</span>
// 																				        </button>
// 																			        </div>
// 																	      		</div>
// 												                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

// 												                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this location?</h4>
// 												                              </div>
												                              
// 												                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 												                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
// 												                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
// 												                                   </div>
// 												                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
// 												                                        <button id={locData._id} onClick={this.deleteLoc.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
// 												                                   </div>
// 												                              </div>
// 												                         </div>
// 												                    </div>
// 												               </div>


// 												               <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${locData._id}-edit`}  role="dialog">
// 												                    <div className=" modal-dialog adminModal adminModal-dialog">
// 												                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
// 												                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 																	        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
// 																	        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
// 																				        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
// 																				          <span aria-hidden="true">&times;</span>
// 																				        </button>
// 																			        </div>
// 																	      		</div>
// 												                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
												                              
// 												                              <label className="textAlignLeft">Location </label>
// 																					<input type="text" ref="roleName" className="form-control rolesField" required/>
																				
// 												                              </div>
												                              
// 												                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 												                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
// 												                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
// 												                                   </div>
// 												                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
// 												                                        <button id={locData._id} onClick={this.editLoc.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">SUBMIT</button>
// 												                                   </div>
// 												                              </div>
// 												                         </div>
// 												                    </div>
// 												               </div>


// 																<div id="edit" className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" role="dialog">
// 																  <div className="modal-dialog adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12" role="document">
// 																    <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
// 																      <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 																        <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel1">Edit Role</h4>
// 																        <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
// 											                              	<button type="button" className="adminCloseButton" data-dismiss="modal" data-target="edit">&times;</button>
// 											                            </div>
// 																      </div>
// 																      <div className="modal-body addressModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
// 																			<form className="editroles">
// 																				<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12 col-sm-12 paddingLeftz addRoleMarginBtm">
// 																					<label className="textAlignLeft">Location </label>
// 																					<input type="text" ref="roleName" className="form-control rolesField" required/>
// 																				</div>
// 																				<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 																					<div className="form-group col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-xs-12 col-sm-12">
// 																						<label>&nbsp;</label>
// 																					    <button type="button" id="" className="btn adminFinish-btn" data-dismiss="modal">Edit Role</button>
// 																					</div>
// 																				</div>
// 																			</form>
// 																      </div>
// 																    </div>

// 																  </div>
// 																</div>
// 														</tr>
													
// 													)
													
// 													})
												
// 												:
// 												null
// 											}
// 												</tbody>
// 											</table>
// 										</div>
// 										</div>
// 									</div>
// 								</div>
// 				</section>
// 			</div>
	

       		
// 	    );

// 	} 

// }