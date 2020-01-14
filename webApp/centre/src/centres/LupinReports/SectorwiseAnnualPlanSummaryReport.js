import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../common/Loader.js";

import "../Reports/Reports.css";

class SectorwiseAnnualPlanSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "sector"            : "all",
        "sector_ID"         : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        'year'              : "FY 2019 - 2020",
        "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
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
                    heading : "Source of Financial Plan 'Rs'",
                    mergedColoums : 10,
                    hide : true
                },/*
                {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "projectCategoryType"            : 'Project Category',
            "projectName"                    : 'Project Name',
            "name"                            : 'Sector',
            "annualPlan_TotalBudget"          : 'Total Budget', 
            "Per_Annual"                      : 'Proportion to Total %', 
            "annualPlan_Reach"                : 'Reach', 
            "annualPlan_FamilyUpgradation"    : "Families Upgradation",
            "annualPlan_TotalBudget"          : 'Total Budget', 
            "annualPlan_LHWRF"                : 'LHWRF',
            "annualPlan_NABARD"               : 'NABARD',
            "annualPlan_Bank_Loan"            : 'Bank',
            "annualPlan_Govt"                 : 'Government',
            "annualPlan_DirectCC"             : 'DirectCC',
            "annualPlan_IndirectCC"           : 'IndirectCC',
            "annualPlan_Other"                : 'Others',
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
    this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }

  componentDidMount(){
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    });
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
      this.getAvailableSectors();
      this.getAvailableProjects();
      this.currentFromDate();
      this.currentToDate();
      this.setState({
        // "center"  : this.state.center[0],
        // "sector"  : this.state.sector[0],
        tableData : this.state.tableData,
      },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
      this.handleFromChange = this.handleFromChange.bind(this);
      this.handleToChange = this.handleToChange.bind(this);
  }   
  componentWillReceiveProps(nextProps){
    if(nextProps){  
      this.getData(this.state.year, this.state.center_ID);
    }
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
  }

   
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      console.log('name', this.state)
    });
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data,
          sector           : response.data[0].sector+'|'+response.data[0]._id
        },()=>{
        var sector_ID = this.state.sector.split('|')[1]
        this.setState({
          sector_ID        : sector_ID
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
        // console.log('sector', this.state.sector);
      })
    }).catch(function (error) {  
      // console.log("error = ",error);
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
    var sector_id = event.target.value.split('|')[1];
    // console.log('sector_id',sector_id);
    this.setState({
      sector_ID : sector_id,
    },()=>{
    // console.log('availableSectors', this.state.availableSectors);
    // console.log('sector_ID', this.state.sector_ID);
    // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  selectprojectCategoryType(event){
    event.preventDefault();
    console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
      projectCategoryType : projectCategoryType,
    },()=>{
       if (this.state.projectCategoryType=== "all" || this.state.projectCategoryType === "LHWRF Grant"){
          this.setState({
            projectName : "all",
          })    
        }
        // console.log("shown",this.state.shown, this.state.projectCategoryType)
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      },()=>{
    })
  }
  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      // console.log('responseP', response);
      this.setState({
        availableProjects : response.data
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
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  addCommas(x) {
    x=x.toString();
    if(x.includes('%')){
        return x;
    }else{
      if(x.includes('.')){
        var pointN = x.split('.')[1];
        var lastN = x.split('.')[0];
        var lastThree = lastN.substring(lastN.length-3);
        var otherNumbers = lastN.substring(0,lastN.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
        return(res);
      }else{
        var lastThree = x.substring(x.length-3);
        var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return(res);
      }
    }
  }
  getData(year, center_ID, projectCategoryType, projectName, beneficiaryType){        
    if(year){
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";    
      if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
        $(".fullpageloader").show();
        axios.get('/api/report/sector_annual_plan/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
        .then((response)=>{
          console.log("resp",response);
          $(".fullpageloader").hide();
          var value = response.data.filter((a)=>{return a.name == "Total"})[0];
          // console.log('value',value)
          var tableData = response.data.map((a, i)=>{
            // console.log(a.Per_Annual)
            return {
                _id                                    : a._id,     
                projectCategoryType                    : a.projectCategoryType ? a.projectCategoryType : "-",
                projectName                            : a.projectName === 0 ? "-" :a.projectName,               
                name                                   : a.name,
                annualPlan_TotalBudget                 : this.addCommas(a.annualPlan_TotalBudget),
                Per_Annual                             : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget/value.annualPlan_TotalBudget)*100).toFixed(2)) + "%" ),
                annualPlan_Reach                       : this.addCommas(a.annualPlan_Reach),
                annualPlan_FamilyUpgradation           : this.addCommas(a.annualPlan_FamilyUpgradation), 
                annualPlan_TotalBudget                 : this.addCommas(a.annualPlan_TotalBudget),
                annualPlan_LHWRF                       : this.addCommas(a.annualPlan_LHWRF),
                annualPlan_NABARD                      : this.addCommas(a.annualPlan_NABARD),
                annualPlan_Bank_Loan                   : this.addCommas(a.annualPlan_Bank_Loan),
                annualPlan_Govt                        : this.addCommas(a.annualPlan_Govt),
                annualPlan_DirectCC                    : this.addCommas(a.annualPlan_DirectCC),
                annualPlan_IndirectCC                  : this.addCommas(a.annualPlan_IndirectCC),
                annualPlan_Other                       : this.addCommas(a.annualPlan_Other),
            } 
          })  
          this.setState({
            tableData : tableData
          })
        })
        .catch(function(error){  
          // console.log("error = ",error);
          if(error.message === "Request failed with status code 401"){
            swal({
                title : "abc",
                text  : "Session is Expired. Kindly Sign In again."
            });
          }
        });
      }
    }
  }
  handleFromChange(event){
      event.preventDefault();
     const target = event.target;
     const name = target.name;
     var dateVal = event.target.value;
     var dateUpdate = new Date(dateVal);
     var startDate = moment(dateUpdate).format('YYYY-MM-DD');
     this.setState({
         [name] : event.target.value,
         startDate:startDate
     },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
     console.log("dateUpdate",this.state.startDate);
     });
     // localStorage.setItem('newFromDate',dateUpdate);
  }
  handleToChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;

      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var endDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
         [name] : event.target.value,
         endDate : endDate
      },()=>{
      // console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
     });
     // localStorage.setItem('newToDate',dateUpdate);
  }

  currentFromDate(){
     /* if(localStorage.getItem('newFromDate')){
          var today = localStorage.getItem('newFromDate');
          console.log("localStoragetoday",today);
      }*/
      if(this.state.startDate){
          var today = this.state.startDate;
          // console.log("localStoragetoday",today);
      }else {
         var today = (new Date());
        var nextDate = today.getDate() - 30;
        today.setDate(nextDate);
        // var newDate = today.toLocaleString();
        var today =  moment(today).format('YYYY-MM-DD');
        // console.log("today",today);
      }
      // console.log("nowfrom",today)
      this.setState({
         startDate :today
      },()=>{
      });
      return today;
      // this.handleFromChange()
  }

  currentToDate(){
      if(this.state.endDate){
          var today = this.state.endDate;
          // console.log("newToDate",today);
      }else {
          var today =  moment(new Date()).format('YYYY-MM-DD');
      }
      // console.log("nowto",today)
      this.setState({
         endDate :today
      },()=>{
      });
      return today;
      // this.handleToChange();
  }
  getSearchText(searchText, startRange, limitRange){
      // console.log(searchText, startRange, limitRange);
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
                               {/* Sector wise Annual Plan Summary Report*/}  
                                Sector Annual Plan Report            
                            </div>
                        </div>
                        <hr className="hr-head"/>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 valid_box">
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Beneficiary</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="beneficiaryType" >
                              <select className="custom-select form-control inputBox" ref="beneficiaryType" name="beneficiaryType" value={this.state.beneficiaryType} onChange={this.handleChange.bind(this)}>
                                <option  className="hidden" >--Select--</option>
                                <option value="all" >All</option>
                                <option value="withUID" >With UID</option>
                                <option value="withoutUID" >Without UID</option>
                                 
                              </select>
                            </div>
                          </div> 
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
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
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
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
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <label className="formLable">Year</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                              <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                               <option className="hidden" >-- Select Year --</option>
                               {
                                this.state.years.map((data, i)=>{
                                  return <option key={i}>{data}</option>
                                })
                               }
                              </select>
                            </div>
                          </div> 
                        </div>
                        <div className="marginTop11">
                            <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable 
                                    tableName = "Sectorwise Annual Plan Summary Report"
                                    id = "SectorwiseAnnualPlanSummaryReport"
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
export default SectorwiseAnnualPlanSummaryReport