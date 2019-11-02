import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
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
            "startRange"        : 0,
            "limitRange"        : 10000
            
        }
        console.log("tableData", this.state.tableData);
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
        this.getData(this.state.year, this.state.center_ID);
        });
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.handleChange = this.handleChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({
                year   : nextProps.year,
            },()=>{
                // console.log('year', this.state.year, 'center_ID', this.state.center_ID)
                this.getData(this.state.year, this.state.center_ID);
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

    getData(year, centerID){
        // console.log('year', year, 'centerID', centerID);
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";
        // axios.get('/api/report/annual_completion_sector/'+year+'/'+centerID)
        if(startDate, endDate, centerID){
            axios.get('/api/report/sector/'+startDate+'/'+endDate+'/'+centerID)
            .then((response)=>{
                console.log('response', response);
                var tableData = response.data.map((a, i)=>{
                return {
                    _id                               : a._id,
                    name                              : a.name,
                    annualPlan_TotalBudget            : a.annualPlan_TotalBudget,
                    annualPlan_Reach                  : a.annualPlan_Reach, 
                    annualPlan_FamilyUpgradation      : a.annualPlan_FamilyUpgradation, 
                    achievement_Reach                 : a.achievement_Reach, 
                    achievement_FamilyUpgradation     : a.achievement_FamilyUpgradation, 
                    achievement_TotalBudget           : a.achievement_TotalBudget, 
                    Per_Annual                        : a.Per_Annual,
                    achievement_LHWRF                 : a.achievement_LHWRF,
                    achievement_NABARD                : a.achievement_NABARD,
                    achievement_Bank_Loan             : a.achievement_Bank_Loan,
                    achievement_DirectCC              : a.achievement_DirectCC,
                    achievement_IndirectCC            : a.achievement_IndirectCC,
                    achievement_Govt                  : a.achievement_Govt,
                    achievement_Other                 : a.achievement_Other,
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
                        <div className="reports-select-date-boxmain">
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