import React, { Component }   from 'react';
import $                      from 'jquery';
import moment                 from 'moment';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./ProjectMapping.css";

class ProjectMapping extends Component{
  constructor(props){
    super(props);
    this.state = {
      "startDate"          : "",
      "endDate"            : "",
      "projectName"        : "",
      "projectType"        : "",
      // "sector"             : "",
      // "activity"           : "",
      // "uID"                : "",
      // "activityName"       : "",
      // "selectedSector"     : [],
      // "selectedActivities" : [],
      // "selectedSubActivities" : [],
      fields               : {},
      errors               : {},
      "tableHeading"       : {
        type               : "Type of Project",
        // goal               : "Project Name",
        projectName        : "Project Name",
        startDate          : "Start Date",
        endDate            : "End Date",
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
    }
  }

 
  handleChange(event){
    event.preventDefault();
    console.log("this",$("input:checkbox:checked").data('typechecked'));
    this.setState({
      "projectName"               : this.refs.projectName.value,          
      "projectType"               : this.refs.projectType.value,          
      "startDate"                 : this.refs.startDate.value,          
      "endDate"                   : this.refs.endDate.value,          
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
    if (this.validateFormReq() && this.validateForm()) {
      if (this.state.sectorData.length===0){      
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
          "sector"       : this.state.sectorData                
        };
        // console.log("mappingValues",mappingValues);
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
            this.getAvailableSector();
            this.getData(this.state.startRange, this.state.limitRange);
          })
          .catch(function(error){
            console.log('error',error);
            if(error.message === "Request failed with status code 401"){
              swal({
                  title : "abc",
                  text  : "Session is Expired. Kindly Sign In again."
              });
            }
          });

        this.setState({
          "projectName"           :"",
          "projectType"           :"",
          "startDate"             :"",
          "endDate"               :"",
          "sectorData"            :[],
          fields                  :fields
        });
        
      }
    }  
  }
  Update(event){
    event.preventDefault();
    if(this.refs.projectName.value === "" || this.refs.projectType.value ==="")
    {
      if (this.validateFormReq() && this.validateForm()){
      }
    }else{
    var mappingValues= 
    {     
      "projectMapping_ID"   : this.state.editId,    
      "startDate"           : this.refs.startDate.value,          
      "endDate"             : this.refs.endDate.value,              
      "projectName"         : this.refs.projectName.value,
      "type_ID"             : this.refs.projectType.value,           
      "sector"              : this.state.sectorData             
    };
    let fields = {};
    fields["projectName"]  = "";
    fields["projectType"]  = "";
    fields["startDate"]    = "";
    fields["endDate"]      = "";

    axios.patch('/api/projectMappings/update',mappingValues)
      .then((response)=>{
        // console.log("Uresponse",response)
        swal({
          title : response.data.message,
          text  : response.data.message
        });
        this.getAvailableSector();
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
        if(error.message === "Request failed with status code 401"){
          swal({
              title : "abc",
              text  : "Session is Expired. Kindly Sign In again."
          });
        }
      });
      this.setState({
        "projectName"           : "",
        "projectType"           : "",
        "startDate"             :"",
        "endDate"               :"",
        "sectorData"            :[],
        "fields"                : fields
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
      this.getAvailableSector();
    }
    if(nextProps){
      this.getLength();
    }
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
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

   /* $(document).ready(function(){
      var data = [];
      $('.activityName').each(function(){
        data.push($(this).text());
      });

      console.log(data);
    }); */
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/projectMappings/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      var availableSectors = this.state.availableSectors
      if(editData.sector&&editData.sector.length>0){
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
      console.log('availableSectors',availableSectors)
      this.setState({
        "projectName"                :editData.projectName,     
        "projectType"                :editData.type_ID,      
        "startDate"                  :editData.startDate,      
        "endDate"                    :editData.endDate,      
        "sectorData"                 :editData.sector, 
        "availableSectors"           :availableSectors
      });
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    }).catch(function (error) {
      console.log("error = ",error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }
    });
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
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }
    });
  }
  
  getData(startRange, limitRange){
    // console.log('/api/projectMappings/list/'+startRange+'/'+limitRange);
    axios.get('/api/projectMappings/list/'+startRange+'/'+limitRange)
    .then((response)=>{
      this.setState({
        tableData : response.data
      },()=>{
        console.log("tableData",this.state.tableData);
      })
    })
    .catch(function(error){
      console.log("error = ",error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }
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
    console.log('sectorData',sectorData)
    this.setState({
      availableSectors : array,
      sectorData : sectorData
    })
  }

  selectSubactivity(event){
    var checkedValue = event.target.value;
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
        var checkChecked =  activitySelected.subActivity.filter((item)=>{return item.checked==="Y"});
        if(activitySelected.subActivity.length===checkChecked.length){
          data.checked="Y";
          activitySelected.checked = "Y"
        }else{
          data.checked="N";
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
    console.log('sectorData',sectorData)
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
      // console.log("response.data",response.data);
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
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }
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
      console.log("error = ",error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }
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
                       <h4 className="pageSubHeader">Project Definition</h4>
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
                            <label className="formLable">Start Date</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="startDate" >
                                <input onChange={this.handleFromChange.bind(this)} name="fromDateCustomised" ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                            </div>
                          <div className="errorMsg">{this.state.errors.startDate}</div>
                        </div>
                        <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">End Date</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="endDate" >
                                <input onChange={this.handleToChange.bind(this)} name="toDateCustomised" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                            </div>
                          <div className="errorMsg">{this.state.errors.endDate}</div>
                        </div>  
                      </div> 
                    </div><br/>
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
                                        <div className="actionDiv" id="sector">
                                          <div className="sectorContainer col-lg-1 ">
                                            <input type="checkbox" name="sector" className ="sector" data-typechecked={data.sector} data-index={index} data-txt={data._id} value={data.checked=="N"?"Y":"N"} id={data._id +"|"+data.sector}  checked={data.checked==="Y"?true:false} onChange={this.selectSector.bind(this)} />
                                            <span className="sectorCheck"></span>
                                          </div>
                                        </div>                            
                                        <label  className="fz14 faintColor">{data.sector}</label>                                   
                                        {
                                          data.activity.map((a, i)=>{
    
                                            return(
                                              <div key ={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                <div className={data._id +"|"+data.sector}> 
                                                  <div className="actionDiv" id="activityName">
                                                    <div className="SDGContainer col-lg-1 ">
                                                      <input type="checkbox" name="activityName"  data-typechecked={a.activityName} data-index={i} data-txt={index} value={a.checked=="N"?"Y":"N"} className ="activityName" id={data._id +"|"+data.sector+"|"+a._id+"|"+a.activityName}  checked={a.checked==="Y"?true:false} onChange={this.selectActivity.bind(this)} />
                                                      <span className="SDGCheck"></span>
                                                    </div>
                                                  </div>                            
                                                  <label className="actListItem">{a.activityName}</label>
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
                                                            </div>                            
                                                            <label className="subActivitylistItem">{b.subActivityName}</label>
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