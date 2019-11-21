import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';

export default class PieChart extends Component {
  // constructor(props){
  //   super(props);
  //   // console.log("props",props);
  //   this.state={
  //     "data" : {
  //       labels: [],
  //       datasets: [
  //         {
  //           label: 'Achievement Reach',
  //           backgroundColor: 'rgba(75, 192, 192, 1)',
  //           borderColor:  'rgba(75, 192, 192, 0.5)',
  //           borderWidth: 1,
  //           hoverBackgroundColor:  'rgba(75, 192, 192, 0.5)',
  //           hoverBorderColor:  'rgba(75, 192, 192, 0.5)',
  //           stack: '1',
  //           data: []
  //         },          
  //       ]
  //     }
  //   }
  // }
  constructor(props){
    super(props);
    // console.log("props",props);
    this.state={
      "data" : {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [] ,
        hoverBackgroundColor: []
        }]
      }
    }
  }
  

  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
     // console.log("data",data);
     // console.log("props",props);
    if (data) {
     // console.log(" props.annualPlanTotalBudget", props.annualPlanTotalBudget);
      data.datasets[0].data = props.center_annualPlanTotalBudget ? props.center_annualPlanTotalBudget : [];
      // data.datas/ets[1].data = props.annualPlanFamilyUpgradation;
      data.labels = props.center_sector ? props.center_sector : [];
      // data.labels = props.priorities;
      // data.datasets[0].data = props.count;
      data.datasets[0].backgroundColor = props.piechartcolor ? props.piechartcolor : [];
      // data.datasets[0].hoverBackgroundColor = props.priorities.length === 4 ? ['#FF0000','#ffbf00','#4682B4','#3CB371'] : ['#FF0000','#ffbf00','#3CB371'];
      return{
         data : data
      }
    }
  }

  render() {
    return (
      <div>
        <Pie data={this.state.data} />
      </div>
    );
  }
}

