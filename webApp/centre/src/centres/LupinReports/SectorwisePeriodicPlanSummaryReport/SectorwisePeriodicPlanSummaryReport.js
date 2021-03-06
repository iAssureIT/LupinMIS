import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "../../Reports/Reports.css";
import "./SectorwisePeriodicPlanSummaryReport.css";

class SectorwisePeriodicPlanSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "startDate"         : "",
        "endDate"           : "",
        "sector"            : "all",
        "sector_ID"         : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums :4,
                    hide : false
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 4,
                    hide : false,
                },
                {
                    heading : 'Periodic Plan',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : "Source of Financial Periodic Plan 'Lakh'",
                    mergedColoums : 9,
                    hide : true
                },/*
                {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "monthlyPlan_projectCategoryType"  : 'Project Category',
            "monthlyPlan_projectName"          : 'Project Name',
            "name"                             : 'Sector',
            "annualPlan_Reach"                 : 'Reach', 
            "annualPlan_FamilyUpgradation"     : "Families Upgradation",
            "annualProportionToTotal"          : 'Proportion to Total %', 
            "annualPlan_TotalBudget_L"         : "Total Budget 'Lakh'", 
            "monthlyPlan_Reach"                : 'Reach', 
            "monthlyPlan_FamilyUpgradation"    : "Families Upgradation",
            "periodicProportionToTotal"        : 'Proportion to Total %', 
            "monthlyPlan_TotalBudget_L"        : "Total Budget 'Lakh'", 
            "monthlyPlan_LHWRF_L"              : 'LHWRF',
            "monthlyPlan_NABARD_L"             : 'NABARD',
            "monthlyPlan_Bank_Loan_L"          : 'Bank',
            "monthlyPlan_Govt_L"               : 'Government',
            "monthlyPlan_DirectCC_L"           : 'DirectCC',
            "monthlyPlan_IndirectCC_L"         : 'IndirectCC',
            "monthlyPlan_Other_L"              : 'Others',
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
    this.getAvailableSectors = this.getAvailableSectors.bind(this);
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getAvailableSectors();
        this.getAvailableProjects();
        this.currentFromDate();
        this.currentToDate();
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        // console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }   
    componentWillReceiveProps(nextProps){
        this.getAvailableSectors();
        this.getAvailableProjects();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        // console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
              projectName : "all",
            },()=>{
                this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })          
          }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
                this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })    
          }
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
                // console.log("x",x,"lastN",lastN,"lastThree",lastThree,"otherNumbers",otherNumbers,"res",res)
                return(res);
              }else{
                var lastThree = x.substring(x.length-3);
                var otherNumbers = x.substring(0,x.length-3);
                if(otherNumbers !== '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                // console.log("lastThree",lastThree,"otherNumbers",otherNumbers,"res",res);
                return(res);
              }
            }
        }
    }
    getData(startDate, endDate, center_ID, projectCategoryType, projectName, beneficiaryType){        
        // console.log(startDate, endDate, center_ID,projectCategoryType);
        // axios.get('/api/report/periodic_sector/'+startDate+'/'+endDate+'/'+center_ID)
        $(".fullpageloader").show();
        
        if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
            axios.get('/api/reports/sector_periodic_plans/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/all')
                .then((response)=>{
                 $(".fullpageloader").hide();

                console.log("resp",response);
                var value = response.data.filter((a)=>{return a.name === "Total"})[0];
                var tableData = response.data.map((a, i)=>{
                return {
                  _id                                     : a._id,            
                  monthlyPlan_projectCategoryType         : a.monthlyPlan_projectCategoryType ? a.monthlyPlan_projectCategoryType : "-",
                  monthlyPlan_projectName                 : a.monthlyPlan_projectName === "all" ? "-" :a.monthlyPlan_projectName,               
                  name                                    : a.name,
                  annualPlan_Reach                        : this.addCommas(a.annualPlan_Reach),
                  annualPlan_FamilyUpgradation            : this.addCommas(a.annualPlan_FamilyUpgradation),
                  annualProportionToTotal                 : (((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%") ==="NaN%") ? " " : ((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                  // Per_Annual                              : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                  annualPlan_TotalBudget_L                : (a.annualPlan_TotalBudget_L),
                  monthlyPlan_Reach                       : this.addCommas(a.monthlyPlan_Reach),
                  monthlyPlan_FamilyUpgradation           : this.addCommas(a.monthlyPlan_FamilyUpgradation),
                  periodicProportionToTotal               : (((((a.monthlyPlan_TotalBudget_L/value.monthlyPlan_TotalBudget_L)*100).toFixed(2)) + "%") === "NaN%") ? " " : ((((a.monthlyPlan_TotalBudget_L/value.monthlyPlan_TotalBudget_L)*100).toFixed(2)) + "%") ,
                  monthlyPlan_TotalBudget_L               : (a.monthlyPlan_TotalBudget_L),                
                  monthlyPlan_LHWRF_L                     : a.monthlyPlan_LHWRF_L,
                  monthlyPlan_NABARD_L                    : a.monthlyPlan_NABARD_L,
                  monthlyPlan_Bank_Loan_L                 : a.monthlyPlan_Bank_Loan_L,
                  monthlyPlan_Govt_L                      : a.monthlyPlan_Govt_L,
                  monthlyPlan_DirectCC_L                  : a.monthlyPlan_DirectCC_L,
                  monthlyPlan_IndirectCC_L                : a.monthlyPlan_IndirectCC_L,
                  monthlyPlan_Other_L                     : a.monthlyPlan_Other_L,
                }
            })  
              this.setState({
                tableData : tableData
              },()=>{
                // console.log("resp",this.state.tableData)
              })
            })
            .catch(function(error){  
                console.log("error = ",error.message);
                if(error.message === "Request failed with status code 500"){
                    $(".fullpageloader").hide();
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
        // localStorage.setItem('newFromDate',dateUpdate);
    }
    handleToChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        console.log('to',event.target.value);
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var endDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           endDate : endDate
        },()=>{
            
        console.log("dateUpdate",this.state.endDate);
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
       });
       // localStorage.setItem('newToDate',dateUpdate);
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

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
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
        // console.log("nowto",today)
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
                                        {/*Sector wise Periodic Plan Summary Report */}          
                                        Sector Periodic Plan Report    
                                    </div>
                                </div>
                                    <hr className="hr-head"/>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
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

                                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                                        <label className="formLable">From</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)}  name="startDate" id="startDate" ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
                                        <label className="formLable">To</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)}  name="endDate" id="endDate" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                        </div>
                                    </div>
                                </div> 
                                     
                                <div className="">
                                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <IAssureTable 
                                            tableName = "Sectorwise Periodic Plan Summary Report"
                                            id = "SectorwisePeriodicPlanSummaryReport"
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
export default SectorwisePeriodicPlanSummaryReport