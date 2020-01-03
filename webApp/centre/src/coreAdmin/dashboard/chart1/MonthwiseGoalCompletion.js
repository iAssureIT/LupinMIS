import React,{Component} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import axios             from 'axios';

const options = {
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
          }], 
    },
    plugins: {
      labels: [{
        render: 'value',
        showActualPercentages: false,
        fontSize: 9,
        // fontColor: '#fff',
      }]
    },
    responsive: true,
    maintainAspectRatio: false     
};

export default class MonthwiseGoalCompletion extends Component{
  // displayName: 'BarExample',
  constructor(props){
    super(props);
    // console.log("props",props);
    this.state={
      "data" : {
        labels: [],
        datasets: [   
          {
            label: 'Upgraded Beneficiaries',
                // 'rgba(54, 162, 235, 0.5)',
            backgroundColor: 'rgba(15,222,25, 1)',
            borderColor:  'rgba(15,222,25, 1)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(15,222,25, 1)',
            hoverBorderColor:  'rgba(15,222,25, 1)',
            stack: '1',
            data: []
          },
          {
            label: 'Outreach',
            // backgroundColor:'rgba(54, 162, 235, 1)',
            // borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            // hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            // hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            backgroundColor: 'rgba(255, 190, 0, 1)',
            borderColor: 'rgba(255, 190, 0, 1)',
            hoverBackgroundColor:'rgba(255, 190, 0, 1)',
            hoverBorderColor: 'rgba(255, 190, 0, 1)',
            stack: '2',
            data: []
          },
        ]
      }
    }
  }
  // static getDerivedStateFromProps(props,state){
  //    var data = {...state.data}; 
  //   if (data) {
  //     data.datasets[0].data = props.ActualBeneficiaries;
  //     data.datasets[1].data = props.PlannedBeneficiaries;
  //     data.labels = props.months;
  //     return{
  //        data : data
  //     }
  //   }
  // }
  componentDidUpdate(prevProps, prevState){
    if (prevProps.year !== this.props.year) {
      this.getMonthwiseData(this.props.year,this.props.center_ID);
    }
  }
  componentDidMount(){
    this.getMonthwiseData(this.props.year,this.props.center_ID);
  }
  getMonthwiseData(year,center_ID){
    // console.log('year', year, 'center_ID', center_ID);
    var monthlydata = {...this.state.data};
    var startYear = year.substring(3, 7);
    var endYear = year.substring(10, 15);
    if(startYear && endYear){
        axios.get('/api/report/dashboard/'+startYear+'/'+endYear+'/'+center_ID)
        .then((response)=>{
          var month = [];
          var monthlyPlanReach = [];
          var monthlyAchievementReach = [];

         if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              month.push(data.month);
              monthlyPlanReach.push(data.monthlyPlan_Reach);
              monthlyAchievementReach.push(data.curr_achievement_Reach);                
            })
            if (monthlyPlanReach.length > 0 || monthlyAchievementReach.length > 0 ) {        
              monthlydata.datasets[0].data = monthlyAchievementReach;
              monthlydata.datasets[1].data = monthlyPlanReach;
              monthlydata.labels           = month;
              this.setState({
                "data" : monthlydata
              })
            }else{
              monthlydata.datasets[0].data = [500,1400,1500,1000,2500,1000,200,1200];
              monthlydata.datasets[1].data = [500,1500,2000,2300,2500,500,3000,1700];
              monthlydata.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
              this.setState({
                "data" : monthlydata
              })
            }
        }else{
           monthlydata.datasets[0].data = [500,1400,1500,1000,2500,1000,200,1200];
            monthlydata.datasets[1].data = [500,1500,2000,2300,2500,500,3000,1700];
            monthlydata.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
            this.setState({
              "data" : monthlydata
            })
        }  
      })
      .catch(function(error){        
      });
    }else{
       monthlydata.datasets[0].data = [500,1400,1500,1000,2500,1000,200,1200];
        monthlydata.datasets[1].data = [500,1500,2000,2300,2500,500,3000,1700];
        monthlydata.labels           = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'];
        this.setState({
          "data" : monthlydata
        })
    }
  }


  render() {
    return (
      <div>
       <Bar data={this.state.data} height={300}  options={options} />
      </div>
    );
  }
}

