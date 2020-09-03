import React,{Component}         from 'react';
import axios                     from 'axios';
import $                         from "jquery";
import { render }                from 'react-dom';
import moment                    from 'moment';
import swal                      from 'sweetalert';
import html2canvas               from 'html2canvas';
import Chart                     from 'chart.js';
import ReactHTMLTableToExcel     from 'react-html-table-to-excel';
import StatusComponent           from './StatusComponent/StatusComponent.js';
import Loader                    from "../../common/Loader.js";
import IAssureTable              from "../IAssureTable/IAssureTable.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Dashboard.css';

export default class Dashboard extends Component{
  constructor(props) {
   super(props);
    this.state = {
      "center_sector"                : [],
      "month"                        : [],
      "piechartcolor"                : [],
      "sector"                       : [],
      "annualPlanReach"              : [],
      "annualPlanFamilyUpgradation"  : [],
      "achievementReach"             : [],
      "achievementTotalBudget"       : [],
      "monthlyAchievementReach"      : [],
      "achievementFamilyUpgradation" : [],
      "tableDistrictData"            : [],
      "tableBlockData"               : [],
      "tablevillageData"             : [],
      "tableCentersHeading"          : [],
      "tableCenterData"              : [],          
      "cum_Plan_total"                   : 0,
      "cum_Achievement_total"            : 0,
      "cum_Achievement_reach"            : 0,
      "cum_Achievement_familyUpgradation": 0,
      "cum_Achievement_upgradedBenCount" : 0,
      "center_ID"                    : "all",
      "center"                       : "all",
      "annualPlanTotalBudget"        : [],
      "centerData" : [
        {"typeOfCenter" :"ADP Program",
          "count"       : 0
        },{
          "typeOfCenter" :"DDP Program",
          "count"       : 0,
       },
       {
          "typeOfCenter" :"Websites Program",
          "count"       : 0,
       }], 
      "centerCounts"                  :[],
      "villagesCovered"               : 0,
      "countAllCenter"                : 0,
      "countDistrict"                 : 0,
      "countBlocks"                   : 0,
      "villagesCovered"               : 0,
      "centerCount"                   : 0,
      "annualPlan_TotalBudget_L"      : 0,
      "achievement_Total_L"           : 0,
      "tableObjects"       : {
        paginationApply    : false,
        // downloadApply      : true,
        searchApply        : false,
      },
      "tableFinancialHeading"       : {
        source            : "Source",
        plan              : "Plan  (Rs in Lakhs)",
        achievement       : "Achievement  (Rs in Lakhs)",
      },
      "twoLevelHeader_physical"    : {
        apply           : true,
        firstHeaderData : [
          {
            heading : 'Sector Details',
            mergedColoums : 2,
            hide : false
          },
          {
            heading : 'Plan',
            mergedColoums : 2,
            hide : false
          },
          {
            heading : "Achievement",
            mergedColoums : 2,
            hide : false
          },
        ]
      },
      "tablePhysicalHeading"       : {
        sector                  : "Sector",   
        plan_reach              : "Reach  (Beneficiary)",       
        plan_upgradation        : "Upgradation (Family)",             
        achievement_reach       : "Reach  (Beneficiary)",              
        achievement_upgradation : "Upgradation (Family)",       
      },
      "tableDistrictHeading"       : {
        centerName    :"CenterName",              
        district      :"District",            
      },
      "tableBlockHeading"       : {
        centerName    :"CenterName",              
        district      :"District",            
        block         :"Block",         
      },
      "tablevillageHeading"       : {
        centerName    :"CenterName",              
        district      :"District",            
        block         :"Block",         
        village       :"Village",             
      },
      "twoLevelHeader_Center"    : {
        apply           : true,
        firstHeaderData : [
          {
            heading : 'Center Details',
            mergedColoums : 2,
            hide : false
          },
          {
            heading : 'Achievement',
            mergedColoums : 2,
            hide : false
          },
          {
            heading : "Financial Achievement (Rs in Lakhs)",
            mergedColoums : 8,
            hide : true
          },
        ]
      },
      "tableCenterHeading"       : {
        centerName        : "Center",
        reach             : "Reach (Beneficiary)",
        familyUpgradation : "Upgradation (Family)",
        total             : "Total",
        LHWRF             : "LHWRF",
        NABARD            : "NABARD",
        bankLoan          : "Bank Loan",
        directCC          : "DirectCC",
        govtscheme        : "Govt.",
        indirectCC        : "IndirectCC",
        other             : "Other",
      },
    }
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.year();
    this.currentFromDate();
    this.currentToDate();
    this.getAvailableCentersData();
    this.getCentersData();
    this.getAvailableCenters();
    this.getcenter();
    this.getCountOfSubactivities();
    this.cumulative_Plan_Data(this.state.year);
    this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
    this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
    this.cumulative_Achievement_Data(this.state.year, this.state.center_ID);
    this.getCenterwiseAchievement_Data(this.state.startDate, this.state.endDate);
  }
  componentWillReceiveProps(nextProps){
    this.year();
    this.currentFromDate();
    this.currentToDate();
    this.getAvailableCentersData();
    this.getCentersData();
    this.getAvailableCenters();
    this.cumulative_Plan_Data(this.state.year);
    this.getCountOfSubactivities();
    this.cumulative_Achievement_Data(this.state.year, this.state.center_ID);
    this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
    this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
    this.getCenterwiseAchievement_Data(this.state.startDate, this.state.endDate);
  }
  getcenter(){
    axios({
      method: 'get',
      url: '/api/centers/count/typeofcenter',
    }).then((response)=> {
      // console.log('response', response);
      this.setState({
        centerData   : response.data,
        centerCounts : response.data.map((o,i)=>{return o.count})
      },()=>{
        // console.log('centerCounts', this.state.centerCounts);
        this.setState({
          "centerCount" : this.state.centerCounts.reduce((a,b)=>{return a + b})
        })
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      // console.log('response',response);
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
        this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
        this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
      })
    });
  } 
  getCountOfSubactivities(){
    axios({
      method: 'get',
      url: 'api/sectors/subactivity/count',
    }).then((response)=> {
      // console.log('responseCount',response);
      this.setState({
        sectorData : response.data,
      },()=>{
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  } 
  getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getRandomColor_sector(){
    var letters = '01234ABCDEF56789';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  closeModal(){
    $('#dataShow').css({"display": "none"});
    $('#dataShow').removeClass('in');  
  }
  closeLocationModal(){
    $('#locationShow').css({"display": "none"});
    $('#locationShow').removeClass('in');  
  }
  getAvailableCentersData(){
    axios({
      method: 'get',
      url: '/api/reportDashboard/list_count_center_district_blocks_villages',
    }).then((response)=> {
      // console.log("response ==>",response.data);
      if (response.data && response.data[0]) {
        this.setState({
          CenterNames              : response.data[0].centerName,
          villagesCoveredInCenter  : response.data[0].villagesCovered.map((o,i)=>{return o}),
          countAllCenter           : response.data[0].countCenter,
          countDistrict            : response.data[0].countDistrict,
          countBlocks              : response.data[0].countBlocks,
          villagesCovered          : response.data[0].countVillages,
          blocksCovered            : response.data[0].blocksCovered.map((o,i)=>{return o}),
          districtsCovered         : response.data[0].districtsCovered.map((o,i)=>{return o}),
        })
      }
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  getFinancialData(startDate, endDate, center_ID){
    if(startDate && endDate && center_ID){
      $(".fullpageloader").show();
      axios.get('/api/reports/plan_vs_Achivement_Financial/'+startDate+'/'+endDate+'/'+center_ID)
      .then((response)=>{
        // console.log('response',response);
        $(".fullpageloader").hide();
        var tableData = response.data.map((a, i)=>{
            return {
              _id               : a._id,
              source            : a.source,
              plan              : a.plan,
              achievement       : a.achievement,
            }
          })
        this.setState({
          tableFinancialData : tableData
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  cumulative_Plan_Data(year){
    if(year){
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      $(".fullpageloader").show();
      axios.get('/api/reports/plan_vs_Achivement_Financial/'+startDate+'/'+endDate+'/all')
      .then((response)=>{
        // console.log('cumulative_Plan_Data',response);
        // console.log('cumulative_Plan_Data',response.data[7].plan);
        $(".fullpageloader").hide();
        this.setState({
          cum_Plan_total : response.data[7].plan
        },()=>{
          console.log('cum_Plan_total',this.state.cum_Plan_total);
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  getPhysicalData(startDate, endDate, center_ID){
    if(startDate && endDate && center_ID){
      $(".fullpageloader").show();
      // axios.get('/api/reports/plan_vs_Achievement_Physical/'+year+'/'+center_ID)
      axios.get('/api/reports/plan_vs_Achievement_Physical/'+startDate+'/'+endDate+'/'+center_ID)
      .then((response)=>{
        // console.log('response',response);
        $(".fullpageloader").hide();
        var tableData = response.data.map((a, i)=>{
          return {
            _id                     : a._id,
            sector                  : a.sector,   
            plan_reach              : a.plan_reach,       
            plan_upgradation        : a.plan_upgradation,             
            achievement_reach       : a.achievement_reach,              
            achievement_upgradation : a.achievement_upgradation,                    
          }
        })
        this.setState({
          tablePhysicalData : tableData
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  cumulative_Achievement_Data(year, center_ID){
    if(year && center_ID){
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      $(".fullpageloader").show();
      axios.get('/api/reports/cumulative_Data/'+startDate+'/'+endDate+'/all')
      .then((response)=>{
        // console.log('cumulative_Data',response);
        $(".fullpageloader").hide();
        this.setState({              
          "cum_Achievement_total"                  : response.data[0].total,
          "cum_Achievement_reach"                  : response.data[0].reach,
          "cum_Achievement_familyUpgradation"      : response.data[0].familyUpgradation,
          "cum_Achievement_upgradedBenCount"       : response.data[0].upgradedBenCount,
        },()=>{
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  getCenterwiseAchievement_Data(startDate, endDate){
    if(startDate && endDate){
      $(".fullpageloader").show();
      axios.get('/api/reports/center_wise_Achievements/'+startDate+'/'+endDate)
      .then((response)=>{
        // console.log('response=====',response);
        $(".fullpageloader").hide();
        var tableData = response.data.map((a, i)=>{
          return {
            _id               : a._id,
            centerName        : a.centerName,
            reach             : a.reach,
            familyUpgradation : a.familyUpgradation,
            total             : a.total,
            LHWRF             : a.LHWRF,
            NABARD            : a.NABARD,
            bankLoan          : a.bankLoan,
            directCC          : a.directCC,
            govtscheme        : a.govtscheme,
            indirectCC        : a.indirectCC,
            other             : a.other,
            total             : a.total,
          }
        })
        this.setState({
          centerAchievementData : tableData
        },()=>{
          // console.log('centerAchievementData',this.state.centerAchievementData);
        })
      })
      .catch(function(error){
        console.log("error = ",error);
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
      this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getCenterwiseAchievement_Data(this.state.startDate, this.state.endDate);
    // this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
      this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getCenterwiseAchievement_Data(this.state.startDate, this.state.endDate);
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
      this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getCenterwiseAchievement_Data(this.state.startDate, this.state.endDate);
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
      this.getFinancialData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getPhysicalData(this.state.startDate, this.state.endDate, this.state.center_ID);
      this.getCenterwiseAchievement_Data(this.state.startDate, this.state.endDate);
    });
    return today;
  }
  dataShow(id){
    console.log('id',id);
    if(id === "Districts"){
      var getData = this.state.districtsCovered
    }else if(id === "Blocks"){
      var getData = this.state.blocksCovered
    }else if(id === "Centers"){
      var getData = this.state.CenterNames
    }else{
      var getData = this.state.villagesCoveredInCenter
    }
    this.setState({
      "dataShow" : getData,
      "dataHeading" : id
    },()=>{
      $('#dataShow').css({"display": "block"});
      $('#dataShow').addClass('in');  
    })
  }
  getCentersData(){
    axios({
      method: 'get',
      url: '/api/reportDashboard/list_count_center_district_blocks_villages_list/all/all/all',
    }).then((response)=> {
      // console.log("response ==>",response.data);
      function removeDuplicates(data, param){
        return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
        })
      }
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      var centerdata = response.data.sort(dynamicSort("centerName"));

      var tableDistrictData= removeDuplicates(centerdata, "district");
      tableDistrictData = tableDistrictData.map((a, i)=>{
        return {
          _id           :a._id,
          centerName    :a.centerName,              
          district      :a.district.split('|')[0],            
        }
      })
      var tableBlockData= removeDuplicates(centerdata, "block");
      tableBlockData = tableBlockData.map((a, i)=>{
        return {
          _id           :a._id,
          centerName    :a.centerName,              
          district      :a.district.split('|')[0],            
          block         :a.block,         
        }
      })
      var tablevillageData= removeDuplicates(centerdata, "village");
      tablevillageData = tablevillageData.map((a, i)=>{
        return {
          _id           :a._id,
          centerName    :a.centerName,              
          district      :a.district.split('|')[0],            
          block         :a.block,         
          village       :a.village,                         
        }
      })
      this.setState({
        tableDistrictData : tableDistrictData,
        tableBlockData    : tableBlockData,
        tablevillageData  : tablevillageData,
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  locationShow(id){
    if(id === "Districts"){
      var tableHeading = this.state.tableDistrictHeading;
      var tableData    = this.state.tableDistrictData;
    }else if(id === "Blocks"){
      var tableHeading = this.state.tableBlockHeading;
      var tableData    = this.state.tableBlockData;
    }else  if(id === "Villages"){
      var tableHeading = this.state.tablevillageHeading;
      var tableData    = this.state.tablevillageData;
    }
    this.setState({
      "tableCenterData"     : tableData,
      "tableCentersHeading" : tableHeading,
      "dataHeading"         : id
    },()=>{
      $('#locationShow').css({"display": "block"});
      $('#locationShow').addClass('in');  
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
        this.cumulative_Plan_Data(this.state.year);
        this.cumulative_Achievement_Data(this.state.year, this.state.center_ID);
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
        <div className="row">
          <div className="formWrapper"> 
            <section className="content">
              <div className="dashContent">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                  <h3 className="zeroMarginTop">Dashboard</h3>
                </div>
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                  <div className="row">
                    <StatusComponent 
                      stats={{
                        color:"rgba(54, 162, 235, 1)", icon:"building",
                        centerData : this.state.centerData,
                        centerCount : this.state.centerCount,
                        multipleValues : true}} 
                    />
                    <StatusComponent 
                      stats={{
                        color:"#DD4B39", 
                        icon:"thumbs-o-up",
                        sectorData : this.state.sectorData,
                        multipleValues : true}} 
                    />
                    <StatusComponent 
                      stats={{
                        color:"#4CA75A", 
                        icon:"user",heading1:"Reach",value1:this.state.cum_Achievement_reach ? this.state.cum_Achievement_reach : 0, heading2:"Upgraded Beneficiaries",value2:this.state.cum_Achievement_upgradedBenCount ? this.state.cum_Achievement_upgradedBenCount : 0,multipleValues : false}} 
                    />
                    <StatusComponent 
                      stats={{
                        color:"#F39C2F", 
                        icon:"rupee",heading1:"Budget",
                        value1:this.state.cum_Plan_total        ? "Rs. "+this.state.cum_Plan_total +" L" : "Rs. 0 L", heading2:"Expenditure",
                        value2:this.state.cum_Achievement_total ? "Rs. "+this.state.cum_Achievement_total +" L" : "Rs. 0 L",multipleValues : false}} 
                    />
                </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                      <div className="info-box bg-skyblue">
                        <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>
                        <div className="info-box-content">
                          <span className="info-box-text pull-left">Centers</span>
                          {this.state.countAllCenter > 0 ?
                          <span className="pull-right"><a href=""  className="whiteColor" data-toggle="modal" onClick={()=> this.dataShow("Centers")}>View All..</a></span>
                          : 
                          ""}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt1                                                                                                                           0">
                            <span className="info-box-number">{this.state.countAllCenter}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.countAllCenter+"%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                      <div className="info-box bg-red">
                        <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>
                        <div className="info-box-content">
                          <span className="info-box-text pull-left">Districts</span>
                          {
                            this.state.tableDistrictData.length > 0 ?
                              <a className="viewLink" title="View List" target="_blank"  href={"/listofvillages"}>
                                <i className="fa  fa-arrow-circle-right tablearrow pull-right"></i>
                              </a>
                            : 
                            ""
                          }
                          {/*<span className="pull-right"><a href="" className="whiteColor" data-toggle="modal" onClick={()=> this.locationShow("Districts")}>View All..</a></span>*/}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                            <span className="info-box-number">{this.state.tableDistrictData.length}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.tableDistrictData.length+"%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                      <div className="info-box bg-green">
                        <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>
                        <div className="info-box-content">
                          <span className="info-box-text pull-left">Blocks</span>
                          {
                            this.state.tableBlockData.length > 0 ?
                              <a className="viewLink" title="View List" target="_blank"  href={"/listofvillages"}>
                                <i className="fa  fa-arrow-circle-right tablearrow pull-right"></i>
                              </a>
                            : 
                            ""
                          }
                          {/*<span className="pull-right"><a href="" className="whiteColor" data-toggle="modal" onClick={()=> this.locationShow("Blocks")}>View All..</a></span>*/}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                            <span className="info-box-number">{this.state.tableBlockData.length}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.tableBlockData.length+"%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                      <div className="info-box bg-yellow">
                        <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>
                        <div className="info-box-content">
                          <span className="info-box-text pull-left">Villages</span>
                          {
                            this.state.tablevillageData.length > 0 ?
                              <a className="viewLink" title="View List" target="_blank"  href={"/listofvillages"}>
                                <i className="fa  fa-arrow-circle-right tablearrow pull-right"></i>
                              </a>
                            : 
                            ""
                          }
                          {/*<span className="pull-right"><a href="" className="whiteColor" data-toggle="modal" onClick={()=> this.locationShow("Villages")}>View All..</a></span>*/}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                            <span className="info-box-number">{this.state.tablevillageData.length}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.tablevillageData.length+"%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>  
                    <div className="modal fade" id="dataShow" role="dialog">
                      <div className="modal-dialog">                        
                        <div className="modal-content">
                          <div className="modal-header backColor">
                            <button type="button" className="close" onClick={()=> this.closeModal()}>&times;</button>
                            <h4 className="modal-title">{this.state.dataHeading}</h4>
                          </div>
                          <div className="modal-body">
                            {
                              this.state.dataShow && this.state.dataShow.length > 0 ?
                              this.state.dataShow.map((data,index)=>{
                                 return(
                                    <span className="listfontInmodal" key={index}>
                                         <i className="fa fa-circle-o circleFont" aria-hidden="true"></i> {data}
                                    </span>
                                  )
                              }) 
                            :
                            null 
                          }
                          </div>
                          <div className="modal-footer">
                          </div>
                        </div>
                      </div>
                    </div>       
                    <div className="modal fade" id="locationShow" role="dialog">
                      <div className="modal-dialog">                        
                        <div className="modal-content">
                          <div className="modal-header backColor">
                            <button type="button" className="close" onClick={()=> this.closeLocationModal()}>&times;</button>
                            <h4 className="modal-title">{this.state.dataHeading}</h4>
                          </div>
                          <div className="modal-body">
                            <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12">
                              { 
                                this.state.dataHeading==="Districts" ? 
                                <div className="row">
                                  <IAssureTable 
                                    tableName = "tableDistrictData"
                                    id = "tableDistrictData" 
                                    tableHeading={this.state.tableDistrictHeading}
                                    tableData={this.state.tableDistrictData}
                                    getData={this.getCentersData.bind(this)}
                                    tableObjects={this.state.tableObjects}
                                  />
                                </div>
                                : null
                              }
                              {
                                this.state.dataHeading==="Blocks" ? 
                                  <IAssureTable 
                                    tableName = "tableBlockData"
                                    id = "tableBlockData" 
                                    tableHeading={this.state.tableBlockHeading}
                                    tableData={this.state.tableBlockData}
                                    getData={this.getCentersData.bind(this)}
                                    tableObjects={this.state.tableObjects}
                                  />
                                : null
                              } 
                              {
                                this.state.dataHeading==="Villages" ? 
                                  <IAssureTable 
                                    tableName = "tablevillageData"
                                    id = "tablevillageData" 
                                    tableHeading={this.state.tablevillageHeading}
                                    tableData={this.state.tablevillageData}
                                    getData={this.getCentersData.bind(this)}
                                    tableObjects={this.state.tableObjects}
                                  />
                                : null
                              }
                            </div>
                          </div>
                          <div className="modal-footer">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="row">
                    <div className="col-lg-offset-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">From</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">To</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                        </div>
                    </div>   
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding border_Box_Filter">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 subdashHeader">Center wise Achievements</div>
                        <IAssureTable 
                          tableName = "Center wise Achievements"
                          id = "center_wise_Achievements" 
                          tableHeading={this.state.tableCenterHeading}
                          twoLevelHeader={this.state.twoLevelHeader_Center} 
                          tableData={this.state.centerAchievementData}
                          getData={this.getCenterwiseAchievement_Data.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
                      </div>
                    </div>
                  </div> 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <div className="row">
                      <div className="col-lg-4 col-lg-offset-4 col-md-4 col-sm-6 col-xs-12 valid_box">
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
                    </div> 
                  </div> 
                  <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <div className="col-lg-7 col-md-6 col-sm-12 col-xs-12 ">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding border_Box_Filter">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 subdashHeader">Plan Vs Achievement (Physical)</div>
                        <IAssureTable 
                          // noSRNumber = {false}  
                          // divClass = "col-lg-12"
                          tableName = "PlanVsAchievement_Physical"
                          id = "PlanVsAchievement_Physical" 
                          twoLevelHeader={this.state.twoLevelHeader_physical} 
                          tableHeading={this.state.tablePhysicalHeading}
                          tableData={this.state.tablePhysicalData}
                          getData={this.getPhysicalData.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
                      </div> 
                    </div> 
                    <div className="col-lg-5 col-md-6 col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding border_Box_Filter">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 subdashHeader">Plan Vs Achievement (Financial)</div>
                        <IAssureTable 
                          // noSRNumber = {false}  
                          // divClass = "col-lg-12"
                          tableName = "PlanVsAchievement_Financial"
                          id = "PlanVsAchievement_Financial" 
                          tableHeading={this.state.tableFinancialHeading}
                          tableData={this.state.tableFinancialData}
                          getData={this.getFinancialData.bind(this)}
                          tableObjects={this.state.tableObjects}
                        />
                      </div>
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
