import React, { Component }       	from 'react';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import TemplateRow                	from './emails/TemplateRow.jsx';
import EmailTemplateRow           	from './emails/EmailTemplateRow.jsx';
import NotificationTemplateRow    	from './notifications/NotificationTemplateRow.jsx';
import AllNotificationTemplateRow 	from './notifications/AllNotificationTemplateRow.jsx';
import AllSMSTemplateRow          	from './sms/AllSMSTemplateRow.jsx';
import SMSTemplateRow             	from './sms/SMSTemplateRow.jsx';
import CKEditor 				  	from "react-ckeditor-component";
import validator 					from 'validator';
// import 'jquery-validation';
import './notification.css';

axios.defaults.baseURL = ' http://qatprmapi.iassureit.com/';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

class ViewTemplates extends Component{

   handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}


	componentDidMount() {	
	    /*$("html,body").scrollTop(0);	
	   
	    $.validator.addMethod("regxsubject", function(value, element, arg){          
	    	return arg !== value;        
	    }, "Please select one subject name");

	    $.validator.addMethod("regxtemplateType", function(value, element, arg){          
	    	return arg !== value;        
	    }, "Please select template type");

	    $.validator.addMethod("regxtemplateName", function(value, element, arg){          
	    	return arg !== value;        
	    }, "Please select template name");
   
	    $.validator.setDefaults({
	        debug: true,
	        success: "valid"
	    });
	    $("#newTemplateForm").validate({
	        rules: {
	          subject:{              
	          	required:true,              
	          	// regxsubject: "Not Selected"            
	          },
	          templateType:{              
	          	required:true,              
	          	regxtemplateType: "Not Selected"            
	          },
	          templateName:{              
	          	required:true,              
	          	regxtemplateName: "Not Selected"            
	          },	          
	        }, 
	        errorPlacement: function(error, element) {
			  if (element.attr("name") == "templateType"){
			    error.insertAfter("#templateType");
			  }
			  if (element.attr("name") == "templateName"){
			    error.insertAfter("#templateName");
			  } 
			  if (element.attr("name") == "subject"){
			    error.insertAfter("#subject");
			  }  
			}
	    });*/
	} 
	constructor(props){

		super(props);
			this.state = {
			    templateType    	: props.templateType,
			    templateName    	: props.templateName,
			    subject         	: props.subject ? props.subject : '',
			    content         	: props.content,
			    contentError 		: '',
			    subjecterror 		: '',
			    templateNameerror 	: '',
			    templateTypeerror 	: '',
			    emailTemplates 		: {},
	    		notificationTemplates : {},
	    		smsTemplates 		: {}		   
	  	};
		this.updateContent = this.updateContent.bind(this);
	    this.onChange 		= this.onChange.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount(){
		axios({
			method: 'get',
			url: '/api/masternotifications/list',
		}).then((response)=> {
			var emailTemplatesList = response.data.filter((a)=>{ return a.templateType == "Email"});	   	    
			var notificationTemplatesList = response.data.filter((a)=>{ return a.templateType == "Notification"});	   	    
			var smsTemplatesList = response.data.filter((a)=>{ return a.templateType == "SMS"});	   	    
		    this.setState({
		    	emailTemplatesList 			: emailTemplatesList,
		    	notificationTemplatesList 	: notificationTemplatesList,
		    	smsTemplatesList 			: smsTemplatesList
		    });
		    
		}).catch(function (error) {
		    
		});
	}
	AllNotificationTemplates(){
		const id = this.state.currentNotificationId;
		var notificationTemplates = this.state.notificationTemplates;
		if(notificationTemplates && notificationTemplates.length>0){
			for(var i=0; i<notificationTemplates.length; i++){
				if(notificationTemplates[i]._id === id){
					$('.defaultNotification').css({'display':'none'});
					return [notificationTemplates[i]];
				}
			}
		}else{
			return [];
		}
		return [];
	}

	AllsmsTemplates(){
		const id = this.state.currentSMSId;
		// console.log("id",id);
		var smsTemplates = this.state.smsTemplates;
		if(smsTemplates && smsTemplates.length>0){
			for(var i=0; i<smsTemplates.length; i++){
				if(smsTemplates[i]._id === id){
					$('.defaultSMS').css({'display':'none'});
					return [smsTemplates[i]];
				}
			}
		}else{
			return [];
		}
		return [];
	}
	
    getId(id){
    	axios({
			method: 'get',
			url: '/api/masternotifications/'+id,
		}).then((response)=> {
		    this.setState({
				emailTemplates : response.data
			})
		});
    }
    getNotificationId(id){
    	axios({
			method: 'get',
			url: '/api/masternotifications/'+id,
		}).then((response)=> {
			console.log("notify data",response.data);
			this.setState({
				notificationTemplates : response.data
			})
		});
    }
    getSmsId(id){
    	axios({
			method: 'get',
			url: '/api/masternotifications/'+id,
		}).then((response)=> {
	    	this.setState({
				smsTemplates : response.data
			})
		});
    }
	submitTemplate(event){
		console.log('submitTemplate');
		event.preventDefault();
		// if($("#newTemplateForm").valid() && this.state.content){
			var templateType     = this.state.templateType;
			var templateName     = this.state.templateName;
			var subject          = this.state.subject;
			var createdBy        = null;
			var cketext          = this.state.content;
			if(templateType === '-- Select --' || templateName === '--Select Template Name--'){
				swal({
					title: 'Please fill in all the required fields',
					text:"Please fill in all the required fields",
					type: 'success',
					showCancelButton: false,
					confirmButtonColor: '#666',
					confirmButtonText: 'Ok'
				});
			}else{	
				var formValues = {   
					"templateType"  : templateType,
					"templateName"  : templateName,
					"subject"       : subject,
					"content"       : cketext,
					"createdBy"     : null,
 				}
				
				
				axios.post('/api/masternotifications', formValues)
				.then((response)=> {	
				console.log('response',response);	
				axios({
				method: 'get',
				url: '/api/masternotifications/list',
				}).then((response)=> {
				var emailTemplatesList = response.data.filter((a)=>{ return a.templateType == "Email"});	     
				var notificationTemplatesList = response.data.filter((a)=>{ return a.templateType == "Notification"});	     
				var smsTemplatesList = response.data.filter((a)=>{ return a.templateType == "SMS"});	     
				   this.setState({
				   	emailTemplatesList : emailTemplatesList,
				   	notificationTemplatesList : notificationTemplatesList,
				   	smsTemplatesList : smsTemplatesList
				   });
				   console.log(emailTemplatesList);

				   this.setState({
				   	 "templateType"  : "",
					 "templateName"  : "",
					 "subject"       : "",
					 "content"       : "",
					 "createdBy"     : null,

				   })
				   
				}).catch(function (error) {
				   
				});
				// swal({
				// title:'swal',
				// text: response.data ,
				// type: 'success',
				// showCancelButton: false,
				// confirmButtonColor: '#666',
				// confirmButtonText: 'Ok'
				// });
				$('#createNotifyModal').hide();
				$('.modal-backdrop').remove();
				})
				.catch(function (error) {
				/*swal({
				text: "esponse.data",
				type: 'success',
				showCancelButton: false,
				confirmButtonColor: '#666',
				confirmButtonText: 'Ok'
				});*/
				console.log(error);
				})
				.finally(function () {
				// always executed
				});
			}
		// }else{
		// 	this.setState({
		// 		contentError: 'This field is required.',
		// 	});
		// }
	}


	selectType(event){
		event.preventDefault();
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name]: event.target.value,
		},()=>{
			if(this.state.templateType  === 'Notification' || this.state.templateType  === 'SMS' ){
				$('.subjectRow').css({'display':'none'});
			}else if(this.state.templateType  === 'Email'){
				$('.subjectRow').css({'display':'block'});
			}
		});
		
	}
	updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
    onChange(evt){
      var newContent = evt.editor.getData();
      // console.log("onChange fired with event info: ", newContent);
      this.setState({
        content: newContent
      },()=>{
      	if(this.state.content){
      		this.setState({
      			contentError : ''
      		});
      	}else{
      		this.setState({
      			contentError : 'This field is required'
      		})
      	}
      })
    }


	render(){
		const required = (value) => {
		  if (!value.toString().trim().length) {
		    // We can return string or jsx as the 'error' prop for the validated Component
		    return <span className="error">This field id required.</span>;
		  }
		};
		 
		const email = (value) => {
		  if (!validator.isEmail(value)) {
		    return <span className="error">T{`${value} is not a valid email.`}</span>
		  }
		};
		 
		const lt = (value, props) => {
		  // get the maxLength from component's props
		  if (!value.toString().trim().length > props.maxLength) {
		    // Return jsx
		    return <span className="error">The value exceeded {props.maxLength} symbols.</span>
		  }
		};
    return(
   		<div>
      <div className="">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 secdiv">
            </div>
               <section className="">
                    <div className="row">
                      <div className="">
                         <div className="">
                                    
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">

				  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 box-header with-border mrgntop">
						
							<h4 className="h4Title col-lg-12 col-md-12 col-sm-12 col-xs-12">Notification Templates</h4>
												
					</div>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding ">

					 <div className="col-lg-3  col-md-3  col-sm-6 col-xs-12 notificationsbnt"  id="createmodalcl">
						<button className="addexamform clickforhideshow col-lg-12 col-md-12 col-sm-12 col-xs-12 " data-toggle="modal" data-target="#createNotifyModal" data-whatever="@mdo"><i className="fa" aria-hidden="true"></i>Add New Template
						 <i className="fa fa-plus-square plus_sign pull-left"></i>
						</button> 
					 </div>	
					 </div>
					</div>	
					<div className="modal fade modalHide col-lg-12 col-md-12 col-sm-12 col-xs-12" id="createNotifyModal" tabIndex="-1" role="dialog" aria-labelledby="createNotifyModal" aria-hidden="true">
					  	<div className="modal-dialog modal-lg" role="document">
					    	<div className="modal-content modalContent col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
					      		<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        		<h5 className="h5Title col-lg-12 col-md-12 col-sm-12 col-xs-12" id="exampleModalLabel">Create Template</h5>
					        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
								        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
								          <span aria-hidden="true">&times;</span>
								        </button>
							        </div>
					      		</div>
					     		<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        <form className="newTemplateForm col-lg-12 col-md-12 col-sm-12 col-xs-12" id="newTemplateForm">
							        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 forgtTextInp NOpadding-left">
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding-left">

											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="form-group">
												 	<label className="col-lg-6 col-md-6 col-sm-12 col-xs-12  label-category">Template Type <span className="astrick">*</span></label>     						
											        	<select className="form-control templateType" name="templateType" id="templateType" onChange={this.selectType.bind(this)} value={this.state.templateType}>
												      	<option value="Not Selected"> --Select-- </option>
														<option> Email </option>
														<option> Notification </option>
														<option> SMS </option>
											      	</select> 
												</div>	
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="form-group">
												 	<label className=" label-category">Template Name <span className="astrick">*</span></label>     						
											       	<select name="templateName" id="templateName" value={this.state.templateName} onChange={this.handleChange} className="form-control templateType " required>
													  <option value="Not Selected">--Select Template Name--</option>
													  <option value="User New Registration">User New Registration</option>
													  <option value="Admin New Registration">Admin New Registration</option>
													  <option value="User Blocked">User Blocked</option>
													  <option value="User Activated">User Activated</option>
													</select>
												</div>	
											</div>
										</div>
									</div>

										<div className="row rowPadding subjectRow col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject <span className="astrick">*</span></label>     						
											        <input type="text" name="subject" validations={[required]} id="subject" value={this.state.subject} onChange={this.handleChange} className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
												</div>	
											</div>
										</div>
										<div className="row rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message <span className="astrick">*</span></label> 
												 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
													<CKEditor activeClass="p15" id="editor"  className="templateName" content={this.state.content} events={{"change": this.onChange}}/>
													<label className="error">{this.state.contentError}</label>
												 </div> 						
												</div>	
											</div>
										</div>
									</form>
					      		</div>
							    <div className="modal-footer adminModal-footer paddingtop-down col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        <button  type="submit" onClick={this.submitTemplate.bind(this)} className=" btn pull-right buttontAddEdit outlinebox saveTempBtn">Save Template</button>
									{/*<button type="submit" onClick={this.updateTemplate.bind(this)} className="btn pull-right col-lg-3 col-md-3 col-sm-6 col-xs-12 btnUpdate">Update Template</button>*/}
							   	</div>
					   		</div>
					  	</div>
					</div>
					<div className="box-body">
						<div className="notifTabs col-lg-10 col-lg-offset-3 col-md-10 col-md-offset-3 col-sm-12 col-xs-12">
						  	 <ul className="nav nav-pills nav-pillss">
							    <li className="active notifTab col-lg-2 col-md-3 col-sm-4 col-xs-12">
							    	<a data-toggle="pill" href="#emailTemplates" > <i class="fa fa-envelope-square"></i> Email 
							    	</a>
							    </li>
							    <li className="col-lg-2 col-md-3 col-sm-3 col-xs-12 notifTab">
							    	<a data-toggle="pill" href="#smsTemplates">
							    		SMS
							    	</a>
							    </li>
							    <li className="col-lg-2 col-md-3 col-sm-4 col-xs-12 notifTab">
							    	<a data-toggle="pill" href="#notificationTemplates">
							    		In-App 
							    	</a>
							    </li>
							    
							</ul>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	            			<h5 className="h5Title"> Template Library </h5>
	            		</div>
	            		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding templateDiv">
							<div className="tab-content">
							<div id="emailTemplates" className="tab-pane fade in active">
							  <div className="">
							  	<div className="sidertemplatebar col-lg-3 col-md-3 col-xs-12 col-sm-12">
							  		<div className="row">
										{/*{ this.AllTemplates().map( (templateData, index)=>{*/}
											<TemplateRow getId={this.getId.bind(this)} emailTemplatesList={this.state.emailTemplatesList}/>
										  {/*}) 
										}*/}
									</div>
								</div>
								<div className="saveTemplateWrapper col-lg-9 col-md-9 col-xs-12 col-sm-12">
									<div className="defaultMsg">
										<h2 className="h2Title">Please Select The Template</h2>
										<i className="fa fa-hand-o-left" aria-hidden="true"></i>
									</div>
									{this.state.emailTemplates ? <EmailTemplateRow  emailtemplateValues={this.state.emailTemplates}/> : null}
								</div> 
							  </div>
							</div>
							<div id="notificationTemplates" className="tab-pane fade">
							  <div className="">
							  	<div className="sidertemplatebar col-lg-3 col-md-3 col-xs-12 col-sm-12">
							  		<div className="row">																	
										<NotificationTemplateRow getNotificationId={this.getNotificationId.bind(this)} notificationTemplatesList={this.state.notificationTemplatesList}/>										  
									</div>
								</div>
								<div className="saveTemplateWrapper col-lg-9 col-md-9 col-xs-12 col-sm-12">
									<div className="defaultNotification">
										<h2 className="h2Title">Please Select The Template</h2>
										<i className="fa fa-hand-o-left" aria-hidden="true"></i>
									</div>
									{this.state.notificationTemplates ? <AllNotificationTemplateRow notificationtemplateValues={this.state.notificationTemplates}/> : null}									  
								</div>
							  </div>
							</div>
							<div id="smsTemplates" className="tab-pane fade">
							    <div className="">
							  	<div className="sidertemplatebar col-lg-3 col-md-3 col-xs-12 col-sm-12">
							  		<div className="row">
										<SMSTemplateRow getSmsId={this.getSmsId.bind(this)} smsTemplatesList={this.state.smsTemplatesList}/>	
									</div>
								</div>
								<div className="saveTemplateWrapper col-lg-9 col-md-9 col-xs-12 col-sm-12">
									<div className="defaultSMS">
										<h2 className="h2Title">Please Select The Template</h2>
										<i className="fa fa-hand-o-left" aria-hidden="true"></i>
									</div>
									{this.state.smsTemplates?<AllSMSTemplateRow smstemplateValues={this.state.smsTemplates}/>:null}									  
								</div>
							  </div>
							</div>
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
     	);
    }

}
export default ViewTemplates;