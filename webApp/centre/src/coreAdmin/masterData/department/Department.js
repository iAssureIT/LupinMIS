import React, {Component} from 'react';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import axios from "axios";
import $ from "jquery";
import moment from 'moment';
import './Department.css';


class Department extends Component{
	constructor(props)
	{
		super(props);
		
		this.state = 
		{
				
				"DepartmentSelect"				: '-- Select Department --',
				"Department" 					: '',
				"action"                        :'Submit',

				 fields: {},
                 errors: {}
       

			
         }					
	}

handleChange(event)
	{
  event.preventDefault();
    this.setState({
        "Department"                            : this.refs.Department.value,          
     
          });
      let fields = this.state.fields;
      fields[event.target.name] = event.target.value;
      this.setState({
        fields
      });
       if (this.validateForm()) {
        let errors = {};
        errors[event.target.name] = "";
        this.setState({
          errors: errors
        });
      }

    }

    diseaseListData(){
        // return MasterDepartment.find({}).fetch();
      }

    componentWillReceiveProps(nextProps) {
  //     this.setState({
		// Department						: nextProps.Department,
  //   });

    }

   AddDepartment(event){
        // event.preventDefault(); 
        //     var departmentValues = {
        //     "Department"   : this.state.Department.value,       
        //   }   
  }

	
// =========================================== Inserting Data On Submit ==============================================

	submitBasicInfo(event)
	{   
		 event.preventDefault();
         if (this.validateForm()) {
		      var DepartmentValues= {
		        "Department"                            : this.refs.Department.value,          
		        
		      }
      axios
          .post('http://jsonplaceholder.typicode.com/posts', { DepartmentValues })
          .then( (res)=>{
            if(res.status == 201){
              // alert("Data inserted Successfully!")
            console.log(res);
              
            }
          })
          .catch();
       /*  contactArray.push(contactValues);
          this.setState({
            contactData : contactArray
          })
*/
		    let fields = {};
		    fields["Department"] = "";
		   
		    this.setState({
		                "Department"                           : "",          
		                 fields:fields
		    });
		    alert("Data inserted Successfully!")
		      }
		          
		  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["Department"]) {
        formIsValid = false;
        errors["Department"] = "This field is required.";
      }
      if (typeof fields["Department"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^[A-Za-z]+[0-9]*$/);
        if (!pattern.test(fields["Department"])) {
          formIsValid = false;
          errors["Department"] = "Please enter Category.";
        }
      }
                 
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

 
	updateDepartmentData(event)
	{
	// 	event.preventDefault();
	// 	var departmentValues = 
	// 	{
	// 	   departmentId 			: this.state.departmentId,
	// 	   department 			    : this.state.Department,	
	// 	};
	// 	Meteor.call("updateDepartment",departmentValues,
	// 		(error,result)=>{
	// 			if(error)
	// 			{
	// 				console.log("Something went wrong! Error = ", error);
	// 			}else
	// 			{
	// 				swal({
	// 	                              title: 'abc',
	// 			                      text: "Department Modified Successfully!",
	// 			                      type: 'success',
	// 			                      showCancelButton: false,
	// 			                      confirmButtonColor: '#666',
	// 			                      // timer: 4000,
	// 			                      // cancelButtonColor:'#d33',
	// 			                      confirmButtonText: 'Ok'
	// 	                    });
	// 			}
	// 		}
	// 	);	
	// 	this.setState(
	// 	{	
	// 		"action"					: "Submit",
	// 		"Department" 				: "Update",	        
	// 	});
	// 	FlowRouter.go('/admin/Department');
	// 	this.setState({
	// 	   departmentId 		: this.state.departmentId,
	// 	   Department 			: this.state.departmentName,
 //           "action"				: "Update",
 //           Department           :'', 
	// 	   departmentId         :'',  
	// 	});
	// }

	
		
	// updateDepartmentSetting(department)
	// {
	// 	event.preventDefault();
	// 	console.log('department',department);
	// 	var departmentId = department._id;
	// 	this.setState(
	// 	{	
	// 		"departmentId" 			:department._id,
	// 		"Department" 			:department.departmentName,	
	// 		"action"				: "Update",
	// 	},()=> {console.log("---")});
	}



	deleteDepartment(event)
	{
		// event.preventDefault();
		// // var empId1 = (event.currentTarget.id).split('d');
		// // var empId = empId1[1];

		// // console.log("dd11 = ",empId);
		// // console.log("dd = ",empId1);
		// var id = event.currentTarget.id;
		// 	swal({
		// 	  text      : "Department is deleted successfully.",
		// 	  // icon      : "warning",
		//   //buttons   : true,
		//   // dangerMode: true,
		//    willDelete:true,
		// })
		// .then((willDelete) => {
		//   	if (willDelete) 
		//   	{
		// 		Meteor.call("deleteDepartment",id,
		// 				(error,result) => {
		// 					if(error){
		// 						swal("Something went wrong!","error");
		// 						console.log(error);
		// 					}else{
								
		// 					}
		// 				}
		// 		);
		// 	}else
		// 	{
		// 	    swal("The Created Department is safe!");
		// 	}
		// });
		// this.setState({
		//       						button:false,
		//       						timer:2000,
		//       						Department:'',
		//       					})	
	}


	 componentDidMount(){
		 // window.scrollTo(0, 0)
	  //     axios
	  //     .get('http://jsonplaceholder.typicode.com/posts')
	  //     .then(
	  //       (res)=>{
	  //         console.log(res);
	  //         const postsdata = res.data;
	  //         this.setState({
	  //           department : postsdata,
	  //         });
	  //       }
	  //     )
	  //     .catch();
  	}
	
	showBtn(){
		if(this.state.departmentId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btn_mrg_taluka updateBTN" onClick={this.updateDepartmentData.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btn_mrg_taluka btnSubmit" onClick={this.submitBasicInfo.bind(this)}>Submit</button>
			)
		}
	}							
			

// =========================================== Inserting Data On Submit ==============================================

	render(){
		const {formerrors} = this.state;
		return (
			<div className= "container-fluid">			
			<div className= "row">			
			<div className= "formWrapper fontF">			
				<div className= "content">	
					<div className= "col-lg-12 pageContent">	
						<div className="row">
						    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titleHeader">
						    	<h3 id="topHeading" className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pageHeader">Department Master Data</h3>
						    	{/*<div className="pull-right">
									<nav aria-label="breadcrumb">
									  <ol className="breadcrumb breadcrumbCustom">
									    <li className="breadcrumb-item"><a href="#"><i className="fa fa-home home-icon"></i>&nbsp; HRMS</a></li>
									    <li className="breadcrumb-item"><a href="#">Emp Induction Management</a></li>
									    <li className="breadcrumb-item" aria-current="page" className="active">Department</li>
									  </ol>
									</nav>
								</div>*/}
							</div>
				    		<hr className="hr-head"/>

	{/********************************************Input Fields Starts***********************************************/}
							<form className="col-lg-12 mg_btn" id="department_id">
								<div className="container-fluid shiftSettingForm col-lg-12">
									<div className="row">
										<div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 container-fluid">							
											<div className="row">
												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">							
													<div className="form-group valid_box">
									          			<label className="pghdr">Department<span className="asterix">*</span></label>
									          			<div className="input-group inputBox-main nameParts" id="Department">
									             			<div className="input-group-addon inputIcon"><i className="fa fa-graduation-cap "></i></div>
													     	<input type="text" value={this.state.Department} placeholder="Enter Here" name="Department"  ref="Department" data-text="Department" className="form-control inputBox nameParts" onChange={this.handleChange.bind(this)}  required/>
									          	 		</div>
									          	 		 <div className="errorMsg">{this.state.errors.Department}</div>
									        		</div>
												</div>
												
											</div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					    	               {this.showBtn()}
						                </div>									
								</div>
							</div>
						</form>
							
	{/********************************************Input Fields Ends***********************************************/}

{/********************************************Generate Table Starts***********************************************/}
						<hr className="hr-subhead"/>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">								
							<div className="col-lg-9 col-md-9 col-sm-9 col-xs-12 row">
				    			<h3 className="pageSubHeader">Department Details</h3>
							</div>
							<table id="table-to-xls" className="table table-bordered table-hover table-responsive table-striped valign">
								<thead>
									<tr> 
										<th className="col-lg-2 text-center"> Sr. </th> 
										<th className="text-center"> Department </th> 
										<th className=" col-lg-2 text-center"> Action </th>
									</tr>
								</thead>
								<tbody>
									
									
							</tbody>
												
										</table>
									
						            
					 </div>
				</div>
			</div>
		</div>
	</div>
	</div>
	</div>
	</div>
		
		
	    );
	}
}

export default Department;

