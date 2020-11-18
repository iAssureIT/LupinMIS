import React, { Component }   from 'react';
import swal                   from 'sweetalert';
import axios                  from 'axios';
import _                      from 'underscore';
import $                      from 'jquery';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 

import Loader                 from "../../../common/Loader.js";
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./ViewActivity.css";

class ViewActivity extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "sector"            : "all",
      "sector_ID"         : "all",
      "activity_ID"       : "all",
      "activity"          : "all",
      "subactivity"       : "all",
      "subactivity_ID"    : "all",
      "typeofactivity"    : "all",
      "unitCost"          : 0,
      "quantity"          : 0,
      "totalcost"         : 0,
      "NABARD"            : 0,
      "LHWRF"             : 0,
      "bankLoan"          : 0,
      "govtscheme"        : 0,
      "directCC"          : 0,
      "indirectCC"        : 0,
      "other"             : 0,
      "total"             : 0,
      shown               : true,
      fields              : {},
      errors              : {},
       "twoLevelHeader"   : {
        apply             : true,
        firstHeaderData   : [
                            {
                              heading : 'Activity Details',
                              mergedColoums : 13
                            },
                            {
                              heading : 'Source of Fund',
                              mergedColoums : 7
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },
                            ]
      },
      "tableHeading"      : {
        projectCategoryType        : "Program Type",
        projectName                : "Project Name",
        date                       : "Intervention Date",
        place                      : "Intervention Place",
        sectorName                 : "Sector",
        activity                   : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        qtyPerBen                  : "Quantity",
        totalCostPerBen            : "Total Cost",
        numofBeneficiaries         : "Beneficiary",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank",
        govtscheme                 : "Government",
        directCC                   : "DirectCC",
        indirectCC                 : "IndirectCC",
        other                      : "Other",
        remark                     : "Remark",
        viewactions                : 'Action',
      },
      "downloadtableHeading"      : {
        projectCategoryType        : "Program Type",
        projectName                : "Project Name",
        date                       : "Intervention Date",
        district                   : "District",
        block                      : "Block",
        village                    : "Village",
        location                   : "Location",
        sectorName                 : "Sector",
        activityName               : "Activity",
        typeofactivity             : "Type of activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        qtyPerBen                  : "Quantity",
        totalCostPerBen            : "Total Cost",
        numofBeneficiaries         : "Beneficiary",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank",
        govtscheme                 : "Government",
        directCC                   : "DirectCC",
        indirectCC                 : "IndirectCC",
        other                      : "Other",
        // total                      : "Total",
        remark                     : "Remark",
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        downloadApply              : true,
        paginationApply            : false,
        searchApply                : false,
        // editUrl                    : '/activity/'
      },
      "selectedBeneficiaries"      : [],
      "startRange"                 : 0,
      "limitRange"                 : 1000000000,
      "editId"                     : this.props.match.params ? this.props.match.params.id : ''
    }
  }

  addCommas(x) {
    if(x !==undefined || x!==null){
      x=x.toString();
      if(x.includes('%')){
          return x;
      }else{
        if(x.includes('.')){
          var pointN = x.split('.')[1];
          var lastN = x.split('.')[0];
          var lastThree = lastN.substring(lastN.length-3);
          var otherNumbers = lastN.substring(0,lastN.length-3);
          if(otherNumbers !== '')
              lastThree = ',' + lastThree;
          var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
          return(res);
        }else{
          var lastThree = x.substring(x.length-3);
          var otherNumbers = x.substring(0,x.length-3);
          if(otherNumbers !== '')
              lastThree = ',' + lastThree;
          var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
          return(res);
        }
      }
    }else{
      return(0);
    }
  }

  getData(startRange, limitRange, center_ID, year, sector_ID, activity_ID, subactivity_ID, typeofactivity){ 
    // console.log(startRange, limitRange, center_ID, year, sector_ID, activity_ID, subactivity_ID, typeofactivity);
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    // $(".fullpageloader").show();subactivity
    if(year){
      var startDate = this.state.year.substring(3, 7)+"-04-01";
      var endDate = this.state.year.substring(10, 15)+"-03-31";    
      axios.get('/api/activityReport/filterlist/'+center_ID+'/'+startDate+'/'+endDate+'/'+sector_ID+'/'+activity_ID+'/'+subactivity_ID+'/'+typeofactivity)
      // axios.post('/api/activityReport/list/'+center_ID, data)
      .then((response)=>{
        // console.log(startDate,endDate);
      // $(".fullpageloader").hide();
        // console.log("response",response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                        : a._id,
            projectCategoryType        : a.projectCategoryType,
            projectName                : a.projectName==='all'?'-':a.projectName,
            date                       : moment(a.date).format('DD-MM-YYYY'),
            // date                       : a.date,
            place                      : a.place,
            sectorName                 : a.sectorName,
            activity                   : a.activity,
            subactivityName            : a.subactivityName,
            unit                       : a.unit,
            unitCost                   : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].unitCost)                : 0,
            qtyPerBen                  : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].qtyPerBen)               : 0,
            totalCostPerBen            : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].totalCostPerBen)         : 0,
            numofBeneficiaries         : ((a.noOfBeneficiaries)===null) || ((a.noOfBeneficiaries)=== 0) ? this.addCommas(a.numofBeneficiaries) : this.addCommas(a.noOfBeneficiaries),
            LHWRF                      : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.LHWRF)      : 0,
            NABARD                     : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.NABARD)     : 0,
            bankLoan                   : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.bankLoan)   : 0,
            govtscheme                 : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.govtscheme) : 0,
            directCC                   : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.directCC)   : 0,
            indirectCC                 : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.indirectCC) : 0,
            other                      : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.other)      : 0,
            remark                     : a.remark,
          }
        })
        var downloadData = response.data.map((a, i)=>{
          return {
            _id                        : a._id,
            projectCategoryType        : a.projectCategoryType,
            projectName                : a.projectName==='all'?'-':a.projectName,
            date                       : moment(a.date).format('DD-MM-YYYY'),
            // date                       : a.date,
            place                      : a.place,
            sectorName                 : a.sectorName,
            activity                   : a.activity,
            subactivityName            : a.subactivityName,
            unit                       : a.unit,
            unitCost                   : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].unitCost)                : 0,
            qtyPerBen                  : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].qtyPerBen)               : 0,
            totalCostPerBen            : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].totalCostPerBen)         : 0,
            numofBeneficiaries         : ((a.noOfBeneficiaries)===null) || ((a.noOfBeneficiaries)=== 0) ? this.addCommas(a.numofBeneficiaries) : this.addCommas(a.noOfBeneficiaries),
            LHWRF                      : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.LHWRF)      : 0,
            NABARD                     : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.NABARD)     : 0,
            bankLoan                   : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.bankLoan)   : 0,
            govtscheme                 : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.govtscheme) : 0,
            directCC                   : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.directCC)   : 0,
            indirectCC                 : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.indirectCC) : 0,
            other                      : a.listofBeneficiaries.length > 0 ? this.addCommas(a.listofBeneficiaries[0].sourceofFund.other)      : 0,
            remark                     : a.remark,
          }
        })
        this.setState({
          tableData : tableData,
          downloadData : downloadData
        })
      })
      .catch(function(error){      
        console.log("error = ",error); 
      });
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');

    this.setState({
      dateofIntervention :momentString,
    })
    this.year();
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
    this.getAvailableSectors();
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
    });
  }

  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      var availableSectors = response.data;
      // console.log("availableSectors",availableSectors);
      availableSectors.sort(dynamicSort("sector"));
      this.setState({
        availableSectors : availableSectors
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
    this.setState({
      sector_ID : sector_id, 
      activity_ID    : "all",
      subactivity_ID : "all",
      activity       : "all",
      subactivity    : "all",
    },()=>{
      this.getAvailableActivity(this.state.sector_ID);
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
    })
  } 
  getAvailableActivity(sector_ID){
    if(sector_ID){
      axios({
        method: 'get',
        url: '/api/sectors/'+sector_ID,
      }).then((response)=> { 
        if(response){
          var availableActivity = response.data[0].activity;
          function dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
            }
            return function (a,b) {
              if(sortOrder === -1){
                return b[property].localeCompare(a[property]);
              }else{
                return a[property].localeCompare(b[property]);
              }        
            }
          }
          availableActivity.sort(dynamicSort("activityName"));
          this.setState({
              availableActivity : availableActivity
          })
        }
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    if(event.target.value==="all"){
      var activity_ID = event.target.value;
    }else{
      var activity_ID = event.target.value.split('|')[1];
    }
    this.setState({
      activity_ID : activity_ID,
      subactivity_ID : "all",
    },()=>{
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
    })
  }
  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      var availableSubActivity = _.flatten(response.data.map((a, i)=>{
        return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] });
      }))
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      availableSubActivity.sort(dynamicSort("subActivityName"));
      this.setState({
      availableSubActivity : availableSubActivity
      });
    }).catch(function (error) {
      console.log("error = ",error);
    });    
  }
  selectSubActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    if(event.target.value==="all"){
      var subactivity_ID = event.target.value;
    }else{
      var subactivity_ID = event.target.value.split('|')[1];
    }
    this.setState({
      subactivity_ID : subactivity_ID,
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
    })
  }
  year() {
    let financeYear;
    let today = moment();
    // console.log('today',today);
    if(today.month() >= 3){
      financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    else{
      financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    this.setState({
        financeYear :financeYear
    },()=>{
      // console.log('financeYear',this.state.financeYear);
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      // console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
        firstYear  :firstYear,
        secondYear :secondYear,
        year       :financialYear
      },()=>{
        this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
        var upcomingFirstYear =parseInt(this.state.firstYear)+3
        var upcomingSecondYear=parseInt(this.state.secondYear)+3
        var years = [];
        for (var i = 2017; i < upcomingFirstYear; i++) {
          for (var j = 2018; j < upcomingSecondYear; j++) {
            if (j-i===1){
              var financeYear = "FY "+i+" - "+j;
              years.push(financeYear);
              this.setState({
                years  :years,
              },()=>{
              // console.log('years',this.state.years);
              // console.log('year',this.state.year);
              })              
            }
          }
        }
      })
    })
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year, this.state.sector_ID, this.state.activity_ID, this.state.subactivity_ID, this.state.typeofactivity);
      // console.log('name', this.state.year)
    });
  }
  render() {
    return (
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                        View Activity                                     
                     </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                      <label className="formLable">Year</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                         <option className="hidden" >-- Select Year --</option>
                         {
                          this.state.years 
                          ?
                            this.state.years.map((data, i)=>{
                              return <option key={i}>{data}</option>
                            })
                          : null
                         }
                        </select>
                      </div>
                    </div>                         
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                      <label className="formLable">Sector</label><span className="asterix"></span>
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
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                      <label className="formLable">Activity<span className="asterix">*</span></label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                        <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                          <option disabled="disabled" selected="true">-- Select --</option>
                          <option value="all" >All</option>
                          {
                            this.state.availableActivity && this.state.availableActivity.length >0 ?
                            this.state.availableActivity.map((data, index)=>{
                              if(data.activityName ){
                                  return(
                                      <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                  );
                              }
                            })
                            :
                            null
                          }
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                      <label className="formLable">Sub-Activity<span className="asterix">*</span></label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                        <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                          <option disabled="disabled" selected="true">-- Select --</option>
                          <option value="all" >All</option>
                          {
                            this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                            this.state.availableSubActivity.map((data, index)=>{
                              if(data.subActivityName ){
                                return(
                                  <option className="" key={data._id} data-upgrade={data.familyUpgradation} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                );
                              }
                            })
                            :
                            null
                            }
                        </select>
                      </div>
                    </div>
                    <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                        <label className="formLable">Activity Type<span className="asterix">*</span></label>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeofactivity" >
                          <select className="custom-select form-control inputBox" ref="typeofactivity" name="typeofactivity" value={this.state.typeofactivity} onChange={this.handleChange.bind(this)} >
                            <option disabled="disabled" selected={true}>-- Select --</option>
                          {/*  <option data-id="commonlevel">Common Level Activity</option>*/}
                            <option value="all">All</option>
                            <option data-id="familylevel">Family Level Activity</option>
                            <option data-id="BtypeActivity">Type B Activity</option>
                          </select>
                        </div>
                        <div className="errorMsg">{this.state.errors.typeofactivity}</div>
                      </div>  
                  </div> 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <IAssureTable 
                      tableName = "Activity Report"
                      id = "activityReport"
                      tableClass = "activityReport"
                      downloadtableHeading={this.state.downloadtableHeading}
                      downloadData={this.state.downloadData}
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
                      viewTable = {true}
                      viewLink = "activityReportView"
                    />
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
export default ViewActivity