import React,{Component} from 'react';
import {Line} from 'react-chartjs-2';
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
      }
    }
  }
  static getDerivedStateFromProps(props,state){
     var data = {...state.data}; 
    if (data) {
      data.datasets[0].data = props.expenditure;
      data.datasets[1].data = props.budget;
      data.labels = props.months;
      return{
         data : data
      }
    }
  }

  render() {
    return (
      <div>
       <Line data={this.state.data} height={190}  options={{responsive: true,stacked: true,}} />
      </div>
    );
  }
}

