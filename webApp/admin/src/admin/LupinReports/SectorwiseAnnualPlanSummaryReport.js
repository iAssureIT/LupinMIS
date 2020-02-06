import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../common/Loader.js";

import "../Reports/Reports.css";

class SectorwiseAnnualPlanSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "center_ID"         : "all",
        "center"            : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        'year'              : "FY 2019 - 2020",
        "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
        "startDate"         : "",
        "endDate"           : "",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 4,
                    hide : false,
                },
                {
                    heading : "Source of Financial Plan 'Rs'",
                    mergedColoums : 10,
                    hide : true
                },
            ]
        },
        "tableHeading"      : {
            "annualPlan_projectCategoryType"  : 'Project Category',
            "annualPlan_projectName"          : 'Project Name',
            "name"                            : 'Sector',
            "annualPlan_TotalBudget"          : 'Total Budget', 
            "Per_Annual"                      : 'Proportion to Total %', 
            "annualPlan_Reach"                : 'Reach', 
            "annualPlan_FamilyUpgradation"    : "Families Upgradation",
            "annualPlan_TotalBudget"          : 'Total Budget', 
            "annualPlan_LHWRF"                : 'LHWRF',
            "annualPlan_NABARD"               : 'NABARD',
            "annualPlan_Bank_Loan"            : 'Bank',
            "annualPlan_Govt"                 : 'Government',
            "annualPlan_DirectCC"             : 'DirectCC',
            "annualPlan_IndirectCC"           : 'IndirectCC',
            "annualPlan_Other"                : 'Others',
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
    this.getAvailableCenters = this.getAvailableCenters.bind(this);
    this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableCenters();
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    this.setState({
      tableData : this.state.tableData,
    },()=>{
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }   
  componentWillReceiveProps(nextProps){
    this.getAvailableCenters();
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.currentFromDate();
    this.currentToDate();
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      this.setState({
        availableCenters : response.data,
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
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
      });
  } 
  getAvailableSectors(){
      axios({
        method: 'get',
        url: '/api/sectors/list',
      }).then((response)=> {
          
          this.setState({
            availableSectors : response.data,
            sector           : response.data[0].sector+'|'+response.data[0]._id
          },()=>{
          var sector_ID = this.state.sector.split('|')[1]
          this.setState({
            sector_ID        : sector_ID
          },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
          })
        })
      }).catch(function (error) {  
        console.log("error = ",error);

      });
  }
  selectSector(event){
      event.preventDefault();
      this.setState({
        [event.target.name]:event.target.value
      });
      var sector_id = event.target.value.split('|')[1];
      this.setState({
        sector_ID : sector_id,
      },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
  getData(year, center_ID, projectCategoryType, projectName, beneficiaryType){        
    if(year){
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";    
      if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
        if(center_ID==="all"){
           $(".fullpageloader").show();
             axios.get('/api/report/sector_annual_plan/'+startDate+'/'+endDate+'/all/'+projectCategoryType+'/'+projectName+'/all')
              .then((response)=>{
                console.log("resp",response);
                $(".fullpageloader").hide();

                var value = response.data.filter((a)=>{return a.name == "Total"})[0];
                var tableData = response.data.map((a, i)=>{
                  return {
                    _id                                    : a._id,     
                    annualPlan_projectCategoryType         : a.annualPlan_projectCategoryType ? a.annualPlan_projectCategoryType : "-",
                    annualPlan_projectName                 : a.annualPlan_projectName === "all" ? "-" :a.annualPlan_projectName,              
                    name                                   : a.name,
                    annualPlan_TotalBudget                 : this.addCommas(a.annualPlan_TotalBudget),
                    Per_Annual                             : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget/value.annualPlan_TotalBudget)*100).toFixed(2)) + "%" ),
                    annualPlan_Reach                       : this.addCommas(a.annualPlan_Reach),
                    annualPlan_FamilyUpgradation           : this.addCommas(a.annualPlan_FamilyUpgradation), 
                    annualPlan_TotalBudget                 : this.addCommas(a.annualPlan_TotalBudget),
                    annualPlan_LHWRF                       : this.addCommas(a.annualPlan_LHWRF),
                    annualPlan_NABARD                      : this.addCommas(a.annualPlan_NABARD),
                    annualPlan_Bank_Loan                   : this.addCommas(a.annualPlan_Bank_Loan),
                    annualPlan_Govt                        : this.addCommas(a.annualPlan_Govt),
                    annualPlan_DirectCC                    : this.addCommas(a.annualPlan_DirectCC),
                    annualPlan_IndirectCC                  : this.addCommas(a.annualPlan_IndirectCC),
                    annualPlan_Other                       : this.addCommas(a.annualPlan_Other),
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
            axios.get('/api/report/sector_annual_plan/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/all')
              .then((response)=>{
                console.log("resp",response);
                var value = response.data.filter((a)=>{return a.name == "Total"})[0];
                var tableData = response.data.map((a, i)=>{
                  return {
                      _id                                    : a._id,   
                      annualPlan_projectCategoryType         : a.annualPlan_projectCategoryType ? a.annualPlan_projectCategoryType : "-",
                      annualPlan_projectName                 : a.annualPlan_projectName === "all" ? "-" :a.annualPlan_projectName,   
                      name                                   : a.name,
                      annualPlan_TotalBudget                 : this.addCommas(a.annualPlan_TotalBudget),
                      Per_Annual                             : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget/value.annualPlan_TotalBudget)*100).toFixed(2)) + "%" ),
                      annualPlan_Reach                       : this.addCommas(a.annualPlan_Reach),
                      annualPlan_FamilyUpgradation           : this.addCommas(a.annualPlan_FamilyUpgradation), 
                      annualPlan_TotalBudget                 : this.addCommas(a.annualPlan_TotalBudget),
                      annualPlan_LHWRF                       : this.addCommas(a.annualPlan_LHWRF),
                      annualPlan_NABARD                      : this.addCommas(a.annualPlan_NABARD),
                      annualPlan_Bank_Loan                   : this.addCommas(a.annualPlan_Bank_Loan),
                      annualPlan_Govt                        : this.addCommas(a.annualPlan_Govt),
                      annualPlan_DirectCC                    : this.addCommas(a.annualPlan_DirectCC),
                      annualPlan_IndirectCC                  : this.addCommas(a.annualPlan_IndirectCC),
                      annualPlan_Other                       : this.addCommas(a.annualPlan_Other),
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
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
     });
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
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID);
     });
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
                        Sector Annual Plan Report 
                    </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                   <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                    </div>   
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                  </div>  
                  <div className="marginTop11">
                      <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <IAssureTable 
                            tableName = "Sectorwise Annual Plan Summary Report"
                            id = "SectorwiseAnnualPlanSummaryReport"
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
export default SectorwiseAnnualPlanSummaryReport