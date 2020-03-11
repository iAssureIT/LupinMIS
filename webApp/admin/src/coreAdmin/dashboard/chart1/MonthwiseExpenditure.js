import React,{Component} from 'react';
import {Line}            from 'react-chartjs-2';
import axios             from 'axios';
import $                 from 'jquery';
import IAssureTable      from "../../IAssureTable/IAssureTable.jsx";
import Loader            from "../../../common/Loader.js";
import 'chartjs-plugin-labels';


export default class MonthwiseExpenditure extends Component{
  constructor(props){
    super(props);
    this.state={
      "data" : {
        labels: [],
        datasets: [   
          {
            label: 'Expenditure',
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor:  'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(54, 162, 235, 0.5)',
            hoverBorderColor:  'rgba(54, 162, 235, 0.5)',
            data: []
          },
          {
            label: 'Budget',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 99, 132, 1)', 
            borderColor: 'rgba(255, 99, 132, 0.5)',
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',
            hoverBorderColor: 'rgba(255, 99, 132, 0.5)',
            data: []
          },
        ]
      }, 
      "twoLevelHeader"    : {
          apply           : false,
          firstHeaderData : [
          ]
      },
      "tableHeading"      : {
        "month"                           : 'Month',
        "monthlyPlan_TotalBudget"         : 'Budget',
        "curr_achievement_TotalBudget"    : 'Expenditure', 
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
  //   if (data) {
  //     data.datasets[0].data = props.expenditure;
  //     data.datasets[1].data = props.budget;
  //     data.labels = props.months;
  //     return{
  //        data : data
  //     }
  //   }
  // }
   componentDidUpdate(prevProps,prevState){
    if (prevProps.year !== this.props.year) {
      this.getData(this.props.year);
      this.getmonthwiseExpen(this.props.year);
    }
  }
  componentDidMount(){
    this.getData(this.props.year);
    this.getmonthwiseExpen(this.props.year);
  }
  getmonthwiseExpen(year,center_ID){
    // console.log('year', year, 'center_ID', center_ID);
    var monthexp = {...this.state.data};
    var startYear = year.substring(3, 7);
    var endYear = year.substring(10, 15);
    if(startYear && endYear){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear+'/all')
        .then((response)=>{
          // console.log("response",response.data);
          var month = [];
          var monthlyPlanTotalBudget = [];
          var achievementTotalBudget = [];

         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              month.push(data.month);
              monthlyPlanTotalBudget.push(data.monthlyPlan_TotalBudget);
              achievementTotalBudget.push(data.curr_achievement_TotalBudget);
            })
            if (monthlyPlanTotalBudget.length > 0 || achievementTotalBudget.length > 0 ) {
              monthexp.datasets[0].data = achievementTotalBudget;
              monthexp.datasets[1].data = monthlyPlanTotalBudget;
              monthexp.labels           = month;
              this.setState({
                "data" : monthexp
              })
            }else{
              monthexp.datasets[0].data = [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400];
              monthexp.datasets[1].data = [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000];
              monthexp.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
              this.setState({
                "data" : monthexp
              })
            }
        }else{
           monthexp.datasets[0].data = [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400];
            monthexp.datasets[1].data = [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000];
            monthexp.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
            this.setState({
              "data" : monthexp
            }) 
        }  
      })
      .catch(function(error){        
      });
    }else{
      monthexp.datasets[0].data = [2000,1400,1500,1000,2500,1000,200,1200,1000,800,600,400];
      monthexp.datasets[1].data = [1000,1500,2000,2300,2500,500,900,1700,1600,1500,1300,1000];
      monthexp.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
      this.setState({
        "data" : monthexp
      })
    }
  }

  getData(year){
    if(year){
      console.log("year========",year);
      var monthexp = {...this.state.data};
      var startYear = year.substring(3, 7);
      var endYear = year.substring(10, 15);
      if(startYear && endYear){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear+'/all')
          .then((response)=>{
            var tableData = response.data.map((a, i)=>{
            return {
                _id                                : a._id,  
                month                              : a.month,
                monthlyPlan_TotalBudget            : a.monthlyPlan_TotalBudget,
                curr_achievement_TotalBudget       : a.curr_achievement_TotalBudget,
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
            tableName="Month wise Expenditure & Budget"
            id="MonthwiseExpenditure"
            twoLevelHeader={this.state.twoLevelHeader} 
            getData={this.getData.bind(this)} 
            tableHeading={this.state.tableHeading} 
            tableData={this.state.tableData} 
            tableObjects={this.state.tableObjects}
            />
        </div>
       <Line data={this.state.data} height={190}  options={{responsive: true,stacked: true,}} />
      </div>
    );
  }
}

