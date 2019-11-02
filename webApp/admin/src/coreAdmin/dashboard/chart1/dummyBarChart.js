import React,{Component} from 'react';
import {HorizontalBar} from 'react-chartjs-2';
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
  // displayName: 'BarExample',
  constructor(props){
    super(props);
    // console.log("props",props);
    this.state={
      "data" : {
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
  // componentDidMount(){
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

  // }
  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
     // console.log("data",data);
     console.log("props",props);
    if (data) {
      data.datasets[0].data = props.achievementFamilyUpgradation;
      data.datasets[1].data = props.annualPlanFamilyUpgradation;
      /*data.datasets[0].data = props.achievementFamilyUpgradation;
      data.datasets[1].data = props.achievementReach;
      data.datasets[2].data = props.annualPlanFamilyUpgradation;
      data.datasets[3].data = props.annualPlanReach;
      */
  // data.labels=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      data.labels = props.sector;
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

