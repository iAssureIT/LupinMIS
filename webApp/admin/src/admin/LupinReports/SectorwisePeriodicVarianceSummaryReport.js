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
class SectorwiseAnnualCompletionSummaryReport extends Component{
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
        // "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 2
                },
                {
                    heading : 'Budget Plan',
                    mergedColoums : 2
                },
                {
                    heading : "Source of Financial Plan (Periodic) 'Lakh'",
                    mergedColoums : 7
                },
                {
                    heading : "Periodic Achievements",
                    mergedColoums : 2
                },
                {
                    heading : "Source of Financial Achievement (Periodic) 'Lakh'",
                    mergedColoums : 7
                },
                {
                    heading : "",
                    mergedColoums : 1
                },
                {
                    heading : "Source wise Financial Variance Report (Periodic) 'Lakh'",
                    mergedColoums : 7
                },
            ]
        },
        "tableHeading"      : {
            // "SrNo"          : 'Sr No',
            "name"                             : 'Sector',
            "annualPlan_TotalBudget_L"           : "Annual Budget Plan 'Lakh'",
            "monthlyPlan_TotalBudget_L"          : 'Periodic Budget plan "Lakh"', 
            "monthlyPlan_LHWRF_L"                : 'LHWRF',
            "monthlyPlan_NABARD_L"               : 'NABARD',
            "monthlyPlan_Bank_Loan_L"            : 'Bank Loan',
            "monthlyPlan_DirectCC_L"             : 'Direct Community  Contribution',
            "monthlyPlan_IndirectCC_L"           : 'Indirect Community  Contribution',
            "monthlyPlan_Govt_L"                 : 'Govt',
            "monthlyPlan_Other_L"                : 'Others',
            "achievement_TotalBudget_L"          : 'Financial', 
            "Per_Annual"                         : '% Achievement',
            "achievement_LHWRF_L"                : 'LHWRF',
            "achievement_NABARD_L"               : 'NABARD',
            "achievement_Bank_Loan_L"            : 'Bank Loan',
            "achievement_DirectCC_L"             : 'Direct Community  Contribution',
            "achievement_IndirectCC_L"           : 'Indirect Community  Contribution',
            "achievement_Govt_L"                 : 'Govt',
            "achievement_Other_L"                : 'Others',
            "variance_monthlyPlan_TotalBudget_L" : 'Financial Variance (Periodic)',
            "variance_monthlyPlan_LHWRF_L"       : 'LHWRF',
            "variance_monthlyPlan_NABARD_L"      : 'NABARD',
            "variance_monthlyPlan_Bank_Loan_L"   : 'Bank Loan',
            "variance_monthlyPlan_DirectCC_L"    : 'Direct Community  Contribution',
            "variance_monthlyPlan_IndirectCC_L"  : 'Indirect Community  Contribution',
            "variance_monthlyPlan_Govt_L"        : 'Govt',
            "variance_monthlyPlan_Other_L"       : 'Others',           
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
    getData(startDate, endDate,center_ID){
        console.log(startDate, endDate, center_ID);
        // axios.get('http://qalmisapi.iassureit.com/api/report/periodic_sector/'+startDate+'/'+endDate+'/'+center_ID)
        axios.get('http://qalmisapi.iassureit.com/api/report/sector/'+startDate+'/'+endDate+'/'+center_ID)
        .then((response)=>{
          console.log("resp",response);
          var tableData = response.data.map((a, i)=>{
            return {
                _id                                       : a._id,            
                name                                      : a.name,
                annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,                
                monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                achievement_TotalBudget_L                 : a.achievement_TotalBudget_L,
                Per_Annual                                : a.Per_Annual,
                achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                achievement_NABARD_L                      : a.achievement_NABARD_L,
                achievement_Bank_Loan_L                   : a.achievement_Bank_Loan_L,
                achievement_DirectCC_L                    : a.achievement_DirectCC_L,
                achievement_IndirectCC_L                  : a.achievement_IndirectCC_L,
                achievement_Govt_L                        : a.achievement_Govt_L,
                achievement_Other_L                       : a.achievement_Other_L,
                variance_monthlyPlan_TotalBudget_L        : a.variance_monthlyPlan_TotalBudget_L,
                variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                variance_monthlyPlan_IndirectCC_L         : a.variance_monthlyPlan_IndirectCC_L,
                variance_monthlyPlan_Govt_L               : a.variance_monthlyPlan_Govt_L,
                variance_monthlyPlan_Other_L              : a.variance_monthlyPlan_Other_L
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
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <hr className="hr-map"/>
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                        Sector wise Periodic Variance Summary Report                   
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12">
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
    );
  }
}
export default SectorwiseAnnualCompletionSummaryReport