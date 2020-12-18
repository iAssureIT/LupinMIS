import React,{Component} from 'react';
import {Pie}             from 'react-chartjs-2';
// import 'chartjs-plugin-labels';
import $                 from 'jquery';
import axios             from 'axios';
import IAssureTable      from "../../IAssureTable/IAssureTable.jsx";
import Loader            from "../../../common/Loader.js";

export default class PieChart extends Component {

  constructor(props){
    super(props);
    this.state={
      "data" : {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [] ,
        hoverBackgroundColor: [],
        borderWidth: 2,
        hoverBorderWidth: 3,
        }]
      },      
      "twoLevelHeader"    : {
          apply           : false,
          firstHeaderData : [
          ]
      },
      "tableHeading"      : {
        "name"                             : 'Sector',
        "sectorShortName"                  : 'Sector Short Name',
        // "annualPlan_TotalBudget"           : 'Annual Plan Total Budget', 
        "annualPlan_TotalBudget_L"         : 'Annual Plan Total Budget "Lakhs"', 
      },
      
      "tableObjects"        : {
        paginationApply     : false,
        searchApply         : false,
        downloadApply       : true,
      },   
    } 
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.year !== this.props.year) {
      this.getData(this.props.year);
      this.getSectorwiseData(this.props.year);
    }
  }

  componentDidMount(){
    this.getData(this.props.year);
    this.getSectorwiseData(this.props.year);
  }
  getSectorwiseData(year){
    var sectordata = {...this.state.data};
    // console.log('year', year);
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    // axios.get('/api/report/annual_completion_sector/'+year+'/'+centerID)
    if(startDate && endDate){
        axios.get('/api/reportDashboard/sector_admin/'+startDate+'/'+endDate)
        .then((response)=>{ 
          console.log("sectorrespgetData------------->",response) ;
          // response.data.splice(-2);
          var sector = [];
          var piechartcolor =[];
          var annualPlanTotalBudget = [];
         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{ 
              if(data.annualPlan_TotalBudget > 0){
                sector.push(data.sectorShortName);
                annualPlanTotalBudget.push(data.annualPlan_TotalBudget_L);
                piechartcolor.push(this.getRandomColor_sector());
              }
            })
            // console.log("real ",sector);
            // console.log("annualPlanTotalBudget",annualPlanTotalBudget);
          if (annualPlanTotalBudget.length > 0) {
            sectordata.datasets[0].data = annualPlanTotalBudget;
            sectordata.labels = sector;
            sectordata.datasets[0].backgroundColor = piechartcolor;
            sectordata.datasets[0].hoverBackgroundColor = piechartcolor;
            sectordata.datasets[0].hoverBorderColor = piechartcolor;  
            sectordata.datasets[0].borderColor = piechartcolor;  
            this.setState({
              "data" : sectordata
            })
            
          }else{
            sectordata.datasets[0].data = [300000,170000,50000,200000,250000];
            sectordata.labels = ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"];
            sectordata.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            sectordata.datasets[0].hoverBackgroundColor =["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            sectordata.datasets[0].hoverBorderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            sectordata.datasets[0].borderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            this.setState({
              "data" : sectordata
            })
          }
        }else{
          sectordata.datasets[0].data = [300000,170000,50000,200000,250000];
          sectordata.labels = ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"];
          sectordata.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
          sectordata.datasets[0].hoverBackgroundColor =["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
          sectordata.datasets[0].hoverBorderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
          sectordata.datasets[0].borderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
          this.setState({
            "data" : sectordata
          })
        }   
      })
      .catch(function(error){        
      });
    }else{
      sectordata.datasets[0].data = [300000,170000,50000,200000,250000];
      sectordata.labels = ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"];
      sectordata.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      sectordata.datasets[0].hoverBackgroundColor =["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      sectordata.datasets[0].hoverBorderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      sectordata.datasets[0].borderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      this.setState({
        "data" : sectordata
      })
 
    }
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

  getData(year){
    if(year){
      // console.log("year=========",year);
      var sectordata = {...this.state.data};
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      if(startDate && endDate){
        axios.get('/api/reportDashboard/sector_admin/'+startDate+'/'+endDate)
          .then((response)=>{
            var tableData = response.data.map((a, i)=>{
            return {
                _id                                       : a._id,  
                name                                      : a.name,
                sectorShortName                           : a.sectorShortName,
                // annualPlan_TotalBudget                    : a.annualPlan_TotalBudget,
                annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
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
        <div className="displayNone">
          <IAssureTable 
            tableName = "Sector wise Pie Chart"
            id = "SectorWisePieChart"
            twoLevelHeader={this.state.twoLevelHeader} 
            getData={this.getData.bind(this)} 
            tableHeading={this.state.tableHeading} 
            tableData={this.state.tableData} 
            tableObjects={this.state.tableObjects}
            />
        </div>
        <Pie height={150} 
          data={this.state.data} 
          height="150" 
          options={
            {
              plugins: {
                labels: {
                  render: () => {}
                }
              },
              legend: 
              {
                labels: {
                  boxWidth: 20
                },
                display: true, 
                position: 'right'
              }
            }
          }
        />
     { /*  plugins: {
                labels: [{
                 render: 'label',
                 position: 'outside',
                 fontColor: '#000',
                 textMargin: 8
               },
               {
                 render: 'percentage',
                 fontColor: '#fff',
               }
                ]} }}*/ }
      </div>
    );
  }
}