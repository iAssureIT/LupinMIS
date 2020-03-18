import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import {Route, withRouter}    from 'react-router-dom';
import Loader                 from "../../../../../common/Loader.js";
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";
import Unit                   from '../unit/Unit.js';

import "./SubActivity.css";

class SubActivity extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sector"              :"-- Select --",
      "activityName"        :"-- Select --",
      "subActivityName"     :"",
      "unit"                :"-- Select --",
      "familyUpgradation"   :"No",
      "user_ID"             :"",
      "unitList"           :"",
      "shown"               : true,
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        sector              : "Sector",
        activityName        : "Activity",
        subActivityName     : "Sub-Activity",
        unit                : "Unit",
        familyUpgradation   : "Family Upgradation",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'patch',
        apiLink             : '/api/sectors/subactivity/delete/',
        paginationApply     : false,
        searchApply         : false,
        editUrl             : '/sector-and-activity/'
      },
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.subactivityId : '',
      "editSectorId"        : props.match.params ? props.match.params.sectorId : '',
      "role"                : localStorage.getItem("role")
    }
  }
 componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
      $.validator.addMethod("regxsubActivityName", function(value, element, regexpr) {         
              return regexpr.test(value);
            }, "Please enter valid Sub-Activity Name.");


    $("#subActivityb").validate({
      rules: {
        sector: {
          required: true,
        },  
        unit: {
          required: true,
        },
        activityName: {
          required: true,
        },
        subActivityName: {
          required: true,
          regxsubActivityName:/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*( [a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "sector"){
          error.insertAfter("#sectorError");
        }
        if (element.attr("name") === "activityName"){
          error.insertAfter("#activityNameError");
        }
        if (element.attr("name") === "unit"){
          error.insertAfter("#unitError");
        }
        if (element.attr("name") === "subActivityName"){
          error.insertAfter("#subActivityNameError");
        }
      }
    });
    this.setState({
      user_ID : localStorage.getItem('user_ID')
    })
    this.getAvailableSectors();
    if(this.state.editId){     
      this.getAvailableActivity(this.state.editSectorId);
      this.edit(this.state.editSectorId, this.state.editId);
    }
    this.getLength();
    this.getUnits();

    this.getData(this.state.startRange, this.state.limitRange);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      "sector"               :this.refs.sector.value,
      "activityName"         :this.refs.activityName.value,
      "subActivityName"      :this.refs.subActivityName.value,
      "unit"                 :this.refs.unit.value,
    });
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
  submitSubActivity(event){
    event.preventDefault();
    if($('#subActivityb').valid()){
    var subActivityValues = {
      "sector_ID"            :this.refs.sector.value.split('|')[1],
      "sector"               :this.refs.sector.value.split('|')[0],
      "activity_ID"          :this.refs.activityName.value.split('|')[1],
      "activityName"         :this.refs.activityName.value.split('|')[0],
      "subActivityName"      :this.refs.subActivityName.value,
      "unit"                 :this.state.unit,
      "familyUpgradation"    :this.state.familyUpgradation,
      // "user_ID"              :this.state.user_ID,
    };
    
   
    this.setState({
      "sector"                :"-- Select --",
      "activityName"          :"-- Select --",
      "subActivityName"       :"",      
      "unit"                  :"-- Select --",
      "availableActivity"     :[],
    });
    axios.patch('/api/sectors/subactivity',subActivityValues)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }
  updateSubActivity(event){
    event.preventDefault();

    if($('#subActivityb').valid()){
    var subActivityValues = {
      "sector_ID"            : this.refs.sector.value.split('|')[1],
      "sector"               : this.refs.sector.value.split('|')[0],
      "activity_ID"          : this.refs.activityName.value.split('|')[1],
      "activityName"         : this.refs.activityName.value.split('|')[0],
      "subactivity_ID"       : this.state.editId,
      "subActivityName"      : this.refs.subActivityName.value.split('|')[0],
      "unit"                 : this.state.unit,
      "familyUpgradation"    : this.state.familyUpgradation,
    };
    axios.patch('/api/sectors/subactivity/update',subActivityValues)
      .then((response)=>{
        this.setState({
          "sector"                :"-- Select --",
          "activityName"          :"-- Select --",
          "subActivityName"       :"",      
          "unit"                  :"-- Select --",
          "availableActivity"     :[],
          editId : ''
        },()=>{
         this.props.history.push('/sector-and-activity');
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      }); 
    } 
  }
 
  componentWillReceiveProps(nextProps){
    this.getAvailableSectors();
    var editId = nextProps.match.params.subactivityId;

    if(nextProps.match.params.subactivityId){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.getAvailableActivity(this.state.editSectorId);
        this.edit(this.state.editSectorId);
      })    
    }
    if(nextProps){
      this.getLength();
    }
  }

 
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
        console.log("error = ",error);
      });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_id = event.target.value.split('|')[1];
    this.handleChange(event);
    this.getAvailableActivity(sector_id);
  }
  getAvailableActivity(sector_id){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_id,
    }).then((response)=> {

        this.setState({
          availableActivity : response.data[0].activity
        },()=>{})
    }).catch(function (error) {
        console.log("error = ",error);
      });
  }

edit(id){
    $('label.error').html('')
    var activity_id = this.props.match.params.activityId;
    var subactivity_id = this.props.match.params.subactivityId;
      axios({
        method: 'get',
        url: '/api/sectors/'+id,
      }).then((response)=> {
        if(response){
        var editData = response.data[0];
    
        var activityName = '';
        var subActivityName = '';
        var unit = '';
        var familyUpgradation = '';
        if(editData.activity&&editData.activity.length>0){
          editData.activity.map((a,i)=>{
            if(activity_id === a._id){
              activityName = a.activityName+'|'+a._id;
              if(a.subActivity&&a.subActivity.length>0){
                a.subActivity.map((b,j)=>{
                  if(subactivity_id === b._id){
                    subActivityName = b.subActivityName;
                    unit = b.unit;
                    familyUpgradation = b.familyUpgradation;
                  }
                })
              }
            }
          })
        }

        this.setState({
          "sector"                : editData.sector+'|'+editData._id,
          "activityName"          : activityName,
          "subActivityName"       : subActivityName,
          "unit"                  : unit,
          "familyUpgradation"     : familyUpgradation,
        });
      }
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        this.setState({
          errors: errors
        });
      return formIsValid;
      }).catch(function (error) {
        console.log("error = ",error);
      });
  }
  getLength(){
    axios.get('/api/sectors/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
    
  getData(startRange, limitRange){
      var data = {
      startRange : startRange,
      limitRange : limitRange
    }

  $(".fullpageloader").show();
    axios.post('/api/sectors/subactivity/list', data)
    .then((response)=>{
      $(".fullpageloader").hide();
      var tableData = response.data.map((a, i)=>{
          return {
            _id               : a._id,
            sector            : a.sector,
            activityName      : a.activityName,
            subActivityName   : a.subActivityName,
            unit              : a.unit,
            familyUpgradation : a.familyUpgradation,
          }
        })
      this.setState({
        tableData : tableData
      });
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getUnits(){
    axios.get('/api/units/list')
    .then((unitList)=>{
      this.setState({
        unitList : unitList.data
      });
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  getToggleValue(event){
    if(this.state.familyUpgradation === "No"){
      this.setState({
        familyUpgradation : "Yes",
      })
    }else if(this.state.familyUpgradation === "Yes"){
      this.setState({
        familyUpgradation : "No",
      })
    }
  }
  componentWillUnmount(){
    this.setState({
      "sector"              :"",
      "activityName"        :"",
      "subActivityName"     :"",
      "unit"                : 0, 
      "familyUpgradation"   :"No",
      "editId" : ""
    })
  }
  render() {
    return (
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper">
            {this.state.role !== "viewer" ?
            <React.Fragment>
              <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="subActivityb">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                  <span className="subHeader"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sub-Activity</span>
                </div>
                <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Sector</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorError" >
                        <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} disabled={this.state.editId?true:false} onChange={this.selectSector.bind(this)}>
                          <option disabled="disabled" selected="true">-- Select --</option>
                          {
                          this.state.availableSectors && this.state.availableSectors.length >0 ?
                          this.state.availableSectors.map((data, index)=>{
                            return(
                              <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                            );
                          })
                          :
                          null
                        }
                        </select>
                      </div>
                    </div>
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Activity</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activityNameError" >
                        <select className="custom-select form-control inputBox" ref="activityName" name="activityName" value={this.state.activityName} disabled={this.state.editId?true:false} onChange={this.handleChange.bind(this)} >
                          <option disabled="disabled" selected="true" >-- Select --</option>
                          {
                          this.state.availableActivity && this.state.availableActivity.length >0 ?
                          this.state.availableActivity.map((data, index)=>{
                            if(data.activityName ){
                              return(
                                <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                              );
                            }
                          })
                          :
                          null
                        }
                        </select>
                      </div>
                    </div>

                    <div className=" col-md-4 col-sm-6 col-xs-12 "  >
                      <label className="formLable">Sub-Activity</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main  " id="subActivityNameError" >
                        {/*<div className="input-group-addon inputIcon">
                          <i className="fa fa-graduation-cap fa"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox " ref="subActivityName" name="subActivityName" value={this.state.subActivityName} onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <div className=" col-md-12 col-sm-6 col-xs-12 ">
                     
                    </div>
                  </div>

                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                 <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group valid_box" >
                      <label className="pghdr">Unit<span className="asterix">*</span></label>
                        <div className="input-group inputBox-main nameParts" id="unitError">
                          <select className="custom-select form-control inputBox" ref="unit" name="unit" value={this.state.unit} onChange={this.handleChange.bind(this)} >
                            <option  disabled="disabled" selected="true" >-- Select --</option>
                            {
                            this.state.unitList && this.state.unitList.length >0 ?
                            this.state.unitList.map((data, index)=>{
                              return(
                                <option key={data._id} value={data.unit}>{data.unit}</option>
                              );
                              
                            })
                            :
                            null
                           }
                         </select>
                          <div className="input-group-addon inputIcon" title="Add Unit"><Unit/></div>
                        </div>
                      </div>
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
                  </div> 
                </div><br/>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                  {
                    this.state.editId ? 
                    <button className=" col-lg-2 btn submit pull-right" onClick={this.updateSubActivity.bind(this)}> Update </button>
                    :
                    <button className=" col-lg-2 btn submit pull-right" onClick={this.submitSubActivity.bind(this)}> Submit </button>
                  }
                </div> 
              </form>             
              <div className="col-lg-12 mt">
                 <hr className=""/>
              </div>
              </React.Fragment>
              :null
            }
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                <IAssureTable 
                  tableName = "SubActivity"
                  id = "SubActivity"
                  tableHeading={this.state.tableHeading}
                  twoLevelHeader={this.state.twoLevelHeader} 
                  dataCount={this.state.dataCount}
                  tableData={this.state.tableData}
                  getData={this.getData.bind(this)}
                  tableObjects={this.state.tableObjects}
                  getSearchText={this.getSearchText.bind(this)}
                 
                />
              </div>              
            </div>
          </div>
      </div>
    );

  }

}
export default withRouter(SubActivity);