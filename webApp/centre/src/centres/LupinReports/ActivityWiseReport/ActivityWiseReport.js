import React, { Component } from 'react';
import $                    from 'jquery';
import _                    from 'underscore';
import swal                 from 'sweetalert';
import axios                from 'axios';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./ActivityWiseReport.css";
import "../../Reports/Reports.css";

class ActivityWiseReport extends Component{
	constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10000000,
            "startDate"         : "",
            "sector"            : "all",
            "sector_ID"         : "all",
            "activity"          : "all",
            "activity_ID"       : "all",
            "subactivity"       : "all",
            "subActivity_ID"    : "all",
            "projectCategoryType": "all",
            "beneficiaryType"    : "all",
            "projectName"        : "all",
            "endDate"           : "",
            // "sector"            : "",
            // "sector_ID"         : "",
            // "center"            : "",
            // "center_ID"         : "",
            "twoLevelHeader"    : {
                apply           : true,
                firstHeaderData : [
                    {
                        heading : 'Activity Details',
                        mergedColoums : 7,
                        hide : false
                    },
                    {
                        heading : 'Achievement (Family No)',
                        // heading : 'Achievement',
                        mergedColoums : 2,
                        hide : false
                    },
                    {
                        heading : 'Financial Achievement "Rs. in Lakh"',
                        mergedColoums : 11,
                        hide : false
                    },
                ]
            },

            "tableHeading"      : {
                "projectCategoryType"           : 'Project Category',
                "projectName"                   : 'Project Name',
                "sectorName"                    : "Sector",
                "activityName"                  : "Activity",
                "subactivityName"               : "Subactivity",
                "unit"                          : 'Unit',
                "reach"                         : 'Reach',
                "familyUpgradation"             : 'Upgradation',
                "unitCost"                      : 'Unit Cost', 
                "quantity"                      : 'Phy Units', 
                "total"                         : "Financial Total 'Lakh'",
                "LHWRF"                         : 'LHWRF',
                "NABARD"                        : 'NABARD',
                "bankLoan"                      : 'Bank Loan',
                "directCC"                      : 'DirectCC',
                "indirectCC"                    : 'IndirectCC',
                "govtscheme"                    : 'Government',
                "other"                         : 'Others'
            },
            "tableObjects"        : {
                paginationApply     : false,
                downloadApply       : true,
                searchApply         : false,
            },   
        }
        window.scrollTo(0, 0);
        this.handleFromChange    = this.handleFromChange.bind(this);
        this.handleToChange      = this.handleToChange.bind(this);
      
        this.currentFromDate     = this.currentFromDate.bind(this);
        this.currentToDate       = this.currentToDate.bind(this);
        this.getAvailableSectors = this.getAvailableSectors.bind(this);        
    }
    componentDidMount(){
        const center_ID = localStorage.getItem("center_ID");
        const centerName = localStorage.getItem("centerName");
        this.setState({
          center_ID    : center_ID,
          centerName   : centerName,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);

        });
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getAvailableSectors();
        this.getAvailableProjects();
        this.year();
        // this.currentFromDate();
        // this.currentToDate();
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.getAvailableProjects();
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
           [event.target.name] : event.target.value
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        });
    } 
    getAvailableSectors(){
        axios({
          method: 'get',
          url: '/api/sectors/list',
        }).then((response)=> {
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                  sortOrder = -1;
                  property = property.substr(1);
                }
                return function (a,b) {
                  if(sortOrder === -1){
                    return b[property].localeCompare(a[property]);
                  }else{
                    return a[property].localeCompare(b[property]);
                  }        
                }
            }
            var availableSectors = response.data;
            // console.log("availableSectors",availableSectors);
            availableSectors.sort(dynamicSort("sector"));
            this.setState({
            availableSectors : availableSectors
            })
        }).catch(function (error) {
            console.log("error = ",error);
            if(error.message === "Request failed with status code 401"){
              swal({
                  title : "abc",
                  text  : "Session is Expired. Kindly Sign In again."
              });
            }
        });
    }
    selectSector(event){
        event.preventDefault();
        this.setState({
          [event.target.name]:event.target.value
        });
        if(event.target.value==="all"){
            var sector_id = event.target.value;
        }else{
            var sector_id = event.target.value.split('|')[1];
        }
        this.setState({
            sector_ID : sector_id,
            activity_ID    : "all",
            subActivity_ID : "all",
            activity       : "all",
            subactivity    : "all",
        },()=>{
            this.getAvailableActivity(this.state.sector_ID);
            this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
    }
    getAvailableActivity(sector_ID){
        if(sector_ID){
          axios({
            method: 'get',
            url: '/api/sectors/'+sector_ID,
          }).then((response)=> {     
            var availableActivity = response.data[0].activity;
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    if(sortOrder === -1){
                        return b[property].localeCompare(a[property]);
                    }else{
                        return a[property].localeCompare(b[property]);
                    }        
                }
            }
            availableActivity.sort(dynamicSort("activityName"));
            if(response&&response.data[0]){
            this.setState({
                availableActivity : availableActivity,
            })
            }
          }).catch(function (error) {
            console.log("error = ",error);
          });
        }
    }
    selectActivity(event){
        event.preventDefault();
        this.setState({[event.target.name]:event.target.value});
        if(event.target.value==="all"){
          var activity_ID = event.target.value;
        }else{
          var activity_ID = event.target.value.split('|')[1];
        }
        this.setState({
            activity_ID : activity_ID,
            subActivity_ID : "all",
            subactivity    : "all",
        },()=>{
            this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
    }
    getAvailableSubActivity(sector_ID, activity_ID){
        axios({
            method: 'get',
            url: '/api/sectors/'+sector_ID,
        }).then((response)=> {
            var availableSubActivity = _.flatten(response.data.map((a, i)=>{
                return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] });
            }))
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    if(sortOrder === -1){
                        return b[property].localeCompare(a[property]);
                    }else{
                        return a[property].localeCompare(b[property]);
                    }        
                }
            }
            availableSubActivity.sort(dynamicSort("subActivityName"));
            this.setState({
                availableSubActivity : availableSubActivity
            });
        }).catch(function (error) {
          console.log("error = ",error);
        });    
    }
    selectSubActivity(event){
        event.preventDefault();
        this.setState({[event.target.name]:event.target.value});
        if(event.target.value==="all"){
          var subActivity_ID = event.target.value;
        }else{
          var subActivity_ID = event.target.value.split('|')[1];
        }
        this.setState({
          subActivity_ID : subActivity_ID,
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
    }
    selectprojectCategoryType(event){
        event.preventDefault();
        // console.log(event.target.value)
        var projectCategoryType = event.target.value;
        this.setState({
            projectCategoryType : projectCategoryType,
        },()=>{
            if(this.state.projectCategoryType === "LHWRF Grant"){
                this.setState({
                  projectName : "all",
                },()=>{
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
                })          
            }else if (this.state.projectCategoryType=== "all"){
                this.setState({
                  projectName : "all",
                },()=>{
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
                })    
            }else  if(this.state.projectCategoryType=== "Project Fund"){
                this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
            }
        },()=>{
        })
    }
    getAvailableProjects(){
        axios({
          method: 'get',
          url: '/api/projectMappings/list',
        }).then((response)=> {
            var availableProjects = response.data
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    if(sortOrder === -1){
                        return b[property].localeCompare(a[property]);
                    }else{
                        return a[property].localeCompare(b[property]);
                    }        
                }
            }
            availableProjects.sort(dynamicSort("projectName")); 
            this.setState({
                availableProjects : availableProjects
            })
        }).catch(function (error) {
          console.log('error', error);
          if(error.message === "Request failed with status code 401"){
            swal({
                title : "abc",
                text  : "Session is Expired. Kindly Sign In again."
            });
          }   
        });
    }
    selectprojectName(event){
        event.preventDefault();
        var projectName = event.target.value;
        this.setState({
              projectName : projectName,
            },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
    }
    addCommas(x) {
        if(x===0){
            return parseInt(x)
        }else{
            x=x.toString();
            if(x.includes('%')){
                return x;
            }else if(x.includes('-')){
                var lastN = x.split('-')[1];
                var lastThree = lastN.substring(lastN.length-3);
                var otherNumbers = lastN.substring(0,lastN.length-3);
                if(otherNumbers !== '')
                    lastThree = ',' + lastThree;
                var res = "-" + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                // console.log("x",x,"lastN",lastN,"res",res)
                return(res);
            }else{
                if(x.includes('.')){
                    var pointN = x.split('.')[1];
                    var lastN = x.split('.')[0];
                    var lastThree = lastN.substring(lastN.length-3);
                    var otherNumbers = lastN.substring(0,lastN.length-3);
                    if(otherNumbers !== '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
                    return(res);
                }else{
                    var lastThree = x.substring(x.length-3);
                    var otherNumbers = x.substring(0,x.length-3);
                    if(otherNumbers !== '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                    return(res);
                }
            }
        }
    }
    getData(startDate, endDate, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID){   
        // console.log(startDate, endDate, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID)     
        if(startDate && endDate && center_ID && sector_ID && projectCategoryType  && beneficiaryType){ 
            if(sector_ID==="all"){
                var url = ('/api/reports/activitywise_report/'+startDate+'/'+endDate+'/'+center_ID+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID)
            }else{
                var url = ('/api/reports/activitywise_report/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID)
            }

            $(".fullpageloader").show();
            axios.get(url)
            .then((response)=>{
                $(".fullpageloader").hide();
                console.log("resp",response);
                var tableData = response.data.map((a, i)=>{
                    return {
                        _id                         : a._id,           
                        projectCategoryType         : a.projectCategoryType ? a.projectCategoryType : "-",
                        projectName                 : a.projectName === "all" ? "-" :a.projectName,        
                        sectorName                  : a.sectorName,
                        activityName                : a.activityName,
                        subactivityName             : a.subactivityName,
                        unit                        : a.unit,
                        reach                       : a.reach,
                        familyUpgradation           : a.familyUpgradation,
                        unitCost                    : (a.unitCost),
                        quantity                    : this.addCommas(a.quantity),
                        total                       : a.total,
                        LHWRF                       : a.LHWRF,
                        NABARD                      : a.NABARD,
                        bankLoan                    : a.bankLoan,
                        directCC                    : a.directCC,
                        indirectCC                  : a.indirectCC,
                        govtscheme                  : a.govtscheme,
                        other                       : a.other,
                    }
                })
                this.setState({
                    tableData : tableData
                },()=>{
                })
            })
            .catch(function(error){  
                console.log("error = ",error.message);
                if(error.message === "Request failed with status code 500"){
                    $(".fullpageloader").hide();
                }
            });
        }
    }
    handleFromChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var startDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           startDate:startDate
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        });
    }
    handleToChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var endDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
         [name] : event.target.value,
         endDate : endDate
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        });
    }
    onBlurEventFrom(){
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        if ((Date.parse(endDate) < Date.parse(startDate))) {
            swal("Start date","From date should be less than To date");
            this.refs.startDate.value="";
        }
    }
    onBlurEventTo(){
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
            if ((Date.parse(startDate) > Date.parse(endDate))) {
                swal("End date","To date should be greater than From date");
                this.refs.endDate.value="";
            }
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
        }else {
             var today = (new Date());
            var nextDate = today.getDate() - 30;
            today.setDate(nextDate);
            // var newDate = today.toLocaleString();
            var today =  moment(today).format('YYYY-MM-DD');
        }
        this.setState({
           startDate :today
        },()=>{
        });
        return today;
    }

    currentToDate(){
        if(this.state.endDate){
            var today = this.state.endDate;
        }else {
            var today =  moment(new Date()).format('YYYY-MM-DD');
        }
        this.setState({
           endDate :today
        },()=>{
        });
        return today;
    }
    getSearchText(searchText, startRange, limitRange){
        this.setState({
            tableData : []
        });
    }
    changeReportComponent(event){
        var currentComp = $(event.currentTarget).attr('id');

        this.setState({
          'currentTabView': currentComp,
        })
    } 
    year() {
        let financeYear;
        let today = moment();
        // console.log('today',today);
        if(today.month() >= 3){
            financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
        }
        else{
            financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
        }   
        this.setState({
            financeYear :financeYear
        },()=>{
            // console.log('financeYear',this.state.financeYear);
            var firstYear     = this.state.financeYear.split('-')[0];
            var secondYear    = this.state.financeYear.split('-')[1];
            var financialYear = "FY "+firstYear+" - "+secondYear;
            var startDate     = financialYear.substring(3, 7)+"-04-01";
            var endDate       = financialYear.substring(10, 15)+"-03-31";
            /*"FY 2019 - 2020",*/
            this.setState({
                firstYear  :firstYear,
                secondYear :secondYear,
                startDate  :startDate,
                endDate    :endDate,
                year       :financialYear
            },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
            var upcomingFirstYear =parseInt(this.state.firstYear)+3
            var upcomingSecondYear=parseInt(this.state.secondYear)+3
            var years = [];
                for (var i = 2017; i < upcomingFirstYear; i++) {
                    for (var j = 2018; j < upcomingSecondYear; j++) {
                        if (j-i===1){
                            var financeYear = "FY "+i+" - "+j;
                            years.push(financeYear);
                            this.setState({
                                years  :years,
                            },()=>{
                            // console.log('years',this.state.years);
                            // console.log('year',this.state.year);
                            })              
                        }
                    }
                }
            })
        })
    }
    render(){
        return(  
            <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <Loader type="fullpageloader" />
                <div className="row">
                    <div className="formWrapper"> 
                        <section className="content">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                                            {/*Activity wise Periodic Variance Report (Physical & Financial)  */} 
                                            Activity wise Report                
                                        </div>
                                    </div>
                                    <hr className="hr-head"/>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">Sector</label><span className="asterix"></span>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                              <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                                                <option  className="hidden" >--Select Sector--</option>
                                                <option value="all" >All</option>
                                                {
                                                this.state.availableSectors && this.state.availableSectors.length >0 ?
                                                this.state.availableSectors.map((data, index)=>{
                                                  return(
                                                    <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                                                  );
                                                })
                                                :
                                                null
                                              }
                                              </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">Activity<span className="asterix">*</span></label>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                                                <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                                                    <option disabled="disabled" selected="true">-- Select --</option>
                                                    <option value="all" >All</option>
                                                    {
                                                        this.state.availableActivity && this.state.availableActivity.length >0 ?
                                                        this.state.availableActivity.map((data, index)=>{
                                                            if(data.activityName ){
                                                                return(
                                                                    <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                                                );
                                                            }
                                                        })
                                                        :
                                                        null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">Sub-Activity<span className="asterix">*</span></label>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                                                <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                                                    <option disabled="disabled" selected="true">-- Select --</option>
                                                    <option value="all" >All</option>
                                                    {
                                                        this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                                                        this.state.availableSubActivity.map((data, index)=>{
                                                            if(data.subActivityName ){
                                                                return(
                                                                    <option className="" key={data._id} data-upgrade={data.familyUpgradation} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                                                );
                                                            }
                                                        })
                                                        :
                                                        null
                                                    }
                                                </select>
                                            </div>
                                        </div>  
                                        {/* <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">Beneficiary</label><span className="asterix"></span>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="beneficiaryType" >
                                              <select className="custom-select form-control inputBox" ref="beneficiaryType" name="beneficiaryType" value={this.state.beneficiaryType} onChange={this.handleChange.bind(this)}>
                                                <option  className="hidden" >--Select--</option>
                                                <option value="all" >All</option>
                                                <option value="withUID" >With UID</option>
                                                <option value="withoutUID" >Without UID</option>
                                                
                                              </select>
                                            </div>
                                        </div> */}
                                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">Project Category</label><span className="asterix"></span>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectCategoryType" >
                                              <select className="custom-select form-control inputBox" ref="projectCategoryType" name="projectCategoryType" value={this.state.projectCategoryType} onChange={this.selectprojectCategoryType.bind(this)}>
                                                <option  className="hidden" >--Select--</option>
                                                <option value="all" >All</option>
                                                <option value="LHWRF Grant" >LHWRF Grant</option>
                                                <option value="Project Fund">Project Fund</option>
                                                
                                              </select>
                                            </div>
                                        </div>
                                        {
                                            this.state.projectCategoryType === "Project Fund" ?

                                            <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                              <label className="formLable">Project Name</label><span className="asterix"></span>
                                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectName" >
                                                <select className="custom-select form-control inputBox" ref="projectName" name="projectName" value={this.state.projectName} onChange={this.selectprojectName.bind(this)}>
                                                    <option value="all" >All</option>
                                                      {
                                                        this.state.availableProjects && this.state.availableProjects.length >0 ?
                                                        this.state.availableProjects.map((data, index)=>{
                                                          return(
                                                            <option key={data._id} value={data.projectName}>{data.projectName}</option>
                                                          );
                                                        })
                                                        :
                                                        null
                                                      }
                                                </select>
                                              </div>
                                            </div>
                                        : 
                                        ""
                                        }
                                        <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">From</label><span className="asterix"></span>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                                <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                            </div>
                                        </div>
                                        <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                            <label className="formLable">To</label><span className="asterix"></span>
                                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                              <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                             </div>
                                        </div>  
                                    </div>  
                                    <div className="marginTop11">
                                        <div className="">
                                            <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <IAssureTable 
                                                    tableName = "ActivityWise Report"
                                                    id = "ActivityWiseReport"
                                                    tableClass = "activityWiseReport"
                                                    twoLevelHeader={this.state.twoLevelHeader} 
                                                    getData={this.getData.bind(this)} 
                                                    tableHeading={this.state.tableHeading} 
                                                    tableData={this.state.tableData} 
                                                    tableObjects={this.state.tableObjects}
                                                    getSearchText={this.getSearchText.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
export default ActivityWiseReport