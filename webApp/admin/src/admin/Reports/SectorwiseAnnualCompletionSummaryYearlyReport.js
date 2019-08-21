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
            "center"            : props.center,
            "startRange"        : 0,
            "limitRange"        : 10
            
        }
        console.log("tableData", this.state.tableData);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.getData(this.state.year, this.state.center);
        this.handleChange = this.handleChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({
                year   : nextProps.year,
                center : nextProps.center.split('|')[1],
            },()=>{
                console.log('year', this.state.year, 'center', this.state.center)
                this.getData(this.state.year, this.state.center);
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
    /*dataTableList(){
        var yearFromSess = localStorage.getItem("selectedYear");
        
        var thisYear = yearFromSess;
        var yearDateStart = new Date("1/1/" + thisYear);
        var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);

        var reportData = [];
        if(this.props.selectedCategory){
            if(this.props.selectedSubCategory){
                // reportData =  Orders.find({'createdAt':{$gte : yearDateStart, $lt : yearDateEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }else{
                // reportData =  Orders.find({'createdAt':{$gte : yearDateStart, $lt : yearDateEnd }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
            }
        }else{
            // reportData =  Orders.find({'createdAt':{$gte : yearDateStart, $lt : yearDateEnd }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        }
        this.setState({
            reportData : reportData
        });
   }*/


    getData(year, centerID){
        console.log('year', year, 'centerID', centerID);
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";
        // axios.get('/api/report/annual_completion_sector/'+year+'/'+centerID)
        axios.get('/api/report/sector/'+startDate+'/'+endDate+'/'+centerID)
        .then((response)=>{
            console.log('response', response.data);
            var tableData = response.data.map((a, i)=>{
            return {
                _id                               : a._id,
                sector                            : a.sector,
                annualPlan_totalBudget            : a.annualPlan_totalBudget,
                annualPlan_reach                  : a.annualPlan_reach, 
                annualPlan_familyUpgrade          : a.annualPlan_familyUpgrade, 
                achievement_Reach                 : a.achievement_Reach, 
                achievement_Upgradation           : a.achievement_Upgradation, 
                achievement_totalExp              : a.achievement_totalExp, 
                annualFYAchie_perc_annualPlan     : a.annualFYAchie_perc_annualPlan,
                achievement_LHWRF                 : a.achievement_LHWRF,
                achievement_NABARD                : a.achievement_NABARD,
                achievement_BankLoan              : a.achievement_BankLoan,
                achievement_Direct                : a.achievement_Direct,
                achievement_Indirect              : a.achievement_Indirect,
                achievement_Govt                  : a.achievement_Govt,
                achievement_Other                 : a.achievement_Other,
            }
        })
            this.setState({
                tableData : tableData
            });
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    getSearchText(searchText, startRange, limitRange){
        console.log(searchText, startRange, limitRange);
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