import React,{Component}         from 'react';
import axios                     from 'axios';
import $                         from "jquery";
import { render }                from 'react-dom';
import html2canvas               from 'html2canvas';
import Chart                     from 'chart.js';
import ReactHTMLTableToExcel     from 'react-html-table-to-excel';
import StatusComponent           from './StatusComponent/StatusComponent.js'
import MonthwiseGoalCompletion   from './chart1/MonthwiseGoalCompletion.js'
import MonthwiseExpenditure      from './chart1/MonthwiseExpenditure.js'
import BarChart                  from './chart1/BarChart.js';
import PieChart                  from './chart1/PieChart.js';
import CenterWisePieChart        from './chart1/CenterWisePieChart.js';
import Loader                       from "../../common/Loader.js";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
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
      'year'                          : "FY 2019 - 2020",
      "years"                         :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
      "annualPlan_TotalBudget_L"      : 0,
      "achievement_Total_L"           : 0,
    }
  }
   
 
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableCentersData(this.state.center_ID);
    this.getAvailableCenters();
    this.getcenter();
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getCenterwiseData(this.state.year);
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
    this.getAvailableCentersData(this.state.center_ID);
    this.getAvailableCenters();
    this.getCountOfSectors();
    this.getCountOfActivities();
    this.getCenterwiseData(this.state.year);
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
    // console.log('year', year);
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
          var achievement_Total_L      = totalData.achievement_Total_L;
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

  getAvailableCentersData(center_ID){
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
                          <span className="pull-right"><a href="#" data-toggle="modal" onClick={()=> this.dataShow("Centers")}>View All..</a></span>
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
                          <span className="pull-right"><a href="#" data-toggle="modal" onClick={()=> this.dataShow("Districts")}>View All..</a></span>
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
                          <span className="pull-right"><a href="#" data-toggle="modal" onClick={()=> this.dataShow("Blocks")}>View All..</a></span>
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
                          <span className="pull-right"><a href="#" data-toggle="modal" onClick={()=> this.dataShow("Villages")}>View All..</a></span>
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
                    
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11 mb15">
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
                      </div>  
                    </div>  
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                              <Loader type="fullpageloader" />
                        <div className="box2 graphBox">
                            <div className="box-header with-border">
                              <h3 className="box-title">Center wise Budget (In Lakhs)</h3>
                              <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
                                <ReactHTMLTableToExcel
                                  id="table-to-xls"                           
                                  className="download-table-xls-button fa fa-download tableicons pull-right"
                                  table="CenterWisePieChart"
                                  sheet="tablexls"
                                  filename="Center wise Pie Chart"
                                  buttonText=""/>
                              </div>
                            </div>
                            <div className="box-body">
                              <CenterWisePieChart year={this.state.year}  />
                            </div> 
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <div className="box2 graphBox">
                          <div className="box-header with-border">
                            <h3 className="box-title">Sector wise Budget (In Lakhs)</h3>
                            <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
                              <ReactHTMLTableToExcel
                                id="table-to-xls"                           
                                className="download-table-xls-button fa fa-download tableicons pull-right"
                                table="SectorWisePieChart"
                                sheet="tablexls"
                                filename="Sector wise Pie Chart"
                                buttonText=""/>
                            </div>
                          </div>
                          <div className="box-body">
                            <PieChart year={this.state.year} />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="box2">
                          <div className="box-header with-border">
                            <h3 className="box-title">Sector wise Outreach & Family Upgradation</h3>
                            <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
                              <ReactHTMLTableToExcel
                                id="table-to-xls"                           
                                className="download-table-xls-button fa fa-download tableicons pull-right"
                                table="SectorwiseOutreachAndFamilyUpgradation"
                                sheet="tablexls"
                                filename="Sector wise Outreach & Family Upgradation"
                                buttonText=""/>
                            </div>
                          </div>
                          <div className="box-body">
                            <BarChart year={this.state.year} />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                        <div className="box2 monthChartBox">
                          <div className="box-header with-border">
                            <h3 className="box-title">Month wise Goal Completion</h3>
                            <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
                              <ReactHTMLTableToExcel
                                id="table-to-xls"                           
                                className="download-table-xls-button fa fa-download tableicons pull-right"
                                table="MonthwiseGoalCompletion"
                                sheet="tablexls"
                                filename="Month wise Goal Completion"
                                buttonText=""/>
                            </div>
                          </div>
                          <div className="box-body">
                            <MonthwiseGoalCompletion year={this.state.year}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                        <div className="box2 monthChartBox">
                          <div className="box-header with-border">
                            <h3 className="box-title">Month wise Expenditure V/s Budget</h3>
                            <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
                              <ReactHTMLTableToExcel
                                id="table-to-xls"                           
                                className="download-table-xls-button fa fa-download tableicons pull-right"
                                table="MonthwiseExpenditure"
                                sheet="tablexls"
                                filename="Month wise Expenditure & Budget"
                                buttonText=""/>
                            </div>
                          </div>
                          <div className="box-body">
                            <MonthwiseExpenditure year={this.state.year} />
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
