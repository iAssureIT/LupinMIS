import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import ReactHTMLTableToExcel        from 'react-html-table-to-excel';
import IAssureTableTable            from "../../../centres/IAssureTableFilewise/IAssureTable.js";
import { Link } from 'react-router-dom';

import './IAssureTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';

var sum = 0;
class IAssureTable extends Component { 
	constructor(props){
		super(props);
	    // console.log('this.props',this.props)
		this.state = {
			"totalDataCount" 	    	: props && props.dataCount ? props.dataCount : 0,
		    "tableData" 				: props && props.tableData ? props.tableData : [],
		    "filterData" 				: props && props.filterData ? props.filterData : "",
		    "downloadData" 				: props && props.downloadData ? props.downloadData : [],
		    "tableName" 				: props && props.tableName ? props.tableName : [],
		    "tableHeading"				: props && props.tableHeading ? props.tableHeading : {},
		    "twoLevelHeader" 			: props && props.twoLevelHeader ? props.twoLevelHeader : {},
		    "tableObjects" 				: props && props.tableObjects ? props.tableObjects : {},		    
		    "deleteMethod" 				: props && props.deleteMethod ? props.deleteMethod : {},		    
		    "id" 			      	    : props && props.id ? props.id : {},		    
		    "reA" 						: /[^a-zA-Z]/g,
		    "reN" 						: /[^0-9]/g,
		    "sort" 	  					: true,
		    "examMasterData2" 			: '',
		    "activeClass" 				: 'activeCircle',
		    "paginationArray" 			: [],
		    "startRange" 	      	    : props && props.startRange  ? props && props.startRange  : 0,		    
		    "limitRange" 	      	    : props && props.limitRange ? props && props.limitRange : 10,		    
		    // "startRange" 				: 0,
		    // "limitRange" 				: 10,
		    "activeClass" 				: 'activeCircle', 		    
		    "normalData" 				: true,
		    "printhideArray"			: [],
		    "prevData"      			: [],
		}
		
		this.delete = this.delete.bind(this);
		this.printTable = this.printTable.bind(this);

		var tableHeading = Object.keys(props.tableHeading);

		var index = 0;
		// console.log("props.twoLevelHeader.firstHeaderData",props.twoLevelHeader.firstHeaderData.length);
		if (props.twoLevelHeader) {
	       if (props.twoLevelHeader.firstHeaderData && props.twoLevelHeader.firstHeaderData.length > 0) {
				for(let j=0; j< props.twoLevelHeader.firstHeaderData.length; j++){
					var mergCol = props.twoLevelHeader.firstHeaderData[j].mergedColoums;
					if(j===1){
						mergCol--;
					}

					for(let k=0; k<mergCol; k++){
						if(props.twoLevelHeader.firstHeaderData[j].hide){
							var phElem = {col:tableHeading[index], printhide:"printhide"};
						}else{
							var phElem = {col:tableHeading[index], printhide:""};
						}

						this.state.printhideArray.push(phElem);
						// console.log(index," this.state.printhideArray = ",phElem);
						index++;
					}
				}

				if(index === tableHeading.length){
					// console.log("this.state.printhideArray = ",this.state.printhideArray);
				}

	       }
	    }

	}

 
	componentDidMount() {
	    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
	    $("html,body").scrollTop(0); 
	    const center_ID = localStorage.getItem("center_ID");
	    const centerName = localStorage.getItem("centerName");
	    // console.log('this.props.downloadData',this.props.downloadData)
	    this.setState({
		    center_ID    	: center_ID,
		    centerName   	: centerName,
		    tableHeading    : this.props.tableHeading,
	      	tableData 	    : this.props.tableData,
	      	filterData 	    : this.props.filterData,
		    downloadData 	: this.props.downloadData,
	      	tableName 	    : this.props.tableName,
	      	id 			    : this.props.id,
	    },()=>{
	    	this.getDwldData()
		    // this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);
	    }); 
	}
	componentWillReceiveProps(nextProps) {
      	// var remainingDataLength  = this.state.totalDataCount - this.state.tableData.length;
		if(nextProps){
	        this.setState({
	            id	            : nextProps.id,
	            tableData	    : nextProps.tableData,
	            tableName	    : nextProps.tableName,
	            totalDataCount  : nextProps.dataCount,
	            filterData 	    : nextProps.filterData,
	        },()=>{
        		// console.log("remainingDataLength",remainingDataLength,"this.state.tableData.length",this.state.tableData.length)
	        })
		}
    }


	edit(event) {
		event.preventDefault();
		$("html,body").scrollTop(0);
		var tableObjects = this.props.tableObjects;
		var id = event.target.id;
		this.props.history.push(tableObjects.editUrl + "/" + id);
	}
    delete(e){
	  	e.preventDefault();
	  	var tableObjects =  this.props.tableObjects;
	  	var deleteMethod =  this.props.deleteMethod;
		let id = e.target.id;
		axios({
	        method: deleteMethod ? deleteMethod : 'delete',
	        url: tableObjects.apiLink+id
	    }).then((response)=> {
	    	this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);
	        this.props.history.push(tableObjects.editUrl);
	        swal({
	        	text : response.data.message,
	        	title : response.data.message
	        });
	    }).catch(function (error) {
	        console.log('error', error);
	    });
    } 
    sortNumber(key, tableData){
    	// console.log('tableData.......',key,tableData);
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
    // console.log('tableData',key,tableData);
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
    // console.log('tableData',key,tableData);
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
    // console.log('tableData',key,tableData);
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




	getPagination(event){
		var totalDataCount 		= this.state.totalDataCount;

		const id = event.currentTarget.id;
		this.state.filterData.startRange 	= this.state.tableData.length;
		this.state.filterData.appendArray 	= true;

		switch(id){
			case "get100" : 
				this.state.filterData.limitRange 	= 100; 		break;
			case "get1000" : 
				this.state.filterData.limitRange 	= 1000; 	break;
			case "getAll" : 
				this.state.filterData.limitRange 	= totalDataCount;		break;
		}

		this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);					

	}






	getStartEndNum(event){	
		// console.log('getStartEndNum');	
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2     = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		// this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);
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
				this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);
				// this.props.getData(this.state.startRange, this.state.limitRange);
			}	
			if(this.state.searchData === true){
				this.tableSearch();
			}
		});	
	}

    printTableCenter(event){
    	event.preventDefault();
		var printContents = document.getElementById('section-to-screen').innerHTML;    
   		var originalContents = document.body.innerHTML;      
		document.body.innerHTML = printContents;     
  		window.print();     
  		document.body.innerHTML = originalContents;
    }

	tableSearch(){
		// console.log('this.props',this.props)
    	var searchText = this.refs.tableSearch.value.trim();
		if(searchText && searchText.length !== 0) {
			this.setState({
				"normalData"  : false,
				"searchData"  : true,
			},()=>{
				this.props.getSearchText(searchText);
			});	    	
	    }else{
			this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);
	    }    	 
    }
    printTable(event){
    	// event.preventDefault();
       
        var DocumentContainer = document.getElementById('section-to-screen');

	    var WindowObject = window.open('', 'PrintWindow', 'height=400,width=600');
	    WindowObject.document.write(DocumentContainer.innerHTML);
	    WindowObject.document.close();
	    WindowObject.focus();
	    WindowObject.print();
	    WindowObject.close();
    }
    getDwldData(){
		this.props.getData(this.state.filterData ? this.state.filterData : this.state.startRange, this.state.limitRange, this.state.center_ID);
    }
 
	render() {
        return (
	       	<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12">	
	       		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
			       	{
			       		this.state.tableObjects.searchApply === true ? 
				       		<div className="col-lg-4 col-md-4  col-xs-12 col-sm-12 marginTop8 NOpadding pull-left">
				        		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding formLable">Search</label>
				        		<div className="input-group inputBox-main">
							        <input type="text" onChange={this.tableSearch.bind(this)} className="NOpadding-right form-control inputBox" ref="tableSearch" id="tableSearch" name="tableSearch"/>
							    	<span className="input_status input-group-addon "><i className="fa fa-search"></i></span>
							    </div>
				        	</div>	
			        	:
			        	null
			       	}




			{ 
			       		this.state.tableObjects.downloadApply === true ?
		                	this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length !== 0 && !this.state.downloadData ?
		                	// this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length > 0 && this.state.downloadData.length ===0?
				                <React.Fragment>
				                    <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
				                        <button type="button" className="btn pull-left tableprintincon" title="Print Table" onClick={this.printTable}><i className="fa fa-print" aria-hidden="true"></i></button>
				                           <ReactHTMLTableToExcel
				                                id="table-to-xls"                           
				                                className="download-table-xls-button fa fa-download tableicons pull-right"
				                                table={this.state.id}
				                                sheet="tablexls"
				                                filename={this.state.tableName}
				                                buttonText=""/>

				                            <IAssureTableTable 
					                          tableName = {this.state.tableName}
					                          id = {this.state.id}
					                          displayTable = "displayTable"
					                          data={this.props.propsdata}
					                          getData={this.getDwldData.bind(this)}
					                          tableHeading={this.props.tableHeading}
				                          	  twoLevelHeader={this.props.twoLevelHeader} 
					                          tableData={this.state.tableData}
					                          tableObjects={this.state.tableObjects}                          
					                        />
				                    </div>
				                </React.Fragment>
		                    : null
		                
		                : null
		            }   
					{/*console.log("this.state.downloadData && this.state.downloadData.length > 0 && this.state.id && this.state.tableName && this.state.tableData.length !== 0  && this.state.downloadData.length !== 0",this.state.downloadData && this.state.downloadData.length > 0 && this.state.id && this.state.tableName && this.state.tableData.length !== 0  && this.state.downloadData.length !== 0)*/}
		           	{ this.state.tableObjects.downloadApply === true ?
		                this.state.downloadData && this.state.downloadData.length > 0 && this.state.id && this.state.tableName && this.state.tableData.length !== 0  && this.state.downloadData.length !== 0 ?

		            // { this.state.tableObjects.downloadApply === true ?
		            //     this.state.downloadData && this.state.id && this.state.tableName && this.state.tableData.length !== 0  && this.state.downloadData.length !== 0 ?
		                // this.state.id && this.state.tableName ?
			                <React.Fragment>
			                    <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
			                        <button type="button" className="btn pull-left tableprintincon" title="Print Table" onClick={this.printTable}><i className="fa fa-print" aria-hidden="true"></i></button>
			                           <ReactHTMLTableToExcel
			                                id="table-to-xls"                           
			                                className="download-table-xls-button fa fa-download tableicons pull-right"
			                                table={this.state.id}
			                                sheet="tablexls"
			                                filename={this.state.tableName}
			                                buttonText=""
			                            />
			                            <IAssureTableTable 
				                          tableName = {this.state.tableName}
				                          id = {this.state.id}
				                          displayTable = "displayTable"
				                          data={this.props.propsdata}
				                          getData={this.getDwldData.bind(this)}
				                          tableHeading={this.props.downloadtableHeading}
			                          	  twoLevelHeader={this.props.twoLevelHeader} 
				                          tableData={this.state.downloadData}
				                          tableObjects={this.state.tableObjects}                          
				                        />
			                    </div>
			                </React.Fragment>
		                    : null
		                
		                : null
		            }   

                	{/*console.log("this.state.downloadDataaaaaaaaaaaaaa",this.state.downloadData,!this.state.downloadData)*/}
		            {/*console.log("this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length > 0  && this.state.downloadData.length ===0",this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length > 0  && this.state.downloadData.length ===0)*/}
		            {/*console.log("this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length !== 0 && !this.state.downloadData  && this.state.downloadData.length ===0",this.state.tableData , this.state.id , this.state.tableName , this.state.tableData.length !== 0 , this.state.downloadData.length ===0)*/}
			       
			  
				</div>
		                
	       	{
	       		this.state.tableObjects.paginationApply === true ?
		       		<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding pull-right">
			       		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
							<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop8 NOpadding formLable">Data Per Page</label>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding  input-group inputBox-main">
								<select onChange={this.setLimit.bind(this)} value={this.state.limitRange} id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12 inputBox noPadding  form-control">
									<option value="Not Selected" disabled>Select Limit</option>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
									<option value={100}>100</option>
									<option value={500}>500</option>
								</select>
							</div>
						</div>						
					</div>
				:
				null        
	       	}
		    
		  
           
	            <div className={this.props.divClass ? this.props.divClass+" col-sm-12 col-md-12 col-xs-12 NOpadding" : "col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding"}>
	            	{/*========================================================================================
	            			We will have two tables... One to display on screen and one to print.							
					   ======================================================================================== */}


	            	{/* ===  Display Table === */}
					{/*
	                <div className={!this.props.divClass ? "table-responsive" : ""}  id="section-to-print">
						<table className="table iAssureITtable-bordered table-striped table-hover fixedTable" id={this.state.id}>
	                <div className={!this.props.divClass ? "table-responsive commonHeaderFixTable" : "commonHeaderFixTable"} id="section-to-screen">
					*/}
	                <div className={"table-responsive commonHeaderFixTable " + this.props.customTableHeight} id="section-to-screen">
						<table className={"table iAssureITtable-bordered table-striped table-hover fixedTable "+ this.props.tableClass} id="commonTable">
	                        <thead className="">	     
		                        <tr className="tempTableHeader">
		                            { this.state.twoLevelHeader.apply === true ?
		                            	this.state.twoLevelHeader.firstHeaderData.map((data, index)=>{
		                            		return(
												<th scope="col" key={index} style={{top: 0, height: "34px"}} colSpan={data.mergedColoums}  className={"umDynamicHeader srpadd colorTable textAlignCenter " + (data.hide ? "printhide" :"")}>{data.heading}</th>			
		                            		);		                           		
		                            	})	
		                            	:
		                            	null									
									}
	                            </tr>
	                            <tr className="tempTableHeader1">
									{
										!this.props.noSRNumber ?
	                            			<th scope="col"  className="umDynamicHeader srpadd text-center">
												<div className="colSr">Sr.No.</div>
	                            			</th>
	    								:null
	    							}
		                            { this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map( 
											([key, value], i)=> {
													if(key === 'actions'){
														return(
															<th scope="col"  key={i} id={key} className={"umDynamicHeader srpadd  textAlignLeft printhide colorRow-"+this.state.tableObjects.component}>
																<div className={"wrapWord col"+(i+1)}>{value}</div>
															</th>
														);	
													}else{
														return(
															<th scope="col"  key={i} id={key}  className={"umDynamicHeader srpadd textAlignLeft "+(this.state.printhideArray[i] ? this.state.printhideArray[i].printhide : "" )}>
																<div className={"wrapWord col"+(i+1)}>{value}</div>
															    <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);	
													}
																							
											}
										) 
										:
										<th scope="col"  className="umDynamicHeader srpadd textAlignLeft"></th>
									}
	                            </tr>
	                        </thead>
	                        <tbody className={this.state.tableData && this.state.tableData.length > 0 ? "scrollContent" : ""}>
	                            {console.log("this.props.showData",this.props.showData)}
	                            {	
	                            	this.props.showData ? 
		                            	this.state.tableData 
		                            	?
				                             
				                            	this.state.tableData.length > 0 
				                            	?
					                           		this.state.tableData.map( 
														(value, i)=> {
															return(
																<tr key={i} className={"tablerow "+"trow"+(i+1)}>

																	{/*console.log('Object.entries(value)', (Object.entries(value)[1][1]) , (Object.entries(value)[1][1] !=="-"))*/}
																	{
																		!this.props.noSRNumber ?
																		// {
																			// ((Object.entries(value)[1][1]) && (Object.entries(value)[1][1] !=="-" && Object.entries(value)[1][1] !=="Total" && Object.entries(value)[1][1] !=="Total %") && !(Object.entries(value)[1][1].includes('%')) && !(Object.entries(value)[1][1].includes('Total')) )
																			// ((Object.entries(value)[1][1]) && !(Object.entries(value)[1][1].includes('%')) && !(Object.entries(value)[1][1].includes('Total')) && !(Object.entries(value)[1][1].includes('-')))
																			((Object.entries(value)[1][1]) , (Object.entries(value)[1][1] !=="-" && Object.entries(value)[1][1] !=="Total" && Object.entries(value)[1][1] !=="Total %") && !(Object.entries(value)[1][1].includes('%')) && !(Object.entries(value)[1][1].includes('Total')))
																			?
																				<td className="textAlignCenter">
																					<div className="colSr">{0+1+i}</div>
																				</td>
																			:
																				<td className="textAlignCenter">
																					<div className="colSr"></div>
																				</td>
																		// }
																		: null
																	}
																	{
																		Object.entries(value).map( 
																			([key, value1], i)=> {
																				if($.type(value1) === 'string'){
																					var numbers = /^[0-9]+$/;

																					if(value1.includes(',')){
																						var textAlign = 'textAlignRight';
																					}else if(value1.includes('%') && ( value1.match(numbers)) || value1.includes('0')){
																						var textAlign = 'textAlignRight';
																					}else if(value1.match(numbers)){
																						var textAlign = 'textAlignRight';
																					}else{
																						var regex = new RegExp(/(<([^>]+)>)/ig);
																						var value2 = value1 ? value1.replace(regex,'') : '';
																						var aN = value2.replace(this.state.reA, "");
																						if(aN && $.type( aN ) === 'string'){
																							var textAlign = 'textAlignLeft noWrapText '+ (this.state.printhideArray[i-1] ? this.state.printhideArray[i-1].printhide : "");
																						}else{
																							var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																							if(bN){
																								var textAlign = 'textAlignRight ' + (this.state.printhideArray[i-1] ? this.state.printhideArray[i-1].printhide : "");
																							}else{
																								var textAlign = 'textAlignLeft noWrapText ' + (this.state.printhideArray[i-1] ? this.state.printhideArray[i-1].printhide : "");
																							}
																						}
																					}
																				}else{
																					// console.log(i," printhide = ",this.state.printhideArray[i].printhide);
																					var textAlign = 'textAlignRight ' + (this.state.printhideArray[i-1] ? this.state.printhideArray[i-1].printhide : "") ;
																				}	
																				var found = Object.keys(this.state.tableHeading).filter((k)=> {
																				  return k === key;
																				});
																				if(found.length > 0){
																					if(key !== 'id'){
																						return(<td className={textAlign} key={i}><div className={textAlign+" col"+i } dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																					}
																				}

																			}
																		)
																	}
																	{this.state.tableHeading && this.state.tableHeading.viewactions ? 
																		<td className="textAlignCenter">
																			<span className="actionDiv">
																				{this.props.viewTable ? 
																					<React.Fragment>
																						<Link to={"/"+ this.props.viewLink +"/"+value._id}>
																			     			<i className="fa fa-eye" title="View"></i>&nbsp; &nbsp;
																			     		</Link>
																			     	</React.Fragment>
																					: 
																				null}
																			</span>
																		</td>
																		:
																		null
																	}

																	{this.state.tableHeading && this.state.tableHeading.actions ? 
																		<td className="textAlignCenter">
																			<span className="actionDiv">
																				{this.props.viewTable ? 
																					<React.Fragment>
																						<Link to={"/"+ this.props.viewLink +"/"+value._id}>
																			     			<i className="fa fa-eye" title="View"></i>&nbsp; &nbsp;
																			     		</Link>
																			     	</React.Fragment>
																					: 
																				null}
																				{this.props.tableObjects.editUrl ?
																				<i className="fa fa-pencil" title="Edit" id={value._id.split("-").join("/")} onClick={this.edit.bind(this)}></i>:null}&nbsp; &nbsp; 
																			{/*	{this.props.editId ? <i className="fa fa-pencil" title="Edit" id={value._id} onClick={this.edit.bind(this)}></i> : null }&nbsp; &nbsp; */}
																				{/*console.log('value._id',value._id)*/}
																				{this.props.editId && this.props.editId === value._id
																					? 
																						null 
																					:
																						<i className={"fa fa-trash redFont "+value._id} id={value._id+'-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-"+value._id }></i>
																				}
																			</span>
																			<div className="modal fade" id={"showDeleteModal-"+value._id} role="dialog">
						                                                        <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
						                                                          <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
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
						                                                                <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
						                                                              </div>
						                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						                                                                <button onClick={this.delete.bind(this)} id={value._id} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
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
													<tr className="trAdmin">
														<td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length+1 : 1} className="noTempData textAlignCenter">
															No Record Found!
														</td>
													</tr>               		
											
										:
											<tr className="trAdmin">
												<td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length+1 : 1} className="noTempData textAlignCenter">
													<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
													<span className="sr-only">Loading...</span>									
												</td>
											</tr>     
									:
										<tr className="trAdmin">
											<td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length+1 : 1} className="noTempData textAlignCenter">
												<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
												<span className="sr-only">Loading...</span>									
											</td>
										</tr>        
	                            }	

	                    	</tbody>
	                    </table>
	                    {/*console.log("this.state.tableObjects.paginationapply",this.state.tableObjects.paginationapply, this.state.totalDataCount)*/}
	                    {
	                    	this.state.tableObjects.paginationapply === true ?
		                    	this.state.tableData && this.state.tableData.length > 0 ?
		                    		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding mb15">
				                    	{ 
				                    		this.state.tableData.length <=  this.state.totalDataCount && this.state.tableData.length !== this.state.totalDataCount
				                    		?		                    		
			                    				<div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 showText noPadding"><b>{(this.state.totalDataCount-this.state.tableData.length)+ " More records"}</b></div>
					                    	:
			                    				null
				                    	}
				                    	{ 
				                    		this.state.tableData.length ===  this.state.totalDataCount
				                    		?		                    		
			                    				<div className="btn col-lg-2 col-md-3 col-sm-4 col-xs-6 showText noPadding"><b>{"Shown all " + (this.state.totalDataCount) + " records"}</b></div>
					                    	: 
					                    		null
				                    	}
			                    		{ 
				                    		( (this.state.totalDataCount - this.state.tableData.length) > 0)
				                    		?		                    		
			                    				<button id="get100" className="btn btn-default col-lg-2 col-lg-offset-1  col-md-3 col-sm-4 col-xs-6" onClick={this.getPagination.bind(this)} ><small> { (this.state.totalDataCount - this.state.tableData.length) < 100 ?  "Show "+(this.state.totalDataCount-this.state.tableData.length) : "Show 100 more >>"}<br/> <small>(~ 1-3 Sec)</small> </small> </button>
					                    	:
					                    		null
				                    	}
			                    		{ 
				                    		( (this.state.totalDataCount - this.state.tableData.length) > 1000)
				                    		?		                    		
			                    				<button id="get1000" className="btn btn-default col-lg-2  col-lg-offset-1 col-md-3 col-sm-4 col-xs-6" onClick={this.getPagination.bind(this)} > <small> Show 1000 more >> <br/> <small>(~ 10-20 Sec)</small> </small>  </button>
					                    	:
					                    		null
				                    	}
			                    		{/* 
				                    		( (this.state.totalDataCount - this.state.tableData.length) > 0)
				                    		?		                    		
			                    				<button id="getAll" className="btn btn-default col-lg-2 col-lg-offset-1 col-md-3 col-sm-4 col-xs-6" onClick={this.getPagination.bind(this)} ><small> Show All records >> <br/> <small>(Depend on volume of data)</small> </small></button>
					                    	:
					                    		null
				                    	*/}
			                    	</div>
		                    	: null
	                    	: null
	                    }

	                    {
	                    	this.state.tableObjects.paginationApply === true ?
		                    	this.state.tableData && this.state.tableData.length > 0 ?
		                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paginationAdminWrap">
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
					                    		this.state.limitRange >=  this.state.dataLength
					                    		?
						                    		null
						                    	:
				                    				<div className="btn btn-primary" onClick={this.showFirstTweentyButtons.bind(this)} title="Fast Backward"><i className="fa fa-fast-backward"></i></div>
				                    	}
			                    	</div>
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
				                    		this.state.limitRange >=  this.state.dataLength
				                    		?
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
											this.state.paginationArray.length < 20 
											?
												null
											:
												<div className="btn btn-primary" onClick={this.showNextPaginationButtons.bind(this)} title="Next"><i className="fa fa-caret-right"></i></div>
										}
									</div>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.paginationArray.length < 20 
											?
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