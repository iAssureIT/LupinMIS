import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import _                    from 'underscore';
import moment               from 'moment';
import Loader               from "../../common/Loader.js";
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";

class ActivitywiseAnnualPlanReport extends Component{
	constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10000,
            "center"            : "all",
            "sector"            : "all",
            "center_ID"         : "all",
            "sector_ID"         : "all",
            "activity_ID"       : "all",
            "activity"          : "all",
            "subactivity"       : "all",
            "subActivity_ID"    : "all",
            "projectCategoryType": "all",
            "beneficiaryType"    : "all",
            "projectName"        : "all",
            'year'              : "FY 2019 - 2020",
            "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
            "startDate"         : "",
            "endDate"           : "",
            // "sector"            : "",
            // "sector_ID"         : "",
            // "center"            : "",
            // "center_ID"         : "",
            // "dataApiUrl"        : "/api/masternotifications/list",
            "twoLevelHeader"    : {
                apply           : true,
                firstHeaderData : [
                    {
                        heading : 'Activity Details',
                        mergedColoums : 5,
                        hide : false
                    },
                    {
                        heading : 'Annual Plan',
                        mergedColoums : 5,
                        hide : false
                    },
                    {
                        heading : "Source of Financial Plan 'Lakh'",
                        mergedColoums : 7,
                        hide : true
                    },
                    {
                        heading : "",
                        mergedColoums : 1,
                        hide : true
                    },
                ]
            },
            "tableHeading"      : {
                "annualPlan_projectCategoryType"         : 'Project Category',
                "annualPlan_projectName"                 : 'Project Name',
                "name"                                   : 'Activity & Sub-Activity',
                "unit"                                   : 'Unit',
                "annualPlan_Reach"                       : 'Reach', 
                "annualPlan_FamilyUpgradation"           : "Families Upgradation",
                "annualPlan_PhysicalUnit"                : 'Phy Units', 
                "annualPlan_UnitCost_L"                  : "Unit Cost 'Lakh'",
                "annualPlan_TotalBudget_L"               : "Total Budget 'Lakh'",
                "annualPlan_LHWRF_L"                     : 'LHWRF',
                "annualPlan_NABARD_L"                    : 'NABARD',
                "annualPlan_Bank_Loan_L"                 : 'Bank',
                "annualPlan_Govt_L"                      : 'Government',
                "annualPlan_DirectCC_L"                  : 'DirectCC',
                "annualPlan_IndirectCC_L"                : 'IndirectCC',
                "annualPlan_Other_L"                     : 'Others',
                "annualPlan_Remark"                      : 'Remark',
            },
            "tableObjects"        : {
              paginationApply     : false,
              downloadApply       : true,
              searchApply         : false,
            },   
        }
        window.scrollTo(0, 0);
        this.getAvailableCenters = this.getAvailableCenters.bind(this);
        this.getAvailableSectors = this.getAvailableSectors.bind(this);
        
    }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
      this.getFinancialYear();
      this.year();
      this.getAvailableCenters();
      this.getAvailableProjects();
      this.getAvailableSectors();
      this.setState({
        tableData : this.state.tableData,
      },()=>{
        // console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      })
  }
 
  componentWillReceiveProps(nextProps){
      this.getFinancialYear();
      this.getAvailableProjects();
      this.getAvailableCenters();
      this.getAvailableSectors();
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      // console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
  }
  handleChange(event){
      event.preventDefault();
      this.setState({
        [event.target.name] : event.target.value
      },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        // console.log('name', this.state)
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
        // console.log('center', center);
        this.setState({
          center_ID :center,            
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
          // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        })
      });
  } 
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data,
          // sector           : response.data[0].sector+'|'+response.data[0]._id
        },()=>{
      })
    }).catch(function (error) {
      console.log("error = ",error);
      
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
      sector_ID      : sector_id,
      activity_ID    : "all",
      subActivity_ID : "all",
      activity       : "all",
      subactivity    : "all",
        },()=>{
    // console.log(this.state.sector_ID, this.state.activity_ID, this.state.subActivity_ID);
      this.getAvailableActivity(this.state.sector_ID);
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }

  getAvailableActivity(sector_ID){
    if(sector_ID){
      axios({
        method: 'get',
        url: '/api/sectors/'+sector_ID,
      }).then((response)=> {
        if(response&&response.data[0]){
          this.setState({
            availableActivity : response.data[0].activity
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
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
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
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }
  selectprojectCategoryType(event){{
    event.preventDefault();
    var projectCategoryType = event.target.value;
    this.setState({
      projectCategoryType : projectCategoryType,
    },()=>{
      if(this.state.projectCategoryType === "LHWRF Grant"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })          
      }else if (this.state.projectCategoryType=== "all"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })    
      }else  if(this.state.projectCategoryType=== "Project Fund"){
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      }
    },()=>{
    })
  }}
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
      
    });
  }
  selectprojectName(event){
      event.preventDefault();
      var projectName = event.target.value;
      this.setState({
            projectName : projectName,
          },()=>{
          // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
  getData(year, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID){   
    if(year ){
      if(center_ID && sector_ID && projectCategoryType && projectName && beneficiaryType && activity_ID && subActivity_ID){ 
            // console.log(activity_ID, subActivity_ID);  
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";    
        if(center_ID==="all"){
          if(sector_ID==="all"){
            var url = '/api/report/activity_annual_plan/'+startDate+'/'+endDate+'/all/all/'+projectCategoryType+'/'+projectName+'/all'+'/'+activity_ID+'/'+subActivity_ID
          }else{    
            var url = '/api/report/activity_annual_plan/'+startDate+'/'+endDate+'/all/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/all'+'/'+activity_ID+'/'+subActivity_ID
          }
        }else{
          var url = '/api/report/activity_annual_plan/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/all'+'/'+activity_ID+'/'+subActivity_ID
        }     
          $(".fullpageloader").show();
          axios.get(url)
            .then((response)=>{
              console.log("resp",response);
              $(".fullpageloader").hide();
              var tableData = response.data.map((a, i)=>{
                return {
                  _id                                       : a._id,  
                  annualPlan_projectCategoryType            : a.annualPlan_projectCategoryType ? a.annualPlan_projectCategoryType : "-",
                  annualPlan_projectName                    : a.annualPlan_projectName === "all" ? "-" :a.annualPlan_projectName,                       
                  name                                      : a.name,
                  unit                                      : a.unit,
                  annualPlan_Reach                          : this.addCommas(a.annualPlan_Reach),
                  annualPlan_FamilyUpgradation              : this.addCommas(a.annualPlan_FamilyUpgradation),
                  annualPlan_PhysicalUnit                   : this.addCommas(a.annualPlan_PhysicalUnit),
                  annualPlan_UnitCost_L                     : a.annualPlan_UnitCost_L,
                  annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                  annualPlan_LHWRF_L                        : a.annualPlan_LHWRF_L,
                  annualPlan_NABARD_L                       : a.annualPlan_NABARD_L,
                  annualPlan_Bank_Loan_L                    : a.annualPlan_Bank_Loan_L,
                  annualPlan_Govt_L                         : a.annualPlan_Govt_L,
                  annualPlan_DirectCC_L                     : a.annualPlan_DirectCC_L,
                  annualPlan_IndirectCC_L                   : a.annualPlan_IndirectCC_L,
                  annualPlan_Other_L                        : a.annualPlan_Other_L,
                  annualPlan_Remark                         : a.annualPlan_Remark,
                }
              })
              this.setState({
                tableData : tableData
              },()=>{
              })
            })
          .catch(function(error){
            console.log("error = ",error);
          });
        }
      }
    }
  getFinancialYear() {

    let financeYear;
    let today = moment();
    console.log('today',today);
    if(today.month() >= 3){
      financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    else{
      financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    this.setState({
        financeYear :financeYear
    },()=>{
      console.log('financeYear',this.state.financeYear);
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
          financialYear  :financialYear,
      },()=>{
        console.log('financialYear',this.state.financialYear);
          // this.getData(this.state.firstYear, this.state.secondYear, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
    });

    var date = new Date,
    year = date.getFullYear(),
    select = document.createElement('select');

    for (var i = year; i < year + 5; i++) {

        var option = document.createElement('option'),
            yearText = document.createTextNode(i);
        
        option.appendChild(yearText);
        select.add(option);  
        console.log('option',option); 
    }

    select.name = 'year';

    document.body.appendChild(select);
  }   
  year() {
        //Reference the DropDownList.
        var ddlYears = $("#ddlYears");
 
        //Determine the Current Year.
        var currentYear = (new Date()).getFullYear();
        //Loop and add the Year values to DropDownList.
        for (var i = 1950; i <= currentYear; i++) {
            var option = $("<option />");
            option.html(i);
            option.val(i);
            ddlYears.append(option);
        }


    var financeYears = $("#financeYears");
    let financeYear;
    let today = moment();
    console.log('today',today);
    if(today.month() >= 3){
      financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    else{
      financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    this.setState({
        financeYear :financeYear
    },()=>{
      console.log('financeYear',this.state.financeYear);
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
          financialYear  :financialYear,
      },()=>{
        console.log('financialYear',this.state.financialYear);
        var financialYear = this.state.financialYear
        for (var i = 2010; i <= firstYear; i++) {
          for (var j = 2011; j <= secondYear; j++) {
            var financialYears = "FY "+i+" - "+j
            console.log('financialYears',financialYears);
            option.html(financialYears);
            option.val(financialYears);
            financeYears.append(option);
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
                          { /* Activity wise Annual Plan Report*/  }  
                            Activity Annual Plan Report     
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                        {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                      
                   {  /* <select id="ddlYears"></select>
                                         <select id="financeYears"></select>*/}
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                        {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                      </div> 
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                        <div className="">
                            <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable 
                                    tableName = "Activitywise Annual-Plan-Report"
                                    id = "activitywiseAnnualPlanReport"
                                    completeDataCount={this.state.tableDatas.length}
                                    twoLevelHeader={this.state.twoLevelHeader} 
                                    editId={this.state.editSubId} 
                                    getData={this.getData.bind(this)} 
                                    tableHeading={this.state.tableHeading} 
                                    tableData={this.state.tableData} 
                                    tableObjects={this.state.tableObjects}
                                    />
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
export default ActivitywiseAnnualPlanReport