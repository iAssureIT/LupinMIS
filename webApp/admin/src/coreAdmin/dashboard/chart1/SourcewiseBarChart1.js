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
import SourcewiseBarChart from './SourcewiseBarChart.js';
import './Chart.css';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";


// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class SourcewiseBarChart1 extends Component{
  
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
        source       : "source",
        annualPlan   : "annualPlan",
        cum_monthly  : "cum_monthly",
        cum_achi     : "cum_achi",
        per_cum_achi : "per_cum_achi",
        monthlyPlan  : "monthlyPlan",
        achi_month   : "achi_month",
        per_achi     : "per_achi",  
               
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
          tableData : response.data
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
            "source" : source.splice(-1),
            "annualPlan1" : annualPlan.splice(-1),
            "cum_monthly1" : cum_monthly.splice(-1),
            "cum_achi1" : cum_achi.splice(-1),
            "per_cum_achi1" : per_cum_achi.splice(-1),
            "monthlyPlan1" : monthlyPlan.splice(-1),
            "achi_month1" : achi_month.splice(-1),
            "per_achi1" : per_achi.splice(-1),
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
        var tableData = response.data.map((a, i)=>{
            return {
              source       : a.source,
              annualPlan   : a.annualPlan,
              cum_monthly  : a.cum_monthly,
              cum_achi     : a.cum_achi,
              per_cum_achi : a.per_cum_achi,
              monthlyPlan  : a.monthlyPlan,
              achi_month   : a.achi_month,
              per_achi     : a.per_achi,            
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
          <SourcewiseBarChart per_achi={this.state.per_achi} achi_month={this.state.achi_month} monthlyPlan={this.state.monthlyPlan} annualPlan={this.state.annualPlan} source={this.state.source} cum_monthly={this.state.cum_monthly} cum_achi={this.state.cum_achi} per_cum_achi={this.state.per_cum_achi}/>
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
