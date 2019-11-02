import React,{Component}  from 'react';
import { render }         from 'react-dom';
import {Link}             from 'react-router-dom';
import moment             from 'moment';
import axios              from 'axios';
import $                  from 'jquery';
import { Chart }          from "react-google-charts";
// import DashboardCWSBS     from "../dashboardReports/cafeWiseSeatBookingS/DashboardCWSBS.js";
// import SalesTransactionReportDashB from '../dashboardReports/salesTransactionReport/SalesTransactionReportDashB.js';

class AdminContent extends Component{
  constructor(props){
    super(props);
    this.state = {
      allUserData     : [],
      pieOptions      : "",
      pieData         : "",
      dataColumnChart : "",
      activeVendor    : "",
      earningMTD      : "",
      earningYTD      : "",
      menuMTD         : "",
      menuYTD         : "",
      subUsers        : "",
      subscrptionData : [],
      totalUsers      : "",
      totalVendor     : "",
      twelveMonthGrossEarning:[],
    };
  }

  componentWillMount(){
    $('.sidebar').css({display:'block',background: '#222d32'});
    this.getData();
    
    setInterval(() => {
      this.getData();
    }, 30000);

  }

  getData(){
    axios
    .get('/api/report/get/dashboard')
    .then((response)=>{
      console.log("dashboard............>",response.data);
       this.setState({
            activeVendor    : response.data.activeVendor,
            earningMTD      : response.data.earningMTD,
            earningYTD      : response.data.earningYTD,
            menuMTD         : response.data.menuMTD,
            menuYTD         : response.data.menuYTD,
            subUsers        : response.data.subUsers,
            subscrptionData : response.data.subscrptionData,
            totalUsers      : response.data.totalUsers,
            totalVendor     : response.data.totalVendor,
            twelveMonthGrossEarning: response.data.twelveMonthGrossEarning,
          });
        // var subscrptionData=[{packageName: "Daily Package", count: 5},{packageName: "Weekly Package", count: 3},{packageName: "Monthly Package", count: 5}]
        var subscrptionData=response.data.subscrptionData;
        
        var pieArray = [["Monthly", "Weekly"]];  
        for (var i = 0; i < subscrptionData.length; i++) {
          var pieArr = [subscrptionData[i].packageName , subscrptionData[i].count];
          pieArray.push(pieArr)
        }
        // var twelveMonthGrossEarning =[{monthYear: "Oct", earning: 100},{monthYear: "Nov", earning: 489},{monthYear: "Dec", earning: 573},{monthYear: "Jan", earning: 710},{monthYear: "Feb", earning: 249},{monthYear: "Mar", earning: 432},{monthYear: "Apr", earning: 685},{monthYear: "May", earning: 589},{monthYear: "Jun", earning: 729},{monthYear: "Jul", earning: 635},{monthYear: "Aug", earning: 565},{monthYear: "Sep", earning: 900}]
        var twelveClrArray = ["#6D78AD","#5CCDA0","#DF7970","#4C9CA0","#AE7D99","#C9D45B","#5592AC","#F4C12E","#CC68DE","#F18230","#79B2F5","#424263"];
        var chartArray = [["Month", "Cost (RS)", { role: "style" }],];  
        for (var i = 0; i < this.state.twelveMonthGrossEarning.length; i++) {
          var chartArr = [this.state.twelveMonthGrossEarning[i].monthYear , this.state.twelveMonthGrossEarning[i].earning , twelveClrArray[i]];
          chartArray.push(chartArr)
          console.log('chartArray',chartArray );
        }
  
        this.setState({
            pieData : pieArray,          
            dataColumnChart : chartArray,          
          },()=>{
          console.log('pieData', this.state.pieData);
          console.log('dataColumnChart', this.state.dataColumnChart);
          })
    })
    .catch(function (error) {
      console.log(error);
    })

  }

  componentDidMount() {
    const dataColumnChart = [
      ["Month", "Cost (Lac)", { role: "style" }],
      ["#6D78AD","#5CCDA0","#DF7970","#4C9CA0","#AE7D99","#C9D45B","#5592AC","#F4C12E","#CC68DE","#F18230","#79B2F5","#424263"],
      // [["Jan", "Feb", "March","Jan", "Feb", "March","Jan", "Feb", "March","Jan", "Feb", "March"], [1,2,3,4,5,6,7,8,9,10,11,12]]
    ];

    const pieOptions = {
      title: "",
      pieHole: 0.6,
      slices: [
        {
          color: "#6D78AD"
        },
        {
          color: "#5CCDA0"
        },
        {
          color: "#DF7970"
        },
        {
          color: "#e9a227"
        }
      ],
      legend: {
        position: "bottom",
        alignment: "center",
        textStyle: {
          color: "233238",
          fontSize: 14,
          font: "montserrat",
        }
      },
      tooltip: {
        showColorCode: true
      },
      chartArea: {
        left: 0,
        top: 20,  
        width: "100%",
        height: "80%"
      },
      fontName: "Roboto"
    };

    this.setState({
      pieOptions      : pieOptions,
    })
  }

  componentWillUnmount(){
    // $("script[src='/js/adminLte.js']").remove();
    // $("link[href='/css/dashboard.css']").remove();
    // console.log('wow');
  }

  allUserCount(){
    return this.state.allUserData.length;
  }

  componentDidUpdate(){
      // const myChartRef = this.chartRef.current.getContext("2d");
          
      //     new Chart(myChartRef, {
      //         type: "line",
      //         data: {
      //             //Bring in data
      //             labels: ["Jan", "Feb", "March"],
      //             datasets: [
      //                 {
      //                     label: "Sales",
      //                     data: [86, 67, 91],
      //                 }
      //             ]
      //         },
      //         options: {
      //             //Customize chart options
      //         }
      //     });

      //   var competitionRegChart = document.getElementById("competitionRegChart").getContext('2d');
      //   var myChart = new Chart(competitionRegChart, {
      //       type: 'bar',
      //       data: {
      //           // labels: this.state.CompetitionwiseReg.map(function(label,index){return label.competitionName.substring(0,5)}),
      //           labels: this.state.CompetitionwiseReg.map(function(label,index){return (label.competitionName).substring(0,7)+"..."}),
      //           // labels: this.state.CompetitionwiseReg.map(function(label,index){return (label.competitionName).split(/\s+/).slice(0,2).join(" ")+"..."}),
      //           datasets: [{
      //               label: 'Competition registrations',
      //               data: this.state.CompetitionwiseReg.map(function(compCnt,index){return compCnt.competitionRegCnt}),
      //               backgroundColor: [
      //                   'rgba(255, 99, 132, 0.2)',
      //                   'rgba(54, 162, 235, 0.2)',
      //                   'rgba(255, 206, 86, 0.2)',
      //                   'rgba(75, 192, 192, 0.2)',
      //                   'rgba(153, 102, 255, 0.2)',
      //                   'rgba(255, 159, 64, 0.2)',
      //                   'rgba(255, 99, 132, 0.2)',
      //                   'rgba(54, 162, 235, 0.2)',
      //                   'rgba(255, 206, 86, 0.2)',
      //                   'rgba(75, 192, 192, 0.2)',
      //                   'rgba(153, 102, 255, 0.2)',
      //                   'rgba(255, 159, 64, 0.2)'
      //               ],
      //               borderColor: [
      //                   'rgba(255,99,132,1)',
      //                   'rgba(54, 162, 235, 1)',
      //                   'rgba(255, 206, 86, 1)',
      //                   'rgba(75, 192, 192, 1)',
      //                   'rgba(153, 102, 255, 1)',
      //                   'rgba(255, 159, 64, 1)',
      //                   'rgba(255,99,132,1)',
      //                   'rgba(54, 162, 235, 1)',
      //                   'rgba(255, 206, 86, 1)',
      //                   'rgba(75, 192, 192, 1)',
      //                   'rgba(153, 102, 255, 1)',
      //                   'rgba(255, 159, 64, 1)'
      //               ],
      //               borderWidth: 1
      //           }]
      //       },
      //       options: {
      //           scales: {
      //               yAxes: [{
      //                   ticks: {
      //                       beginAtZero:true
      //                   }
      //               }]
      //           }
      //       }
      //   });

      //   var packagePurchageChart = document.getElementById("packagePurchageChart").getContext('2d');
      //   var myChart = new Chart(packagePurchageChart, {
      //       type: 'bar',
      //       data: {
      //           labels: this.state.allPackages.map(function(label,index){return (label).substring(0,5)+"..."}),
      //           // labels: this.state.allPackages,
      //           datasets: [{
      //               label: 'All Packages',
      //               data: this.state.PackagesPurchaseCnt,
      //               backgroundColor: [
      //                   'rgba(255, 99, 132, 0.2)',
      //                   'rgba(54, 162, 235, 0.2)',
      //                   'rgba(255, 206, 86, 0.2)',
      //                   'rgba(75, 192, 192, 0.2)',
      //                   'rgba(153, 102, 255, 0.2)',
      //                   'rgba(255, 159, 64, 0.2)',
      //                   'rgba(255, 99, 132, 0.2)',
      //                   'rgba(54, 162, 235, 0.2)',
      //                   'rgba(255, 206, 86, 0.2)',
      //                   'rgba(75, 192, 192, 0.2)',
      //                   'rgba(153, 102, 255, 0.2)',
      //                   'rgba(255, 159, 64, 0.2)'
      //               ],
      //               borderColor: [
      //                   'rgba(255,99,132,1)',
      //                   'rgba(54, 162, 235, 1)',
      //                   'rgba(255, 206, 86, 1)',
      //                   'rgba(75, 192, 192, 1)',
      //                   'rgba(153, 102, 255, 1)',
      //                   'rgba(255, 159, 64, 1)',
      //                   'rgba(255,99,132,1)',
      //                   'rgba(54, 162, 235, 1)',
      //                   'rgba(255, 206, 86, 1)',
      //                   'rgba(75, 192, 192, 1)',
      //                   'rgba(153, 102, 255, 1)',
      //                   'rgba(255, 159, 64, 1)'
      //               ],
      //               borderWidth: 1
      //           }]
      //       },
      //       options: {
      //           scales: {
      //               yAxes: [{
      //                   ticks: {
      //                       beginAtZero:true
      //                   }
      //               }]
      //           }
      //       }
      //   });
  }
  render(){

    return(
      <div>
        <div className="content-wrapper">
          <section className="content-header">
            <h1>Dashboard</h1>
            {/*<ol className="breadcrumb"></ol>*/}
          </section>
          <section className="content">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-orange">
                    <i className="fa fa-users"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Users<small></small></span>
                    <span className="info-box-text">
                      Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.totalUsers}</b>
                    </span>
                    <span className="info-box-text">
                      Subscribed&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.subUsers}</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-aqua">
                    <i className="fa fa-users" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Vendors<small></small></span>
                    <span className="info-box-text">
                      Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.totalVendor}</b>
                    </span>
                    <span className="info-box-text">
                      Active&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.activeVendor}</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-red">
                    <i className="fa fa-rupee" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Total Earning<small></small></span>
                    <span className="info-box-text">
                      YTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.earningYTD} <i className="fa fa-rupee"></i></b>
                    </span>
                    <span className="info-box-text">
                      MTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.earningMTD} <i className="fa fa-rupee"></i></b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <i className="fa fa-bars"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-number">Menu Orders<small></small></span>
                    <span className="info-box-text">
                      YTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.menuYTD}</b>
                    </span>
                    <span className="info-box-text">
                      MTD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{this.state.menuMTD}</b>
                    </span>
                  </div>
                </div>
              </div>              
            </div>
{/*            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS">
                      Total Students  
                    </span>
                    <span className="subBoxTitleOS"> : {this.props.allstudentCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGreen">
                      Online Students 
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.props.onlineStudentCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGray">
                      Offline Students  
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.props.allstudentCount)-parseInt(this.props.onlineStudentCount)}</span>
                  </div>
                </div>
               
              </div>

              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
             
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS">
                      Total Franchises  
                    </span>
                    <span className="subBoxTitleOS"> : {this.props.allFranchiseCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGreen">
                      Online Franchises
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.props.onlineFranchiseCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGray">
                      Offline Franchises  
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.props.allFranchiseCount)-parseInt(this.props.onlineFranchiseCount)}</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                   { <div className="col-lg-12 col-md-12 col-sm-12">
                      <i className="fa fa-trophy compTrofy"></i>
                      <span className="subBoxTitleOSs"><span><label className="greenCol" title="This competition is started"></label> <span className="startCompNm"></span></span></span>
                    </div>}
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12 comStartText">
                    <span className="col-lg-9 col-md-9 col-sm-9 boxTitleOS boxTitleOSGray">
                      Total Students   
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {this.state.CompStudentCnt}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-">
                    <span className="col-lg-9 col-md-9 col-sm-9 boxTitleOS boxTitleOSGreen">
                      Appearing Students 
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.state.appearingStudent}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-9 col-md-9 col-sm-9 boxTitleOS boxTitleOSGray">
                      Attempted Students   
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.state.attemptedStudent)}</span>
                  </div>
                </div>
              </div>
            </div>*/}
            <div className="row">
              <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12 graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                  <h4>Gross Earning <i className="fnt12">(Last 12 months)</i></h4>
                  {/*<canvas id="myChart" width="400" height="170"></canvas>*/}
                  {this.state.dataColumnChart!=="" ?
                  <div className="newCssBar">
                  <Chart
                      chartType="ColumnChart"
                      data={this.state.dataColumnChart}
                      width="100%"
                      height="300px"
                      legendToggle
                    />
                    </div>
                    :
                    <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center bgImgWt">
                          <img src="/images/cofficLoader.gif" alt="Logo_img" height="21%" width="21%" className="imgHt"/>
                        </div>
                    </div>
                  }
                </div>
              </div> 
              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 row graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 row innerGraphWrap">
                  <h4>Subscription Details <i className="fnt12">(Last 12 months)</i></h4>
                  {/*<canvas id="myChart" width="400" height="170"></canvas>*/}
                  {this.state.pieData!=="" ?
                  <div className="col-lg-12 col-md-12 col-sm-12 newCssPie innerGraphWrap">
                      {console.log("1234",this.state.pieData)}
                      <Chart
                        chartType="PieChart"
                        data={this.state.pieData}
                        options={this.state.pieOptions}
                        graph_id="PieChart"
                        width={"100%"}
                        height={"230px"}
                        legend_toggle
                      />
                  </div>
                    :
                    <div>
                      <div className="col-lg-12 col-md-12 col-sm-12 row text-center ">
                        <img src="/images/cofficLoader.gif" alt="Logo_img" height="50%" width="50%" className="imgHt"/>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardDivider"></div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl tableClrPdg" >
                  <h4>Cafewise current check-ins and check-outs <i className="fnt12b"><Link to="/dashboard/allCafeUsersSeatBooking">(See More)</Link></i></h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl tableClrPdg" style={{padding:"0px 0px"}}>
                  <h4 style={{padding:"0px 15px"}}>Latest Active Subscriptions <i className="fnt12b"><Link to="/dashboard/salesTransactionReport">(See More)</Link></i></h4>
{/*                  <SalesTransactionReportDashB/>*/}
                </div>
              </div>              
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl tableClrPdg" style={{padding:"0px 0px"}}>
                  <h4 style={{padding:"0px 15px"}}>Cafewise Seat Booking <i className="fnt12b"><Link to="/dashboard/cafeWiseSeatBookingSummary">(See More)</Link></i></h4>
{/*                  <DashboardCWSBS />
*/}                </div>
              </div>
              {/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                <h4>Competition wise Registrations</h4>
                <canvas id="competitionRegChart" width="400" height="170"></canvas>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 boxWrapDashboardPack graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                  <div className="pckgBarChart">
                    <h4>Package wise Sale</h4>
                    <canvas id="packagePurchageChart" width="400" height="170"></canvas>
                  </div>
               </div>
              </div>*/}
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default AdminContent;