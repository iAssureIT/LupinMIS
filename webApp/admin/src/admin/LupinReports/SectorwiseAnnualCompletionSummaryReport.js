import React, { Component }                                  from 'react';
import $                                                     from 'jquery';
import axios                                                 from 'axios';
import { Link }                                              from 'react-router-dom'
import DailyReport                                           from '../Reports/DailyReport.js';
import WeeklyReport                                          from '../Reports/WeeklyReport.js';
import MonthlyReport                                         from '../Reports/MonthlyReport.js';
import SectorwiseAnnualCompletionSummaryYearlyReport         from '../Reports/SectorwiseAnnualCompletionSummaryYearlyReport.js';
import CustomisedReport                                      from '../Reports/CustomisedReport.js';
import "../Reports/Reports.css";
/*Sector  Annual Plan     Annual Achievement        Source of Financial Achievement               Remarks
   Total Budget Outreach  Family Upgradation plan Outreach   Families Upgraded  " Financial
Total " % to Annual Plan  LHWRF NABARD  Bank  Loan  Community  Contribution   Govt. Others  
                      Direct  Indirect      */
class SectorwiseAnnualCompletionSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        'year'              : "FY 2019 - 2020",
        'center'            : "",
        'sector'            : "",
         "years"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],      
        "startRange"        : 0,
        "limitRange"        : 10,
        "dataApiUrl"        : "http://qalmisadmin.iassureit.com/api/masternotifications/list",

        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 2
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 3
                },
                {
                    heading : "Annual Achievement",
                    mergedColoums : 4
                },
                {
                    heading : "Source OF Financial Achievement",
                    mergedColoums : 7
                },
               /* {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "name"                              : 'Sector',
            "annualPlan_TotalBudget"            : "Total Budget",
            "annualPlan_Reach"                  : 'OutReach', 
            "annualPlan_FamilyUpgradation"      : 'Family Upgradation', 
            "achievement_Reach"                 : 'OutReach', 
            "achievement_FamilyUpgradation"     : 'Families Upgraded', 
            "achievement_TotalBudget"           : 'Financial Total', 
            "Per_Annual"                        : '% to Annual Plan',
            "achievement_LHWRF"                 : 'LHWRF',
            "achievement_NABARD"                : 'NABARD',
            "achievement_Bank_Loan"             : 'Bank Loan',
            "achievement_DirectCC"              : 'Direct Community  Contribution',
            "achievement_IndirectCC"            : 'Indirect Community  Contribution',
            "achievement_Govt"                  : 'Govt',
            "achievement_Other"                 : 'Others',/*
            "aaaa"                             : 'Remarks',   */        
        },
    }
    window.scrollTo(0, 0);
  }
  componentDidMount(){
    this.getAvailableCenters();
    this.getData();
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableCenters();
  }
  handleChange(event){
    event.preventDefault();

    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      console.log('name', this.state)
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      this.setState({
        availableCenters : response.data,
        center           : response.data[0].centerName+'|'+response.data[0]._id
      },()=>{
        // console.log('availableCenters', this.state.availableCenters);
        console.log('center', this.state.center);
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  } 
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      var center = this.state.selectedCenter.split('|')[1];
      console.log('center', center);
      this.setState({
        // center :center,
        
      })
    });
  } 
 

  getData(year, center_ID){
    if(year, center_ID){
      axios.get('/api/report/sector/:startDate/:endDate/:center_ID')
      .then((response)=>{
        console.log("resp",response);
        this.setState({
          tableDatas : response.data
        },()=>{
          console.log("resp",this.state.tableDatas)
        })
      })
      .catch(function(error){        
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
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
        <div className="row">
          <hr className="hr-map"/>
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
            <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
              Sector Wise Annual Completion Summary Report                   
            </div>
           {/* <div className="col-lg-1 col-lg-offset-5 col-md-12 col-xs-12 col-sm-12 backBtn">
              <Link to="/report">Back to Reports</Link>                 
            </div>*/}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <label className="formLable">Center</label><span className="asterix"></span>
              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                  <option className="hidden" >-- Select --</option>
                  {
                    this.state.availableCenters && this.state.availableCenters.length >0 ?
                    this.state.availableCenters.map((data, index)=>{
                      return(
                        <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                      );
                    })
                    :
                    null
                  }
                </select>
              </div>
              {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
            </div>
            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
          </div>  
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
          {
            <SectorwiseAnnualCompletionSummaryYearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} year={this.state.year} center={this.state.center} tableDatas={this.state.tableDatas}/> 
          }
            
          </div>        
        </div>
      </div>
    );
  }
}
export default SectorwiseAnnualCompletionSummaryReport