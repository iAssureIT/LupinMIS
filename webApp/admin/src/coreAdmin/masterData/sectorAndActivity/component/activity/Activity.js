import React, { Component }     from 'react';
import $                        from 'jquery';
import axios                    from 'axios';
import ReactTable               from "react-table";
import swal                     from 'sweetalert';
import {Route, withRouter}      from 'react-router-dom';
import _                        from 'underscore';
import IAssureTable             from "../../../../IAssureTable/IAssureTable.jsx";
import "./Activity.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class Activity extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sector"              :"",
      "activity"            :"",
      "academicData"        :[],
      "user_ID"             :"",
      "shown"               : true,
      "tabtype"             : "location",
      "availableSectors"    : [],
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        sector              : "Name of Sector",
        activity            : "Name of Activity",
        actions             : 'Action',
      },
      "tableObjects"        : {
        apiLink             : '/api/sectors/activity/delete',
        editUrl             : '/sector-and-activity/'
      },
      "startRange"          : 0,
      "limitRange"          : 10,
      "editId"              : props.match.params ? props.match.params.sector_id : ''
    }
  }
 
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "sector"     : this.refs.sector.value,  
      "activity"   : this.refs.activity.value,  
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }

  isTextKey(evt){
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

  submitActivity(event){
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()) {
    var activityValues = {
      "sector_ID"            :this.refs.sector.value.split('|')[1],
      "sector"               :this.refs.sector.value.split('|')[0],
      "activity"             :this.refs.activity.value,
      "user_ID"              : this.state.user_ID,
    };
    let fields            = {};
    fields["sector"]      = "";
    fields["activity"]    = "";
  
    this.setState({
      "sector"        :"",
      "activity"      :"",
      fields          :fields
    });
    axios.patch('/api/sectors/activity',activityValues)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }
  }

  updateActivity(event){
    event.preventDefault();
    if(this.refs.sector.value =="" || this.refs.activity.value=="" )
    {
      console.log('state validation');
      if (this.validateFormReq() && this.validateForm()) {
      }
    }else{
      var activityValues = {
      "sector_ID"            :this.refs.sector.value.split('|')[1],
      "sector"               :this.refs.sector.value.split('|')[0],
      "activity_ID"          :this.state.editId,
      "activity"             :this.refs.activity.value.split('|')[0],
      "user_ID"              : this.state.user_ID,
      };
      
      axios.patch('/api/sectors/activity/update',activityValues, this.state.editId)
        .then(function(response){
          swal({
            title : response.data,
            text  : response.data
          });
          this.getData(this.state.startRange, this.state.limitRange);
          this.setState({
            editId : ''
          })
          this.props.history.push('/sector-and-activity');
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      let fields             = {};
      fields["sector"]       = "";
      fields["activity"]     = "";
    
      this.setState({
        "sector"        :"",
        "activity"      :"",
        fields          :fields
      });
    }
    window.location.reload(true);
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }     
      if (!fields["activity"]) {
        formIsValid = false;
        errors["activity"] = "This field is required.";
      }
      this.setState({
        errors: errors
      });
      return formIsValid;
  }   
  
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.sector_id;
    if(nextProps.match.params.sector_id){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);
      })
      
    }
  }

  componentDidMount() {
    this.getAvailableSectors();
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
      var tableData = _.flatten(response.data.map((a, index)=>{
        return a.activity.map((b, i)=>{
          return {
            _id     : a._id+'/'+b._id,
            sector  : a.sector,
            activity: b.activity 
          }
        })
      }))

      this.setState({
        dataCount : tableData.length,
        tableData : tableData.slice(this.state.startRange, this.state.limitRange),
        editUrl   : this.props.match.params
      },()=>{
        
      });
      
    }).catch(function (error) {
      console.log('error', error);
    });

    // var tableDatas = [{
    //       "_id" : "sector_id",
    //       "sector": "Development Centre",
    //       "activity": [
    //           {
    //               "subactivity": [
    //                   {
    //                     "_id" : "SubactivityId1",
    //                     "subactivity" : "Subactivity 1",
    //                     "unit" : 1,
    //                     "familyUpgradation" : 'Yes'
    //                   },
    //                   {
    //                     "_id" : "SubactivityId2",
    //                     "subactivity" : "Subactivity 2",
    //                     "unit" : 2,
    //                     "familyUpgradation" : 'No'
    //                   }
    //               ],
    //               "activity": "Rural Area Development",
    //               "_id" : "activityid1"
    //           },
    //           {
    //               "subactivity": [
    //                   {
    //                     "_id" : "SubactivityId31",
    //                     "subactivity" : "Subactivity 31",
    //                     "unit" : 13,
    //                     "familyUpgradation" : 'Yes'
    //                   },
    //                   {
    //                     "_id" : "SubactivityId14",
    //                     "subactivity" : "Subactivity 14",
    //                     "unit" : 41,
    //                     "familyUpgradation" : 'No'
    //                   }
    //               ],
    //               "activity": "Urban Area Development",
    //               "_id" : "activityid2"
    //           },
    //           {
    //               "subactivity": [
    //                   {
    //                     "_id" : "SubactivityId5",
    //                     "subactivity" : "Subactivity 5",
    //                     "unit" : 5,
    //                     "familyUpgradation" : 'Yes'
    //                   },
    //                   {
    //                     "_id" : "SubactivityId6",
    //                     "subactivity" : "Subactivity 6",
    //                     "unit" : 6,
    //                     "familyUpgradation" : 'No'
    //                   }
    //               ],
    //               "activity": "Farmer Development",
    //               "_id" : "activityid3"
    //           }
    //       ],
    //   }];
      
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
      console.log('error', error);
    });
  }
  edit(id){
    var activityId = this.props.match.params.activityId;
    axios({
      method: 'get',
      url: '/api/sectors/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      
      this.setState({
        "sector"                : editData.sector+'|'+editData._id,
        "activity"          :_.first(editData.activity.map((a, i)=>{return a._id == activityId ? a.activity : ''})),
      },()=>{
      });
    }).catch(function (error) {
    });
  }
  
  getData(startRange, limitRange){
    // axios({
    //   method: 'get',
    //   url: '/api/sectors/list',
    // }).then((response)=> {
    //     var tableData = response.data.map((a, index)=>{return});
    //     this.setState({
    //     tableData : tableData.slice(startRange, limitRange),
    //   });
    // }).catch(function (error) {
    //     console.log('error', error);
    // });
  }
  getSearchText(searchText, startRange, limitRange){
      // console.log(searchText, startRange, limitRange);
      this.setState({
          tableData : []
      });
  }
  componentWillUnmount(){
    this.setState({
      "sector"              :"",
      "activity"        :"",
      "editId" : ""
    })
  }
  render() {
   
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt"  id="Activity">
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
                        <option  className="hidden" >-- Select Sector--</option>
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
                    <div className="errorMsg">{this.state.errors.sector}</div>
                  </div>
                  <div className=" col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable">Name of Activity</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="activity" >
                      {/*<div className="input-group-addon inputIcon">
                        <i className="fa fa-graduation-cap fa"></i>
                      </div>*/}
                      <input type="text" className="form-control inputBox nameParts"  placeholder="" name="activity"  value={this.state.activity} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} ref="activity" />
                    </div>
                    <div className="errorMsg">{this.state.errors.activity}</div>
                  </div>
                </div> 
              </div><br/>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                {
                  this.state.editId ? 
                  <button className=" col-lg-2 btn submit pull-right" onClick={this.updateActivity.bind(this)}> Update </button>
                  :
                  <button className=" col-lg-2 btn submit pull-right" onClick={this.submitActivity.bind(this)}> Submit </button>
                }
              </div> 
            </form>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt " >  
                <IAssureTable 
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
      </div>
    );
  }
}
export default withRouter(Activity);