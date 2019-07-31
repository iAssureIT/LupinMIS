import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import axios 	 from 'axios';
import swal      from 'sweetalert';
import "./userManagement.css";
class EditUserProfile extends Component{
	constructor(props) {
	  super(props);
	 		    var UserId = this.props.match.params.id;
    		 	console.log("UserId ----------------------",UserId);
	  this.state = {
	  		UserId    : UserId,
	  		fullname  : "",
	  		username  : "",
	  		mobNumber : "",
	  		userProfile : "",
	  		firstName : "",
	  		lastName  : "",
			}	  	
			 this.handleChange = this.handleChange.bind(this);
	  }
	    
	handleSubmit(event) {
		var userid = this.state.UserId;
		console.log("userid-----------------------------------------",userid);
		var formvalues = {
			// "fullName" 		: this.refs.firstName.value +" "+ this.refs.lastName.value,
			"firstName"		: this.refs.firstName.value,
			"lastName" 		: this.refs.lastName.value,
			"emailId"  		: this.refs.username.value,
			"mobileNumber"  : this.state.mobNumber,
		}
		console.log("formvalues",formvalues);
				axios.patch('/api/users/'+userid, formvalues)
				.then((response)=> {		
					swal("User updated successfully","", "success");		
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
								}
							})
							this.setState({
					          completeDataCount : res.data.length,
					          tableData 		: tableData,          
					        },()=>{
					        	console.log('tableData', this.state.tableData);
					        })
						})
						.catch((error)=>{
							console.log("error = ",error);
							// alert("Something went wrong! Please check Get URL.");
						});

				})
				.catch(function (error) {
					console.log('error============',error);
				});
	}

	
	handleChange(event){
        const target = event.target.value;
        const name   = event.target.name;
        console.log('target',name, target);
          this.setState({ 
	      [name]:target
	    },()=>{
	    	// console.log('this state', this.state);
	    })
	}
	
	componentDidMount(){
		console.log("here edit view");
		var userid = this.state.UserId;
		console.log("userid-----------------------------------------",userid);
		 axios.get('/api/users/'+ userid)
	      .then( (res)=>{
	        console.log("here data_______________",res.data);
	        var FName = res.data.profile.fullName.split(' ');
	        var FirstName = FName[0];
	        var LastName = FName[1];
	        var Email = res.data.profile.emailId ? res.data.profile.emailId : null;
	        var Mnob  = res.data.profile.mobileNumber ? res.data.profile.mobileNumber : null;

	        console.log("Mnob", Mnob);
	        // console.log("L name", LastName);

	      this.refs.firstName.value = FirstName;
	      this.refs.lastName.value = LastName;
	     /* this.refs.fullname.value = FName */
		  this.refs.username.value = Email;
		  this.setState({
		  	mobNumber : Mnob,
		  });
		  

		 
	      })
	      .catch((error)=>{
	        console.log("error = ",error);
	        alert("Something went wrong! Please check Get URL.");
	      });
	}
  	
	render(){      
		return (
				<div>
					<div>					        
					    <div className="">					        
					         <section className="content-header">
					          {/*  <h3 className="contentTitle">Edit User</h3>*/}
					         </section>					         
					          <section className="content viewContent">
					            <div className="row">
					              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					                <div className="box">					                 
					                  <div className="box-header with-border boxMinHeight">
								            <div className="box-header with-border">
								            <h4 className="reportTitle">Edit User Data</h4>
								            </div>										
											<div className="box-body">												
												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12  EditUserProfileWrap">
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
														   <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                                          <label className="formLable">First Name <label className="requiredsign">*</label></label>
                                                          <span className="blocking-span">
                                                           <div className="input-group inputBox-main  new_inputbx " >
                                                             <div className="input-group-addon remove_brdr inputIcon">
                                                             <i className="fa fa-user-circle fa "></i>
                                                            </div>  
                                                              <input type="text" style={{textTransform:'capitalize'}}
                                                               className="form-control UMname inputText form-control  has-content"
                                                                id="firstName" ref="firstName" name="firstName" onChange={this.handleChange}  placeholder="First Name"/>
                                                           </div>   
                                                          </span>
                                                      </div>
                                                      <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                                          <label className="formLable">Last Name <label className="requiredsign">*</label></label>
                                                          <span className="blocking-span row">
                                                          <div className="input-group inputBox-main  new_inputbx " >
                                                             <div className="input-group-addon remove_brdr inputIcon">
                                                              <i className="fa fa-user-circle fa "></i>
                                                            </div>  
                                                             <input type="text"className="form-control UMname inputText form-control  has-content indexcls" 
                                                             id="lastName" ref="lastName" name="lastName" onChange={this.handleChange}  placeholder="Last Name" />
                                                          </div>   
                                                          </span>
                                                      </div>


														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group btmmargin inputContent">
															<label className="formLable">Username/Email <label className="requiredsign">*</label></label>
                                                          	<input type="text" disabled  onChange={this.handleChange} className="disableInput inputMaterial form-control inputText" ref="username" name="username" required/>
														</div>
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group btmmargin inputContent">
															<label className="formLable">Mobile Number <label className="requiredsign">*</label></label>
	                                                          <span className="blocking-span">
	                                                           <div className="input-group inputBox-main  new_inputbx " >
	                                                             <div className="input-group-addon remove_brdr inputIcon">
	                                                            <i className="fa fa-mobile"></i>
	                                                            </div>  
	                                                              <InputMask  mask="9999999999"  type="text" style={{textTransform:'capitalize'}}
	                                                               className="form-control UMname inputText form-control  has-content"
	                                                                id="mobNumber" ref="mobNumber" name="mobNumber" value={this.state.mobNumber} onChange={this.handleChange} placeholder="mobile number"/>
	                                                           </div>   
	                                                          </span>
														</div>	
													</div>
													<br/>
														<div className="col-lg-6 col-sm-12 col-xs-12 col-md-12 pull-right btmmargin userProfileEditBtn">
																<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">&nbsp; &nbsp;Update Profile&nbsp; &nbsp;</button>
														</div>
													</div>
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

export default EditUserProfile;


