import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "../../Reports/Reports.css";
import "./CenterRankingReport.css";

class CenterRankingReport extends Component{
    constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "center_ID"         : "all",
        "center"            : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "startDate"         : "",
        "endDate"           : "",
        "twoLevelHeader"    : {
            apply           : false,
            firstHeaderData : [
                {
                    heading : "",
                    mergedColoums :1,
                    hide : true
                },
            ]
        },
        "tableHeading"      : {
            "centerName"              : "Center",
            "score"                   : "Score",
            "LHWRF_Utilized"          : "LHWRF Budget Utilization",
            "Other_Utilized"          : "Other Budget Utilization",
            "totalBudget_Utilized"    : "TOTAL Budget Utilization",
            "outReach"                : "Villages  / 1 Lakh",
            "FamilyUpgradation"       : "Families Upgrade / 1 Lakh",
        },        
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.getFinancialYear();
        this.setState({
            tableData : this.state.tableData,
        },()=>{
            this.getData(this.state.firstYear, this.state.secondYear, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
        this.getData(this.state.firstYear, this.state.secondYear, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    }   

    componentWillReceiveProps(nextProps){
        this.getFinancialYear();
        this.getData(this.state.firstYear, this.state.secondYear, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    }

    handleChange(event){
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        },()=>{
            this.getData(this.state.firstYear, this.state.secondYear, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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

    getFinancialYear() {
        let financialYear;
        let today = moment();
        console.log('today',today);
        if(today.month() >= 3){
            financialYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
        }
        else{
            financialYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
        }
        this.setState({
            financialYear :financialYear
        },()=>{
        console.log('financialYear',this.state.financialYear);
            var firstYear= this.state.financialYear.split('-')[0]
            var secondYear= this.state.financialYear.split('-')[1]
            console.log(firstYear,secondYear);
            this.setState({
                firstYear  :firstYear,
                secondYear :secondYear
            },()=>{
                this.getData(this.state.firstYear, this.state.secondYear, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })
        });
    }   
    getData(firstYear, secondYear){  
        if(firstYear && secondYear){ 
            var startDate = firstYear+"-04-01";
            var endDate = secondYear+"-03-31";   
                console.log('startDate-endDate',startDate,endDate);     
            if(startDate && endDate){ 
                $(".fullpageloader").show();
                axios.get('/api/centerRanking/'+startDate+'/'+endDate)
                    .then((response)=>{
                        $(".fullpageloader").hide();
                        console.log("response = ",response);
                        var tableData = response.data.map((a, i)=>{
                        return {
                            _id                     : a._id,
                            centerName              : a.centerName,
                            score                   : a.score,
                            LHWRF_Utilized          : a.LHWRF_Utilized,
                            Other_Utilized          : a.Other_Utilized,
                            totalBudget_Utilized    : a.totalBudget_Utilized,
                            outReach                : a.outReach,
                            FamilyUpgradation       : a.FamilyUpgradation,
                        } 
                    })  
                    this.setState({
                        tableData : tableData
                    })
                })
                .catch(function(error){  
                    console.log("error = ",error);
                });
            }
        }
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
                                            Center Ranking Report       
                                        </div>
                                    </div>
                                    <hr className="hr-head"/>
                                    <div className="marginTop11">
                                        <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <IAssureTable 
                                                tableName = "Center Ranking Report"
                                                id = "CenterRankingReport"
                                                completeDataCount={this.state.tableDatas.length}
                                                twoLevelHeader={this.state.twoLevelHeader} 
                                                editId={this.state.editSubId} 
                                                getData={this.getData.bind(this)} 
                                                tableHeading={this.state.tableHeading} 
                                                tableData={this.state.tableData} 
                                                tableObjects={this.state.tableObjects}/>
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
export default CenterRankingReport