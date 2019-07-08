import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./Beneficiary.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Beneficiary extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "familyID"            :"",
      "beneficariesId"      :"",
      "nameofbeneficaries"  :"",
      "fields"              : {},
      "errors"              : {},
      "tableHeading"        : {
        familyID            : "Family ID",
        beneficariesId      : "Beneficiary ID",
        nameofbeneficaries  : "Name of Beneficiary",
        actions             : 'Action',
      },
      "tableObjects"              : {
        apiLink                   : '/api/beneficiaries/'
      },
      "startRange"          : 0,
      "limitRange"          : 10,
/*      "editId"              : this.props.match.params ? this.props.match.params.id : ''
*/    }
/*    console.log('params', this.props.match.params);*/ 
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
      "familyID"             : this.refs.familyID.value,          
      "beneficariesId"       : this.refs.beneficariesId.value,          
      "nameofbeneficaries"   : this.refs.nameofbeneficaries.value,
      
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
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
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
      "beneficariesId"       : this.refs.beneficariesId.value,          
      "nameofbeneficaries"   : this.refs.nameofbeneficaries.value,
    };

    let fields = {};
    fields["familyID"]           = "";
    fields["beneficariesId"]     = "";
    fields["nameofbeneficaries"] = "";

    this.setState({
      "familyID"                :"",
      "beneficariesId"          :"",
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

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
    }
  }

  componentDidMount() {
    console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    axios({
      method: 'get',
      url: '/api/beneficiaries/list',
    }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return});
      this.setState({
        tableData : response.data,
      },()=>{
        
      });
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/beneficiaries'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      
      this.setState({
        "familyID"             : editData.familyID,          
        "beneficariesId"       : editData.beneficariesId,          
        "nameofbeneficaries"   : editData.nameofbeneficaries,
      },()=>{
        
      });
    }).catch(function (error) {
    });
  }
  
  getData(startRange, limitRange){
    axios({
      method: 'get',
      url: '/api/beneficiaries/list',
    }).then((response)=> {
        this.setState({
        tableData : response.data,
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
                            <input type="text" className="form-control inputBox nameParts"  placeholder="" value={this.state.nameofbeneficaries} ref="nameofbeneficaries" name="nameofbeneficaries" onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)} />
                          </div>
                          <div className="errorMsg">{this.state.errors.nameofbeneficaries}</div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      {
                        this.state.editId ? 
                        <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Update </button>
                        :
                        <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitBeneficiary.bind(this)}> Submit </button>
                      }
                    </div> 
                  </form>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
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
export default Beneficiary