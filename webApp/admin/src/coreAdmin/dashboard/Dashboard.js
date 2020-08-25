import React,{Component}         from 'react';
import axios                     from 'axios';
import $                         from "jquery";
import { render }                from 'react-dom';
import moment                    from 'moment';
import html2canvas               from 'html2canvas';
import Chart                     from 'chart.js';
import ReactHTMLTableToExcel     from 'react-html-table-to-excel';
import StatusComponent           from './StatusComponent/StatusComponent.js'
import MonthwiseGoalCompletion   from './chart1/MonthwiseGoalCompletion.js'
import MonthwiseExpenditure      from './chart1/MonthwiseExpenditure.js'
import BarChart                  from './chart1/BarChart.js';
import PieChart                  from './chart1/PieChart.js';
import CenterWisePieChart        from './chart1/CenterWisePieChart.js';
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
      // 'year'                          : "FY 2019 - 2020",
      // "years"                         :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
      "annualPlan_TotalBudget_L"      : 0,
      "achievement_Total_L"           : 0,
      "tableObjects"       : {
        paginationApply    : false,
        searchApply        : false,
      },
      "tableFinancialHeading"       : {
        source            : "Source",
        plan              : "Plan  (Rs in Lakhs)",
        achievement       : "Achievement  (Rs in Lakhs)",
      },
      "tablePhysicalHeading"       : {
        sector                  : "Sector",   
        plan_reach              : "Plan Reach  (Beneficiary)",       
        plan_upgradation        : "Plan Upgradation (Family)",             
        achievement_reach       : "Achievement Reach  (Beneficiary)",              
        achievement_upgradation : "Achievement Upgradation (Family)",       
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
  }
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.year();
    this.getAvailableCentersData();
    this.getAvailableCenters();
    this.getcenter();
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getFinancialData(this.state.year, this.state.center_ID);
    this.getPhysicalData(this.state.year, this.state.center_ID);
    this.getCenterwiseAchievement_Data(this.state.year);
  }
  getcenter(){
    axios({
      method: 'get',
      url: '/api/centers/count/typeofcenter',
    }).then((response)=> {
      // console.log('response', response);
      this.setState({
        centerData : response.data,
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
  componentWillReceiveProps(nextProps){
    this.year();
    this.getAvailableCentersData();
    this.getAvailableCenters();
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getCenterwiseData(this.state.year);
    this.getFinancialData(this.state.year, this.state.center_ID);
    this.getPhysicalData(this.state.year, this.state.center_ID);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getCenterwiseData(this.state.year);
      this.getFinancialData(this.state.year, this.state.center_ID);
      this.getPhysicalData(this.state.year, this.state.center_ID);
      this.getCenterwiseAchievement_Data(this.state.year);
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
        this.getCenterwiseData(this.state.year);
        this.getPhysicalData(this.state.year, this.state.center_ID);
        this.getFinancialData(this.state.year, this.state.center_ID);
        this.getCenterwiseAchievement_Data(this.state.year);
      })
    });
  } 
  getCountOfActivities(){
    axios({
      method: 'get',
      url: 'api/sectors/count',
    }).then((response)=> {
      this.setState({
        sectorCount : response.data.dataCount,
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  getCountOfSectors(){
    axios({
      method: 'get',
      url: 'api/sectors/activity/count',
    }).then((response)=> {
      this.setState({
        activityCount : response.data.dataCount,
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  } 
  getCenterwiseData(year){
    console.log('year', year);
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(startDate && endDate){
        axios.get('/api/report/center/'+startDate+'/'+endDate+'/all/all/all/all/all')
        .then((response)=>{
          console.log('centerwiseData',response)
          /*******************************Dashboard Status Data***************************/
          if(response.data){
            var centerwiseData = response.data;
            var totalindex = (centerwiseData.length)-2;
            var totalData = response.data[totalindex];
            var achievement_Reach       = totalData.achievement_Reach;
            var annualPlan_Reach        = totalData.annualPlan_Reach;
            var annualPlan_TotalBudget  = totalData.annualPlan_TotalBudget;
            var achievement_TotalBudget = totalData.achievement_TotalBudget;
            var annualPlan_TotalBudget_L = totalData.annualPlan_TotalBudget_L;
            var achievement_Total_L      = totalData.achievement_TotalBudget_L;
              this.setState({
              achievement_Reach        : achievement_Reach,
              annualPlan_Reach         : annualPlan_Reach,
              annualPlan_TotalBudget   : annualPlan_TotalBudget,
              achievement_TotalBudget  : achievement_TotalBudget,
              annualPlan_TotalBudget_L : annualPlan_TotalBudget_L,
              achievement_Total_L      : achievement_Total_L
            })
          }
      }).catch(function (error) {
        console.log('error', error);
      });
    }
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
  dataShow(id){
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
  closeModal(){
    $('#dataShow').css({"display": "none"});
    $('#dataShow').removeClass('in');  
  }
  getAvailableCentersData(){
    axios({
      method: 'get',
      url: '/api/reportDashboard/list_count_center_district_blocks_villages',
    }).then((response)=> {
      // console.log("response ==>",response.data[0]);
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
        console.log('year',this.state.year);
        this.getFinancialData(this.state.year, this.state.center_ID);
        this.getPhysicalData(this.state.year, this.state.center_ID);
        this.getCenterwiseAchievement_Data(this.state.year);
        this.getCenterwiseData(this.state.year);
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
  getFinancialData(year, center_ID){
    if(year && center_ID){
      $(".fullpageloader").show();
      axios.get('/api/reports/plan_vs_Achivement_Financial/'+year+'/'+center_ID)
      .then((response)=>{
        console.log('response',response);
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
  getPhysicalData(year, center_ID){
    if(year && center_ID){
      $(".fullpageloader").show();
      axios.get('/api/reports/plan_vs_Achievement_Physical/'+year+'/'+center_ID)
      .then((response)=>{
        console.log('response',response);
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
  getCenterwiseAchievement_Data(year){
    if(year){
      console.log('year', year);
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      if(startDate && endDate){
        $(".fullpageloader").show();
        axios.get('/api/reports/center_wise_Achievements/'+startDate+'/'+endDate)
        .then((response)=>{
          console.log('response',response);
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
            console.log('centerAchievementData',this.state.centerAchievementData);
          })
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      }
    }
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
                      stats={{color:"rgba(54, 162, 235, 1)", icon:"building",
                        centerData : this.state.centerData,
                        centerCount : this.state.centerCount,
                        multipleValues : true}} 
                    />
                    <StatusComponent 
                      stats={{color:"#DD4B39", icon:"user",heading1:"Outreach",value1:this.state.annualPlan_Reach ? this.state.annualPlan_Reach : 0, heading2:"Upgraded Beneficiary",value2:this.state.achievement_Reach ? this.state.achievement_Reach : 0,multipleValues : false}} 
                    />
                    <StatusComponent 
                      stats={{color:"#4CA75A", icon:"rupee",heading1:"Budget",value1:this.state.annualPlan_TotalBudget_L ? "Rs. "+this.state.annualPlan_TotalBudget_L+" L" : "Rs. 0 L", heading2:"Expenditure",value2:this.state.achievement_Total_L ? "Rs. "+this.state.achievement_Total_L : "Rs. 0 L",multipleValues : false}} 
                    />
                    <StatusComponent 
                      stats={{color:"#F39C2F", icon:"thumbs-o-up",heading1:"Sectors",value1:this.state.sectorCount ? this.state.sectorCount : 0, heading2:"Activities",value2:this.state.activityCount ? this.state.activityCount : 0,multipleValues : false}}
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
                          <span className="pull-right"><a href="#"  className="whiteColor" data-toggle="modal" onClick={()=> this.dataShow("Centers")}>View All..</a></span>
                          : 
                          ""}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
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
                          {this.state.countDistrict > 0 ?
                          <span className="pull-right"><a href="#" className="whiteColor" data-toggle="modal" onClick={()=> this.dataShow("Districts")}>View All..</a></span>
                          : 
                          ""}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                            <span className="info-box-number">{this.state.countDistrict}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.countDistrict+"%"}}></div>
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
                          {this.state.countBlocks > 0 ?
                          <span className="pull-right"><a href="#" className="whiteColor" data-toggle="modal" onClick={()=> this.dataShow("Blocks")}>View All..</a></span>
                          : 
                          ""}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                            <span className="info-box-number">{this.state.countBlocks}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.countBlocks+"%"}}></div>
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
                          {this.state.villagesCovered > 0 ?
                          <span className="pull-right"><a href="#" className="whiteColor" data-toggle="modal" onClick={()=> this.dataShow("Villages")}>View All..</a></span>
                          : 
                          ""}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                            <span className="info-box-number">{this.state.villagesCovered}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.villagesCovered+"%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="row">

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 subdashHeader">Center wise Achievements</div>
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
                    <div className="col-lg-offset-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
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
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12">
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
                  </div> 
                  <div className="col-lg-7 col-md-6 col-sm-12 col-xs-12">
                    <div className="row">
                      <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 subdashHeader">Plan Vs Achievement Physical</div>
                      <IAssureTable 
                        tableName = "PlanVsAchievement_Physical"
                        id = "PlanVsAchievement_Physical" 
                        tableHeading={this.state.tablePhysicalHeading}
                        tableData={this.state.tablePhysicalData}
                        getData={this.getPhysicalData.bind(this)}
                        tableObjects={this.state.tableObjects}
                      />
                    </div>
                  </div> 
                  <div className="col-lg-5 col-md-6 col-sm-12 col-xs-12">
                    <div className="row">
                      <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 subdashHeader">Plan Vs Achievement Financial</div>
                      <IAssureTable 
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
            </section>     
          </div>     
        </div>     
      </div>      
    );
  }
}
