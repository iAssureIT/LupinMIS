import React, { Component }       from 'react';
import $                          from 'jquery';
import moment                     from 'moment';
import axios                      from 'axios';
import swal                       from 'sweetalert';
import _                          from 'underscore';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import IAssureTable               from "../../IAssureTable/IAssureTable.jsx";
import Loader                     from "../../../common/Loader.js";

import "./ProjectMapping.css";

class ProjectMapping extends Component{
  constructor(props){
    super(props);
    this.state = {
      "startDate"          : "",
      "endDate"            : "",
      "projectName"        : "",
      "framework"          : [],
      "availableSectors"   : [],
      "listofTypesArray"   : "",
      "goalName"           : "-- Select --",
      "goalType"           : "-- Select --",
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        projectName        : "Project Name",
        typeofGoal         : "Framework",
        goalName           : "Goal / Objective",
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
        editUrl            : '/project-definition/'
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
    // console.log("this",$("input:checkbox:checked").data('typechecked'));
    this.setState({
      [event.target.name] : event.target.value,
      "projectName"               : this.refs.projectName.value,          
      "goalName"                  : this.refs.goalName.value,          
    },()=>{
      this.getAvailableSector(this.state.goalType, this.state.goalName)
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
    // console.log("startDate",startDate,endDate)
    if ((Date.parse(endDate) <= Date.parse(startDate))) {
        swal("Start date","From date should be less than To date");
        this.refs.startDate.value="";
    }
  }
  onBlurEventTo(){
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
      // console.log("startDate",startDate,endDate)
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
      // console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID);
     });
     // localStorage.setItem('newToDate',dateUpdate);
  }
  isTextKey(evt){
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
  Submit(event){
    event.preventDefault();
    if($('#projectMapping').valid()){
      if (this.state.sectorData.length===0){      
        swal({
          title: 'abc',
          text: "Please select appropriate Activity from the list.",
          button: true,
        });
      }else if(this.state.goalType.length === 0){
        swal({
          title: 'abc',
          text: "Please select A Goal Type from the dropdown List",
          button: true,
        });        
      }else{    
      
        var mappingValues= 
        {     
          "projectName"  : this.refs.projectName.value,          
          "type_ID"      : this.refs.goalType.value,           
          "goalName"     : this.refs.goalName.value,           
          "startDate"    : this.refs.startDate.value,          
          "endDate"      : this.refs.endDate.value,              
          "sector"       : this.state.sectorData                
        };
        // console.log("mappingValues",mappingValues);
        axios.post('/api/projectMappings',mappingValues)
          .then((response)=>{
            console.log("response",response)
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.currentFromDate();
            this.currentToDate();
            this.getData(this.state.startRange, this.state.limitRange);
            this.setState({
              "projectName"           :"",
              "type_ID"               :"",
              "sectorData"            :[],
              "goalName"              : "-- Select --",
              "goalType"              : "-- Select --",
            },()=>{
                this.getAvailableSector(this.state.goalType, this.state.goalName)
            });
          })
          .catch(function(error){
            console.log('error',error);
          });
      }
    }  
  }
  Update(event){
    event.preventDefault();
    if($('#projectMapping').valid()){
      // console.log("sectorData",this.state.sectorData)
      if (this.state.sectorData.length===0){      
        swal({
          title: 'abc',
          text: "Please select appropriate Activity from the list.",
          button: true,
        });
      }else if(this.state.goalType.length === 0){
        swal({
          title: 'abc',
          text: "Please select A Goal Type from the dropdown List",
          button: true,
        });        
      }else{    
      
        var mappingValues = 
        {     
          "projectMapping_ID"   : this.state.editId,    
          "projectName"         : this.refs.projectName.value,          
          "type_ID"      : this.refs.goalType.value,           
          "goalName"     : this.refs.goalName.value,           
          "startDate"    : this.refs.startDate.value,          
          "endDate"      : this.refs.endDate.value,              
          "sector"       : this.state.sectorData               
        };
        axios.patch('/api/projectMappings/update',mappingValues)
          .then((response)=>{
            console.log("updateresponse",response)
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.currentFromDate();
            this.currentToDate();
            this.getData(this.state.startRange, this.state.limitRange);
            this.setState({
              "projectName"           :"",
              "type_ID"               :"",
              "sectorData"            :[],
              "goalName"              : "-- Select --",
              "goalType"              : "-- Select --",
            },()=>{
              this.getAvailableSector(this.state.goalType, this.state.goalName)
            });
        })
        .catch(function(error){
          console.log("error = ",error);
        });
        this.props.history.push('/project-definition');
        this.setState({
          "editId"              : "",
        });
      }
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps',nextProps)
    this.currentFromDate();
    this.currentToDate();
    var editId = nextProps.match.params.projectMappingId;
    if(nextProps.match.params.projectMappingId){
      this.setState({
        editId       : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.edit(this.state.editId);
        // console.log('this.state.goalType, this.state.goalName',this.state.goalType, this.state.goalName)
        this.getAvailableSector(this.state.goalType, this.state.goalName)
      })
    }
    if(nextProps){
      this.getLength();
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    $.validator.addMethod("regxprojectName", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Project Name.");
    $("#projectMapping").validate({
      rules: {
        goalName: {
          required: true,
        },
        goalType: {
          required: true,
        },
        projectName: {
          required: true,
          regxprojectName:/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*( [a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "goalType"){
          error.insertAfter("#goalType");
        }
        if (element.attr("name") === "goalName"){
          error.insertAfter("#goalName");
        }
        if (element.attr("name") === "projectName"){
          error.insertAfter("#projectName");
        }
      }
    });
    this.currentFromDate();
    this.currentToDate();
    this.getTypeOfGoal();
    this.getNameOfGoal();
    var editId = this.props.match.params.projectMappingId;
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
  }
  

  edit(id){
    console.log('editDataid',id);
    axios({
      method: 'get',
      url: '/api/projectMappings/fetch/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      // console.log('editData',response.data[0].sector);
      this.getNameOfGoal(response.data[0].type_ID);
      console.log('editData',editData);
      if(editData.sector && editData.sector.length>0){
        axios({
          method: 'get',
          url: 'api/sectorMappings/list_arraySector/' + editData.type_ID + '/'+ editData.goalName
        }).then((response)=> {
          if(response){
            this.setState({
              availableSectors : response.data.sector,
            },()=>{
              // console.log("availableSectors",this.state.availableSectors)
              var availableSectors = this.state.availableSectors;
                editData.sector.map((element)=>{
                  if(availableSectors&&availableSectors.length>0){
                    var checkSector = availableSectors.findIndex(x=>x.sector_ID===element.sector_ID) 
                   if(checkSector>=0){
                      availableSectors[checkSector].checked = "Y"
                    }
                    availableSectors.map((data,i)=>{
                      // console.log("data",data)
                      if(availableSectors[i].activity&&availableSectors[i].activity.length>0){
                        var checkActivity = availableSectors[i].activity.findIndex(x=>x.activity_ID===element.activity_ID) 
                      // console.log("checkActivity",checkActivity)
                        if(checkActivity>=0){
                          availableSectors[i].activity[checkActivity].checked = "Y"
                        }
                        availableSectors[i].activity.map((blockone,j)=>{
                          var checkSubActivity = availableSectors[i].activity[j].subActivity[j].findIndex(x=>x._id===element.subActivity_ID) 
                          // console.log("availableSectors[i].activity[j].subActivity[j]",availableSectors[i].activity[j].subActivity[j])
                          if(checkSubActivity>=0){
                            // console.log("availableSectors[i].activity[j].subActivity[j][checkSubActivity]", availableSectors[i].activity[j].subActivity[j][checkSubActivity])
                            availableSectors[i].activity[j].subActivity[j][checkSubActivity].checked = "Y"
                          }
                          var checkCheckedActivity = availableSectors[i].activity.filter((item)=>{return item.checked==="Y"});
                          var checkChecked         =  availableSectors[i].activity[j].subActivity[j].filter((item)=>{return item.checked==="Y"});
                          // console.log("checkChecked",checkChecked)
                          if((availableSectors[i].activity[j].subActivity[j].length+availableSectors[i].activity.length)===(checkChecked.length+checkCheckedActivity.length)){
                            data.checked="Y";
                          }else{
                            data.checked="N";
                          }
                          if(availableSectors[i].activity[j].subActivity[j].length===checkChecked.length){
                            availableSectors[i].activity[j].checked = "Y"
                          }else{
                            availableSectors[i].activity[j].checked = "N"
                          }
                        })
                      }
                    })
                  }
                })
                this.setState({
                  "projectName"                :editData.projectName,     
                  "goalType"                   :editData.type_ID,      
                  "goalName"                   :editData.goalName,      
                  "startDate"                  :editData.startDate,      
                  "endDate"                    :editData.endDate,      
                  "sectorData"                 :editData.sector, 
                  "availableSectors"           :availableSectors
                },()=>{
                  console.log('this.state',this.state.projectName);
                  this.getNameOfGoal(this.state.goalType)
                });
            })
          }
        }).catch(function (error) {
          console.log("error = ",error);
        });
      }
      }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  selectSector(event){
    var checkedValue   = event.target.value;
      // console.log("checkedValue",checkedValue);
    var index          = event.target.getAttribute('data-index');
    var indexSector    = event.target.getAttribute('data-txt');
    var name           = event.target.getAttribute('data-typechecked');
    var array          = this.state.availableSectors;
    var data;
    var sectorData     = this.state.sectorData;
    // console.log('this.state.sectorData1',this.state.sectorData)

    if(index && array){
      data = array[index];             
      data.checked=checkedValue;
      if(data.activity&&data.activity.length>0){
        var activData = data.activity.map((element, index)=>{
          var activity_ID = ''
          var activityName = ''
          if(checkedValue==="Y"){
            element.checked = "Y"
            activity_ID=element.activity_ID
            activityName=element.activityName
          }else{
            element.checked = "N"
          }
          if(element.subActivity&&element.subActivity[index].length>0){
            var subActivityData = element.subActivity[index].map((blocktwo)=>{
              if(checkedValue==="Y"){
                blocktwo.checked = "Y"
                var checkExists =  sectorData.filter((item, i)=>{
                  return item.sector_ID===data.sector_ID
                          &&item.activity_ID===element.activity_ID
                          &&item.subActivity_ID===blocktwo._id});
                if(checkExists.length===0){
                  sectorData.push({
                    "sector_ID"      : indexSector,
                    "sectorName"     : name,
                    "activity_ID"    : activity_ID,
                    "activityName"   : activityName,
                    "subActivity_ID" : blocktwo._id,
                    "subActivityName": blocktwo.subActivityName,
                  })
                    // console.log('sectorData1',sectorData)
                }
              }else{
                blocktwo.checked = "N"
                var arr = sectorData.filter((item)=>{return item.sector_ID!==data.sector_ID&&
                item.activity_ID!==element.activity_ID&&item.subActivity_ID!==blocktwo._id});
                sectorData = arr;
              }
              return blocktwo
              // console.log("blocktwo1",blocktwo)
            })
          }else{
            if(checkedValue==="Y"){
              var checkExists =  sectorData.filter((item)=>{return item.sector_ID===data.sector_ID&&
              item.activity_ID===element.activity_ID});
              if(checkExists.length===0){
                sectorData.push({
                  "sector_ID"      : indexSector,
                  "sectorName"     : name,
                  "activity_ID"    : activity_ID,
                  "activityName"   : activityName,
                  "subActivity_ID" : "-",
                  "subActivityName": "-",
                })
                // console.log('sectorData2',sectorData)
              }
            }else{
              var arr = sectorData.filter((item)=>{return item.sector_ID!==data.sector_ID&&item.activity_ID!==element.activity_ID});
              sectorData = arr;
              // console.log('sectorData3',sectorData)
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
    this.setState({
      availableSectors : array,
      sectorData: sectorData
    },()=>{
      console.log('selectSector.sectorData1',this.state.sectorData)
    })
  }
  selectActivity(event){
    var checkedValue = event.target.value;
    var activityIndex     = event.target.getAttribute('data-index');
    var sectorIndex     = event.target.getAttribute('data-txt');
    var array = this.state.availableSectors;
    var sectorData = this.state.sectorData;
    // console.log('this.state.sectorData1',this.state.sectorData)
    var data;
    if(sectorIndex && array){
      data = this.state.availableSectors[sectorIndex]; 
      var activitySelected = data.activity[activityIndex];
      activitySelected.checked=checkedValue;
      // console.log('activitySelected',activitySelected,"checkedValue",checkedValue)
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
      if(activitySelected.subActivity&&activitySelected.subActivity[activityIndex].length>0){
        var subaActivityData =  activitySelected.subActivity[activityIndex].map((blockone)=>{
          if(checkedValue==="Y"){
            blockone.checked = "Y"
            var checkExists =  sectorData.filter((item)=>{
              return item.activity_ID===activitySelected.activity_ID&&item.subActivity_ID===blockone._id});
            if(checkExists.length===0){
              sectorData.push({
                "sector_ID": data.sector_ID,
                "sectorName": data.sector,
                "activity_ID": activitySelected.activity_ID,
                "activityName": activitySelected.activityName,
                "subActivity_ID":blockone._id,
                "subActivityName": blockone.subActivityName,
              })  
            }
          }else{
            blockone.checked = "N"
            var arr = sectorData.filter((item)=>{return item.activity_ID!==activitySelected.activity_ID&&item.subActivity_ID!==blockone._id});
            sectorData = arr;
          }
          return blockone;
        })
      }else{
        if(checkedValue==="Y"){
          var checkExists =  sectorData.filter((item)=>{return item.activity_ID===activitySelected.activity_ID});
          if(checkExists.length===0){
            sectorData.push({
              "sector_ID": data.sector_ID,
              "sectorName": data.sector,
              "activity_ID": activitySelected.activity_ID,
              "activityName": activitySelected.activityName,
              "subActivity_ID":"-",
              "subActivityName": "-",
            })  
        // console.log('sectortorDataActivity',sectorData)
          }
        }else{
          var arr = sectorData.filter((item)=>{return item.activity_ID!==activitySelected.activity_ID});
          sectorData = arr;
        }
      }                          
    this.setState({
      availableSectors : array,
      sectorData : sectorData
    },()=>{
      console.log('selectActivity.sectorData1',this.state.sectorData)
    })
  }
}
  selectSubactivity(event){
    var checkedValue         = event.target.value;
    var subActivityIndex     = event.target.getAttribute('data-index');
    var sectorIndex          = event.target.getAttribute('data-txt');
    var activityIndex        = event.target.getAttribute('data-actindex');
    var array = this.state.availableSectors;
    var sectorData = this.state.sectorData;
    // console.log('this.state.sectorData1',this.state.sectorData, "checkedValue",checkedValue)
    var data;
    if(sectorIndex && array){
      data = this.state.availableSectors[sectorIndex]; 
      var activitySelected = data.activity[activityIndex];
      var subActivitySelected = activitySelected.subActivity[activityIndex][subActivityIndex];
      subActivitySelected.checked=checkedValue;
      if(checkedValue==="Y"){
        var checkChecked =  activitySelected.subActivity[activityIndex].filter((item)=>{
          return item.checked==="Y"});
         var allcheckChecked =  activitySelected.subActivity.filter((item)=>{
          return item.checked==="Y"});
          // console.log("allcheckChecked",allcheckChecked)

        if(activitySelected.subActivity[activityIndex].length===checkChecked.length){
          activitySelected.checked = "Y"
        }else{
          activitySelected.checked = "N"
        }
        var checkCheckedActivity = data.activity.filter((item)=>{return item.checked==="Y"});
        if((activitySelected.subActivity[activityIndex].length+data.activity.length)===(checkChecked.length+checkCheckedActivity.length)){
          data.checked="Y";
          // console.log("activitySelected.subActivity[activityIndex].length+data.activity.length",activitySelected.subActivity[activityIndex].length+data.activity.length)
          // console.log("checkChecked.length+checkCheckedActivity.length",checkChecked.length+checkCheckedActivity.length)
        }else{
          data.checked="N";
        }
        
        var checkExists =  sectorData.filter((item)=>{return item.subActivity_ID===subActivitySelected._id});
        if(checkExists.length===0){
          sectorData.push({
            "sector_ID": data.sector_ID,
            "sectorName": data.sector,
            "activity_ID": activitySelected.activity_ID,
            "activityName": activitySelected.activityName,
            "subActivity_ID":subActivitySelected._id,
            "subActivityName": subActivitySelected.subActivityName,
          })  
        // console.log('sectorDataSubAct',sectorData)
        }
      }else{
        data.checked="N";
        activitySelected.checked = "N"
        var arr = sectorData.filter((item)=>{return item.subActivity_ID!==subActivitySelected._id});
        sectorData = arr;
        // console.log('sectorDataSubActN',sectorData)
      }
    }
    this.setState({
      availableSectors : array,
      sectorData : sectorData
    },()=>{
      console.log('selectSubactivity.sectorData1',this.state.sectorData)
    })
  }
  getAvailableSector(goalType , goalName){
    console.log(goalType,goalName)
    axios({
      method: 'get',
      url: 'api/sectorMappings/list_arraySector/' + goalType + '/'+ goalName
    }).then((response)=> {
      console.log("getDatafromFrameworkMap",response);
      if(response){
        this.setState({
          framework : response.data,
          availableSectors : response.data.sector,
        },()=>{
          console.log("availableSectors",this.state.availableSectors)
        })
      }else{
        this.setState({
          availableSectors : [],
        },()=>{})
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      }
      var sectorData = this.state.sectorData;
      var availableSectors = this.state.availableSectors;
      console.log("availableSectors.data",availableSectors);
      var availableSectorData = availableSectors.map((block, i)=>{
      // console.log("block.data",block);
        var totalLength = 0;
        if(block.activity.length>0){
          totalLength = totalLength + block.activity.length 
          block.activity.map((blockone, j)=>{
            if(blockone.subActivity[j].length>0){
              totalLength = totalLength + blockone.subActivity[j].length 
                  console.log('totalLength',totalLength)
              blockone.subActivity[j].map((blocktwo)=>{
                  sectorData.push({
                    "sector_ID": block.sector_ID,
                    "sectorName": block.sector,
                    "activity_ID": blockone.activity_ID,
                    "activityName": blockone.activityName,
                    "subActivity_ID":blocktwo._id,
                    "subActivityName": blocktwo.subActivityName,
                  })  
                blocktwo.checked = "Y"
                  // console.log('blocktwo',blocktwo)
                return blocktwo;
              })
            }else{
              sectorData.push({
                "sector_ID": block.sector_ID,
                "sectorName": block.sector,
                "activity_ID": blockone.activity_ID,
                "activityName": blockone.activityName,
                "subActivity_ID":"-",
                "subActivityName": "-",
              })   
            }
            blockone.checked = "Y";
            return blockone;
          })
        }else{
          // sectorData.push({
          //   "sector_ID": block.sector_ID,
          //   "sectorName": block.sector,
          //   "activity_ID": "",
          //   "activityName": "",
          //   "subActivity_ID":"",
          //   "subActivityName": "",
          // })   
        }
        block.blockLength = totalLength;
        block.checked = "Y";
        return block;
      })
      var sortArray = availableSectorData.sort(function(a,b){
        return((a.blockLength) - (b.blockLength)); //ASC, For Descending order use: b - a
      });
                  console.log('sortArray',sortArray)
      this.setState({
        availableSectors : sortArray,
        sectorData       : sectorData,
      },()=>{
    // console.log('this.state.availableSectors',this.state.availableSectors)
    // console.log('this.state.sectorData',this.state.sectorData)
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

  getLength(){
    axios.get('/api/projectMappings/count')
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
    // console.log('vvzz/api/projectMappings/list/'+startRange+'/'+limitRange);
    $(".fullpageloader").show();
    axios.get('/api/projectMappings/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      $(".fullpageloader").hide();
      console.log(response)
      if(response&&response.data&&response.data.length>0){
        var tableData = response.data.map((a, i)=>{
        return {
            _id                       : a._id,
            projectName               : a.projectName,
            typeofGoal                : a.typeofGoal,
            goalName                  : a.goalName,
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
  currentFromDate(){
     /* if(localStorage.getItem('newFromDate')){
          var today = localStorage.getItem('newFromDate');
          console.log("localStoragetoday",today);
      }*/
      if(this.state.startDate){
          var today = this.state.startDate;
          // console.log("localStoragetoday",today);
      }else {
           var today = (new Date());
        var nextDate = today.getDate() - 30;
        today.setDate(nextDate);
        // var newDate = today.toLocaleString();
        var today =  moment(today).format('YYYY-MM-DD');
        // console.log("today",today);
      }
      // console.log("nowfrom",today)
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
          listofTypes : response.data,
          // goalType    : response.data[0]._id
        },()=>{
          // this.getNameOfGoal(this.state.goalType)
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
          // console.log("listofTypesArray",listofTypesArray);
          this.setState({
            listofTypesArray : listofTypesArray
          })
        }
    }).catch(function (error) {
      console.log("error = ",error);
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
      this.getAvailableSector(this.state.goalType, this.state.goalName)
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
          // console.log("response = ",response);
          this.setState({
            listofGoalNames : response.data[0].goal
          })
        }
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }

  render() {
    // console.log('this.state.availableSectors',this.state.availableSectors)
    return(
      <div className="container-fluid">
        <Loader type="fullpageloader" />
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
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="projectMapping">                   
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Project Specification</h4>
                    </div>
                  {this.state.role !== "viewer" ?
                    <React.Fragment>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable  ">
                          <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">Project Name</label><span className="asterix">*</span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="projectName" >
                              {/*<div className="input-group-addon inputIcon">
                                <i className="fa fa-graduation-cap fa"></i>
                              </div>*/}
                              <input type="text" className="form-control inputBox" value={this.state.projectName} onChange={this.handleChange.bind(this)}   placeholder="" name="projectName" ref="projectName" />
                            </div>
                            <div className="errorMsg">{this.state.errors.projectName}</div>
                          </div>
                          <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 valid_box">
                              <label className="formLable">Start Date</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" >
                                  <input onChange={this.handleFromChange.bind(this)}  onBlur={this.onBlurEventFrom.bind(this)} name="fromDateCustomised" id="startDate"  ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                              </div>
                          </div>
                          <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 valid_box">
                              <label className="formLable">End Date</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main"  >
                                  <input onChange={this.handleToChange.bind(this)}  onBlur={this.onBlurEventTo.bind(this)} id="endDate" name="toDateCustomised" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                              </div>
                          </div>  
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
                      </div> 
                      <br/>
                      <div className=" col-lg-12 col-sm-12 col-xs-12 ">
                        <div className=" col-md-12  col-lg-12 col-sm-12 col-xs-12">
                          {
                            this.state.availableSectors ?
                            this.state.availableSectors.map((data, index)=>{
                              if(data.activity.length>0){
                                  var allActivities = data.activity; 
                                  return(
                                    <div key={index} className="col-md-4  col-lg-4 col-sm-12 col-xs-12 blockheight noPadding">
                                      <div className="row"> 
                                        
                                        <div className="actionDiv col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding" id="sector">
                                          <div className="sectorContainer col-lg-1">
                                            <input type="checkbox" name="sector" className ="sector" data-typechecked={data.sector} data-index={index} data-txt={data.sector_ID} value={data.checked==="N"?"Y":"N"} id={data.sector_ID +"|"+data.sector}  checked={data.checked==="Y"?true:false} onChange={this.selectSector.bind(this)} />
                                            <span className="sectorCheck"></span>
                                          </div>
                                          <label  className="fz14 faintColor col-lg-10">{data.sector}</label>                                   
                                        </div>                            
                                        {
                                          data.activity.map( (act, i) =>{
                                            // console.log(" act = ",act);
                                            return(
                                              <div key ={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                <div className={data.sector_ID +"|"+data.sector}> 
                                                  <div className="actionDiv" id="activityName">
                                                    <div className="SDGContainer col-lg-1">
                                                      <input type="checkbox" name="activityName"  data-typechecked={act.activityName} data-index={i} data-txt={index} value={act.checked==="N"?"Y":"N"} className ="activityName" id={data.sector_ID +"|"+data.sector+"|"+act.activity_ID+"|"+act.activityName}  checked={act.checked==="Y"?true:false} onChange={this.selectActivity.bind(this)} />
                                                      <span className="SDGCheck"></span>
                                                    </div>
                                                    <label className="actListItem col-lg-10">{act.activityName}</label>
                                                  </div>                            
                                                </div>  
                                                {
                                                  act.subActivity[i].map((b,j)=>{
                                                    // {console.log("b",b)}
                                                    return(
                                                      <div key ={j} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                        <div className={data.sector_ID +"|"+data.sector} id="subactivityDiv"> 
                                                          <div className="actionDiv" id="subActivityName">
                                                            <div className="subContainer col-lg-1">                                                         
                                                              <input type="checkbox" name="subActivityName" className ="subActivityName" data-typechecked={b.subActivityName}  data-index={j} data-actindex={i} data-txt={index} value={b.checked==="N"?"Y":"N"}  data-typechecked="subActivityName" id={data.sector_ID +"|"+data.sector+"|"+act.activity_ID+"|"+act.activityName+"|"+b._id+"|"+b.subActivityName}  checked={b.checked==="Y"?true:false} onChange={this.selectSubactivity.bind(this)} />
                                                              <span className="subCheck"></span>
                                                            </div>
                                                            <label className="subActivitylistItem col-lg-10">{b.subActivityName}</label>
                                                          </div>                            
                                                        </div>   
                                                      </div>
                                                    );
                                                  })
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
                      tableName = "Project Mapping"
                      id = "ProjectMapping" 
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