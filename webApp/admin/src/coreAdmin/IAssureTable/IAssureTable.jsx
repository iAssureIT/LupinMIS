import React, { Component }       	from 'react';
import {withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import ReactHTMLTableToExcel        from 'react-html-table-to-excel';
import IAssureTableTable            from '../../admin/IAssureTable/IAssureTable.js';

import './IAssureTable.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import './print.css';
var sum = 0;
class IAssureTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			"dataCount" 				: props && props.dataCount ? props.dataCount : [],
		    "tableData" 				: props && props.tableData ? props.tableData : [],
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
		    "startRange" 				: 0,
		    "limitRange" 				: 1000000000,
		    "activeClass" 				: 'activeCircle', 		    
		    "normalData" 				: true,
		    "printhideArray"			: [],
		    "colorArray"	      		: ["red", "yellow", "green"],
		    "role"						: localStorage.getItem("role"),
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
						if(props.twoLevelHeader.firstHeaderData[j].color){
							var colorElem = {col:tableHeading[index], color:"color"};
						// console.log(index," this.state.colorElem ============ ",colorElem);
						}else{
							var colorElem = {col:tableHeading[index], color:""};
						// console.log(index," this.state.colorElem = ",colorElem);
						}
						this.state.colorArray.push(colorElem);
						// console.log(index," this.state.colorArray = ", this.state.colorArray ,colorElem);
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
	    // console.log("localStorage =",localStorage.getItem('centerName'));
	    // console.log("localStorage =",localStorage);
	    this.setState({
	      center_ID    : center_ID,
	      centerName   : centerName,
	    },()=>{
		    // this.props.getData(this.props.data ? this.props.data : this.state.startRange, this.state.limitRange, this.state.center_ID);
	    }); 
	      
		// this.palindrome('Moam');
		this.setState({
			tableHeading	: this.props.tableHeading,
      		downloadData    : this.props.downloadData,
			tableData 		: this.props.tableData,
			tableName 		: this.props.tableName,
			dataCount 		: this.props.dataCount,
			id 				: this.props.id,
		});
		/*if(this.state.id){
	      	var tableOffset = $("#"+this.state.id).offset().top;
	      	console.log('tableOffset',tableOffset);
	      	$(window).bind("scroll", function() {
			    var offset = $(this).scrollTop();
			    console.log('offset',offset);
	      		if (offset > tableOffset) {
	      			console.log('here');
	      			$(".fixedHeader").css({"color": "yellow", "position" : "fixed", "overflow" : "auto","top" : "0px"});
			    }
			    else if (offset < tableOffset || offset===0) {
	      			console.log('else here');
				        $(".fixedHeader").css({"color": "blue"});
			    }else{
			        $(".fixedHeader").css({"color": "blue"});
			    }
			});
		}*/
	    this.paginationFunction();
	}
	componentWillReceiveProps(nextProps) {
		// console.log('tableData',nextProps.tableData);
        this.setState({
            id	            : nextProps.id,
            tableData	    : nextProps.tableData,
            tableName	    : nextProps.tableName,
  			downloadData    : nextProps.downloadData,
            dataCount 		: nextProps.dataCount,
        },()=>{
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
		// console.log('tableObjects.editUrl+id',tableObjects.editUrl,id)
		this.props.history.push(tableObjects.editUrl+id);
	}
    delete(e){
	  	e.preventDefault();
	  	var tableObjects =  this.props.tableObjects;
		let id = e.target.id;
	 //       console.log('deleteMethodresponse', id);
		// console.log("tableObjects",tableObjects.apiLink+id);
	        // console.log('tableObjects', tableObjects);
		axios({
	        method: tableObjects.deleteMethod ? tableObjects.deleteMethod : 'delete',
	        url: tableObjects.apiLink+id
	    }).then((response)=> {
	        if(tableObjects.apiLink==='/api/units/'){
				$('#'+id).css({"display": "none"})
				$('#unitModal').css({"display": "block"})
	        }


	    	// this.props.isDeleted()
/*
	        method: this.props.deleteMethod ? this.props.deleteMethod :'delete',
	        url: tableObjects.apiLink+id
	    }).then((response)=> {
*/
	    	this.props.getData(this.props.data ? this.props.data : this.state.startRange, this.state.limitRange, this.state.center_ID);
	        swal({
	        	text : response.data.message,
	        	title : response.data.message
	        });
	        this.props.history.push(tableObjects.editUrl);
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
		// console.log('getStartEndNum');	
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2     = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		this.props.getData(this.props.data ? this.props.data : startRange, limitRange);
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
				this.props.getData(this.props.data ? this.props.data : startRange, this.state.limitRange);
			}	
			if(this.state.searchData === true){
				this.tableSearch();
			}
		});	
	}
	tableSearch(){
    	var searchText = this.refs.tableSearch.value;
		if(searchText && searchText.length !== 0) {
			this.setState({
				"normalData"  : false,
				"searchData"  : true,
			},()=>{
				this.props.getSearchText(searchText, this.state.startRange, this.state.limitRange);
			});	    	
	    }else{
			this.props.getData(this.props.data ? this.props.data : this.state.startRange, this.state.limitRange);
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
				// console.log('showPreviousPaginationButtons paginationArray',paginationArray);
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
				// console.log('showPreviousPaginationButtons paginationArray',paginationArray);
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
				// console.log('paginationArray',paginationArray);
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
    printTable(event){
    	// event.preventDefault();
       
        var DocumentContainer = document.getElementById('section-to-print');

	    var WindowObject = window.open('', 'PrintWindow', 'height=400,width=600');
	    WindowObject.document.write(DocumentContainer.innerHTML);
	    WindowObject.document.close();
	    WindowObject.focus();
	    WindowObject.print();
	    WindowObject.close();
    }
    getDwldData(){
	    this.props.getData(this.props.data ? this.props.data : this.state.startRange, this.state.limitRange, this.state.center_ID);
    }
	render() {
		// console.log('paginationArray***',this.state.paginationArray);
		// console.log('dataLength***',this.state.dataLength);
		// console.log('dataCount***',this.state.dataCount);
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
			       	{ this.state.tableObjects.downloadApply === true ?
		                this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length !== 0 && !this.state.downloadData ?
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
		            {/*console.log("this.state.downloadData",this.state.downloadData)*/}
		            {/*console.log("this.state.id",this.state.id)*/}
		            { this.state.tableObjects.downloadApply === true ?
		                this.state.downloadData && this.state.id && this.state.tableName && this.state.downloadData.length !== 0 ?
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
	            	<div className={!this.props.divClass ?  "table-responsive commonHeaderFixTable " + this.props.customTableHeight : "table-responsive commonHeaderFixTable"} id="section-to-screen">
						<table className={"table iAssureITtable-bordered table-striped table-hover fixedTable "+ this.props.tableClass} id="commonTable">
	                        <thead className="">	     
		                        <tr className="tempTableHeader">
		                            { this.state.twoLevelHeader.apply === true ?
		                            	this.state.twoLevelHeader.firstHeaderData.map((data, index)=>{
		                            		// console.log('dataIIIIIIIIIIIIIIIIIII',data,index);
		                            		return(
												<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd colorTable textAlignCenter">{data.heading}</th>			
		                            		);		                            		
		                            	})	
		                            	:
		                            	null									
									}
	                            </tr>
	                            <tr className="tempTableHeader1">
									{
										!this.props.noSRNumber ?
	                            			<th className="umDynamicHeader srpadd text-center">
												<div className="colSr">Sr.No.</div>
	                            			</th>
	    								:null
	    							}
		                            { this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map( 
											([key, value], i)=> {
													if(key === 'actions'){
														if (this.state.role !== "viewer") {
															return(
																<th key={i} className={"umDynamicHeader srpadd text-center col"+(i+1)}>
																	<div className={"wrapWord col"+(i+1)}>{value}</div>
																</th>
															);	
														}
													}else{
														return(
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">
															<div className={"wrapWord col"+(i+1)}>{value}</div>
															 <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);	
													}
																							
											}
										) 
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
	                            </tr>
	                        </thead>
	                        <tbody className={this.state.tableData && this.state.tableData.length > 0 ? "scrollContent" : ""}>
	                           	{ 
		                           	this.state.tableData 
		                           	?
		                           		this.state.tableData.length > 0 
		                           		?
			                           		this.state.tableData.map( 
												(value, i)=> {
													return(
														<tr key={i} className={"trow"+(i+1)}>
															{/*console.log("((Object.entries(value)[1][1]) && (Object.entries(value)[1][1] !=="-" && Object.entries(value)[1][1] !=="Total" && Object.entries(value)[1][1] !=="Total %") && !(Object.entries(value)[1][1].includes('%')) && !(Object.entries(value)[1][1].includes('Total')) && !(Object.entries(value)[1][1].includes('-')))")*/}
															{/*console.log("!(Object.entries(value)[1][1].includes('-'))",!(Object.entries(value)[1][1].includes('-')))*/}
															{/*console.log((Object.entries(value)[1][1]) , Object.entries(value)[1][1] !=="-" , Object.entries(value)[1][1] !=="Total" , Object.entries(value)[1][1] !=="Total %" , !(Object.entries(value)[1][1].includes('%')) , !(Object.entries(value)[1][1].includes('Total')) , !(Object.entries(value)[1][1].includes('-')))*/}
															{
																!this.props.noSRNumber ?
																	((Object.entries(value)[1][1]) , (Object.entries(value)[1][1] !=="-" && Object.entries(value)[1][1] !=="Total" && Object.entries(value)[1][1] !=="Total %") && !(Object.entries(value)[1][1].includes('%')) && !(Object.entries(value)[1][1].includes('Total')))
																	?
																		<td className="textAlignCenter">
																			<div className="colSr">{this.state.startRange+1+i}</div>
																		</td>
																	:
																		<td className="textAlignCenter">
																			<div className="colSr"></div>
																		</td>
																: null
															}
															{
																Object.entries(value).map( 
																	([key, value1], i)=> {
																		// console.log("key",key,"value1", value1);
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
																			var textAlign = 'textAlignRight';
																		}	
																		var found = Object.keys(this.state.tableHeading).filter((k)=> {
																		  return k === key;
																		});
																		// console.log('found',found);
																		if(found.length > 0){
																			if(key !== 'id'){
																				// console.log(' value1', value1);
																				if(value1){
																					return(<td className={textAlign} key={i}><div className={textAlign+" col"+i } dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																				}else{
																					return(<td className={textAlign} key={i}><div className={textAlign+" col"+i } dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																				}
																			}
																		}

																	}
																)
															}
															{this.state.tableHeading && this.state.tableHeading.actions && this.state.role !== "viewer"? 
																<td className="textAlignCenter">
																	<span className="actionsDiv">
																		<i className="fa fa-pencil" title="Edit" id={value._id.split("-").join("/")} onClick={this.edit.bind(this)}></i>&nbsp; &nbsp; 
																		{this.props.editId && this.props.editId === value._id? null :<i className={"fa fa-trash redFont "+value._id} id={value._id+'-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-"+value._id}></i>}
																	</span>
																	<div className="modal fade" id={"showDeleteModal-"+(value._id)} role="dialog">
				                                                        <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
				                                                          <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
				                                                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
				                                                            <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
				                                                              <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-"+(value._id)}>&times;</button>
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
				                                                                <button onClick={this.delete.bind(this)} id={(value._id).replace(/-/g, "/")} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
				                                                              </div>
				                                                            </div>
				                                                          </div>
				                                                        </div>
				                                                    </div>
																</td>
																:
																null
															}
															{this.state.tableHeading && this.state.tableHeading.action && this.state.role !== "viewer"? 
																<td className="textAlignCenter">
																	<span className="actionsDiv">
																	{/*console.log('this.props.editId',this.props.editId)*/}
																		{this.props.editId && this.props.editId === value._id? null :<i className={"fa fa-trash redFont "+value._id} id={value._id+'-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-"+value._id}></i>}
																	</span>
																	<div className="modal fade" id={"showDeleteModal-"+(value._id)} role="dialog">
				                                                        <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
				                                                          <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
				                                                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
				                                                            <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
				                                                              <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-"+(value._id)}>&times;</button>
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
				                                                                <button onClick={this.delete.bind(this)} id={(value._id).replace(/-/g, "/")} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
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
											<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length+1 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>               		
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
	                    <table className="table iAssureITtable-bordered table-striped table-hover fixedTable" id="header-fixed"></table>
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