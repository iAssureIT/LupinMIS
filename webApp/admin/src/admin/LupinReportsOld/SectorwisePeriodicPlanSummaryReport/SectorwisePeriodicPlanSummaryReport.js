import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./SectorwisePeriodicPlanSummaryReport.css";
import "../../Reports/Reports.css";

class SectorwisePeriodicPlanSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "center_ID"         : "all",
        "center"            : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "startDate"         : "",
        "endDate"           : "",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : 'Periodic Plan',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : "Source of Financial Periodic Plan 'Rs'",
                    mergedColoums : 9,
                    hide : true
                },
            ]
        },
        "tableHeading"      : {
          "monthlyPlan_projectCategoryType"  : 'Project Category',
          "monthlyPlan_projectName"          : 'Project Name',
          "name"                             : 'Sector',
          "annualPlan_Reach"                 : 'Reach', 
          "annualPlan_FamilyUpgradation"     : "Families Upgradation",
          "annualProportionToTotal"          : 'Proportion to Total %', 
          "annualPlan_TotalBudget_L"         : "Total Budget 'Lakh'", 
          "monthlyPlan_Reach"                : 'Reach', 
          "monthlyPlan_FamilyUpgradation"    : "Families Upgradation",
          "periodicProportionToTotal"        : 'Proportion to Total %', 
          "monthlyPlan_TotalBudget_L"        : "Total Budget 'Lakh'", 
          "monthlyPlan_LHWRF_L"              : 'LHWRF',
          "monthlyPlan_NABARD_L"             : 'NABARD',
          "monthlyPlan_Bank_Loan_L"          : 'Bank',
          "monthlyPlan_Govt_L"               : 'Government',
          "monthlyPlan_DirectCC_L"           : 'DirectCC',
          "monthlyPlan_IndirectCC_L"         : 'IndirectCC',
          "monthlyPlan_Other_L"              : 'Others',
        },
        
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.handleFromChange    = this.handleFromChange.bind(this);
    this.handleToChange      = this.handleToChange.bind(this);
    this.currentFromDate     = this.currentFromDate.bind(this);
    this.currentToDate       = this.currentToDate.bind(this);
    this.getAvailableCenters = this.getAvailableCenters.bind(this);
  }

    componentDidMount(){
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
      this.getAvailableCenters();
      this.getAvailableProjects();
      this.currentFromDate();
      this.currentToDate();
      this.setState({
        tableData : this.state.tableData,
      },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      this.handleFromChange = this.handleFromChange.bind(this);
      this.handleToChange = this.handleToChange.bind(this);
    }   
    componentWillReceiveProps(nextProps){
      this.getAvailableProjects();
      this.getAvailableCenters();
      this.currentFromDate();
      this.currentToDate();
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    }
    handleChange(event){
      event.preventDefault();
      this.setState({
        [event.target.name] : event.target.value
      },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      });
    }
    getAvailableCenters(){
      axios({
        method: 'get',
        url: '/api/centers/list',
      }).then((response)=> {
        this.setState({
          availableCenters : response.data,
        },()=>{
        })
      }).catch(function (error) {  
         console.log("error = ",error);
        
      });
    } 
    selectCenter(event){
      var selectedCenter = event.target.value;
      this.setState({
        [event.target.name] : event.target.value,
        selectedCenter : selectedCenter,
      },()=>{
        if(this.state.selectedCenter==="all"){
          var center = this.state.selectedCenter;
        }else{
          var center = this.state.selectedCenter.split('|')[1];
        }
        this.setState({
          center_ID :center,            
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
      });
    } 

  selectprojectCategoryType(event){
    event.preventDefault();
    console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
        projectCategoryType : projectCategoryType,
    },()=>{
        if(this.state.projectCategoryType === "LHWRF Grant"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        }
    },()=>{
    })
  }
    getAvailableProjects(){
      axios({
        method: 'get',
        url: '/api/projectMappings/list',
      }).then((response)=> {
        this.setState({
          availableProjects : response.data
        })
      }).catch(function (error) {
        console.log('error', error);
        
      });
    }
    selectprojectName(event){
      event.preventDefault();
      var projectName = event.target.value;
      this.setState({
            projectName : projectName,
          },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
    }

  addCommas(x) {
    if(x===0){
      return parseInt(x)
    }else{
      x=x.toString();
      if(x.includes('%')){
          return x;
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
  getData(startDate, endDate, center_ID, projectCategoryType, projectName, beneficiaryType){        
    if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
        if(center_ID==="all"){
          $(".fullpageloader").show();
          axios.get('/api/reports/sector_periodic_plans/'+startDate+'/'+endDate+'/all/'+projectCategoryType+'/'+projectName+'/all')
            .then((response)=>{
              $(".fullpageloader").hide();
              console.log("response = ",response);
              var value = response.data.filter((a)=>{return a.name === "Total"})[0];
              var tableData = response.data.map((a, i)=>{
                return {
                  _id                                     : a._id,            
                  monthlyPlan_projectCategoryType         : a.monthlyPlan_projectCategoryType ? a.monthlyPlan_projectCategoryType : "-",
                  monthlyPlan_projectName                 : a.monthlyPlan_projectName === "all" ? "-" :a.monthlyPlan_projectName,               
                  name                                    : a.name,
                  annualPlan_Reach                        : this.addCommas(a.annualPlan_Reach),
                  annualPlan_FamilyUpgradation            : this.addCommas(a.annualPlan_FamilyUpgradation),
                  annualProportionToTotal                 : (((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%") ==="NaN%") ? " " : ((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                  // Per_Annual                              : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                  annualPlan_TotalBudget_L                : (a.annualPlan_TotalBudget_L),
                  monthlyPlan_Reach                       : this.addCommas(a.monthlyPlan_Reach),
                  monthlyPlan_FamilyUpgradation           : this.addCommas(a.monthlyPlan_FamilyUpgradation),
                  periodicProportionToTotal               : (((((a.monthlyPlan_TotalBudget_L/value.monthlyPlan_TotalBudget_L)*100).toFixed(2)) + "%") === "NaN%") ? " " : ((((a.monthlyPlan_TotalBudget_L/value.monthlyPlan_TotalBudget_L)*100).toFixed(2)) + "%") ,
                  monthlyPlan_TotalBudget_L               : (a.monthlyPlan_TotalBudget_L),                
                  monthlyPlan_LHWRF_L                     : a.monthlyPlan_LHWRF_L,
                  monthlyPlan_NABARD_L                    : a.monthlyPlan_NABARD_L,
                  monthlyPlan_Bank_Loan_L                 : a.monthlyPlan_Bank_Loan_L,
                  monthlyPlan_Govt_L                      : a.monthlyPlan_Govt_L,
                  monthlyPlan_DirectCC_L                  : a.monthlyPlan_DirectCC_L,
                  monthlyPlan_IndirectCC_L                : a.monthlyPlan_IndirectCC_L,
                  monthlyPlan_Other_L                     : a.monthlyPlan_Other_L,
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
        }else{
            $(".fullpageloader").show();
            axios.get('/api/reports/sector_periodic_plans/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/all')
            .then((response)=>{
              $(".fullpageloader").hide();
              console.log("response = ",response);
              var value = response.data.filter((a)=>{return a.name === "Total"})[0];
              var tableData = response.data.map((a, i)=>{
                return {
                  _id                                     : a._id,            
                  monthlyPlan_projectCategoryType         : a.monthlyPlan_projectCategoryType ? a.monthlyPlan_projectCategoryType : "-",
                  monthlyPlan_projectName                 : a.monthlyPlan_projectName === "all" ? "-" :a.monthlyPlan_projectName,               
                  name                                    : a.name,
                  annualPlan_Reach                        : this.addCommas(a.annualPlan_Reach),
                  annualPlan_FamilyUpgradation            : this.addCommas(a.annualPlan_FamilyUpgradation),
                  annualProportionToTotal                 : (((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%") ==="NaN%") ? " " : ((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                  // Per_Annual                              : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                  annualPlan_TotalBudget_L                : (a.annualPlan_TotalBudget_L),
                  monthlyPlan_Reach                       : this.addCommas(a.monthlyPlan_Reach),
                  monthlyPlan_FamilyUpgradation           : this.addCommas(a.monthlyPlan_FamilyUpgradation),
                  periodicProportionToTotal               : (((((a.monthlyPlan_TotalBudget_L/value.monthlyPlan_TotalBudget_L)*100).toFixed(2)) + "%") === "NaN%") ? " " : ((((a.monthlyPlan_TotalBudget_L/value.monthlyPlan_TotalBudget_L)*100).toFixed(2)) + "%") ,
                  monthlyPlan_TotalBudget_L               : (a.monthlyPlan_TotalBudget_L),                
                  monthlyPlan_LHWRF_L                     : a.monthlyPlan_LHWRF_L,
                  monthlyPlan_NABARD_L                    : a.monthlyPlan_NABARD_L,
                  monthlyPlan_Bank_Loan_L                 : a.monthlyPlan_Bank_Loan_L,
                  monthlyPlan_Govt_L                      : a.monthlyPlan_Govt_L,
                  monthlyPlan_DirectCC_L                  : a.monthlyPlan_DirectCC_L,
                  monthlyPlan_IndirectCC_L                : a.monthlyPlan_IndirectCC_L,
                  monthlyPlan_Other_L                     : a.monthlyPlan_Other_L,
                } 
            })  
              this.setState({
                tableData : tableData
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
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    });
  }

  currentFromDate(){
    if(this.state.startDate){
        var today = this.state.startDate;
    }else {
       var today = (new Date());
       var nextDate = today.getDate() - 30;
       today.setDate(nextDate);
       var today =  moment(today).format('YYYY-MM-DD');
    }
    this.setState({
       startDate :today
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
                                        Sector Periodic Plan Report              
                                    </div>
                                </div>
                                <hr className="hr-head"/>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box">
                                      <label className="formLable">Center</label><span className="asterix"></span>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                                          <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                                              <option className="hidden" >-- Select --</option>
                                              <option value="all" >All</option>
                                              {
                                                this.state.availableCenters && this.state.availableCenters.length >0 ?
                                                this.state.availableCenters.map((data, index)=>{
                                                  return(
                                                    <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                                                  );
                                                })
                                                :
                                                null
                                              }
                                          </select>
                                      </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box">
                                      <label className="formLable">From</label><span className="asterix"></span>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                          <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                      </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box">
                                      <label className="formLable">To</label><span className="asterix"></span>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                          <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                      </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                                </div>
                                <div className="marginTop11">
                                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <IAssureTable 
                                            tableName = "Sectorwise Periodic Plan Summary Report"
                                            id = "SectorwisePeriodicPlanSummaryReport"
                                            completeDataCount={this.state.tableDatas.length}
                                            twoLevelHeader={this.state.twoLevelHeader} 
                                            editId={this.state.editSubId} 
                                            getData={this.getData.bind(this)} 
                                            tableHeading={this.state.tableHeading} 
                                            tableData={this.state.tableData} 
                                            tableObjects={this.state.tableObjects}
                                            getSearchText={this.getSearchText.bind(this)}/>
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
export default SectorwisePeriodicPlanSummaryReport