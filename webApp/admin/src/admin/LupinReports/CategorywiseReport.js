import React, { Component } from 'react';
import $                    from 'jquery';
import axios                  from 'axios';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import "../Reports/Reports.css";
class CategorywiseReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10,
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
                    heading : 'No of Families',
                    mergedColoums : 2
                },        
            ]
        },
        "tableHeading"      : {
            "abcs"    : 'Family Category',
            "dgfg"    : 'Reached',
            "ghgh"    : 'Upgraded',
        
        },
    }
        window.scrollTo(0, 0);
  }/*Sr.  Family Category No of Families  
No.   Reached Upgraded*/
  componentDidMount(){
    this.getState();
    this.getAvailableCenters();
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
        
        this.setState({
          availableCenters : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }   
  getState(){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/states/get/list/IN',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofStates : response.data
        },()=>{
        // console.log('listofStates', this.state.listofStates);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectState(event){
    event.preventDefault();
    var selectedState = event.target.value;
    this.setState({
      state : selectedState,
    },()=>{
      var stateCode = this.state.state.split('|')[1];
      // console.log('state', stateCode);
      this.setState({
        stateCode :stateCode
      },()=>{
      console.log('stateCode',this.state.stateCode);
      this.getDistrict(this.state.stateCode);
      })
    });
    this.handleChange(event);
  }
  getDistrict(stateCode){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/districts/get/list/MH/IN',
      // url: 'http://locationapi.iassureit.com/api/districts/get/list/'+stateCode+'/IN',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofDistrict : response.data
        },()=>{
        console.log('listofDistrict', this.state.listofDistrict);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      var selectedDistrict = this.state.district.split('|')[0];
      console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      console.log('selectedDistrict',this.state.selectedDistrict);
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
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
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
            <hr className="hr-map"/>
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
              Category wise Report                    
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
              <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                  <label className="formLable">Center</label><span className="asterix"></span>
                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                    <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center }  /*onChange={this.handleChange.bind(this)} */>
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
                <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12  ">
                  <label className="formLable">State</label><span className="asterix"></span>
                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                    <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.selectState.bind(this)} >
                      <option  className="hidden" value="">--Select--</option> 
                      {
                        this.state.listofStates ?
                        this.state.listofStates.map((data, index)=>{
                          return(
                            <option key={index} value={data.stateName+'|'+data.stateCode}>{data.stateName}</option> 
                          );
                        })
                        :
                        null
                      }
                    </select>
                  </div>
                 {/* <div className="errorMsg">{this.state.errors.state}</div>*/}
                </div>                      
                <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                  <label className="formLable">District</label><span className="asterix"></span>
                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                    <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                      <option  className="hidden" >-- Select --</option>
                      {
                        this.state.listofDistrict && this.state.listofDistrict.length > 0 ? 
                        this.state.listofDistrict.map((data, index)=>{
                          // console.log(data);
                          return(
                            <option key={index} value={data.districtName}>{data.districtName}</option>
                          );
                        })
                        :
                        null
                      }                                  
                    </select>
                  </div>
                 {/* <div className="errorMsg">{this.state.errors.district}</div>*/}
                </div>
              </div>
              
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                <div className="sales-report-main-class">
                  <div className="sales-report-commonpre">
                    {/*<div onClick={this.changeReportComponent.bind(this)} id="Daily" className={this.state.currentTabView === "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                      Daily
                    </div>
                    <div onClick={this.changeReportComponent.bind(this)} id="Weekly"  className={this.state.currentTabView === "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                      Weekly
                    </div>*/}
                    <div onClick={this.changeReportComponent.bind(this)} id="Monthly"  className={this.state.currentTabView === "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                      Monthly
                    </div>
                    <div onClick={this.changeReportComponent.bind(this)} id="Yearly"  className={this.state.currentTabView === "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                      Yearly
                    </div>
                    <div onClick={this.changeReportComponent.bind(this)} id="Customised"  className={this.state.currentTabView === "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                      Customised Dates
                    </div>
                  </div>
                </div>
              </div>
              
              {
                /*this.state.currentTabView === "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> :
                this.state.currentTabView === "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
          */    this.state.currentTabView === "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> :  
                this.state.currentTabView === "Yearly"  ? <YearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
                <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} />  
              }
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CategorywiseReport