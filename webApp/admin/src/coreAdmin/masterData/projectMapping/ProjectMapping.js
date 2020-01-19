import React, { Component }       from 'react';
import $                          from 'jquery';
import moment                     from 'moment';
import axios                      from 'axios';
import swal                       from 'sweetalert';
import _                          from 'underscore';
import IAssureTable               from "../../IAssureTable/IAssureTable.jsx";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import "./ProjectMapping.css";

class ProjectMapping extends Component{
  constructor(props){
    super(props);
    this.state = {
      "startDate"          : "",
      "endDate"            : "",
      "projectName"        : "",
      "listofTypesArray"   : "",
      "projectType"        : [],
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        projectName        : "Project Name",
        typeofGoal         : "Goal Type",
        // startDate          : "Start Date",
        // endDate            : "End Date",
        sectorName         : "Sector",
        activityName       : "Activity", 
        subActivityName    : "Subactivity", 
        actions            : 'Action',
      },
      "tableObjects"       : {
        deleteMethod       : 'delete',
        apiLink            : '/api/projectMappings/',
        paginationApply    : false,
        searchApply        : false,
        editUrl            : '/project-mapping/'
      },
      "startRange"         : 0,
      "limitRange"         : 10000,
      "sectorData"         : [],
      "editId"             : this.props.match.params ? this.props.match.params.projectMappingId : '',
      "role"                : localStorage.getItem("role")
    }
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
      "projectName"               : this.refs.projectName.value,          
      "startDate"                 : this.refs.startDate.value,          
      "endDate"                   : this.refs.endDate.value,          
    });
  } 

  handleFromChange(event){
    event.preventDefault();
    const target    = event.target;
    const name      = target.name;
    var dateVal     = event.target.value;
    var dateUpdate  = new Date(dateVal);
    var startDate   = moment(dateUpdate).format('YYYY-MM-DD');
    this.setState({
       [name] : event.target.value,
       startDate:startDate
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
    });
  }
  onBlurEventFrom(){
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    if ((Date.parse(endDate) <= Date.parse(startDate))) {
        swal("Start date","From date should be less than To date");
        this.refs.startDate.value="";
    }
  }
  onBlurEventTo(){
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
        if ((Date.parse(startDate) >= Date.parse(endDate))) {
          swal("End date","To date should be greater than From date");
          this.refs.endDate.value="";
      }
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
    if($('#sectorMapping').valid()){
      console.log("sectorData",this.state.sectorData)
      if (this.state.sectorData.length===0){      
        swal({
          title: 'abc',
          text: "Please select appropriate Activity from the list.",
          button: true,
        });
      }else if(this.state.projectType.length === 0){
        swal({
          title: 'abc',
          text: "Please select A Goal Type from the dropdown List",
          button: true,
        });        
      }else{    
        var listofTypesArray = this.state.projectType.map((data, index)=>{
          return({
              label : data.label,
              goal_ID : data.value
             });
          })    
        var mappingValues= 
        {     
          "projectName"  : this.refs.projectName.value,          
          "type_ID"      : listofTypesArray,           
          "startDate"    : this.refs.startDate.value,          
          "endDate"      : this.refs.endDate.value,              
          "sector"       : this.state.sectorData                
        };
        axios.post('/api/projectMappings',mappingValues)
          .then((response)=>{
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.getAvailableSector();
            this.getData(this.state.startRange, this.state.limitRange);
          })
          .catch(function(error){
            console.log('error',error);
          });
        this.setState({
          "projectName"           :"",
          "projectType"           :[],
          "startDate"             :"",
          "endDate"               :"",
          "sectorData"            :[],
        });
      }
    }  
  }
  Update(event){
    event.preventDefault();
    if($('#sectorMapping').valid()){
      console.log(this.state.projectType)
      if(this.state.projectType>1){
        var listofTypesArray = this.state.projectType.map((data, index)=>{
        return({
            goalName  : data.label,
            goal_ID   : data.value
           });
        })   
      }
      var mappingValues = 
      {     
        "projectMapping_ID"   : this.state.editId,    
        "projectName"         : this.refs.projectName.value,
        "type_ID"             : listofTypesArray,           
        "startDate"           : this.refs.startDate.value,          
        "endDate"             : this.refs.endDate.value,              
        "sector"              : this.state.sectorData             
      };
      axios.patch('/api/projectMappings/update',mappingValues)
        .then((response)=>{
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.getAvailableSector();
          this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      this.setState({
        "projectName"           : "",
        "projectType"           : [],
        "startDate"             : "",
        "endDate"               : "",
        "sectorData"            : [],
      });
      this.props.history.push('/project-mapping');
      this.setState({
        "editId"              : "",
      });
    }
  }
  componentWillReceiveProps(nextProps){
    this.currentFromDate();
    this.currentToDate();
    var editId = nextProps.match.params.projectMappingId;
    if(nextProps.match.params.projectMappingId){
      this.setState({
        editId       : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.edit(this.state.editId);
      })
      this.getAvailableSector();
    }
    if(nextProps){
      this.getLength();
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    $.validator.addMethod("regxtypeofCenter", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Project Name.");


    $("#sectorMapping").validate({
      rules: {
        projectType: {
          required: true,
        },
        projectName: {
          required: true,
          regxtypeofCenter: /^[A-za-z']+( [A-Za-z']+)*$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "projectType"){
          error.insertAfter("#projectType");
        }
        if (element.attr("name") == "projectName"){
          error.insertAfter("#projectName");
        }
      }
    });
    this.currentFromDate();
    this.currentToDate();
    this.getTypeOfGoal();
    var editId = this.props.match.params.projectMappingId;
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    this.getAvailableSector();  
  }
  edit(id){
    axios({
      method: 'get',
      url: '/api/projectMappings/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      var availableSectors = this.state.availableSectors
      if(editData.sector && editData.sector.length>0){
        editData.sector.map((element)=>{
          if(availableSectors&&availableSectors.length>0){
            var checkSector = availableSectors.findIndex(x=>x._id===element.sector_ID) 
           if(checkSector>=0){
              availableSectors[checkSector].checked = "Y"
            }
            availableSectors.map((data,i)=>{
              if(availableSectors[i].activity&&availableSectors[i].activity.length>0){
                var checkActivity = availableSectors[i].activity.findIndex(x=>x._id===element.activity_ID) 
                if(checkActivity>=0){
                  availableSectors[i].activity[checkActivity].checked = "Y"
                }
                availableSectors[i].activity.map((blockone,j)=>{
                  var checkSubActivity = availableSectors[i].activity[j].subActivity.findIndex(x=>x._id===element.subActivity_ID) 
                  if(checkSubActivity>=0){
                    availableSectors[i].activity[j].subActivity[checkSubActivity].checked = "Y"
                  }  
                })
              }
            })
          }
        })
      }

      if(editData.type_ID.length>1)
      {
         var listofTypesArray = editData.type_ID.map((data, index)=>{
          return({
              label  : data.goalName,
              value   : data.goal_ID
             });
          })
        this.setState({
          "projectName"                :editData.projectName,     
          "projectType"                :listofTypesArray,      
          "startDate"                  :editData.startDate,      
          "endDate"                    :editData.endDate,      
          "sectorData"                 :editData.sector, 
          "availableSectors"           :availableSectors
        });
      }else{
         var listofTypesArray = editData.type_ID.map((data, index)=>{
          return({
              label  : data.goalName,
              value   : data.goal_ID
             });
          })
         this.setState({
          "projectName"                :editData.projectName,     
          "projectType"                :listofTypesArray[0],      
          "startDate"                  :editData.startDate,      
          "endDate"                    :editData.endDate,      
          "sectorData"                 :editData.sector, 
          "availableSectors"           :availableSectors
        });
      }

    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  getLength(){
    axios.get('/api/projectMappings/count')
    .then((response)=>{
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
    axios.get('/api/projectMappings/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      if(response&&response.data&&response.data.length>0){
        var tableData = response.data.map((a, i)=>{
        return {
            _id                       : a._id,
            typeofGoal                : a.typeofGoal,
            projectName               : a.projectName,
            // startDate                 : a.startDate,
            // endDate                   : a.endDate,
            sectorName                : a.sectorName,
            activityName              : a.activityName,
            subActivityName           : a.subActivityName,
          }
        })
        this.setState({
          tableData : tableData
        })
      }
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  selectSector(event){
    var checkedValue = event.target.value;
    var index     = event.target.getAttribute('data-index');
    var indexSector     = event.target.getAttribute('data-txt');
    var name     = event.target.getAttribute('data-typechecked');
    var array = this.state.availableSectors;
    var data;
    var sectorData = this.state.sectorData;

    if(index && array){
      data = array[index];             
      data.checked=checkedValue;
      if(data.activity&&data.activity.length>0){
        var activData = data.activity.map((element)=>{
          var activity_ID = ''
          var activityName = ''
          if(checkedValue==="Y"){
            element.checked = "Y"
            activity_ID=element._id
            activityName=element.activityName
          }else{
            element.checked = "N"
          }
          if(element.subActivity&&element.subActivity.length>0){
            var subActivityData = element.subActivity.map((blocktwo)=>{
              if(checkedValue==="Y"){
                blocktwo.checked = "Y"
                var checkExists =  sectorData.filter((item)=>{return item.sector_ID===data._id&&
                item.activity_ID===element._id&&item.subActivity_ID===blocktwo._id});
                if(checkExists.length===0){
                  sectorData.push({
                    "sector_ID": indexSector,
                    "sectorName": name,
                    "activity_ID": activity_ID,
                    "activityName": activityName,
                    "subActivity_ID":blocktwo._id,
                    "subActivityName": blocktwo.subActivityName,
                  })
                }
              }else{
                blocktwo.checked = "N"
                var arr = sectorData.filter((item)=>{return item.sector_ID!=data._id&&
                item.activity_ID!=element._id&&item.subActivity_ID!=blocktwo._id});
                sectorData = arr;
              }
              return blocktwo
            })
          }else{
            if(checkedValue==="Y"){
              var checkExists =  sectorData.filter((item)=>{return item.sector_ID===data._id&&
              item.activity_ID===element._id});
              if(checkExists.length===0){
                sectorData.push({
                  "sector_ID": indexSector,
                  "sectorName": name,
                  "activity_ID": activity_ID,
                  "activityName": activityName,
                  "subActivity_ID":"",
                  "subActivityName": "",
                })
              }
            }else{
              var arr = sectorData.filter((item)=>{return item.sector_ID!=data._id&&item.activity_ID!=element._id});
              sectorData = arr;
            }
          }
          return element
        })
      }else{
        // sectorData.push({
        //   "sector_ID": indexSector,
        //   "sectorName": name,
        //   "activity_ID": "",
        //   "activityName": "",
        //   "subActivity_ID":"",
        //   "subActivityName": "",
        // })
        swal({
          title: 'abc',
          text: "Please select any Activity",
          button: true,
        });
      }
    }
    console.log('sectorData',sectorData)
    this.setState({
      availableSectors : array,
      sectorData: sectorData
    })
  }
  selectActivity(event){
    var checkedValue = event.target.value;
    var activityIndex     = event.target.getAttribute('data-index');
    var sectorIndex     = event.target.getAttribute('data-txt');
    var array = this.state.availableSectors;
    var sectorData = this.state.sectorData;
    var data;
    if(sectorIndex && array){
      data = this.state.availableSectors[sectorIndex]; 
      var activitySelected = data.activity[activityIndex];
      activitySelected.checked=checkedValue;
      var checkChecked =  data.activity.filter((item)=>{return item.checked==="Y"});
      if(checkedValue==="Y"){
        if(data.activity.length===checkChecked.length){
          data.checked="Y";
          activitySelected.checked = "Y"
        }else{
          data.checked="N";
          activitySelected.checked = "Y"
        }
      }else{
        data.checked="N";
        activitySelected.checked = "N"
      }
      if(activitySelected.subActivity&&activitySelected.subActivity.length>0){
        var subaActivityData =  activitySelected.subActivity.map((blockone)=>{
          if(checkedValue==="Y"){
            blockone.checked = "Y"
            var checkExists =  sectorData.filter((item)=>{return item.activity_ID===activitySelected._id&&item.subActivity_ID===blockone._id});
            if(checkExists.length===0){
              sectorData.push({
                "sector_ID": data._id,
                "sectorName": data.sector,
                "activity_ID": activitySelected._id,
                "activityName": activitySelected.activityName,
                "subActivity_ID":blockone._id,
                "subActivityName": blockone.subActivityName,
              })  
            }
          }else{
            blockone.checked = "N"
            var arr = sectorData.filter((item)=>{return item.activity_ID!=activitySelected._id&&item.subActivity_ID!=blockone._id});
            sectorData = arr;
          }
          return blockone;
        })
      }else{
        if(checkedValue==="Y"){
          var checkExists =  sectorData.filter((item)=>{return item.activity_ID===activitySelected._id});
          if(checkExists.length===0){
            sectorData.push({
              "sector_ID": data._id,
              "sectorName": data.sector,
              "activity_ID": activitySelected._id,
              "activityName": activitySelected.activityName,
              "subActivity_ID":"",
              "subActivityName": "",
            })  
          }
        }else{
          var arr = sectorData.filter((item)=>{return item.activity_ID!=activitySelected._id});
          sectorData = arr;
        }
      }                                          
    }
    this.setState({
      availableSectors : array,
      sectorData : sectorData
    })
  }
  selectSubactivity(event){
    var checkedValue         = event.target.value;
    var subActivityIndex     = event.target.getAttribute('data-index');
    var sectorIndex          = event.target.getAttribute('data-txt');
    var activityIndex        = event.target.getAttribute('data-actindex');
    var array = this.state.availableSectors;
    var sectorData = this.state.sectorData;
    var data;
    if(sectorIndex && array){
      data = this.state.availableSectors[sectorIndex]; 
      var activitySelected = data.activity[activityIndex];
      var subActivitySelected = activitySelected.subActivity[subActivityIndex];
      subActivitySelected.checked=checkedValue;
      if(checkedValue==="Y"){
        var checkCheckedActivity = data.activity.filter((item)=>{return item.checked==="Y"});
        var checkChecked =  activitySelected.subActivity.filter((item)=>{return item.checked==="Y"});
        if((activitySelected.subActivity.length+data.activity.length)===(checkChecked.length+checkCheckedActivity.length)){
          data.checked="Y";
        }else{
          data.checked="N";
        }
        if(activitySelected.subActivity.length===checkChecked.length){
          activitySelected.checked = "Y"
        }else{
          activitySelected.checked = "N"
        }
        var checkExists =  sectorData.filter((item)=>{return item.subActivity_ID===subActivitySelected._id});
        if(checkExists.length===0){
          sectorData.push({
            "sector_ID": data._id,
            "sectorName": data.sector,
            "activity_ID": activitySelected._id,
            "activityName": activitySelected.activityName,
            "subActivity_ID":subActivitySelected._id,
            "subActivityName": subActivitySelected.subActivityName,
          })  
        }
      }else{
        data.checked="N";
        activitySelected.checked = "N"
        var arr = sectorData.filter((item)=>{return item.subActivity_ID!=subActivitySelected._id});
        sectorData = arr;
      }
    }
    this.setState({
      availableSectors : array,
      sectorData : sectorData
    })
  }
  getAvailableSector(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {   
      var availableSectorData = response.data.map((block)=>{
        var totalLength = 0;
        if(block.activity.length>0){
          totalLength = totalLength + block.activity.length 
          block.activity.map((blockone)=>{
            if(blockone.subActivity.length>0){
              totalLength = totalLength + blockone.subActivity.length 
              blockone.subActivity.map((blocktwo)=>{
                blocktwo.checked = "N"
                return blocktwo;
              })
            }
            blockone.checked = "N";
            return blockone;
          })
        }
        block.blockLength = totalLength;
        block.checked = "N";
        return block;
      })
      var sortArray = availableSectorData.sort(function(a,b){
        return((a.blockLength) - (b.blockLength)); //ASC, For Descending order use: b - a
      });

      this.setState({
        availableSectors : sortArray,
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
  currentFromDate(){
    if(this.state.startDate){
        var today = this.state.startDate;
    }else {
         var today = (new Date());
      var nextDate = today.getDate() - 30;
      today.setDate(nextDate);
      var today =  moment(today).format('YYYY-MM-DD');
    }
    this.setState({
       startDate :today
    },()=>{
    });
    return today;
  }
  currentToDate(){
    if(this.state.endDate){
        var today = this.state.endDate;
    }else {
        var today =  moment(new Date()).format('YYYY-MM-DD');
    }
    this.setState({
       endDate :today
    },()=>{
    });
    return today;
  }
  getTypeOfGoal(){
    axios({
      method: 'get',
      url: '/api/typeofgoals/list',
    }).then((response)=> {
        this.setState({
          listofTypes : response.data
        })
        var label = "";
        var value = "";
        if(this.state.listofTypes.length > 0)
        {
          var listofTypesArray = response.data.map((data, index)=>{
            return({
                label : data.typeofGoal,
                value : data._id
               });
          })
          this.setState({
            listofTypesArray : listofTypesArray
          })
        }
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  handleChangeSelect = (projectType) => {
    this.setState({ projectType : projectType });
  };
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
                       <h4 className="pageSubHeader">Project Definition</h4>
                    </div>
                  {this.state.role !== "viewer" ?
                    <React.Fragment>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable  ">
                                                
                          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">Project Name</label><span className="asterix">*</span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="projectName" >
                              {/*<div className="input-group-addon inputIcon">
                                <i className="fa fa-graduation-cap fa"></i>
                              </div>*/}
                              <input type="text" className="form-control inputBox" value={this.state.projectName} onChange={this.handleChange.bind(this)}   placeholder="" name="projectName" ref="projectName" />
                            </div>
                            <div className="errorMsg">{this.state.errors.projectName}</div>
                          </div>
                          <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 valid_box">
                            <label className="formLable">Goal Type</label><span className="asterix">*</span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectType" >
                           
                                {
                                  this.state.listofTypesArray ?
                               
                                  <ReactMultiSelectCheckboxes options={this.state.listofTypesArray} value={this.state.projectType} name="projectType" onChange={this.handleChangeSelect}/>
                                  :
                                  null
                                }
                            </div>
                          </div>  
                          <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                              <label className="formLable">Start Date</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" >
                                  <input onChange={this.handleFromChange.bind(this)}  onBlur={this.onBlurEventFrom.bind(this)} name="fromDateCustomised" id="startDate"  ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                              </div>
                          </div>
                          <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                              <label className="formLable">End Date</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main"  >
                                  <input onChange={this.handleToChange.bind(this)}  onBlur={this.onBlurEventTo.bind(this)} id="endDate" name="toDateCustomised" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                              </div>
                          </div>  
                          </div>
                          
                        </div> 
                      <br/>
                      <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above{/* {this.state.projectType}*/}</label></div>
                        <div className=" col-lg-12 col-sm-12 col-xs-12 ">
                          <div className=" col-md-12  col-lg-12 col-sm-12 col-xs-12">
                            {
                              this.state.availableSectors ?
                              this.state.availableSectors.map((data, index)=>{
                                if(data.activity.length>0){
                                    return(
                                      <div key={index} className="col-md-4  col-lg-4 col-sm-12 col-xs-12 blockheight noPadding">
                                        <div className="row"> 
                                          <div className="actionDiv col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding" id="sector">
                                            <div className="sectorContainer col-lg-1">
                                              <input type="checkbox" name="sector" className ="sector" data-typechecked={data.sector} data-index={index} data-txt={data._id} value={data.checked=="N"?"Y":"N"} id={data._id +"|"+data.sector}  checked={data.checked==="Y"?true:false} onChange={this.selectSector.bind(this)} />
                                              <span className="sectorCheck"></span>
                                            </div>
                                            <label  className="fz14 faintColor col-lg-10">{data.sector}</label>                                   
                                          </div>                            
                                          {
                                            data.activity.map((a, i)=>{
      
                                              return(
                                                <div key ={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                  <div className={data._id +"|"+data.sector}> 
                                                    <div className="actionDiv" id="activityName">
                                                      <div className="SDGContainer col-lg-1">
                                                        <input type="checkbox" name="activityName"  data-typechecked={a.activityName} data-index={i} data-txt={index} value={a.checked=="N"?"Y":"N"} className ="activityName" id={data._id +"|"+data.sector+"|"+a._id+"|"+a.activityName}  checked={a.checked==="Y"?true:false} onChange={this.selectActivity.bind(this)} />
                                                        <span className="SDGCheck"></span>
                                                      </div>
                                                      <label className="actListItem col-lg-10">{a.activityName}</label>
                                                    </div>                            
                                                  </div>  
                                                    {
                                                      a.subActivity.length>0?
                                                      a.subActivity.map((b,j)=>{
                                                        return(
                                                          <div key ={j} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                            <div className={data._id +"|"+data.sector} id="subactivityDiv"> 
                                                              <div className="actionDiv" id="subActivityName">
                                                                <div className="subContainer col-lg-1">                                                         
                                                                  <input type="checkbox" name="subActivityName" className ="subActivityName" data-typechecked={a.subActivityName}  data-index={j} data-actindex={i} data-txt={index} value={b.checked=="N"?"Y":"N"}  data-typechecked="subActivityName" id={data._id +"|"+data.sector+"|"+a._id+"|"+a.activityName+"|"+b._id+"|"+b.subActivityName}  checked={b.checked==="Y"?true:false} onChange={this.selectSubactivity.bind(this)} />
                                                                  <span className="subCheck"></span>
                                                                </div>
                                                                <label className="subActivitylistItem col-lg-10">{b.subActivityName}</label>
                                                              </div>                            
                                                            </div>   
                                                          </div>
                                                        );
                                                      })
                                                      :
                                                      null
                                                    }
                                                </div>
                                              );
                                            })
                                          }
                                        </div> 
                                      </div>                             
                                    );
                                  }
                                })
                              :
                              null
                            }
                          </div>  
                        </div>                                      
                      <br/>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Submit.bind(this)}> Submit </button>
                        }
                      </div> 
                    </React.Fragment>
                    :null
                  }
                  </form>
                  {this.state.role !== "viewer" ?
                    <div className="col-lg-12 ">
                       <hr className=""/>
                    </div>
                  :null}
                     
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