import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import './IAssureTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
var sum = 0;
class IAssureTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			"dataCount" 				: props && props.dataCount ? props.dataCount : [],
		    "tableData" 				: props && props.tableData ? props.tableData : [],
		    "tableHeading"				: props && props.tableHeading ? props.tableHeading : {},
		    "twoLevelHeader" 			: props && props.twoLevelHeader ? props.twoLevelHeader : {},
		    "tableObjects" 				: props && props.tableObjects ? props.tableObjects : {},		    
		    "showUpgradation" 			: props && props.showUpgradation ? props.showUpgradation : '',		    
		    "reA" 						: /[^a-zA-Z]/g,
		    "reN" 						: /[^0-9]/g,
		    "sort" 	  					: true,
		    "examMasterData2" 			: '',
		    "activeClass" 				: 'activeCircle',
		    "paginationArray" 			: [],
		    "startRange" 				: 0,
		    "limitRange" 				: 10,
		    "activeClass" 				: 'activeCircle', 		    
		    "normalData" 				: true,
		    "selectedBeneficiaries" 	: []
		}
		this.delete = this.delete.bind(this);
	}
	componentDidMount() {
      $("html,body").scrollTop(0); 
      
      // this.palindrome('Moam');
      this.setState({
      	tableHeading	: this.props.tableHeading,
      	tableData 		: this.props.tableData,
      	dataCount 		: this.props.dataCount,
      });
      // this.paginationFunction();
	}
	componentWillReceiveProps(nextProps) {
		// console.log('nextProps',nextProps)
        this.setState({
            tableData	    : nextProps.tableData,
            dataCount 		: nextProps.dataCount,
            selectedValues  : nextProps.selectedValuess,
            // sendBeneficiary : nextProps.sendBeneficiary,
            selectedBeneficiaries : nextProps.sendBeneficiary,
            showUpgradation : nextProps.showUpgradation
        },()=>{
        	
        	// if(this.state.selectedValues){
	        // 	this.state.selectedValues.map((a, i)=>{
	        // 		this.setState({
	        // 			[a.beneficiary_ID+'|'+a.beneficiaryID+'|'+a.family_ID+'|'+a.familyID+'|'+a.nameofbeneficiary] : false
	        // 		})
	        // 	})
        	// }
        	// console.log('update',this.state.selectedBeneficiaries);
        	if(this.state.selectedBeneficiaries&&this.state.selectedBeneficiaries.length>0){
        		this.state.selectedBeneficiaries.map((value, i)=>{

        			let id = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary
        			let upgradeid = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary+'|upgrade'
        			// let id = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village
        			// let upgradeid = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|upgrade'
        			this.setState({
	        			[id] : true,
	        			[upgradeid] : value.isUpgraded==='Yes'?true:false
	        		})
        		})
        	}else{
        		if(this.state.tableData&&this.state.tableData.length>0){
	        		this.state.tableData.map((value, i)=>{
	        			// let id = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village
	        			// let upgradeid = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|upgrade'
        				let id = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary
        				let upgradeid = value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary+'|upgrade'
	        			this.setState({
		        			[id] : false,
		        			[upgradeid] : false
		        		})
	        		})
        		}
        	}
        	this.paginationFunction();
        })
        
    }
	// componentWillUnmount(){
 //    	$("script[src='/js/adminSide.js']").remove();
 //    	$("link[href='/css/dashboard.css']").remove();
	// }
	edit(event){
		event.preventDefault();
		$("html,body").scrollTop(0);
		var tableObjects =  this.props.tableObjects;
		var id = event.target.id;
		this.props.history.push(tableObjects.editUrl+id);
	}
    delete(e){
	  	e.preventDefault();
	  	var tableObjects =  this.props.tableObjects;
		let id = e.target.id;
		axios({
	        method: 'delete',
	        url: tableObjects.apiLink+id
	    }).then((response)=> {
	    	this.props.getData(this.state.startRange, this.state.limitRange);
	        swal({
	        	text : response.data.message,
	        	title : response.data.message
	        });
	    }).catch(function (error) {
	        console.log('error', error);
	    });
    } 
    sortNumber(key, tableData){
    	var nameA = '';
    	var nameB = '';
    	var reA = /[^a-zA-Z]/g;
		var reN = /[^0-9]/g;
		var aN = 0;
		var bN = 0;
		var sortedData = tableData.sort((a, b)=> {
    		Object.entries(a).map( 
				([key1, value1], i)=> {
					if(key === key1){
						nameA = value1.replace(reA, "");				
					}
				}
			);
			Object.entries(b).map( 
				([key2, value2], i)=> {
					if(key === key2){
						nameB = value2.replace(reA, "");
					}
				}
			);
			if(this.state.sort === true){
				this.setState({
					sort 	  : false
				})
				if (nameA === nameB) {
					Object.entries(a).map( 
						([key1, value1], i)=> {
							if(key === key1){
								aN = parseInt(value1.replace(reN, ""), 10);				
							}
						}
					);
					
					Object.entries(b).map( 
						([key1, value1], i)=> {
							if(key === key1){
								bN = parseInt(value1.replace(reN, ""), 10);					
							}
						}
					);

					if (aN < bN) {
						return -1;
					}
					if (aN > bN) {
						return 1;
					}
					return 0;

				} else {

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				}
			}else if(this.state.sort === false){
				this.setState({
					sort 	  : true
				})
				if (nameA === nameB) {
					Object.entries(a).map( 
						([key1, value1], i)=> {
							if(key === key1){
								aN = parseInt(value1.replace(reN, ""), 10);			
							}
						}
					);
					
					Object.entries(b).map( 
						([key1, value1], i)=> {
							if(key === key1){
								bN = parseInt(value1.replace(reN, ""), 10);					
							}
						}
					);

					if (aN > bN) {
						return -1;
					}
					if (aN < bN) {
						return 1;
					}
					return 0;

				} else {

					if (nameA > nameB) {
						return -1;
					}
					if (nameA < nameB) {
						return 1;
					}
					return 0;
				}
			}				
		});
		this.setState({
			tableData : sortedData,
		});
    }
    sortString(key, tableData){
    	var nameA = '';
    	var nameB = '';
    	var sortedData = tableData.sort((a, b)=> {
		Object.entries(a).map( 
			([key1, value1], i)=> {
				if(key === key1){
					if(jQuery.type( value1 ) === 'string'){
						nameA = value1.toUpperCase();
					}else{
						nameA = value1;
					}						
				}
			}
		);
		Object.entries(b).map( 
			([key2, value2], i)=> {
				if(key === key2){
					if(jQuery.type( value2 ) === 'string'){
						nameB = value2.toUpperCase();
					}else{
						nameB = value2;
					}	
				}
			}
		);
			if(this.state.sort === true){	
				this.setState({
					sort 	  : false
				})		
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			}else if(this.state.sort === false){
				this.setState({
					sort 	  : true
				})	
				if (nameA > nameB) {
					return -1;
				}
				if (nameA < nameB) {
					return 1;
				}
				return 0;
			}
		});
		this.setState({
			tableData : sortedData,
		});
    }
    sort(event){
    	event.preventDefault();
    	var key = event.target.getAttribute('id');
    	var tableData = this.state.tableData;
		if(key === 'number'){
			this.sortNumber(key, tableData);
		}else{
			this.sortString(key, tableData);
		}
    }
   	paginationFunction(event){
		var dataLen = this.state.dataCount > 20 || this.state.dataCount === 20 ? 20 : this.state.dataCount;
		var dataLength = this.state.dataCount;
		this.setState({
			dataLength : dataLen,
		},()=>{
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var paginationNum = dataLength/maxRowsPerPage;
			var pageCount = Math.ceil(paginationNum) > 20 ? 20 : Math.ceil(paginationNum);

			var paginationArray = [];
			for (var i=1; i<=pageCount;i++){
				var countNum = maxRowsPerPage * i;
				var startRange = countNum - maxRowsPerPage;
				if(i === 1){
					var activeClass = 'activeCircle';
				}else{
					activeClass = '';
				}
				paginationArray.push(
					<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={countNum+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
				);
			}
			if(pageCount>=1){				
				this.setState({
					paginationArray : paginationArray,
				},()=>{
				});
			}
			return paginationArray;
		});
	}
	getStartEndNum(event){	
		
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2     = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		this.props.getData(startRange, limitRange);
		this.setState({
			startRange:startRange,
		});
		$('li').removeClass('activeCircle');
		$(event.target).addClass('activeCircle');
		var counter = $(event.target).text();
	}
	setLimit(event){
		event.preventDefault();
		var limitRange = parseInt(this.refs.limitRange.value);
		var startRange = 0;
		this.setState({
			"limitRange":limitRange,
			"startRange":0

		},()=>{
			this.paginationFunction();
			if(this.state.normalData === true){
				this.props.getData(startRange, this.state.limitRange);
			}	
			if(this.state.searchData === true){
				this.tableSearch();
			}
		});	
	}
	tableSearch(){
    	var searchText = this.refs.tableSearch.value.trim();
		if(searchText && searchText.length !== 0) {
			this.setState({
				"normalData"  : false,
				"searchData"  : true,
			},()=>{
				this.props.getSearchText(searchText);
			});	    	
	    }else{
			this.props.getSearchText(searchText);
			// this.props.getData(this.state.startRange, this.state.limitRange);
	    }    	 
    }
    showNextPaginationButtons(){
    	var beforeDataLength = this.state.dataLength > 0 ? this.state.dataLength : 20;
		if(beforeDataLength !== this.state.dataCount){
			this.setState({
				dataLength : (beforeDataLength+ 20) > this.state.dataCount ? this.state.dataCount : (beforeDataLength+ 20),
			},()=>{
				$('li').removeClass('activeCircle');
				$(".queDataCircle:first").addClass('activeCircle');
				const maxRowsPerPage = this.state.limitRange;
				var dataLength = this.state.dataLength;
				var paginationNum = parseInt(dataLength)/maxRowsPerPage;
				var pageCount = Math.ceil(paginationNum);

				var paginationArray = [];

				for (var i=beforeDataLength+1; i<=pageCount;i++){
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if(i === beforeDataLength+1){
						var activeClass = 'activeCircle';
					}else{
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={countNum+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
					);
				}
				if(pageCount>=1){				
					this.setState({
						paginationArray : paginationArray,
					});
				}
				return paginationArray;
			});
		}		
    }
    showPreviousPaginationButtons(){
    	var beforeDataLength = this.state.dataLength;
		
		this.setState({
			dataLength : beforeDataLength > 20 ? beforeDataLength- this.state.paginationArray.length : 0,
		},()=>{
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength)/maxRowsPerPage;
			if(dataLength !== 0 && paginationNum!== 0){
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];
				var forLoop = (beforeDataLength-this.state.paginationArray.length) < 0 ?  1: beforeDataLength-this.state.paginationArray.length;
				for (var i=forLoop-19; i<=pageCount;i++){
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if(i === beforeDataLength-39 || i === 1){
						var activeClass = 'activeCircle';
					}else{
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={countNum+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
					);
				}
				if(pageCount>=1){				
					this.setState({
						paginationArray : paginationArray,
					});
				}
				return paginationArray;
			}			
		});
    }
    showFirstTweentyButtons(){
    	var beforeDataLength = this.state.dataCount;
		
		this.setState({
			dataLength : 20,
		},()=>{
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength)/maxRowsPerPage;
			if(dataLength !== 0 && paginationNum!== 0){
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];

				for (var i=1; i<=pageCount;i++){
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if(i === 1){
						var activeClass = 'activeCircle';
					}else{
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={countNum+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
					);
				}
				if(pageCount>=1){				
					this.setState({
						paginationArray : paginationArray,
					});
				}
				return paginationArray;
			}			
		});
    }
    showLastTweentyButtons(){
    	var beforeDataLength = this.state.dataLength;
		
		this.setState({
			dataLength : this.state.dataCount,
		},()=>{
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength)/maxRowsPerPage;
			if(dataLength !== 0 && paginationNum!== 0){
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];

				for (var i=(this.state.dataCount - 20)+1; i<=pageCount;i++){
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if(i === 1 || i === (this.state.dataCount - 20)+1){
						var activeClass = 'activeCircle';
					}else{
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link "+activeClass+" parseIntagination"+i} id={countNum+'|'+startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on "+i+ " page"}>{i}</li>
					);
				}
				if(pageCount>=1){				
					this.setState({
						paginationArray : paginationArray,
					});
				}
				return paginationArray;
			}			
		});
    }
    selectBeneficiary(event){
    	var selectedBeneficiaries = this.state.selectedBeneficiaries;
    	var value = event.target.checked;
	    var id    = event.target.id;
	    var operation = false
	    // console.log('value',value,id)
	    if(id.split('|')[10]){
			let newId = id.replace('|upgrade','')
			operation = true
			this.setState({[newId] : value,[id] : value})
	    }else{
	    	if(this.state[id+'|upgrade']===false){
				operation = true
				this.setState({[id] : value})
	    	}else{
		    	swal('','This operation is not allowed. Please deselect the upgraded value.');
	    	}
	    }
	    // console.log('operation',operation)
	    if(operation){
		    if(value===true){
				var index = selectedBeneficiaries.findIndex(v => v.beneficiary_ID === id.split('|')[1])
				if(index<0){
				    selectedBeneficiaries.push({
			    		_id     		      : id.split('|')[0],
			    		beneficiary_ID        : id.split('|')[1],
						beneficiaryID         : id.split('|')[2],
			    		family_ID             : id.split('|')[3],
						familyID              : id.split('|')[4],
						nameofbeneficiary     : id.split('|')[5],
						relation              : id.split('|')[6],
						dist          	      : id.split('|')[7],
						block                 : id.split('|')[8],
						village               : id.split('|')[9],
			            caste                 : id.split('|')[10],
			            incomeCategory        : id.split('|')[11],
			            landCategory          : id.split('|')[12],
			            specialCategory       : id.split('|')[13],
			            genderOfbeneficiary   : id.split('|')[14],
			            birthYearOfbeneficiary: id.split('|')[15],
						isUpgraded 		      : id.split('|')[16]&&value?'Yes':id.split('|')[16]&&!value?'No':this.state[id+"|upgrade"]?'Yes':'No',
			    	});
			    	this.setState({
			          selectedBeneficiaries : selectedBeneficiaries
			        },()=>{
			          	this.props.getBeneficiaries(this.state.selectedBeneficiaries);
			        	// console.log('this.state.selectedBeneficiaries',this.state.selectedBeneficiaries);
			        });
				}
			}else{
				var index = selectedBeneficiaries.findIndex(v => v.beneficiary_ID === id.split('|')[1])
				if(index>=0){
			        selectedBeneficiaries.splice(selectedBeneficiaries.findIndex(v => v.beneficiary_ID === id.split('|')[1]), 1);
			        this.setState({
			          selectedBeneficiaries : selectedBeneficiaries
			        },()=>{
			          	this.props.getBeneficiaries(this.state.selectedBeneficiaries);
			        	// console.log('this.state.selectedBeneficiaries======',this.state.selectedBeneficiaries);
			        });
				}
			}
	    }
    }
	render() {
        return (
	       	<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12">	
	       	{
	       		this.state.tableObjects.paginationApply === true ?
		       		<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
						<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17 NOpadding formLable">Data Per Page</label>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
							<select onChange={this.setLimit.bind(this)} value={this.state.limitRange} id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding  form-control">
								<option value="Not Selected" disabled>Select Limit</option>
								<option value={10}>10</option>
								<option value={25}>25</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
								<option value={500}>500</option>
							</select>
						</div>
					</div>
				:
				null        
	       	}
	       	{
	       		this.state.tableObjects.searchApply === true ? 
		       		<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-xs-12 col-sm-12 marginTop17 NOpadding pull-right">
		        		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding formLable">Search</label>
		        		<div className="input-group">
					        <input type="text" onChange={this.tableSearch.bind(this)} className="NOpadding-right form-control" ref="tableSearch" id="tableSearch" name="tableSearch"/>
					    	<span className="input-group-addon"><i className="fa fa-search"></i></span>
					    </div>
		        	</div>	
	        	:
	        	null
	       	}
					
	            <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop17">			            	        
	                <div className="table-responsive">
						<table className="table iAssureITtable-bordered table-striped table-hover">
	                        <thead className="">	     
		                        <tr className="tempTableHeader">
		                            { this.state.twoLevelHeader.apply === true ?
		                            	this.state.twoLevelHeader.firstHeaderData.map((data, index)=>{
		                            		return(
												<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>			
		                            		);		                            		
		                            	})	
		                            	:
		                            	null									
									}
	                            </tr>
	                            <tr className="tempTableHeader1">
	                            {/*<th className="textAlignCenter">
									<input type="checkbox" />
								</th>*/}
	                            <th className="umDynamicHeader srpadd textAlignLeft">Select</th>
								{this.state.showUpgradation === 'Yes'?
	                            	<th className="umDynamicHeader srpadd textAlignLeft">Upgraded</th>	
								:null}

	                            <th className="umDynamicHeader srpadd textAlignLeft">Sr.No.</th>
		                            { this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map( 
											([key, value], i)=> {
													if(key === 'actions'){
														return(
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value}</th>
														);	
													}else{
														return(
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);	
													}
																							
											}
										) 
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
	                            </tr>
	                        </thead>
	                        <tbody>
	                           { this.state.tableData && this.state.tableData.length > 0 ?
	                           		this.state.tableData.map( 
										(value, i)=> {			
											return(
												<tr key={i} className="">
													<td className="textAlignCenter checkboxContainer">													
														<input type="checkbox" checked={this.state[value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary]?true:false} id={value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary} onChange={this.selectBeneficiary.bind(this)}/>
														<span className="checkboxMark"></span>
													</td>
													{
														this.state.showUpgradation === 'Yes'?
														<td className="textAlignCenter checkboxContainer">
															<input type="checkbox" checked={this.state[value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary+'|upgrade']?true:false} id={value._id+'|'+value.beneficiary_ID+'|'+value.beneficiaryID+'|'+value.family_ID+'|'+value.familyID+'|'+value.nameofbeneficiary+'|'+value.relation+'|'+value.dist+'|'+value.block+'|'+value.village+'|'+value.caste+'|'+value.incomeCategory+'|'+value.landCategory+'|'+value.specialCategory+'|'+value.genderOfbeneficiary+'|'+value.birthYearOfbeneficiary+'|upgrade'} onChange={this.selectBeneficiary.bind(this)}/>
															<span className="checkboxMark"></span>
														</td>
														:
														null
													}
													<td className="textAlignCenter">{this.state.startRange+1+i}</td>
													{
														Object.entries(value).map( 
															([key, value1], i)=> {
																if($.type(value1) === 'string'){
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex,'') : '';
																	var aN = value2.replace(this.state.reA, "");
																	if(aN && $.type( aN ) === 'string'){
																		var textAlign = 'textAlignLeft';
																	}else{
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		if(bN){
																			var textAlign = 'textAlignRight';
																		}else{
																			var textAlign = 'textAlignLeft';
																		}
																	}
																}else{
																	var textAlign = 'textAlignRight';
																}	
																var found = Object.keys(this.state.tableHeading).filter((k)=> {
																  return k === key;
																});
																if(found.length > 0){
																	if(key !== 'id'){
																		return(<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																	}
																}

															}
														)
													}
													{this.state.tableHeading && this.state.tableHeading.actions ? 
														<td className="textAlignCenter">
															<span>
																<i className="fa fa-pencil" title="Edit" id={value._id} onClick={this.edit.bind(this)}></i>&nbsp; &nbsp; 
																{this.props.editId && this.props.editId === value._id? null :<i className={"fa fa-trash redFont "+value._id} id={value._id+'-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-"+value._id}></i>}
															</span>
															<div className="modal fade" id={"showDeleteModal-"+value._id} role="dialog">
		                                                        <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                                          <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
		                                                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                                            <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
		                                                              <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-"+value._id}>&times;</button>
		                                                            </div>
		                                                           
		                                                            </div>
		                                                            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                                              <h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to delete?</h4>
		                                                            </div>
		                                                            
		                                                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
		                                                                <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
		                                                              </div>
		                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
		                                                                <button onClick={this.delete.bind(this)} id={value._id} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
		                                                              </div>
		                                                            </div>
		                                                          </div>
		                                                        </div>
		                                                    </div>
														</td>
														:
														null
													}
												</tr>
											);										
										}
									) 	
									:
									<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length+3 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>               		

									// <tr className="trAdmin"><td colSpan={this.state.tableHeading && this.state.showUpgradation === 'Yes' ? Object.keys(this.state.tableHeading).length+2 : this.state.showUpgradation === 'Yes'? 2 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>               		
								}
	                    </tbody>
	                    </table>
	                    {
	                    	this.state.tableObjects.paginationApply === true ?
		                    	this.state.tableData && this.state.tableData.length > 0 ?
		                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paginationAdminWrap">
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
					                    		this.state.limitRange >=  this.state.dataLength?		                    		
						                    	null
						                    	:
				                    			<div className="btn btn-primary" onClick={this.showFirstTweentyButtons.bind(this)} title="Fast Backward"><i className="fa fa-fast-backward"></i></div>
				                    	}
			                    	</div>
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
				                    		this.state.limitRange >=  this.state.dataLength?                  		
					                    	null
					                    	:
					                    	<div className="btn btn-primary" onClick={this.showPreviousPaginationButtons.bind(this)} title="Previous"><i className="fa fa-caret-left"></i></div>
					                    }
				                    </div>
									<ol className="questionNumDiv paginationAdminOES col-lg-8 col-md-8 col-sm-8 col-xs-8 mainExamMinDeviceNoPad">										 
										{this.state.paginationArray}
									</ol>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.paginationArray.length < 20 ?
											null
											:
											<div className="btn btn-primary" onClick={this.showNextPaginationButtons.bind(this)} title="Next"><i className="fa fa-caret-right"></i></div>
										}
									</div>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.paginationArray.length < 20 ?
											null
											:
											<div className="btn btn-primary" onClick={this.showLastTweentyButtons.bind(this)} title="Fast Forward"><i className="fa fa-fast-forward"></i></div>
										}
									</div>							
								</div>
								:
								null
							:
							null
	                    }
	                    
	                </div>                        
	            </div>
            </div>
	    );
		
	} 

}

export default withRouter(IAssureTable);