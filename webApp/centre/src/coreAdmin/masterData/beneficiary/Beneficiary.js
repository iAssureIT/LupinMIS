import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import ReactTable         from "react-table";
import 'react-table/react-table.css';
import swal   from 'sweetalert';
import "./Beneficiary.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Beneficiary extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"             :"",
      "beneficariesId"        :"",
      "nameofbeneficaries"      :"",
      "academicData"          :[],
      "fields": {},
      "errors": {}
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"             : this.refs.familyID.value,          
      "beneficariesId"        : this.refs.beneficariesId.value,          
      "nameofbeneficaries"      : this.refs.nameofbeneficaries.value,
      
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  }

  isTextKey(evt)
  {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
 
  }
  SubmitBeneficiary(event){
    event.preventDefault();
    var beneficaryArray=[];
    var id2 = this.state.uID;
    if (this.validateFormReq()) {
    var beneficiaryValue= 
    {
      "familyID"             : this.refs.familyID.value,          
      "beneficariesId"        : this.refs.beneficariesId.value,          
      "nameofbeneficaries"      : this.refs.nameofbeneficaries.value,
    };

    let fields = {};
    fields["familyID"] = "";
    fields["beneficariesId"] = "";
    fields["nameofbeneficaries"] = "";

    this.setState({
      "familyID"             :"",
      "beneficariesId"        :"",
      "nameofbeneficaries"      :"",   
      fields:fields
    });
    axios.post('/api/beneficiaries',beneficiaryValue)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
/*        this.getData(this.state.startRange, this.state.limitRange);
*/      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["familyID"]) {
        formIsValid = false;
        errors["familyID"] = "This field is required.";
      }     
       if (!fields["beneficariesId"]) {
        formIsValid = false;
        errors["beneficariesId"] = "This field is required.";
      }     
       if (!fields["nameofbeneficaries"]) {
        formIsValid = false;
        errors["nameofbeneficaries"] = "This field is required.";
      }     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }
  render() {
    const data = [{
    srno: 1,
    familyID: "PL00001",
    beneficariesId: "P11111",
    nameOfbeneficiary: "Priyanka Lewade",
    }
    ]
    const columns = [ 
      {
      Header: 'Sr No',
      accessor: 'srno',
      },
      {
      Header: 'Family ID',
      accessor: 'familyID',
      },
      {
      Header: 'Beneficiary ID',
      accessor: 'beneficariesId', 
      },
    {
      Header: 'Name of Beneficiary',
      accessor: 'nameOfbeneficiary', 
      },
    
      {
      Header: 'Action',
      accessor: 'Action',
      Cell: row => 
        (
        <div className="actionDiv col-lg-offset-2">
            <div className="col-lg-4" onClick={() => this.deleteData(row.original)}>
          <i className="fa fa-trash"> </i>
            </div>
            <div className="col-lg-4" onClick={() => this.updateData(row.original)}>
          <i className="fa fa-pencil"> </i>
            </div>
          </div>
          )     
        }
      ]


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Master Data                                        
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Create New Beneficiary</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Family ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="familyID" >
                            <select className="custom-select form-control inputBox" value={this.state.familyID} ref="familyID" name="familyID" onChange={this.handleChange.bind(this)} >
                              <option  className="hidden" >-- Select --</option>
                              <option>PL00001</option>
                              <option>PB09892</option>
                              
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.familyID}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Beneficiary ID</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="beneficariesId" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder=""value={this.state.beneficariesId} ref="beneficariesId" name="beneficariesId" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.beneficariesId}</div>
                        </div>
                        <div className=" col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Name of Beneficiary</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="nameofbeneficaries" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox nameParts"  placeholder="" value={this.state.nameofbeneficaries} ref="nameofbeneficaries" name="nameofbeneficaries" onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.nameofbeneficaries}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12">
                      <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Submit</button>
                    </div>
                  </form>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt " >  
                        <ReactTable 
                          data      = {data}
                          columns     = {columns}
                          sortable    = {true}
                          defaultPageSiz  = {5}
                          minRows     = {3} 
                          className       = {"-striped -highlight"}
                          showPagination  = {true}
                        />
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
export default Beneficiary