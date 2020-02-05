import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import _                    from 'underscore';
import swal                 from 'sweetalert';
import Loader                                      from "../../common/Loader.js";

import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";

class ActivitywiseAnnualPlanReport extends Component{
  constructor(props){
        super(props);
        this.state = {
            'currentTabView'    : "Monthly",
            'tableDatas'        : [],
            'reportData'        : {},
            'tableData'         : [],
            "startRange"        : 0,
            "limitRange"        : 10000,
            'year'              : "FY 2019 - 2020",
            "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
            "startDate"         : "",
            "endDate"           : "",
            "shown"             : true, 
            "sector"            : "all",
            "sector_ID"         : "all",
            "activity_ID"       : "all",
            "activity"          : "all",
            "subactivity"       : "all",
            "subActivity_ID"    : "all",
            "projectCategoryType": "all",
            "beneficiaryType"    : "all",
            "projectName"        : "all",
            "twoLevelHeader"    : {
                apply           : true,
                firstHeaderData : [
                    {
                        heading : 'Activity Details',
                        mergedColoums : 5,
                        hide : false
                     },
                    {
                        heading : 'Annual Plan',
                        mergedColoums : 5,
                        hide : false
                    },
                    {
                        heading : "Source of Financial Plan 'Rs'",
                        mergedColoums : 7,
                        hide : true
                    },
                    {
                        heading : "",
                        mergedColoums : 1,
                        hide : true
                    },
                ]
            },
            "tableHeading"      : {
                "annualPlan_projectCategoryType"         : 'Project Category',
                "annualPlan_projectName"                 : 'Project Name',
                "name"                                   : 'Activity & Sub-Activity',
                "unit"                                   : 'Unit',
                "annualPlan_Reach"                       : 'Reach', 
                "annualPlan_FamilyUpgradation"           : "Families Upgradation",
                "annualPlan_PhysicalUnit"                : 'Phy Units', 
                "annualPlan_UnitCost"                    : 'Unit Cost "Rs"',
                "annualPlan_TotalBudget_L"               : "Total Budget 'Lakh'",
                "annualPlan_LHWRF"                       : 'LHWRF',
                "annualPlan_NABARD"                      : 'NABARD',
                "annualPlan_Bank_Loan"                   : 'Bank',
                "annualPlan_Govt"                        : 'Government',
                "annualPlan_DirectCC"                    : 'DirectCC',
                "annualPlan_IndirectCC"                  : 'IndirectCC',
                "annualPlan_Other"                       : 'Others',
                "annualPlan_Remark"                      : 'Remark',
            },
            "tableObjects"        : {
              paginationApply     : false,
              searchApply         : false,
              downloadApply       : true,
            }, 
            availableSectors      : [],   
        }
        window.scrollTo(0, 0);
        this.getAvailableSectors = this.getAvailableSectors.bind(this);

    }

  componentDidMount(){
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    this.getAvailableProjects();
    this.setState({
      tableData : this.state.tableData,
    },()=>{
         console.log('aa',this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID); 
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }
   
  componentWillReceiveProps(nextProps){
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
    this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      
    });
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        this.setState({
          availableSectors : response.data,
          // sector           : response.data[0].sector+'|'+response.data[0]._id
        },()=>{
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
  selectSector(event){
    event.preventDefault();
    this.setState({
      [event.target.name]:event.target.value
    });
    if(event.target.value==="all"){
      var sector_id = event.target.value;
    }else{
      var sector_id = event.target.value.split('|')[1];
    }
    this.setState({
      sector_ID : sector_id, 
      activity_ID    : "all",
      subActivity_ID : "all",
      activity       : "all",
      subactivity    : "all",
    },()=>{
      this.getAvailableActivity(this.state.sector_ID);
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  } 
  getAvailableActivity(sector_ID){
    if(sector_ID){
      axios({
        method: 'get',
        url: '/api/sectors/'+sector_ID,
      }).then((response)=> {
        if(response&&response.data[0]){
          this.setState({
            availableActivity : response.data[0].activity
          })
        }
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }
  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    if(event.target.value==="all"){
      var activity_ID = event.target.value;
    }else{
      var activity_ID = event.target.value.split('|')[1];
    }
    this.setState({
      activity_ID : activity_ID,
      subActivity_ID : "all",
      subactivity    : "all",
    },()=>{
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }
  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      var availableSubActivity = _.flatten(response.data.map((a, i)=>{
        return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] });
      }))
      this.setState({
        availableSubActivity : availableSubActivity
      });
    }).catch(function (error) {
      console.log("error = ",error);
    });    
  }
  selectSubActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    if(event.target.value==="all"){
      var subActivity_ID = event.target.value;
    }else{
      var subActivity_ID = event.target.value.split('|')[1];
    }
    this.setState({
      subActivity_ID : subActivity_ID,
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }

  selectprojectCategoryType(event){
    event.preventDefault();
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
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      },()=>{
    })
  }

  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      this.setState({
        availableProjects : response.data
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
          projectName : projectName,
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }
 
  addCommas(x) {
    x=x.toString();
    if(x.includes('%')){
        return x;
    }else{
      if(x.includes('.')){
        var pointN = x.split('.')[1];
        var lastN = x.split('.')[0];
        var lastThree = lastN.substring(lastN.length-3);
        var otherNumbers = lastN.substring(0,lastN.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
        return(res);
      }else{
        var lastThree = x.substring(x.length-3);
        var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return(res);
      }
    }
  }
  getData(year, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID){   
    if(year ){
      if(center_ID && sector_ID && projectCategoryType && projectName && beneficiaryType){ 
        if(sector_ID==="all"){
          var startDate = year.substring(3, 7)+"-04-01";
          var endDate = year.substring(10, 15)+"-03-31";    
          $(".fullpageloader").show();
          axios.get('/api/report/activity_annual_plan/'+startDate+'/'+endDate+'/'+center_ID+'/all/'+projectCategoryType+'/'+projectName+'/all/'+activity_ID+'/'+subActivity_ID)
            .then((response)=>{
              console.log('response',response);
              $(".fullpageloader").hide();
                var tableData = response.data.map((a, i)=>{
                return {
                    _id                                       : a._id,  
                    annualPlan_projectCategoryType            : a.annualPlan_projectCategoryType ? a.annualPlan_projectCategoryType : "-",
                    annualPlan_projectName                    : a.annualPlan_projectName === "all" ? "-" :a.annualPlan_projectName,                       
                    name                                      : a.name,
                    unit                                      : a.unit,
                    annualPlan_Reach                          : this.addCommas(a.annualPlan_Reach),
                    annualPlan_FamilyUpgradation              : this.addCommas(a.annualPlan_FamilyUpgradation),
                    annualPlan_PhysicalUnit                   : this.addCommas(a.annualPlan_PhysicalUnit),
                    annualPlan_UnitCost                       : this.addCommas(a.annualPlan_UnitCost),
                    annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                    annualPlan_LHWRF                          : this.addCommas(a.annualPlan_LHWRF),
                    annualPlan_NABARD                         : this.addCommas(a.annualPlan_NABARD),
                    annualPlan_Bank_Loan                      : this.addCommas(a.annualPlan_Bank_Loan),
                    annualPlan_Govt                           : this.addCommas(a.annualPlan_Govt),
                    annualPlan_DirectCC                       : this.addCommas(a.annualPlan_DirectCC),
                    annualPlan_IndirectCC                     : this.addCommas(a.annualPlan_IndirectCC),
                    annualPlan_Other                          : this.addCommas(a.annualPlan_Other),
                    annualPlan_Remark                         : a.annualPlan_Remark,
                    }
            })
              this.setState({
                tableData : tableData
              },()=>{
              })
            })
            .catch(function(error){
              console.log("error = ",error);
            });
        }else{
          var startDate = year.substring(3, 7)+"-04-01";
          var endDate = year.substring(10, 15)+"-03-31";             
          axios.get('/api/report/activity_annual_plan/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/all/'+activity_ID+'/'+subActivity_ID)
            .then((response)=>{
                var tableData = response.data.map((a, i)=>{
                return {
                    _id                                       : a._id,     
                    projectCategoryType                       : a.projectCategoryType ? a.projectCategoryType : "-",
                    projectName                               : a.projectName === 0 ? "-" :a.projectName,                    
                    name                                      : a.name,
                    unit                                      : a.unit,
                    annualPlan_Reach                          : this.addCommas(a.annualPlan_Reach),
                    annualPlan_FamilyUpgradation              : this.addCommas(a.annualPlan_FamilyUpgradation),
                    annualPlan_PhysicalUnit                   : this.addCommas(a.annualPlan_PhysicalUnit),
                    annualPlan_UnitCost                       : this.addCommas(a.annualPlan_UnitCost),
                    annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                    annualPlan_LHWRF                          : this.addCommas(a.annualPlan_LHWRF),
                    annualPlan_NABARD                         : this.addCommas(a.annualPlan_NABARD),
                    annualPlan_Bank_Loan                      : this.addCommas(a.annualPlan_Bank_Loan),
                    annualPlan_Govt                           : this.addCommas(a.annualPlan_Govt),
                    annualPlan_DirectCC                       : this.addCommas(a.annualPlan_DirectCC),
                    annualPlan_IndirectCC                     : this.addCommas(a.annualPlan_IndirectCC),
                    annualPlan_Other                          : this.addCommas(a.annualPlan_Other),
                    annualPlan_Remark                         : a.annualPlan_Remark,
                  }
            })
              this.setState({
                tableData : tableData
              },()=>{
              })
            })
            .catch(function(error){
              console.log("error = ",error);
            });
        }
      }
    }
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
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
                             Activity Annual Plan Report
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Sector</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                            <option  className="hidden" >--Select--</option>
                            <option value="all" >All</option>
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
                      <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
                        <label className="formLable">Activity<span className="asterix">*</span></label>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                          <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                            <option disabled="disabled" selected="true">-- Select --</option>
                            <option value="all" >All</option>
                            {
                              this.state.availableActivity && this.state.availableActivity.length >0 ?
                              this.state.availableActivity.map((data, index)=>{
                                if(data.activityName ){
                                  return(
                                    <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                  );
                                }
                              })
                              :
                              null
                            }
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Sub-Activity<span className="asterix">*</span></label>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                          <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                            <option disabled="disabled" selected="true">-- Select --</option>
                            <option value="all" >All</option>
                              {
                                this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                                this.state.availableSubActivity.map((data, index)=>{
                                  if(data.subActivityName ){
                                    return(
                                      <option className="" key={data._id} data-upgrade={data.familyUpgradation} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                    );
                                  }
                                })
                                :
                                null
                              }
                              
                          </select>
                        </div>
                      </div>  
                      <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Year</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                          <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                           <option className="hidden" >-- Select--</option>
                           {
                            this.state.years.map((data, i)=>{
                              return <option key={i}>{data}</option>
                            })
                           }
                          </select>
                        </div>
                        {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                      </div>  
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                    </div> 
                    <div className="marginTop11">                    
                        <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <IAssureTable 
                                tableName = "Activitywise Annual-Plan-Report"
                                id = "activitywiseAnnualPlanReport"
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
export default ActivitywiseAnnualPlanReport