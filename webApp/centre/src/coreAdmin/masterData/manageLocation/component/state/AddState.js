import React, { Component } 	from 'react';
import $ 						from 'jquery';
import Form 					from 'react-validation/build/form';
import axios 					from 'axios';

import './AddState.css';

class AddState extends Component{

	constructor(props){
		super(props);
		this.state = {
			"country"    		: [],
			"states" 	  		: [],
			"data" 	   			: [],
			"countryval" 		: '',
			"stateval"   		: '',
			"toggleUploadBtn"	: 'Bulk Upload',
			"stateId"    		: '',
			"options"	    	: 'manual',
			"fields"            : {},
      		"errors"            : {}
		}
		this.handleInputChange  = this.handleInputChange.bind(this);
	}


	componentWillReceiveProps(nextProps){
		var country = nextProps.post;
		var states = nextProps.post2;
		
		this.setState({
			country 		: country,
			states 			: states,
			data 			: nextProps.post3,
		});

	}

	handleInputChange(event) {
	    const target = event.target;
	    // const value = target.type === 'radio' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });

	}

	componentDidMount() {
		axios
          .get('http://jsonplaceholder.typicode.com/posts')
          .then(
               (res)=>{
          console.log(res);
          const postsdata = res.data;
          this.setState({
            allBankDetails : postsdata,
             });
           }
          )
          .catch();
    	

		/*$("html,body").scrollTop(0); 
		$.validator.addMethod("regx1", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain letters.");
	    $.validator.addMethod("valueNotEquals", function(value, element, arg){
	        return arg !== value;
	    }, "Value must not equal arg.");
	    
	       
	    jQuery.validator.setDefaults({
	      debug: true,
	      success: "valid"
	    });
	    $("#stateForm").validate({
	      rules: {
	        stateval: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+ )*$/,
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        }
	      },
	      
	    });
*/
	 //     //Spinner Effect
	 //    $(document).ready(function() {
		//   $('.btn').on('click', function() {
		//     var $this = $(this);
		//     var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
		//     if ($(this).html() !== loadingText) {
		//       $this.data('original-text', $(this).html());
		//       $this.html(loadingText);
		//     }
		//     setTimeout(function() {
		//       $this.html($this.data('original-text'));
		//     }, 2000);
		//   });
		// })

	  //   	$(function() {
			//     $(window).on("scroll", function() {
			//     	console.log('$(window).scrollTop()',$(window).scrollTop());
			//         if($(window).scrollTop() > 400) {
			//             $(".header1").addClass("activ");
			//             $(".srpaddOne").addClass("newClassActivestate");
			//             $(".srpaddTwo").addClass("newClassActiveTwostate");
			//             $(".srpaddThree").addClass("newClassActiveThreestate");
			//             $(".CountryOne").addClass("NewCountryCss");


			//         } else {
			//             //remove the background property so it comes transparent again (defined in your css)
			//            $(".header1").removeClass("activ");
			//            $(".srpaddOne").removeClass("newClassActivestate");
			//             $(".srpaddTwo").removeClass("newClassActiveTwostate");
			//             $(".srpaddThree").removeClass("newClassActiveThreestate");
			//             $(".CountryOne").removeClass("NewCountryCss");
			//         }
			//     });
			// });

  	}
  	handleChange(event){
	    event.preventDefault();
	    this.setState({
	    "countryval"    : this.refs.countryval.value, 
	    "stateval"   	: this.refs.stateval.value,
	    })
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
	      console.log("errors",errors)
	    }
  	}
	validateForm() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		
		if (typeof fields["stateval"] !== "undefined") {
			if (fields["stateval"].length < 2){
			formIsValid = false;
			errors["stateval"] = "Please enter valid state name.";
			}
		}
		this.setState({
		errors: errors
		});
		return formIsValid;
	}

	validateFormReq() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		if (!fields["stateval"]) {
		  formIsValid = false;
		  errors["stateval"] = "This field is required.";
		}
		if (!fields["countryval"]) {
		  formIsValid = false;
		  errors["countryval"] = "This field is required.";
		}

		this.setState({
		  errors: errors
		});
		return formIsValid;
	}

	Stateadd(event){
	  event.preventDefault();		 
	  	var stateValues = {
	  		"country" 		: this.state.countryval,
			"state" 		: this.state.stateval,	
		}
		if (this.validateFormReq() && this.validateForm())
		{
			axios
			.post('http://jsonplaceholder.typicode.com/posts', { stateValues })
			.then( (res)=>{
			console.log(res);
			if(res.status == 201){
			  alert("Data inserted Successfully!")
			}
			})
			.catch(); 
			let fields = {};
      		fields["countryval"] = "";
      		fields["stateval"] = "";
      
			this.setState({
				countryval:"",
				stateval:"",
				fields:fields
			})
		}		
	}
		// ================ Pagination ==============
	 paginationUMFunction(){
    	/*var roleSetArray      = [];
      	var roleSetVar        = Session.get('roleSet');
      	var activeBlockSetVar = Session.get('activeBlockSet');
     	Meteor.call("getCountFunction",roleSetVar,activeBlockSetVar,(err,res)=>{
        if(err){}else{
          this.setState({
            questionMasterDataCount : res,
          });
          if(res){
            var paginationNum = parseInt(this.state.questionMasterDataCount)/this.state.dataRange;
          // console.log("pagination Number=",paginationNum);
            var pageCount = Math.ceil(paginationNum);
          // console.log("pageCount=",pageCount);


            Session.set("questionUMCount",pageCount);
           var paginationArray = [];
            for (var i=1; i<=pageCount;i++){
              var countNum = this.state.dataRange * i;
              paginationArray.push(
                <li key={i} className="page-item"><a className={"page-link pagination"+i} id={countNum} onClick={this.getQuestionStartEndNum.bind(this)}>{i}</a></li>
              );
            }
            paginationArray.push(
              <li  key={-2} className="page-item"><a className="page-link liNext" onClick={this.nextPage.bind(this)}>next</a></li>
            );
            if(pageCount<=i){
              this.setState({
                paginationArray : paginationArray,
              })
            } 
          }
        }

      });*/
  }

  getQuestionStartEndNum(event){
    var limitRange = $(event.target).attr('id');
    /*limitRange     = parseInt(limitRange);
    var startRange = limitRange - this.state.dataRange;
    $('.page-link').removeClass('active');
    var counter = $(event.target).text();
    Session.set('pageUMNumber',counter);

    $(".liNext").css("cursor","pointer");
      if(Session.get("questionUMCount")==counter){
      $(".liNext").css("cursor","not-allowed");
    }
    this.setState({
      startRange : startRange,
      counter    : counter,
    },()=>{this.usersListData()});
    */  
  }

  nextPage(event){
    var counter = this.state.counter;
    counter++;
    /*var questionCount = Session.get("questionUMCount");

    if(questionCount>=counter){
      Session.set('pageUMNumber',counter);
      $('.page-link').removeClass('active');
      $(".pagination"+counter).addClass("active");

      var limitRange = $('.active').attr('id');
      var startRange =  parseInt(limitRange)- this.state.dataRange;
      this.setState({
        counter    : counter,
        startRange : startRange,
      },()=>{this.usersListData()});
    }else if(questionCount==counter){
      $(".liNext").css("cursor","not-allowed");
      this.usersListData()
    }*/
  }

  componentDidUpdate(){
    $('.pagination'+this.state.counter).addClass("active");
    //Session.set('pageUMNumber',this.state.counter);
    // if(Session.get("usermanagementcount"))
  }


  	countrysortup(){
  		$("#countrysortup").css('display', 'none');
		$("#countrysortdown").css('display', 'inline-block');	
		
		var sortedAsc =  this.props.post2.sort(function(a, b){
		  return a.countryName > b.countryName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	countrysortdown(){
  		$("#countrysortup").css('display', 'inline-block');
		$("#countrysortdown").css('display', 'none');
			
  		var sortedDesc = this.props.post2.sort(function(a, b){
		  return a.countryName > b.countryName;
		}).reverse();
			// var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
		// console.log("sortedDesc=",sortedDesc);
		this.setState({
			data : sortedDesc,
		});
  	}
  	statesortup(){
  		$("#statesortup").css('display', 'none');
		$("#statesortdown").css('display', 'inline-block');	
		
		var sortedAsc =  this.props.post2.sort(function(a, b){
		  return a.stateName > b.stateName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	statesortdown(){
  		$("#statesortup").css('display', 'inline-block');
		$("#statesortdown").css('display', 'none');
			
  		var sortedDesc = this.props.post2.sort(function(a, b){
		  return a.stateName > b.stateName;
		}).reverse();
			// var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
		// console.log("sortedDesc=",sortedDesc);
		this.setState({
			data : sortedDesc,
		});
  	}

	updateState(event){
	  event.preventDefault();
      var stateId    = this.state.stateId;
      var stateValues = {
		  		"country" 		: this.state.countryval,
				"state" 		: this.state.stateval,	
			
			}
	  /*if ($('#stateForm').valid()) {
      Meteor.call('updateStates', stateId, stateValues,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	swal({
		                              title: 'abc',
				                      text: "State Modified Successfully!",
				                      type: 'success',
				                      showCancelButton: false,
				                      confirmButtonColor: '#666',
				                      // timer: 4000,
				                      // cancelButtonColor:'#d33',
				                      confirmButtonText: 'Ok'
		                    });
                    	this.setState({
      						countryval : '',
							stateval   : '',
							stateId    : ''
      					})
                    }//the _id of new object if successful
                }

// 
        );	
  	}*/

	}

	delState(event){
	  event.preventDefault();
	  /*Meteor.call('deleteStates', event.currentTarget.id,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    }else{
                    	
		                this.setState({
	      						countryval : '',
								stateval   : '',
								stateId    : ''
	      					})
                    }
                    
                });	

*/	}


	editState(event){
		event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploads').css({'display':'none'});	
		this.setState({
				options : 'manual'
		}) 
		var stateId = event.currentTarget.id;
		/*var statedata = State.findOne({"_id":stateId});
		if(statedata){
			this.setState({
				countryval 		: statedata.countryName,
				stateval   		: statedata.stateName,
				stateId   		: statedata._id
			})
		}*/
	}


	uploadCSV(event){
        event.preventDefault();
        
        /*UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
		    	Meteor.call( 'CSVUploadstate', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){
                            swal({
                                position : 'top-right',
                                type     : 'success',
                                title    : '',
                                text     : 'States Added Successfully!',
                                showConfirmButton : false,
                                timer    : 1500
                            });
                            $('#addcountrie' ).css({'display':'block'});
							$('#bulkuploads').css({'display':'none'});	
    
                            $(".uploadFileInput").val('');
                            setTimeout(()=>{ 
                                
                                UserSession.delete("allProgressbarSession", Meteor.userId());
                                UserSession.delete("progressbarSession", Meteor.userId());
                            }, 8000);
                    	}else{
	                            swal({
                                position 		  : 'top-right',
                                type     		  : 'warning',
                                title    		  : 'Nothing to upload.',
                                showConfirmButton : true,
                                
                            }); 
                            $('#addcountrie' ).css({'display':'block'});
							$('#bulkuploads').css({'display':'none'});	                      		
                        }       
         			}
      			});

		    }
        });*/
    }

	showBtn(){
		if(this.state.stateId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit  bt-mr state_btn updateBTN" onClick={this.updateState.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit bt-mr  state_btn" onClick={this.Stateadd.bind(this)}>Submit</button>
			)
		}
	}


	// Bulkuploadform(event){
 //    	// event.preventDefault();
	// 	$('#addcountrie' ).css({'display':'none'});
	// 	$('#bulkuploads').css({'display':'block'});	
	// }

   
	render(){
		
/*
		var headers = [
						{Header:"Country",accessor: 'countryName'},
						{Header:"State",accessor: 'stateName'},
						{Header: "Action", accessor: 'Action',sortable: false},
						
					  ];*/

		var locationArray = [];
/*		this.props.post2.map( (locationdata)=>{
			locationArray.push({
				"countryName"    : locationdata.countryName,
				"stateName"      : locationdata.stateName,
				"Action"  		 : <div><button className="fa fa-pencil-square-o btn btn-default" id={locationdata._id} onClick={this.editState.bind(this)} ></button>

									&nbsp;&nbsp;
									
									<button className= "fa fa-trash btn btn-danger" data-toggle="modal" data-target={`#del-${locationdata._id}`}></button>

									 <div className="modal fade" id={`del-${locationdata._id}`} role="dialog">
									    <div className="modal-dialog modal-md modDelWrapper">
									      <div className="modal-content col-lg-12 modDelContent">
									        <div className="modal-header modDelHeader">
									          <button type="button" className="modDelClose pull-right" data-dismiss="modal">&times;</button>
									        </div>
									        <div className="modal-body deleteMsg">
									          <p><b>The State will be deleted. Are you sure you want to continue?</b></p>
									        </div>
									        <div className="modal-footer modDelFooter">
									         <button type="button" data-dismiss="modal" className="btn btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 ">Cancel</button>
									          <button  onClick={this.delState.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn updateBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" >OK</button>
							    			 
									        </div>
									      </div>
									    </div>
									  </div></div>
			});
		});*/
       return(
			<div className="">
				<div className=""  id="addcountrie">
			  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle">
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
						<span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add State</span>
					</div>

					<div className="switchField col-lg-6 col-md-6 col-sm-12 col-xs-12">
						<div className="pull-right">
					      	<input type="radio" id="switch_left" name="options" value="manual" checked={this.state.options === 'manual'} onChange={this.handleInputChange.bind(this)} />
					      	<label htmlFor="switch_left">Manual</label>
					      	<input type="radio" id="switch_right" name="options" value="auto" checked={this.state.options === 'auto'} onChange={this.handleInputChange.bind(this)} />
					      	<label htmlFor="switch_right">Auto</label>
					    </div>
					</div>
				</div>
				<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12"><div className="marginBottom"></div></div>
				{this.state.options == 'manual' ?	
       			<Form id="stateForm">	
	        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterStateWrapper" id="addState">
						{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">*/}
						<div className="">
							{/*<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">*/}
								<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 valid_box">
									<div className="form-group">
										<div className="form-group">
										    <label className="control-label " >Country<span className="asterix">*</span></label>
										   	<select className="areaStaes form-control  selectcountryinstate inputBox-main" 
										   	title="This field is required" value={this.state.countryval} 
										   	onChange= {this.handleChange.bind(this)} name="countryval" 
										   	ref="countryval" id="countryval" >
											    <option >-Select-</option>
											    <option >India</option>
											    <option >America</option>
											    
												{/*{this.props.post.map((data, index)=>{
				                					return(	
												      
												    	<option key={index}>{data.countryName}</option>
												 		
												      );
				            					})}*/}
										    </select>
										<div className="errorMsg">{this.state.errors.countryval}</div>
									   </div>
									</div>
								</div>
								<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 valid_box pdcls">
									<div className="form-group">
                      					<div className="form-group">
										    <label className="formLabel control-label " >State<span className="asterix">*</span></label>
										    <input className="form-control inputBox-main  areaStaes nameParts" 
										    title="This field is required" id="stateval" ref="stateval" type="text" name="stateval" 
										    value={this.state.stateval} onChange={this.handleChange.bind(this)} />
										    <div className="errorMsg">{this.state.errors.stateval}</div>

										</div>
									</div>
								</div>
							{/*</div>*/}
						 {/* </div>*/}	
						{/*</div>*/}
						<div className="state_btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    {this.showBtn()}
						</div>
					</div>
				</div>
				</Form>
				:

					
					<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
						<div className="csvDLWrap">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm1">
								<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage ">
									<div className="">
			                            <a >
			                              <img src="/images/csv_upload.png"  className="csvimg" title="Click to download file"/>
			                            </a>
			                        </div>
								</div>
								<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
									<h4><b>Instructions</b></h4>
									<ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
										<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>State Data</b> into this system.</li>
										<li><b>2)</b> File Format must be *.CSV.</li>
										<li><b>3)</b> Following is the format of .CSV file.</li>
															
									</ul>
								</div>
								<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload States</b></span></div>
								<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
									<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
										<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput nameParts" required/>
									</div>
								</div>
							</div>
						</div>
			 	 	</div>	
						
				}
				</div>
										
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
										<table id="listOfUsersDwnld" className="display table table-bordered servicesTable" >
												<thead className="table-head tablebodyfix">
												<tr className="tempTableHeader ">
													<th className="col-lg-5 umHeader tbl_color srpadd ">  
														<span className="" >Country{/*
															<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />  */} 
														</span>
													</th>
													<th className="col-lg-5 umHeader tbl_color srpadd ">  
														<span className="" >State
														{/*	<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.statesortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.statesortdown.bind(this)} /> 
														*/}</span>
													</th>
													
													<th className="col-lg-2 umHeader tbl_color srpadd "> Action   </th>
												</tr>
											</thead>
										  
									
											{/*{ this.props.post2
											?
												this.props.post2.length>0 
												? 
												

												<tbody className="noLRPad ">
														{this.props.post2.map( (locationdata,index)=>{
															return(
																<tr key={index} className="tablebodyfix">
																<td className="col-lg-5 txtcentr">{locationdata.countryName}</td>
																<td className="col-lg-5 txtcentr">{locationdata.stateName}</td>
																
																<td className="col-lg-2 txtcentr">
																   	<div className=" dropdown">
																	<div className=" resetIcon icn col-lg-12 col-md-12 " >
											                                              	<div id={locationdata._id} onClick={this.editState.bind(this)}>
													                                              <div className="col-lg-1  iconUM">
													                                                <i className="fa fa-pencil color-edit" aria-hidden="true" title="Edit Profile" ></i>
													                                              </div>
												                                             <div className="">
													                                              <div className=" iconUM">
													                                                <i className="fa fa-trash color-trash" aria-hidden="true" title="Delete State "  data-toggle="modal" data-target={`#del-${locationdata._id}`}></i>
													                                              </div>
												                                             </div>
												                                            </div>
												                                         </div>			
																			<div className="modal fade " id={`del-${locationdata._id}`} role="dialog">

																	    	<div className="modal-dialog modal-md msgModalWrapper">
																	      		<div className="modal-content col-lg-8 col-lg-offset-2 msgModalContent">
																			        <div className="modal-header mdh msgModalHeader row">
																			       	</div>
																			       	
																			          	<div className="modal-body mb deleteMsg">
																			          		<p className="paracenter"><b>The State will be deleted. <br></br> Are you sure you want to continue?</b></p>
																			        	</div>
																				        
																				        <div className="modal-footer msgModalfooter">
																				        	<button type="button" data-dismiss="modal" className="btn btn-success btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right">No</button>
																				          	<button  onClick={this.delState.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn deleteBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-left" >Yes</button>

																				        </div>
																		      		</div>
																		      		
																	    	</div>
																  		</div>
																	</div>
																   	</td>
																</tr>
																)
														})}
														
												</tbody>
												:
													<td colSpan="9" className="ntdiaplay displayblck">Nothing to display.</td>
													
											:
											<tbody>
												<td colSpan="9" >
													<div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/SRESloader.gif" className="loaderimgcent" alt="loading"/></div>

												</td>
											</tbody>
											
											}*/}

										</table>
									
						            { 
						            	this.state.data && this.state.data.length>0 ? 
							                <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
							                  <ul className="pagination paginationOES">
							                      {this.state.paginationArray}
							                  </ul>
							                </div>
							              :
							                null
						            }
									</div>

				</div>
			
		
	    );
	} 
}

export default AddState

