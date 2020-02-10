import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../common/Loader.js";

import "../Reports/Reports.css";

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
    this.handleFromChange    = this.handleFromChange.bind(this);
    this.handleToChange      = this.handleToChange.bind(this);
    this.currentFromDate     = this.currentFromDate.bind(this);
    this.currentToDate       = this.currentToDate.bind(this);
  }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
        this.currentFromDate();
        this.currentToDate();
        this.setState({
            tableData : this.state.tableData,
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }   
    componentWillReceiveProps(nextProps){
        this.currentFromDate(); 
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
    getData(startDate, endDate){        
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
    handleFromChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
       
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var startDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           startDate:startDate
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
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
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
        }else {
           var today = (new Date());
           var nextDate = today.getDate() - 30;
           today.setDate(nextDate);
           var today =  moment(today).format('YYYY-MM-DD');
        }
        this.setState({
           startDate :today
        });
        return today;
    }
    currentToDate(){
        if(this.state.endDate){
            var today = this.state.endDate;
        }else {
            var today =  moment(new Date()).format('YYYY-MM-DD');
        }
        this.setState({
            endDate :today
        });
        return today;
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
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box">
                                          <label className="formLable">From</label><span className="asterix"></span>
                                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                              <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                          </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box">
                                          <label className="formLable">To</label><span className="asterix"></span>
                                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                              <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                          </div>
                                      </div>           
                                    </div>
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