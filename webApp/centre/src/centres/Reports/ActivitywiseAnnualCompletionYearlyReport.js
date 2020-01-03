import React, { Component } from 'react';
import axios                from 'axios';
// import $                    from 'jquery';
// import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
export default class YearlyReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            "reportData"        : [],
            "twoLevelHeader"    : props.twoLevelHeader,
            "tableHeading"      : props.tableHeading,
            "tableObjects"      : props.tableObjects ,
            "tableData"         : props.tableData,
            "year"              : props.year,
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
        const center_ID = localStorage.getItem("center_ID");
        const centerName = localStorage.getItem("centerName");
        // console.log("localStorage =",localStorage.getItem('centerName'));
        // console.log("localStorage =",localStorage);
        this.setState({
          center_ID    : center_ID,
          centerName   : centerName,
        },()=>{
        console.log("center_ID =",this.state.center_ID,"year", this.state.year);
        this.getData(this.state.year, this.state.center_ID, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);

        });
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        // console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector', this.state.sector)
        this.getData(this.state.year, this.state.center_ID, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);

        })
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.handleChange = this.handleChange.bind(this);
                    {console.log("year",this.state.year)}
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            if(nextProps.sector==="all"){
                this.setState({
                year                : nextProps.year,
                sector              : nextProps.sector,
                projectName         : nextProps.projectName,
                projectCategoryType : nextProps.projectCategoryType,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    this.getData(this.state.year, this.state.center_ID, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                });
            }else{
                this.setState({
                year   : nextProps.year,
                sector : nextProps.sector.split('|')[1],
                projectName         : nextProps.projectName,
                projectCategoryType : nextProps.projectCategoryType,
                beneficiaryType     : nextProps.beneficiaryType,
                },()=>{
                    this.getData(this.state.year, this.state.center_ID, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
                this.getData(this.state.year, this.state.center_ID, this.state.sector, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);

        });
    }
    getData(year, center_ID, sector, projectCategoryType, projectName, beneficiaryType){        
      if(year){
        if( center_ID && sector && projectCategoryType  && beneficiaryType){ 
          console.log('year', year, 'center_ID', center_ID, 'sector', sector);
          var startDate = year.substring(3, 7)+"-04-01";
          var endDate = year.substring(10, 15)+"-03-31";
          console.log(startDate, endDate, center_ID, sector, projectCategoryType, projectName, beneficiaryType);
          axios.get('/api/report/activity_annual_achievement_report/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
          // axios.get('/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector)
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
                achievement_Govt              : a.achievement_Govt,
                achievement_DirectCC          : a.achievement_DirectCC,
                achievement_IndirectCC        : a.achievement_IndirectCC,
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