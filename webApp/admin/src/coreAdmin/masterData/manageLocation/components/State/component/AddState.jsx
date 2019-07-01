import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import {withTracker} 			from 'meteor/react-meteor-data'

import ReactTable from "react-table";
import {Countries} 				from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/Countries.js';
import {State} 					from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';

import StateBulkupload 			from '/imports/coreAdmin/masterData/manageLocation/components/State/component/StateBulkupload.jsx';
import Addstatelistdata 		from '/imports/coreAdmin/masterData/manageLocation/components/State/component/Addstatelistdata.jsx';
import Form from 'react-validation/build/form';

class AddState extends Component{

	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			country    : [],
			states 	   : [],
			data 	   : [],
			countryval : '',
			stateval   : '',
			toggleUploadBtn: 'Bulk Upload',
			stateId    : '',
			options	    	: 'manual',
			
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

		$("html,body").scrollTop(0); 
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

	     //Spinner Effect
	    $(document).ready(function() {
		  $('.btn').on('click', function() {
		    var $this = $(this);
		    var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
		    if ($(this).html() !== loadingText) {
		      $this.data('original-text', $(this).html());
		      $this.html(loadingText);
		    }
		    setTimeout(function() {
		      $this.html($this.data('original-text'));
		    }, 2000);
		  });
		})

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


	Stateadd(event){
		  event.preventDefault();		 
		  	var stateValues = {
		  		"country" 		: this.state.countryval,
				"state" 		: this.state.stateval,	
			
			}		
	     
	      if ($('#stateForm').valid()) {
	      Meteor.call('addStates',stateValues,
	                (error, result)=> { 
	                    if (error) {
	                      
	                        swal(error.reason);
	                    } 
	                    else {
	                    	if(result == 'exist'){
	                    		swal({
	                    			title: 'abc',
	                    			text:"State Already Added!",
	                    		});
	                    	}else{
	                        	swal({
				                title: 'abc',
				                text: "State Added successfully!",
				                type: 'success',
				                showCancelButton: false,
				                confirmButtonColor: '#666',
				                confirmButtonText: 'Ok'});
	                        }

	      					this.setState({
	      						countryval : '',
								stateval   : '',
								stateId    : ''
	      					})
	                    }
	                }
	        );
	      }

	}
		// ================ Pagination ==============
	 paginationUMFunction(){
    var roleSetArray      = [];
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

      });
  }

  getQuestionStartEndNum(event){
    var limitRange = $(event.target).attr('id');
    limitRange     = parseInt(limitRange);
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
      
  }

  nextPage(event){
    var counter = this.state.counter;
    counter++;
    var questionCount = Session.get("questionUMCount");

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
    }
  }

  componentDidUpdate(){
    $('.pagination'+this.state.counter).addClass("active");
    Session.set('pageUMNumber',this.state.counter);
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
	  if ($('#stateForm').valid()) {
      Meteor.call('updateStates', stateId, stateValues,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	swal({
		                title: 'abc',
		                text: "State Modified successfully!",
		                type: 'success',
		                showCancelButton: false,
		                confirmButtonColor: '#666',
		                confirmButtonText: 'Ok'});
                    	this.setState({
      						countryval : '',
							stateval   : '',
							stateId    : ''
      					})
                    }//the _id of new object if successful
                }

// 
        );	
  	}

	}

	delState(event){
	  event.preventDefault();
	  Meteor.call('deleteStates', event.currentTarget.id,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    }else{
                    	swal({
		                title: 'abc',
		                text: "State Deleted successfully!",
		                type: 'success',
		                showCancelButton: false,
		                confirmButtonColor: '#666',
		                confirmButtonText: 'Ok'});
		                this.setState({
	      						countryval : '',
								stateval   : '',
								stateId    : ''
	      					})
                    }
                    
                });	

	}

	handleChange(event){
	  const target = event.target;
	  
	  const name   = target.name;
	  this.setState({
	  	[name] : event.target.value,
	  });	
	}

	editState(event){
		event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploads').css({'display':'none'});	
		this.setState({
				options : 'manual'
		}) 
		var stateId = event.currentTarget.id;
		var statedata = State.findOne({"_id":stateId});
		if(statedata){
			this.setState({
				countryval 		: statedata.countryName,
				stateval   		: statedata.stateName,
				stateId   		: statedata._id
			})
		}
	}


	uploadCSV(event){
        event.preventDefault();
        
        UserSession.delete("progressbarSession", Meteor.userId());
        
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
                                title    : 'abc',
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
        });
    }

	showBtn(){
		if(this.state.stateId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit updateBTN" onClick={this.updateState.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btnSubmit" onClick={this.Stateadd.bind(this)}>Submit</button>
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
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLocs">
						<span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add State</span>
					</div>
					{/*<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 bulkUploadBtn">
						<button type="submit" className="fa fa-upload btn btnBulk pull-right col-lg-4 col-md-4 col-sm-12 col-xs-12" onClick={this.Bulkuploadform.bind(this)} > Bulk Upload</button>
					</div>*/}

					<div className="switchField col-lg-6 col-md-6 col-sm-12 col-xs-12">
						<div className="pull-right">
					      	<input type="radio" id="switch_left" name="options" value="manual" checked={this.state.options === 'manual'} onChange={this.handleInputChange.bind(this)} />
					      	<label htmlFor="switch_left">Manual</label>
					      	<input type="radio" id="switch_right" name="options" value="auto" checked={this.state.options === 'auto'} onChange={this.handleInputChange.bind(this)} />
					      	<label htmlFor="switch_right">Auto</label>
					    </div>
					</div>
				</div>
				<div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
				{this.state.options == 'manual' ?	
       			<Form id="stateForm" className="">	
	        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterStateWrapper" id="addState">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
							<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
								<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 formht">
									<div className="form-group">
									    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >Country<span className="astrick">*</span></label>
									   	<select className="col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control  selectcountryinstate" title="Please select country." value={this.state.countryval} onChange= {this.handleChange.bind(this)} name="countryval" ref="countryval" id="countryval" >
										    <option >-Select-</option>
										    
											{this.props.post.map((data, index)=>{
			                					return(	
											      
											    	<option key={index}>{data.countryName}</option>
											      
											 		
											      );
			            					})}
									    </select>
									</div>	
								</div>
								<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 formht pdcls">
									<div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										    <label className="formLabel control-label" >State<span className="astrick">*</span></label>
										    <input className="form-control inputBox-main  areaStaes" title="Please enter valid State." id="stateval" type="text" name="stateval" value={this.state.stateval} onChange={this.handleChange.bind(this)} />
										</div>
									</div>
								</div>
							</div>	
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    {this.showBtn()}
						</div>
					</div>
				</Form>
				:

					
					<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
						<div className="csvDLWrap">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
								<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage ">
									<div className="csvIcon">
										<a href="/csv/state.csv" download>
											<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
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
										<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
									</div>
								</div>
							</div>
						</div>
			 	 	</div>	
						
				}
				</div>
										
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
										<table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
												<thead className="table-head tablebodyfix">
												<tr className="tempTableHeader ">
													<th className="umHeader srpadd ">  
														<span className="" >Country{/*
															<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />  */} 
														</span>
													</th>
													<th className="umHeader srpadd ">  
														<span className="" >State
														{/*	<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.statesortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.statesortdown.bind(this)} /> 
														*/}</span>
													</th>
													
													<th className="umHeader srpadd "> Action   </th>
												</tr>
											</thead>
										  
									
											{ this.props.post2
											?
												this.props.post2.length>0 
												? 
												

												<tbody className="noLRPad tableheaderfix">
														{this.props.post2.map( (locationdata,index)=>{
															return(
																<tr key={index} className="tablebodyfix">
																<td className="txtcentr">{locationdata.countryName}</td>
																<td className="txtcentr">{locationdata.stateName}</td>
																
																<td className="txtcentr">
																   	<div className=" dropdown">
																			<div className="">
																				<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																			</div>

																			<div className="dropdown-content  drpdwnpd">
																			
																				<ul className="pdcls ulbtm">
																				
																				   <li>
																						<div className=" resetIcon col-lg-12 col-md-12 " id={locationdata._id} onClick={this.editState.bind(this)}>
																					   		<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
																					    		<i className="fa fa-pencil" aria-hidden="true" title="Edit State" ></i>
																					    	</div>
																					    	<div className="aligntxtUM">
																					    		Edit State
																					    	</div>
																				    	</div>

																				    </li>
																				    <li>
																						<div className=" resetIcon col-lg-12 col-md-12" data-toggle="modal" data-target={`#del-${locationdata._id}`}>
																							<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
																					   			<i className="fa fa-trash" aria-hidden="true" title="Delete State " ></i>
																					   				</div>
																					    	<div className="aligntxtUM">
																					    	
																					   			Delete State
																					    	</div>
																				    	</div>
														
																				    </li>
																			    </ul>
																			</div>
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
													{/*<td colSpan="9" className="ntdiaplay">Nothing to display.</td>*/}
													<div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/SRESloader.gif" className="loaderimgcent" alt="loading"/></div>

												</td>
											</tbody>
											
											}

										</table>
									
						            { 
						            	this.props.post2 && this.props.post2.length>0 ? 
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

export default AddStateexp = withTracker((props)=>{
 	
    const postHandle = Meteor.subscribe('countriesdata');
    const post       = Countries.find({}).fetch()||[];
    const loading    = !postHandle.ready();

 	const postHandle2 = Meteor.subscribe('statedata');
    const post2       = State.find({},{sort: {createdAt: -1}}).fetch()||[];
    const loading2    = !postHandle2.ready();
  
    return {
      loading,
      post,
      
     loading2,
      post2,
    };
})(AddState);

