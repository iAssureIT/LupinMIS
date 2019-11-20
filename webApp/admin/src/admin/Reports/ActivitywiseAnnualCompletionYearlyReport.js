import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
export default class ActivitywiseAnnualCompletionYearlyReport extends Component{
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
            "beneficiaryType"   : props.beneficiaryType,
            "projectCategoryType": props.projectCategoryType,
            "projectName"       : props.projectName,
            "startRange"        : 0,
            "limitRange"        : 10000
            
        }
        // console.log("tableData", this.state.tableData);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getData(this.state.year, this.state.center, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        this.handleChange = this.handleChange.bind(this);
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            if(nextProps.sector==="all"){
                this.setState({
                year   : nextProps.year,
                sector : nextProps.sector,
                projectName         : nextProps.projectName,
                projectCategoryType : nextProps.projectCategoryType,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    this.getData(this.state.year, this.state.center, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                });
            }else{
                this.setState({
                year   : nextProps.year,
                sector : nextProps.sector.split('|')[1],
                projectName         : nextProps.projectName,
                projectCategoryType : nextProps.projectCategoryType,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    this.getData(this.state.year, this.state.center, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                });                
            }
            if(nextProps.center==="all"){
                this.setState({
                year   : nextProps.year,
                center : nextProps.center,
                projectName         : nextProps.projectName,
                projectCategoryType : nextProps.projectCategoryType,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    this.getData(this.state.year, this.state.center, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                });
            }else{
                this.setState({
                year   : nextProps.year,
                center : nextProps.center.split('|')[1],
                projectName         : nextProps.projectName,
                projectCategoryType : nextProps.projectCategoryType,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    // console.log('year', this.state.year, 'center', this.state.center,'sector', this.state.sector)
                    this.getData(this.state.year, this.state.center, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
            this.getData(this.state.year, this.state.center, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
    }

    getData(year, center, sector, projectCategoryType, projectName, beneficiaryType){        
      if(year){
        console.log( center, sector, projectCategoryType, projectName, beneficiaryType);
        console.log('year', year, 'center', center, 'sector', sector);
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";
        if( startDate && endDate && center && sector && projectCategoryType  && beneficiaryType){ 
        console.log(startDate, endDate, center, sector, projectCategoryType, projectName, beneficiaryType);
            if(center==="all"){
              axios.get('/api/report/activity/'+startDate+'/'+endDate+'/all/'+sector+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                    console.log('response', response.data);
                    var tableData = response.data.map((a, i)=>{
                    return {
                      _id                           : a._id,
                      name                          : a.name,
                      unit                          : a.unit,
                      annualPlan_Reach              : a.annualPlan_Reach,
                      annualPlan_FamilyUpgradation  : a.annualPlan_FamilyUpgradation,
                      annualPlan_PhysicalUnit       : a.annualPlan_PhysicalUnit,
                      annualPlan_TotalBudget        : a.annualPlan_TotalBudget,
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
            }else{
                axios.get('/api/report/activity/'+startDate+'/'+endDate+'/'+center+'/'+sector+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
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
            // }   
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
   
  render(){
    return( 
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="report-list-downloadMain row">
          <IAssureTable 
              tableName = "Activitywise Annual Completion Report"
              id = "activitywiseAnnualCompletionReport"
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