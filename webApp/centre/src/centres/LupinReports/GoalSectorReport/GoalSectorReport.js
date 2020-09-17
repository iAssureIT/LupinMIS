import React, { Component } from 'react';
import $                    from 'jquery';
import swal                 from 'sweetalert';
import axios                from 'axios';
import Loader               from "../../../common/Loader.js";
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./GoalSectorReport.css"
import "../../Reports/Reports.css";
class GoalSectorReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "projectCategoryType": "all",
        "goalName"           : "all",
        "selectedDistrict"   : "all",
        "district"           : "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "limitRange"        : 10000,
        // "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Goal',
                    mergedColoums : 3
                }, 
                {
                    heading : 'Details of Activity',
                    mergedColoums : 10
                },
                {
                    heading : 'Financial Sharing "Rs. in Lakh"',
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : {       
          "goalType"                      : "Framework",
          "goalName"                      : 'Goal / Objective',
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
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.handleFromChange    = this.handleFromChange.bind(this);
    this.handleToChange      = this.handleToChange.bind(this);
    this.currentFromDate     = this.currentFromDate.bind(this);
    this.currentToDate       = this.currentToDate.bind(this);
  }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
      tableData : this.state.tableData,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    this.getAvailableCenterData(this.state.center_ID);
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
    });
    this.getTypeOfGoal();
    // console.log('this.state.goalType=========',this.state.goalType);
    this.getNameOfGoal(this.state.goalType);
    this.getAvailableProjects();
    this.year();
    // this.currentFromDate();
    // this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }   
  componentWillReceiveProps(nextProps){
    this.getAvailableProjects();
    this.currentFromDate();
    this.currentToDate();
    this.getTypeOfGoal();
    this.getNameOfGoal(this.state.goalType);
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
  }

  getAvailableCenterData(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        function removeDuplicates(data, param){
            return data.filter(function(item, pos, array){
                return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
            })
        }
        var availableDistInCenter= removeDuplicates(response.data[0].villagesCovered, "district");
        this.setState({
          availableDistInCenter  : availableDistInCenter,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID, this.state.isUpgraded);
          var stateCode =this.state.address.split('|')[0];
         this.setState({
            stateCode  : stateCode,
          });
      })
    }).catch(function (error) {
      console.log("districtError",+error);
    });
  } 

  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      if(this.state.district==="all"){
        var selectedDistrict = this.state.district;
      }else{
        var selectedDistrict = this.state.district.split('|')[0];
      }
      this.setState({
        selectedDistrict :selectedDistrict,
      },()=>{        
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
      })
    });
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
      // console.log('name', this.state)
    });
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
              if(otherNumbers != '')
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
  }  
  getData(startDate, endDate,center_ID, goalType, goalName, beneficiaryType, projectCategoryType, projectName, selectedDistrict){
    if(center_ID && beneficiaryType && goalType && goalName){
      // $(".fullpageloader").show();
      // console.log(startDate, endDate, center_ID, goalType, goalName, beneficiaryType, projectCategoryType, projectName,selectedDistrict);
      // axios.get('/api/reports/goal/'+startDate+'/'+endDate+'/'+center_ID+'/'+goalType+"/"+goalName+"/"+beneficiaryType+"/"+projectCategoryType+"/"+projectName+"/"+selectedDistrict)
      axios.get('/api/reports/goal/'+startDate+'/'+endDate+'/'+center_ID+'/'+goalType+"/"+goalName+"/"+beneficiaryType+"/"+projectCategoryType+"/"+projectName+"/"+selectedDistrict)
      .then((response)=>{
        // $(".fullpageloader").hide();
        console.log("resp",response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                         : a._id,           
            goalType                    : a.goalType,
            goalName                    : a.goalName,
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
          // console.log("resp",this.state.tableData)
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
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
        })          
      }else if (this.state.projectCategoryType=== "all"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
        })    
      }else  if(this.state.projectCategoryType=== "Project Fund"){
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
      }
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
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
      projectName : projectName,
    },()=>{
    // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);      
    })
  }

  handleFromChange(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    // console.log(Date.parse(startDate));
    
    var dateVal = event.target.value;
    var dateUpdate = new Date(dateVal);
    var startDate = moment(dateUpdate).format('YYYY-MM-DD');
    this.setState({
       [name] : event.target.value,
       startDate:startDate
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
    // console.log("dateUpdate",this.state.startDate);
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
    // console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
    });
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
  onBlurEventFrom(){
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    // console.log("startDate",startDate,endDate)
    if ((Date.parse(endDate) < Date.parse(startDate))) {
        swal("Start date","From date should be less than To date");
        this.refs.startDate.value="";
    }
  }
  onBlurEventTo(){
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
      // console.log("startDate",startDat++++++e,endDate)
        if ((Date.parse(startDate) > Date.parse(endDate))) {
          swal("End date","To date should be greater than From date");
          this.refs.endDate.value="";
      }
  }
  
  getTypeOfGoal(){
    axios({
      method: 'get',
      url: '/api/typeofgoals/list',
    }).then((response)=> {
    var getheader = {...this.state.twoLevelHeader};
    this.setState({
      listofTypes : response.data,
      goalType    : response.data[0]._id,
      selectedTypeofGoal    : response.data[0].typeofGoal
    },()=>{
      // console.log("goalType",this.state.goalType)
      getheader.firstHeaderData[0].heading = this.state.selectedTypeofGoal+" Goal ";
      this.getNameOfGoal(this.state.goalType)
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
    })
    }).catch(function (error) {
      // console.log("error = ",error);
    });
  }
  selectType(event){
    event.preventDefault();
    var selectedType = event.currentTarget.value;
    var selectedTypeofGoal     =$(event.currentTarget).find('option:selected').attr('data-name')
    var getheader = {...this.state.twoLevelHeader};
    this.setState({
      goalType : selectedType,
      selectedTypeofGoal : selectedTypeofGoal,
      goalName : 'all',
      twoLevelHeader : getheader
    },()=>{
      getheader.firstHeaderData[0].heading = this.state.selectedTypeofGoal+" Goal ";
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
      this.getNameOfGoal(this.state.goalType)
    });
  }
  getNameOfGoal(goalType){
  // console.log('goalType',goalType);
    if(goalType){
      axios({
        method: 'get',
        url: '/api/typeofgoals/'+goalType,
      }).then((response)=> {
        if(response&&response.data[0]){
          // console.log("response = ",response);
          this.setState({
            listofGoalNames : response.data[0].goal
          })
        }
      }).catch(function (error) {
        // console.log("error = ",error);
      });
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName, this.state.selectedDistrict);
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
                         Goal Report
                      </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                      <label className="formLable">Framework</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                        <select className="custom-select form-control inputBox" ref="goalType" name="goalType" value={this.state.goalType} onChange={this.selectType.bind(this)}>
                          <option selected={true} disabled="disabled">-- Select --</option>
                          {
                            this.state.listofTypes ?
                            this.state.listofTypes.map((data, index)=>{
                              return(
                                <option key={index} data-name={data.typeofGoal} value={data._id}>{data.typeofGoal}</option> 
                              );
                            })
                            :
                            null
                          }
                        </select>
                      </div>
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                      <label className="formLable">Goal / Objective</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalName" >
                        <select className="custom-select form-control inputBox" ref="goalName" name="goalName" value={this.state.goalName} onChange={this.handleChange.bind(this)}>
                          <option selected={true} disabled="disabled">-- Select --</option>
                          <option value="all" >All</option>
                          {
                            this.state.listofGoalNames ?
                            this.state.listofGoalNames.map((data, index)=>{
                              return(
                                <option key={index} data-name={data.goalName} value={data.goalName}>{data.goalName}</option> 
                              );
                            })
                            :
                            null
                          }
                        </select>
                      </div>
                    </div>  

                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
                      <label className="formLable">District</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                        <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                          <option  className="hidden" >-- Select --</option>
                          <option value="all" >All</option>                                
                            {
                            this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 ? 
                            this.state.availableDistInCenter.map((data, index)=>{
                              // console.log("data",data)
                              return(
                                /*<option key={index} value={this.camelCase(data.split('|')[0])}>{this.camelCase(data.split('|')[0])}</option>*/
                                <option key={index} value={(data.district+'|'+data._id)}>{data.district.split('|')[0]}</option>

                              );
                            })
                            :
                            null
                          }                               
                        </select>
                      </div>
                    </div>
                  </div>  
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">From</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <input onChange={this.handleFromChange}   onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                        </div>
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">To</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <input onChange={this.handleToChange}  onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                        </div>
                    </div>                     
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
                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <IAssureTable  
                          tableName = "ADP Report"
                          id = "GoalSectorReport"
                          completeDataCount={this.state.tableDatas.length}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          editId={this.state.editSubId} 
                          getData={this.getData.bind(this)} 
                          tableHeading={this.state.tableHeading} 
                          tableData={this.state.tableData} 
                          tableObjects={this.state.tableObjects}
                          getSearchText={this.getSearchText.bind(this)}
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
export default GoalSectorReport