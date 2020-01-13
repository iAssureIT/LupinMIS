import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./PlanDetails.css";

var add=0

class PlanDetails extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
      "center"              :"-- Select --",
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
        physicalUnit        : "Phy Unit",
        unitCost            : "Unit Cost",
        totalBudget         : "Total Cost",
        noOfBeneficiaries   : "Beneficiary",
        noOfFamilies        : "Families",
        LHWRF               : "LHWRF",
        NABARD              : "NABARD",
        bankLoan            : "Bank",
        govtscheme          : "Government",
        directCC            : "DirectCC",
        indirectCC          : "IndirectCC",
        other               : "Other",
        remark              : "Remark",
        // actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/annualPlans/',
        downloadApply       : true,
        paginationApply     : false,
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
    console.log('x',x)
    this.setState({
      [event.target.name] : event.target.value,
      totalBud : x,
      ["totalBudget-"+id] : x
    },()=>{
      console.log('totalBud=========',this.state.totalBud )
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
    var subActivityDetails = this.state.subActivityDetails;
    
    console.log("this.state.subActivityDetails",this.state.subActivityDetails);
    var idExist = subActivityDetails.filter((a)=>{return a.subactivity_ID === id});
    var name = (event.target.name).split('-')[0];
    console.log("idExist",idExist);
     var y =parseInt(x);
     console.log("y1 = ",y);
    if(idExist.length > 0){      
     console.log("y2 = ",idExist.length );
      for(var i=0; i<subActivityDetails.length; i++){
        if(subActivityDetails[i].subactivity_ID === id){
          subActivityDetails[i][name] = event.target.value;
          subActivityDetails[i].totalBudget = y
        }
      }
    }else{
     console.log("y3 = ",y);
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
      console.log("subActivityDetails",this.state.subActivityDetails);
    })
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
  selectMonth(event){
    event.preventDefault();
    var tableObjects = this.state.tableObjects;
    tableObjects["apiLink"] = event.target.value === 'Annual Plan' ? '/api/annualPlans/' : '/api/monthlyPlans/';
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      "years"               : event.target.value === 'Annual Plan' ? ["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"] : [2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "month"               : event.target.value,        
      "apiCall"             : event.target.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',

      tableObjects,
      fields
    },()=>{
      console.log('month =====================================', this.state.month, this.state.year)
      this.setState({
        "year" : this.state.years[0]
      },()=>{
        this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
      });
    });

    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
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
        console.log("x",x,"lastN",lastN,"lastThree",lastThree,"otherNumbers",otherNumbers,"res",res)
        return(res);
      }else{
        var lastThree = x.substring(x.length-3);
        var otherNumbers = x.substring(0,x.length-3);
        if(otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        console.log("lastThree",lastThree,"otherNumbers",otherNumbers,"res",res);
        return(res);
      }
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
          // console.log("response",response);
      var tableData = response.data.map((a, i)=>{
        return {
          _id                 : a._id,
          month               : a.month,
          year                : a.year,
          sectorName          : a.sectorName,
          activityName        : a.activityName,
          subactivityName     : a.subactivityName,
          unit                : a.unit,
          physicalUnit        : this.addCommas(a.physicalUnit),
          unitCost            : this.addCommas(a.unitCost),
          totalBudget         : this.addCommas(a.totalBudget),
          noOfBeneficiaries   : this.addCommas(a.noOfBeneficiaries),
          noOfFamilies        : this.addCommas(a.noOfFamilies),
          LHWRF               : this.addCommas(a.LHWRF),
          NABARD              : this.addCommas(a.NABARD),
          bankLoan            : this.addCommas(a.bankLoan),
          govtscheme          : this.addCommas(a.govtscheme),
          directCC            : this.addCommas(a.directCC),
          indirectCC          : this.addCommas(a.indirectCC),
          other               : this.addCommas(a.other),
          remark              : a.remark,
          
        }
      })

        this.setState({
          tableData : tableData
        },()=>{
          // console.log("tableData",this.state.tableData);
        });
      })
      .catch(function(error){
        console.log("error"+error);
      });
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    this.getAvailableCenters();
    this.setState({
      "year"  : this.state.years[0],
      apiCall : this.refs.month.value === 'Annual Plan' ? '/api/annualPlans' : '/api/monthlyPlans',
    },()=>{
      console.log('year', this.state.year)
       this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
    })
  }

  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
        this.setState({
          availableCenters : response.data,
          // center           : response.data[0].centerName+'|'+response.data[0]._id
        },()=>{
      // console.log('centersresponse', this.state.availableCenters);

        })
    }).catch(function (error) {
          console.log("error = ",error);
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
  render() {
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
                      <div className="">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">Center</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                              <select className="custom-select form-control inputBox" ref="center" name="center"value={this.state.center} onChange={this.selectCenter.bind(this)}>
                                <option disabled={true} >-- Select --</option>
                                {
                                  this.state.availableCenters && this.state.availableCenters.length >0 ?
                                  this.state.availableCenters.map((data, index)=>{
                                    // console.log(data)
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
                           <label className="formLable">Plan</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                              <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.selectMonth.bind(this)} >
                                <option disabled={true} >-- Select --</option>
                               {this.state.months.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 zeroIndex">
                            <label className="formLable">Year</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                              <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year }  onChange={this.handleChange.bind(this)} >
                                <option disabled={true} >-- Select --</option>
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
                    </div>
                    <div className="AnnualHeadCont">
                      <div className="annualHead">
                      {
                        this.state.month ==="--Quarter 1--"
                          ?
                            <h5>Quarterly Plan for April, May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                          :

                            <h5 defaultValue="Annual Plan">{this.state.month+" - "+this.state.year}</h5> 
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