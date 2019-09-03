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
import './Chart.css';import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";


// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class Charts extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
       "tableHeading"                : {
        annualPlan_Reach                        : "annualPlan_Reach",
        annualPlan_FamilyUpgradation            : "annualPlan_FamilyUpgradation",    
        achievement_Reach : "achievement_Reach",
        achievement_FamilyUpgradation : "achievement_FamilyUpgradation",            
               
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
    this.getAvailableCenters();
    this.getAvailableSectors();
    this.currentFromDate();
    this.currentToDate();
    this.setState({
      // "center"  : this.state.center[0],
      // "sector"  : this.state.sector[0],
      tableData : this.state.tableData,
    },()=>{
    console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
    })
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
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

    var ctx2 = document.getElementById('myChart2');
    var data2 = {
      datasets: [
                {
                    data: [20, 40, 30, 10],
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
                }
                ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Credit Card',
          'Debit Card',
          'COD',
          'Pending'
      ]
    };
    var myPieChart2 = new Chart(ctx2, {
      type: 'pie',
      data: data2,
      options:{
        color: [
                    ['red',    // color for data at index 0
                    'blue',   // color for data at index 1
                    'green',  // color for data at index 2
                    'black',],  // color for data at index 3
                    //...
                ]}
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
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
        console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
          console.log('name', this.state)
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
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
          var center = this.state.selectedCenter.split('|')[1];
          console.log('center', center);
          this.setState({
            center_ID :center,            
          },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
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
              sector           : response.data[0].sector+'|'+response.data[0]._id
            },()=>{
            var sector_ID = this.state.sector.split('|')[1]
            this.setState({
              sector_ID        : sector_ID
            },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
            })
            // console.log('sector', this.state.sector);
          })
        }).catch(function (error) {
          console.log('error', error);
        });
    }
    selectSector(event){
        event.preventDefault();
        this.setState({
          [event.target.name]:event.target.value
        });
        var sector_id = event.target.value.split('|')[1];
        // console.log('sector_id',sector_id);
        this.setState({
          sector_ID : sector_id,
        },()=>{
        // console.log('availableSectors', this.state.availableSectors);
        // console.log('sector_ID', this.state.sector_ID);
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
      })
    }
    getData(startDate, endDate,center_ID){
        console.log(startDate, endDate, center_ID);
        // axios.get('http://qalmisapi.iassureit.com/api/report/periodic_sector/'+startDate+'/'+endDate+'/'+center_ID)
        axios.get('http://qalmisapi.iassureit.com/api/report/sector/'+startDate+'/'+endDate+'/'+center_ID)
        .then((response)=>{
          console.log("resp",response);
          var tableData = response.data.map((a, i)=>{
            return {
                _id                                     : a._id,
                annualPlan_Reach                        : a.annualPlan_Reach,
                annualPlan_FamilyUpgradation            : a.annualPlan_FamilyUpgradation, 
                achievement_Reach                       : a.achievement_Reach,
                achievement_FamilyUpgradation           : a.achievement_FamilyUpgradation,            
            } 
        })  
          this.setState({
            tableData : tableData
          },()=>{
            console.log("resp",this.state.tableData)
          })
        })
        .catch(function(error){        
        });
    }
    handleFromChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;
       var dateVal = event.target.value;
       var dateUpdate = new Date(dateVal);
       var startDate = moment(dateUpdate).format('YYYY-MM-DD');
       this.setState({
           [name] : event.target.value,
           startDate:startDate
       },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
       console.log("dateUpdate",this.state.startDate);
       });
    }
    handleToChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var endDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           endDate : endDate
        },()=>{
        console.log("dateUpdate",this.state.endDate);
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
       });
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
            // console.log("localStoragetoday",today);
        }else {
            var today = moment(new Date()).format('YYYY-MM-DD');
        // console.log("today",today);
        }
        console.log("nowfrom",today)
        this.setState({
           startDate :today
        },()=>{
        });
        return today;
    }

    currentToDate(){
        if(this.state.endDate){
            var today = this.state.endDate;
            // console.log("newToDate",today);
        }else {
            var today =  moment(new Date()).format('YYYY-MM-DD');
        }
        // console.log("nowto",today)
        this.setState({
           endDate :today
        },()=>{
        });
        return today;
    }
  
  render(){ 
    return(
      <div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
            <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12">
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
            <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                <label className="formLable">From</label><span className="asterix"></span>
                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                    <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                </div>
            </div>
            <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                <label className="formLable">To</label><span className="asterix"></span>
                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                    <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                </div>
            </div>  
        </div>  
        <div className="col-lg-12">
        <IAssureTable 
         
          getData={this.getData.bind(this)} 
          tableHeading={this.state.tableHeading} 
          tableData={this.state.tableData} 
          tableObjects={this.state.tableObjects}
          />
  
        </div>
        <div className="col-lg-12">
          
          <div className="col-lg-6" style={{paddingLeft:'0px'}}>
            <div className="box2">
                <div className="box1a">
                  <h4>Areawise Customer Distribution (IN NOS) </h4>
                  <canvas id="myBarChart2"></canvas>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
            <div className="col-lg-6">
              <div className="box2">
                  <div className="box1a">
                    <h4>Order Dispatch Summary</h4>
                    <canvas id="myChart"></canvas>
                  </div>
              </div>
            </div>
            <div className="col-lg-6" style={{paddingLeft:'0px'}}>
              <div className="box2">
                  <div className="box1a">
                    <h4>Payment Model - Distribution</h4>
                    <canvas id="myChart2"></canvas>
                  </div>
              </div>
            </div>
        </div>
      </div>  
        <br/>
      <div className="row">
        <div className="col-lg-12">
          <div className="col-lg-6">
            <div className="box2">
                <div className="box1a">
                  <h4> Productwise - Dispatch Status (IN NOS)</h4>
                  <canvas id="myBarChart"></canvas>
                </div>
            </div>
          </div>
          <div className="col-lg-6" style={{paddingLeft:'0px'}}>
            <div className="box2">
                <div className="box1a">
                  <h4>Areawise Customer Distribution (IN NOS) </h4>
                  <canvas id="myBarChart2"></canvas>
                </div>
            </div>
          </div>
        </div>
      </div>
        
      </div>
      );
  }
}
