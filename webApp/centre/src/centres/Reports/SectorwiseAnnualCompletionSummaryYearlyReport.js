import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import '../../coreAdmin/IAssureTable/print.css';
export default class YearlyReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            "reportData"        : [],
            "twoLevelHeader"    : props.twoLevelHeader,
            "tableHeading"      : props.tableHeading,
            "tableObjects"      : props.tableObjects,
            "tableData"         : props.tableData,
            "year"              : props.year,
            "projectCategoryType": props.projectCategoryType,
            "projectName"       : props.projectName,
            "beneficiaryType"   : props.beneficiaryType,
            "startRange"        : 0,
            "limitRange"        : 10000
            
        }
        // console.log("tableData", this.state.tableData);
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
        this.getData(this.state.year, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.handleChange = this.handleChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({
                year                  :  nextProps.year,
                projectName           : nextProps.projectName,
                projectCategoryType   : nextProps.projectCategoryType,
                beneficiaryType       : nextProps.beneficiaryType,
            },()=>{
                // console.log('year', this.state.year, 'center_ID', this.state.center_ID)
                this.getData(this.state.year, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            });
        }
    }
    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        this.setState({
           [name] : event.target.value,
        });
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
      }
    getData(year, center_ID, projectCategoryType, projectName, beneficiaryType){        
        if(year){
            var startDate = year.substring(3, 7)+"-04-01";
            var endDate = year.substring(10, 15)+"-03-31";    
            if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
                axios.get('/api/reports/sector_annual_achievement_reports/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                    console.log('response', response);
                    var tableData = response.data.map((a, i)=>{
                    return {
                        _id                               : a._id,
                        projectCategoryType               : a.projectCategoryType ? a.projectCategoryType : "-",
                        projectName                       : a.projectName === 0 ? "-" :a.projectName,      
                        name                              : a.name, 
                        annualPlan_Reach                  : this.addCommas(a.annualPlan_Reach),
                        annualPlan_FamilyUpgradation      : this.addCommas(a.annualPlan_FamilyUpgradation), 
                        annualPlan_TotalBudget_L          : a.annualPlan_TotalBudget_L,
                        achievement_Reach                 : this.addCommas(a.achievement_Reach),
                        achievement_FamilyUpgradation     : this.addCommas(a.achievement_FamilyUpgradation), 
                        achievement_TotalBudget_L         : a.achievement_TotalBudget_L, 
                        Per_Annual                        : a.Per_Annual,
                        achievement_LHWRF_L               : a.achievement_LHWRF_L,
                        achievement_NABARD_L              : a.achievement_NABARD_L,
                        achievement_Bank_Loan_L           : a.achievement_Bank_Loan_L,
                        achievement_Govt_L                : a.achievement_Govt_L,
                        achievement_DirectCC_L            : a.achievement_DirectCC_L,
                        achievement_IndirectCC_L          : a.achievement_IndirectCC_L,
                        achievement_Other_L               : a.achievement_Other_L,
                    }
                })
                    this.setState({
                        tableData : tableData
                    },()=>{
                        // console.log("tableData",this.state.tableData);
                    });
                })
                .catch((error)=>{
                    console.log('error', error);
                })
            }
        }
    }
    getSearchText(searchText, startRange, limitRange){
        // console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
    }
   
    render(){
        if(!this.props.loading){
            return( 
                <div className="row">
                    <div className="sales-report-main-class ">
                        <div className="reports-select-date-boxmain section-not-print">
                            <div className="reports-select-date-boxsec">
                               {/* <div className="reports-select-date-Title">Yearly Reports</div>
                                <div className="input-group">
                                    <span onClick={this.previousYear.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input onChange={this.handleChange} value={this.currentyear()} name="inputyearlyValue" type="text" className="inputyearlyValue reportsDateRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputyearlyValue"  />
                                    <span onClick={this.nextYear.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
                                </div>*/}
                            </div>
                        </div>

                        <div className="report-list-downloadMain">
                            <IAssureTable 
                                tableName = "Sectorwise Annual Completion Report"
                                id = "SectorwiseAnnualCompletionReport"
                                // completeDataCount={this.state.tableDatas.length}
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
            );
        }else{
            return(
                <div className="col-sm-12 col-xs-12 col-lg-8 col-lg-offset-4 col-md-12 loadingImg loaderDiv"><img className="ldrImageforbulk" src="/images/loadersglms.gif" alt="loading"/></div>
            );
        } 
    }
}