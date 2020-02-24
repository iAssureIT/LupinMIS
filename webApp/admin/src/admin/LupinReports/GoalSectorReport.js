import React, { Component } from 'react';
import $                    from 'jquery';
import swal                 from 'sweetalert';
import axios                from 'axios';
import moment               from 'moment';
import Loader               from "../../common/Loader.js";
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";
class GoalSectorReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        "center_ID"         : "all",
        'tableData'         : [],
        "startRange"        : 0,
        "center"            : "all",
        "center_ID"         : "all",
        "projectCategoryType": "all",
        "goalName"           : "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "limitRange"        : 10000,
        // "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Goal',
                    mergedColoums : 3
                }, 
                {
                    heading : 'Details of Activity contributing ADP',
                    mergedColoums : 7
                },
                {
                    heading : 'Financial Sharing "Lakh"',
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : { 
            "goalType"              : "Framework",
            "goal"                  : 'Goal / Objective',
            "projectCategoryType"   : "Project Category",
            "projectName"           : "Project Name",
            "activityName"    : 'Activity',
            "unit"            : 'Unit',
            "Quantity"        : 'Quantity',
            "Amount"          : "Amount 'Lakh'",
            "Beneficiaries"   : 'Beneficiaries',
            "LHWRF"           : 'LHWRF',
            "NABARD"          : 'NABARD',
            "Govt"            : 'Govt',
            "Bank"            : 'Bank Loan',
            "Community"       : 'Community',
            "Other"           : 'Other',
        },
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.handleFromChange    = this.handleFromChange.bind(this);
    this.handleToChange      = this.handleToChange.bind(this);
    this.currentFromDate     = this.currentFromDate.bind(this);
    this.currentToDate       = this.currentToDate.bind(this);
  }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.setState({
      tableData : this.state.tableData,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
    });
    this.getAvailableCenters();       
    this.getTypeOfGoal();
    this.getNameOfGoal();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }   
  componentWillReceiveProps(nextProps){
    this.getAvailableCenters();       
    this.currentFromDate();
    this.currentToDate();
    this.getTypeOfGoal();
    this.getNameOfGoal();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
  }
  getAvailableCenters(){
      axios({
        method: 'get',
        url: '/api/centers/list',
      }).then((response)=> {
        this.setState({
          availableCenters : response.data,
          // center           : response.data[0].centerName+'|'+response.data[0]._id
        },()=>{
        })
      }).catch(function (error) { 
          console.log("error = ",error);
       
      });
  } 
  selectCenter(event){
      var selectedCenter = event.target.value;
      this.setState({
        [event.target.name] : event.target.value,
        selectedCenter : selectedCenter,
      },()=>{
        if(this.state.selectedCenter==="all"){
          var center = this.state.selectedCenter;
        }else{
          var center = this.state.selectedCenter.split('|')[1];
        }
        this.setState({
          center_ID :center,            
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
          // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        })
      });
    } 

    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
        });
    }
   
    getData(startDate, endDate, center_ID, goalType, goalName, beneficiaryType, projectCategoryType, projectName){
      // console.log(startDate, endDate, center_ID, goalType, goalName, beneficiaryType);
      if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
        if(center_ID==="all"){
          var url = '/api/report/goal/'+startDate+'/'+endDate+'/all/'+goalType+"/"+goalName+"/"+beneficiaryType+"/"+projectCategoryType+"/"+projectName
        }else{
          var url = '/api/report/goal/'+startDate+'/'+endDate+'/'+center_ID+'/'+goalType+"/"+goalName+"/"+beneficiaryType+"/"+projectCategoryType+"/"+projectName
        }
        $(".fullpageloader").show();
        axios.get(url)
        .then((response)=>{
        $(".fullpageloader").hide();
          console.log("resp",response);
          var tableData = response.data.map((a, i)=>{
            return {
                _id                   : a._id,            
                goalType              : a.goalType,
                goal                  : a.goal,
                projectCategoryType   : a.projectCategoryType,
                projectName           : a.projectName,
                activityName    : a.activityName,
                unit            : a.unit,
                Quantity        : a.Quantity,
                Amount          : a.Amount,
                Beneficiaries   : a.Beneficiaries,
                LHWRF           : a.LHWRF,
                NABARD          : a.NABARD,
                Govt            : a.Govt,
                Bank            : a.Bank,
                Community       : a.Community,
                Other           : a.Other,
            }
        })  
          this.setState({
            tableData : tableData
          },()=>{
          })
        })
        .catch(function(error){
            // console.log("error = ",error);
            if(error.message === "Request failed with status code 401"){
              swal({
                  title : "abc",
                  text  : "Session is Expired. Kindly Sign In again."
              });
            }
        });
      }
    }
 
  selectprojectCategoryType(event){
    event.preventDefault();
    // console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
        projectCategoryType : projectCategoryType,
      },()=>{
      if(this.state.projectCategoryType === "LHWRF Grant"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
        })          
      }else if (this.state.projectCategoryType=== "all"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
        })    
      }else  if(this.state.projectCategoryType=== "Project Fund"){
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
      }
    })
  }
  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      // console.log('responseP', response);
      this.setState({
        availableProjects : response.data
      })
    }).catch(function (error) {
      console.log('error', error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }   
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
      projectName : projectName,
    },()=>{
    // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);      
    })
  }

    handleFromChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var startDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
         [name] : event.target.value,
         startDate:startDate
      },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
      });
    }
    handleToChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;

      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
      
      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var endDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
       [name] : event.target.value,
       endDate : endDate
      },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
      });
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
            // console.log("localStoragetoday",today);
        }else {
             var today = (new Date());
            var nextDate = today.getDate() - 30;
            today.setDate(nextDate);
            // var newDate = today.toLocaleString();
            var today =  moment(today).format('YYYY-MM-DD');
        }
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
    getSearchText(searchText, startRange, limitRange){
        this.setState({
            tableData : []
        });
    }
  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentComp,
    })
  }
  onBlurEventFrom(){
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    if ((Date.parse(endDate) < Date.parse(startDate))) {
        swal("Start date","From date should be less than To date");
        this.refs.startDate.value="";
    }
  }
  onBlurEventTo(){
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
        if ((Date.parse(startDate) > Date.parse(endDate))) {
          swal("End date","To date should be greater than From date");
          this.refs.endDate.value="";
      }
  }
  
  getTypeOfGoal(){
    axios({
      method: 'get',
      url: '/api/typeofgoals/list',
    }).then((response)=> {
    var getheader = {...this.state.twoLevelHeader};
    this.setState({
      listofTypes : response.data,
      goalType    : response.data[0]._id,
      selectedTypeofGoal    : response.data[0].typeofGoal
    },()=>{
      getheader.firstHeaderData[0].heading = this.state.selectedTypeofGoal+" Goal ";
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
    })
    }).catch(function (error) {
      // console.log("error = ",error);
    });
  }
  selectType(event){
    event.preventDefault();
    var selectedType = event.currentTarget.value;
    var selectedTypeofGoal     =$(event.currentTarget).find('option:selected').attr('data-name')
    var getheader = {...this.state.twoLevelHeader};
    this.setState({
      goalType : selectedType,
      selectedTypeofGoal : selectedTypeofGoal,
      goalName : 'all',
      twoLevelHeader : getheader
    },()=>{
      getheader.firstHeaderData[0].heading = this.state.selectedTypeofGoal+" Goal ";
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.goalType, this.state.goalName, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
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
        // console.log("error = ",error);
      });
    }
  }
  render(){
    return(     
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper"> 
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                         Goal Report
                      </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-3  col-md-4 col-sm-12 col-xs-12">
                      <label className="formLable">Center</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                          <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                              <option className="hidden" >-- Select --</option>
                              <option value="all" >All</option>
                              {
                                this.state.availableCenters && this.state.availableCenters.length >0 ?
                                this.state.availableCenters.map((data, index)=>{
                                  return(
                                    <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                                  );
                                })
                                :
                                null
                              }
                          </select>
                      </div>
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                      <label className="formLable">Framework</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                        <select className="custom-select form-control inputBox" ref="goalType" name="goalType" value={this.state.goalType} onChange={this.selectType.bind(this)}>
                          <option value="" className="hidden" >-- Select --</option>
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
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                      <label className="formLable">Goal / Objective</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalName" >
                        <select className="custom-select form-control inputBox" ref="goalName" name="goalName" value={this.state.goalName} onChange={this.handleChange.bind(this)}>
                          <option value="" className="hidden" >-- Select --</option>
                          <option value="all" >All</option>
                          {
                            this.state.listofGoalNames ?
                            this.state.listofGoalNames.map((data, index)=>{
                              return(
                                <option key={index} data-name={data.goalName} value={data.goalName}>{data.goalName}</option> 
                              );
                            })
                            :
                            null
                          }
                        </select>
                      </div>
                    </div> 

                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                      <label className="formLable">Project Category</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectCategoryType" >
                        <select className="custom-select form-control inputBox" ref="projectCategoryType" name="projectCategoryType" value={this.state.projectCategoryType} onChange={this.selectprojectCategoryType.bind(this)}>
                          <option  className="hidden" >--Select--</option>
                          <option value="all" >All</option>
                          <option value="LHWRF Grant" >LHWRF Grant</option>
                          <option value="Project Fund">Project Fund</option>
                        </select>
                      </div>
                    </div>
                    {
                      this.state.projectCategoryType === "Project Fund" ?
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
                        <label className="formLable">Project Name</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectName" >
                          <select className="custom-select form-control inputBox" ref="projectName" name="projectName" value={this.state.projectName} onChange={this.selectprojectName.bind(this)}>
                            <option value="all" >All</option>
                            {
                              this.state.availableProjects && this.state.availableProjects.length >0 ?
                              this.state.availableProjects.map((data, index)=>{
                                return(
                                  <option key={data._id} value={data.projectName}>{data.projectName}</option>
                                );
                              })
                              :
                              null
                            }
                          </select>
                        </div>
                      </div>
                    : 
                    ""
                    }  
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                      <label className="formLable">Beneficiary</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="beneficiaryType" >
                        <select className="custom-select form-control inputBox" ref="beneficiaryType" name="beneficiaryType" value={this.state.beneficiaryType} onChange={this.handleChange.bind(this)}>
                          <option  className="hidden" >--Select--</option>
                          <option value="all" >All</option>
                          <option value="withUID" >With UID</option>
                          <option value="withoutUID" >Without UID</option>
                          
                        </select>
                      </div>
                    </div> 
                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                        <label className="formLable">From</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <input onChange={this.handleFromChange}   onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                        </div>
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                        <label className="formLable">To</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <input onChange={this.handleToChange}  onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                        </div>
                    </div>  
                  </div>  
                  <div className="marginTop11">
                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <IAssureTable  
                          tableName = "ADP Report"
                          id = "ADPReport"
                          completeDataCount={this.state.tableDatas.length}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          editId={this.state.editSubId} 
                          getData={this.getData.bind(this)} 
                          tableHeading={this.state.tableHeading} 
                          tableData={this.state.tableData} 
                          tableObjects={this.state.tableObjects}
                          getSearchText={this.getSearchText.bind(this)}
                      />
                    </div>
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
export default GoalSectorReport