import React, { Component }     from 'react';
import $                        from 'jquery';
import axios                    from 'axios';
import ReactTable               from "react-table";
import swal   from 'sweetalert';
import 'react-table/react-table.css';

import "./Activity.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Activity extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sector"              :"",
      "activityName"        :"",
      "academicData"        :[],
      "uID"                 :"",
      "shown"               : true,
      "tabtype" : "location",

      fields: {},
      errors: {}
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "sector"   : this.refs.sector.value,  
      "activityName"   : this.refs.activityName.value,  
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

  SubmitActivity(event){
    event.preventDefault();
    var activityArray=[];
    var id2 = this.state.uID;
    if (this.validateFormReq()) {
    var activityValues= 
    {
      "sector"   : this.refs.sector.value, 
      "activityName"   : this.refs.activityName.value,  
    };

    let fields = {};
    fields["sector"] = "";
    fields["activityName"] = "";
  
    this.setState({
      "sector"  :"",
      "activityName"      :"",
      fields:fields
    });
    axios.post('/api/sectors',activityValues)
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
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }     
      if (!fields["activityName"]) {
        formIsValid = false;
        errors["activityName"] = "This field is required.";
      }
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  componentDidMount() {
   
  }

  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }
  render() {
    const data = [{
      srno: 1,
      centerType: "Natural Resource Manangement",
      NameofCenter: "Water Resource Development",
      }
    ]
    const columns = [ 
      {
      Header: 'Sr No',
      accessor: 'srno',
      },
      {
      Header: 'Name of Sector',
      accessor: 'centerType',
      },
      {
      Header: 'Name of Activity',
      accessor: 'NameofCenter', 
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
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt"  id="activity">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Activity</span>
              </div>
              <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
              <div className="row">
                <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                  <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                    <label className="formLable">Select Sector Name</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                      <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.handleChange.bind(this)}>
                        <option  className="hidden" >-- Select --</option>
                        <option>Development Centre</option>
                        <option>CSR Centre</option>
                      </select>
                    </div>
                    <div className="errorMsg">{this.state.errors.sector}</div>
                  </div>
                  <div className=" col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable">Name of Activity</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="activityName" >
                      {/*<div className="input-group-addon inputIcon">
                        <i className="fa fa-graduation-cap fa"></i>
                      </div>*/}
                      <input type="text" className="form-control inputBox nameParts"  placeholder="" name="activityName"  value={this.state.activityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} ref="activityName" />
                    </div>
                    <div className="errorMsg">{this.state.errors.activityName}</div>
                  </div>
                </div> 
              </div><br/>
              <div className="col-lg-12">
                <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitActivity.bind(this)}> Submit</button>
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
      </div>
    );
  }
}
export default Activity