import React, { Component } 	from 'react';
// import ReactTable               from "react-table";
import swal 					from 'sweetalert';
import $ 						from 'jquery' ;
import Form 					from 'react-validation/build/form';
import axios 					from 'axios';

import './AddLocations.css';

class AddLocations extends Component{

	constructor(props){
		super(props);

		this.state = {
			"country"    		: [],
			"countryStored" 	: [],
			"states" 	   		: [],
			"statesStored"   	: [],
			"district" 	   		: [],
			"districtStored" 	: [],
			"taluka" 	  	 	: [],
			"talukaStored" 		: [],
			"data" 				: [],
			"countryval" 		: '',
			"stateval"   		: '',
			"districtval"   	: '',
			"talukaval"   		: '',
			"Village" 			: '',
			"pincode" 			: '',
			"locationId"     	: '',
			"options"	    	: 'manual',
			"fields"            : {},
      		"errors"            : {}

		}
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

	}

	handleInputChange(event) {
	    const target = event.target;
	    // const value = target.type === 'radio' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	      // "pincode" : this.refs.pincode.value;
	    });

	}
 

    /*componentWillReceiveProps(nextProps){
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
			// pincodeloctn    : pincode,
			data 			: nextProps.post3,
		});

	}
*/
	Bulkuploadlocation(event){
    	// event.preventDefault();
		$('#areaform' ).css({'display':'none'});
		$('#bulkuploadlocation').css({'display':'block'});	
	}

	addlocation(event){
		event.preventDefault();	
   		if (this.validateFormReq() && this.validateForm()){
			var locationValues = {
				"country" 		: this.state.countryval,
		  		"state" 		: this.state.stateval,
				"district" 		: this.state.districtval,
				"blockloctn" 	: this.state.talukaval,	
				"cityloctn" 	: this.state.Village,			
				"pincodeloctn" 	: this.state.pincode,			
			}
			axios
          .post('http://jsonplaceholder.typicode.com/posts', { locationValues })
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
      		fields["districtval"] = "";
      		fields["talukaval"] = "";
      		fields["Village"] = "";
      		fields["pincode"] = "";
       
          this.setState({
            countryval:"",
            stateval:"",
            districtval:"",
            talukaval:"",
            Village:"",
            pincode:"",
            fields:fields

          })	
        }
	}
	validateForm() {
    let fields = this.state.fields;
    let errors = {};
    
    let formIsValid = true;
    if (typeof fields["Village"] !== "undefined") {
      if (fields["Village"].length < 2 ) {
        formIsValid = false;
        errors["Village"] = "Please enter valid City/Village Name.";
      }
    }
    if (typeof fields["pincode"] !== "undefined") {
      if (fields["pincode"].length < 2){
        formIsValid = false;
        errors["pincode"] = "Please enter valid Pincode.";
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
    if (!fields["countryval"]) {
      formIsValid = false;
      errors["countryval"] = "This field is required.";
    }
    if (!fields["stateval"]) {
      formIsValid = false;
      errors["stateval"] = "This field is required.";
    }
    if (!fields["districtval"]) {
      formIsValid = false;
      errors["districtval"] = "This field is required.";
    }
    if (!fields["talukaval"]) {
      formIsValid = false;
      errors["talukaval"] = "This field is required.";
    }
    if (!fields["Village"]) {
      formIsValid = false;
      errors["Village"] = "This field is required.";
    }
    if (!fields["pincode"]) {
      formIsValid = false;
      errors["pincode"] = "This field is required.";
    }
    
    this.setState({
      errors: errors
    });
    return formIsValid;
  	}


	editRole(event){
	  event.preventDefault();
      var locationId    = this.state.locationId;
      var locationValues = {
			  		"countryval" 		: this.state.countryval,
			  		"stateval" 		: this.state.stateval,
					"districtval" 		: this.state.districtval,
					"talukaval" 	: this.state.talukaval,	
					"Village" 	: this.state.Village,			
					"pincode" 	: this.state.pincode,			
				}
	  /*if ($('#addareaform').valid()) {
	      Meteor.call('updateLocation', locationId, locationValues,
	                (error, result)=> { 
	                    if (error) {
	                        swal( error.reason ); 
	                    }else {
	                    	swal({
		                              title: 'abc',
				                      text: "Location Modified Successfully!",
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
								talukaval   	: '',
								Village 		: '',
								pincode 		: '',
								locationId      : ''
		  					})

	                    }//the _id of new object if successful
	                }

	        );	
	   }
*/
	}

	deleteLocation(event){
	  event.preventDefault();
	  /*Meteor.call('delLocation', event.currentTarget.id,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    }else{
                    	
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
*/
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
		/*var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
		console.log("sortedDesc=",sortedDesc);
		this.setState({
			data : sortedDesc,
		});*/
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
		/*var locationdata = Location.findOne({"_id":locationId});
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

		}*/
	}


	showBtn(){
		if(this.state.locationId){
			return(
	    			<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit btn_mrg2 updateBTN" onClick={this.editRole.bind(this)} >Update</button>
			)
		}else{
			return(
	    			<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12  submit btn_mrg2" onClick={this.addlocation.bind(this)} >Submit</button>
			)
		}
	}

	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploads').css({'display':'block'});	
	}
	isNumberKey(evt){
     var charCode = (evt.which) ? evt.which : evt.keyCode
     // console.log(charCode);
     if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
     {
      evt.preventDefault();
        return false;
      }
      else{
        return true;
      }
    }

	uploadCSV(event){
        event.preventDefault();
        /*var UserSession  = event.target.id; 
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
                                title    : '',
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
        });*/
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
	    this.paginationFunction();
	}
	handleChange(event){
	    event.preventDefault();
	    this.setState({
	    "countryval"    : this.refs.countryval.value, 
	    "stateval"		: this.refs.stateval.value,
		"districtval" 	: this.refs.districtval.value,
		"talukaval" 	: this.refs.talukaval.value,
		"Village" 		: this.refs.Village.value,
		"pincode" 		: this.refs.pincode.value,
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
  


    copyTextValue(e){
  // e.preventDefault();
    this.setState({checked: !this.state.checked});
  
   // console.log("here checkbx value", this.state.checked);
      // console.log("here demo value", this.refs.AddressLine.value );
      var msg;
      var text2;
      var txt3;
      var txt4;
      var txt5;
      var txt6;
      var txt7;
      var txt8;
      var txt9;


     if (this.state.checked) {
      msg = "unchecked";
      this.setState({
      
        "AddressLine1_cpy"        : "",
        "AddressLine2_cpy"        : "",
        "Country1"                : "",
        "State1"                  : "",
        "City1"                   : "",
        "District1"               : "",
        "Pincode1"                : "",
        "Area1"                   : "",
        "makeDisable"             : "enable",
        "checked"                 : false,

                });    
    } else {
      msg = "checked";
       // console.log(msg);

 
       text2 =  this.refs.AddressLine1.value;
       txt3 =  this.refs.AddressLine2.value;
       txt4 =  this.refs.Country.value;
       txt5 =  this.refs.Pincode.value;
       txt6 =  this.refs.State.value;
       txt7 =  this.refs.City.value;
       txt8 =  this.refs.District.value;
       txt9 =  this.refs.Area.value;
      
        this.setState({
      
        "AddressLine1_cpy"        : text2,
        "AddressLine2_cpy"        : txt3,
        "Country1"                : txt4,
        "State1"                  : txt6,
        "City1"                   : txt7,
        "District1"               : txt8,
        "pincode"                : txt5,
        "Area1"                   : txt9,
        "makeDisable"             : "disable",
        });   
      // console.log("",this.state.makeDisable);
    }
  }
       


       render(){
	
       return(
       		<div>
    			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addlocationWrapper">
    			
    				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle">
    				
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
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
					<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12"><div className="marginBottom"></div></div>
					{this.state.options == 'manual' ? 
		       		<Form id="addareaform" >  
		 				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterInput ">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterInputPadding ">
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12  valid_box">
									<div className="form-group">
									    <label className="">Country<span className="asterix">*</span></label>
									   	<select 
									    onChange={this.handleChange.bind(this)} 
									   	className="inputBox-main countrySelected areaStaes form-control" 
									   	ref="countryval"
									   	name="countryval" 
									   	id="countryval" 
									   	value={this.state.countryval}>
										    <option >-Select-</option>
										    <option >India</option>
										    <option >China</option>
										    
											{/*{this.state.country.map((data, index)=>{
			                    					return(	
												        <option key={index}>{data.countryName}</option>		 
												    );
			                					})}*/}
									    </select>
										<div className="errorMsg">{this.state.errors.countryval}</div>

									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
									<div className="form-group">
									     <label className="" >State<span className="asterix">*</span></label>
									    <select required="true" 
									    onChange={this.handleChange.bind(this)} 
									    title="This field is required" 
									    className="inputBox-main stateSelected areaStaes form-control" 
									    ref="stateval" 
									    name="stateval" 
									    id="stateval" 
									    value={this.state.stateval}>
											<option >-Select-</option>
											<option >Maharastra</option>
											<option >UtterPradesh</option>
										    
											   {/*{this.state.states.map((data, index)=>{
			                    						return(	
												       		<option key={index} >{data.stateName}</option>
												   						 
												     	);
			                					})}*/}
									    </select>
									   <div className="errorMsg">{this.state.errors.stateval}</div>

									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
									<div className="form-group2 ">
									    <label className="" >District<span className="asterix">*</span></label>
									   	<select  title="This field is required" 
									   	className="inputBox-main distSelected areaStaes form-control" 
									   	ref="districtval" 
									   	name="districtval" 
									   	id="districtval" 
									   	value={this.state.districtval} 
									    onChange={this.handleChange.bind(this)}>
										    <option >-Select-</option>
										    <option >Pune</option>
										    <option >Mumbai</option>
										    
											  {/*	{this.state.district.map((data, index)=>{
			                						return(	
											      		<option key={index}>{data.districtName}</option>
											 
											      	);
			            						})}*/}
									    </select>
									   <div className="errorMsg">{this.state.errors.districtval}</div>
									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
									<div className="form-group2 ">
									    <label className="" >Block/Taluka<span className="asterix">*</span></label>
									   	<select  onChange={this.handleChange.bind(this)}
									   	 title="This field is required" 
									   	 className="inputBox-main talukaSelected areaStaes form-control" 
									   	 ref="talukaval" 
									   	 name="talukaval" 
									   	 id="talukaval" 
									   	 value={this.state.talukaval}>
										    <option >-Select-</option>
										    <option >Pune</option>
											   	{/*{this.state.taluka.map((data, index)=>{
			                						return(	
											      	<option key={index}>{data.blockloctn}</option>
											     );
			            						})}*/}
									    </select>
									   <div className="errorMsg">{this.state.errors.talukaval}</div>
									</div>	
								</div>
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 valid_box">
									<div className="form-group">	
									    <label className="formLabel " >City / Village<span className="asterix">*</span></label>
									    <input className="inputBox-main form-control areaStaes nameParts" 
									    title="This field is required" id="Village" type="text" name="Village" ref="Village" 
									    value={this.state.Village} onChange={this.handleChange.bind(this)}  />
									   <div className="errorMsg">{this.state.errors.Village}</div>
									</div>	
								</div>
								
								<div className="form-group col-lg-4 col-md-4 col-sm-12  col-xs-12 valid_box">
									<div className="form-group">
									    <label className="formLabel " >Pin Code<span className="asterix">*</span></label>
									    <input className="inputBox-main form-control areaStaes nameParts"
									     title="This field is required" maxLength="6" type="text" name="pincode" ref="pincode"
									     id="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} 
									     onKeyDown={this.isNumberKey.bind(this)}  />
									   <div className="errorMsg">{this.state.errors.pincode}</div>
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
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm4">
										<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
											<div className="">
					                            <a >
					                              <img src="/images/csv_upload.png"  className="csvimg" title="Click to download file"/>
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
										<table id="listOfUsersDwnld" className="display table table-bordered servicesTable" >
												<thead className="table-head tablebodyfix">
												<tr className="tempTableHeader ">
													<th className="umHeader tbl_color srpadd srpaddcountry">  Country
												{/*		<span className="" >
															<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />   
														</span>*/}
													</th>
													<th className="umHeader tbl_color srpadd srpaddstate">  
														<span className="" >State{/*
															<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.statesortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.statesortdown.bind(this)} /> */}  
														</span>
													</th>
													<th className="umHeader tbl_color srpadd srpadddist"> 
														<span className="" >District{/*
															<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.districtsortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.districtsortdown.bind(this)} />   */}
														</span>
													</th>
													<th className="umHeader tbl_color srpadd srpaddtaluka">  
														Taluka{/*<span className="" >
															<span className="fa fa-caret-up custom  namesortup"  id="talukasortup" onClick={this.talukasortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="talukasortdown" onClick={this.talukasortdown.bind(this)} /> 
														</span>*/}
													</th>
													<th className="umHeader tbl_color srpadd srpaddcity"> 
														<span className="" >City{/*
															<span className="fa fa-caret-up custom  namesortup"  id="citysortup" onClick={this.citysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="citysortdown" onClick={this.citysortdown.bind(this)} />   */}
														</span>
													</th>
												{/*	<th className="umHeader srpadd"> Area 	  </th>*/}
													<th className="umHeader tbl_color srpadd srpaddpin">
														<span className="" > Pin Code{/*
															<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.pinsortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.pinsortdown.bind(this)} /> */}  
														</span>
													</th>
													<th className="umHeader tbl_color srpadd srpaddTwo"> Actions   </th>
												</tr>
											</thead>
										  
									
											{ this.state.data
											?
												this.state.data.length>0 
												? 
												

												<tbody className="noLRPad ">
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
																						<div className="resetIcon icn col-lg-12 col-md-12 " >
											                                              	<div id={locationdata._id} onClick={this.editLocation.bind(this)}>
													                                              <div className="col-lg-1 icn iconUM">
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

																		          	<div className="modal-body mb deleteMsg ">
																		          		<p className="paracenter"><b>The Location will be deleted. <br></br> Are you sure you want to continue?</b></p>
																		        	</div>
																			        
																			        <div className="modal-footer msgModalfooter">
																			        	<button type="button" data-dismiss="modal" className=" btn-success btnClose col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-right">No</button>
																			          	<button  onClick={this.deleteLocation.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className=" deleteBTNModal col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-left" >Yes</button>
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
													<td colSpan="9" className="ntdiaplay displayblck"></td>
													
											:
											<tbody>
												<td colSpan="9" >
													{/*<td colSpan="9" className="ntdiaplay">Nothing to display.</td>*/}
													<div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/SRESloader.gif" className="loaderimgcent" alt="loading"/></div>

												</td>
											</tbody>
											
											}

										</table>
									
						            {/*{ 
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
		
	    );
	} 
}

export default AddLocations
