import React, { Component }    from 'react';
import EditNotificationModal   from '../EditNotificationModal.jsx';
import axios 				   from 'axios';
import swal                     	from 'sweetalert';

class EmailTemplateRow extends Component{

	constructor(props) {
      super(props);   
      
        this.state = {
	    templateType    : '',
	    templateName    : '',
	    subject         : '',
	    content         : '',
	   
	  };

      this.editEmailNotify = this.editEmailNotify.bind(this);
      this.emailGetData    = this.emailGetData.bind(this);
    }
    componentWillReceiveProps(nextProps){
    	if(nextProps.sendProps){
    		// this.call();
    	}
    }
	deleteEmailTemplate(event){
		event.preventDefault();
		var id = event.target.id;
		const token = '';
		const url = '/api/masternotification/'+id ;
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
	    	console.log('delete response',response);
	    	swal({
				title: "Template deleted successfully",
				text: "Template deleted successfully",
			});
	    	if(response.data.message==="Master notification deleted")
	    	{
		    	this.props.deleteData("Email",id);
    		}

		}).catch((error)=> {
		    // handle error
		    console.log(error);
		});


	}
	editEmailNotify(event){
		// var id = this.props.emailtemplateValues._id;
		// var idEmail = $(event.target).attr('id');
		// var updateEmailNotify = NotificationTemplate.findOne({'_id':id});
		// this.setState({
		// 	'templateType' 		: updateEmailNotify.templateType,
		// 	'templateName'		: updateEmailNotify.templateName,
		// 	'subject'			: updateEmailNotify.subject,
		// 	'content'			: updateEmailNotify.content,
		// });

	}
	emailGetData =(id)=>{
    this.props.getEmailData(id);
	}
	render(evt) {
			var text = this.props.emailtemplateValues.content ? this.props.emailtemplateValues.content : ''; 
			if(this.props.emailtemplateValues && this.props.emailtemplateValues.content){
		        return (
		    	<div className="contentBox col-lg-12">
		      		<div className="pull-right actionBtn">
		      			<div className="dropdown ">
						  	<button className="dropbtn"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
						  	<div className="dropdown-content" >
							    <div  className="deleteNotif"  data-toggle="modal" data-target={"#editNotifyModal-"+this.props.emailtemplateValues._id} id={this.props.emailtemplateValues._id}>
							    	<i className="fa fa-pencil editPencil" aria-hidden="true"  id={this.props.emailtemplateValues._id}></i> 
							    	<span className=""  id={this.props.emailtemplateValues._id}>&nbsp;&nbsp;&nbsp; Edit</span>
							    </div>
								<div className="deleteNotif" data-toggle="modal" data-target={`#${this.props.emailtemplateValues._id}-rm`}  id={this.props.emailtemplateValues._id}>
									<span className="" id={this.props.emailtemplateValues._id}>
										<i className="fa fa-trash deleteEM" aria-hidden="true" id={this.props.emailtemplateValues._id} ></i>
										<span id={this.props.emailtemplateValues._id}>&nbsp;&nbsp;&nbsp; Delete</span>
									</span>
								</div>
						  </div>
						</div>
						
					</div>
					<EditNotificationModal  emailNot={this.props.emailtemplateValues._id} emailGetData={this.emailGetData.bind(this)} data={this.props.emailtemplateValues} getData={this.props.getData} />

					<div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${this.props.emailtemplateValues._id}-rm`}  role="dialog">
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

	                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this template?</h4>
	                              </div>
	                              
	                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
	                                   </div>
	                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                        <button id={this.props.emailtemplateValues._id} onClick={this.deleteEmailTemplate.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
	                                   </div>
	                              </div>
	                         </div>
	                    </div>
	               </div>

					

					<div className="inputrow">
						<div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
							 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject:</label>     						
						        <span className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.emailtemplateValues.subject}</span>
							</div>	
						</div>
					</div>
					<div className="inputrow"> 
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
							 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message:</label>     						
							 <div  dangerouslySetInnerHTML={{ __html:text}} className="textAreaBox col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
							</div>	
						</div>
					</div>
					</div>
			    );
			}else{
				return(<div></div>);
			}

	} 

}
export default EmailTemplateRow;