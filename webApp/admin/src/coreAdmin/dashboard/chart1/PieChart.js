import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';

export default class PieChart extends Component {
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
        /*
          data: [],
          backgroundColor: [] ,
          hoverBackgroundColor: []*/
        ]
      }
    }
  }
  static getDerivedStateFromProps(props,state){
     var data = {...state.data};
     console.log("data",data);
     console.log("props",props);
    if (data) {
      data.datasets[0].data = props.achievementFamilyUpgradation;
      data.datasets[1].data = props.annualPlanFamilyUpgradation;
      data.labels = props.sector;
      // data.labels = props.priorities;
      // data.datasets[0].data = props.count;
      // data.datasets[0].backgroundColor = props.priorities.length === 4 ? ['#FF0000','#ffbf00','#4682B4','#3CB371'] : ['#FF0000','#ffbf00','#3CB371'];
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

