import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";

class ActivitywisePeriodicPlanReport extends Component{
	constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10000,
            "startDate"         : "",
            "endDate"           : "",
            // "sector"            : "",
            // "sector_ID"         : "",
            // "center"            : "",
            // "center_ID"         : "",
            // "dataApiUrl"        : "http://qalmisapi.iassureit.com/api/masternotifications/list",
            "twoLevelHeader"    : {
                apply           : true,
                firstHeaderData : [
                    {
                        heading : 'Activity Details',
                        mergedColoums : 3
                    },
                    {
                        heading : 'Annual Plan',
                        mergedColoums : 5
                    },
                    {
                        heading : 'Periodic Plan',
                        mergedColoums : 3
                    },
                    {
                        heading : "Source of Financial Plan 'Rs'",
                        mergedColoums : 9
                    },/*
                    {
                        heading : "",
                        mergedColoums : 1
                    },*/
                ]
            },
            "tableHeading"      : {
                "name"                                      : 'Activity & Sub Activity',
                "unit"                                      : 'Unit',
                "annualPlan_Reach"                          : 'Reach', 
                "annualPlan_FamilyUpgradation"              : "Families Upgradation",
                "annualPlan_PhysicalUnit"                   : 'Physical Units', 
                "annualPlan_UnitCost"                       : 'Unit Cost "Rs"',
                "annualPlan_TotalBudget"                    : "Total Budget 'Lakh'",
                "monthlyPlan_Reach"                         : 'Reach', 
                "monthlyPlan_PhysicalUnit"                  : 'Physical Units', 
                "monthlyPlan_TotalBudget_L"                 : "Total Budget",
                "monthlyPlan_LHWRF_L"                       : 'LHWRF',
                "monthlyPlan_NABARD_L"                      : 'NABARD',
                "monthlyPlan_Bank_Loan_L"                   : 'Bank Loan',
                "monthlyPlan_DirectCC_L"                    : 'Direct Community  Contribution',
                "monthlyPlan_IndirectCC_L"                  : 'Indirect Community  Contribution',
                "monthlyPlan_Govt_L"                        : 'Govt',
                "monthlyPlan_Other_L"                       : 'Others',/*
                "monthlyPlan_Other_L"                       : 'Remark',*/
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
        this.getAvailableSectors = this.getAvailableSectors.bind(this);
        
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
        });
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }
   
    componentWillReceiveProps(nextProps){
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
        console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
          console.log('name', this.state)
        });
    } 
    getAvailableSectors(){
        axios({
          method: 'get',
          url: '/api/sectors/list',
        }).then((response)=> {
            
            this.setState({
              availableSectors : response.data,
              sector           : response.data[0].sector+'|'+response.data[0]._id
            },()=>{
            var sector_ID = this.state.sector.split('|')[1]
            this.setState({
              sector_ID        : sector_ID
            },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
            })
            // console.log('sector', this.state.sector);
          })
        }).catch(function (error) {
            // console.log("error = ",error);
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
        });
        var sector_id = event.target.value.split('|')[1];
        // console.log('sector_id',sector_id);
        this.setState({
              sector_ID : sector_id,
            },()=>{
            // console.log('availableSectors', this.state.availableSectors);
            // console.log('sector_ID', this.state.sector_ID);
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
        })
    }

    getData(startDate, endDate, center_ID, sector_ID){        
        console.log(startDate, endDate, center_ID, sector_ID);
        // axios.get('http://qalmisapi.iassureit.com/api/report/periodic_activity/'+startDate+'/'+endDate+'/'+sector_ID+'/'+center_ID)
        axios.get('http://qalmisapi.iassureit.com/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID)
        .then((response)=>{
          console.log("resp",response);
            var tableData = response.data.map((a, i)=>{
                return {
                _id                                       : a._id,            
                name                                      : a.name,
                unit                                      : a.unit,
                annualPlan_Reach                          : a.annualPlan_Reach,
                annualPlan_FamilyUpgradation              : a.annualPlan_FamilyUpgradation,
                annualPlan_PhysicalUnit                   : a.annualPlan_PhysicalUnit,
                annualPlan_UnitCost                       : a.annualPlan_UnitCost,
                annualPlan_TotalBudget                    : a.annualPlan_TotalBudget,
                monthlyPlan_Reach                         : a.monthlyPlan_Reach,
                monthlyPlan_PhysicalUnit                  : a.monthlyPlan_PhysicalUnit,
                monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,
                monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                // monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
            }
        })
          this.setState({
            tableData : tableData
          },()=>{
            // console.log("resp",this.state.tableData)
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
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
        // var dd = today.getDate();
        // var mm = today.getMonth()+1; //January is 0!
        // var yyyy = today.getFullYear();
        // if(dd<10){
        //     dd='0'+dd;
        // }
        // if(mm<10){
        //     mm='0'+mm;
        // }
        // var today = yyyy+'-'+mm+'-'+dd;
        // var today = yyyy+'-'+mm+'-'+dd;

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
        // var dd = today.getDate();
        // var mm = today.getMonth()+1; //January is 0!
        // var yyyy = today.getFullYear();
        // if(dd<10){
        //     dd='0'+dd;
        // }
        // if(mm<10){
        //     mm='0'+mm;
        // }
        // var today = yyyy+'-'+mm+'-'+dd;
        // var today = yyyy+'-'+mm+'-'+dd;
        // console.log("nowto",today)
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
                                        Activity wise Periodic Plan Report              
                                    </div>
                                </div>
                                <hr className="hr-head"/>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                                  <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                    <label className="formLable">Sector</label><span className="asterix">*</span>
                                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                      <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                                        <option  className="hidden" >--Select Sector--</option>
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
                                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                        <label className="formLable">From</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                        <label className="formLable">To</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                        </div>
                                    </div>
                                </div>  
                                <div className="marginTop11">
                                    <div className="">
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
                                   {/*   {
                                        <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading}  year={this.state.year} center={this.state.center} sector={this.state.sector} tableDatas={this.state.tableDatas} />  
                                      }*/}
                                       {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="sales-report-main-class">
                                                <div className="reports-select-date-boxmain">
                                                    <div className="reports-select-date-boxsec">
                                                        
                                                            <div className="reports-select-date-from1">
                                                                <div className="reports-select-date-from2">
                                                                    From
                                                                </div>
                                                                <div className="reports-select-date-from3">
                                                                    <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="reportsDateRef form-control" placeholder=""  />
                                                                </div>
                                                            </div>
                                                            <div className="reports-select-date-to1">
                                                                <div className="reports-select-date-to2">
                                                                    To
                                                                </div>
                                                                <div className="reports-select-date-to3">
                                                                    <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="reportsDateRef form-control" placeholder=""   />
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>                           
                                            </div>
                                        </div>*/}
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
export default ActivitywisePeriodicPlanReport