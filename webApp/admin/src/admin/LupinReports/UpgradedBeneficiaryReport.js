import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import Loader               from "../../common/Loader.js";
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";
class UpgradedBeneficiaryReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "center"            : "all",
        "center_ID"         : "all",
        "sector_ID"         : "all",
        "selectedDistrict"  : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "upgraded"           : "all",
        "twoLevelHeader"    : {
            apply           : false,
            firstHeaderData : [
                {
                    heading : 'Beneficiary Details',
                    mergedColoums : 7,
                    hide : false
                }, 
                {
                    heading : 'Sector Details',
                    mergedColoums : 6,
                    hide : false
                },
            ]
        },
        "tableHeading"      : {
            "date"               : 'Date Of Intervention',
            "projectCategoryType": 'Project Category',
            "upgraded"           : 'Upgraded',
            "sectorName"         : 'Sector',
            "activityName"       : 'Activity',
            "subactivityName"    : 'Sub-Activity',
            "familyID"           : 'Family ID',
            "beneficiaryID"      : 'Beneficiary ID',
            "namebeneficiary"    : 'Name of Beneficiary',           
            "uid"                : 'UID',           
            "village"            : 'Village',
            "block"              : 'Block',
            "district"           : 'District',
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
    this.getAvailableCenters = this.getAvailableCenters.bind(this);
  }
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableProjects();
    this.getAvailableCenters();
    this.currentFromDate();
    this.currentToDate();
    this.setState({
      tableData : this.state.tableData,
    },()=>{
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    })
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableProjects();
    this.getAvailableCenters();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      this.setState({
        availableCenters : response.data,
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
      if(this.state.selectedCenter==="all"){
        var center = this.state.selectedCenter;
      }else{
        var center = this.state.selectedCenter.split('|')[1];
      }
      this.setState({
        center_ID :center,            
      },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
        this.getAvailableCenterData(this.state.center_ID);
      })
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
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
        var stateCode =this.state.address.split('|')[0];
         this.setState({
            stateCode  : stateCode,
          });
      })
    }).catch(function (error) {
    });
  } 
 
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    this.setState({
      district: district
    },()=>{},()=>{
      if(this.state.district==="all"){
        var selectedDistrict = this.state.district;
      }else{
        var selectedDistrict = this.state.district.split('|')[0];
      }
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
        this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
  }
  getBlock(stateCode, selectedDistrict){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
    }).then((response)=> {
        this.setState({
          listofBlocks : response.data7
        },()=>{
        })
    }).catch(function (error) {  
        console.log("error = ",error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
      this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
    });
  }
  getVillages(stateCode, selectedDistrict, block){
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+block,
    }).then((response)=> {
        this.setState({
          listofVillages : response.data
        },()=>{
        })
    }).catch(function (error) {  
       console.log("error = ",error);
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
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
    var projectCategoryType = event.target.value;
    this.setState({
      projectCategoryType : projectCategoryType,
    },()=>{
        if(this.state.projectCategoryType === "LHWRF Grant"){
          this.setState({
            projectName : "all",
          })          
        }else if (this.state.projectCategoryType=== "all"){
          this.setState({
            projectName : "all",
          })    
        }
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
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
      
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
          projectName : projectName,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    })
  }
  
  getData(startDate, endDate, center_ID, selectedDistrict, projectCategoryType, projectName, beneficiaryType, upgraded){        
    if(center_ID){
      if(startDate && endDate && selectedDistrict && projectCategoryType  && beneficiaryType && upgraded){
        if(center_ID==="all"){
          if(selectedDistrict==="all"){
          var url = '/api/report/upgraded/'+startDate+'/'+endDate+'/all/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+upgraded
          }else{
          var url = '/api/report/upgraded/'+startDate+'/'+endDate+'/all/'+selectedDistrict+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+upgraded
          }
        }else{
          var url = '/api/report/upgraded/'+startDate+'/'+endDate+'/'+center_ID+'/'+selectedDistrict+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+upgraded
        }
      $(".fullpageloader").show();
      axios.get(url)
        .then((response)=>{
          $(".fullpageloader").hide();
          var data = response.data
          var tableData = [];
          if(data.length>0){
            data.map((a, i)=>{

            axios.get('/api/beneficiaries/'+a.beneficiaryID)
            .then((response)=>{
              $(".fullpageloader").hide();
              tableData.push({
                _id             : a._id,            
                date            : a.date,
                projectCategoryType: a.projectCategoryType,
                upgraded        : a.upgraded,
                sectorName      : a.sectorName,
                activityName    : a.activityName,
                subactivityName : a.subactivityName,
                familyID        : response.data[0].familyID,
                beneficiaryID   : response.data[0].beneficiaryID,
                namebeneficiary : response.data[0].surnameOfBeneficiary+' '+response.data[0].firstNameOfBeneficiary+' '+response.data[0].middleNameOfBeneficiary,
                uid             : response.data[0].uidNumber ? response.data[0].uidNumber : "NA",
                village         : a.village,
                block           : a.block,
                district        : a.district,             
              })
              if(data.length===(i+1)){
                this.setState({
                  tableData : tableData
                })
              }
            })
            .catch(function(error){ 
              console.log("error = ",error);
            });
          })
        }else{
          this.setState({
            tableData : []
          })
        }
        })
        .catch(function(error){  
           console.log("error = ",error);
      
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
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
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
                            {/*Upgraded Beneficiary Report*/}
                            Beneficiary Report
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 validBox">
                      <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <label className="formLable">Center</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                          <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                            <option className="hidden" >-- Select --</option>
                            <option value="all" >All</option>
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
                        {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                      </div>
                      <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable">District</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                          <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                            <option value="all" >All</option>
                              {
                                this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 && this.state.center_ID!=="all" ? 
                                this.state.availableDistInCenter.map((data, index)=>{
                                  return(
                                    <option key={index} value={(data.district+'|'+data._id)}>{this.camelCase(data.district.split('|')[0])}</option>

                                  );
                                })
                                :
                                null
                              }                                        
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
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
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
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
                        
                    </div> 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        {
                            this.state.projectCategoryType === "Project Fund" ?

                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
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
                          <label className="formLable">Upgraded</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="upgraded" >
                            <select className="custom-select form-control inputBox" ref="upgraded" name="upgraded" value={this.state.upgraded} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >--Select--</option>
                              <option value="all" >All</option>
                              <option value="upgraded">Upgraded</option>
                              <option value="not_upgraded" >Not Upgraded</option>
                            </select>
                          </div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">From</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleFromChange}  onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                            </div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">To</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)}  name="endDate" ref="endDate"  id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                            </div>
                        </div>
                    </div>  
                    <div className="marginTop11">
                        <div className="">
                            <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable 
                                    tableName = "Upgraded Beneficiary Report"
                                    id = "UpgradedBeneficiaryReport"
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
export default UpgradedBeneficiaryReport