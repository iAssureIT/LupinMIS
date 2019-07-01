import React, {Component} from 'react';
import axios from "axios";
import $ from "jquery";
import moment from 'moment';
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';

import './Grade.css';

class Grade extends Component{
	constructor(props)
	{
		super(props);
		this.state = 
		{
		
				"GradeSelect"				: '-- Select Grade --',
				"Grade" 					: '',
				"action"                                :'Submit',

				 fields: {},
                 errors: {}

				
        
            }				
	}
  handleChange(event)
	{
    event.preventDefault();
    this.setState({
        "Grade"  :this.refs.Grade.value,          
     
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
    
 submitBasicInfo(event)
	{   
		 event.preventDefault();
         if (this.validateForm()) {
		      var gradeValues= {
		        "Grade" : this.refs.Grade.value,          
		        
		      }
      axios
          .post('http://jsonplaceholder.typicode.com/posts', { gradeValues })
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
		    fields["Grade"] = "";
		   
		    this.setState({
		                "Grade"                           : "",          
		                 fields:fields
		    });
		    alert("Data inserted Successfully!")
		      }
		          
		  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["Grade"]) {
        formIsValid = false;
        errors["Grade"] = "This field is required.";
      }
      if (typeof fields["Grade"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^[A-Za-z]+[0-9]*$/);
        if (!pattern.test(fields["Grade"])) {
          formIsValid = false;
          errors["Grade"] = "Please enter Diseases.";
        }
      }
                 
      this.setState({
        errors: errors
      });
      return formIsValid;
  }




  componentDidMount() { 
      // window.scrollTo(0, 0)
      // axios
      // .get('http://jsonplaceholder.typicode.com/posts')
      // .then(
      //   (res)=>{
      //     console.log(res);
      //     const postsdata = res.data;
      //     this.setState({
      //       BasicInfo : postsdata,
      //     });
      //   }
      // )
      // .catch();


      }

    diseaseListData(){
        // return MasterGrade.find({}).fetch();
      }

    componentWillReceiveProps(nextProps) {
  //     this.setState({
		// Grade						: nextProps.Grade,
  //   });

    }

   AddGrade(event){
        // event.preventDefault(); 
        //     var gradeValues = {
        //     "Grade"   : this.state.Grade.value,       
        //   }   
  }

	
// =========================================== Inserting Data On Submit ==============================================

	

	updateGradeData(event)
	{
		// event.preventDefault();
		// var gradeValues = 
		// {
		//    gradeId 			: this.state.gradeId,
		//    grade 			: this.state.Grade,	
		// };
		// Meteor.call("updateGrade",gradeValues,
		// 	(error,result)=>{
		// 		if(error)
		// 		{
		// 			console.log("Something went wrong! Error = ", error);
		// 		}else
		// 		{
		// 			swal({
		//                               title: 'abc',
		// 		                      text: "Grade Modified Successfully!",
		// 		                      type: 'success',
		// 		                      showCancelButton: false,
		// 		                      confirmButtonColor: '#666',
		// 		                      // timer: 4000,
		// 		                      // cancelButtonColor:'#d33',
		// 		                      confirmButtonText: 'Ok'
		//                     });
		// 		}
		// 	}
		// );	
		// this.setState(
		// {	
		// 	"action"					: "Submit",
		// 	"action"					: "Update",
		// 	//"Grade" 				    : "Update",
		// 	Grade                       :'',
		// 	gradeId                     :'',	        
		// });
		// FlowRouter.go('/admin/Grade');
		// this.setState({
		//    gradeId 		: this.state.gradeId,
		//    Grade 		: this.state.gradeName,
  //          "action"		: "Update",
  //          Grade        :'',
  //          gradeId      :'',
		// });
	}

	
		
	updateGradeSetting(grade)
	{
		// event.preventDefault();
		// console.log('grade',grade);
		// var gradeId = grade._id;
		// this.setState(
		// {	
		// 	"gradeId" 			:grade._id,
		// 	"Grade" 			:grade.gradeName,	
		// 	"action"			: "Update",
		// },()=> {console.log("---")});
	}



	deleteGrade(event)
	{
		// event.preventDefault();
		// // var gradeId1 = (event.currentTarget.id).split('d');
		// // var gradeId = gradeId1[1];

		// // console.log("dd11 = ",gradeId);
		// // console.log("dd = ",gradeId1);
		// var id = event.currentTarget.id;
		// swal({
		//   text      : "Grade is deleted successfully.",
		//  // icon      : "warning",
		//  // buttons   : true,
		//   // dangerMode: true,

		//   willDelete:true,
		// })
		// .then((willDelete) => {
		//   	if (willDelete) 
		//   	{
		// 		Meteor.call("deleteGrade",id,
		// 				(error,result) => {
		// 					if(error){
		// 						swal("Something went wrong!","error");
		// 						console.log(error);
		// 					}else{
								
		// 						}
		// 				}
		// 		);
		// 	}else
		// 	{
		// 	    swal("The Created Grade is safe!");
		// 	}
		// });
		// this.setState({
		//       						button:false,
		//       						timer:2000,
		//       						Grade:'',
		//       						gradeId:'',
		//       					})	
	}


	
			
/***************************************************************/


  	showBtn(){
		if(this.state.gradeId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btn_mrg_taluka updateBTN" onClick={this.updateGradeData.bind(this)}>Update</button>
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
		 <div className="container-fluid">
		  <div className="row">
			<div className= "formWrapper fontF">			
				<div className= "content">	
					<div className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 pageContent">	
						<div className="row">
						    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titleHeader">
						    	<h3 id="topHeading" className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pageHeader">Grade Master Data</h3>
						    	<div className="pull-right">
									{/*<nav aria-label="breadcrumb">
									  <ol className="breadcrumb breadcrumbCustom">
									    <li className="breadcrumb-item"><a href="#"><i className="fa fa-home home-icon"></i>&nbsp; HRMS</a></li>
									    <li className="breadcrumb-item"><a href="#">Emp Induction Management</a></li>
									    <li className="breadcrumb-item" aria-current="page" className="active">Grade</li>
									  </ol>
									</nav>*/}
								</div>
							</div>
				    		<hr className="hr-head"/>

	{/********************************************Input Fields Starts***********************************************/}
							<form className="col-lg-12 mg_btn" id="grade_id" onSubmit={this.submitBasicInfo.bind(this)}>
								<div className="container-fluid shiftSettingForm col-lg-12">
									<div className="row">
										<div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 container-fluid">							
											<div className="row">
												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">							
													<div className="form-group valid_box">
									          			<label className="pghdr">Grade<span className="asterix">*</span></label>
									          			<div className="input-group inputBox-main "  id="Grade">
									             			<div className="input-group-addon inputIcon"><i className="fa fa-graduation-cap "></i></div>
													     	<input type="text" value={this.state.Grade} placeholder="Enter Here" name="Grade" data-text="Grade"  ref="Grade" className="form-control inputBox nameParts" onChange={this.handleChange.bind(this)}  required/>
									          	 		</div>
									          	 		<div className="errorMsg">{this.state.errors.Grade}</div>
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
														
							<div className="col-lg-9 col-md-9 col-sm-9 col-xs-12 ">
				    			<h3 className="pageSubHeader">Grade Details</h3>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<table id="table-to-xls" className="table table-bordered table-hover table-responsive table-striped valign">
								<thead>
									<tr>  
										<th className="col-lg-2 text-center"> Sr. </th> 
										<th className="col-lg-6 text-center"> Grade </th> 
										<th className="col-lg-2 text-center"> Action </th>
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

export default Grade;

