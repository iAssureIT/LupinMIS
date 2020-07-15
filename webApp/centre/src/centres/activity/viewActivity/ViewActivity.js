import React, { Component }   from 'react';
import swal                   from 'sweetalert';
import axios                  from 'axios';
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
      "center_id"         : "",
      "centerName"        : "",
      "dist"              : "",
      "block"             : "",
      "dateofIntervention": "",
      "village"           : "",
      "date"              : "",
      "sector"            : "",
      "typeofactivity"    : "",
      "nameofactivity"    : "",
      "activity"          : "",
      "subactivity"       : "",
      "unit"              : "",
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
                            ]
      },
      "tableHeading"      : {
        projectCategoryType        : "Program Type",
        projectName                : "Project Name",
        date                       : "Intervention Date",
        place                      : "Intervention Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
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
        viewactions                : 'Action',
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        paginationApply            : false,
        searchApply                : false,
        editUrl                    : '/activity/'
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

  getData(startRange, limitRange, center_ID, year){ 
    // console.log(startRange, limitRange, center_ID, year);
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    $(".fullpageloader").show();
    if(year){
      var startDate = this.state.year.substring(3, 7)+"-04-01";
      var endDate = this.state.year.substring(10, 15)+"-03-31";    
      axios.get('/api/activityReport/list/'+center_ID+'/'+startDate+'/'+endDate)
      // axios.post('/api/activityReport/list/'+center_ID, data)
      .then((response)=>{
        console.log(startDate,endDate);
      $(".fullpageloader").hide();
        console.log("response",response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                        : a._id,
            projectCategoryType        : a.projectCategoryType,
            projectName                : a.projectName==='all'?'-':a.projectName,
            date                       : moment(a.date).format('DD-MM-YYYY'),
            place                      : a.place,
            sectorName                 : a.sectorName,
            activityName               : a.activityName,
            subactivityName            : a.subactivityName,
            unit                       : a.unit,
            unitCost                   : this.addCommas(a.unitCost),
            quantity                   : this.addCommas(a.quantity),
            totalcost                  : this.addCommas(a.totalcost),
            // numofBeneficiaries         :( a.numofBeneficiaries !=="0") ||( a.numofBeneficiaries !==0) ? this.addCommas(a.numofBeneficiaries) : this.addCommas(a.noOfBeneficiaries),
            numofBeneficiaries         : ((a.noOfBeneficiaries)===null) || ((a.noOfBeneficiaries)=== 0) ? this.addCommas(a.numofBeneficiaries) : this.addCommas(a.noOfBeneficiaries),
            LHWRF                      : this.addCommas(a.LHWRF),
            NABARD                     : this.addCommas(a.NABARD),
            bankLoan                   : this.addCommas(a.bankLoan),
            govtscheme                 : this.addCommas(a.govtscheme),
            directCC                   : this.addCommas(a.directCC),
            indirectCC                 : this.addCommas(a.indirectCC),
            other                      : this.addCommas(a.other),
            remark                     : a.remark,
          }
        })
        this.setState({
          tableData : tableData
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
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year);
    });
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
        this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year);
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
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.year);
      console.log('name', this.state.year)
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
                        Activity Reporting                                     
                     </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-4 col-md-4 col-lg-offset-4 col-md-offset-4 col-sm-12 col-xs-12">
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
                  </div> 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">

                    <IAssureTable 
                      tableName = "Activity Report"
                      id = "activityReport"
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