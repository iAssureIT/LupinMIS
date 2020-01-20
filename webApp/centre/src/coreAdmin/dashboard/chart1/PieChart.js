import React,{Component} from 'react';
import {Pie} from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import axios             from 'axios';

export default class PieChart extends Component {

  constructor(props){
    super(props);
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
 

  // static getDerivedStateFromProps(props,state){
  //    var data = {...state.data};

  //     if (data) {
  //       data.datasets[0].data = props.annualPlanTotalBudget ? props.annualPlanTotalBudget : [];
  //       data.labels = props.sector;
  //       data.datasets[0].backgroundColor = props.piechartcolor ? props.piechartcolor : [];
  //       data.datasets[0].hoverBackgroundColor = props.piechartcolor ? props.piechartcolor : [];
  //       return{
  //          data : data
  //       }
  //     }
  // }
  componentDidUpdate(prevProps, prevState){
    if (prevProps.year !== this.props.year) {
       this.getSectorwiseData(this.props.year,this.props.center_ID);
    }
  }
  componentDidMount(){
    this.getSectorwiseData(this.props.year,this.props.center_ID);
  }
  getSectorwiseData(year,center_ID){
    // console.log("this.props.center_ID",center_ID);
    if (year && center_ID) {

      var sectordata = {...this.state.data};
      // console.log('year', year);
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      // console.log(startDate, endDate);
      // axios.get('/api/report/annual_completion_sector/'+year+'/'+centerID)
      if(startDate && endDate){
        // router.get('/sector_center/:center_ID/:startDate/:endDate',  
          axios.get('/api/reportDashboard/sector_center/'+center_ID+'/'+startDate+'/'+endDate)
          .then((response)=>{ 
            console.log("respgetData------------->",response) ;
            response.data.splice(-2);
            var sector = [];
            var piechartcolor =[];
            var annualPlanTotalBudget = [];
           if(response.data&&response.data.length >0){
              response.data.map((data,index)=>{ 
                if(data.annualPlan_TotalBudget > 0){
                  sector.push(data.name);
                  annualPlanTotalBudget.push(data.annualPlan_TotalBudget);
                  piechartcolor.push(this.getRandomColor_sector());
                }
              })
              // console.log("real ",sector);
              // console.log("annualPlanTotalBudget",annualPlanTotalBudget);
            if (annualPlanTotalBudget.length > 0) {
              sectordata.datasets[0].data = annualPlanTotalBudget;
              sectordata.labels = sector;
              sectordata.datasets[0].backgroundColor = piechartcolor;
              sectordata.datasets[0].hoverBackgroundColor = piechartcolor;
              this.setState({
                "data" : sectordata
              })
              
            }else{
              sectordata.datasets[0].data = [300000,170000,50000,200000,250000];
              sectordata.labels = ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"];
              sectordata.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              sectordata.datasets[0].hoverBackgroundColor =["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              this.setState({
                "data" : sectordata
              })
            }
          }else{
            sectordata.datasets[0].data = [300000,170000,50000,200000,250000];
            sectordata.labels = ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"];
            sectordata.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            sectordata.datasets[0].hoverBackgroundColor =["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            this.setState({
              "data" : sectordata
            })
          }   
        })
        .catch(function(error){        
        });
      }else{
        sectordata.datasets[0].data = [300000,170000,50000,200000,250000];
        sectordata.labels = ["Agriculture Development","Natural Resource Management","Animal Husbandry","Educational Sector","Health"];
        sectordata.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
        sectordata.datasets[0].hoverBackgroundColor =["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
        this.setState({
          "data" : sectordata
        })
   
      }
    }
  }
  getRandomColor_sector(){
      var letters = '01234ABCDEF56789';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
      //  var letters = 'BCDEF'.split('');
      // var color = '#';
      // for (var i = 0; i < 6; i++ ) {
      //     color += letters[Math.floor(Math.random() * letters.length)];
      // }
      // return color;
    }
  render() {
    return ( 
      <div>
        <Pie height={130} data={this.state.data} options={{legend: {display: false},
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