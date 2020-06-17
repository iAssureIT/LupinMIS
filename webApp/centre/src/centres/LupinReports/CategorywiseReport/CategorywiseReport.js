import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./CategorywiseReport.css"
import "../../Reports/Reports.css";
class CategorywiseReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "district"          : "all",
        "selectedDistrict"  : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "incomeCategory"    : "all",
        "specialCategory"   : "all",
        "landCategory"      : "all",
        "twoLevelHeader"    : {
            apply           : false,
            firstHeaderData : [
                {
                    heading : 'Family Details',
                    mergedColoums :4,
                    hide : false
                }, 
                {
                    heading : 'No of Families',
                    mergedColoums : 2,
                    hide : false
                },        
            ]
        },
        "tableHeading"      : {
          "projectCategoryType"  : 'Project Category',
          "projectName"          : 'Project Name',
          "district"             : 'District',
          "incomeCategory"    : 'Income Category',
          "landCategory"      : 'Land Holding Category',
          "specialCategory"   : 'Special Category',
          "Reach"             : 'Families Reached',
          "FamilyUpgradation" : 'Families Upgraded',        
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
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
      tableData : this.state.tableData,
    },()=>{
      this.getAvailableCenterData(this.state.center_ID);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.currentFromDate();
    this.getAvailableProjects();
    this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }
 
  componentWillReceiveProps(nextProps){
    this.getAvailableProjects();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
    });
  }

  getAvailableCenterData(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        function removeDuplicates(data, param){
            return data.filter(function(item, pos, array){
                return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
            })
        }
        var availableDistInCenter= removeDuplicates(response.data[0].villagesCovered, "district");
        this.setState({
          availableDistInCenter  : availableDistInCenter,
          // availableDistInCenter  : response.data[0].districtsCovered,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
          // districtsCovered : response.data[0].districtsCovered
        },()=>{
        var stateCode =this.state.address.split('|')[0];
         this.setState({
          stateCode  : stateCode,

        },()=>{
        // this.getDistrict(this.state.stateCode, this.state.districtsCovered);
        });
        })
    }).catch(function (error) {
      console.log("error"+error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      } 
    });
  } 
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    this.setState({
      district: district
    },()=>{
      if(this.state.district==="all"){
        var selectedDistrict = this.state.district;
      }else{
        var selectedDistrict = this.state.district.split('|')[0];
      }
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
      })
    });
  }

  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  selectprojectCategoryType(event){
    event.preventDefault();
    console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
        projectCategoryType : projectCategoryType,
    },()=>{
        if(this.state.projectCategoryType === "LHWRF Grant"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
        }
    },()=>{
    })
  }
  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      this.setState({
        availableProjects : response.data
      })
    }).catch(function (error) {
      console.log('error', error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }   
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
          projectName : projectName,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
    })
  }
  
  addCommas(x) {
    if(x===0){
      return parseInt(x)
    }else{
      x=x.toString();
      if(x.includes('%')){
          return x;
      }else{
        if(x.includes('.')){
          var pointN = x.split('.')[1];
          var lastN = x.split('.')[0];
          var lastThree = lastN.substring(lastN.length-3);
          var otherNumbers = lastN.substring(0,lastN.length-3);
          if(otherNumbers !== '')
              lastThree = ',' + lastThree;
          var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
          return(res);
        }else{
          var lastThree = x.substring(x.length-3);
          var otherNumbers = x.substring(0,x.length-3);
          if(otherNumbers !== '')
              lastThree = ',' + lastThree;
          var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
          return(res);
        }
      }
    }
  }
  getData(startDate, endDate, center_ID, selectedDistrict, projectCategoryType, projectName, beneficiaryType, incomeCategory, landCategory, specialCategory){        
    console.log('/api/report/category/'+startDate+'/'+endDate+'/all/'+selectedDistrict+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+incomeCategory+'/'+landCategory+'/'+specialCategory);
    if(center_ID){
      if( startDate && endDate && center_ID && selectedDistrict && projectCategoryType  && beneficiaryType){
        $(".fullpageloader").show();
        axios.get('/api/reports/category_reports/'+startDate+'/'+endDate+'/'+center_ID+'/'+selectedDistrict+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+incomeCategory+'/'+landCategory+'/'+specialCategory)
        .then((response)=>{
          $(".fullpageloader").hide();

          console.log("resp",response);
            var tableData = response.data.map((a, i)=>{
            return {
              _id                    : a._id,
              projectCategoryType    : a.projectCategoryType ? a.projectCategoryType : "-",
              projectName            : a.projectName === "all"|| 0? "-" :a.projectName,                  
              district               : a.district === "all" ? "-" :a.district,                
              incomeCategory         : a.incomeCategory,
              landCategory           : a.landCategory,
              specialCategory        : a.specialCategory,
              Reach                  : (a.Reach),
              FamilyUpgradation      : (a.FamilyUpgradation),
              // Reach                  : this.addCommas(a.Reach),
              // FamilyUpgradation      : this.addCommas(a.FamilyUpgradation),
            }
          })
          this.setState({
            tableData : tableData
          },()=>{
          })
        })
        .catch(function(error){  
          console.log("error = ",error.message);
          if(error.message === "Request failed with status code 500"){
              $(".fullpageloader").hide();
          }
        });
      }
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
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
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
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.incomeCategory, this.state.landCategory, this.state.specialCategory);
    });
  }

  currentFromDate(){
    if(this.state.startDate){
          var today = this.state.startDate;
      }else {
          var today = (new Date());
        var nextDate = today.getDate() - 30;
        today.setDate(nextDate);
        // var newDate = today.toLocaleString();
        var today =  moment(today).format('YYYY-MM-DD');
      }
      this.setState({
         startDate :today
      },()=>{
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
      },()=>{
      });
      return today;
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentComp,
    })
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
                            {/*Category wise Report*/}
                            Category Report
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
                          <label className="formLable">District</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                            <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option value="all" >All</option>
                                {
                                this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 ? 
                                this.state.availableDistInCenter.map((data, index)=>{
                                  // console.log("data",data)
                                  return(
                                    /*<option key={index} value={this.camelCase(data.split('|')[0])}>{this.camelCase(data.split('|')[0])}</option>*/
                                    <option key={index} value={(data.district+'|'+data._id)}>{this.camelCase(data.district.split('|')[0])}</option>

                                  );
                                })
                                :
                                null
                              }                               
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">Beneficiary</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="beneficiaryType" >
                              <select className="custom-select form-control inputBox" ref="beneficiaryType" name="beneficiaryType" value={this.state.beneficiaryType} onChange={this.handleChange.bind(this)}>
                                <option  className="hidden" >--Select--</option>
                                <option value="all" >All</option>
                                <option value="withUID" >With UID</option>
                                <option value="withoutUID" >Without UID</option>
                                
                              </select>
                            </div>
                        </div> 
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">From</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleFromChange.bind(this)}   onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                            </div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">To</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleToChange.bind(this)} onBlur={this.onBlurEventTo.bind(this)}  name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                            </div>
                        </div> 
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Project Category</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectCategoryType" >
                            <select className="custom-select form-control inputBox" ref="projectCategoryType" name="projectCategoryType" value={this.state.projectCategoryType} onChange={this.selectprojectCategoryType.bind(this)}>
                              <option  className="hidden" >--Select--</option>
                              <option value="all" >All</option>
                              <option value="LHWRF Grant" >LHWRF Grant</option>
                              <option value="Project Fund">Project Fund</option>
                              
                            </select>
                          </div>
                      </div>
                      {
                        this.state.projectCategoryType === "Project Fund" ?
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Project Name</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectName" >
                            <select className="custom-select form-control inputBox" ref="projectName" name="projectName" value={this.state.projectName} onChange={this.selectprojectName.bind(this)}>
                              <option  className="hidden" >--Select--</option>
                               <option value="all" >All</option>
                              {
                                this.state.availableProjects && this.state.availableProjects.length >0 ?
                                this.state.availableProjects.map((data, index)=>{
                                  return(
                                    <option key={data._id} value={data.projectName}>{data.projectName}</option>
                                  );
                                })
                                :
                                null
                              }
                            </select>
                          </div>
                        </div>
                      : 
                      ""
                      } 
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Land holding Category</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="landCategory" >
                          <select className="custom-select form-control inputBox"ref="landCategory" name="landCategory" value={this.state.landCategory} onChange={this.handleChange.bind(this)}  >
                            <option selected='true' value="" disabled="disabled" >-- Select --</option>
                            <option value="all" >All</option>
                            <option>Big Farmer</option>
                            <option>Landless</option>
                            <option>Marginal Farmer</option>
                            <option>Small Farmer</option>
                          </select>
                        </div>
                      </div>                          
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Income Category </label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="incomeCategory" >
                          <select className="custom-select form-control inputBox" ref="incomeCategory" name="incomeCategory" value={this.state.incomeCategory} onChange={this.handleChange.bind(this)}  >
                            <option selected='true' value="" disabled="disabled" >-- Select --</option>
                            <option value="all" >All</option>
                            <option>APL</option>
                            <option>BPL</option>
                          </select>
                        </div>
                      </div>                        
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                        <label className="formLable">Special Category</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="specialCategory" >
                          <select className="custom-select form-control inputBox" ref="specialCategory" name="specialCategory" value={this.state.specialCategory} onChange={this.handleChange.bind(this)}  >
                            <option selected='true' value="" disabled="disabled" >-- Select --</option>
                            <option value="all" >All</option>
                            <option>Normal</option>
                            <option>Differently Abled</option>
                            <option>Veerangana</option>
                            <option>Widow Headed</option>
                          </select>
                        </div>
                      </div>                          
                    </div>  
                    <div className="marginTop11">
                        <div className="">
                            <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable  
                                    tableName = "Categorywise Report"
                                    id = "CategorywiseReport"
                                    completeDataCount={this.state.tableDatas.length}
                                    twoLevelHeader={this.state.twoLevelHeader} 
                                    editId={this.state.editSubId} 
                                    getData={this.getData.bind(this)} 
                                    tableHeading={this.state.tableHeading} 
                                    tableData={this.state.tableData} 
                                    tableObjects={this.state.tableObjects}
                                    getSearchText={this.getSearchText.bind(this)}/>
                            </div>
                      
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
export default CategorywiseReport