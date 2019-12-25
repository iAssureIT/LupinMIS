import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';
import 'chartjs-plugin-labels';

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
      labels: ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"],
      datasets: [{
        data: [300000,170000,50000,200000,250000],
        backgroundColor: ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"] ,
        hoverBackgroundColor: ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"]
        }]
      }
    }
  }
 

  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
     // console.log("data",data);
     console.log("props.piechartcolor in pie",props.piechartcolor);
     if (props.annualPlanTotalBudget && props.annualPlanTotalBudget.length > 0) {
        if (data) {
         // console.log(" props.annualPlanTotalBudget", props.annualPlanTotalBudget);
          data.datasets[0].data = props.annualPlanTotalBudget ? props.annualPlanTotalBudget : [];
          // data.datas/ets[1].data = props.annualPlanFamilyUpgradation;
          data.labels = props.sector;
          // data.labels = props.priorities;
          // data.datasets[0].data = props.count;
          data.datasets[0].backgroundColor = props.piechartcolor ? props.piechartcolor : [];
          data.datasets[0].hoverBackgroundColor = props.piechartcolor ? props.piechartcolor : [];
          return{
             data : data
          }
        }
     }
  }

  render() {
    return ( 
      <div>
        <Pie height={150} data={this.state.data} options={{legend: {display: false},
        plugins: {
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
           ]} }} />
      </div>
    );
  }
}