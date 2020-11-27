import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';

import NewBeneficiary from "../activity/addBeneficiary/NewBeneficiary.js";


import 'react-table/react-table.css';
import "./ActivityReportView.css";


class ActivityReportView extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
       "twoLevelHeader"  : {
          apply                     : false,
          firstHeaderData           : [
                                        {
                                            heading : '',
                                            mergedColoums : 10
                                        },
                                        {
                                            heading : 'Source of Fund',
                                            mergedColoums : 7
                                        },
                                     /*   {
                                            heading : 'MIS Coordinator',
                                            mergedColoums : 3
                                        },*/
                                      ]
      },
      "tableHeading"                : {
        familyID                    : "Family ID",
        beneficariesId              : "Beneficiary ID",
        nameofbeneficaries          : "Name of Beneficiary",
        actions                     : 'Action',
      },
      "startRange"                  : 0,
      "limitRange"                  : 10,
      "editId"                      : this.props.match.params ? this.props.match.params.id : ''
    }
  }
 
  handleChange(event){
    event.preventDefault();
 
  }
  componentDidMount() {
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    var id = this.state.editId;
    axios({
      method: 'get',
      url: '/api/activityReport/'+id,
      }).then((response)=> {
        var tableData = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});
        this.setState({
          dataCount : tableData.length,
          tableData : tableData.slice(this.state.startRange, this.state.limitRange),
          editUrl   : this.props.match.params
        },()=>{
          
        });
      }).catch(function (error) {
        console.log('error', error);
    });
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
    }
  }

  SubmitAnnualPlan(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    // if (this.validateForm()) {
    var annualPlanValues= 
    {
     
      "remark"              : this.refs.remark.value,
    };

    let fields = {};
  
    fields["remark"] = "";
    this.setState({
     
      "remark"              :"",
      "fields":fields
    });
      axios
      .post('https://jsonplaceholder.typicode.com/posts',{annualPlanValues})
      .then(function(response){
        // console.log(response);
      })
      .catch(function(error){
        console.log(error);
      });
      academicArray.push(annualPlanValues);
      alert("Data inserted Successfully!")
      // }
    }
  edit(id){
    axios({
      method: 'get',
      url: '/api/centers/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      // console.log('editData',editData);
      editData.villagesCovered.map((data, i)=>{
        this.setState({
          [data.village] : true
        })
      })
      this.setState({
        "typeOfCentre"             : editData.type,
        "nameOfCentre"             : editData.centerName,
        "address"                  : editData.address,
        "state"                    : editData.state,
        "district"                 : editData.district,
        "pincode"                  : editData.pincode,
        "centreInchargeName"       : editData.centerInchargename,
        "centreInchargeContact"    : editData.centerInchargemobile,
        "centreInchargeEmail"      : editData.centerInchargeemail,
        "MISCoordinatorName"       : editData.misCoordinatorname,
        "MISCoordinatorContact"    : editData.misCoordinatormobile,
        "MISCoordinatorEmail"      : editData.misCoordinatoremail,
        "selectedVillages"         : editData.villagesCovered,
        "districtCovered"          :"",
        "blockCovered"             :"",
        "villagesCovered"          : editData.villagesCovered,

      });
    }).catch(function (error) {
    });
  }
    getData(startRange, limitRange){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return _.omit(a, 'blocksCovered', 'villagesCovered', 'districtsCovered')});

      this.setState({
        tableData : tableData.slice(startRange, limitRange),
      });
    }).catch(function (error) {
      console.log('error', error);
    });
  }

    render() {
      
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
             <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 header backColor">
                        <div className="col-lg-2 col-md-2 col-xs-2 col-sm-2 logoContainer">
                        </div>
                        <div className="col-lg-7 col-md-8 col-xs-8 col-sm-8 headContainer">
                          <h3> Lupin Human Walfare & Research Foundation</h3>
                          <h5> Activity Report View </h5>
                        </div>
                        <div className="col-lg-3 col-md-3 col-xs-3 col-sm-3 operationContainer">
                          <div className="col-lg-1 col-md-1 col-xs-1 col-sm-1"><i class="fa fa-print" aria-hidden="true"></i></div>
                          <div className="col-lg-1 col-md-1 col-xs-1 col-sm-1"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></div>
                          <div className="col-lg-1 col-md-1 col-xs-1 col-sm-1"><i class="fa fa-trash" aria-hidden="true"></i></div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>Activity Details</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <table id="table-to-xls" className="table customTable table-bordered table-hover table-responsive table-striped valign">
                          <thead>
                            <tr> 
                              <th className="text-center"> Date </th> 
                              <th className="text-center"> Place </th> 
                              <th className="text-center"> Sector </th>
                              <th className="text-center"> Activity </th>
                              <th className="text-center"> Sub-Activity </th>
                              <th className="text-center"> Unit </th>
                              <th className="text-center"> Unit Cost </th>
                              <th className="text-center"> Quantity </th>
                              <th className="text-center"> Total Cost of Activity </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>07/07/2019</td>
                              <td><table >
                                    <tr>
                                      <td>
                                      Dist : Pune 
                                      </td>
                                    </tr> 
                                    <tr>
                                      <td>
                                      Block : Purander 
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                      Village : Saswad 
                                      </td>
                                    </tr>
                                  </table> 
                              </td>
                              <td>Natural Resource Management</td>
                              <td>Water Resource Development
                                  <table >
                                    <tr>
                                      <td>
                                      Type : Comman Level 
                                      </td>
                                    </tr>                               
                                  </table>
                              </td>
                              <td>Well Construction</td>
                              <td>Number</td>
                              <td>50,0000</td>
                              <td>5</td>
                              <td>25,00,000</td>
                            </tr>
                          </tbody>
                        </table>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>Sources of Fund</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>List of Beneficieries</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <NewBeneficiary />
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
export default ActivityReportView