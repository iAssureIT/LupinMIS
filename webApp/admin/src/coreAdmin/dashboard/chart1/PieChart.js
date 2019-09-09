import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';

export default class PieChart extends Component {
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
      data.labels = props.priorities;
      data.datasets[0].data = props.count;
      data.datasets[0].backgroundColor = props.priorities.length === 4 ? ['#FF0000','#ffbf00','#4682B4','#3CB371'] : ['#FF0000','#ffbf00','#3CB371'];
      data.datasets[0].hoverBackgroundColor = props.priorities.length === 4 ? ['#FF0000','#ffbf00','#4682B4','#3CB371'] : ['#FF0000','#ffbf00','#3CB371'];
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

