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
    getData(year, center, sector, projectCategoryType, projectName, beneficiaryType){        
      if(year){
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";
        if( startDate && endDate && center && sector && projectCategoryType  && beneficiaryType){ 
            if(center==="all"){
              axios.get('/api/report/activity_annual_achievement_report/'+startDate+'/'+endDate+'/all/'+sector+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                    var tableData = response.data.map((a, i)=>{
                    return {
                      _id                           : a._id,
                      achievement_projectCategory   : a.achievement_projectCategory ? a.achievement_projectCategory : "-",
                      name                          : a.name,
                      unit                          : a.unit,
                      achievement_Reach             : this.addCommas(a.achievement_Reach),
                      achievement_FamilyUpgradation : this.addCommas(a.achievement_FamilyUpgradation), 
                      achievement_PhysicalUnit      : this.addCommas(a.achievement_PhysicalUnit),
                      achievement_TotalBudget_L     : a.achievement_TotalBudget_L,
                      achievement_LHWRF             : this.addCommas(a.achievement_LHWRF),
                      achievement_NABARD            : this.addCommas(a.achievement_NABARD),
                      achievement_Bank_Loan         : this.addCommas(a.achievement_Bank_Loan),
                      achievement_DirectCC          : this.addCommas(a.achievement_DirectCC),
                      achievement_IndirectCC        : this.addCommas(a.achievement_IndirectCC),
                      achievement_Govt              : this.addCommas(a.achievement_Govt),
                      achievement_Other             : this.addCommas(a.achievement_Other),
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
                axios.get('/api/report/activity_annual_achievement_report/'+startDate+'/'+endDate+'/'+center+'/'+sector+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                    var tableData = response.data.map((a, i)=>{
                    return {
                      _id                           : a._id,
                      achievement_projectCategory   : a.achievement_projectCategory ? a.achievement_projectCategory : "-",
                      name                          : a.name,
                      unit                          : a.unit,
                      achievement_Reach             : this.addCommas(a.achievement_Reach),
                      achievement_FamilyUpgradation : this.addCommas(a.achievement_FamilyUpgradation), 
                      achievement_PhysicalUnit      : this.addCommas(a.achievement_PhysicalUnit),
                      achievement_TotalBudget_L     : a.achievement_TotalBudget_L,
                      achievement_LHWRF             : this.addCommas(a.achievement_LHWRF),
                      achievement_NABARD            : this.addCommas(a.achievement_NABARD),
                      achievement_Bank_Loan         : this.addCommas(a.achievement_Bank_Loan),
                      achievement_DirectCC          : this.addCommas(a.achievement_DirectCC),
                      achievement_IndirectCC        : this.addCommas(a.achievement_IndirectCC),
                      achievement_Govt              : this.addCommas(a.achievement_Govt),
                      achievement_Other             : this.addCommas(a.achievement_Other),
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