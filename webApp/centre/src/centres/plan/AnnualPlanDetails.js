import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import BulkUpload             from "../bulkupload/BulkUpload.js";
import $                      from 'jquery';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import "./AnnualPlanDetails.css";

var add=0
class AnnualPlanDetails extends Component{
  constructor(props){
    super(props); 
    this.state = {
      "center"              :"",
      "sector_id"           :"",
      "sectorName"          :"-- Select --",
      "subActivity"         :"",
      "activityName"        :"-- Select --",
      "physicalUnit"        :"",
      "unitCost"            :"",
      "totalBudget"         :"",
      "noOfBeneficiaries"   :"",
      "LHWRF"               :"",
      "NABARD"              :"",
      "bankLoan"            :"",
      "govtscheme"          :"",
      "directCC"            :"",
      "indirectCC"          :"",
      "type"                : true,      
      "projectName"         : "-- Select --",
      "projectCategoryType" : "LHWRF Grant",
      "other"               :"",
      "remark"              :"",
      "shown"               : true,
      "uID"                 :"",
      "month"               :"Annual Plan", 
      "heading"             :"Annual Plan",
      // "months"              :["Annual Plan","Till Date","April","May","June","July","August","September","October","November","December","January","February","March"],
      "months"              :["Annual Plan","Q1 (April to June)","Q2 (July to September)","Q3 (October to December)","Q4 (January to March)"],
      "shown"               : true,
      "twoLevelHeader"     : {
      "apply"               : true,
      "firstHeaderData"     : [
                                {
                                    heading : 'Activity Details',
                                    mergedColoums : 13,
                                    hide :false,
                                },
                                {
                                    heading : 'Source of Fund',
                                    mergedColoums : 9,
                                    hide :false,
                                },
                               
                              ]
      },
      "tableHeading"        : {
        // month               : "Month",
        year                : "Year",
        projectCategoryType : "Program Type",
        projectName         : "Project Name",
        sectorName          : "Sector",
        activityName        : "Activity",
        subactivityName     : "Sub-Activity",
        unit                : "Unit",
        physicalUnit        : "Phy Unit",
        unitCost            : "Unit Cost",
        totalBudget         : "Total Cost",
        noOfBeneficiaries   : "Beneficiary",
        noOfFamilies        : "Families",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank",
        govtscheme          : "Government",
        directCC            : "DirectCC",
        indirectCC          : "IndirectCC",
        other               : "Other",
        remark              : "Remark",
        // actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/annualPlans/',
        paginationApply     : false,
        downloadApply       : true,
        searchApply         : false,
        editUrl             : '/plan-details/',
      },   
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      "fields"                : {},
      "errors"                : {},
      "subActivityDetails"    : [],
      "apiCall"               : '/api/annualPlans',
      "totalBud"              : 0,
      "annualFileDetailUrl"   : "/api/annualPlans/get/filedetails/",
      "monthlyFileDetailUrl"  : "/api/monthlyplans/get/filedetails/",
      "availableSubActivity" : []
    }
  }
  
  addCommas(x) {
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
        // console.log("x",x,"lastN",lastN,"lastThree",lastThree,"otherNumbers",otherNumbers,"res",res)
        return(res);
      }else{
        var lastThree = x.substring(x.length-3);
        var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers !== '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        // console.log("lastThree",lastThree,"otherNumbers",otherNumbers,"res",res);
        return(res);
      }
    }
  }

  getData(inputGetData){
    this.setState({
      propsdata : inputGetData
    });
    $(".fullpageloader").show();
    if(inputGetData){
      // console.log("inputGetData",inputGetData);
      axios.post(this.state.apiCall+'/list', inputGetData)
      .then((response)=>{
        $(".fullpageloader").hide();
        // console.log("response plan Details===>",response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                 : a._id,
            // month               : a.month,
            year                : a.year,
            projectCategoryType : a.projectCategoryType,
            projectName         : a.projectName==='all'?'-':a.projectName,
            sectorName          : a.sectorName,
            activityName        : a.activityName,
            subactivityName     : a.subactivityName,
            unit                : a.unit,
            physicalUnit        : this.addCommas(a.physicalUnit),
            unitCost            : this.addCommas(a.unitCost),
            totalBudget         : this.addCommas(a.totalBudget),
            noOfBeneficiaries   : this.addCommas((a.noOfBeneficiaries)),
            noOfFamilies        : this.addCommas((a.noOfFamilies)),
            LHWRF               : this.addCommas(a.LHWRF),
            NABARD              : this.addCommas(a.NABARD),
            bankLoan            : this.addCommas(a.bankLoan),
            govtscheme          : this.addCommas(a.govtscheme),
            directCC            : this.addCommas(a.directCC),
            indirectCC          : this.addCommas(a.indirectCC),
            other               : this.addCommas(a.other),
            remark              : a.remark,
          }
        })
        this.setState({
          tableData : tableData
        });
      })
      .catch(function(error){
        console.log("error"+error);
      });
    }
  }
  componentWillReceiveProps(nextProps){
    this.year();
    this.monthYear();
    var inputGetData = {
      center_ID  : this.state.center_ID,
      month      : this.state.month,
      year       : this.state.year,
      startRange : this.state.startRange,
      limitRange : this.state.limitRange,
      startDate  : this.state.startDate,
      endDate    : this.state.endDate,
    }
    // console.log("inputGetData",inputGetData)
    this.getData(inputGetData);   
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.monthYear();
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.year();
    // console.log("localStorage =",localStorage);
    this.setState({
      apiCall      : '/api/annualPlans',
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      var inputGetData = {
        center_ID  : this.state.center_ID,
        month      : this.state.month,
        year       : this.state.year,
        startRange : this.state.startRange,
        limitRange : this.state.limitRange,
        startDate  : this.state.startDate,
        endDate    : this.state.endDate,
      }
      // console.log("inputGetData",inputGetData)
      this.getData(inputGetData);
    });
  }

  handleChange(event){
    this.setState({
      [event.target.name] : event.target.value,
    },()=>{
        this.setState({
          "startDate" : this.state.year.substring(3, 7)+"-04-01",
          "endDate"   : this.state.year.substring(10, 15)+"-03-31",
        },()=>{
          var inputGetData = {
            center_ID  : this.state.center_ID,
            month      : this.state.month,
            year       : this.state.year,
            startRange : this.state.startRange,
            limitRange : this.state.limitRange,
            startDate  : this.state.startDate,
            endDate    : this.state.endDate,
          }
          // console.log("inputGetData",inputGetData)
          this.getData(inputGetData);
        })
    });
  }

  monthYear(){
    var d = new Date();
    var currentYear = d.getFullYear();
    var monthYears = [];
    for (var i = 2017; i < currentYear+3; i++) {
      var monthYear= i
      monthYears.push(monthYear);
      this.setState({
        monthYears  :monthYears,
        currentYear :currentYear,
      },()=>{
        // console.log('monthYears',this.state.monthYears);
      })
    }
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
      this.setState({
        firstYear  :firstYear,
        secondYear :secondYear,
        year       :financialYear
      },()=>{
        // console.log('year',this.state.year, this.state.month);
        if(this.state.month==="Annual Plan"){
          this.setState({
            "startDate" : this.state.year.substring(3, 7)+"-04-01",
            "endDate"   : this.state.year.substring(10, 15)+"-03-31",
          },()=>{
            var inputGetData = {
              center_ID  : this.state.center_ID,
              month      : this.state.month,
              year       : this.state.year,
              startRange : this.state.startRange,
              limitRange : this.state.limitRange,
              startDate  : this.state.startDate,
              endDate    : this.state.endDate,
            }
            // console.log("inputGetData",inputGetData)
            this.getData(inputGetData);
          })
        }
        var upcomingFirstYear=parseInt(this.state.firstYear)+3
        var upcomingSecondYear=parseInt(this.state.secondYear)+3
        var years = [];
        for (var i = 2017; i < upcomingFirstYear; i++) {
          for (var j = 2018; j < upcomingSecondYear; j++) {
            if (j-i===1){
              var financeYear = "FY "+i+" - "+j;
              years.push(financeYear);
              this.setState({
                years  :years,
                financeyears  :years,
              },()=>{
              // console.log('years',this.state.years);
              })
            }
          }
        }
      })
    })
  }

  render() {
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    // console.log('month =======', this.state.month, this.state.year)
    // console.log('month =======', this.state.startDate, this.state.endDate)
    return ( 
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                        Annual Plan                          
                      </div>
                      <hr className="hr-head container-fluid row"/>
                    </div>
                  </div>
                 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">                    
                    <div className="col-lg-4 col-lg-offset-4 col-md-4 col-sm-6 col-xs-12 boxHeight">
                      <label className="formLable">Year</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year }  onChange={this.handleChange.bind(this)} >
                          <option disabled="disabled" selected={true}>-- Select Year --</option>
                          {
                            ( this.state.years )
                            ? 
                              this.state.years.map((data, i)=>{
                                // console.log('data',data);
                                return (<option key={i}>{data}</option>)
                              })
                            :
                            null
                          }
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.year}</div>
                    </div>                 
                  </div> 
                  <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <div className="tab-pane fade in active ">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  formLable " >
                        <div className="row">  
                         <IAssureTable 
                            tableName = "Plan Details"
                            id = "AnnualPlanDetails"
                            tableHeading={this.state.tableHeading}
                            twoLevelHeader={this.state.twoLevelHeader} 
                            dataCount={this.state.dataCount}
                            tableData={this.state.tableData}
                            data={this.state.propsdata}
                            getData={this.getData.bind(this)}
                            tableObjects={this.state.tableObjects}
                          />
                        </div>
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
export default AnnualPlanDetails