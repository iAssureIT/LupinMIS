import React, { Component } from 'react';
import $                    from 'jquery';
import swal                 from 'sweetalert';
import axios                from 'axios';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import "../../Reports/Reports.css";
class SDGReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "goalType"          : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "beneficiaryType"   : "all",
        "projectCategoryType": "all",
        "projectName"       : "all",
        "twoLevelHeader"    : { 
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Goal',
                    mergedColoums : 2
                }, 
                {
                    heading : 'Details of Activity contributing SDG',
                    mergedColoums : 5
                },
                {
                    heading : 'Financial Sharing "Rs"',
                    mergedColoums : 9
                },
            ]
        },
        "tableHeading"      : {
            "goalName"        : 'Goal Names',
            "activityName"    : 'Activity',
            "unit"            : 'Unit',
            "Quantity"        : 'Quantity',
            "Amount"          : 'Amount',
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
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
      this.getAvailableProjects();
      this.getTypeOfGoal();
      this.currentFromDate();
      this.currentToDate();
      this.setState({
        // "center"  : this.state.center[0],
        // "sector"  : this.state.sector[0],
        tableData : this.state.tableData,
      },()=>{
      // console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
      })
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }   

  componentWillReceiveProps(nextProps){
    this.getAvailableProjects();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
  }
  handleChange(event){
      event.preventDefault();
      this.setState({
        [event.target.name] : event.target.value
      },()=>{
        // console.log('name', this.state)
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
      });
  }
  handleChangeSelect = (goalType) => {
    this.setState({ 
      goalType : goalType 
    }, ()=>{
      // console.log("goalType = ", this.state.goalType) 
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
    });
  };
  getData(startDate, endDate,center_ID, beneficiaryType, projectCategoryType, projectName){
    // console.log(startDate, endDate, center_ID);
    // console.log("this.state.goalType",this.state.goalType)
    if(startDate && endDate && center_ID && beneficiaryType){
    if(beneficiaryType==="all"){
      var url = '/api/reports/goals/'+startDate+'/'+endDate+'/'+center_ID+"/all/"+projectCategoryType+"/"+projectName
    }else{
      var url = '/api/reports/goals/'+startDate+'/'+endDate+'/'+center_ID+'/'+beneficiaryType+"/"+projectCategoryType+"/"+projectName
    }

    var listofTypesArray = this.state.goalType.map((data, index)=>{
      return(data.value);
      })    
    var formvalues = {
          "goal"      : listofTypesArray,           
    }
    // console.log("formvalues",formvalues)
      axios.post(url, formvalues)
      .then((response)=>{
        console.log("resp",response);
        var tableData = response.data.map((a, i)=>{
          return {
              _id             : a._id,            
              goalName        : a.goalName,
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
    handleFromChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
      // console.log(Date.parse(startDate));
      
      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var startDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
         [name] : event.target.value,
         startDate:startDate
      },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
      // console.log("dateUpdate",this.state.startDate);
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
      // console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);

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
    getSearchText(searchText, startRange, limitRange){
      // console.log(searchText, startRange, limitRange);
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
          })          
        }else if (this.state.projectCategoryType=== "all"){
          this.setState({
            projectName : "all",
          })    
        }
        // console.log("shown",this.state.shown, this.state.projectCategoryType)
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
      
    },()=>{
    })
  }
  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      console.log('responseP', response);
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
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.beneficiaryType, this.state.projectCategoryType, this.state.projectName);
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

  
  render(){
    return(
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
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
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 validBox">
                    
                      <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Goal Type</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                         
                              {
                                this.state.listofTypesArray ?
                             
                                <ReactMultiSelectCheckboxes options={this.state.listofTypesArray} value={this.state.goalType} name="goalType" onChange={this.handleChangeSelect}/>
                                :
                                null
                              }
                          </div>
                        </div>  
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
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
                          <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
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
                      </div> 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 validBox">
                        <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                            <label className="formLable">From</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate"  id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                            </div>
                        </div>
                        <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                            <label className="formLable">To</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                            </div>
                        </div>  
                    </div>  
                    <div className="marginTop11">
                        <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <IAssureTable 
                                tableName = "SDG Report"
                                id = "SDGReport"
                                completeDataCount={this.state.tableDatas.length}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                editId={this.state.editSubId} 
                                getData={this.getData.bind(this)} 
                                tableHeading={this.state.tableHeading} 
                                tableData={this.state.tableData} 
                                tableObjects={this.state.tableObjects}
                                getSearchText={this.getSearchText.bind(this)}/>
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
export default SDGReport