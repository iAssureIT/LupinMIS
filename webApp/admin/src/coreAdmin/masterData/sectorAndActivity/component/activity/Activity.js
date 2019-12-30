import React, { Component }     from 'react';
import $                        from 'jquery';
import axios                    from 'axios';
import ReactTable               from "react-table";
import swal                     from 'sweetalert';
import {Route, withRouter}      from 'react-router-dom';
import _                        from 'underscore';
import IAssureTable             from "../../../../IAssureTable/IAssureTable.jsx";
import "./Activity.css";

class Activity extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      fields                : {},
      errors                : {},
      "sector"              :"",
      "activityName"        :"",
      "academicData"        :[],
      "user_ID"             :"",
      "shown"               : true,
      "tabtype"             : "location", 
      "availableSectors"    : [],
      "tableHeading"        : {
        sector              : "Sector",
        activityName        : "Activity",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'patch',
        apiLink             : '/api/sectors/activity/delete/',
        paginationApply     : false,
        searchApply         : false,
        editUrl             : '/sector-and-activity/'
      },
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.activityId : '',
      "editSectorId"        : props.match.params ? props.match.params.sectorId : '',
    }
  }
 
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "sector"         : this.refs.sector.value,  
      "activityName"   : this.refs.activityName.value,  
    });
    this.setState({
      [event.target.name] : event.target.value
    });
    
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
    if($('#Activity').valid()){
    var activityValues = {
      "sector_ID"            : this.refs.sector.value.split('|')[1],
      "sector"               : this.refs.sector.value.split('|')[0],
      "activityName"         : this.refs.activityName.value,
      "user_ID"              : this.state.user_ID,
    };
    let fields            = {};
    fields["sector"]      = "";
    fields["activityName"]    = "";
    this.setState({
      activityName : '',
      sector       : '',
      fields       :fields
    })
  
    axios.patch('/api/sectors/activity', activityValues)
      .then((response)=>{
       this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
        
      })
      .catch(function(error){
        console.log("error ============== ",error);
      });
    }
  }
  updateActivity(event){
    event.preventDefault();
    if($('#Activity').valid()){

      var activityValues = {
        "sector_ID"            : this.refs.sector.value.split('|')[1],
        "sector"               : this.refs.sector.value.split('|')[0],
        "activity_ID"          : this.state.editId,
        "activityName"         : this.refs.activityName.value,
        "user_ID"              : this.state.user_ID,
      };
      axios.patch('/api/sectors/activity/update',activityValues)
        .then((response)=>{
          console.log("activityValues",activityValues);
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          
          this.setState({
            editId   : '',
            activityName : '',
            sector   : ''
          })
          this.props.history.push('/sector-and-activity');
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      let fields             = {};
      fields["sector"]       = "";
      fields["activityName"]     = "";
    
      this.setState({
        "sector"            : "",
        "activityName"      : "",
        fields              : fields
      });
    }
  }
 

  componentWillReceiveProps(nextProps){
    this.getAvailableSectors();
    var editId = nextProps.match.params.activityId;
    if(nextProps.match.params.activityId){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.edit(this.state.editSectorId);
        // console.log("editId",this.state.editId);    
      })      
    }    
    if(nextProps){
      this.getLength();
    }
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    $.validator.addMethod("regxtypeofCenter", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Activity Name.");


    $("#Activity").validate({
      rules: {
        sector: {
          required: true,
        },
        activityName: {
          required: true,
          regxtypeofCenter: /^[A-za-z']+( [A-Za-z']+)*$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "sector"){
          error.insertAfter("#sectorError");
        }
        if (element.attr("name") == "activityName"){
          error.insertAfter("#activityName");
        }
      }
    });
    this.getAvailableSectors();
    if(this.state.editId){      
      this.edit(this.state.editSectorId);
    }
    
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
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
  edit(id){
    var activity_id = this.props.match.params.activityId;
    // console.log('activity_id',activity_id);
    axios({
      method: 'get',
      url: '/api/sectors/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log("editData",editData)
      this.setState({
        "sector"        : editData.sector+'|'+editData._id,
        "activityName"      : ((editData.activity.filter((a)=>{return a._id == activity_id ? a.activityName : ''}))[0]).activityName,
        // "activityName"      :_.first(editData.activity.map((a, i)=>{console.log( a._id +"=="+ activity_id)})),
      },()=>{
        console.log('this.state', this.state.sector, this.state.activityName)
      });      
     
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
        console.log('dataCount', this.state.dataCount);
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
    axios.post('/api/sectors/activity/list', data)
    .then((response)=>{
      console.log("response", response.data);
      this.setState({
        tableData : response.data
      });
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getSearchText(searchText, startRange, limitRange){
      // console.log(searchText, startRange, limitRange);
      this.setState({
          tableData : []
      });
  }
  componentWillUnmount(){
    this.setState({
      "sector"   :"",
      "activityName" :"",
      "editId"   : ""
    })
  }
  render() {
    
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt"  id="Activity">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                <span className="subHeader"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Activity</span>
              </div>
              <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
              <div className="row">
                <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                  <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                    <label className="formLable">Sector</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorError" >
                      <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} disabled={this.state.editId?true:false} onChange={this.handleChange.bind(this)}>
                        <option  className="hidden" value="" >-- Select Sector--</option>
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
                  <div className=" col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable">Activity</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="activityName" >
                      
                      <input type="text" className="form-control inputBox "  placeholder="" name="activityName"  value={this.state.activityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} ref="activityName" />
                    </div>
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
            <div className="col-lg-12 mt ">
               <hr className=""/>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
              <div className="mt " >  
                <IAssureTable 
                  tableHeading={this.state.tableHeading}
                  twoLevelHeader={this.state.twoLevelHeader} 
                  dataCount={this.state.dataCount}
                  tableData={this.state.tableData}
                  getData={this.getData.bind(this)}
                  tableObjects={this.state.tableObjects}
                  getSearchText={this.getSearchText.bind(this)}
                  deleteMethod='patch'
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