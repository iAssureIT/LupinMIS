import React, { Component } from 'react';
import $                    from 'jquery';
import axios                  from 'axios';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import "../Reports/Reports.css";
class GeographicalReport extends Component{
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
                    heading : "Achievements",
                    mergedColoums : 2
                },
                {
                    heading : 'Expenditure(Rs. in Lakhs)',
                    mergedColoums : 10
                },
               
            ]
        },
        "tableHeading"      : {
            "abcs"    : 'Activity',
            "abcx"    : "Reach",
            "cbfg"    : 'Upgradation', 
            "yghj"    : 'LHWRF',
            "dgfg"    : 'NABARD',
            "ghgh"    : 'Bank Loan',
            "werr"    : 'Direct Community  Contribution',
            "ghgf"    : 'Indirect Community  Contribution',
            "ertr"    : 'Govt',
            "abui"    : 'Others',
            "abcf"    : 'Total',           
        },
    }
        window.scrollTo(0, 0);
  }

  componentDidMount(){
    this.getAvailableSectors()
    this.getDistrict();
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
  getBlock(stateCode, selectedDistrict){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/MH/IN',
      // url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/'+stateCode+'/IN',
    }).then((response)=> {
        console.log('response ==========', response.data);
        this.setState({
          listofBlocks : response.data
        },()=>{
        console.log('listofBlocks', this.state.listofBlocks);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block
    },()=>{
      console.log("block",block);
      this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
    });
  }
  getVillages(stateCode, selectedDistrict, block){
    console.log(stateCode, selectedDistrict, block);
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/cities/get/list/'+block+'/'+selectedDistrict+'/MH/IN',
    }).then((response)=> {
        console.log('response ==========', response.data);
        this.setState({
          listofVillages : response.data
        },()=>{
        console.log('listofVillages', this.state.listofVillages);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      console.log("village",village);
    });  
  }  
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
      // console.log('error', error);
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
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Report                   
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                      <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                        <label className="formLable">Select Sector Name</label><span className="asterix">*</span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector}  /*onChange={this.handleChange.bind(this)}*/>
                            <option  className="hidden" value="" >-- Select Sector--</option>
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
                      <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                        <label className="formLable">District</label><span className="asterix">*</span>
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

                    <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                      <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                        <label className="formLable">Block</label><span className="asterix">*</span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                          <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block} onChange={this.selectBlock.bind(this)} >
                            <option  className="hidden" >-- Select --</option>
                            {
                              this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                              this.state.listofBlocks.map((data, index)=>{
                                return(
                                  <option key={index} value={data.blockName}>{data.blockName}</option>
                                );
                              })
                              :
                              null
                            }                              
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.block}</div>*/}
                      </div>
                      <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                        <label className="formLable">Village</label><span className="asterix">*</span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                          <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.selectVillage.bind(this)}  >
                            <option  className="hidden" >-- Select --</option>
                            {
                              this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                              this.state.listofVillages.map((data, index)=>{
                                return(
                                  <option key={index} value={data.cityName}>{data.cityName}</option>
                                );
                              })
                              :
                              null
                            } 
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.village}</div>*/}
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
            </section>
          </div>
        </div>
      </div>        
    );
  }
}
export default GeographicalReport