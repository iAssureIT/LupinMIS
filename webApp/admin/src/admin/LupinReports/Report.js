import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $                    from 'jquery';
import axios                  from 'axios';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import "../Reports/Reports.css";
class SDGReport extends Component{
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
                    heading : 'Details of Activity contributing SDG',
                    mergedColoums : 5
                },
                {
                    heading : 'Financial Sharing "Rs"',
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : {
            "yghj"    : 'SDGs',
            "dgfg"    : 'Activity',
            "ertr"    : 'Unit',
            "abcf"    : 'Quantity',
            "ghgh"    : 'Amount',
            "abui"    : 'Beneficiaries',
            "hgfh"    : 'LHWRF',
            "hffg"    : 'NABARD',
            "tert"    : 'Bank Loan',
            "ouio"    : 'Direct Community  Contribution',
            "jshk"    : 'Indirect Community  Contribution',
            "khjk"    : 'Govt',
            "kgkk"    : 'Others',
        
        },
    }
    
        window.scrollTo(0, 0);
  }
  componentDidMount(){
    this.getAvailableSectors()
    this.getDistrict();
  }
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
                      Reports                   
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">  
                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable">Select Report</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                          <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center }  /*onChange={this.handleChange.bind(this)} */>
                            <option className="hidden" >-- Select --</option>
                            <option className="formLable">Activity wise Annual Completion Report</option>
                            <option className="formLable">Sector wise Annual Completion Summary Report</option>
                            <option className="formLable">Activity wise Periodic Variance Report (Physical & Financial)</option>
                            <option className="formLable">Sector wise Periodic Variance Summary Report</option>
                            <option className="formLable">Activity wise Periodic Physical Variance Report</option>
                            <option className="formLable">Geographical Report</option>
                            <option className="formLable">Villagewise Family Report</option>
                            <option className="formLable">Category wise Report</option>
                            <option className="formLable">Upgraded Beneficiary Report</option>
                            <option className="formLable">SDG Report</option>
                            <option className="formLable">ADP Report</option>
                            <option className="formLable">EMP Report</option>
                            
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                      </div>                     
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
export default SDGReport
/*https://reactstrap.github.io/components/dropdowns/*/