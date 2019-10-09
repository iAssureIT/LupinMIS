import React, { Component }   from 'react';
import $                      from 'jquery';
import moment                 from 'moment';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./ProjectMapping.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class ProjectMapping extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "startDate"          : "",
      "endDate"            : "",
      "projectName"        : "",
      "projectType"        : "",
      "sector"             : "",
      "activity"           : "",
      "uID"                : "",
      "activityName"       : "",
      "selectedActivities" : [],
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        type               : "Type of Project",
        // goal               : "Project Name",
        projectName        : "Project Name",
        startDate          : "Start Date",
        endDate            : "End Date",
        activityName       : "Activity", 
        actions            : 'Action',
      },
      "tableObjects"       : {
        deleteMethod       : 'delete',
        apiLink            : '/api/projectMappings/',
        paginationApply    : true,
        searchApply        : true,
        editUrl            : '/project-mapping/'
      },
      "startRange"         : 0,
      "limitRange"         : 10,
      "editId"             : this.props.match.params ? this.props.match.params.projectMappingId : '',
    }
  }

 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "projectName"               : this.refs.projectName.value,          
      "projectType"               : this.refs.projectType.value,          
      "startDate"                 : this.refs.startDate.value,          
      "endDate"                   : this.refs.endDate.value,          
      "selectedActivities"        : this.state.selectedActivities,          
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


  handleFromChange(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    var dateVal = event.target.value;
    var dateUpdate = new Date(dateVal);
    var startDate = moment(dateUpdate).format('YYYY-MM-DD');
    this.setState({
       [name] : event.target.value,
       startDate:startDate
    },()=>{
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
    console.log("dateUpdate",this.state.startDate);
 });
     // localStorage.setItem('newFromDate',dateUpdate);
  }
  handleToChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;

      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var endDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
         [name] : event.target.value,
         endDate : endDate
      },()=>{
      console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
     });
     // localStorage.setItem('newToDate',dateUpdate);
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
    var selectedActivities = this.state.selectedActivities;
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
          "projectName"  : this.refs.projectName.value,          
          "type_ID"      : this.refs.projectType.value,           
          "startDate"    : this.refs.startDate.value,          
          "endDate"      : this.refs.endDate.value,              
          "sector"       : this.state.selectedActivities,                  
        };
        let fields = {};
        fields["projectName"]  = "";
        fields["projectType"]  = "";
        fields["startDate"]    = "";
        fields["endDate"]      = "";
        axios.post('/api/projectMappings',mappingValues)
          .then((response)=>{
            console.log("response",response)
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.getData(this.state.startRange, this.state.limitRange);
          })
          .catch(function(error){
            console.log("error = ",error);
          });
        selectedActivities.map((a, index)=>{
          this.setState({
            [a.sector_ID +"|"+a.sectorName+"|"+a.activity_ID+"|"+a.activityName] : false
          })
        })
        this.setState({
          "projectName"           :"",
          "projectType"           :"",
          "startDate"             :"",
          "endDate"               :"",
          "selectedActivities"    :[],
          fields                  :fields
        });
        
      }
    }  
  }
  Update(event){
    event.preventDefault();
    var selectedActivities = this.state.selectedActivities;
    if(this.refs.projectName.value == "" || this.refs.projectType.value =="")
   {
      if (this.validateFormReq() && this.validateForm()){
      }
    }else{
    var id2 = this.state.uID;
    var mappingValues= 
    {     
      "sectorMapping_ID"    : this.state.editId,    
      "startDate"           : this.refs.startDate.value,          
      "endDate"             : this.refs.endDate.value,              
      "projectName"         : this.refs.projectName.value,
      "type_ID"             : this.refs.projectType.value,          
      "sector"              : this.state.selectedActivities,                  
    };
    let fields = {};
    fields["projectName"]  = "";
    fields["projectType"]  = "";
    fields["startDate"]    = "";
    fields["endDate"]      = "";

    axios.patch('/api/projectMappings/update',mappingValues)
      .then((response)=>{
        console.log("Uresponse",response)
        swal({
          title : response.data.message,
          text  : response.data.message
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      selectedActivities.map((a, index)=>{
        this.setState({
          [a.sector_ID +"|"+a.sectorName+"|"+a.activity_ID+"|"+a.activityName] : false
        })
      })
      this.setState({
        "projectName"           : "",
        "projectType"           : "",
        "startDate"             :"",
        "endDate"               :"",
        "selectedActivities"    :[],
        fields                  : fields
      });
      
    }   
    
    this.props.history.push('/project-mapping');
    this.setState({
      "editId"              : "",
    });
  }

  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
    
      if (!fields["projectName"]) {
        formIsValid = false;
        errors["projectName"] = "This field is required.";
      }     
      if (!fields["projectType"]) {
        formIsValid = false;
        errors["projectType"] = "This field is required.";
      } 
    /*  
      if (!fields["endDate"]) {
        formIsValid = false;
        errors["endDate"] = "This field is required.";
      }     
      if (!fields["startDate"]) {
        formIsValid = false;
        errors["startDate"] = "This field is required.";
      } */
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
    this.currentFromDate();
    this.currentToDate();
    var editId = nextProps.match.params.projectMappingId;
    if(nextProps.match.params.projectMappingId){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.edit(this.state.editId);
      })
      this.getAvailableSector(this.state.editId);
    }
    if(nextProps){
      this.getLength();
    }
  }

  componentDidMount() {
    this.currentFromDate();
    this.currentToDate();
    this.getTypeOfGoal();
    var editId = this.props.match.params.projectMappingId;
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableSector(this.state.editSectorId);  
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/projectMappings/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      editData.sector.map((a, i)=>{
        this.setState({
          [a.sector_ID +"|"+a.sectorName+"|"+a.activity_ID+"|"+a.activityName] : true
        },()=>{
        })
      })
      this.setState({
        "projectName"                :editData.projectName,     
        "projectType"                :editData.type_ID,      
        "startDate"                  :editData.startDate,      
        "endDate"                    :editData.endDate,      
        "selectedActivities"         :editData.sector, 
      });
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    }).catch(function (error) {
    });
  }
  
  getLength(){
    axios.get('/api/projectMappings/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });
  }
  
  getData(startRange, limitRange){
    console.log('/api/projectMappings/list/'+startRange+'/'+limitRange);
    axios.get('/api/projectMappings/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      this.setState({
        tableData : response.data
      },()=>{
        console.log("tableData",this.state.tableData);
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
      if(this.state[id] == true){
        selectedActivities.push({
          "sector_ID"      : id.split("|")[0],
          "sectorName"     : id.split("|")[1],
          "activity_ID"    : id.split("|")[2],
          "activityName"   : id.split("|")[3]
        });
        this.setState({
          selectedActivities   : selectedActivities,
        });
      }else{
        var index = selectedActivities.findIndex(v => v.activityName === id);
        selectedActivities.splice(selectedActivities.findIndex(v => v.activityName === id), 1);
        this.setState({
          selectedActivities : selectedActivities
        });
      }
    });      
  }

  getAvailableSector(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {   
    console.log("sector",response.data);     
      this.setState({
        availableSectors : response.data
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  getSearchText(searchText, startRange, limitRange){
    this.setState({
      tableData : []
    })
  }

  currentFromDate(){
     /* if(localStorage.getItem('newFromDate')){
          var today = localStorage.getItem('newFromDate');
          console.log("localStoragetoday",today);
      }*/
      if(this.state.startDate){
          var today = this.state.startDate;
          // console.log("localStoragetoday",today);
      }else {
          var today = moment(new Date()).format('YYYY-MM-DD');
      // console.log("today",today);
      }
      console.log("nowfrom",today)
      this.setState({
         startDate :today
      },()=>{
      });
      return today;
      // this.handleFromChange()
  }

  currentToDate(){
      if(this.state.endDate){
          var today = this.state.endDate;
          // console.log("newToDate",today);
      }else {
          var today =  moment(new Date()).format('YYYY-MM-DD');
      }
      this.setState({
         endDate :today
      },()=>{
      });
      return today;
      // this.handleToChange();
  }
  getTypeOfGoal(){
    axios({
      method: 'get',
      url: '/api/typeofgoals/list',
    }).then((response)=> {
        this.setState({
          listofTypes : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  selectType(event){
    event.preventDefault();
    var selectedType = event.target.value;
    this.setState({
      projectType : selectedType,
    });
    this.handleChange(event);
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
                       <h4 className="pageSubHeader">Project Mapping</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable  ">
                        <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Type of Goal/Project</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectType" >
                            <select className="custom-select form-control inputBox" ref="projectType" name="projectType" value={this.state.projectType} onChange={this.selectType.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              {/*<option>SDG Goal</option>
                              <option>ADP Goal</option>
                              <option>Empowerment Line Goal</option>
                              <option>Project Name</option>*/}
                              {
                                this.state.listofTypes ?
                                this.state.listofTypes.map((data, index)=>{
                                  return(
                                    <option key={index} value={data._id}>{data.typeofGoal}</option> 
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.projectType}</div>
                        </div>
                        
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Enter Project Name</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="projectName" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox" value={this.state.projectName} onChange={this.handleChange.bind(this)}   placeholder="" name="projectName" ref="projectName" />
                          </div>
                          <div className="errorMsg">{this.state.errors.projectName}</div>
                        </div>
                        <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">From</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="startDate" >
                                <input onChange={this.handleFromChange.bind(this)} name="fromDateCustomised" ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                            </div>
                          <div className="errorMsg">{this.state.errors.startDate}</div>
                        </div>
                        <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">To</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="endDate" >
                                <input onChange={this.handleToChange.bind(this)} name="toDateCustomised" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                            </div>
                          <div className="errorMsg">{this.state.errors.endDate}</div>
                        </div>  
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above{/* {this.state.projectType}*/}</label></div>
                    <div className="">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable">
                        <div >
                          <div >
                            {
                              this.state.availableSectors ?
                              this.state.availableSectors.map((data, index)=>{
                                return(
                                  <div key={index}>
                                  { data.activity.length > 0?
                                  <div  className=" col-md-12 col-lg-12 col-sm-12 col-xs-12 blockheight noPadding">
                                    <div className=" col-md-12 col-lg-12 col-sm-12 col-xs-12 noPadding">
                                      <label  className="formLable faintColor">{data.sector}</label>
                                      {console.log("activity",data.activity)}
                                    </div>
                                 
                                    {
                                      data.activity.map((a, i)=>{
                                        return(
                                          <div key ={i} className="col-lg-4 col-md-4 col-sm-6 col-xs-6 ">
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
                                    <div className=" col-md-12 col-lg-12 col-sm-12 col-xs-12 noPadding" >
                                      <hr className="hr-map"/>
                                    </div> 
                                  </div>
                                  : null
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
                  <div className="col-lg-12 ">
                     <hr className=""/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default ProjectMapping