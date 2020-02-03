import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../common/Loader.js";

import "../Reports/Reports.css";

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
                    mergedColoums :2,
                    hide : false
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 4,
                    hide : false,
                },
                {
                    heading : 'Periodic Plan',
                    mergedColoums : 3,
                    hide : false
                },
                {
                    heading : "Source of Financial Periodic Plan 'Rs'",
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
            // "projectCategoryType"              : 'Project Category',
            // "projectName"                      : 'Project Name',
            "name"                             : 'Sector',
            "annualPlan_TotalBudget"           : 'Total Budget', 
            "Per_Annual"                       : 'Proportion to Total %', 
            "annualPlan_Reach"                 : 'Reach', 
            "annualPlan_FamilyUpgradation"     : "Families Upgradation",
            "monthlyPlan_TotalBudget"          : 'Total Budget', 
            "Per_Periodic"                     : 'Proportion to Total %', 
            "monthlyPlan_Reach"                : 'Reach', 
            "monthlyPlan_LHWRF"                : 'LHWRF',
            "monthlyPlan_NABARD"               : 'NABARD',
            "monthlyPlan_Bank_Loan"            : 'Bank',
            "monthlyPlan_Govt"                 : 'Government',
            "monthlyPlan_DirectCC"             : 'DirectCC',
            "monthlyPlan_IndirectCC"           : 'IndirectCC',
            "monthlyPlan_Other"                : 'Others',
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
            if (this.state.projectCategoryType=== "all" || this.state.projectCategoryType === "LHWRF Grant"){
              this.setState({
                projectName : "all",
              })    
            }
            // console.log("shown",this.state.shown, this.state.projectCategoryType)
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
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
            // console.log("x",x,"lastN",lastN,"lastThree",lastThree,"otherNumbers",otherNumbers,"res",res)
            return(res);
          }else{
            var lastThree = x.substring(x.length-3);
            var otherNumbers = x.substring(0,x.length-3);
            if(otherNumbers != '')
                lastThree = ',' + lastThree;
            var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            // console.log("lastThree",lastThree,"otherNumbers",otherNumbers,"res",res);
            return(res);
          }
        }
    }
    getData(startDate, endDate, center_ID, projectCategoryType, projectName, beneficiaryType){        
        // console.log(startDate, endDate, center_ID,projectCategoryType);
        // axios.get('/api/report/periodic_sector/'+startDate+'/'+endDate+'/'+center_ID)
        if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
            $(".fullpageloader").show();
            axios.get('/api/report/sector_periodic_plan/'+startDate+'/'+endDate+'/'+center_ID+'/all/all/all')
                .then((response)=>{
                 $(".fullpageloader").hide();

                console.log("resp",response);
                var value = response.data.filter((a)=>{return a.name == "Total"})[0];
                var tableData = response.data.map((a, i)=>{
                return {
                    _id                                     : a._id,            
                    // projectCategoryType                     : a.projectCategoryType ? a.projectCategoryType : "-",
                    // projectName                             : a.projectName === 0 ? "-" :a.projectName,               
                    name                                    : a.name,
                    annualPlan_TotalBudget                  : this.addCommas(a.annualPlan_TotalBudget),
                    Per_Annual                              : a.Per_Annual==="-" ? " " :((((a.annualPlan_TotalBudget/value.annualPlan_TotalBudget)*100).toFixed(2)) + "%" ),
                    annualPlan_Reach                        : this.addCommas(a.annualPlan_Reach),
                    annualPlan_FamilyUpgradation            : this.addCommas(a.annualPlan_FamilyUpgradation),                
                    monthlyPlan_TotalBudget                 : this.addCommas(a.monthlyPlan_TotalBudget),                
                    Per_Periodic                            : a.Per_Periodic==="-" ? " " :((((a.monthlyPlan_TotalBudget/value.monthlyPlan_TotalBudget)*100).toFixed(2)) + "%") ,
                    monthlyPlan_Reach                       : this.addCommas(a.monthlyPlan_Reach),
                    monthlyPlan_LHWRF                       : this.addCommas(a.monthlyPlan_LHWRF),
                    monthlyPlan_NABARD                      : this.addCommas(a.monthlyPlan_NABARD),
                    monthlyPlan_Bank_Loan                   : this.addCommas(a.monthlyPlan_Bank_Loan),
                    monthlyPlan_Govt                        : this.addCommas(a.monthlyPlan_Govt),
                    monthlyPlan_DirectCC                    : this.addCommas(a.monthlyPlan_DirectCC),
                    monthlyPlan_IndirectCC                  : this.addCommas(a.monthlyPlan_IndirectCC),
                    monthlyPlan_Other                       : this.addCommas(a.monthlyPlan_Other),
                } 
            })  
              this.setState({
                tableData : tableData
              },()=>{
                // console.log("resp",this.state.tableData)
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
        // localStorage.setItem('newFromDate',dateUpdate);
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
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                    <hr className="hr-head"/>
                                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                        <label className="formLable">From</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)}  name="startDate" id="startDate" ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                        <label className="formLable">To</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)}  name="endDate" id="endDate" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                        </div>
                                    </div>
                                </div> 
                                     
                                <div className="marginTop11">
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