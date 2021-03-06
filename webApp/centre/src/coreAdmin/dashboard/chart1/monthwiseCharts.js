import React, { Component }                                  from 'react';
import moment               from 'moment';
import $                                                     from 'jquery';
import axios                                                 from 'axios';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import html2canvas from 'html2canvas';
import Chart from 'chart.js';
import BarChart from './BarChart.js';
import PieChart from './PieChart.js';
import CenterWisePieChart from './CenterWisePieChart.js';
import './Chart.css';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";


// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Charts extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      'year'                        : "FY 2019 - 2020",
      "years"                       :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],      
      "achievementFamilyUpgradation": [],
      "achievementReach"            : [],
      "annualPlanFamilyUpgradation" : [],
      "monthlyPlanReach"             : [],
      "month"                      : [],
      piechartcolor                 : [],
      "tableHeading"                : {
        name                                    : "Sector",
        annualPlan_Reach                        : "annPlan_Reach",
        annualPlan_FamilyUpgradation            : "anPlan_FamilyUpg",    
        achievement_Reach                       : "achie_Reach",
        achievement_FamilyUpgradation           : "achie_FamilyUpg",       
        annualPlan_TotalBudget                  : "annualPlan_TotalBudget"     
               
      },


    }
  }
   
      /*3 
  Family Coverage         
  Cumulative          
  Centerwise Dashboard          
  Duration filter         
  Sector/Project  Plan    Achievement     
    Reach Upgradation   Reach Upgradation   
            */
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableCenters();
    this.getData(this.state.year, this.state.center_ID);
    this.getCenterwiseData(this.state.year, this.state.center_ID);
    // this.getSourceData(this.state.year, this.state.center_ID);  
  }
    componentWillReceiveProps(nextProps){
      this.getAvailableCenters();
      this.getData(this.state.year, this.state.center_ID);
      this.getCenterwiseData(this.state.year, this.state.center_ID);
      // this.getSourceData(this.state.year, this.state.center_ID);
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
            this.getData(this.state.year, this.state.center_ID);
            this.getCenterwiseData(this.state.year, this.state.center_ID);
            // this.getSourceData(this.state.year, this.state.center_ID);
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
          console.log('center_ID', center_ID);
          this.setState({
            center_ID :center_ID,            
          },()=>{
            this.getData(this.state.year, this.state.center_ID);
            this.getCenterwiseData(this.state.year, this.state.center_ID);
            // this.getSourceData(this.state.year, this.state.center_ID);
            // console.log('startYear', this.state.startYear, 'center_ID', this.state.center_ID,'month_ID', this.state.month_ID)
          })
        });
    } 


  getData(year, center_ID){
    console.log('year', year, 'center_ID', center_ID);
    var startYear = year.substring(3, 7);
    var endYear = year.substring(10, 15);
    // axios.get('/api/report/annual_completion_month/'+year+'/'+centerID)
    if(startYear, endYear, center_ID){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear)
        .then((response)=>{
          console.log("respgetData",response)
          var month = [];
          var monthlyPlanReach = [];
          var achievementReach = [];
          var monthlyPlanTotalBudget = [];
          var piechartcolor =[];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              month.push(data.month);
              monthlyPlanReach.push(data.monthlyPlan_Reach);
              achievementReach.push(data.curr_achievement_Reach);
              monthlyPlanTotalBudget.push(data.monthlyPlan_TotalBudget);
              monthlyPlanTotalBudget.push(data.curr_achievement_TotalBudget);
              piechartcolor.push(this.getRandomColor());
            })
            console.log("monthlyPlanTotalBudget",monthlyPlanTotalBudget);
          this.setState({
            "month" : month.splice(-2),
            "monthlyPlanReach1" : monthlyPlanReach.splice(-2),
            "achievementReach1" : achievementReach.splice(-2),
            "annualPlan_TotalBudget1" : monthlyPlanTotalBudget.splice(-2),
          },()=>{
             this.setState({
              "month"                       : month,
              "monthlyPlanReach"              : monthlyPlanReach,
              "achievementReach"             : achievementReach,
              "monthlyPlanTotalBudget"       : monthlyPlanTotalBudget,
              "piechartcolor"                 : piechartcolor
            },()=>{
                    console.log(this.state)
            });          
          })
        }    
          var tableData = response.data.map((a, i)=>{
            return {
                month                                   : a.month,
                annualPlan_Reach                        : a.annualPlan_Reach,
                achievement_Reach                       : a.achievement_Reach,
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

  getCenterwiseData(year, center_ID){
    // console.log('year', year, 'center_ID', center_ID);
    // var startYear = year.substring(3, 7)+"-04-01";
    // var endYear = year.substring(10, 15)+"-03-31";
    // // axios.get('/api/report/annual_completion_month/'+year+'/'+centerID)
    // if(startYear, endYear, center_ID){
    //     axios.get('/api/report/center/'+startYear+'/'+endYear+'/'+center_ID)
    //     .then((response)=>{
    //       console.log("respCenterData",response)

    //       var center = [];
    //       var centerwisePlanTotalBudget = [];
    //       var piechartcolor =[];
    //      if(response.data&&response.data.length >0){
    //         response.data.map((data,index)=>{
    //           center.push(data.name);
    //           centerwisePlanTotalBudget.push(data.annualPlan_TotalBudget);
    //           piechartcolor.push(this.getRandomColor());
    //         })
    //                 console.log("centerwisePlanTotalBudget",centerwisePlanTotalBudget);

    //       this.setState({
    //         "center" : center.splice(-2),
    //         "centerwisePlanTotalBudget1" : centerwisePlanTotalBudget.splice(-2),
    //       },()=>{
    //       // console.log("this.state.centerwisePlanTotalBudget1",this.state.centerwisePlanTotalBudget1);
    //          this.setState({
    //           "center"                       : center,
    //           "centerwisePlanTotalBudget"    : centerwisePlanTotalBudget,
    //           "piechartcolor"                  : piechartcolor
    //         },()=>{
                    
    //         });
          
    //       })
    //     }    
    //   })
    //   .catch(function(error){        
    //   });
    // }
  }
  getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
// getSourceData(year, center_ID){
  //   console.log('year', year, 'center_ID', center_ID);
  //   var startYear = year.substring(3, 7)+"-04-01";
  //   var endYear = year.substring(10, 15)+"-03-31";
  //   if(startYear, endYear, center_ID){
  //       axios.get('/api/report/source/'+startYear+'/'+endYear+'/'+center_ID)
  //       .then((response)=>{
  //         console.log("respgetData",response);
  //        // console.log("resp",response);
        
  //       this.setState({
  //         sourceData : response.data
  //       },()=>{
  //         console.log("resp",this.state.sourceData)
  //       })
        

  //         var month = [];
  //         var monthlyPlanReach = [];
  //         var annualPlanFamilyUpgradation = [];
  //         var achievementReach = [];
  //         var achievementFamilyUpgradation = [];
  //        if(response.data&&response.data.length >0){
  //           response.data.map((data,index)=>{
  //             month.push(data.name);
  //             monthlyPlanReach.push(data.annualPlan_Reach);
  //             annualPlanFamilyUpgradation.push(data.annualPlan_FamilyUpgradation);
  //             achievementReach.push(data.achievement_Reach);
  //             achievementFamilyUpgradation.push(data.achievement_FamilyUpgradation);
  //           })
  //         this.setState({
  //           "month" : month.splice(-2),
  //           "monthlyPlanReach1" : monthlyPlanReach.splice(-2),
  //           "annualPlanFamilyUpgradation1" : annualPlanFamilyUpgradation.splice(-2),
  //           "achievementReach1" : achievementReach.splice(-2),
  //           "achievementFamilyUpgradation1" : achievementFamilyUpgradation.splice(-2),
  //         },()=>{
  //         console.log("this.state.achievementFamilyUpgradation1",achievementFamilyUpgradation);
  //                   console.log("achievementFamilyUpgradation",achievementFamilyUpgradation);
  //            this.setState({
  //           "month" : month,
  //           "monthlyPlanReach" : monthlyPlanReach,
  //           "annualPlanFamilyUpgradation" : annualPlanFamilyUpgradation,
  //           "achievementReach" : achievementReach,
  //           "achievementFamilyUpgradation" : achievementFamilyUpgradation,
  //         });
        
  //         })
  //       }
    
  //     })
  //     .catch(function(error){        
  //     });
  //   }
  // }

  render(){ 
    return(
      <div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
            </div>
            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
      {/*  <div className="col-lg-6">
                <BarChart monthlyPlanReach={this.state.monthlyPlanReach} month={this.state.month} achievementReach={this.state.achievementReach} />
              </div>
              <div className="col-lg-6">
                <h3>Sector wise Budget</h3>
                <PieChart monthlyPlanTotalBudget={this.state.monthlyPlanTotalBudget} piechartcolor={this.state.piechartcolor}  month={this.state.month}/>
              </div>*/}
      
        <div className="col-lg-6">
        <IAssureTable 
         
          getData={this.getData.bind(this)} 
          tableHeading={this.state.tableHeading} 
          tableData={this.state.tableData} 
          // tableObjects={this.state.tableObjects}
          />
  
        </div>
      </div>  
        <br/>
        
      </div>
      );
  }
}
