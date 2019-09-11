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
      "per_cum_achi": [],
      "cum_achi"            : [],
      "cum_monthly" : [],
      "annualPlan"             : [],
      "source"                      : [],
      "tableHeading"                : {
        name                                    : "source",
        annualPlan_Reach                        : "annPlan_Reach",
        annualPlan_FamilyUpgradation            : "anPlan_FamilyUpg",    
        achievement_Reach                       : "achie_Reach",
        achievement_FamilyUpgradation           : "achie_FamilyUpg",            
               
      },


    }
  }
   3
      /*3 
  Family Coverage         
  Cumulative          
  Centerwise Dashboard          
  Duration filter         
  source/Project  Plan    Achievement     
    Reach Upgradation   Reach Upgradation   
            */
  componentDidMount(){
    this.getAvailableCenters();
    this.getData(this.state.year, this.state.center_ID);

  
    var ctx = document.getElementById('myChart');
    var data = {
      datasets: [{
          data: [30, 40, 20, 10],
          backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
           hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                ],

           
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'New',
          'Dispatched',
          'Pending',
          'Returned'
      ]
    };
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });


    var ctx4 = document.getElementById('myBarChart2');
    var data4 = {
      datasets: [
                {
                    data: [20, 40, 30, 80],

          backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
                }
                ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Area 1',
          'Area 2',
          'Area 3',
          'Area 4'
      ]
    };

    var myBarChart2 = new Chart(ctx4, {
        type: 'horizontalBar',
        data: data4,  
    });
  }

  
    componentWillReceiveProps(nextProps){
      this.getAvailableCenters();
      this.getData(this.state.year, this.state.center_ID);
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
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'source_ID', this.state.source_ID)
          })
        });
    } 


 
  getData(year, center_ID){
    console.log('year', year, 'center_ID', center_ID);
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(startDate, endDate, center_ID){
        axios.get('/api/report/source/'+startDate+'/'+endDate+'/'+center_ID)
        .then((response)=>{
          console.log("respgetData",response);
         console.log("resp",response);
        
        this.setState({
          sourceData : response.data
        },()=>{
          console.log("resp",this.state.sourceData)
        })
          var source = [];
          var annualPlan = [];
          var cum_monthly = [];
          var cum_achi = [];
          var per_cum_achi = [];
          var monthlyPlan = [];
          var achi_month = [];
          var per_achi = [];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              source.push(data.source);
              annualPlan.push(data.annualPlan);
              cum_monthly.push(data.cum_monthly);
              cum_achi.push(data.cum_achi);
              per_cum_achi.push(data.per_cum_achi);
              monthlyPlan.push(data.monthlyPlan);
              achi_month.push(data.achi_month);
              per_achi.push(data.per_achi);
            })
          this.setState({
            "source" : source.splice(-2),
            "annualPlan1" : annualPlan.splice(-2),
            "cum_monthly1" : cum_monthly.splice(-2),
            "cum_achi1" : cum_achi.splice(-2),
            "per_cum_achi1" : per_cum_achi.splice(-2),
            "monthlyPlan1" : monthlyPlan.splice(-2),
            "achi_month1" : achi_month.splice(-2),
            "per_achi1" : per_achi.splice(-2),
          },()=>{
          console.log("this.state.per_cum_achi1",per_cum_achi);
                    console.log("per_cum_achi",per_cum_achi);
             this.setState({
            "source" : source,
            "annualPlan" : annualPlan,
            "cum_monthly" : cum_monthly,
            "cum_achi" : cum_achi,
            "per_cum_achi" : per_cum_achi,
            "monthlyPlan" : monthlyPlan,
            "achi_month" : achi_month,
            "per_achi" : per_achi,
          });
        
          })
        }
    
      })
      .catch(function(error){        
      });
    }
  }

  render(){ 
     /* {console.log("this.state.source",this.state.source);
                     console.log("this.state.cum_monthly",this.state.cum_monthly);
                    console.log("this.state.cum_achi",this.state.cum_achi);
                    console.log("this.state.per_cum_achi",this.state.per_cum_achi);
                }    */
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
        <div className="col-lg-6">
          <BarChart annualPlan={this.state.annualPlan} source={this.state.source} cum_monthly={this.state.cum_monthly} cum_achi={this.state.cum_achi} per_cum_achi={this.state.per_cum_achi}/>
        </div>
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
