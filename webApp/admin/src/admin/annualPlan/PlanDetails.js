import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./PlanDetails.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
class PlanDetails extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
      "center"              :"",
      "year"                :"FY 2019 - 2020",
      "sector_id"           :"",
      "sectorName"          :"",
      "subActivity"         :"",
      "activityName"        :"",
      "physicalUnit"        :"",
      "unitCost"            :"",
      "totalBudget"         :"",
      "noOfBeneficiaries"   :"",
      "LHWRF"               :"",
      "NABARD"              :"",
      "bankLoan"            :"",
      "govtscheme"          :"",
      "directCC"            :"",
      "indirectCC"          :"",
      "other"               :"",
      "remark"              :"",
      "shown"               : true,
      "month"               :"All Months", 
      "uID"                 :"",
      /*      "month"               :"Annually",*/ 
      "heading"             :"Monthly Plan",
      "months"              :["All Months","April","May","June","July","August","September","October","November","December","January","February","March"],
      "years"               :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],

      "shown"               : true,
       "twoLevelHeader"     : {
        apply               : true,
        firstHeaderData     : [
                                {
                                    heading : 'Activity Details',
                                    mergedColoums : 12
                                },
                                {
                                    heading : 'Source of Fund',
                                    mergedColoums : 9
                                },
                               
                              ]
      },
      "tableHeading"        : {
        month               : "Month",
        year                : "Year",
        sectorName          : "Sector",
        activityName        : "Activity",
        subactivityName     : "Sub-Activity",
        unit                : "Unit",
        physicalUnit        : "Physical Unit",
        unitCost            : "Unit Cost",
        totalBudget         : "Total Cost",
        noOfBeneficiaries   : "No. Of Beneficiaries",
        noOfFamilies        : "No. Of Families",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank Loan",
        govtscheme          : "Govt. Scheme",
        directCC            : "Dir. Comm. Contribution",
        indirectCC          : "Indi. Comm. Contribution",
        other               : "Other",
        remark              : "Remark",
        // actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/annualPlans/',
        paginationApply     : false,
        searchApply         : false,
        editUrl             : '/plan-details/',
      },   
      "startRange"          : 0,
      "limitRange"          : 1000,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fields                : {},
      errors                : {},
      subActivityDetails    : [],
      apiCall               : '/api/annualPlans'
    }
  }
  handleChange(event){
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      fields
    },()=>{
      this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    });
  }
  selectMonth(event){
    event.preventDefault();
    var tableObjects = this.state.tableObjects;
    tableObjects["apiLink"] = this.refs.month.value === 'All Months' ? '/api/annualPlans/' : '/api/monthlyPlans/';
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      "years"               : this.refs.month.value === 'All Months' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "month"               : this.refs.month.value,        
      "apiCall"             : this.refs.month.value === 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
      "sectorName"          : "",
      "activityName"        : "",
      "availableSubActivity": "",
      tableObjects,
      fields
    },()=>{
      console.log('month =====================================', this.state.month, this.state.year)
      this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    });
  }
  getLength(){
    axios.get(this.state.apiCall+'/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){      
    });
  }
  getData(center_ID, month, year, startRange, limitRange ){
    console.log("ggg",this.state.apiCall,center_ID,year);
    var data = {
    center_ID  : center_ID,
    month      : month,
    year       : year,
    startRange : startRange,
    limitRange : limitRange
    }
    axios.post(this.state.apiCall+'/list', data)
      .then((response)=>{
          console.log("response",response);
      var tableData = response.data.map((a, i)=>{
        return {
        _id                 : a._id,
        month               : a.month,
        year                : a.year,
        sectorName          : a.sectorName,
        activityName        : a.activityName,
        subactivityName     : a.subactivityName,
        unit                : a.unit,
        physicalUnit        : a.physicalUnit,
        unitCost            : a.unitCost,
        totalBudget         : a.totalBudget,
        noOfBeneficiaries   : a.noOfBeneficiaries,
        noOfFamilies        : a.noOfFamilies,
        LHWRF               : a.LHWRF,
        NABARD              : a.NABARD,
        bankLoan            : a.bankLoan,
        govtscheme          : a.govtscheme,
        directCC            : a.directCC,
        indirectCC          : a.indirectCC,
        other               : a.other,
        remark              : a.remark,
        
        }
      })

        this.setState({
          tableData : tableData
        },()=>{
          console.log("tableData",this.state.tableData);
        });
      })
      .catch(function(error){
          // console.log("error = ",error);
          if(error.message === "Request failed with status code 401"){
            swal({
                title : "abc",
                text  : "Session is Expired. Kindly Sign In again."
            });
          }
      });
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;

    if(nextProps.match.params.id){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        if(this.state.editId && this.state.month === 'All Months'){
          this.setState({
            "months"              :["All Months"],
            "years"               : this.refs.month.value === 'All Months' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value === 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }else if(this.state.editId && this.state.month !== 'All Months'){
          this.setState({
            "months"              :["April","May","June","July","August","September","October","November","December","January","February","March"],
            "years"               :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value === 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }
      })    
    }    
     this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    if(nextProps){
      this.getLength();
    }
    this.getAvailableCenters();
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.setState({
      "year"  : this.state.years[0],
      apiCall : this.refs.month.value === 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
    },()=>{
      console.log('year', this.state.year)
       this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    })
    this.getLength();
    this.getAvailableCenters();
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      // console.log('centersresponse', response);
        this.setState({
          availableCenters : response.data
        })
    }).catch(function (error) {
          // console.log("error = ",error);
          if(error.message === "Request failed with status code 401"){
            swal({
                title : "abc",
                text  : "Session is Expired. Kindly Sign In again."
            });
          }
      });
  }
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      var center_ID = this.state.selectedCenter.split('|')[1];
      console.log('center_ID', center_ID);
      this.setState({
        center_ID :center_ID,
        
      },()=>{
      this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);

      })
    });
  } 
  getSearchText(searchText, startRange, limitRange){
    this.setState({
      tableData : []
    })
  }
 
  render() {
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
  
    // console.log("availableCenters",this.state.availableCenters);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                          Plan Details                          
                      </div>
                      <hr className="hr-head container-fluid row"/>
                    </div>
                    </div>
                    <div className="row">
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                        <div className=" col-lg-9 col-lg-offset-1 col-sm-12 col-xs-12 formLable boxHeight ">
                          <div className=" col-lg-3 col-lg-offset-2 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                              <select className="custom-select form-control inputBox" ref="center" name="center"value={this.state.center} onChange={this.selectCenter.bind(this)}>
                                <option className="hidden" >-- Select Center --</option>
                                {
                                  this.state.availableCenters && this.state.availableCenters.length >0 ?
                                  this.state.availableCenters.map((data, index)=>{
                                    return(
                                      <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                                    );
                                  })
                                  :
                                  null
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.center}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                              <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.selectMonth.bind(this)} >
                                
                               {this.state.months.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 zeroIndex">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                              <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year }  onChange={this.handleChange.bind(this)} >
                                <option className="hidden" >-- Select Year --</option>
                               {
                                this.state.years.map((data, i)=>{
                                  return <option key={i}>{data}</option>
                                })
                               }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.year}</div>
                          </div>                          
                         
                        </div> 
                        </div> 
                      </div><br/>                      
                    </div>
                    <div className="AnnualHeadCont">
                      <div className="annualHead">
                      {
                        this.state.month=="--Quarter 1--"
                          ?
                            <h5>Quarterly Plan for April, May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                          :

                            <h5 default="Annual Plan">{this.state.month == "All Months" ? "Annual Plan": "Monthly Plan" || this.state.month !== "All Months" ? "Monthly Plan": "Annual Plan" }{ this.state.year !=="-- Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
                            // <h5>{this.state.month !== "Annually" ? "Monthly Plan "+ this.state.month : "Annual Plan " }{ this.state.year !=="--Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
                        }
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                      <div className="row">  
                       <IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                          getSearchText={this.getSearchText.bind(this)}
                        />
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
export default PlanDetails
