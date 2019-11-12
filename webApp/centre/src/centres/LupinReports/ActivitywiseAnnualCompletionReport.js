import React, { Component }                        from 'react';
import swal                                        from 'sweetalert';
import $                                           from 'jquery';
import axios                                       from 'axios';
import { Link }                                    from 'react-router-dom'
import DailyReport                                 from '../Reports/DailyReport.js';
import WeeklyReport                                from '../Reports/WeeklyReport.js';
import MonthlyReport                               from '../Reports/MonthlyReport.js';
import CustomisedReport                            from '../Reports/CustomisedReport.js';
import ActivitywiseAnnualCompletionYearlyReport    from '../Reports/ActivitywiseAnnualCompletionYearlyReport.js';
import "../Reports/Reports.css";

class ActivitywiseAnnualCompletionReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        'center'            : "all",
        'sector'            : "all",
        'year'              : "FY 2019 - 2020",
         "years"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
      
        "startRange"        : 0,
        "limitRange"        : 10000,
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Activity Details',
                    mergedColoums : 3
                },
                // {
                //     heading : 'Annual Plan',
                //     mergedColoums : 4
                // },
                {
                    heading : "Annual Financial Achievement 'Lakh'",
                    mergedColoums : 4
                },
                {
                    heading : "Source OF Financial Achievement",
                    mergedColoums : 7
                },
           /*     {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "name"                          : 'Activity & Sub Activity',
            "unit"                          : 'Unit',
            // "annualPlan_Reach"              : 'Reach', 
            // "annualPlan_FamilyUpgradation"  : 'Families Upgradation', 
            // "annualPlan_PhysicalUnit"       : 'Physical Units', 
            // "annualPlan_TotalBudget"        : "Total Budget 'Rs'",
            "achievement_Reach"             : 'Reach', 
            "achievement_FamilyUpgradation" : 'Families Upgradation', 
            "achievement_PhysicalUnit"      : 'Physical Units', 
            "achievement_TotalBudget_L"     : "Total Expenditure 'Rs'",
            "achievement_LHWRF"             : 'LHWRF',
            "achievement_NABARD"            : 'NABARD',
            "achievement_Bank_Loan"         : 'Bank Loan',
            "achievement_DirectCC"          : 'Direct Community  Contribution',
            "achievement_IndirectCC"        : 'Indirect Community  Contribution',
            "achievement_Govt"              : 'Govt',
            "achievement_Other"             : 'Others',
            // "yiyi"                          : 'Remarks',
        },
      "tableObjects"        : {
        paginationApply     : false,
        searchApply         : false,
      },   

    }
    window.scrollTo(0, 0);
  }

  componentDidMount(){
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.center_ID)
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    this.getData();
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableSectors();
  }
  handleChange(event){
    event.preventDefault();

    this.setState({
      [event.target.name] : event.target.value
    },()=>{
    this.getData(this.state.center_ID)
      // console.log('name', this.state)
    });
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data,
          // sector           : response.data[0].sector+'|'+response.data[0]._id
        },()=>{
        // console.log('availableSectors', this.state.availableSectors);
        // console.log('sector', this.state.sector);
      })
    }).catch(function (error) {
        console.log("error = ",error);
        if(error.message === "Request failed with status code 401"){
          swal({
              title : "abc",
              text  : "Session is Expired. Kindly Sign In again."
          });
        }
      });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({
      [event.target.name]:event.target.value
    },()=>{
    this.getData(this.state.center_ID)
      // console.log('name', this.state)
    });
    // var sector_id = event.target.value.split('|')[1];
    // console.log('sector_id',sector_id);
  }

  getData(year, center_ID, sector_ID){
  /*
    var startDate = year.substring(3, 7)+"-04-01";
    var endDate = year.substring(10, 15)+"-03-31";*/
    // axios.get('/api/report/annual_completion/:year/:center_ID/:sector_ID')
    if(year, center_ID, sector_ID){
      axios.get('/api/report/activity/:startDate/:endDate/:center_ID/:sector_ID')
      .then((response)=>{
        console.log("resp",response);
        this.setState({
          tableDatas : response.data
        },()=>{
          console.log("resp",this.state.tableDatas)
        })
      })
      .catch(function(error){
        console.log("error = ",error);
        if(error.message === "Request failed with status code 401"){
          swal({
              title : "abc",
              text  : "Session is Expired. Kindly Sign In again."
          });
        }
      });
    }
  } 

  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');
    this.setState({
      'currentTabView': currentComp,
    })
  }
  render(){
    return(
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="formWrapper"> 
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact ">
                    <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                      Activity wise Annual Completion Report                  
                    </div>
                   {/* <div className="col-lg-1 col-lg-offset-5 col-md-12 col-xs-12 col-sm-12 backBtn">
                      <Link to="/report">Back to Reports</Link>                 
                    </div>*/}
                  </div>
                    <hr className="hr-head "/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <label className="formLable">Year</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                          <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                           <option className="hidden" >-- Select Year --</option>
                           {
                            this.state.years.map((data, i)=>{
                              return <option key={i}>{data}</option>
                            })
                           }
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                      </div>  
                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable">Sector</label><span className="asterix">*</span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                            <option  className="hidden" >--Select Sector--</option>
                            <option value="all">All</option>
                            {
                            this.state.availableSectors && this.state.availableSectors.length >0 ?
                            this.state.availableSectors.map((data, index)=>{
                              return(
                                <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                              );
                            })
                            :
                            null
                          }
                          </select>
                        </div>
                       {/* <div className="errorMsg">{this.state.errors.sector}</div>*/}
                      </div>
                    </div>  
                  </div>  
                 
                  <div className="">          
                    {
                      /*this.state.currentTabView === "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> :
                      this.state.currentTabView === "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
                      this.state.currentTabView === "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : */

                      <ActivitywiseAnnualCompletionYearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} year={this.state.year} sector={this.state.sector} tableDatas={this.state.tableDatas}/> 
                    }                   
                  </div>
                </div>
            </section>
          </div>
        </div>
      </div>
               
             
    );
  }
}
export default ActivitywiseAnnualCompletionReport