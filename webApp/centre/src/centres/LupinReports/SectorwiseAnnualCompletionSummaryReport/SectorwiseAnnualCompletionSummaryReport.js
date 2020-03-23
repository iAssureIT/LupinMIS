import React, { Component }                                  from 'react';
import swal                                                  from 'sweetalert';
import $                                                     from 'jquery';
import axios                                                 from 'axios';
import moment                                                from 'moment';
import { Link }                                              from 'react-router-dom';
import SectorwiseAnnualCompletionSummaryYearlyReport         from '../../Reports/SectorwiseAnnualCompletionSummaryYearlyReport.js';
import Loader                                                from "../../../common/Loader.js";

import "./SectorwiseAnnualCompletionSummaryReport.css";
import "../../Reports/Reports.css";
import '../../../coreAdmin/IAssureTable/print.css';

class SectorwiseAnnualCompletionSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        // 'year'              : "FY 2019 - 2020",
        "sector"            : "all",
        "sector_ID"         : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        // "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],      
        "startRange"        : 0,
        "limitRange"        : 10000,
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 4,
                    hide  : false,
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 3,
                    hide  : false,
                },
                {
                    heading : "Annual Achievement",
                    mergedColoums : 4,
                    hide  : false,
                },
                {
                    heading : "Source OF Financial Achievement 'Lakh'",
                    mergedColoums : 7,
                    hide  : true
                },
               /* {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "projectCategoryType"               : 'Project Category',
            "projectName"                       : 'Project Name',
            "name"                              : 'Sector',
            "annualPlan_Reach"                  : 'Outreach', 
            "annualPlan_FamilyUpgradation"      : 'Family Upgradation', 
            "annualPlan_TotalBudget_L"          : "Total Budget 'Lakh'",
            "achievement_Reach"                 : 'Outreach', 
            "achievement_FamilyUpgradation"     : 'Families Upgraded', 
            "achievement_TotalBudget_L"         : "Financial Total 'Lakh'", 
            "Per_Annual"                        : '% Achievements',
            "achievement_LHWRF_L"               : 'LHWRF',
            "achievement_NABARD_L"              : 'NABARD',
            "achievement_Bank_Loan_L"           : 'Bank',
            "achievement_Govt_L"                : 'Government',
            "achievement_DirectCC_L"            : 'DirectCC',
            "achievement_IndirectCC_L"          : 'IndirectCC',
            "achievement_Other_L"               : 'Others',        
        },
        "tableObjects"        : {
            paginationApply     : false,
            searchApply         : false,
            downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0);
  }
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.year();
    this.getAvailableProjects();
    this.getAvailableCenters();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
  }
  componentWillReceiveProps(nextProps){
    this.year();
    this.getAvailableCenters();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    this.getAvailableProjects();
  }
  handleChange(event){
    event.preventDefault();

    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      // console.log('name', this.state)
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      this.setState({
        availableCenters : response.data,
        // center           : response.data[0].centerName+'|'+response.data[0]._id
      },()=>{
        // console.log('availableCenters', this.state.availableCenters);
        // console.log('center', this.state.center);
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
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      var center = this.state.selectedCenter.split('|')[1];
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      // console.log('center', center);
      this.setState({
        // center :center,
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
              this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  getData(year, center_ID, projectCategoryType, projectName, beneficiaryType){        
    if(year){
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";    
      if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
        $(".fullpageloader").show();
        axios.get('/api/reports/sector_annual_achievement_reports/:startDate/:endDate/:center_ID/:projectCategoryType/:projectName/:beneficiaryType')
        .then((response)=>{
          $(".fullpageloader").hide();
          // console.log("resp",response);
          this.setState({
            tableDatas : response.data
          },()=>{
            // console.log("resp",this.state.tableDatas)
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
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      // console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
        firstYear  :firstYear,
        secondYear :secondYear,
        year       :financialYear
      },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
              console.log('years',this.state.years);
              console.log('year',this.state.year);
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
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact section-not-print">
                    <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                      {/*Sector Wise Annual Completion Summary Report*/}       
                      Sector Annual Report
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

                    <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12">
                      <label className="formLable">Year</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                          <option className="hidden" >-- Select Year --</option>
                          { 
                            this.state.years 
                            ? 
                              this.state.years.map((data, i)=>{
                                return <option key={i}>{data}</option>
                              })
                            : null
                          }
                        </select>
                      </div>
                      {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                    </div>
                  </div>
                  
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                  {
                    <SectorwiseAnnualCompletionSummaryYearlyReport  tableObjects={this.state.tableObjects} twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} year={this.state.year} beneficiaryType={this.state.beneficiaryType} projectCategoryType={this.state.projectCategoryType} projectName={this.state.projectName} tableDatas={this.state.tableDatas}/> 
                  }
                    
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
export default SectorwiseAnnualCompletionSummaryReport