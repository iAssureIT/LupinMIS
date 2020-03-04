import React, { Component }   from 'react';
import swal                   from 'sweetalert';
import axios                  from 'axios';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 

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
        projectCategoryType        : "Category",
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

  getLength(){
    // axios.get('/api/activityReport/count')
    // .then((response)=>{
    //   console.log('response', response.data);
    //   this.setState({
    //     dataCount : response.data.dataLength
    //   },()=>{
    //     console.log('dataCount', this.state.dataCount);
    //   })
    // })
    // .catch(function(error){
      
    // });
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
  }

  getData(startRange, limitRange, center_ID){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.post('/api/activityReport/list/'+center_ID, data)
    .then((response)=>{
      console.log("response",response);
      var tableData = response.data.map((a, i)=>{
        return {
          _id                        : a._id,
          projectCategoryType        : a.projectCategoryType,
          projectName                : a.projectName==='all'?'-':a.projectName,
          date                       : moment(a.date).format('DD-MM-YYYY'),
          place                      : a.place,
          sectorName                 : a.sectorName,
          typeofactivity             : a.typeofactivity,
          activityName               : a.activityName,
          subactivityName            : a.subactivityName,
          unit                       : a.unit,
          unitCost                   : this.addCommas(a.unitCost),
          quantity                   : this.addCommas(a.quantity),
          totalcost                  : this.addCommas(a.totalcost),
          numofBeneficiaries         : this.addCommas(a.numofBeneficiaries),
          LHWRF                      : this.addCommas(a.LHWRF),
          NABARD                     : this.addCommas(a.NABARD),
          bankLoan                   : this.addCommas(a.bankLoan),
          govtscheme                 : this.addCommas(a.govtscheme),
          directCC                   : this.addCommas(a.directCC),
          indirectCC                 : this.addCommas(a.indirectCC),
          other                      : this.addCommas(a.other),
          total                      : this.addCommas(a.total),
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
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');

    this.setState({
      dateofIntervention :momentString,
    })
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    });
  }

  render() {
    return (
      <div className="container-fluid">
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
                 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                    <IAssureTable 
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
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