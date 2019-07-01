import React, {Component} from 'react';
// import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import axios from "axios";
import $ from "jquery";
import moment from 'moment';
import './Category.css';




class Category extends Component{
	constructor(props)
	{
		super(props);
		
		this.state = 
		{
				"CategorySelect"						: '-- Select Category --',
				"Category" 						        : '',
				"action"                                :'Submit',
			    fields: {},
                errors: {}
       
	              }
	           
	             this.handleChange=this.handleChange.bind(this);
	         }



handleChange(event)
	{
    event.preventDefault();
    this.setState({
        "Category"                            : this.refs.Category.value,          
        
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
        // return MasterCategory.find({}).fetch();
      }

    componentWillReceiveProps(nextProps) {
    //   this.setState({
    //     Category						: nextProps.Category,
    // });

    }

   AddCategory(event){
        // event.preventDefault(); 
        //     var categoryValues = {
        //     "Category"   : this.state.Category.value,       
        //   }   
  }

	
// =========================================== Inserting Data On Submit ==============================================

	submitBasicInfo(event)
	{   
		 event.preventDefault();
    if (this.validateForm()) {
      var contactValues= {
        "Category"                            : this.refs.Category.value,          
        
      }
      axios
          .post('http://jsonplaceholder.typicode.com/posts', { contactValues })
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
    fields["Category"] = "";
   
    this.setState({
                "Category"                           : "",          
                 fields:fields
    });
    alert("Data inserted Successfully!")
      }
          
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["Category"]) {
        formIsValid = false;
        errors["Category"] = "This field is required.";
      }
      if (typeof fields["Category"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
        if (!pattern.test(fields["Category"])) {
          formIsValid = false;
          errors["Category"] = "Please enter Category.";
        }
      }
                 
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  	
	updateCategoryData(event)
	{
		// event.preventDefault();
		// var categoryValues = 
		// {
		//    categoryId 			: this.state.categoryId,
		//    category 			: this.state.Category,	
		// };
		// Meteor.call("updateCategory",categoryValues,
		// 	(error,result)=>{
		// 		if(error)
		// 		{
		// 			console.log("Something went wrong! Error = ", error);
		// 		}else
		// 		{
		// 			swal({
		//                               title: 'abc',
		// 		                      text: "Category Modified Successfully!",
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
		// 	//"Category" 			    : "Update",	
		// 	Category                    :'', 
		// 	categoryId                  :'',       
		// });
		// FlowRouter.go('/admin/Category');
		// this.setState({
		//    categoryId 			: this.state.categoryId,
		//    Category 			: this.state.categoryName,
  //          "action"				: "Update",
  //          Category             :'', 
		//    categoryId           :'',  
		// });
	}


updateCategorySetting(category)
	{
		// event.preventDefault();
		// console.log('category',category);
		// var categoryId = category._id;
		// this.setState(
		// {	
		// 	"categoryId" 			:category._id,
		// 	"Category" 			    :category.categoryName,	
		// 	"action"				: "Update",
		// },()=> {console.log("---")});
	}



	deleteCategory(event)
	{
		// event.preventDefault();
		// // var empId1 = (event.currentTarget.id).split('d');
		// // var empId = empId1[1];

		// // console.log("dd11 = ",empId);
		// // console.log("dd = ",empId1);
		// var id = event.currentTarget.id;
		// swal({
		//   text      : "Category is deleted successfully.",
		//   //icon      : "warning",
		//  // buttons   : true,
		//  // dangerMode: true,
		//   willDelete:true,
		// })
		// .then((willDelete) => {
		//   	if (willDelete) 
		//   	{
		// 		Meteor.call("deleteCategory",id,
		// 				(error,result) => {
		// 					if(error){
		// 						swal("Something went wrong!","error");
		// 						console.log(error);
		// 					}
		// 				}
		// 		);
		// 	}else
		// 	{
		// 	    swal("The Created Category is safe!");
		// 	}
		// });

		//            this.setState({
		//       						button:false,
		//       						timer:2000,
		//       						Category:'',
		//       						categoryId:'',
		//       					})	
	}
	

	componentDidMount(){


		 // window.scrollTo(0, 0)
   //    axios
   //    .get('http://jsonplaceholder.typicode.com/posts')
   //    .then(
   //      (res)=>{
   //        console.log(res);
   //        const postsdata = res.data;
   //        this.setState({
   //          category1 : postsdata,
   //        });
   //      }
   //    )
   //    .catch();



		// $("html,body").scrollTop(0); 
		       
	 //    jQuery.validator.setDefaults({
	 //      debug: true,
	 //      success: "valid"
	 //    });
	 //    $("#category_id").validate({
	 //      rules: {
	 //        Category: {
	 //          required: true,
  //         	  // regx1:/^$|\s+/,
	 //        },
	 //      },
	 //       errorPlacement: function(error, element) {
  //         if (element.attr("name") == "Category"){
  //                error.insertAfter("#Category");
  //           } 
  //       }
	      
	 //    });
  	}
	
	showBtn(){
		if(this.state.categoryId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btn_mrg_taluka updateBTN" onClick={this.updateCategoryData.bind(this)}>Update</button>
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
					<div className= "col-lg-12 col-md-12 col-sm-12 col-xs-12 pageContent">	
						<div className="row">
						    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 titleHeader">
						    	<h3 id="topHeading" className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pageHeader">Category Master Data</h3>
						    	{/*<div className="pull-right">
									<nav aria-label="breadcrumb">
									  <ol className="breadcrumb breadcrumbCustom">
									    <li className="breadcrumb-item"><a href="#"><i className="fa fa-home home-icon"></i>&nbsp; HRMS</a></li>
									    <li className="breadcrumb-item"><a href="#">Emp Induction Management</a></li>
									    <li className="breadcrumb-item" aria-current="page" className="active">Category</li>
									  </ol>
									</nav>
								</div>*/}
							</div>
				    		<hr className="hr-head"/>

	{/********************************************Input Fields Starts***********************************************/}
							
							<form className="col-lg-12 mg_btn"  id="category_id">
								<div className="container-fluid shiftSettingForm col-lg-12">
									<div className="row">
										<div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 container-fluid">							
											<div className="row">
												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">							
													<div className="form-group valid_box" >
									          			<label className="pghdr">Category<span className="asterix">*</span></label>
									          			  <div className="input-group inputBox-main nameParts" id="Category">
									             			<div className="input-group-addon inputIcon"><i className="fa fa-graduation-cap "></i></div>
													     	<input type="text" value={this.state.Category} placeholder="Enter Here" name="Category"  ref="Category"  data-text="Category" className="form-control inputBox nameParts" onChange={this.handleChange.bind(this)}  required/>
									          	 		</div>
									          	 		 <div className="errorMsg">{this.state.errors.Category}</div>
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
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						
				    			<h3 className="pageSubHeader">Category Details</h3>
				    		
							</div>
							<table id="table-to-xls" className="table table-bordered table-hover table-responsive table-striped valign">
								<thead>
									<tr> 
										<th className="col-lg-2 text-center "> Sr. </th> 
										<th className="text-center"> Category </th> 
										<th className="col-lg-2 text-center"> Action </th>
									</tr>
								</thead>
								<tbody>
									
									
							</tbody>
												
										</table>
									
						          {/*  { 
						            	this.state.data && this.state.data.length>0 ? 
							                <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
							                  <ul className="pagination paginationOES">
							                      {this.state.paginationArray}
							                  </ul>
							                </div>
							              :
							                null
						            }*/}
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

export default Category;

