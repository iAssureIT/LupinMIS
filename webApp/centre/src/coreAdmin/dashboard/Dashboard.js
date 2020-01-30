import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import axios             from 'axios';
import { render } from 'react-dom';
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import html2canvas from 'html2canvas';
import Chart from 'chart.js';
import StatusComponent from './StatusComponent/StatusComponent.js'
import MonthwiseGoalCompletion   from './chart1/MonthwiseGoalCompletion.js'
import MonthwiseExpenditure   from './chart1/MonthwiseExpenditure.js'

import BarChart from './chart1/BarChart.js'; 
import PieChart from './chart1/PieChart.js';
import CenterWisePieChart from './chart1/CenterWisePieChart.js';
import {HorizontalBar} from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {Bar} from 'react-chartjs-2';
import './Dashboard.css';

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
  constructor(props){
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
      'year'                : "FY 2019 - 2020",
      // 'months'              : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      // 'PlannedBeneficiaries': ['2000', '3500', '2000', '2100', '3000', '2300', '2500', '3100', '1800', '1600', '3000', '2000'],
      // 'ActualBeneficiaries' : ['1800', '3000', '1900', '2100', '2900', '2200', '2450', '3000', '1800', '1500', '2900', '2000'],
      // 'expenditure'         : ['18000', '30000', '19000', '21000', '29000', '20200', '24500', '30000', '18000', '15000', '20900', '20000'],
      // 'budget'              : ['20000', '35000', '20000', '21000', '30000', '23000', '25000', '31000', '19800', '16500', '30000', '20000'],
      "years"               :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"], 
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
      "centerCounts" :[],
      "centerCount" : 0,
      "annualPlan_TotalBudget_L" : 0,
      "achievement_Total_L"       : 0,
      "villagesCovered"          : 0,
      "blocksCovered"            :["Nagbhir","Bhadravati","Mozri"],
      "districtCovered"          : ["Chandrapur","Amaravati","Gondia"],
      "allblocks"                : [],
      "alldistrict"              : [],
      "dataShow"                 : [],
      "center_ID"    : localStorage.getItem("center_ID"),
      "centerName"   : localStorage.getItem("centerName"),
      "dataHeading"              : '',
    }
  }
   
 
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getcenter();
    this.getCountOfSectors();
    this.getCountOfActivities();
    // const center_ID = localStorage.getItem("center_ID");
    // const centerName = localStorage.getItem("centerName");
    // this.setState({
    //   center_ID    : center_ID,
    //   centerName   : centerName,
    // },()=>{
      this.getAvailableCenters(this.state.center_ID);
      this.getCenterwiseData(this.state.year, this.state.center_ID);
    // })
  }

  componentWillReceiveProps(nextProps){
    this.getAvailableCenters(this.state.center_ID);
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getCenterwiseData(this.state.year, this.state.center_ID);

  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      // console.log('name', this.state)
    });
  }
  getAvailableCenters(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
    }).then((response)=> {
      console.log("response ==>",response.data[0]);

      function removeDuplicates(data, param){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
          })
        }
      var availableblocksInCenter = removeDuplicates(response.data[0].blocksCovered, "district");
       
      if (response.data && response.data[0]) {
        this.setState({
          availableCenters         : response.data[0],
          villagesCoveredInCenter  : response.data[0].villagesCovered.map((o,i)=>{return o.village}),
          villagesCovered          : response.data[0].villagesCovered.length,
          blocksCovered            : response.data[0].blocksCovered.slice(0, 8).map((o,i)=>{return o.block}),
          allblocks                : response.data[0].blocksCovered.map((o,i)=>{return o.block}),
          districtCovered          : availableblocksInCenter.slice(0, 8).map((d,i)=>{return (d.district).split('|')[0]}),  
          alldistrict              : availableblocksInCenter.map((d,i)=>{return (d.district).split('|')[0]}),
        },()=>{
          console.log("villagesCoveredInCenter",this.state.villagesCoveredInCenter);
          // console.log('center', this.state.center);
          // var center_ID = this.state.center.split('|')[1];
          // this.setState({
          //   center_ID        : center_ID   
          // },()=>{
          // })
        })
      }
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
        this.setState({
          "centerCount" : this.state.centerCounts.reduce((a,b)=>{return a + b})
        })
      })
    })
     .catch(function (error) {
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
    }).catch((error)=> {
      console.log('error', error);
    });
  } 
 
  getCenterwiseData(year, center_ID){
    // console.log('year', year);
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(startDate && endDate && center_ID){
        axios.get('/api/report/center/'+startDate+'/'+endDate+'/'+center_ID+'/all/all/all/all')
        .then((response)=>{
          console.log("centerresponse",response);
      /*******************************Dashboard Status Data***************************/
          var centerwiseData = response.data;
          var totalindex = (centerwiseData.length)-2;
          var totalData = response.data[totalindex];
          var achievement_Reach      = totalData.achievement_Reach;
          var annualPlan_Reach       = totalData.annualPlan_Reach;
          var annualPlan_TotalBudget = totalData.annualPlan_TotalBudget;
          var annualPlan_TotalBudget_L = totalData.annualPlan_TotalBudget_L;
          var achievement_Total_L      = totalData.achievement_Total_L;
          var achievement_TotalBudget = totalData.achievement_TotalBudget;
          this.setState({
            achievement_Reach        : achievement_Reach,
            annualPlan_Reach         : annualPlan_Reach,
            annualPlan_TotalBudget   : annualPlan_TotalBudget,
            achievement_TotalBudget  : achievement_TotalBudget,
            annualPlan_TotalBudget_L : annualPlan_TotalBudget_L,
            achievement_Total_L      : achievement_Total_L
          })
          // console.log("this.state",this.state);
      /***********************************for centerwise data*************************/
        var sector = [];
        var annualPlanTotalBudget = [];
        var piechartcolor =[];
        if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              if(data.annualPlan_TotalBudget > 0){              
                sector.push(data.name);
                annualPlanTotalBudget.push(data.annualPlan_TotalBudget);
                piechartcolor.push(this.getRandomColor());                
              }
            })
            if(annualPlanTotalBudget.length > 0){
              this.setState({
                "sector" : sector.splice(-2),
                "annualPlan_TotalBudget1" : annualPlanTotalBudget.splice(-2),
              },()=>{
                 this.setState({
                  "center_sector"                 : sector,
                  "center_annualPlanTotalBudget"  : annualPlanTotalBudget,
                   piechartcolor                  : piechartcolor
                });
              })              
            }else{
             this.setState({
                "center_sector"                 : ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"],
                "center_annualPlanTotalBudget"  : [500000,150000,90000,100000,200000],
                 piechartcolor                  : ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"]
              });
            }
        }else{
           this.setState({
            "center_sector"                 : ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"],
            "center_annualPlanTotalBudget"  : [500000,150000,90000,100000,200000],
             piechartcolor                  : ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"]
          });
        }
      }).catch(function (error) {
        console.log('error', error);
      });
    }else{
      this.setState({
        "center_sector"                 : ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"],
        "center_annualPlanTotalBudget"  : [500000,150000,90000,100000,200000],
         piechartcolor                  : ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"]
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
      // var color = '#';
      // for (var i = 0; i < 6; i++ ) {
      //     color += letters[Math.floor(Math.random() * letters.length)];
      // }
      // return color;
  }
  getRandomColor_sector(){
      var letters = '01234ABCDEF56789';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
      // var letters = 'BCDEF'.split('');
      // var color = '#';
      // for (var i = 0; i < 6; i++ ) {
      //     color += letters[Math.floor(Math.random() * letters.length)];
      // }
      // return color;
    }

  getmonthwiseExpen(year, center_ID){
    // console.log('year', year, 'center_ID', center_ID);
    var startYear = year.substring(3, 7);
    var endYear = year.substring(10, 15);
    if(startYear && endYear){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear+'/'+center_ID)
        .then((response)=>{
          // console.log("monthlyreach data",response.data)
          var month = [];
          var monthlyPlanTotalBudget = [];
          var achievementTotalBudget = [];

         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              // console.log("real data",data);
              month.push(data.month);
              monthlyPlanTotalBudget.push(data.monthlyPlan_TotalBudget);
              achievementTotalBudget.push(data.curr_achievement_TotalBudget);
            })
            if (monthlyPlanTotalBudget.length > 0 || achievementTotalBudget.length > 0 ) {
                this.setState({
                  "month"                        : month,
                  "monthlyPlanTotalBudget"       : monthlyPlanTotalBudget,
                  "achievementTotalBudget"       : achievementTotalBudget,
              }); 

            }else{
                this.setState({
                  "month"                        : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'],
                  "monthlyPlanTotalBudget"       : [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000],
                  "achievementTotalBudget"       : [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400],
              }); 
            }
        }else{
           this.setState({
                  "month"                        : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'],
                  "monthlyPlanTotalBudget"       : [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000],
                  "achievementTotalBudget"       : [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400],
              }); 
        }  
      })
      .catch(function(error){        
      });
    }else{
       this.setState({
            "month"                        : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'],
            "monthlyPlanTotalBudget"       : [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000],
            "achievementTotalBudget"       : [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400],
        }); 
    }
  }
  dataShow(id){
    if(id === "Districts"){
      var getData = this.state.alldistrict
    }else if(id === "Blocks"){
      var getData = this.state.allblocks
    }else{
      var getData = this.state.villagesCoveredInCenter
    }
    // var getData = id === "Districts" ? this.state.alldistrict : this.state.allblocks;
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

  render(){
  // console.log("this.state.center_ID",this.state.center_ID);
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
                      centerData : this.state.centerData,
                      centerCount : this.state.centerCount,
                      multipleValues : true}} 
                  />
                         
                  <StatusComponent 
                    stats={{color:"#DD4B39", icon:"users",heading1:"Outreach",value1:this.state.annualPlan_Reach ? this.state.annualPlan_Reach : 0, heading2:"Upgraded Beneficiary",value2:this.state.achievement_Reach ? this.state.achievement_Reach : 0,multipleValues : false}} 
                  />
                  <StatusComponent 
                    stats={{color:"#4CA75A", icon:"rupee",heading1:"Budget",value1:this.state.annualPlan_TotalBudget_L ? "Rs. "+this.state.annualPlan_TotalBudget_L+" L" : "Rs. 0 L", heading2:"Expenditure",value2:this.state.achievement_Total_L ? "Rs. "+this.state.achievement_Total_L : "Rs. 0 L",multipleValues : false}} 
                  />
                  <StatusComponent 
                    stats={{color:"#F39C2F", icon:"thumbs-o-up",heading1:"Sectors",value1:this.state.sectorCount ? this.state.sectorCount : 0, heading2:"Activities",value2:this.state.activityCount ? this.state.activityCount : 0,multipleValues : false}}
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
                      <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                        {/*<div className="box2">
                            <div className="box-header with-border">
                              <h3 className="box-title">Center wise Budget</h3>
                            </div>
                            <div className="box-body">
                               <CenterWisePieChart center_annualPlanTotalBudget={this.state.center_annualPlanTotalBudget ? this.state.center_annualPlanTotalBudget : []} piechartcolor={this.state.piechartcolor}  center_sector ={this.state.center_sector ? this.state.center_sector : []}/>
                            </div>
                        </div> */}
                        <div className="info-box bg-yellow">
                            <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>

                            <div className="info-box-content">
                              <span className="info-box-text">Districts</span>
                              {this.state.districtCovered && this.state.districtCovered.length > 0 ?
                                this.state.districtCovered.map((district,index)=>{
                                  return(
                                      <span className="listfont" key={index}>
                                           <i className="fa fa-circle-o circleFont" aria-hidden="true"></i> {district}
                                      </span>
                                    )
                                }) 
                              :
                              null }
                              {this.state.districtCovered.length > 7 ?
                                  <span><a href="#"  data-toggle="modal"  onClick={()=> this.dataShow("Districts")}>View All..</a></span>
                                :
                                null
                              }
                              <span></span>
                         </div>

                        </div>
                        <div className="info-box bg-green">
                          <span className="info-box-icon"><i className="fa fa-map-marker "></i></span>

                          <div className="info-box-content">
                            <span className="info-box-text">Blocks</span>
                              {this.state.blocksCovered && this.state.blocksCovered.length > 0 ?
                                this.state.blocksCovered.map((block,index)=>{
                                   return(
                                      <span className="listfont" key={index}>
                                           <i className="fa fa-circle-o circleFont" aria-hidden="true"></i> {block}
                                      </span>
                                    )
                                }) 

                              :
                              null }
                               {this.state.blocksCovered.length > 7 ?
                                  <span className=""><a href="#" data-toggle="modal" onClick={()=> this.dataShow("Blocks")}>View All..</a></span>
                                :
                                null
                              }
                          </div>
                        </div>
                        {/*<div className="info-box bg-red">
                          <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>
                          <div className="info-box-content">
                            <span className="info-box-text">Villages</span>
                            <span className="info-box-number" onClick={()=> this.dataShow("Villages")}>{this.state.villagesCovered}</span>
                            <div className="progress">
                              <div className="progress-bar" style={{"width": this.state.villagesCovered+"%"}}></div>
                            </div>
                          </div>
                        </div>*/}
                        <div className="info-box bg-red">
                          <span className="info-box-icon"><i className="fa fa-map-marker"></i></span>
                          <div className="info-box-content">
                            <span className="info-box-text pull-left">Villages</span>
                            {this.state.villagesCovered > 0 ?
                            <span className="pull-right"><a href="#" data-toggle="modal" onClick={()=> this.dataShow("Villages")}>View All..</a></span>
                            : 
                            ""}
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <span className="info-box-number">{this.state.villagesCovered}</span>
                              <div className="progress">
                                <div className="progress-bar" style={{"width": this.state.villagesCovered+"%"}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                        <div className="box2">
                          <div className="box-header with-border">
                              <h3 className="box-title">Sector wise Budget</h3>
                          </div>
                          <div className="box-body">
                            <PieChart year={this.state.year} center_ID={this.state.center_ID}/>
                          </div> 
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="box2">
                          <div className="box-header with-border">
                              <h3 className="box-title">Sector wise Outreach & Family Upgradation</h3>
                          </div>
                          <div className="box-body">
                            <BarChart year={this.state.year} center_ID={this.state.center_ID} />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" > 
                        <div className="box2">
                          <div className="box-header with-border">
                              <h3 className="box-title">Month wise Goal Completion</h3>
                          </div>
                          <div className="box-body">
                             <MonthwiseGoalCompletion year={this.state.year} center_ID={this.state.center_ID}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                        <div className="box2">
                            <div className="box-header with-border">
                              <h3 className="box-title">Month wise Expenditure V/s Budget</h3>
                            </div>
                            <div className="box-body">
                              <MonthwiseExpenditure year={this.state.year} center_ID={this.state.center_ID}/>
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
                              {this.state.dataShow && this.state.dataShow.length > 0 ?
                                this.state.dataShow.map((data,index)=>{
                                   return(
                                      <span className="listfontInmodal" key={index}>
                                           <i className="fa fa-circle-o circleFont" aria-hidden="true"></i> {data}
                                      </span>
                                    )
                                }) 

                              :
                              null }
                            </div>
                            <div className="modal-footer">
                            </div>
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