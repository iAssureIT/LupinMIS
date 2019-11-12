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

class ActivitywiseAnnualPlanReport extends Component{
  constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10000,
            "sector"            : "all",
            "sector_ID"         : "all",
            'year'              : "FY 2019 - 2020",
            "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
            "startDate"         : "",
            "endDate"           : "",
            // "sector"            : "",
            // "sector_ID"         : "",
            // "center"            : "",
            // "center_ID"         : "",
            // "dataApiUrl"        : "/api/masternotifications/list",
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
                        heading : "Source of Financial Plan 'Rs'",
                        mergedColoums : 7
                    },
                    {
                        heading : "",
                        mergedColoums : 1
                    },
                ]
            },
            "tableHeading"      : {
                "name"                                   : 'Activity & Sub Activity',
                "unit"                                   : 'Unit',
                "annualPlan_Reach"                       : 'Reach', 
                "annualPlan_FamilyUpgradation"           : "Families Upgradation",
                "annualPlan_PhysicalUnit"                : 'Physical Units', 
                "annualPlan_UnitCost"                    : 'Unit Cost "Rs"',
                "annualPlan_TotalBudget"                 : "Total Budget 'Lakh'",
                "annualPlan_LHWRF"                       : 'LHWRF',
                "annualPlan_NABARD"                      : 'NABARD',
                "annualPlan_Bank_Loan"                   : 'Bank Loan',
                "annualPlan_DirectCC"                    : 'Direct Community  Contribution',
                "annualPlan_IndirectCC"                  : 'Indirect Community  Contribution',
                "annualPlan_Govt"                        : 'Govt',
                "annualPlan_Other"                       : 'Others',
                "annualPlan_Remark"                                    : 'Remark',
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
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID);
      });
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getAvailableSectors();
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }
   
    componentWillReceiveProps(nextProps){
        this.getAvailableSectors();
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
          console.log('year', this.state.year)
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID);
          
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
            // var sector_ID = this.state.sector.split('|')[1]
            // this.setState({
            //   sector_ID        : sector_ID
            // },()=>{
            // this.getData(this.state.year, this.state.center_ID, this.state.sector_ID);
            // })
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
        });
          if(event.target.value==="all"){
            var sector_id = event.target.value;
          }else{
            var sector_id = event.target.value.split('|')[1];
          }
        // console.log('sector_id',sector_id);
        this.setState({
              sector_ID : sector_id,
            },()=>{
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
            this.getData(this.state.year, this.state.center_ID, this.state.sector_ID);
        })
    }

    getData(year, center_ID, sector_ID){   
      if(year){ 
        if(sector_ID==="all"){
          console.log("year",year);
          var startDate = year.substring(3, 7)+"-04-01";
          var endDate = year.substring(10, 15)+"-03-31";    
         
          console.log(startDate, endDate, year, center_ID, sector_ID);
          axios.get('/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/all')
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
                  annualPlan_LHWRF                          : a.annualPlan_LHWRF,
                  annualPlan_NABARD                         : a.annualPlan_NABARD,
                  annualPlan_Bank_Loan                      : a.annualPlan_Bank_Loan,
                  annualPlan_DirectCC                       : a.annualPlan_DirectCC,
                  annualPlan_IndirectCC                     : a.annualPlan_IndirectCC,
                  annualPlan_Govt                           : a.annualPlan_Govt,
                  annualPlan_Other                          : a.annualPlan_Other,
                  annualPlan_Remark                         : a.annualPlan_Remark,
                  }
          })
            this.setState({
              tableData : tableData
            },()=>{
              // console.log("resp",this.state.tableData)
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
        }else{
          console.log("year",year);
          var startDate = year.substring(3, 7)+"-04-01";
          var endDate = year.substring(10, 15)+"-03-31";    
         
          console.log(startDate, endDate, year, center_ID, sector_ID);
          axios.get('/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID)
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
                  annualPlan_LHWRF                          : a.annualPlan_LHWRF,
                  annualPlan_NABARD                         : a.annualPlan_NABARD,
                  annualPlan_Bank_Loan                      : a.annualPlan_Bank_Loan,
                  annualPlan_DirectCC                       : a.annualPlan_DirectCC,
                  annualPlan_IndirectCC                     : a.annualPlan_IndirectCC,
                  annualPlan_Govt                           : a.annualPlan_Govt,
                  annualPlan_Other                          : a.annualPlan_Other,
                  annualPlan_Remark                         : a.annualPlan_Remark,
                  }
          })
            this.setState({
              tableData : tableData
            },()=>{
              // console.log("resp",this.state.tableData)
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
    }

    currentFromDate(){
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
    }

    currentToDate(){
        if(this.state.endDate){
            var today = this.state.endDate;
            // console.log("newToDate",today);
        }else {
            var today =  moment(new Date()).format('YYYY-MM-DD');
        }
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
                            Activity wise Annual Plan Report         
                        </div>
                    </div>
                    <hr className="hr-head"/>
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
                            <option value="all" >All</option>
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
                     
                        {/*<div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
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
                        </div>*/}
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
export default ActivitywiseAnnualPlanReport