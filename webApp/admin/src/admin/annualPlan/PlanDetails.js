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
      "uID"                 :"",
      "heading"             :"Monthly Plan",
      "months"              :["All Months","April","May","June","July","August","September","October","November","December","January","February","March"],
      "years"               :[],
      "shown"               : true,
       "twoLevelHeader"     : {
        apply               : true,
        firstHeaderData     : [
                                {
                                    heading : 'Activity Details',
                                    mergedColoums : 10
                                },
                                {
                                    heading : 'Source of Fund',
                                    mergedColoums : 8
                                },
                                {
                                    heading : '',
                                    mergedColoums : 1
                                },
                                {
                                    heading : '',
                                    mergedColoums : 1
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
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank Loan",
        govtscheme          : "Govt. Scheme",
        directCC            : "Direct Community Contribution",
        indirectCC          : "Indirect Community Contribution",
        other               : "Other",
        remark              : "Remark",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/annualPlans/',
        paginationApply     : true,
        searchApply         : true,
        editUrl             : '/plan/',
      },   
      "startRange"          : 0,
      "limitRange"          : 10,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fields                : {},
      errors                : {},
      subActivityDetails    : [],
      // apiCall               : '/api/annualPlans'
    }
  }
  handleChange(event){
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
  selectMonth(event){
    event.preventDefault();
    var tableObjects = this.state.tableObjects;
    tableObjects["apiLink"] = this.refs.month.value == 'All Months' ? '/api/annualPlans/' : '/api/monthlyPlans/';
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      "years"               : this.refs.month.value == 'All Months' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "month"               : this.refs.month.value,        
      "apiCall"             : this.refs.month.value == 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
      "sectorName"          : "",
      "activityName"        : "",
      "availableSubActivity": "",
      tableObjects,
      fields
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange);
    });

    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
  subActivityDetails(event){
    event.preventDefault();
    let fields = this.state.fields;
    this.setState({
      [event.target.name] : event.target.value
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
    var subActivityDetails = this.state.subActivityDetails;
    var id = (event.target.name).split('-')[1];
    
    var idExist = subActivityDetails.filter((a)=>{return a.subactivity_ID == id});
    var name = (event.target.name).split('-')[0];
    if(idExist.length > 0){      
      for(var i=0; i<subActivityDetails.length; i++){
        if(subActivityDetails[i].subactivity_ID == id){
          subActivityDetails[i][name] = event.target.value
        }
      }
    }else{
      subActivityDetails.push({
        "subactivity_ID"      : id,
        "subactivityName"     : document.getElementById('subActivityName-'+id).innerHTML,
        "unit"                : document.getElementById('unit-'+id).innerHTML,
        [name]                : event.target.value

      })
    }
    this.setState({
      subActivityDetails : subActivityDetails
    })
  }
  SubmitAnnualPlan(event){
    event.preventDefault();
    var subActivityDetails = this.state.subActivityDetails;
    // if (this.validateFormReq() &&this.validateForm()) {
    
      let fields = {};
      fields["year"]              = "";
      fields["month"]             = "";
      fields["sectorName"]        = "";
      fields["activityName"]      = "";
      fields["physicalUnit"]      = "";
      fields["unitCost"]          = "";
      fields["totalBudget"]       = "";
      fields["noOfBeneficiaries"] = "";
      fields["LHWRF"]             = "";
      fields["NABARD"]            = "";
      fields["bankLoan"]          = "";
      fields["govtscheme"]        = "";
      fields["directCC"]          = "";
      fields["indirectCC"]        = "";
      fields["other"]             = "";
      fields["remark"]            = "";
      if(subActivityDetails.length > 0){
        for(var i=0; i<subActivityDetails.length; i++){
          var planValues = {
            "month"               : this.refs.month.value,          
            "year"                : this.refs.year.value,          
            "center_ID"           : "P01",
            "center"              : "Pune",
            "sector_ID"           : this.refs.sectorName.value.split('|')[1],
            "sectorName"          : this.refs.sectorName.value.split('|')[0],
            "activity_ID"         : this.refs.activityName.value.split('|')[1],
            "activityName"        : this.refs.activityName.value.split('|')[0],
            "subactivity_ID"      : subActivityDetails[i].subactivity_ID,
            "subactivityName"     : subActivityDetails[i].subactivityName,
            "unit"                : subActivityDetails[i].unit,
            "physicalUnit"        : subActivityDetails[i].physicalUnit,
            "unitCost"            : subActivityDetails[i].unitCost,
            "totalBudget"         : subActivityDetails[i].totalBudget,
            "noOfBeneficiaries"   : subActivityDetails[i].noOfBeneficiaries,
            "LHWRF"               : subActivityDetails[i].LHWRF,
            "NABARD"              : subActivityDetails[i].NABARD,
            "bankLoan"            : subActivityDetails[i].bankLoan,
            "govtscheme"          : subActivityDetails[i].govtscheme,
            "directCC"            : subActivityDetails[i].directCC,
            "indirectCC"          : subActivityDetails[i].indirectCC,
            "other"               : subActivityDetails[i].other,
            "remark"              : subActivityDetails[i].remark,
          };
          axios.post(this.state.apiCall, planValues)
            .then((response)=>{
              swal({
                title : response.data.message,
                text  : response.data.message
              });
              this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch(function(error){
              console.log("error"+error);
          });
          Object.entries(planValues).map( 
            ([key, value], i)=> {
              this.setState({
                [key+'-'+this.state.subactivity_ID] : ""
              })
            }
          );
        }
      }
      this.setState({
        "year"                :"",
        "month"               :"",
        "center"              :"",
        "sector_id"           :"",
        "sectorName"          :"",
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
        "fields"              :fields,
        "editId"              :"",
        "subActivityDetails"  :[],
        "availableSubActivity":[]
      });
    // }
  }
  Update(event){    
    event.preventDefault();
    var subActivityDetails = this.state.subActivityDetails;
    console.log('subActivityDetails update', subActivityDetails);
    // if(this.refs.year.value == "" || this.refs.month.value =="" || this.refs.sectorName.value=="" || this.refs.activityName.value=="" 
    //   || this.refs.physicalUnit.value=="" || this.refs.unitCost.value=="" || this.refs.totalBudget.value=="" || this.refs.noOfBeneficiaries.value=="" 
    //   || this.refs.LHWRF.value=="" || this.refs.NABARD.value=="" || this.refs.bankLoan.value=="" || this.refs.govtscheme.value=="" 
    //   || this.refs.directCC.value=="" || this.refs.indirectCC.value=="" || this.refs.other.value=="" || this.refs.remark.value=="")
    //   {
    //     if (this.validateFormReq() && this.validateForm()){
    //     }
    //   }else{
        
      let fields = {};
      fields["year"]              = "";
      fields["month"]             = "";
      fields["sectorName"]        = "";
      fields["activityName"]      = "";
      fields["physicalUnit"]      = "";
      fields["unitCost"]          = "";
      fields["totalBudget"]       = "";
      fields["noOfBeneficiaries"] = "";
      fields["LHWRF"]             = "";
      fields["NABARD"]            = "";
      fields["bankLoan"]          = "";
      fields["govtscheme"]        = "";
      fields["directCC"]          = "";
      fields["indirectCC"]        = "";
      fields["other"]             = "";
      fields["remark"]            = "";
      if(subActivityDetails.length > 0){
        for(var i=0; i<subActivityDetails.length; i++){
          var planValues = {
            "annualPlan_ID"       : this.state.editId,
            "monthlyPlan_ID"      : this.state.editId,
            "month"               : this.refs.month.value,          
            "year"                : this.refs.year.value,          
            "center_ID"           : "P01",
            "center"              : "Pune",
            "sector_ID"           : this.refs.sectorName.value.split('|')[1],
            "sectorName"          : this.refs.sectorName.value.split('|')[0],
            "activity_ID"         : this.refs.activityName.value.split('|')[1],
            "activityName"        : this.refs.activityName.value.split('|')[0],
            "subactivity_ID"      : subActivityDetails[i].subactivity_ID,
            "subactivityName"     : subActivityDetails[i].subactivityName,
            "unit"                : subActivityDetails[i].unit,
            "physicalUnit"        : subActivityDetails[i].physicalUnit,
            "unitCost"            : subActivityDetails[i].unitCost,
            "totalBudget"         : subActivityDetails[i].totalBudget,
            "noOfBeneficiaries"   : subActivityDetails[i].noOfBeneficiaries,
            "LHWRF"               : subActivityDetails[i].LHWRF,
            "NABARD"              : subActivityDetails[i].NABARD,
            "bankLoan"            : subActivityDetails[i].bankLoan,
            "govtscheme"          : subActivityDetails[i].govtscheme,
            "directCC"            : subActivityDetails[i].directCC,
            "indirectCC"          : subActivityDetails[i].indirectCC,
            "other"               : subActivityDetails[i].other,
            "remark"              : subActivityDetails[i].remark,
          };
          // console.log('planValues',planValues);

          axios.patch(this.state.apiCall+'/update', planValues)
            .then((response)=>{
              swal({
                title : response.data.message,
                text  : response.data.message
              });
              this.props.history.push('/plan');
              this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch(function(error){
              console.log("error"+error);
          });
          Object.entries(planValues).map( 
            ([key, value], i)=> {
              this.setState({
                [key+'-'+this.state.subactivity_ID] : ""
              })
            }
          );

        }
      }
      console.log('subActivityDetails', subActivityDetails);
      this.setState({
        "year"                :"",
        "month"               :"",
        "center"              :"",
        "sector_id"           :"",
        "sectorName"          :"",
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
        "fields"              :fields,
        "editId"              :"",
        "subActivityDetails"  :[],
        "availableSubActivity":[]
      });
      this.props.history.push('/plan');
    // }
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
      if (!fields["sectorName"]) {
        formIsValid = false;
        errors["sectorName"] = "This field is required.";
      }     
      if (!fields["activityName"]) {
        formIsValid = false;
        errors["activityName"] = "This field is required.";
      }     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);

      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  getData(startRange, limitRange){
    var data = {
    startRange : startRange,
    limitRange : limitRange
    }
    axios.post(this.state.apiCall+'/list', data)
      .then((response)=>{
        this.setState({
          tableData : response.data
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableSectors();
    var editId = nextProps.match.params.id;

    if(nextProps.match.params.id){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        if(this.state.editId && this.state.month == 'All Months'){
          this.setState({
            "months"              :["All Months"],
            "years"               : this.refs.month.value == 'All Months' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value == 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }else if(this.state.editId && this.state.month != 'All Months'){
          this.setState({
            "months"              :["April","May","June","July","August","September","October","November","December","January","February","March"],
            "years"               :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value == 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }
        this.getAvailableActivity(this.state.editSectorId);
        this.getAvailableSubActivity(this.state.editSectorId);
        this.edit(this.state.editId);
      })    
    }
  }
  componentDidMount() {
    this.getAvailableSectors();
    if(this.state.editId){     
      this.edit(this.state.editId);       
    }
    this.setState({
      apiCall : this.refs.month.value == 'All Months' ? '/api/annualPlans' : '/api/monthlyPlans',
    },()=>{
      console.log('this.this.state.', this.state )
    })
    
    this.getData(this.state.startRange, this.state.limitRange);
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      sector_ID : sector_ID
    })
    this.handleChange(event);
    this.getAvailableActivity(sector_ID);
  }
  getAvailableActivity(sector_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      
        this.setState({
          availableActivity : response.data[0].activity
        },()=>{
          
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var activity_ID = event.target.value.split('|')[1];
    this.handleChange(event);
    this.getAvailableSubActivity(this.state.sector_ID, activity_ID);
  }
  excludeSubmittedSubActivity(){
    console.log('this.state.apiCall',this.state.apiCall, this.state.availableSubActivity);
    axios({
      method: 'get',
      url: this.state.apiCall+'/list',
    }).then((response)=> {
      if(response.data.length > 0){
        var submittedSubActivity = response.data.map((a, i)=>{
          return _.pick(a, "subactivity_ID", "month")
        })

        console.log('submittedSubActivity', submittedSubActivity);
        var abc = _.compact(submittedSubActivity.map((m, i)=> { 
          if(m.month == this.refs.month.value){
            return m
          } 
        }));

        console.log('abc', abc);
        var x = this.state.availableSubActivity.map((a, i)=>{
          console.log('a',a);
          // if(abc){
          //   console.log('abc',abc);
            // return abc.map((b, j)=>{ 
            //   console.log(a._id +'!='+ b.subactivity_ID); 
            //   if(a._id != b.subactivity_ID){
            //     return a;
            //   }  
            // })
          // }  

          if(abc.filter((b)=>{return a._id != b.subactivity_ID ? true : false})){
            console.log(true);
            return a;
          }
        });

        this.setState({
          availableSubActivity : _.compact(_.flatten(x))
        },()=>{
          console.log('availableSubActivity', this.state.availableSubActivity);
        });
      }
    }).catch(function (error) {
      console.log('error', error);
    }); 
  }
  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
        var availableSubActivity = _.flatten(response.data.map((a, i)=>{
            return a.activity.map((b, j)=>{return b._id ==  activity_ID ? b.subActivity : [] 
          });
        }))
        this.setState({
          availableSubActivity : availableSubActivity
        })
        this.excludeSubmittedSubActivity(availableSubActivity);
       
      
    }).catch(function (error) {
      console.log('error', error);
    }); 
  }
  edit(id){
    console.log('this.state.apiCall',this.state.apiCall);
    axios({
      method: 'get',
      url: this.state.apiCall+'/'+id,
      }).then((response)=> {
      var editData = response.data[0];
      console.log('editData', editData);
      this.getAvailableActivity(editData.sector_ID);
      this.setState({
        "availableSubActivity"    : [{
          _id                     : editData.subactivity_ID,
          subActivityName         : editData.subactivityName,
        }],
      },()=>{
        this.setState({
          "year"                    : editData.year,
          "month"                   : editData.month,
          "center"                  : editData.center,
          "sectorName"              : editData.sectorName+'|'+editData.sector_ID,
          "activityName"            : editData.activityName+'|'+editData.activity_ID,
          "subactivity_ID"          : editData.subactivity_ID,
          "subActivityDetails"      : [{
            "subactivity_ID"      : editData.subactivity_ID,
            "subactivityName"     : editData.subactivityName,
            "unit"                : editData.unit,
            "physicalUnit"        : editData.physicalUnit,
            "unitCost"            : editData.unitCost,
            "totalBudget"         : editData.totalBudget,
            "noOfBeneficiaries"   : editData.noOfBeneficiaries,
            "LHWRF"               : editData.LHWRF,
            "NABARD"              : editData.NABARD,
            "bankLoan"            : editData.bankLoan,
            "govtscheme"          : editData.govtscheme,
            "directCC"            : editData.directCC,
            "indirectCC"          : editData.indirectCC,
            "other"               : editData.other,
            "remark"              : editData.remark,
          }]
        },()=>{
          var subActivityDetails = this.state.subActivityDetails[0];
          Object.entries(subActivityDetails).map( 
            ([key, value], i)=> {
              this.setState({
                [key+'-'+this.state.subactivity_ID] : value
              })
            }
          );
        });
      })
    }).catch(function (error) {
    });
  }
  toglehidden(){
   this.setState({
       shown: !this.state.shown
      });
  }
  render() {
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
  
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
                           <div className=" col-lg-3  col-lg-offset-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                              <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.selectMonth.bind(this)} >
                                
                               {this.state.months.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
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
                         {/* <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 " >
                              <div className="addform " id="click_advance"  onClick={this.toglehidden.bind(this)}>
                                <div className="display_advance addContainerAct"  id="display_advance">
                                  <i className="fa fa-plus" aria-hidden="true" id="click"></i>
                                </div>
                              </div>
                            </div>
                          </div>*/}
                        </div> 
                      </div><br/>                      
                    {/*  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"  style={hidden} id="Academic_details">
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  validbox ">                
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                              <label className="formLable">Sector</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorName" >
                                <select className="custom-select form-control inputBox" ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.selectSector.bind(this)}>
                                  <option  className="hidden" >--Select--</option>
                                  {
                                    this.state.availableSectors && this.state.availableSectors.length >0 ?
                                    this.state.availableSectors.map((data, index)=>{
                                      return(
                                        <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.sectorName}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                              <label className="formLable">Activity</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activityName" >
                                <select className="custom-select form-control inputBox"ref="activityName" name="activityName" value={this.state.activityName} onChange={this.selectActivity.bind(this)} >
                                  <option  className="hidden" >-- Select--</option>
                                  {
                                  this.state.availableActivity && this.state.availableActivity.length >0 ?
                                  this.state.availableActivity.map((data, index)=>{
                                    if(data.activityName ){
                                      return(
                                        <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                      );
                                    }
                                  })
                                  :
                                  null
                                }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.activityName}</div>
                            </div>                  
                          </div> 
                        </div><br/>  
                        <div>
                          {this.state.availableSubActivity ? <hr className="hr-head"/> :""}
                        </div>                     
                          {
                            this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                            this.state.availableSubActivity.map((data, index)=>{
                              if(data.subActivityName ){
                                return(
                                  <div className="subActDiv"  key={data._id}>
                                    <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 contentDiv  ">
                                      <label className="head" value={data.subActivityName+'|'+data._id} id={"subActivityName-"+data._id}>{data.subActivityName} </label><br/>
                                      <label className="formLable">Unit :<span id={"unit-"+data._id}>{data.unit}</span></label>
                                     </div>
                                    <div className="col-lg-9 col-sm-10 col-xs-10 ">
                                      <div className="row">
                                        <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                          <label className="formLable head">Sub-Activity Details</label>
                                        </div>
                                      </div>
                                      <div className=" row">
                                        <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                          <label className="formLable">Physical Units</label>
                                          <div className=" input-group inputBox-main " id={"physicalUnit-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"physicalUnit-"+data._id} placeholder="" ref={"physicalUnit-"+data._id} value={this.state["physicalUnit-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                          <label className="formLable">Unit Cost</label>
                                          <div className=" input-group inputBox-main" id={"unitCost-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"unitCost-"+data._id} placeholder="" ref={"unitCost"+"-"+data._id} value={this.state["unitCost-"+data._id]} onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>  
                                        <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                          <label className="formLable">Total Cost</label>
                                          <div className="input-group inputBox-main" id={"totalBudget-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"totalBudget-"+data._id} placeholder="" ref={"totalBudget-"+data._id} value={this.state["totalBudget-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>  
                                        <div className=" col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields">
                                          <label className="formLable">No.of Beneficiaries</label>
                                          <div className=" input-group inputBox-main" id={"noOfBeneficiaries-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"noOfBeneficiaries-"+data._id} placeholder="" ref={"noOfBeneficiaries-"+data._id} value={this.state["noOfBeneficiaries-"+data._id]} onChange={this.subActivityDetails.bind(this)}/>                              
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                          <label className="formLable head">Sources of Fund</label>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">LHWRF</label>
                                          <div className=" input-group inputBox-main" id={"LHWRF-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"LHWRF-"+data._id} placeholder="" ref={"LHWRF-"+data._id} value={this.state["LHWRF-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">NABARD</label>
                                          <div className=" input-group inputBox-main" id={"NABARD-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"NABARD-"+data._id} placeholder="" ref={"NABARD-"+data._id} value={this.state["NABARD-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">Bank Loan</label>
                                          <div className=" input-group inputBox-main" id={"bankLoan-"+data._id}>
                                            <input type="text" className="form-control inputBox nameParts" name={"bankLoan-"+data._id} placeholder="" ref={"bankLoan-"+data._id} value={this.state["bankLoan-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">Govt. Schemes</label>
                                          <div className=" input-group inputBox-main" id={"govtscheme-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"govtscheme-"+data._id} placeholder="" ref={"govtscheme-"+data._id} value={this.state["govtscheme-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">Direct Com. Cont.</label>
                                          <div className=" input-group inputBox-main" id={"directCC-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"directCC-"+data._id} placeholder="" ref={"directCC-"+data._id} value={this.state["directCC-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">Indirect Com. Cont.</label>
                                          <div className=" input-group inputBox-main" id={"indirectCC-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"indirectCC-"+data._id} placeholder="" ref={"indirectCC-"+data._id} value={this.state["indirectCC-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                      </div>
                                      <div className=" row">
                                        <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                          <label className="formLable">Other</label>
                                          <div className=" input-group inputBox-main" id={"other-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"other-"+data._id} placeholder="" ref={"other-"+data._id} value={this.state["other-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                        <div className=" col-lg-10 col-md-10 col-sm-12 col-xs-12 planfields">
                                          <label className="formLable">Remark</label>
                                          <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id={"remark-"+data._id} >
                                            <input type="text" className="form-control inputBox nameParts" name={"remark-"+data._id} placeholder="Remark" ref={"remark-"+data._id} value={this.state["remark-"+data._id]}  onChange={this.subActivityDetails.bind(this)}/>
                                          </div>
                                        </div>
                                      </div>  
                                      <div className="row">                            
                                        <div className=" col-lg-10 col-lg-offset-2 col-sm-12 col-xs-12  padmi3">
                                          <div className=" col-lg-12 col-md-6 col-sm-6 col-xs-12 padmi3 ">
                                            <label className="formLable"></label>
                                            <div className="errorMsg">{this.state.errors.remark}</div>
                                          </div>
                                        </div> 
                                      </div><br/>
                                    </div>  <br/>
                                  </div>
                                );
                              }else{
                                return <label>Please check either all sub Activity Details are submitted or you don't have sub activity for activity  </label>
                              }
                            })
                            :
                            null
                          }                           
                        <div className="col-lg-12">
                         <br/>{
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.SubmitAnnualPlan.bind(this)}> Submit </button>
                        }
                        </div>
                      
                      </form>*/}
                    </div>
                    <div className="AnnualHeadCont">
                      <div className="annualHead">
                      {
                        this.state.month=="--Quarter 1--"
                          ?
                            <h5>Quarterly Plan for April, May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                          :
                            <h5>{this.state.month !== "All Months" ? "Monthly Plan "+ this.state.month : "Annual Plan " }{ this.state.year !=="-- Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
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
