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
        "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : "",
                    mergedColoums : 1
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
            "Activity_SubActivity"          : 'Sector',
            "AnnualPlan_Total_Budget"       : "Annual Budget Plan 'Lakh'",
            "PeriodicPlan_Total_Budget"     : 'Periodic Budget plan "Lakh"', 
            "PeriodicPlan_LHWRF"            : 'LHWRF',
            "PeriodicPlan_NABARD"           : 'NABARD',
            "PeriodicPlan_Bank_Loan"        : 'Bank Loan',
            "PeriodicPlan_DirectCC"         : 'Direct Community  Contribution',
            "PeriodicPlan_Indirect"         : 'Indirect Community  Contribution',
            "PeriodicPlan_govtscheme"       : 'Govt',
            "PeriodicPlan_other"            : 'Others',
            "PeriodicAchv_Physical_unit"    : 'Financial', 
            "PeriodicAchv_Total_Budget"     : '% Achievement',
            "PeriodicAchv_LHWRF"            : 'LHWRF',
            "PeriodicAchv_NABARD"           : 'NABARD',
            "PeriodicAchv_Bank_Loan"        : 'Bank Loan',
            "PeriodicAchv_DirectCC"         : 'Direct Community  Contribution',
            "PeriodicAchv_Indirect"         : 'Indirect Community  Contribution',
            "PeriodicAchv_govtscheme"       : 'Govt',
            "PeriodicAchv_other"            : 'Others',
            "Variance_Total_Budget"         : 'Financial Variance (Periodic)',
            "Variance_LHWRF"                : 'LHWRF',
            "Variance_NABARD"               : 'NABARD',
            "Variance_Bank_Loan"            : 'Bank Loan',
            "Variance_DirectCC"             : 'Direct Community  Contribution',
            "Variance_Indirect"             : 'Indirect Community  Contribution',
            "Variance_govtscheme"           : 'Govt',
            "Variance_other"                : 'Others',

           
        },
    }/*Sector Annual Budget Plan 'Lakh' Periodic Budget plan 'Lakh' Source of Financial Plan (Periodic) 'Lakh'              Periodic Achievements   Source of Financial Achievement (Periodic) 'Lakh'             Financial Variance (Periodic) Source wise Financial Variance Report (Periodic) 'Lakh'               
      LHWRF NABARD  Bank loan   Community Contribution    Govt  Others  " Financial
" % Achievement LHWRF NABARD  Bank  Loan  Community  Contribution   Govt. Others    LHWRF NABARD  Bank loan   Community  Contribution   Govt. Others    
            Direct  Indirect                Direct  Indirect              Direct  Indirect        */
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
        axios.get('http://qalmisapi.iassureit.com/api/report/periodic_sector/'+startDate+'/'+endDate+'/'+center_ID)
        .then((response)=>{
          console.log("resp",response);
          var tableData = response.data.map((a, i)=>{
            return {
                _id                         : a._id,            
                Activity_SubActivity        : a.Activity_SubActivity,
                AnnualPlan_Total_Budget     : a.AnnualPlan_Total_Budget,
                PeriodicPlan_Total_Budget   : a.PeriodicPlan_Total_Budget,                
                PeriodicPlan_LHWRF          : a.PeriodicPlan_LHWRF,
                PeriodicPlan_NABARD         : a.PeriodicPlan_NABARD,
                PeriodicPlan_Bank_Loan      : a.PeriodicPlan_Bank_Loan,
                PeriodicPlan_DirectCC       : a.PeriodicPlan_DirectCC,
                PeriodicPlan_Indirect       : a.PeriodicPlan_Indirect,
                PeriodicPlan_govtscheme     : a.PeriodicPlan_govtscheme,
                PeriodicPlan_other          : a.PeriodicPlan_other,
                PeriodicAchv_Physical_unit  : a.PeriodicAchv_Physical_unit,
                PeriodicAchv_Total_Budget   : a.PeriodicAchv_Total_Budget,
                PeriodicAchv_LHWRF          : a.PeriodicAchv_LHWRF,
                PeriodicAchv_NABARD         : a.PeriodicAchv_NABARD,
                PeriodicAchv_Bank_Loan      : a.PeriodicAchv_Bank_Loan,
                PeriodicAchv_DirectCC       : a.PeriodicAchv_DirectCC,
                PeriodicAchv_Indirect       : a.PeriodicAchv_Indirect,
                PeriodicAchv_govtscheme     : a.PeriodicAchv_govtscheme,
                PeriodicAchv_other          : a.PeriodicAchv_other,
                Variance_Total_Budget       : a.Variance_Total_Budget,
                Variance_LHWRF              : a.Variance_LHWRF,
                Variance_NABARD             : a.Variance_NABARD,
                Variance_Bank_Loan          : a.Variance_Bank_Loan,
                Variance_DirectCC           : a.Variance_DirectCC,
                Variance_Indirect           : a.Variance_Indirect,
                Variance_govtscheme         : a.Variance_govtscheme,
                Variance_other              : a.Variance_other
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
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
            <hr className="hr-map"/>
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                Sector wise Periodic Variance Summary Report                   
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
                <label className="formLable">Sector</label><span className="asterix"></span>
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
           {/*   {
                <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading}  year={this.state.year} center={this.state.center} sector={this.state.sector} tableDatas={this.state.tableDatas} />  
              }*/}
             {/*   <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="">From</div>
                        <div className="">
                            <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="reportsDateRef form-control" placeholder=""  />
                        </div>
                    </div>
                    <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="">To</div>
                        <div className="">
                            <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="reportsDateRef form-control" placeholder=""   />
                        </div>
                    </div>
                </div>*/}

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
    );
  }
}
export default SectorwiseAnnualCompletionSummaryReport