import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import { withTracker } 			from 'meteor/react-meteor-data';

import ReactTable               from "react-table";
import swal from 'sweetalert';
import InputMask                 from 'react-input-mask';

import Form from 'react-validation/build/form';
import AddCountriesFunc 		from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/AddCountries.jsx';
import AddDistrictFunc 			from '/imports/coreAdmin/masterData/manageLocation/components/District/component/AddDistrict.jsx';
import AddStateFunc 			from '/imports/coreAdmin/masterData/manageLocation/components/State/component/AddState.jsx';
import AddTalukaFunc 			from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/AddTaluka.jsx';

import {State} 					from '/imports/coreAdmin/masterData/manageLocation/components/State/component/state.js';
import {Countries} 				from '/imports/coreAdmin/masterData/manageLocation/components/Country/component/Countries.js';
import {District} 				from '/imports/coreAdmin/masterData/manageLocation/components/District/component/District.js';
import {Location} 				from '/imports/coreAdmin/masterData/manageLocation/components/location/component/Location.js';
import {Taluka} 				from '/imports/coreAdmin/masterData/manageLocation/components/Taluka/component/Taluka.js';

import LocationBulkupload 		from '/imports/coreAdmin/masterData/manageLocation/components/location/component/LocationBulkupload.jsx';
import Addlocationdatalist 		from '/imports/coreAdmin/masterData/manageLocation/components/location/component/Addlocationdatalist.jsx';



class AddLocations extends Component{

	constructor(props){
		super(props);

		this.state = {
			country    		: [],
			countryStored 	: [],
			states 	   		: [],
			statesStored   	: [],
			district 	   	: [],
			districtStored 	: [],
			taluka 	  	 	: [],
			talukaStored 	: [],

			data 			: [],
			countryval 		: '',
			stateval   		: '',
			districtval   	: '',
			talukaval   	: '',
			Village 		: '',
			pincode 		: '',
			locationId      : '',
			options	    	: 'manual',
		}
		this.changeCountry		= this.changeCountry.bind(this);
		this.changeState 		= this.changeState.bind(this);
		this.changeDist 		= this.changeDist.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
	}

	componentDidMount(){
		$("html,body").scrollTop(0); 
	    $.validator.addMethod("regx1", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain letters.");
	    $.validator.addMethod("regxpin", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "Please enter a valid pincode.");
	    $.validator.addMethod("valueNotEquals", function(value, element, arg){
	        return arg !== value;
	    }, "Value must not equal arg.");
	    
	       
	    jQuery.validator.setDefaults({
	      debug: true,
	      success: "valid"
	    });
	    $("#addareaform").validate({
	      rules: {
	        Village: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        pincode:{
	        	required:true,
	        	regxpin:/^[1-9][0-9]{5}$/
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	valueNotEquals: "-Select-"
	        },
	        districtval:{
	        	valueNotEquals: "-Select-"
	        },
	        talukaval:{
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

	}

	handleInputChange(event) {
	    const target = event.target;
	    // const value = target.type === 'radio' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });

	}


    componentWillReceiveProps(nextProps){
		var country = nextProps.post;
		var states = nextProps.post2;
		var district = nextProps.post1;
		var taluka = nextProps.post4;
		this.setState({
			country 		: country,
			states 			: states,
			district 		: district,
			taluka 			: taluka,
			countryStored 	: country,
			statesStored 	: states,
			districtStored 	: district,
			talukaStored 	: taluka,
			data 			: nextProps.post3,
		});

	}


	changeCountry = (event)=>{
    	var countryval = $('.countrySelected').val();

    	var statesData = this.state.statesStored;
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
    	var districtData = this.state.districtStored;
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

    changeDist(event){
    	var districtval = $('#districtval').val();
    	var talukaData = this.state.talukaStored;
    	var newdistArr = [];
    	for(var i=0; i<talukaData.length; i++){
    		if(talukaData[i].districtName == districtval){
    			newdistArr.push(talukaData[i]);
    		}
    	}

		this.setState({
			taluka 		: newdistArr,
    		districtval : event.target.value
    	})
    	
    }
  
	Bulkuploadlocation(event){
    	// event.preventDefault();
		$('#areaform' ).css({'display':'none'});
		$('#bulkuploadlocation').css({'display':'block'});	
	}

	addlocation(event){
		event.preventDefault();	
		
		if ($('#addareaform').valid()) {
			var locationValues = {
				"country" 		: this.state.countryval,
		  		"state" 		: this.state.stateval,
				"district" 		: this.state.districtval,
				"blockloctn" 	: this.state.talukaval,	
				"cityloctn" 	: this.state.Village,			
				"pincodeloctn" 	: this.state.pincode,			
			}		
		     
	      	Meteor.call('addLocation',locationValues,
	            (error, result)=> { 
	                if (error) {
	                    swal(error.reason);
	                } 
	                else {
	                	if(result == 'exist'){
	                		swal({

	                			customClass: ".swal-title",
	                			customClass: ".swal-text",
                            	customClass: ".swal-footer",
                            	customClass: "swal-button",
                            	title:'',
	                			text:"Location Already Added",

	                			});
	                	}else{
		                    swal({

		                    customClass: ".swal-title",
		                    customClass: ".swal-text",
                            customClass: ".swal-footer",
                            customClass: "swal-button",
			                title: '',
			                text: "Location Added successfully!",
			                // type: 'success',
			                showCancelButton: false,
			                confirmButtonColor: '#e60004',
			                confirmButtonText: 'Ok'});
		  					this.setState({
		  						countryval 		: '',
								stateval   		: '',
								districtval   	: '',
								talukaval   	: '',
								Village 		: '',
								pincode 		: '',
								locationId      : ''
		  					})
		  				}

	                }
	            }
	        );

		}


		}

	editRole(event){
	  event.preventDefault();
      var locationId    = this.state.locationId;
      var locationValues = {
			  		"country" 		: this.state.countryval,
			  		"state" 		: this.state.stateval,
					"district" 		: this.state.districtval,
					"blockloctn" 	: this.state.talukaval,	
					"cityloctn" 	: this.state.Village,			
					"pincodeloctn" 	: this.state.pincode,			
				}
	  if ($('#addareaform').valid()) {
	      Meteor.call('updateLocation', locationId, locationValues,
	                (error, result)=> { 
	                    if (error) {
	                        swal( error.reason ); 
	                    }else {
	                    	swal({
			                title: '',
			                text: "Location Modified successfully!",
			                type: 'success',
			                showCancelButton: false,
			                confirmButtonColor: '#666',
			                confirmButtonText: 'Ok'});
	                    	this.setState({
		  						countryval 		: '',
								stateval   		: '',
								districtval   	: '',
								talukaval   	: '',
								Village 		: '',
								pincode 		: '',
								locationId      : ''
		  					})

	                    }//the _id of new object if successful
	                }

	        );	
	   }

	}

	deleteLocation(event){
	  event.preventDefault();
	  Meteor.call('delLocation', event.currentTarget.id,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    }else{
                    	swal({
		                title: 'abc',
		                text: "Location Deleted successfully!",
		                type: 'success',
		                showCancelButton: false,
		                confirmButtonColor: '#666',
		                confirmButtonText: 'Ok'});
		            	this.setState({
	  						countryval 		: '',
							stateval   		: '',
							districtval   	: '',
							talukaval   	: '',
							Village 		: '',
							pincode 		: '',
							locationId      : ''
	  					})
                    }
                    
                });	

	}

		/*usernamesortup(){
  		
		$("#sortup").css('display', 'none');
		$("#sortdown").css('display', 'inline-block');
	
  		console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.usersListData.sort(function(a, b){
		  return a.profile.fullName > b.profile.fullName;
		});
 		console.log("sortedAsc=",sortedAsc);
		this.setState({
			usersListData : sortedAsc,
		});
  	} 
  	usernamesortdown(){
   		$("#sortup").css('display', 'inline-block');
		$("#sortdown").css('display', 'none');	
  		var sortedDesc = this.state.usersListData.sort(function(a, b){
		  return a.profile.fullName > b.profile.fullName;
		}).reverse();
		this.setState({
			usersListData : sortedDesc,
		});
  	}*/
  	citysortup(){
  		
		$("#citysortup").css('display', 'none');
		$("#citysortdown").css('display', 'inline-block');
	
  		// console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.data.sort(function(a, b){
		  return a.cityloctn > b.cityloctn;
		});
 		console.log("sortedAsc=",sortedAsc);
		this.setState({
			data : sortedAsc,
		});
  	} 
  	citysortdown(){
   		$("#citysortup").css('display', 'inline-block');
		$("#citysortdown").css('display', 'none');	
  		var sortedDesc =  this.state.data.sort(function(a, b){
		  return a.cityloctn > b.cityloctn;
		}).reverse();
		// console.log("sortedDesc=",sortedDesc);

		this.setState({
			data : sortedDesc,
		});
  	}
  	talukasortup(){
  		
		$("#talukasortup").css('display', 'none');
		$("#talukasortdown").css('display', 'inline-block');
	
  		// console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.data.sort(function(a, b){
		  return a.blockloctn > b.blockloctn;
		});
 		// console.log("sortedAsc=",sortedAsc);
		this.setState({
			data : sortedAsc,
		});
  	} 
  	talukasortdown(){
   		$("#talukasortup").css('display', 'inline-block');
		$("#talukasortdown").css('display', 'none');	
  		var sortedDesc =  this.state.data.sort(function(a, b){
		  return a.blockloctn > b.blockloctn;
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
			var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
		console.log("sortedDesc=",sortedDesc);
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


	editLocation(event){
		event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#areaform' ).css({'display':'block'});
		$('#bulkuploadlocation').css({'display':'none'});
		this.setState({
			options : 'manual'
		}) 	
		var locationId = event.currentTarget.id;
		var locationdata = Location.findOne({"_id":locationId});
		if(locationdata){
			this.setState({
				countryval 		: locationdata.countryName,
				stateval   		: locationdata.stateName,
				districtval   	: locationdata.districtName,
				talukaval   	: locationdata.blockloctn,
				Village 		: locationdata.cityloctn,
				pincode 		: locationdata.pincodeloctn,
				locationId      : locationdata._id
			})

		}
	}

	showBtn(){
		if(this.state.locationId){
			return(
	    			<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit updateBTN" onClick={this.editRole.bind(this)} >Update</button>
			)
		}else{
			return(
	    			<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn submit btnSubmit" onClick={this.addlocation.bind(this)} >Submit</button>
			)
		}
	}

	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploads').css({'display':'block'});	
	}

	uploadCSV(event){
        event.preventDefault();
        var UserSession  = event.target.id; 
        UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
				Meteor.call( 'CSVUploadlocation', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){
                            swal({
                                position : 'top-right',
                                type     : 'success',
                                title    : 'abc',
                                text     : "Location Added Successfully",
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
                        }       
         			}
      			});

		    }
        });
    }
setLimit(event){
		event.preventDefault();
		var limit = parseInt(event.target.value);
		var startRange = 0;
		this.setState({
			limitRange : limit,
			dataRange : 0,
		});
		$('li').removeClass('activeQueDataCircle');
		$(".queDataCircle:first").addClass('activeQueDataCircle');

		Meteor.call('locationMasterData', startRange, limit, (error, result)=>{
	    	if(error){
	    		// console.log(error);
	    	}else{
	    		this.setState({
	    			post3: result,
	    		});
	    	}
	    });
	    this.paginationFunction();
	}
       render(){
	
       return(
       		<div>
    			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addlocationWrapper">
    				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
							<span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Location</span>
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
					<div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
					{this.state.options == 'manual' ? 
		       		<Form id="addareaform" >  
		 				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterInput">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterInputPadding ">
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
									<div className="form-group">
									    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">Country<span className="astrick">*</span></label>
									   	<select required onChange={this.changeCountry.bind(this)} title="Please select Country." className="countrySelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval}>
										    <option >-Select-</option>
										    
											{this.state.country.map((data, index)=>{
			                    					return(	
												        <option key={index}>{data.countryName}</option>		 
												    );
			                					})}
									    </select>
									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
									<div className="form-group">
									     <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >State<span className="astrick">*</span></label>
									    <select required="true" onChange={this.changeState.bind(this)} title="Please select State." className="stateSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="stateval" name="stateval" id="stateval" value={this.state.stateval}>
											<option >-Select-</option>
										    
											   {this.state.states.map((data, index)=>{
			                    						return(	
												       		<option key={index} >{data.stateName}</option>
												   						 
												     	);
			                					})}
									    </select>
									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
									<div className="form-group2 ">
									    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >District<span className="astrick">*</span></label>
									   	<select  title="Please select District." className="distSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="districtval" name="districtval" id="districtval" value={this.state.districtval} onChange={this.changeDist.bind(this)}>
										    <option >-Select-</option>
										    
											   	{this.state.district.map((data, index)=>{
			                						return(	
											      		<option key={index}>{data.districtName}</option>
											 
											      	);
			            						})}
									    </select>
									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
									<div className="form-group2 ">
									    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >Block/Taluka<span className="astrick">*</span></label>
									   	<select required onChange={this.handleChange.bind(this)} title="Please select Block/Taluka." className="talukaSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="talukaval" name="talukaval" id="talukaval" value={this.state.talukaval}>
										    <option >-Select-</option>
											   	{this.state.taluka.map((data, index)=>{
			                						return(	
											      	<option key={index}>{data.blockloctn}</option>
											     );
			            						})}
									    </select>
									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
									<div className="form-group">	
									    <label className="formLabel col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >City / Village<span className="astrick">*</span></label>
									    <input className="inputBox-main form-control areaStaes" title="Please enter valid City / Village." id="Village" type="text" name="Village" ref="Village" value={this.state.Village} onChange={this.handleChange.bind(this)}  />
								
									</div>	
								</div>
								
								<div className="form-group col-lg-4 col-md-4 col-sm-12  col-xs-12 formht">
									<div className="form-group">
									    <label className="formLabel col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" >Pin Code<span className="astrick">*</span></label>
									    <input className="inputBox-main form-control areaStaes" title="Please enter valid pincode." type="text" name="pincode" ref="pincode" id="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} />
									       {/*<InputMask mask="999999" maskChar=" " pattern="(0|[1-9][0-9-])"  className="form-control areaStaes" title="Please enter valid Pincode." type="text" name="pincode" ref="pincode" id="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} />*/}
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
										<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
											<div className="csvIcon">
												<a href="/csv/location.csv" download>
													<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
												</a>
											</div>
										</div>
										<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
											<h4><b>Instructions</b></h4>
											<ul className="uploadQuesinst col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Location Data</b> into this system.</li>
												<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
												<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>					
											</ul>
										</div>
										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Locations</b></span></div>
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
						
						{/*	
							{this.props.post3.length > 0 ? 
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reactTableWrap">
									<ReactTable data={locationArray} columns={headers} freezeWhenExpanded={true} />
								</div>
							 : 
							 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								 	<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
										<thead className="table-head">
											<tr className="tempTableHeader">
												<th className="umHeader srpadd"> Country </th>
												<th className="umHeader srpadd"> State 	  </th>
												<th className="umHeader srpadd"> District </th>
												<th className="umHeader srpadd"> Taluka   </th>
												<th className="umHeader srpadd"> City 	  </th>
												<th className="umHeader srpadd"> Area 	  </th>
												<th className="umHeader srpadd"> Pin Code </th>
												<th className="umHeader srpadd"> Action   </th>
											</tr>
										</thead>
										   <tbody className="addRoleTbody">
											  <tr><td colSpan="8" className="noTempData">No Record Found!</td></tr>
										   </tbody>
									</table>
								</div>
							}*/}
					
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
										<table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
												<thead className="table-head tablebodyfix">
												<tr className="tempTableHeader ">
													<th className="umHeader srpadd srpaddcountry">  Country
												{/*		<span className="" >
															<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />   
														</span>*/}
													</th>
													<th className="umHeader srpadd srpaddstate">  
														<span className="" >State{/*
															<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.statesortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.statesortdown.bind(this)} /> */}  
														</span>
													</th>
													<th className="umHeader srpadd srpadddist"> 
														<span className="" >District{/*
															<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.districtsortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.districtsortdown.bind(this)} />   */}
														</span>
													</th>
													<th className="umHeader srpadd srpaddtaluka">  
														Taluka{/*<span className="" >
															<span className="fa fa-caret-up custom  namesortup"  id="talukasortup" onClick={this.talukasortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="talukasortdown" onClick={this.talukasortdown.bind(this)} /> 
														</span>*/}
													</th>
													<th className="umHeader srpadd srpaddcity"> 
														<span className="" >City{/*
															<span className="fa fa-caret-up custom  namesortup"  id="citysortup" onClick={this.citysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="citysortdown" onClick={this.citysortdown.bind(this)} />   */}
														</span>
													</th>
												{/*	<th className="umHeader srpadd"> Area 	  </th>*/}
													<th className="umHeader srpadd srpaddpin">
														<span className="" > Pin Code{/*
															<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.pinsortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.pinsortdown.bind(this)} /> */}  
														</span>
													</th>
													<th className="umHeader srpadd srpaddTwo"> Actions   </th>
												</tr>
											</thead>
										  
									
											{ this.state.data
											?
												this.state.data.length>0 
												? 
												

												<tbody className="noLRPad tableheaderfix">
														{this.state.data.map( (locationdata,index)=>{
															return(
																<tr key={index} className="tablebodyfix">
																<td className="txtcentr">{locationdata.countryName}</td>
																<td className="txtcentr"> {locationdata.stateName}</td>
																<td className="txtcentr">{locationdata.districtName}</td>
																<td className="txtcentr">{locationdata.blockloctn}</td>
																<td className="txtcentr">{locationdata.cityloctn}</td>
																<td className="txtcentr">{locationdata.pincodeloctn}</td>
																<td className="txtcentr">
																   	<div className="dropdown">
																			<div className="">
																				<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																			</div>

																			<div className="dropdown-content  drpdwnpd">
																			
																				<ul className="pdcls ulbtm">
																				
																				   <li>
																						<div className=" resetIcon col-lg-12 col-md-12 "  onClick={this.editLocation.bind(this)} id={locationdata._id}>
																					   		<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
																					    		<i className="fa fa-pencil" aria-hidden="true" title="Edit Location" ></i>
																					    	</div>
																					    	<div className="aligntxtUM">
																					    		Edit Location
																					    	</div>
																				    	</div>

																				    </li>
																				    <li>
																						<div className=" resetIcon col-lg-12 col-md-12" data-toggle="modal" data-target={`#del-${locationdata._id}`}>
																							<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
																					   			<i className="fa fa-trash" aria-hidden="true" title="Delete Location" ></i>
																					   				</div>
																					    	<div className="aligntxtUM">
																					    	
																					   			Delete Location
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
																		          		<p><b>The Location will be deleted. Are you sure you want to continue?</b></p>
																		        	</div>
																			        
																			        <div className="modal-footer modDelFooter">
																			        	<button type="button" data-dismiss="modal" className="btn btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 ">Cancel</button>
																			          	<button  onClick={this.deleteLocation.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn updateBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" >Ok</button>
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

export default AddLocationsexp = withTracker((props)=>{

   
    const postHandle = Meteor.subscribe('countriesdata');
    const post       = Countries.find({}).fetch()||[];
    const loading    = !postHandle.ready();

    const postHandle1 = Meteor.subscribe('districtdata');
    const post1       = District.find({}).fetch()||[];
    const loading1    = !postHandle1.ready();
  	
  	const postHandle2 = Meteor.subscribe('statedata');
    const post2       = State.find({}).fetch()||[];
    const loading2    = !postHandle2.ready();

    const postHandle3 = Meteor.subscribe('locationdata');
    const post3       = Location.find({},{sort: {createdAt: -1}}).fetch()||[];
    const loading3    = !postHandle3.ready();

    const postHandle4 = Meteor.subscribe('talukadata');
    const post4       = Taluka.find({}).fetch()||[];
    const loading4    = !postHandle4.ready();
  
    return {
      loading,
      post,
      
      loading1,
      post1,

      loading2,
      post2, 

      loading3,
      post3, 

      loading4,
      post4,    
    };
})(AddLocations);
