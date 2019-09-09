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
    console.log("props",props);
    this.state={
      "data" : {
        labels: [],
        datasets: [
          {
            label: 'AnnualReach',
            backgroundColor: '#3CB371',
            borderColor: '#3CB371',
            borderWidth: 1,
            hoverBackgroundColor: '#3CB371',
            hoverBorderColor: '#3CB371',
            stack: '2',
            data: []
          },
          {
            label: 'Annual Family Upgradation',
            backgroundColor: '#FF6347',
            borderColor: '#FF6347',
            borderWidth: 1,
            hoverBackgroundColor: '#FF6347',
            hoverBorderColor: '#FF6347',
            stack: '1',
            data: []
          },
          {
            label: 'Achievement Reach',
            backgroundColor: '#3CB371',
            borderColor: '#3CB371',
            borderWidth: 1,
            hoverBackgroundColor: '#3CB371',
            hoverBorderColor: '#3CB371',
            stack: '1',
            data: []
          },
          {
            label: 'Achievement Family Upgradation',
            backgroundColor: '#FF6347',
            borderColor: '#FF6347',
            borderWidth: 1,
            hoverBackgroundColor: '#FF6347',
            hoverBorderColor: '#FF6347',
            stack: '1',
            data: []
          }
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
     console.log("data",data);
     console.log("props",props);
    if (data) {
      // data.datasets[0].data = props.annualPlanFamilyUpgradation;
     /* data.labels = props.annualPlanReach;
      data.datasets[1].data = props.achievementReach;
      data.datasets[2].data = props.achievementFamilyUpgradation;
      return{
         data : data
      }*/
      /* console.log("this.state.sector",sector);
      /* console.log("this.state.annualPlanReach",annualPlanReach);
           console.log("this.state.annualPlanFamilyUpgradation",annualPlanFamilyUpgradation);
          console.log("this.state.achievementReach",achievementReach);
          console.log("this.state.achievementFamilyUpgradation",achievementFamilyUpgradation);
          */
      console.log("after data",data);
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

