import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
/*import $                      from 'jquery';
import _                      from 'underscore';
*/
import "./ViewActivity.css";

class ViewActivity extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      
      "Months"              :["January","February","March","April","May","June","July","August","September","October","November","December"],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {},
      "twoLevelHeader"           : {
        apply                     : true,
        firstHeaderData           : [
                                {
                                  heading : 'Activity Details',
                                  mergedColoums : 14
                                },
                                {
                                  heading : 'Source of Fund',
                                  mergedColoums : 8
                                },]
      },
      "tableHeading" : {
        date                       : "Date of intervention",
        district                       : "District",
        block                      : "Block",
        village                    : "Village",
        sectorName                     : "Sector",
        typeofactivity             : "Type of Activity",
        activityName                   : "Activity",
        subActivityName                : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
        numofBeneficiaries          : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
        total                      : "Total",
        remark                      : "Remark",
        actions                    : 'Action',
      },
      "startRange"                 : 0,
      "limitRange"                 : 10,
      "editId"                     : this.props.match.params ? this.props.match.params.id : ''
    }    
  }  
    
   componentDidMount() {
 /*    console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    axios({
      method: 'get',
      url: '/api/activityReport/list',
    }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return});
      this.setState({
        tableData : response.data,
        editUrl   : this.props.match.params
      },()=>{
        
      });
    }).catch(function (error) {
      console.log('error', error);
    });*/
  }

   
   getData(startRange, limitRange){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.get('/api/activityReport/list',data)
    .then((response)=>{
      console.log('response', response.data);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){      
    });
  }

 
  render() {
    return (
       <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
               <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 row titleaddcontact">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Activity Reporting                                     
                   </div>
                  <hr className="hr-head container-fluid "/>
                </div>
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                  <div className="pageSubHeader">View of All Activities</div>
                </div>
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                  <div className="row">  
                   <IAssureTable 
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      
                    />
                  </div>
                </form>
              </div>
            </section>
           </div>
        </div>
      </div>
    );
  }
}
export default ViewActivity