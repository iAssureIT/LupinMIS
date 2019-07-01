import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";

import 'react-table/react-table.css';
import "./SubActivity.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';


class SubActivity extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sectorName"         :"",
      "activityName"       :"",
      "subActivityName"    :"",
      "unit"               :"Number", //to be Changes
      "upgradation"        :"No",
      "outreach"           :"No",
      "academicData"        :[],
      "uID"                 :"",
      "shown"               : true,
            "tabtype" : "location",
      fields: {},
      errors: {}
    }
  this.changeTab = this.changeTab.bind(this); 
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "sectorName"           :this.refs.sectorName.value,
      "activityName"         :this.refs.activityName.value,
      "subActivityName"      :this.refs.subActivityName.value,
      "unit"                 :this.state.unit,
      "outreach"             :this.state.outreach,
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  /*  if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }*/
  }

  componentWillReceiveProps(nextProps){
    console.log('nextProps',nextProps);
    if(nextProps.BasicInfoId){
       if(nextProps.BasicInfoId.academicsInfo&&nextProps.BasicInfoId.academicsInfo.length>0){
        this.setState({
         academicData:nextProps.BasicInfoId.academicsInfo
        })
      }
    }
  }

  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
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
  SubmitSubActivity(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    // if (this.validateForm()) {
    var subActivityValues= 
    {
      sector               :this.refs.sectorName.value,
      activityName         :this.refs.activityName.value,
      subactivityName      :this.refs.subActivityName.value,
      unit                 :this.state.unit,
      familyUpgradation    :this.state.upgradation,
      outreach             :this.state.outreach,
    };
    
    let fields = {};
    fields["sectorName"] = "";
    fields["activityName"] = "";
    fields["subActivityName"] = "";
    fields["unit"] = "";
    this.setState({
      "sectorName"         :"",
      "activityName"       :"",
      "subActivityName"    :"",
      
      fields:fields
    });
      axios.post('/api/sectors', subActivityValues)
      .then( (res)=>{
        console.log(res);
        if(res.status == 201){
          alert("Data inserted Successfully!")
          this.refs.sectorName.value = '';
          this.refs.activityName.value= ''; 
          this.refs.subActivityName.value= ''; 
        }
      })
      .catch((error)=>{
        console.log("error = ",error);
        alert("Something went wrong! Please check Get URL.");
      });
  }


    changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
    console.log("tabtype",this.state.tabtype);
    }
    getToggleValue(event){
      if(this.state.upgradation === "No"){
        this.setState({
          upgradation : "Yes",
        })
      }else if(this.state.upgradation === "Yes"){
        this.setState({
          upgradation : "No",
        })
      }

    }
    getOutreachValue(event){
       if(this.state.outreach === "No"){
        this.setState({
          outreach : "Yes",
        })
      }else if(this.state.outreach === "Yes"){
        this.setState({
          outreach : "No",
        })
      }
    }

    render() {
      console.log(this.state.upgradation);
      const data = [{
      srno: 1,
      centerType: "Natural Resource Manangement",
      NameofCenter: "Water Resource Development",
      Activity: "Pune",
      subActivity: "Check Dam Construction",
      Unit: "Number",
      Upgradation: "YES",
      Outreach: "YES",
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
        accessor: 'Activity', 
        },
        {
        Header: 'Name of Sub-Activity',
        accessor: 'subActivity', 
        },
        {
        Header: 'Unit',
        accessor: 'Unit', 
        },
        {
        Header: 'Family Upgradation',
        accessor: 'Upgradation', 
        },
        { 
        Header: 'Outreach',
        accessor: 'Outreach', 
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
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
              <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sub-Activity</span>
            </div>
            <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Select Sector Name</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorName" >
                        <select className="custom-select form-control inputBox" ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.handleChange.bind(this)}>
                          <option  className="hidden" >-- Select --</option>
                          <option>Development Centre</option>
                          <option>CSR Centre</option>
                        </select>
                      </div>
                    </div>
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Select Activity Name</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                        <select className="custom-select form-control inputBox"ref="activityName" name="activityName" value={this.state.activityName} onChange={this.handleChange.bind(this)} >
                          <option  className="hidden" >-- Select --</option>
                          <option>Water Resource Development</option>
                          <option>Solar Light</option>
                          <option>Capacity Building</option>
                        </select>
                      </div>
                    </div>

                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Name of Sub-Activity</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="subActivity" >
                        {/*<div className="input-group-addon inputIcon">
                          <i className="fa fa-graduation-cap fa"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox nameParts" ref="subActivityName" name="subActivity" value={this.state.subActivityName} onChange={this.handleChange.bind(this)} />
                      </div>
                      <div className="errorMsg">{this.state.errors.subActivityName}</div>
                    </div>
                    <div className=" col-md-12 col-sm-6 col-xs-12 ">
                     
                    </div>
                  </div> 
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                     <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <div className="col-lg-12 col-sm-12 col-xs-12 unit" id="unit" >
                        <label className="formLable">Unit :</label> <label className="formLable">{this.state.unit}</label>

                      </div>
                      <div className="errorMsg">{this.state.errors.Qualification}</div>
                    </div>
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 " >
                      <label className="formLable">Family Upgradation</label><span className="asterix">*</span>
                       <div className="can-toggle genderbtn demo-rebrand-2 " onChange={this.getToggleValue.bind(this)}>
                          <input id="d" type="checkbox"/>
                          <label className="formLable" htmlFor="d">
                          <div className="can-toggle__switch" data-checked="Yes"  data-unchecked="No" ></div>
                            <div className="can-toggle__label-text"></div>
                          </label>
                        </div>
                    </div>
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable"> Outreach</label><span className="asterix">*</span>
                       <div className="can-toggle genderbtn demo-rebrand-2 " onChange={this.getOutreachValue.bind(this)}>
                          <input id="o" type="checkbox"/>
                          <label className="formLable" htmlFor="o">
                          <div className="can-toggle__switch" data-checked="Yes"  data-unchecked="No" ></div>
                            <div className="can-toggle__label-text"></div>
                          </label>
                        </div>
                    </div>
                  </div> 
                </div><br/>
                <div className="col-lg-12">
                  <br/><button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitSubActivity.bind(this)}> Submit</button>
                </div>
              </form>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt " >  
                  <ReactTable 
                    data            = {data}
                    columns         = {columns}
                    sortable        = {true}
                    defaultPageSiz  = {5}
                    minRows         = {3} 
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
export default SubActivity