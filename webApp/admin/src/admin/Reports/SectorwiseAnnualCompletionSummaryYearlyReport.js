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
            "projectCategoryType"    : props.projectCategoryType,
            "projectName"            : props.projectName,
            "beneficiaryType"        : props.beneficiaryType,
            "startRange"        : 0,
            "limitRange"        : 10000
            
        }
        console.log("tableData", this.state);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        this.handleChange = this.handleChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){

        if(nextProps){
            if(nextProps.center==="all"){
                this.setState({
                year   : nextProps.year,
                center : nextProps.center,
                projectCategoryType : nextProps.projectCategoryType,
                projectName         : nextProps.projectName,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                });
            }else{
                this.setState({
                    year   : nextProps.year,
                    center : nextProps.center.split('|')[1],
                    projectCategoryType : nextProps.projectCategoryType,
                    projectName         : nextProps.projectName,
                    beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    // console.log('year', this.state.year, 'center', this.state.center,'sector', this.state.sector)
                    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                });
            }
        }    
    }
    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        this.setState({
           [name] : event.target.value,
        },()=>{
            this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
    }
    addCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    getData(year, center_ID, projectCategoryType, projectName, beneficiaryType){        
        if(year){
            var startDate = year.substring(3, 7)+"-04-01";
            var endDate = year.substring(10, 15)+"-03-31";    
            if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
                axios.get('/api/report/sector/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                    console.log('response', response);
                    var tableData = response.data.map((a, i)=>{
                    return {
                        _id                               : a._id,
                        achievement_projectCategory       : a.achievement_projectCategory ? a.achievement_projectCategory : "-",
                        name                              : a.name,
                        annualPlan_Reach                  : this.addCommas(a.annualPlan_Reach), 
                        annualPlan_FamilyUpgradation      : this.addCommas(a.annualPlan_FamilyUpgradation), 
                        annualPlan_TotalBudget            : this.addCommas(a.annualPlan_TotalBudget),
                        achievement_Reach                 : this.addCommas(a.achievement_Reach), 
                        achievement_FamilyUpgradation     : this.addCommas(a.achievement_FamilyUpgradation), 
                        achievement_TotalBudget           : this.addCommas(a.achievement_TotalBudget), 
                        Per_Annual                        : a.Per_Annual,
                        achievement_LHWRF                 : this.addCommas(a.achievement_LHWRF),
                        achievement_NABARD                : this.addCommas(a.achievement_NABARD),
                        achievement_Bank_Loan             : this.addCommas(a.achievement_Bank_Loan),
                        achievement_Govt                  : this.addCommas(a.achievement_Govt),
                        achievement_DirectCC              : this.addCommas(a.achievement_DirectCC),
                        achievement_IndirectCC            : this.addCommas(a.achievement_IndirectCC),
                        achievement_Other                 : this.addCommas(a.achievement_Other),
                    }
                })
                    this.setState({
                        tableData : tableData
                    },()=>{
                        console.log("tableData",this.state.tableData);
                    });
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
                <div className="">
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
            );
        
    }
}