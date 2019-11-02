import React, { Component } from 'react';
import $                    from 'jquery';
import swal                 from 'sweetalert';
import axios                from 'axios';
import moment               from 'moment';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";
class ADPReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        // "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'ADP Goal',
                    mergedColoums : 2
                }, 
                {
                    heading : 'Details of Activity contributing ADP',
                    mergedColoums : 5
                },
                {
                    heading : 'Financial Sharing "Rs"',
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : {
            "goalName"        : 'ADP Indicator',
            "activityName"    : 'Activity',
            "unit"            : 'Unit',
            "Quantity"        : 'Quantity',
            "Amount"          : 'Amount',
            "Beneficiaries"   : 'Beneficiaries',
            "LHWRF"           : 'LHWRF',
            "NABARD"          : 'NABARD',
            "Govt"            : 'Govt',
            "Bank"            : 'Bank Loan',
            "Community"       : 'Community',
            "Other"           : 'Other',
        },
        "tableObjects"        : {
            paginationApply     : false,
            searchApply         : false,
        },   
    }
    window.scrollTo(0, 0); 
    this.handleFromChange    = this.handleFromChange.bind(this);
    this.handleToChange      = this.handleToChange.bind(this);
    this.currentFromDate     = this.currentFromDate.bind(this);
    this.currentToDate       = this.currentToDate.bind(this);
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
        // console.log("center_ID =",this.state.center_ID);
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
        });
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.currentFromDate();
        this.currentToDate();
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID)
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }   
    componentWillReceiveProps(nextProps){
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
          console.log('name', this.state)
        });
    }
   
    getData(startDate, endDate,center_ID, goal){
        console.log(startDate, endDate, center_ID);
        axios.get('http://qalmisapi.iassureit.com/api/report/goal/'+startDate+'/'+endDate+'/'+center_ID+'/'+ "ADP Goal")
        .then((response)=>{
          console.log("resp",response);
          var tableData = response.data.map((a, i)=>{
            return {
                _id             : a._id,            
                goalName        : a.goalName,
                activityName    : a.activityName,
                unit            : a.unit,
                Quantity        : a.Quantity,
                Amount          : a.Amount,
                Beneficiaries   : a.Beneficiaries,
                LHWRF           : a.LHWRF,
                NABARD          : a.NABARD,
                Govt            : a.Govt,
                Bank            : a.Bank,
                Community       : a.Community,
                Other           : a.Other,
            }
        })  
          this.setState({
            tableData : tableData
          },()=>{
            console.log("resp",this.state.tableData)
          })
        })
        .catch(function(error){
            // console.log("error = ",error);
            if(error.message === "Request failed with status code 401"){
              swal({
                  title : "abc",
                  text  : "Session is Expired. Kindly Sign In again."
              });
            }
        });
    }
    handleFromChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;
       var dateVal = event.target.value;
       var dateUpdate = new Date(dateVal);
       var startDate = moment(dateUpdate).format('YYYY-MM-DD');
       this.setState({
           [name] : event.target.value,
           startDate:startDate
       },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
       console.log("dateUpdate",this.state.startDate);
       });
       // localStorage.setItem('newFromDate',dateUpdate);
    }
    handleToChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var endDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           endDate : endDate
        },()=>{
        console.log("dateUpdate",this.state.endDate);
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
       });
       // localStorage.setItem('newToDate',dateUpdate);
    }

    currentFromDate(){
       /* if(localStorage.getItem('newFromDate')){
            var today = localStorage.getItem('newFromDate');
            console.log("localStoragetoday",today);
        }*/
        if(this.state.startDate){
            var today = this.state.startDate;
            // console.log("localStoragetoday",today);
        }else {
            var today = moment(new Date()).format('YYYY-MM-DD');
        // console.log("today",today);
        }
        console.log("nowfrom",today)
        this.setState({
           startDate :today
        },()=>{
        });
        return today;
        // this.handleFromChange()
    }

    currentToDate(){
        if(this.state.endDate){
            var today = this.state.endDate;
            // console.log("newToDate",today);
        }else {
            var today =  moment(new Date()).format('YYYY-MM-DD');
        }
        this.setState({
           endDate :today
        },()=>{
        });
        return today;
        // this.handleToChange();
    }
    getSearchText(searchText, startRange, limitRange){
        console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
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
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                                     ADP Report
                                  </div>
                              </div>
                                  <hr className="hr-head"/>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                                  <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                      <label className="formLable">From</label><span className="asterix"></span>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                          <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                      </div>
                                  </div>
                                  <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                      <label className="formLable">To</label><span className="asterix"></span>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                          <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                      </div>
                                  </div>  
                              </div>  
                              <div className="marginTop11">
                                  <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <IAssureTable 
                                          completeDataCount={this.state.tableDatas.length}
                                          twoLevelHeader={this.state.twoLevelHeader} 
                                          editId={this.state.editSubId} 
                                          getData={this.getData.bind(this)} 
                                          tableHeading={this.state.tableHeading} 
                                          tableData={this.state.tableData} 
                                          tableObjects={this.state.tableObjects}
                                          getSearchText={this.getSearchText.bind(this)}/>
                                  </div>
                              </div>  
                          </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
  }
}
export default ADPReport