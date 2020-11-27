import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import _                    from 'underscore';
import moment               from 'moment';
import swal                 from 'sweetalert';
import Loader                                      from "../../../common/Loader.js";
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../../Reports/Reports.css";
import "./ActivitywisePlan.css"
class ActivitywisePlan extends Component{
  constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 1000000,
            "month"             : "All",
            "months"            :["All", "Q1 (April to June)","Q2 (July to September)","Q3 (October to December)","Q4 (January to March)"],
            "startDate"         : "",
            "endDate"           : "",
            "shown"             : true, 
            "sector"            : "all",
            "sector_ID"         : "all",
            "activity_ID"       : "all",
            "activity"          : "all",
            "subactivity"       : "all",
            "subActivity_ID"    : "all",
            "projectCategoryType": "all",
            "beneficiaryType"    : "all",
            "projectName"        : "all",
            "twoLevelHeader"    : {
                apply           : true,
                firstHeaderData : [
                    {
                        heading : 'Activity Details',
                        mergedColoums : 7,
                        hide : false
                     },
                    {
                        heading : 'Annual Plan',
                        mergedColoums : 4,
                        hide : false
                    },
                    {
                        heading : "Source of Financial Plan 'Rs. in Lakh'",
                        mergedColoums : 8,
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
                projectCategoryType            : "Project Category",
                projectName                    : "Project Name",
                sectorName                     : "Sector",
                activityName                   : "Activity",
                subactivityName                : "Subactivity",
                unit                           : "Unit",
                Reach                          : "Reach",
                FamilyUpgradation              : "Family Upgradation",
                // proportionToTotal              : 'Proportion to Total %', 
                unitCost                       : "Unit Cost",
                physicalUnit                   : "Physical Unit",
                TotalBudget                    : "Total Budget",
                LHWRF                          : "LHWRF",
                NABARD                         : "NABARD",
                Bank_Loan                      : "Bank Loan",
                Govt                           : "Government",
                DirectCC                       : "DirectCC",
                IndirectCC                     : "IndirectCC",
                Other                          : "Others",
                remark                         : "Remark",
            },

            "tableObjects"        : {
              paginationApply     : false,
              searchApply         : false,
              downloadApply       : true,
            }, 
            availableSectors      : [],   
        }
        window.scrollTo(0, 0);
        this.getAvailableSectors = this.getAvailableSectors.bind(this);

    }

  componentDidMount(){
    this.year();
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    this.getAvailableProjects();
    this.setState({
      tableData : this.state.tableData,
    },()=>{
         // console.log('aa',this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID); 
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
    })
  }
   
  componentWillReceiveProps(nextProps){
    this.year();
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
  }
  handleChange(event){
    event.preventDefault();
    var getheader = {...this.state.twoLevelHeader};
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      getheader.firstHeaderData[1].heading = this.state.month==="All" ? "Annual Plan " : this.state.month + " Plan";
         // console.log('aa',this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID); 
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
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
      sector_id = event.target.value.split('|')[1];
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
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
    })
  } 
  getAvailableActivity(sector_ID){
    if(sector_ID){
      axios({
        method: 'get',
        url: '/api/sectors/'+sector_ID,
      }).then((response)=> { 
        if(response){
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
          this.setState({
              availableActivity : availableActivity
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
      activity_ID = event.target.value.split('|')[1];
    }
    this.setState({
      activity_ID : activity_ID,
      subActivity_ID : "all",
      subactivity    : "all",
    },()=>{
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
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
      subActivity_ID = event.target.value.split('|')[1];
    }
    this.setState({
      subActivity_ID : subActivity_ID,
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
    })
  }

  selectprojectCategoryType(event){
    event.preventDefault();
    var projectCategoryType = event.target.value;
    this.setState({
      projectCategoryType : projectCategoryType,
    },()=>{
      if(this.state.projectCategoryType === "LHWRF Grant"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
        })          
      }else if (this.state.projectCategoryType=== "all"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
        })    
      }else  if(this.state.projectCategoryType=== "Project Fund"){
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
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
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
          projectName : projectName,
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
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
          lastThree = x.substring(x.length-3);
          otherNumbers = x.substring(0,x.length-3);
          if(otherNumbers !== '')
            lastThree = ',' + lastThree;
          res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
          return(res);
        }
      }
    }
  }
  getData(year, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID, month){   
    if(year ){
      if(center_ID && sector_ID && projectCategoryType && projectName && beneficiaryType){ 
        // var startDate = year.substring(3, 7)+"-04-01";
        // var endDate = year.substring(10, 15)+"-03-31";   
        var url;
        // console.log(month); 
        if (month==="All"){            
          if(sector_ID==="all"){
            url = '/api/reports/activity_annual_plans/'+year+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/all/'+activity_ID+'/'+subActivity_ID
          }else{
            url = '/api/reports/activity_annual_plans/'+year+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+sector_ID+'/'+activity_ID+'/'+subActivity_ID
          }
          $(".fullpageloader").show();
          axios.get(url)
            .then((response)=>{
              // console.log('response',response);
              $(".fullpageloader").hide();
              var tableData = response.data.map((a, i)=>{
                return {
                        _id                            : a._id,     
                        projectCategoryType            : a.projectCategoryType,
                        projectName                    : a.projectName === "all" ? "-" : a.projectName,
                        sectorName                     : a.sectorName,
                        activityName                   : a.activityName,
                        subactivityName                : a.subactivityName,
                        unit                           : a.unit,
                        Reach                          : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.Reach)+"</b>" : this.addCommas(a.Reach),
                        FamilyUpgradation              : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.FamilyUpgradation)+"</b>" : this.addCommas(a.FamilyUpgradation),
                        // proportionToTotal              : ((((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%") === "NAN%") ? " " : (((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%"),
                        unitCost                       : (a.unitCost),
                        physicalUnit                   : (a.physicalUnit),
                        TotalBudget                    : (a.TotalBudget),
                        LHWRF                          : (a.LHWRF),
                        NABARD                         : (a.NABARD),
                        Bank_Loan                      : (a.Bank_Loan),
                        Govt                           : (a.Govt),
                        DirectCC                       : (a.DirectCC),
                        IndirectCC                     : (a.IndirectCC),
                        Other                          : (a.Other),
                        remark                         : (a.remark),
                    }
              })
              // console.log("tableData",tableData.length)
              this.setState({
                tableData : tableData
              })
          })
          .catch(function(error){
            console.log("error = ",error);
          });
        }else{
          if(sector_ID==="all"){
            url = ('/api/reports/activity_quarterly_plans/'+month+'/'+year+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/all/'+activity_ID+'/'+subActivity_ID)
          }else{
            url = ('/api/reports/activity_quarterly_plans/'+month+'/'+year+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+sector_ID+'/'+activity_ID+'/'+subActivity_ID)
          }
          axios.get(url)
            .then((response)=>{
                $(".fullpageloader").hide();
                // console.log("resp",response);
                var tableData = response.data.map((a, i)=>{
                  // console.log(((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%",(((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%") === "NAN%")
                  return {
                        _id                            : a._id,     
                        projectCategoryType            : a.projectCategoryType,
                        projectName                    : a.projectName === "all" ? "-" : a.projectName,
                        sectorName                     : a.sectorName,
                        activityName                   : a.activityName,
                        subactivityName                : a.subactivityName,
                        unit                           : a.unit,
                        Reach                          : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.Reach)+"</b>" : this.addCommas(a.Reach),
                        FamilyUpgradation              : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.FamilyUpgradation)+"</b>" : this.addCommas(a.FamilyUpgradation),
                        // proportionToTotal              : ((((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%") === "NAN%") ? " " : (((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%"),
                        unitCost                       : (a.unitCost),
                        physicalUnit                   : (a.physicalUnit),
                        TotalBudget                    : (a.TotalBudget),
                        LHWRF                          : (a.LHWRF),
                        NABARD                         : (a.NABARD),
                        Bank_Loan                      : (a.Bank_Loan),
                        Govt                           : (a.Govt),
                        DirectCC                       : (a.DirectCC),
                        IndirectCC                     : (a.IndirectCC),
                        Other                          : (a.Other),
                        remark                         : (a.remark),
                    } 
                })  
                this.setState({
                    tableData : tableData
                },()=>{
                })
            })
            .catch(function(error){  
              console.log("error = ",error.message);
            });
        }
      }
    }
  }
  // getSearchText(searchText, startRange, limitRange){
  //   this.setState({
  //     tableData : []
  //   });
  // }
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
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID, this.state.month);
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
                             Activity Plan
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 "> 
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                        <label className="formLable">Plan</label>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                          <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.handleChange.bind(this)} >
                            <option disabled="disabled" selected="true">-- Select Plan --</option>
                            {
                              this.state.months.map((data,index) =>
                                <option key={index}  value={data} >{data}</option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Year</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                          <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                            <option className="hidden" >-- Select--</option>
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
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Sector</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                            <option  className="hidden" >--Select--</option>
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
                      <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
                        <label className="formLable">Activity<span className="asterix">*</span></label>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                          <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                            <option disabled="disabled" selected={true}>-- Select --</option>
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
                            <option disabled="disabled" selected={true}>-- Select --</option>
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
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                    <div className="">                    
                        <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <IAssureTable 
                                tableName = "Activitywise Plan"
                                id = "ActivitywisePlan"
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default ActivitywisePlan