import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./PlanDetails.css";
import BulkUpload             from "../bulkupload/BulkUpload.js";

var add=0

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
      "year"                :"FY 2019 - 2020",
      "indirectCC"          :"",
      "other"               :"",
      "remark"              :"",
      "shown"               : true,
      "uID"                 :"",
      "month"               :"Annual Plan", 
      "heading"             :"Annual Plan",
      "months"              :["Annual Plan","All Months","April","May","June","July","August","September","October","November","December","January","February","March"],
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
        directCC            : "Direct Community Contribution",
        indirectCC          : "Indirect Community Contribution",
        other               : "Other",
        remark              : "Remark",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/annualPlans/',
        paginationApply     : false,
        downloadApply       : true,
        searchApply         : false,
        editUrl             : '/plan-details/',
      },   
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fields                : {},
      errors                : {},
      subActivityDetails    : [],
      apiCall               : '/api/annualPlans'
    }
    this.uploadedData = this.uploadedData.bind(this);
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
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
  
  subActivityDetails(event){
    // console.log("subActivityDetails",subActivityDetails);
    event.preventDefault();
    var id = (event.target.name).split('-')[1];
    let fields = this.state.fields;
    const x =  this.refs["physicalUnit-"+id].value * this.refs["unitCost-"+id].value;
    // console.log('x',x)
    this.setState({
      [event.target.name] : event.target.value,
      totalBud : x,
      ["totalBudget-"+id] : x
    },()=>{
      // console.log('totalBud=========',this.state.totalBud );
      if (parseInt(this.state[`noOfBeneficiaries-${id}`]) < parseInt(this.state[`noOfFamilies-${id}`]) ) {
        swal("No. of Families should not greater than No. of Beneficiaries");
        this.setState({
          [`noOfBeneficiaries-${id}`] : 0,
          [`noOfFamilies-${id}`] : 0
        });
      }
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
    var subActivityDetails = this.state.subActivityDetails;
    
    // console.log("this.state.subActivityDetails",this.state.subActivityDetails);
    var idExist = subActivityDetails.filter((a)=>{return a.subactivity_ID === id});
    var name = (event.target.name).split('-')[0];
    // console.log("idExist",idExist);
     var y =parseInt(x);
     // console.log("y1 = ",y);
    if(idExist.length > 0){      
     // console.log("y2 = ",idExist.length );
      for(var i=0; i<subActivityDetails.length; i++){
        if(subActivityDetails[i].subactivity_ID === id){
          subActivityDetails[i][name] = event.target.value;
          subActivityDetails[i].totalBudget = y
        }
      }
    }else{
     // console.log("y3 = ",y);
      subActivityDetails.push({
        "subactivity_ID"      : id,
        "subactivityName"     : document.getElementById('subActivityName-'+id).innerHTML,
        "unit"                : document.getElementById('unit-'+id).innerHTML,
        "totalBudget"         : y,
        [name]                : event.target.value

      })
    }
    this.setState({
      subActivityDetails : subActivityDetails
    },()=>{
      // console.log("subActivityDetails",this.state.subActivityDetails);
    })
  }
  uploadedData(data){
     this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
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
      fields["noOfFamilies"]      = "";
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
            "center_ID"           : this.state.center_ID,
            "center"              : this.state.centerName,
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
            "noOfFamilies"        : subActivityDetails[i].noOfFamilies,
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
              console.log("response",response);
              swal({
                title : response.data.message,
                text  : response.data.message
              });
              this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
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
      }else{
        swal({
          title : "abc",
          text  : "Please fill atleast one SubActivity Details."
        });
      }
      this.setState({
        "planValues"          :"",
        "year"                : this.refs.year.value,
        "month"               : this.refs.month.value,
        "center"              :"",
        "sector_id"           :"",
        "sectorName"          :"",
        "activityName"        :"",
        "physicalUnit"        :"",
        "unitCost"            :"",
        "totalBudget"         :"",
        "noOfBeneficiaries"   :"",
        "noOfFamilies"        :"",
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
        "availableSubActivity":[],
        "availableActivity"   :[],
        "subActivityDetails[i][name]":"",
        shown                 : !this.state.shown
      });
    // }
  }
  Update(event){    
    event.preventDefault();
    var subActivityDetails = this.state.subActivityDetails;
    console.log('subActivityDetails',subActivityDetails)
    // if(this.refs.year.value === "" || this.refs.month.value ==="" || this.refs.sectorName.value==="" || this.refs.activityName.value==="" 
    //   || this.state.physicalUnit==="" || this.refs.unitCost.value==="" || this.refs.totalBudget.value==="" || this.refs.noOfBeneficiaries.value==="" 
    //   || this.refs.LHWRF.value==="" || this.refs.NABARD.value==="" || this.refs.bankLoan.value==="" || this.refs.govtscheme.value==="" 
    //   || this.refs.directCC.value==="" || this.refs.indirectCC.value==="" || this.refs.other.value==="" || this.refs.remark.value==="")
    // {
    //   /*    if (this.validateFormReq() && this.validateForm()){
    //       }*/
    // }else{
      
    // }
    if(subActivityDetails&&subActivityDetails.length > 0){
      for(var i=0; i<subActivityDetails.length; i++){
        var planValues = {
          "annualPlan_ID"       : this.state.editId,
          "monthlyPlan_ID"      : this.state.editId,
          "month"               : this.refs.month.value,          
          "year"                : this.refs.year.value,           
          "center_ID"           : this.state.center_ID,
          "center"              : this.state.centerName,
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
          "noOfFamilies"        : subActivityDetails[i].noOfFamilies,
          "LHWRF"               : subActivityDetails[i].LHWRF,
          "NABARD"              : subActivityDetails[i].NABARD,
          "bankLoan"            : subActivityDetails[i].bankLoan,
          "govtscheme"          : subActivityDetails[i].govtscheme,
          "directCC"            : subActivityDetails[i].directCC,
          "indirectCC"          : subActivityDetails[i].indirectCC,
          "other"               : subActivityDetails[i].other,
          "remark"              : subActivityDetails[i].remark,
        };
                
        // let fields = {};
        // fields["year"]              = "";
        // fields["month"]             = "";
        // fields["sectorName"]        = "";
        // fields["activityName"]      = "";
        // fields["physicalUnit"]      = "";
        // fields["unitCost"]          = "";
        // fields["totalBudget"]       = "";
        // fields["noOfBeneficiaries"] = "";
        // fields["noOfFamilies"]      = "";
        // fields["LHWRF"]             = "";
        // fields["NABARD"]            = "";
        // fields["bankLoan"]          = "";
        // fields["govtscheme"]        = "";
        // fields["directCC"]          = "";
        // fields["indirectCC"]        = "";
        // fields["other"]             = "";
        // fields["remark"]            = "";
      
        console.log('planValues',planValues)
        axios.patch(this.state.apiCall+'/update', planValues)
          .then((response)=>{
            console.log('response',response)
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
          })
          .catch(function(error){
            console.log("error"+error);
        }); 
        this.setState({
          "year"                : this.refs.year.value,
          "month"               : this.refs.month.value,
          "center"              :"",
          "sector_id"           :"",
          "sectorName"          :"",
          "activityName"        :"",
          "physicalUnit"        :"",
          "unitCost"            :"",
          "totalBudget"         :"",
          "noOfBeneficiaries"   :"",
          "noOfFamilies"        :"",
          "LHWRF"               :"",
          "NABARD"              :"",
          "bankLoan"            :"",
          "govtscheme"          :"",
          "directCC"            :"",
          "indirectCC"          :"",
          "other"               :"",
          "remark"              :"",
          // "fields"              :fields,
          "editId"              :"",
          "subActivityDetails"  :[],
          "availableSubActivity":[],
          "subActivityDetails[i][name]":"",
          "months"              :["Annual Plan","All Months", "April","May","June","July","August","September","October","November","December","January","February","March"],
          "years"               :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
          "shown"               : true,
          "apiCall"             : '/api/annualPlans'
        },()=>{
          this.props.history.push('/plan-details');
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
    // this.props.history.push('/plan-details')
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
     /* if (!fields["year"]) {
        formIsValid = false;
        errors["year"] = "This field is required.";
      }      */
      /*if (!fields["month"]) {
        formIsValid = false;
        errors["month"] = "This field is required.";
      } 
      if (!fields["year"]) {
        formIsValid = false;
        errors["year"] = "This field is required.";
      }       
       */     
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
  selectMonth(event){
    event.preventDefault();
    var tableObjects = this.state.tableObjects;
    tableObjects["apiLink"] = this.refs.month.value === 'Annual Plan' ? '/api/annualPlans/' : '/api/monthlyPlans/';
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      "years"               : this.refs.month.value === 'Annual Plan' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "month"               : this.refs.month.value,        
      "apiCall"             : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
      "sectorName"          : "",
      "activityName"        : "",
      "availableSubActivity": "",
      tableObjects,
      fields
    },()=>{
      console.log('month =====================================', this.state.month, this.state.year)
      this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    });

    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
  getData(center_ID, month, year, startRange, limitRange ){
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
        console.log("error"+error);
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
        if(this.state.editId && this.state.month === 'Annual Plan'){
          this.setState({
            "months"              :["Annual Plan"],
            "years"               : this.refs.month.value === 'Annual Plan' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }else if(this.state.editId && this.state.month !== 'Annual Plan'){
          this.setState({
            "months"              :["All Months", "April","May","June","July","August","September","October","November","December","January","February","March"],
            "years"               :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
            "apiCall"             : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
          })
        }
        this.getAvailableActivity(this.state.editSectorId);
        this.getAvailableSubActivity(this.state.editSectorId);
        this.edit(this.state.editId);
      })    
    }    
     this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    if(nextProps){
      this.getLength();
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    if(this.state.editId){     
      this.edit(this.state.editId);       
    }
    this.setState({
      "year"  : this.state.years[0],
      apiCall : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
    },()=>{
      console.log('year', this.state.year)
       this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    })
    this.getLength();
    this.calTotal();
   

    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    });
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
      console.log("error"+error);
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
      console.log("error"+error);
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
    axios({
      method: 'get',
      url: this.state.apiCall+'/list',
    }).then((response)=> {
      if(response.data.length > 0){
        var submittedSubActivity = response.data.map((a, i)=>{
          return _.pick(a, "subactivity_ID", "month")
        })
        var abc = _.pluck(_.compact(submittedSubActivity.map((m, i)=> { 
          if(m.month === this.refs.month.value){
            return m;
          } 
        })), "subactivity_ID");

        var x = this.state.availableSubActivity.map((a, i)=>{
          if(!abc.includes(a._id)){
            return a;
          }
        });

        this.setState({
          availableSubActivity : _.compact(_.flatten(x))
        },()=>{
       /*   swal({
              title : "abc",
              text  : "SubActivity is submitted already or not available"
          });*/
        });
      }
    }).catch(function (error) {
      console.log("error"+error);
    }); 
  }
  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
        var availableSubActivity = _.flatten(response.data.map((a, i)=>{
            return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] 
          });
        }))
        this.setState({
          availableSubActivity : availableSubActivity
        })
        this.excludeSubmittedSubActivity(availableSubActivity);
       
      
    }).catch(function (error) {
      console.log("error"+error);
    }); 
  }
  edit(id){
    axios({
      method: 'get',
      url: this.state.apiCall+'/'+id,
      }).then((response)=> {
      var editData = response.data[0];
      this.getAvailableActivity(editData.sector_ID);
      this.setState({
        "availableSubActivity"    : [{
          _id                     : editData.subactivity_ID,
          subActivityName         : editData.subactivityName,
          unit                    : editData.unit,
        }],
      },()=>{
        this.setState({
          "shown"                   : false,
          "year"                    : editData.year,
          "month"                   : editData.month,
          "center"                  : editData.center,
          "sectorName"              : editData.sectorName+'|'+editData.sector_ID,
          "activityName"            : editData.activityName+'|'+editData.activity_ID,
          "subactivity_ID"          : editData.subactivity_ID,
          "subActivityDetails"      : [{
            "subactivity_ID"      : editData.subactivity_ID,
            "subactivityName"     : editData.subactivityName,           
            "physicalUnit"        : editData.physicalUnit,
            "unitCost"            : editData.unitCost,
            "totalBudget"         : editData.totalBudget,
            "noOfBeneficiaries"   : editData.noOfBeneficiaries,
            "noOfFamilies"        : editData.noOfFamilies,
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
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    }).catch(function (error) {
      console.log("error"+error);
    });
  }
  toglehidden(){   
    this.setState({
     shown: !this.state.shown
    },()=>{
      // console.log('shown', this.state.shown, !this.state.shown);
    });
  }
  getSearchText(searchText, startRange, limitRange){
    this.setState({
      tableData : []
    })
  }
  calTotal(event){   
    // console.log('onKeyUp');
      // var physicalUnit = event.target.name;

      this.setState({
        // physicalUnit : event.target.value
      }, ()=>{
        // console.log(this.state)
      })

  }

  isNumberKey(evt){
    // console.log('onKeyDown');
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  render() {
    /*var shown = {
      display: this.state.shown ? "block" : "none"
    };
    */
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
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">                    
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 boxHeight">
                      <label className="formLable">Plan</label>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                        <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.selectMonth.bind(this)} >
                          
                         {this.state.months.map((data,index) =>
                          <option key={index}  className="" >{data}</option>
                          )}
                          
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.month}</div>
                    </div>
                    <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 zeroIndex boxHeight">
                       <label className="formLable">Year</label>
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
                    <ul className="nav nav-pills col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3 col-sm-12 col-xs-12 mt">
                      <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualplan">Manual</a></li>
                      <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkplan">Bulk Upload</a></li>
                    </ul> 
                  </div> 
                  <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                      <div id="manualplan"  className="tab-pane fade in active ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mt"> 
                           <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-right">
                              <button type="button" className="btn addBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.toglehidden.bind(this)}>Add Plan</button>
                           </div> 
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                        <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt outerForm"  style={hidden}>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 NOpadding ">                
                              <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                                <label className="formLable">Sector</label><span className="asterix">*</span>
                                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sectorName" >
                                  <select className="custom-select form-control inputBox" ref="sectorName" name="sectorName" value={this.state.sectorName} onChange={this.selectSector.bind(this)}>
                                    <option  className="hidden" >-- Select --</option>
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
                              <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                                <label className="formLable">Activity</label><span className="asterix">*</span>
                                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activityName" >
                                  <select className="custom-select form-control inputBox"ref="activityName" name="activityName" value={this.state.activityName} onChange={this.selectActivity.bind(this)} >
                                    <option  className="hidden" >-- Select --</option>
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
                          <br/>  
                          <div>
                            {this.state.availableSubActivity ? <hr className=""/> :""}
                          </div>                     
                            {
                              this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                              this.state.availableSubActivity.map((data, index)=>{
                                if(data.subActivityName ){
                                  return(
                                    <div className="subActDiv"  key={data._id}>
                                      <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3 contentDiv  ">
                                        <label className="head" value={data.subActivityName+'|'+data._id} id={"subActivityName-"+data._id}>{data.subActivityName} </label><br/>
                                        <label className="formLable visibilityHidden">Unit :<span id={"unit-"+data._id}>{data.unit}</span></label>
                                      </div>
                                      <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 NOpadding">
                                        <div className="row">
                                          <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields  ">
                                            <label className="formLable head">Sub-Activity Details</label>
                                          </div>
                                        </div>
                                       
                                        <div className="row ">
                                          <div className="col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                            <label className="formLable">Physical Units</label>
                                            <div className="input-group inputBox-main " id={"physicalUnit-"+data._id} >
                                              <input type="text" className="form-control inputBox nameParts" name={"physicalUnit-"+data._id} placeholder="" ref={"physicalUnit-"+data._id} value={this.state["physicalUnit-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                              <span className="input-group-addon inputAddonforphysicalunit">{data.unit}</span>
                                            </div>{/*{console.log("state",this.state)}*/}
                                          </div>
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                            <label className="formLable">Unit Cost</label>
                                            <div className=" input-group inputBox-main" id={"unitCost-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"unitCost-"+data._id} placeholder="" ref={"unitCost"+"-"+data._id} value={this.state["unitCost-"+data._id]} onKeyDown={this.isNumberKey.bind(this)} onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>  
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                            <label className="formLable">Total Cost</label>
                                            <div className="input-group inputBox-main" id={"totalBudget-"+data._id} >                                         
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input className="form-control inputBox formLable " name={"totalBudget-"+data._id} placeholder="" disabled ref={"totalBudget-"+data._id} value={this.state["totalBudget-"+data._id]} />
                                            </div>
                                          </div>  
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields subData">
                                            <label className="formLable">No.of Beneficiaries</label>
                                            <div className=" input-group inputBox-main" id={"noOfBeneficiaries-"+data._id} >
                                              <input type="text" className="form-control inputBox nameParts" name={"noOfBeneficiaries-"+data._id} placeholder="" ref={"noOfBeneficiaries-"+data._id} value={this.state["noOfBeneficiaries-"+data._id]} onKeyDown={this.isNumberKey.bind(this)} onChange={this.subActivityDetails.bind(this)}/>                              
                                            </div>
                                          </div> 
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 Activityfields ">
                                            <label className="formLable">No.of Families</label>
                                            <div className=" input-group inputBox-main" id={"noOfFamilies-"+data._id} >
                                              <input type="text" className="form-control inputBox nameParts" name={"noOfFamilies-"+data._id} placeholder="" ref={"noOfFamilies-"+data._id} value={this.state["noOfFamilies-"+data._id]} onKeyDown={this.isNumberKey.bind(this)} onChange={this.subActivityDetails.bind(this)}/>                              
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-3 col-md-1 col-sm-6 col-xs-12 Activityfields   ">
                                            <label className="formLable head">Sources of Fund</label>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">LHWRF</label>
                                            <div className=" input-group inputBox-main" id={"LHWRF-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"LHWRF-"+data._id} placeholder="" ref={"LHWRF-"+data._id} value={this.state["LHWRF-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}   onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">NABARD</label>
                                            <div className=" input-group inputBox-main" id={"NABARD-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"NABARD-"+data._id} placeholder="" ref={"NABARD-"+data._id} value={this.state["NABARD-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">Bank Loan</label>
                                            <div className=" input-group inputBox-main" id={"bankLoan-"+data._id}>
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"bankLoan-"+data._id} placeholder="" ref={"bankLoan-"+data._id} value={this.state["bankLoan-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">Govt. Schemes</label>
                                            <div className=" input-group inputBox-main" id={"govtscheme-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"govtscheme-"+data._id} placeholder="" ref={"govtscheme-"+data._id} value={this.state["govtscheme-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">Direct Com. Cont.</label>
                                            <div className=" input-group inputBox-main" id={"directCC-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"directCC-"+data._id} placeholder="" ref={"directCC-"+data._id} value={this.state["directCC-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">Indirect Com. Cont.</label>
                                            <div className=" input-group inputBox-main" id={"indirectCC-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"indirectCC-"+data._id} placeholder="" ref={"indirectCC-"+data._id} value={this.state["indirectCC-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                        </div>
                                        <div className=" row">
                                          <div className=" col-lg-2 col-md-1 col-sm-6 col-xs-12 planfields">
                                            <label className="formLable">Other</label>
                                            <div className=" input-group inputBox-main" id={"other-"+data._id} >
                                              <span className="input-group-addon inputAddon"><i className="fa fa-inr"></i></span>
                                              <input type="text" className="form-control inputBox nameParts" name={"other-"+data._id} placeholder="" ref={"other-"+data._id} value={this.state["other-"+data._id]} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.subActivityDetails.bind(this)}/>
                                            </div>
                                          </div>
                                          <div className=" col-lg-10 col-md-10 col-sm-12 col-xs-12 planfields">
                                            <label className="formLable">Remark</label>
                                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id={"remark-"+data._id} >
                                              <input type="text" className="form-control inputBox nameParts" name={"remark-"+data._id} placeholder="Remark" ref={"remark-"+data._id} value={this.state["remark-"+data._id]}   onChange={this.subActivityDetails.bind(this)}/>
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
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                           <br/>{
                            this.state.editId ? 
                            <button className=" col-lg-2 btn submit pull-right" onClick={this.Update.bind(this)}> Update </button>
                            :
                            <button className=" col-lg-2 btn submit pull-right" onClick={this.SubmitAnnualPlan.bind(this)}> Submit </button>
                          }
                          </div>
                        
                        </form>
                        </div>
                      </div>
                      <div id="bulkplan" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                          <BulkUpload url={this.state.month == "Annual Plan" ? "/api/annualPlans/bulk_upload_annual_plan" : "/api/monthlyPlans/bulk_upload_manual_plan"}  data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID,"month":this.state.month,"year":this.state.year}} uploadedData={this.uploadedData} fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Plan+Submission.xlsx"/>
                        </div>
                      </div>
                  </div>
                 
                  <div className="AnnualHeadCont">
                    <div className="annualHead">
                    {
                      this.state.month==="--Quarter 1--"
                        ?
                          <h5>Quarterly Plan for April, May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                        :
                          <h5 defaultValue="Annual Plan">{this.state.month === "Annual Plan" ? "Annual Plan": "Monthly Plan" || this.state.month !== "Annual Plan" ? "Monthly Plan": "Annual Plan"}{ this.state.year !=="-- Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
                          // <h5>{this.state.month !== "Annually" ? "Monthly Plan "+ this.state.month : "Annual Plan " }{ this.state.year !=="-- Select Year --" ? "  "+(this.state.year ? "- "+this.state.year :"" ) : null}</h5> 
                      }
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  formLable " >
                    <div className="row">  
                     <IAssureTable 
                        tableName = "Plan Details"
                        id = "PlanDetails"
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