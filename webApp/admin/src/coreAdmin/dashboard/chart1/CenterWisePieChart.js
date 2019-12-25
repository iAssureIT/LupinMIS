import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';
import 'chartjs-plugin-labels';
export default class PieChart extends Component {
  constructor(props){
    super(props);
    this.state={
      "data" : {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
        }]
      }
    }
  }
 

  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
     // console.log("data",data);
     // console.log("props",props);
    if (props.center_annualPlanTotalBudget && props.center_annualPlanTotalBudget.length > 0) {
      if (data) {
       // console.log(" props.annualPlanTotalBudget", props.annualPlanTotalBudget);
        data.datasets[0].data = props.center_annualPlanTotalBudget ? props.center_annualPlanTotalBudget : [];
        // data.datas/ets[1].data = props.annualPlanFamilyUpgradation;
        data.labels           = props.center_sector ? props.center_sector : [];
        // data.labels = props.priorities;
        // data.datasets[0].data = props.count;
        data.datasets[0].backgroundColor      = props.piechartcolor ? props.piechartcolor : [];
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
           ]}}
          } />
      </div>
    );
  }
}