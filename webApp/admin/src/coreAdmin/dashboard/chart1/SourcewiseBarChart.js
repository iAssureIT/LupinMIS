import React,{Component}      from 'react';
import axios                  from 'axios';
import {HorizontalBar}        from 'react-chartjs-2';
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

export default class SourcewiseBarChart extends Component{
  // displayName: 'BarExample',
  constructor(props){
    super(props);
    console.log("props",props);
    this.state={
      "data" : {
        labels: [],
        datasets: [
          {
            label: 'achi_month',
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.5)',
            hoverBorderColor: 'rgba(255, 99, 132, 0.5)',
            stack: '2',
            data: []
          },
          {
            label: 'annualPlan',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'cum_achi',
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
            hoverBorderColor:'rgba(255, 206, 86, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'cum_monthly',
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor:  'rgba(75, 192, 192, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(75, 192, 192, 0.5)',
            hoverBorderColor:  'rgba(75, 192, 192, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'monthlyPlan',
            backgroundColor:'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.5)',
            hoverBorderColor: 'rgba(54, 162, 235, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'per_achi',
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
            hoverBorderColor:'rgba(255, 206, 86, 0.5)',
            stack: '1',
            data: []
          },
          {
            label: 'per_cum_achi',
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor:  'rgba(75, 192, 192, 0.5)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(75, 192, 192, 0.5)',
            hoverBorderColor:  'rgba(75, 192, 192, 0.5)',
            stack: '1',
            data: []
          }
        ]
      }
    }
  }
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
  //   var data = {...this.state.data};
  //   if (data) {
  //     data.labels = this.props.userNames;
  //     data.datasets[0].data = this.props.openCount;
  //     data.datasets[1].data = this.props.closeCount;
  //     this.setState({
  //       data : data
  //     },()=>{
  //       console.log("componentDidMount data",this.state.data);
  //     })
  //   }

  }
  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
     console.log("data",data);
     console.log("props",props);
    if (data) {
      data.datasets[1].data = props.annualPlan;
      data.datasets[2].data = props.cum_achi;
      /*
      data.datasets[4].data = props.monthlyPlan;
      data.datasets[3].data = props.cum_monthly;
      data.datasets[0].data = props.achi_month;
      data.datasets[5].data = props.per_achi;
      data.datasets[6].data = props.per_cum_achi;
      data.labels = props.source;
      */
      return{
         data : data
      }

      /* console.log("this.state.sector",sector);
      /* console.log("this.state.annualPlanReach",annualPlanReach);
           console.log("this.state.annualPlanFamilyUpgradation",annualPlanFamilyUpgradation);
          console.log("this.state.achievementReach",achievementReach);
          console.log("this.state.achievementFamilyUpgradation",achievementFamilyUpgradation);
          */
    }
  }

  render() {
    return (
      <div>
       <HorizontalBar data={this.state.data} height={350}  options={options} />
      </div>
    );
  }
}

