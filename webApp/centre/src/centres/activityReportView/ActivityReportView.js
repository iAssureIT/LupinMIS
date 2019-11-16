import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactHTMLTableToExcel        from 'react-html-table-to-excel';
import ReactTable             from "react-table";

import 'react-table/react-table.css';
import "./ActivityReportView.css";

class ActivityReportView extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
    
    }
  }
 
  handleChange(event){
    event.preventDefault();
 
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
        console.log(response);
      })
      .catch(function(error){
        console.log(error);
      });
      console.log("annualPlanValues =>",annualPlanValues);
      academicArray.push(annualPlanValues);
      console.log("add value",annualPlanValues);      
      alert("Data inserted Successfully!")
      // }
    }
    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    toglehidden()
    {
     this.setState({
         shown: !this.state.shown
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
                          <div className="col-lg-1 col-lg-offset-2 col-md-1 col-xs-1 col-sm-1"><i className="fa fa-print" aria-hidden="true"></i></div>
                         {/* <div className="col-lg-1 col-md-1 col-xs-1 col-sm-1"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></div>
                          <div className="col-lg-1 col-md-1 col-xs-1 col-sm-1"><i className="fa fa-trash" aria-hidden="true"></i></div>*/}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>Activity Details</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <ReactHTMLTableToExcel
                          id="table1"
                          className="download-table-xls-button"
                          table="table-to-xls"
                          filename="tablexls"
                          sheet="tablexls"
                          buttonText="Download as XLS"/>
                        <table id="table1" className="table customTable table-bordered table-hover table-responsive table-striped valign">
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
                        <table id="table-to-xls" className="table customTable table-bordered table-hover table-responsive table-striped valign">
                          <thead>
                            <tr> 
                              <th className="text-center"> LHWRF </th> 
                              <th className="text-center"> NABARD </th> 
                              <th className="text-center"> Bank Loan </th>
                              <th className="text-center"> Govt. Scheme </th>
                              <th className="text-center"> Direct Community Contribution </th>
                              <th className="text-center"> Indirect Community Contribution </th>
                              <th className="text-center"> Other </th>
                              <th className="text-center"> Total </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>2,00,000</td>
                              <td>1,00,000</td>
                              <td>1,00,000</td>
                              <td>1,00,000</td>
                              <td>50,0000</td>
                              <td>1,00,000</td>
                              <td>25,00,000</td>
                              <td>25,00,000</td>
                            </tr>
                          </tbody>
                        </table>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h5>List of Beneficieries</h5>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <table id="table-to-xls" className="table customTable table-bordered table-hover table-responsive table-striped valign">
                          <thead>
                            <tr> 
                              <th className="text-center"> Sr No. </th> 
                              <th className="text-center"> Family ID</th> 
                              <th className="text-center"> Name of Beneficieries </th>
                              <th className="text-center"> Beneficiery ID </th>
                             
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>L000001</td>
                              <td>Priyanka Lewade</td>
                              <td>PL001</td>
                           
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>B000001</td>
                              <td>Priyanka Bhanvase</td>
                              <td>PB001</td>
                           
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>G000001</td>
                              <td>Manali Gujarathi</td>
                              <td>MG001</td>
                           
                            </tr>
                          </tbody>
                        </table>
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