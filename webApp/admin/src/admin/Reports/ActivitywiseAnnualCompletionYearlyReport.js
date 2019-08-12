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
            "sector"            : props.sector,
            "startRange"        : 0,
            "limitRange"        : 10
            
        }
        console.log("tableData", this.state.tableData);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.getData(this.state.year, this.state.center, this.state.sector);
        this.handleChange = this.handleChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({
                year   : nextProps.year,
                center : nextProps.center.split('|')[1],
                sector : nextProps.sector.split('|')[1]
            },()=>{
                console.log('year', this.state.year, 'center', this.state.center,'sector', this.state.sector)
                this.getData(this.state.year, this.state.center, this.state.sector);
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
    getData(year, centerID, sector){
        console.log('year', year, 'centerID', centerID, 'sector', sector)
        axios.get('http://qalmisapi.iassureit.com/api/report/annual_completion/'+year+'/'+centerID+'/'+sector)
        .then((response)=>{
            console.log('response', response.data);
            var tableData = response.data.map((a, i)=>{
            return {
              _id                        : a._id,
              activityName               : a.activityName,
              unit                       : a.unit,
              annualPlan_Reach           : a.annualPlan_Reach,
              annualPlan_Upgradation     : a.annualPlan_Upgradation,
              annualPlan_physicalUnit    : a.annualPlan_physicalUnit,
              annualPlans_totalBudget    : a.annualPlans_totalBudget,
              annualFYAchie_Reach        : a.annualFYAchie_Reach,
              annualFYAchie_Upgradation  : a.annualFYAchie_Upgradation,
              annualFYAchie_physcialUnit : a.annualFYAchie_physcialUnit,
              annualFYAchie_totalExp     : a.annualFYAchie_totalExp,
              scrFYAchie_LHWRF           : a.scrFYAchie_LHWRF,
              scrFYAchie_NABARD          : a.scrFYAchie_NABARD,
              scrFYAchie_BankLoan        : a.scrFYAchie_BankLoan,
              scrFYAchie_Direct          : a.scrFYAchie_Direct,
              scrFYAchie_Indirect        : a.scrFYAchie_Indirect,
              scrFYAchie_Govt            : a.scrFYAchie_Govt,
              scrFYAchie_Other           : a.scrFYAchie_Other,
              remark                     : a.remark,
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
    getSearchText(searchText, startRange, limitRange){
        console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
    }
   
    render(){
        if(!this.props.loading){
            return( 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="sales-report-main-class">
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