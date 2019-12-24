import React, { Component } from 'react';
// import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
// import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";

class ActivitywiseAnnualCompletionReport extends Component{
  constructor(props){
      super(props);
      this.state = {
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "sector"            : "all",
        "sector_ID"         : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        'year'              : "FY 2019 - 2020",
         "years"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Activity Details',
                    mergedColoums : 3,
                    hide :false,
                },
                // {
                //     heading : 'Annual Plan',
                //     mergedColoums : 4
                // },
                {
                    heading : "Annual Financial Achievement 'Lakh'",
                    mergedColoums : 4,
                    hide :false,
                },
                {
                    heading : "Source OF Financial Achievement",
                    mergedColoums : 7,
                    hide :true,
                },
           /*     {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "name"                          : 'Activity & Sub Activity',
            "unit"                          : 'Unit',
            // "annualPlan_Reach"              : 'Reach', 
            // "annualPlan_FamilyUpgradation"  : 'Families Upgradation', 
            // "annualPlan_PhysicalUnit"       : 'Physical Units', 
            // "annualPlan_TotalBudget"        : "Total Budget 'Rs'",
            "achievement_Reach"             : 'Reach', 
            "achievement_FamilyUpgradation" : 'Families Upgradation', 
            "achievement_PhysicalUnit"      : 'Physical Units', 
            "achievement_TotalBudget_L"     : "Total Expenditure 'Rs'",
            "achievement_LHWRF"             : 'LHWRF',
            "achievement_NABARD"            : 'NABARD',
            "achievement_Bank_Loan"         : 'Bank Loan',
            "achievement_DirectCC"          : 'Direct Community  Contribution',
            "achievement_IndirectCC"        : 'Indirect Community  Contribution',
            "achievement_Govt"              : 'Govt',
            "achievement_Other"             : 'Others',
            // "yiyi"                          : 'Remarks',
        },
            "tableObjects"        : {
              paginationApply     : false,
              searchApply         : false,
              downloadApply       : true,
            },  

      }
      window.scrollTo(0, 0);
      this.handleChange = this.handleChange.bind(this);
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
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      });
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getAvailableProjects();
        this.getAvailableSectors();
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })  
    }
    componentWillReceiveProps(nextProps){
      this.getAvailableSectors();
      this.getAvailableProjects();
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    }
  handleChange(event){
    event.preventDefault();

    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      // console.log('name', this.state)
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
        // console.log('availableSectors', this.state.availableSectors);
        // console.log('sector', this.state.sector);
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
    // console.log('sector_id',sector_id);
    this.setState({
          sector_ID : sector_id,
        },()=>{
        console.log(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }

  selectprojectCategoryType(event){
    event.preventDefault();
    console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
      projectCategoryType : projectCategoryType,
    },()=>{
        if(this.state.projectCategoryType === "LHWRF Grant"){
          this.setState({
            projectName : "LHWRF Grant",
          })          
        }else if (this.state.projectCategoryType=== "all"){
          this.setState({
            projectName : "all",
          })    
        }
        console.log("shown",this.state.shown, this.state.projectCategoryType)
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      },()=>{
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
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
          projectName : projectName,
        },()=>{
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  getData(year, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType){        
    if(year){
      if( center_ID && sector_ID && projectCategoryType  && beneficiaryType){ 
        console.log('year', year, 'center_ID', center_ID, 'sector_ID', sector_ID);
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";
        console.log(startDate, endDate, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType);
        if(sector_ID==="all"){
          var url = '/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType
        }else{
          var url ='/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType
        }   
        axios.get(url)
        // axios.get('/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
        .then((response)=>{
            console.log('response', response);
            var tableData = response.data.map((a, i)=>{
            return {
              _id                           : a._id,
              name                          : a.name,
              unit                          : a.unit,
              // annualPlan_Reach              : a.annualPlan_Reach,
              // annualPlan_FamilyUpgradation  : a.annualPlan_FamilyUpgradation,
              // annualPlan_PhysicalUnit       : a.annualPlan_PhysicalUnit,
              // annualPlan_TotalBudget        : a.annualPlan_TotalBudget,
              achievement_Reach             : a.achievement_Reach,
              achievement_FamilyUpgradation : a.achievement_FamilyUpgradation,    
              achievement_PhysicalUnit      : a.achievement_PhysicalUnit,
              achievement_TotalBudget_L     : a.achievement_TotalBudget_L,
              achievement_LHWRF             : a.achievement_LHWRF,
              achievement_NABARD            : a.achievement_NABARD,
              achievement_Bank_Loan         : a.achievement_Bank_Loan,
              achievement_DirectCC          : a.achievement_DirectCC,
              achievement_IndirectCC        : a.achievement_IndirectCC,
              achievement_Govt              : a.achievement_Govt,
              achievement_Other             : a.achievement_Other,
              remark                        : a.remark,
            }
          })
            this.setState({
                tableData : tableData
            })
        })
        .catch((error)=>{
          console.log('error', error);
        })   
      }
    }
  }
  getSearchText(searchText, startRange, limitRange){
      console.log(searchText, startRange, limitRange);
      this.setState({
          tableData : []
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
                            Activity Annual Report
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 valid_box">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Sector</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                              <option  className="hidden" >--Select Sector--</option>
                              <option value="all">All</option>
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
                          {/* <div className="errorMsg">{this.state.errors.sector}</div>*/}
                        </div> 
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Year</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                            <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                             <option className="hidden" >-- Select Year --</option>
                             {
                              this.state.years.map((data, i)=>{
                                return <option key={i}>{data}</option>
                              })
                             }
                            </select>
                          </div>
                          {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                        </div>  
                    </div> 
                    <div className="marginTop11">
                    
                        <div className="">
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
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default ActivitywiseAnnualCompletionReport