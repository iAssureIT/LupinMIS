import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./SectorMapping.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class SectorMapping extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "goalName"           :"",
      "goalType"           :"",
      "sector"             :"",
      "activity"           :"",
      "uID"                :"",
      "activityName"       :"",
      "selectedActivities" :[],
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        type               : "Type of Goal/Project",
        goal               : "Goal /Project Name",
        sectorName         : "Sector",
        activityName       : "Activity", 
        actions            : 'Action',
      },
      "tableObjects"       : {
        apiLink            : '/api/sectorMappings/',
        paginationApply    : true,
        searchApply        : true,
        editUrl            : '/sector-mapping/'
      },
      "startRange"         : 0,
      "limitRange"         : 10,
      "editId"             : this.props.match.params ? this.props.match.params.sectorMappingId : '',
      "editSectorId"        : props.match.params ? props.match.params.sectorId : '',
    }
    console.log('params', this.props.match.params); 
  }

 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "goalName"               : this.refs.goalName.value,          
      "goalType"               : this.refs.goalType.value,          
      "selectedActivities"     : this.state.selectedActivities,          
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
  Submit(event){
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()) {
      if (this.state.selectedActivities==""){      
        swal({
          title: 'abc',
          text: "Please select any Activity",
          button: true,
        });
      }else{        
        var mappingValues= 
        {     
          "goal"   : this.refs.goalName.value,          
          "type"   : this.refs.goalType.value,          
          "sector" : this.state.selectedActivities,                  
        };
        let fields = {};
        fields["goalName"]  = "";
        fields["goalType"]  = "";
        axios.post('/api/sectorMappings',mappingValues)
          .then((response)=>{
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.getData(this.state.startRange, this.state.limitRange);
          })
          .catch(function(error){
            console.log("error = ",error);
          });
        this.setState({
          "goalName"           :"",
          "goalType"           :"",
          "selectedActivities" :[],
          fields               :fields
        });
        $('input[type=checkbox]').attr('checked', false);
      }
    }  
  }
  Update(event){
    event.preventDefault();
    if(this.refs.goalName.value == "" || this.refs.goalType.value =="")
   {
      if (this.validateFormReq() && this.validateForm()){
      }
    }else{
    var id2 = this.state.uID;
    var mappingValues= 
    {     
      "sectorMapping_ID"    :this.state.editId,
      "goal"                :this.refs.goalName.value,
      "type"                : this.refs.goalType.value,          
      "sector"              : this.state.selectedActivities,                  
    };
    let fields = {};
    fields["goalName"]  = "";
    fields["goalType"]  = "";

    axios.patch('/api/sectorMappings/update',mappingValues)
      .then(function(response){
        swal({
          title : response.data.message,
          text  : response.data.message
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      this.setState({
        "goalName"           :"",
        "goalType"           :"",
        "selectedActivities" :[],
        fields               :fields
      });
      $('input[type=checkbox]').attr('checked', false);
    }   
    $('input[type=checkbox]').attr('checked', false);
    this.props.history.push('/sector-mapping');
    this.setState({
      "editId"              : "",
    });
  }

  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
    
      if (!fields["goalName"]) {
        formIsValid = false;
        errors["goalName"] = "This field is required.";
      }     
      if (!fields["goalType"]) {
        formIsValid = false;
        errors["goalType"] = "This field is required.";
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
    $("html,body").scrollTop(0);
    
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.sectorMappingId;
    if(nextProps.match.params.sectorMappingId){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.edit(this.state.editId);
      })
      
      this.getAvailableSector(this.state.editId);
    console.log("editId",this.state.editId);
    }
  }

  componentDidMount() {
    console.log("editId",this.state.editId);
    var editId = this.props.match.params.sectorMappingId;
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableSector(this.state.editSectorId);  
  }

  edit(id){
    console.log('id',id);
    axios({
      method: 'get',
      url: '/api/sectorMappings/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      editData.sector.map((a, i)=>{
        this.setState({
          [a.sector_ID +"|"+a.sectorName+"|"+a.activity_ID+"|"+a.activityName] : true
        })
      })
      this.setState({
        "goalName"                :editData.goal,        
        "goalType"                :editData.type,      
        "selectedActivities"      :editData.sector, 
      });
    }).catch(function (error) {
    });
  }
  
  getData(startRange, limitRange){
     var data = {
      limitRange : limitRange,
      startRange : startRange,
      }
       axios.post('/api/sectorMappings/list',data)
      .then((response)=>{
        // console.log('response', response.data);
        this.setState({
          tableData : response.data
        })
      })
      .catch(function(error){        
      });
  }

  selectActivity(event){
    var selectedActivities = this.state.selectedActivities;

    var value = event.target.checked;
    var id    = event.target.id;

    this.setState({
      [id] : value
    },()=>{
      console.log('activityName', this.state[id], id);
      if(this.state[id] == true){
        selectedActivities.push({
          sector_ID  :id.split("|")[0],
          sectorName: id.split("|")[1],
          activity_ID:id.split("|")[2],
          activityName   : id.split("|")[3]
        });
        this.setState({
          selectedActivities : selectedActivities
        });
        console.log('selectedActivities', selectedActivities);
      }else{
        var index = selectedActivities.findIndex(v => v.activityName === id);
        // console.log('index', index);
        selectedActivities.splice(selectedActivities.findIndex(v => v.activityName === id), 1);
        this.setState({
          selectedActivities : selectedActivities
        },()=>{
          console.log('selectedActivities',this.state.selectedActivities);
        });
      }
    });      
  }

  getAvailableSector(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {        
        this.setState({
          availableSectors : response.data
        })
      // console.log('availableSectors',this.state.availableSectors);
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  render() {
    return(
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
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="sectorMapping">                   
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Sector Mapping</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Type of Goal/Project</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                            <select className="custom-select form-control inputBox" ref="goalType" name="goalType" value={this.state.goalType} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              <option>SDG Goal</option>
                              <option>ADP Goal</option>
                              <option>Empowerment Line Goal</option>
                              <option>Project Name</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.goalType}</div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                          <label className="formLable">Enter Goal / Project Name</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="goalName" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox" value={this.state.goalName} onChange={this.handleChange.bind(this)} onKeyDown={this.isTextKey.bind(this)}  placeholder="" name="goalName" ref="goalName" />
                          </div>
                          <div className="errorMsg">{this.state.errors.goalName}</div>
                        </div>
                        <div className=" col-md-12 col-sm-6 col-xs-12 ">
                         
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above {this.state.goalType}</label></div>
                    <div className="">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable">
                        <div >
                          <div >
                            {
                              this.state.availableSectors ?
                              this.state.availableSectors.map((data, index)=>{
                                // console.log('data', data);
                                return(
                                  <div key={index} className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 noPadding">
                                    <label  className="formLable faintColor">{data.sector}</label>
                                    {
                                      data.activity.map((a, i)=>{
                                        return(
                                          <div key ={i} className="col-lg-12 col-sm-12 col-xs-12 ">
                                            <div className="row"> 
                                              <div className="actionDiv" id="activityName">
                                                <div className="SDGContainer col-lg-1">
                                                  <input type="checkbox" name="activityName" className ="activityName" id={data._id +"|"+data.sector+"|"+a._id+"|"+a.activityName}  checked={this.state[data._id +"|"+data.sector+"|"+a._id+"|"+a.activityName]?true:false} onChange={this.selectActivity.bind(this)} />
                                                  <span className="SDGCheck"></span>
                                                </div>
                                              </div>                            
                                              <label className="listItem">{a.activityName}</label>
                                            </div>  
                                          </div>
                                        );
                                      })
                                    }
                                  </div>
                               
                                );
                              })
                              :
                              null
                            }
                          </div>                          
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      {
                        this.state.editId ? 
                        <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                        :
                        <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Submit.bind(this)}> Submit </button>
                      }
                    </div> 
                  </form>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
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
export default SectorMapping