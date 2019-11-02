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
import UpdateComponent from './UpdateComponent/UpdateComponent.js'
import TableComponent  from './TableComponent/TableComponent.js'
import Productlist     from './productlist/Productlist.js'
import Visitorreport   from './Visitorreport/Visitorreport.js'
import Infocomponent   from './Infocomponent/Infocomponent.js'
import dummyBarChart   from './chart1/dummyBarChart.js'
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
      'year'                        : "FY 2019 - 2020",
      "years"                       :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"], 
      "data1" : {
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
      }
    }
  }
   
 
  componentDidMount(){
    var props={
      achievementFamilyUpgradation: (8) [0, 0, 0, 0, 0, 14, 4, 0]
    }
    var ctx = document.getElementById('myChart');
    var data = {
      datasets: [{
          data: [300000, 400000, 200000, 100000, 153000],
          backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(100, 180, 100, 0.5)',
            ],
           hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(100, 180, 100, 1)',
                ],

           
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Pune',
          'Nashik',
          'Aurangabad',
          'Bharatpur',
          'Goa',
      ]
    };
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });

    var ctx = document.getElementById('myChart1');
    var data = {
      datasets: [{
          data: [280000, 170000, 390000, 138000, 35000,200000],
          backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(100, 180, 100, 0.5)',
                'rgba(200, 150, 70, 0.5)',
            ],
           hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(100, 180, 100, 1)',
                'rgba(200, 150, 70, 1)',
                ],

           
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Educational Sector',
          'Health',
          'Agriculture Development',
          'Natural Resource Management',
          'Animal Husbandry',
          'Rural Industries',
      ]
    };
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });


    var ctx4 = document.getElementById('mydummyBarChart2');
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

    var mydummyBarChart2 = new Chart(ctx4, {
        type: 'horizontalBar',
        data: data4,  
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableCenters();
  }

    componentWillReceiveProps(nextProps){
      this.getAvailableCenters();
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
        console.log('center_ID', center_ID);
        this.setState({
          center_ID :center_ID,            
        },()=>{
          this.getData(this.state.year, this.state.center_ID);
          this.getCenterwiseData(this.state.year, this.state.center_ID);
          // this.getSourceData(this.state.year, this.state.center_ID);
          // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        })
      });
    } 


  render(){
    return(

      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="formWrapper"> 
            <section className="content">
             
                  <div className="dashContent">
                    <div className="col-lg-12">
                        <div className="log-lg-12 pull-left ">
                          <h3>Dashboard</h3>
                        </div>
                      </div>
                      <div className="">
                        <StatusComponent stats={{color:"#2FC0EF", icon:"building",heading1:"CSR Center",value1:"18", heading2:"Development",value2:"7"}} />
                        <StatusComponent stats={{color:"#DD4B39", icon:"users",heading1:"Families",value1:"5160", heading2:"Beneficiaries",value2:"3,60,363"}} />
                        <StatusComponent stats={{color:"#4CA75A", icon:"shopping-cart",heading1:"Budget",value1:"15.6 Cr", heading2:"Expenditure",value2:"12.3 Cr"}} />
                        <StatusComponent stats={{color:"#F39C2F", icon:"thumbs-o-up",heading1:"Sectors",value1:"12", heading2:"Activities",value2:"66"}} /> 
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                              <div className="col-lg-6">
                                <div className="box2">
                                    <div className="">
                                      <h4 className="text-center">Center wise Budget</h4>
                                      <canvas id="myChart"></canvas>
                                    </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="box2">
                                    <div className="">
                                      <h4 className="text-center">Sector wise Budget</h4>
                                      <canvas id="myChart1"></canvas>
                                    </div>
                                </div>
                              </div>
                              <div className="col-lg-6" style={{paddingLeft:'0px'}}>
                                <div>
                                 <Bar data={this.state.data} height={350}  options={options} />
                                </div>
                                  <dummyBarChart annualPlanReach={this.state.annualPlanReach} sector={this.state.sector} annualPlanFamilyUpgradation={this.state.annualPlanFamilyUpgradation} achievementReach={this.state.achievementReach} achievementFamilyUpgradation={this.state.achievementFamilyUpgradation}/>
                              </div>
                              <div className="col-lg-6" style={{paddingLeft:'0px'}}>
                                <div className="box2">
                                    <div className="">
                                      <h4>Areawise Customer Distribution (IN NOS) </h4>
                                      <canvas id="mydummyBarChart2"></canvas>
                                    </div>
                                </div>
                              </div>
                           
                          </div>
                        </div> 
                          <br/>
                        <div className="row">
                         
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