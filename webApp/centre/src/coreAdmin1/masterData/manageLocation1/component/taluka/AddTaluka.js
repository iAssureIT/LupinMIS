import React, { Component } 	from 'react';
/*import { render } 				from 'react-dom';
import {withTracker} 			from 'meteor/react-meteor-data';

import ReactTable               from "react-table";

import {District} 				from '/imports/coreAdmin/masterData/manageLocation/components/District/component/District.js';
import {Countries} 				from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/Countries.js';
import {State} 					from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';
import {Taluka} 				from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/Taluka.js';
*/
import $ from 'jquery'
import Form 					from 'react-validation/build/form';
import axios from 'axios';

/*import TalukaBulkupload 		from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/TalukaBulkupload.jsx';
import Addtalukadatalist 		from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/Addtalukadatalist.jsx';
*/
import './AddTaluka.css';

class AddTaluka extends Component{

	constructor(props){
		super(props);

		this.state = {
			country    		: [],
			countryStored 	: [],
			states 	   		: [],
			statesStored   	: [],
			district 	   	: [],
			districtStored 	: [],
			data 			: [],
			countryval 		: '',
			stateval   		: '',
			districtval   	: '',
			blockloctn      : '',
			talukaval   	: '',
			talukaId 		: '',
			options	    	: 'manual',
		}
		this.handleChange = this.handleChange.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeState = this.changeState.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
	}

	componentDidMount(){
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
	    $("#talukaForm").validate({
	      rules: {
	        blockloctn: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	valueNotEquals: "-Select-"
	        },
	        districtval:{
	        	valueNotEquals: "-Select-"
	        }

	      },
	      
	    });

	    //Spinner Effect

	    $(document).ready(function() {
		  $('.btn').on('click', function() {
		    var $this = $(this);
		    // var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
		    if ($(this).html() !== loadingText) {
		      $this.data('original-text', $(this).html());
		      $this.html(loadingText);
		    }
		    setTimeout(function() {
		      $this.html($this.data('original-text'));
		    }, 2000);
		  });
		})
*/

	}
	
    changeCountry = (event)=>{
    	var countryval = $('.countrySelected').val();

    	var statesData = this.props.post2;
    	var newArr = [];
    	for(var i=0; i<statesData.length; i++){
    		if(statesData[i].countryName == countryval){
    			newArr.push(statesData[i]);
    		}
    	}
    	this.setState({
    		states : newArr,
    		countryval:countryval
    	})
    }

        changeState = (event)=>{
    	var stateval = $('.stateSelected').val();
    	var districtData = this.props.post1;
    	var newstateArr = [];
    	for(var i=0; i<districtData.length; i++){
    		if(districtData[i].stateName == stateval){
    			newstateArr.push(districtData[i]);
    		}
    	}

		this.setState({
			district : newstateArr,
    		stateval : stateval

    	})
    	
    }

 
	componentWillReceiveProps(nextProps){
		var country 	= nextProps.post;
		var states 		= nextProps.post2;
		var district 	= nextProps.post1;
		// console.log("post33==");
		this.setState({
			country 		: country,
			states 			: states,
			district 		: district,
			countryStored 	: country,
			statesStored 	: states,
			districtStored 	: district,
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

	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploads').css({'display':'block'});	
	}

	talukaadd(event){
		  event.preventDefault();		 
		  	var talukavalues = {
		  		"country" 		: this.state.countryval,
			  	"state" 		: this.state.stateval,	
				"district" 		: this.state.districtval,
				"blockloctn" 	: this.state.blockloctn,
			
			}
			axios
          .post('http://jsonplaceholder.typicode.com/posts', { talukavalues })
          .then( (res)=>{
            console.log(res);
            if(res.status == 201){
              alert("Data inserted Successfully!")
              
            }
          })
          .catch(); 
          this.setState({
            countryval:"",
            stateval:"",
            districtval:"",
            blockloctn:"",
          })

				
			     /*if ($('#talukaForm').valid()) {
			      Meteor.call('addTaluka',talukavalues,
			            (error, result)=> { 
			                if (error) {
			                    swal(error.reason);
			                } 
			                else {
		                    	if(result == 'exist'){
		                         swal({
		                         	title: 'abc',
				                      text: "Taluka Already Added!",
				                      type: 'success',
				                      showCancelButton: false,
				                      confirmButtonColor: '#666',
				                      // timer: 4000,
				                      // cancelButtonColor:'#d33',
				                      confirmButtonText: 'Ok'
		                         });
		                    	}else{
		                    	 swal({
				                    title: 'abc',
				                      text: "Taluka Added Successfully!",
				                      type: 'success',
				                      showCancelButton: false,
				                      confirmButtonColor: '#666',
				                      // timer: 4000,
				                      // cancelButtonColor:'#d33',
				                      confirmButtonText: 'Ok'

				                	});
		                    	}
			                    
			                    this.setState({
			                    	countryval 		: '',
									stateval   		: '',
									districtval   	: '',
									blockloctn      : '',
									talukaId  		: ''
			                    })
			                }
			            }
			        );
			       }*/

	}

    updateTaluka(event){
	  event.preventDefault();
      var talukaId    = this.state.talukaId;
      var talukavalues = {
		  		"country" 		: this.state.countryval,
			  	"state" 		: this.state.stateval,	
				"district" 		: this.state.districtval,
				"blockloctn" 	: this.state.blockloctn,
			
			}
	 /*if ($('#talukaForm').valid()) {
      	Meteor.call('updateTaluka', talukaId, talukaval, talukavalues,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	if(result == 'exist'){
	                		swal({
	                			      title: 'abc',
				                      text: "Taluka Already Added!",
				                      type: 'success',
				                      showCancelButton: false,
				                      confirmButtonColor: '#666',
				                      // timer: 4000,
				                      // cancelButtonColor:'#d33',
				                      confirmButtonText: 'Ok'
	                		});
	                	}else{
	                    	
	                    	swal({
		                              title: 'abc',
				                      text: "Taluka Modified Successfully!",
				                      type: 'success',
				                      showCancelButton: false,
				                      confirmButtonColor: '#666',
				                      // timer: 4000,
				                      // cancelButtonColor:'#d33',
				                      confirmButtonText: 'Ok'
		                    });
	                    	
	                    	this.setState({
		                    	countryval 		: '',
								stateval   		: '',
								districtval   	: '',
								blockloctn      : '',
								talukaId  		: '',
								talukaval   	: '',
		                    })
		                }
                    }//the _id of new object if successful
                }

        );	
       }
*/
	}

	deleteTaluka(event){
	  event.preventDefault();
	  /*Meteor.call('deleteTaluka', event.currentTarget.id,
                function(error, result) { 
                    if(error) {
                        console.log ( error ); 
                    }else{
                    	swal({
	                title:'',
	                text: "Taluka Deleted successfully!",
	            });
                    	this.setState({

	                    	countryval 		: '',
							stateval   		: '',
							districtval   	: '',
							blockloctn      : '',
							talukaId  		: '',
							talukaval   	: '',

	                    })
					}
				});
	*/		}


	statesortup(){
  		
		$("#statesortup").css('display', 'none');
		$("#statesortdown").css('display', 'inline-block');
	
  		// console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.data.sort(function(a, b){
		  return a.stateName > b.stateName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	statesortdown(){
   		$("#statesortup").css('display', 'inline-block');
		$("#statesortdown").css('display', 'none');	
  		var sortedDesc =  this.state.data.sort(function(a, b){
		  return a.stateName > b.stateName;
		}).reverse();
		// console.log("sortedDesc=",sortedDesc);

		this.setState({
			data : sortedDesc,
		});
  	}

    countrysortup(){
  		$("#countrysortup").css('display', 'none');
		$("#countrysortdown").css('display', 'inline-block');	
		
		var sortedAsc =  this.state.data.sort(function(a, b){
		  return a.countryName > b.countryName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	countrysortdown(){
  		$("#countrysortup").css('display', 'inline-block');
		$("#countrysortdown").css('display', 'none');
			
  		var sortedDesc = this.state.data.sort(function(a, b){
		  return a.countryName > b.countryName;
		}).reverse();
			
		this.setState({
			data : sortedDesc,
		});
  	}
  	districtsortup(){
  		$("#districtsortup").css('display', 'none');
		$("#distrctsortdown").css('display', 'inline-block');	
		
		var sortedAsc =  this.state.data.sort(function(a, b){
		  return a.districtName > b.districtName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	distrctsortdown(){
  		$("#districtsortup").css('display', 'inline-block');
		$("#distrctsortdown").css('display', 'none');
			
  		var sortedDesc = this.state.data.sort(function(a, b){
		  return a.districtName > b.districtName;
		}).reverse();
			
		this.setState({
			data : sortedDesc,
		});
  	}

	handleChange(event){
	  const target = event.target;
	  
	  const name   = target.name;
	  this.setState({
	  	[name] : event.target.value,
	  });

	}

	editTaluka(event){
		event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploads').css({'display':'none'});
		this.setState({
			options : 'manual'
		}) 
		/*var talukaId = event.currentTarget.id;
		var talukadata = Taluka.findOne({"_id":talukaId});
		if(talukadata){
		    var country = Countries.find({}).fetch();
		    var dist = District.find({}).fetch();
		    var state = State.find({}).fetch();
			this.setState({
				country 		: country,
				states 			: state,
				district 		: dist,
                talukaval   	: talukadata.talukaName,
				countryval 		: talukadata.countryName,
				stateval   		: talukadata.stateName,
				districtval   	: talukadata.districtName,
				blockloctn   	: talukadata.blockloctn,
				talukaId   		: talukadata._id
			})

		}*/
	}

	uploadCSV(event){
        event.preventDefault();
        
        /*UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
				Meteor.call( 'CSVUploadtaluka', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){
                            swal({
                                position : 'top-right',
                                type     : 'success',
                                title    : 'Talukas Added Successfully',
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
		if(this.state.talukaId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit btn_mrg_taluka updateBTN" onClick={this.updateTaluka.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit btn_mrg_taluka btnSubmit" onClick={this.talukaadd.bind(this)}>Submit</button>
			)
		}
	}


	render(){
	
       return(
			<div className="">
				<div className=""  id="addcountrie">
			  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle">
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
						<span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Taluka</span>
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
			   		<Form id="talukaForm" >
        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterTalukaInput" id="addtaluka">	
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 talukaFormAlignment">
							<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
								 <label className="control-label " >Country<span className="asterix">*</span></label>
								<select onChange={this.changeCountry.bind(this)} title="This field is required" className="inputBox-main countrySelected  areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval}>

								    <option >-Select-</option>
								    <option >India</option>
								    <option >China</option>
								    
									{/*{this.props.post.map((data, index)=>{
                    					return(	
									        <option key={index}>{data.countryName}</option>		 
									    );
                					})}*/}
							    </select>

							</div>	
							<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
							    <label className="control-label " >State<span className="asterix">*</span></label>
							    <select onChange={this.changeState.bind(this)} title="This field is required" className="inputBox-main stateSelected  areaStaes form-control" ref="stateval" name="stateval" id="stateval" value={this.state.stateval}>

								    <option >-Select-</option>
								    <option >Maharastra</option>
								    <option >Madhya Pradesh</option>
								    
									   	{/*{this.state.states.map((data, index)=>{
                    						return(	
									       		<option key={index} >{data.stateName}</option>
									   						 
									     	);
                						})}*/}
							    </select>

							</div>
							<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
								<div className="form-group">
								    <label className="control-label " >District<span className="asterix">*</span></label>
								   	<select title="This field is required" className="inputBox-main distSelected  areaStaes form-control" ref="districtval" name="districtval" id="districtval" value={this.state.districtval} onChange={this.handleChange.bind(this)} >

									    <option >-Select-</option>
									    <option >Pune</option>
									    <option >Mumbai</option>
									    
										   	{/*{this.state.district.map((data, index)=>{
		                						return(	
										      
										      		<option key={index}>{data.districtName}</option>
										      
										 
										      	);
		            						})}*/}
								    </select>

								</div>	
							</div>
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								<div className="form-group valid_box">
								    <label className="formLabel control-label " >Block/Taluka<span className="asterix">*</span></label>
								    <input className="inputBox-main form-control areaStaes nameParts" title="This field is required" id="blockloctn" type="text" name="blockloctn" ref="blockloctn" value={this.state.blockloctn} onChange={this.handleChange.bind(this)} />
								</div>									
							</div>	

						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					    	{this.showBtn()}
						</div>
						</div>
						</Form>
						:
							<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 bulkUploadWrapper" >
								<div className="csvDLWrap">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
										<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
											<div className="csvIcon">
												<a href="/csv/taluka.csv" download>
													<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
												</a>
											</div>
										</div>
										<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
											<h4><b>Instructions</b></h4>
											<ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
												<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Taluka Data</b> into this system.</li>
												<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
												<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>					
											</ul>
										</div>

										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Talukas</b></span></div>
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
					{/*	{this.props.post3.length > 0 ? 
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reactTableWrap">
								<ReactTable data={locationArray} columns={headers} />
							</div>
						:
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
								<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
									<thead className="table-head">
										<tr className="tempTableHeader">
										<th className="umHeader srpadd"> Country </th>
										<th className="umHeader srpadd"> State </th>
										<th className="umHeader srpadd"> District </th>
										<th className="umHeader srpadd"> Taluka </th>
										<th className="umHeader srpadd"> Action </th>
										</tr>
									</thead>
									<tbody className="addRoleTbody">
										 <tr><td colSpan="8" className="noTempData">No Record Found!</td></tr>					
									</tbody>
								</table>
							</div>
				    	}*/}
						
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
							<table id="listOfUsersDwnld" className="display table table-bordered servicesTable" >
									<thead className="table-head tablebodyfix">
									<tr className="tempTableHeader">
										<th className="col-lg-2 umHeader tbl_color srpadd">  
											<span className="" >Country
												
											</span>
										</th>
										<th className="col-lg-2 umHeader tbl_color srpadd">  
											<span className="" >State{/*
											<span className="fa fa-caret-up custom  namesortup"  id="statesortup" onClick={this.statesortup.bind(this)} />
												<span className="fa fa-caret-down custom namesortdown" id="statesortdown" onClick={this.statesortdown.bind(this)} /> */}
											</span>
										</th>
										<th className="col-lg-2 umHeader tbl_color srpadd">  
											<span className="" >District{/*
												<span className="fa fa-caret-up custom  namesortup"  id="districtsortup" onClick={this.districtsortup.bind(this)} />
												<span className="fa fa-caret-down custom namesortdown" id="distrctsortdown" onClick={this.distrctsortdown.bind(this)} /> */}
											</span>
										</th>
										<th className="col-lg-2 umHeader  tbl_color srpadd">  
											<span className="" >Taluka
											</span>
										</th>
										
										<th className="col-lg-2 umHeader tbl_color srpadd"> Action   </th>
									</tr>
								</thead>
										  
									
											{/*{ this.props.post3
											?
												this.props.post3.length>0 
												? 
												

												<tbody className="noLRPad ">
														{this.props.post3.map( (talukadata,index)=>{
															return(
																<tr key={index} className="tablebodyfix">
																<td className="col-lg-2 txtcentr">{talukadata.countryName}</td>
																<td className="col-lg-2 txtcentr">{talukadata.stateName}</td>
																<td className="col-lg-2 txtcentr">{talukadata.districtName}</td>
																<td className="col-lg-2 txtcentr">{talukadata.blockloctn}</td>
																
																<td className="col-lg-2 txtcentr">
																				   	<div className=" resetIcon icn col-lg-12 col-md-12 " >
											                                              	<div id={talukadata._id} onClick={this.editTaluka.bind(this)}>
													                                              <div className="col-lg-1  iconUM">
													                                                <i className="fa fa-pencil color-edit" aria-hidden="true" title="Edit Profile" ></i>
													                                              </div>
												                                             <div className="">
													                                              <div className=" iconUM">
													                                                <i className="fa fa-trash color-trash" aria-hidden="true" title="Delete State "  data-toggle="modal" data-target={`#del-${talukadata._id}`}></i>
													                                              </div>
												                                             </div>
												                                            </div>
												                                         </div>			

																			<div className="modal fade " id={`del-${talukadata._id}`} role="dialog">
																	    	<div className="modal-dialog modal-md msgModalWrapper">
																	      		<div className="modal-content col-lg-8 col-lg-offset-2 msgModalContent">
																			        <div className="modal-header mdh msgModalHeader row">
																			       	</div>
																			          	<div className="modal-body mb deleteMsg">
																			          		<p className="paracenter"><b>The Taluka will be deleted. <br></br> Are you sure you want to continue?</b></p>
																			        	</div>
																				        
																				        <div className="modal-footer modDelFooter">
																				        	<button type="button" data-dismiss="modal" className="btn btn-success btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right">No</button>
																				          	<button  onClick={this.deleteTaluka.bind(this)} id={talukadata._id} type="button" data-dismiss="modal" className="btn deleteBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-left" >Yes</button>

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
													<td colSpan="9" className="ntdiaplay displayblck"></td>
													
											:
											<tbody>
												<td colSpan="9" >

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
export default AddTaluka

