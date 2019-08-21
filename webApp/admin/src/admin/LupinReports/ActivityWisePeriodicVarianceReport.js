import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";

class ActivityWisePeriodicVarianceReport extends Component{
	constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10,
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
                        mergedColoums : 2
                    },
                    {
                        heading : "Source of Financial Periodic Plan (Physical & Financial 'Lakh')",
                        mergedColoums : 9
                    },
                    {
                        heading : "Source wise Financial Periodic Achievements",
                        mergedColoums : 9
                    },
                    {
                        heading : "Agency wise Variance Periodic Report 'Lakh'",
                        mergedColoums : 9
                    },
                ]
            },
            "tableHeading"      : {
                "activity_subActivity"                      : 'Activity & Sub Activity',
                "unit"                                      : 'Unit',
                "annualPlan_physicalUnit"                   : 'Physical Units', 
                "annualPlan_totalBudget_L"                  : "Total Budget 'Lakh'",
                "monthlyPlan_physicalUnit"                  : 'Physical Units', 
                "monthlyPlan_familyUpgrade"                 : "Total Budget 'Lakh'",
                "monthlyPlan_LHWRF_L"                       : 'LHWRF',
                "monthlyPlan_NABARD_L"                      : 'NABARD',
                "monthlyPlan_Bank_Loan_L"                   : 'Bank Loan',
                "monthlyPlan_DirectCC_L"                    : 'Direct Community  Contribution',
                "monthlyPlan_Indirect_L"                    : 'Indirect Community  Contribution',
                "monthlyPlan_govtscheme_L"                  : 'Govt',
                "monthlyPlan_other_L"                       : 'Others',
                "achievement_physcialUnit"                  : 'Physical Units', 
                "achievement_totalExp_L"                    : "Financal Total",
                "achievement_LHWRF_L"                       : 'LHWRF',
                "achievement_NABARD_L"                      : 'NABARD',
                "achievement_BankLoan_L"                    : 'Bank Loan',
                "achievement_Direct_L"                      : 'Direct Community  Contribution',
                "achievement_Indirect_L"                    : 'Indirect Community  Contribution',
                "achievement_Govt_L"                        : 'Govt',
                "achievement_Other_L"                       : 'Others',
                "variance_monthlyPlan_physicalUnit"         : 'Physical Units', 
                "variance_monthlyPlan_totalBudget_L"        : "Financial Total",
                "variance_monthlyPlan_LHWRF_L"              : 'LHWRF',
                "variance_monthlyPlan_NABARD_L"             : 'NABARD',
                "variance_monthlyPlan_Bank_Loan_L"          : 'Bank Loan',
                "variance_monthlyPlan_DirectCC_L"           : 'Direct Community  Contribution',
                "variance_monthlyPlan_Indirect_L"           : 'Indirect Community  Contribution',
                "variance_monthlyPlan_govtscheme_l"         : 'Govt',
                "variance_monthlyPlan_other_L"              : 'Others',
            },
        }
        window.scrollTo(0, 0);
        this.handleFromChange    = this.handleFromChange.bind(this);
        this.handleToChange      = this.handleToChange.bind(this);
        this.currentFromDate     = this.currentFromDate.bind(this);
        this.currentToDate       = this.currentToDate.bind(this);
        this.getAvailableCenters = this.getAvailableCenters.bind(this);
        this.getAvailableSectors = this.getAvailableSectors.bind(this);
        
    }

    componentDidMount(){
        this.getAvailableCenters();
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
        this.getAvailableCenters();
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
    getAvailableCenters(){
        axios({
          method: 'get',
          url: '/api/centers/list',
        }).then((response)=> {
          this.setState({
            availableCenters : response.data,
            center           : response.data[0].centerName+'|'+response.data[0]._id
          },()=>{
            // console.log('center', this.state.center);
            var center_ID = this.state.center.split('|')[1];
            this.setState({
              center_ID        : center_ID
            },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
            })
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
            center_ID :center,            
          },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
          })
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
          console.log('error', error);
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
                activity_subActivity                      : a.activity_subActivity,
                unit                                      : a.unit,
                annualPlan_physicalUnit                   : a.annualPlan_physicalUnit,
                annualPlan_totalBudget_L                  : a.annualPlan_totalBudget_L,
                monthlyPlan_physicalUnit                  : a.monthlyPlan_physicalUnit,
                monthlyPlan_familyUpgrade                 : a.monthlyPlan_familyUpgrade,
                monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                monthlyPlan_Indirect_L                    : a.monthlyPlan_Indirect_L,
                monthlyPlan_govtscheme_L                  : a.monthlyPlan_govtscheme_L,
                monthlyPlan_other_L                       : a.monthlyPlan_other_L,
                achievement_physcialUnit                  : a.achievement_physcialUnit,
                achievement_totalExp_L                    : a.achievement_totalExp_L,
                achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                achievement_NABARD_L                      : a.achievement_NABARD_L,
                achievement_BankLoan_L                    : a.achievement_BankLoan_L,
                achievement_Direct_L                      : a.achievement_Direct_L,
                achievement_Indirect_L                    : a.achievement_Indirect_L,
                achievement_Govt_L                        : a.achievement_Govt_L,
                achievement_Other_L                       : a.achievement_Other_L,
                variance_monthlyPlan_physicalUnit         : a.variance_monthlyPlan_physicalUnit,
                variance_monthlyPlan_totalBudget_L        : a.variance_monthlyPlan_totalBudget_L,
                variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                variance_monthlyPlan_Indirect_L           : a.variance_monthlyPlan_Indirect_L,
                variance_monthlyPlan_govtscheme_l         : a.variance_monthlyPlan_govtscheme_l,
                variance_monthlyPlan_other_L              : a.variance_monthlyPlan_other_L
            }
        })
          this.setState({
            tableData : tableData
          },()=>{
            console.log("resp",this.state.tableData)
          })
        })
        .catch(function(error){        
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
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
            <div className="row">
                <hr className="hr-map"/>
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                        Activity wise Periodic Variance Report (Physical & Financial)                   
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                  <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12">
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
                  <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
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
                    <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable">From</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                        </div>
                    </div>
                    <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
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
    );
  }
}
export default ActivityWisePeriodicVarianceReport