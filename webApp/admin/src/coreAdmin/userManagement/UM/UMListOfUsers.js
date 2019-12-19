import React, { Component } 		 	 from 'react';
import CreateUser 					     from './CreateUser.js';
import axios                       		 from 'axios';
import _                       			 from 'underscore';
import swal                     		 from 'sweetalert';
import $ 							from 'jquery';
import './userManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import IAssureTableUM 					from '../../IAssureTableUM/IAssureTable.jsx';

import  UMDelRolRow 					from './UMDelRolRow.jsx';
import  UMAddRolRow 					from './UMAddRolRow.jsx';
import  UMSelectRoleUsers 				from './UMSelectRoleUsers.jsx';

class UMListOfUsers extends Component {
	constructor(props){
		super(props);
		this.state = {
		 	allPosts : [],
		 	"twoLevelHeader"    : {
                apply           : false,
            },
             "tableHeading"     : {

                fullName        : 'User Name',
                emailId    		: 'Email',
                mobileNumber    : 'Mobile Number', 
                status        	: 'Status',
                roles        	: 'Role',
                centerName		: 'Center Name',
                actions        	: 'Action',
            },
            "startRange"        : 0,
            "limitRange"        : 100, 

            blockActive			: "all",
            "listofRoles"	    : "",

            adminRolesListData   : [],

            checkedUser  : [],
            activeswal : false,
            blockswal : false,
            confirmDel : false,
            unCheckedUser:false
		}
    	this.handleChange  = this.handleChange.bind(this);
			
	}
    
    

	handleChange(event){
	  	event.preventDefault();
        const target = event.target;
        const name   = target.name;  
    }

	componentDidMount(){
		this.getRole();
		var data = {
			"startRange"        : this.state.startRange,
            "limitRange"        : this.state.limitRange, 
		}
		axios.post('/api/users/userslist', data)
		.then( (res)=>{      
			// console.log("res =============",res.data);
			var tableData = res.data.map((a, i)=>{
				return {
					_id 			: a._id,
					firstName		:a.firstName,
					lastName		:a.lastName,
					fullName        : a.fullName,
	                emailId    		: a.emailId,
	                mobileNumber    : a.mobileNumber, 
	                status        	: a.status,	
	                roles 			: a.roles,
					centerName 	    : a.centerName,
				}
			})
			this.setState({
	          completeDataCount : res.data.length,
	          tableData 		: tableData,          
	        },()=>{
	        	// console.log('tableData', this.state.tableData);
	        })
		})
		.catch((error)=>{
			// console.log("error = ",error);
			// alert("Something went wrong! Please check Get URL.");
		});
		// this.getData(this.state.startRange, this.state.limitRange)
	}
	getData(startRange, limitRange){    
		var data = {
			"startRange"        : startRange,
            "limitRange"        : limitRange, 
		}    
       axios.post('/api/users/userslist', data)
        .then( (res)=>{  
        	var tableData = res.data.map((a, i)=>{
				return {
					_id 			: a._id,
					fullName        : a.fullName,
	                emailId    		: a.emailId,
	                mobileNumber    : a.mobileNumber, 
	                status        	: a.status,	
	                roles 			: a.roles,
					centerName 	    : a.centerName,
				}
			})
        	// console.log('res============', res.data);
          	this.setState({
              completeDataCount : res.data.length,
              tableData 		: tableData,          
            },()=>{
            })
        })
	    .catch((error)=>{
	      // console.log("error = ",error);
	      alert("Something went wrong! Please check Get URL.");
	    }); 
    }
    getSearchText(searchText, startRange, limitRange){
        // console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
    }

    adminRolesListData(){
		// return  Meteor.roles.find({"name":{ $nin: ["superAdmin"] }}).fetch();
	}

	activeSelected(checkedUsersList){
		function updateStatus(formValues){
		  return new Promise(function(resolve,reject){
		    axios
		    .post('/api/users/statusaction',formValues)
		    .then((response)=> {
            	console.log("-------action------>>",response);  
		        resolve(response);
		    })
		    .catch(function (error) {
		        console.log(error);
		    })
		  })
		}
		function getUserDetails(selectedId){
          return new Promise(function(resolve,reject){
            axios
    	 	.get('/api/users/'+selectedId)
            .then((response)=> {
            	console.log("-------user------>>",response);  
            	resolve(response);
        	})
            .catch(function (error) {
                console.log(error);
            })
          })
        }
        function sendMail(inputObj){
		  return new Promise(function(resolve,reject){
		    axios
		    .post('/api/masternotification/send-mail',inputObj)
		    .then((response)=> {
		        console.log("-------mail------>>",response);
		        resolve(response);
		    })
		    .catch(function (error) {
		        console.log(error);
		    })
		  })
		}
		mainActive().then(response => {
		    if(response){
		        this.setState({
		            activeswal : true,
		            checkedUser : [],
		            unCheckedUser : true
		        },()=>{
					$('#userListDropdownId').removeAttr('disabled')
		            this.refs.userListDropdown.value = '-'
		            this.getData(this.state.startRange,this.state.limitRange)
		            checkedUsersList = [];
		            if(this.state.activeswal == true)
		            {
		             swal("abc","Account activated successfully");
		            }
		        }); 
		    }
		});
		async function mainActive(){
		    var count = 0
		    for(var i=0;i<checkedUsersList.length;i++){
		        var selectedId = checkedUsersList[i];
		        var formValues ={
		            userID : selectedId,
		            status : 'Active',
		        }

		      var response = await updateStatus(formValues)
		      if(response){
		        var user = await getUserDetails(selectedId)
		        if(user){
		            var currentUrl = window.location.hostname
		            var url = currentUrl==='localhost'?'http://localhost:3001/':currentUrl==='qalmiscentre.iassureit.com'?'http://qalmiscentre.iassureit.com/':'http://uatlmiscenter.iassureit.com/'
		            var msgvariable = {
		                '[User]'    : user.data.profile.fullName,
		                '[user_email_id]' : user.data.profile.emailId,
		                '[center_application_URL]' : url
		            }
		            // console.log("msgvariable :"+JSON.stringify(msgvariable));
		            var inputObj = {  
		                to           : user.data.profile.emailId,
		                templateName : 'User - Login Account Activation',
		                variables    : msgvariable,
		            }
		            var mail = await sendMail(inputObj)
		            if(mail){
		                count++
		                if(count===checkedUsersList.length){
		                    return Promise.resolve(true);
		                }
		            }
		        }
		      }
		    }
		}
	}
	blockSelected(checkedUsersList){
		function updateStatus(formValues){
		  return new Promise(function(resolve,reject){
		    axios
		    .post('/api/users/statusaction',formValues)
		    .then((response)=> {
            	console.log("-------action------>>",response);  
		        resolve(response);
		    })
		    .catch(function (error) {
		        console.log(error);
		    })
		  })
		}
		function getUserDetails(selectedId){
          return new Promise(function(resolve,reject){
            axios
    	 	.get('/api/users/'+selectedId)
            .then((response)=> {
            	console.log("-------user------>>",response);  
            	resolve(response);
        	})
            .catch(function (error) {
                console.log(error);
            })
          })
        }
        function sendMail(inputObj){
		  return new Promise(function(resolve,reject){
		    axios
		    .post('/api/masternotification/send-mail',inputObj)
		    .then((response)=> {
		        console.log("-------mail------>>",response);
		        resolve(response);
		    })
		    .catch(function (error) {
		        console.log(error);
		    })
		  })
		}
		mainBlock().then(response => {
			if(response){
            	this.setState({
				  	blockswal : true,
				  	checkedUser : [],
				  	unCheckedUser : true
				},()=>{
					$('#userListDropdownId').removeAttr('disabled')
					this.refs.userListDropdown.value = '-'
					this.getData(this.state.startRange,this.state.limitRange)
					checkedUsersList = []	
					if(this.state.blockswal == true)
				   	{
				   		swal("abc","Account blocked successfully",);
				   	}	
				})
			}
          //here you can update your collection with axios call
        });
		async function mainBlock(){
		    var count = 0
		    for(var i=0;i<checkedUsersList.length;i++){
		        var selectedId = checkedUsersList[i];
		        var formValues ={
		            userID : selectedId,
		            status : 'Blocked',
		        }

		      var response = await updateStatus(formValues)
		      if(response){
		        var user = await getUserDetails(selectedId)
		        if(user){
		            var msgvariable = {
		                '[User]'    : user.data.profile.fullName,
		                '[user_email_id]' : user.data.profile.emailId
		            }
		            // console.log("msgvariable :"+JSON.stringify(msgvariable));
		            var inputObj = {  
		                to           : user.data.profile.emailId,
		                templateName : 'User - Login Account Blocked',
		                variables    : msgvariable,
		            }
		        	var mail = await sendMail(inputObj)
		        	if(mail){
		        		count++
		                if(count===checkedUsersList.length){
		                    return Promise.resolve(true);
		                }
		        	}
		        }
		      }
		    }
		}	
	}
	adminUserActions(event){
		event.preventDefault();
		$('#userListDropdownId').attr('disabled','true')
		var checkedUsersList = this.state.checkedUser;
		// console.log('id array here', checkedUsersList);
			
		if( checkedUsersList.length > 0 ){
			var selectedValue        = this.refs.userListDropdown.value;
			var keywordSelectedValue = selectedValue.split('$')[0];
			var role                 = selectedValue.split('$')[1];
			// console.log("selectedValue",selectedValue);
			// console.log("role",role);
			// console.log("keywordSelectedValue",keywordSelectedValue);

			switch(keywordSelectedValue){
				case '-':
				$('#userListDropdownId').removeAttr('disabled')
			    // console.log('selectedValue:' + selectedValue);
			    break;

				case 'block_selected':
				    this.blockSelected(checkedUsersList)
				break;

				case 'active_selected':
				    this.activeSelected(checkedUsersList)  
				break;

				case 'cancel_selected':
				    for(var i=0;i< checkedUsersList.length;i++){
					  	var selectedId = checkedUsersList[i];
					  	// console.log("selected i",selectedId);
					  	const token = '';
					  	const url = '/api/users/'+selectedId ;
						const headers = {
						    "Authorization" : token,
						    "Content-Type" 	: "application/json",
						};
						axios({
							method: "DELETE",
							url : url,
							headers: headers,
							timeout: 3000,
							data: null,
						})
						.then((response)=> {
					    	// window.location.reload(); 
					    	// console.log('delete response',response);
					    	this.setState({
							  	checkedUser : [],
							  	unCheckedUser : true
							},()=>{
								$('#userListDropdownId').removeAttr('disabled')
								this.refs.userListDropdown.value = '-'
								this.getData(this.state.startRange,this.state.limitRange)
								checkedUsersList = []	
					    		swal("abc","User deleted successfully",);
							})
						}).catch((error)=> {
						    // console.log(error);
						});
				    }  
				break;

				case 'add':
				    for(var i=0;i< checkedUsersList.length;i++){
					  	var selectedId = checkedUsersList[i];
					  	var formValues ={
					  	 	userID : selectedId,
					  	 	roles   : role,
					  	}
					  	// console.log("selected i",selectedId);

					  	axios
				       .post('/api/users/roleadd/',formValues)
				       .then(
				        (res)=>{
				            console.log('res', res);
					        this.setState({
							  	checkedUser : [],
							  	unCheckedUser : true
							},()=>{
								$('#userListDropdownId').removeAttr('disabled')
								this.refs.userListDropdown.value = '-'
								this.getData(this.state.startRange,this.state.limitRange)
								checkedUsersList = []	
				          		swal("abc","Assigned Role Added Successfully",);
							})
				        }).catch((error)=>{ 
				          // console.log("error = ",error);
				        });
				    }  
				break;

				case 'remove':
					for(var i=0;i< checkedUsersList.length;i++){
					  	var selectedId = checkedUsersList[i];
					  	var formValues ={
					  	 	userID : selectedId,
					  	 	roles   : role,
					  	}
			
				  	 	axios
				      	.post('/api/users/roledelete/',formValues)
				      	.then(
				        (res)=>{
				          	// console.log('res', res);
				          	this.setState({
							  	checkedUser : [],
							  	unCheckedUser : true
							},()=>{
								$('#userListDropdownId').removeAttr('disabled')
								this.refs.userListDropdown.value = '-'
								this.getData(this.state.startRange,this.state.limitRange)
								checkedUsersList = []	
				          		swal("abc","Assigned Role Removed Successfully",);
							})			
				        }).catch((error)=>{ 
				        // console.log("error = ",error);
				        });
				    }  
				break;
			}
		}else{
			this.refs.userListDropdown.value = '-'
			$('#userListDropdownId').removeAttr('disabled')
			swal({
    			title:'abc',
    			text:"Please select atleast one user."
    		});
		}
	}

	selectedRole(event){
				event.preventDefault();
				var selectedValue        = this.refs.roleListDropdown.value;
				var keywordSelectedValue = selectedValue.split('$')[0];
				// console.log("selectedValue",selectedValue);			
				// console.log("keywordSelectedValue ------------------",keywordSelectedValue);
					var formValues ={
						searchText : selectedValue,
					}

					if(selectedValue == "all"){

						var data = {
								"startRange"        : this.state.startRange,
					            "limitRange"        : this.state.limitRange, 
							}
							axios.post('/api/users/userslist', data)
							.then( (res)=>{      
								// console.log("herer",res);
								// swal("Success! Showing "+selectedValue,"","success");
								var tableData = res.data.map((a, i)=>{
									return {
										_id 			: a._id,
										fullName        : a.fullName,
						                emailId    		: a.emailId,
						                mobileNumber       : a.mobileNumber, 
						                status        	: a.status,	
						                roles 			: a.roles,
						                centerName 	    : a.centerName,
									}
								})
								this.setState({
						          completeDataCount : res.data.length,
						          tableData 		: tableData,          
						        },()=>{
						        	// console.log('tableData', this.state.tableData);
						        })
							})
							.catch((error)=>{
								// console.log("error = ",error);
								// alert("Something went wrong! Please check Get URL.");
							});

					}else{

						 axios
					      .post('/api/users/searchValue',formValues)
					      .then(
					        (res)=>{
					          // console.log('res', res);
					          // swal("Success! Showing only "+selectedValue,"","success");
					          var data = res.data.data;
					          var tableData = data.map((a, i)=>{
									return {
										_id 			: a._id,
										fullName        : a.profile.fullName,
						                emailId    		: a.emails[0].address,
						                mobileNumber    : a.profile.mobileNumber, 
						                status        	: a.profile.status,
						                roles 			: ((a.roles.map((b, i)=>{return '<p>'+b+'</p>'})).toString()).replace(/,/g, " "),
						                centerName 	    : a.profile.centerName,	
									}
								})
					          	this.setState({
					              tableData 		: tableData,          
					            },()=>{
					            }) 
					        }).catch((error)=>{ 
					            swal("abc", "Sorry there is no data of "+selectedValue,"");
					      });

					}

				    
	}

	selectedStatus(event){
			event.preventDefault();

			var selectedValue        = this.refs.blockActive.value;
				var keywordSelectedValue = selectedValue.split('$')[0];
				// console.log("selectedValue status",selectedValue);			
				// console.log("keywordSelectedValue status",keywordSelectedValue);
					var formValues ={
						searchText : selectedValue,
					}

					if(selectedValue == "all"){
						// console.log("here all data");

							var data = {
								"startRange"        : this.state.startRange,
					            "limitRange"        : this.state.limitRange, 
							}
							axios.post('/api/users/userslist', data)
							.then( (res)=>{      
								console.log("herer",res);
								// swal("Success! Showing "+selectedValue,"","success");
								var tableData = res.data.map((a, i)=>{
									return {
										_id 			: a._id,
										fullName        : a.fullName,
						                emailId    		: a.emailId,
						                mobileNumber    : a.mobileNumber, 
						                status        	: a.status,	
						                roles 			: a.roles,
						                centerName 	    : a.centerName,
									}
								})
								this.setState({
						          completeDataCount : res.data.length,
						          tableData 		: tableData,          
						        },()=>{
						        	// console.log('tableData', this.state.tableData);
						        })
							})
							.catch((error)=>{
								// console.log("error = ",error);
								// alert("Something went wrong! Please check Get URL.");
							});


					}else{

						 axios
				      .post('/api/users/searchValue',formValues)
				      .then(
				        (res)=>{
				          // console.log('res', res);
				          // swal("Success! only "+selectedValue+" users are shown in the list", "","success");
				          var data = res.data.data;
				          var tableData = data.map((a, i)=>{
								return {
									_id 			: a._id,
									fullName        : a.profile.fullName,
					                emailId    		: a.emails[0].address,
					                mobileNumber    : a.profile.mobileNumber, 
					                status        	: a.profile.status,	
						            centerName 	    : a.profile.centerName,	
					                roles 			: ((a.roles.map((b, i)=>{return '<p>'+b+'</p>'})).toString()).replace(/,/g, " "),
								}
							})
				          	this.setState({
				              tableData 		: tableData,          
				            },()=>{
				            })
				        }).catch((error)=>{ 
				        	swal("abc", "Sorry there is no data of "+selectedValue, );
				      });
					}

				    

	}

	confirmDel(event){
		this.setState({
			confirmDel : true,
		})
		window.location.reload(); 
	}
	setunCheckedUser(value){
		this.setState({
			unCheckedUser : value,
		})
	}
	selectedUser(checkedUsersList){
		// console.log('checkedUsersList', checkedUsersList);
		this.setState({
			checkedUser : checkedUsersList,
		})

		// console.log("this.state.checkedUser",this.state.checkedUser);
	}
	getRole(){
		axios({
		  method: 'get',
		  url: '/api/roles/list',
		}).then((response)=> {
		    // console.log('response ==========', response.data);
		    this.setState({
		      adminRolesListData : response.data
		    },()=>{
		    // console.log('adminRolesListData', this.state.adminRolesListData);
		    })
		}).catch(function (error) {
		  console.log('error', error);
		});
	}

	  camelCase(str){
	    return str
	    .toLowerCase()
	    .split(' ')
	    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
	    .join(' ');
	  }

render(){
	// console.log('this.state.completeDataCount', this.state.completeDataCount);
	var adminRolesListDataList = this.state.adminRolesListData;
	// console.log("adminRolesListDataList",adminRolesListDataList);
     return(
     	<div className="container-fluid">
	        <div className="row">
		        <div className="formWrapper">
		            <section className="content">
		                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
			                <div className="row">
					            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
					                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
					                  User Management
					                </div>
					                <hr className="hr-head container-fluid row"/>
					            </div>   	
								<div className="modal-bodyuser">
							        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 "  id="createmodalcl">
											<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow" data-toggle="modal" data-target="#CreateUserModal"><i className="fa fa-plus" aria-hidden="true"></i><b>&nbsp;&nbsp;&nbsp; Add User</b></button>
										    <CreateUser getData={this.getData.bind(this)}/>
										</div>
										{/*<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 "  id="createmodalcl">
											<a href="/umroleslist"><button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform clickforhideshow">Add Role</button></a>
										</div>*/}
								
					                   {/* <div className="col-lg-7 col-md-6 col-sm-12 col-xs-12 searchTableBoxAlignSETUM">
					                   		<span className="blocking-span">
						                   		<input type="text" name="search"  className="col-lg-8 col-md-8 col-sm-8 Searchusers Searchfind inputTextSearch outlinebox pull-right "  placeholder="&#128269; Search by Name "  />
						                   	</span>
					                    </div>*/}
									</div>
							        <form className="newTemplateForm">
										<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 usrmgnhead">
											<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12  NOpadding-left text-left formLable">Select Action</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding inputBox-main form-control" id="userListDropdownId" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
													<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption" disabled="disabled" selected="true">-- Select --</option>	
													<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>	
													<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
													<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Delete Selected Acccounts</option>	
													{ 	adminRolesListDataList.map( (rolesData,index)=>{
															return <UMAddRolRow key={index} roleDataVales={rolesData.role}/>
													  	})
													}
													{ adminRolesListDataList.map( (rolesData,index)=>{
														return <UMDelRolRow key={index} roleDataVales={rolesData.role}/>
														  })
													}
												</select>
											</div> 	
											<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left formLable">Select Role</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding inputBox-main  form-control" ref="roleListDropdown" name="roleListDropdown" onChange={this.selectedRole.bind(this)} >
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
													<option value="all" name="roleListDDOption">Show All</option>		
													
													{ adminRolesListDataList.map( (rolesData,index)=>{
														return <UMSelectRoleUsers  key={index} roleDataVales={rolesData.role}/>
													  }) 
													}
												</select>
											</div>
											<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left formLable">Select Status</label>
												<select className=" col-col-lg-12  col-md-12 col-sm-12 col-xs-12 noPadding inputBox-main  form-control " ref="blockActive"  name="blockActive" onChange={this.selectedStatus.bind(this)}>
													<option disabled="disabled" selected="true">-- Select --</option>	
													<option value="all"	>Show All</option>	
													<option value="Blocked">Blocked</option>	
													<option value="Active">Active </option>	
												</select>
											</div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<IAssureTableUM
	  										  completeDataCount={this.state.completeDataCount}
						                      twoLevelHeader={this.state.twoLevelHeader} 
						                      getData={this.getData.bind(this)} 
						                      tableHeading={this.state.tableHeading} 
						                      tableData={this.state.tableData} 
						                      getSearchText={this.getSearchText.bind(this)}
						                      selectedUser={this.selectedUser.bind(this)} 
						                      setunCheckedUser={this.setunCheckedUser.bind(this)} 
						                      unCheckedUser={this.state.unCheckedUser}
											/>			
										</div>
										<div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id="deleteModal"  role="dialog">
						                    <div className=" modal-dialog adminModal adminModal-dialog">
						                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
						                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
											        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
											        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
														        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
														          <span aria-hidden="true">&times;</span>
														        </button>
													        </div>
											      		</div>
						                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

						                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this User?</h4>
						                              </div>
						                              
						                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
						                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
						                                   </div>
						                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						                                        <button  onClick={this.confirmDel.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
						                                   </div>
						                              </div>
						                         </div>
						                    </div>
						               </div>
									</form>
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


export default UMListOfUsers;