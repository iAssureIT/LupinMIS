import React,{Component}            from 'react';
import {Pie}                        from 'react-chartjs-2';
import axios                        from 'axios';
import ReactHTMLTableToExcel        from 'react-html-table-to-excel';
import moment                       from 'moment';
import $                            from 'jquery';
import IAssureTable                 from "../../IAssureTable/IAssureTable.jsx";
import Loader                       from "../../../common/Loader.js";
// import 'chartjs-plugin-labels';

export default class CenterWisePieChart extends Component {
  constructor(props){
    super(props);
    this.state={
      "data" : {
      labels: [],
      datasets: [{
        data: [], 
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderWidth: 2,
        hoverBorderWidth: 3,
        }]
      },
      "twoLevelHeader"    : {
          apply           : false,
          firstHeaderData : [
          ]
      },
      "tableHeading"      : {
        "name"                             : 'Center',
        // "annualPlan_TotalBudget"           : 'Annual Plan Total Budget', 
        "annualPlan_TotalBudget_L"         : 'Annual Plan Total Budget "Lakhs"', 
      },
      
      "tableObjects"        : {
        paginationApply     : false,
        searchApply         : false,
        downloadApply       : true,
      },   
    }

  }
 

  // static getDerivedStateFromProps(props,state){
  //    var data = {...state.data};
  //    // console.log("data",data);
  //   if (data) {
  //    // console.log(" props.annualPlanTotalBudget", props.annualPlanTotalBudget);
  //     data.datasets[0].data = props.center_annualPlanTotalBudget ? props.center_annualPlanTotalBudget : [];
  //     // data.datas/ets[1].data = props.annualPlanFamilyUpgradation;
  //     data.labels           = props.center_sector ? props.center_sector : [];
  //     // data.labels = props.priorities;
  //     // data.datasets[0].data = props.count;
  //     data.datasets[0].backgroundColor      = props.piechartcolor ? props.piechartcolor : [];
  //     data.datasets[0].hoverBackgroundColor = props.piechartcolor ? props.piechartcolor : [];
  //     return{
  //        data : data
  //     }
  //   }
  // }
  componentDidUpdate(prevProps,prevState){
    if (prevProps.year !== this.props.year) {
      this.getData(this.props.year);
      this.getCenterwiseData(this.props.year);
    }
  }
  componentDidMount(){
    this.getCenterwiseData(this.props.year);
    this.getData(this.props.year);
  }
  getCenterwiseData(year){
    // console.log("year========",year);
    var centerData = {...this.state.data};
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";
    if(startDate && endDate){
        $(".fullpageloader").show();
        axios.get('/api/reportDashboard/center_admin/'+startDate+'/'+endDate) 
        .then((response)=>{
              $(".fullpageloader").hide();
          console.log("center_adminresponse-===>",response);
          // response.data.splice(-2); 
          var sector = [];
          var annualPlanTotalBudget = [];
          var piechartcolor =[];
          if(response.data&&response.data.length >0){
            response.data.map((data,index)=>{
              if(data.annualPlan_TotalBudget > 0){
                sector.push(data.name);
                annualPlanTotalBudget.push(data.annualPlan_TotalBudget_L);
                piechartcolor.push(this.getRandomColor());                
              }
            })
            // console.log("annualPlanTotalBudget",annualPlanTotalBudget);
            if(annualPlanTotalBudget.length > 0){
              centerData.datasets[0].data = annualPlanTotalBudget;
              centerData.labels = sector;
              centerData.datasets[0].backgroundColor = piechartcolor;
              centerData.datasets[0].hoverBackgroundColor = piechartcolor;  
              centerData.datasets[0].hoverBorderColor = piechartcolor;  
              centerData.datasets[0].borderColor = piechartcolor;  
              this.setState({
                "data" : centerData
              })
             
            }else{
              centerData.datasets[0].data = [500000,150000,90000,100000,200000];
              centerData.labels = ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"];
              centerData.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              centerData.datasets[0].hoverBackgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              centerData.datasets[0].hoverBorderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              centerData.datasets[0].borderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
              this.setState({
                "data" : centerData
              })
            }

        }else{
            centerData.datasets[0].data = [500000,150000,90000,100000,200000];
            centerData.labels = ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"];
            centerData.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            centerData.datasets[0].hoverBackgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            centerData.datasets[0].hoverBorderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            centerData.datasets[0].borderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
            this.setState({
              "data" : centerData
            })
        }
      }).catch(function (error) {
        console.log('error', error);
      });
    }else{
      centerData.datasets[0].data = [500000,150000,90000,100000,200000];
      centerData.labels = ["Pune","Aurangabad","Goa","Sikkim","Bharatpur"];
      centerData.datasets[0].backgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      centerData.datasets[0].hoverBackgroundColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      centerData.datasets[0].hoverBorderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      centerData.datasets[0].borderColor = ["#0275d8","#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
      this.setState({
        "data" : centerData
      })
    }
  }
  getData(year){
    if(year){
      // console.log("year========",year);
      var centerData = {...this.state.data};
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";
      if(startDate && endDate){
        axios.get('/api/reportDashboard/center_admin/'+startDate+'/'+endDate) 
          .then((response)=>{
            var tableData = response.data.map((a, i)=>{
            return {
                _id                                       : a._id,  
                name                                      : a.name,
                annualPlan_TotalBudget                    : a.annualPlan_TotalBudget,
                annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
            }
            })
            this.setState({
                tableData : tableData
            },()=>{})
        })
        .catch(function(error){  
          console.log("error = ",error.message);
          if(error.message === "Request failed with status code 500"){
              $(".fullpageloader").hide();
          }
        });
      }
    }
  }
  // gatAllYear(){
  //  const years = []
  //  const dateStart = moment()
  //  const dateEnd = moment().add(10, 'y');
  //  // while (dateEnd.diff(dateStart, 'years') >= 0) {
  //  //   years.push(dateStart.subtract(1, 'years').format('YYYY')+"-"+dateStart.format('YYYY'))
  //  //   dateStart.add(1, 'year')
  //  // }
  //  // return years
  //   // console.log("arr ===>",years);
  // }
   getRandomColor(){
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
    // console.log("this.state.data = ",this.state.data);
    return (
      <div>
        
        <div className="displayNone">
          <IAssureTable 
            tableName = "Centerwise Pie Chart"
            id = "CenterWisePieChart"
            twoLevelHeader={this.state.twoLevelHeader} 
            getData={this.getData.bind(this)} 
            tableHeading={this.state.tableHeading} 
            tableData={this.state.tableData} 
            tableObjects={this.state.tableObjects}
            />
        </div>
        <Pie height={150} 
          data={this.state.data} 
          height="150" 
          options={
            {
              plugins: {
                labels: {
                  render: () => {}
                }
              },
              legend: 
              {
                labels: {
                  boxWidth: 20,
                   padding: 10
                },
                display: true, 
                position: 'right'
              },
              tooltips: {
                mode: 'nearest',
                intersect: false,
              }
            }
          }
        />
  {  /*    plugins: {
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
            }*/}
          
      </div>
    );
  }
}