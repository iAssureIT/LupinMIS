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
                              mergedColoums : 11
                            },
                            {
                              heading : 'Source of Fund',
                              mergedColoums : 8
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },
                            ]
      },
      "tableHeading"      : {
        date                       : "Date",
        place                      : "Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
        numofBeneficiaries         : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
        total                      : "Total",
        remark                     : "Remark",
        // actions                    : 'Action',
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
      "limitRange"                 : 10,
      "editId"                     : this.props.match.params ? this.props.match.params.id : ''
    }
  }

  getLength(){
    axios.get('/api/activityReport/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });
  }
  getData(startRange, limitRange){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.post('/api/activityReport/list', data)
    .then((response)=>{

      var tableData = response.data.map((a, i)=>{
        return {
          _id                        : a._id,
          date                       : moment(a.date).format('YYYY-MM-DD'),
          place                      : a.place,
          sectorName                 : a.sectorName,
          typeofactivity             : a.typeofactivity,
          activityName               : a.activityName,
          subactivityName            : a.subactivityName,
          unit                       : a.unit,
          unitCost                   : a.unitCost,
          quantity                   : a.quantity,
          totalcost                  : a.totalcost,
          numofBeneficiaries         : a.numofBeneficiaries,
          LHWRF                      : a.LHWRF,
          NABARD                     : a.NABARD,
          bankLoan                   : a.bankLoan,
          govtscheme                 : a.govtscheme,
          directCC                   : a.directCC,
          indirectCC                 : a.indirectCC,
          other                      : a.other,
          total                      : a.total,
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