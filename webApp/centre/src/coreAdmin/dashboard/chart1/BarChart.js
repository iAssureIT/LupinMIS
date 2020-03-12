import React,{Component} from 'react';
import {Bar}             from 'react-chartjs-2';
import axios             from 'axios';
import $                 from 'jquery';
import IAssureTable      from "../../IAssureTable/IAssureTable.jsx";
import Loader            from "../../../common/Loader.js";

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

export default class BarChart extends Component{
  constructor(props){
    super(props);
    // console.log("props",props);
    this.state={
      "data" : {
        labels: [],
        datasets: [
          { 
            label: 'Family Upgradation',
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
            hoverBorderColor:'rgba(255, 206, 86, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'Outreach',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            stack: '1',
            data: []
          }
        ]
      },   
      "twoLevelHeader"    : {
          apply           : false,
          firstHeaderData : [
          ]
      },
      "tableHeading"      : {
        "sectorName"                       : 'Sector',
        "sectorShortName"                  : 'Sector Short Name',
        "achievement_FamilyUpgradation"    : 'Family Upgradation', 
        "achievement_Reach"                : 'Outreach', 
      },
      
      "tableObjects"        : {
        paginationApply     : false,
        searchApply         : false,
        downloadApply       : true,
      },   
    }
  }

  // static getDerivedStateFromProps(props,state){
  //    var data = {...state.data};
  //   // console.log("props.sector",props.sector);
  //   if (data) {
  //     data.datasets[0].data = props.achievementFamilyUpgradation;
  //     data.datasets[1].data = props.achievementReach;
  //     data.labels = props.sector;
  //     return{
  //        data : data
  //     }
  //   }
  // }
  componentDidUpdate(prevProps, prevState){
    // console.log('center_ID',this.props.center_ID);

    if (prevProps.year !== this.props.year) {
      this.getSectorwiseFamilyupg(this.props.year,this.props.center_ID);
      this.getData(this.props.year,this.props.center_ID);
    }
  }
  componentDidMount(){
    console.log('center_ID',this.props.center_ID);
    this.getSectorwiseFamilyupg(this.props.year,this.props.center_ID);
    this.getData(this.props.year,this.props.center_ID);
  }
  getSectorwiseFamilyupg(year,center_ID){
    console.log('center_ID',center_ID);
    var oudata = {...this.state.data};
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(center_ID && startDate && endDate){
        axios.get('/api/reportDashboard/sector_familyupgrade_outreach_count/'+center_ID+'/'+startDate+'/'+endDate)
        .then((response)=>{ 
          var sector = [];
          var annualPlanReach = [];
          var annualPlanFamilyUpgradation = [];

          var achievementReach = [];
          var achievementFamilyUpgradation = [];

         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{

              if(data.achievement_Reach > 0 || data.achievement_FamilyUpgradation > 0){ 
                sector.push(data.sectorShortName);
                annualPlanReach.push(data.annualPlan_Reach);
                annualPlanFamilyUpgradation.push(data.annualPlan_FamilyUpgradation);
                achievementReach.push(data.achievement_Reach);
                achievementFamilyUpgradation.push(data.achievement_FamilyUpgradation);                
              }            
            })

            if(achievementReach.length > 0 || achievementFamilyUpgradation.length > 0 ){
              oudata.datasets[0].data = achievementFamilyUpgradation;
              oudata.datasets[1].data = achievementReach;
              oudata.labels           = sector;
               this.setState({
                "data" : oudata
              },()=>{
              })
            }else{
              oudata.datasets[0].data = [200, 100, 500, 750, 300,600,900,150];
              oudata.datasets[1].data = [2000, 1000, 1500, 5000, 2700, 4800, 5400, 2100];
              oudata.labels           = ["AG","NRM","AH","Edu","Health","Infra","WE","RI"];
              this.setState({
                "data" : oudata
              },()=>{})
            } 
          }else{
            oudata.datasets[0].data = [200, 100, 500, 750, 300,600,900,150];
            oudata.datasets[1].data = [2000, 1000, 1500, 5000, 2700, 4800, 5400, 2100];
            oudata.labels           = ["AG","NRM","AH","Edu","Health","Infra","WE","RI"];
            this.setState({
              "data" : oudata
            })     
          }   
      })
      .catch(function(error){        
        console.log(error);
      });
    }else{
       oudata.datasets[0].data = [200, 100, 500, 750, 300,600,900,150];
        oudata.datasets[1].data = [2000, 1000, 1500, 5000, 2700, 4800, 5400, 2100];
        oudata.labels           = ["AG","NRM","AH","Edu","Health","Infra","WE","RI"];
        this.setState({
          "data" : oudata
        })
    }
  }
  getData(year, center_ID){
    if(year){
      console.log("year========",year);
      var sectordata = {...this.state.data};
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      if(startDate && endDate){
        axios.get('/api/reportDashboard/sector_familyupgrade_outreach_count/'+center_ID+'/'+startDate+'/'+endDate)
          .then((response)=>{
          console.log("sector_annual_achievement_report ==>",response);
            var tableData = response.data.map((a, i)=>{
            return {
                _id                                       : a._id,  
                sectorName                                : a.sectorName,
                sectorShortName                           : a.sectorShortName,
                achievement_FamilyUpgradation             : a.achievement_FamilyUpgradation,
                achievement_Reach                         : a.achievement_Reach,
            }
            })
            this.setState({
                tableData : tableData
            },()=>{})
        })
        .catch(function(error){  
          console.log("error = ",error.message);
          if(error.message === "Request failed with status code 500"){
              $(".fullpageloader").hide();
          }
        });
      }
    }
  }
  render() {
    return (
      <div>
        <Loader type="fullpageloader" />
        <div className="displayNone">
          <IAssureTable 
            tableName="Sector wise Outreach & Family Upgradation"
            id="SectorwiseOutreachAndFamilyUpgradation"
            twoLevelHeader={this.state.twoLevelHeader} 
            getData={this.getData.bind(this)} 
            tableHeading={this.state.tableHeading} 
            tableData={this.state.tableData} 
            tableObjects={this.state.tableObjects}
            />
        </div>
       {/*<Radar data={this.state.data} height={350}  options={options} />*/}
       <Bar data={this.state.data} height={300}  options={options} />
      </div>
    );
  }
}


