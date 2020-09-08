import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./SectorwisePlan.css";
import "../../Reports/Reports.css";

class SectorwisePlan extends Component{
  constructor(props){
    super(props);
    this.state = {
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "center"            : "all",
        "center_ID"         : "all",
        "sector"            : "all",
        "sector_ID"         : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "month"              : "All",
        "months"              :["All","Q1 (April to June)","Q2 (July to September)","Q3 (October to December)","Q4 (January to March)"],
        // 'year'               : "FY 2019 - 2020",
        // "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
        "startDate"         : "",
        "endDate"           : "",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                // {
                //     heading : 'Sector Details',
                //     mergedColoums : 4,
                //     hide : false
                // },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 7,
                    hide : false
                },
                {
                    heading : "Source of Financial Plan 'Rs. in Lakh'",
                    mergedColoums : 7,
                    hide : true
                },

            ]
        },
        "tableHeading"      : {
            projectCategoryType            : "Project Category",
            projectName                    : "Project Name",
            sectorName                     : "Sector",
            Reach                          : "Reach",
            FamilyUpgradation              : "Family Upgradation",
            // proportionToTotal              : 'Proportion to Total %', 
            TotalBudget                    : "Total Budget",
            LHWRF                          : "LHWRF",
            NABARD                         : "NABARD",
            Bank_Loan                      : "Bank Loan",
            Govt                           : "Government",
            DirectCC                       : "DirectCC",
            IndirectCC                     : "IndirectCC",
            Other                          : "Others",
        },
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }
  componentDidMount(){
    this.year();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    this.getAvailableCenters();
    this.getAvailableProjects();
    this.setState({
      tableData : this.state.tableData,
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
    })
  }   
  componentWillReceiveProps(nextProps){
    this.year();
    if(nextProps){  
      this.getData(this.state.year, this.state.center_ID);
    }
    this.getAvailableProjects();
    this.getAvailableCenters();
    this.getAvailableSectors();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      // console.log('response',response);
      this.setState({
          availableCenters : response.data,
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
      var center;
      if(this.state.selectedCenter==="all"){
        center = this.state.selectedCenter;
      }else{
        center = this.state.selectedCenter.split('|')[1];
      }
      this.setState({
        center_ID :center,            
      },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
      })
    });
  } 
  handleChange(event){
    event.preventDefault();
    var getheader = {...this.state.twoLevelHeader};
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      getheader.firstHeaderData[0].heading = this.state.month==="All" ? "Annual Plan " : this.state.month + " Plan";
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
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
          sector           : response.data[0].sector+'|'+response.data[0]._id
        },()=>{
        var sector_ID = this.state.sector.split('|')[1]
        this.setState({
          sector_ID        : sector_ID
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
        })
        // console.log('sector', this.state.sector);
      })
    }).catch(function (error) {  
      // console.log("error = ",error);
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
    var sector_id = event.target.value.split('|')[1];
    // console.log('sector_id',sector_id);
    this.setState({
      sector_ID : sector_id,
    },()=>{
    // console.log('availableSectors', this.state.availableSectors);
    // console.log('sector_ID', this.state.sector_ID);
    // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
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
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
        })          
      }else if (this.state.projectCategoryType=== "all"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
        })    
      }
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
    },()=>{
      // this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
    })
  }
  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      // console.log('responseP', response);
      var availableProjects = response.data
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
            return b[property].localeCompare(a[property]);
          }else{
            return a[property].localeCompare(b[property]);
          }        
        }
      }
      availableProjects.sort(dynamicSort("projectName")); 
      this.setState({
        availableProjects : availableProjects
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
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
    })
  }
  addCommas(x) {
    if(x===0){
      return parseInt(x)
    }else{
      x=x.toString();
      if(x.includes('%')){
        return x;
      }else{
        if(x.includes('.')){
          var pointN = x.split('.')[1];
          var lastN = x.split('.')[0];
          var lastThree = lastN.substring(lastN.length-3);
          var otherNumbers = lastN.substring(0,lastN.length-3);
          if(otherNumbers !== '')
              lastThree = ',' + lastThree;
          var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
          return(res);
        }else{
          var lastThree = x.substring(x.length-3);
          var otherNumbers = x.substring(0,x.length-3);
          if(otherNumbers !== '')
              lastThree = ',' + lastThree;
          var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
          return(res);
        }
      }
    }
  }
  getData(year, center_ID, projectCategoryType, projectName, beneficiaryType, month){        
    console.log(year, center_ID, projectCategoryType, projectName, beneficiaryType, month);
    var url;
    if(year){
      if(month){
        // console.log("startDate",startDate);
        // console.log("endDate",endDate);
        if(year && center_ID && projectCategoryType  && beneficiaryType){ 
          var startDate = year.substring(3, 7)+"-04-01";
          var endDate = year.substring(10, 15)+"-03-31";    
          $(".fullpageloader").show();
          if (month==="All"){
            if(center_ID==="all"){              
              url = ('/api/reports/sector_annualPlan/'+year+'/'+"all"+'/'+projectCategoryType+'/'+projectName)
            }else{
              url = ('/api/reports/sector_annualPlan/'+year+'/'+center_ID+'/'+projectCategoryType+'/'+projectName)
            }
            axios.get(url)
              .then((response)=>{
                console.log("resp",response);
                $(".fullpageloader").hide();
                var value = response.data.filter((a)=>{return a.name === "Total"})[0];
                var tableData = response.data.map((a, i)=>{
                  return {
                    _id                            : a._id,     
                    projectCategoryType            : a.projectCategoryType,
                    projectName                    : a.projectName === "all" ? "-" : a.projectName,
                    sectorName                     : a.sectorName,
                    Reach                          : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.Reach)+"</b>" : this.addCommas(a.Reach),
                    FamilyUpgradation              : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.FamilyUpgradation)+"</b>" : this.addCommas(a.FamilyUpgradation),
                    // proportionToTotal              : ((((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%") === "NAN%") ? " " : (((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%"),
                    TotalBudget                    : (a.TotalBudget),
                    LHWRF                          : (a.LHWRF),
                    NABARD                         : (a.NABARD),
                    Bank_Loan                      : (a.Bank_Loan),
                    Govt                           : (a.Govt),
                    DirectCC                       : (a.DirectCC),
                    IndirectCC                     : (a.IndirectCC),
                    Other                          : (a.Other),
                  } 
                })  
                this.setState({
                  tableData : tableData
                })
              })
              .catch(function(error){  
                console.log("error = ",error);
              });

          }else{
            if(center_ID==="all"){              
              url = ('/api/reports/sector_quarterly_plans/'+month+'/'+year+'/'+"all"+'/'+projectCategoryType+'/'+projectName)
            }else{
              url = ('/api/reports/sector_quarterly_plans/'+month+'/'+year+'/'+center_ID+'/'+projectCategoryType+'/'+projectName)
            }
            axios.get(url)
              .then((response)=>{
                console.log("resp",response);
                $(".fullpageloader").hide();
                var value = response.data.filter((a)=>{return a.sectorName === "Total"})[0];
                var tableData = response.data.map((a, i)=>{
                  // console.log(((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%",(((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%") === "NAN%")
                  return {
                    _id                            : a._id,     
                    projectCategoryType            : a.projectCategoryType,
                    projectName                    : a.projectName === "all" ? "-" : a.projectName,
                    sectorName                     : a.sectorName,
                    Reach                          : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.Reach)+"</b>" : this.addCommas(a.Reach),
                    FamilyUpgradation              : a.sectorName ==="<b>Total</b>" ? "<b>"+this.addCommas(a.FamilyUpgradation)+"</b>" : this.addCommas(a.FamilyUpgradation),
                    // proportionToTotal              : ((((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%") === "NAN%") ? " " : (((a.TotalBudget/value.TotalBudget)*100).toFixed(2)+"%"),
                    TotalBudget                    : (a.TotalBudget),
                    LHWRF                          : (a.LHWRF),
                    NABARD                         : (a.NABARD),
                    Bank_Loan                      : (a.Bank_Loan),
                    Govt                           : (a.Govt),
                    DirectCC                       : (a.DirectCC),
                    IndirectCC                     : (a.IndirectCC),
                    Other                          : (a.Other),
                  } 
                })  
                this.setState({
                  tableData :tableData
                })
              })
              .catch(function(error){  
                console.log("error = ",error);
              });
          }
        }
      }
    }
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

  year() {
    let financeYear;
    let today = moment();
    // console.log('today',today);
    if(today.month() >= 3){
      financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    else{
      financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    this.setState({
        financeYear :financeYear
    },()=>{
      // console.log('financeYear',this.state.financeYear);
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      // console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
        firstYear  :firstYear,
        secondYear :secondYear,
        year       :financialYear
      },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.month);
        var upcomingFirstYear =parseInt(this.state.firstYear)+3
        var upcomingSecondYear=parseInt(this.state.secondYear)+3
        var years = [];
        for (var i = 2017; i < upcomingFirstYear; i++) {
          for (var j = 2018; j < upcomingSecondYear; j++) {
            if (j-i===1){
              var financeYear = "FY "+i+" - "+j;
              years.push(financeYear);
              this.setState({
                years  :years,
              },()=>{
              // console.log('years',this.state.years);
              // console.log('year',this.state.year);
              })              
            }
          }
        }
      })
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
                        Sector Plan            
                    </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 valid_box">
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
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                      <label className="formLable">Plan</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                        <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.handleChange.bind(this)} >
                          <option disabled="disabled" selected="true">-- Select Plan --</option>
                         {this.state.months.map((data,index) =>
                          <option key={index}  value={data} >{data}</option>
                          )}
                          
                        </select>

                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                      <label className="formLable">Year</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                         <option className="hidden" >-- Select Year --</option>
                         {
                          this.state.years 
                          ?
                            this.state.years.map((data, i)=>{
                              return <option key={i}>{data}</option>
                            })
                          : null
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
                          tableName = "Sectorwise Plan"
                          id = "SectorwisePlan"
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
export default SectorwisePlan