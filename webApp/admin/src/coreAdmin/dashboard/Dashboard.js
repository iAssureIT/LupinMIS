import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import axios             from 'axios';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import html2canvas from 'html2canvas';
import Chart from 'chart.js';
import StatusComponent from './StatusComponent/StatusComponent.js'
import DummyBarChart   from './chart1/DummyBarChart.js'
import MonthBarChartbudget   from './chart1/MonthBarChartbudget.js'

import BarChart from './chart1/BarChart.js';
import PieChart from './chart1/PieChart.js';
import CenterWisePieChart from './chart1/CenterWisePieChart.js';
import {HorizontalBar} from 'react-chartjs-2';
import './Dashboard.css';
import {Bar} from 'react-chartjs-2';
 

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

  
const options = {
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
          }],
    },
    responsive: true,
    maintainAspectRatio: false     
};
export default class Dashboard extends Component{
  constructor(props) {
   super(props);
    this.state = {
      center_annualPlanTotalBudget  :[],
      "center_sector"                  : [],
      "month"                         : [],
      "piechartcolor"                  : [],
      "sector"                       : [],
      "annualPlanReach"              : [],
      "annualPlanFamilyUpgradation"  : [],
      "achievementReach"             : [],
      "achievementTotalBudget"             : [],
      "monthlyAchievementReach"             : [],
      "achievementFamilyUpgradation" : [],
      "annualPlanTotalBudget"        : [],
      "centerData" : [],
      'year'                : "FY 2019 - 2020",
      // 'months'              : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      // 'PlannedBeneficiaries': ['2000', '3500', '2000', '2100', '3000', '2300', '2500', '3100', '1800', '1600', '3000', '2000'],
      // 'ActualBeneficiaries' : ['1800', '3000', '1900', '2100', '2900', '2200', '2450', '3000', '1800', '1500', '2900', '2000'],
      // 'expenditure'         : ['18000', '30000', '19000', '21000', '29000', '20200', '24500', '30000', '18000', '15000', '20900', '20000'],
      // 'budget'              : ['20000', '35000', '20000', '21000', '30000', '23000', '25000', '31000', '19800', '16500', '30000', '20000'],
      "years"               :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"], 
    /*  "data1"               : {
        labels: [],
        datasets: [
          // {
          //   label: 'Achievement Reach',
          //   backgroundColor: 'rgba(75, 192, 192, 1)',
          //   borderColor:  'rgba(75, 192, 192, 0.5)',
          //   borderWidth: 1,
          //   hoverBackgroundColor:  'rgba(75, 192, 192, 0.5)',
          //   hoverBorderColor:  'rgba(75, 192, 192, 0.5)',
          //   stack: '1',
          //   data: []
          // },          
          {
            label: 'Achievement Family Upgradation',
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
            hoverBorderColor:'rgba(255, 206, 86, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'Annual Family Upgradation',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            stack: '1',
            data: []
          },
          // {
          //   label: 'AnnualReach',
          //   backgroundColor: 'rgba(255, 99, 132, 1)',
          //   borderColor: 'rgba(255, 99, 132, 0.5)',
          //   borderWidth: 1,
          //   hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',
          //   hoverBorderColor: 'rgba(255, 99, 132, 0.5)',
          //   stack: '2',
          //   data: []
          // },
        ]
      }*/
    }
  }
   
 
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableCenters();
    this.getcenter();
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getCenterwiseData(this.state.year);
    this.getSectorwiseData(this.state.year);
    this.getMonthwiseData(this.state.year);
  }

  getcenter(){
    axios({
      method: 'get',
      url: '/api/centers/count/typeofcenter',
    }).then((response)=> {
      console.log('response', response);
      this.setState({
        centerData : response.data,
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableCenters();
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getCenterwiseData(this.state.year);
    this.getMonthwiseData(this.state.year);
    this.getSectorwiseData(this.state.year);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
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
        center           : response.data[0].centerName+'|'+response.data[0]._id
      },()=>{
        // console.log('center', this.state.center);
        var center_ID = this.state.center.split('|')[1];
        this.setState({
          center_ID        : center_ID
        },()=>{
        })
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      var center_ID = this.state.selectedCenter.split('|')[1];
      // console.log('center_ID', center_ID);
      this.setState({
        center_ID :center_ID,            
      },()=>{
        // this.getData(this.state.year, this.state.center_ID);
        // this.getCenterwiseData(this.state.year);
        // this.getSectorwiseData(this.state.year);
        // this.getMonthwiseData(this.state.year);
        // this.getSourceData(this.state.year, this.state.center_ID);
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
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
    if(startDate, endDate){
        axios.get('/api/report/center/'+startDate+'/'+endDate+'/all/all/all/all/all')
        .then((response)=>{
      /*******************************Dashboard Status Data***************************/
          var centerwiseData = response.data;
          console.log('centerwiseData',centerwiseData)
          var totalindex = (centerwiseData.length)-2;
          var totalData = response.data[totalindex];
          var achievement_Reach      = totalData.achievement_Reach;
          var annualPlan_Reach       = totalData.annualPlan_Reach;
          var annualPlan_TotalBudget = totalData.annualPlan_TotalBudget;
          var achievement_TotalBudget = totalData.achievement_TotalBudget;
          this.setState({
            achievement_Reach        : achievement_Reach,
            annualPlan_Reach         : annualPlan_Reach,
            annualPlan_TotalBudget   : annualPlan_TotalBudget,
            achievement_TotalBudget  : achievement_TotalBudget,
          })
          // console.log("this.state",this.state);
          // console.log("totalData",totalData);
      /***********************************for centerwise data*************************/
          var sector = [];
          /*var annualPlanReach = [];
          var annualPlanFamilyUpgradation = [];
          var achievementReach = [];
          var achievementFamilyUpgradation = [];*/
          var annualPlanTotalBudget = [];
          var piechartcolor =[];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              sector.push(data.name);
              /*annualPlanReach.push(data.annualPlan_Reach);
              annualPlanFamilyUpgradation.push(data.annualPlan_FamilyUpgradation);
              achievementReach.push(data.achievement_Reach);
              achievementFamilyUpgradation.push(data.achievement_FamilyUpgradation);*/
              annualPlanTotalBudget.push(data.annualPlan_TotalBudget);
              piechartcolor.push(this.getRandomColor());
            })
                    // console.log("annualPlanTotalBudget",annualPlanTotalBudget);
          this.setState({
            "sector" : sector.splice(-2),
            // "annualPlanReach1" : annualPlanReach.splice(-2),
            // "annualPlanFamilyUpgradation1" : annualPlanFamilyUpgradation.splice(-2),
            // "achievementReach1" : achievementReach.splice(-2),
            // "achievementFamilyUpgradation1" : achievementFamilyUpgradation.splice(-2),
            "annualPlan_TotalBudget1" : annualPlanTotalBudget.splice(-2),
          },()=>{
          // console.log("this.state.achievementFamilyUpgradation1",this.state.achievementFamilyUpgradation1);
          // console.log("annualPlanTotalBudget",annualPlanTotalBudget);
          // console.log("this.state.annualPlan_TotalBudget1",this.state.annualPlan_TotalBudget1);
             this.setState({
              "center_sector"                       : sector,
              // "annualPlanReach"              : annualPlanReach,
              // "annualPlanFamilyUpgradation"  : annualPlanFamilyUpgradation,
              // "achievementReach"             : achievementReach,
              // "achievementFamilyUpgradation" : achievementFamilyUpgradation,
              "center_annualPlanTotalBudget"       : annualPlanTotalBudget,
              piechartcolor                 : piechartcolor
            },()=>{
        // console.log('center', this.state.center_sector,"tb",this.state.center_annualPlanTotalBudget);
                    
            });
          
          })
        } 
      }).catch(function (error) {
        console.log('error', error);
      });
    } 
  }

  getSectorwiseData(year){
    console.log('year', year);
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    // axios.get('/api/report/annual_completion_sector/'+year+'/'+centerID)
    if(startDate, endDate){
        axios.get('/api/report/sector/'+startDate+'/'+endDate+'/all/all/all/all')
        .then((response)=>{
          console.log("respgetData",response);
          var sector = [];
          var annualPlanReach = [];
          var annualPlanFamilyUpgradation = [];
          var achievementReach = [];
          var achievementFamilyUpgradation = [];
          var annualPlanTotalBudget = [];
          var piechartcolor =[];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              sector.push(data.name);
              annualPlanReach.push(data.annualPlan_Reach);
              annualPlanFamilyUpgradation.push(data.annualPlan_FamilyUpgradation);
              achievementReach.push(data.achievement_Reach);
              achievementFamilyUpgradation.push(data.achievement_FamilyUpgradation);
              annualPlanTotalBudget.push(data.annualPlan_TotalBudget);
              piechartcolor.push(this.getRandomColor_sector());
            })
            console.log("annualPlanTotalBudget",annualPlanTotalBudget);
          this.setState({
            "sector" : sector.splice(-2),
            "annualPlanReach1" : annualPlanReach.splice(-2),
            "annualPlanFamilyUpgradation1" : annualPlanFamilyUpgradation.splice(-2),
            "achievementReach1" : achievementReach.splice(-2),
            "achievementFamilyUpgradation1" : achievementFamilyUpgradation.splice(-2),
            "annualPlan_TotalBudget1" : annualPlanTotalBudget.splice(-2),
          },()=>{
             this.setState({
              "sector"                       : sector,
              "annualPlanReach"              : annualPlanReach,
              "annualPlanFamilyUpgradation"  : annualPlanFamilyUpgradation,
              "achievementReach"             : achievementReach,
              "achievementFamilyUpgradation" : achievementFamilyUpgradation,
              "annualPlanTotalBudget"        : annualPlanTotalBudget,
              "piechartcolor"                : piechartcolor
            },()=>{  
          // console.log("this",this.state.sector)                  
            });          
          })
        }    
          var tableData = response.data.map((a, i)=>{
            return {
                name                                    : a.name,
                annualPlan_Reach                        : a.annualPlan_Reach,
                annualPlan_FamilyUpgradation            : a.annualPlan_FamilyUpgradation, 
                achievement_Reach                       : a.achievement_Reach,
                achievement_FamilyUpgradation           : a.achievement_FamilyUpgradation,            
                annualPlan_TotalBudget                  : a.annualPlan_TotalBudget,            
            } 
        })  
        this.setState({
          tableData : tableData
        },()=>{
          // console.log("resp",this.state.tableData)
        })
      })
      .catch(function(error){        
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
     // var letters = 'BCDEF'.split('');
     //  var color = '#';
     //  for (var i = 0; i < 6; i++ ) {
     //      color += letters[Math.floor(Math.random() * letters.length)];
     //  }
     //  return color;
  }
  getRandomColor_sector(){
      var letters = '01234ABCDEF56789';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
      //  var letters = 'BCDEF'.split('');
      // var color = '#';
      // for (var i = 0; i < 6; i++ ) {
      //     color += letters[Math.floor(Math.random() * letters.length)];
      // }
      // return color;
    }

  getMonthwiseData(year, center_ID){
    console.log('year', year, 'center_ID', center_ID);
    var startYear = year.substring(3, 7);
    var endYear = year.substring(10, 15);
    if(startYear, endYear){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear)
        .then((response)=>{
          // console.log("respgetData",response)
          var month = [];
          var monthlyPlanReach = [];
          var monthlyAchievementReach = [];
          var monthlyPlanTotalBudget = [];
          var achievementTotalBudget = [];
          var piechartcolor =[];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              month.push(data.month);
              monthlyPlanReach.push(data.monthlyPlan_Reach);
              monthlyAchievementReach.push(data.curr_achievement_Reach);
              monthlyPlanTotalBudget.push(data.monthlyPlan_TotalBudget);
              achievementTotalBudget.push(data.curr_achievement_TotalBudget);
            })
          this.setState({
            "month"                        : month,
            "monthlyPlanReach"             : monthlyPlanReach,
            "monthlyAchievementReach"      : monthlyAchievementReach,
            "monthlyPlanTotalBudget"       : monthlyPlanTotalBudget,
            "achievementTotalBudget"       : achievementTotalBudget,
          },()=>{
                  // console.log(this.state.month)
                         // { console.log("this.state",this.state.monthlyAchievementReach , this.state.month, this.state.monthlyAchievementReach)}

          });          
        }    
      })
      .catch(function(error){        
      });
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
                  <h3>Dashboard</h3>
                </div>
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                  <StatusComponent 
                    stats={{color:"#2FC0EF", icon:"building",
                    heading1:this.state.centerData && this.state.centerData.length > 0 ? this.state.centerData[0].typeOfCenter : "" ,
                    value1:this.state.centerData && this.state.centerData.length > 0 ? this.state.centerData[0].count : "" , 
                    heading2:this.state.centerData && this.state.centerData.length > 0 ? this.state.centerData[1].typeOfCenter : "", 
                    value2:this.state.centerData && this.state.centerData.length > 0 ? this.state.centerData[1].count : 0, 
                    heading3:this.state.centerData && this.state.centerData.length > 0 ? this.state.centerData[2].typeOfCenter : "",
                    value3:this.state.centerData && this.state.centerData.length > 0 ? this.state.centerData[2].count : 0}} 
                  />
                  <StatusComponent 
                    stats={{color:"#DD4B39", icon:"users",heading1:"Outreach",value1:this.state.annualPlan_Reach ? this.state.annualPlan_Reach : 0, heading2:"Beneficiaries",value2:this.state.achievement_Reach ? this.state.achievement_Reach : 0}} 
                  />
                  <StatusComponent 
                    stats={{color:"#4CA75A", icon:"rupee",heading1:"Budget",value1:this.state.annualPlan_TotalBudget ? this.state.annualPlan_TotalBudget : 0, heading2:"Expenditure",value2:this.state.achievement_TotalBudget ? this.state.achievement_TotalBudget : 0}} 
                  />
                  <StatusComponent 
                    stats={{color:"#F39C2F", icon:"thumbs-o-up",heading1:"Sectors",value1:this.state.sectorCount ? this.state.sectorCount : 0, heading2:"Activities",value2:this.state.activityCount ? this.state.activityCount : 0}}
                  /> 
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11 mb15">
                       {/* <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label className="formLable">Center</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                                <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                                    <option className="hidden" >-- Select --</option>
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
                        </div>*/}
                        <div className=" col-lg-4 col-lg-offset-4 col-md-6 col-sm-6 col-xs-12">
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
                    </div>  
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <div className="box2">
                            <div className="box-header with-border">
                              <h3 className="box-title">Center wise Budget</h3>
                            </div>
                            <div className="box-body">
                              <CenterWisePieChart center_annualPlanTotalBudget={this.state.center_annualPlanTotalBudget ? this.state.center_annualPlanTotalBudget : []} piechartcolor={this.state.piechartcolor}  center_sector ={this.state.center_sector ? this.state.center_sector : []}/>
                            </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <div className="box2">
                          <div className="box-header with-border">
                            <h3 className="box-title">Sector wise Budget</h3>
                          </div>
                          <div className="box-body">
                             <PieChart annualPlanTotalBudget={this.state.annualPlanTotalBudget ? this.state.annualPlanTotalBudget : []} piechartcolor={this.state.piechartcolor}  sector={this.state.sector ? this.state.sector : []} />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="box2">
                          <div className="box-header with-border">
                             <h3 className="box-title">Sector wise Family Upgradation</h3>
                          </div>
                          <div className="box-body">
                            <BarChart annualPlanReach={this.state.annualPlanReach} sector={this.state.sector} annualPlanFamilyUpgradation={this.state.annualPlanFamilyUpgradation} achievementReach={this.state.achievementReach} achievementFamilyUpgradation={this.state.achievementFamilyUpgradation}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                        <div className="box2">
                          <div className="box-header with-border">
                             <h3 className="box-title">Month wise Goal Completion</h3>
                          </div>
                          <div className="box-body">
                            <DummyBarChart months={this.state.month ? this.state.month : []} ActualBeneficiaries={this.state.monthlyAchievementReach ? this.state.monthlyAchievementReach : []} PlannedBeneficiaries={this.state.monthlyPlanReach ? this.state.monthlyPlanReach : []}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                        <div className="box2">
                          <div className="box-header with-border">
                             <h3 className="box-title">Month wise Expenditure V/s Budget</h3>
                          </div>
                          <div className="box-body">
                            <MonthBarChartbudget months={this.state.month ? this.state.month : []} expenditure={this.state.achievementTotalBudget ? this.state.achievementTotalBudget : []} budget={this.state.monthlyPlanTotalBudget ? this.state.monthlyPlanTotalBudget : []}/>
                          </div>
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
{/*
        <Bar
          data={data}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: false
          }}
        />

*/}