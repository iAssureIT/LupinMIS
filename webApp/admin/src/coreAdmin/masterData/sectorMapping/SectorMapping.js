import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import validate               from 'jquery-validation';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./SectorMapping.css";

class SectorMapping extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "goalName"           : "-- Select --",
      "goalType"           : "-- Select --",
      "sector"             : "",
      "activity"           : "",
      "uID"                : "",
      "activityName"       : "",
      "selectedActivities" : [],
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        type               : "Goal Type",
        goal               : "Goal Name",
        sectorName         : "Sector",
        activityName       : "Activity", 
        actions            : 'Action',
      },
      "tableObjects"       : {
        deleteMethod       : 'delete',
        apiLink            : '/api/sectorMappings/',
        paginationApply    : false,
        searchApply        : false,
        editUrl            : '/sector-mapping/'
      },
      "startRange"         : 0,
      "limitRange"         : 10000,
      "editId"             : this.props.match.params ? this.props.match.params.sectorMappingId : '',
      "role"               : localStorage.getItem("role")
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
    var selectedActivities = this.state.selectedActivities;
    // if (this.validateFormReq() && this.validateForm()) {
    if (selectedActivities.length===0){      
      swal({
        title: 'abc',
        text: "Please select any Activity",
        button: true,
      });
    }else{   
      if($('#sectorMapping').valid()){
        var mappingValues= 
        {     
          "goal"   : this.refs.goalName.value,          
          "type_ID": this.refs.goalType.value,          
          "sector" : this.state.selectedActivities,                  
        };
        let fields = {};
        fields["goalName"]  = "";
        fields["goalType"]  = "";
        axios.post('/api/sectorMappings',mappingValues)
          .then((response)=>{
            if(response.data==="Data Already Exists"){
              console.log('response', response);
              swal({
                title : response.data,
                text  : response.data
              });  
              this.getData(this.state.startRange, this.state.limitRange);
              this.setState({
                "goalName"           :"-- Select --",
                "goalType"           :"-- Select --",
              });
            }else{
              console.log("sectorMappings = ",response);
              swal({
                title : response.data.message,
                text  : response.data.message
              });
                this.getData(this.state.startRange, this.state.limitRange);
            } 
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
          "goalName"           :"-- Select --",
          "goalType"           :"-- Select --",
          "selectedActivities" :[],
          // fields               :fields,
          "selectedTypeofGoal" : ''
        });
      }        
    }
    // }    
  }
  Update(event){
    event.preventDefault();
    var selectedActivities = this.state.selectedActivities;
    if (selectedActivities.length===0){      
      swal({
        title: 'abc',
        text: "Please select any Activity",
        button: true,
      });
    }else{   
      if($('#sectorMapping').valid()){
      // if(this.refs.goalName.value == "" || this.refs.goalType.value ==""){
        //   if (this.validateFormReq() && this.validateForm()){
        //   }
        // }else{
        var id2 = this.state.uID;
        var mappingValues= 
        {     
          "sectorMapping_ID"    : this.state.editId,
          "goal"                : this.refs.goalName.value,
          "type_ID"             : this.refs.goalType.value,          
          "sector"              : this.state.selectedActivities,                  
        };
        let fields = {};
        fields["goalName"]  = "";
        fields["goalType"]  = "";

        axios.patch('/api/sectorMappings/update',mappingValues)
          .then((response)=>{
            if(response.data==="Data Already Exists"){
              console.log('response', response);
              swal({
                title : response.data,
                text  : response.data
              });  
              this.getData(this.state.startRange, this.state.limitRange);
              this.setState({
                "goalName"           :"-- Select --",
                "goalType"           :"-- Select --",
              });
            }else{
              swal({
                title : response.data.message,
                text  : response.data.message
              });
              this.getData(this.state.startRange, this.state.limitRange);
            }
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
            "goalName"           : "-- Select --",
            "goalType"           : "-- Select --",
            "selectedActivities" : [],
            // fields               : fields,
            "selectedTypeofGoal" : '',
            "editId"              : "",
          },()=>{
            this.props.history.push('/sector-mapping');
          });
        // }   
      }
    }
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
    }
    if(nextProps){
      this.getLength();
    }
  }

  componentDidMount() {
    $("#sectorMapping").validate({
      rules: {
        goalType: {
          required: true,
        },
        goalName: {
          required: true,
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "goalType"){
          error.insertAfter("#goalType");
        }
        if (element.attr("name") == "goalName"){
          error.insertAfter("#goalName");
        }
      }
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    var editId = this.props.match.params.sectorMappingId;
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getTypeOfGoal();
    this.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableSector(this.state.editSectorId);  
    this.getNameOfGoal(this.state.goalType)

  }

  edit(id){
    if(id){
      axios({
        method: 'get',
        url: '/api/sectorMappings/'+id,
      }).then((response)=> {
        var editData = response.data[0];
        console.log('editData=====',editData)
        if(editData){
          axios({
            method: 'get',
            url: '/api/typeofgoals/'+editData.type_ID,
          }).then((response)=> {
            // console.log('response==',response)
            editData.sector.map((a, i)=>{
              this.setState({
                [a.sector_ID +"|"+a.sectorName+"|"+a.activity_ID+"|"+a.activityName] : true
              })
            })
            this.setState({
              "goalName"                : editData.goal,
              "selectedTypeofGoal"      : response.data[0].typeofGoal,
              "goalType"                : editData.type_ID,      
              "selectedActivities"      : editData.sector, 
            },()=>{
              this.getNameOfGoal(this.state.goalType)
            });
            let fields = this.state.fields;
            let errors = {};
            let formIsValid = true;
            this.setState({
              errors: errors
            });
            return formIsValid;
          }).catch(function (error) {
            // console.log("error = ",error);
          });
        }
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  
  getLength(){
    axios.get('/api/sectorMappings/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  
  getData(startRange, limitRange){
    console.log('/api/sectorMappings/edit/list/'+startRange+'/'+limitRange);
    axios.get('/api/sectorMappings/edit/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      this.setState({
        tableData : response.data
      },()=>{
        // console.log("tableData",this.state.tableData);
      })
    })
    .catch(function(error){
      console.log("error = ",error);
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
        selectedActivities.splice(selectedActivities.findIndex(v => v.activity_ID === id.split("|")[2]), 1);
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
      // console.log("sectors",response.data);
      var sortArray= (response.data).sort(function(a,b){
        return( (a.activity).length - (b.activity).length); //ASC, For Descending order use: b - a
      });  
      this.setState({
        availableSectors : response.data
      })
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  getSearchText(searchText, startRange, limitRange){
    this.setState({
      tableData : []
    })
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
      // console.log("error = ",error);
    });
  }
  selectType(event){
    event.preventDefault();
    var selectedType = event.currentTarget.value;
    var selectedTypeofGoal     =$(event.currentTarget).find('option:selected').attr('data-name')
    // var selectedTypeofGoal     = event.currentTarget.getAttribute('data-name');
    // console.log("selectedTypeofGoal",selectedTypeofGoal)

    this.setState({
      goalType : selectedType,
      selectedTypeofGoal : selectedTypeofGoal,
      goalName : '-- Select --',
    },()=>{
      this.getNameOfGoal(this.state.goalType)
    });
  }
  getNameOfGoal(goalType){
    if(goalType){
      axios({
        method: 'get',
        url: '/api/typeofgoals/'+goalType,
      }).then((response)=> {
        if(response&&response.data[0]){
          console.log("response = ",response);
          this.setState({
            listofGoalNames : response.data[0].goal
          })
        }
      }).catch(function (error) {
        // console.log("error = ",error);
      });
    }
  }
  
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value,
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



  render() {
    // console.log("this.state.listofGoalNames",this.state.listofGoalNames)
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
                         <h4 className="pageSubHeader">Framework Mapping</h4>
                      </div>
                        {this.state.role !== "viewer" ?
                          <React.Fragment>
                            <div className="row">
                              <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                                <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 valid_box">
                                  <label className="formLable">Framework</label><span className="asterix">*</span>
                                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                                    <select className="custom-select form-control inputBox" ref="goalType" name="goalType" value={this.state.goalType} onChange={this.selectType.bind(this)}>
                                      <option selected="true" disabled="disabled">-- Select --</option>
                                      {
                                        this.state.listofTypes ?
                                        this.state.listofTypes.map((data, index)=>{
                                          return(
                                            <option key={index} data-name={data.typeofGoal} value={data._id}>{data.typeofGoal}</option> 
                                          );
                                        })
                                        :
                                        null
                                      }
                                    </select>
                                  </div>
                                  <div className="errorMsg">{this.state.errors.goalType}</div>
                                </div>
                                <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 valid_box">
                                  <label className="formLable">Goals / Objective / Indicator </label><span className="asterix">*</span>
                                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalName" >
                                    <select className="custom-select form-control inputBox" ref="goalName" name="goalName" value={this.state.goalName} onChange={this.handleChange.bind(this)}>
                                      <option selected="true" disabled="disabled">-- Select --</option>
                                      {
                                        this.state.listofGoalNames ?
                                        this.state.listofGoalNames.map((data, index)=>{
                                          // console.log(data)
                                          return(
                                            <option key={index} data-name={data.goalName} value={data.goalName}>{data.goalName}</option> 
                                          );
                                        })
                                        :
                                        null
                                      }
                                    </select>
                                  </div>
                                  <div className="errorMsg">{this.state.errors.goalName}</div>
                                </div>
                              </div> 
                            </div><br/>
                            <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above goal</label></div>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 ">
                                {
                                  this.state.availableSectors ?
                                  this.state.availableSectors.map((data, index)=>{
                                    if(data.activity.length>0){
                                        return(
                                          <div key={index} className="col-md-4  col-lg-4 col-sm-12 col-xs-12 blockheight noPadding">
                                            <label  className="formLable faintColor">{data.sector}</label>
                                            {
                                              data.activity.map((a, i)=>{
                                                return(
                                                  <div key ={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                    <div className="row"> 
                                                      <div className="actionDiv" id="activityName">
                                                        <div className="SDGContainer col-lg-1 ">
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
                                      }
                                    })
                                  :
                                  null
                                }
                              </div>  
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                              {
                                this.state.editId ? 
                                <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                                :
                                <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Submit.bind(this)}> Submit </button>
                              }
                            </div> 
                          </React.Fragment>
                          : null
                        }
                    </form>
                    {this.state.role !== "viewer" ?
                        <div className="col-lg-12 ">
                           <hr className=""/>
                        </div>
                     : null
                    }   
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
export default SectorMapping