import React,{Component} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chartjs-plugin-labels';

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
            borderColor:  'rgba(255, 255,102, 0)',
            borderWidth: 1,
            hoverBackgroundColor:  'rgba(255, 255,102, 1)',
            hoverBorderColor:  'rgba(255, 255,102, 0)',
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
            borderColor: 'rgba(75, 192, 192, 0)',
            hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
            hoverBorderColor: 'rgba(75, 192, 192, 0)',
            stack: '2',
            data: []
          },
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
     // console.log("props",props);
    if (data) {
      data.datasets[0].data = props.ActualBeneficiaries;
      data.datasets[1].data = props.PlannedBeneficiaries;
      /*data.datasets[0].data = props.achievementFamilyUpgradation;
      data.datasets[1].data = props.achievementReach;
      data.datasets[2].data = props.annualPlanFamilyUpgradation;
      data.datasets[3].data = props.annualPlanReach;
      */
      data.labels = props.months;
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
       <Bar data={this.state.data} height={300}  options={options} />
      </div>
    );
  }
}

