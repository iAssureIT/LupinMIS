import React, { Component } 	from 'react';
//import { render } 				from 'react-dom';
//import {withTracker} 			from 'meteor/react-meteor-data';
//import ReactTable               from "react-table";
import Form from 'react-validation/build/form';
import $ from "jquery";
import axios from 'axios';

import './AddDistrict.css';

class AddDistrict extends Component{

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
			districtId      : '',
			options	    	: 'manual',
		}
		this.handleChange = this.handleChange.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeState = this.changeState.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
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
    	/*$.validator.addMethod("regx1", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain letters.");
	    $.validator.addMethod("valueNotEquals", function(value, element, arg){
	        return arg !== value;
	    }, "Value must not equal arg.");
	     jQuery.validator.setDefaults({
	      debug: true,
	      success: "valid"
	    });
	    $("#districtForm").validate({
	      rules: {
	        districtval: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	valueNotEquals: "-Select-"
	        }
	      },
	      
	    });
*/
	 //    //Spinner Effect
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
 	
	 handleChange(event){
    	event.preventDefault();
    	   const target = event.target;
		   const name   = target.name;
		   this.setState({
		    [name]: event.target.value,
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

    changeCountry = (event)=>{
    	var countryval = $('#countryval').val();
    	var statesData = this.props.post2;
    	var newArr = [];
    	for(var i=0; i<statesData.length; i++){
    		if(statesData[i].countryName == countryval){
    			newArr.push(statesData[i]);
    		}
    	}
    	this.setState({
    		states : newArr,
    		countryval : countryval
    	})
    }

    changeState = (event)=>{
    	var stateval = $('.stateSelected').val();
		this.setState({
    		stateval : stateval
    	})
    	
    }

    componentWillReceiveProps(nextProps){
		var country = nextProps.post;
		var states = nextProps.post2;
		var district = nextProps.post1;
		this.setState({
			country 		: country,
			states 			: states,
			district 		: district,
			countryStored 	: country,
			statesStored 	: states,
			districtStored 	: district,

			data 			: nextProps.post1,
		});
	}

	
	Bulkuploadform5(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploaddist').css({'display':'block'});	
	}
	
	districtadd(event){
	  event.preventDefault();		 
	  	var districtValues = {
	  		"country" 		: this.state.countryval,
		  	"state" 		: this.state.stateval,	
			"district" 		: this.state.districtval,	
		
		}
		axios
          .post('http://jsonplaceholder.typicode.com/posts', { districtValues })
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
          })		
     
        /*if($('#districtForm').valid()){	
	      Meteor.call('addDistrict',districtValues,
	            (error, result)=> { 
	                if (error) {
	                  
	                    swal(error.reason);
	                } 
	               else {
		                    	if(result == 'exist'){
		                         swal({
		                         	title: 'abc',
				                      text: "District Already Added!",
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
				                      text: "District Added Successfully!",
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
							districtId      : '',
							button:false,
                            timer:2000,

	                    })
	                }
	            }
	        );
  		}
*/
	}

	
    updateDist(event){
	  event.preventDefault();
      var districtId    = this.state.districtId;
      var districtValues = {
	  		"country" 		: this.state.countryval,
		  	"state" 		: this.state.stateval,	
			"district" 		: this.state.districtval,	
		
		}
      /*if($('#districtForm').valid()){	
	      Meteor.call('updateDistrict', districtId, districtValues,
	                (error, result)=> { 
	                    if (error) {
	                        console.log ( error ); 
	                    } //info about what went wrong 
	                    else {
                         swal({
		                              title: 'abc',
				                      text: "District Modified Successfully!",
				                      type: 'success',
				                      showCancelButton: false,
				                      confirmButtonColor: '#666',
				                      // timer: 4000,
				                      // cancelButtonColor:'#d33',
				                      confirmButtonText: 'Ok'
		                    });
                          this.setState({
                        country         : '',
                        countryId       : '',
                        Nationality     :'',
                        countryval 		: '',
						stateval   		: '',
						districtval   	: '',
						districtId      : '',
                      })
                        }
	                }

	        );	
	   }
*/
	}

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

	uploadCSV(event){
        event.preventDefault();
        
        /*UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
		    	Meteor.call( 'CSVUploaddistrict', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){
                            swal({
                                position : 'top-right',
                                type     : 'success',
                                title    : '',
                                text     : "District Added Successfully!",
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


	deleteDistrict(event){
	  event.preventDefault();
	  /*Meteor.call('deleteDistrict', event.currentTarget.id,
                (error, result)=> { 
                    if(error){
                        console.log ( error ); 
                    }else{
                    	
                    	this.setState({
	                    	countryval 		: '',
							stateval   		: '',
							districtval   	: '',
							districtId      : ''
	                    })
                    }
                    
                });	*/

	}

	

    editDistrict(event){
		/*event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploaddist').css({'display':'none'});
		this.setState({
			options : 'manual'
		}) 
		var districtId = event.currentTarget.id;
		var districtdata = District.findOne({"_id":districtId});
		if(districtdata){
			this.setState({
				countryval 		: districtdata.countryName,
				stateval   		: districtdata.stateName,
				districtval   	: districtdata.districtName,
				districtId      : districtdata._id
			})
		}*/
	}

	showBtn(){
		if(this.state.districtId){
			return(
				<button type="submit" className="btn submit dt pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn_mrg1  updateBTN" onClick={this.updateDist.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="btn submit dt pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn_mrg1  btnSubmit" onClick={this.districtadd.bind(this)}>Submit</button>
			)
		}
	}



	render(){
		
       return(
			<div className="">
				<div className=""  id="addcountrie">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle">
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
						<span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add District</span>
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
				<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12"><div className="marginBottom"></div></div>
				{this.state.options == 'manual' ? 	
				<div>
       			<Form id="districtForm" className="">

        				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterDistrictWrapper " id="adddist">	
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterDistrictInput">
								<div className="form-group col-lg-6 col-md-12 col-sm-12 col-xs-12 valid_box  ">
									<label className="control-label " >Country<span className="asterix">*</span></label>
									<select onChange={this.changeCountry.bind(this)} title="This field is required" className="inputBox-main countrySelected  areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval} >
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
								<div className=" form-group col-lg-6 col-md-12 col-sm-12 col-xs-12 valid_box">
								    <label className="control-label" >State<span className="asterix">*</span></label>
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
								
								<div className="form-group  col-lg-12 col-md-12 col-sm-12 col-xs-12 valid_box">
									<div className="form-group ">
									    <label className="formLabel control-label " >District<span className="asterix">*</span></label>
									    <input className="form-control inputBox-main areaStaes" id="districtval" type="text" name="districtval" id="districtval" value={this.state.districtval} title="This field is required" onChange={this.handleChange.bind(this)} />
									</div>
								</div>	
								</div>
							
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								{this.showBtn()}
							</div>
							</div>

				</Form>
				</div>
				:
					<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
						<div className="csvDLWrap">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm5">
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
										<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>District Data</b> into this system.</li>
										<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
										<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>
															
									</ul>
								</div>
								<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Districts</b></span></div>
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
										<table id="listOfUsersDwnld" className="display table table-bordered servicesTable" >
												<thead className="table-head tablebodyfix">
												<tr className="tempTableHeader">
													<th className="col-lg-3 umHeader tbl_color srpadd">  
														<span className="" >Country{/*
															<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />  */} 
														</span>
													</th>
													<th className="col-lg-3 umHeader tbl_color srpadd">  
														<span className="" >State{/*
														<span className="fa fa-caret-up custom  namesortup"  id="statesortup" onClick={this.statesortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="statesortdown" onClick={this.statesortdown.bind(this)} /> */}
														</span>
													</th>
													<th className="col-lg-3 umHeader tbl_color srpadd">  
														<span className="" >District
														{/*	<span className="fa fa-caret-up custom  namesortup"  id="sortup" onClick={this.statesortup.bind(this)} />
															<span className="fa fa-caret-down custom namesortdown" id="sortdown" onClick={this.statesortdown.bind(this)} /> 
														*/}</span>
													</th>
													<th className="col-lg-2 umHeader tbl_color srpadd"> Action   </th>
												</tr>
											</thead>
										  
									
											{/*{ this.props.post1
											?
												this.props.post1.length>0 
												? 
												

												<tbody className="noLRPad">
														{this.props.post1.map( (locationdata,index)=>{
															return(
																<tr key={index} className="tablebodyfix">
																<td className="col-lg-3 txtcentr">{locationdata.countryName}</td>
																<td className="col-lg-3 txtcentr">{locationdata.stateName}</td>
																<td className="col-lg-3 txtcentr">{locationdata.districtName}</td>
																
																<td className="col-lg-2 txtcentr">
																   	<div className=" dropdown">
																			
																						 <div className=" resetIcon icn col-lg-12 col-md-12 " >
											                                              	<div id={locationdata._id} onClick={this.editDistrict.bind(this)}>
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
																			          		<p className="paracenter"><b>The District will be deleted. <br></br> Are you sure you want to continue?</b></p>
																			        	</div>
																				        
																				        <div className="modal-footer msgModalfooter">
																				        	<button type="button" data-dismiss="modal" className=" btn-success btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right">No</button>
																				          	<button  onClick={this.deleteDistrict.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className=" deleteBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-left" >Yes</button>

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
			
		
	    );
	} 
}

export default AddDistrict;
