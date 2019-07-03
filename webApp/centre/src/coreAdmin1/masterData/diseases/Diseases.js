import React, {Component} from 'react';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import axios from "axios";
import $ from "jquery";
import moment from 'moment';
import "./Diseases.css";



class Diseases extends Component{
	constructor(props)
	{
		super(props);
		
		this.state = 
		{
			   
				

				"DiseasesSelect"		: '-- Select Diseases --',
				"action"                : 'Submit',

				 fields: {},
                 errors: {}

				 
	    } 
	}


   handleChange(event)
	{
    event.preventDefault();
    this.setState({
        "Diseases"  : this.refs.Diseases.value,          
     
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
		      var diseasesValues= {
		        "Designation" : this.refs.Diseases.value,          
		        
		      }
      axios
          .post('http://jsonplaceholder.typicode.com/posts', { diseasesValues })
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
		    fields["Diseases"] = "";
		   
		    this.setState({
		                "Diseases"                           : "",          
		                 fields:fields
		    });
		    alert("Data inserted Successfully!")
		      }
		          
		  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["Diseases"]) {
        formIsValid = false;
        errors["Diseases"] = "This field is required.";
      }
      if (typeof fields["Diseases"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^[A-Za-z]+[0-9]*$/);
        if (!pattern.test(fields["Diseases"])) {
          formIsValid = false;
          errors["Diseases"] = "Please enter Diseases.";
        }
      }
                 
      this.setState({
        errors: errors
      });
      return formIsValid;
  }



   diseaseListData(){
        // return MasterDiseases.find({}).fetch();
      }

    componentWillReceiveProps(nextProps) {
     //  this.setState({
        
     //    Diseases             			: nextProps.Diseases,        
   		// });

    }

    AddDisease(event){
        // event.preventDefault(); 
        //     var diseasesValues = {
        //     "diseasesId" : this.state.diseasesId,
        //     "Disease"    : this.state.Diseases.value,       
        //   }   
    }

	
// =========================================== Inserting Data On Submit ==============================================


	updateDiseasesData(diseases)
	{
		// event.preventDefault();
		// var diseasesValues = 
		// {
		//    diseasesId 			: this.state.diseasesId,
		//    diseases 			: this.state.Diseases,	
		// };
		// Meteor.call("updateDiseases",diseasesValues,
		// 	(error,result)=>{
		// 		if(error)
		// 		{
		// 			console.log("Something went wrong! Error = ", error);
		// 		}else
		// 		{
		// 			swal({
		//                               title: 'abc',
		// 		                      text: "Disease Modified Successfully!",
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
		// 	"action"                    :"Update",
		// 	//"Diseases" 				: "Update",
		// 	Diseases                    :'',
		//     diseasesId                  :'',	        
		// });
		// FlowRouter.go('/admin/Diseases');
		// this.setState({
		//    diseasesId 			: this.state.diseasesId,
		//    Diseases 			: this.state.diseaseName,
  //          "action"				: "Update",
  //          Diseases             :'',
		//    diseasesId           :'',
		// });
	}

	
		
	updateDiseasesSetting(diseases)
	{
		// event.preventDefault();
		// console.log('diseases',diseases);
		// var diseasesId = diseases._id;
		// this.setState(
		// {	
		// 	"diseasesId" 			:diseases._id,
		// 	"Diseases" 			    :diseases.diseaseName,	
		// 	"action"				: "Update",
		// },()=> {console.log("---")});
	}


	deleteShiftt(event)
	{
		// event.preventDefault();
		// // var empId1 = (event.currentTarget.id).split('d');
		// // var empId = empId1[1];

		// // console.log("dd11 = ",empId);
		// // console.log("dd = ",empId1);
		// var id = event.currentTarget.id;
		// swal({
		//   text        : "Disease is deleted successfully.",
		//   //icon      : "warning",
		//   //buttons   : true,
		//   //dangerMode: true,
		//   willDelete:true,
		// })
		// .then((willDelete) => {
		//   	if (willDelete) 
		//   	{
		// 		Meteor.call("deleteShiftt",id,
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
		// 	    swal("The created record is safe!");
		// 	}
		// });
		// this.setState({
		//       						button:false,
		//       						timer:2000,
		//       						Diseases:'',
		//       						diseasesId:'',
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
	  //           diseases : postsdata,
	  //         });
	  //       }
	  //     )
	  //     .catch();
  	}

  	showBtn(){
		if(this.state.diseasesId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btn_mrg_taluka updateBTN" onClick={this.updateDiseasesData.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btn_mrg_taluka btnSubmit" onClick={this.submitBasicInfo.bind(this)}>Submit</button>
			)
		}
	}			

	
// =========================================== Inserting Data On Submit ==============================================

  render(){	
	return (
	 <div className="container-fluid">
		<div className="row">
			<div className= "formWrapper fontF">			
				<div className= "content">	
					<div className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 pageContent">	
						<div className="row">
						    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titleHeader">
						    	<h3 id="topHeading" className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pageHeader">Diseases Master Data</h3>
						    	{/*<div className="pull-right">
									<nav aria-label="breadcrumb">
									  <ol className="breadcrumb breadcrumbCustom">
									    <li className="breadcrumb-item"><a href="#"><i className="fa fa-home home-icon"></i>&nbsp; HRMS</a></li>
									    <li className="breadcrumb-item"><a href="#">Emp Induction Management</a></li>
									    <li className="breadcrumb-item" aria-current="page" className="active">Diseases</li>
									  </ol>
									</nav>
								</div>*/}
							</div>
				    		<hr className="hr-head"/>

	{/********************************************Input Fields Starts***********************************************/}
							<form className="col-lg-12 mg_btn" id="diseases_id">
								<div className="container-fluid shiftSettingForm col-lg-12">
									<div className="row">
										<div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 container-fluid">							
											<div className="row">
												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">							
													<div className="form-group valid_box">
									          			<label className="pghdr">Diseases<span className="asterix">*</span></label>
									          			<div className="input-group inputBox-main nameParts" id="Diseases">
									             			<div className="input-group-addon inputIcon"><i className="fa fa-graduation-cap "></i></div>
													     	<input type="text" value={this.state.Diseases} placeholder="Enter Here" name="Diseases" data-text="Diseases" ref="Diseases" className="form-control inputBox nameParts" onChange={this.handleChange.bind(this)} required />
									          	 		</div>
									          	 		<div className="errorMsg">{this.state.errors.Diseases}</div>
									        		</div>
												</div>
												
											</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					    	               {this.showBtn()}
						                </div>	
										
																
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
				    			<h3 className="pageSubHeader">Disease Details</h3>
							</div>
							<table id="table-to-xls" className="table table-bordered table-hover table-responsive table-striped valign">
								<thead>
									<tr> 
										<th className="col-lg-2 text-center"> Sr. </th> 
										<th className="text-center"> Disease </th> 
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

export default Diseases;

